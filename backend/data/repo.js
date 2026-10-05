import { isMongoConnected, memoryStore } from '../db.js';
import { User } from '../models/User.js';
import { Inventory } from '../models/Inventory.js';
import { SalesDispatch } from '../models/SalesDispatch.js';
import { Employee } from '../models/Employee.js';
import { Machinery } from '../models/Machinery.js';
import { getInitialData } from './seedData.js';

// Seed in-memory store on boot
export const initStore = async () => {
  const seed = await getInitialData();
  memoryStore.users = [...seed.users];
  memoryStore.inventories = [...seed.inventories];
  memoryStore.dispatches = [...seed.dispatches];
  memoryStore.employees = [...seed.employees];
  memoryStore.machineries = [...seed.machineries];

  // If MongoDB is connected, also seed MongoDB if needed
  if (isMongoConnected) {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[DB] Seeding MongoDB with initial Crusher ERP datasets...');
        await User.deleteMany({});
        await Inventory.deleteMany({});
        await SalesDispatch.deleteMany({});
        await Employee.deleteMany({});
        await Machinery.deleteMany({});

        await User.insertMany(seed.users.map(({ _id, ...u }) => u));
        await Inventory.insertMany(seed.inventories.map(({ _id, ...i }) => i));
        await SalesDispatch.insertMany(seed.dispatches.map(({ _id, ...d }) => d));
        await Employee.insertMany(seed.employees.map(({ _id, ...e }) => e));
        await Machinery.insertMany(seed.machineries.map(({ _id, ...m }) => m));
        console.log('✔ [DB] MongoDB seed complete with all stone-crusher records.');
      }
    } catch (e) {
      console.warn('[DB] MongoDB seeding check warning:', e.message);
    }
  }
};

