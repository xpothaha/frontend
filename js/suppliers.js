// Suppliers related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderSuppliers available globally
  window.renderSuppliers = renderSuppliers;
  
  // Render suppliers page
  function renderSuppliers() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">ผู้จัดจำหน่าย</h1>
        <button id="add-supplier-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <i class="fas fa-plus mr-2"></i>เพิ่มผู้จัดจำหน่าย
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between mb-4">
            <div class="relative w-64">
              <input type="text" id="supplier-search" placeholder="ค้นหาผู้จัดจำหน่าย..." class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">แสดง:</span>
              <select id="suppliers-per-page" class="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ติดต่อ</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทรศัพท์</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ที่อยู่</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody id="suppliers-table-body" class="bg-white divide-y divide-gray-200">
                <!-- Suppliers will be loaded here -->
                <tr>
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">กำลังโหลดข้อมูล...</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="flex justify-between items-center mt-4">
            <div id="suppliers-pagination-info" class="text-sm text-gray-500">
              แสดง 0 - 0 จาก 0 รายการ
            </div>
            
            <div class="flex space-x-2">
              <button id="suppliers-prev-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" disabled>
                <i class="fas fa-chevron-left"></i>
              </button>
              <button id="suppliers-next-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" disabled>
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add/Edit Supplier Modal -->
      <div id="supplier-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 id="supplier-modal-title" class="text-lg font-semibold">เพิ่มผู้จัดจำหน่าย</h3>
            <button id="close-supplier-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="supplier-form" class="px-6 py-4">
            <input type="hidden" id="supplier-id">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="supplier-name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้จัดจำหน่าย <span class="text-red-500">*</span></label>
                <input type="text" id="supplier-name" name="name" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="supplier-contact" class="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ติดต่อ</label>
                <input type="text" id="supplier-contact" name="contact" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="supplier-email" class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input type="email" id="supplier-email" name="email" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="supplier-phone" class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                <input type="tel" id="supplier-phone" name="phone" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div class="md:col-span-2">
                <label for="supplier-address" class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                <textarea id="supplier-address" name="address" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              
              <div>
                <label for="supplier-tax-id" class="block text-sm font-medium text-gray-700 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                <input type="text" id="supplier-tax-id" name="taxId" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="supplier-website" class="block text-sm font-medium text-gray-700 mb-1">เว็บไซต์</label>
                <input type="url" id="supplier-website" name="website" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div class="md:col-span-2">
                <label for="supplier-notes" class="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                <textarea id="supplier-notes" name="notes" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-supplier" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- View Supplier Purchases Modal -->
      <div id="supplier-purchases-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 id="supplier-purchases-title" class="text-lg font-semibold">ประวัติการซื้อจากผู้จัดจำหน่าย</h3>
            <button id="close-supplier-purchases-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div id="supplier-purchases-content">
              <!-- Purchases history will be loaded here -->
              <div class="text-center text-gray-500 py-8">
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div id="delete-supplier-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">ยืนยันการลบ</h3>
            <button id="close-delete-supplier-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="px-6 py-4">
            <p class="text-gray-700 mb-4">คุณต้องการลบผู้จัดจำหน่ายนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
            
            <div class="flex justify-end space-x-2">
              <button id="cancel-delete-supplier" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button id="confirm-delete-supplier" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                ลบ
              </button>
            </div>
          </div>
        </div>
      </div>
    `);
    
    // Load suppliers data
    loadSuppliers();
    
    // Setup event listeners
    setupSuppliersEventListeners();
  }
  
  // Load suppliers from API
  async function loadSuppliers(page = 1, limit = 10, search = '') {
    try {
      const suppliers = await API.suppliers.getAll(page, limit, search);
      
      renderSuppliersTable(suppliers.data);
      updateSuppliersPagination(suppliers.pagination);
      
    } catch (error) {
      console.error('Error loading suppliers:', error);
      document.getElementById('suppliers-table-body').innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-4 text-center text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล: ${error.message}</td>
        </tr>
      `;
    }
  }
  
  // Render suppliers table
  function renderSuppliersTable(suppliers) {
    const tableBody = document.getElementById('suppliers-table-body');
    
    if (suppliers.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-4 text-center text-gray-500">ไม่พบข้อมูลผู้จัดจำหน่าย</td>
        </tr>
      `;
      return;
    }
    
    let html = '';
    
    suppliers.forEach(supplier => {
      html += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="font-medium text-gray-900">${supplier.name}</div>
            ${supplier.contact ? `<div class="text-sm text-gray-500">ติดต่อ: ${supplier.contact}</div>` : ''}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            ${supplier.contact || '-'}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            ${supplier.email || '-'}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            ${supplier.phone || '-'}
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-900 line-clamp-2">${supplier.address || '-'}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-blue-600 hover:text-blue-900 mr-3 view-purchases" data-id="${supplier.id}">
              <i class="fas fa-history"></i>
            </button>
            <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-supplier" data-id="${supplier.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="text-red-600 hover:text-red-900 delete-supplier" data-id="${supplier.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = html;
  }
  
  // Update suppliers pagination
  function updateSuppliersPagination(pagination) {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    
    document.getElementById('suppliers-pagination-info').textContent = `แสดง ${start} - ${end} จาก ${totalItems} รายการ`;
    
    document.getElementById('suppliers-prev-page').disabled = currentPage <= 1;
    document.getElementById('suppliers-next-page').disabled = currentPage >= totalPages;
  }
  
  // Setup event listeners for suppliers page
  function setupSuppliersEventListeners() {
    // Add supplier button
    document.getElementById('add-supplier-btn').addEventListener('click', () => {
      document.getElementById('supplier-modal-title').textContent = 'เพิ่มผู้จัดจำหน่าย';
      document.getElementById('supplier-form').reset();
      document.getElementById('supplier-id').value = '';
      document.getElementById('supplier-modal').classList.remove('hidden');
    });
    
    // Close supplier modal
    document.getElementById('close-supplier-modal').addEventListener('click', () => {
      document.getElementById('supplier-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-supplier').addEventListener('click', () => {
      document.getElementById('supplier-modal').classList.add('hidden');
    });
    
    // Close supplier purchases modal
    document.getElementById('close-supplier-purchases-modal').addEventListener('click', () => {
      document.getElementById('supplier-purchases-modal').classList.add('hidden');
    });
    
    // Close delete confirmation modal
    document.getElementById('close-delete-supplier-modal').addEventListener('click', () => {
      document.getElementById('delete-supplier-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-delete-supplier').addEventListener('click', () => {
      document.getElementById('delete-supplier-modal').classList.add('hidden');
    });
    
    // Supplier search
    document.getElementById('supplier-search').addEventListener('input', debounce(function() {
      const searchTerm = this.value.trim();
      const limit = document.getElementById('suppliers-per-page').value;
      loadSuppliers(1, limit, searchTerm);
    }, 500));
    
    // Suppliers per page
    document.getElementById('suppliers-per-page').addEventListener('change', function() {
      const limit = this.value;
      const searchTerm = document.getElementById('supplier-search').value.trim();
      loadSuppliers(1, limit, searchTerm);
    });
    
    // Pagination buttons
    document.getElementById('suppliers-prev-page').addEventListener('click', () => {
      const currentPage = parseInt(document.getElementById('suppliers-prev-page').dataset.page || 1);
      const limit = document.getElementById('suppliers-per-page').value;
      const searchTerm = document.getElementById('supplier-search').value.trim();
      loadSuppliers(currentPage - 1, limit, searchTerm);
    });
    
    document.getElementById('suppliers-next-page').addEventListener('click', () => {
      const currentPage = parseInt(document.getElementById('suppliers-next-page').dataset.page || 1);
      const limit = document.getElementById('suppliers-per-page').value;
      const searchTerm = document.getElementById('supplier-search').value.trim();
      loadSuppliers(currentPage + 1, limit, searchTerm);
    });
    
    // Supplier form submit
    document.getElementById('supplier-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const supplierId = document.getElementById('supplier-id').value;
      const formData = new FormData(e.target);
      
      const supplierData = {
        name: formData.get('name'),
        contact: formData.get('contact'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        taxId: formData.get('taxId'),
        website: formData.get('website'),
        notes: formData.get('notes')
      };
      
      try {
        if (supplierId) {
          // Update existing supplier
          await API.suppliers.update(supplierId, supplierData);
          alert('อัปเดตข้อมูลผู้จัดจำหน่ายเรียบร้อยแล้ว');
        } else {
          // Create new supplier
          await API.suppliers.create(supplierData);
          alert('เพิ่มผู้จัดจำหน่ายเรียบร้อยแล้ว');
        }
        
        document.getElementById('supplier-modal').classList.add('hidden');
        
        // Reload suppliers
        const limit = document.getElementById('suppliers-per-page').value;
        const searchTerm = document.getElementById('supplier-search').value.trim();
        loadSuppliers(1, limit, searchTerm);
        
      } catch (error) {
        console.error('Error saving supplier:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
      }
    });
    
    // Edit supplier buttons
    document.addEventListener('click', async (e) => {
      if (e.target.closest('.edit-supplier')) {
        const supplierId = e.target.closest('.edit-supplier').dataset.id;
        
        try {
          const supplier = await API.suppliers.getById(supplierId);
          
          document.getElementById('supplier-modal-title').textContent = 'แก้ไขผู้จัดจำหน่าย';
          document.getElementById('supplier-id').value = supplier.id;
          document.getElementById('supplier-name').value = supplier.name || '';
          document.getElementById('supplier-contact').value = supplier.contact || '';
          document.getElementById('supplier-email').value = supplier.email || '';
          document.getElementById('supplier-phone').value = supplier.phone || '';
          document.getElementById('supplier-address').value = supplier.address || '';
          document.getElementById('supplier-tax-id').value = supplier.taxId || '';
          document.getElementById('supplier-website').value = supplier.website || '';
          document.getElementById('supplier-notes').value = supplier.notes || '';
          
          document.getElementById('supplier-modal').classList.remove('hidden');
          
        } catch (error) {
          console.error('Error loading supplier details:', error);
          alert('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้จัดจำหน่าย: ' + error.message);
        }
      }
    });
    
    // View supplier purchases
    document.addEventListener('click', async (e) => {
      if (e.target.closest('.view-purchases')) {
        const supplierId = e.target.closest('.view-purchases').dataset.id;
        
        try {
          const supplier = await API.suppliers.getById(supplierId);
          const purchases = await API.suppliers.getPurchases(supplierId);
          
          document.getElementById('supplier-purchases-title').textContent = `ประวัติการซื้อจาก ${supplier.name}`;
          
          renderSupplierPurchases(purchases);
          
          document.getElementById('supplier-purchases-modal').classList.remove('hidden');
          
        } catch (error) {
          console.error('Error loading supplier purchases:', error);
          alert('เกิดข้อผิดพลาดในการโหลดประวัติการซื้อ: ' + error.message);
        }
      }
    });
    
    // Delete supplier buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.delete-supplier')) {
        const supplierId = e.target.closest('.delete-supplier').dataset.id;
        
        document.getElementById('confirm-delete-supplier').dataset.id = supplierId;
        document.getElementById('delete-supplier-modal').classList.remove('hidden');
      }
    });
    
    // Confirm delete supplier
    document.getElementById('confirm-delete-supplier').addEventListener('click', async () => {
      const supplierId = document.getElementById('confirm-delete-supplier').dataset.id;
      
      try {
        await API.suppliers.delete(supplierId);
        
        document.getElementById('delete-supplier-modal').classList.add('hidden');
        
        // Reload suppliers
        const limit = document.getElementById('suppliers-per-page').value;
        const searchTerm = document.getElementById('supplier-search').value.trim();
        loadSuppliers(1, limit, searchTerm);
        
        alert('ลบผู้จัดจำหน่ายเรียบร้อยแล้ว');
        
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('เกิดข้อผิดพลาดในการลบผู้จัดจำหน่าย: ' + error.message);
      }
    });
  }
  
  // Render supplier purchases
  function renderSupplierPurchases(purchases) {
    const purchasesContent = document.getElementById('supplier-purchases-content');
    
    if (purchases.length === 0) {
      purchasesContent.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          <p>ไม่พบประวัติการซื้อ</p>
        </div>
      `;
      return;
    }
    
    let html = `
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่ใบสั่งซื้อ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนรายการ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
    `;
    
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
          <td class="px-6 py-4 whitespace-nowrap">${formatDate(purchase.date)}</td>
          <td class="px-6 py-4 whitespace-nowrap">${purchase.items.length}</td>
          <td class="px-6 py-4 whitespace-nowrap">${formatCurrency(purchase.total)}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
              ${statusText}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-blue-600 hover:text-blue-900 view-purchase-details" data-id="${purchase.id}">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
    `;
    
    purchasesContent.innerHTML = html;
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
