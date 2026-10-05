import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Receipt 
} from 'lucide-react';

export default function ReportsView({ dispatches, onViewChallan }) {
  const [filterMode, setFilterMode] = useState('All');

  const filtered = dispatches.filter(d => {
    if (filterMode === 'Paid') return d.paymentStatus === 'Paid';
    if (filterMode === 'Pending') return d.paymentStatus === 'Pending' || d.paymentStatus === 'Partial';
    return true;
  });

  const totalGross = filtered.reduce((sum, d) => sum + (d.finalAmount || 0), 0);
  const totalSubtotal = filtered.reduce((sum, d) => sum + (d.subTotal || 0), 0);
  const totalTax = filtered.reduce((sum, d) => sum + (d.taxAmount || 0), 0);
  const totalPaid = filtered.reduce((sum, d) => sum + (d.paidAmount || (d.paymentStatus === 'Paid' ? d.finalAmount : 0)), 0);
  const totalReceivables = totalGross - totalPaid;
  const totalTonnage = filtered.reduce((sum, d) => sum + (d.netWeightMT || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-amber-400" />
            <span>Commercial Invoicing & GST Tax Audit</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reconciliation of weighbridge sales, royalty payments, and tax invoices
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Print Financial Summary</span>
        </button>
      </div>

      {/* Tax & Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Invoiced Turnover</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            ₹{Math.round(totalGross).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">{totalTonnage.toFixed(1)} MT dispatched</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Mining Royalty & GST (5%)</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            ₹{Math.round(totalTax).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">State mineral department levy</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Realized Revenue</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₹{Math.round(totalPaid).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-0.5 block">Settled in bank & cash</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Credit Receivables</span>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            ₹{Math.round(totalReceivables).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-rose-400/80 mt-0.5 block">Pending contractor dues</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
        <span className="text-xs text-slate-400 font-semibold px-2">Filter Invoices:</span>
        {['All', 'Paid', 'Pending'].map(m => (
          <button
            key={m}
            onClick={() => setFilterMode(m)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterMode === m
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {m === 'Pending' ? 'Credit / Pending' : m}
          </button>
        ))}
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[11px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Challan / Invoice No</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Contractor / Consignee</th>
                <th className="px-4 py-3.5">Vehicle</th>
                <th className="px-4 py-3.5 text-right">Net MT</th>
                <th className="px-4 py-3.5 text-right">Subtotal</th>
                <th className="px-4 py-3.5 text-right">Royalty Tax</th>
                <th className="px-4 py-3.5 text-right font-bold text-white">Invoice Total</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map(d => (
                <tr key={d._id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-bold text-amber-400">{d.challanNo}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(d.dispatchedAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 font-sans font-bold text-slate-100">{d.customerName}</td>
                  <td className="px-4 py-3 text-slate-300">{d.vehicleNo}</td>
                  <td className="px-4 py-3 text-right">{Number(d.netWeightMT).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-slate-300">₹{Number(d.subTotal).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-amber-400/90">₹{Number(d.taxAmount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400 text-sm">
                    ₹{Number(d.finalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center font-sans">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      d.paymentStatus === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {d.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-sans">
                    <button
                      onClick={() => onViewChallan(d)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
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
