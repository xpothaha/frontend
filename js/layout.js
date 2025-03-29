// Layout related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderLayout available globally
  window.renderLayout = renderLayout;
  
  // Render the main layout with sidebar and content
  function renderLayout(content) {
    return `
      <div class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <div id="sidebar" class="sidebar bg-white shadow-md">
          <div class="p-4 border-b">
            <div class="flex items-center justify-between">
              <a href="/dashboard" data-nav class="text-xl font-bold text-blue-600">ShopSecure POS</a>
              <button id="sidebar-toggle" class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
                <i class="fas fa-bars"></i>
              </button>
            </div>
          </div>
          
          <nav class="mt-4">
            <ul>
              <li class="mb-1">
                <a href="/dashboard" data-nav class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">
                  <i class="fas fa-tachometer-alt w-5 h-5 text-center"></i>
                  <span class="ml-3 sidebar-item-text">แดชบอร์ด</span>
                </a>
              </li>
              <li class="mb-1">
                <a href="/products" data-nav class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">
                  <i class="fas fa-box w-5 h-5 text-center"></i>
                  <span class="ml-3 sidebar-item-text">สินค้า</span>
                </a>
              </li>
              <li class="mb-1">
                <a href="/categories" data-nav class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">
                  <i class="fas fa-tags w-5 h-5 text-center"></i>
                  <span class="ml-3 sidebar-item-text">หมวดหมู่</span>
                </a>
              </li>
              <li class="mb-1">
                <a href="/customers" data-nav class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">
                  <i class="fas fa-users w-5 h-5 text-center"></i>
                  <span class="ml-3 sidebar-item-text">ลูกค้า</span>
                </a>
              </li>
              <li class="mb-1">
                <a href="/sales" data-nav class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">
                  <i class="fas fa-shopping-cart w-5 h-5 text-center"></i>
                  <span class="ml-3 sidebar-item-text">การขาย</span>
                </a>
              </li>
              <li class="mb-1">
                <a href="/purchases" data-nav class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">
                  <i class="fas fa-truck w-5 h-5 text-center"></i>
                  <span class="ml-3 sidebar-item-text">การซื้อ</span>
                </a>
              </li>
              <li class="mb-1">
                <a href="/reports" data-nav class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">
                  <i class="fas fa-chart-bar w-5 h-5 text-center"></i>
                  <span class="ml-3 sidebar-item-text">รายงาน</span>
                </a>
              </li>
              <li class="mb-1">
                <a href="/settings" data-nav class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">
                  <i class="fas fa-cog w-5 h-5 text-center"></i>
                  <span class="ml-3 sidebar-item-text">ตั้งค่า</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        
        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Top Navigation -->
          <header class="bg-white shadow-sm">
            <div class="flex justify-between items-center px-6 py-3">
              <h2 class="text-xl font-semibold text-gray-800" id="page-title">ShopSecure POS</h2>
              
              <div class="relative">
                <button id="user-menu-button" class="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none">
                  <span class="mr-2" id="user-name">ผู้ใช้งาน</span>
                  <img class="h-8 w-8 rounded-full object-cover" src="/assets/user-avatar.png" alt="User Avatar">
                </button>
                
                <div id="user-menu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a href="/settings" data-nav class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-cog mr-2"></i>ตั้งค่า
                  </a>
                  <button id="logout-btn" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-sign-out-alt mr-2"></i>ออกจากระบบ
                  </button>
                </div>
              </div>
            </div>
          </header>
          
          <!-- Content -->
          <main class="flex-1 overflow-y-auto p-6 bg-gray-100">
            ${content}
          </main>
          
          <!-- Footer -->
          <footer class="bg-white border-t px-6 py-3">
            <div class="text-center text-sm text-gray-500">
              &copy; ${new Date().getFullYear()} ShopSecure POS. สงวนลิขสิทธิ์.
            </div>
          </footer>
        </div>
      </div>
    `;
  }
  
  // Render 404 page
  window.renderNotFound = function() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 text-center">
          <h1 class="text-9xl font-extrabold text-blue-600">404</h1>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">ไม่พบหน้าที่คุณต้องการ</h2>
          <p class="mt-2 text-sm text-gray-600">
            หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือลบไปแล้ว
          </p>
          <div class="mt-6">
            <a href="/dashboard" data-nav class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              กลับไปที่หน้าแดชบอร์ด
            </a>
          </div>
        </div>
      </div>
    `;
  }
  
  // Setup UI interactions
  document.addEventListener('click', function(e) {
    // Toggle user menu
    if (e.target.matches('#user-menu-button') || e.target.closest('#user-menu-button')) {
      const userMenu = document.getElementById('user-menu');
      if (userMenu) {
        userMenu.classList.toggle('hidden');
      }
    } else if (!e.target.matches('#user-menu') && !e.target.closest('#user-menu')) {
      const userMenu = document.getElementById('user-menu');
      if (userMenu && !userMenu.classList.contains('hidden')) {
        userMenu.classList.add('hidden');
      }
    }
    
    // Toggle sidebar
    if (e.target.matches('#sidebar-toggle') || e.target.closest('#sidebar-toggle')) {
      const sidebar = document.getElementById('sidebar');
      const sidebarItemTexts = document.querySelectorAll('.sidebar-item-text');
      
      if (sidebar) {
        sidebar.classList.toggle('sidebar-collapsed');
        
        sidebarItemTexts.forEach(text => {
          text.classList.toggle('hidden-sidebar-text');
        });
      }
    }
  });
});
