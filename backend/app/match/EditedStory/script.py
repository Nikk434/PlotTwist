from datetime import datetime
from app.models.story import process_raw_treatment
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.story import Story
from app.core.database import match_setting
from pydantic import BaseModel
from bson import ObjectId
from app.utils.matcher_finder import get_valid_match
from app.utils.dependency import get_current_user
from app.core.database import story_collection
router = APIRouter()


class MatchResponse(BaseModel):
    success: bool
    data: dict


@router.post("/story/submit", response_model=MatchResponse, status_code=status.HTTP_201_CREATED)
async def submit_story_typed(story_structure: Story, user=Depends(get_current_user)):
    try:
        # Get user and match info
        user_id = str(user["_id"])
        print("USER ID FROM STORY",user_id)
        match_id = story_structure.matchId
        match = await get_valid_match(match_id)
        processed_content = process_raw_treatment(story_structure.content.dict(), user_id=str(user["_id"]))
        print("PPPP = = =",processed_content)
        story_data = {
            "user_id": user_id,
            "match_id": match_id,
            "content": processed_content.dict(),  # Save processed version
            "submitted_at": datetime.utcnow().isoformat(),
            "status": "submitted",
            "feedback": [],
            "average_stars": 0.0
        }

        result = await story_collection.insert_one(story_data)
        
        return {
            "success": True,
            "data": {
                "story_id": str(result.inserted_id),
                "match_id": match_id,
                "user_id": user_id,
                "message": "Story submitted successfully"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    #     story_data = story_structure.model_dump()
    #     story_data["user_id"] = user_id
    #     story_data["submitted_at"] = datetime.utcnow().isoformat()
    #     story_data["status"] = "submitted"
    #     story_data["ratings"] = []        # each rating: { "from_user": id, "stars": int, "comment": str }

    #     # Insert into DB
    #     result = await story_collection.insert_one(story_data)
    #     if not result.inserted_id:
    #         raise HTTPException(status_code=500, detail="Failed to save story")

    #     # Response payload
    #     return {
    #         "success": True,
    #         "data": {
    #             "story_id": str(result.inserted_id),
    #             "match_id": match_id,
    #             "user_id": user_id,
    #             "message": "Story submitted successfully"
    #         }
    #     }

    # except Exception as e:
    #     raise HTTPException(
    #         status_code=500,
    #         detail=f"Error submitting story: {str(e)}"
    #     )