// API handling functions
const API_URL = '/api';

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options
  });
  
  if (response.status === 401) {
    // Unauthorized, redirect to login
    localStorage.removeItem('token');
    window.location.href = '/';
    return null;
  }
  
  return response.json();
}

// Authentication
const auth = {
  login: async (username, password, turnstileToken) => {
    try {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, turnstileToken })
      });
      
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return { success: true };
      }
      
      return { success: false, message: data.message || 'ล็อกอินไม่สำเร็จ' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
};

// Dashboard
const dashboard = {
  getSummary: async () => await fetchAPI('/dashboard/summary')
};

// Products
const products = {
  getAll: async (page = 1, limit = 10, search = '', categoryId = '') => {
    let endpoint = `/products?page=${page}&limit=${limit}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (categoryId) endpoint += `&categoryId=${categoryId}`;
    return await fetchAPI(endpoint);
  },
  getById: async (id) => await fetchAPI(`/products/${id}`),
  create: async (product) => await fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(product)
  }),
  update: async (id, product) => await fetchAPI(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  }),
  delete: async (id) => await fetchAPI(`/products/${id}`, {
    method: 'DELETE'
  }),
  updateStock: async (id, quantity, type = 'add') => await fetchAPI(`/products/${id}/stock`, {
    method: 'PUT',
    body: JSON.stringify({ quantity, type })
  })
};

// Categories
const categories = {
  getAll: async (page = 1, limit = 10, search = '') => {
    let endpoint = `/categories?page=${page}&limit=${limit}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    return await fetchAPI(endpoint);
  },
  getById: async (id) => await fetchAPI(`/categories/${id}`),
  create: async (category) => await fetchAPI('/categories', {
    method: 'POST',
    body: JSON.stringify(category)
  }),
  update: async (id, category) => await fetchAPI(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category)
  }),
  delete: async (id) => await fetchAPI(`/categories/${id}`, {
    method: 'DELETE'
  }),
  getAllWithoutPagination: async () => await fetchAPI('/categories/all')
};

// Customers
const customers = {
  getAll: async (page = 1, limit = 10, search = '') => {
    let endpoint = `/customers?page=${page}&limit=${limit}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    return await fetchAPI(endpoint);
  },
  getById: async (id) => await fetchAPI(`/customers/${id}`),
  create: async (customer) => await fetchAPI('/customers', {
    method: 'POST',
    body: JSON.stringify(customer)
  }),
  update: async (id, customer) => await fetchAPI(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customer)
  }),
  delete: async (id) => await fetchAPI(`/customers/${id}`, {
    method: 'DELETE'
  }),
  getSalesHistory: async (id) => await fetchAPI(`/customers/${id}/sales`)
};

// Sales
const sales = {
  getAll: async (page = 1, limit = 10, search = '', startDate = '', endDate = '') => {
    let endpoint = `/sales?page=${page}&limit=${limit}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (startDate) endpoint += `&startDate=${startDate}`;
    if (endDate) endpoint += `&endDate=${endDate}`;
    return await fetchAPI(endpoint);
  },
  getById: async (id) => await fetchAPI(`/sales/${id}`),
  create: async (sale) => await fetchAPI('/sales', {
    method: 'POST',
    body: JSON.stringify(sale)
  }),
  update: async (id, sale) => await fetchAPI(`/sales/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sale)
  }),
  delete: async (id) => await fetchAPI(`/sales/${id}`, {
    method: 'DELETE'
  }),
  getReceipt: async (id) => await fetchAPI(`/sales/${id}/receipt`)
};

// Purchases
const purchases = {
  getAll: async (page = 1, limit = 10, search = '', startDate = '', endDate = '') => {
    let endpoint = `/purchases?page=${page}&limit=${limit}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (startDate) endpoint += `&startDate=${startDate}`;
    if (endDate) endpoint += `&endDate=${endDate}`;
    return await fetchAPI(endpoint);
  },
  getById: async (id) => await fetchAPI(`/purchases/${id}`),
  create: async (purchase) => await fetchAPI('/purchases', {
    method: 'POST',
    body: JSON.stringify(purchase)
  }),
  update: async (id, purchase) => await fetchAPI(`/purchases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(purchase)
  }),
  delete: async (id) => await fetchAPI(`/purchases/${id}`, {
    method: 'DELETE'
  })
};

// Reports
const reports = {
  getSalesReport: async (params) => await fetchAPI('/reports/sales', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  getPurchasesReport: async (params) => await fetchAPI('/reports/purchases', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  getInventoryReport: async () => await fetchAPI('/reports/inventory'),
  getProfitReport: async (params) => await fetchAPI('/reports/profit', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  getTopSellingProducts: async (limit = 5) => await fetchAPI(`/reports/top-products?limit=${limit}`),
  getSalesByCategory: async () => await fetchAPI('/reports/sales-by-category')
};

// Settings
const settings = {
  getAll: async () => await fetchAPI('/settings'),
  update: async (settings) => await fetchAPI('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  }),
  getStoreInfo: async () => await fetchAPI('/settings/store')
};

// Export API functions
const API = {
  auth,
  dashboard,
  products,
  categories,
  customers,
  sales,
  purchases,
  reports,
  settings
};
