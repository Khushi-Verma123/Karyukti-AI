import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  LayoutDashboard,
  Cpu,
  Database,
  GitBranch,
  ShieldCheck,
  HelpCircle,
  Settings,
  LogOut,
  FolderOpen,
  Eye,
  Server,
  Send
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'worker'] },
    { id: 'agent-chat', label: 'AI Copilot (Chat)', icon: Send, roles: ['admin', 'manager', 'worker'] },
    { id: 'agent-builder', label: 'Agent Builder', icon: Cpu, roles: ['admin', 'manager'] },
    { id: 'crm', label: 'CRM Workspace', icon: Database, roles: ['admin', 'manager', 'worker'] },
    { id: 'workflows', label: 'Workflows', icon: GitBranch, roles: ['admin', 'manager'] },
    { id: 'mcp', label: 'MCP Connectors', icon: Server, roles: ['admin'] },
    { id: 'audit-logs', label: 'Einstein Security Logs', icon: ShieldCheck, roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'manager', 'worker'] },
    { id: 'help', label: 'Help Center', icon: HelpCircle, roles: ['admin', 'manager', 'worker'] },
  ];

  const allowedItems = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-bg-secondary border-r border-borderColor flex flex-col h-screen select-none shrink-0 transition-colors duration-200">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-borderColor gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20">
          K
        </div>
        <div>
          <h1 className="font-bold text-sm leading-tight text-text-primary tracking-wide">Karyukti AI</h1>
          <span className="text-[10px] text-brand-600 font-semibold tracking-wider uppercase">Agentforce Hub</span>
        </div>
      </div>

      {/* User Status Card */}
      <div className="p-4 mx-3 my-4 rounded-xl bg-bg-tertiary/60 border border-borderColor/40 flex flex-col gap-1">
        <div className="text-xs font-semibold text-text-primary truncate">{user?.username}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] text-text-secondary font-medium capitalize">{user?.role} Mode</span>
        </div>
        <div className="text-[10px] text-brand-600 font-semibold mt-2 pt-1.5 border-t border-borderColor/40">
          🏢 {user?.businessType || 'No business type selected'}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {allowedItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/10'
                  : 'text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-borderColor">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};
