from fastapi import APIRouter, HTTPException, status, Depends
from app.models.matchSetting import MatchSettings
from app.core.database import match_setting
# from app.dependencies.auth import get_current_user
from app.utils.dependency import get_current_user

from pydantic import BaseModel
from bson import ObjectId
from typing import Dict, Any

router = APIRouter()


class MatchResponse(BaseModel):
    success: bool
    data: Dict[str, Any]


@router.get("/match/{match_id}", response_model=MatchResponse)
async def get_match(match_id: str,user = Depends(get_current_user)):
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(match_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid match ID format"
            )
        
        # Fetch match from database
        match = await match_setting.find_one({"_id": ObjectId(match_id)})
        
        user_id = str(user["_id"])
        if user_id not in match["participants"]["userIds"]:
            raise HTTPException(status_code=403, detail="Not a participant")
        
        if not match:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match not found"
            )
        
        
        # Convert ObjectId to string for JSON serialization
        match["_id"] = str(match["_id"])
        
        return {
            "success": True,
            "data": match
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch match: {str(e)}"
        )


@router.post("/match/{match_id}/ready")
async def toggle_ready(match_id: str, user = Depends(get_current_user)):
    try:
        if not ObjectId.is_valid(match_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid match ID format"
            )
        
        match = await match_setting.find_one({"_id": ObjectId(match_id)})
        
        if not match:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match not found"
            )
        
        user_id = str(user["_id"])
        
        # Initialize ready_users if not exists
        if "ready_users" not in match:
            match["ready_users"] = []
        
        # Toggle ready status
        if user_id in match["ready_users"]:
            match["ready_users"].remove(user_id)
            is_ready = False
        else:
            match["ready_users"].append(user_id)
            is_ready = True
        
        # Update in database
        await match_setting.update_one(
            {"_id": ObjectId(match_id)},
            {"$set": {"ready_users": match["ready_users"]}}
        )
        
        return {
            "success": True,
            "data": {
                "isReady": is_ready,
                "readyCount": len(match["ready_users"])
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update ready status: {str(e)}"
        )


@router.post("/match/{match_id}/start")
async def start_match(match_id: str, user = Depends(get_current_user)):
    try:
        if not ObjectId.is_valid(match_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid match ID format"
            )
        
        match = await match_setting.find_one({"_id": ObjectId(match_id)})
        
        if not match:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match not found"
            )
        
        user_id = str(user["_id"])
        
        # Check if user is host
        if match["hostedBy"]["userId"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the host can start the match"
            )
        
        # Check if minimum participants are ready
        ready_count = len(match.get("ready_users", []))
        min_count = match["participants"]["minCount"]
        
        if ready_count < min_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Need at least {min_count} ready participants. Currently: {ready_count}"
            )
        
        # Update match status to started
        await match_setting.update_one(
            {"_id": ObjectId(match_id)},
            {"$set": {"status": "active", "startedAt": "timestamp_here"}}
        )
        
        return {
            "success": True,
            "data": {
                "message": "Match started successfully",
                "matchId": match_id
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start match: {str(e)}"
        )