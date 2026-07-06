import express from 'express';
import cors from 'cors';
import { authenticateToken, requireRole } from './middleware/auth';
import { trustLayerProtection } from './middleware/trustLayer';
import * as authController from './controllers/authController';
import * as agentController from './controllers/agentController';
import * as crmController from './controllers/crmController';
import * as workflowController from './controllers/workflowController';
import * as knowledgeController from './controllers/knowledgeController';
import * as mcpController from './controllers/mcpController';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Security Middleware Config ---

// 1. CORS with origin restrictions (Enterprise standard)
app.use(cors({
  origin: '*', // In production, restrict to your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body limits to protect against memory depletion DOS attacks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- REST API Routing ---

// Public Authentication
app.post('/api/auth/login', authController.login);

// Session Verification & Business Type update
app.get('/api/auth/session', authenticateToken, authController.getSession);
app.post('/api/auth/business', authenticateToken, authController.updateBusinessSelection);

// Admin-Only Audit Logging
app.get('/api/auth/logs', authenticateToken, requireRole(['admin']), authController.getAuditLogs);

// Agent Management
app.get('/api/agents', authenticateToken, agentController.getAgents);
app.post('/api/agents', authenticateToken, requireRole(['admin', 'manager']), agentController.createAgent);
app.put('/api/agents/:id', authenticateToken, requireRole(['admin', 'manager']), agentController.updateAgent);
app.post('/api/agents/:id/deploy', authenticateToken, requireRole(['admin']), agentController.deployAgent);

// Secure Conversational Route (includes Einstein Trust Layer prompted PII filter & safety monitor)
app.post('/api/agents/chat', authenticateToken, trustLayerProtection, agentController.chatWithAgent);

// CRM Modules
app.get('/api/crm/summary', authenticateToken, crmController.getCrmSummary);
app.get('/api/crm/search', authenticateToken, crmController.globalSearch);

// CRM CRUD routes (Accessible by all authorized roles, mutations restricted to manager/admin)
const crmRoles = requireRole(['admin', 'manager', 'worker']);
const crmMutationRoles = requireRole(['admin', 'manager']);

// Leads
app.get('/api/crm/leads', authenticateToken, crmRoles, crmController.getLeads);
app.post('/api/crm/leads', authenticateToken, crmMutationRoles, crmController.createLead);
app.put('/api/crm/leads/:id', authenticateToken, crmMutationRoles, crmController.updateLead);
app.delete('/api/crm/leads/:id', authenticateToken, crmMutationRoles, crmController.deleteLead);

// Contacts
app.get('/api/crm/contacts', authenticateToken, crmRoles, crmController.getContacts);
app.post('/api/crm/contacts', authenticateToken, crmMutationRoles, crmController.createContact);
app.put('/api/crm/contacts/:id', authenticateToken, crmMutationRoles, crmController.updateContact);
app.delete('/api/crm/contacts/:id', authenticateToken, crmMutationRoles, crmController.deleteContact);

// Deals
app.get('/api/crm/deals', authenticateToken, crmRoles, crmController.getDeals);
app.post('/api/crm/deals', authenticateToken, crmMutationRoles, crmController.createDeal);
app.put('/api/crm/deals/:id', authenticateToken, crmMutationRoles, crmController.updateDeal);
app.delete('/api/crm/deals/:id', authenticateToken, crmMutationRoles, crmController.deleteDeal);

// Tasks
app.get('/api/crm/tasks', authenticateToken, crmRoles, crmController.getTasks);
app.post('/api/crm/tasks', authenticateToken, crmMutationRoles, crmController.createTask);
app.put('/api/crm/tasks/:id', authenticateToken, crmMutationRoles, crmController.updateTask);
app.delete('/api/crm/tasks/:id', authenticateToken, crmMutationRoles, crmController.deleteTask);

// Companies
app.get('/api/crm/companies', authenticateToken, crmRoles, crmController.getCompanies);
app.post('/api/crm/companies', authenticateToken, crmMutationRoles, crmController.createCompany);
app.put('/api/crm/companies/:id', authenticateToken, crmMutationRoles, crmController.updateCompany);
app.delete('/api/crm/companies/:id', authenticateToken, crmMutationRoles, crmController.deleteCompany);

// Invoices
app.get('/api/crm/invoices', authenticateToken, crmRoles, crmController.getInvoices);
app.post('/api/crm/invoices', authenticateToken, crmMutationRoles, crmController.createInvoice);
app.put('/api/crm/invoices/:id', authenticateToken, crmMutationRoles, crmController.updateInvoice);
app.delete('/api/crm/invoices/:id', authenticateToken, crmMutationRoles, crmController.deleteInvoice);

// Meetings
app.get('/api/crm/meetings', authenticateToken, crmRoles, crmController.getMeetings);
app.post('/api/crm/meetings', authenticateToken, crmMutationRoles, crmController.createMeeting);
app.put('/api/crm/meetings/:id', authenticateToken, crmMutationRoles, crmController.updateMeeting);
app.delete('/api/crm/meetings/:id', authenticateToken, crmMutationRoles, crmController.deleteMeeting);

// Workflow Automation Rules (Manager & Admin only)
app.get('/api/workflows', authenticateToken, requireRole(['admin', 'manager']), workflowController.getWorkflows);
app.post('/api/workflows', authenticateToken, requireRole(['admin', 'manager']), workflowController.createWorkflow);
app.put('/api/workflows/:id', authenticateToken, requireRole(['admin', 'manager']), workflowController.updateWorkflow);
app.delete('/api/workflows/:id', authenticateToken, requireRole(['admin', 'manager']), workflowController.deleteWorkflow);
app.post('/api/workflows/:id/deploy', authenticateToken, requireRole(['admin', 'manager']), workflowController.toggleWorkflowDeployment);

// Knowledge Base Documents
app.get('/api/docs', authenticateToken, knowledgeController.getDocs);
app.post('/api/docs', authenticateToken, requireRole(['admin', 'manager']), knowledgeController.uploadDoc);
app.delete('/api/docs/:id', authenticateToken, requireRole(['admin', 'manager']), knowledgeController.deleteDoc);

// MCP Tool Integrations (Admin only configuration)
app.get('/api/mcp', authenticateToken, requireRole(['admin']), mcpController.getMcpServers);
app.post('/api/mcp', authenticateToken, requireRole(['admin']), mcpController.createMcpServer);
app.post('/api/mcp/:id/toggle', authenticateToken, requireRole(['admin']), mcpController.toggleMcpStatus);
app.delete('/api/mcp/:id', authenticateToken, requireRole(['admin']), mcpController.deleteMcpServer);

// Error Fallback Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(`🚀 Agentforce Platform Backend running on http://localhost:${PORT}`);
  console.log(`🔒 Security active: JWT Authentication, RBAC, & PII Filter`);
  console.log(`===========================================================`);
});
