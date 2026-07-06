import React, { useState } from 'react';
import { Search, HelpCircle, BookOpen, Key, Volume2, Shield } from 'lucide-react';

interface Faq {
  q: string;
  a: string;
  category: string;
}

const faqs: Faq[] = [
  {
    q: 'How does Karyukti work without an active Gemini API key?',
    a: 'Karyukti features an offline local NLP compilation service called the Atlas Reasoning Engine. It parses queries, runs policy filters, reads your active CRM items and vertical context, and compiles precise answers. If you want to use the live Gemini model, navigate to the Settings page and paste your developer API key.',
    category: 'Reasoning'
  },
  {
    q: 'What is the Einstein Trust Layer security setup?',
    a: 'It is a security filter middleware. Every input query passes through an injection analysis checker and a PII mask filter. Phone numbers, credit cards, and SSNs are automatically masked before processing, and critical actions write audit events directly to the logs database.',
    category: 'Security'
  },
  {
    q: 'How can I trigger the Voice Agent speech controls?',
    a: 'Click the Microphone button in the Worker Workspace to enable Speech-to-Text translation. When the agent replies, click the Speaker icon adjacent to the message bubble to read it aloud using the Web Speech Synthesis API.',
    category: 'Voice'
  },
  {
    q: 'Who can deploy custom AI agents?',
    a: 'Only users with the Admin role are allowed to toggle the deployment switch on custom or prebuilt agent cards. Managers can create and customize agents, and Workers can chat with active deployed agents.',
    category: 'Permissions'
  },
];

export const HelpCenter: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  const filteredFaqs = faqs.filter(f => {
    const matchesSearch = f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCat === 'All' || f.category === activeCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Help Banner Header */}
      <div className="p-6 bg-gradient-to-br from-brand-700 to-indigo-800 rounded-3xl text-white shadow-lg space-y-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Karyukti documentation center</h2>
          <p className="text-xs text-brand-100 mt-1">Get tutorials, read faqs, and check security manuals.</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs and guides..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-900 border border-transparent rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Feature Explanations Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor transition-colors">
          <Shield className="w-5 h-5 text-brand-500 mb-3" />
          <h4 className="font-bold text-xs text-text-primary">Einstein Security</h4>
          <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">
            Masks credit card numbers, email, and SSNs. Prevents prompt injection scripts from executing.
          </p>
        </div>

        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor transition-colors">
          <BookOpen className="w-5 h-5 text-indigo-500 mb-3" />
          <h4 className="font-bold text-xs text-text-primary">Atlas Reasoning</h4>
          <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">
            Generates plans, breaks inquiries down into smaller subtasks, and performs multi-agent execution.
          </p>
        </div>

        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor transition-colors">
          <Volume2 className="w-5 h-5 text-emerald-500 mb-3" />
          <h4 className="font-bold text-xs text-text-primary">Voice Synthesis</h4>
          <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">
            Speech-to-Text transcriptions and Text-to-Speech replies using native Web Speech browser components.
          </p>
        </div>

        <div className="bg-bg-secondary p-5 rounded-2xl border border-borderColor transition-colors">
          <Key className="w-5 h-5 text-amber-500 mb-3" />
          <h4 className="font-bold text-xs text-text-primary">Offline Fallback</h4>
          <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">
            Calibrates response algorithms locally using seeded SQLite/JSON structures for zero external API latency.
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor transition-colors space-y-4">
        <div className="flex items-center justify-between border-b border-borderColor/40 pb-3">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Frequently Asked Questions</h3>
          
          <div className="flex items-center gap-1.5">
            {['All', 'Reasoning', 'Security', 'Voice', 'Permissions'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                  activeCat === cat
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-bg-primary text-text-secondary border-borderColor hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 divide-y divide-borderColor/40">
          {filteredFaqs.map((f, i) => (
            <div key={i} className={`${i > 0 ? 'pt-4' : ''} space-y-1.5`}>
              <h4 className="font-bold text-xs text-text-primary flex items-start gap-1.5">
                <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>{f.q}</span>
              </h4>
              <p className="text-[10px] text-text-secondary pl-5.5 leading-relaxed">{f.a}</p>
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-6 text-xs text-text-muted">No answers match your query.</div>
          )}
        </div>
      </div>
    </div>
  );
};
