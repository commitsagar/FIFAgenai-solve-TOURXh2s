from google.adk.agents import Agent
from app.config import MODEL_NAME
from app.agents.utils import load_prompt
from app.tools import get_seat_directions, get_facility_status, get_sustainability_guide, get_match_telemetry, get_concession_menu

fan_assistant_agent = Agent(
    name="fan_assistant",
    model=MODEL_NAME,
    instruction=load_prompt("fan_assistant.txt"),
    description="Handles fan requests such as wayfinding seat guides, facility queues, transportation schedules, and sustainability advice.",
    tools=[get_seat_directions, get_facility_status, get_sustainability_guide, get_match_telemetry, get_concession_menu]
)
