// Dashboard related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderDashboard available globally
  window.renderDashboard = renderDashboard;
  
  // Render dashboard page
  function renderDashboard() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-500">ยอดขายวันนี้</p>
              <p class="text-2xl font-bold text-gray-900" id="today-sales">฿0.00</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-500">สินค้าทั้งหมด</p>
              <p class="text-2xl font-bold text-gray-900" id="total-products">0</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-500">ลูกค้าทั้งหมด</p>
              <p class="text-2xl font-bold text-gray-900" id="total-customers">0</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-500">สินค้าใกล้หมด</p>
              <p class="text-2xl font-bold text-gray-900" id="low-stock">0</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">การขายล่าสุด</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200" id="recent-sales">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="4">กำลังโหลดข้อมูล...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">สินค้าขายดี</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนขาย</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดขาย</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200" id="top-products">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="4">กำลังโหลดข้อมูล...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `);
    
    // Load dashboard data
    loadDashboardData();
  }
  
  // Load dashboard data from API
  async function loadDashboardData() {
    try {
      // Get dashboard summary
      const summary = await API.dashboard.getSummary();
      
      // Update summary cards
      document.getElementById('today-sales').textContent = `฿${summary.todaySales.toFixed(2)}`;
      document.getElementById('total-products').textContent = summary.totalProducts;
      document.getElementById('total-customers').textContent = summary.totalCustomers;
      document.getElementById('low-stock').textContent = summary.lowStockItems;
      
      // Update recent sales table
      const recentSalesElement = document.getElementById('recent-sales');
      if (summary.recentSales.length > 0) {
        recentSalesElement.innerHTML = summary.recentSales.map(sale => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sale.customer}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(sale.date).toLocaleDateString('th-TH')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">฿${sale.total.toFixed(2)}</td>
          </tr>
        `).join('');
      } else {
        recentSalesElement.innerHTML = `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="4">ไม่พบข้อมูลการขาย</td>
          </tr>
        `;
      }
      
      // Update top products table
      const topProductsElement = document.getElementById('top-products');
      if (summary.topProducts.length > 0) {
        topProductsElement.innerHTML = summary.topProducts.map(product => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.category}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.quantity}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">฿${product.sales.toFixed(2)}</td>
          </tr>
        `).join('');
      } else {
        topProductsElement.innerHTML = `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="4">ไม่พบข้อมูลสินค้า</td>
          </tr>
        `;
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Show error message
      document.getElementById('today-sales').textContent = 'ข้อผิดพลาด';
      document.getElementById('total-products').textContent = 'ข้อผิดพลาด';
      document.getElementById('total-customers').textContent = 'ข้อผิดพลาด';
      document.getElementById('low-stock').textContent = 'ข้อผิดพลาด';
    }
  }
});
