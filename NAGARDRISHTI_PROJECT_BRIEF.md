# SAMADHAAN
## Project Brief & Vision Document
**Version 1.0 — SIH 2024 Submission**

---

## One-Line Vision

> **Transform Indian governance from reactive complaint management to predictive civic intelligence — one ward at a time.**

---

## The Problem (Specific & Measurable)

Indian civic governance suffers from three acute, interconnected failures:

### 1. The Complaint Graveyard Problem
Citizens file complaints. Complaints sit. Nothing happens.

- A 2023 survey found **63% of civic complaints on existing portals go unresolved for 30+ days**
- Officers have no way to prioritize — a broken streetlight gets the same urgency as a flooded road
- Duplicate complaints (same pothole filed 40 times) clog the system and hide real signal
- **Result**: Citizens lose trust. Officers are overwhelmed. Problems compound.

### 2. The Blindspot Problem
Government responds *after* disasters. It never *predicts* them.

- Municipal bodies have 3 years of complaint history, rainfall data, and GIS records — **but no system connects them**
- District Collectors find out about a waterlogging crisis when Twitter starts trending, not from their own systems
- **Result**: ₹4,200 crore lost annually to preventable civic infrastructure failures (NIPFP estimate)

### 3. The Coordination Failure
When a road floods, it involves PWD, drainage, traffic police, and NDRF — four departments, zero coordination.

- No single officer can see all department statuses on one screen
- Escalation happens through WhatsApp groups and phone calls
- **Result**: 48-hour average response time for multi-department incidents. Should be 4 hours.

---

## Our Answer: SAMADHAAN

**SAMADHAAN is not a complaint portal. It is the missing intelligence layer between citizens and government.**

It does three things no existing platform does:

1. **Converts citizen noise into government signal** — AI deduplicates, categorizes, and prioritizes complaints in real time
2. **Predicts civic failures before they happen** — combining complaint trends, weather, and location history
3. **Gives every officer a single source of truth** — one dashboard, all departments, live data

---

## Platform Architecture (3 Layers)

```
┌─────────────────────────────────────────────────────┐
│  LAYER 1: CITIZEN APP (Mobile)                      │
│  Voice complaints → AI categorization → Live status │
├─────────────────────────────────────────────────────┤
│  LAYER 2: GOVERNMENT COMMAND CENTER (Web)           │
│  Heatmaps → Predictive alerts → Department routing  │
├─────────────────────────────────────────────────────┤
│  LAYER 3: AI ENGINE (Backend)                       │
│  Deduplication → Priority scoring → Prediction      │
└─────────────────────────────────────────────────────┘
```

---

## Layer 1 — Citizen App

**Design principle**: So simple that a 65-year-old in Tier 3 can file a complaint in under 60 seconds.

### Core Features

| Feature | What it does | Why it matters |
|---|---|---|
| **Voice Complaint** | Speak in Hindi/regional language — AI transcribes, categorizes, routes | Removes literacy barrier. 40% of Indian internet users prefer voice |
| **Photo Upload** | Take photo of damage — AI detects road damage, garbage, waterlogging | Removes need for written description. Evidence attached automatically |
| **Complaint Tracker** | Real-time status: Received → Assigned → In Progress → Resolved | Citizens know something is happening. Reduces repeat calls to helpline |
| **Nearby Map** | See complaints filed within 1km radius | Shows civic activity. Prevents duplicate filing |
| **Emergency SOS** | One button → sends location to nearest municipal emergency contact | Flood, accident, gas leak — instant escalation |

### What We're NOT Building in v1
- Gamification / reward points
- Social feed / community discussion
- Electricity/water real-time status (requires SCADA — not available)
- In-app payments

---

## Layer 2 — Government Command Center

**Design principle**: One screen. Everything an officer needs. Zero training required.

### The Central Dashboard (For District Collector / Commissioner)

**Left Panel — Live City Pulse**
- Complaint heatmap overlaid on ward boundaries (OpenStreetMap)
- Color intensity = complaint density in last 24/48/72 hours
- Click any ward → drill down to complaint list

