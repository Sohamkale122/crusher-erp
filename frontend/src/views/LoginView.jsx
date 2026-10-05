import React, { useState } from 'react';
import { Building2, Shield, Scale, Truck, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('operator');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'Admin',
      badge: 'Master Control',
      email: 'admin@crusher.com',
      pass: 'admin123',
      color: 'border-amber-500/40 hover:border-amber-400 bg-amber-500/10 text-amber-300',
      desc: 'Financials, inventory masters, full analytics'
    },
    {
      role: 'Manager',
      badge: 'Plant Supervisor',
      email: 'manager@crusher.com',
      pass: 'manager123',
      color: 'border-blue-500/40 hover:border-blue-400 bg-blue-500/10 text-blue-300',
      desc: 'Stockpile balance, workforce attendance, machinery'
    },
    {
      role: 'Operator',
      badge: 'Weighbridge Desk',
      email: 'weighbridge@crusher.com',
      pass: 'operator123',
      color: 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/10 text-emerald-300',
      desc: 'Vehicle Gross/Tare weighing & Gate Pass generation'
    },
    {
      role: 'Accountant',
      badge: 'Finance & GST',
      email: 'accountant@crusher.com',
      pass: 'account123',
      color: 'border-purple-500/40 hover:border-purple-400 bg-purple-500/10 text-purple-300',
      desc: 'Credit ledger, payment reconciliations & payroll'
    }
  ];

  const handleDemoSelect = (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    handleSubmit(null, acc.email, acc.pass);
  };

  const handleSubmit = async (e, directEmail, directPassword) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const submitEmail = directEmail || email;
    const submitPass = directPassword || password;

    try {
      if (isRegister) {
        await onLoginSuccess({
          action: 'register',
          data: { name, email: submitEmail, password: submitPass, role, phone }
        });
      } else {
        await onLoginSuccess({
          action: 'login',
          data: { email: submitEmail, password: submitPass }
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Branding & Value prop */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-amber-400 font-semibold shadow-inner">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Industrial Aggregate & Quarry ERP v1.0</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none uppercase">
              TITAN <span className="text-amber-400">CRUSHER</span> ERP
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Complete quarry lifecycle operations: Electronic weighbridge tare/gross calculation, aggregate inventory stockpile monitoring, daily workforce wages, and plant machinery logs.
            </p>
          </div>

          {/* Quick Demo Access Grid */}
          <div className="space-y-3 pt-2">
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 justify-center lg:justify-start">
              <UserCheck className="w-4 h-4 text-amber-400" />
              1-Click Demo Profiles (Pre-configured)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoAccounts.map(acc => (
                <button
                  key={acc.role}
                  onClick={() => handleDemoSelect(acc)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between ${acc.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wide text-white">{acc.role}</span>
                    <span className="text-[10px] bg-slate-900/60 px-1.5 py-0.5 rounded font-mono font-medium">{acc.badge}</span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-1 line-clamp-1">{acc.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Auth Card */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
            
            <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isRegister ? 'Register Plant Personnel' : 'Sign in to Terminal'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRegister ? 'Create an authorized personnel account' : 'Enter credentials or select a demo role'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {isRegister && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Anand Shinde"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Role / Access</label>
                      <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                      >
                        <option value="operator">Operator (Weighbridge)</option>
                        <option value="manager">Manager (Plant Lead)</option>
                        <option value="accountant">Accountant (Billing)</option>
                        <option value="admin">Admin (Executive)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                      <input
                        type="text"
                        placeholder="+91 XXXXX"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="user@crusher.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
              >
                <span>{loading ? 'Authenticating...' : isRegister ? 'Register New Staff' : 'Access System Terminal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                className="text-xs text-slate-400 hover:text-amber-400 font-medium transition"
              >
                {isRegister
                  ? 'Already have an account? Sign in'
                  : "Need a new personnel login? Click here to register"}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
