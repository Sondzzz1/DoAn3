// ==================== HÀM HELPER ĐỂ LẤY CART KEY THEO TÀI KHOẢN ====================
// Lấy email của người dùng hiện tại
function getCurrentUserEmail() {
    try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userInfo = JSON.parse(currentUser);
            return userInfo.email || null;
        }
        return null;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        return null;
    }
}

// Lấy key giỏ hàng dựa trên email của user
function getCartKey() {
    const email = getCurrentUserEmail();
    if (email) {
        return 'cart_' + email;
    }
    // Nếu chưa đăng nhập, không trả về key nào - yêu cầu đăng nhập
    return null;
}

// Kiểm tra xem có phải admin không
function isAdmin() {
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

//Gọi addToCart(item) để xử lý giỏ hàng.
function addToCartFromButton(button) {
    const productContainer = button.closest('.product-details');
    const quantityInput = productContainer.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value);

    const item = {
        id: button.getAttribute('data-id'),
        name: button.getAttribute('data-name'),
        price: parseInt(button.getAttribute('data-price')),
        image: button.getAttribute('data-image'),
        quantity: quantity
    };

    addToCart(item);
}

//cart là 1 cây trong localstorage dùng lưu trữ dữ liệu giỏ hàng ng dùng

//localStorage là một bộ nhớ lưu trữ cục bộ (local) của trình duyệt web, 
//Lấy giỏ hàng từ localStorage.
//Nếu có rồi:
//Kiểm tra xem sản phẩm đã tồn tại chưa
//Nếu có, cộng thêm số lượng.
//Nếu chưa, thêm sản phẩm mới.
//Sau đó cập nhật localStorage và gọi lại LoadData() để render lại giao diện.
function addToCart(item) {
    // Kiểm tra nếu là admin thì không cho mua hàng
    if (isAdmin()) {
        alert("⚠️ Tài khoản Admin không thể mua hàng. Vui lòng đăng xuất và đăng nhập bằng tài khoản khách hàng.");
        return;
    }
    
    // Kiểm tra nếu chưa đăng nhập
    const email = getCurrentUserEmail();
    if (!email) {
        alert("⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
        window.location.href = "DangNhap.html";
        return;
    }
    
    const cartKey = getCartKey();
    if (!cartKey) {
        alert("⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
        window.location.href = "DangNhap.html";
        return;
    }
    var list;
    if (localStorage.getItem(cartKey) == null) {
        list = [item];
    } else {
        list = JSON.parse(localStorage.getItem(cartKey)) || [];
        let found = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == item.id) {
                list[i].quantity += item.quantity;
                found = true;
                break;
            }
        }
        if (!found) {
            list.push(item);
        }
    }
    localStorage.setItem(cartKey, JSON.stringify(list));
    alert("🛒 Đã thêm sản phẩm vào giỏ hàng!");
    LoadData();
    
    // Cập nhật số lượng giỏ hàng ngay lập tức
    // Sử dụng requestAnimationFrame để đảm bảo DOM đã sẵn sàng
    requestAnimationFrame(function() {
        updateCartCount();
    });
    
    // Dispatch custom event để common.js có thể lắng nghe
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Gọi lại sau một chút để đảm bảo (fallback)
    setTimeout(function() {
        updateCartCount();
        // Gọi hàm từ common.js nếu có
        if (typeof window.capNhatSoLuongGioHang === 'function') {
            window.capNhatSoLuongGioHang();
        }
    }, 50);
    
    // Gọi lại lần nữa sau khi common.js đã load (nếu có)
    setTimeout(function() {
        updateCartCount();
        if (typeof window.capNhatSoLuongGioHang === 'function') {
            window.capNhatSoLuongGioHang();
        }
    }, 200);
}




