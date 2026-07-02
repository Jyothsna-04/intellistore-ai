import logging
from typing import List
from app.core.embeddings.base import EmbeddingProvider
from app.core.cache import embedding_cache

logger = logging.getLogger(__name__)

class LocalSentenceTransformerProvider(EmbeddingProvider):
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self._model_name = model_name
        self._model = None
        self._dimension = 384 # all-MiniLM-L6-v2 dimension
        logger.info(f"Initialized LocalSentenceTransformerProvider configured for {self._model_name}")

    def _load_model(self):
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading local embedding model: {self._model_name}...")
                self._model = SentenceTransformer(self._model_name)
                self._dimension = self._model.get_sentence_embedding_dimension()
                logger.info(f"Model {self._model_name} loaded successfully (dim: {self._dimension}).")
            except Exception as e:
                logger.error(f"Failed to load sentence-transformers model: {e}")
                raise e

    @property
    def provider_name(self) -> str:
        return "local-huggingface"

    @property
    def dimension(self) -> int:
        return self._dimension

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        results = []
        to_compute = []
        to_compute_indices = []

        for idx, text in enumerate(texts):
            cached = embedding_cache.get_cached_embedding(text, self.provider_name)
            if cached:
                results.append(cached)
            else:
                results.append(None)
                to_compute.append(text)
                to_compute_indices.append(idx)

        if to_compute:
            self._load_model()
            embeddings = self._model.encode(to_compute, convert_to_numpy=True).tolist()
            for idx, emb, text in zip(to_compute_indices, embeddings, to_compute):
                results[idx] = emb
                embedding_cache.set_cached_embedding(text, self.provider_name, emb)

        return results

    async def embed_query(self, text: str) -> List[float]:
        res = await self.embed_documents([text])
        return res[0]

    async def check_health(self) -> bool:
        try:
            self._load_model()
            return self._model is not None
        except Exception:
            return False
