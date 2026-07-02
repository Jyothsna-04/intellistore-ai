import unittest
from unittest.mock import patch
import sys
import os

# Add parent dir to path so app can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.registry import AIProviderRegistry
from app.config import settings

class TestAIProviderRegistry(unittest.TestCase):
    def setUp(self):
        self.registry = AIProviderRegistry()

    @patch("app.core.embeddings.local.LocalSentenceTransformerProvider._load_model")
    def test_registry_initialization_defaults(self, mock_load):
        # Default settings specify local embedding and ollama llm
        self.registry.initialize()
        
        self.assertIsNotNone(self.registry.active_embedding_provider)
        self.assertEqual(self.registry.active_embedding_provider.provider_name, "local-huggingface")
        
        self.assertIsNotNone(self.registry.active_llm_provider)
        self.assertEqual(self.registry.active_llm_provider.provider_name, "ollama")

    @patch("app.core.embeddings.local.LocalSentenceTransformerProvider._load_model")
    def test_registry_fallback_on_unknown_provider(self, mock_load):
        with patch.object(settings, "AI_EMBEDDING_PROVIDER", "unknown_provider"):
            with patch.object(settings, "AI_LLM_PROVIDER", "unknown_llm"):
                self.registry.initialize()
                self.assertEqual(self.registry.active_embedding_provider.provider_name, "local-huggingface")
                self.assertEqual(self.registry.active_llm_provider.provider_name, "ollama")

if __name__ == "__main__":
    unittest.main()
