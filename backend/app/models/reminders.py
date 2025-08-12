
from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional
from datetime import datetime

class ReminderSettings(BaseModel):
    # user_id: str = Field(..., example="68557d54466fd3b16666fea1")
    enabled: bool = True
    custom_message: Optional[str] = Field("Time to hydrate!", max_length=100)
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

    class Config:
        schema_extra = {
            "example": {
                # "user_id": "68557d54466fd3b16666fea1",
                "enabled": True,
                "custom_message": "Time to hydrate and shine! 💧",
                "start_time":"06:00 AM",
                "end_time":"11:00"
            }
        }
