// Xử lý trang tài khoản
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    checkLogin();
    
    // Khởi tạo các tab
    initTabs();
    
    // Load thông tin người dùng
    loadUserInfo();
    
    // Load đơn hàng
    loadOrders();
    
    // Load địa chỉ thanh toán
    loadAddress();
    
    // Xử lý các form
    initForms();
    
    // Lắng nghe thay đổi từ localStorage để tự động cập nhật đơn hàng
    setupOrderUpdateListener();
    
    // Tự động refresh đơn hàng mỗi 2 giây (fallback nếu storage event không hoạt động)
    setInterval(function() {
        if (document.getElementById('orders-tab').classList.contains('active')) {
            loadOrders();
        }
    }, 2000);
});

// Kiểm tra đăng nhập
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('currentUser');
    
    if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để xem thông tin tài khoản!');
        window.location.href = 'DangNhap.html';
        return;
    }
}

// Khởi tạo các tab
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            
            // Xóa active từ tất cả
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Thêm active cho tab được chọn
            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
}

// Load thông tin người dùng
function loadUserInfo() {
    try {
        const userInfoStr = localStorage.getItem('currentUser') || sessionStorage.getItem('userInfo');
        
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            
            // Hiển thị tên và email ở sidebar
            const userNameDisplay = document.getElementById('userNameDisplay');
            const userEmailDisplay = document.getElementById('userEmailDisplay');
            
            if (userNameDisplay) {
                userNameDisplay.textContent = userInfo.name || 'Khách hàng';
            }
            if (userEmailDisplay) {
                userEmailDisplay.textContent = userInfo.email || 'email@example.com';
            }
            
            // Kiểm tra nếu là admin thì hiển thị nút quay lại trang quản trị
            const adminLink = document.getElementById('adminLink');
            if (adminLink) {
                const isAdmin = userInfo.email === 'admin@art.com' || 
                               userInfo.email === 'admin@nghethuat.vn' ||
                               sessionStorage.getItem('userRole') === 'admin';
                if (isAdmin) {
                    adminLink.style.display = 'block';
                } else {
                    adminLink.style.display = 'none';
                }
            }
            
            // Điền thông tin vào form
            const profileName = document.getElementById('profileName');
            const profilePhone = document.getElementById('profilePhone');
            const profileEmail = document.getElementById('profileEmail');
            const profileBirthday = document.getElementById('profileBirthday');
            const profileGender = document.getElementById('profileGender');
            
            if (profileName) profileName.value = userInfo.name || '';
            if (profilePhone) profilePhone.value = userInfo.phone || '';
            if (profileEmail) profileEmail.value = userInfo.email || '';
            if (profileBirthday) profileBirthday.value = userInfo.birthday || '';
            if (profileGender) profileGender.value = userInfo.gender || '';
        }
    } catch (error) {
        console.error('Lỗi khi load thông tin người dùng:', error);
    }
}

// Xử lý các form
function initForms() {
    // Form thông tin tài khoản
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });
    }
    
    // Form địa chỉ
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAddress();
        });
    }
    
    // Form mật khẩu
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
}

// Lưu thông tin tài khoản
function saveProfile() {
    try {
        const name = document.getElementById('profileName').value.trim();
        const phone = document.getElementById('profilePhone').value.trim();
        const email = document.getElementById('profileEmail').value.trim();
        const birthday = document.getElementById('profileBirthday').value;
        const gender = document.getElementById('profileGender').value;
        
        if (!name || !phone || !email) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        
        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Vui lòng nhập đúng định dạng email!');
            return;
        }
        
        // Validate phone
        const phonePattern = /^0[0-9]{9}$/;
        if (!phonePattern.test(phone)) {
            alert('Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số!');
            return;
        }
        
        // Lấy thông tin người dùng hiện tại
        const userInfoStr = localStorage.getItem('currentUser') || sessionStorage.getItem('userInfo');
        let userInfo = {};
        
        if (userInfoStr) {
            userInfo = JSON.parse(userInfoStr);
        }
        
        // Cập nhật thông tin
        userInfo.name = name;
        userInfo.phone = phone;
        userInfo.email = email;
        userInfo.birthday = birthday;
        userInfo.gender = gender;
        
        // Lưu vào localStorage và sessionStorage
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // Cập nhật trong admin_customers nếu có
        let customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
        const customerIndex = customers.findIndex(c => 
            c.email === email || c.phone === phone
        );
        
        if (customerIndex !== -1) {
            customers[customerIndex].name = name;
            customers[customerIndex].phone = phone;
            customers[customerIndex].email = email;
            localStorage.setItem('admin_customers', JSON.stringify(customers));
        }
        
        // Cập nhật trong user_account nếu có
        const userAccountKey = 'user_account_' + email;
        const userAccountStr = localStorage.getItem(userAccountKey);
        if (userAccountStr) {
            const userAccount = JSON.parse(userAccountStr);
            userAccount.name = name;
            userAccount.phone = phone;
            userAccount.email = email;
            localStorage.setItem(userAccountKey, JSON.stringify(userAccount));
        }
        
        // Cập nhật hiển thị
        loadUserInfo();
        
        alert('Đã lưu thông tin tài khoản thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu thông tin:', error);
        alert('Có lỗi xảy ra khi lưu thông tin!');
    }
}

