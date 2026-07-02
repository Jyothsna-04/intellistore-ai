import logging
from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.config import settings
from app.core.registry import registry
from app.api.endpoints import embeddings, llm, status

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("ai-service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up IntelliStore AI Service...")
    registry.initialize()
    yield
    logger.info("Shutting down IntelliStore AI Service...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

app.include_router(embeddings.router, prefix="/api/v1", tags=["Embeddings"])
app.include_router(llm.router, prefix="/api/v1", tags=["LLM Chat"])
app.include_router(status.router, prefix="/api/v1", tags=["Diagnostics"])

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ai-service",
        "active_embedding_provider": registry.active_embedding_provider.provider_name if registry.active_embedding_provider else None,
        "active_llm_provider": registry.active_llm_provider.provider_name if registry.active_llm_provider else None
    }

@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} v{settings.VERSION} is operational"}
