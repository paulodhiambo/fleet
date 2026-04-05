from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Vehicle Import Tracking System"
    VERSION: str = "0.1.0"
    
    # PostgreSQL connection string required in .env
    DATABASE_URL: str
    
    # CORS Origins
    CORS_ORIGINS: List[str]
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
