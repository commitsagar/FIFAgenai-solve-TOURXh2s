import os
import logging
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

# Import ADK modules
from google.adk.runners import InMemoryRunner
from google.genai import types

# Import our custom configs and agents
from app.config import DEFAULT_API_MODE, GOOGLE_API_KEY, HOST, PORT
from app.agents import coordinator_agent

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SAOCC_FastAPI")

app = FastAPI(title="FIFA 2026 Smart Arena - AI Agent Platform")

# Enable CORS for React Dev Server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ADK Runner (implicitly creates its session service)
runner = InMemoryRunner(
    agent=coordinator_agent,
    app_name="app"
)

# State manager for dynamic config changes
runtime_config = {
    "api_mode": DEFAULT_API_MODE,
    "api_key": GOOGLE_API_KEY
}

class ChatRequest(BaseModel):
    message: str
    session_id: str
    user_id: str
    state: Dict[str, Any]

class ConfigUpdateRequest(BaseModel):
    api_mode: str
    api_key: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "FIFA 2026 SAOCC - AI Multi-Agent API",
        "documentation": "/docs"
    }

@app.get("/api/config")
def get_config():
    return {
        "api_mode": runtime_config["api_mode"],
        "has_key": bool(runtime_config["api_key"])
    }

@app.post("/api/config")
def update_config(req: ConfigUpdateRequest):
    if req.api_mode not in ["mock", "live"]:
        raise HTTPException(status_code=400, detail="Invalid API Mode. Choose 'mock' or 'live'")
    
    runtime_config["api_mode"] = req.api_mode
    runtime_config["api_key"] = req.api_key
    
    # Update environment variable so the GenAI SDK captures the new key
    if req.api_key:
        os.environ["GOOGLE_API_KEY"] = req.api_key
        os.environ["GEMINI_API_KEY"] = req.api_key
    else:
        # Clear keys if user switches to mock
        os.environ.pop("GOOGLE_API_KEY", None)
        os.environ.pop("GEMINI_API_KEY", None)
        
    logger.info(f"API Mode updated to {req.api_mode}. Has Key: {bool(req.api_key)}")
    return {"status": "success", "message": f"Server updated to {req.api_mode} mode."}

