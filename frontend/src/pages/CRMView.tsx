import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  Filter,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

type EntityType = 'leads' | 'contacts' | 'deals' | 'tasks' | 'companies' | 'invoices' | 'meetings';

export const CRMView: React.FC = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<EntityType>('leads');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  // Generic Form State for dynamic additions
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const loadCrmData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/crm/${activeTab}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrmData();
    setFormData({}); // Clear form on tab transition
  }, [activeTab, token]);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/crm/${activeTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({});
        setShowAddModal(false);
        loadCrmData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/crm/${activeTab}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadCrmData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    const searchString = JSON.stringify(item).toLowerCase();
    return searchString.includes(term);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* CRM Navigation Sub Header */}
      <div className="flex flex-wrap gap-2 border-b border-borderColor/60 pb-3">
        {(['leads', 'contacts', 'deals', 'tasks', 'companies', 'invoices', 'meetings'] as EntityType[]).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchTerm('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
              activeTab === tab
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/10'
                : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Control Actions Panel */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-secondary border border-borderColor text-xs text-text-primary focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {user && ['admin', 'manager'].includes(user.role) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="capitalize">Add {activeTab.slice(0, -1)}</span>
            </button>
          )}
          <button
            onClick={loadCrmData}
            className="p-2 border border-borderColor hover:bg-bg-secondary rounded-xl text-text-secondary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Database Output List */}
      <div className="bg-bg-secondary border border-borderColor rounded-3xl overflow-hidden transition-colors">
        {loading ? (
          <div className="text-center py-16 text-xs text-text-muted">Loading records...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-xs text-text-muted flex flex-col items-center justify-center gap-2">
            <FolderOpen className="w-8 h-8 opacity-40 text-brand-500" />
            <span>No records found in this CRM category.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-bg-primary/40 border-b border-borderColor text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  {activeTab === 'leads' && (
                    <>
                      <th className="p-4">Name</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Deal Value</th>
                      <th className="p-4">Status</th>
                    </>
                  )}
                  {activeTab === 'contacts' && (
                    <>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Role</th>
                    </>
                  )}
                  {activeTab === 'deals' && (
                    <>
                      <th className="p-4">Deal Title</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Value</th>
                      <th className="p-4">Stage</th>
                      <th className="p-4">Close Date</th>
                    </>
                  )}
                  {activeTab === 'tasks' && (
                    <>
                      <th className="p-4">Task</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Due Date</th>
                    </>
                  )}
                  {activeTab === 'companies' && (
                    <>
                      <th className="p-4">Company Name</th>
                      <th className="p-4">Industry</th>
                      <th className="p-4">Employees</th>
                      <th className="p-4">Revenue</th>
                    </>
                  )}
                  {activeTab === 'invoices' && (
                    <>
                      <th className="p-4">Invoice #</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                    </>
                  )}
                  {activeTab === 'meetings' && (
                    <>
                      <th className="p-4">Meeting Title</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Duration</th>
                    </>
                  )}
                  {user && ['admin', 'manager'].includes(user.role) && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor/60">
                {filteredItems.map(item => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedEntity(item)}
                    className="hover:bg-bg-primary/20 transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-mono text-[10px] text-text-muted">{item.id}</td>
                    {activeTab === 'leads' && (
                      <>
                        <td className="p-4 font-semibold text-text-primary">{item.name}</td>
                        <td className="p-4 text-text-secondary">{item.company}</td>
                        <td className="p-4 text-text-secondary">{item.email}</td>
                        <td className="p-4 font-semibold text-brand-600">${item.value?.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-brand-500/10 text-brand-600 rounded text-[9px] font-bold">
                            {item.status}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === 'contacts' && (
                      <>
                        <td className="p-4 font-semibold text-text-primary">{item.name}</td>
                        <td className="p-4 text-text-secondary">{item.company}</td>
                        <td className="p-4 text-text-secondary">{item.email}</td>
                        <td className="p-4 text-text-secondary">{item.phone}</td>
                        <td className="p-4 text-text-secondary">{item.role}</td>
                      </>
                    )}
                    {activeTab === 'deals' && (
                      <>
                        <td className="p-4 font-semibold text-text-primary">{item.title}</td>
                        <td className="p-4 text-text-secondary">{item.company}</td>
                        <td className="p-4 font-semibold text-brand-600">${item.value?.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-600 rounded text-[9px] font-bold">
                            {item.stage}
                          </span>
                        </td>
                        <td className="p-4 text-text-secondary">{item.closeDate}</td>
                      </>
                    )}
                    {activeTab === 'tasks' && (
                      <>
                        <td className="p-4 font-semibold text-text-primary">{item.title}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            item.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-500'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[9px] font-bold">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-text-secondary">{item.dueDate}</td>
                      </>
                    )}
                    {activeTab === 'companies' && (
                      <>
                        <td className="p-4 font-semibold text-text-primary">{item.name}</td>
                        <td className="p-4 text-text-secondary">{item.industry}</td>
                        <td className="p-4 text-text-secondary">{item.employees}</td>
                        <td className="p-4 font-semibold text-brand-600">${item.revenue?.toLocaleString()}</td>
                      </>
                    )}
                    {activeTab === 'invoices' && (
                      <>
                        <td className="p-4 font-semibold text-text-primary">{item.invoiceNumber}</td>
                        <td className="p-4 text-text-secondary">{item.company}</td>
                        <td className="p-4 font-semibold text-brand-600">${item.amount?.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-600 rounded text-[9px] font-bold">
                            {item.status}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === 'meetings' && (
                      <>
                        <td className="p-4 font-semibold text-text-primary">{item.title}</td>
                        <td className="p-4 text-text-secondary">{item.company}</td>
                        <td className="p-4 text-text-secondary">{new Date(item.time).toLocaleDateString()}</td>
                        <td className="p-4 text-text-secondary">{item.duration} mins</td>
                      </>
                    )}
                    {user && ['admin', 'manager'].includes(user.role) && (
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Remove record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dynamic Add CRM Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor w-full max-w-sm shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary capitalize">Add CRM {activeTab.slice(0, -1)}</h3>
              <p className="text-[10px] text-text-secondary">Input details for the new record.</p>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3.5">
              {activeTab === 'leads' && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Lead Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Company</label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={e => handleInputChange('company', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Email Address</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Deal Value ($)</label>
                    <input
                      type="number"
                      value={formData.value || 10000}
                      onChange={e => handleInputChange('value', Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Status</label>
                    <input
                      type="text"
                      value={formData.status || 'New'}
                      onChange={e => handleInputChange('status', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              {activeTab === 'contacts' && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Contact Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Company</label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={e => handleInputChange('company', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Phone</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Role</label>
                    <input
                      type="text"
                      value={formData.role || ''}
                      onChange={e => handleInputChange('role', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              {activeTab === 'deals' && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Deal Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={e => handleInputChange('title', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Company</label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={e => handleInputChange('company', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Value ($)</label>
                    <input
                      type="number"
                      value={formData.value || 50000}
                      onChange={e => handleInputChange('value', Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Stage</label>
                    <input
                      type="text"
                      value={formData.stage || 'Prospecting'}
                      onChange={e => handleInputChange('stage', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Close Date</label>
                    <input
                      type="date"
                      value={formData.closeDate || ''}
                      onChange={e => handleInputChange('closeDate', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              {activeTab === 'tasks' && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Task Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={e => handleInputChange('title', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Priority</label>
                    <select
                      value={formData.priority || 'Medium'}
                      onChange={e => handleInputChange('priority', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs text-text-primary"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Status</label>
                    <input
                      type="text"
                      value={formData.status || 'Not Started'}
                      onChange={e => handleInputChange('status', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate || ''}
                      onChange={e => handleInputChange('dueDate', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              {activeTab === 'companies' && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Company Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Industry</label>
                    <input
                      type="text"
                      value={formData.industry || ''}
                      onChange={e => handleInputChange('industry', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Employees</label>
                    <input
                      type="number"
                      value={formData.employees || 50}
                      onChange={e => handleInputChange('employees', Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Revenue ($)</label>
                    <input
                      type="number"
                      value={formData.revenue || 1000000}
                      onChange={e => handleInputChange('revenue', Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              {activeTab === 'invoices' && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Invoice #</label>
                    <input
                      type="text"
                      value={formData.invoiceNumber || ''}
                      onChange={e => handleInputChange('invoiceNumber', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Company</label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={e => handleInputChange('company', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Amount ($)</label>
                    <input
                      type="number"
                      value={formData.amount || 1500}
                      onChange={e => handleInputChange('amount', Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Status</label>
                    <input
                      type="text"
                      value={formData.status || 'Draft'}
                      onChange={e => handleInputChange('status', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              {activeTab === 'meetings' && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Meeting Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={e => handleInputChange('title', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Company</label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={e => handleInputChange('company', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Time</label>
                    <input
                      type="datetime-local"
                      value={formData.time || ''}
                      onChange={e => handleInputChange('time', e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-text-secondary uppercase">Duration (mins)</label>
                    <input
                      type="number"
                      value={formData.duration || 30}
                      onChange={e => handleInputChange('duration', Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs py-2 rounded-xl cursor-pointer shadow-md transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-borderColor text-text-secondary hover:bg-bg-tertiary font-bold text-xs py-2 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entity Details Modal */}
      {selectedEntity && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4">
          <div className="bg-bg-secondary p-8 rounded-3xl border border-borderColor w-full max-w-lg shadow-xl">
            <h3 className="text-xl font-bold text-text-primary mb-4 capitalize">
              {activeTab.slice(0, -1)} Details
            </h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {Object.entries(selectedEntity).map(([key, value]) => (
                <div key={key} className="flex flex-col border-b border-borderColor/40 pb-2">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{key}</span>
                  <span className="text-sm text-text-primary mt-1">
                    {typeof value === 'object' && value !== null 
                      ? JSON.stringify(value) 
                      : String(value)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEntity(null)}
                className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
