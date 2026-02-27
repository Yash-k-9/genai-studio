from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
import requests
import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv()
router = APIRouter(prefix="/images", tags=["images"])

HF_TOKEN = os.getenv("HF_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"

@router.get("/generate")
def generate_image(prompt: str):
    if not HF_TOKEN:
        raise HTTPException(status_code=500, detail="HF_TOKEN not configured in .env")
        
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {"inputs": prompt}
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=20)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Image API Error: {response.text}")
            
        return Response(
            content=response.content, 
            media_type="image/jpeg",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*",
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
