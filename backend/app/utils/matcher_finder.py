from fastapi import HTTPException, status
from bson import ObjectId
from app.core.database import match_setting

async def get_valid_match(match_id: str):
    # Validate ID format
    if not ObjectId.is_valid(match_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid match ID format"
        )
    
    # Fetch from DB
    match = await match_setting.find_one({"_id": ObjectId(match_id)})
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    return match
