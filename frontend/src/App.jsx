import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import InventoryView from './views/InventoryView';
import SalesDispatchView from './views/SalesDispatchView';
import EmployeesView from './views/EmployeesView';
import MachineryView from './views/MachineryView';
import ReportsView from './views/ReportsView';

import GatePassModal from './components/GatePassModal';
import NewDispatchModal from './components/NewDispatchModal';
import AddProductModal from './components/AddProductModal';
import AddEmployeeModal from './components/AddEmployeeModal';

import { api, getStoredUser, setStoredUser, setAuthToken } from './services/api';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [currentTab, setTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  // Data states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [activeChallan, setActiveChallan] = useState(null);
  const [showNewDispatchModal, setShowNewDispatchModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load all data
  const refreshAllData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [statsRes, invRes, dispRes, empRes, macRes] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getInventory(),
        api.getDispatches(),
        api.getEmployees(),
        api.getMachinery()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setDashboardStats(statsRes.value.stats);
      }
      if (invRes.status === 'fulfilled' && invRes.value.success) {
        setInventory(invRes.value.items || []);
      }
      if (dispRes.status === 'fulfilled' && dispRes.value.success) {
        setDispatches(dispRes.value.dispatches || []);
      }
      if (empRes.status === 'fulfilled' && empRes.value.success) {
        setEmployees(empRes.value.employees || []);
      }
      if (macRes.status === 'fulfilled' && macRes.value.success) {
        setMachinery(macRes.value.machinery || []);
      }
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Verify auth session on load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setCurrentUser(res.user);
          setStoredUser(res.user);
        }
      } catch (e) {
        // If token expired, clear
        api.logout();
        setCurrentUser(null);
      }
    };
    if (currentUser) {
      initAuth();
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      refreshAllData();
    }
  }, [currentUser]);

  // Handle Login & Register
  const handleLoginSuccess = async ({ action, data }) => {
    if (action === 'register') {
      const res = await api.register(data);
      setCurrentUser(res.user);
      showToast(`Welcome, ${res.user.name}! Account registered.`);
    } else {
      const res = await api.login(data.email, data.password);
      setCurrentUser(res.user);
      showToast(`Welcome back, ${res.user.name}!`);
    }
  };

  // Switch Role
  const handleSwitchRole = async (targetRole) => {
    const roleEmails = {
      admin: 'admin@crusher.com',
      manager: 'manager@crusher.com',
      operator: 'weighbridge@crusher.com',
      accountant: 'accountant@crusher.com'
    };
    const passwords = {
      admin: 'admin123',
      manager: 'manager123',
      operator: 'operator123',
      accountant: 'account123'
    };

    try {
      const res = await api.login(roleEmails[targetRole], passwords[targetRole]);
      setCurrentUser(res.user);
      showToast(`Switched active profile to ${targetRole.toUpperCase()}`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setDashboardStats(null);
    showToast('Logged out of plant system');
  };

  // Dispatch Handlers
  const handleCreateDispatch = async (dispatchData) => {
    const res = await api.createDispatch(dispatchData);
    if (res.success) {
      showToast(`Challan ${res.dispatch.challanNo} issued! Stock deducted.`);
      setActiveChallan(res.dispatch);
      await refreshAllData();
    }
  };

  const handleUpdateDispatchStatus = async (id, updates) => {
    const res = await api.updateDispatch(id, updates);
    if (res.success) {
      showToast(`Dispatch ${res.dispatch.challanNo} marked as Paid!`);
      await refreshAllData();
    }
  };

  // Inventory Handlers
  const handleAddProduct = async (productData) => {
    const res = await api.createProduct(productData);
    if (res.success) {
      showToast(`Aggregate grade ${res.item.name} added to catalog.`);
      await refreshAllData();
    }
  };

  const handleUpdateStock = async (id, updates) => {
    const res = await api.updateProduct(id, updates);
    if (res.success) {
      showToast(`Stock updated for ${res.item.name}.`);
      await refreshAllData();
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this aggregate stock record?')) return;
    const res = await api.deleteProduct(id);
    if (res.success) {
      showToast('Product deleted.');
      await refreshAllData();
    }
  };

  // Employee Handlers
  const handleAddEmployee = async (employeeData) => {
    const res = await api.createEmployee(employeeData);
    if (res.success) {
      showToast(`Worker ${res.employee.name} registered.`);
      await refreshAllData();
    }
  };

  const handleMarkAttendance = async (data) => {
    const res = await api.markAttendance(data);
    if (res.success) {
      showToast(`Attendance updated for ${res.employee.name}.`);
      await refreshAllData();
    }
  };

  // Machinery Handlers
  const handleUpdateMachinery = async (id, data) => {
    const res = await api.updateMachinery(id, data);
    if (res.success) {
      showToast(`Equipment ${res.machinery.name} log recorded.`);
      await refreshAllData();
    }
  };

  // If not logged in, render Login View
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const userRole = currentUser.role || 'operator';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-2 text-xs font-semibold backdrop-blur ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
              : 'bg-slate-900/95 text-amber-300 border-amber-500/40 shadow-amber-500/10'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setTab={setTab}
          userRole={userRole}
        />

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto bg-slate-950/40 relative">
          
          {loading && (
            <div className="absolute top-2 right-4 z-20 flex items-center space-x-1.5 text-xs text-amber-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Syncing plant data...</span>
            </div>
          )}

          {currentTab === 'dashboard' && (
            <DashboardView
              stats={dashboardStats}
              onNewDispatch={() => setShowNewDispatchModal(true)}
              onViewChallan={(disp) => setActiveChallan(disp)}
              setTab={setTab}
            />
          )}

          {currentTab === 'weighbridge' && (
            <SalesDispatchView
              dispatches={dispatches}
              userRole={userRole}
              onNewDispatch={() => setShowNewDispatchModal(true)}
              onViewChallan={(disp) => setActiveChallan(disp)}
              onUpdateStatus={handleUpdateDispatchStatus}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryView
              inventory={inventory}
              userRole={userRole}
              onAddProduct={() => setShowAddProductModal(true)}
              onUpdateStock={handleUpdateStock}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {currentTab === 'workforce' && (
            <EmployeesView
              employees={employees}
              userRole={userRole}
              onAddEmployee={() => setShowAddEmployeeModal(true)}
              onMarkAttendance={handleMarkAttendance}
            />
          )}

          {currentTab === 'machinery' && (
            <MachineryView
              machinery={machinery}
              userRole={userRole}
              onUpdateMachinery={handleUpdateMachinery}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              dispatches={dispatches}
              onViewChallan={(disp) => setActiveChallan(disp)}
            />
          )}

        </main>
      </div>

      {/* Modals */}
      {showNewDispatchModal && (
        <NewDispatchModal
          inventory={inventory}
          onClose={() => setShowNewDispatchModal(false)}
          onCreated={handleCreateDispatch}
        />
      )}

      {showAddProductModal && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onCreated={handleAddProduct}
        />
      )}

      {showAddEmployeeModal && (
        <AddEmployeeModal
          onClose={() => setShowAddEmployeeModal(false)}
          onCreated={handleAddEmployee}
        />
      )}

      {activeChallan && (
        <GatePassModal
          dispatch={activeChallan}
          onClose={() => setActiveChallan(null)}
        />
      )}

    </div>
  );
}
