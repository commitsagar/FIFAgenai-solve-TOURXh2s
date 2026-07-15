# FIFA 2026 Smart Arena & Operations Command Center (SAOCC) - Walkthrough

We have successfully migrated the stadium operations and fan experience solution to a **production-grade Google ADK multi-agent architecture** with a modular folder structure, externalized prompts, and a high-end **React.js (Vite)** dashboard.

The application is fully running on your local machine:
- **FastAPI ADK Backend**: http://localhost:8000
- **React Frontend**: http://localhost:5173

---

## 🗺️ Codebase Tree Map
The directory structure below details the modular organization of backend agent logic, prompts, custom tools, and the React frontend codebase:

```
FIFA-PromptWars/
├── app/
│   ├── agents/                   # Modular Google ADK Sub-Agents
│   │   ├── __init__.py           # Exports and bundles agents
│   │   ├── coordinator.py        # Coordinating router agent
│   │   ├── fan_assistant.py      # Matchday fan guide agent
│   │   ├── incident_commander.py  # Safety incident command agent
│   │   └── tactical_advisor.py   # Contingency ops coordinator agent
│   ├── prompts/                  # Externalized system prompt templates
│   │   ├── coordinator.txt
│   │   ├── fan_assistant.txt
│   │   ├── incident_commander.txt
│   │   └── tactical_advisor.txt
│   ├── tools/                    # Dynamic Python telemetry tools
│   │   ├── __init__.py           # Exports telemetry and volunteer tools
│   │   ├── telemetry_tools.py    # Wayfinding, wait times, menus, scores
│   │   └── volunteer_tools.py    # Volunteer roster and dispatch recommender
│   ├── config.py                 # System and API mode configs
│   └── main.py                   # FastAPI server, session syncing & mock fallback
├── frontend/                     # React.js (Vite) Client Dashboard
│   ├── src/
│   │   ├── App.jsx               # Dashboard logic, map rendering, voice STT/TTS
│   │   ├── data.js               # Localization records (EN, ES, FR, AR, PT, HI, TA)
│   │   └── index.css             # Glassmorphism design styling
│   ├── package.json              # Client packages and Vite configuration
│   └── vite.config.js
├── .env                          # Local credentials container
├── requirements.txt              # Backend dependencies
└── walkthrough.md                # Deliverable walkthrough documentation (This file)
```

---

## 🎨 Agentic AI System Architecture
Below is the high-fidelity system architecture diagram generated for the FIFA 2026 SAOCC platform, followed by the technical Mermaid flowchart:

![FIFA 2026 SAOCC Agentic Architecture](./agent_architecture.png)

The diagram below details the conversational barge-in path, the telemetry synchronization pipeline, coordinating router delegation, and Python tool resolution:

```mermaid
graph TD
    subgraph Client [React.js Frontend Dashboard]
        UI["User Interface & SVG Map"]
        STT["🎙️ Speech Recognition STT"]
        TTS["🔊 Speech Synthesis TTS"]
    end

    subgraph API [FastAPI Backend Service]
        Server["main.py Uvicorn App"]
        Runner["InMemoryRunner Session Manager"]
    end

    subgraph ADK [Google ADK Agentic System]
        Coord["Coordinating Router Agent"]
        Fan["fan_assistant Agent"]
        Inc["incident_commander Agent"]
        Tact["tactical_advisor Agent"]
    end

    subgraph Tools [Python Executable Tools]
        Wayfind["get_seat_directions"]
        Facil["get_facility_status"]
        Sustain["get_sustainability_guide"]
        Match["get_match_telemetry"]
        Menu["get_concession_menu"]
        Volunteers["volunteer roster tools"]
    end

    subgraph LLM [Generative AI Layer]
        Gemini["Google Gemini API"]
    end

    %% Flow lines
    UI -->|1. Submit Chat Text/Speech| Server
    STT -->|Transcribes query to text| UI
    Server -->|2. Sync Telemetry state_delta| Runner
    Runner -->|3. Route Message| Coord
    
    %% Coordination Routing
    Coord -->|Delegates to Fan Query| Fan
    Coord -->|Delegates to Incident Report| Inc
    Coord -->|Delegates to Operations Scenario| Tact

    %% Tools Bindings
    Fan -->|Invokes| Wayfind
    Fan -->|Invokes| Facil
    Fan -->|Invokes| Sustain
    Fan -->|Invokes| Match
    Fan -->|Invokes| Menu
    Inc -->|Invokes| Volunteers

    %% LLM Execution
    Coord -.->|LLM call| Gemini
    Fan -.->|LLM call| Gemini
    Inc -.->|LLM call| Gemini
    Tact -.->|LLM call| Gemini

    %% Responses
    Runner -->|4. Return JSON response & events| Server
    Server -->|5. Update Chat history & Map| UI
    UI -->|6. Speak Response (Barge-in clears synthesis)| TTS
```

