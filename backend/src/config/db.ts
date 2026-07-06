import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

const DB_FILE = path.join(__dirname, '../../database.json');

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'worker';
  businessType: string | null;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  businessType: string;
  goal: string;
  description: string;
  instructions: string;
  files: string[];
  tools: string[];
  memory: boolean;
  temperature: number;
  reasoningLevel: 'low' | 'medium' | 'high';
  modelSelection: string;
  responseStyle: string;
  permissions: string[];
  workflow: string[];
  isPrebuilt: boolean;
  isDeployed: boolean;
  publishedAt: string | null;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  assignedTo: string | null;
  notes: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  closeDate: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  assignedTo: string | null;
  description: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  employees: number;
  revenue: number;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  company: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  dueDate: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  company: string;
  time: string;
  duration: number;
  notes: string;
  createdAt: string;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  size: number;
  content: string;
  type: string;
  uploadedAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    id: string;
    type: 'trigger' | 'condition' | 'action' | 'notification' | 'api' | 'email' | 'crm';
    label: string;
    config: any;
  }>;
  isDeployed: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  username: string | null;
  action: string;
  details: string;
  timestamp: string;
}

export interface McpServer {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  url: string;
  type: string;
  tools: string[];
  connectedAt: string;
}

interface DatabaseSchema {
  users: User[];
  agents: Agent[];
  crm_leads: Lead[];
  crm_contacts: Contact[];
  crm_deals: Deal[];
  crm_tasks: Task[];
  crm_companies: Company[];
  crm_invoices: Invoice[];
  crm_meetings: Meeting[];
  knowledge_documents: KnowledgeDocument[];
  workflows: Workflow[];
  audit_logs: AuditLog[];
  mcp_servers: McpServer[];
}

