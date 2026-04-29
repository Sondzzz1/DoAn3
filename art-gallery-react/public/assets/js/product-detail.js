// assets/js/product-detail.js
// Load product data from localStorage based on ID from URL

document.addEventListener('DOMContentLoaded', function() {
    // Lấy ID sản phẩm từ URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        document.getElementById('productContainer').innerHTML = 
            '<div style="text-align: center; padding: 50px;"><h2>Không tìm thấy sản phẩm</h2><p><a href="index.html">Về trang chủ</a></p></div>';
        return;
    }
    
    // Lấy danh sách sản phẩm từ localStorage
    function getArtworksFromStorage() {
        try {
            const raw = localStorage.getItem('admin_artworks');
            if (!raw) return [];
            const artworks = JSON.parse(raw);
            if (!Array.isArray(artworks)) return [];
            return artworks;
        } catch (e) {
            console.error('Lỗi đọc admin_artworks từ localStorage:', e);
            return [];
        }
    }
    
    // Tìm sản phẩm theo ID
    const artworks = getArtworksFromStorage();
    const product = artworks.find(art => art.id === productId);
    
    if (!product) {
        document.getElementById('productContainer').innerHTML = 
            '<div style="text-align: center; padding: 50px;"><h2>Không tìm thấy sản phẩm với ID: ' + productId + '</h2><p><a href="index.html">Về trang chủ</a></p></div>';
        return;
    }
    
    // Điền thông tin sản phẩm vào trang
    document.getElementById('productName').textContent = product.name || 'Chưa có tên';
    document.title = product.name || 'Chi tiết sản phẩm';
    
    document.getElementById('productCategory').textContent = product.category || 'Chưa có danh mục';
    document.getElementById('productAuthor').textContent = product.author || 'Chưa có tác giả';
    
    // Hiển thị kích thước nếu có
    if (product.size) {
        document.getElementById('productSize').style.display = 'block';
        document.getElementById('sizeText').textContent = product.size;
    }
    
    // Hiển thị chất liệu nếu có
    if (product.material) {
        document.getElementById('productMaterial').style.display = 'block';
        document.getElementById('materialText').textContent = product.material;
    }
    
    // Hiển thị chất liệu khung nếu có
    if (product.frameMaterial) {
        document.getElementById('productFrameMaterial').style.display = 'block';
        document.getElementById('frameMaterialText').textContent = product.frameMaterial;
    }
    
    // Hiển thị giá
    const price = product.price ? Number(product.price) : 0;
    document.getElementById('productPrice').textContent = 
        price.toLocaleString('vi-VN') + '₫';
    
    // Hiển thị ảnh
    const imgElement = document.getElementById('productImage');
    if (product.image) {
        imgElement.src = product.image;
        imgElement.alt = product.name || 'Tranh';
    } else {
        imgElement.src = './assets/TrangNgoai/logo1.png'; // Ảnh mặc định
    }
    
    // Cập nhật mô tả
    if (product.description) {
        document.getElementById('productDescription').innerHTML = 
            '<p>' + product.description.replace(/\n/g, '</p><p>') + '</p>';
    } else {
        document.getElementById('productDescription').innerHTML = 
            '<p>Chưa có mô tả cho sản phẩm này.</p>';
    }
    
    // Cập nhật nút thêm vào giỏ hàng
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.setAttribute('data-id', product.id);
    addToCartBtn.setAttribute('data-name', product.name || '');
    addToCartBtn.setAttribute('data-price', price);
    addToCartBtn.setAttribute('data-image', product.image || '');
    
    // Cập nhật nút mua ngay
    const buyNowBtn = document.getElementById('buyNowBtn') || document.querySelector('.btn-buy');
    if (buyNowBtn) {
        buyNowBtn.setAttribute('data-id', product.id);
        buyNowBtn.setAttribute('data-name', product.name || '');
        buyNowBtn.setAttribute('data-price', price);
        buyNowBtn.setAttribute('data-image', product.image || '');
        // Đảm bảo onclick gọi hàm buyNow
        buyNowBtn.setAttribute('onclick', 'buyNow(this); return false;');
    }
    
    // Load tác phẩm liên quan (cùng danh mục)
    loadRelatedProducts(product);
});

