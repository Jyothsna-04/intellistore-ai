import logging
from typing import Dict, Any
from app.config import settings
from app.core.embeddings.base import EmbeddingProvider
from app.core.embeddings.local import LocalSentenceTransformerProvider
from app.core.embeddings.gemini import GeminiEmbeddingProvider
from app.core.embeddings.openai import OpenAIEmbeddingProvider
from app.core.llms.base import LLMProvider
from app.core.llms.ollama import OllamaLLMProvider
from app.core.llms.gemini import GeminiLLMProvider
from app.core.llms.openai import OpenAILLMProvider
from app.core.llms.anthropic import AnthropicLLMProvider

logger = logging.getLogger(__name__)

class AIProviderRegistry:
    def __init__(self):
        self.active_embedding_provider: EmbeddingProvider = None
        self.active_llm_provider: LLMProvider = None
        self.embedding_providers: Dict[str, EmbeddingProvider] = {}
        self.llm_providers: Dict[str, LLMProvider] = {}

    def initialize(self):
        logger.info("Initializing AI Provider Registry...")
        
        # Initialize Embeddings
        self.embedding_providers["local"] = LocalSentenceTransformerProvider()
        self.embedding_providers["gemini"] = GeminiEmbeddingProvider()
        self.embedding_providers["openai"] = OpenAIEmbeddingProvider()

        # Select configured Embedding Provider
        target_embed = settings.AI_EMBEDDING_PROVIDER.lower()
        if target_embed in self.embedding_providers:
            self.active_embedding_provider = self.embedding_providers[target_embed]
            logger.info(f"Selected Embedding Provider: {target_embed}")
        else:
            logger.warning(f"Unknown embedding provider '{target_embed}', falling back to local.")
            self.active_embedding_provider = self.embedding_providers["local"]

        # Initialize LLMs
        self.llm_providers["ollama"] = OllamaLLMProvider()
        self.llm_providers["gemini"] = GeminiLLMProvider()
        self.llm_providers["openai"] = OpenAILLMProvider()
        self.llm_providers["anthropic"] = AnthropicLLMProvider()

        # Select configured LLM Provider
        target_llm = settings.AI_LLM_PROVIDER.lower()
        if target_llm in self.llm_providers:
            self.active_llm_provider = self.llm_providers[target_llm]
            logger.info(f"Selected LLM Provider: {target_llm}")
        else:
            logger.warning(f"Unknown LLM provider '{target_llm}', falling back to ollama.")
            self.active_llm_provider = self.llm_providers["ollama"]

    async def get_status(self) -> Dict[str, Any]:
        embed_status = {}
        for name, provider in self.embedding_providers.items():
            embed_status[name] = {
                "active": provider == self.active_embedding_provider,
                "dimension": provider.dimension,
                "healthy": await provider.check_health()
            }

        llm_status = {}
        for name, provider in self.llm_providers.items():
            llm_status[name] = {
                "active": provider == self.active_llm_provider,
                "model": provider.model_name,
                "healthy": await provider.check_health()
            }

        return {
            "active_embedding": self.active_embedding_provider.provider_name if self.active_embedding_provider else None,
            "active_llm": self.active_llm_provider.provider_name if self.active_llm_provider else None,
            "embeddings": embed_status,
            "llms": llm_status
        }

registry = AIProviderRegistry()
