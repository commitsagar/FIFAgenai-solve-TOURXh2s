from .coordinator import coordinator_agent
from .fan_assistant import fan_assistant_agent
from .incident_commander import incident_commander_agent
from .tactical_advisor import tactical_advisor_agent

coordinator_agent.register_subagents([
    fan_assistant_agent,
    incident_commander_agent,
    tactical_advisor_agent
])
