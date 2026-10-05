const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('crusher_token');

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('crusher_token', token);
  } else {
    localStorage.removeItem('crusher_token');
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('crusher_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('crusher_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('crusher_user');
  }
};

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setAuthToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  async register(userData) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    setAuthToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  async getMe() {
    return request('/auth/me');
  },

  async getUsers() {
    return request('/auth/users');
  },

  logout() {
    setAuthToken(null);
    setStoredUser(null);
  },

  // Dashboard
  async getDashboardStats() {
    return request('/dashboard/stats');
  },

  // Inventory
  async getInventory(category) {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return request(`/inventory${query}`);
  },

  async createProduct(item) {
    return request('/inventory', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  async updateProduct(id, updates) {
    return request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteProduct(id) {
    return request(`/inventory/${id}`, {
      method: 'DELETE'
    });
  },

  // Sales & Dispatches (Weighbridge)
  async getDispatches(filters = {}) {
    const params = new URLSearchParams();
    if (filters.paymentStatus && filters.paymentStatus !== 'All') params.append('paymentStatus', filters.paymentStatus);
    if (filters.gatePassStatus && filters.gatePassStatus !== 'All') params.append('gatePassStatus', filters.gatePassStatus);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/sales${qs}`);
  },

  async createDispatch(data) {
    return request('/sales', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateDispatch(id, data) {
    return request(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Employees & Attendance
  async getEmployees(dept) {
    const qs = dept && dept !== 'All' ? `?department=${encodeURIComponent(dept)}` : '';
    return request(`/employees${qs}`);
  },

  async createEmployee(data) {
    return request('/employees', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async markAttendance(data) {
    return request('/employees/attendance', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getPayrollSummary() {
    return request('/employees/payroll');
  },

  // Machinery
  async getMachinery() {
    return request('/machinery');
  },

  async updateMachinery(id, data) {
    return request(`/machinery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async createMachinery(data) {
    return request('/machinery', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
