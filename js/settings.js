// Settings related functions
document.addEventListener('DOMContentLoaded', function() {
  // Make renderSettings available globally
  window.renderSettings = renderSettings;
  
  // Render settings page
  function renderSettings() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = renderLayout(`
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">ตั้งค่าระบบ</h1>
        <button id="save-settings-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <i class="fas fa-save mr-2"></i>บันทึกการตั้งค่า
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <form id="settings-form">
            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4">ข้อมูลร้านค้า</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="store-name" class="block text-sm font-medium text-gray-700 mb-1">ชื่อร้าน</label>
                  <input type="text" id="store-name" name="storeName" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label for="store-phone" class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                  <input type="tel" id="store-phone" name="storePhone" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="md:col-span-2">
                  <label for="store-address" class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                  <textarea id="store-address" name="storeAddress" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div>
                  <label for="store-tax-id" class="block text-sm font-medium text-gray-700 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                  <input type="text" id="store-tax-id" name="storeTaxId" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label for="store-email" class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                  <input type="email" id="store-email" name="storeEmail" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
            </div>
            
            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4">ตั้งค่าระบบ</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="currency" class="block text-sm font-medium text-gray-700 mb-1">สกุลเงิน</label>
                  <select id="currency" name="currency" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="THB">บาท (THB)</option>
                    <option value="USD">ดอลลาร์สหรัฐ (USD)</option>
                    <option value="EUR">ยูโร (EUR)</option>
                  </select>
                </div>
                <div>
                  <label for="tax-rate" class="block text-sm font-medium text-gray-700 mb-1">อัตราภาษี (%)</label>
                  <input type="number" id="tax-rate" name="taxRate" min="0" max="100" step="0.01" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label for="date-format" class="block text-sm font-medium text-gray-700 mb-1">รูปแบบวันที่</label>
                  <select id="date-format" name="dateFormat" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label for="low-stock-threshold" class="block text-sm font-medium text-gray-700 mb-1">เกณฑ์สินค้าใกล้หมด</label>
                  <input type="number" id="low-stock-threshold" name="lowStockThreshold" min="0" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
            </div>
            
            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4">ตั้งค่าใบเสร็จ</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="receipt-header" class="block text-sm font-medium text-gray-700 mb-1">ข้อความส่วนหัวใบเสร็จ</label>
                  <textarea id="receipt-header" name="receiptHeader" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div>
                  <label for="receipt-footer" class="block text-sm font-medium text-gray-700 mb-1">ข้อความส่วนท้ายใบเสร็จ</label>
                  <textarea id="receipt-footer" name="receiptFooter" rows="3" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div class="md:col-span-2">
                  <div class="flex items-center">
                    <input type="checkbox" id="show-tax-on-receipt" name="showTaxOnReceipt" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <label for="show-tax-on-receipt" class="ml-2 block text-sm text-gray-700">แสดงภาษีในใบเสร็จ</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 class="text-xl font-semibold mb-4">ตั้งค่าผู้ใช้งาน</h2>
              <div class="mb-4">
                <button type="button" id="change-password-btn" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                  <i class="fas fa-key mr-2"></i>เปลี่ยนรหัสผ่าน
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Change Password Modal -->
      <div id="change-password-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div class="flex justify-between items-center px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">เปลี่ยนรหัสผ่าน</h3>
            <button id="close-change-password-modal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="change-password-form" class="px-6 py-4">
            <div class="mb-4">
              <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านปัจจุบัน</label>
              <input type="password" id="current-password" name="currentPassword" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
              <input type="password" id="new-password" name="newPassword" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="mb-4">
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
              <input type="password" id="confirm-password" name="confirmPassword" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-change-password" class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
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
    
    // Load settings data
    loadSettings();
    
    // Setup event listeners
    setupSettingsEventListeners();
  }
  
  // Load settings from API
  async function loadSettings() {
    try {
      const settings = await API.settings.getAll();
      
      // Fill form with settings data
      document.getElementById('store-name').value = settings.storeName || '';
      document.getElementById('store-phone').value = settings.storePhone || '';
      document.getElementById('store-address').value = settings.storeAddress || '';
      document.getElementById('store-tax-id').value = settings.storeTaxId || '';
      document.getElementById('store-email').value = settings.storeEmail || '';
      
      document.getElementById('currency').value = settings.currency || 'THB';
      document.getElementById('tax-rate').value = settings.taxRate || '7';
      document.getElementById('date-format').value = settings.dateFormat || 'DD/MM/YYYY';
      document.getElementById('low-stock-threshold').value = settings.lowStockThreshold || '10';
      
      document.getElementById('receipt-header').value = settings.receiptHeader || '';
      document.getElementById('receipt-footer').value = settings.receiptFooter || '';
      document.getElementById('show-tax-on-receipt').checked = settings.showTaxOnReceipt || false;
      
    } catch (error) {
      console.error('Error loading settings:', error);
      alert('เกิดข้อผิดพลาดในการโหลดการตั้งค่า: ' + error.message);
    }
  }
  
  // Setup event listeners for settings page
  function setupSettingsEventListeners() {
    // Save settings button
    document.getElementById('save-settings-btn').addEventListener('click', async () => {
      const form = document.getElementById('settings-form');
      const formData = new FormData(form);
      
      const settings = {
        storeName: formData.get('storeName'),
        storePhone: formData.get('storePhone'),
        storeAddress: formData.get('storeAddress'),
        storeTaxId: formData.get('storeTaxId'),
        storeEmail: formData.get('storeEmail'),
        
        currency: formData.get('currency'),
        taxRate: parseFloat(formData.get('taxRate')),
        dateFormat: formData.get('dateFormat'),
        lowStockThreshold: parseInt(formData.get('lowStockThreshold')),
        
        receiptHeader: formData.get('receiptHeader'),
        receiptFooter: formData.get('receiptFooter'),
        showTaxOnReceipt: document.getElementById('show-tax-on-receipt').checked
      };
      
      try {
        await API.settings.update(settings);
        alert('บันทึกการตั้งค่าเรียบร้อยแล้ว');
      } catch (error) {
        console.error('Error saving settings:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า: ' + error.message);
      }
    });
    
    // Change password button
    document.getElementById('change-password-btn').addEventListener('click', () => {
      document.getElementById('change-password-modal').classList.remove('hidden');
    });
    
    // Close change password modal
    document.getElementById('close-change-password-modal').addEventListener('click', () => {
      document.getElementById('change-password-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-change-password').addEventListener('click', () => {
      document.getElementById('change-password-modal').classList.add('hidden');
    });
    
    // Change password form submit
    document.getElementById('change-password-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      if (newPassword !== confirmPassword) {
        alert('รหัสผ่านใหม่และรหัสผ่านยืนยันไม่ตรงกัน');
        return;
      }
      
      try {
        await API.auth.changePassword(currentPassword, newPassword);
        document.getElementById('change-password-modal').classList.add('hidden');
        document.getElementById('change-password-form').reset();
        alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
      } catch (error) {
        console.error('Error changing password:', error);
        alert('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน: ' + error.message);
      }
    });
  }
});