function LoadData() {
    // Kiểm tra đăng nhập trước
    const email = getCurrentUserEmail();
    if (!email) {
        // Nếu chưa đăng nhập, xóa giỏ hàng cũ và không hiển thị gì
        localStorage.removeItem('cart'); // Xóa giỏ hàng cũ
        const listCartElement = document.getElementById("listCart");
        if (listCartElement) {
            listCartElement.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Vui lòng đăng nhập để xem giỏ hàng!</td></tr>';
        }
        updateCartCount();
        return;
    }
    
    // Lấy giỏ hàng theo tài khoản
    const cartKey = getCartKey();
    if (!cartKey) {
        return;
    }
    var list = JSON.parse(localStorage.getItem(cartKey)) || [];//Lấy dữ liệu giỏ hàng từ localStorage theo key của tài khoản.
    var str = "";
    var total = 0;
    for (let x of list) { 
        total += x.price * x.quantity;
        str += `<tr>
    <td>
        <i onclick="Xoa('${x.id}')" class="ti-trash" style="font-size:18px;color:red;cursor:pointer;" title="Xóa sản phẩm"></i>
    </td>
    <td><img src="${x.image}" style="width:50px;height:50px;border-radius:6px;"></td>
    <td class="ten-sp">${x.name}</td> <!-- 👈 -->
    <td class="gia-sp">${x.price.toLocaleString()}₫</td> <!-- 👈 -->
    <td class="sl-sp">
        <button onclick="Giam('${x.id}')" style="background-color:orange;border:none;border-radius:4px;padding:4px 8px;">-</button>
        <input id="q_${x.id}" type="number" value="${x.quantity}" onchange="updateQuantity('${x.id}')" style="width:40px;text-align:center;">
        <button onclick="Tang('${x.id}')" style="background-color:orange;border:none;border-radius:4px;padding:4px 8px;">+</button>
    </td>
    <td>${(x.price * x.quantity).toLocaleString()}₫</td>
</tr>`;

    }
    // Chỉ cập nhật bảng giỏ hàng nếu đang ở trang giỏ hàng
    const listCartElement = document.getElementById("listCart");
    if (listCartElement) {
        listCartElement.innerHTML = str;
    }
    
    if (document.getElementById("spTong")) {
        document.getElementById("spTong").innerText = total.toLocaleString() + "₫";
    }
    if (document.getElementById("tTong")) {
        document.getElementById("tTong").innerText = total.toLocaleString() + "₫";
    }
    
    // Luôn cập nhật số lượng hiển thị ở icon giỏ hàng
    updateCartCount();
}

function Xoa(id) {
    const cartKey = getCartKey();
    if (!cartKey) {
        alert("⚠️ Vui lòng đăng nhập!");
        return;
    }
    
    if (confirm("🗑️ Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?")) {
        var list = JSON.parse(localStorage.getItem(cartKey)) || [];
        list = list.filter(item => item.id !== id);
        localStorage.setItem(cartKey, JSON.stringify(list));//lưu lại giỏ hàng đã xóa sp vào localStorage
        LoadData(); // cập nhật lại bảng sau khi xóa
        updateCartCount(); // Cập nhật số lượng icon
        window.dispatchEvent(new CustomEvent('cartUpdated')); // Thông báo cho common.js
    }
}
function Giam(id) {
    const cartKey = getCartKey();
    if (!cartKey) {
        alert("⚠️ Vui lòng đăng nhập!");
        return;
    }
    
    var list = JSON.parse(localStorage.getItem(cartKey)) || [];
    var item = list.find(x => x.id == id);//tìm sản phẩm giỏ hàng theo id
    if (item && item.quantity > 1) {//kiểm tra xem sp có tồn tại và số lượng lớn hơn 1
        item.quantity -= 1;
    }
    localStorage.setItem(cartKey, JSON.stringify(list));//lưu lại giỏ hàng đã giảm số lượng sp vào localStorage
    LoadData();
    updateCartCount(); // Cập nhật số lượng icon
    window.dispatchEvent(new CustomEvent('cartUpdated')); // Thông báo cho common.js
}

