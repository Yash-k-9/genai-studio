from pydantic import BaseModel, Field
from typing import List


class SoundScene(BaseModel):
    scene: str = Field(description="Name or description of the scene")
    audio: str = Field(description="A single concise sentence describing the essential audio profile")


class ScreenplayInput(BaseModel):
    story_line: str = Field(description="The main story idea or concept")
    person_role: str = Field(description="The creator's role (e.g., YouTube creator, film student, independent filmmaker)")
    language: str = Field(default="English", description="The language the generated UI and screenplay content should be written in.")


class Character(BaseModel):
    name: str = Field(description="Character's full name")
    description: str = Field(description="Detailed physical description including dressing style, hair style, skin tone, height, weight, and facial features")
    age: int = Field(description="Character's age")
    role_in_story: str = Field(description="Character's role in the story")
    personality_traits: str = Field(description="Character's personality traits")
    motivation: str = Field(description="Character's core motivation")
    internal_conflict: str = Field(description="Character's internal struggle")
    external_conflict: str = Field(description="Character's external challenges")
    character_arc: str = Field(description="How the character evolves throughout the story")
    relationships: str = Field(description="Relationship dynamics with other characters")


class ScreenplayOutput(BaseModel):
    screenplay: str = Field(description="Full cinematic screenplay with formatted scenes and dialogues")
    characters: List[Character] = Field(description="List of characters with detailed breakdown")
    sound_design: List[SoundScene] = Field(description="Detailed scene-by-scene sound design plan")