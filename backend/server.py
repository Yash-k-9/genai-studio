from fastapi import FastAPI
from dotenv import load_dotenv
from pathlib import Path
from routes import register, login, logout, coffee, projects, image
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import Request
app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    try:
        body = await request.body()
        body_str = body.decode('utf-8')
    except Exception:
        body_str = "Could not decode body"
    print(f"\n\n--- 422 Validation Error ---")
    print(f"Body: {body_str}")
    print(f"Headers: {request.headers}")
    print(f"Errors: {exc.errors()}")
    print("--------------------------\n\n")
    return JSONResponse(status_code=422, content={"detail": exc.errors(), "body": body_str})

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

app.include_router(register.router)
app.include_router(projects.router)
app.include_router(login.router)
app.include_router(logout.router)
app.include_router(coffee.router)
app.include_router(image.router)