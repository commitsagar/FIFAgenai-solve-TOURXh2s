from google.adk.agents import Agent
from app.config import MODEL_NAME
from app.agents.utils import load_prompt
from app.tools import get_active_volunteers, recommend_dispatch

incident_commander_agent = Agent(
    name="incident_commander",
    model=MODEL_NAME,
    instruction=load_prompt("incident_commander.txt"),
    description="Safety Incident commander agent parsing safety reports and assigning relevant security or medical dispatch volunteers.",
    tools=[get_active_volunteers, recommend_dispatch]
)
