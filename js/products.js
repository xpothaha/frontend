// Products related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderProducts available globally
  window.renderProducts = renderProducts;
  
  // Render products page
  function renderProducts() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">จัดการสินค้า</h1>
        <button id="add-product-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <i class="fas fa-plus mr-2"></i>เพิ่มสินค้า
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4 border-b">
          <div class="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
            <div class="flex items-center">
              <span class="mr-2">แสดง</span>
              <select id="products-per-page" class="border rounded px-2 py-1">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span class="ml-2">รายการ</span>
            </div>
            <div class="relative">
              <input type="text" id="product-search" placeholder="ค้นหาสินค้า..." class="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รูปภาพ</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คงเหลือ</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200" id="products-table-body">
              <tr>
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">กำลังโหลดข้อมูล...</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="px-4 py-3 border-t flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-gray-500 mb-2 md:mb-0">
            แสดง <span id="products-showing-start">0</span> ถึง <span id="products-showing-end">0</span> จาก <span id="products-total">0</span> รายการ
          </div>
          <div class="flex space-x-1">
            <button id="products-prev-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div id="products-pagination" class="flex space-x-1">
              <!-- Pagination buttons will be inserted here -->
            </div>
            <button id="products-next-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add Product Modal -->
      <div id="add-product-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">เพิ่มสินค้าใหม่</h3>
            <button id="close-add-product-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="add-product-form" class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="product-name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
                <input type="text" id="product-name" name="name" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label for="product-category" class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                <select id="product-category" name="categoryId" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">เลือกหมวดหมู่</option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label for="product-price" class="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
                <input type="number" id="product-price" name="price" min="0" step="0.01" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label for="product-cost" class="block text-sm font-medium text-gray-700 mb-1">ต้นทุน</label>
                <input type="number" id="product-cost" name="cost" min="0" step="0.01" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label for="product-stock" class="block text-sm font-medium text-gray-700 mb-1">จำนวนในคลัง</label>
                <input type="number" id="product-stock" name="stock" min="0" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
            
            <div class="mb-4">
              <label for="product-description" class="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
              <textarea id="product-description" name="description" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div class="mb-4">
              <label for="product-image" class="block text-sm font-medium text-gray-700 mb-1">รูปภาพ</label>
              <input type="file" id="product-image" name="image" accept="image/*" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-add-product" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Edit Product Modal -->
      <div id="edit-product-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">แก้ไขสินค้า</h3>
            <button id="close-edit-product-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="edit-product-form" class="px-6 py-4">
            <input type="hidden" id="edit-product-id">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="edit-product-name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
                <input type="text" id="edit-product-name" name="name" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label for="edit-product-category" class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                <select id="edit-product-category" name="categoryId" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">เลือกหมวดหมู่</option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label for="edit-product-price" class="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
                <input type="number" id="edit-product-price" name="price" min="0" step="0.01" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label for="edit-product-cost" class="block text-sm font-medium text-gray-700 mb-1">ต้นทุน</label>
                <input type="number" id="edit-product-cost" name="cost" min="0" step="0.01" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label for="edit-product-stock" class="block text-sm font-medium text-gray-700 mb-1">จำนวนในคลัง</label>
                <input type="number" id="edit-product-stock" name="stock" min="0" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
            
            <div class="mb-4">
              <label for="edit-product-description" class="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
              <textarea id="edit-product-description" name="description" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div class="mb-4">
              <label for="edit-product-image" class="block text-sm font-medium text-gray-700 mb-1">รูปภาพ</label>
              <input type="file" id="edit-product-image" name="image" accept="image/*" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-edit-product" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
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
    
    // Load products data
    loadProducts();
    
    // Load categories for dropdowns
    loadCategories();
    
    // Add event listeners
    setupProductsEventListeners();
  }
  
  // Load products from API
  async function loadProducts(page = 1, limit = 10, search = '') {
    try {
      const productsData = await API.products.getAll(page, limit, search);
      
      const tableBody = document.getElementById('products-table-body');
      
      if (productsData.products.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">ไม่พบข้อมูลสินค้า</td>
          </tr>
        `;
      } else {
        tableBody.innerHTML = productsData.products.map(product => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.id}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <img src="${product.image || '/assets/no-image.png'}" alt="${product.name}" class="h-10 w-10 rounded-full object-cover">
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.category.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">฿${product.price.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.stock}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-blue-600 hover:text-blue-900 mr-3 edit-product" data-id="${product.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="text-red-600 hover:text-red-900 delete-product" data-id="${product.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        `).join('');
      }
      
      // Update pagination
      updateProductsPagination(productsData.pagination);
      
    } catch (error) {
      console.error('Error loading products:', error);
      document.getElementById('products-table-body').innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-4 text-center text-sm text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</td>
        </tr>
      `;
    }
  }
  
  // Load categories for product forms
  async function loadCategories() {
    try {
      const categories = await API.categories.getAll();
      
      const categorySelects = [
        document.getElementById('product-category'),
        document.getElementById('edit-product-category')
      ];
      
      categorySelects.forEach(select => {
        if (select) {
          // Keep the first option and remove the rest
          while (select.options.length > 1) {
            select.remove(1);
          }
          
          // Add categories as options
          categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
          });
        }
      });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }
  
  // Update products pagination
  function updateProductsPagination(pagination) {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
    
    // Update showing text
    document.getElementById('products-showing-start').textContent = (currentPage - 1) * itemsPerPage + 1;
    document.getElementById('products-showing-end').textContent = Math.min(currentPage * itemsPerPage, totalItems);
    document.getElementById('products-total').textContent = totalItems;
    
    // Update pagination buttons
    const paginationContainer = document.getElementById('products-pagination');
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
      pageButton.addEventListener('click', () => loadProducts(i, itemsPerPage));
      paginationContainer.appendChild(pageButton);
    }
    
    // Update prev/next buttons
    document.getElementById('products-prev-page').disabled = currentPage === 1;
    document.getElementById('products-next-page').disabled = currentPage === totalPages;
    
    document.getElementById('products-prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        loadProducts(currentPage - 1, itemsPerPage);
      }
    });
    
    document.getElementById('products-next-page').addEventListener('click', () => {
      if (currentPage < totalPages) {
        loadProducts(currentPage + 1, itemsPerPage);
      }
    });
  }
  
  // Setup event listeners for products page
  function setupProductsEventListeners() {
    // Add product button
    document.getElementById('add-product-btn').addEventListener('click', () => {
      document.getElementById('add-product-modal').classList.remove('hidden');
    });
    
    // Close add product modal
    document.getElementById('close-add-product-modal').addEventListener('click', () => {
      document.getElementById('add-product-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-add-product').addEventListener('click', () => {
      document.getElementById('add-product-modal').classList.add('hidden');
    });
    
    // Close edit product modal
    document.getElementById('close-edit-product-modal').addEventListener('click', () => {
      document.getElementById('edit-product-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-edit-product').addEventListener('click', () => {
      document.getElementById('edit-product-modal').classList.add('hidden');
    });
    
    // Add product form submit
    document.getElementById('add-product-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      
      try {
        await API.products.create(formData);
        document.getElementById('add-product-modal').classList.add('hidden');
        document.getElementById('add-product-form').reset();
        loadProducts();
      } catch (error) {
        console.error('Error adding product:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า: ' + error.message);
      }
    });
    
    // Edit product form submit
    document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const productId = document.getElementById('edit-product-id').value;
      
      try {
        await API.products.update(productId, formData);
        document.getElementById('edit-product-modal').classList.add('hidden');
        loadProducts();
      } catch (error) {
        console.error('Error updating product:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขสินค้า: ' + error.message);
      }
    });
    
    // Edit product buttons
    document.addEventListener('click', async (e) => {
      if (e.target.closest('.edit-product')) {
        const productId = e.target.closest('.edit-product').getAttribute('data-id');
        
        try {
          const product = await API.products.getById(productId);
          
          document.getElementById('edit-product-id').value = product.id;
          document.getElementById('edit-product-name').value = product.name;
          document.getElementById('edit-product-category').value = product.categoryId;
          document.getElementById('edit-product-price').value = product.price;
          document.getElementById('edit-product-cost').value = product.cost;
          document.getElementById('edit-product-stock').value = product.stock;
          document.getElementById('edit-product-description').value = product.description || '';
          
          document.getElementById('edit-product-modal').classList.remove('hidden');
        } catch (error) {
          console.error('Error loading product details:', error);
          alert('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า: ' + error.message);
        }
      }
      
      if (e.target.closest('.delete-product')) {
        const productId = e.target.closest('.delete-product').getAttribute('data-id');
        
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
          try {
            await API.products.delete(productId);
            loadProducts();
          } catch (error) {
            console.error('Error deleting product:', error);
            alert('เกิดข้อผิดพลาดในการลบสินค้า: ' + error.message);
          }
        }
      }
    });
    
    // Products per page change
    document.getElementById('products-per-page').addEventListener('change', (e) => {
      const limit = parseInt(e.target.value);
      loadProducts(1, limit);
    });
    
    // Product search
    const searchInput = document.getElementById('product-search');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.trim();
        loadProducts(1, parseInt(document.getElementById('products-per-page').value), searchTerm);
      }, 500);
    });
  }
});
