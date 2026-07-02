from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "IntelliStore AI Service"
    VERSION: str = "1.0.0"

    # Redis Cache
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    EMBEDDING_CACHE_TTL_SECONDS: int = 604800 # 7 days

    # Qdrant Vector DB
    QDRANT_HOST: str = "qdrant"
    QDRANT_PORT: int = 6333

    # AI Provider Selection
    AI_EMBEDDING_PROVIDER: str = "local" # Options: local, gemini, openai
    AI_LLM_PROVIDER: str = "ollama"      # Options: ollama, gemini, openai, anthropic

    # API Keys
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Ollama Config
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
