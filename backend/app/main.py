import os
import json
from fastapi import FastAPI, File, UploadFile, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from svix.webhooks import Webhook

from app.predictor import predict_image
from app.sync import sync_user, get_all_users, update_user_access
from app.db import get_db_status
from app import detections as detection_service

app = FastAPI(title="Solar Panel Fault Detection - YOLOv8")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Placeholders for keys
WEBHOOK_SECRET = os.getenv("CLERK_WEBHOOK_SECRET", "whsec_...")

# Mount results folder
RESULT_FOLDER = os.path.abspath("runs/detect/results")
if not os.path.exists(RESULT_FOLDER):
    os.makedirs(RESULT_FOLDER, exist_ok=True)

app.mount(
    "/results",
    StaticFiles(directory=RESULT_FOLDER),
    name="results"
)


@app.get("/")
async def home():
    db_status = await get_db_status()
    return {
        "message": "Solar Panel Fault Detection Backend Running - YOLOv8",
        "database": db_status
    }

@app.post("/webhooks/clerk")
async def clerk_webhook(request: Request):
    """
    Handle user creation and updates from Clerk via Svix verification.
    """
    headers = request.headers
    payload = await request.body()
    
    # Verification logic (skipping svix for local testing if secret is whsec_...)
    if WEBHOOK_SECRET != "whsec_...":
        try:
            wh = Webhook(WEBHOOK_SECRET)
            msg = wh.verify(payload, headers)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid webhook signature")
    else:
        msg = json.loads(payload)

    event_type = msg.get("type")
    data = msg.get("data")

    if event_type in ["user.created", "user.updated"]:
        await sync_user(data)
        return {"status": "success", "event": event_type}
    
    return {"status": "ignored"}

# Admin Routes
@app.get("/admin/users")
async def list_users():
    return await get_all_users()

@app.post("/admin/sync-user")
async def sync_clerk_user(user_data: dict):
    """
    Directly sync user from frontend on login.
    """
    await sync_user(user_data)
    return {"status": "synced"}

@app.post("/admin/grant-access/{clerk_id}")
async def grant_access(clerk_id: str, access: bool):
    # In production, you would verify the requester is an admin using Clerk JWT
    success = await update_user_access(clerk_id, access)
    return {"success": success, "clerk_id": clerk_id, "hasAccess": access}

@app.post("/predict/yolov8")
def predict_yolov8(file: UploadFile = File(...)):
    return predict_image(file)


# ─────────────────────────────────────────────────
# DETECTION HISTORY ROUTES
# ─────────────────────────────────────────────────

@app.post("/history/save")
async def save_detection_history(payload: dict):
    """
    Save a detection result to MongoDB for a specific user.
    Body: { clerkUserId, fileName, fileSize, model_used, total_defects, defects, result_image_url }
    """
    clerk_user_id = payload.get("clerkUserId")
    if not clerk_user_id:
        raise HTTPException(status_code=400, detail="clerkUserId is required")
    saved = await detection_service.save_detection(clerk_user_id, payload)
    return {"status": "saved", "id": saved["_id"]}


@app.get("/history/{clerk_user_id}")
async def get_detection_history(clerk_user_id: str, limit: int = 50):
    """
    Get detection history for a user, newest first.
    """
    results = await detection_service.get_detections(clerk_user_id, limit=limit)
    return results


@app.delete("/history/{clerk_user_id}/{detection_id}")
async def delete_detection(clerk_user_id: str, detection_id: str):
    """
    Delete a single detection entry by its MongoDB _id, scoped to the user.
    """
    deleted = await detection_service.delete_detection(detection_id, clerk_user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Detection not found or not yours")
    return {"status": "deleted", "id": detection_id}


@app.delete("/history/{clerk_user_id}")
async def clear_detection_history(clerk_user_id: str):
    """
    Clear ALL detection history for a user.
    """
    count = await detection_service.clear_detections(clerk_user_id)
    return {"status": "cleared", "deleted_count": count}
