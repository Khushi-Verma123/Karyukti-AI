import { Response } from 'express';
import { db, Agent } from '../config/db';
import { AtlasReasoningEngine } from '../services/reasoningEngine';

export const getAgents = (req: any, res: Response) => {
  res.json(db.getAgents());
};

export const createAgent = (req: any, res: Response) => {
  const {
    name,
    businessType,
    goal,
    description,
    instructions,
    files,
    tools,
    memory,
    temperature,
    reasoningLevel,
    modelSelection,
    responseStyle,
    permissions,
    workflow
  } = req.body;

  if (!name || !goal) {
    return res.status(400).json({ error: 'Agent name and goal are required' });
  }

  const newAgent: Agent = {
    id: `agent-custom-${Date.now()}`,
    name,
    businessType: businessType || 'All',
    goal,
    description: description || '',
    instructions: instructions || 'Help user manage tasks.',
    files: files || [],
    tools: tools || [],
    memory: memory !== undefined ? memory : true,
    temperature: temperature !== undefined ? temperature : 0.7,
    reasoningLevel: reasoningLevel || 'medium',
    modelSelection: modelSelection || 'Gemini 3.5 Flash',
    responseStyle: responseStyle || 'Professional',
    permissions: permissions || [],
    workflow: workflow || [],
    isPrebuilt: false,
    isDeployed: false,
    publishedAt: null
  };

  db.addAgent(newAgent);
  db.addLog(
    'Agent Created',
    `Custom AI Agent "${name}" created by ${req.user?.username}.`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.status(201).json(newAgent);
};

export const updateAgent = (req: any, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  db.updateAgent(id, updates);
  db.addLog(
    'Agent Updated',
    `Agent "${id}" updated by ${req.user?.username}.`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.json({ success: true });
};

export const deployAgent = (req: any, res: Response) => {
  const { id } = req.params;
  const agents = db.getAgents();
  const agent = agents.find(a => a.id === id);

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  const newDeployedState = !agent.isDeployed;
  db.updateAgent(id, {
    isDeployed: newDeployedState,
    publishedAt: newDeployedState ? new Date().toISOString() : agent.publishedAt
  });

  db.addLog(
    newDeployedState ? 'Agent Deployed' : 'Agent Undeployed',
    `Agent "${agent.name}" status changed to: ${newDeployedState ? 'Active' : 'Inactive'}`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.json({ success: true, isDeployed: newDeployedState });
};

export const chatWithAgent = async (req: any, res: Response) => {
  const { agentId, query, geminiApiKey } = req.body;
  if (!agentId || !query) {
    return res.status(400).json({ error: 'AgentId and query are required' });
  }

  const agents = db.getAgents();
  const agent = agents.find(a => a.id === agentId);

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  try {
    const response = await AtlasReasoningEngine.execute(
      query,
      req.user?.businessType || 'Retail',
      req.user?.role || 'worker',
      agent,
      geminiApiKey
    );

    db.addLog(
      'Agent Conversation',
      `Chat with agent "${agent.name}". Query: "${query.substring(0, 50)}..."`,
      req.user?.id || null,
      req.user?.username || 'Anonymous'
    );

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to execute reasoning', details: error.message });
  }
};
