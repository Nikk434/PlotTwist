from fastapi import APIRouter, HTTPException, status, Depends
from app.models.matchSetting import MatchSettings
from app.core.database import match_setting, user_collection
from app.utils.dependency import get_current_user
from app.utils.matcher_finder import get_valid_match
from pydantic import BaseModel
from bson import ObjectId
from typing import Dict, Any
from datetime import datetime


router = APIRouter()


class MatchResponse(BaseModel):
    success: bool
    data: Dict[str, Any]


@router.get("/match/{match_id}", response_model=MatchResponse)
async def get_match(match_id: str, user=Depends(get_current_user)):
    print(f"[GET_MATCH] Requested match ID: {match_id}")
    print(f"[GET_MATCH] Authenticated user: {user['username']}")

    match = await get_valid_match(match_id)
    print(f"[GET_MATCH] Match fetched: {match_id}")

    match["_id"] = str(match["_id"])

    print("[GET_MATCH] Returning match data to client")
    return {
        "success": True,
        "data": match
    }


@router.post("/match/{match_id}/ready")
async def toggle_ready(match_id: str, user=Depends(get_current_user)):
    print(f"[READY] Toggle ready request for match: {match_id}")
    print(f"[READY] Current user: {user['username']}")

    match = await get_valid_match(match_id)
    print(f"[READY] Match found: {match_id}")

    user_id = str(user["_id"])
    print(f"[READY] User ID: {user_id}")

    # Initialize ready_users if not exists
    if "ready_users" not in match:
        match["ready_users"] = [match['hostedBy']['userId']]  # Use list, not set
        print("[READY] Initialized ready_users with host")

        print("[READY] Initialized empty ready_users list")

    # Toggle ready status
    if user_id in match["ready_users"]:
        match["ready_users"].remove(user_id)
        is_ready = False
        print(f"[READY] User {user_id} is now UNREADY")
    else:
        match["ready_users"].append(user_id)
        is_ready = True
        print(f"[READY] User {user_id} is now READY")

    # Update in database
    result = await match_setting.update_one(
        {"_id": ObjectId(match_id)},
        {"$set": {"ready_users": match["ready_users"]}}
    )

    # print(f"[READY] Mongo update result: {result.modified_count} document(s) updated")
    print(f"[READY] Ready count: {len(match['ready_users'])}")
    print("isready = = = ",is_ready)
    return {
        "success": True,
        "data": {
            "isReady": is_ready,
            "readyCount": len(match["ready_users"])
        }
    }


@router.post("/match/{match_id}/start")
async def start_match(match_id: str, user=Depends(get_current_user)):
    print(f"[START] Start match request for ID: {match_id}")
    print(f"[START] User attempting to start match: {user['username']}")

    match = await get_valid_match(match_id)
    print(f"[START] Match fetched: {match_id}")

    user_id = str(user["_id"])

    # Check if user is host
    if match["hostedBy"]["userId"] != user_id:
        print(f"[START] Unauthorized attempt: {user_id} is not host ({match['hostedBy']['userId']})")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the host can start the match"
        )

    # Check if minimum participants are ready
    ready_count = len(match.get("ready_users", []))
    min_count = match["participants"]["minCount"]
    print(f"[START] Ready count: {ready_count}, Min required: {min_count}")

    if ready_count < min_count:
        print("[START] Not enough participants ready, aborting start")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Need at least {min_count} ready participants. Currently: {ready_count}"
        )

    # Update match status to started
    update_result = await match_setting.update_one(
        {"_id": ObjectId(match_id)},
        {"$set": {"status": "active", "startedAt": datetime.utcnow()}}
    )

    print(f"[START] Match status updated, result: {update_result.modified_count} document(s) modified")

    return {
        "success": True,
        "data": {
            "message": "Match started successfully",
            "matchId": match_id
        }
    }
