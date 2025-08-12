# tracker
# id gen by mongo
# user id = fetch from db
# total glasses 
# streak
# consumed - glasses tacked till now for that day
# 
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from typing import Optional

class DailyProgressModel(BaseModel):
    user_id: str  # ObjectId stored as string
    total_glasses: int = Field(..., gt=0)
    consumed_today: int = Field(..., ge=0)
    date: datetime

    class Config:
        schema_extra = {
            "example": {
                "user_id": "68557d54466fd3b16666fea1",
                "total_glasses": 20,
                "consumed_today": 3,
                "date": "2025-06-21T15:30:00"
            }
        }
