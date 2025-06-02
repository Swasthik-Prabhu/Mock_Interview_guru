from fastapi import FastAPI
from database import init_db
from routes import auth

app = FastAPI()

@app.on_event("startup")
async def app_init():
    await init_db()

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "InterviewGuru API is running."}
