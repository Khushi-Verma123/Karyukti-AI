import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, ThemeType } from '../contexts/ThemeContext';
import {
  Palette,
  Shield,
  Key,
  Globe,
  Sliders,
  Check
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, geminiApiKey, setGeminiApiKey, setBusinessType } = useAuth();

  const themesList: Array<{ id: ThemeType; label: string; desc: string; preview: string }> = [
    { id: 'dark', label: 'Eclipse Dark', desc: 'High-contrast dark theme', preview: 'bg-slate-900 border-slate-700' },
    { id: 'light', label: 'Enterprise Light', desc: 'Standard business light theme', preview: 'bg-white border-slate-200' },
    { id: 'light-blue', label: 'Salesforce Ocean', desc: 'Modern light blue palette', preview: 'bg-sky-50 border-sky-200' },
    { id: 'eye-green', label: 'Eucalyptus Sage', desc: 'Soft green eye-strain prevention', preview: 'bg-emerald-50 border-emerald-200' },
    { id: 'yellow-comfort', label: 'Sepia Comfort', desc: 'Warm yellowish soft paper view', preview: 'bg-amber-50 border-amber-200' },
  ];

  return (
    <div className="space-y-8 max-w-3xl animate-fade-in">
      {/* 1. Theme Selection Grid */}
      <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-brand-500" />
          <div>
            <h3 className="text-sm font-bold text-text-primary">Enterprise Custom Themes</h3>
            <p className="text-[10px] text-text-secondary">Instantly switches colors across the entire console</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {themesList.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between aspect-[16/9] hover:shadow-md transition-all cursor-pointer ${
                theme === t.id ? 'border-brand-500 ring-2 ring-brand-500/20 bg-bg-tertiary' : 'border-borderColor bg-bg-primary/40'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className={`w-8 h-8 rounded-lg border-2 ${t.preview} shrink-0`}></div>
                {theme === t.id && (
                  <span className="p-1 bg-brand-500 text-white rounded-full">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-[11px] text-text-primary leading-tight">{t.label}</h4>
                <p className="text-[9px] text-text-muted mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Key configuration */}
      <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor transition-colors space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-brand-500" />
          <div>
            <h3 className="text-sm font-bold text-text-primary">Google Gemini developer credentials</h3>
            <p className="text-[10px] text-text-secondary">Plug in an optional API key to override the simulated Atlas reasoning service</p>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-text-secondary uppercase">Gemini API Key</label>
          <input
            type="password"
            value={geminiApiKey}
            onChange={e => setGeminiApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-bg-primary border border-borderColor text-xs text-text-primary focus:outline-none focus:border-brand-500 placeholder:text-text-muted"
          />
          <span className="text-[9px] text-text-muted mt-1.5 block">
            Leaving this blank is perfectly fine; the system will fallback automatically to the built-in offline NLP compiler.
          </span>
        </div>
      </div>

      {/* 3. Account Settings */}
      <div className="bg-bg-secondary p-6 rounded-3xl border border-borderColor transition-colors space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-500" />
          <div>
            <h3 className="text-sm font-bold text-text-primary">Profile Preferences</h3>
            <p className="text-[10px] text-text-secondary">Manage session parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-text-secondary uppercase">Email Account</label>
            <input
              type="text"
              value={user?.username || ''}
              className="w-full mt-1.5 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs opacity-60 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-text-secondary uppercase">Role Assignment</label>
            <input
              type="text"
              value={user?.role || ''}
              className="w-full mt-1.5 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs capitalize opacity-60 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-text-secondary uppercase">Organization Vertical</label>
            <select
              value={user?.businessType || ''}
              onChange={e => setBusinessType(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 bg-bg-primary border border-borderColor rounded-lg text-xs text-text-primary focus:outline-none"
            >
              <option>Healthcare</option>
              <option>Education</option>
              <option>Finance</option>
              <option>Banking</option>
              <option>Retail</option>
              <option>IT Company</option>
              <option>Law Firm</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
