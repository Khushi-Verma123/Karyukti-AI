import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Cpu,
  Plus,
  Play,
  ArrowRight,
  GitFork,
  Settings,
  Database,
  Link2,
  Trash2,
  FileText
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  isPrebuilt: boolean;
  isDeployed: boolean;
  goal: string;
  description: string;
  instructions: string;
  tools: string[];
}

export const AgentBuilder: React.FC = () => {
  const { token, user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'create' | 'visual'>('list');

  // Creation Form
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>(['web_search', 'crm_search']);
  const [temperature, setTemperature] = useState(0.7);
  const [reasoningLevel, setReasoningLevel] = useState<'low' | 'medium' | 'high'>('high');
  const [model, setModel] = useState('Gemini 3.5 Flash');

  // Drag and Drop Node Builder State
  const [nodes, setNodes] = useState<Array<{ id: string; type: string; label: string; x: number; y: number }>>([
    { id: '1', type: 'Trigger', label: 'Customer Query Received', x: 50, y: 150 },
    { id: '2', type: 'Reasoning', label: 'Atlas Plan Decomposition', x: 250, y: 150 },
    { id: '3', type: 'Condition', label: 'Query matches Customer Support?', x: 450, y: 150 },
    { id: '4', type: 'Action', label: 'Resolve CRM Ticket', x: 680, y: 80 },
    { id: '5', type: 'Action', label: 'Notify Manager (High Value)', x: 680, y: 220 }
  ]);

  const loadAgents = async () => {
    try {
      const res = await fetch('/api/agents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAgents();
  }, [token]);

  const handleDeployAgent = async (id: string) => {
    try {
      const res = await fetch(`/api/agents/${id}/deploy`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadAgents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          goal,
          description,
          instructions,
          tools: selectedTools,
          temperature,
          reasoningLevel,
          modelSelection: model,
          businessType: user?.businessType || 'Retail'
        })
      });
      if (res.ok) {
        // Clear form
        setName('');
        setGoal('');
        setDescription('');
        setInstructions('');
        setActiveSubTab('list');
        loadAgents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addVisualNode = (type: string) => {
    const newId = (nodes.length + 1).toString();
    const labels: Record<string, string> = {
      Prompt: 'Execute Custom Prompt Context',
      Condition: 'Branch Check',
      CRM: 'CRM Record Update',
      API: 'Call External API Gateway'
    };
    setNodes([
      ...nodes,
      {
        id: newId,
        type,
        label: labels[type] || 'New Action Node',
        x: 350,
        y: 100 + nodes.length * 20
      }
    ]);
  };

  const removeVisualNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-borderColor/60">
        <button
          onClick={() => setActiveSubTab('list')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'list'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Active Agents Registry
        </button>
        <button
          onClick={() => setActiveSubTab('create')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'create'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Build Custom Agent
        </button>
        <button
          onClick={() => setActiveSubTab('visual')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'visual'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Visual Flow Workspace
        </button>
      </div>

      {/* --- Sub Tab 1: Agent Registry --- */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="p-5 rounded-2xl bg-bg-secondary border border-borderColor flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        agent.isPrebuilt
                          ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
                          : 'bg-brand-500/10 text-brand-600 border border-brand-500/20'
                      }`}
                    >
                      {agent.isPrebuilt ? 'Prebuilt Template' : 'Custom Build'}
                    </span>
                    
                    <span
                      className={`w-2 h-2 rounded-full ${
                        agent.isDeployed ? 'bg-green-500' : 'bg-slate-400'
                      }`}
                    ></span>
                  </div>

                  <h3 className="font-bold text-sm text-text-primary mt-3 truncate">{agent.name}</h3>
                  <p className="text-[10px] text-text-secondary mt-1 line-clamp-2">{agent.goal}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-borderColor/40 flex items-center justify-between">
                  <span className="text-[9px] text-text-muted">Tools: {agent.tools.length}</span>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDeployAgent(agent.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-colors cursor-pointer ${
                        agent.isDeployed
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
                          : 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm'
                      }`}
                    >
                      {agent.isDeployed ? 'Undeploy' : 'Deploy Agent'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Sub Tab 2: Custom Builder --- */}
      {activeSubTab === 'create' && (
        <form onSubmit={handleCreateAgent} className="bg-bg-secondary p-6 rounded-3xl border border-borderColor space-y-6 max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Configure Custom AI Agent</h3>
            <p className="text-[10px] text-text-secondary">Input prompt bounds and permission constraints.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-text-secondary uppercase">Agent Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Support qualification agent"
                className="w-full mt-1.5 px-3 py-2 rounded-lg bg-bg-primary border border-borderColor text-xs focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-secondary uppercase">Model</label>
              <select
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 rounded-lg bg-bg-primary border border-borderColor text-xs focus:outline-none text-text-primary"
              >
                <option>Gemini 3.5 Flash</option>
                <option>Gemini 3.5 Pro</option>
                <option>Gemini 2.5 Flash</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-text-secondary uppercase">Mission Goal</label>
              <input
                type="text"
                value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="Qualify sales leads above $50k"
                className="w-full mt-1.5 px-3 py-2 rounded-lg bg-bg-primary border border-borderColor text-xs focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-text-secondary uppercase">Instructions</label>
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Provide step by step details for AI behavior..."
                className="w-full mt-1.5 px-3 py-2 rounded-lg bg-bg-primary border border-borderColor text-xs focus:outline-none h-24"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-secondary uppercase">Reasoning Power</label>
              <select
                value={reasoningLevel}
                onChange={e => setReasoningLevel(e.target.value as any)}
                className="w-full mt-1.5 px-3 py-2 rounded-lg bg-bg-primary border border-borderColor text-xs focus:outline-none text-text-primary"
              >
                <option value="low">Standard Plan</option>
                <option value="medium">Adaptive Planner</option>
                <option value="high">Deep Reasoning Atlas</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-secondary uppercase">Temperature</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 rounded-lg bg-bg-primary border border-borderColor text-xs focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Save and Publish Agent
          </button>
        </form>
      )}

      {/* --- Sub Tab 3: Visual Flow Builder --- */}
      {activeSubTab === 'visual' && (
        <div className="bg-bg-secondary rounded-3xl border border-borderColor p-6 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Agentforce Drag & Drop Canvas</h3>
              <p className="text-[10px] text-text-secondary">Visually connect components to orchestrate decision branches.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addVisualNode('Prompt')}
                className="px-2.5 py-1.5 rounded-lg border border-borderColor bg-bg-primary hover:bg-bg-tertiary text-[10px] font-bold text-text-primary transition-colors cursor-pointer"
              >
                + Prompt Node
              </button>
              <button
                type="button"
                onClick={() => addVisualNode('Condition')}
                className="px-2.5 py-1.5 rounded-lg border border-borderColor bg-bg-primary hover:bg-bg-tertiary text-[10px] font-bold text-text-primary transition-colors cursor-pointer"
              >
                + Branch Condition
              </button>
              <button
                type="button"
                onClick={() => addVisualNode('CRM')}
                className="px-2.5 py-1.5 rounded-lg border border-borderColor bg-bg-primary hover:bg-bg-tertiary text-[10px] font-bold text-text-primary transition-colors cursor-pointer"
              >
                + CRM Action
              </button>
            </div>
          </div>

          {/* Visual Workspace Canvas */}
          <div className="flex-1 relative bg-bg-primary border border-borderColor/60 rounded-2xl overflow-hidden p-4 select-none">
            {/* SVG Connections Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Draw connected lines */}
              <path d="M 150 170 C 200 170, 200 170, 250 170" stroke="var(--color-text-muted)" strokeWidth="1.5" fill="none" />
              <path d="M 370 170 C 400 170, 400 170, 450 170" stroke="var(--color-text-muted)" strokeWidth="1.5" fill="none" />
              <path d="M 570 170 C 620 170, 620 100, 680 100" stroke="var(--color-brand-500)" strokeWidth="1.5" fill="none" strokeDasharray="4" />
              <path d="M 570 170 C 620 170, 620 240, 680 240" stroke="var(--color-brand-500)" strokeWidth="1.5" fill="none" strokeDasharray="4" />
            </svg>

            {/* Nodes */}
            {nodes.map(node => (
              <div
                key={node.id}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className="absolute w-44 p-3 bg-bg-secondary border border-borderColor rounded-xl shadow-md flex flex-col justify-between text-[10px] group transition-all"
              >
                <div className="flex items-center justify-between border-b border-borderColor/40 pb-1.5 mb-1.5">
                  <span className="font-bold text-brand-600 uppercase text-[8px]">{node.type}</span>
                  <button
                    onClick={() => removeVisualNode(node.id)}
                    className="p-0.5 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 rounded transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="font-medium text-text-primary leading-snug">{node.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
