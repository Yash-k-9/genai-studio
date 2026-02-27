from fastapi import APIRouter, Request
import uuid

router = APIRouter(prefix="/projects", tags=["projects"])

mock_projects = {}  # Format: { user_id: { project_id: data } }

def get_user_id(request: Request) -> str:
    auth = request.headers.get("Authorization")
    if auth and auth.startswith("Bearer "):
        return auth.split(" ")[1]
    return "anonymous"

@router.get("")
async def get_projects(request: Request):
    user_id = get_user_id(request)
    user_projects = mock_projects.get(user_id, {})
    return [{"id": k, "title": user_projects[k].get("title", "New Story")} for k in user_projects.keys()]

@router.get("/{project_id}")
async def get_project(project_id: str, request: Request):
    user_id = get_user_id(request)
    user_projects = mock_projects.get(user_id, {})
    if project_id in user_projects:
        res = user_projects[project_id].copy()
        res["id"] = project_id
        return res
    return {"error": "Project not found"}

@router.post("")
async def save_project(request: Request):
    user_id = get_user_id(request)
    if user_id not in mock_projects:
        mock_projects[user_id] = {}
        
    data = await request.json()
    project_id = str(uuid.uuid4())
    mock_projects[user_id][project_id] = data
    return {"id": project_id, "title": data.get("title", "New Story")}
