# Karyukti AI | Enterprise Agentforce Platform

Karyukti AI is a production-ready, full-stack monorepo web application inspired by Salesforce Agentforce. It implements a complete AI Agent orchestration platform featuring secure role-based workspaces, visual triggers, visual builders, voice recognition, federated CRM lookups, and the **Einstein Trust Layer inspired security interceptors**.

To satisfy the **"without using any API"** requirement, Karyukti packages an offline **Atlas Reasoning Engine** out of the box that compiles plans, schedules agent subtasks, and performs contextual actions locally. It also offers a Settings input to plug in a live Gemini API key if desired.

---

## 🛡️ Security & Einstein Trust Layer Features

1. **Role-Based Access Control (RBAC)**: Enforces API boundaries across three levels:
   - **Admin**: Complete system controls, MCP setups, deployment toggles, and audit logs.
   - **Manager**: Agent definitions, workflow connections, and CRM summary metrics.
   - **Worker**: Workspace chat, microphone triggers, and client files lookup.
2. **PII Masking Interceptor**: Express middleware automatically strips sensitive data patterns (SSNs, credit card numbers, phone digits) from raw queries before passing inputs to the LLM compiler.
3. **Prompt Moderation**: Blocks malicious injection phrases (e.g. `ignore previous instructions`, `bypass admin`) and records violation events in the logs.
4. **Immutable Audit Trail**: Collects all login attempts, workspace chats, updates, and blocks in a searchable event log.

---

## 🎨 Switchable HSL Themes

The interface supports five themes that update instantly across all styles:
1. **Eclipse Dark**: Sleek deep dark mode.
2. **Enterprise Light**: Corporate high contrast light layout.
3. **Salesforce Ocean**: Light blue Salesforce-inspired theme.
4. **Eucalyptus Sage**: Soft green palette to prevent eye fatigue.
5. **Sepia Comfort**: Warm amber yellowish soft paper view.

---

## 🚀 Running the App

### Option A: Local Terminal Run (Immediate)

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   *Starts backend Express server on `http://localhost:3001`*

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   *Starts Vite dev server on `http://localhost:3000`*

### Option B: Docker Compose Run

Spin up both services inside Docker containers:
```bash
docker-compose up --build
```

## 🎛️ Bypassing Login (Zero-Login Workspace)

There is **no login page** in the codebase.
- On startup, the application logs you in automatically.
- A **Console Mode** switcher dropdown is located in the top-right header of the console.
- Selecting **Admin Panel**, **Manager Panel**, or **Worker Panel** instantly updates all dashboard panels, navigation sidebars, and API permissions in the background.