function Tang(id) {
    const cartKey = getCartKey();
    if (!cartKey) {
        alert("⚠️ Vui lòng đăng nhập!");
        return;
    }
    
    var list = JSON.parse(localStorage.getItem(cartKey)) || [];
    var item = list.find(x => x.id == id);//tìm sản phẩm giỏ hàng theo id
    if (item) {
        item.quantity += 1;
    }
    localStorage.setItem(cartKey, JSON.stringify(list));
    LoadData();
    updateCartCount(); // Cập nhật số lượng icon
    window.dispatchEvent(new CustomEvent('cartUpdated')); // Thông báo cho common.js
}

function updateQuantity(id) {
    const cartKey = getCartKey();
    if (!cartKey) {
        alert("⚠️ Vui lòng đăng nhập!");
        return;
    }
    
    var list = JSON.parse(localStorage.getItem(cartKey)) || [];
    var item = list.find(x => x.id == id);
    if (item) {
        var qty = parseInt(document.getElementById("q_" + id).value);
        item.quantity = qty > 0 ? qty : 1;
    }
    localStorage.setItem(cartKey, JSON.stringify(list));
    LoadData();
    updateCartCount(); // Cập nhật số lượng icon
    window.dispatchEvent(new CustomEvent('cartUpdated')); // Thông báo cho common.js
}

function updateCart() {
    alert("✅ Giỏ hàng đã được cập nhật!");
    LoadData();
}

function XoaCart() {
    const cartKey = getCartKey();
    if (!cartKey) {
        alert("⚠️ Vui lòng đăng nhập!");
        return;
    }
    
    if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
        localStorage.removeItem(cartKey);
        LoadData();
        updateCartCount(); // Cập nhật số lượng icon
        window.dispatchEvent(new CustomEvent('cartUpdated')); // Thông báo cho common.js
    }
}
//hiển thị số lượng ở icon giỏ hàng
// Lấy giỏ hàng từ localStorage hoặc tạo mới nếu chưa có
function layGioHang() {
    return JSON.parse(localStorage.getItem('gioHang')) || [];
}

// Lưu lại giỏ hàng vào localStorage
function luuGioHang(gioHang) {
    localStorage.setItem('gioHang', JSON.stringify(gioHang));
}

// Thêm sản phẩm vào giỏ
function themVaoGioHang(maSanPham) {
    let gioHang = layGioHang();
    
    // Tìm sản phẩm trong giỏ
    let sanPham = gioHang.find(sp => sp.ma === maSanPham);
    
    if (sanPham) {
        sanPham.soLuong += 1;
    } else {
        gioHang.push({ ma: maSanPham, soLuong: 1 });
    }

    luuGioHang(gioHang);
    updateCartCount();
}

