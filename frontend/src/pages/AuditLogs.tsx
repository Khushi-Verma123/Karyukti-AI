import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Search, RefreshCw } from 'lucide-react';

interface AuditLog {
  id: string;
  userId: string | null;
  username: string | null;
  action: string;
  details: string;
  timestamp: string;
}

export const AuditLogs: React.FC = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [token]);

  const filteredLogs = logs.filter(log => {
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      (log.username && log.username.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-text-primary">Einstein Security Trust Logs</h2>
          <p className="text-[10px] text-text-secondary">Immutable session audit trail capturing platform events and security intercepts.</p>
        </div>

        <button
          onClick={loadLogs}
          className="p-2 border border-borderColor hover:bg-bg-secondary rounded-xl text-text-secondary transition-colors"
        >
          <RefreshCw className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Filter and Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Filter audit events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-secondary border border-borderColor text-xs text-text-primary focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-bg-secondary border border-borderColor rounded-3xl overflow-hidden transition-colors">
        {loading ? (
          <div className="text-center py-12 text-xs text-text-muted">Loading audit trail...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-xs text-text-muted">No audit matches found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-bg-primary/40 border-b border-borderColor text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Event Category</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor/60">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-bg-primary/10 transition-colors">
                    <td className="p-4 font-mono text-[10px] text-text-muted">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                        log.action.includes('Block')
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-brand-500/10 text-brand-600 border border-brand-500/20'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-text-primary font-medium">{log.details}</td>
                    <td className="p-4 text-text-secondary font-medium">{log.username || 'Anonymous'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
