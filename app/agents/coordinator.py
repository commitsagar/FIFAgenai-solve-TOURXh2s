from google.adk.agents import Agent
from app.config import MODEL_NAME
from app.agents.utils import load_prompt

coordinator_agent = Agent(
    name="coordinator",
    model=MODEL_NAME,
    instruction=load_prompt("coordinator.txt"),
    description="Main router agent evaluating incoming visitor messages and delegating them to the appropriate sub-agent."
)
