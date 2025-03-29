// Reports related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderReports available globally
  window.renderReports = renderReports;
  
  // Render reports page
  function renderReports() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">รายงาน</h1>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-4">รายงานการขาย</h2>
            <p class="text-gray-600 mb-4">ดูรายงานการขายตามช่วงเวลา</p>
            <button id="sales-report-btn" class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              ดูรายงาน
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-4">รายงานสินค้าขายดี</h2>
            <p class="text-gray-600 mb-4">ดูรายงานสินค้าที่ขายดีที่สุด</p>
            <button id="top-products-report-btn" class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              ดูรายงาน
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-4">รายงานสต็อกสินค้า</h2>
            <p class="text-gray-600 mb-4">ดูรายงานสต็อกสินค้าคงเหลือ</p>
            <button id="inventory-report-btn" class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              ดูรายงาน
            </button>
          </div>
        </div>
      </div>
      
      <div id="report-content" class="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div class="text-center text-gray-500">
          <p>กรุณาเลือกรายงานที่ต้องการดู</p>
        </div>
      </div>
    `);
    
    // Setup event listeners
    setupReportsEventListeners();
  }
  
  // Setup event listeners for reports page
  function setupReportsEventListeners() {
    // Sales report button
    document.getElementById('sales-report-btn').addEventListener('click', () => {
      showSalesReport();
    });
    
    // Top products report button
    document.getElementById('top-products-report-btn').addEventListener('click', () => {
      showTopProductsReport();
    });
    
    // Inventory report button
    document.getElementById('inventory-report-btn').addEventListener('click', () => {
      showInventoryReport();
    });
  }
  
  // Show sales report
  async function showSalesReport() {
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = `
      <h2 class="text-xl font-semibold mb-4">รายงานการขาย</h2>
      
      <div class="mb-6">
        <div class="flex space-x-4 mb-4">
          <div>
            <label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
            <input type="date" id="start-date" class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
            <input type="date" id="end-date" class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="self-end">
            <button id="generate-sales-report-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              สร้างรายงาน
            </button>
          </div>
        </div>
      </div>
      
      <div id="sales-report-data">
        <div class="text-center text-gray-500">
          <p>กรุณาเลือกช่วงเวลาและคลิกสร้างรายงาน</p>
        </div>
      </div>
    `;
    
    // Set default dates (current month)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    document.getElementById('start-date').valueAsDate = firstDay;
    document.getElementById('end-date').valueAsDate = lastDay;
    
    // Generate sales report button
    document.getElementById('generate-sales-report-btn').addEventListener('click', async () => {
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;
      
      try {
        const salesData = await API.reports.getSalesReport(startDate, endDate);
        renderSalesReportData(salesData);
      } catch (error) {
        console.error('Error generating sales report:', error);
        alert('เกิดข้อผิดพลาดในการสร้างรายงานการขาย: ' + error.message);
      }
    });
  }
  
  // Render sales report data
  function renderSalesReportData(salesData) {
    const salesReportData = document.getElementById('sales-report-data');
    
    // Calculate totals
    const totalSales = salesData.reduce((total, sale) => total + sale.total, 0);
    const totalItems = salesData.reduce((total, sale) => total + sale.items.reduce((sum, item) => sum + item.quantity, 0), 0);
    
    let html = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-blue-800">ยอดขายรวม</h3>
          <p class="text-2xl font-bold">${formatCurrency(totalSales)}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-green-800">จำนวนการขาย</h3>
          <p class="text-2xl font-bold">${salesData.length}</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-purple-800">จำนวนสินค้าที่ขาย</h3>
          <p class="text-2xl font-bold">${totalItems}</p>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่ใบเสร็จ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนรายการ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    salesData.forEach(sale => {
      html += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">${sale.receiptNumber}</td>
          <td class="px-6 py-4 whitespace-nowrap">${formatDate(sale.date)}</td>
          <td class="px-6 py-4 whitespace-nowrap">${sale.customer ? sale.customer.name : 'ลูกค้าทั่วไป'}</td>
          <td class="px-6 py-4 whitespace-nowrap">${sale.items.length}</td>
          <td class="px-6 py-4 whitespace-nowrap">${formatCurrency(sale.total)}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
      
      <div class="mt-6">
        <button id="export-sales-report-btn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          <i class="fas fa-file-excel mr-2"></i>ส่งออก Excel
        </button>
      </div>
    `;
    
    salesReportData.innerHTML = html;
    
    // Export sales report button
    document.getElementById('export-sales-report-btn').addEventListener('click', () => {
      // TODO: Implement export to Excel functionality
      alert('ฟังก์ชันการส่งออกไฟล์ Excel จะถูกพัฒนาในเวอร์ชันถัดไป');
    });
  }
  
  // Show top products report
  async function showTopProductsReport() {
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = `
      <h2 class="text-xl font-semibold mb-4">รายงานสินค้าขายดี</h2>
      
      <div class="mb-6">
        <div class="flex space-x-4 mb-4">
          <div>
            <label for="top-products-start-date" class="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
            <input type="date" id="top-products-start-date" class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label for="top-products-end-date" class="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
            <input type="date" id="top-products-end-date" class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label for="top-products-limit" class="block text-sm font-medium text-gray-700 mb-1">จำนวนสินค้า</label>
            <select id="top-products-limit" class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div class="self-end">
            <button id="generate-top-products-report-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              สร้างรายงาน
            </button>
          </div>
        </div>
      </div>
      
      <div id="top-products-report-data">
        <div class="text-center text-gray-500">
          <p>กรุณาเลือกช่วงเวลาและคลิกสร้างรายงาน</p>
        </div>
      </div>
    `;
    
    // Set default dates (current month)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    document.getElementById('top-products-start-date').valueAsDate = firstDay;
    document.getElementById('top-products-end-date').valueAsDate = lastDay;
    
    // Generate top products report button
    document.getElementById('generate-top-products-report-btn').addEventListener('click', async () => {
      const startDate = document.getElementById('top-products-start-date').value;
      const endDate = document.getElementById('top-products-end-date').value;
      const limit = document.getElementById('top-products-limit').value;
      
      try {
        const topProductsData = await API.reports.getTopProductsReport(startDate, endDate, limit);
        renderTopProductsReportData(topProductsData);
      } catch (error) {
        console.error('Error generating top products report:', error);
        alert('เกิดข้อผิดพลาดในการสร้างรายงานสินค้าขายดี: ' + error.message);
      }
    });
  }
  
  // Render top products report data
  function renderTopProductsReportData(topProductsData) {
    const topProductsReportData = document.getElementById('top-products-report-data');
    
    let html = `
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสสินค้า</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนที่ขาย</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดขายรวม</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    topProductsData.forEach((product, index) => {
      html += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">${index + 1}</td>
          <td class="px-6 py-4 whitespace-nowrap">${product.code}</td>
          <td class="px-6 py-4 whitespace-nowrap">${product.name}</td>
          <td class="px-6 py-4 whitespace-nowrap">${product.category ? product.category.name : '-'}</td>
          <td class="px-6 py-4 whitespace-nowrap">${product.quantitySold}</td>
          <td class="px-6 py-4 whitespace-nowrap">${formatCurrency(product.totalSales)}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
      
      <div class="mt-6">
        <button id="export-top-products-report-btn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          <i class="fas fa-file-excel mr-2"></i>ส่งออก Excel
        </button>
      </div>
    `;
    
    topProductsReportData.innerHTML = html;
    
    // Export top products report button
    document.getElementById('export-top-products-report-btn').addEventListener('click', () => {
      // TODO: Implement export to Excel functionality
      alert('ฟังก์ชันการส่งออกไฟล์ Excel จะถูกพัฒนาในเวอร์ชันถัดไป');
    });
  }
  
  // Show inventory report
  async function showInventoryReport() {
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = `
      <h2 class="text-xl font-semibold mb-4">รายงานสต็อกสินค้า</h2>
      
      <div class="mb-6">
        <div class="flex space-x-4 mb-4">
          <div>
            <label for="inventory-category" class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
            <select id="inventory-category" class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">ทั้งหมด</option>
            </select>
          </div>
          <div>
            <label for="inventory-status" class="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
            <select id="inventory-status" class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">ทั้งหมด</option>
              <option value="low">สินค้าใกล้หมด</option>
              <option value="out">สินค้าหมด</option>
            </select>
          </div>
          <div class="self-end">
            <button id="generate-inventory-report-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              สร้างรายงาน
            </button>
          </div>
        </div>
      </div>
      
      <div id="inventory-report-data">
        <div class="text-center text-gray-500">
          <p>กรุณาเลือกตัวกรองและคลิกสร้างรายงาน</p>
        </div>
      </div>
    `;
    
    // Load categories
    try {
      const categories = await API.categories.getAll();
      const categorySelect = document.getElementById('inventory-category');
      
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
    
    // Generate inventory report button
    document.getElementById('generate-inventory-report-btn').addEventListener('click', async () => {
      const categoryId = document.getElementById('inventory-category').value;
      const status = document.getElementById('inventory-status').value;
      
      try {
        const inventoryData = await API.reports.getInventoryReport(categoryId, status);
        renderInventoryReportData(inventoryData);
      } catch (error) {
        console.error('Error generating inventory report:', error);
        alert('เกิดข้อผิดพลาดในการสร้างรายงานสต็อกสินค้า: ' + error.message);
      }
    });
  }
  
  // Render inventory report data
  function renderInventoryReportData(inventoryData) {
    const inventoryReportData = document.getElementById('inventory-report-data');
    
    let html = `
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสสินค้า</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคาขาย</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนคงเหลือ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    inventoryData.forEach(product => {
      let statusClass = '';
      let statusText = '';
      
      if (product.quantity <= 0) {
        statusClass = 'bg-red-100 text-red-800';
        statusText = 'สินค้าหมด';
      } else if (product.quantity <= product.lowStockThreshold) {
        statusClass = 'bg-yellow-100 text-yellow-800';
        statusText = 'ใกล้หมด';
      } else {
        statusClass = 'bg-green-100 text-green-800';
        statusText = 'ปกติ';
      }
      
      html += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">${product.code}</td>
          <td class="px-6 py-4 whitespace-nowrap">${product.name}</td>
          <td class="px-6 py-4 whitespace-nowrap">${product.category ? product.category.name : '-'}</td>
          <td class="px-6 py-4 whitespace-nowrap">${formatCurrency(product.price)}</td>
          <td class="px-6 py-4 whitespace-nowrap">${product.quantity}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
              ${statusText}
            </span>
          </td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
      
      <div class="mt-6">
        <button id="export-inventory-report-btn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          <i class="fas fa-file-excel mr-2"></i>ส่งออก Excel
        </button>
      </div>
    `;
    
    inventoryReportData.innerHTML = html;
    
    // Export inventory report button
    document.getElementById('export-inventory-report-btn').addEventListener('click', () => {
      // TODO: Implement export to Excel functionality
      alert('ฟังก์ชันการส่งออกไฟล์ Excel จะถูกพัฒนาในเวอร์ชันถัดไป');
    });
  }
  
  // Helper function to format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  }
  
  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH').format(date);
  }
});
