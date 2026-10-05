import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Filter, 
  DollarSign, 
  Layers 
} from 'lucide-react';

export default function InventoryView({ 
  inventory, 
  userRole, 
  onAddProduct, 
  onUpdateStock, 
  onDeleteProduct 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');
  const [newPriceVal, setNewPriceVal] = useState('');

  const categories = ['All', 'Aggregate', 'Sand', 'Base Material', 'Raw Boulder', 'Dust'];

  const filtered = inventory.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.bayLocation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalTonnage = filtered.reduce((acc, curr) => acc + (curr.currentStockMT || 0), 0);
  const totalValuation = filtered.reduce((acc, curr) => acc + ((curr.currentStockMT || 0) * (curr.unitPricePerMT || 0)), 0);

  const startEdit = (item) => {
    setEditingItem(item);
    setNewStockVal(item.currentStockMT);
    setNewPriceVal(item.unitPricePerMT);
  };

  const saveEdit = async () => {
    if (!editingItem) return;
    await onUpdateStock(editingItem._id, {
      currentStockMT: parseFloat(newStockVal) || 0,
      unitPricePerMT: parseFloat(newPriceVal) || 0
    });
    setEditingItem(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-amber-400" />
            <span>Aggregate Stock & Stockpile Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time blue metal, M-Sand, GSB, and boulder quarry storage tracking
          </p>
        </div>

        {['admin', 'manager'].includes(userRole) && (
          <button
            onClick={onAddProduct}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Aggregate / Stock Item</span>
          </button>
        )}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Crushed Stock</span>
            <div className="text-xl font-black text-white font-mono mt-0.5">
              {totalTonnage.toLocaleString('en-IN', { maximumFractionDigits: 1 })} <span className="text-xs text-slate-400">MT</span>
            </div>
          </div>
          <Layers className="w-6 h-6 text-amber-400 opacity-60" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Inventory Valuation</span>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              ₹{Math.round(totalValuation).toLocaleString('en-IN')}
            </div>
          </div>
          <DollarSign className="w-6 h-6 text-emerald-400 opacity-60" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Tracked Products</span>
            <div className="text-xl font-black text-sky-400 font-mono mt-0.5">
              {filtered.length} Grades
            </div>
          </div>
          <Boxes className="w-6 h-6 text-sky-400 opacity-60" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, grade, or bay..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[11px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Code</th>
                <th className="px-4 py-3.5">Material & Grade</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Bay Location</th>
                <th className="px-4 py-3.5 text-right">Available Stock</th>
                <th className="px-4 py-3.5 text-right">Price / MT</th>
                <th className="px-4 py-3.5 text-right">Total Value</th>
                <th className="px-4 py-3.5 text-center">Health Status</th>
                <th className="px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(item => {
                const isLow = item.currentStockMT <= item.reorderLevelMT;
                const value = (item.currentStockMT || 0) * (item.unitPricePerMT || 0);

                return (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono font-bold text-amber-400">
                      {item.code}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-100">{item.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{item.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-medium">
                      {item.bayLocation}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-100">
                      {Number(item.currentStockMT).toFixed(2)} MT
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-amber-400 font-semibold">
                      ₹{Number(item.unitPricePerMT).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-400 font-semibold">
                      ₹{Math.round(value).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {['admin', 'manager'].includes(userRole) && (
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                            title="Update Stock or Rate"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {userRole === 'admin' && (
                          <button
                            onClick={() => onDeleteProduct(item._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm text-slate-100 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white">
              Update Stock: {editingItem.name}
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Current Stock (MT)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newStockVal}
                  onChange={e => setNewStockVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Unit Rate per MT (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newPriceVal}
                  onChange={e => setNewPriceVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 text-xs">
              <button
                onClick={() => setEditingItem(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
