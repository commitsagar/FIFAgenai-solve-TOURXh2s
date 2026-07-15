from google.adk.tools import ToolContext

def get_active_volunteers(tool_context: ToolContext) -> list:
    """Gets the active list of rostered stadium safety volunteers and their status.

    Returns:
        A list of dictionaries representing the active volunteer roster.
    """
    return tool_context.state.get("volunteers", [])

def recommend_dispatch(role_needed: str, tool_context: ToolContext) -> dict:
    """Finds an available volunteer specialized in the requested category.

    Args:
        role_needed: Role category ('Medical Support', 'Crowd Control', 'Technical Services', 'Facilities Maintenance').

    Returns:
        A dictionary containing the assigned volunteer name and dispatch code.
    """
    volunteers = tool_context.state.get("volunteers", [])
    matched = [v for v in volunteers if v.get("role") == role_needed and v.get("status") == "Available"]
    
    if matched:
        return {
            "status": "success",
            "volunteer_name": matched[0]["name"],
            "role": role_needed,
            "dispatch_code": f"DISPATCH-{matched[0]['name'].upper().split()[0]}"
        }
    return {
        "status": "warning",
        "message": f"No available volunteers found for role: {role_needed}. Dispatch general crew.",
        "volunteer_name": "Ramp Crew G"
    }
