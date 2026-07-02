from abc import ABC, abstractmethod
from typing import Optional, AsyncGenerator

class LLMProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return unique name of the LLM provider."""
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Return specific model name being used."""
        pass

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        """Generate response text from prompt."""
        pass

    @abstractmethod
    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> AsyncGenerator[str, None]:
        """Stream response text tokens."""
        pass

    @abstractmethod
    async def check_health(self) -> bool:
        """Check if LLM provider is operational."""
        pass
