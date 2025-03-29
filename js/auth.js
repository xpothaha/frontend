// Authentication related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderLoginPage available globally
  window.renderLoginPage = renderLoginPage;
  
  // Render login page
  function renderLoginPage() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              เข้าสู่ระบบ ShopSecure POS
            </h2>
          </div>
          <form id="login-form" class="mt-8 space-y-6">
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="username" class="sr-only">ชื่อผู้ใช้</label>
                <input id="username" name="username" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="ชื่อผู้ใช้">
              </div>
              <div>
                <label for="password" class="sr-only">รหัสผ่าน</label>
                <input id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="รหัสผ่าน">
              </div>
            </div>
            
            <!-- Cloudflare Turnstile -->
            <div id="cf-turnstile" class="cf-turnstile" data-sitekey="YOUR_TURNSTILE_SITE_KEY" data-callback="onCaptchaSuccess"></div>
            
            <div id="login-error" class="text-red-500 text-sm hidden"></div>
            <div>
              <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    // Load Cloudflare Turnstile script
    if (!document.getElementById('turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    
    // Callback for Turnstile
    window.onCaptchaSuccess = function(token) {
      // Store token to be sent with login request
      window.captchaToken = token;
    };
    
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const captchaToken = window.captchaToken || '';
      
      const result = await API.auth.login(username, password, captchaToken);
      
      if (result.success) {
        window.history.pushState({}, '', '/dashboard');
        renderDashboard();
      } else {
        const errorElement = document.getElementById('login-error');
        errorElement.textContent = result.message || 'เข้าสู่ระบบล้มเหลว โปรดลองอีกครั้ง';
        errorElement.classList.remove('hidden');
        
        // Reset Turnstile if available
        if (window.turnstile) {
          window.turnstile.reset();
        }
      }
    });
  }
});
