from google.adk.tools import ToolContext

def get_seat_directions(section: str, row: str, gate: str) -> dict:
    """Calculates pedestrian walk directions from a gate to a specific seating section and row.

    Args:
        section: Seating section number (e.g. '102').
        row: Row letter (e.g. 'K').
        gate: Entrance gate name (e.g. 'Gate A').

    Returns:
        A dictionary containing the walk path instructions.
    """
    return {
        "status": "success",
        "directions": f"From {gate}, enter the outer concourse, turn left, and walk past Concession Hub 1. Follow the overhead signs to Section {section}, Row {row}."
    }

def get_facility_status(facility_id: str, tool_context: ToolContext) -> dict:
    """Gets the current sensor queue wait time for a gate, restroom, or concession hub.

    Args:
        facility_id: Identifier of the facility (e.g., 'gate-b', 'concession-1', 'restroom-3').

    Returns:
        A dictionary containing the wait time in minutes and current load status.
    """
    facilities = tool_context.state.get("facilitiesState", {})
    wait_time = facilities.get(facility_id, 5)  # Default fallback
    return {
        "facility_id": facility_id,
        "wait_time_minutes": wait_time,
        "congestion_status": "High" if wait_time > 15 else "Moderate" if wait_time > 8 else "Low"
    }

def get_sustainability_guide(waste_type: str) -> dict:
    """Provides recycling and sorting instructions for various stadium concessions waste types.

    Args:
        waste_type: Type of waste item (e.g., 'plastic', 'can', 'food', 'paper', 'general').

    Returns:
        A dictionary containing bin color, sorting rules, and eco-points reward information.
    """
    guide = {
        "plastic": {"bin": "Blue (Recycling)", "points": 15, "info": "Plastic bottles must be thrown in the blue recycling bin. Empty any liquids first."},
        "can": {"bin": "Blue (Recycling)", "points": 15, "info": "Aluminum cans are 100% recyclable. Place in blue recycling bin."},
        "food": {"bin": "Green (Compost)", "points": 15, "info": "Food waste goes into the green compost bin. Do not mix with plastic wrappers."},
        "paper": {"bin": "Blue (Recycling)", "points": 15, "info": "Clean cardboard wrappers and stadium guides go to blue paper recycling."},
        "general": {"bin": "Black (Landfill)", "points": 0, "info": "Soiled food wraps and mixed plastics go to black landfill bins."}
    }
    return guide.get(waste_type, {"bin": "Black (Landfill)", "points": 0, "info": "Place in general landfill waste."})

def get_match_telemetry() -> dict:
    """Gets real-time telemetry about the current running tournament match, score, elapsed time, and team matchup.

    Returns:
        A dictionary containing live match details (teams, score, elapsed minute, match phase).
    """
    return {
        "status": "success",
        "match_details": {
            "teams": "United States vs. England",
            "score": "1 - 1",
            "elapsed_minute": 78,
            "match_phase": "Second Half",
            "stadium": "MetLife Stadium",
            "spectators": 82500,
            "weather": "Sunny, 75°F"
        }
    }

def get_concession_menu(hub_id: str) -> dict:
    """Retrieves the list of food, beverages, pricing, and signature dishes available at a specific concession hub.

    Args:
        hub_id: Concession hub identifier (e.g. 'concession-1', 'concession-2', 'concession-3', 'concession-4').

    Returns:
        A dictionary containing popular food items, pricing, and specialty dishes.
    """
    menus = {
        "concession-1": {
            "name": "Concession Hub 1 (100 Level)",
            "signature_dish": "Jersey Style Sliders ($14.50)",
            "items": ["Slider Pack ($14.50)", "Classic Hotdog ($6.00)", "Pretzel ($5.00)", "Draft Beer ($11.00)", "Soft Drink ($5.50)"]
        },
        "concession-2": {
            "name": "Concession Hub 2 (200 Level)",
            "signature_dish": "MetLife Cheesesteak ($16.00)",
            "items": ["Philly Cheesesteak ($16.00)", "French Fries ($6.00)", "Popcorn Tub ($7.00)", "Soft Drink ($5.50)"]
        },
        "concession-3": {
            "name": "Concession Hub 3 (300 Level)",
            "signature_dish": "Big Kick Nachos ($12.00)",
            "items": ["Loaded Nachos ($12.00)", "Tacos Trio ($13.00)", "Churros ($5.00)", "Imported Beer ($12.00)"]
        },
        "concession-4": {
            "name": "Concession Hub 4 (100 Level)",
            "signature_dish": "Garden State Veggie Wrap ($11.50)",
            "items": ["Veggie Wrap ($11.50)", "Fruit Cup ($6.00)", "Water Bottle ($4.50)", "Light Beer ($10.50)"]
        }
    }
    return menus.get(hub_id, {
        "name": f"Concession Hub {hub_id}",
        "signature_dish": "Standard Concession Fare",
        "items": ["Hotdog ($6.00)", "Pretzel ($5.00)", "Soft Drink ($5.50)", "Water ($4.50)"]
    })
