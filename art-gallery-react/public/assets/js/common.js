// ==================== RESPONSIVE MENU ====================
// Toggle menu khi bấm nút 3 gạch
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");

    toggleBtn?.addEventListener("click", () => {
        nav.classList.toggle("active");
    });

    // Mở submenu khi bấm vào mục có .subnav
    const navLinks = document.querySelectorAll("#nav > li > a");
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            const parent = this.parentElement;
            const hasSubnav = parent.querySelector(".subnav");

            if (hasSubnav && window.innerWidth <= 1024) {
                e.preventDefault(); // Ngăn chuyển trang
                parent.classList.toggle("active");

                // Đóng các menu khác
                document.querySelectorAll("#nav > li").forEach(li => {
                    if (li !== parent) li.classList.remove("active");
                });
            }
        });
    });
});

// ==================== TÌM KIẾM SẢN PHẨM ====================
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('homeSearchResults');
    const searchIcon = document.querySelector('.search-box .ti-search');

    if (searchInput && searchResults) {
        // 1. Sự kiện gõ phím
        searchInput.addEventListener('input', function(e) {
            const keyword = e.target.value.trim().toLowerCase();
            
            if (keyword === '') {
                searchResults.innerHTML = '';
                searchResults.classList.remove('active');
                return;
            }
            performSearch(keyword);
        });

        // 2. Sự kiện click ra ngoài thì đóng
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });

        // 3. Click icon kính lúp
        if (searchIcon) {
            searchIcon.addEventListener('click', () => searchInput.focus());
        }
    }

    // --- HÀM TÌM KIẾM ---
    function performSearch(keyword) {
        // Lấy dữ liệu thật từ localStorage
        const artworks = JSON.parse(localStorage.getItem('admin_artworks') || '[]');
        
        const results = artworks.filter(art => 
            art.name.toLowerCase().includes(keyword) || 
            art.author.toLowerCase().includes(keyword)
        );

        let htmlContent = '';

        if (artworks.length === 0) {
            htmlContent = `<div class="no-result">Kho dữ liệu trống.</div>`;
        } 
        else if (results.length > 0) {
            results.forEach(art => {
                const displayName = highlightKeyword(art.name, keyword);
                
                // QUAN TRỌNG: Kiểm tra xem có đường dẫn ảnh không, nếu không có dùng ảnh mặc định
                let imgPath = art.image; 
                if (!imgPath) imgPath = './assets/TrangNgoai/vuonhong.webp'; // Ảnh mặc định nếu dữ liệu trống

                htmlContent += `
                    <a href="#" class="search-result-item" onclick="goToDetail('${art.id}'); return false;">
                        <img src="${imgPath}" 
                             alt="${art.name}" 
                             class="item-thumb"
                             onerror="this.src='https://placehold.co/50x50?text=No+Img'"> 
                        
                        <div class="item-info">
                            <span class="item-name">${displayName}</span>
                            <span class="item-meta">${art.author} - ${parseInt(art.price).toLocaleString('vi-VN')}đ</span>
                        </div>
                    </a>
                `;
            });
        } else {
            htmlContent = `<div class="no-result">Không tìm thấy kết quả cho "${keyword}"</div>`;
        }
        
        searchResults.innerHTML = htmlContent;
        searchResults.classList.add('active');
    }

    // --- HÀM TÔ ĐẬM TỪ KHÓA ---
    function highlightKeyword(text, keyword) {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, `<span class="highlight">$1</span>`);
    }

    // --- CHUYỂN TRANG ---
    window.goToDetail = function(id) {
        // Lưu ID sản phẩm vào localStorage để trang chi tiết có thể load
        localStorage.setItem('selectedProductId', id);
        
        // Chuyển đến trang chi tiết sản phẩm
        window.location.href = 'product-detail.html?id=' + id;
        
        // Đóng dropdown và xóa input
        const searchResults = document.getElementById('homeSearchResults');
        const searchInput = document.getElementById('searchInput');
        if (searchResults) searchResults.classList.remove('active');
        if (searchInput) searchInput.value = '';
    }
});

// ==================== HIỂN THỊ THÔNG TIN NGƯỜI DÙNG ====================
// Hiển thị tên người dùng khi đã đăng nhập
document.addEventListener('DOMContentLoaded', function() {
    updateUserDisplay();
});