// Hàm helper để cập nhật số lượng giỏ hàng
// Gọi hàm từ common.js nếu có, nếu không thì dùng fallback
function updateCartCount() {
    try {
        // Kiểm tra đăng nhập trước
        const email = getCurrentUserEmail();
        if (!email) {
            // Chưa đăng nhập - ẩn số lượng giỏ hàng
            let cartCountElements = document.querySelectorAll(".cart-count");
            cartCountElements.forEach(el => {
                if (el) {
                    el.textContent = '0';
                    el.style.display = 'none';
                }
            });
            return;
        }
        
        // Lấy giỏ hàng từ localStorage theo tài khoản
        const cartKey = getCartKey();
        if (!cartKey) {
            return;
        }
        let list = JSON.parse(localStorage.getItem(cartKey) || '[]');
        let tongSoLuong = list.reduce((tong, sp) => tong + (sp.quantity || 0), 0);
        
        // Tìm tất cả các phần tử có class cart-count
        let cartCountElements = document.querySelectorAll(".cart-count");
        
        // Nếu không tìm thấy, thử tìm trong các phần tử có class cart
        if (cartCountElements.length === 0) {
            const cartContainers = document.querySelectorAll(".cart");
            const foundElements = [];
            cartContainers.forEach(container => {
                let countEl = container.querySelector(".cart-count");
                if (countEl) {
                    foundElements.push(countEl);
                }
            });
            if (foundElements.length > 0) {
                cartCountElements = foundElements;
            }
        }
        
        // Cập nhật số lượng cho tất cả các phần tử tìm được
        if (cartCountElements && cartCountElements.length > 0) {
            cartCountElements.forEach(el => {
                if (el) {
                    el.textContent = tongSoLuong;
                    el.innerText = tongSoLuong.toString(); // Đảm bảo cập nhật cả innerText
                    if (tongSoLuong > 0) {
                        el.style.display = 'inline-block';
                        el.style.visibility = 'visible';
                        el.style.opacity = '1';
                    } else {
                        el.style.display = 'none';
                    }
                }
            });
            console.log('Đã cập nhật số lượng giỏ hàng:', tongSoLuong, 'sản phẩm');
        } else {
            console.warn('Không tìm thấy phần tử .cart-count trên trang này');
        }
        
        // Gọi hàm từ common.js để đồng bộ (nếu có)
        if (typeof window.capNhatSoLuongGioHang === 'function') {
            window.capNhatSoLuongGioHang();
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng giỏ hàng:', error);
    }
}

// Alias để tương thích với code cũ
function capNhatSoLuongGioHang() {
    updateCartCount();
}

// Export hàm updateCartCount ra window để có thể gọi từ bất kỳ đâu
window.updateCartCount = updateCartCount;
window.capNhatSoLuongGioHang = capNhatSoLuongGioHang;

// Gọi khi trang load để cập nhật số lượng nếu đã có trong localStorage
document.addEventListener("DOMContentLoaded", function() {
    // Xóa giỏ hàng cũ (key 'cart') nếu có và chưa đăng nhập
    const email = getCurrentUserEmail();
    if (!email) {
        localStorage.removeItem('cart'); // Xóa giỏ hàng cũ
    }
    
    LoadData(); // nếu bác muốn load sản phẩm lên bảng
    // Đợi một chút để đảm bảo common.js đã load xong
    setTimeout(function() {
        updateCartCount();
    }, 200);
});

// Lấy sản phẩm từ bảng giỏ hàng
function getCartItems() {
    const rows = document.querySelectorAll("#listCart tr");//lấy tất cả các hàng trong bảng giỏ hàng
    let items = [];//Khởi tạo một mảng rỗng để chứa các sản phẩm sau khi lấy thông tin.

    rows.forEach(row => { //Lặp qua từng dòng sản phẩm (<tr>) trong bảng.
        const ten = row.querySelector(".ten-sp")?.innerText || ""; //Dấu ?. là optional chaining: Nếu không tìm thấy thì không lỗi mà trả về undefined.
        const gia = row.querySelector(".gia-sp")?.innerText || "0";
        const soLuong = row.querySelector(".sl-sp input")?.value || 1;//Lấy giá trị trong ô input số lượng nằm trong .sl-sp.
        //thêm sản phẩm vào mảng iteam  
        items.push({
            ten: ten,
            //parseInt(...): chuyển chuỗi thành số nguyên.
            gia: parseInt(gia.replace(/[^\d]/g, "")), // bỏ ký tự ₫
            soLuong: parseInt(soLuong),
        });
    });
    return items;
}
function ThanhToan() {
    // Kiểm tra nếu là admin thì không cho thanh toán
    if (isAdmin()) {
        alert("⚠️ Tài khoản Admin không thể mua hàng. Vui lòng đăng xuất và đăng nhập bằng tài khoản khách hàng.");
        return;
    }
    
    const cartKey = getCartKey();
    const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    if (cartItems.length === 0) {
        alert("⚠️ Giỏ hàng của bạn đang trống!");
        return;
    }
    
    localStorage.setItem("checkoutItems", JSON.stringify(cartItems)); // lưu riêng cho trang Thanh toán
    window.location.href = "ThanhToan.html";
}

