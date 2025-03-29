// Router for the application
document.addEventListener('DOMContentLoaded', function() {
  // Define routes
  const routes = {
    '/': renderLoginPage,
    '/dashboard': renderDashboard,
    '/products': renderProducts,
    '/categories': renderCategories,
    '/customers': renderCustomers,
    '/sales': renderSales,
    '/purchases': renderPurchases,
    '/reports': renderReports,
    '/settings': renderSettings
  };
  
  // Initialize the app
  initApp();
  
  function initApp() {
    // Check if user is authenticated
    const isAuthenticated = API.auth.isAuthenticated();
    
    // Get current path
    const path = window.location.pathname;
    
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && path !== '/') {
      window.history.pushState({}, '', '/');
      renderLoginPage();
      return;
    }
    
    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && path === '/') {
      window.history.pushState({}, '', '/dashboard');
      renderDashboard();
      return;
    }
    
    // Render the appropriate page
    const render = routes[path] || renderNotFound;
    render();
    
    // Set up navigation
    setupNavigation();
  }
  
  // Setup navigation events
  function setupNavigation() {
    document.addEventListener('click', function(e) {
      // Handle navigation links
      if (e.target.matches('a[data-nav]') || e.target.closest('a[data-nav]')) {
        const link = e.target.matches('a[data-nav]') ? e.target : e.target.closest('a[data-nav]');
        e.preventDefault();
        
        const path = link.getAttribute('href');
        window.history.pushState({}, '', path);
        
        const render = routes[path] || renderNotFound;
        render();
      }
      
      // Handle logout
      if (e.target.matches('#logout-btn') || e.target.closest('#logout-btn')) {
        e.preventDefault();
        API.auth.logout();
        window.history.pushState({}, '', '/');
        renderLoginPage();
      }
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
      const path = window.location.pathname;
      const render = routes[path] || renderNotFound;
      render();
    });
  }
});
