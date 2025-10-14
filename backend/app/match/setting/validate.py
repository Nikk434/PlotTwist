
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

@router.post("/match/create", response_model=MatchResponse)
async def create_match_typed(settings: MatchSettings):
    print("LOG 2")
    print("SET 2 =",settings)
    
    return {
        "success": True,
        "data": {
            "settings": settings.model_dump()
        }
    }