// File index.js - Xử lý phần Tác phẩm nổi bật và Tác phẩm bán chạy từ localStorage

// Lấy danh sách tranh từ localStorage
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

// Tạo một thẻ tác phẩm
function createArtworkCard(art) {
    const card = document.createElement('div');
    card.className = 'info-work';
    card.style.cursor = 'pointer';
    
    // Xử lý giá
    let priceHTML = '';
    if (art.originalPrice && art.originalPrice > art.price) {
        priceHTML = `
            <p class="price-old"><s>${Number(art.originalPrice).toLocaleString('vi-VN')}</s></p>
            <p class="price">${Number(art.price).toLocaleString('vi-VN')}</p>
        `;
    } else {
        priceHTML = `<p class="price">${Number(art.price).toLocaleString('vi-VN')}</p>`;
    }
    
    card.innerHTML = `
        <img src="${art.image || './assets/TrangNgoai/logo1.png'}" alt="${art.name || 'Tranh'}" 
             onerror="this.src='./assets/TrangNgoai/logo1.png'">
        <p class="category">${(art.category || 'TRANH SƠN DẦU').toUpperCase()}</p>
        <p class="name">${art.name || 'Chưa có tên'}</p>
        ${priceHTML}
    `;
    
    // Thêm click handler để chuyển đến trang chi tiết
    card.onclick = function() {
        window.location.href = 'product-detail.html?id=' + art.id;
    };
    
    return card;
}

// Load và hiển thị Tác phẩm nổi bật
function loadFeaturedArtworks() {
    const container = document.getElementById('slided');
    if (!container) return;
    
    const artworks = getArtworksFromStorage();
    
    // Nếu không có dữ liệu từ localStorage, không làm gì (giữ nguyên HTML có sẵn hoặc để trống)
    if (artworks.length === 0) {
        console.log('Không có dữ liệu từ localStorage cho Tác phẩm nổi bật');
        // Nếu container trống, có thể thêm thông báo hoặc để trống
        if (container.children.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Chưa có tác phẩm nổi bật</div>';
        }
        return;
    }
    
    // Lấy các tác phẩm nổi bật (có thể lọc theo featured flag hoặc lấy 8 tác phẩm đầu)
    // Giả sử có trường featured hoặc lấy 8 tác phẩm đầu tiên
    let featuredArtworks = artworks.filter(art => art.featured === true);
    
    // Nếu không có tác phẩm nào được đánh dấu featured, lấy 8 tác phẩm đầu tiên
    if (featuredArtworks.length === 0) {
        featuredArtworks = artworks.slice(0, 8);
    } else {
        featuredArtworks = featuredArtworks.slice(0, 8);
    }
    
    // Xóa tất cả các card cũ (trừ template nếu có)
    const existingCards = container.querySelectorAll('.info-work');
    existingCards.forEach(card => {
        if (!card.classList.contains('template-keep')) {
            card.remove();
        }
    });
    
    // Tạo và thêm các card mới
    featuredArtworks.forEach(art => {
        const card = createArtworkCard(art);
        container.appendChild(card);
    });
    
    // Khởi tạo lại slider sau khi thêm dữ liệu
    setTimeout(() => {
        initFeaturedSlider();
    }, 200);
}

// Tính số lượng đã bán cho mỗi tác phẩm từ đơn hàng
function calculateSoldQuantities() {
    try {
        const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        const soldQuantities = {}; // { artworkId: totalQuantity }
        
        // Duyệt qua tất cả đơn hàng
        orders.forEach(order => {
            // Chỉ tính các đơn hàng đã thành công (success, completed, delivered)
            // Hoặc có thể tính tất cả đơn hàng (bao gồm pending)
            if (order.status === 'success' || order.status === 'completed' || 
                order.status === 'delivered' || !order.status) {
                // Duyệt qua các sản phẩm trong đơn hàng
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach(item => {
                        const artworkId = item.id;
                        const quantity = item.quantity || 0;
                        
                        if (artworkId) {
                            if (!soldQuantities[artworkId]) {
                                soldQuantities[artworkId] = 0;
                            }
                            soldQuantities[artworkId] += quantity;
                        }
                    });
                }
            }
        });
        
        return soldQuantities;
    } catch (e) {
        console.error('Lỗi khi tính số lượng đã bán:', e);
        return {};
    }
}

