from fastapi import FastAPI
from database import init_db
from routes import auth
from routes import user
from fastapi.security import OAuth2PasswordRequestForm
from core.security import create_access_token
from fastapi import HTTPException, Depends
from models.user import User
from routes import interview
from models.interview_qna import ResumeInterviewQA
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
from beanie import init_beanie #type:ignore




app = FastAPI()

@app.on_event("startup")
async def app_init():
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client["mockinterview"]  # Select your DB name

    # Initialize Beanie with your document models
    await init_beanie(
        database=db,
        document_models=[ResumeInterviewQA, User]  # Add all your Beanie models here
    )
    print("[DEBUG] Beanie initialized.")

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(interview.router)

@app.get("/")
def root():
    return {"message": "InterviewGuru API is running."}

@app.post("/token")
async def login_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form_data.username)
    if not user or not await user.verify_password(form_data.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}
