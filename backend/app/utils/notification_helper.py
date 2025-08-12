# from database.collections import subscription_collection
from core.database import subscription_collection
# from database.collections import subscription_collection
from typing import List

def get_active_subscriptions_for_user(user_id: str) -> List[dict]:
    """Get all active subscriptions for a user"""
    return list(subscription_collection.find({
        "user_id": user_id,
        "is_active": True
    }))

def get_all_active_subscriptions() -> List[dict]:
    """Get all active subscriptions (for broadcasting)"""
    return list(subscription_collection.find({"is_active": True}))

# def cleanup_inactive_subscriptions():
#     """Remove old inactive subscriptions (run as periodic task)"""
#     from datetime import timedelta
#     cutoff_date = datetime.utcnow() - timedelta(days=30)
    
#     result = subscription_collection.delete_many({
#         "is_active": False,
#         "updated_at": {"$lt": cutoff_date}
#     })
    
    # return result.deleted_count