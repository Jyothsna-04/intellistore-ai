import logging
from typing import Optional, AsyncGenerator
from app.core.llms.base import LLMProvider
from app.config import settings

logger = logging.getLogger(__name__)

class GeminiLLMProvider(LLMProvider):
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self._model_name = model_name
        self._configured = False
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self._configured = True
            except Exception as e:
                logger.error(f"Failed to configure Gemini LLM SDK: {e}")

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def model_name(self) -> str:
        return self._model_name

    async def generate(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        if not self._configured:
            raise RuntimeError("Gemini API key is missing or invalid.")
        import google.generativeai as genai
        model = genai.GenerativeModel(
            model_name=self._model_name,
            system_instruction=system_prompt if system_prompt else None
        )
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=temperature)
        )
        return response.text

    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> AsyncGenerator[str, None]:
        if not self._configured:
            raise RuntimeError("Gemini API key is missing or invalid.")
        import google.generativeai as genai
        model = genai.GenerativeModel(
            model_name=self._model_name,
            system_instruction=system_prompt if system_prompt else None
        )
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=temperature),
            stream=True
        )
        async for chunk in response:
            if chunk.text:
                yield chunk.text

    async def check_health(self) -> bool:
        if not self._configured:
            return False
        try:
            await self.generate("Hi", temperature=0.1)
            return True
        except Exception:
            return False
