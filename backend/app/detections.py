from datetime import datetime
from bson import ObjectId
from app.db import detections_collection


def _serialize(doc: dict) -> dict:
    """Convert ObjectId fields to strings so the doc is JSON-serialisable."""
    if doc is None:
        return None
    doc["_id"] = str(doc["_id"])
    return doc


async def save_detection(clerk_user_id: str, entry: dict) -> dict:
    """
    Save a single detection result for a user.
    entry should contain: fileName, fileSize, model_used, total_defects, defects, result_image_url
    """
    doc = {
        "clerkUserId": clerk_user_id,
        "fileName": entry.get("fileName"),
        "fileSize": entry.get("fileSize"),
        "model_used": entry.get("model_used"),
        "total_defects": entry.get("total_defects", 0),
        "defects": entry.get("defects", {}),
        "result_image_url": entry.get("result_image_url"),
        "timestamp": datetime.utcnow(),
    }
    result = await detections_collection.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


async def get_detections(clerk_user_id: str, limit: int = 50) -> list:
    """
    Fetch the most recent `limit` detections for a user, newest first.
    """
    cursor = (
        detections_collection
        .find({"clerkUserId": clerk_user_id})
        .sort("timestamp", -1)
        .limit(limit)
    )
    results = []
    async for doc in cursor:
        results.append(_serialize(doc))
    return results


async def delete_detection(detection_id: str, clerk_user_id: str) -> bool:
    """
    Delete a single detection by its _id, scoped to the user who owns it.
    Returns True if something was deleted.
    """
    try:
        result = await detections_collection.delete_one(
            {"_id": ObjectId(detection_id), "clerkUserId": clerk_user_id}
        )
        return result.deleted_count > 0
    except Exception:
        return False


async def clear_detections(clerk_user_id: str) -> int:
    """
    Delete ALL detections for a user.
    Returns the number of documents deleted.
    """
    result = await detections_collection.delete_many({"clerkUserId": clerk_user_id})
    return result.deleted_count
