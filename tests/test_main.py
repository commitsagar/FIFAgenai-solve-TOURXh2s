import unittest
import asyncio
from app.main import app, read_root, get_config, update_config, chat, ChatRequest, ConfigUpdateRequest, chat_cache

class TestSAOCC(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up async event loop for testing coroutines."""
        try:
            cls.loop = asyncio.get_event_loop()
        except RuntimeError:
            cls.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(cls.loop)

    def test_read_root(self):
        """Verify that root endpoint responds with active status."""
        response = read_root()
        self.assertEqual(response["status"], "online")
        self.assertIn("service", response)

    def test_get_config(self):
        """Verify configuration retriever GET route returns config modes."""
        response = get_config()
        self.assertIn("api_mode", response)
        self.assertIn("has_key", response)

    def test_update_config(self):
        """Verify config updater POST successfully validates and registers updates."""
        req = ConfigUpdateRequest(api_mode="mock", api_key="")
        response = update_config(req)
        self.assertEqual(response["status"], "success")

    def test_chat_mock_navigation(self):
        """Verify routing of navigation query in local simulator."""
        req = ChatRequest(
            message="How do I walk to Section 102 from Gate A?",
            session_id="test_session_nav",
            user_id="test_user",
            state={}
        )
        response = self.loop.run_until_complete(chat(req))
        self.assertIn("Section 102", response["response"])
        self.assertIn("Gate A", response["response"])
        
        # Verify events trace routing
        self.assertEqual(len(response["events"]), 2)
        self.assertEqual(response["events"][0]["author"], "coordinator")
        self.assertEqual(response["events"][1]["author"], "fan_assistant")

    def test_chat_mock_accessibility(self):
        """Verify routing of accessibility elevator and restroom queries."""
        req = ChatRequest(
            message="Where is the nearest wheelchair restroom?",
            session_id="test_session_ada",
            user_id="test_user",
            state={}
        )
        response = self.loop.run_until_complete(chat(req))
        self.assertIn("ADA-compliant", response["response"])
        self.assertIn("Gate F", response["response"])

    def test_chat_mock_sustainability(self):
        """Verify sorting and recycling guidelines queries."""
        req = ChatRequest(
            message="Is there a recycling station nearby",
            session_id="test_session_eco",
            user_id="test_user",
            state={}
        )
        response = self.loop.run_until_complete(chat(req))
        self.assertIn("BLUE RECYCLING BINS", response["response"])

    def test_chat_mock_contingency_scenarios(self):
        """Verify routing of command scenarios advisor scripts."""
        req = ChatRequest(
            message="What is the advice for the current storm scenario?",
            session_id="test_session_tactical",
            user_id="test_user",
            state={"activeScenario": "storm"}
        )
        response = self.loop.run_until_complete(chat(req))
        self.assertIn("DELAYED EXIT PROTOCOL", response["response"])
        self.assertIn("PA announcement", response["response"])

    def test_query_cache(self):
        """Verify query caching is working correctly for repeated inputs."""
        message = "What is the food menu at Hub 2?"
        session_id = "cache_test_session"
        
        # 1. Clear any pre-existing cache for this keyspace
        chat_cache.set(session_id, message, "")
        
        # 2. Trigger primary query
        req = ChatRequest(
            message=message,
            session_id=session_id,
            user_id="test_user",
            state={}
        )
        response1 = self.loop.run_until_complete(chat(req))
        
        # 3. Trigger identical duplicate query
        response2 = self.loop.run_until_complete(chat(req))
        
        # Verify values match and second is tagged with Cache Hit metadata
        self.assertEqual(response1["response"], response2["response"])
        self.assertIn("[Cache Hit]", response2["events"][0]["content"])

    def test_chat_chatbot_languages(self):
        """Verify queries regarding chatbot's own language support capabilities."""
        req = ChatRequest(
            message="Do you speak Tamil?",
            session_id="test_session_chat_lang",
            user_id="test_user",
            state={}
        )
        response = self.loop.run_until_complete(chat(req))
        self.assertIn("Yes, I speak and support Tamil!", response["response"])
        self.assertEqual(response["events"][1]["author"], "coordinator")

    def test_chat_mock_volunteer_languages(self):
        """TDD Step 1: Verify query for matching volunteers by language in roster state."""
        state_with_roster = {
            "volunteers": [
                {"id": "v1", "name": "Diego Cruz", "role": "Medical Support", "zone": "Gate A", "status": "Available", "languages": ["en", "es"], "phone": "+1 555-0192"},
                {"id": "v2", "name": "Mateo Silva", "role": "Facilities Maintenance", "zone": "Concourse West", "status": "Available", "languages": ["en", "es", "pt"], "phone": "+1 555-0193"},
                {"id": "v3", "name": "Aisha Kone", "role": "Crowd Control", "zone": "Gate B", "status": "Available", "languages": ["en", "fr"], "phone": "+1 555-0194"}
            ]
        }
        req = ChatRequest(
            message="Which volunteers speak Spanish?",
            session_id="test_session_tdd",
            user_id="test_user",
            state=state_with_roster
        )
        response = self.loop.run_until_complete(chat(req))
        # This will fail initially in our TDD loop until we write the routing logic
        self.assertIn("Diego Cruz", response["response"])
        self.assertIn("Mateo Silva", response["response"])
        self.assertNotIn("Aisha Kone", response["response"])

    def test_chat_language_switch_intent(self):
        """Verify that natural language commands to switch languages update the session state."""
        req = ChatRequest(
            message="Switch to Spanish",
            session_id="test_session_switch",
            user_id="test_user",
            state={"language": "en"}
        )
        response = self.loop.run_until_complete(chat(req))
        self.assertIn("he cambiado el idioma a español", response["response"])
        self.assertEqual(response["state"]["language"], "es")

if __name__ == "__main__":
    unittest.main()
