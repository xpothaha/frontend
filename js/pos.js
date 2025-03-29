// Point of Sale (POS) related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderPOS available globally
  window.renderPOS = renderPOS;
  
  // Global variables for POS
  let cartItems = [];
  let selectedCustomer = null;
  let products = [];
  let categories = [];
  
  // Render POS page
  function renderPOS() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex flex-col h-[calc(100vh-64px)]">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">ขายสินค้า</h1>
          <div class="flex space-x-2">
            <button id="new-sale-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <i class="fas fa-plus mr-2"></i>ขายใหม่
            </button>
            <button id="view-sales-btn" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              <i class="fas fa-list mr-2"></i>ดูรายการขาย
            </button>
          </div>
        </div>
        
        <div class="flex flex-1 space-x-4 overflow-hidden">
          <!-- Products Section -->
          <div class="w-2/3 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b">
              <div class="flex justify-between mb-4">
                <div class="relative w-64">
                  <input type="text" id="product-search" placeholder="ค้นหาสินค้า..." class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <div class="absolute left-3 top-2.5 text-gray-400">
                    <i class="fas fa-search"></i>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">หมวดหมู่:</span>
                  <select id="category-filter" class="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">ทั้งหมด</option>
                  </select>
                </div>
              </div>
              
              <div id="categories-tabs" class="flex space-x-2 overflow-x-auto pb-2">
                <!-- Categories will be loaded here -->
              </div>
            </div>
            
            <div class="flex-1 p-4 overflow-y-auto">
              <div id="products-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <!-- Products will be loaded here -->
                <div class="col-span-full text-center text-gray-500 py-8">
                  <p>กำลังโหลดสินค้า...</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Cart Section -->
          <div class="w-1/3 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">รายการสินค้า</h2>
                <button id="clear-cart-btn" class="px-3 py-1 text-sm border text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  <i class="fas fa-trash-alt mr-1"></i>ล้างรายการ
                </button>
              </div>
              
              <div class="flex items-center space-x-2 mb-4">
                <span class="text-sm text-gray-500">ลูกค้า:</span>
                <select id="customer-select" class="flex-1 border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">ลูกค้าทั่วไป</option>
                </select>
                <button id="add-customer-btn" class="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                  <i class="fas fa-user-plus"></i>
                </button>
              </div>
            </div>
            
            <div class="flex-1 p-4 overflow-y-auto">
              <div id="cart-items" class="space-y-4">
                <!-- Cart items will be loaded here -->
                <div id="empty-cart-message" class="text-center text-gray-500 py-8">
                  <p>ไม่มีสินค้าในรายการ</p>
                </div>
              </div>
            </div>
            
            <div class="p-4 border-t bg-gray-50">
              <div class="space-y-2 mb-4">
                <div class="flex justify-between">
                  <span>ยอดรวม:</span>
                  <span id="cart-subtotal">0.00 บาท</span>
                </div>
                <div class="flex justify-between">
                  <span>ส่วนลด:</span>
                  <div class="flex items-center space-x-2">
                    <input type="number" id="discount-amount" min="0" value="0" class="w-20 px-2 py-1 border rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <select id="discount-type" class="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="percentage">%</option>
                      <option value="fixed">บาท</option>
                    </select>
                  </div>
                </div>
                <div class="flex justify-between">
                  <span>ภาษี (7%):</span>
                  <span id="cart-tax">0.00 บาท</span>
                </div>
                <div class="flex justify-between font-semibold text-lg">
                  <span>ยอดสุทธิ:</span>
                  <span id="cart-total">0.00 บาท</span>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-2">
                <button id="payment-cash-btn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  <i class="fas fa-money-bill-wave mr-2"></i>ชำระเงินสด
                </button>
                <button id="payment-card-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <i class="fas fa-credit-card mr-2"></i>ชำระบัตร
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Payment Modal -->
      <div id="payment-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 id="payment-modal-title" class="text-lg font-semibold">ชำระเงิน</h3>
            <button id="close-payment-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="px-6 py-4">
            <div class="mb-6">
              <div class="flex justify-between mb-2">
                <span class="font-semibold">ยอดที่ต้องชำระ:</span>
                <span id="payment-amount" class="font-semibold text-lg">0.00 บาท</span>
              </div>
              
              <div id="cash-payment-section">
                <div class="mb-4">
                  <label for="payment-received" class="block text-sm font-medium text-gray-700 mb-1">รับเงิน <span class="text-red-500">*</span></label>
                  <input type="number" id="payment-received" min="0" step="0.01" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="mb-4">
                  <label for="payment-change" class="block text-sm font-medium text-gray-700 mb-1">เงินทอน</label>
                  <input type="text" id="payment-change" readonly class="w-full px-4 py-2 bg-gray-100 border rounded-md">
                </div>
              </div>
              
              <div id="card-payment-section" class="hidden">
                <div class="mb-4">
                  <label for="payment-card-number" class="block text-sm font-medium text-gray-700 mb-1">หมายเลขบัตร <span class="text-red-500">*</span></label>
                  <input type="text" id="payment-card-number" placeholder="XXXX XXXX XXXX XXXX" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="payment-card-expiry" class="block text-sm font-medium text-gray-700 mb-1">วันหมดอายุ <span class="text-red-500">*</span></label>
                    <input type="text" id="payment-card-expiry" placeholder="MM/YY" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                  
                  <div>
                    <label for="payment-card-cvv" class="block text-sm font-medium text-gray-700 mb-1">CVV <span class="text-red-500">*</span></label>
                    <input type="text" id="payment-card-cvv" placeholder="XXX" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                </div>
                
                <div class="mb-4">
                  <label for="payment-card-name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อบนบัตร <span class="text-red-500">*</span></label>
                  <input type="text" id="payment-card-name" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button id="cancel-payment" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button id="confirm-payment" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                ยืนยันการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Receipt Modal -->
      <div id="receipt-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">ใบเสร็จรับเงิน</h3>
            <button id="close-receipt-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="px-6 py-4">
            <div id="receipt-content" class="mb-6">
              <!-- Receipt content will be loaded here -->
            </div>
            
            <div class="flex justify-end space-x-2">
              <button id="print-receipt" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <i class="fas fa-print mr-2"></i>พิมพ์
              </button>
              <button id="close-receipt" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add Customer Modal -->
      <div id="add-customer-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">เพิ่มลูกค้า</h3>
            <button id="close-add-customer-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="add-customer-form" class="px-6 py-4">
            <div class="mb-4">
              <label for="customer-name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อลูกค้า <span class="text-red-500">*</span></label>
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
    `);
    
    // Load initial data
    loadPOSData();
    
    // Setup event listeners
    setupPOSEventListeners();
  }

  // Load POS data (products, categories, customers)
  async function loadPOSData() {
    try {
      // Load products
      const productsResponse = await API.products.getAll();
      products = productsResponse.data;
      
      // Load categories
      const categoriesResponse = await API.categories.getAll();
      categories = categoriesResponse.data;
      
      // Load customers for dropdown
      const customersResponse = await API.customers.getAll();
      const customers = customersResponse.data;
      
      // Render products grid
      renderProductsGrid(products);
      
      // Render categories tabs
      renderCategoriesTabs(categories);
      
      // Populate customer dropdown
      populateCustomerDropdown(customers);
      
    } catch (error) {
      console.error('Error loading POS data:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + error.message);
    }
  }
  
  // Render products grid
  function renderProductsGrid(productsToRender) {
    const productsGrid = document.getElementById('products-grid');
    
    if (productsToRender.length === 0) {
      productsGrid.innerHTML = `
        <div class="col-span-full text-center text-gray-500 py-8">
          <p>ไม่พบสินค้า</p>
        </div>
      `;
      return;
    }
    
    let html = '';
    
    productsToRender.forEach(product => {
      const outOfStock = product.stock <= 0;
      
      html += `
        <div class="product-card ${outOfStock ? 'opacity-50' : ''}" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-stock="${product.stock}">
          <div class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${outOfStock ? 'cursor-not-allowed' : ''}">
            <div class="h-32 bg-gray-200 flex items-center justify-center">
              ${product.image 
                ? `<img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover">` 
                : `<i class="fas fa-box text-gray-400 text-4xl"></i>`
              }
            </div>
            <div class="p-3">
              <h3 class="text-sm font-medium text-gray-800 truncate" title="${product.name}">${product.name}</h3>
              <div class="flex justify-between items-center mt-2">
                <span class="text-sm font-bold text-blue-600">${formatCurrency(product.price)}</span>
                <span class="text-xs text-gray-500">คงเหลือ: ${product.stock}</span>
              </div>
              ${outOfStock ? '<div class="text-xs text-red-500 mt-1">สินค้าหมด</div>' : ''}
            </div>
          </div>
        </div>
      `;
    });
    
    productsGrid.innerHTML = html;
  }
  
  // Render categories tabs
  function renderCategoriesTabs(categoriesToRender) {
    const categoriesTabs = document.getElementById('categories-tabs');
    const categoryFilter = document.getElementById('category-filter');
    
    // Add "All" tab
    let tabsHtml = `
      <button class="category-tab px-4 py-2 rounded-md bg-blue-600 text-white" data-id="">
        ทั้งหมด
      </button>
    `;
    
    // Add option to category filter dropdown
    let filterOptionsHtml = `<option value="">ทั้งหมด</option>`;
    
    categoriesToRender.forEach(category => {
      tabsHtml += `
        <button class="category-tab px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300" data-id="${category.id}">
          ${category.name}
        </button>
      `;
      
      filterOptionsHtml += `<option value="${category.id}">${category.name}</option>`;
    });
    
    categoriesTabs.innerHTML = tabsHtml;
    categoryFilter.innerHTML = filterOptionsHtml;
  }
  
  // Populate customer dropdown
  function populateCustomerDropdown(customers) {
    const customerSelect = document.getElementById('customer-select');
    
    let html = `<option value="">ลูกค้าทั่วไป</option>`;
    
    customers.forEach(customer => {
      html += `<option value="${customer.id}">${customer.name}</option>`;
    });
    
    customerSelect.innerHTML = html;
  }
  
  // Setup POS event listeners
  function setupPOSEventListeners() {
    // New sale button
    document.getElementById('new-sale-btn').addEventListener('click', () => {
      if (cartItems.length > 0) {
        if (confirm('คุณต้องการเริ่มการขายใหม่หรือไม่? รายการสินค้าในตะกร้าปัจจุบันจะถูกล้าง')) {
          clearCart();
        }
      }
    });
    
    // View sales button
    document.getElementById('view-sales-btn').addEventListener('click', () => {
      window.location.hash = '#/sales';
    });
    
    // Product search
    document.getElementById('product-search').addEventListener('input', debounce(function() {
      const searchTerm = this.value.trim().toLowerCase();
      const categoryId = document.getElementById('category-filter').value;
      
      filterProducts(searchTerm, categoryId);
    }, 300));
    
    // Category filter dropdown
    document.getElementById('category-filter').addEventListener('change', function() {
      const categoryId = this.value;
      const searchTerm = document.getElementById('product-search').value.trim().toLowerCase();
      
      filterProducts(searchTerm, categoryId);
      
      // Update category tabs
      document.querySelectorAll('.category-tab').forEach(tab => {
        if (tab.dataset.id === categoryId) {
          tab.classList.remove('bg-gray-200', 'text-gray-700');
          tab.classList.add('bg-blue-600', 'text-white');
        } else {
          tab.classList.remove('bg-blue-600', 'text-white');
          tab.classList.add('bg-gray-200', 'text-gray-700');
        }
      });
    });
    
    // Category tabs
    document.addEventListener('click', (e) => {
      if (e.target.closest('.category-tab')) {
        const categoryId = e.target.closest('.category-tab').dataset.id;
        
        // Update category filter dropdown
        document.getElementById('category-filter').value = categoryId;
        
        // Update category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
          if (tab.dataset.id === categoryId) {
            tab.classList.remove('bg-gray-200', 'text-gray-700');
            tab.classList.add('bg-blue-600', 'text-white');
          } else {
            tab.classList.remove('bg-blue-600', 'text-white');
            tab.classList.add('bg-gray-200', 'text-gray-700');
          }
        });
        
        // Filter products
        const searchTerm = document.getElementById('product-search').value.trim().toLowerCase();
        filterProducts(searchTerm, categoryId);
      }
    });
    
    // Product cards
    document.addEventListener('click', (e) => {
      const productCard = e.target.closest('.product-card');
      if (productCard) {
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productStock = parseInt(productCard.dataset.stock);
        
        if (productStock <= 0) {
          alert('สินค้าหมด ไม่สามารถเพิ่มในตะกร้าได้');
          return;
        }
        
        addToCart(productId, productName, productPrice, productStock);
      }
    });
    
    // Clear cart button
    document.getElementById('clear-cart-btn').addEventListener('click', () => {
      if (cartItems.length > 0) {
        if (confirm('คุณต้องการล้างรายการสินค้าในตะกร้าทั้งหมดหรือไม่?')) {
          clearCart();
        }
      }
    });
    
    // Customer select
    document.getElementById('customer-select').addEventListener('change', function() {
      const customerId = this.value;
      
      if (customerId) {
        // Find customer in the dropdown options
        const customerOption = Array.from(this.options).find(option => option.value === customerId);
        
        if (customerOption) {
          selectedCustomer = {
            id: customerId,
            name: customerOption.textContent
          };
        }
      } else {
        selectedCustomer = null;
      }
    });
    
    // Add customer button
    document.getElementById('add-customer-btn').addEventListener('click', () => {
      document.getElementById('add-customer-modal').classList.remove('hidden');
    });
    
    // Close add customer modal
    document.getElementById('close-add-customer-modal').addEventListener('click', () => {
      document.getElementById('add-customer-modal').classList.add('hidden');
    });
    
    // Cancel add customer
    document.getElementById('cancel-add-customer').addEventListener('click', () => {
      document.getElementById('add-customer-modal').classList.add('hidden');
    });
    
    // Add customer form
    document.getElementById('add-customer-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('customer-name').value.trim();
      const phone = document.getElementById('customer-phone').value.trim();
      const email = document.getElementById('customer-email').value.trim();
      const address = document.getElementById('customer-address').value.trim();
      
      try {
        const newCustomer = await API.customers.create({
          name,
          phone,
          email,
          address
        });
        
        // Add new customer to dropdown
        const customerSelect = document.getElementById('customer-select');
        const option = document.createElement('option');
        option.value = newCustomer.id;
        option.textContent = newCustomer.name;
        customerSelect.appendChild(option);
        
        // Select the new customer
        customerSelect.value = newCustomer.id;
        selectedCustomer = {
          id: newCustomer.id,
          name: newCustomer.name
        };
        
        // Close modal
        document.getElementById('add-customer-modal').classList.add('hidden');
        
        // Reset form
        document.getElementById('add-customer-form').reset();
        
        alert('เพิ่มลูกค้าเรียบร้อยแล้ว');
        
      } catch (error) {
        console.error('Error adding customer:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มลูกค้า: ' + error.message);
      }
    });
    
    // Discount inputs
    document.getElementById('discount-amount').addEventListener('input', updateCartTotals);
    document.getElementById('discount-type').addEventListener('change', updateCartTotals);
    
    // Payment buttons
    document.getElementById('payment-cash-btn').addEventListener('click', () => {
      if (cartItems.length === 0) {
        alert('กรุณาเพิ่มสินค้าในตะกร้าก่อนทำการชำระเงิน');
        return;
      }
      
      // Show payment modal
      document.getElementById('payment-modal-title').textContent = 'ชำระเงินสด';
      document.getElementById('cash-payment-section').classList.remove('hidden');
      document.getElementById('card-payment-section').classList.add('hidden');
      document.getElementById('payment-modal').classList.remove('hidden');
      
      // Set payment amount
      const total = calculateTotal();
      document.getElementById('payment-amount').textContent = formatCurrency(total);
      
      // Focus on payment received input
      document.getElementById('payment-received').value = '';
      document.getElementById('payment-change').value = '';
      document.getElementById('payment-received').focus();
    });
    
    document.getElementById('payment-card-btn').addEventListener('click', () => {
      if (cartItems.length === 0) {
        alert('กรุณาเพิ่มสินค้าในตะกร้าก่อนทำการชำระเงิน');
        return;
      }
      
      // Show payment modal
      document.getElementById('payment-modal-title').textContent = 'ชำระบัตร';
      document.getElementById('cash-payment-section').classList.add('hidden');
      document.getElementById('card-payment-section').classList.remove('hidden');
      document.getElementById('payment-modal').classList.remove('hidden');
      
      // Set payment amount
      const total = calculateTotal();
      document.getElementById('payment-amount').textContent = formatCurrency(total);
      
      // Reset card form
      document.getElementById('payment-card-number').value = '';
      document.getElementById('payment-card-expiry').value = '';
      document.getElementById('payment-card-cvv').value = '';
      document.getElementById('payment-card-name').value = '';
      
      // Focus on card number input
      document.getElementById('payment-card-number').focus();
    });
    
    // Payment received input
    document.getElementById('payment-received').addEventListener('input', function() {
      const received = parseFloat(this.value) || 0;
      const total = calculateTotal();
      const change = received - total;
      
      document.getElementById('payment-change').value = change >= 0 ? formatCurrency(change) : '';
    });
    
    // Close payment modal
    document.getElementById('close-payment-modal').addEventListener('click', () => {
      document.getElementById('payment-modal').classList.add('hidden');
    });
    
    // Cancel payment
    document.getElementById('cancel-payment').addEventListener('click', () => {
      document.getElementById('payment-modal').classList.add('hidden');
    });
    
    // Confirm payment
    document.getElementById('confirm-payment').addEventListener('click', async () => {
      const paymentType = document.getElementById('cash-payment-section').classList.contains('hidden') ? 'card' : 'cash';
      
      if (paymentType === 'cash') {
        const received = parseFloat(document.getElementById('payment-received').value) || 0;
        const total = calculateTotal();
        
        if (received < total) {
          alert('จำนวนเงินที่รับไม่เพียงพอ');
          return;
        }
      }
      
      try {
        // Create sale
        const sale = await createSale(paymentType);
        
        // Close payment modal
        document.getElementById('payment-modal').classList.add('hidden');
        
        // Show receipt
        showReceipt(sale);
        
        // Clear cart
        clearCart();
        
      } catch (error) {
        console.error('Error creating sale:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกการขาย: ' + error.message);
      }
    });
    
    // Close receipt modal
    document.getElementById('close-receipt-modal').addEventListener('click', () => {
      document.getElementById('receipt-modal').classList.add('hidden');
    });
    
    // Close receipt button
    document.getElementById('close-receipt').addEventListener('click', () => {
      document.getElementById('receipt-modal').classList.add('hidden');
    });
    
    // Print receipt
    document.getElementById('print-receipt').addEventListener('click', () => {
      const receiptContent = document.getElementById('receipt-content').innerHTML;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>ใบเสร็จรับเงิน</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              .receipt {
                max-width: 300px;
                margin: 0 auto;
              }
              .text-center {
                text-align: center;
              }
              .mb-2 {
                margin-bottom: 10px;
              }
              .border-b {
                border-bottom: 1px dashed #ccc;
                padding-bottom: 10px;
                margin-bottom: 10px;
              }
              .flex {
                display: flex;
              }
              .justify-between {
                justify-content: space-between;
              }
              .font-bold {
                font-weight: bold;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
              }
              th, td {
                text-align: left;
                padding: 5px 0;
              }
              th:last-child, td:last-child {
                text-align: right;
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${receiptContent}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.setTimeout(function() {
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  }
  
  // Filter products by search term and category
  function filterProducts(searchTerm, categoryId) {
    let filteredProducts = products;
    
    // Filter by category
    if (categoryId) {
      filteredProducts = filteredProducts.filter(product => product.categoryId === categoryId);
    }
    
    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.barcode?.toLowerCase().includes(searchTerm)
      );
    }
    
    renderProductsGrid(filteredProducts);
  }
  
  // Add product to cart
  function addToCart(productId, productName, productPrice, productStock) {
    // Check if product already in cart
    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      // Check if we can add more
      if (existingItem.quantity >= productStock) {
        alert('ไม่สามารถเพิ่มสินค้าได้ เนื่องจากสินค้าในสต็อกไม่เพียงพอ');
        return;
      }
      
      // Increment quantity
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cartItems.push({
        productId,
        name: productName,
        price: productPrice,
        quantity: 1
      });
    }
    
    // Update cart UI
    renderCart();
    
    // Update totals
    updateCartTotals();
  }
  
  // Render cart items
  function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    if (cartItems.length === 0) {
      emptyCartMessage.classList.remove('hidden');
      cartItemsContainer.innerHTML = '';
      return;
    }
    
    emptyCartMessage.classList.add('hidden');
    
    let html = '';
    
    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      
      html += `
        <div class="bg-gray-50 rounded-md p-3">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h4 class="font-medium">${item.name}</h4>
              <div class="text-sm text-gray-500">${formatCurrency(item.price)} × ${item.quantity}</div>
            </div>
            <div class="font-semibold">${formatCurrency(itemTotal)}</div>
          </div>
          <div class="flex justify-between items-center mt-2">
            <div class="flex items-center space-x-2">
              <button class="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 decrease-quantity" data-index="${index}">
                <i class="fas fa-minus"></i>
              </button>
              <span class="text-sm">${item.quantity}</span>
              <button class="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 increase-quantity" data-index="${index}">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="px-2 py-1 text-sm text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 remove-item" data-index="${index}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `;
    });
    
    cartItemsContainer.innerHTML = html;
    
    // Add event listeners for cart item buttons
    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index);
        decreaseQuantity(index);
      });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index);
        increaseQuantity(index);
      });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index);
        removeCartItem(index);
      });
    });
  }
  
  // Decrease item quantity
  function decreaseQuantity(index) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
    } else {
      removeCartItem(index);
      return;
    }
    
    renderCart();
    updateCartTotals();
  }
  
  // Increase item quantity
  function increaseQuantity(index) {
    const item = cartItems[index];
    
    // Find product to check stock
    const product = products.find(p => p.id === item.productId);
    
    if (product && item.quantity >= product.stock) {
      alert('ไม่สามารถเพิ่มสินค้าได้ เนื่องจากสินค้าในสต็อกไม่เพียงพอ');
      return;
    }
    
    cartItems[index].quantity += 1;
    
    renderCart();
    updateCartTotals();
  }
  
  // Remove item from cart
  function removeCartItem(index) {
    cartItems.splice(index, 1);
    
    renderCart();
    updateCartTotals();
  }
  
  // Clear cart
  function clearCart() {
    cartItems = [];
    
    renderCart();
    updateCartTotals();
    
    // Reset discount
    document.getElementById('discount-amount').value = 0;
    
    // Reset customer
    document.getElementById('customer-select').value = '';
    selectedCustomer = null;
  }
  
  // Calculate subtotal
  function calculateSubtotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  // Calculate discount
  function calculateDiscount() {
    const subtotal = calculateSubtotal();
    const discountAmount = parseFloat(document.getElementById('discount-amount').value) || 0;
    const discountType = document.getElementById('discount-type').value;
    
    if (discountType === 'percentage') {
      return subtotal * (discountAmount / 100);
    } else {
      return discountAmount;
    }
  }
  
  // Calculate tax
  function calculateTax() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    
    return (subtotal - discount) * 0.07; // 7% tax
  }
  
  // Calculate total
  function calculateTotal() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    
    return subtotal - discount + tax;
  }
  
  // Update cart totals
  function updateCartTotals() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    const total = calculateTotal();
    
    document.getElementById('cart-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('cart-tax').textContent = formatCurrency(tax);
    document.getElementById('cart-total').textContent = formatCurrency(total);
  }
  
  // Create sale
  async function createSale(paymentType) {
    try {
      const subtotal = calculateSubtotal();
      const discount = calculateDiscount();
      const tax = calculateTax();
      const total = calculateTotal();
      
      const saleData = {
        customerId: selectedCustomer ? selectedCustomer.id : null,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal,
        discount,
        tax,
        total,
        paymentType
      };
      
      // Add payment details for cash payments
      if (paymentType === 'cash') {
        const received = parseFloat(document.getElementById('payment-received').value) || 0;
        saleData.amountReceived = received;
        saleData.change = received - total;
      }
      
      const sale = await API.sales.create(saleData);
      
      return sale;
      
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }
  
  // Show receipt
  function showReceipt(sale) {
    const receiptContent = document.getElementById('receipt-content');
    
    // Get store info
    API.settings.getStoreInfo().then(storeInfo => {
      const receiptDate = new Date(sale.createdAt).toLocaleString('th-TH');
      
      let receiptHtml = `
        <div class="text-center mb-2">
          <h3 class="font-bold text-lg">${storeInfo.name}</h3>
          <p class="text-sm">${storeInfo.address}</p>
          <p class="text-sm">โทร: ${storeInfo.phone}</p>
        </div>
        
        <div class="border-b mb-2">
          <div class="flex justify-between text-sm">
            <span>เลขที่: ${sale.saleNumber}</span>
            <span>วันที่: ${receiptDate}</span>
          </div>
          <div class="text-sm">
            <span>พนักงาน: ${sale.createdBy}</span>
          </div>
          ${sale.customer ? `<div class="text-sm">ลูกค้า: ${sale.customer.name}</div>` : ''}
        </div>
        
        <table class="w-full text-sm">
          <thead>
            <tr>
              <th>รายการ</th>
              <th>จำนวน</th>
              <th>ราคา</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      sale.items.forEach(item => {
        receiptHtml += `
          <tr>
            <td>${item.product.name}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${formatCurrency(item.price * item.quantity)}</td>
          </tr>
        `;
      });
      
      receiptHtml += `
          </tbody>
        </table>
        
        <div class="border-t mt-2 pt-2">
          <div class="flex justify-between">
            <span>ยอดรวม:</span>
            <span>${formatCurrency(sale.subtotal)}</span>
          </div>
          <div class="flex justify-between">
            <span>ส่วนลด:</span>
            <span>${formatCurrency(sale.discount)}</span>
          </div>
          <div class="flex justify-between">
            <span>ภาษี (7%):</span>
            <span>${formatCurrency(sale.tax)}</span>
          </div>
          <div class="flex justify-between font-bold">
            <span>ยอดสุทธิ:</span>
            <span>${formatCurrency(sale.total)}</span>
          </div>
          
          ${sale.paymentType === 'cash' ? `
            <div class="flex justify-between mt-2">
              <span>รับเงิน:</span>
              <span>${formatCurrency(sale.amountReceived)}</span>
            </div>
            <div class="flex justify-between">
              <span>เงินทอน:</span>
              <span>${formatCurrency(sale.change)}</span>
            </div>
          ` : `
            <div class="flex justify-between mt-2">
              <span>ชำระด้วย:</span>
              <span>บัตรเครดิต/เดบิต</span>
            </div>
          `}
        </div>
        
        <div class="text-center mt-4 text-sm">
          <p>ขอบคุณที่ใช้บริการ</p>
        </div>
      `;
      
      receiptContent.innerHTML = receiptHtml;
      
      // Show receipt modal
      document.getElementById('receipt-modal').classList.remove('hidden');
    });
  }
  
  // Helper function to format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
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