**Center Panel — Predictive Alerts**
- "⚠️ Ward 14: 18 road damage complaints in 3 days post-rainfall. Historical pattern: escalates to flooding. Recommended action: PWD inspection today."
- "🔴 Ward 7: Garbage complaints up 340% this week. Action: Additional vehicle deployment."
- These are not automated actions — they are AI-recommended actions. Officer approves/rejects.

**Right Panel — Department Status Board**
- PWD: 12 open / 3 in-progress / 45 resolved (this week)
- Drainage: 8 open / 1 critical
- Traffic: 4 open
- One-click escalation with automatic officer notification

**Resolution SLA Tracker**
- Which complaints are breaching the 72-hour resolution window
- Which officers have the highest resolution rate
- Trend over 30/60/90 days

### What We're NOT Building in v1
- Police dashboard (political sensitivity, scope creep)
- Budget recommendation (requires internal financial data)
- 12 separate role-specific dashboards
- Digital twin simulation

---

## Layer 3 — AI Engine

**Design principle**: Each AI feature must solve one specific, demonstrable problem.

### AI Features (In Priority Order)

#### 1. Complaint Deduplication
- **Problem**: Same pothole gets reported 40 times. System is flooded with noise.
- **Solution**: NLP similarity matching + location clustering. 40 complaints become 1 ticket with a "reported by 40 citizens" counter.
- **Model**: Sentence-BERT embeddings + DBSCAN clustering on (text, lat, long)
- **Dataset**: Synthetic complaint dataset generated from real ward complaint categories (BBMP, PMC public data)

#### 2. AI Priority Scoring
- **Problem**: Officers can't tell which complaint to address first.
- **Solution**: Composite score based on: complaint type + zone risk level + weather conditions + historical recurrence + number of reporters
- **Model**: Weighted rule-based scorer + logistic regression trained on historical resolution priority
- **Output**: LOW / MEDIUM / HIGH / CRITICAL badge on every complaint

#### 3. Predictive Civic Alerts (The Core Differentiator)
- **Problem**: Flooding, road collapse, garbage overflow — all preventable if acted on early.
- **Solution**: Time-series analysis on complaint frequency by ward + weather correlation
- **Model**: Facebook Prophet for trend forecasting + rule-based monsoon risk overlay
- **Example**: "Ward 12 had 8 waterlogging complaints in June 2022, 11 in June 2023. Forecast: 15+ this June. Monsoon starts in 11 days."
- **Data**: Historical complaint logs (synthetic from real patterns) + IMD weather API (public)

#### 4. Voice-to-Complaint (Regional Language)
- **Problem**: 40% of users prefer voice. English forms exclude rural users.
- **Solution**: Speech-to-text → complaint category extraction → department routing
- **Model**: OpenAI Whisper (multilingual, runs locally) → IndicBERT for categorization
- **Languages**: Hindi, Marathi, Tamil, Bengali, Telugu (Phase 1)

#### 5. Image-Based Damage Detection
- **Problem**: Citizens don't know how to describe damage. Text complaints are vague.
- **Solution**: Upload photo → AI detects category (road damage / garbage / waterlogging / broken infrastructure)
- **Model**: YOLOv8 fine-tuned on a curated dataset of Indian civic damage images
- **Dataset**: Scraped from BMC, BBMP public grievance portals + manual curation (500-1000 images sufficient for demo)

#### 6. Auto Department Routing
- **Problem**: Complaints are manually assigned. Wrong department gets complaints. Delays increase.
- **Solution**: Text classifier maps complaint → department (PWD / Drainage / Traffic / Sanitation / Electricity)
- **Model**: Fine-tuned DistilBERT classifier, 7 classes
- **Accuracy target**: 92%+ on held-out test set

---

## The Demonstration Scenario (SIH Demo Flow)

**Total demo time: 8 minutes**

