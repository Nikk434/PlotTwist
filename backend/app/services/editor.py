from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, ValidationError, model_validator
from typing import Optional, Dict, List, Any
from bson import ObjectId
from datetime import datetime
import re
from app.utils.dependency import get_current_user

from html import unescape

# Initialize router
router = APIRouter(prefix="/editor", tags=["story"])

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler):
        from pydantic_core import core_schema
        return core_schema.no_info_wrap_validator_function(
            cls.validate,
            core_schema.str_schema()
        )

    @classmethod
    def validate(cls, v: Any) -> str:
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


def extract_text_from_html(html_content: str) -> str:
    """Extract clean text from HTML, removing tags and extra whitespace"""
    if not html_content:
        return ""
    
    # Remove HTML tags
    clean = re.sub(r'<[^>]+>', ' ', html_content)
    # Unescape HTML entities
    clean = unescape(clean)
    # Remove extra whitespace
    clean = re.sub(r'\s+', ' ', clean).strip()
    
    return clean


def count_words(text: str) -> int:
    """Count words in text"""
    return len([word for word in text.split() if word.strip()])


class TreatmentMetadata(BaseModel):
    total_words: int = Field(alias="totalWords")
    completed_at: str = Field(alias="completedAt")
    progress: float


class RawTreatmentData(BaseModel):
    """Model for the raw data coming from your editor"""
    sections: Dict[str, str]
    word_counts: Dict[str, int] = Field(alias="wordCounts")
    completed_sections: List[str] = Field(alias="completedSections")
    metadata: TreatmentMetadata

    class Config:
        populate_by_name = True


class ProcessedTreatmentData(BaseModel):
    """Model for processed and validated treatment data"""
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    
    # Clean text content (HTML stripped)
    title_page: str
    logline: str
    synopsis: str
    characters: str
    story: str
    tone_style: Optional[str] = None
    
    # Original HTML content for editing
    title_page_html: str
    logline_html: str
    synopsis_html: str
    characters_html: str
    story_html: str
    tone_style_html: Optional[str] = None
    
    # Metadata
    total_words: int
    completed_at: str
    progress: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    @model_validator(mode='after')
    def validate_sections(self):
        # Validate logline
        if count_words(self.logline) < 10:
            raise ValueError(f"Logline must have at least 10 words (got {count_words(self.logline)})")
        
        # Validate synopsis
        if count_words(self.synopsis) < 30:
            raise ValueError(f"Synopsis must have at least 30 words (got {count_words(self.synopsis)})")
        
        # Validate characters
        if count_words(self.characters) < 25:
            raise ValueError(f"Characters must have at least 25 words (got {count_words(self.characters)})")
        
        # Validate story
        if count_words(self.story) < 200:
            raise ValueError(f"Story must have at least 200 words (got {count_words(self.story)})")
        
        # Validate title page
        if count_words(self.title_page) < 5:
            raise ValueError(f"Title page must have at least 5 words (got {count_words(self.title_page)})")
        
        return self

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True


class CreateTreatmentRequest(BaseModel):
    user_id: str
    sections: Dict[str, str]
    word_counts: Dict[str, int] = Field(alias="wordCounts")
    completed_sections: List[str] = Field(alias="completedSections")
    metadata: TreatmentMetadata

    class Config:
        populate_by_name = True


class UpdateTreatmentRequest(BaseModel):
    sections: Optional[Dict[str, str]] = None
    word_counts: Optional[Dict[str, int]] = Field(alias="wordCounts", default=None)
    completed_sections: Optional[List[str]] = Field(alias="completedSections", default=None)
    metadata: Optional[TreatmentMetadata] = None

    class Config:
        populate_by_name = True


class TreatmentResponse(BaseModel):
    success: bool
    message: str
    treatment_id: Optional[str] = None
    data: Optional[ProcessedTreatmentData] = None


def process_raw_treatment(raw_data: dict, user_id: str) -> ProcessedTreatmentData:
    """Convert raw editor data to processed treatment data"""
    
    # Add user_id to raw data
    raw_data["user_id"] = user_id
    
    # Validate raw data first
    validated_raw = RawTreatmentData(**raw_data)
    
    sections = validated_raw.sections
    
    # Extract clean text from HTML
    processed_data = {
        "user_id": user_id,
        "title_page": extract_text_from_html(sections.get('title-page', '')),
        "logline": extract_text_from_html(sections.get('logline', '')),
        "synopsis": extract_text_from_html(sections.get('synopsis', '')),
        "characters": extract_text_from_html(sections.get('characters', '')),
        "story": extract_text_from_html(sections.get('story', '')),
        "tone_style": extract_text_from_html(sections.get('tone-style', '')) or None,
        
        # Keep original HTML
        "title_page_html": sections.get('title-page', ''),
        "logline_html": sections.get('logline', ''),
        "synopsis_html": sections.get('synopsis', ''),
        "characters_html": sections.get('characters', ''),
        "story_html": sections.get('story', ''),
        "tone_style_html": sections.get('tone-style') or None,
        
        # Metadata
        "total_words": validated_raw.metadata.total_words,
        "completed_at": validated_raw.metadata.completed_at,
        "progress": validated_raw.metadata.progress,
    }
    
    return ProcessedTreatmentData(**processed_data)