// Load tác phẩm liên quan
function loadRelatedProducts(currentProduct) {
    try {
        const raw = localStorage.getItem('admin_artworks');
        if (!raw) return;
        const artworks = JSON.parse(raw);
        if (!Array.isArray(artworks)) return;
        
        // Lọc các sản phẩm cùng danh mục, loại bỏ sản phẩm hiện tại
        // Chuẩn hóa danh mục để so sánh chính xác (ví dụ: "Tranh sơn mài" vs "Tranh Sơn Mài")
        const currentCategory = (currentProduct.category || '').trim();
        const related = artworks.filter(art => {
            const artCategory = (art.category || '').trim();
            return art.id !== currentProduct.id && 
                   artCategory.toLowerCase() === currentCategory.toLowerCase();
        }).slice(0, 8); // Lấy tối đa 8 sản phẩm
        
        const slider = document.getElementById('slider');
        if (!slider) return;
        
        if (related.length === 0) {
            slider.innerHTML = '<p style="text-align: center; padding: 20px;">Chưa có tác phẩm liên quan</p>';
            return;
        }
        
        let html = '';
        related.forEach(art => {
            html += `
                <div class="info-work" onclick="window.location.href='product-detail.html?id=${art.id}'" style="cursor: pointer;">
                    <img src="${art.image || './assets/TrangNgoai/logo1.png'}" alt="${art.name || 'Tranh'}" onerror="this.src='./assets/TrangNgoai/logo1.png'">
                    <p class="category">${(art.category || '').toUpperCase()}</p>
                    <p class="name">${art.name || 'Chưa có tên'}</p>
                    <div class="rating">★★★★★</div>
                </div>
            `;
        });
        
        slider.innerHTML = html;
        
        // Khởi tạo lại slider sau khi load xong tác phẩm liên quan
        // Đợi một chút để DOM cập nhật xong và ảnh load xong
        setTimeout(() => {
            if (typeof window.initRelatedProductsSlider === 'function') {
                window.initRelatedProductsSlider();
            }
        }, 300);
    } catch (e) {
        console.error('Lỗi load tác phẩm liên quan:', e);
    }
}

// Hàm xử lý "Mua ngay" - Thêm vào giỏ hàng và chuyển đến trang thanh toán
function buyNow(button) {
    try {
        // Kiểm tra đăng nhập trước
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert("⚠️ Vui lòng đăng nhập để mua hàng!");
            window.location.href = "DangNhap.html";
            return;
        }
        
        // Kiểm tra nếu là admin
        try {
            const userInfo = JSON.parse(currentUser);
            if (userInfo.role === 'admin' || userInfo.email === 'admin@art.com') {
                alert("⚠️ Tài khoản Admin không thể mua hàng. Vui lòng đăng xuất và đăng nhập bằng tài khoản khách hàng.");
                return;
            }
        } catch (e) {
            // Nếu không parse được, tiếp tục
        }
        
        // Lấy thông tin sản phẩm từ button hoặc từ các data attribute
        const productContainer = button.closest('.product-details');
        const quantityInput = productContainer ? productContainer.querySelector('.quantity-input') : document.getElementById('quantity');
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
        
        // Lấy thông tin từ data attributes
        const productId = button.getAttribute('data-id');
        const productName = button.getAttribute('data-name');
        const productPrice = parseInt(button.getAttribute('data-price')) || 0;
        const productImage = button.getAttribute('data-image') || '';
        
        // Validate dữ liệu
        if (!productId || !productName || productPrice <= 0) {
            alert("⚠️ Thông tin sản phẩm không hợp lệ. Vui lòng thử lại!");
            return;
        }
        
        // Tạo object sản phẩm
        const item = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        };
        
        // Thêm vào giỏ hàng (sử dụng hàm addToCart từ cart.js)
        if (typeof addToCart === 'function') {
            // Gọi hàm addToCart từ cart.js để thêm vào giỏ hàng
            addToCart(item);
        } else {
            // Fallback: Nếu hàm addToCart chưa load, lưu trực tiếp vào giỏ hàng
            if (typeof getCurrentUserEmail === 'function') {
                const email = getCurrentUserEmail();
                if (email) {
                    const cartKey = 'cart_' + email;
                    let cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
                    
                    // Kiểm tra sản phẩm đã có trong giỏ chưa
                    const existingItem = cartItems.find(cartItem => cartItem.id === productId);
                    if (existingItem) {
                        // Nếu đã có, cộng thêm số lượng
                        existingItem.quantity += quantity;
                    } else {
                        // Nếu chưa có, thêm mới
                        cartItems.push(item);
                    }
                    
                    localStorage.setItem(cartKey, JSON.stringify(cartItems));
                }
            } else {
                alert("⚠️ Hệ thống chưa sẵn sàng. Vui lòng thử lại sau vài giây!");
                return;
            }
        }
        
        // Lưu sản phẩm vào checkoutItems để trang thanh toán load
        // Tạo mảng chỉ chứa sản phẩm này với số lượng đã chọn
        const checkoutItems = [item];
        localStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
        
        // Chuyển đến trang thanh toán
        window.location.href = 'ThanhToan.html';
        
    } catch (error) {
        console.error('Lỗi khi mua ngay:', error);
        alert('⚠️ Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại!');
    }
}

// Export hàm để có thể gọi từ HTML
window.buyNow = buyNow;
