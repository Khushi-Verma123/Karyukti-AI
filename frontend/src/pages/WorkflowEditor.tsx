import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  GitBranch,
  Play,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  isDeployed: boolean;
  steps: Array<{ id: string; type: string; label: string }>;
  createdAt: string;
}

export const WorkflowEditor: React.FC = () => {
  const { token } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [wfName, setWfName] = useState('');
  const [wfDesc, setWfDesc] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const loadWorkflows = async () => {
    try {
      const res = await fetch('/api/workflows', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, [token]);

  const handleToggleDeploy = async (id: string) => {
    try {
      const res = await fetch(`/api/workflows/${id}/deploy`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadWorkflows();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfName) return;

    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: wfName,
          description: wfDesc,
          steps: [
            { id: '1', type: 'trigger', label: 'New Lead Created' },
            { id: '2', type: 'condition', label: 'Lead Value > $50,000' },
            { id: '3', type: 'action', label: 'Create Followup Task' }
          ]
        })
      });

      if (res.ok) {
        setWfName('');
        setWfDesc('');
        setShowCreate(false);
        loadWorkflows();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    try {
      const res = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadWorkflows();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-text-primary">Workflow Automation Triggers</h2>
          <p className="text-[10px] text-text-secondary">Orchestrate triggers, checks, notifications, and alerts.</p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-text-muted">Loading workflows...</div>
      ) : workflows.length === 0 ? (
        <div className="bg-bg-secondary p-8 rounded-3xl border border-borderColor text-center text-xs text-text-muted">
          No automated workflows defined yet. Click "New Workflow" to bootstrap a pipeline trigger.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map(wf => (
            <div
              key={wf.id}
              className="bg-bg-secondary border border-borderColor p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-brand-500" />
                    <h3 className="font-bold text-xs text-text-primary">{wf.name}</h3>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      wf.isDeployed ? 'bg-green-500' : 'bg-slate-400'
                    }`}
                  ></span>
                </div>

                <p className="text-[10px] text-text-secondary mt-2">{wf.description}</p>

                <div className="mt-4 space-y-1.5">
                  <span className="text-[9px] font-bold text-text-muted uppercase">Nodes Pipeline:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {wf.steps.map((step, idx) => (
                      <React.Fragment key={step.id}>
                        <span className="px-2 py-1 bg-bg-primary border border-borderColor rounded text-[9px] text-text-primary">
                          {step.label}
                        </span>
                        {idx < wf.steps.length - 1 && <span className="text-text-muted text-[10px]">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-borderColor/40 flex items-center justify-between">
                <button
                  onClick={() => handleDeleteWorkflow(wf.id)}
                  className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                  title="Remove workflow"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleDeploy(wf.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    wf.isDeployed
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
                      : 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm'
                  }`}
                >
                  {wf.isDeployed ? 'Undeploy Rules' : 'Deploy Workflow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Workflow Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor w-full max-w-sm shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">New Workflow Flow</h3>
              <p className="text-[10px] text-text-secondary">Input automation details.</p>
            </div>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-text-secondary uppercase">Workflow Name</label>
                <input
                  type="text"
                  value={wfName}
                  onChange={e => setWfName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                  placeholder="E.g., High-Value Lead Nurturer"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-text-secondary uppercase">Description</label>
                <textarea
                  value={wfDesc}
                  onChange={e => setWfDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs h-16"
                  placeholder="Describe trigger metrics..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-brand-500 text-white font-bold text-xs py-2 rounded-xl cursor-pointer">
                  Save
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-borderColor text-text-secondary font-bold text-xs py-2 rounded-xl">
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
