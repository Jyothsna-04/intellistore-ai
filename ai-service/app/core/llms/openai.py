import logging
from typing import Optional, AsyncGenerator
from app.core.llms.base import LLMProvider
from app.config import settings

logger = logging.getLogger(__name__)

class OpenAILLMProvider(LLMProvider):
    def __init__(self, model_name: str = "gpt-4o-mini"):
        self._model_name = model_name
        self._client = None
        if settings.OPENAI_API_KEY:
            try:
                from openai import AsyncOpenAI
                self._client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI LLM SDK: {e}")

    @property
    def provider_name(self) -> str:
        return "openai"

    @property
    def model_name(self) -> str:
        return self._model_name

    async def generate(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        if not self._client:
            raise RuntimeError("OpenAI API key is missing or invalid.")
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await self._client.chat.completions.create(
            model=self._model_name,
            messages=messages,
            temperature=temperature
        )
        return response.choices[0].message.content

    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> AsyncGenerator[str, None]:
        if not self._client:
            raise RuntimeError("OpenAI API key is missing or invalid.")
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        stream = await self._client.chat.completions.create(
            model=self._model_name,
            messages=messages,
            temperature=temperature,
            stream=True
        )
        async for chunk in stream:
            token = chunk.choices[0].delta.content
            if token:
                yield token

    async def check_health(self) -> bool:
        if not self._client:
            return False
        try:
            await self.generate("Hi", temperature=0.1)
            return True
        except Exception:
            return False
