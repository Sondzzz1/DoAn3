// ==================== XỬ LÝ ĐĂNG KÝ ====================
document.addEventListener("DOMContentLoaded", function () {
    // Chỉ xử lý form Đăng ký (Class: .register-form)
    const registerForm = document.querySelector('.register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Ngăn chặn gửi form mặc định

            // Lấy input - Giả định form Đăng ký có id="email" và id="phone"
            const emailInput = document.getElementById('email'); 
            const phoneInput = document.getElementById('phone');
            
            // Kiểm tra an toàn
            if (!emailInput || !phoneInput) {
                console.error("Thiếu input 'email' hoặc 'phone' trên form Đăng Ký.");
                alert("Form Đăng Ký bị thiếu trường dữ liệu.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
            const phonePattern = /^0[0-9]{9}$/; 

            if (!emailPattern.test(emailInput.value)) {
                alert('Vui lòng nhập đúng định dạng email (ví dụ: example@domain.com).');
                return;
            }

            if (!phonePattern.test(phoneInput.value)) {
                alert('Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.');
                return;
            }
            
            // Lấy thông tin từ form
            const fullnameInput = document.getElementById('fullname');
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const fullname = fullnameInput ? fullnameInput.value.trim() : '';
            
            // ⭐ Tự động thêm khách hàng vào admin
            try {
                let customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
                
                // Kiểm tra xem email hoặc số điện thoại đã tồn tại chưa
                const existingCustomer = customers.find(c => 
                    c.email === email || c.phone === phone
                );
                
                if (existingCustomer) {
                    alert('Email hoặc số điện thoại đã được đăng ký!');
                    return;
                }
                
                // Tạo ID mới cho khách hàng
                const newCustomerId = Date.now().toString();
                
                // Thêm khách hàng mới vào danh sách
                const newCustomer = {
                    id: newCustomerId,
                    name: fullname || 'Khách hàng',
                    phone: phone,
                    email: email,
                    address: '' // Địa chỉ sẽ được cập nhật khi đặt hàng
                };
                
                customers.push(newCustomer);
                localStorage.setItem('admin_customers', JSON.stringify(customers));
                
                // Lưu thông tin đăng nhập (đơn giản)
                const userAccount = {
                    email: email,
                    password: document.getElementById('password').value,
                    name: fullname,
                    phone: phone,
                    address: '' // Sẽ được cập nhật khi đặt hàng
                };
                localStorage.setItem('user_account_' + email, JSON.stringify(userAccount));
                
                // Lưu thông tin người dùng hiện tại để tự động điền form
                const currentUser = {
                    email: email,
                    name: fullname,
                    phone: phone,
                    address: '',
                    role: 'user'
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
            } catch (error) {
                console.error('Lỗi khi lưu thông tin khách hàng:', error);
            }
            
            // ⭐ Logic thành công: Chuyển hướng sau khi đăng ký thành công
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            window.location.href = "DangNhap.html";
        });
    }
});

// ==================== XỬ LÝ ĐĂNG NHẬP ====================
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('.login-form');
    
    // ⭐ Định nghĩa tài khoản để kiểm tra phân quyền 
    const ADMIN_EMAIL = 'admin@art.com'; 
    const ADMIN_PASSWORD = '123456'; 
    
    const USER_PAGE = 'index.html';      
    const ADMIN_PAGE = 'admin.html'; 

    if (form) { // Đảm bảo form tồn tại trước khi thêm listener
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // --- Kiểm tra định dạng và dữ liệu trống ---
            if (!emailPattern.test(emailInput.value)) {
                alert('Vui lòng nhập đúng định dạng email (ví dụ: mau@gmail.com).');
                return;
            }
            if (passwordInput.value.trim() === "") {
                alert("Vui lòng nhập mật khẩu.");
                return;
            }
            // ------------------------------------------

            // --- LOGIC PHÂN QUYỀN VÀ CHUYỂN HƯỚNG ---
            const enteredEmail = emailInput.value.trim();
            const enteredPassword = passwordInput.value;
            
            let redirectURL = null;
            let userRole = null;
            let userInfo = null;

            // Kiểm tra tài khoản Admin
            if (enteredEmail === ADMIN_EMAIL && enteredPassword === ADMIN_PASSWORD) {
                // Trường hợp 1: Tài khoản Admin hợp lệ
                userRole = 'admin';
                redirectURL = ADMIN_PAGE; // admin.html
                userInfo = {
                    email: ADMIN_EMAIL,
                    name: 'Admin',
                    role: 'admin'
                };
            } else {
                // Trường hợp 2: Kiểm tra tài khoản người dùng đã đăng ký
                try {
                    const userAccountKey = 'user_account_' + enteredEmail;
                    const savedAccount = localStorage.getItem(userAccountKey);
                    
                    if (savedAccount) {
                        const account = JSON.parse(savedAccount);
                        if (account.password === enteredPassword) {
                            // Đăng nhập thành công
                            userRole = 'user';
                            redirectURL = USER_PAGE; // index.html
                            
                            // Lấy thông tin khách hàng từ admin_customers nếu có
                            const customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
                            const customer = customers.find(c => c.email === enteredEmail || c.phone === account.phone);
                            
                            userInfo = {
                                email: account.email,
                                name: account.name || customer?.name || 'Khách hàng',
                                phone: account.phone || customer?.phone || '',
                                address: customer?.address || '',
                                role: 'user'
                            };
                        } else {
                            alert('Mật khẩu không đúng.');
                            return;
                        }
                    } else {
                        // Kiểm tra tài khoản mẫu cũ (để tương thích)
                        if (enteredEmail === 'user@art.com' && enteredPassword === '123456') {
                            userRole = 'user';
                            redirectURL = USER_PAGE;
                            userInfo = {
                                email: 'user@art.com',
                                name: 'Người dùng',
                                role: 'user'
                            };
                        } else {
                            alert('Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.');
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Lỗi khi kiểm tra tài khoản:', error);
                    alert('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
                    return;
                }
            }
            
            // --- LƯU TRẠNG THÁI VÀ THÔNG TIN NGƯỜI DÙNG ---
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userRole', userRole);
            if (userInfo) {
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                // Lưu vào localStorage để dùng ở các trang khác
                localStorage.setItem('currentUser', JSON.stringify(userInfo));
            }

            // --- CHUYỂN HƯỚNG ---
            // Cập nhật hiển thị người dùng trước khi chuyển trang
            if (typeof window.updateUserDisplay === 'function') {
                window.updateUserDisplay();
            }
            window.location.href = redirectURL;
        });
    }
});