// Load và hiển thị Tác phẩm bán chạy
function loadBestSellingArtworks() {
    const container = document.getElementById('slided-bestselling');
    if (!container) return;
    
    const artworks = getArtworksFromStorage();
    
    if (artworks.length === 0) {
        console.log('Không có dữ liệu từ localStorage cho Tác phẩm bán chạy');
        // Nếu container trống, có thể thêm thông báo hoặc để trống
        if (container.children.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Chưa có tác phẩm bán chạy</div>';
        }
        return;
    }
    
    // Tính số lượng đã bán từ đơn hàng thực tế
    const soldQuantities = calculateSoldQuantities();
    
    // Gán số lượng đã bán vào mỗi tác phẩm
    const artworksWithSales = artworks.map(art => {
        const soldQty = soldQuantities[art.id] || 0;
        return {
            ...art,
            soldQuantity: soldQty
        };
    });
    
    // Sắp xếp theo số lượng đã bán (giảm dần)
    // Nếu số lượng bằng nhau, sắp xếp theo giá (cao xuống thấp)
    let bestSelling = artworksWithSales.sort((a, b) => {
        const soldA = a.soldQuantity || 0;
        const soldB = b.soldQuantity || 0;
        
        // Ưu tiên sắp xếp theo số lượng đã bán
        if (soldB !== soldA) {
            return soldB - soldA;
        }
        
        // Nếu số lượng bằng nhau, sắp xếp theo giá (cao xuống thấp)
        return Number(b.price) - Number(a.price);
    });
    
    // Lọc chỉ lấy các tác phẩm đã có bán (soldQuantity > 0)
    // Nếu không có tác phẩm nào đã bán, lấy 8 tác phẩm đầu tiên (có thể là mới nhất hoặc theo giá)
    bestSelling = bestSelling.filter(art => art.soldQuantity > 0);
    
    if (bestSelling.length === 0) {
        // Nếu không có tác phẩm nào đã bán, lấy 8 tác phẩm đầu tiên
        bestSelling = artworksWithSales.slice(0, 8);
    } else {
        // Lấy top 8 tác phẩm bán chạy nhất
        bestSelling = bestSelling.slice(0, 8);
    }
    
    // Xóa tất cả các card cũ
    const existingCards = container.querySelectorAll('.info-work');
    existingCards.forEach(card => {
        if (!card.classList.contains('template-keep')) {
            card.remove();
        }
    });
    
    // Tạo và thêm các card mới
    bestSelling.forEach(art => {
        const card = createArtworkCard(art);
        container.appendChild(card);
    });
    
    // Khởi tạo lại slider sau khi thêm dữ liệu
    setTimeout(() => {
        initBestSellingSlider();
    }, 200);
}

