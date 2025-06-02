from fastapi import APIRouter, HTTPException, status, Depends
from models.user import User
from schemas.auth import UserCreate, UserLogin, Token
from core.security import get_password_hash, create_access_token
from beanie import PydanticObjectId #type: ignore
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    existing_user = await User.find_one(User.email == user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_obj = User(
        name=user.name,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        role = user.role or "student",
    )
    await user_obj.insert()
    access_token = create_access_token(data={"sub": str(user_obj.id), "role": user_obj.role})
    return {"access_token": access_token}


@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    user_obj = await User.find_one(User.email == user.email)
    if not user_obj:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    is_valid = await user_obj.verify_password(user.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user_obj.id), "role": user_obj.role})
    return {"access_token": access_token}


