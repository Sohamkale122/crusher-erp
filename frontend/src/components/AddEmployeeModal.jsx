import React, { useState } from 'react';
import { X, Users, AlertCircle } from 'lucide-react';

export default function AddEmployeeModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: 'Crusher Operations',
    phone: '',
    dailyWage: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.designation || !formData.dailyWage) {
      return setError('Please provide name, designation, and daily wage');
    }

    setLoading(true);
    setError('');
    try {
      await onCreated({
        ...formData,
        dailyWage: parseFloat(formData.dailyWage)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md text-slate-100 shadow-2xl overflow-hidden">
        
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-slate-100">Add Plant Worker / Staff</h3>
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
            <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kadam"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Designation / Role *</label>
            <input
              type="text"
              placeholder="e.g. Cone Crusher Operator / Loader Driver"
              value={formData.designation}
              onChange={e => setFormData({ ...formData, designation: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Department *</label>
            <select
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
            >
              <option value="Crusher Operations">Crusher Operations</option>
              <option value="Weighbridge">Weighbridge</option>
              <option value="Transport & Fleet">Transport & Fleet</option>
              <option value="Maintenance">Maintenance & Electrical</option>
              <option value="Management & Accounts">Management & Accounts</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98XXX XXXXX"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Daily Wage Rate (₹) *</label>
              <input
                type="number"
                step="50"
                placeholder="₹ Daily Rate"
                value={formData.dailyWage}
                onChange={e => setFormData({ ...formData, dailyWage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                required
              />
            </div>
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
              {loading ? 'Adding Employee...' : 'Register Worker'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
