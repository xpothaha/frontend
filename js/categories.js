// Categories related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderCategories available globally
  window.renderCategories = renderCategories;
  
  // Render categories page
  function renderCategories() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">จัดการหมวดหมู่</h1>
        <button id="add-category-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <i class="fas fa-plus mr-2"></i>เพิ่มหมวดหมู่
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4 border-b">
          <div class="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
            <div class="flex items-center">
              <span class="mr-2">แสดง</span>
              <select id="categories-per-page" class="border rounded px-2 py-1">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span class="ml-2">รายการ</span>
            </div>
            <div class="relative">
              <input type="text" id="category-search" placeholder="ค้นหาหมวดหมู่..." class="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อหมวดหมู่</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คำอธิบาย</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนสินค้า</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200" id="categories-table-body">
              <tr>
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">กำลังโหลดข้อมูล...</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="px-4 py-3 border-t flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-gray-500 mb-2 md:mb-0">
            แสดง <span id="categories-showing-start">0</span> ถึง <span id="categories-showing-end">0</span> จาก <span id="categories-total">0</span> รายการ
          </div>
          <div class="flex space-x-1">
            <button id="categories-prev-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div id="categories-pagination" class="flex space-x-1">
              <!-- Pagination buttons will be inserted here -->
            </div>
            <button id="categories-next-page" class="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add Category Modal -->
      <div id="add-category-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">เพิ่มหมวดหมู่ใหม่</h3>
            <button id="close-add-category-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="add-category-form" class="px-6 py-4">
            <div class="mb-4">
              <label for="category-name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อหมวดหมู่</label>
              <input type="text" id="category-name" name="name" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="category-description" class="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
              <textarea id="category-description" name="description" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-add-category" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                ยกเลิก
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Edit Category Modal -->
      <div id="edit-category-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">แก้ไขหมวดหมู่</h3>
            <button id="close-edit-category-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="edit-category-form" class="px-6 py-4">
            <input type="hidden" id="edit-category-id">
            <div class="mb-4">
              <label for="edit-category-name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อหมวดหมู่</label>
              <input type="text" id="edit-category-name" name="name" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="edit-category-description" class="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
              <textarea id="edit-category-description" name="description" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-edit-category" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
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
    
    // Load categories data
    loadCategories();
    
    // Setup event listeners
    setupCategoriesEventListeners();
  }
  
  // Load categories from API
  async function loadCategories(page = 1, limit = 10, search = '') {
    try {
      const categoriesData = await API.categories.getAll(page, limit, search);
      
      const tableBody = document.getElementById('categories-table-body');
      
      if (categoriesData.categories.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">ไม่พบข้อมูลหมวดหมู่</td>
          </tr>
        `;
      } else {
        tableBody.innerHTML = categoriesData.categories.map(category => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${category.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${category.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${category.description || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${category.productCount || 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-blue-600 hover:text-blue-900 mr-3 edit-category" data-id="${category.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="text-red-600 hover:text-red-900 delete-category" data-id="${category.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        `).join('');
      }
      
      // Update pagination
      updateCategoriesPagination(categoriesData.pagination);
      
    } catch (error) {
      console.error('Error loading categories:', error);
      document.getElementById('categories-table-body').innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-4 text-center text-sm text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</td>
        </tr>
      `;
    }
  }
  
  // Update categories pagination
  function updateCategoriesPagination(pagination) {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
    
    // Update showing text
    document.getElementById('categories-showing-start').textContent = (currentPage - 1) * itemsPerPage + 1;
    document.getElementById('categories-showing-end').textContent = Math.min(currentPage * itemsPerPage, totalItems);
    document.getElementById('categories-total').textContent = totalItems;
    
    // Update pagination buttons
    const paginationContainer = document.getElementById('categories-pagination');
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
      pageButton.addEventListener('click', () => loadCategories(i, itemsPerPage));
      paginationContainer.appendChild(pageButton);
    }
    
    // Update prev/next buttons
    document.getElementById('categories-prev-page').disabled = currentPage === 1;
    document.getElementById('categories-next-page').disabled = currentPage === totalPages;
    
    document.getElementById('categories-prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        loadCategories(currentPage - 1, itemsPerPage);
      }
    });
    
    document.getElementById('categories-next-page').addEventListener('click', () => {
      if (currentPage < totalPages) {
        loadCategories(currentPage + 1, itemsPerPage);
      }
    });
  }
  
  // Setup event listeners for categories page
  function setupCategoriesEventListeners() {
    // Add category button
    document.getElementById('add-category-btn').addEventListener('click', () => {
      document.getElementById('add-category-modal').classList.remove('hidden');
    });
    
    // Close add category modal
    document.getElementById('close-add-category-modal').addEventListener('click', () => {
      document.getElementById('add-category-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-add-category').addEventListener('click', () => {
      document.getElementById('add-category-modal').classList.add('hidden');
    });
    
    // Close edit category modal
    document.getElementById('close-edit-category-modal').addEventListener('click', () => {
      document.getElementById('edit-category-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-edit-category').addEventListener('click', () => {
      document.getElementById('edit-category-modal').classList.add('hidden');
    });
    
    // Add category form submit
    document.getElementById('add-category-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const categoryData = {
        name: formData.get('name'),
        description: formData.get('description')
      };
      
      try {
        await API.categories.create(categoryData);
        document.getElementById('add-category-modal').classList.add('hidden');
        document.getElementById('add-category-form').reset();
        loadCategories();
      } catch (error) {
        console.error('Error adding category:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่: ' + error.message);
      }
    });
    
    // Edit category form submit
    document.getElementById('edit-category-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const categoryId = document.getElementById('edit-category-id').value;
      const categoryData = {
        name: formData.get('name'),
        description: formData.get('description')
      };
      
      try {
        await API.categories.update(categoryId, categoryData);
        document.getElementById('edit-category-modal').classList.add('hidden');
        loadCategories();
      } catch (error) {
        console.error('Error updating category:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่: ' + error.message);
      }
    });
    
    // Edit category buttons
    document.addEventListener('click', async (e) => {
      if (e.target.closest('.edit-category')) {
        const categoryId = e.target.closest('.edit-category').getAttribute('data-id');
        
        try {
          const category = await API.categories.getById(categoryId);
          
          document.getElementById('edit-category-id').value = category.id;
          document.getElementById('edit-category-name').value = category.name;
          document.getElementById('edit-category-description').value = category.description || '';
          
          document.getElementById('edit-category-modal').classList.remove('hidden');
        } catch (error) {
          console.error('Error loading category details:', error);
          alert('เกิดข้อผิดพลาดในการโหลดข้อมูลหมวดหมู่: ' + error.message);
        }
      }
      
      if (e.target.closest('.delete-category')) {
        const categoryId = e.target.closest('.delete-category').getAttribute('data-id');
        
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้? การลบหมวดหมู่จะส่งผลกระทบต่อสินค้าที่อยู่ในหมวดหมู่นี้')) {
          try {
            await API.categories.delete(categoryId);
            loadCategories();
          } catch (error) {
            console.error('Error deleting category:', error);
            alert('เกิดข้อผิดพลาดในการลบหมวดหมู่: ' + error.message);
          }
        }
      }
    });
    
    // Categories per page change
    document.getElementById('categories-per-page').addEventListener('change', (e) => {
      const limit = parseInt(e.target.value);
      loadCategories(1, limit);
    });
    
    // Category search
    const searchInput = document.getElementById('category-search');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.trim();
        loadCategories(1, parseInt(document.getElementById('categories-per-page').value), searchTerm);
      }, 500);
    });
  }
});
