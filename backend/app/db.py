import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database("solar_vision_ai")

users_collection = db.users
detections_collection = db.detections

async def get_db_status():
    try:
        await client.admin.command('ping')
        return "Connected"
    except Exception as e:
        return f"Error: {str(e)}"
