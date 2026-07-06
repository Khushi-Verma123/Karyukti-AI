import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { BusinessSelection } from './pages/BusinessSelection';
import { AdminDashboard } from './pages/Dashboards/AdminDashboard';
import { ManagerDashboard } from './pages/Dashboards/ManagerDashboard';
import { WorkerDashboard } from './pages/Dashboards/WorkerDashboard';
import { AgentBuilder } from './pages/AgentBuilder';
import { CRMView } from './pages/CRMView';
import { WorkflowEditor } from './pages/WorkflowEditor';
import { McpConnectors } from './pages/McpConnectors';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';
import { HelpCenter } from './pages/HelpCenter';
import { Search, X, Shield, RefreshCw } from 'lucide-react';

const DashboardSwitch: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'manager') return <ManagerDashboard />;
  return <WorkerDashboard />;
};

const WorkspaceLayout: React.FC = () => {
  const { user, token, switchRole } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>({
    agents: [], leads: [], deals: [], contacts: [], tasks: []
  });
  const [searching, setSearching] = useState(false);

  const handleGlobalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/crm/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setSearchOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardSwitch />;
      case 'agent-chat':
        return <WorkerDashboard />;
      case 'agent-builder':
        return <AgentBuilder />;
      case 'crm':
        return <CRMView />;
      case 'workflows':
        return <WorkflowEditor />;
      case 'mcp':
        return <McpConnectors />;
      case 'audit-logs':
        return <AuditLogs />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <HelpCenter />;
      default:
        return <DashboardSwitch />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary transition-colors duration-200">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Consolidated Utility Bar */}
        <header className="h-16 border-b border-borderColor bg-bg-secondary flex items-center justify-between px-8 shrink-0 transition-colors duration-200">
          {/* Global Search Bar */}
          <form onSubmit={handleGlobalSearch} className="relative w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search Agents, CRM leads, deals..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-bg-primary/50 border border-borderColor rounded-xl text-xs text-text-primary focus:outline-none focus:border-brand-500 placeholder:text-text-muted"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                className="absolute right-2.5 top-2.5 p-0.5 hover:bg-bg-tertiary rounded text-text-muted"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Right quick stats */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 text-[10px] font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>Trust Filter Active</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
              <span className="font-semibold uppercase tracking-wider text-text-muted">Console Mode:</span>
              <select
                value={user?.role || 'admin'}
                onChange={e => {
                  switchRole(e.target.value as any);
                  setCurrentTab('dashboard'); // reset tab to safety
                }}
                className="bg-bg-primary border border-borderColor rounded-lg px-2 py-1 text-[10px] font-bold text-brand-600 focus:outline-none cursor-pointer capitalize"
              >
                <option value="admin">Admin Panel</option>
                <option value="manager">Manager Panel</option>
                <option value="worker">Worker Panel</option>
              </select>
            </div>
          </div>
        </header>

        {/* Workspace Body Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {renderContent()}

          {/* Federated Search Results Dropdown Overlay */}
          {searchOpen && (
            <div className="absolute top-2 left-8 right-8 bg-bg-secondary border border-borderColor rounded-3xl shadow-xl z-40 max-h-[80%] overflow-y-auto p-6 space-y-4 animate-fade-in transition-colors duration-200">
              <div className="flex items-center justify-between border-b border-borderColor pb-3">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Federated Search Matches for "{searchQuery}"
                </h3>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 hover:bg-bg-tertiary rounded-lg text-text-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CRM leads */}
              {searchResults.leads.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-text-muted uppercase mb-1.5">CRM Leads</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {searchResults.leads.map((l: any) => (
                      <div key={l.id} className="p-3 bg-bg-primary rounded-xl border border-borderColor text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-text-primary">{l.name}</div>
                          <div className="text-[10px] text-text-muted">{l.company} • {l.email}</div>
                        </div>
                        <span className="text-[10px] font-semibold text-brand-600">${l.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CRM Deals */}
              {searchResults.deals.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-text-muted uppercase mb-1.5">CRM Deals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {searchResults.deals.map((d: any) => (
                      <div key={d.id} className="p-3 bg-bg-primary rounded-xl border border-borderColor text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-text-primary">{d.title}</div>
                          <div className="text-[10px] text-text-muted">{d.company} • Stage: {d.stage}</div>
                        </div>
                        <span className="text-[10px] font-semibold text-green-600">${d.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom / Prebuilt Agents */}
              {searchResults.agents.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-text-muted uppercase mb-1.5">AI Agents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {searchResults.agents.map((a: any) => (
                      <div key={a.id} className="p-3 bg-bg-primary rounded-xl border border-borderColor text-xs">
                        <div className="font-bold text-text-primary">{a.name}</div>
                        <div className="text-[10px] text-text-secondary mt-0.5 line-clamp-1">{a.goal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.values(searchResults).every((arr: any) => arr.length === 0) && (
                <div className="text-center py-6 text-xs text-text-muted">
                  No matches found across Agents, CRM data, or accounts.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const AuthBarrier: React.FC = () => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col justify-center items-center gap-3">
        <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
        <span className="text-xs text-text-secondary font-medium">Resolving Karyukti Session...</span>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col justify-center items-center gap-3">
        <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
        <span className="text-xs text-text-secondary font-medium">Bypassing login credentials portal... Logging in as default Admin</span>
      </div>
    );
  }

  if (!user?.businessType) {
    return <BusinessSelection />;
  }

  return <WorkspaceLayout />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthBarrier />
      </AuthProvider>
    </ThemeProvider>
  );
}
