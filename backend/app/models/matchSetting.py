from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional



class MatchSettings(BaseModel):
    timeLimit: int = Field(..., gt=0, description="Time limit in seconds/minutes")
    genres: List[str] = Field(..., min_length=1, description="List of selected genres")
    promptType: str = Field(..., description="Type of prompt (e.g., 'Open Challenge')")
    promptText: Optional[str] = Field(None, description="Prompt text for Open Challenge")
    wordCap: Optional[int] = Field(None, gt=0, description="Word limit for stories")
    objectInclusion: Optional[str] = Field(None, description="Object to include in story")
    reverseChallenge: bool = Field(..., description="Enable reverse challenge mode")
    isBlindPrompt: bool = Field(..., description="Hide prompt from participants")
    plotTwistText: Optional[str] = Field(None, description="Custom plot twist text")

    @field_validator('promptText')
    @classmethod
    def validate_prompt_text(cls, v, info):
        # Check if promptType is 'Open Challenge'
        if info.data.get('promptType') == 'Open Challenge':
            if not v or not isinstance(v, str) or v.strip() == '':
                raise ValueError('promptText required for Open Challenge')
        return v

    @field_validator('genres')
    @classmethod
    def validate_genres(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one genre is required')
        return v




# Alternative: Separate response model for cleaner output



