from abc import ABC, abstractmethod
from typing import List

class EmbeddingProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return unique name of the provider."""
        pass

    @property
    @abstractmethod
    def dimension(self) -> int:
        """Return output embedding dimension."""
        pass

    @abstractmethod
    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of strings."""
        pass

    @abstractmethod
    async def embed_query(self, text: str) -> List[float]:
        """Generate embedding for a single search query string."""
        pass

    @abstractmethod
    async def check_health(self) -> bool:
        """Check if provider is operational."""
        pass
