import logging
from typing import Optional, AsyncGenerator
from app.core.llms.base import LLMProvider
from app.config import settings

logger = logging.getLogger(__name__)

class AnthropicLLMProvider(LLMProvider):
    def __init__(self, model_name: str = "claude-3-5-sonnet-20240620"):
        self._model_name = model_name
        self._client = None
        if settings.ANTHROPIC_API_KEY:
            try:
                from anthropic import AsyncAnthropic
                self._client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize Anthropic LLM SDK: {e}")

    @property
    def provider_name(self) -> str:
        return "anthropic"

    @property
    def model_name(self) -> str:
        return self._model_name

    async def generate(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        if not self._client:
            raise RuntimeError("Anthropic API key is missing or invalid.")
        kwargs = {
            "model": self._model_name,
            "max_tokens": 1024,
            "temperature": temperature,
            "messages": [{"role": "user", "content": prompt}]
        }
        if system_prompt:
            kwargs["system"] = system_prompt

        response = await self._client.messages.create(**kwargs)
        return response.content[0].text

    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> AsyncGenerator[str, None]:
        if not self._client:
            raise RuntimeError("Anthropic API key is missing or invalid.")
        kwargs = {
            "model": self._model_name,
            "max_tokens": 1024,
            "temperature": temperature,
            "messages": [{"role": "user", "content": prompt}]
        }
        if system_prompt:
            kwargs["system"] = system_prompt

        async with self._client.messages.stream(**kwargs) as stream:
            async for text in stream.text_stream:
                if text:
                    yield text

    async def check_health(self) -> bool:
        if not self._client:
            return False
        try:
            await self.generate("Hi", temperature=0.1)
            return True
        except Exception:
            return False