function updateUserDisplay() {
    try {
        // Lấy thông tin người dùng từ localStorage hoặc sessionStorage
        const userInfoStr = localStorage.getItem('currentUser') || sessionStorage.getItem('userInfo');
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('currentUser');
        
        // Tìm tất cả các link chứa icon user
        const userLinks = document.querySelectorAll('a[href*="DangKi"], a[href*="DangNhap"]');
        
        userLinks.forEach(link => {
            // Kiểm tra xem link có chứa icon user không
            const userIcon = link.querySelector('.ti-user');
            if (!userIcon) return;
            
            // Xóa phần hiển thị tên cũ nếu có
            const oldNameDisplay = link.querySelector('.user-name-display');
            if (oldNameDisplay) {
                oldNameDisplay.remove();
            }
            
            if (isLoggedIn && userInfoStr) {
                try {
                    const userInfo = JSON.parse(userInfoStr);
                    const userName = userInfo.name || 'Khách hàng';
                    
                    // Tạo phần hiển thị tên
                    const nameDisplay = document.createElement('span');
                    nameDisplay.className = 'user-name-display';
                    nameDisplay.textContent = userName;
                    nameDisplay.style.cssText = 'display: block; font-size: 11px; margin-top: 3px; color: #333; font-weight: 500; text-align: center; max-width: 80px; word-wrap: break-word; word-break: break-word; line-height: 1.3; white-space: normal;';
                    
                    // Thay đổi link để không chuyển đến trang đăng ký/đăng nhập
                    const originalHref = link.getAttribute('href');
                    link.setAttribute('data-original-href', originalHref);
                    link.href = 'javascript:void(0)';
                    link.style.cssText = 'display: flex; flex-direction: column; align-items: center; text-decoration: none; color: inherit; cursor: pointer; min-width: 60px; max-width: 90px;';
                    
                    // Thêm phần hiển thị tên vào link
                    link.appendChild(nameDisplay);
                    
                    // Thêm tooltip khi hover
                    link.title = `Xin chào, ${userName}! Click để xem thông tin tài khoản`;
                    
                    // Thêm sự kiện click để chuyển đến trang tài khoản
                    link.onclick = function(e) {
                        e.preventDefault();
                        window.location.href = 'TaiKhoan.html';
                    };
                } catch (error) {
                    console.error('Lỗi khi parse userInfo:', error);
                }
            } else {
                // Nếu chưa đăng nhập, khôi phục link gốc
                const originalHref = link.getAttribute('data-original-href');
                if (originalHref) {
                    link.href = originalHref;
                } else {
                    link.href = link.href.includes('DangKi') ? 'DangKi.html' : 'DangNhap.html';
                }
                link.style.cssText = '';
                link.onclick = null;
                link.title = '';
            }
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật hiển thị người dùng:', error);
    }
}

function logout() {
    // Xóa thông tin đăng nhập
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    
    // Cập nhật lại hiển thị
    updateUserDisplay();
    
    // Chuyển về trang chủ
    window.location.href = 'index.html';
}

// Export để có thể gọi từ nơi khác
window.updateUserDisplay = updateUserDisplay;
window.logout = logout;

// ==================== CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG ====================
// Hàm helper để lấy email của người dùng hiện tại
function getCurrentUserEmailForCart() {
    try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userInfo = JSON.parse(currentUser);
            return userInfo.email || null;
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Hàm helper để lấy cart key theo email
function getCartKeyForCommon() {
    const email = getCurrentUserEmailForCart();
    if (email) {
        return 'cart_' + email;
    }
    return null; // Không có cart key khi chưa đăng nhập
}

// Hàm cập nhật số lượng sản phẩm hiển thị trên icon giỏ hàng
function capNhatSoLuongGioHang() {
    try {
        // Kiểm tra đăng nhập trước
        const email = getCurrentUserEmailForCart();
        if (!email) {
            // Chưa đăng nhập - ẩn số lượng giỏ hàng và xóa giỏ hàng cũ
            localStorage.removeItem('cart'); // Xóa giỏ hàng cũ nếu có
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
        const cartKey = getCartKeyForCommon();
        if (!cartKey) {
            return;
        }
        let list = JSON.parse(localStorage.getItem(cartKey) || '[]');
        
        // Tính tổng số lượng sản phẩm trong giỏ hàng
        let tongSoLuong = list.reduce((tong, sp) => tong + (sp.quantity || 0), 0);
        
        // Tìm tất cả các phần tử có class cart-count (có thể có nhiều trang)
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
        
        // Debug: Log để kiểm tra
        console.log('Cập nhật giỏ hàng - Tổng số lượng:', tongSoLuong, 'Số phần tử tìm thấy:', cartCountElements.length);
        
        // Cập nhật số lượng cho tất cả các phần tử
        if (cartCountElements && cartCountElements.length > 0) {
            cartCountElements.forEach(el => {
                if (el) {
                    el.textContent = tongSoLuong;
                    el.innerText = tongSoLuong.toString(); // Đảm bảo cập nhật cả innerText
                    
                    // Ẩn/hiện badge dựa trên số lượng
                    if (tongSoLuong > 0) {
                        el.style.display = 'inline-block';
                        el.style.visibility = 'visible';
                        el.style.opacity = '1';
                    } else {
                        el.style.display = 'none';
                    }
                }
            });
        } else {
            // Nếu không tìm thấy phần tử nào, log cảnh báo
            console.warn('Không tìm thấy phần tử .cart-count trên trang này');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng giỏ hàng:', error);
    }
}

// Gọi khi trang load để cập nhật số lượng ban đầu
document.addEventListener('DOMContentLoaded', function() {
    // Xóa giỏ hàng cũ nếu chưa đăng nhập
    const email = getCurrentUserEmailForCart();
    if (!email) {
        localStorage.removeItem('cart'); // Xóa giỏ hàng cũ
    }
    capNhatSoLuongGioHang();
});

// Lắng nghe sự kiện storage để cập nhật khi giỏ hàng thay đổi từ tab/window khác
window.addEventListener('storage', function(e) {
    // Kiểm tra nếu key là cart hoặc cart_email
    if (e.key && (e.key === 'cart' || e.key.startsWith('cart_'))) {
        capNhatSoLuongGioHang();
    }
    // Cũng cập nhật khi currentUser thay đổi (đăng nhập/đăng xuất)
    if (e.key === 'currentUser') {
        capNhatSoLuongGioHang();
    }
});

// Lắng nghe custom event khi localStorage thay đổi trong cùng tab
// Tạo proxy để lắng nghe thay đổi localStorage trong cùng tab
(function() {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        originalSetItem.apply(this, [key, value]);
        if (key === 'cart') {
            // Dispatch custom event để các listener khác có thể lắng nghe
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    };
    
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function(key) {
        originalRemoveItem.apply(this, [key]);
        if (key === 'cart') {
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    };
})();

// Lắng nghe custom event cartUpdated
window.addEventListener('cartUpdated', function() {
    capNhatSoLuongGioHang();
});

// Export hàm để có thể gọi từ nơi khác (như cart.js)
window.capNhatSoLuongGioHang = capNhatSoLuongGioHang;

