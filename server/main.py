from fastapi import FastAPI
from database import init_db
from routes import auth
from routes import user
from fastapi.security import OAuth2PasswordRequestForm
from core.security import create_access_token
from fastapi import HTTPException, Depends
from models.user import User

app = FastAPI()

@app.on_event("startup")
async def app_init():
    await init_db()

app.include_router(auth.router)
app.include_router(user.router)

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
