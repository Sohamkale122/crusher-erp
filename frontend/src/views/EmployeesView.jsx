import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Calendar, 
  Check, 
  X, 
  Clock, 
  DollarSign, 
  UserCheck, 
  FileSpreadsheet, 
  Briefcase 
} from 'lucide-react';
import { api } from '../services/api';

export default function EmployeesView({ 
  employees, 
  userRole, 
  onAddEmployee, 
  onMarkAttendance 
}) {
  const [selectedDept, setSelectedDept] = useState('All');
  const [payrollSummary, setPayrollSummary] = useState([]);
  const [loadingPayroll, setLoadingPayroll] = useState(false);
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'payroll'

  const todayStr = new Date().toISOString().slice(0, 10);
  const departments = ['All', 'Crusher Operations', 'Weighbridge', 'Transport & Fleet', 'Maintenance', 'Management & Accounts'];

  const filtered = employees.filter(e => {
    return selectedDept === 'All' || e.department === selectedDept;
  });

  const fetchPayroll = async () => {
    setLoadingPayroll(true);
    try {
      const res = await api.getPayrollSummary();
      if (res.success) {
        setPayrollSummary(res.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPayroll(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'payroll') {
      fetchPayroll();
    }
  }, [activeTab, employees]);

  const handleAttendanceChange = async (empId, status, overtime = 0) => {
    await onMarkAttendance({
      employeeId: empId,
      date: todayStr,
      status,
      overtimeHours: overtime
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Workforce, Daily Attendance & Wages</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Plant quarry operators, weighbridge clerks, excavator pilots, and daily wage payroll
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sub-tab switcher */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'attendance'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Muster Roll
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'payroll'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Payroll Wage Sheet
            </button>
          </div>

          {['admin', 'manager'].includes(userRole) && (
            <button
              onClick={onAddEmployee}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Register Worker</span>
            </button>
          )}
        </div>
      </div>

      {/* Department Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedDept === dept
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Attendance Mode */}
      {activeTab === 'attendance' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">
                Today's Muster Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Total Active Staff: {filtered.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[11px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Code</th>
                  <th className="px-4 py-3.5">Employee Name</th>
                  <th className="px-4 py-3.5">Designation</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5 text-right">Daily Wage (₹)</th>
                  <th className="px-4 py-3.5 text-center">Today's Status</th>
                  <th className="px-4 py-3.5 text-center">Quick Attendance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map(emp => {
                  const todayRec = (emp.attendance || []).find(a => a.date === todayStr);
                  const status = todayRec ? todayRec.status : 'Present';
                  const overtime = todayRec ? todayRec.overtimeHours : 0;

                  return (
                    <tr key={emp._id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-mono font-bold text-amber-400">
                        {emp.employeeCode}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-100">
                        {emp.name}
                        {emp.phone && <span className="block text-[11px] font-normal text-slate-400">{emp.phone}</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-medium">
                        {emp.designation}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                        ₹{emp.dailyWage}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          status === 'Present'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : status === 'Half-Day'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {status} {overtime > 0 && `(+${overtime}h OT)`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {['admin', 'manager'].includes(userRole) ? (
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => handleAttendanceChange(emp._id, 'Present', 0)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                                status === 'Present' && overtime === 0
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400 hover:text-emerald-400'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(emp._id, 'Present', 2)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                                overtime > 0
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400 hover:text-amber-400'
                              }`}
                            >
                              +2h OT
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(emp._id, 'Half-Day', 0)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                                status === 'Half-Day'
                                  ? 'bg-orange-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400 hover:text-orange-400'
                              }`}
                            >
                              Half
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(emp._id, 'Absent', 0)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                                status === 'Absent'
                                  ? 'bg-rose-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400 hover:text-rose-400'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">View Only</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Payroll Mode */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">
                Monthly Wage Sheet & Overtime Settlement (Auto-Calculated)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[11px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Emp ID</th>
                  <th className="px-4 py-3.5">Employee Name</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5 text-right">Daily Rate</th>
                  <th className="px-4 py-3.5 text-center">Days Present</th>
                  <th className="px-4 py-3.5 text-center">OT Hours</th>
                  <th className="px-4 py-3.5 text-right">Base Wage</th>
                  <th className="px-4 py-3.5 text-right">OT Pay</th>
                  <th className="px-4 py-3.5 text-right font-bold text-amber-400">Gross Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {payrollSummary.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 text-amber-400 font-bold">{p.employeeCode}</td>
                    <td className="px-4 py-3 font-sans font-bold text-slate-100">{p.name}</td>
                    <td className="px-4 py-3 font-sans text-slate-400">{p.department}</td>
                    <td className="px-4 py-3 text-right">₹{p.dailyWage}</td>
                    <td className="px-4 py-3 text-center text-slate-200 font-bold">{p.presentDays}</td>
                    <td className="px-4 py-3 text-center text-sky-400">{p.totalOvertimeHours} hrs</td>
                    <td className="px-4 py-3 text-right text-slate-200">₹{p.basePay.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-emerald-400">₹{p.overtimePay.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-bold text-amber-400 text-sm">
                      ₹{p.grossSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
