import { Response } from 'express';
import { db, Workflow } from '../config/db';

export const getWorkflows = (req: any, res: Response) => {
  res.json(db.getWorkflows());
};

export const createWorkflow = (req: any, res: Response) => {
  const { name, description, steps } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Workflow name is required' });
  }

  const newWorkflow: Workflow = {
    id: `wf-${Date.now()}`,
    name,
    description: description || '',
    steps: steps || [],
    isDeployed: false,
    createdAt: new Date().toISOString()
  };

  db.addWorkflow(newWorkflow);
  db.addLog(
    'Workflow Created',
    `Workflow "${name}" created by ${req.user?.username}.`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.status(201).json(newWorkflow);
};

export const updateWorkflow = (req: any, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  db.updateWorkflow(id, updates);
  db.addLog(
    'Workflow Updated',
    `Workflow "${id}" updated by ${req.user?.username}.`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.json({ success: true });
};

export const deleteWorkflow = (req: any, res: Response) => {
  const { id } = req.params;
  db.deleteWorkflow(id);
  db.addLog(
    'Workflow Deleted',
    `Workflow "${id}" deleted.`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.json({ success: true });
};

export const toggleWorkflowDeployment = (req: any, res: Response) => {
  const { id } = req.params;
  const workflows = db.getWorkflows();
  const wf = workflows.find(w => w.id === id);

  if (!wf) {
    return res.status(404).json({ error: 'Workflow not found' });
  }

  const newDeployedState = !wf.isDeployed;
  db.updateWorkflow(id, { isDeployed: newDeployedState });
  
  db.addLog(
    newDeployedState ? 'Workflow Deployed' : 'Workflow Undeployed',
    `Workflow "${wf.name}" set to ${newDeployedState ? 'Active' : 'Inactive'}.`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.json({ success: true, isDeployed: newDeployedState });
};