---

## 📂 Project Architecture & Code Links

The codebase is organized according to standard enterprise guidelines, separating concerns cleanly:

### 1. External Prompt Templates (Configurable)
All prompt instructions are placed outside the code in `/app/prompts/` to allow live updates without redeploying the backend:
- [coordinator.txt](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/prompts/coordinator.txt): Intent evaluator and router.
- [fan_assistant.txt](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/prompts/fan_assistant.txt): Wayfinding, facility status, and recycling instruction rules.
- [incident_commander.txt](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/prompts/incident_commander.txt): Safety assessment, severity rating, and volunteer matching rules.
- [tactical_advisor.txt](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/prompts/tactical_advisor.txt): Stadium contingency advice templates.

### 2. Custom Python Tools
The tools parse data dynamically from the session state synchronized from the React simulator:
- [telemetry_tools.py](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/tools/telemetry_tools.py): Wayfinding guides, live facility wait times, and recycling advice.
- [volunteer_tools.py](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/tools/volunteer_tools.py): Volunteer status rosters and specialty dispatch recommendation rules.

### 3. Modular ADK Sub-Agents
Each sub-agent represents a specialized LLM unit:
- [coordinator.py](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/agents/coordinator.py): Coordinated router agent binding the sub-agents.
- [fan_assistant.py](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/agents/fan_assistant.py): Fan portal sub-agent.
- [incident_commander.py](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/agents/incident_commander.py): Incident manager sub-agent.
- [tactical_advisor.py](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/agents/tactical_advisor.py): Contingency planner sub-agent.

### 4. FastAPI & React frontend
- [main.py](file:///Users/shivasagark/Downloads/FIFA-PromptWars/app/main.py): FastAPI server, synchronizing incoming client telemetry state variables with `InMemoryRunner`'s `state_delta` parameter.
- [App.jsx](file:///Users/shivasagark/Downloads/FIFA-PromptWars/frontend/src/App.jsx): React dashboard managing states (wait times, incidents, volunteers), rendering stadium SVGs, driving chat components, and handling API requests.
- [index.css](file:///Users/shivasagark/Downloads/FIFA-PromptWars/frontend/src/index.css): Obsidian glassmorphism stylesheet.

---

## 🛠️ Verification & Run Instructions

### 1. Running Backend & Frontend
Both servers have been launched and are running in the background. If you need to start them manually later:
- **Backend (Python)**:
  ```bash
  python3 -m pip install -r requirements.txt
  python3 -m uvicorn app.main:app --port 8000
  ```
- **Frontend (Vite + React)**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

### 2. Validation Checklist
You can test the features directly in your browser at **http://localhost:5173**:

1. **AI Chat Assistant (Fan View)**:
   - Type *“Where is the nearest ADA restroom?”* or select the pre-canned prompts.
   - The coordinator agent evaluates intent and routes the query to `fan_assistant`, which responds in your chosen language (English, Spanish, French, Portuguese, Arabic) using the local telemetry parameters.
2. **Wayfinding Pathing**:
   - Set Section to `102` and Row to `K`, and click **Guide Me**.
   - Watch the SVG map draw a blue glowing path from your gate to the seat and output walking steps in the chat history.
3. **Sustainability (Eco Bins)**:
   - Click **Plastic Bottle** or **Aluminum Can** to sort trash.
   - Watch your **Eco-Champion points increase** (+15 points with a star pop animation) and view instructions on where to recycle.
4. **Operations Incident Center**:
   - Switch to the **Operations Center** tab.
   - Select an incident card under *Live Incidents* and click **Analyze AI**.
   - The coordinator delegates the raw report to `incident_commander`, which returns a structured action plan.
   - Click **Dispatch** to assign the recommended volunteer. Their status transitions to `Active` and changes back to `Available` once a simulated resolving countdown completes.
5. **Tactical Operations Overrides**:
   - Change the scenario selector to *Severe Storm Event (Lightning Delay)*.
   - The coordinator directs the event to `tactical_advisor`, which outputs 3 command instructions to the operator terminal, while the global ticker updates to an alert state.
6. **API Key Integration**:
   - Open the **Settings Modal (⚙️)** in the top right.
   - Supply your Google AI Studio API Key and toggle **Live Gemini API Integration** to run actual live LLM routing!
