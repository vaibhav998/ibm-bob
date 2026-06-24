"""
Application configuration settings
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import validator
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    DATABASE_URL: str = "postgresql://sales_user:sales_password@localhost:5432/sales_coaching_db"
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "IBM Sales Coaching API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend API for Sales Intelligence Dashboard with IBM Data & AI products"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    # Reports
    REPORTS_DIR: str = "./reports"
    REPORTS_EXPIRY_DAYS: int = 7
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()

# Made with Bob
