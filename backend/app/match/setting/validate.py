from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from app.models.matchSetting import MatchSettings
from app.core.database import match_setting
from pydantic import BaseModel
from bson import ObjectId

router = APIRouter()


class MatchResponse(BaseModel):
    success: bool
    data: dict


@router.post("/match/create", response_model=MatchResponse, status_code=status.HTTP_201_CREATED)
async def create_match_typed(settings: MatchSettings):
    try:
        # Convert Pydantic model to dict
        match_data = settings.model_dump()
        match_data["status"] = "created"
        
        # Insert into MongoDB
        result = await match_setting.insert_one(match_data)
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to create match")
        
        # Include the generated ID in the response
        match_data["_id"] = str(result.inserted_id)

        return {
            "success": True,
            "data": match_data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating match: {str(e)}"
        )
