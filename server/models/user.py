from beanie import Document
from pydantic import EmailStr, Field
from typing import Literal
from datetime import datetime
from core.security import verify_password


class User(Document):
    name: str
    email: EmailStr
    hashed_password: str
    role: Literal["student", "admin","institution"] = "student"
    institution: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

    async def verify_password(self, plain_password: str) -> bool:
        return verify_password(plain_password, self.hashed_password)
