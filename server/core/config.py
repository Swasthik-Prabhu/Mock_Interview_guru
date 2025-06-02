from pydantic import BaseSettings

class Settings(BaseSettings):
    MONGO_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    hf_token: str
    # mongo_db_name: str 

    class Config:
        env_file = ".env"

settings = Settings()