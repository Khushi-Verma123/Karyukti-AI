import { Response } from 'express';
import { db, McpServer } from '../config/db';

export const getMcpServers = (req: any, res: Response) => {
  res.json(db.getMcpServers());
};

export const createMcpServer = (req: any, res: Response) => {
  const { name, url, type, tools } = req.body;

  if (!name || !url) {
    return res.status(400).json({ error: 'Server name and connection URL are required' });
  }

  const newServer: McpServer = {
    id: `mcp-${Date.now()}`,
    name,
    status: 'connected', // Auto-connected for simulation
    url,
    type: type || 'Custom API',
    tools: tools || ['custom_action_1', 'custom_action_2'],
    connectedAt: new Date().toISOString()
  };

  db.addMcpServer(newServer);
  db.addLog(
    'MCP Configured',
    `Connected new MCP Server: "${name}" (${type})`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.status(201).json(newServer);
};

export const toggleMcpStatus = (req: any, res: Response) => {
  const { id } = req.params;
  const servers = db.getMcpServers();
  const server = servers.find(s => s.id === id);

  if (!server) {
    return res.status(404).json({ error: 'MCP Server not found' });
  }

  const newStatus = server.status === 'connected' ? 'disconnected' : 'connected';
  db.updateMcpServer(id, { status: newStatus });
  db.addLog(
    'MCP Connection Changed',
    `MCP Server "${server.name}" status set to: ${newStatus}`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.json({ success: true, status: newStatus });
};

export const deleteMcpServer = (req: any, res: Response) => {
  const { id } = req.params;
  db.deleteMcpServer(id);
  db.addLog(
    'MCP Removed',
    `Deleted MCP Server config ID "${id}"`,
    req.user?.id || null,
    req.user?.username || 'System'
  );

  res.json({ success: true });
};
