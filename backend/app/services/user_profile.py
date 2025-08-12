from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from core.database import user_collection, progress_collection
from utils.dependency import get_current_user

router = APIRouter()

@router.get("/profile", status_code=200)
async def user_profile(user: dict = Depends(get_current_user)):
    # Total glasses (all-time)
    total_glasses_agg = await progress_collection.aggregate([
        {"$match": {"user_id": user["_id"]}},
        {"$group": {"_id": None, "total": {"$sum": "$consumed_today"}}}
    ]).to_list(length=1)
    total_glasses = total_glasses_agg[0]["total"] if total_glasses_agg else 0

    # Glasses consumed today
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = now.replace(hour=23, minute=59, second=59, microsecond=999999)

    today_progress = await progress_collection.find_one({
        "user_id": user["_id"],
        "date": {"$gte": today_start, "$lte": today_end}
    })

    consumed_today = today_progress["consumed_today"] if today_progress else 0
    
    return {
        "message": f"Profile for user {user['name']}",
        "profile": {
            "user_id": str(user["_id"]),
            "name": user["name"],
            "consumed_today": consumed_today,
            "reminder_start": user["daily_goal"]["start_time"],
            "glasses_per_day": user["daily_goal"]["glasses_per_day"],
            "total_glasses": total_glasses
        }
    }
