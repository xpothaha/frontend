// Purchases related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderPurchases available globally
  window.renderPurchases = renderPurchases;
  
  // Render purchases page
  function renderPurchases() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">การซื้อสินค้า</h1>
        <button id="add-purchase-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <i class="fas fa-plus mr-2"></i>เพิ่มการซื้อสินค้า
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between mb-4">
            <div class="relative w-64">
              <input type="text" id="purchase-search" placeholder="ค้นหาการซื้อสินค้า..." class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">แสดง:</span>
              <select id="purchases-per-page" class="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span class="text-sm text-gray-500">รายการ</span>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่ใบสั่งซื้อ</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้จัดจำหน่าย</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนรายการ</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody id="purchases-table-body" class="bg-white divide-y divide-gray-200">
                <!-- Purchases will be loaded here -->
                <tr>
                  <td colspan="7" class="px-6 py-4 text-center text-gray-500">กำลังโหลดข้อมูล...</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="flex justify-between items-center mt-4">
            <div id="purchases-pagination-info" class="text-sm text-gray-500">
              แสดง 0 - 0 จาก 0 รายการ
            </div>
            
            <div class="flex space-x-2">
              <button id="purchases-prev-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" disabled>
                <i class="fas fa-chevron-left"></i>
              </button>
              <button id="purchases-next-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" disabled>
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `);
    
    // Load purchases data
    loadPurchases();
    
    // Setup event listeners
    setupPurchasesEventListeners();
  }
  
  // Load purchases from API
  async function loadPurchases(page = 1, limit = 10, search = '') {
    try {
      const purchases = await API.purchases.getAll(page, limit, search);
      
      renderPurchasesTable(purchases.data);
      updatePurchasesPagination(purchases.pagination);
      
    } catch (error) {
      console.error('Error loading purchases:', error);
      document.getElementById('purchases-table-body').innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-4 text-center text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล: ${error.message}</td>
        </tr>
      `;
    }
  }
  
  // Render purchases table
  function renderPurchasesTable(purchases) {
    const tableBody = document.getElementById('purchases-table-body');
    
    if (purchases.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-4 text-center text-gray-500">ไม่พบข้อมูลการซื้อสินค้า</td>
        </tr>
      `;
      return;
    }
    
    let html = '';
    
    purchases.forEach(purchase => {
      let statusClass = '';
      let statusText = '';
      
      switch (purchase.status) {
        case 'pending':
          statusClass = 'bg-yellow-100 text-yellow-800';
          statusText = 'รอดำเนินการ';
          break;
        case 'completed':
          statusClass = 'bg-green-100 text-green-800';
          statusText = 'เสร็จสิ้น';
          break;
        case 'cancelled':
          statusClass = 'bg-red-100 text-red-800';
          statusText = 'ยกเลิก';
          break;
        default:
          statusClass = 'bg-gray-100 text-gray-800';
          statusText = purchase.status;
      }
      
      html += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">${purchase.purchaseNumber}</td>
          <td class="px-6 py-4 whitespace-nowrap">${purchase.supplier.name}</td>
          <td class="px-6 py-4 whitespace-nowrap">${formatDate(purchase.date)}</td>
          <td class="px-6 py-4 whitespace-nowrap">${purchase.items.length}</td>
          <td class="px-6 py-4 whitespace-nowrap">${formatCurrency(purchase.total)}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
              ${statusText}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-blue-600 hover:text-blue-900 mr-3 view-purchase" data-id="${purchase.id}">
              <i class="fas fa-eye"></i>
            </button>
            <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-purchase" data-id="${purchase.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="text-red-600 hover:text-red-900 delete-purchase" data-id="${purchase.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = html;
  }
  
  // Update purchases pagination
  function updatePurchasesPagination(pagination) {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    
    document.getElementById('purchases-pagination-info').textContent = `แสดง ${start} - ${end} จาก ${totalItems} รายการ`;
    
    document.getElementById('purchases-prev-page').disabled = currentPage <= 1;
    document.getElementById('purchases-next-page').disabled = currentPage >= totalPages;
    
    document.getElementById('purchases-prev-page').dataset.page = currentPage;
    document.getElementById('purchases-next-page').dataset.page = currentPage;
  }
  
  // Setup event listeners for purchases page
  function setupPurchasesEventListeners() {
    // Add purchase button
    document.getElementById('add-purchase-btn').addEventListener('click', () => {
      // Redirect to create purchase page
      window.location.hash = '#/purchases/create';
    });
    
    // Purchase search
    document.getElementById('purchase-search').addEventListener('input', debounce(function() {
      const searchTerm = this.value.trim();
      const limit = document.getElementById('purchases-per-page').value;
      loadPurchases(1, limit, searchTerm);
    }, 500));
    
    // Purchases per page
    document.getElementById('purchases-per-page').addEventListener('change', function() {
      const limit = this.value;
      const searchTerm = document.getElementById('purchase-search').value.trim();
      loadPurchases(1, limit, searchTerm);
    });
    
    // Pagination buttons
    document.getElementById('purchases-prev-page').addEventListener('click', () => {
      const currentPage = parseInt(document.getElementById('purchases-prev-page').dataset.page || 1);
      const limit = document.getElementById('purchases-per-page').value;
      const searchTerm = document.getElementById('purchase-search').value.trim();
      loadPurchases(currentPage - 1, limit, searchTerm);
    });
    
    document.getElementById('purchases-next-page').addEventListener('click', () => {
      const currentPage = parseInt(document.getElementById('purchases-next-page').dataset.page || 1);
      const limit = document.getElementById('purchases-per-page').value;
      const searchTerm = document.getElementById('purchase-search').value.trim();
      loadPurchases(currentPage + 1, limit, searchTerm);
    });
    
    // View purchase details
    document.addEventListener('click', (e) => {
      if (e.target.closest('.view-purchase')) {
        const purchaseId = e.target.closest('.view-purchase').dataset.id;
        window.location.hash = `#/purchases/${purchaseId}`;
      }
    });
    
    // Edit purchase
    document.addEventListener('click', (e) => {
      if (e.target.closest('.edit-purchase')) {
        const purchaseId = e.target.closest('.edit-purchase').dataset.id;
        window.location.hash = `#/purchases/${purchaseId}/edit`;
      }
    });
    
    // Delete purchase
    document.addEventListener('click', (e) => {
      if (e.target.closest('.delete-purchase')) {
        const purchaseId = e.target.closest('.delete-purchase').dataset.id;
        
        if (confirm('คุณต้องการลบการซื้อสินค้านี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้')) {
          deletePurchase(purchaseId);
        }
      }
    });
  }
  
  // Delete purchase
  async function deletePurchase(purchaseId) {
    try {
      await API.purchases.delete(purchaseId);
      
      // Reload purchases
      const limit = document.getElementById('purchases-per-page').value;
      const searchTerm = document.getElementById('purchase-search').value.trim();
      loadPurchases(1, limit, searchTerm);
      
      alert('ลบการซื้อสินค้าเรียบร้อยแล้ว');
      
    } catch (error) {
      console.error('Error deleting purchase:', error);
      alert('เกิดข้อผิดพลาดในการลบการซื้อสินค้า: ' + error.message);
    }
  }
  
  // Render create purchase page
  window.renderCreatePurchase = function() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">เพิ่มการซื้อสินค้า</h1>
        <button id="back-to-purchases" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          <i class="fas fa-arrow-left mr-2"></i>กลับ
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <form id="purchase-form">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label for="purchase-number" class="block text-sm font-medium text-gray-700 mb-1">เลขที่ใบสั่งซื้อ <span class="text-red-500">*</span></label>
                <input type="text" id="purchase-number" name="purchaseNumber" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="purchase-supplier" class="block text-sm font-medium text-gray-700 mb-1">ผู้จัดจำหน่าย <span class="text-red-500">*</span></label>
                <select id="purchase-supplier" name="supplierId" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- เลือกผู้จัดจำหน่าย --</option>
                </select>
              </div>
              
              <div>
                <label for="purchase-date" class="block text-sm font-medium text-gray-700 mb-1">วันที่ <span class="text-red-500">*</span></label>
                <input type="date" id="purchase-date" name="date" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="purchase-status" class="block text-sm font-medium text-gray-700 mb-1">สถานะ <span class="text-red-500">*</span></label>
                <select id="purchase-status" name="status" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="pending">รอดำเนินการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
              
              <div class="md:col-span-2">
                <label for="purchase-notes" class="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                <textarea id="purchase-notes" name="notes" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
            
            <div class="mb-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">รายการสินค้า</h2>
                <button type="button" id="add-purchase-item" class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <i class="fas fa-plus mr-2"></i>เพิ่มสินค้า
                </button>
              </div>
              
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคาต่อหน่วย</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รวม</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody id="purchase-items-table-body" class="bg-white divide-y divide-gray-200">
                    <tr id="no-purchase-items-row">
                      <td colspan="5" class="px-6 py-4 text-center text-gray-500">ยังไม่มีรายการสินค้า</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="px-6 py-4 text-right font-semibold">ยอดรวม:</td>
                      <td class="px-6 py-4 font-semibold" id="purchase-total">0.00 บาท</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-purchase" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Add Purchase Item Modal -->
      <div id="purchase-item-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">เพิ่มสินค้า</h3>
            <button id="close-purchase-item-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="purchase-item-form" class="px-6 py-4">
            <input type="hidden" id="purchase-item-index" value="-1">
            
            <div class="mb-4">
              <label for="purchase-item-product" class="block text-sm font-medium text-gray-700 mb-1">สินค้า <span class="text-red-500">*</span></label>
              <select id="purchase-item-product" name="productId" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- เลือกสินค้า --</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label for="purchase-item-quantity" class="block text-sm font-medium text-gray-700 mb-1">จำนวน <span class="text-red-500">*</span></label>
              <input type="number" id="purchase-item-quantity" name="quantity" min="1" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="purchase-item-price" class="block text-sm font-medium text-gray-700 mb-1">ราคาต่อหน่วย <span class="text-red-500">*</span></label>
              <input type="number" id="purchase-item-price" name="price" min="0" step="0.01" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-purchase-item" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                เพิ่ม
              </button>
            </div>
          </form>
        </div>
      </div>
    `);
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchase-date').value = today;
    
    // Load suppliers for dropdown
    loadSuppliersForPurchase();
    
    // Load products for dropdown
    loadProductsForPurchase();
    
    // Setup event listeners
    setupCreatePurchaseEventListeners();
  };
  
  // Helper function to format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  }
  
  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH').format(date);
  }
  
  // Helper function to debounce input events
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
});