// Load đơn hàng
function loadOrders() {
    try {
        const ordersList = document.getElementById('ordersList');
        if (!ordersList) return;
        
        // Lấy đơn hàng từ localStorage
        const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        
        // Lấy thông tin người dùng hiện tại
        const userInfoStr = localStorage.getItem('currentUser') || sessionStorage.getItem('userInfo');
        if (!userInfoStr) {
            ordersList.innerHTML = '<p class="no-orders">Bạn chưa có đơn hàng nào.</p>';
            return;
        }
        
        const userInfo = JSON.parse(userInfoStr);
        const userEmail = userInfo.email;
        const userPhone = userInfo.phone;
        
        // Lọc đơn hàng của người dùng hiện tại
        const userOrders = orders.filter(order => 
            order.customerEmail === userEmail || order.customerPhone === userPhone || order.customer === userInfo.name
        );
        
        if (userOrders.length === 0) {
            ordersList.innerHTML = '<p class="no-orders">Bạn chưa có đơn hàng nào.</p>';
            return;
        }
        
        // Sắp xếp đơn hàng theo thời gian (mới nhất trước)
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Hiển thị đơn hàng với bảng có hình ảnh và số lượng
        let html = '';
        userOrders.forEach(order => {
            const statusText = {
                'pending': 'Chờ xử lý',
                'processing': 'Đang xử lý',
                'shipped': 'Đang giao',
                'success': 'Hoàn thành',
                'completed': 'Hoàn thành',
                'cancelled': 'Đã hủy',
                'canceled': 'Đã hủy'
            };
            
            const statusClass = order.status || 'pending';
            const canCancel = (order.status === 'pending' || order.status === 'processing');
            
            html += `
                <div class="order-item">
                    <div class="order-header">
                        <div>
                            <span class="order-id">Mã đơn: ${order.id}</span>
                            <span class="order-date"> - ${formatDate(order.date)}</span>
                        </div>
                        <span class="order-status ${statusClass}">${statusText[statusClass] || 'Chờ xử lý'}</span>
                    </div>
                    
                    <div class="order-items-table-container">
                        <table class="order-items-table">
                            <thead>
                                <tr>
                                    <th>Hình ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            if (order.items && order.items.length > 0) {
                order.items.forEach(item => {
                    const imageUrl = item.image || './assets/TrangNgoai/logo1.png';
                    html += `
                        <tr>
                            <td class="order-item-image">
                                <img src="${imageUrl}" alt="${item.name}" onerror="this.src='./assets/TrangNgoai/logo1.png'">
                            </td>
                            <td class="order-item-name">${item.name}</td>
                            <td class="order-item-quantity">${item.quantity}</td>
                            <td class="order-item-unit-price">${item.price.toLocaleString('vi-VN')}đ</td>
                            <td class="order-item-price">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                        </tr>
                    `;
                });
            } else {
                html += `
                    <tr>
                        <td colspan="5" style="text-align: center; color: #999; padding: 20px;">
                            Không có sản phẩm trong đơn hàng này
                        </td>
                    </tr>
                `;
            }
            
            html += `
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="order-footer">
                        <div class="order-total">
                            <span>Tổng tiền:</span>
                            <span>${order.total.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div class="order-actions">
                            <button class="btn-action btn-view-detail" onclick="viewOrderDetail('${order.id}')" title="Xem chi tiết">
                                <i class="ti-eye"></i> Xem chi tiết
                            </button>
                            ${canCancel ? `
                                <button class="btn-action btn-cancel-order" onclick="cancelOrder('${order.id}')" title="Hủy đơn hàng">
                                    <i class="ti-close"></i> Hủy đơn
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        ordersList.innerHTML = html;
    } catch (error) {
        console.error('Lỗi khi load đơn hàng:', error);
        const ordersList = document.getElementById('ordersList');
        if (ordersList) {
            ordersList.innerHTML = '<p class="no-orders">Có lỗi xảy ra khi tải đơn hàng.</p>';
        }
    }
}

// Format ngày tháng
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Load địa chỉ thanh toán
function loadAddress() {
    try {
        const userInfoStr = localStorage.getItem('currentUser') || sessionStorage.getItem('userInfo');
        if (!userInfoStr) return;
        
        const userInfo = JSON.parse(userInfoStr);
        
        // Lấy địa chỉ từ userInfo hoặc từ localStorage riêng
        const savedAddress = localStorage.getItem('user_address_' + (userInfo.email || userInfo.phone));
        let address = {};
        
        if (savedAddress) {
            address = JSON.parse(savedAddress);
        } else if (userInfo.address) {
            // Nếu có địa chỉ trong userInfo nhưng chưa có format đầy đủ
            address.detail = userInfo.address;
        }
        
        // Điền vào form
        const addressName = document.getElementById('addressName');
        const addressPhone = document.getElementById('addressPhone');
        const addressProvince = document.getElementById('addressProvince');
        const addressDistrict = document.getElementById('addressDistrict');
        const addressWard = document.getElementById('addressWard');
        const addressDetail = document.getElementById('addressDetail');
        const setDefaultAddress = document.getElementById('setDefaultAddress');
        
        if (addressName) addressName.value = address.name || userInfo.name || '';
        if (addressPhone) addressPhone.value = address.phone || userInfo.phone || '';
        if (addressProvince) addressProvince.value = address.province || '';
        if (addressDistrict) addressDistrict.value = address.district || '';
        if (addressWard) addressWard.value = address.ward || '';
        if (addressDetail) addressDetail.value = address.detail || userInfo.address || '';
        if (setDefaultAddress) setDefaultAddress.checked = address.default || false;
    } catch (error) {
        console.error('Lỗi khi load địa chỉ:', error);
    }
}

// Lưu địa chỉ thanh toán
function saveAddress() {
    try {
        const name = document.getElementById('addressName').value.trim();
        const phone = document.getElementById('addressPhone').value.trim();
        const province = document.getElementById('addressProvince').value.trim();
        const district = document.getElementById('addressDistrict').value.trim();
        const ward = document.getElementById('addressWard').value.trim();
        const detail = document.getElementById('addressDetail').value.trim();
        const isDefault = document.getElementById('setDefaultAddress').checked;
        
        if (!name || !phone || !province || !district || !ward || !detail) {
            alert('Vui lòng điền đầy đủ thông tin địa chỉ!');
            return;
        }
        
        // Validate phone
        const phonePattern = /^0[0-9]{9}$/;
        if (!phonePattern.test(phone)) {
            alert('Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số!');
            return;
        }
        
        const userInfoStr = localStorage.getItem('currentUser') || sessionStorage.getItem('userInfo');
        if (!userInfoStr) {
            alert('Vui lòng đăng nhập!');
            return;
        }
        
        const userInfo = JSON.parse(userInfoStr);
        const userKey = userInfo.email || userInfo.phone;
        
        // Lưu địa chỉ
        const address = {
            name: name,
            phone: phone,
            province: province,
            district: district,
            ward: ward,
            detail: detail,
            fullAddress: `${detail}, ${ward}, ${district}, ${province}`,
            default: isDefault
        };
        
        localStorage.setItem('user_address_' + userKey, JSON.stringify(address));
        
        // Cập nhật vào userInfo nếu là địa chỉ mặc định
        if (isDefault) {
            userInfo.address = address.fullAddress;
            userInfo.name = name;
            userInfo.phone = phone;
            localStorage.setItem('currentUser', JSON.stringify(userInfo));
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
        
        alert('Đã lưu địa chỉ thanh toán thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu địa chỉ:', error);
        alert('Có lỗi xảy ra khi lưu địa chỉ!');
    }
}

// Đổi mật khẩu
function changePassword() {
    try {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }
        
        const userInfoStr = localStorage.getItem('currentUser') || sessionStorage.getItem('userInfo');
        if (!userInfoStr) {
            alert('Vui lòng đăng nhập!');
            return;
        }
        
        const userInfo = JSON.parse(userInfoStr);
        const userEmail = userInfo.email;
        
        // Kiểm tra mật khẩu hiện tại
        const userAccountKey = 'user_account_' + userEmail;
        const userAccountStr = localStorage.getItem(userAccountKey);
        
        if (!userAccountStr) {
            alert('Không tìm thấy tài khoản!');
            return;
        }
        
        const userAccount = JSON.parse(userAccountStr);
        
        // Kiểm tra mật khẩu hiện tại (trong thực tế nên hash password)
        if (userAccount.password !== currentPassword) {
            alert('Mật khẩu hiện tại không đúng!');
            return;
        }
        
        // Cập nhật mật khẩu mới
        userAccount.password = newPassword;
        localStorage.setItem(userAccountKey, JSON.stringify(userAccount));
        
        // Xóa các trường input
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        alert('Đổi mật khẩu thành công!');
    } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error);
        alert('Có lỗi xảy ra khi đổi mật khẩu!');
    }
}

// Xử lý đăng xuất
function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
        if (typeof logout === 'function') {
            logout();
        } else {
            // Fallback nếu hàm logout không có
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('userRole');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    }
}

// Lắng nghe thay đổi từ localStorage để tự động cập nhật đơn hàng
function setupOrderUpdateListener() {
    // Lắng nghe storage event (khi localStorage thay đổi từ tab/window khác)
    window.addEventListener('storage', function(e) {
        if (e.key === 'admin_orders') {
            // Chỉ reload nếu đang ở tab đơn hàng
            if (document.getElementById('orders-tab').classList.contains('active')) {
                loadOrders();
            }
        }
    });
    
    // Lắng nghe custom event (khi localStorage thay đổi trong cùng tab)
    // Tạo một proxy để lắng nghe thay đổi localStorage trong cùng tab
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        originalSetItem.apply(this, [key, value]);
        if (key === 'admin_orders') {
            window.dispatchEvent(new Event('localStorageChange'));
        }
    };
    
    window.addEventListener('localStorageChange', function() {
        if (document.getElementById('orders-tab').classList.contains('active')) {
            loadOrders();
        }
    });
}

// Xem chi tiết đơn hàng
function viewOrderDetail(orderId) {
    try {
        const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            alert('Không tìm thấy đơn hàng!');
            return;
        }
        
        const statusText = {
            'pending': 'Chờ xử lý',
            'processing': 'Đang xử lý',
            'shipped': 'Đang giao',
            'success': 'Hoàn thành',
            'completed': 'Hoàn thành',
            'cancelled': 'Đã hủy',
            'canceled': 'Đã hủy'
        };
        
        let detail = `═══════════════════════════════════\n`;
        detail += `CHI TIẾT ĐƠN HÀNG\n`;
        detail += `═══════════════════════════════════\n\n`;
        detail += `Mã đơn hàng: ${order.id}\n`;
        detail += `Ngày đặt: ${formatDate(order.date)}\n`;
        detail += `Trạng thái: ${statusText[order.status] || order.status}\n\n`;
        
        detail += `THÔNG TIN KHÁCH HÀNG:\n`;
        detail += `─────────────────────────────\n`;
        detail += `Họ tên: ${order.customer || 'N/A'}\n`;
        if (order.customerPhone) detail += `SĐT: ${order.customerPhone}\n`;
        if (order.customerEmail) detail += `Email: ${order.customerEmail}\n`;
        if (order.customerAddress) detail += `Địa chỉ: ${order.customerAddress}\n`;
        detail += `\n`;
        
        if (order.items && order.items.length > 0) {
            detail += `SẢN PHẨM:\n`;
            detail += `─────────────────────────────\n`;
            order.items.forEach((item, index) => {
                detail += `${index + 1}. ${item.name}\n`;
                detail += `   Số lượng: ${item.quantity}\n`;
                detail += `   Đơn giá: ${item.price.toLocaleString('vi-VN')}đ\n`;
                detail += `   Thành tiền: ${(item.price * item.quantity).toLocaleString('vi-VN')}đ\n\n`;
            });
        }
        
        detail += `─────────────────────────────\n`;
        detail += `TỔNG TIỀN: ${order.total.toLocaleString('vi-VN')}đ\n`;
        
        if (order.note) {
            detail += `\nGhi chú: ${order.note}\n`;
        }
        
        alert(detail);
    } catch (error) {
        console.error('Lỗi khi xem chi tiết đơn hàng:', error);
        alert('Có lỗi xảy ra khi xem chi tiết đơn hàng!');
    }
}

// Hủy đơn hàng
function cancelOrder(orderId) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
        return;
    }
    
    try {
        let orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) {
            alert('Không tìm thấy đơn hàng!');
            return;
        }
        
        const order = orders[orderIndex];
        
        // Chỉ cho phép hủy nếu đơn hàng đang ở trạng thái pending hoặc processing
        if (order.status !== 'pending' && order.status !== 'processing') {
            alert('Chỉ có thể hủy đơn hàng đang ở trạng thái "Chờ xử lý" hoặc "Đang xử lý"!');
            return;
        }
        
        // Cập nhật trạng thái đơn hàng thành "canceled" (thống nhất với admin)
        orders[orderIndex].status = 'canceled';
        localStorage.setItem('admin_orders', JSON.stringify(orders));
        
        // Trigger storage event để các tab khác cập nhật
        window.dispatchEvent(new Event('storage'));
        
        // Reload danh sách đơn hàng
        loadOrders();
        
        alert('Đã hủy đơn hàng thành công!');
    } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error);
        alert('Có lỗi xảy ra khi hủy đơn hàng!');
    }
}

