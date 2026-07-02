import unittest
from unittest.mock import patch, AsyncMock, MagicMock
import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.llms.ollama import OllamaLLMProvider
from app.core.llms.gemini import GeminiLLMProvider
from app.core.llms.openai import OpenAILLMProvider
from app.core.llms.anthropic import AnthropicLLMProvider

class TestLLMProviders(unittest.TestCase):
    def test_ollama_provider_name_and_model(self):
        provider = OllamaLLMProvider("llama3")
        self.assertEqual(provider.provider_name, "ollama")
        self.assertEqual(provider.model_name, "llama3")

    def test_gemini_provider_name_and_model(self):
        provider = GeminiLLMProvider("gemini-1.5-flash")
        self.assertEqual(provider.provider_name, "gemini")
        self.assertEqual(provider.model_name, "gemini-1.5-flash")

    def test_openai_provider_name_and_model(self):
        provider = OpenAILLMProvider("gpt-4o-mini")
        self.assertEqual(provider.provider_name, "openai")
        self.assertEqual(provider.model_name, "gpt-4o-mini")

    def test_anthropic_provider_name_and_model(self):
        provider = AnthropicLLMProvider("claude-3-5-sonnet-20240620")
        self.assertEqual(provider.provider_name, "anthropic")
        self.assertEqual(provider.model_name, "claude-3-5-sonnet-20240620")

    @patch("httpx.AsyncClient.post")
    def test_ollama_generate_success(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"response": "Hello from mock Ollama!"}
        mock_response.raise_for_status = MagicMock()
        
        # AsyncClient.post needs to return an awaitable
        async def async_return(*args, **kwargs):
            return mock_response
        mock_post.side_effect = async_return

        provider = OllamaLLMProvider("llama3")
        res = asyncio.run(provider.generate("Hi"))
        self.assertEqual(res, "Hello from mock Ollama!")

if __name__ == "__main__":
    unittest.main()
