// Load all JavaScript files
document.addEventListener('DOMContentLoaded', function() {
  // Array of script files to load
  const scripts = [
    '/js/api.js',
    '/js/auth.js',
    '/js/layout.js',
    '/js/router.js',
    '/js/dashboard.js',
    '/js/products.js',
    '/js/categories.js',
    '/js/customers.js',
    '/js/sales.js'
  ];
  
  // Load scripts in sequence
  function loadScripts(index) {
    if (index >= scripts.length) {
      // Initialize the router after all scripts are loaded
      if (typeof initApp === 'function') {
        initApp();
      } else {
        console.error('initApp function not found. Make sure router.js is loaded correctly.');
      }
      return;
    }
    
    const script = document.createElement('script');
    script.src = scripts[index];
    script.onload = function() {
      loadScripts(index + 1);
    };
    script.onerror = function() {
      console.error(`Failed to load script: ${scripts[index]}`);
      loadScripts(index + 1);
    };
    document.body.appendChild(script);
  }
  
  // Start loading scripts
  loadScripts(0);
});
