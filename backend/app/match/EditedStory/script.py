from datetime import datetime
from app.models.story import process_raw_treatment
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.story import Story
from app.core.database import match_setting
from pydantic import BaseModel, Field
from bson import ObjectId
from app.utils.matcher_finder import get_valid_match
from app.utils.dependency import get_current_user
from app.core.database import story_collection
router = APIRouter()

class SingleResponse(BaseModel):
    success: bool
    data: dict


@router.post("/story/submit", response_model=SingleResponse, status_code=status.HTTP_201_CREATED)
async def submit_story_typed(story_structure: Story, user=Depends(get_current_user)):
    try:
        # Get user and match info
        user_id = str(user["_id"])
        print("USER ID FROM STORY",user_id)
        match_id = story_structure.matchId
        match = await get_valid_match(match_id)
        processed_content = process_raw_treatment(story_structure.content.dict(), user_id=str(user["_id"]))
        # print("PPPP = = =",processed_content)
    

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

class MultiResponse(BaseModel):
    success: bool
    data: list[dict]

@router.get("/stories/match/{match_id}", response_model=MultiResponse)
async def get_match_stories(match_id: str, user=Depends(get_current_user)):
    try:
        print(f"[GET_STORIES] Fetching stories for match: {match_id}")
        
        # Validate match exists
        match = await get_valid_match(match_id)
        
        # Fetch all stories for this match
        stories_cursor = story_collection.find({"match_id": match_id})
        stories = await stories_cursor.to_list(length=None)
        
        print(f"[GET_STORIES] Found {len(stories)} stories")
        
        # Enrich stories with username
        enriched_stories = []
        for story in stories:
            story["_id"] = str(story["_id"])
            
            # Fetch username from user_collection
            from app.core.database import user_collection
            user_doc = await user_collection.find_one({"_id": ObjectId(story["user_id"])})
            story["username"] = user_doc.get("username", "Anonymous") if user_doc else "Anonymous"
            
            # Calculate average stars if feedback exists
            if story.get("feedback") and len(story["feedback"]) > 0:
                total_stars = sum(f.get("stars", 0) for f in story["feedback"])
                story["average_stars"] = total_stars / len(story["feedback"])
            else:
                story["average_stars"] = 0.0
            
            enriched_stories.append(story)
        
        print(f"[GET_STORIES] Returning {len(enriched_stories)} enriched stories")
        
        return {
            "success": True,
            "data": enriched_stories
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[GET_STORIES] Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch stories: {str(e)}"
        )

class MatchResponse(BaseModel):
    success: bool
    data: dict

class RatingInput(BaseModel):
    stars: int = Field(..., ge=1, le=10)
    comment: str

@router.post("/story/{story_id}/rate", response_model=MatchResponse)
async def rate_story(story_id: str, rating_data: RatingInput, user=Depends(get_current_user)):

    try:
        print(f"[RATE_STORY] Rating story: {story_id}")
        
        # Validate ObjectId
        if not ObjectId.is_valid(story_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid story ID format"
            )
        
        # Fetch story
        story = await story_collection.find_one({"_id": ObjectId(story_id)})
        
        if not story:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Story not found"
            )
        
        user_id = str(user["_id"])
        
        # Check if user is trying to rate their own story
        if story["user_id"] == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot rate your own story"
            )
        
        # Check if user already rated this story
        existing_feedback = story.get("feedback", [])
        if any(f.get("fromUserId") == user_id for f in existing_feedback):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already rated this story"
            )
        
        # Validate rating
        stars = rating_data.stars
        comment = rating_data.comment.strip() if rating_data.comment else ""

        if not (1 <= stars <= 10):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rating must be between 1 and 10"
            )

        if len(comment) < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Comment must be at least 10 characters"
            )
        
        # Create feedback object
        new_feedback = {
            "fromUserId": user_id,
            "stars": stars,
            "comment": comment,
            "submittedAt": datetime.utcnow().isoformat()
        }
        
        # Add feedback to story
        existing_feedback.append(new_feedback)
        
        # Calculate new average
        total_stars = sum(f["stars"] for f in existing_feedback)
        average_stars = total_stars / len(existing_feedback)
        
        # Update story in database
        result = await story_collection.update_one(
            {"_id": ObjectId(story_id)},
            {
                "$set": {
                    "feedback": existing_feedback,
                    "average_stars": average_stars
                }
            }
        )
        
        print(f"[RATE_STORY] Updated {result.modified_count} document(s)")
        print(f"[RATE_STORY] New average: {average_stars:.2f} from {len(existing_feedback)} ratings")
        
        return {
            "success": True,
            "data": {
                "message": "Rating submitted successfully",
                "average_stars": average_stars,
                "total_ratings": len(existing_feedback)
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[RATE_STORY] Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit rating: {str(e)}"
        )
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