// ==================== XỬ LÝ QUÊN MẬT KHẨU ====================
document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const passwordResult = document.getElementById('passwordResult');
    const errorMessage = document.getElementById('errorMessage');
    const displayPassword = document.getElementById('displayPassword');
    const copyPasswordBtn = document.getElementById('copyPassword');
    
    // Định nghĩa tài khoản Admin
    const ADMIN_EMAIL = 'admin@art.com';
    const ADMIN_PASSWORD = '123456';
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Ẩn các thông báo trước đó
            passwordResult.classList.add('hidden');
            errorMessage.classList.add('hidden');
            
            const emailInput = document.getElementById('forgotEmail');
            const email = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Kiểm tra định dạng email
            if (!emailPattern.test(email)) {
                showError('Vui lòng nhập đúng định dạng email (ví dụ: example@domain.com).');
                return;
            }
            
            // Kiểm tra email có tồn tại trong hệ thống không
            let foundPassword = null;
            let accountFound = false;
            
            try {
                // Kiểm tra tài khoản Admin
                if (email === ADMIN_EMAIL) {
                    foundPassword = ADMIN_PASSWORD;
                    accountFound = true;
                } else {
                    // Kiểm tra tài khoản người dùng đã đăng ký
                    const userAccountKey = 'user_account_' + email;
                    const savedAccount = localStorage.getItem(userAccountKey);
                    
                    if (savedAccount) {
                        const account = JSON.parse(savedAccount);
                        foundPassword = account.password;
                        accountFound = true;
                    } else {
                        // Kiểm tra tài khoản mẫu cũ (để tương thích)
                        if (email === 'user@art.com') {
                            foundPassword = '123456';
                            accountFound = true;
                        }
                    }
                }
                
                if (accountFound && foundPassword) {
                    // Hiển thị mật khẩu
                    displayPassword.value = foundPassword;
                    passwordResult.classList.remove('hidden');
                    forgotPasswordForm.style.display = 'none';
                    
                    // Scroll đến phần hiển thị mật khẩu
                    passwordResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    showError('Email này chưa được đăng ký trong hệ thống. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.');
                }
            } catch (error) {
                console.error('Lỗi khi tìm kiếm mật khẩu:', error);
                showError('Có lỗi xảy ra khi tìm kiếm mật khẩu. Vui lòng thử lại.');
            }
        });
    }
    
    // Xử lý nút sao chép mật khẩu
    if (copyPasswordBtn) {
        copyPasswordBtn.addEventListener('click', function () {
            if (displayPassword) {
                displayPassword.select();
                displayPassword.setSelectionRange(0, 99999); // Cho mobile
                
                try {
                    document.execCommand('copy');
                    
                    // Thay đổi icon tạm thời để báo hiệu đã sao chép
                    const originalHTML = copyPasswordBtn.innerHTML;
                    copyPasswordBtn.innerHTML = '<i class="ti-check"></i>';
                    copyPasswordBtn.style.backgroundColor = '#28a745';
                    
                    setTimeout(() => {
                        copyPasswordBtn.innerHTML = originalHTML;
                        copyPasswordBtn.style.backgroundColor = '';
                    }, 2000);
                    
                    // Thông báo (tùy chọn)
                    const notification = document.createElement('div');
                    notification.textContent = 'Đã sao chép mật khẩu!';
                    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 12px 20px; border-radius: 6px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                } catch (err) {
                    console.error('Lỗi khi sao chép:', err);
                    alert('Không thể sao chép tự động. Vui lòng sao chép thủ công.');
                }
            }
        });
    }
    
    // Hàm hiển thị lỗi
    function showError(message) {
        const errorText = document.getElementById('errorText');
        if (errorText) {
            errorText.textContent = message;
        }
        errorMessage.classList.remove('hidden');
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

