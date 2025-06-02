from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
from models.user import User

async def init_db():
    client = AsyncIOMotorClient("mongodb+srv://swasthikp03:swasthik@swasthikprabhu.fabhbaq.mongodb.net/")
    db = client["mockinterview"]  # Set database name explicitly
    await init_beanie(
        database=db,
        document_models=[User],
    )