class Database {
  private data: DatabaseSchema = {
    users: [],
    agents: [],
    crm_leads: [],
    crm_contacts: [],
    crm_deals: [],
    crm_tasks: [],
    crm_companies: [],
    crm_invoices: [],
    crm_meetings: [],
    knowledge_documents: [],
    workflows: [],
    audit_logs: [],
    mcp_servers: []
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.seed();
      }
    } catch (error) {
      console.error('Error loading database, seeding fresh:', error);
      this.seed();
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  private seed() {
    console.log('Seeding initial database...');
    
    // Default Passwords (all set to 'password123' for ease of evaluation)
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('password123', salt);

    // 1. Seed Users
    this.data.users = [
      {
        id: 'u-admin',
        username: 'admin@agentforce.com',
        passwordHash,
        role: 'admin',
        businessType: 'Retail',
        createdAt: new Date().toISOString()
      },
      {
        id: 'u-manager',
        username: 'manager@agentforce.com',
        passwordHash,
        role: 'manager',
        businessType: 'Healthcare',
        createdAt: new Date().toISOString()
      },
      {
        id: 'u-worker',
        username: 'worker@agentforce.com',
        passwordHash,
        role: 'worker',
        businessType: 'Finance',
        createdAt: new Date().toISOString()
      }
    ];

    // 2. Seed Prebuilt Agents
    const prebuiltTypes = [
      { name: 'Sales Agent', goal: 'Drive leads and close customer deals', desc: 'Prebuilt automated sales qualification agent.' },
      { name: 'Support Agent', goal: 'Resolve tickets and handle customer issues', desc: 'Prebuilt standard customer support agent.' },
      { name: 'Marketing Agent', goal: 'Design campaigns and analyze engagement', desc: 'Prebuilt content planner and campaign auditor.' },
      { name: 'HR Agent', goal: 'Streamline employee onboarding and request management', desc: 'Prebuilt internal talent assistance agent.' },
      { name: 'Recruitment Agent', goal: 'Sift candidates, schedule interviews', desc: 'Prebuilt automated screening and scheduler agent.' },
      { name: 'Finance Agent', goal: 'Track invoices, review balances, analyze profit margins', desc: 'Prebuilt accounting and metrics agent.' },
      { name: 'Inventory Agent', goal: 'Monitor stock levels, issue order refills', desc: 'Prebuilt warehouse automation assistant.' },
      { name: 'Healthcare Assistant', goal: 'Synthesize medical reports, manage appointment calendar', desc: 'HIPAA-aligned prebuilt medical assistant.' },
      { name: 'Education Assistant', goal: 'Plan lessons, grade drafts, manage student logs', desc: 'Aide for course creators and educators.' },
      { name: 'Retail Assistant', goal: 'Answer product specs, track deliveries, process returns', desc: 'Digital storefront concierge agent.' },
      { name: 'Restaurant Assistant', goal: 'Manage table bookings, review orders, edit menus', desc: 'Host and order manager assistant.' },
      { name: 'CRM Assistant', goal: 'Lookup, update, and clean CRM storage data', desc: 'General manager for companies, deals, and leads.' },
      { name: 'Analytics Agent', goal: 'Plot chart data, compute growth, forecast sales', desc: 'Data visualization and metrics agent.' },
      { name: 'Content Creator', goal: 'Draft blogs, emails, social posts', desc: 'Automated copywriter and editor.' },
      { name: 'Legal Assistant', goal: 'Parse clauses, check contract limits', desc: 'Legal review and terms parser agent.' },
      { name: 'Customer Success Agent', goal: 'Retain high-value accounts, audit feedback logs', desc: 'Concierge for premium clients.' },
      { name: 'Booking Agent', goal: 'Schedule appointments, check calendar status', desc: 'Automatic front desk booking assistant.' },
      { name: 'Email Agent', goal: 'Draft follow-ups, read inputs, filter spam', desc: 'Inbox organizer and responder.' },
      { name: 'Workflow Agent', goal: 'Run triggers, fire API webhooks, sync systems', desc: 'Pipeline orchestrator agent.' },
      { name: 'Knowledge Agent', goal: 'Index uploaded docs, provide citations and files search', desc: 'Advanced documentation search agent.' }
    ];

    this.data.agents = prebuiltTypes.map((agent, i) => ({
      id: `agent-prebuilt-${i + 1}`,
      name: agent.name,
      businessType: 'All',
      goal: agent.goal,
      description: agent.desc,
      instructions: `Act as a ${agent.name}. Help users accomplish: ${agent.goal}. Use CRM tools when requested. Keep replies professional, structured, and action-oriented.`,
      files: [],
      tools: ['crm_search', 'email_draft', 'report_generate', 'web_search'],
      memory: true,
      temperature: 0.7,
      reasoningLevel: 'high',
      modelSelection: 'Gemini 3.5 Flash',
      responseStyle: 'Professional & Technical',
      permissions: ['read_crm', 'write_crm'],
      workflow: [],
      isPrebuilt: true,
      isDeployed: true,
      publishedAt: new Date().toISOString()
    }));

    // 3. Seed CRM Companies
    this.data.crm_companies = [
      { id: 'c-1', name: 'Global Tech Corp', domain: 'globaltech.com', industry: 'IT Company', employees: 1200, revenue: 45000000, createdAt: new Date().toISOString() },
      { id: 'c-2', name: 'Apex Health Ltd', domain: 'apexhealth.org', industry: 'Healthcare', employees: 450, revenue: 15000000, createdAt: new Date().toISOString() },
      { id: 'c-3', name: 'Infinite Retail Inc', domain: 'infiniteretail.com', industry: 'Retail', employees: 80, revenue: 2400000, createdAt: new Date().toISOString() }
    ];

    // 4. Seed CRM Leads
    this.data.crm_leads = [
      { id: 'l-1', name: 'Sarah Connor', company: 'Global Tech Corp', email: 'sconnor@globaltech.com', value: 85000, status: 'Qualified', assignedTo: 'manager@agentforce.com', notes: 'Interested in AI CRM automation features.', createdAt: new Date().toISOString() },
      { id: 'l-2', name: 'John Doe', company: 'Apex Health Ltd', email: 'jdoe@apexhealth.org', value: 120000, status: 'Proposal', assignedTo: 'worker@agentforce.com', notes: 'Requires HIPAA standard certification.', createdAt: new Date().toISOString() },
      { id: 'l-3', name: 'Alice Smith', company: 'Infinite Retail Inc', email: 'asmith@infiniteretail.com', value: 18000, status: 'New', assignedTo: null, notes: 'Contacted via storefront webform.', createdAt: new Date().toISOString() }
    ];

    // 5. Seed CRM Contacts
    this.data.crm_contacts = [
      { id: 'con-1', name: 'Sarah Connor', email: 'sconnor@globaltech.com', phone: '+1-555-0199', company: 'Global Tech Corp', role: 'CTO', createdAt: new Date().toISOString() },
      { id: 'con-2', name: 'John Doe', email: 'jdoe@apexhealth.org', phone: '+1-555-0144', company: 'Apex Health Ltd', role: 'Head of IT', createdAt: new Date().toISOString() }
    ];

    // 6. Seed CRM Deals
    this.data.crm_deals = [
      { id: 'd-1', title: 'Agentforce Platform Licensing', company: 'Global Tech Corp', value: 85000, stage: 'Negotiation', closeDate: '2026-08-30', createdAt: new Date().toISOString() },
      { id: 'd-2', title: 'Healthcare Assistant Rollout', company: 'Apex Health Ltd', value: 120000, stage: 'Proposal', closeDate: '2026-09-15', createdAt: new Date().toISOString() }
    ];

    // 7. Seed CRM Tasks
    this.data.crm_tasks = [
      { id: 't-1', title: 'Prepare sales deck for Global Tech', status: 'In Progress', priority: 'High', dueDate: '2026-07-10', assignedTo: 'manager@agentforce.com', description: 'Highlight Atlas reasoning and trust layer.', createdAt: new Date().toISOString() },
      { id: 't-2', title: 'Send security documentation to Apex', status: 'Pending', priority: 'High', dueDate: '2026-07-15', assignedTo: 'worker@agentforce.com', description: 'Detail Einstein Trust layer inspired protections.', createdAt: new Date().toISOString() }
    ];

    // 8. Seed Invoices
    this.data.crm_invoices = [
      { id: 'inv-1', invoiceNumber: 'INV-2026-001', company: 'Global Tech Corp', amount: 85000, status: 'Sent', dueDate: '2026-08-15', createdAt: new Date().toISOString() },
      { id: 'inv-2', invoiceNumber: 'INV-2026-002', company: 'Apex Health Ltd', amount: 30000, status: 'Paid', dueDate: '2026-07-01', createdAt: new Date().toISOString() }
    ];

    // 9. Seed Meetings
    this.data.crm_meetings = [
      { id: 'm-1', title: 'Intro Demo & Requirements Gathering', company: 'Global Tech Corp', time: '2026-07-08T10:00:00Z', duration: 45, notes: 'Showed custom agent builder.', createdAt: new Date().toISOString() }
    ];

    // 10. Seed MCP Servers
    this.data.mcp_servers = [
      { id: 'mcp-1', name: 'Enterprise DB MCP', status: 'connected', url: 'http://localhost:3001/mcp/db', type: 'Database', tools: ['db_query', 'db_schema', 'db_export'], connectedAt: new Date().toISOString() },
      { id: 'mcp-2', name: 'Google Workspace MCP', status: 'connected', url: 'http://localhost:3001/mcp/gsuite', type: 'Google Drive', tools: ['drive_search', 'calendar_list', 'email_send'], connectedAt: new Date().toISOString() },
      { id: 'mcp-3', name: 'Collaboration Hub MCP', status: 'disconnected', url: 'http://localhost:3001/mcp/collab', type: 'Slack', tools: ['slack_post', 'slack_read_channel'], connectedAt: new Date().toISOString() }
    ];

    // 11. Seed Audit Logs
    this.data.audit_logs = [
      { id: 'log-1', userId: 'u-admin', username: 'admin@agentforce.com', action: 'System Setup', details: 'Initialized database and seeded defaults.', timestamp: new Date().toISOString() }
    ];

    // 12. Seed Workflows
    this.data.workflows = [
      {
        id: 'wf-1',
        name: 'Auto Lead Qualification & Alert',
        description: 'Qualifies new leads and creates tasks + emails sales team.',
        isDeployed: true,
        steps: [
          { id: 's-1', type: 'trigger', label: 'New Lead Created', config: { entity: 'lead' } },
          { id: 's-2', type: 'condition', label: 'Lead Value > $50,000', config: { field: 'value', op: 'gt', val: 50000 } },
          { id: 's-3', type: 'action', label: 'Set Status to Qualified', config: { action: 'update_status', val: 'Qualified' } },
          { id: 's-4', type: 'crm', label: 'Create Sales Followup Task', config: { title: 'High value lead callback', priority: 'High' } },
          { id: 's-5', type: 'notification', label: 'Slack Alert: Big Lead Qualified!', config: { channel: '#sales-alerts' } }
        ],
        createdAt: new Date().toISOString()
      }
    ];

    this.save();
  }

  // Helper getters/setters
  public getUsers() { return this.data.users; }
  public getAgents() { return this.data.agents; }
  public getLeads() { return this.data.crm_leads; }
  public getContacts() { return this.data.crm_contacts; }
  public getDeals() { return this.data.crm_deals; }
  public getTasks() { return this.data.crm_tasks; }
  public getCompanies() { return this.data.crm_companies; }
  public getInvoices() { return this.data.crm_invoices; }
  public getMeetings() { return this.data.crm_meetings; }
  public getDocs() { return this.data.knowledge_documents; }
  public getWorkflows() { return this.data.workflows; }
  public getLogs() { return this.data.audit_logs; }
  public getMcpServers() { return this.data.mcp_servers; }

  // Generic adds/updates
  public addAgent(agent: Agent) { this.data.agents.push(agent); this.save(); }
  public updateAgent(agentId: string, updates: Partial<Agent>) {
    const idx = this.data.agents.findIndex(a => a.id === agentId);
    if (idx !== -1) {
      this.data.agents[idx] = { ...this.data.agents[idx], ...updates };
      this.save();
    }
  }

  public addUser(user: User) { this.data.users.push(user); this.save(); }
  public updateUser(userId: string, updates: Partial<User>) {
    const idx = this.data.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates } as User;
      this.save();
    }
  }

  public addLead(lead: Lead) { this.data.crm_leads.push(lead); this.save(); }
  public updateLead(id: string, updates: Partial<Lead>) {
    const idx = this.data.crm_leads.findIndex(x => x.id === id);
    if (idx !== -1) { this.data.crm_leads[idx] = { ...this.data.crm_leads[idx], ...updates }; this.save(); }
  }
  public deleteLead(id: string) {
    this.data.crm_leads = this.data.crm_leads.filter(x => x.id !== id);
    this.save();
  }

  public addContact(item: Contact) { this.data.crm_contacts.push(item); this.save(); }
  public updateContact(id: string, updates: Partial<Contact>) {
    const idx = this.data.crm_contacts.findIndex(x => x.id === id);
    if (idx !== -1) { this.data.crm_contacts[idx] = { ...this.data.crm_contacts[idx], ...updates }; this.save(); }
  }
  public deleteContact(id: string) { this.data.crm_contacts = this.data.crm_contacts.filter(x => x.id !== id); this.save(); }

  public addDeal(item: Deal) { this.data.crm_deals.push(item); this.save(); }
  public updateDeal(id: string, updates: Partial<Deal>) {
    const idx = this.data.crm_deals.findIndex(x => x.id === id);
    if (idx !== -1) { this.data.crm_deals[idx] = { ...this.data.crm_deals[idx], ...updates }; this.save(); }
  }
  public deleteDeal(id: string) { this.data.crm_deals = this.data.crm_deals.filter(x => x.id !== id); this.save(); }

  public addTask(item: Task) { this.data.crm_tasks.push(item); this.save(); }
  public updateTask(id: string, updates: Partial<Task>) {
    const idx = this.data.crm_tasks.findIndex(x => x.id === id);
    if (idx !== -1) { this.data.crm_tasks[idx] = { ...this.data.crm_tasks[idx], ...updates }; this.save(); }
  }
  public deleteTask(id: string) { this.data.crm_tasks = this.data.crm_tasks.filter(x => x.id !== id); this.save(); }

  public addCompany(item: Company) { this.data.crm_companies.push(item); this.save(); }
  public updateCompany(id: string, updates: Partial<Company>) {
    const idx = this.data.crm_companies.findIndex(x => x.id === id);
    if (idx !== -1) { this.data.crm_companies[idx] = { ...this.data.crm_companies[idx], ...updates }; this.save(); }
  }
  public deleteCompany(id: string) { this.data.crm_companies = this.data.crm_companies.filter(x => x.id !== id); this.save(); }

  public addInvoice(item: Invoice) { this.data.crm_invoices.push(item); this.save(); }
  public updateInvoice(id: string, updates: Partial<Invoice>) {
    const idx = this.data.crm_invoices.findIndex(x => x.id === id);
    if (idx !== -1) { this.data.crm_invoices[idx] = { ...this.data.crm_invoices[idx], ...updates }; this.save(); }
  }
  public deleteInvoice(id: string) { this.data.crm_invoices = this.data.crm_invoices.filter(x => x.id !== id); this.save(); }

  public addMeeting(item: Meeting) { this.data.crm_meetings.push(item); this.save(); }
  public updateMeeting(id: string, updates: Partial<Meeting>) {
    const idx = this.data.crm_meetings.findIndex(x => x.id === id);
    if (idx !== -1) { this.data.crm_meetings[idx] = { ...this.data.crm_meetings[idx], ...updates }; this.save(); }
  }
  public deleteMeeting(id: string) { this.data.crm_meetings = this.data.crm_meetings.filter(x => x.id !== id); this.save(); }

  public addDoc(doc: KnowledgeDocument) { this.data.knowledge_documents.push(doc); this.save(); }
  public deleteDoc(id: string) { this.data.knowledge_documents = this.data.knowledge_documents.filter(d => d.id !== id); this.save(); }

  public addWorkflow(wf: Workflow) { this.data.workflows.push(wf); this.save(); }
  public updateWorkflow(id: string, updates: Partial<Workflow>) {
    const idx = this.data.workflows.findIndex(x => x.id === id);
    if (idx !== -1) { this.data.workflows[idx] = { ...this.data.workflows[idx], ...updates }; this.save(); }
  }
  public deleteWorkflow(id: string) { this.data.workflows = this.data.workflows.filter(x => x.id !== id); this.save(); }

  public addLog(action: string, details: string, userId: string | null, username: string | null) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId,
      username,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.audit_logs.unshift(log); // newest first
    // Limit to 200 logs
    if (this.data.audit_logs.length > 200) {
      this.data.audit_logs = this.data.audit_logs.slice(0, 200);
    }
    this.save();
  }

  public addMcpServer(mcp: McpServer) { this.data.mcp_servers.push(mcp); this.save(); }
  public updateMcpServer(id: string, updates: Partial<McpServer>) {
    const idx = this.data.mcp_servers.findIndex(x => x.id === id);
    if (idx !== -1) { this.data.mcp_servers[idx] = { ...this.data.mcp_servers[idx], ...updates }; this.save(); }
  }
  public deleteMcpServer(id: string) {
    this.data.mcp_servers = this.data.mcp_servers.filter(x => x.id !== id);
    this.save();
  }
}

export const db = new Database();
