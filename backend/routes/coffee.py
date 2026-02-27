from fastapi import APIRouter,HTTPException,Cookie,Response,Request
from httpcore import request
from services.db_client import supabase
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from models.user_input import ScreenplayInput, ScreenplayOutput
import os
from dotenv import load_dotenv
load_dotenv()
router=APIRouter()
api_key=os.getenv("GEMINI_API_KEY")
model=ChatGoogleGenerativeAI(model="gemini-2.5-flash",google_api_key= api_key,temperature=1.7)
structered_model=model.with_structured_output(ScreenplayOutput)
prompt=PromptTemplate(template="""You are a professional cinematic screenplay writer and story architect.

INPUTS:
Story Line:
{story_line}

Intended Audience / Creator Identity:
{person_role}

Requested Language:
{language}

TASK:

Based on the above inputs, generate a fully structured cinematic package tailored specifically to the creator’s role. CRITICAL: ALL textual content generated must be written in {language}. The JSON keys must remain in English, but the actual content values must be fully translated into {language}.

The output must include:

1) A detailed, professionally formatted screenplay:
   - Proper scene headings (INT./EXT. – LOCATION – TIME)
   - IMMEDIATELY after each scene heading, write a concise environmental description (1-2 lines) covering:
     * Key lighting, weather, or sounds
     * Emotional atmosphere
     * Must remain immersive without being overly verbose.
   - Clear action descriptions
   - Add subtle camera directions occasionally (CLOSE UP, WIDE SHOT, SLOW DOLLY IN, TRACKING SHOT, PAN, etc.)
   - Character names in ALL CAPS
   - Dialogue must be formatted properly with indentation
   - Emotional beats
   - Character-to-character conversation that feels natural and immersive
   - Match tone and pacing to the selected genre
   - Provide professional and realistic writing

2) A complete character breakdown section:
   For EACH character include:
   - Name (in ALL CAPS)
   - Description (dressing style, hair style, skin tone, height, weight, facial features)
   - Age
   - Role in story
   - Personality traits
   - Motivation
   - Internal conflict
   - External conflict
   - Character arc
   - Relationship dynamics

3) A concise sound design plan (keep it extremely brief, just what is required):
   - Scene name
   - One line detailing the most essential audio elements (ambient, foley, or score)

IMPORTANT REQUIREMENTS:
- Maintain cinematic realism.
- Dialogue must feel human and character-driven.
- Indent dialogue properly.
- Use emotionally layered conversations.
- Tailor tone and complexity based on the creator’s identity:
  - If YouTube creator → tighter pacing, audience engagement focus.
  - If film school student → educational clarity.
  - If independent filmmaker → production feasibility.
  - If professional filmmaker → deeper artistic detail.

- IMPORTANT: You must write the output content in {language}. Only write the JSON keys in English.

Return the response strictly in structured JSON format matching the required schema.""",input_variables=["story_line","person_role","language"])

chain =prompt | structered_model

@router.post("/generate")
def get_screenplay(input:ScreenplayInput):
    # user_id=request.cookies.get("user_id")
    # if not user_id:
    #     raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        result=chain.invoke({"story_line":input.story_line,"person_role":input.person_role,"language":input.language})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
