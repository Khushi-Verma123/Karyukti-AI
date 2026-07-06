import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  TrendingUp,
  DollarSign,
  UserCheck,
  Briefcase,
  Play,
  CheckCircle,
  FileText
} from 'lucide-react';

interface SummaryData {
  counts: { leads: number; deals: number; tasks: number; companies: number };
  metrics: { totalLeadValue: number; totalDealValue: number; pendingTasks: number };
}

export const ManagerDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/crm/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        }
      } catch (err) {
        console.error('Failed to get CRM summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-6 bg-bg-secondary border border-borderColor rounded-3xl transition-colors flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-text-primary tracking-tight">
            Welcome Back, Manager
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Analyzing metrics for the <span className="text-brand-500 font-bold">{user?.businessType || 'Retail'}</span> division workspace.
          </p>
        </div>
        <span className="px-3 py-1 bg-brand-500/10 text-brand-600 border border-brand-500/20 text-[10px] font-bold rounded-full">
          Active Workspace
        </span>
      </div>

      {/* CRM Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor flex items-center justify-between transition-colors">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Total Deals Target</span>
            <h3 className="text-xl font-extrabold text-text-primary mt-1">
              {loading ? '...' : `$${summary?.metrics.totalDealValue.toLocaleString()}`}
            </h3>
            <p className="text-[9px] text-text-muted mt-1">Stage: Negotiation / Proposal</p>
          </div>
          <div className="p-3 bg-green-500/10 text-green-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor flex items-center justify-between transition-colors">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Qualified Leads</span>
            <h3 className="text-xl font-extrabold text-text-primary mt-1">
              {loading ? '...' : `$${summary?.metrics.totalLeadValue.toLocaleString()}`}
            </h3>
            <p className="text-[9px] text-green-500 font-semibold mt-1">
              {summary?.counts.leads} active profiles
            </p>
          </div>
          <div className="p-3 bg-brand-500/10 text-brand-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor flex items-center justify-between transition-colors">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Pending Action Items</span>
            <h3 className="text-xl font-extrabold text-text-primary mt-1">
              {loading ? '...' : summary?.metrics.pendingTasks}
            </h3>
            <p className="text-[9px] text-text-muted mt-1">Assigned to team members</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor flex items-center justify-between transition-colors">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Registered Companies</span>
            <h3 className="text-xl font-extrabold text-text-primary mt-1">
              {loading ? '...' : summary?.counts.companies}
            </h3>
            <p className="text-[9px] text-brand-600 font-semibold mt-1">Accounts database</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics & Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Quick Reports */}
        <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Executive Summary Reports</h3>
              <p className="text-[10px] text-text-secondary">Custom metrics compiled by agent coordinators</p>
            </div>
            <FileText className="w-5 h-5 text-brand-500" />
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-bg-tertiary border border-borderColor/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-brand-500/10 text-brand-600 font-bold px-2 py-0.5 rounded-full">Automated Plan</span>
                <h4 className="font-bold text-xs text-text-primary mt-2">Sales Forecast Q3</h4>
                <p className="text-[10px] text-text-secondary mt-0.5">Projected revenue increase of 14% based on active lead qualifiers.</p>
              </div>
              <button 
                onClick={() => setActiveReport('Sales Forecast Q3')}
                className="p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-md shadow-brand-500/10 transition-colors cursor-pointer">
                <Play className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-bg-tertiary border border-borderColor/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full">Customer Retention</span>
                <h4 className="font-bold text-xs text-text-primary mt-2">Client Feedback Synthesis</h4>
                <p className="text-[10px] text-text-secondary mt-0.5">94% response satisfaction rate processed by Support and Survey agent.</p>
              </div>
              <button 
                onClick={() => setActiveReport('Client Feedback Synthesis')}
                className="p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-md shadow-brand-500/10 transition-colors cursor-pointer">
                <Play className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Assigned Workflow Overview */}
        <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-1">Active Pipelines</h3>
            <p className="text-[10px] text-text-secondary mb-4">Operations monitoring overview</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-text-primary">Lead qualification triggers</div>
                  <div className="text-[9px] text-text-secondary">Condition: Value &gt; 50k</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-text-primary">Slack notifier automation</div>
                  <div className="text-[9px] text-text-secondary">Destination: #sales-alerts</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-500 shrink-0 animate-pulse" />
                <div>
                  <div className="text-xs font-semibold text-text-primary">Invoice reminders agent</div>
                  <div className="text-[9px] text-text-secondary">Drafts invoice and schedules email</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-borderColor/40 mt-6">
            <div className="text-[10px] text-text-secondary bg-bg-tertiary p-3 rounded-xl border border-borderColor">
              <strong>Tip:</strong> Go to the <span className="font-semibold text-brand-600">Workflows</span> tab to build new connected trigger nodes.
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {activeReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4">
          <div className="bg-bg-secondary p-8 rounded-3xl border border-borderColor w-full max-w-2xl shadow-xl">
            <h3 className="text-xl font-bold text-text-primary mb-2">{activeReport}</h3>
            <div className="text-xs text-text-secondary space-y-4 max-h-[60vh] overflow-y-auto">
              <p>This is an AI-generated synthesis of the requested report.</p>
              {activeReport === 'Sales Forecast Q3' ? (
                <>
                  <p><strong>Analysis:</strong> Our pipeline indicates strong Q3 performance.</p>
                  <p><strong>Metrics:</strong> 14% projected increase in lead-to-close ratio.</p>
                  <p><strong>Recommendation:</strong> Allocate more support agents to high-value tiers.</p>
                </>
              ) : (
                <>
                  <p><strong>Analysis:</strong> Client feedback has remained consistently positive over the last 30 days.</p>
                  <p><strong>Metrics:</strong> 94% overall satisfaction rate recorded.</p>
                  <p><strong>Recommendation:</strong> Consider launching a referral campaign for top advocates.</p>
                </>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveReport(null)}
                className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
