import os
from dotenv import load_dotenv
from typing import List

from pydantic_settings import BaseSettings

# Load environment variables
load_dotenv()


class Settings(BaseSettings):
    """Application settings"""
    # Server
    APP_NAME: str = "NetXplore API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = bool(os.getenv("DEBUG", "False") == "True")

    # Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:password@localhost:5432/netxplore"
    )
    DB_ECHO: bool = bool(os.getenv("DB_ECHO", "False") == "True")

    # Storage
    UPLOAD_FOLDER: str = os.getenv("UPLOAD_FOLDER", "./uploads/")


    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"


settings = Settings()