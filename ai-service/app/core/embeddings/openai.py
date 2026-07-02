import logging
from typing import List
from app.core.embeddings.base import EmbeddingProvider
from app.core.cache import embedding_cache
from app.config import settings

logger = logging.getLogger(__name__)

class OpenAIEmbeddingProvider(EmbeddingProvider):
    def __init__(self, model_name: str = "text-embedding-3-small"):
        self._model_name = model_name
        self._dimension = 1536
        self._client = None
        if settings.OPENAI_API_KEY:
            try:
                from openai import AsyncOpenAI
                self._client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI SDK: {e}")

    @property
    def provider_name(self) -> str:
        return "openai"

    @property
    def dimension(self) -> int:
        return self._dimension

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not self._client:
            raise RuntimeError("OpenAI API key is missing or invalid.")
        
        results = [None] * len(texts)
        to_compute = []
        to_compute_indices = []

        for idx, text in enumerate(texts):
            cached = embedding_cache.get_cached_embedding(text, self.provider_name)
            if cached:
                results[idx] = cached
            else:
                to_compute.append(text)
                to_compute_indices.append(idx)

        if to_compute:
            response = await self._client.embeddings.create(
                input=to_compute,
                model=self._model_name
            )
            for idx, item in zip(to_compute_indices, response.data):
                emb = item.embedding
                results[idx] = emb
                embedding_cache.set_cached_embedding(to_compute[len(to_compute_indices) - 1], self.provider_name, emb)

        return results

    async def embed_query(self, text: str) -> List[float]:
        res = await self.embed_documents([text])
        return res[0]

    async def check_health(self) -> bool:
        if not self._client:
            return False
        try:
            await self.embed_query("health check")
            return True
        except Exception:
            return False
