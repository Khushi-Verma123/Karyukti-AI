import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Server, ToggleLeft, ToggleRight, Trash2, Plus, Info } from 'lucide-react';

interface McpServer {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  url: string;
  type: string;
  tools: string[];
}

export const McpConnectors: React.FC = () => {
  const { token } = useAuth();
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('Custom API');

  const loadMcp = async () => {
    try {
      const res = await fetch('/api/mcp', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setServers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMcp();
  }, [token]);

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/mcp/${id}/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadMcp();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/mcp/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadMcp();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, url, type, tools: ['custom_lookup', 'sync_records'] })
      });
      if (res.ok) {
        setName('');
        setUrl('');
        setShowAdd(false);
        loadMcp();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-text-primary">Model Context Protocol (MCP)</h2>
          <p className="text-[10px] text-text-secondary">Register external servers to expose secure schemas and tools to Karyukti agents.</p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Server</span>
        </button>
      </div>

      {/* Info Warning */}
      <div className="p-4 rounded-2xl bg-bg-secondary border border-borderColor flex gap-3 text-xs text-text-secondary">
        <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p>
          Connected MCP servers publish JSON schemas containing function calls (such as search, calendars, or Slack posting). Active AI agents will inspect these schemas dynamically to solve goals step-by-step.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-text-muted">Loading MCP configurations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servers.map(server => (
            <div
              key={server.id}
              className="bg-bg-secondary border border-borderColor p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-brand-500" />
                    <h3 className="font-bold text-xs text-text-primary">{server.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      server.status === 'connected' ? 'bg-green-500/10 text-green-600' : 'bg-slate-500/10 text-slate-400'
                    }`}
                  >
                    {server.status}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1.5 text-[10px]">
                  <div><strong className="text-text-muted">Endpoint:</strong> <code className="bg-bg-primary px-1.5 py-0.5 rounded">{server.url}</code></div>
                  <div><strong className="text-text-muted">System Type:</strong> {server.type}</div>
                  <div>
                    <strong className="text-text-muted">Exposed Tools:</strong>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {server.tools.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-bg-primary rounded border border-borderColor text-[9px] font-mono text-text-secondary">
                          {t}()
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-borderColor/40 flex items-center justify-between">
                <button
                  onClick={() => handleDelete(server.id)}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                  title="Remove MCP"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggle(server.id)}
                  className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary"
                >
                  <span className="text-[10px] font-bold">Toggle State</span>
                  {server.status === 'connected' ? (
                    <ToggleRight className="w-6 h-6 text-green-500 cursor-pointer" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-text-muted cursor-pointer" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor w-full max-w-sm shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Register MCP Host</h3>
              <p className="text-[10px] text-text-secondary">Input server metadata parameters.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-text-secondary uppercase">Server Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                  placeholder="E.g., GitHub Integration MCP"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-text-secondary uppercase">Host URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                  placeholder="http://localhost:3001/mcp/github"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-text-secondary uppercase">Connection Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs text-text-primary focus:outline-none"
                >
                  <option>Database</option>
                  <option>Google Drive</option>
                  <option>Calendar</option>
                  <option>Email</option>
                  <option>GitHub</option>
                  <option>Slack</option>
                  <option>Custom API</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-brand-500 text-white font-bold text-xs py-2 rounded-xl cursor-pointer">
                  Save Connect
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 border border-borderColor text-text-secondary font-bold text-xs py-2 rounded-xl">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
