from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from bson import ObjectId
from app.core.database import match_setting  # your existing DB collection import

router = APIRouter()

from pydantic import BaseModel, Field, field_validator
from datetime import datetime

@router.get("/match/{match_id}/timer")
async def get_match_timer(match_id: str):
    match = await match_setting.find_one({"_id": ObjectId(match_id)})
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    if match.get("status") != "active":
        raise HTTPException(status_code=400, detail="Match not active")

    if not match.get("startedAt"):
        raise HTTPException(status_code=400, detail="Match startedAt missing")

    try:
        startedAt = match.get("startedAt")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid startedAt format")

    duration_minutes = match.get("timeLimit", 10)
    end_time = startedAt + timedelta(minutes=duration_minutes)

    now = datetime.utcnow()
    remaining_seconds = int((end_time - now).total_seconds())

    if remaining_seconds <= 0:
        await match_setting.update_one(
            {"_id": ObjectId(match_id)},
            {"$set": {"status": "completed"}}
        )
        return {"status": "completed", "remaining_seconds": 0}

    return {
        "status": "active",
        "remaining_seconds": remaining_seconds,
        "startedAt": startedAt.isoformat(),
        "end_time": end_time.isoformat()
    }

