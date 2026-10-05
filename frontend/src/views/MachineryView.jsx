import React, { useState } from 'react';
import { 
  Cpu, 
  Fuel, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Wrench, 
  Plus, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';

export default function MachineryView({ machinery, userRole, onUpdateMachinery }) {
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('Running');
  const [editHours, setEditHours] = useState('');
  const [editFuel, setEditFuel] = useState('');

  const totalFuelToday = machinery.reduce((sum, m) => sum + (m.fuelConsumedLitersToday || 0), 0);
  const totalHoursToday = machinery.reduce((sum, m) => sum + (m.operatingHoursToday || 0), 0);
  const activeCount = machinery.filter(m => m.status === 'Running').length;

  const startEdit = (m) => {
    setEditingId(m._id);
    setEditStatus(m.status);
    setEditHours(m.operatingHoursToday);
    setEditFuel(m.fuelConsumedLitersToday);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await onUpdateMachinery(editingId, {
      status: editStatus,
      operatingHoursToday: parseFloat(editHours) || 0,
      fuelConsumedLitersToday: parseFloat(editFuel) || 0
    });
    setEditingId(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Running':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'Maintenance':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'Breakdown':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-400" />
            <span>Heavy Machinery, Crusher Plant & Fuel Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Jaw crusher, cone crusher, VSI sand maker, loaders, and diesel consumption logs
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Operational Uptime</span>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {activeCount} / {machinery.length} Units Active
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Plant operating at full capacity</span>
          </div>
          <Activity className="w-6 h-6 text-emerald-400 opacity-60" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Diesel Consumed Today</span>
            <div className="text-xl font-black text-sky-400 font-mono mt-0.5">
              {totalFuelToday} Liters
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">HSD industrial fuel flow</span>
          </div>
          <Fuel className="w-6 h-6 text-sky-400 opacity-60" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Crushing Hours</span>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
              {totalHoursToday.toFixed(1)} Hours
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Shift runtime today</span>
          </div>
          <Clock className="w-6 h-6 text-amber-400 opacity-60" />
        </div>
      </div>

      {/* Machinery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {machinery.map(item => (
          <div 
            key={item._id} 
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition shadow-xl relative overflow-hidden"
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {item.machineCode}
                </span>
                <h3 className="font-bold text-sm text-white mt-1.5 leading-snug">
                  {item.name}
                </h3>
                <p className="text-[11px] text-slate-400">{item.type}</p>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(item.status)}`}>
                {item.status}
              </span>
            </div>

            {/* Health Rating Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Equipment Health Rating</span>
                <span className="font-mono font-bold text-emerald-400">{item.healthRatingPercent || 95}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full rounded-full ${item.healthRatingPercent < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${item.healthRatingPercent || 95}%` }}
                ></div>
              </div>
            </div>

            {/* Telemetry metrics */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Today's Runtime:</span>
                <span className="font-mono font-bold text-slate-200">{item.operatingHoursToday} hrs</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Diesel Log:</span>
                <span className="font-mono font-bold text-sky-400">{item.fuelConsumedLitersToday} L</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-800 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Pilot / Operator:</span>
                <span className="font-semibold text-slate-200">{item.assignedOperator || 'Staff'}</span>
              </div>
            </div>

            {/* Action Bar */}
            {['admin', 'manager', 'operator'].includes(userRole) && (
              <button
                onClick={() => startEdit(item)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>Log Hours, Fuel or Status</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Edit Machinery Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm text-slate-100 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white">Log Equipment Operations</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Running">Running / Operational</option>
                  <option value="Idle">Idle (Standby)</option>
                  <option value="Maintenance">Under Scheduled Maintenance</option>
                  <option value="Breakdown">Breakdown Repair</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Operating Hours Today</label>
                <input
                  type="number"
                  step="0.5"
                  value={editHours}
                  onChange={e => setEditHours(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Diesel Consumed Today (Liters)</label>
                <input
                  type="number"
                  value={editFuel}
                  onChange={e => setEditFuel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sky-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 text-xs">
              <button
                onClick={() => setEditingId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Save Equipment Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
