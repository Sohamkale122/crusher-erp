import React, { useState } from 'react';
import { 
  Scale, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Truck, 
  Printer, 
  Filter 
} from 'lucide-react';

export default function SalesDispatchView({ 
  dispatches, 
  userRole, 
  onNewDispatch, 
  onViewChallan, 
  onUpdateStatus 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');

  const filtered = dispatches.filter(d => {
    const matchesFilter = paymentFilter === 'All' || d.paymentStatus === paymentFilter;
    const matchesSearch = d.challanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalTonnage = filtered.reduce((acc, curr) => acc + (curr.netWeightMT || 0), 0);
  const totalBilled = filtered.reduce((acc, curr) => acc + (curr.finalAmount || 0), 0);
  const totalPaid = filtered.reduce((acc, curr) => acc + (curr.paidAmount || (curr.paymentStatus === 'Paid' ? curr.finalAmount : 0)), 0);
  const totalPending = totalBilled - totalPaid;

  const markAsPaid = async (dispatch) => {
    await onUpdateStatus(dispatch._id, {
      paymentStatus: 'Paid',
      paidAmount: dispatch.finalAmount
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-amber-400" />
            <span>Weighbridge Station & Dispatch Register</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Certified gross/tare weighment logs, tax invoices, and legal gate passes
          </p>
        </div>

        {['admin', 'manager', 'operator'].includes(userRole) && (
          <button
            onClick={onNewDispatch}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Record Vehicle & Issue Gate Pass</span>
          </button>
        )}
      </div>

      {/* KPI Financial Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Net Stone Outflow</span>
          <div className="text-xl font-black text-white font-mono mt-0.5">
            {totalTonnage.toFixed(2)} <span className="text-xs text-slate-400">MT</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Truck dispatches</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Invoiced</span>
          <div className="text-xl font-black text-white font-mono mt-0.5">
            ₹{Math.round(totalBilled).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Incl. 5% royalty/GST</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Collected Payment</span>
          <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
            ₹{Math.round(totalPaid).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">Cash, UPI & Bank</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Pending Receivables</span>
          <div className="text-xl font-black text-rose-400 font-mono mt-0.5">
            ₹{Math.round(totalPending).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-rose-400/80 mt-1 block">Credit terms</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Paid', 'Pending', 'Partial'].map(status => (
            <button
              key={status}
              onClick={() => setPaymentFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                paymentFilter === status
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicle no, challan, or contractor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Weighbridge Dispatches Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[11px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Challan / Time</th>
                <th className="px-4 py-3.5">Vehicle / Driver</th>
                <th className="px-4 py-3.5">Customer / Project</th>
                <th className="px-4 py-3.5">Product Grade</th>
                <th className="px-4 py-3.5 text-right">Gross (MT)</th>
                <th className="px-4 py-3.5 text-right">Tare (MT)</th>
                <th className="px-4 py-3.5 text-right font-bold text-amber-400">Net Stone (MT)</th>
                <th className="px-4 py-3.5 text-right">Final Amount</th>
                <th className="px-4 py-3.5 text-center">Payment</th>
                <th className="px-4 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(dispatch => (
                <tr key={dispatch._id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono">
                    <span className="font-bold text-amber-400 block">{dispatch.challanNo}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(dispatch.dispatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono">
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dispatch.vehicleNo}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans">{dispatch.driverName || 'Driver N/A'}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-200">{dispatch.customerName}</div>
                    {dispatch.notes && <div className="text-[10px] text-slate-400 italic line-clamp-1">{dispatch.notes}</div>}
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-300">
                    {dispatch.productName}
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-slate-400">
                    {Number(dispatch.grossWeightMT).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-slate-400">
                    {Number(dispatch.tareWeightMT).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right font-mono font-black text-amber-400 text-sm">
                    {Number(dispatch.netWeightMT).toFixed(2)} MT
                  </td>

                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                    ₹{Number(dispatch.finalAmount).toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      dispatch.paymentStatus === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : dispatch.paymentStatus === 'Partial'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {dispatch.paymentStatus}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{dispatch.paymentMode}</span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => onViewChallan(dispatch)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold transition"
                        title="View & Print Official Gate Pass"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {dispatch.paymentStatus !== 'Paid' && ['admin', 'manager', 'accountant'].includes(userRole) && (
                        <button
                          onClick={() => markAsPaid(dispatch)}
                          className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 rounded-lg text-[10px] font-bold transition"
                          title="Record Payment Received"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
