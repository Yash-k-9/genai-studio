from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
import os
from dotenv import load_dotenv

from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_openai import ChatOpenAI  # ← future switch

load_dotenv()

app = FastAPI(title="AI Screenplay Generator")


# -------------------------
# Structured Output Schema
# -------------------------

class ScreenplayOutput(BaseModel):
    screenplay: str = Field(description="Full cinematic screenplay")
    sound_design: str = Field(description="Sound design suggestions")
    dialogues: str = Field(description="Structured dialogues")
    characters: List[str] = Field(description="List of character names")


class StoryInput(BaseModel):
    story: str


# -------------------------
# LLM Factory (Switchable)
# -------------------------

def get_llm():
    provider = os.getenv("LLM_PROVIDER", "gemini")

    if provider == "gemini":
        return ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=os.getenv("GEMINI_API_KEY"),
            temperature=1.5
        )

    # Future OpenAI switch
    # elif provider == "openai":
    #     return ChatOpenAI(
    #         model="gpt-4o-mini",
    #         api_key=os.getenv("OPENAI_API_KEY"),
    #         temperature=0.7
    #     )

    else:
        raise ValueError("Unsupported LLM provider")


# -------------------------
# Prompt
# -------------------------

prompt = ChatPromptTemplate.from_messages(
    [
        ("system",
         "You are a professional film screenplay writer for telugu language you write in telugu with english literature. "
         "Convert stories into cinematic screenplay structure."),
        ("human",
         """Convert the following story into:
         
         1. Proper screenplay format
         2. Sound design plan
         3. Structured dialogues
         4. Character list

         Story:
         {story}
         """)
    ]
)


# -------------------------
# API Endpoint
# -------------------------

@app.post("/process-story/", response_model=ScreenplayOutput)
def process_story(data: StoryInput):

    try:
        llm = get_llm()

        # 🔥 Structured output binding happens here
        structured_llm = llm.with_structured_output(ScreenplayOutput)

        chain = prompt | structured_llm

        result = chain.invoke({"story": data.story})

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))