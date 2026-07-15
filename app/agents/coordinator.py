from google.adk.agents import Agent
from app.config import MODEL_NAME
from app.agents.utils import load_prompt

# Import sub-agents to pass in constructor
from app.agents.fan_assistant import fan_assistant_agent
from app.agents.incident_commander import incident_commander_agent
from app.agents.tactical_advisor import tactical_advisor_agent

coordinator_agent = Agent(
    name="coordinator",
    model=MODEL_NAME,
    instruction=load_prompt("coordinator.txt"),
    description="Main router agent evaluating incoming visitor messages and delegating them to the appropriate sub-agent.",
    sub_agents=[
        fan_assistant_agent,
        incident_commander_agent,
        tactical_advisor_agent
    ]
)
