# from pydantic import BaseModel, Field, root_validator
# from typing import Optional, List
# from bson import ObjectId


# # MongoDB ObjectId compatibility
# class PyObjectId(ObjectId):
#     @classmethod
#     def __get_validators__(cls):
#         yield cls.validate
    
#     @classmethod
#     def validate(cls, v):
#         if not ObjectId.is_valid(v):
#             raise ValueError("Invalid ObjectId")
#         return ObjectId(v)
    
#     @classmethod
#     def __modify_schema__(cls, field_schema):
#         field_schema.update(type="string")


# # Helper
# def word_count(text: Optional[str]) -> int:
#     return len(text.split()) if text else 0


# # ---------- Sub-models for structured format ----------

# class TitlePage(BaseModel):
#     title: str
#     writer: str
#     contact_info: Optional[str] = None


# class Character(BaseModel):
#     name: str
#     bio: str
#     arc: Optional[str] = None


# # ---------- Main Treatment Model ----------

# class Treatment(BaseModel):
#     id: Optional[PyObjectId] = Field(alias="_id", default=None)

#     title_page: TitlePage
#     logline: str
#     synopsis: str
#     characters: List[Character]
#     story: str
#     tone_style: Optional[str] = None

#     @root_validator
#     def validate_word_counts(cls, values):
#         word_limits = {
#             "logline": 10,
#             "synopsis": 30,
#             "story": 200,
#             "tone_style": 15,  # optional
#         }

#         for field, min_words in word_limits.items():
#             text = values.get(field)
#             if not text:
#                 if field == "tone_style":
#                     continue
#                 raise ValueError(f"{field} is required")

#             wc = word_count(text)
#             if wc < min_words:
#                 raise ValueError(f"{field} must have at least {min_words} words (got {wc})")

#         return values

#     class Config:
#         allow_population_by_field_name = True
#         json_encoders = {ObjectId: str}
#         arbitrary_types_allowed = True
from pydantic import BaseModel, Field, validator, model_validator
from typing import Optional, Dict, List
from bson import ObjectId
import re
from html import unescape


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
    
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


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
        allow_population_by_field_name = True


class ProcessedTreatmentData(BaseModel):
    """Model for processed and validated treatment data"""
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    
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
    
    # @validator('logline')
    model_validator(mode='after')
    def validate_logline_length(cls, v):
        word_count = count_words(v)
        if word_count < 10:
            raise ValueError(f"Logline must have at least 10 words (got {word_count})")
        return v
    
    # @validator('synopsis')
    model_validator(mode='after')
    def validate_synopsis_length(cls, v):
        word_count = count_words(v)
        if word_count < 30:
            raise ValueError(f"Synopsis must have at least 30 words (got {word_count})")
        return v
    
    # @validator('characters')
    model_validator(mode='after')
    def validate_characters_length(cls, v):
        word_count = count_words(v)
        if word_count < 25:
            raise ValueError(f"Characters must have at least 25 words (got {word_count})")
        return v
    
    # @validator('story')
    model_validator(mode='after')
    def validate_story_length(cls, v):
        word_count = count_words(v)
        if word_count < 200:
            raise ValueError(f"Story must have at least 200 words (got {word_count})")
        return v
    
    # @validator('title_page')
    model_validator(mode='after')
    def validate_title_page_length(cls, v):
        word_count = count_words(v)
        if word_count < 5:
            raise ValueError(f"Title page must have at least 5 words (got {word_count})")
        return v

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True


def process_raw_treatment(raw_data: dict) -> ProcessedTreatmentData:
    """Convert raw editor data to processed treatment data"""
    
    # Validate raw data first
    validated_raw = RawTreatmentData(**raw_data)
    
    sections = validated_raw.sections
    
    # Extract clean text from HTML
    processed_data = {
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


# Usage example:
def validate_treatment_data(raw_data: dict) -> ProcessedTreatmentData:
    """Main function to validate and process treatment data"""
    try:
        processed = process_raw_treatment(raw_data)
        return processed
    except Exception as e:
        raise ValueError(f"Treatment validation failed: {str(e)}")


# Example usage with your data:
if __name__ == "__main__":
    # Your sample data
    sample_data = {
        "sections": {
            'title-page': '<p style="margin: 8px 0px; line-height: 1.5;">h tr ertg ergt gtr geg e</p>',
            'logline': '<p style="margin: 8px 0px; line-height: 1.5;">ertg erge e e  we w w w wr wr wr </p>',
            # ... rest of your data
        },
        "wordCounts": {
            'title-page': 7,
            'logline': 11,
            # ... etc
        },
        "completedSections": ['title-page', 'logline'],
        "metadata": {
            "totalWords": 686,
            "completedAt": "2025-08-19T06:13:32.471Z",
            "progress": 100
        }
    }
    
    try:
        validated_treatment = validate_treatment_data(sample_data)
        print("✅ Validation successful!")
        print(f"Title: {validated_treatment.title_page}")
        print(f"Logline: {validated_treatment.logline}")
    except ValueError as e:
        print(f"❌ Validation failed: {e}")