import React from 'react';
import { 
  LayoutDashboard, 
  Scale, 
  Boxes, 
  Users, 
  Cpu, 
  FileText, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentTab, setTab, userRole }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Plant Overview',
      icon: LayoutDashboard,
      roles: ['admin', 'manager', 'operator', 'accountant'],
      badge: 'Live'
    },
    {
      id: 'weighbridge',
      label: 'Weighbridge & Sales',
      icon: Scale,
      roles: ['admin', 'manager', 'operator', 'accountant'],
      badge: 'Gross/Tare'
    },
    {
      id: 'inventory',
      label: 'Stock & Aggregates',
      icon: Boxes,
      roles: ['admin', 'manager', 'operator', 'accountant'],
      badge: '9 Grades'
    },
    {
      id: 'workforce',
      label: 'Workforce & Wages',
      icon: Users,
      roles: ['admin', 'manager', 'accountant'],
      badge: 'Payroll'
    },
    {
      id: 'machinery',
      label: 'Machinery & Fuel',
      icon: Cpu,
      roles: ['admin', 'manager', 'operator'],
      badge: 'Uptime'
    },
    {
      id: 'reports',
      label: 'Billing & Invoices',
      icon: FileText,
      roles: ['admin', 'manager', 'accountant'],
      badge: 'GST'
    }
  ];

  const allowedItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px]">
      <div className="p-4 space-y-6">
        
        {/* Navigation Category Label */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Operations & Control
          </p>
          <nav className="space-y-1">
            {allowedItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive 
                        ? 'bg-slate-950/20 text-slate-900' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Security & Role Access Info Box */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center space-x-2 text-amber-400 mb-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Access Control (RBAC)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Logged in as <span className="text-slate-200 font-semibold uppercase">{userRole}</span>. Restricted operational views update dynamically.
          </p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <span>Vite + React + Node + Mongo</span>
        <span className="text-emerald-400 font-mono text-[11px]">v1.0.0</span>
      </div>
    </aside>
  );
}
