# Karyukti AI | Enterprise Agentforce Platform

</p>

<p align="center">

Build Once. Automate Every Business.

Karyukti AI is an enterprise-grade Multi-Agent Business Automation Platform that enables organizations to build, deploy, and manage intelligent AI agents through a secure, scalable, and modern workspace inspired by enterprise automation platforms.

</p> It implements a complete AI Agent orchestration platform featuring secure role-based workspaces, visual triggers, visual builders, voice recognition, federated CRM lookups, and the **Einstein Trust Layer inspired security interceptors**.

To satisfy the **"without using any API"** requirement, Karyukti packages an offline **Atlas Reasoning Engine** out of the box that compiles plans, schedules agent subtasks, and performs contextual actions locally. It also offers a Settings input to plug in a live Gemini API key if desired.
watch demo https://github.com/user-attachments/assets/379b89d3-116b-449e-968f-0792acdc61ce


**🌍 Problem Statement**

<p>Modern businesses rely on multiple disconnected applications for CRM, HR, Sales, Customer Support, Analytics, Knowledge Management, and Workflow Automation. Employees frequently switch between platforms, causing fragmented information, repetitive tasks, slower decision-making, and increased operational costs.

While enterprise AI platforms exist, many are expensive, difficult to customize, and inaccessible for startups, educational institutions, and small to medium-sized organizations.

Karyukti AI addresses this challenge by providing a unified enterprise platform where intelligent AI agents collaborate to automate business processes within a single workspace.</p>
**💡 Solution**

<p>Karyukti AI is a production-ready Enterprise AI Agent Platform inspired by modern business automation systems. Instead of depending on a single chatbot, the platform uses a collaborative Multi-Agent architecture where specialized agents work together to solve business problems.

The application begins with a Startup Wizard that personalizes the workspace by selecting a business domain, user role, and preferred theme. Based on these selections, users enter dedicated Admin, Manager, or Worker dashboards with role-specific permissions and tools.

The platform supports:

Multi-Agent Collaboration
Business-specific AI Configuration
Custom Agent Builder
Prebuilt Business Agents
Visual Workflow Builder
Enterprise CRM
Knowledge Base
Secure Role-Based Access
Business Analytics
Five Dynamic Themes
Docker Deployment</p>
## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    Startup Wizard                           │
│           Business → Role → Theme Selection                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                 Enterprise Dashboard                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌────────┐      ┌────────┐      ┌────────┐
   │ Admin  │      │Manager │      │Worker  │
   └────────┘      └────────┘      └────────┘
        │               │               │
        └───────────────┼───────────────┘
                        ▼
      ┌─────────────────────────────────────┐
      │   Multi-Agent Coordination Layer    │
      └─────────────────────────────────────┘
                        │
      ┌────────┬────────┬────────┬────────┬────────┐
      ▼        ▼        ▼        ▼        ▼
  Planner     CRM       HR    Workflow Analytics
   Agent     Agent     Agent    Agent     Agent
                        │
                        ▼
      Knowledge Base • CRM • Workflows
                        │
                        ▼
                  PostgreSQL Database
```
**🎨 Switchable HSL Themes**

<p>The interface supports five themes that update instantly across all styles:
1. **Eclipse Dark**: Sleek deep dark mode.
2. **Enterprise Light**: Corporate high contrast light layout.
3. **Salesforce Ocean**: Light blue Salesforce-inspired theme.
4. **Eucalyptus Sage**: Soft green palette to prevent eye fatigue.
5. **Sepia Comfort**: Warm amber yellowish soft paper view.

<img width="956" height="503" alt="Image" src="https://github.com/user-attachments/assets/cf92c7a0-5119-4fed-9590-74ba0215f4e5" />

<img width="951" height="503" alt="Image" src="https://github.com/user-attachments/assets/109be5b3-08d1-4a6d-a36c-72bb705a2372" />
</p>
 **🛡️ Security & Einstein Trust Layer Features
**
<p>1. **Role-Based Access Control (RBAC)**: Enforces API boundaries across three levels:
   - **Admin**: Complete system controls, MCP setups, deployment toggles, and audit logs.
   - **Manager**: Agent definitions, workflow connections, and CRM summary metrics.
   - **Worker**: Workspace chat, microphone triggers, and client files lookup.
2. **PII Masking Interceptor**: Express middleware automatically strips sensitive data patterns (SSNs, credit card numbers, phone digits) from raw queries before passing inputs to the LLM compiler.
3. **Prompt Moderation**: Blocks malicious injection phrases (e.g. `ignore previous instructions`, `bypass admin`) and records violation events in the logs.
4. **Immutable Audit Trail**: Collects all login attempts, workspace chats, updates, and blocks in a searchable event log.</p>
**## 🚀 Running the App**


```text
**⚙️ Technology Stack**
Layer	Technologies
Frontend        	React, TypeScript, Tailwind CSS, Vite
Backend        	Node.js, Express
Database       	PostgreSQL, Prisma ORM
Authentication	   JWT & Role-Based Access Control
State             Management	Zustand
Deployment     	Docker
Architecture	   Multi-Agent System + MCP Ready
```


**📂 Project Structure**
```text
Karyukti-AI/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── wizard/
│   ├── store/
│   └── layouts/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── prisma/
│   └── agents/
│
├── docker-compose.yml
└── README.md
```

**🚀 Getting Started**
<p>1. Clone Repository
git clone https://github.com/your-username/Karyukti-AI.git

cd Karyukti-AI
2. Install Dependencies
cd frontend
npm install

cd ../backend
npm install
3. Configure Environment

Create a .env file:

DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=4000

⚠️ Do not commit API keys, passwords, or secrets to GitHub.
4. Start the Application

Backend

cd backend
npm run dev

Frontend

cd frontend
npm run dev
5. Docker (Optional)
docker compose up --build
</p>

**📜 License**

This project is released under the MIT License.

Developed as a Hackathon Submission to demonstrate an enterprise-grade Multi-Agent Business Automation Platform inspired by modern enterprise AI systems.

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
  <div align="center">

**⭐ Karyukti AI**
Enterprise Multi-Agent Business Automation Platform

Build Once. Automate Every Business.

Made with ❤️ using React • TypeScript • Node.js • PostgreSQL • Prisma • Docker

</div>
