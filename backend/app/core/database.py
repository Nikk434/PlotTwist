from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URI")
DB_NAME = "PlotTwist"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

user_collection = db["users"]
progress_collection = db["progress"]
reminder_collection = db["reminders"]
subscription_collection = db["subscription"]
match_setting = db["match"]
story_collection = db["script"]
# Optional: Ensure email is unique
user_collection.create_index([("email", ASCENDING)], unique=True)