import urllib.request
import json

def test_query(prompt, state=None):
    if state is None:
        state = {
            "facilitiesState": {
                "gate-a": 5,
                "gate-b": 12,
                "concession-1": 15,
                "concession-2": 4
            },
            "volunteers": [
                {"id": "v1", "name": "Diego Cruz", "role": "Medical Support", "zone": "Gate A", "status": "Available", "languages": ["en", "es"], "phone": "+1 555-0192"},
                {"id": "v2", "name": "Mateo Silva", "role": "Facilities Maintenance", "zone": "Concourse West", "status": "Available", "languages": ["en", "es", "pt"], "phone": "+1 555-0193"}
            ],
            "activeScenario": "storm"
        }
    
    url = "http://localhost:8000/api/chat"
    payload = {
        "message": prompt,
        "session_id": "audit_session_id",
        "user_id": "audit_user",
        "state": state
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            print(f"\n==========================================")
            print(f"🎤 USER: \"{prompt}\"")
            print(f"⚙️ ROUTED AGENT: {res_data['events'][1]['author'].upper()}")
            print(f"🤖 ASSISTANT: {res_data['response']}")
    except Exception as e:
        print(f"Error querying backend: {e}. Make sure FastAPI is running on http://localhost:8000.")

if __name__ == "__main__":
    print("🚀 STARTING PORTAL PROTOTYPE AUDIT...")
    
    # 1. Greet
    test_query("hi")
    
    # 2. Seating Wayfinding
    test_query("How do I walk to Section 102 from Gate A?")
    
    # 3. Accessibility restrooms
    test_query("Where is the nearest wheelchair restroom?")
    
    # 4. Telemetry Wait times
    test_query("Which gate has the shortest queue line?")
    
    # 5. Food Concession menus
    test_query("whats hot in kitchen")
    
    # 6. Sustainability waste Sorting
    test_query("Is there a recycling station nearby")
    
    # 7. Volunteer Language matching
    test_query("Which volunteers speak Spanish?")
    
    print("\n==========================================")
    print("✅ PROTOTYPE AUDIT COMPLETED.")
