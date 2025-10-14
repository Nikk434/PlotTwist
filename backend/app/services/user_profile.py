from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from app.core.database import user_collection, progress_collection
from app.utils.dependency import get_current_user

router = APIRouter()

@router.get("/me", status_code=200)
async def user_profile(user: dict = Depends(get_current_user)):
    # print("rsfsffsdf",get_current_user)
    # print("UUUUUU",user)
    return {
        "message": f"Profile for user {user['username']}",
        "profile": {
            "user_id": str(user["_id"]),
            "username": user["username"],
            # "consumed_today": consumed_today,
            # "reminder_start": user["daily_goal"]["start_time"],
            # "glasses_per_day": user["daily_goal"]["glasses_per_day"],
            # "total_glasses": total_glasses
        }
    }