@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        # Check API configuration mode
        if runtime_config["api_mode"] == "mock" or not runtime_config["api_key"]:
            logger.info("Mock mode active. Responding locally to avoid LLM authorization checks.")
            text_lower = req.message.lower()
            response_text = ""
            active_agent = "coordinator"
            
            is_hindi = bool(re.search(r"[\u0900-\u097F]", req.message))
            is_tamil = bool(re.search(r"[\u0B80-\u0BFF]", req.message))

            if is_hindi:
                active_agent = "fan_assistant"
                if any(k in text_lower for k in ["शौचालय", "टॉयलेट", "सुलभ"]):
                    response_text = "स्टेडियम के सभी स्तर एडीए-अनुरूप शौचालयों से सुसज्जित हैं। निकटतम व्हीलचेयर-सुलभ शौचालय वेस्ट टॉयलेट ब्लॉक (गेट एफ के पास) और कंसेशन हब 1 के बगल में स्थित है। लिफ्ट गेट ए और डी के पास स्थित हैं।"
                elif any(k in text_lower for k in ["बस", "ट्रेन", "परिवहन", "मेट्रो"]):
                    response_text = "एनजे ट्रांजिट मेडलैंड्स रेल लाइन खेल के बाद हर 10-15 मिनट में सीधे सेकौकस जंक्शन के लिए ट्रेनें चलाती है। मैनहट्टन पोर्ट अथॉरिटी के लिए एक्सप्रेस बसें किकऑफ़ से 2 घंटे पहले और मैच के 1 घंटे बाद तक लॉट जी से प्रस्थान करती हैं।"
                elif any(k in text_lower for k in ["कचरा", "रीसायकल", "डब्बा"]):
                    response_text = "कृपया हर कंसेशन निकास पर स्थित नीले रीसाइक्लिंग डिब्बे में प्लास्टिक की बोतलें और एल्युमिनियम कैन फेंकें। भोजन के बचे हुए हिस्से को हरे कम्पोस्ट डिब्बे में डालें।"
                elif any(k in text_lower for k in ["मैच", "खेल", "स्कोर"]):
                    response_text = "वर्तमान में, **यूनाइटेड स्टेट्स बनाम इंग्लैंड** का मैच चल रहा है। सेकंड हाफ के 78वें मिनट में स्कोर **1 - 1** है।"
                elif any(k in text_lower for k in ["खाना", "भोजन", "हब", "मेन्यू"]):
                    response_text = "लोकप्रिय व्यंजन: कंसेशन हब 1 में जर्सी स्टाइल स्लाइडर्स ($14.50), हब 2 में चेज़स्टीक ($16.00), और हब 3 में बिग किक नाचोज़ ($12.00)। हब 2 में प्रतीक्षा समय सबसे कम है (5 मिनट)!"
                elif any(k in text_lower for k in ["रास्ता", "सीट", "मार्ग", "दिशा"]):
                    response_text = "गेट ए (उत्तर प्रवेश द्वार) से अनुभाग 102 तक: सीधे बाहरी कॉनकोर्स में जाएं, बाएं मुड़ें और कंसेशन हब 1 से आगे बढ़ें। अनुभाग 102 के ओवरहेड संकेतों का पालन करें (4 मिनट का रास्ता)।"
                else:
                    response_text = "नमस्ते! मैं आपका एआई मैचडे सहायक हूँ। मैं सीटों, भोजन, पारगमन या रीसाइक्लिंग में मदद कर सकता हूँ। मैं आपकी क्या मदद करूँ?"
            elif is_tamil:
                active_agent = "fan_assistant"
                if any(k in text_lower for k in ["கழிப்பறை", "டாய்லெட்", "சக்கர"]):
                    response_text = "அரங்கத்தின் அனைத்து நிலைகளிலும் மாற்றுத்திறனாளிகளுக்கான கழிப்பறைகள் உள்ளன. அருகிலுள்ள சக்கர நாற்காலி அணுகக்கூடிய கழிப்பறை மேற்கு கழிப்பறை தொகுதி (கேட் எஃப் அருகில்) மற்றும் உணவு ஹப் 1-க்கு அருகில் உள்ளது."
                elif any(k in text_lower for k in ["பேருந்து", "ரயில்", "போக்குவரத்து", "மெட்ரோ"]):
                    response_text = "என்ஜே டிரான்சிட் மெடோலாண்ட்ஸ் ரயில் பாதை போட்டிக்குப் பிறகு ஒவ்வொரு 10-15 நிமிடங்களுக்கும் நேரடியாக செகாகஸ் சந்திப்பிற்கு ரயில்களை இயக்குகிறது. எக்ஸ்பிரஸ் பேருந்துகள் லாட் ஜி-யிலிருந்து புறப்படும்."
                elif any(k in text_lower for k in ["மறுசுழற்சி", "கழிவு", "குப்பை"]):
                    response_text = "தயவுசெய்து பிளாஸ்டிக் பாட்டில்களை நீல நிற மறுசுழற்சி தொட்டியிலும், உணவுக் கழிவுகளை பசுமை மக்கும் குப்பைத் தொட்டியிலும் போடவும்."
                elif any(k in text_lower for k in ["போட்டி", "விளையாட்டு", "ஸ்கோர்"]):
                    response_text = "தற்போது, **அமெரிக்கா மற்றும் இங்கிலாந்து** நேரடி போட்டி 78வது நிமிடத்தில் உள்ளது. ஸ்கோர் **1 - 1** ஆகும்!"
                elif any(k in text_lower for k in ["உணவு", "மெனு"]):
                    response_text = "உணவு மெனு: ஹப் 1ல் ஸ்லைடர்ஸ் ($14.50), ஹப் 2ல் சீஸ்ஸ்டீக் ($16.00), மற்றும் ஹப் 3ல் நாச்சோஸ் ($12.00). ஹப் 2ல் காத்திருப்பு நேரம் மிகக் குறைவு (5 நிமிடங்கள்)!"
                elif any(k in text_lower for k in ["இருக்கை", "வழி", "பிரிவு"]):
                    response_text = "பிரிவு 102-க்கு செல்ல கேட் ஏ வழியாக நுழையவும். நேராக வெளிப்புற कॉनகோர்ஸ்-க்குள் நடந்து, இடதுபுறம் திரும்பி, உணவு ஹப் 1-ஐ கடந்து பிரிவு 102 பலகைகளைப் பின்தொடரவும் (4 நிமிடங்கள்)."
                else:
                    response_text = "வணக்கம்! நான் உங்கள் மேட்ச்டே உதவியாளர். இருக்கை வழிகாட்டி, உணவு மெனு அல்லது மறுசுழற்சி விதிகள் பற்றி உங்களுக்கு நான் உதவ முடியும்."
            else:
                # Simple keyword matching simulating coordinator routing (English/Other default)
                if any(k in text_lower for k in ["wheelchair", "accessible", "ada", "elevat", "toilet", "restroom"]):
                    active_agent = "fan_assistant"
                    response_text = "All levels of MetLife Stadium are ADA-compliant. Accessible restrooms are next to Restroom Block West (near Gate F) and Concession Hub 1. Elevators are adjacent to Gates A and D."
                elif any(k in text_lower for k in ["transit", "train", "bus", "manhattan", "transport", "metro", "schedule"]):
                    active_agent = "fan_assistant"
                    response_text = "The NJ Transit Meadowlands Rail Line runs trains directly to Secaucus Junction every 10-15 minutes after the game. Express buses to Manhattan depart from Lot G starting 2 hours before kickoff."
                elif any(k in text_lower for k in ["recycle", "sustainab", "plastic", "trash", "garbage", "bin", "can"]):
                    active_agent = "fan_assistant"
                    response_text = "Please dispose of plastic bottles and aluminum cans in the BLUE RECYCLING BINS located at concession exits. Food scraps go to the GREEN COMPOST BINS. General waste goes in the BLACK LANDFILL BINS."
                elif any(k in text_lower for k in ["runnun", "running", "match", "score", "playing", "game"]):
                    active_agent = "fan_assistant"
                    response_text = "Currently, **United States vs. England** is live in the 78th minute of the Second Half. The score is tied at **1 - 1** after a stellar goal by Christian Pulisic in the 55th minute!"
                elif any(k in text_lower for k in ["kitchen", "food", "eat", "hot", "menu", "concession", "hungry", "burger"]):
                    active_agent = "fan_assistant"
                    response_text = "Popular items today at our Concessions: **Jersey Style Sliders** at Concession Hub 1 ($14.50), **MetLife Cheesesteak** at Hub 2 ($16.00), and **Big Kick Nachos** at Hub 3 ($12.00). Concession Hub 2 currently has the shortest queue (5 min wait)!"
                elif any(k in text_lower for k in ["walk", "section", "directions", "seat", "route"]):
                    active_agent = "fan_assistant"
                    response_text = "To walk to **Section 102** from **Gate A (North Entrance)**: Walk straight into the North concourse, proceed past Restroom Block North, turn left, and walk past Concession Hub 1. Follow the signs for Section 102. (Estimated walk time: 4 minutes)."
                elif any(k in text_lower for k in ["wait", "queue", "time", "busy", "shortest"]):
                    active_agent = "fan_assistant"
                    shortest_gate = "Gate D"
                    min_wait = 6
                    facs = req.state.get("facilitiesState", {})
                    for g_id in ["gate-a", "gate-b", "gate-c", "gate-d", "gate-e", "gate-f"]:
                        wait = facs.get(g_id, 99)
                        if wait < min_wait:
                            min_wait = wait
                            shortest_gate = g_id.replace("gate-", "Gate ").upper()
                    response_text = f"According to current arena sensors, the shortest queue wait is at **{shortest_gate}** with an estimated wait of **{min_wait} minutes**."
                elif "incident" in text_lower or "evaluate" in text_lower:
                    active_agent = "incident_commander"
                    response_text = "Category: Maintenance\nThreat level: Medium\nAction instructions:\n1. Dispatch cleaning crew with wet-floor warning signs.\n2. Verify cleanup is complete within 10 minutes.\nRecommended dispatch volunteer: Mateo Silva"
                elif "scenario" in text_lower or "advice" in text_lower or "storm" in text_lower:
                    active_agent = "tactical_advisor"
                    scen_name = req.state.get("activeScenario", "standard")
                    if scen_name == "storm":
                        response_text = "• ACTIVATE DELAYED EXIT PROTOCOL. Play PA announcement asking fans to seek shelter in the indoor concourses.\n• Dispatch crowd controllers to guard exit ramps and prevent slips on wet steel stairs.\n• Coordinate with NJ Transit rail controller to align train boarding post-storm."
                    elif scen_name == "transit_delay":
                        response_text = "• ACTIVATE SHUTTLE FLIGHT B. Order backup emergency buses from Lot G to Secaucus Terminal.\n• Push real-time transit status updates to user-facing Fan mobile portals.\n• Direct parking guides to facilitate rapid rideshare pickups at Lot E."
                    elif scen_name == "heatwave":
                        response_text = "• Concessions to offer complimentary ice cups to fans.\n• Ensure cooling misters are running at 100% capacity near Concessions 1 and 3.\n• Deploy Medical Volunteers to seat aisles looking for early signs of dehydration."
                    else:
                        response_text = "• Maintain current gates load balancing. All turnstiles operating nominally.\n• Transition concession staff to high-demand mode for post-match snacks.\n• Direct clean-up crews to sweep major concourses before crowd exits."
                elif any(k in text_lower for k in ["hi", "hello", "hey", "welcome", "greet"]):
                    response_text = "Hello! I am your Coordinating Assistant. I can guide you through wayfinding seat directions, concession food menus, facility wait times, transit delays, or recycling rules. How can I help you today?"
                else:
                    response_text = "Hello! I am your Coordinating Assistant. I can guide you through seat directions, food menus, wait times, transit schedules, or recycling rules. What can I help you with?"

            mock_events = [
                {"author": "coordinator", "content": f"Evaluating routing for request: '{req.message}'", "actions": ""},
                {"author": active_agent, "content": response_text, "actions": ""}
            ]

            return {
                "response": response_text,
                "state": req.state,
                "events": mock_events
            }

        # Otherwise, run the live Google ADK multi-agent orchestrator
        state_delta = {
            "facilitiesState": req.state.get("facilitiesState", {}),
            "volunteers": req.state.get("volunteers", []),
            "activeScenario": req.state.get("activeScenario", "standard"),
            "ecoPoints": req.state.get("ecoPoints", 0)
        }
        
        logger.info(f"Syncing state delta: FacilitiesCount={len(state_delta['facilitiesState'])}, VolunteersCount={len(state_delta['volunteers'])}")

        session = await runner.session_service.get_session(
            app_name="app",
            user_id=req.user_id,
            session_id=req.session_id
        )
        if not session:
            await runner.session_service.create_session(
                app_name="app",
                user_id=req.user_id,
                session_id=req.session_id
            )

        new_msg = types.Content(parts=[types.Part.from_text(text=req.message)])
        events = []
        bot_response = ""
        
        async for event in runner.run_async(
            user_id=req.user_id,
            session_id=req.session_id,
            new_message=new_msg,
            state_delta=state_delta
        ):
            events.append(event)
            if event.author != "user" and event.content:
                bot_response = event.content
                
        if not bot_response:
            bot_response = "I have processed your query and synchronized the telemetry. Let me know how else I can help!"

        session = await runner.session_service.get_session(
            app_name="app",
            user_id=req.user_id,
            session_id=req.session_id
        )
        
        updated_state = {
            "facilitiesState": session.state.get("facilitiesState", {}) if session else state_delta["facilitiesState"],
            "volunteers": session.state.get("volunteers", []) if session else state_delta["volunteers"],
            "ecoPoints": session.state.get("ecoPoints", 0) if session else state_delta["ecoPoints"]
        }

        return {
            "response": bot_response,
            "state": updated_state,
            "events": [
                {
                    "author": getattr(e, "author", "system"),
                    "content": getattr(e, "content", ""),
                    "actions": str(getattr(e, "actions", ""))
                }
                for e in events
            ]
        }
        
    except Exception as e:
        logger.exception("Chat routing failure")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
