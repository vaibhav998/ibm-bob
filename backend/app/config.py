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
    # SQLite by default (zero-config local dev); override via DATABASE_URL env var for Postgres
    DATABASE_URL: str = "sqlite:///./northstar.db"
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "IBM Momentum API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend API for Sales Intelligence Dashboard with IBM Data & AI products"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:8080",
        "null"  # file:// origins
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

    # -----------------------------------------------------------------------
    # Salesforce CRM Integration (optional — leave blank to disable)
    # -----------------------------------------------------------------------
    # Your Salesforce login e-mail
    SF_USERNAME: str = ""
    # Your Salesforce password
    SF_PASSWORD: str = ""
    # Security token (from Setup → My Personal Information → Reset Security Token)
    # Leave blank if your org's Trusted IP Ranges include your server IP
    SF_SECURITY_TOKEN: str = ""
    # Connected App credentials (see SALESFORCE_SETUP.md)
    SF_CONSUMER_KEY: str = ""
    SF_CONSUMER_SECRET: str = ""
    # 'test' for sandbox orgs, 'login' for production
    SF_DOMAIN: str = "login"

    # -----------------------------------------------------------------------
    # IBM YourLearning Integration (optional — leave blank to use mock data)
    # -----------------------------------------------------------------------
    # OAuth2 client credentials from YourLearning Admin → API Access
    YL_CLIENT_ID: str = ""
    YL_CLIENT_SECRET: str = ""
    # Base URL for the YourLearning REST API
    YL_BASE_URL: str = "https://yourlearning.ibm.com"
    # IBM IAM token endpoint (standard for all IBM Cloud services)
    YL_TOKEN_URL: str = "https://iam.ibm.com/identity/token"

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()

# Made with Bob
