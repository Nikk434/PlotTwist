from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class HostedBy(BaseModel):
    userId: Optional[str] = Field(None, description="User ID of the host")
    username: Optional[str] = Field(None, description="Username of the host")

class MatchSettings(BaseModel):
    hostedBy: HostedBy = Field(..., description="Information about the user hosting the match")
    timeLimit: int = Field(..., gt=0, description="Time limit in seconds/minutes")
    genres: List[str] = Field(..., min_length=1, description="List of selected genres")
    promptType: str = Field(..., description="Type of prompt (e.g., 'Open Challenge', 'Blind Challenge')")
    promptText: Optional[str] = Field(None, description="Prompt text for Open Challenge or Blind Challenge")
    wordCap: Optional[int] = Field(None, gt=0, description="Word limit for stories")
    objectInclusion: Optional[str] = Field('', description="Object to include in story")
    reverseChallenge: bool = Field(False, description="Enable reverse challenge mode")
    isBlindPrompt: bool = Field(False, description="Hide prompt from participants")
    plotTwistText: Optional[str] = Field('', description="Custom plot twist text")

    @field_validator('promptText')
    @classmethod
    def validate_prompt_text(cls, v, info):
        prompt_type = info.data.get('promptType')
        if prompt_type == 'Open Challenge' and (not v or not v.strip()):
            raise ValueError('promptText required for Open Challenge')
        return v

    @field_validator('genres')
    @classmethod
    def validate_genres(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one genre is required')
        return v
