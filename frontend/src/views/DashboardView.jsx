import React from 'react';
import { 
  Scale, 
  DollarSign, 
  Boxes, 
  Truck, 
  Cpu, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  Plus, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export default function DashboardView({ 
  stats, 
  onNewDispatch, 
  onViewChallan, 
  setTab 
}) {
  if (!stats) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse">
        Loading real-time plant telemetry & metrics...
      </div>
    );
  }

  const {
    totalRevenue,
    pendingReceivables,
    totalTonnageDispatched,
    totalStockMT,
    todayDispatchesCount,
    machineryStatus,
    lowStockAlerts,
    categoryBreakdown,
    recentDispatches
  } = stats;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Real-time Quarry Telemetry Active</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Plant Control Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Blue Metal Aggregates, M-Sand Washing, Electronic Weighbridge & Heavy Fleet Status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onNewDispatch}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Weighbridge Entry (Gate Pass)</span>
          </button>
          
          <button
            onClick={() => setTab('inventory')}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs border border-slate-700 transition"
          >
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>Stock Status</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-mono">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>All active dispatches billed</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Dispatched Tonnage */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dispatched Tonnage</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-mono">
              {totalTonnageDispatched.toLocaleString('en-IN')} <span className="text-xs font-medium text-slate-400">MT</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Net certified rock & aggregate dispatches
            </p>
          </div>
        </div>

        {/* Metric 3: Pending Receivables */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credit Receivables</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-400 font-mono">
              ₹{pendingReceivables.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Outstanding contractor invoices
            </p>
          </div>
        </div>

        {/* Metric 4: Yard Stock Level */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Yard Stock</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-blue-400 font-mono">
              {totalStockMT.toLocaleString('en-IN')} <span className="text-xs font-medium text-slate-400">MT</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Aggregates, Sand & Boulder stock
            </p>
          </div>
        </div>

      </div>

      {/* Row 2: Category Stock Visuals & Machinery / Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stock Breakdown By Material Category */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Stockpile Balance by Category</h2>
              <p className="text-xs text-slate-400">Current tonnage reserved across bins and outdoor yards</p>
            </div>
            <button
              onClick={() => setTab('inventory')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Manage Bays</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(categoryBreakdown || {}).map(([cat, tonnage]) => {
              const pct = totalStockMT > 0 ? Math.round((tonnage / totalStockMT) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-200">{cat}</span>
                    <span className="text-slate-400 font-mono">
                      <strong className="text-amber-400">{tonnage.toLocaleString('en-IN')} MT</strong> ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Low Stock Alerts If Any */}
          {lowStockAlerts && lowStockAlerts.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-rose-400 mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Low Stock / Reorder Threshold Alerts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lowStockAlerts.map(alert => (
                  <div key={alert.id} className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-100">{alert.name}</p>
                      <p className="text-[11px] text-slate-400">{alert.bayLocation}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-rose-400 font-black">{alert.currentStockMT} MT</span>
                      <span className="block text-[10px] text-slate-500">Min: {alert.reorderLevelMT} MT</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Machinery Status Widget */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Crusher Plant Machinery</h2>
                <p className="text-xs text-slate-400">Jaw, Cone, VSI & Genset Uptime</p>
              </div>
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>

            <div className="space-y-3 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-300">Operational Machines</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {machineryStatus?.running || 0} / {machineryStatus?.total || 0}
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-300">Under Maintenance</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {machineryStatus?.maintenance || 0} units
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-300">Fuel / Diesel Consumed Today</span>
                <span className="text-sm font-bold text-sky-400 font-mono">
                  {machineryStatus?.fuelConsumedLiters || 0} Liters
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setTab('machinery')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition text-center"
            >
              View Plant Equipment Telemetry & Diesel Logs →
            </button>
          </div>
        </div>

      </div>

      {/* Row 3: Recent Dispatches & Live Weighbridge Ledger */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Weighbridge Dispatch Feed</h2>
            <p className="text-xs text-slate-400">Latest trucks weighed out with certified gate pass numbers</p>
          </div>
          <button
            onClick={() => setTab('weighbridge')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Full Weighbridge Register</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase text-[11px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Challan No</th>
                <th className="px-4 py-3">Vehicle No</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3 text-right">Net Weight</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentDispatches && recentDispatches.length > 0 ? (
                recentDispatches.map(dispatch => (
                  <tr key={dispatch._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono font-bold text-amber-400">
                      {dispatch.challanNo}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-100">
                      {dispatch.vehicleNo}
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {dispatch.customerName}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {dispatch.productName}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-100">
                      {dispatch.netWeightMT} MT
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-400 font-semibold">
                      ₹{Number(dispatch.finalAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        dispatch.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {dispatch.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onViewChallan(dispatch)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Gate Pass</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-slate-500">
                    No dispatches recorded today. Use the button above to record a new vehicle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
