import { Response } from 'express';
import { db } from '../config/db';

// General CRM status metrics
export const getCrmSummary = (req: any, res: Response) => {
  const leads = db.getLeads();
  const deals = db.getDeals();
  const tasks = db.getTasks();
  const companies = db.getCompanies();

  const totalLeadValue = leads.reduce((sum, l) => sum + l.value, 0);
  const totalDealValue = deals.reduce((sum, d) => sum + d.value, 0);
  const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;

  res.json({
    counts: {
      leads: leads.length,
      deals: deals.length,
      tasks: tasks.length,
      companies: companies.length
    },
    metrics: {
      totalLeadValue,
      totalDealValue,
      pendingTasks
    }
  });
};

// --- LEADS ---
export const getLeads = (req: any, res: Response) => {
  res.json(db.getLeads());
};

export const createLead = (req: any, res: Response) => {
  const data = req.body;
  const newLead = {
    id: `l-${Date.now()}`,
    name: data.name || 'New Lead',
    company: data.company || 'Unknown Inc',
    email: data.email || '',
    value: Number(data.value) || 0,
    status: data.status || 'New',
    assignedTo: data.assignedTo || null,
    notes: data.notes || '',
    createdAt: new Date().toISOString()
  };
  db.addLead(newLead);
  db.addLog('CRM Change', `Lead "${newLead.name}" created.`, req.user?.id, req.user?.username);
  res.status(201).json(newLead);
};

export const updateLead = (req: any, res: Response) => {
  const { id } = req.params;
  db.updateLead(id, req.body);
  db.addLog('CRM Change', `Lead "${id}" updated.`, req.user?.id, req.user?.username);
  res.json({ success: true });
};

export const deleteLead = (req: any, res: Response) => {
  const { id } = req.params;
  db.deleteLead(id);
  db.addLog('CRM Change', `Lead "${id}" deleted.`, req.user?.id, req.user?.username);
  res.json({ success: true });
};

// --- CONTACTS ---
export const getContacts = (req: any, res: Response) => res.json(db.getContacts());
export const createContact = (req: any, res: Response) => {
  const newContact = {
    id: `con-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.addContact(newContact);
  db.addLog('CRM Change', `Contact "${newContact.name}" added.`, req.user?.id, req.user?.username);
  res.status(201).json(newContact);
};
export const updateContact = (req: any, res: Response) => {
  db.updateContact(req.params.id, req.body);
  res.json({ success: true });
};
export const deleteContact = (req: any, res: Response) => {
  db.deleteContact(req.params.id);
  res.json({ success: true });
};

// --- DEALS ---
export const getDeals = (req: any, res: Response) => res.json(db.getDeals());
export const createDeal = (req: any, res: Response) => {
  const newDeal = {
    id: `d-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.addDeal(newDeal);
  db.addLog('CRM Change', `Deal "${newDeal.title}" created.`, req.user?.id, req.user?.username);
  res.status(201).json(newDeal);
};
export const updateDeal = (req: any, res: Response) => {
  db.updateDeal(req.params.id, req.body);
  res.json({ success: true });
};
export const deleteDeal = (req: any, res: Response) => {
  db.deleteDeal(req.params.id);
  res.json({ success: true });
};

// --- TASKS ---
export const getTasks = (req: any, res: Response) => res.json(db.getTasks());
export const createTask = (req: any, res: Response) => {
  const newTask = {
    id: `t-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.addTask(newTask);
  db.addLog('CRM Change', `Task "${newTask.title}" added.`, req.user?.id, req.user?.username);
  res.status(201).json(newTask);
};
export const updateTask = (req: any, res: Response) => {
  db.updateTask(req.params.id, req.body);
  res.json({ success: true });
};
export const deleteTask = (req: any, res: Response) => {
  db.deleteTask(req.params.id);
  res.json({ success: true });
};

// --- COMPANIES ---
export const getCompanies = (req: any, res: Response) => res.json(db.getCompanies());
export const createCompany = (req: any, res: Response) => {
  const newCompany = {
    id: `c-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.addCompany(newCompany);
  db.addLog('CRM Change', `Company "${newCompany.name}" added.`, req.user?.id, req.user?.username);
  res.status(201).json(newCompany);
};
export const updateCompany = (req: any, res: Response) => {
  db.updateCompany(req.params.id, req.body);
  res.json({ success: true });
};
export const deleteCompany = (req: any, res: Response) => {
  db.deleteCompany(req.params.id);
  res.json({ success: true });
};

// --- INVOICES ---
export const getInvoices = (req: any, res: Response) => res.json(db.getInvoices());
export const createInvoice = (req: any, res: Response) => {
  const newInvoice = {
    id: `inv-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.addInvoice(newInvoice);
  db.addLog('CRM Change', `Invoice "${newInvoice.invoiceNumber}" generated.`, req.user?.id, req.user?.username);
  res.status(201).json(newInvoice);
};
export const updateInvoice = (req: any, res: Response) => {
  db.updateInvoice(req.params.id, req.body);
  res.json({ success: true });
};
export const deleteInvoice = (req: any, res: Response) => {
  db.deleteInvoice(req.params.id);
  res.json({ success: true });
};

// --- MEETINGS ---
export const getMeetings = (req: any, res: Response) => res.json(db.getMeetings());
export const createMeeting = (req: any, res: Response) => {
  const newMeeting = {
    id: `m-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.addMeeting(newMeeting);
  db.addLog('CRM Change', `Meeting "${newMeeting.title}" scheduled.`, req.user?.id, req.user?.username);
  res.status(201).json(newMeeting);
};
export const updateMeeting = (req: any, res: Response) => {
  db.updateMeeting(req.params.id, req.body);
  res.json({ success: true });
};
export const deleteMeeting = (req: any, res: Response) => {
  db.deleteMeeting(req.params.id);
  res.json({ success: true });
};

// --- GLOBAL SEARCH ---
export const globalSearch = (req: any, res: Response) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q) {
    return res.json({ agents: [], leads: [], deals: [], contacts: [], tasks: [] });
  }

  const agents = db.getAgents().filter(x => x.name.toLowerCase().includes(q) || x.description.toLowerCase().includes(q));
  const leads = db.getLeads().filter(x => x.name.toLowerCase().includes(q) || x.company.toLowerCase().includes(q));
  const deals = db.getDeals().filter(x => x.title.toLowerCase().includes(q) || x.company.toLowerCase().includes(q));
  const contacts = db.getContacts().filter(x => x.name.toLowerCase().includes(q) || x.email.toLowerCase().includes(q));
  const tasks = db.getTasks().filter(x => x.title.toLowerCase().includes(q) || x.description.toLowerCase().includes(q));

  res.json({
    agents,
    leads,
    deals,
    contacts,
    tasks
  });
};