# Mock database functions (replace with your actual DB operations)
async def save_treatment_to_db(treatment: ProcessedTreatmentData) -> str:
    """Save treatment to database and return the ID"""
    # This is a mock - implement your actual database save logic
    treatment_id = str(ObjectId())
    treatment.id = treatment_id
    print(f"Saving treatment {treatment_id} to database")
    return treatment_id

async def get_treatment_from_db(treatment_id: str) -> Optional[ProcessedTreatmentData]:
    """Get treatment from database by ID"""
    # This is a mock - implement your actual database get logic
    print(f"Getting treatment {treatment_id} from database")
    return None

async def update_treatment_in_db(treatment_id: str, treatment: ProcessedTreatmentData) -> bool:
    """Update treatment in database"""
    # This is a mock - implement your actual database update logic
    print(f"Updating treatment {treatment_id} in database")
    return True

async def delete_treatment_from_db(treatment_id: str) -> bool:
    """Delete treatment from database"""
    # This is a mock - implement your actual database delete logic
    print(f"Deleting treatment {treatment_id} from database")
    return True

async def get_user_treatments_from_db(user_id: str) -> List[ProcessedTreatmentData]:
    """Get all treatments for a user"""
    # This is a mock - implement your actual database get logic
    print(f"Getting treatments for user {user_id} from database")
    return []


# API Endpoints

@router.post("/edit", response_model=TreatmentResponse, status_code=status.HTTP_201_CREATED)
async def create_treatment(
    request: CreateTreatmentRequest,
    user: dict = Depends(get_current_user)
):
    try:
        # Convert to dict for processing
        raw_data = request.dict()
        
        # Process the raw data
        processed_treatment = process_raw_treatment(raw_data, request.user_id)
        
        # Save to database
        treatment_id = await save_treatment_to_db(processed_treatment)
        
        return TreatmentResponse(
            success=True,
            message="Treatment created successfully",
            treatment_id=treatment_id,
            data=processed_treatment
        )
        
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation error: {str(e)}"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Processing error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/{treatment_id}", response_model=TreatmentResponse)
async def get_treatment(treatment_id: str):
    """Get a specific treatment by ID"""
    try:
        if not ObjectId.is_valid(treatment_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid treatment ID format"
            )
        
        treatment = await get_treatment_from_db(treatment_id)
        
        if not treatment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Treatment not found"
            )
        
        return TreatmentResponse(
            success=True,
            message="Treatment retrieved successfully",
            data=treatment
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.put("/{treatment_id}", response_model=TreatmentResponse)
async def update_treatment(treatment_id: str, request: UpdateTreatmentRequest):
    """Update an existing treatment"""
    try:
        if not ObjectId.is_valid(treatment_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid treatment ID format"
            )
        
        # Get existing treatment
        existing_treatment = await get_treatment_from_db(treatment_id)
        if not existing_treatment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Treatment not found"
            )
        
        # Prepare update data
        update_data = request.dict(exclude_unset=True)
        if update_data:
            # Add user_id for processing
            update_data["user_id"] = existing_treatment.user_id
            
            # Process the updated data
            updated_treatment = process_raw_treatment(update_data, existing_treatment.user_id)
            updated_treatment.id = treatment_id
            updated_treatment.created_at = existing_treatment.created_at
            updated_treatment.updated_at = datetime.utcnow()
            
            # Save to database
            await update_treatment_in_db(treatment_id, updated_treatment)
            
            return TreatmentResponse(
                success=True,
                message="Treatment updated successfully",
                treatment_id=treatment_id,
                data=updated_treatment
            )
        else:
            return TreatmentResponse(
                success=True,
                message="No changes to update",
                treatment_id=treatment_id,
                data=existing_treatment
            )
        
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation error: {str(e)}"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Processing error: {str(e)}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


# @router.delete("/{treatment_id}", response_model=TreatmentResponse)
# async def delete_treatment(treatment_id: str):
#     """Delete a treatment"""
#     try:
#         if not ObjectId.is_valid(treatment_id):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid treatment ID format"
#             )
        
#         # Check if treatment exists
#         existing_treatment = await get_treatment_from_db(treatment_id)
#         if not existing_treatment:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Treatment not found"
#             )
        
#         # Delete from database
#         deleted = await delete_treatment_from_db(treatment_id)
#         if not deleted:
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail="Failed to delete treatment"
#             )
        
#         return TreatmentResponse(
#             success=True,
#             message="Treatment deleted successfully",
#             treatment_id=treatment_id
#         )
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Internal server error: {str(e)}"
#         )


# @router.get("/user/{user_id}", response_model=List[ProcessedTreatmentData])
# async def get_user_treatments(user_id: str):
#     """Get all treatments for a specific user"""
#     try:
#         treatments = await get_user_treatments_from_db(user_id)
#         return treatments
        
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Internal server error: {str(e)}"
#         )


# Health check endpoint
@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}


