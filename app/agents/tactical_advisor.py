from google.adk.agents import Agent
from app.config import MODEL_NAME
from app.agents.utils import load_prompt

tactical_advisor_agent = Agent(
    name="tactical_advisor",
    model=MODEL_NAME,
    instruction=load_prompt("tactical_advisor.txt"),
    description="Command center advisor agent outputting contingency PA scripts and announcements for delayed transit or storms."
)
