document.addEventListener("DOMContentLoaded", function () {
    const data = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    const orderBody = document.getElementById("orderSummary");
    const totalEl = document.getElementById("grandTotal");

    let total = 0;

    const totalRow = orderBody.querySelector(".total");

    data.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${item.image}" style="width:50px;height:50px;border-radius:6px;vertical-align:middle;margin-right:10px;">
                ${item.name} x${item.quantity}
            </td>
            <td>${itemTotal.toLocaleString()}đ</td>
        `;

        if (totalRow && totalRow.parentNode === orderBody) {
            orderBody.insertBefore(row, totalRow);
        } else {
            orderBody.appendChild(row);
        }
    });

    totalEl.textContent = total.toLocaleString() + "đ";
    
    // Tự động điền thông tin nếu người dùng đã đăng nhập
    autoFillUserInfo();
});

// Hàm tự động điền thông tin người dùng vào form thanh toán
function autoFillUserInfo() {
    try {
        // Lấy thông tin từ localStorage hoặc sessionStorage
        const userInfoStr = localStorage.getItem('currentUser') || sessionStorage.getItem('userInfo');
        
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            
            // Điền thông tin vào các trường input
            const nameInput = document.getElementById('checkoutName');
            const phoneInput = document.getElementById('checkoutPhone');
            const emailInput = document.getElementById('checkoutEmail');
            const addressInput = document.getElementById('checkoutAddress');
            
            if (nameInput && userInfo.name) {
                nameInput.value = userInfo.name;
            }
            
            if (phoneInput && userInfo.phone) {
                phoneInput.value = userInfo.phone;
            }
            
            if (emailInput && userInfo.email) {
                emailInput.value = userInfo.email;
            }
            
            if (addressInput && userInfo.address) {
                addressInput.value = userInfo.address;
            }
        }
    } catch (error) {
        console.error('Lỗi khi tự động điền thông tin:', error);
    }
}

// Hàm helper để kiểm tra admin
function isAdminInCheckout() {
    try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userInfo = JSON.parse(currentUser);
            return userInfo.role === 'admin' || 
                   userInfo.email === 'admin@art.com' || 
                   userInfo.email === 'admin@nghethuat.vn';
        }
        const userRole = sessionStorage.getItem('userRole');
        return userRole === 'admin';
    } catch (error) {
        return false;
    }
}

// Hàm helper để lấy cart key
function getCartKeyInCheckout() {
    try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userInfo = JSON.parse(currentUser);
            if (userInfo.email) {
                return 'cart_' + userInfo.email;
            }
        }
        return 'cart';
    } catch (error) {
        return 'cart';
    }
}

// Hàm xử lý đặt hàng
function placeOrder() {
    // Kiểm tra nếu là admin thì không cho đặt hàng
    if (isAdminInCheckout()) {
        alert("⚠️ Tài khoản Admin không thể mua hàng. Vui lòng đăng xuất và đăng nhập bằng tài khoản khách hàng.");
        return;
    }
    
    // Lấy thông tin từ form
    const name = document.getElementById('checkoutName')?.value.trim();
    const phone = document.getElementById('checkoutPhone')?.value.trim();
    const email = document.getElementById('checkoutEmail')?.value.trim();
    const address = document.getElementById('checkoutAddress')?.value.trim();
    const note = document.getElementById('checkoutNote')?.value.trim();
    
    // Kiểm tra thông tin bắt buộc
    if (!name || !phone || !address) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Số điện thoại, Địa chỉ)!');
        return;
    }
    
    // Lấy sản phẩm từ giỏ hàng
    const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    
    if (checkoutItems.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }
    
    // Tính tổng tiền
    let total = 0;
    checkoutItems.forEach(item => {
        total += item.price * item.quantity;
    });
    
    try {
        // 1. Thêm/cập nhật khách hàng vào admin_customers
        let customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
        let customer = customers.find(c => c.phone === phone || (email && c.email === email));
        
        if (!customer) {
            // Tạo khách hàng mới
            const newCustomerId = Date.now().toString();
            customer = {
                id: newCustomerId,
                name: name,
                phone: phone,
                email: email || '',
                address: address
            };
            customers.push(customer);
        } else {
            // Cập nhật thông tin khách hàng nếu có thay đổi
            customer.name = name;
            customer.address = address;
            if (email) customer.email = email;
        }
        localStorage.setItem('admin_customers', JSON.stringify(customers));
        
        // Cập nhật thông tin người dùng hiện tại trong localStorage
        try {
            const currentUserStr = localStorage.getItem('currentUser');
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                currentUser.name = name;
                currentUser.phone = phone;
                currentUser.email = email || currentUser.email;
                currentUser.address = address;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            // Cập nhật thông tin trong user_account nếu có
            if (email) {
                const userAccountKey = 'user_account_' + email;
                const userAccountStr = localStorage.getItem(userAccountKey);
                if (userAccountStr) {
                    const userAccount = JSON.parse(userAccountStr);
                    userAccount.name = name;
                    userAccount.phone = phone;
                    userAccount.address = address;
                    localStorage.setItem(userAccountKey, JSON.stringify(userAccount));
                }
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        }
        
        // 2. Tạo đơn hàng mới trong admin_orders
        let orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        
        // Tạo mã đơn hàng
        const orderId = 'DH' + String(Date.now()).slice(-6);
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        // Tạo đơn hàng với thông tin sản phẩm
        const newOrder = {
            id: orderId,
            customer: name,
            customerPhone: phone,
            customerEmail: email || '',
            customerAddress: address,
            date: today,
            status: 'pending',
            total: total,
            note: note || '',
            items: checkoutItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }))
        };
        
        orders.push(newOrder);
        localStorage.setItem('admin_orders', JSON.stringify(orders));
        
        // 3. Xóa giỏ hàng sau khi đặt hàng thành công (theo tài khoản)
        const cartKey = getCartKeyInCheckout();
        localStorage.removeItem(cartKey);
        localStorage.removeItem('checkoutItems');
        
        // 4. Thông báo và chuyển hướng
        alert(`Đặt hàng thành công!\nMã đơn hàng: ${orderId}\nTổng tiền: ${total.toLocaleString('vi-VN')}đ\n\nCảm ơn bạn đã mua hàng!`);
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Lỗi khi đặt hàng:', error);
        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
    }
}