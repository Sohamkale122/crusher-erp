import React from 'react';
import { Printer, X, CheckCircle, ShieldCheck, Scale, Truck } from 'lucide-react';

export default function GatePassModal({ dispatch, onClose }) {
  if (!dispatch) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Actions (Hidden on print) */}
        <div className="bg-slate-900 text-slate-100 px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm tracking-wide">WEIGHBRIDGE DISPATCH CHALLAN & GATE PASS</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Gate Pass</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Gate Pass Document Container */}
        <div className="p-8 print:p-4 text-slate-800 font-sans" id="printable-gate-pass">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                  SAHYADRI STONE CRUSHER & MINES PVT LTD
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Survey No. 142/3, Blue Metal Industrial Quarry Zone, Taluka Haveli, Pune - 412207
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  GSTIN: <span className="font-semibold text-slate-800">27AABCS1429E1Z8</span> | Mining Royalty Permittee: <span className="font-semibold text-slate-800">MR-PN-2024/991</span>
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-slate-900 text-white font-mono font-bold text-xs px-2.5 py-1 rounded">
                  ORIGINAL FOR BUYER
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Electronic Weighbridge 60 MT</p>
              </div>
            </div>
            
            <div className="text-center mt-3 pt-2 border-t border-slate-200">
              <span className="font-bold text-base tracking-widest uppercase text-slate-900 bg-slate-100 px-4 py-0.5 rounded-full border border-slate-300">
                DELIVERY CHALLAN & VEHICLE GATE PASS
              </span>
            </div>
          </div>

          {/* Challan & Date Row */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
            <div>
              <p className="text-slate-500 font-medium">Challan Number:</p>
              <p className="text-base font-black text-slate-900 font-mono">{dispatch.challanNo}</p>
              <p className="text-slate-500 mt-2 font-medium">Weighbridge Operator:</p>
              <p className="font-semibold text-slate-800">{dispatch.operatorName || 'Admin Desk'}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 font-medium">Date & Weighment Time:</p>
              <p className="text-sm font-bold text-slate-900">
                {new Date(dispatch.dispatchedAt).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
              <p className="text-slate-500 mt-2 font-medium">Gate Pass Status:</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                {dispatch.gatePassStatus || 'Dispatched'}
              </span>
            </div>
          </div>

          {/* Customer & Transporter Details */}
          <div className="grid grid-cols-2 gap-6 text-xs mb-6">
            <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
              <p className="font-bold text-slate-900 uppercase text-[11px] mb-2 flex items-center gap-1.5 border-b pb-1">
                <span>CONSIGNEE / BUYER DETAILS</span>
              </p>
              <p className="font-black text-sm text-slate-900">{dispatch.customerName}</p>
              {dispatch.customerPhone && (
                <p className="text-slate-600 mt-1">Contact: {dispatch.customerPhone}</p>
              )}
              {dispatch.notes && (
                <p className="text-slate-500 italic mt-2 bg-white p-2 rounded border border-slate-200">
                  Site / Remarks: {dispatch.notes}
                </p>
              )}
            </div>

            <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
              <p className="font-bold text-slate-900 uppercase text-[11px] mb-2 flex items-center gap-1.5 border-b pb-1">
                <Truck className="w-3.5 h-3.5 text-slate-700" />
                <span>VEHICLE & TRANSPORTER</span>
              </p>
              <p className="text-slate-500">Vehicle / Truck No:</p>
              <p className="text-base font-black text-slate-950 font-mono tracking-wider">{dispatch.vehicleNo}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-slate-500">Driver Name:</p>
                  <p className="font-semibold text-slate-800">{dispatch.driverName || 'Not Stated'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Driver Contact:</p>
                  <p className="font-semibold text-slate-800">{dispatch.driverPhone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Material & Weights Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-xs">
              <thead className="bg-slate-800 text-white uppercase text-[11px] text-left">
                <tr>
                  <th className="p-3">Material Grade & Description</th>
                  <th className="p-3 text-right">Gross Wt (MT)</th>
                  <th className="p-3 text-right">Tare Wt (MT)</th>
                  <th className="p-3 text-right bg-slate-900 font-bold text-amber-400">Net Wt (MT)</th>
                  <th className="p-3 text-right">Rate/MT</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="font-medium">
                  <td className="p-3 font-bold text-slate-900 text-sm">
                    {dispatch.productName}
                  </td>
                  <td className="p-3 text-right font-mono">{Number(dispatch.grossWeightMT).toFixed(2)}</td>
                  <td className="p-3 text-right font-mono">{Number(dispatch.tareWeightMT).toFixed(2)}</td>
                  <td className="p-3 text-right font-mono font-black text-base bg-amber-50 text-slate-950">
                    {Number(dispatch.netWeightMT).toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono">₹{Number(dispatch.ratePerMT).toFixed(2)}</td>
                  <td className="p-3 text-right font-mono font-semibold">₹{Number(dispatch.subTotal).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex justify-between items-start text-xs mb-8">
            <div className="w-1/2 pr-4">
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-1">Payment Status:</p>
                <p className="text-sm font-black text-slate-900">
                  {dispatch.paymentStatus} via {dispatch.paymentMode}
                </p>
                <p className="text-slate-500 mt-1">
                  Paid: <span className="font-semibold text-emerald-700">₹{Number(dispatch.paidAmount || 0).toFixed(2)}</span>
                  {dispatch.paymentStatus !== 'Paid' && (
                    <span className="ml-2 text-rose-600 font-semibold">
                      (Balance: ₹{(dispatch.finalAmount - (dispatch.paidAmount || 0)).toFixed(2)})
                    </span>
                  )}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                * Goods once sold and dispatched cannot be returned. Weighment certified on calibrated electronic load cell weighbridge.
              </p>
            </div>

            <div className="w-1/2 pl-4">
              <div className="space-y-1.5 border-t border-slate-200 pt-2 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Material Subtotal:</span>
                  <span>₹{Number(dispatch.subTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Royalty / GST ({dispatch.taxPercent}%):</span>
                  <span>₹{Number(dispatch.taxAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-950 border-t-2 border-slate-900 pt-2">
                  <span>Final Total:</span>
                  <span className="text-lg">₹{Number(dispatch.finalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 pt-12 border-t border-slate-300 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 mx-4 pt-2">
                <p className="font-bold text-slate-800">Weighbridge Clerk</p>
                <p className="text-[10px] text-slate-500">Authorized Signatory</p>
              </div>
            </div>
            <div>
              <div className="border-t border-slate-400 mx-4 pt-2">
                <p className="font-bold text-slate-800">Truck Driver Signature</p>
                <p className="text-[10px] text-slate-500">Tare & Gross Verified</p>
              </div>
            </div>
            <div>
              <div className="border-t border-slate-400 mx-4 pt-2">
                <p className="font-bold text-slate-800">Consignee Receiver</p>
                <p className="text-[10px] text-slate-500">Received in Good Order</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
