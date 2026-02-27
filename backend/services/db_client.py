from supabase import create_client, Client
import os
from dotenv import load_dotenv
from fastapi import HTTPException
load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
if not supabase_url or not supabase_key:
    raise HTTPException(status_code=501, detail=    "SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
try:
 supabase: Client = create_client(supabase_url, supabase_key)
except Exception as e:
   raise HTTPException(status_code=500, detail=f"Failed to connect to Supabase: {str(e)}")