```
Minute 1-2: CITIZEN SIDE
  → Ramesh (65, speaks Hindi) opens app
  → Says: "Mere gali mein sadak toot gayi hai aur paani bhar raha hai"
  → App transcribes → AI detects: Road Damage + Waterlogging → Routes to PWD + Drainage
  → Ramesh sees: "Complaint filed. Expected resolution: 48 hours."

Minute 3-4: AI ENGINE (Show the magic)
  → 23 similar complaints in Ward 7 this week alone
  → Deduplication: 23 → 1 cluster ticket, reported by 23 citizens
  → Priority score: CRITICAL (monsoon season + flood-risk zone + 23 reporters)
  → Predictive model: "This ward flooded in July 2022 and 2023. Pattern match: 87% probability of repeat."

Minute 5-6: GOVERNMENT DASHBOARD
  → Collector opens command center
  → Ward 7 is glowing red on the heatmap
  → Predictive alert appears: "Deploy PWD + drainage team to Ward 7 today"
  → Collector clicks: Approve → Notify departments
  → Both departments receive task assignment in their queue

Minute 7-8: OUTCOME
  → Drainage team deployed proactively — before flooding begins
  → Ward 7 resolved before it becomes a crisis
  → "Last year: 40 complaints, ₹18 lakh damage repair. This year: Prevented."
```

This is the story. Everything else supports this story.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Mobile App | React Native (Expo) | Cross-platform, fast development |
| Web Dashboard | React + Vite | Already in workspace. Fast. |
| Backend API | Node.js + Express | Already in workspace |
| Database | PostgreSQL + PostGIS | Location-aware queries |
| AI Microservice | Python + FastAPI | Whisper, YOLOv8, scikit-learn |
| Maps | OpenStreetMap + Leaflet | Free, works offline, India coverage |
| Voice | OpenAI Whisper (local) | No API cost, works without internet |
| Image AI | YOLOv8 | Lightweight, fast inference |
| NLP | IndicBERT / DistilBERT | Indian language support |
| Forecasting | Facebook Prophet | Simple, interpretable predictions |
| Deployment | Railway / Render (demo) | Free tier, fast deploy |

---

## Team of 6 — Responsibility Map

| Member | Role | What they own |
|---|---|---|
| A | Full-stack lead | API server, database schema, deployment |
| B | AI/ML Engineer | Deduplication, priority scoring, prediction models |
| C | AI/ML Engineer | Voice (Whisper), image detection (YOLOv8), NLP routing |
| D | Mobile Developer | React Native citizen app |
| E | Frontend Developer | Government command center dashboard |
| F | Data + DevOps | Seed data, synthetic datasets, CI/CD, demo setup |

---

## 6-Week Sprint Plan

| Week | Goal |
|---|---|
| 1 | DB schema + API spec + AI model selection + seed data |
| 2 | Backend CRUD routes + Deduplication model + Voice prototype |
| 3 | Citizen app (complaint filing, tracker, map) + AI categorization |
| 4 | Government dashboard (heatmap, SLA tracker, department board) |
| 5 | Predictive alert engine + Image detection + Integration |
| 6 | Demo polish, edge case handling, presentation, rehearsal |

---

## What Makes This Win

**Against 90% of SIH teams**:
- They build: Complaint → Department → Status
- We build: Complaint + Location + Weather + History + Density = **Predicted Action**

**The 3 things judges remember**:
1. The demo where a 65-year-old's voice complaint triggers a predictive government response
2. The "23 complaints → 1 cluster → prevented a flood" story
3. That it's deployable — not a prototype, but a system with real data, real AI, real outcomes

**Weaknesses to address proactively**:
- *"Where does the real data come from?"* → We use synthetic data calibrated against real municipal records (BBMP ward statistics, IMD weather). Production deployment would connect to real APIs.
- *"Can this scale?"* → PostGIS + indexed queries handle 1M complaints. AI microservices are stateless and horizontally scalable.
- *"What about data privacy?"* → No Aadhaar linkage in v1. Phone number + OTP only. Complaint data anonymized in analytics.

---

## What This Is Not

- ❌ Not a complaint portal with an AI sticker
- ❌ Not a collection of dashboards with fake data
- ❌ Not a Digital Twin requiring sensors we don't have
- ❌ Not trying to solve everything for everyone

## What This Is

- ✅ A focused, demonstrable platform that solves 3 real, acute problems
- ✅ Built on real AI (not rule-based heuristics labeled "AI")
- ✅ Deployable in a real Smart City within 6 months with live data feeds
- ✅ A genuine upgrade to how Indian municipal governance works

---

*SAMADHAAN — Built for SIH. Designed for India.*
