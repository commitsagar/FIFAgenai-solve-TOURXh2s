import os
from dotenv import load_dotenv

# Load local .env variables
load_dotenv()

# Gemini Configurations
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY") or ""
MODEL_NAME = os.getenv("GEMINI_MODEL") or "gemini-1.5-flash"

# Determine fallback mode
DEFAULT_API_MODE = "live" if GOOGLE_API_KEY else "mock"

# Server configuration
PORT = int(os.getenv("PORT") or 8000)
HOST = os.getenv("HOST") or "0.0.0.0"
