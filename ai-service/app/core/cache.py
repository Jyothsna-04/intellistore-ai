import redis
import hashlib
import json
import logging
from typing import Optional, List
from app.config import settings

logger = logging.getLogger(__name__)

class EmbeddingCache:
    def __init__(self):
        try:
            if getattr(settings, "REDIS_URL", None):
                self.redis_client = redis.Redis.from_url(
                    settings.REDIS_URL,
                    decode_responses=True,
                    socket_connect_timeout=2
                )
            else:
                self.redis_client = redis.Redis(
                    host=settings.REDIS_HOST,
                    port=settings.REDIS_PORT,
                    password=settings.REDIS_PASSWORD,
                    decode_responses=True,
                    socket_connect_timeout=2
                )
            self.enabled = True
        except Exception as e:
            logger.warning(f"Failed to initialize Redis embedding cache: {e}. Caching disabled.")
            self.enabled = False

    def _get_key(self, text: str, provider: str) -> str:
        text_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
        return f"embed:{provider}:{text_hash}"

    def get_cached_embedding(self, text: str, provider: str) -> Optional[List[float]]:
        if not self.enabled:
            return None
        try:
            key = self._get_key(text, provider)
            cached_data = self.redis_client.get(key)
            if cached_data:
                return json.loads(cached_data)
        except Exception as e:
            logger.debug(f"Redis cache read error: {e}")
        return None

    def set_cached_embedding(self, text: str, provider: str, embedding: List[float]):
        if not self.enabled:
            return
        try:
            key = self._get_key(text, provider)
            self.redis_client.setex(
                key,
                settings.EMBEDDING_CACHE_TTL_SECONDS,
                json.dumps(embedding)
            )
        except Exception as e:
            logger.debug(f"Redis cache write error: {e}")

embedding_cache = EmbeddingCache()
