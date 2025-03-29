// Warranties related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderWarranties available globally
  window.renderWarranties = renderWarranties;
  
  // Render warranties page
  function renderWarranties() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">การรับประกันสินค้า</h1>
        <button id="add-warranty-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <i class="fas fa-plus mr-2"></i>เพิ่มการรับประกัน
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between mb-4">
            <div class="relative w-64">
              <input type="text" id="warranty-search" placeholder="ค้นหาการรับประกัน..." class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">แสดง:</span>
              <select id="warranties-per-page" class="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่การรับประกัน</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่เริ่มต้น</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สิ้นสุด</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody id="warranties-table-body" class="bg-white divide-y divide-gray-200">
                <!-- Warranties will be loaded here -->
                <tr>
                  <td colspan="7" class="px-6 py-4 text-center text-gray-500">กำลังโหลดข้อมูล...</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="flex justify-between items-center mt-4">
            <div id="warranties-pagination-info" class="text-sm text-gray-500">
              แสดง 0 - 0 จาก 0 รายการ
            </div>
            
            <div class="flex space-x-2">
              <button id="warranties-prev-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" disabled>
                <i class="fas fa-chevron-left"></i>
              </button>
              <button id="warranties-next-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" disabled>
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add/Edit Warranty Modal -->
      <div id="warranty-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 id="warranty-modal-title" class="text-lg font-semibold">เพิ่มการรับประกัน</h3>
            <button id="close-warranty-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="warranty-form" class="px-6 py-4">
            <input type="hidden" id="warranty-id">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="warranty-number" class="block text-sm font-medium text-gray-700 mb-1">เลขที่การรับประกัน <span class="text-red-500">*</span></label>
                <input type="text" id="warranty-number" name="warrantyNumber" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="warranty-product" class="block text-sm font-medium text-gray-700 mb-1">สินค้า <span class="text-red-500">*</span></label>
                <select id="warranty-product" name="productId" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- เลือกสินค้า --</option>
                </select>
              </div>
              
              <div>
                <label for="warranty-customer" class="block text-sm font-medium text-gray-700 mb-1">ลูกค้า <span class="text-red-500">*</span></label>
                <select id="warranty-customer" name="customerId" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- เลือกลูกค้า --</option>
                </select>
              </div>
              
              <div>
                <label for="warranty-sale" class="block text-sm font-medium text-gray-700 mb-1">เลขที่การขาย</label>
                <select id="warranty-sale" name="saleId" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- เลือกการขาย --</option>
                </select>
              </div>
              
              <div>
                <label for="warranty-start-date" class="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น <span class="text-red-500">*</span></label>
                <input type="date" id="warranty-start-date" name="startDate" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="warranty-end-date" class="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด <span class="text-red-500">*</span></label>
                <input type="date" id="warranty-end-date" name="endDate" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label for="warranty-status" class="block text-sm font-medium text-gray-700 mb-1">สถานะ <span class="text-red-500">*</span></label>
                <select id="warranty-status" name="status" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="active">ใช้งาน</option>
                  <option value="expired">หมดอายุ</option>
                  <option value="void">ยกเลิก</option>
                </select>
              </div>
              
              <div class="md:col-span-2">
                <label for="warranty-notes" class="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                <textarea id="warranty-notes" name="notes" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-warranty" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div id="delete-warranty-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">ยืนยันการลบ</h3>
            <button id="close-delete-warranty-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="px-6 py-4">
            <p class="text-gray-700 mb-4">คุณต้องการลบการรับประกันนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
            
            <div class="flex justify-end space-x-2">
              <button id="cancel-delete-warranty" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button id="confirm-delete-warranty" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                ลบ
              </button>
            </div>
          </div>
        </div>
      </div>
    `);
    
    // Load warranties data
    loadWarranties();
    
    // Setup event listeners
    setupWarrantiesEventListeners();
  }
  
  // Load warranties from API
  async function loadWarranties(page = 1, limit = 10, search = '') {
    try {
      const warranties = await API.warranties.getAll(page, limit, search);
      
      renderWarrantiesTable(warranties.data);
      updateWarrantiesPagination(warranties.pagination);
      
    } catch (error) {
      console.error('Error loading warranties:', error);
      document.getElementById('warranties-table-body').innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-4 text-center text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล: ${error.message}</td>
        </tr>
      `;
    }
  }
  
  // Render warranties table
  function renderWarrantiesTable(warranties) {
    const tableBody = document.getElementById('warranties-table-body');
    
    if (warranties.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-4 text-center text-gray-500">ไม่พบข้อมูลการรับประกัน</td>
        </tr>
      `;
      return;
    }
    
    let html = '';
    
    warranties.forEach(warranty => {
      let statusClass = '';
      let statusText = '';
      
      switch (warranty.status) {
        case 'active':
          statusClass = 'bg-green-100 text-green-800';
          statusText = 'ใช้งาน';
          break;
        case 'expired':
          statusClass = 'bg-red-100 text-red-800';
          statusText = 'หมดอายุ';
          break;
        case 'void':
          statusClass = 'bg-gray-100 text-gray-800';
          statusText = 'ยกเลิก';
          break;
        default:
          statusClass = 'bg-gray-100 text-gray-800';
          statusText = warranty.status;
      }
      
      html += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">${warranty.warrantyNumber}</td>
          <td class="px-6 py-4 whitespace-nowrap">${warranty.product.name}</td>
          <td class="px-6 py-4 whitespace-nowrap">${warranty.customer.name}</td>
          <td class="px-6 py-4 whitespace-nowrap">${formatDate(warranty.startDate)}</td>
          <td class="px-6 py-4 whitespace-nowrap">${formatDate(warranty.endDate)}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
              ${statusText}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-warranty" data-id="${warranty.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="text-red-600 hover:text-red-900 delete-warranty" data-id="${warranty.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = html;
  }
  
  // Update warranties pagination
  function updateWarrantiesPagination(pagination) {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    
    document.getElementById('warranties-pagination-info').textContent = `แสดง ${start} - ${end} จาก ${totalItems} รายการ`;
    
    document.getElementById('warranties-prev-page').disabled = currentPage <= 1;
    document.getElementById('warranties-next-page').disabled = currentPage >= totalPages;
    
    document.getElementById('warranties-prev-page').dataset.page = currentPage;
    document.getElementById('warranties-next-page').dataset.page = currentPage;
  }
  
  // Load products for warranty form
  async function loadProductsForWarranty() {
    try {
      const products = await API.products.getAll(1, 1000);
      const productSelect = document.getElementById('warranty-product');
      
      productSelect.innerHTML = '<option value="">-- เลือกสินค้า --</option>';
      
      products.data.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (${product.sku})`;
        productSelect.appendChild(option);
      });
      
    } catch (error) {
      console.error('Error loading products:', error);
      alert('ไม่สามารถโหลดข้อมูลสินค้าได้: ' + error.message);
    }
  }
  
  // Load customers for warranty form
  async function loadCustomersForWarranty() {
    try {
      const customers = await API.customers.getAll(1, 1000);
      const customerSelect = document.getElementById('warranty-customer');
      
      customerSelect.innerHTML = '<option value="">-- เลือกลูกค้า --</option>';
      
      customers.data.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
      });
      
    } catch (error) {
      console.error('Error loading customers:', error);
      alert('ไม่สามารถโหลดข้อมูลลูกค้าได้: ' + error.message);
    }
  }
  
  // Load sales for warranty form
  async function loadSalesForWarranty() {
    try {
      const sales = await API.sales.getAll(1, 1000);
      const saleSelect = document.getElementById('warranty-sale');
      
      saleSelect.innerHTML = '<option value="">-- เลือกการขาย --</option>';
      
      sales.data.forEach(sale => {
        const option = document.createElement('option');
        option.value = sale.id;
        option.textContent = `${sale.saleNumber} (${formatDate(sale.date)})`;
        saleSelect.appendChild(option);
      });
      
    } catch (error) {
      console.error('Error loading sales:', error);
      alert('ไม่สามารถโหลดข้อมูลการขายได้: ' + error.message);
    }
  }
  
  // Setup event listeners for warranties page
  function setupWarrantiesEventListeners() {
    // Add warranty button
    document.getElementById('add-warranty-btn').addEventListener('click', () => {
      document.getElementById('warranty-modal-title').textContent = 'เพิ่มการรับประกัน';
      document.getElementById('warranty-form').reset();
      document.getElementById('warranty-id').value = '';
      
      // Load products, customers, and sales for dropdowns
      loadProductsForWarranty();
      loadCustomersForWarranty();
      loadSalesForWarranty();
      
      // Set default dates
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('warranty-start-date').value = today;
      
      // Default warranty period (1 year)
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      document.getElementById('warranty-end-date').value = nextYear.toISOString().split('T')[0];
      
      document.getElementById('warranty-modal').classList.remove('hidden');
    });
    
    // Close warranty modal
    document.getElementById('close-warranty-modal').addEventListener('click', () => {
      document.getElementById('warranty-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-warranty').addEventListener('click', () => {
      document.getElementById('warranty-modal').classList.add('hidden');
    });
    
    // Close delete confirmation modal
    document.getElementById('close-delete-warranty-modal').addEventListener('click', () => {
      document.getElementById('delete-warranty-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-delete-warranty').addEventListener('click', () => {
      document.getElementById('delete-warranty-modal').classList.add('hidden');
    });
    
    // Warranty search
    document.getElementById('warranty-search').addEventListener('input', debounce(function() {
      const searchTerm = this.value.trim();
      const limit = document.getElementById('warranties-per-page').value;
      loadWarranties(1, limit, searchTerm);
    }, 500));
    
    // Warranties per page
    document.getElementById('warranties-per-page').addEventListener('change', function() {
      const limit = this.value;
      const searchTerm = document.getElementById('warranty-search').value.trim();
      loadWarranties(1, limit, searchTerm);
    });
    
    // Pagination buttons
    document.getElementById('warranties-prev-page').addEventListener('click', () => {
      const currentPage = parseInt(document.getElementById('warranties-prev-page').dataset.page || 1);
      const limit = document.getElementById('warranties-per-page').value;
      const searchTerm = document.getElementById('warranty-search').value.trim();
      loadWarranties(currentPage - 1, limit, searchTerm);
    });
    
    document.getElementById('warranties-next-page').addEventListener('click', () => {
      const currentPage = parseInt(document.getElementById('warranties-next-page').dataset.page || 1);
      const limit = document.getElementById('warranties-per-page').value;
      const searchTerm = document.getElementById('warranty-search').value.trim();
      loadWarranties(currentPage + 1, limit, searchTerm);
    });
    
    // Warranty form submit
    document.getElementById('warranty-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const warrantyId = document.getElementById('warranty-id').value;
      const formData = new FormData(e.target);
      
      const warrantyData = {
        warrantyNumber: formData.get('warrantyNumber'),
        productId: formData.get('productId'),
        customerId: formData.get('customerId'),
        saleId: formData.get('saleId') || null,
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        status: formData.get('status'),
        notes: formData.get('notes')
      };
      
      try {
        if (warrantyId) {
          // Update existing warranty
          await API.warranties.update(warrantyId, warrantyData);
          alert('อัปเดตข้อมูลการรับประกันเรียบร้อยแล้ว');
        } else {
          // Create new warranty
          await API.warranties.create(warrantyData);
          alert('เพิ่มการรับประกันเรียบร้อยแล้ว');
        }
        
        document.getElementById('warranty-modal').classList.add('hidden');
        
        // Reload warranties
        const limit = document.getElementById('warranties-per-page').value;
        const searchTerm = document.getElementById('warranty-search').value.trim();
        loadWarranties(1, limit, searchTerm);
        
      } catch (error) {
        console.error('Error saving warranty:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
      }
    });
    
    // Edit warranty buttons
    document.addEventListener('click', async (e) => {
      if (e.target.closest('.edit-warranty')) {
        const warrantyId = e.target.closest('.edit-warranty').dataset.id;
        
        try {
          const warranty = await API.warranties.getById(warrantyId);
          
          document.getElementById('warranty-modal-title').textContent = 'แก้ไขการรับประกัน';
          document.getElementById('warranty-id').value = warranty.id;
          document.getElementById('warranty-number').value = warranty.warrantyNumber;
          
          // Load dropdowns first
          await Promise.all([
            loadProductsForWarranty(),
            loadCustomersForWarranty(),
            loadSalesForWarranty()
          ]);
          
          // Then set selected values
          document.getElementById('warranty-product').value = warranty.productId;
          document.getElementById('warranty-customer').value = warranty.customerId;
          document.getElementById('warranty-sale').value = warranty.saleId || '';
          document.getElementById('warranty-start-date').value = warranty.startDate.split('T')[0];
          document.getElementById('warranty-end-date').value = warranty.endDate.split('T')[0];
          document.getElementById('warranty-status').value = warranty.status;
          document.getElementById('warranty-notes').value = warranty.notes || '';
          
          document.getElementById('warranty-modal').classList.remove('hidden');
          
        } catch (error) {
          console.error('Error loading warranty details:', error);
          alert('เกิดข้อผิดพลาดในการโหลดข้อมูลการรับประกัน: ' + error.message);
        }
      }
    });
    
    // Delete warranty buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.delete-warranty')) {
        const warrantyId = e.target.closest('.delete-warranty').dataset.id;
        
        document.getElementById('confirm-delete-warranty').dataset.id = warrantyId;
        document.getElementById('delete-warranty-modal').classList.remove('hidden');
      }
    });
    
    // Confirm delete warranty
    document.getElementById('confirm-delete-warranty').addEventListener('click', async () => {
      const warrantyId = document.getElementById('confirm-delete-warranty').dataset.id;
      
      try {
        await API.warranties.delete(warrantyId);
        
        document.getElementById('delete-warranty-modal').classList.add('hidden');
        
        // Reload warranties
        const limit = document.getElementById('warranties-per-page').value;
        const searchTerm = document.getElementById('warranty-search').value.trim();
        loadWarranties(1, limit, searchTerm);
        
        alert('ลบการรับประกันเรียบร้อยแล้ว');
        
      } catch (error) {
        console.error('Error deleting warranty:', error);
        alert('เกิดข้อผิดพลาดในการลบการรับประกัน: ' + error.message);
      }
    });
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
