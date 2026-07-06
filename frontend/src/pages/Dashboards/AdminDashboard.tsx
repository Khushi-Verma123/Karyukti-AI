import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Cpu,
  Database,
  ShieldCheck,
  TrendingUp,
  Server,
  Users,
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface AuditLog {
  id: string;
  username: string;
  action: string;
  details: string;
  timestamp: string;
}

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeAgents: 20,
    deployments: 12,
    storageUsage: '14.8 GB',
    totalUsers: 3
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/auth/logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-brand-700 to-brand-500 rounded-3xl text-white shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Karyukti Admin Control Center</h2>
          <p className="text-xs text-brand-100 mt-1">
            Global monitoring, Einstein Trust Layer filters, and Docker monorepo deployment diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold backdrop-blur-md">
          <Activity className="w-4 h-4 animate-pulse text-green-300" />
          <span>System Status: Healthy</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor flex justify-between items-start transition-colors">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Active Agents</span>
            <h3 className="text-2xl font-extrabold text-text-primary mt-1">{stats.activeAgents}</h3>
            <span className="text-[9px] text-green-500 font-semibold flex items-center gap-0.5 mt-1.5">
              <TrendingUp className="w-3 h-3" /> +4 prebuilt this week
            </span>
          </div>
          <div className="p-3 bg-brand-500/10 text-brand-600 rounded-xl">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor flex justify-between items-start transition-colors">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Live Deployments</span>
            <h3 className="text-2xl font-extrabold text-text-primary mt-1">{stats.deployments}</h3>
            <span className="text-[9px] text-brand-600 font-semibold flex items-center gap-0.5 mt-1.5">
              Docker active: 100%
            </span>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-600 rounded-xl">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor flex justify-between items-start transition-colors">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Database Storage</span>
            <h3 className="text-2xl font-extrabold text-text-primary mt-1">{stats.storageUsage}</h3>
            <span className="text-[9px] text-text-secondary mt-1.5 block">SQLite persistent db</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor flex justify-between items-start transition-colors">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Console Users</span>
            <h3 className="text-2xl font-extrabold text-text-primary mt-1">{stats.totalUsers}</h3>
            <span className="text-[9px] text-text-muted mt-1.5 block">RBAC controls configured</span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Einstein Logs & Deployment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Audit logs */}
        <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor lg:col-span-2 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Einstein Security Trust Trail</h3>
              <p className="text-[10px] text-text-secondary">Security intercepts, logins, and API deployments</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-brand-500" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {loading ? (
              <div className="text-center py-8 text-xs text-text-muted">Loading trail logs...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-xs text-text-muted">No security events found.</div>
            ) : (
              logs.map(log => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-bg-tertiary border border-borderColor/40 flex flex-col gap-1 text-[11px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-600">{log.action}</span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-text-primary">{log.details}</div>
                  <div className="text-[9px] text-text-muted mt-1">Initiated by: {log.username}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Deployments Status Widget */}
        <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-1">Docker Compose Registry</h3>
            <p className="text-[10px] text-text-secondary mb-4">Current container runtime diagnostics</p>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 bg-bg-primary rounded-xl border border-borderColor">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-xs font-semibold text-text-primary">agentforce-backend</span>
                </div>
                <span className="text-[10px] text-text-secondary">PORT 3001</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-bg-primary rounded-xl border border-borderColor">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-xs font-semibold text-text-primary">agentforce-frontend</span>
                </div>
                <span className="text-[10px] text-text-secondary">PORT 3000</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-bg-primary rounded-xl border border-borderColor">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-semibold text-text-primary">sqlite-database</span>
                </div>
                <span className="text-[10px] text-text-secondary">Connected</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-borderColor/40 mt-4">
            <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-md transition-all">
              <span>Sync All Containers</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
