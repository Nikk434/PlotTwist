# models/subscription.py
from pydantic import BaseModel, Field
from typing import Dict, Optional
from datetime import datetime
from bson import ObjectId

class PushSubscription(BaseModel):
    endpoint: str
    keys: Dict[str, str]

class SubscriptionModel(BaseModel):
    # id: Optional[str] = Field(None, alias="_id")
    # user_id: str
    endpoint: str
    keys: Dict[str, str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}




# utils/notification_helper.py (bonus utility functions)
