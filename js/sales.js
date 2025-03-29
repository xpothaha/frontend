// Sales related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderSales available globally
  window.renderSales = renderSales;
  
  // Render sales page
  function renderSales() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">จัดการการขาย</h1>
        <button id="new-sale-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <i class="fas fa-plus mr-2"></i>สร้างการขายใหม่
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4 border-b">
          <div class="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
            <div class="flex items-center">
              <span class="mr-2">แสดง</span>
              <select id="sales-per-page" class="border rounded px-2 py-1">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span class="ml-2">รายการ</span>
            </div>
            <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div class="flex items-center">
                <span class="mr-2">จาก</span>
                <input type="date" id="sales-start-date" class="border rounded px-2 py-1">
              </div>
              <div class="flex items-center">
                <span class="mr-2">ถึง</span>
                <input type="date" id="sales-end-date" class="border rounded px-2 py-1">
              </div>
              <div class="relative">
                <input type="text" id="sales-search" placeholder="ค้นหาการขาย..." class="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div class="absolute left-3 top-2.5 text-gray-400">
                  <i class="fas fa-search"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนรายการ</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200" id="sales-table-body">
              <tr>
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">กำลังโหลดข้อมูล...</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="px-4 py-3 border-t flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-gray-500 mb-2 md:mb-0">
            แสดง <span id="sales-showing-start">0</span> ถึง <span id="sales-showing-end">0</span> จาก <span id="sales-total">0</span> รายการ
          </div>
          <div class="flex space-x-1">
            <button id="sales-prev-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div id="sales-pagination" class="flex space-x-1">
              <!-- Pagination buttons will be inserted here -->
            </div>
            <button id="sales-next-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    `);
    
    // Set default dates (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    document.getElementById('sales-start-date').valueAsDate = firstDay;
    document.getElementById('sales-end-date').valueAsDate = lastDay;
    
    // Load sales data
    loadSales();
    
    // Setup event listeners
    setupSalesEventListeners();
  }
  
  // Load sales from API
  async function loadSales(page = 1, limit = 10, search = '') {
    try {
      const startDate = document.getElementById('sales-start-date').value;
      const endDate = document.getElementById('sales-end-date').value;
      
      const salesData = await API.sales.getAll(page, limit, search, startDate, endDate);
      
      const tableBody = document.getElementById('sales-table-body');
      
      if (salesData.sales.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">ไม่พบข้อมูลการขาย</td>
          </tr>
        `;
      } else {
        tableBody.innerHTML = salesData.sales.map(sale => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(sale.date).toLocaleDateString('th-TH')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.customer ? sale.customer.name : 'ลูกค้าทั่วไป'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.items.length}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">฿${sale.total.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                ${sale.status === 'completed' ? 'เสร็จสิ้น' : 'รอดำเนินการ'}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-green-600 hover:text-green-900 mr-3 view-sale" data-id="${sale.id}">
                <i class="fas fa-eye"></i>
              </button>
              <button class="text-blue-600 hover:text-blue-900 mr-3 print-receipt" data-id="${sale.id}">
                <i class="fas fa-print"></i>
              </button>
              <button class="text-red-600 hover:text-red-900 delete-sale" data-id="${sale.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        `).join('');
      }
      
      // Update pagination
      updateSalesPagination(salesData.pagination);
      
    } catch (error) {
      console.error('Error loading sales:', error);
      document.getElementById('sales-table-body').innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-4 text-center text-sm text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</td>
        </tr>
      `;
    }
  }
  
  // Update sales pagination
  function updateSalesPagination(pagination) {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
    
    // Update showing text
    document.getElementById('sales-showing-start').textContent = (currentPage - 1) * itemsPerPage + 1;
    document.getElementById('sales-showing-end').textContent = Math.min(currentPage * itemsPerPage, totalItems);
    document.getElementById('sales-total').textContent = totalItems;
    
    // Update pagination buttons
    const paginationContainer = document.getElementById('sales-pagination');
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
      pageButton.addEventListener('click', () => loadSales(i, parseInt(document.getElementById('sales-per-page').value)));
      paginationContainer.appendChild(pageButton);
    }
    
    // Update prev/next buttons
    document.getElementById('sales-prev-page').disabled = currentPage === 1;
    document.getElementById('sales-next-page').disabled = currentPage === totalPages;
    
    document.getElementById('sales-prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        loadSales(currentPage - 1, parseInt(document.getElementById('sales-per-page').value));
      }
    });
    
    document.getElementById('sales-next-page').addEventListener('click', () => {
      if (currentPage < totalPages) {
        loadSales(currentPage + 1, parseInt(document.getElementById('sales-per-page').value));
      }
    });
  }
  
  // Setup event listeners for sales page
  function setupSalesEventListeners() {
    // New sale button
    document.getElementById('new-sale-btn').addEventListener('click', () => {
      window.location.href = '/pos';
    });
    
    // Sales per page change
    document.getElementById('sales-per-page').addEventListener('change', (e) => {
      const limit = parseInt(e.target.value);
      loadSales(1, limit);
    });
    
    // Date filters change
    document.getElementById('sales-start-date').addEventListener('change', () => {
      loadSales(1, parseInt(document.getElementById('sales-per-page').value));
    });
    
    document.getElementById('sales-end-date').addEventListener('change', () => {
      loadSales(1, parseInt(document.getElementById('sales-per-page').value));
    });
    
    // Sales search
    const searchInput = document.getElementById('sales-search');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.trim();
        loadSales(1, parseInt(document.getElementById('sales-per-page').value), searchTerm);
      }, 500);
    });
    
    // Sale action buttons
    document.addEventListener('click', async (e) => {
      // View sale
      if (e.target.closest('.view-sale')) {
        const saleId = e.target.closest('.view-sale').getAttribute('data-id');
        
        try {
          const sale = await API.sales.getById(saleId);
          
          // Implement view sale modal or redirect to sale details page
          alert(`ดูรายละเอียดการขาย #${saleId}`);
          console.log(sale);
          
        } catch (error) {
          console.error('Error loading sale details:', error);
          alert('เกิดข้อผิดพลาดในการโหลดข้อมูลการขาย: ' + error.message);
        }
      }
      
      // Print receipt
      if (e.target.closest('.print-receipt')) {
        const saleId = e.target.closest('.print-receipt').getAttribute('data-id');
        
        try {
          const receipt = await API.sales.getReceipt(saleId);
          
          // Implement receipt printing functionality
          const receiptWindow = window.open('', '_blank');
          receiptWindow.document.write(`
            <html>
              <head>
                <title>ใบเสร็จรับเงิน #${saleId}</title>
                <style>
                  body { font-family: 'Sarabun', sans-serif; margin: 0; padding: 20px; }
                  .receipt { max-width: 80mm; margin: 0 auto; }
                  .header { text-align: center; margin-bottom: 20px; }
                  .store-name { font-size: 18px; font-weight: bold; }
                  .store-info { font-size: 12px; }
                  .receipt-title { font-size: 14px; font-weight: bold; text-align: center; margin: 10px 0; }
                  .receipt-info { font-size: 12px; margin-bottom: 10px; }
                  .items-table { width: 100%; border-collapse: collapse; font-size: 12px; }
                  .items-table th, .items-table td { text-align: left; padding: 5px 0; }
                  .items-table th:last-child, .items-table td:last-child { text-align: right; }
                  .total-section { margin-top: 10px; font-size: 12px; }
                  .total-line { display: flex; justify-content: space-between; }
                  .total { font-weight: bold; }
                  .footer { margin-top: 20px; text-align: center; font-size: 12px; }
                  @media print {
                    @page { margin: 0; }
                    body { margin: 10mm; }
                  }
                </style>
              </head>
              <body>
                <div class="receipt">
                  <div class="header">
                    <div class="store-name">${receipt.storeName}</div>
                    <div class="store-info">${receipt.storeAddress}</div>
                    <div class="store-info">โทร: ${receipt.storePhone}</div>
                  </div>
                  
                  <div class="receipt-title">ใบเสร็จรับเงิน</div>
                  
                  <div class="receipt-info">
                    <div>เลขที่: ${receipt.id}</div>
                    <div>วันที่: ${new Date(receipt.date).toLocaleDateString('th-TH')}</div>
                    <div>เวลา: ${new Date(receipt.date).toLocaleTimeString('th-TH')}</div>
                    <div>ลูกค้า: ${receipt.customerName || 'ลูกค้าทั่วไป'}</div>
                    <div>พนักงาน: ${receipt.cashierName}</div>
                  </div>
                  
                  <table class="items-table">
                    <thead>
                      <tr>
                        <th>รายการ</th>
                        <th>จำนวน</th>
                        <th>ราคา</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${receipt.items.map(item => `
                        <tr>
                          <td>${item.name}</td>
                          <td>${item.quantity}</td>
                          <td>${item.price.toFixed(2)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  
                  <div class="total-section">
                    <div class="total-line">
                      <span>รวม:</span>
                      <span>${receipt.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-line">
                      <span>ส่วนลด:</span>
                      <span>${receipt.discount.toFixed(2)}</span>
                    </div>
                    <div class="total-line total">
                      <span>ยอดรวมสุทธิ:</span>
                      <span>${receipt.total.toFixed(2)}</span>
                    </div>
                    <div class="total-line">
                      <span>รับเงิน:</span>
                      <span>${receipt.amountPaid.toFixed(2)}</span>
                    </div>
                    <div class="total-line">
                      <span>เงินทอน:</span>
                      <span>${receipt.change.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div class="footer">
                    <p>ขอบคุณที่ใช้บริการ</p>
                  </div>
                </div>
                <script>
                  window.onload = function() {
                    window.print();
                    setTimeout(function() {
                      window.close();
                    }, 500);
                  };
                </script>
              </body>
            </html>
          `);
          receiptWindow.document.close();
          
        } catch (error) {
          console.error('Error generating receipt:', error);
          alert('เกิดข้อผิดพลาดในการพิมพ์ใบเสร็จ: ' + error.message);
        }
      }
      
      // Delete sale
      if (e.target.closest('.delete-sale')) {
        const saleId = e.target.closest('.delete-sale').getAttribute('data-id');
        
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการขายนี้?')) {
          try {
            await API.sales.delete(saleId);
            loadSales();
          } catch (error) {
            console.error('Error deleting sale:', error);
            alert('เกิดข้อผิดพลาดในการลบรายการขาย: ' + error.message);
          }
        }
      }
    });
  }
});
