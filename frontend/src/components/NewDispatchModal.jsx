import React, { useState, useEffect } from 'react';
import { X, Scale, Truck, User, DollarSign, Calculator, AlertCircle } from 'lucide-react';

export default function NewDispatchModal({ inventory, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    vehicleNo: '',
    driverName: '',
    driverPhone: '',
    productId: '',
    productName: '',
    grossWeightMT: '',
    tareWeightMT: '',
    ratePerMT: '',
    taxPercent: 5,
    paymentStatus: 'Paid',
    paidAmount: '',
    paymentMode: 'UPI/Online',
    notes: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto set first product if available
  useEffect(() => {
    if (inventory && inventory.length > 0 && !formData.productId) {
      const first = inventory[0];
      setFormData(prev => ({
        ...prev,
        productId: first._id,
        productName: first.name,
        ratePerMT: first.unitPricePerMT
      }));
    }
  }, [inventory]);

  const handleProductChange = (e) => {
    const pId = e.target.value;
    const selected = inventory.find(i => String(i._id) === String(pId));
    if (selected) {
      setFormData(prev => ({
        ...prev,
        productId: selected._id,
        productName: selected.name,
        ratePerMT: selected.unitPricePerMT
      }));
    }
  };

  const gross = parseFloat(formData.grossWeightMT) || 0;
  const tare = parseFloat(formData.tareWeightMT) || 0;
  const net = Math.max(0, parseFloat((gross - tare).toFixed(2)));
  const rate = parseFloat(formData.ratePerMT) || 0;
  const taxPct = parseFloat(formData.taxPercent) || 5;

  const subTotal = parseFloat((net * rate).toFixed(2));
  const taxAmount = parseFloat(((subTotal * taxPct) / 100).toFixed(2));
  const finalAmount = parseFloat((subTotal + taxAmount).toFixed(2));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customerName.trim()) {
      return setError('Customer name is required');
    }
    if (!formData.vehicleNo.trim()) {
      return setError('Vehicle number is required');
    }
    if (gross <= 0 || tare <= 0) {
      return setError('Gross and Tare weights must be greater than zero');
    }
    if (gross <= tare) {
      return setError('Gross weight must be strictly greater than Tare weight');
    }
    if (rate <= 0) {
      return setError('Unit rate must be greater than 0');
    }

    setLoading(true);
    try {
      await onCreated({
        ...formData,
        grossWeightMT: gross,
        tareWeightMT: tare,
        ratePerMT: rate,
        taxPercent: taxPct,
        subTotal,
        taxAmount,
        finalAmount,
        paidAmount: formData.paymentStatus === 'Paid' ? finalAmount : (parseFloat(formData.paidAmount) || 0)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to generate dispatch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Record Weighbridge Vehicle & Generate Gate Pass</h2>
              <p className="text-xs text-slate-400">Automated gross/tare computation & stock deduction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Section 1: Customer & Transporter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer / Contractor Name *</label>
              <input
                type="text"
                placeholder="e.g. L&T Infrastructure Ltd"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer Phone</label>
              <input
                type="text"
                placeholder="+91 98XXX XXXXX"
                value={formData.customerPhone}
                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Vehicle / Truck Number *</label>
              <input
                type="text"
                placeholder="e.g. MH-12-RN-4890"
                value={formData.vehicleNo}
                onChange={e => setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold tracking-wider focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Driver Name & Contact</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Driver Name"
                  value={formData.driverName}
                  onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="Driver Phone"
                  value={formData.driverPhone}
                  onChange={e => setFormData({ ...formData, driverPhone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Material Selection */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Material / Aggregate Grade *</label>
                <select
                  value={formData.productId}
                  onChange={handleProductChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {inventory.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name} (Stock: {item.currentStockMT} MT - ₹{item.unitPricePerMT}/MT)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Unit Rate per MT (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ratePerMT}
                  onChange={e => setFormData({ ...formData, ratePerMT: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {/* Weighbridge Measurements */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-700/60">
                <span className="block text-[11px] text-slate-400 font-medium">1. Gross Weight (MT)</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.grossWeightMT}
                  onChange={e => setFormData({ ...formData, grossWeightMT: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 mt-1 text-slate-100 font-mono text-sm font-bold focus:border-amber-500 outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Truck + Load</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-700/60">
                <span className="block text-[11px] text-slate-400 font-medium">2. Tare Weight (MT)</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.tareWeightMT}
                  onChange={e => setFormData({ ...formData, tareWeightMT: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 mt-1 text-slate-100 font-mono text-sm font-bold focus:border-amber-500 outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Empty Truck</span>
              </div>

              <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/30">
                <span className="block text-[11px] text-amber-400 font-bold">3. Net Stone Weight (MT)</span>
                <div className="text-xl font-black text-amber-400 font-mono mt-1">
                  {net.toFixed(2)} <span className="text-xs font-normal">MT</span>
                </div>
                <span className="text-[10px] text-amber-400/80 mt-1 block">Gross - Tare</span>
              </div>
            </div>
          </div>

          {/* Section 3: Billing & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payment Status</label>
              <select
                value={formData.paymentStatus}
                onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Paid">Paid (Full)</option>
                <option value="Partial">Partial Payment</option>
                <option value="Pending">Credit / Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payment Mode</label>
              <select
                value={formData.paymentMode}
                onChange={e => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="UPI/Online">UPI / QR Code</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">NEFT / RTGS</option>
                <option value="Credit">Credit Terms (15-30 Days)</option>
              </select>
            </div>

            {formData.paymentStatus === 'Partial' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Paid Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.paidAmount}
                  onChange={e => setFormData({ ...formData, paidAmount: e.target.value })}
                  placeholder="₹ Amount Paid"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Delivery Destination / Site Remarks</label>
            <input
              type="text"
              placeholder="e.g. Ring road project bridge slab pier #12"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Real-time Computed Total Preview Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="text-slate-400 space-y-0.5">
              <p>Material Subtotal: <span className="font-mono text-slate-200">₹{subTotal.toFixed(2)}</span></p>
              <p>Royalty / GST (5%): <span className="font-mono text-slate-200">₹{taxAmount.toFixed(2)}</span></p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Payable Amount</span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                ₹{finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Generating Gate Pass...</span>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Issue Gate Pass & Dispatch</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
