// Customers related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderCustomers available globally
  window.renderCustomers = renderCustomers;
  
  // Render customers page
  function renderCustomers() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">จัดการลูกค้า</h1>
        <button id="add-customer-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <i class="fas fa-plus mr-2"></i>เพิ่มลูกค้า
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4 border-b">
          <div class="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
            <div class="flex items-center">
              <span class="mr-2">แสดง</span>
              <select id="customers-per-page" class="border rounded px-2 py-1">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span class="ml-2">รายการ</span>
            </div>
            <div class="relative">
              <input type="text" id="customer-search" placeholder="ค้นหาลูกค้า..." class="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทรศัพท์</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดซื้อทั้งหมด</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200" id="customers-table-body">
              <tr>
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">กำลังโหลดข้อมูล...</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="px-4 py-3 border-t flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-gray-500 mb-2 md:mb-0">
            แสดง <span id="customers-showing-start">0</span> ถึง <span id="customers-showing-end">0</span> จาก <span id="customers-total">0</span> รายการ
          </div>
          <div class="flex space-x-1">
            <button id="customers-prev-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div id="customers-pagination" class="flex space-x-1">
              <!-- Pagination buttons will be inserted here -->
            </div>
            <button id="customers-next-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add Customer Modal -->
      <div id="add-customer-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">เพิ่มลูกค้าใหม่</h3>
            <button id="close-add-customer-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="add-customer-form" class="px-6 py-4">
            <div class="mb-4">
              <label for="customer-name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
              <input type="text" id="customer-name" name="name" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="customer-phone" class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
              <input type="tel" id="customer-phone" name="phone" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="customer-email" class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input type="email" id="customer-email" name="email" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="customer-address" class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
              <textarea id="customer-address" name="address" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-add-customer" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Edit Customer Modal -->
      <div id="edit-customer-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">แก้ไขข้อมูลลูกค้า</h3>
            <button id="close-edit-customer-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="edit-customer-form" class="px-6 py-4">
            <input type="hidden" id="edit-customer-id">
            <div class="mb-4">
              <label for="edit-customer-name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
              <input type="text" id="edit-customer-name" name="name" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="edit-customer-phone" class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
              <input type="tel" id="edit-customer-phone" name="phone" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="edit-customer-email" class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input type="email" id="edit-customer-email" name="email" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="edit-customer-address" class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
              <textarea id="edit-customer-address" name="address" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-edit-customer" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- View Customer Modal -->
      <div id="view-customer-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">ข้อมูลลูกค้า</h3>
            <button id="close-view-customer-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-sm text-gray-500">ชื่อ-นามสกุล</p>
                <p class="text-lg font-medium" id="view-customer-name"></p>
              </div>
              <div>
                <p class="text-sm text-gray-500">เบอร์โทรศัพท์</p>
                <p class="text-lg font-medium" id="view-customer-phone"></p>
              </div>
              <div>
                <p class="text-sm text-gray-500">อีเมล</p>
                <p class="text-lg font-medium" id="view-customer-email"></p>
              </div>
              <div>
                <p class="text-sm text-gray-500">ที่อยู่</p>
                <p class="text-lg font-medium" id="view-customer-address"></p>
              </div>
            </div>
            
            <h4 class="text-lg font-semibold mb-4">ประวัติการซื้อ</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนรายการ</th>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200" id="customer-sales-history">
                  <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">กำลังโหลดข้อมูล...</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="mt-6 flex justify-end">
              <button id="close-view-customer-btn" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    `);
    
    // Load customers data
    loadCustomers();
    
    // Setup event listeners
    setupCustomersEventListeners();
  }
  
  // Load customers from API
  async function loadCustomers(page = 1, limit = 10, search = '') {
    try {
      const customersData = await API.customers.getAll(page, limit, search);
      
      const tableBody = document.getElementById('customers-table-body');
      
      if (customersData.customers.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">ไม่พบข้อมูลลูกค้า</td>
          </tr>
        `;
      } else {
        tableBody.innerHTML = customersData.customers.map(customer => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customer.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customer.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customer.phone || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customer.email || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">฿${customer.totalPurchases ? customer.totalPurchases.toFixed(2) : '0.00'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-green-600 hover:text-green-900 mr-3 view-customer" data-id="${customer.id}">
                <i class="fas fa-eye"></i>
              </button>
              <button class="text-blue-600 hover:text-blue-900 mr-3 edit-customer" data-id="${customer.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="text-red-600 hover:text-red-900 delete-customer" data-id="${customer.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        `).join('');
      }
      
      // Update pagination
      updateCustomersPagination(customersData.pagination);
      
    } catch (error) {
      console.error('Error loading customers:', error);
      document.getElementById('customers-table-body').innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-4 text-center text-sm text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</td>
        </tr>
      `;
    }
  }
  
  // Update customers pagination
  function updateCustomersPagination(pagination) {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
    
    // Update showing text
    document.getElementById('customers-showing-start').textContent = (currentPage - 1) * itemsPerPage + 1;
    document.getElementById('customers-showing-end').textContent = Math.min(currentPage * itemsPerPage, totalItems);
    document.getElementById('customers-total').textContent = totalItems;
    
    // Update pagination buttons
    const paginationContainer = document.getElementById('customers-pagination');
    paginationContainer.innerHTML = '';
    
    // Calculate start and end page
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.className = `px-3 py-1 border rounded-md ${i === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`;
      pageButton.textContent = i;
      pageButton.addEventListener('click', () => loadCustomers(i, itemsPerPage));
      paginationContainer.appendChild(pageButton);
    }
    
    // Update prev/next buttons
    document.getElementById('customers-prev-page').disabled = currentPage === 1;
    document.getElementById('customers-next-page').disabled = currentPage === totalPages;
    
    document.getElementById('customers-prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        loadCustomers(currentPage - 1, itemsPerPage);
      }
    });
    
    document.getElementById('customers-next-page').addEventListener('click', () => {
      if (currentPage < totalPages) {
        loadCustomers(currentPage + 1, itemsPerPage);
      }
    });
  }
  
  // Load customer sales history
  async function loadCustomerSalesHistory(customerId) {
    try {
      const salesHistory = await API.customers.getSalesHistory(customerId);
      
      const historyTableBody = document.getElementById('customer-sales-history');
      
      if (salesHistory.length === 0) {
        historyTableBody.innerHTML = `
          <tr>
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">ไม่พบประวัติการซื้อ</td>
          </tr>
        `;
      } else {
        historyTableBody.innerHTML = salesHistory.map(sale => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(sale.date).toLocaleDateString('th-TH')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.itemCount}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">฿${sale.total.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                ${sale.status === 'completed' ? 'เสร็จสิ้น' : 'รอดำเนินการ'}
              </span>
            </td>
          </tr>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading customer sales history:', error);
      document.getElementById('customer-sales-history').innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-4 text-center text-sm text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</td>
        </tr>
      `;
    }
  }
  
  // Setup event listeners for customers page
  function setupCustomersEventListeners() {
    // Add customer button
    document.getElementById('add-customer-btn').addEventListener('click', () => {
      document.getElementById('add-customer-modal').classList.remove('hidden');
    });
    
    // Close add customer modal
    document.getElementById('close-add-customer-modal').addEventListener('click', () => {
      document.getElementById('add-customer-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-add-customer').addEventListener('click', () => {
      document.getElementById('add-customer-modal').classList.add('hidden');
    });
    
    // Close edit customer modal
    document.getElementById('close-edit-customer-modal').addEventListener('click', () => {
      document.getElementById('edit-customer-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-edit-customer').addEventListener('click', () => {
      document.getElementById('edit-customer-modal').classList.add('hidden');
    });
    
    // Close view customer modal
    document.getElementById('close-view-customer-modal').addEventListener('click', () => {
      document.getElementById('view-customer-modal').classList.add('hidden');
    });
    
    document.getElementById('close-view-customer-btn').addEventListener('click', () => {
      document.getElementById('view-customer-modal').classList.add('hidden');
    });
    
    // Add customer form submit
    document.getElementById('add-customer-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const customerData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address')
      };
      
      try {
        await API.customers.create(customerData);
        document.getElementById('add-customer-modal').classList.add('hidden');
        document.getElementById('add-customer-form').reset();
        loadCustomers();
      } catch (error) {
        console.error('Error adding customer:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มลูกค้า: ' + error.message);
      }
    });
    
    // Edit customer form submit
    document.getElementById('edit-customer-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const customerId = document.getElementById('edit-customer-id').value;
      const customerData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address')
      };
      
      try {
        await API.customers.update(customerId, customerData);
        document.getElementById('edit-customer-modal').classList.add('hidden');
        loadCustomers();
      } catch (error) {
        console.error('Error updating customer:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูลลูกค้า: ' + error.message);
      }
    });
    
    // Customer action buttons
    document.addEventListener('click', async (e) => {
      // View customer
      if (e.target.closest('.view-customer')) {
        const customerId = e.target.closest('.view-customer').getAttribute('data-id');
        
        try {
          const customer = await API.customers.getById(customerId);
          
          document.getElementById('view-customer-name').textContent = customer.name;
          document.getElementById('view-customer-phone').textContent = customer.phone || '-';
          document.getElementById('view-customer-email').textContent = customer.email || '-';
          document.getElementById('view-customer-address').textContent = customer.address || '-';
          
          document.getElementById('view-customer-modal').classList.remove('hidden');
          
          // Load customer sales history
          loadCustomerSalesHistory(customerId);
          
        } catch (error) {
          console.error('Error loading customer details:', error);
          alert('เกิดข้อผิดพลาดในการโหลดข้อมูลลูกค้า: ' + error.message);
        }
      }
      
      // Edit customer
      if (e.target.closest('.edit-customer')) {
        const customerId = e.target.closest('.edit-customer').getAttribute('data-id');
        
        try {
          const customer = await API.customers.getById(customerId);
          
          document.getElementById('edit-customer-id').value = customer.id;
          document.getElementById('edit-customer-name').value = customer.name;
          document.getElementById('edit-customer-phone').value = customer.phone || '';
          document.getElementById('edit-customer-email').value = customer.email || '';
          document.getElementById('edit-customer-address').value = customer.address || '';
          
          document.getElementById('edit-customer-modal').classList.remove('hidden');
        } catch (error) {
          console.error('Error loading customer details:', error);
          alert('เกิดข้อผิดพลาดในการโหลดข้อมูลลูกค้า: ' + error.message);
        }
      }
      
      // Delete customer
      if (e.target.closest('.delete-customer')) {
        const customerId = e.target.closest('.delete-customer').getAttribute('data-id');
        
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบลูกค้านี้?')) {
          try {
            await API.customers.delete(customerId);
            loadCustomers();
          } catch (error) {
            console.error('Error deleting customer:', error);
            alert('เกิดข้อผิดพลาดในการลบลูกค้า: ' + error.message);
          }
        }
      }
    });
    
    // Customers per page change
    document.getElementById('customers-per-page').addEventListener('change', (e) => {
      const limit = parseInt(e.target.value);
      loadCustomers(1, limit);
    });
    
    // Customer search
    const searchInput = document.getElementById('customer-search');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.trim();
        loadCustomers(1, parseInt(document.getElementById('customers-per-page').value), searchTerm);
      }, 500);
    });
  }
});