// Khởi tạo slider cho Tác phẩm nổi bật
function initFeaturedSlider() {
    const slider = document.getElementById('slided');
    if (!slider) return;
    
    let slides = slider.querySelectorAll('.info-work');
    if (slides.length === 0) return;
    
    const totalSlides = slides.length;
    const visibleSlides = 4;
    
    // Kiểm tra nếu không đủ slides
    if (totalSlides === 0) return;
    
    const slideWidth = slides[0].offsetWidth;
    
    // Xóa các clone cũ nếu có
    const oldClones = slider.querySelectorAll('.clone');
    oldClones.forEach(clone => clone.remove());
    
    // Tạo clone cho hiệu ứng vô hạn
    if (totalSlides > visibleSlides) {
        for (let i = totalSlides - visibleSlides; i < totalSlides; i++) {
            let clone = slides[i].cloneNode(true);
            clone.classList.add('clone');
            slider.insertBefore(clone, slider.firstChild);
        }
        
        for (let i = 0; i < visibleSlides; i++) {
            let clone = slides[i].cloneNode(true);
            clone.classList.add('clone');
            slider.appendChild(clone);
        }
    }
    
    // Re-calculate slides after cloning
    slides = slider.querySelectorAll('.info-work');
    let currentIndex = visibleSlides;
    slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    
    // Cập nhật hàm Nextslide và Prevslide
    window.Nextslide = function() {
        if (slides.length === 0 || currentIndex >= slides.length - visibleSlides) return;
        currentIndex++;
        slider.style.transition = 'transform 0.4s ease';
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        
        slider.addEventListener('transitionend', () => {
            if (currentIndex === slides.length - visibleSlides) {
                slider.style.transition = 'none';
                currentIndex = visibleSlides;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }
        }, { once: true });
    };
    
    window.Prevslide = function() {
        if (slides.length === 0 || currentIndex <= 0) return;
        currentIndex--;
        slider.style.transition = 'transform 0.4s ease';
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        
        slider.addEventListener('transitionend', () => {
            if (currentIndex === 0) {
                slider.style.transition = 'none';
                currentIndex = slides.length - visibleSlides * 2;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }
        }, { once: true });
    };
}

// Khởi tạo slider cho Tác phẩm bán chạy
function initBestSellingSlider() {
    const slider = document.getElementById('slided-bestselling');
    if (!slider) return;
    
    let slides = slider.querySelectorAll('.info-work');
    if (slides.length === 0) return;
    
    const totalSlides = slides.length;
    const visibleSlides = 4;
    const slideWidth = slides[0].offsetWidth;
    
    // Xóa các clone cũ nếu có
    const oldClones = slider.querySelectorAll('.clone');
    oldClones.forEach(clone => clone.remove());
    
    // Tạo clone cho hiệu ứng vô hạn
    if (totalSlides > visibleSlides) {
        for (let i = totalSlides - visibleSlides; i < totalSlides; i++) {
            let clone = slides[i].cloneNode(true);
            clone.classList.add('clone');
            slider.insertBefore(clone, slider.firstChild);
        }
        
        for (let i = 0; i < visibleSlides; i++) {
            let clone = slides[i].cloneNode(true);
            clone.classList.add('clone');
            slider.appendChild(clone);
        }
    }
    
    // Re-calculate slides after cloning
    slides = slider.querySelectorAll('.info-work');
    let currentIndex = visibleSlides;
    slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    
    // Cập nhật hàm Nextslide và Prevslide cho best selling
    window.NextslideBestSelling = function() {
        if (currentIndex >= slides.length - visibleSlides) return;
        currentIndex++;
        slider.style.transition = 'transform 0.4s ease';
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        
        slider.addEventListener('transitionend', () => {
            if (currentIndex === slides.length - visibleSlides) {
                slider.style.transition = 'none';
                currentIndex = visibleSlides;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }
        }, { once: true });
    };
    
    window.PrevslideBestSelling = function() {
        if (currentIndex <= 0) return;
        currentIndex--;
        slider.style.transition = 'transform 0.4s ease';
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        
        slider.addEventListener('transitionend', () => {
            if (currentIndex === 0) {
                slider.style.transition = 'none';
                currentIndex = slides.length - visibleSlides * 2;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }
        }, { once: true });
    };
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Load Tác phẩm nổi bật
    loadFeaturedArtworks();
    
    // Load Tác phẩm bán chạy
    loadBestSellingArtworks();
    
    // Lắng nghe sự kiện storage để cập nhật khi dữ liệu thay đổi
    window.addEventListener('storage', function(e) {
        if (e.key === 'admin_artworks') {
            loadFeaturedArtworks();
            loadBestSellingArtworks();
        }
    });
});

