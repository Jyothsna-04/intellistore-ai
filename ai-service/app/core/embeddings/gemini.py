import logging
from typing import List
from app.core.embeddings.base import EmbeddingProvider
from app.core.cache import embedding_cache
from app.config import settings

logger = logging.getLogger(__name__)

class GeminiEmbeddingProvider(EmbeddingProvider):
    def __init__(self, model_name: str = "models/text-embedding-004"):
        self._model_name = model_name
        self._dimension = 768
        self._configured = False
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self._configured = True
            except Exception as e:
                logger.error(f"Failed to configure Gemini SDK: {e}")

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def dimension(self) -> int:
        return self._dimension

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not self._configured:
            raise RuntimeError("Gemini API key is missing or invalid.")
        
        import google.generativeai as genai
        results = []
        for text in texts:
            cached = embedding_cache.get_cached_embedding(text, self.provider_name)
            if cached:
                results.append(cached)
            else:
                response = genai.embed_content(
                    model=self._model_name,
                    content=text,
                    task_type="retrieval_document"
                )
                emb = response["embedding"]
                results.append(emb)
                embedding_cache.set_cached_embedding(text, self.provider_name, emb)
        return results

    async def embed_query(self, text: str) -> List[float]:
        if not self._configured:
            raise RuntimeError("Gemini API key is missing or invalid.")
        import google.generativeai as genai
        cached = embedding_cache.get_cached_embedding(text, self.provider_name)
        if cached:
            return cached
        response = genai.embed_content(
            model=self._model_name,
            content=text,
            task_type="retrieval_query"
        )
        emb = response["embedding"]
        embedding_cache.set_cached_embedding(text, self.provider_name, emb)
        return emb

    async def check_health(self) -> bool:
        if not self._configured:
            return False
        try:
            await self.embed_query("health check")
            return True
        except Exception:
            return False
