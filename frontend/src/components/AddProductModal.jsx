import React, { useState } from 'react';
import { X, Boxes, AlertCircle } from 'lucide-react';

export default function AddProductModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Aggregate',
    currentStockMT: '',
    reorderLevelMT: '100',
    unitPricePerMT: '',
    bayLocation: 'Bay 1',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.unitPricePerMT) {
      return setError('Please fill in product name, product code, and rate/MT');
    }

    setLoading(true);
    setError('');
    try {
      await onCreated({
        ...formData,
        currentStockMT: parseFloat(formData.currentStockMT) || 0,
        reorderLevelMT: parseFloat(formData.reorderLevelMT) || 50,
        unitPricePerMT: parseFloat(formData.unitPricePerMT)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg text-slate-100 shadow-2xl overflow-hidden">
        
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Boxes className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-slate-100">Add New Aggregate / Quarry Stock</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Product Name & Grade *</label>
            <input
              type="text"
              placeholder="e.g. 60mm Crusher Run Stone"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Product Code *</label>
              <input
                type="text"
                placeholder="e.g. AGG-60MM"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Aggregate">Aggregate (10/20/40mm)</option>
                <option value="Sand">Sand (M-Sand / P-Sand)</option>
                <option value="Base Material">Base Material (GSB / WMM)</option>
                <option value="Raw Boulder">Raw Boulder (Pit Feed)</option>
                <option value="Dust">Quarry Dust</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Stock (MT)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentStockMT}
                onChange={e => setFormData({ ...formData, currentStockMT: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Reorder Level (MT)</label>
              <input
                type="number"
                value={formData.reorderLevelMT}
                onChange={e => setFormData({ ...formData, reorderLevelMT: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Price / MT (₹) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="₹ Rate"
                value={formData.unitPricePerMT}
                onChange={e => setFormData({ ...formData, unitPricePerMT: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Bay / Stockpile Location</label>
            <input
              type="text"
              placeholder="e.g. Stockpile Bay 5 East"
              value={formData.bayLocation}
              onChange={e => setFormData({ ...formData, bayLocation: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description / Spec</label>
            <input
              type="text"
              placeholder="e.g. Flakiness index < 15%, suitable for concrete"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition disabled:opacity-50"
            >
              {loading ? 'Adding Product...' : 'Create Aggregate'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
