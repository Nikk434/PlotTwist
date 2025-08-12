# no_of_glass
# time_interval
# start_time
# end_time
from pydantic import BaseModel, Field
from datetime import datetime

class DailyGoal(BaseModel):
    glasses_per_day: int = Field(..., gt=0)
    interval_minutes: int = Field(..., gt=0)
    start_time: datetime
    end_time: datetime


    class Config:
        schema_extra = {
            "example": {
                "glasses_per_day": 8,
                "interval_minutes": 60,
                "start_time": "09:00",
                "end_time": "21:00"
            }
        }