from fastapi import APIRouter, Depends
from core.security import get_current_user
from models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
