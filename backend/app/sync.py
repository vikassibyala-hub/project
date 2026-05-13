import os
import httpx
from app.db import users_collection
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

async def sync_user(clerk_user_data: dict):
    """
    Syncs a Clerk user to MongoDB.
    Follows the logic: If user exists, return it; else create new.
    """
    clerk_id = clerk_user_data.get("id")

    try:
        # Check if user already exists
        existing_user = await users_collection.find_one({"clerkUserId": clerk_id})
        
        if existing_user:
            # if already user exist return that user
            return existing_user

        # Extract info for new user
        firstName = clerk_user_data.get('first_name', '')
        lastName = clerk_user_data.get('last_name', '')
        name = f"{firstName} {lastName}".strip()
        email = clerk_user_data.get("email_addresses", [{}])[0].get("email_address")
        imageUrl = clerk_user_data.get("image_url")

        # Create new user
        new_user = {
            "clerkUserId": clerk_id,
            "name": name,
            "imageUrl": imageUrl,
            "email": email,
            "role": clerk_user_data.get("public_metadata", {}).get("role", "user"),
            "hasAccess": clerk_user_data.get("public_metadata", {}).get("hasAccess", False),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        await users_collection.insert_one(new_user)
        return new_user
    except Exception as e:
        print(f"Error in sync_user: {str(e)}")
        return None

async def get_all_users():
    users = []
    cursor = users_collection.find({})
    async for user in cursor:
        user["_id"] = str(user["_id"]) # Convert ObjectId to string
        users.append(user)
    return users

async def update_clerk_metadata(clerk_id: str, metadata: dict):
    """
    Updates Clerk publicMetadata via Clerk Backend API.
    """
    if not CLERK_SECRET_KEY:
        print("Warning: CLERK_SECRET_KEY not set. Clerk metadata not updated.")
        return False
        
    url = f"https://api.clerk.com/v1/users/{clerk_id}/metadata"
    headers = {
        "Authorization": f"Bearer {CLERK_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        resp = await client.patch(url, json={"public_metadata": metadata}, headers=headers)
        if resp.status_code == 200:
            return True
        else:
            print(f"Clerk API Error: {resp.status_code} - {resp.text}")
            return False

async def update_user_access(clerk_id: str, status: bool):
    """
    Updates user access in both MongoDB and Clerk.
    """
    # Update MongoDB
    await users_collection.update_one(
        {"clerkUserId": clerk_id},
        {"$set": {"hasAccess": status, "updatedAt": datetime.utcnow()}}
    )
    
    # Update Clerk
    await update_clerk_metadata(clerk_id, {"hasAccess": status})
    return True
