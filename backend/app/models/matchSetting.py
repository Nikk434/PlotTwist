from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import List, Optional, Literal
from datetime import datetime


class HostedBy(BaseModel):
    userId: Optional[str] = Field(None, description="User ID of the host")
    username: Optional[str] = Field(None, description="Username of the host")


class Participants(BaseModel):
    minCount: int = Field(..., ge=2, le=10, description="Minimum number of participants")
    maxCount: int = Field(..., ge=2, le=10, description="Maximum number of participants")
    userIds: List[str] = Field(default_factory=list, description="List of participant user IDs")

    @field_validator('maxCount')
    @classmethod
    def validate_max_count(cls, v, info):
        min_count = info.data.get('minCount')
        if min_count and v < min_count:
            raise ValueError('maxCount must be greater than or equal to minCount')
        return v


class MatchSettings(BaseModel):
    model_config = ConfigDict(extra='forbid')
    hostedBy: HostedBy = Field(..., description="Information about the user hosting the match")
    participants: Participants = Field(..., description="Participant configuration")
    timeLimit: int = Field(..., gt=0, description="Time limit in seconds/minutes")
    genres: List[str] = Field(..., min_length=1, description="List of selected genres")
    promptType: str = Field(..., description="Type of prompt (e.g., 'Open Challenge', 'Blind Challenge')")
    promptText: Optional[str] = Field(None, description="Prompt text for Open Challenge or Blind Challenge")
    wordCap: Optional[int] = Field(None, gt=0, description="Word limit for stories")
    objectInclusion: Optional[str] = Field('', description="Object to include in story")
    reverseChallenge: bool = Field(False, description="Enable reverse challenge mode")
    isBlindPrompt: bool = Field(False, description="Hide prompt from participants")
    plotTwistText: Optional[str] = Field('', description="Custom plot twist text")

    status: Literal["created", "active", "finished"] = Field("created", description="Current match status")
    startedAt: Optional[datetime] = Field(None, description="Timestamp when the match starts")

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