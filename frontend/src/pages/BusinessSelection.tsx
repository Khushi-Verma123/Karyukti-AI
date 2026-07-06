import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  HeartPulse,
  GraduationCap,
  Coins,
  Building,
  ShoppingBag,
  Utensils,
  Hotel as HotelIcon,
  Factory,
  ShoppingCart,
  Laptop,
  Home,
  Compass,
  FileSpreadsheet,
  Megaphone,
  Scale,
  Hammer,
  Truck,
  Sprout,
  HelpCircle
} from 'lucide-react';

const verticals = [
  { name: 'Healthcare', icon: HeartPulse, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
  { name: 'Education', icon: GraduationCap, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { name: 'Finance', icon: Coins, color: 'text-green-500 bg-green-500/10 border-green-500/20' },
  { name: 'Banking', icon: Building, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'Retail', icon: ShoppingBag, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  { name: 'Restaurant', icon: Utensils, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { name: 'Hotel', icon: HotelIcon, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
  { name: 'Manufacturing', icon: Factory, color: 'text-gray-500 bg-gray-500/10 border-gray-500/20' },
  { name: 'E-commerce', icon: ShoppingCart, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  { name: 'IT Company', icon: Laptop, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
  { name: 'Real Estate', icon: Home, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  { name: 'Travel', icon: Compass, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
  { name: 'Insurance', icon: FileSpreadsheet, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  { name: 'Marketing Agency', icon: Megaphone, color: 'text-pink-500 bg-pink-500/10 border-pink-500/20' },
  { name: 'Law Firm', icon: Scale, color: 'text-violet-500 bg-violet-500/10 border-violet-500/20' },
  { name: 'Construction', icon: Hammer, color: 'text-yellow-600 bg-yellow-600/10 border-yellow-600/20' },
  { name: 'Logistics', icon: Truck, color: 'text-violet-600 bg-violet-600/10 border-violet-600/20' },
  { name: 'Agriculture', icon: Sprout, color: 'text-lime-600 bg-lime-600/10 border-lime-600/20' },
  { name: 'Other', icon: HelpCircle, color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' },
];

export const BusinessSelection: React.FC = () => {
  const { setBusinessType } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col justify-center items-center py-12 px-6 transition-colors duration-200">
      <div className="max-w-4xl w-full text-center mb-10">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight md:text-4xl">
          Welcome to Karyukti AI Platform
        </h1>
        <p className="text-sm text-text-secondary mt-3">
          Select your organization's business focus to calibrate the Einstein trust layers, workflow metrics, and reasoning tools.
        </p>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {verticals.map(vertical => {
          const Icon = vertical.icon;
          return (
            <button
              key={vertical.name}
              onClick={() => setBusinessType(vertical.name)}
              className="group p-5 rounded-2xl bg-bg-secondary border border-borderColor/60 text-left hover:border-brand-500/60 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200 flex flex-col justify-between aspect-square"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${vertical.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-text-primary leading-tight mt-4 group-hover:text-brand-500 transition-colors">
                  {vertical.name}
                </h3>
                <span className="text-[10px] text-text-muted mt-0.5 block">Configure Agent</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
