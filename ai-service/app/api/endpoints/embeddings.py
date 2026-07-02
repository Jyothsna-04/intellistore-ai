from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.core.registry import registry

router = APIRouter()

class EmbeddingRequest(BaseModel):
    texts: List[str]

class EmbeddingResponse(BaseModel):
    provider: str
    dimension: int
    embeddings: List[List[float]]

@router.post("/embeddings", response_model=EmbeddingResponse)
async def generate_embeddings(req: EmbeddingRequest):
    provider = registry.active_embedding_provider
    if not provider:
        raise HTTPException(status_code=500, detail="No active embedding provider configured.")
    
    try:
        embeddings = await provider.embed_documents(req.texts)
        return EmbeddingResponse(
            provider=provider.provider_name,
            dimension=provider.dimension,
            embeddings=embeddings
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")
