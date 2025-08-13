from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from app.models.progress import DailyProgressModel
from app.core.database import progress_collection, user_collection
from app.utils.dependency import get_current_user
from fastapi import Response
router = APIRouter()

@router.post("/progress/log", status_code=status.HTTP_201_CREATED)
async def log_daily_progress(
    response: Response,
    user: dict = Depends(get_current_user)  # use 'user', not 'current_user'
):
    user_id = user["_id"]  # Use directly
    print("USERRRRR = ", user_id)

    now = datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = now.replace(hour=23, minute=59, second=59, microsecond=999999)

    # 🧠 Check if today's log already exists
    existing = await progress_collection.find_one({
        "user_id": ObjectId(user_id),
        "date": {"$gte": today_start, "$lte": today_end}
    })

    # 🧠 Fetch latest progress (for total_glasses reference)
    last_entry = await progress_collection.find_one(
        {"user_id": ObjectId(user_id)},
        sort=[("date", -1)]
    )
    latest_total = last_entry["total_glasses"] if last_entry else 0

    if existing:
        # 🧠 Update today's log
        result = await progress_collection.update_one(
            {"_id": existing["_id"]},
            {
                "$inc": {
                    "consumed_today": 1,
                    "total_glasses": 1
                },
                "$set": {
                    "date": now  # Update to latest timestamp
                }
            }
        )
        return {"message": "Progress updated", "type": "update"}
    else:
        # 🧠 Create new entry for today
        new_doc = {
            "user_id": ObjectId(user_id),
            "total_glasses": latest_total + 1,
            "consumed_today": 1,
            "date": now
        }
        result = await progress_collection.insert_one(new_doc)
        return {"message": "New progress logged", "type": "insert", "id": str(result.inserted_id)}

        # if diff_minutes < interval:
        #     raise HTTPException(
        #         status_code=429,
        #         detail=f"Wait {round(interval - diff_minutes)} more minutes to log next glass."
        #     )