// Users
export const repo = {
  // --- USERS ---
  async findUserByEmail(email) {
    if (isMongoConnected) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async findUserById(id) {
    if (isMongoConnected) {
      return await User.findById(id).select('-password');
    }
    const user = memoryStore.users.find(u => String(u._id) === String(id));
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  },

  async createUser(userData) {
    if (isMongoConnected) {
      const user = new User(userData);
      return await user.save();
    }
    const newUser = {
      _id: 'usr_' + Date.now(),
      ...userData,
      createdAt: new Date()
    };
    memoryStore.users.push(newUser);
    return newUser;
  },

  async getAllUsers() {
    if (isMongoConnected) {
      return await User.find().select('-password');
    }
    return memoryStore.users.map(({ password, ...u }) => u);
  },

  // --- INVENTORY ---
  async getInventory(category) {
    if (isMongoConnected) {
      const filter = category && category !== 'All' ? { category } : {};
      return await Inventory.find(filter).sort({ name: 1 });
    }
    let list = memoryStore.inventories;
    if (category && category !== 'All') {
      list = list.filter(i => i.category === category);
    }
    return list;
  },

  async getInventoryById(id) {
    if (isMongoConnected) {
      return await Inventory.findById(id);
    }
    return memoryStore.inventories.find(i => String(i._id) === String(id));
  },

  async createInventory(item) {
    if (isMongoConnected) {
      const doc = new Inventory(item);
      return await doc.save();
    }
    const newItem = {
      _id: 'inv_' + Date.now(),
      ...item,
      updatedAt: new Date()
    };
    memoryStore.inventories.unshift(newItem);
    return newItem;
  },

  async updateInventory(id, updates) {
    if (isMongoConnected) {
      return await Inventory.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
    }
    const idx = memoryStore.inventories.findIndex(i => String(i._id) === String(id));
    if (idx === -1) return null;
    memoryStore.inventories[idx] = {
      ...memoryStore.inventories[idx],
      ...updates,
      updatedAt: new Date()
    };
    return memoryStore.inventories[idx];
  },

  async deleteInventory(id) {
    if (isMongoConnected) {
      return await Inventory.findByIdAndDelete(id);
    }
    const idx = memoryStore.inventories.findIndex(i => String(i._id) === String(id));
    if (idx === -1) return null;
    const removed = memoryStore.inventories.splice(idx, 1);
    return removed[0];
  },

  // --- SALES & DISPATCH (WEIGHBRIDGE) ---
  async getDispatches(filters = {}) {
    if (isMongoConnected) {
      const query = {};
      if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
      if (filters.gatePassStatus) query.gatePassStatus = filters.gatePassStatus;
      return await SalesDispatch.find(query).sort({ dispatchedAt: -1 });
    }
    let list = [...memoryStore.dispatches];
    if (filters.paymentStatus && filters.paymentStatus !== 'All') {
      list = list.filter(d => d.paymentStatus === filters.paymentStatus);
    }
    if (filters.gatePassStatus && filters.gatePassStatus !== 'All') {
      list = list.filter(d => d.gatePassStatus === filters.gatePassStatus);
    }
    return list.sort((a, b) => new Date(b.dispatchedAt) - new Date(a.dispatchedAt));
  },

  async getDispatchById(id) {
    if (isMongoConnected) {
      return await SalesDispatch.findById(id);
    }
    return memoryStore.dispatches.find(d => String(d._id) === String(id));
  },

  async createDispatch(data) {
    // Deduct stock from inventory
    if (data.productId) {
      const product = await this.getInventoryById(data.productId);
      if (product) {
        const newStock = Math.max(0, product.currentStockMT - (data.netWeightMT || 0));
        await this.updateInventory(data.productId, { currentStockMT: newStock });
      }
    }

    if (isMongoConnected) {
      const doc = new SalesDispatch(data);
      return await doc.save();
    }
    const newDispatch = {
      _id: 'disp_' + Date.now(),
      ...data,
      dispatchedAt: new Date()
    };
    memoryStore.dispatches.unshift(newDispatch);
    return newDispatch;
  },

  async updateDispatch(id, updates) {
    if (isMongoConnected) {
      return await SalesDispatch.findByIdAndUpdate(id, updates, { new: true });
    }
    const idx = memoryStore.dispatches.findIndex(d => String(d._id) === String(id));
    if (idx === -1) return null;
    memoryStore.dispatches[idx] = {
      ...memoryStore.dispatches[idx],
      ...updates
    };
    return memoryStore.dispatches[idx];
  },

  // --- EMPLOYEES & ATTENDANCE ---
  async getEmployees(department) {
    if (isMongoConnected) {
      const filter = department && department !== 'All' ? { department } : {};
      return await Employee.find(filter).sort({ name: 1 });
    }
    let list = memoryStore.employees;
    if (department && department !== 'All') {
      list = list.filter(e => e.department === department);
    }
    return list;
  },

  async getEmployeeById(id) {
    if (isMongoConnected) {
      return await Employee.findById(id);
    }
    return memoryStore.employees.find(e => String(e._id) === String(id));
  },

  async createEmployee(data) {
    if (isMongoConnected) {
      const doc = new Employee(data);
      return await doc.save();
    }
    const newEmp = {
      _id: 'emp_' + Date.now(),
      ...data,
      attendance: data.attendance || [],
      joinDate: new Date()
    };
    memoryStore.employees.unshift(newEmp);
    return newEmp;
  },

  async updateEmployee(id, updates) {
    if (isMongoConnected) {
      return await Employee.findByIdAndUpdate(id, updates, { new: true });
    }
    const idx = memoryStore.employees.findIndex(e => String(e._id) === String(id));
    if (idx === -1) return null;
    memoryStore.employees[idx] = {
      ...memoryStore.employees[idx],
      ...updates
    };
    return memoryStore.employees[idx];
  },

  async markAttendance(employeeId, attendanceEntry) {
    if (isMongoConnected) {
      const emp = await Employee.findById(employeeId);
      if (!emp) return null;
      const existingIdx = emp.attendance.findIndex(a => a.date === attendanceEntry.date);
      if (existingIdx !== -1) {
        emp.attendance[existingIdx] = attendanceEntry;
      } else {
        emp.attendance.push(attendanceEntry);
      }
      return await emp.save();
    }
    const emp = memoryStore.employees.find(e => String(e._id) === String(employeeId));
    if (!emp) return null;
    const existingIdx = emp.attendance.findIndex(a => a.date === attendanceEntry.date);
    if (existingIdx !== -1) {
      emp.attendance[existingIdx] = attendanceEntry;
    } else {
      emp.attendance.push(attendanceEntry);
    }
    return emp;
  },

  // --- MACHINERY & MAINTENANCE ---
  async getMachinery() {
    if (isMongoConnected) {
      return await Machinery.find().sort({ machineCode: 1 });
    }
    return memoryStore.machineries;
  },

  async updateMachinery(id, updates) {
    if (isMongoConnected) {
      return await Machinery.findByIdAndUpdate(id, updates, { new: true });
    }
    const idx = memoryStore.machineries.findIndex(m => String(m._id) === String(id));
    if (idx === -1) return null;
    memoryStore.machineries[idx] = {
      ...memoryStore.machineries[idx],
      ...updates
    };
    return memoryStore.machineries[idx];
  },

  async createMachinery(data) {
    if (isMongoConnected) {
      const doc = new Machinery(data);
      return await doc.save();
    }
    const newMac = {
      _id: 'mac_' + Date.now(),
      ...data
    };
    memoryStore.machineries.push(newMac);
    return newMac;
  }
};
