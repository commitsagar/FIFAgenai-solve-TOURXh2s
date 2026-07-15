import React, { useState, useEffect, useRef } from "react";
import { SAOCC_DATA } from "./data";
import "./App.css"; // Basic React scaffolding resets

// Define initial wait times
const initialFacilitiesState = {
  "gate-a": 8,
  "gate-b": 15,
  "gate-c": 11,
  "gate-d": 6,
  "gate-e": 9,
  "gate-f": 14,
  "concession-1": 12,
  "concession-2": 5,
  "concession-3": 14,
  "concession-4": 8,
  "restroom-1": 4,
  "restroom-2": 8,
  "restroom-3": 3,
  "restroom-4": 7
};

export default function App() {
  // Navigation & Config
  const [activeView, setActiveView] = useState("fan-portal");
  const [language, setLanguage] = useState("en");
  const [apiKey, setApiKey] = useState(localStorage.getItem("saocc_gemini_api_key") || "");
  const [apiMode, setApiMode] = useState(localStorage.getItem("saocc_api_mode") || "mock");
  const [showSettings, setShowSettings] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking"); // 'online', 'offline', 'checking'
  
  // Ticker telemetry
  const [localTime, setLocalTime] = useState("");
  const [crowdLevel, setCrowdLevel] = useState(68);
  const [activeScenario, setActiveScenario] = useState("standard");
  
  // States
  const [ecoPoints, setEcoPoints] = useState(parseInt(localStorage.getItem("saocc_eco_points")) || 0);
  const [simSpeed, setSimSpeed] = useState(1);
  const [facilitiesState, setFacilitiesState] = useState(initialFacilitiesState);
  const [volunteers, setVolunteers] = useState(JSON.parse(JSON.stringify(SAOCC_DATA.volunteers)));
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [incidents, setIncidents] = useState([
    {
      id: "i101",
      type: "spill",
      location: "Concession Hub 1 (100 Level)",
      reportedAt: "13:12:40",
      description: "Large soda spill near the ordering counter, creating slip hazard.",
      severity: "Medium",
      status: "Reported",
      aiAnalysis: null,
      assignedVolunteer: null
    },
    {
      id: "i102",
      type: "technical",
      location: "Gate B (East Entrance)",
      reportedAt: "13:20:15",
      description: "Ticket scanner #4 offline. Fans backing up at East entrance turnstiles.",
      severity: "Medium",
      status: "Reported",
      aiAnalysis: null,
      assignedVolunteer: null
    }
  ]);
  
  // Chat
  const [chatMessages, setChatMessages] = useState([
    { id: 1, author: "bot", content: SAOCC_DATA.translations.en.responses.welcome }
  ]);
  const [chatInputText, setChatInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Text-to-Speech (TTS) Synthesis
  const speakText = (text) => {
    if (!voiceEnabled) return;
    try {
      window.speechSynthesis.cancel();
      // Clean text of markdown formatters
      const cleanText = text
        .replace(/\*\*|•/g, "")
        .replace(/<[^>]*>/g, "")
        .replace(/\$/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const langMap = { en: "en-US", es: "es-ES", fr: "fr-FR", ar: "ar-SA", pt: "pt-BR" };
      utterance.lang = langMap[language] || "en-US";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis failed:", e);
    }
  };

  // Speech-to-Text (STT) Recognition
  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser. Try Google Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    const langMap = { en: "en-US", es: "es-ES", fr: "fr-FR", ar: "ar-SA", pt: "pt-BR" };
    recognition.lang = langMap[language] || "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onerror = (e) => {
      console.error("Speech Recognition error:", e);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setIsListening(false);
      handleSendMessage(speechToText);
    };
    recognition.start();
  };
  
  // Seat Finder
  const [selectedGate, setSelectedGate] = useState("gate-a");
  const [selectedSection, setSelectedSection] = useState("102");
  const [selectedRow, setSelectedRow] = useState("K");
  const [selectedSeat, setSelectedSeat] = useState("12");
  const [highlightedGate, setHighlightedGate] = useState(null);
  
  // Waste Recycling
  const [sustainabilityStatus, setSustainabilityStatus] = useState("Select a waste type to report and get disposal recycling guide.");
  const [pointsStarAnimate, setPointsStarAnimate] = useState(false);
  
  // Tactical recommendations
  const [tacticalAdvice, setTacticalAdvice] = useState("");
  const [tacticalLoading, setTacticalLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Ping Backend on startup
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const handleSaveSettings = async (selectedMode, enteredKey) => {
    localStorage.setItem("saocc_gemini_api_key", enteredKey);
    localStorage.setItem("saocc_api_mode", selectedMode);
    setApiKey(enteredKey);
    setApiMode(selectedMode);
    setShowSettings(false);
    
    try {
      await fetch("http://localhost:8000/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_mode: selectedMode, api_key: enteredKey })
      });
      setBackendStatus("online");
    } catch (e) {
      console.warn("FastAPI config update failed:", e);
    }
    
    const modeDesc = selectedMode === "live" ? "Live GenAI (Gemini)" : "Offline Simulation Mode";
    appendSystemAlert(`System updated: API Mode set to ${modeDesc}.`);
  };

  const checkBackendHealth = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/config");
      if (res.ok) {
        setBackendStatus("online");
        const configData = await res.json();
        if (configData.has_key) {
          setApiMode("live");
          await fetch("http://localhost:8000/api/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_mode: "live", api_key: "" })
          });
        } else {
          await fetch("http://localhost:8000/api/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_mode: apiMode, api_key: apiKey })
          });
        }
      } else {
        setBackendStatus("offline");
      }
    } catch (e) {
      setBackendStatus("offline");
    }
  };

  // Scroll Chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  // Simulation Clock Loop
  useEffect(() => {
    if (simSpeed === 0) return;
    
    const interval = setInterval(() => {
      // Local time update
      const now = new Date();
      setLocalTime(now.toTimeString().split(" ")[0]);
      
      // Fluctuating crowd level
      if (Math.random() < 0.1) {
        setCrowdLevel(prev => {
          const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
          return Math.max(20, Math.min(100, prev + delta));
        });
      }
      
      // Fluctuating facility times
      setFacilitiesState(prev => {
        const next = { ...prev };
        for (const key in next) {
          if (Math.random() < 0.2) {
            const delta = Math.floor(Math.random() * 3) - 1;
            next[key] = Math.max(2, Math.min(25, next[key] + delta));
          }
        }
        return next;
      });

      // Spawn random incident (very rare, 1% chance times simSpeed)
      if (Math.random() < 0.008 * simSpeed) {
        spawnRandomIncident();
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [simSpeed, incidents, volunteers]);

  // Trigger tactical recommendations on scenario change
  useEffect(() => {
    fetchTacticalAdvice();
  }, [activeScenario]);

  // Sync translation defaults when language changes
  useEffect(() => {
    setChatMessages([
      { id: Date.now(), author: "bot", content: SAOCC_DATA.translations[language].responses.welcome }
    ]);
  }, [language]);

  const spawnRandomIncident = () => {
    const sectors = SAOCC_DATA.stadium.sectors;
    const targetSector = sectors[Math.floor(Math.random() * sectors.length)];
    
    // Check if incident exists at this location
    if (incidents.find(inc => inc.location === targetSector.name && inc.status !== "Resolved")) return;

    const types = ["spill", "congestion", "medical", "technical", "sustainability_overflow"];
    const type = types[Math.floor(Math.random() * types.length)];
    const protocol = SAOCC_DATA.incidentProtocols[type];
    
    const timestamp = new Date().toTimeString().split(" ")[0];
    const newInc = {
      id: "i" + (100 + incidents.length + 1),
      type,
      location: targetSector.name,
      reportedAt: timestamp,
      description: `Telemetry Alert: ${protocol.title} detected near ${targetSector.name}.`,
      severity: protocol.defaultSeverity,
      status: "Reported",
      aiAnalysis: null,
      assignedVolunteer: null
    };

    setIncidents(prev => [newInc, ...prev]);

    if (activeView === "fan-portal" && type === "congestion") {
      appendSystemAlert(`Advisory: Heavy crowd flow detected near ${targetSector.name}. Wayfinding adjustments highlighted on map.`);
    }
  };

  // Run Tactical Advisor AI
  const fetchTacticalAdvice = async () => {
    setTacticalLoading(true);
    const scen = SAOCC_DATA.scenarios[activeScenario];
    
    if (backendStatus === "online") {
      try {
        const response = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Provide operations advice for scenario: ${scen.name}. Weather is ${scen.weather}, transit is ${scen.transit}, alert state: "${scen.alert}". Output 3 quick bulleted instructions.`,
            session_id: "react_session",
            user_id: "ops_operator",
            state: { facilitiesState, volunteers, activeScenario, ecoPoints }
          })
        });
        const result = await response.json();
        setTacticalAdvice(result.response);
        setTacticalLoading(false);
        return;
      } catch (err) {
        console.warn("FastAPI query failed, falling back to local simulation logic.");
      }
    }
    
    // Local fallback mock
    setTimeout(() => {
      let advice = "";
      if (activeScenario === "standard") {
        advice = "• Maintain current gates load balancing. All turnstiles operating nominally.\n• Transition concession staff to high-demand mode for post-match snacks.\n• Direct clean-up crews to sweep major concourses before crowd exits.";
      } else if (activeScenario === "storm") {
        advice = "• ACTIVATE DELAYED EXIT PROTOCOL. Play PA announcement asking fans to seek shelter in the indoor concourses.\n• Dispatch crowd controllers to guard exit ramps and prevent slips on wet steel stairs.\n• Coordinate with NJ Transit rail controller to align train boarding post-storm.";
      } else if (activeScenario === "transit_delay") {
        advice = "• ACTIVATE SHUTTLE FLIGHT B. Order backup emergency buses from Lot G to Secaucus Terminal.\n• Push real-time transit status updates to user-facing Fan mobile portals.\n• Direct parking guides to facilitate rapid rideshare pickups at Lot E.";
      } else if (activeScenario === "heatwave") {
        advice = "• Concessions to offer complimentary ice cups to fans.\n• Ensure cooling misters are running at 100% capacity near Concessions 1 and 3.\n• Deploy Medical Volunteers to seat aisles looking for early signs of dehydration.";
      }
      setTacticalAdvice(advice);
      setTacticalLoading(false);
    }, 800);
  };

  // Main chat communication
  const handleSendMessage = async (overrideText = "") => {
    const text = (typeof overrideText === "string" && overrideText.trim()) || chatInputText.trim();
    if (!text) return;
    
    // User message
    const userMsg = { id: Date.now(), author: "user", content: text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInputText("");
    setIsTyping(true);

    if (backendStatus === "online") {
      try {
        const response = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            session_id: "react_session",
            user_id: "stadium_visitor",
            state: { facilitiesState, volunteers, activeScenario, ecoPoints }
          })
        });
        const result = await response.json();
        
        setIsTyping(false);
        setChatMessages(prev => [...prev, { id: Date.now() + 1, author: "bot", content: result.response }]);
        speakText(result.response);
        
        // Sync states modified by agent tools if any
        if (result.state) {
          if (result.state.ecoPoints) setEcoPoints(result.state.ecoPoints);
          if (result.state.volunteers) setVolunteers(result.state.volunteers);
        }
        return;
      } catch (err) {
        console.warn("Backend chat error, routing locally.");
      }
    }

    // Local Mock router fallback
    setTimeout(() => {
      const textLower = text.toLowerCase();
      const responses = SAOCC_DATA.translations[language].responses;
      let reply = responses.default;
      
      if (textLower.includes("wheelchair") || textLower.includes("accessible") || textLower.includes("ada") || textLower.includes("elevat")) {
        reply = responses.accessibility;
      } else if (textLower.includes("transit") || textLower.includes("train") || textLower.includes("bus") || textLower.includes("manhattan") || textLower.includes("metro")) {
        reply = responses.transit;
      } else if (textLower.includes("recycle") || textLower.includes("sustainab") || textLower.includes("plastic") || textLower.includes("trash") || textLower.includes("bin")) {
        reply = responses.sustainability("plastic");
      } else if (textLower.includes("wait") || textLower.includes("queue") || textLower.includes("time") || textLower.includes("shortest")) {
        let shortestGate = "Gate D";
        let minWait = 99;
        SAOCC_DATA.stadium.sectors.filter(s => s.type === "gate").forEach(g => {
          if (facilitiesState[g.id] < minWait) {
            minWait = facilitiesState[g.id];
            shortestGate = g.name;
          }
        });
        reply = `According to current arena sensors, the shortest queue wait is at **${shortestGate}** which is around **${minWait} minutes**. Check details in the wait time panel.`;
      } else if (textLower.includes("gate") || textLower.includes("section") || textLower.includes("seat")) {
        reply = "Enter Section, Row details in the Seat Finder tool below the map to trigger path routing instructions.";
      }

      setIsTyping(false);
      setChatMessages(prev => [...prev, { id: Date.now() + 1, author: "bot", content: reply }]);
      speakText(reply);
    }, 1000);
  };

  const locateSeat = () => {
    const gateObject = SAOCC_DATA.stadium.sectors.find(s => s.id === selectedGate);
    const routeDescription = SAOCC_DATA.translations[language].responses.seatRoute(
      gateObject.name,
      selectedSection,
      selectedRow,
      selectedSeat
    );

    setChatMessages(prev => [...prev, { id: Date.now(), author: "bot", content: routeDescription }]);
    setHighlightedGate(selectedGate);
    speakText(routeDescription);
  };

  // Eco Sustainability waste report handler
  const reportWaste = (type) => {
    setSustainabilityStatus("Scanning item barcode...");
    
    setTimeout(() => {
      const advice = SAOCC_DATA.translations[language].responses.sustainability(type);
      setSustainabilityStatus(advice);
      
      const newPoints = ecoPoints + 15;
      setEcoPoints(newPoints);
      localStorage.setItem("saocc_eco_points", newPoints);
      
      setPointsStarAnimate(true);
      setTimeout(() => setPointsStarAnimate(false), 600);
    }, 800);
  };

  // Run AI incident analysis
  const runIncidentAiAnalysis = async (incId) => {
    // Set status to analyzing
    setIncidents(prev => prev.map(inc => inc.id === incId ? { ...inc, status: "Analyzing" } : inc));
    
    const inc = incidents.find(i => i.id === incId);
    
    if (backendStatus === "online") {
      try {
        const response = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Evaluate reported incident: Type=${inc.type}, Location=${inc.location}, Description="${inc.description}", Severity=${inc.severity}. Generate structured assessment coordinates.`,
            session_id: "react_session",
            user_id: "ops_operator",
            state: { facilitiesState, volunteers, activeScenario, ecoPoints }
          })
        });
        const result = await response.json();
        
        // Parse result
        let category = "Maintenance";
        let instructions = SAOCC_DATA.incidentProtocols[inc.type]?.actionInstructions || "";
        let requiredRole = SAOCC_DATA.incidentProtocols[inc.type]?.volunteerRole || "Crowd Control";
        
        // Attempt to extract recommended volunteer name from content
        const vol = volunteers.find(v => v.status === "Available" && v.role === requiredRole);
        const recName = vol ? vol.name : "Ramp Crew G";
        
        const aiAnalysis = {
          category,
          summary: result.response.substring(0, 100) + "...",
          instructions: result.response,
          requiredSpecialization: requiredRole,
          recommendedVolunteer: recName
        };

        setIncidents(prev => prev.map(i => i.id === incId ? { ...i, status: "Analyzed", aiAnalysis } : i));
        setSelectedIncidentId(incId);
        return;
      } catch (err) {
        console.warn("FastAPI analyzer query failed, falling back to local parser.");
      }
    }

    // Local Mockup Incident AI evaluator
    setTimeout(() => {
      const protocol = SAOCC_DATA.incidentProtocols[inc.type] || SAOCC_DATA.incidentProtocols.spill;
      const vol = volunteers.find(v => v.status === "Available" && v.role === protocol.volunteerRole);
      const recName = vol ? vol.name : "Ramp Crew G";

      const aiAnalysis = {
        category: protocol.category,
        summary: `Identified dynamic telemetry alert of type ${protocol.title} at ${inc.location}.`,
        instructions: protocol.actionInstructions,
        requiredSpecialization: protocol.volunteerRole,
        recommendedVolunteer: recName
      };

      setIncidents(prev => prev.map(i => i.id === incId ? { ...i, status: "Analyzed", aiAnalysis } : i));
      setSelectedIncidentId(incId);
    }, 1200);
  };

  // Volunteer Dispatcher
  const dispatchVolunteer = (incId) => {
    const inc = incidents.find(i => i.id === incId);
    if (!inc || !inc.aiAnalysis) return;

    // Locate recommended volunteer
    let vol = volunteers.find(v => v.status === "Available" && v.name === inc.aiAnalysis.recommendedVolunteer);
    if (!vol) {
      vol = volunteers.find(v => v.status === "Available");
    }

    if (!vol) {
      alert("All volunteer crew teams are dispatched! Wait for active tasks to resolve.");
      return;
    }

    // Update volunteer state to Active
    setVolunteers(prev => prev.map(v => v.id === vol.id ? { ...v, status: "Active", zone: inc.location } : v));
    
    // Update incident status to Dispatched
    setIncidents(prev => prev.map(i => i.id === incId ? { ...i, status: "Dispatched", assignedVolunteer: vol.id } : i));

    // Resolve timer based on severity (faster with higher simSpeed)
    const duration = inc.severity === "High" ? 8000 : inc.severity === "Medium" ? 5000 : 3000;
    setTimeout(() => {
      resolveIncident(incId, vol.id);
    }, duration / simSpeed);
  };

  const resolveIncident = (incId, volunteerId) => {
    setIncidents(prev => prev.map(i => i.id === incId ? { ...i, status: "Resolved" } : i));
    setVolunteers(prev => prev.map(v => v.id === volunteerId ? { ...v, status: "Available", zone: "Concourse Main" } : v));
  };

  const appendSystemAlert = (text) => {
    setChatMessages(prev => [...prev, { id: Date.now(), author: "system", content: text }]);
  };

  const handleMapNodeClick = (nodeId, sName) => {
    if (activeView === "fan-portal") {
      setChatInputText(`How is the queue wait time at ${sName}?`);
    } else {
      // Manual Incident Spawner
      const confirmSpawn = window.confirm(`Report operational safety alert at ${sName}?`);
      if (!confirmSpawn) return;

      const types = ["spill", "congestion", "medical", "technical", "sustainability_overflow"];
      const type = types[Math.floor(Math.random() * types.length)];
      const protocol = SAOCC_DATA.incidentProtocols[type];
      
      const timestamp = new Date().toTimeString().split(" ")[0];
      const newInc = {
        id: "i" + (100 + incidents.length + 1),
        type,
        location: sName,
        reportedAt: timestamp,
        description: `Field incident: ${protocol.title} reported at ${sName}. Check status.`,
        severity: protocol.defaultSeverity,
        status: "Reported",
        aiAnalysis: null,
        assignedVolunteer: null
      };

      setIncidents(prev => [newInc, ...prev]);
    }
  };

  return (
    <>
      {/* HEADER BAR */}
      <header>
        <div className="header-main">
          <div className="header-title-container">
            <div className="fifa-badge">FIFA WORLD CUP 2026</div>
            <h1>FIFA 2026 Smart Arena Portal</h1>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              AI Multi-Agent Stadium Operations Dashboard
            </span>
          </div>
          
          <div className="header-nav">
            <button 
              className={`nav-btn ${activeView === "fan-portal" ? "active" : ""}`}
              onClick={() => setActiveView("fan-portal")}
            >
              📱 Fan Portal
            </button>
            <button 
              className={`nav-btn ${activeView === "ops-command" ? "active" : ""}`}
              onClick={() => setActiveView("ops-command")}
            >
              📊 Operations Center
            </button>
            <button 
              className="nav-btn settings-trigger"
              onClick={() => setShowSettings(true)}
            >
              ⚙️
            </button>

          </div>
        </div>
        
        {/* RUNNING INFO TICKER */}
        <div className="ticker-container">
          <span className="ticker-title">
            <span className="pulse-dot"></span> LIVE TICKER
          </span>
          <div className="ticker-scroll-wrapper">
            <div className="ticker-scroll">
              <span className="ticker-item">Local Time: <strong>{localTime || "13:34:20"}</strong></span>
              <span className="ticker-item">Stadium Load: <strong>{crowdLevel}%</strong></span>
              <span className="ticker-item">Weather: <strong>{SAOCC_DATA.scenarios[activeScenario].weather}</strong></span>
              <span className="ticker-item">Transit Status: <strong>{SAOCC_DATA.scenarios[activeScenario].transit}</strong></span>
              <span className="ticker-item">
                Alerts: <strong style={{ color: activeScenario !== "standard" ? "var(--color-red)" : "inherit" }}>
                  {SAOCC_DATA.scenarios[activeScenario].alert}
                </strong>
              </span>
              {/* Duplicate items to loop scroll seamlessly */}
              <span className="ticker-item">Local Time: <strong>{localTime || "13:34:20"}</strong></span>
              <span className="ticker-item">Stadium Load: <strong>{crowdLevel}%</strong></span>
            </div>
          </div>
          <span style={{ fontSize: "0.75rem", color: backendStatus === "online" ? "var(--color-green)" : "var(--color-amber)", marginLeft: "auto", flexShrink: 0 }}>
            ● ADK: {backendStatus === "online" ? "CONNECTED" : "OFFLINE (MOCK)"}
          </span>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <main className="app-container">

        {/* 1. FAN PORTAL VIEW */}
        <section id="fan-portal-view" className={`view-panel ${activeView === "fan-portal" ? "active" : ""}`}>
          
          {/* Fan AI Assistant */}
          <div className="glass-card assistant-container">
            <div className="card-header">
              <div className="card-title">
                <span>💬 Matchday Assistant (GenAI)</span>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ background: "rgba(15,23,42,0.8)", border: "1px solid var(--card-border)", color: "white", borderRadius: 6, padding: 4, fontSize: "0.75rem" }}
              >
                <option value="en">English (EN)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
                <option value="ar">العربية (AR)</option>
                <option value="pt">Português (PT)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="ta">தமிழ் (TA)</option>
              </select>
            </div>
            
            <div className="chat-history">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`chat-message ${msg.author}`}>
                  {msg.author === "bot" ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/- (.*?)\n/g, "• $1<br/>") }} />
                  ) : (
                    msg.content
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="typing-indicator chat-message bot">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="suggestions-grid">
              {SAOCC_DATA.translations[language].suggestedQuestions.map((q, idx) => (
                <button 
                  key={idx} 
                  className="suggestion-btn"
                  onClick={() => {
                    setChatInputText(q);
                    // Autofocus input
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="chat-input-wrapper">
              <input 
                type="text" 
                className="chat-input"
                placeholder={SAOCC_DATA.translations[language].chatPlaceholder}
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button 
                className="chat-send-btn" 
                style={{ backgroundColor: isListening ? "#ef4444" : "#8b5cf6", marginRight: 4, width: 44, padding: 0 }}
                onClick={startVoiceRecognition}
                title="Voice Input (Speech-to-Text)"
              >
                {isListening ? "🔴" : "🎙️"}
              </button>
              <button 
                className="chat-send-btn" 
                style={{ backgroundColor: voiceEnabled ? "#10b981" : "#6b7280", marginRight: 4, width: 44, padding: 0 }}
                onClick={() => {
                  const next = !voiceEnabled;
                  setVoiceEnabled(next);
                  if (!next) window.speechSynthesis.cancel();
                }}
                title={voiceEnabled ? "Mute Voice readout" : "Enable Voice readout"}
              >
                {voiceEnabled ? "🔊" : "🔇"}
              </button>
              <button className="chat-send-btn" onClick={() => handleSendMessage()}>➔</button>
            </div>
          </div>

          {/* Central Wayfinding & SVG Map */}
          <div className="map-view-container">
            <div className="stadium-map-wrapper">
              <StadiumMap 
                highlightedGate={highlightedGate} 
                incidents={incidents}
                onNodeClick={handleMapNodeClick}
              />
            </div>

            {/* Seating Form */}
            <div className="glass-card seat-finder-card">
              <div className="card-header" style={{ border: "none", paddingBottom: 0 }}>
                <div className="card-title" style={{ fontSize: "0.95rem" }}>
                  <span>📍 {SAOCC_DATA.translations[language].seatFinder}</span>
                </div>
              </div>
              <div className="seat-form-row">
                <div className="form-group">
                  <label>Gate</label>
                  <select value={selectedGate} onChange={(e) => setSelectedGate(e.target.value)}>
                    <option value="gate-a">Gate A (North)</option>
                    <option value="gate-b">Gate B (East)</option>
                    <option value="gate-c">Gate C (Southeast)</option>
                    <option value="gate-d">Gate D (South)</option>
                    <option value="gate-e">Gate E (Southwest)</option>
                    <option value="gate-f">Gate F (West)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{SAOCC_DATA.translations[language].secLabel}</label>
                  <input type="text" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{SAOCC_DATA.translations[language].rowLabel}</label>
                  <input type="text" value={selectedRow} onChange={(e) => setSelectedRow(e.target.value)} />
                </div>
              </div>
              <button className="submit-btn" style={{ marginTop: 8 }} onClick={locateSeat}>
                {SAOCC_DATA.translations[language].btnFind}
              </button>
            </div>
          </div>

          {/* Right Panel: wait times and sustainability eco points */}
          <div className="right-panel-container">
            <div className="glass-card">
              <div className="card-header">
                <div className="card-title">
                  <span>⏲️ {SAOCC_DATA.translations[language].facilities}</span>
                </div>
              </div>
              <div className="facility-list">
                {SAOCC_DATA.stadium.sectors
                  .filter(s => s.id === "gate-a" || s.id === "gate-b" || s.id === "concession-1" || s.id === "concession-3" || s.id === "restroom-2")
                  .map(fac => {
                    const val = facilitiesState[fac.id] || 5;
                    const waitClass = val > 15 ? "slow" : val > 9 ? "mod" : "fast";
                    const maxVal = fac.type === "gate" ? 25 : 20;
                    const pct = Math.min((val / maxVal) * 100, 100);
                    const colorHex = waitClass === "slow" ? "var(--color-red)" : waitClass === "mod" ? "var(--color-amber)" : "var(--color-green)";
                    
                    return (
                      <div key={fac.id} className="facility-item">
                        <div className="facility-meta">
                          <span className="facility-name">{fac.name.split(" (")[0]}</span>
                          <span className={`facility-eta ${waitClass}`}>{val} min wait</span>
                        </div>
                        <div className="queue-bar-bg">
                          <div className="queue-bar-fill" style={{ width: `${pct}%`, backgroundColor: colorHex }}></div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>

            <div className="glass-card sustainability-card">
              <div className="card-header">
                <div className="card-title">
                  <span>♻️ {SAOCC_DATA.translations[language].sustainability}</span>
                </div>
              </div>
              <div className="eco-points-display">
                <span className="points-label">{SAOCC_DATA.translations[language].ecoPoints}:</span>
                <span className="points-value">
                  <span className={`points-star ${pointsStarAnimate ? "animate" : ""}`}>⭐</span>
                  {ecoPoints} {SAOCC_DATA.translations[language].ecoPointsShort}
                </span>
              </div>
              
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center" }}>
                Sort concessions waste to unlock stadium points:
              </div>
              
              <div className="sustainability-grid">
                <button className="waste-btn" onClick={() => reportWaste("plastic")}>
                  <span className="waste-icon">🥤</span>
                  <span className="waste-name">Plastic Bottle</span>
                </button>
                <button className="waste-btn" onClick={() => reportWaste("can")}>
                  <span className="waste-icon">🥫</span>
                  <span className="waste-name">Alum Can</span>
                </button>
                <button className="waste-btn" onClick={() => reportWaste("food")}>
                  <span className="waste-icon">🍕</span>
                  <span className="waste-name">Food Scraps</span>
                </button>
                <button className="waste-btn" onClick={() => reportWaste("paper")}>
                  <span className="waste-icon">📦</span>
                  <span className="waste-name">Paper Box</span>
                </button>
              </div>
              
              <div className="sustainability-status">
                {sustainabilityStatus}
              </div>
            </div>
          </div>
        </section>

        {/* 2. OPERATIONS COMMAND CENTER */}
        <section id="ops-command-view" className={`view-panel ${activeView === "ops-command" ? "active" : ""}`}>
          <div className="ops-main-col">
            <div className="glass-card ops-map-card">
              <div className="card-header">
                <div className="card-title">
                  <span>🏟️ Stadium Operational Telemetry Map</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  Click sectors to mock maintenance, crowd, or medical alerts.
                </div>
              </div>
              
              <div className="stadium-map-wrapper">
                <StadiumMap 
                  highlightedGate={null} 
                  incidents={incidents}
                  onNodeClick={handleMapNodeClick}
                />
              </div>
            </div>

            <div className="ops-row-lower">
              {/* Incident Feed */}
              <div className="glass-card" style={{ height: "100%" }}>
                <div className="card-header">
                  <div className="card-title">
                    <span>⚠️ Live Incidents Feed</span>
                  </div>
                </div>
                <div className="incident-list-container">
                  {incidents.map(inc => (
                    <div 
                      key={inc.id} 
                      className={`incident-item severity-${inc.severity.toLowerCase()} ${inc.status === "Resolved" ? "resolved" : ""}`}
                      onClick={() => setSelectedIncidentId(inc.id)}
                    >
                      <div className="incident-info">
                        <span className="incident-title">{inc.description.substring(0, 35)}...</span>
                        <span className="incident-time-loc">{inc.location} • {inc.reportedAt}</span>
                      </div>
                      <div className="incident-actions">
                        <span className={`severity-pill ${inc.severity.toLowerCase()}`}>{inc.severity}</span>
                        {inc.status === "Reported" ? (
                          <button 
                            className="incident-btn analyze-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              runIncidentAiAnalysis(inc.id);
                            }}
                          >
                            Analyze AI
                          </button>
                        ) : inc.status === "Analyzing" ? (
                          <span style={{ fontSize: "0.72rem" }}>Analyzing...</span>
                        ) : inc.status === "Analyzed" ? (
                          <button 
                            className="incident-btn" 
                            style={{ backgroundColor: "var(--color-blue)", color: "white", borderColor: "#60a5fa" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatchVolunteer(inc.id);
                            }}
                          >
                            Dispatch
                          </button>
                        ) : inc.status === "Dispatched" ? (
                          <span style={{ fontSize: "0.75rem", color: "var(--color-blue)", fontWeight: 600 }}>
                            ● Dispatching
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Resolved</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Assessment Drawer */}
              <div className="glass-card" style={{ height: "100%" }}>
                <div className="ai-analysis-drawer">
                  <div className="ai-header-decor">
                    <span>⚡ AI Incident Assessment</span>
                  </div>
                  {selectedIncidentId && incidents.find(i => i.id === selectedIncidentId)?.aiAnalysis ? (
                    (() => {
                      const inc = incidents.find(i => i.id === selectedIncidentId);
                      return (
                        <>
                          <div className="ai-meta-row" style={{ marginTop: 2 }}>
                            <span>Category: <strong>{inc.aiAnalysis.category}</strong></span>
                            <span>Threat: <strong style={{ color: inc.severity === "High" ? "var(--color-red)" : "var(--color-amber)" }}>{inc.severity}</strong></span>
                          </div>
                          <div>
                            <strong>Incident Description:</strong>
                            <p style={{ marginTop: 2, color: "var(--text-primary)" }}>{inc.description}</p>
                          </div>
                          <div>
                            <strong>AI Recommended Actions:</strong>
                            <div className="ai-instructions">{inc.aiAnalysis.instructions}</div>
                          </div>
                          <div className="ai-meta-row" style={{ marginTop: 4 }}>
                            <span>Specialty: <strong>{inc.aiAnalysis.requiredSpecialization}</strong></span>
                            <span>Assigned Staff: <strong>{inc.aiAnalysis.recommendedVolunteer}</strong></span>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div style={{ padding: "20px 10px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                      Select an incident and click "Analyze AI" to run the ADK Multi-Agent review panel.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side: simulation parameters, tactical logs, volunteers list */}
          <div className="ops-side-col">
            <div className="glass-card">
              <div className="card-header">
                <div className="card-title">
                  <span>⚙️ Simulation Parameters</span>
                </div>
              </div>
              <div className="settings-group">
                <label>Active Scenario</label>
                <select value={activeScenario} onChange={(e) => setActiveScenario(e.target.value)} className="scenario-select">
                  <option value="standard">Standard Conditions (Nominal)</option>
                  <option value="storm">Severe Storm Event (Lightning Delay)</option>
                  <option value="transit_delay">Secaucus Rail Signal Interruption</option>
                  <option value="heatwave">Extreme Temperature Advisory</option>
                </select>
              </div>
              <div className="settings-group" style={{ marginTop: 4 }}>
                <label>Simulation Speed</label>
                <select value={simSpeed} onChange={(e) => setSimSpeed(parseFloat(e.target.value))} className="scenario-select">
                  <option value="0">Paused</option>
                  <option value="1">1x Speed</option>
                  <option value="2">2x Speed</option>
                  <option value="5">5x Speed</option>
                </select>
              </div>
            </div>

            <div className="glass-card tactical-container">
              <div className="tactical-box">
                <div className="tactical-header-decor">
                  <span>⚡ AI Tactical Operations Recommendation</span>
                </div>
                {tacticalLoading ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                ) : (
                  <div 
                    style={{ whiteSpace: "pre-line", marginTop: 4, lineHeight: 1.45, fontSize: "0.78rem" }}
                    dangerouslySetInnerHTML={{ __html: tacticalAdvice.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/- (.*?)\n/g, "• $1<br/>") }}
                  />
                )}
              </div>
            </div>

            <div className="glass-card" style={{ flexGrow: 1 }}>
              <div className="card-header">
                <div className="card-title">
                  <span>🏃 Volunteer Dispatch roster</span>
                </div>
              </div>
              <div className="volunteer-grid">
                {volunteers.map(v => (
                  <div key={v.id} className="volunteer-card">
                    <div className="vol-profile">
                      <span className="vol-name">{v.name}</span>
                      <span className="vol-role">{v.role} • <strong>{v.languages.join("/")}</strong></span>
                      <span className="vol-zone">📍 {v.zone}</span>
                    </div>
                    <div className="vol-status-block">
                      <span className={`status-badge ${v.status.toLowerCase()}`}>{v.status}</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{v.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Settings Config Panel</span>
              <button className="modal-close" onClick={() => setShowSettings(false)}>&times;</button>
            </div>
            
            <div className="settings-group">
              <label>API Mode Selector</label>
              <select 
                value={apiMode}
                onChange={(e) => setApiMode(e.target.value)}
              >
                <option value="mock">Offline Simulation Mode (Default)</option>
                <option value="live">Live Gemini API Integration</option>
              </select>
            </div>
            
            <div className="settings-group">
              <label>Google AI Studio (Gemini) API Key</label>
              <input 
                type="text" 
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: 2 }}>
                Your key is stored locally in your browser cache and is only sent directly to Google Gemini's REST API endpoint.
              </span>
            </div>
            
            <button 
              className="submit-btn" 
              style={{ marginTop: 8 }}
              onClick={() => handleSaveSettings(apiMode, apiKey)}
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// STADIUM SVG MAP COMPONENT
function StadiumMap({ highlightedGate, incidents, onNodeClick }) {
  const width = 300;
  const height = 400;
  
  // Calculate pathway paths
  let pathD = "";
  if (highlightedGate) {
    const coords = SAOCC_DATA.stadium.pathways[highlightedGate];
    const gateNode = SAOCC_DATA.stadium.sectors.find(s => s.id === highlightedGate);
    if (coords && gateNode) {
      pathD = `M ${gateNode.x} ${gateNode.y} Q 150 200, ${coords[0]} ${coords[1]}`;
    }
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="map-svg-element">
      <defs>
        <radialGradient id="field-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#166534" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0"/>
        </radialGradient>
        <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      
      {/* Field Grass Outer */}
      <ellipse cx="150" cy="200" rx="100" ry="150" fill="url(#field-glow)" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
      
      {/* Central Football Pitch */}
      <rect x="110" y="140" width="80" height="120" fill="rgba(22, 101, 52, 0.3)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" rx="5"/>
      <line x1="110" y1="200" x2="190" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <circle cx="150" cy="200" r="15" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      
      {/* Inner Seating Rings */}
      <ellipse cx="150" cy="200" rx="120" ry="170" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="15"/>
      <ellipse cx="150" cy="200" rx="135" ry="185" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12"/>
      <ellipse cx="150" cy="200" rx="148" ry="198" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10"/>
      
      {/* Pathways line */}
      {pathD && (
        <path d={pathD} fill="none" stroke="var(--color-blue)" strokeWidth="3" className="path-line" strokeLinecap="round"/>
      )}

      {/* Interactive Nodes */}
      {SAOCC_DATA.stadium.sectors.map(s => {
        const hasIncident = incidents.find(inc => inc.location.split(" (")[0] === s.name.split(" (")[0] && inc.status !== "Resolved");
        let nodeColor = s.color;
        let glowClass = {};
        
        if (hasIncident) {
          nodeColor = hasIncident.severity === "High" ? "var(--color-red)" : "var(--color-amber)";
          glowClass = { filter: "url(#glow-effect)" };
        }
        
        return (
          <g 
            key={s.id} 
            className="sector-node" 
            onClick={() => onNodeClick(s.id, s.name)}
          >
            {hasIncident && (
              <circle 
                cx={s.x} 
                cy={s.y} 
                r={s.radius + 6} 
                fill="none" 
                stroke={nodeColor} 
                strokeWidth="2" 
                className="pulse-dot alert" 
                style={{ transformOrigin: `${s.x}px ${s.y}px` }}
              />
            )}
            <circle cx={s.x} cy={s.y} r={s.radius} fill={nodeColor} opacity="0.8" style={glowClass}/>
            <text x={s.x} y={s.y + 4} fill="#fff" fontSize="8" fontWeight="700" textAnchor="middle" pointerEvents="none">
              {s.type === "gate" ? s.id.split("-")[1].toUpperCase() : s.type === "concession" ? "C" + s.id.split("-")[1] : "WC"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
