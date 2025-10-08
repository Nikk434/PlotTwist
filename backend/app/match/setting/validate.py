
from fastapi import APIRouter, HTTPException, status, Response
from app.models.matchSetting import MatchSettings
# from app.core.database import user_collection
# from app.utils.hash import verify_password
# from app.auth.jwt_utils import create_access_token, create_refresh_token
from pydantic import BaseModel

router = APIRouter()

class MatchResponse(BaseModel):
    success: bool
    data: dict

@router.post("/match/create")
async def create_match(settings: MatchSettings):
    try:
        # Generate match ID (use UUID in production)
        # match_id = f"match_{int(time.time() * 1000)}"
        
        # Save to database
        # await db.insert_match(match_id, settings.model_dump())
        
        return {
            "success": True,
            "data": {
                # "matchId": match_id,
                "settings": settings.model_dump()
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Server error while creating match: {str(e)}"
        )

@router.post("/match/create", response_model=MatchResponse)
async def create_match_typed(settings: MatchSettings):
    return {
        "success": True,
        "data": {
            "settings": settings.model_dump()
        }
    }