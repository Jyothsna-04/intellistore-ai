import logging
import httpx
from typing import Optional, AsyncGenerator
from app.core.llms.base import LLMProvider
from app.config import settings

logger = logging.getLogger(__name__)

class OllamaLLMProvider(LLMProvider):
    def __init__(self, model_name: str = None):
        self._model_name = model_name or settings.OLLAMA_MODEL
        self._base_url = settings.OLLAMA_BASE_URL.rstrip("/")

    @property
    def provider_name(self) -> str:
        return "ollama"

    @property
    def model_name(self) -> str:
        return self._model_name

    async def generate(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        url = f"{self._base_url}/api/generate"
        payload = {
            "model": self._model_name,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": temperature}
        }
        if system_prompt:
            payload["system"] = system_prompt

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            return data.get("response", "")

    async def generate_stream(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> AsyncGenerator[str, None]:
        url = f"{self._base_url}/api/generate"
        payload = {
            "model": self._model_name,
            "prompt": prompt,
            "stream": True,
            "options": {"temperature": temperature}
        }
        if system_prompt:
            payload["system"] = system_prompt

        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", url, json=payload) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line:
                        import json
                        try:
                            data = json.loads(line)
                            token = data.get("response", "")
                            if token:
                                yield token
                        except Exception:
                            continue

    async def check_health(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self._base_url}/api/tags")
                return res.status_code == 200
        except Exception:
            return False
