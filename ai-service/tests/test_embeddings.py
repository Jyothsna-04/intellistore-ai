import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.embeddings.local import LocalSentenceTransformerProvider
from app.core.embeddings.gemini import GeminiEmbeddingProvider
from app.core.embeddings.openai import OpenAIEmbeddingProvider

class TestEmbeddingProviders(unittest.TestCase):
    def test_local_provider_dimension_and_name(self):
        provider = LocalSentenceTransformerProvider("all-MiniLM-L6-v2")
        self.assertEqual(provider.provider_name, "local-huggingface")
        self.assertEqual(provider.dimension, 384)

    def test_gemini_provider_dimension_and_name(self):
        provider = GeminiEmbeddingProvider()
        self.assertEqual(provider.provider_name, "gemini")
        self.assertEqual(provider.dimension, 768)

    def test_openai_provider_dimension_and_name(self):
        provider = OpenAIEmbeddingProvider()
        self.assertEqual(provider.provider_name, "openai")
        self.assertEqual(provider.dimension, 1536)

    @patch("app.core.cache.embedding_cache.get_cached_embedding", return_value=[0.1] * 384)
    def test_local_provider_uses_cache(self, mock_get_cache):
        provider = LocalSentenceTransformerProvider()
        res = asyncio.run(provider.embed_documents(["test text"]))
        self.assertEqual(len(res), 1)
        self.assertEqual(res[0], [0.1] * 384)
        mock_get_cache.assert_called_once()

if __name__ == "__main__":
    unittest.main()
