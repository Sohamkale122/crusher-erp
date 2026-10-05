import React from 'react';
import { 
  Building2, 
  LogOut, 
  ShieldCheck, 
  User, 
  Radio, 
  ArrowLeftRight 
} from 'lucide-react';

export default function Navbar({ currentUser, onLogout, onSwitchRole }) {
  const roles = [
    { id: 'admin', label: 'Admin', desc: 'Full Master Access' },
    { id: 'manager', label: 'Manager', desc: 'Operations & Staff' },
    { id: 'operator', label: 'Operator', desc: 'Weighbridge & Dispatches' },
    { id: 'accountant', label: 'Accountant', desc: 'Billing & Payments' }
  ];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'manager': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'operator': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'accountant': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-30 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        
        {/* Brand & Plant Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Building2 className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg tracking-wider text-slate-100 uppercase">
                TITAN <span className="text-amber-400">CRUSHER</span> ERP
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                Plant Online
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Quarry Unit #4 • Blue Metal Aggregates & M-Sand Plant
            </p>
          </div>
        </div>

        {/* Right Action Tools: Role Quick-Switcher & User Info */}
        <div className="flex items-center space-x-3 lg:space-x-5">
          
          {/* Quick Role Switcher */}
          <div className="hidden md:flex items-center space-x-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
              Demo Role:
            </span>
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => onSwitchRole(r.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentUser?.role === r.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={`Switch to ${r.label} (${r.desc})`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center space-x-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs uppercase border border-slate-600">
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-100 leading-tight">
                {currentUser?.name || 'Operator'}
              </p>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] uppercase font-bold border ${getRoleBadgeColor(currentUser?.role)}`}>
                  {currentUser?.role || 'Guest'}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
