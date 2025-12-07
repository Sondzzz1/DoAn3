// ==================== KHỞI TẠO DỮ LIỆU ====================
// Khởi tạo dữ liệu mẫu nếu chưa có
function initData() {
    // Dữ liệu tranh
    if (!localStorage.getItem('admin_artworks')) {
        const sampleArtworks = [
            {
                id: '1',
                name: 'Hoa Sen Tĩnh Lặng',
                category: 'Thiên nhiên',
                price: 2500000,
                author: 'Trần Minh',
                quantity: 15,
                image: './assets/img/TranhVanGoh.jpg',
                size: '60x80 cm',
                material: 'Sơn dầu trên toan',
                description: 'Bức họa sen nhẹ nhàng giúp người xem thư giãn.'
            }
        ];
        localStorage.setItem('admin_artworks', JSON.stringify(sampleArtworks));
    }

    // Dữ liệu khách hàng
    if (!localStorage.getItem('admin_customers')) {
        const sampleCustomers = [
            {
                id: '1',
                name: 'Nguyễn Văn An',
                phone: '0987654321',
                email: 'an.nguyen@gmail.com',
                address: 'Hà Nội'
            }
        ];
        localStorage.setItem('admin_customers', JSON.stringify(sampleCustomers));
    }

    // Dữ liệu đơn hàng
    if (!localStorage.getItem('admin_orders')) {
        const sampleOrders = [
            {
                id: 'DH001',
                customer: 'Trần Minh',
                date: '2025-10-22',
                status: 'pending',
                total: 2450000,
                items: []
            },
            {
                id: 'DH002',
                customer: 'Nguyễn Hà',
                date: '2025-10-21',
                status: 'shipped',
                total: 1200000,
                items: []
            },
            {
                id: 'DH003',
                customer: 'Phạm Nam',
                date: '2025-10-20',
                status: 'success',
                total: 980000,
                items: []
            }
        ];
        localStorage.setItem('admin_orders', JSON.stringify(sampleOrders));
    }

    // Cài đặt
    if (!localStorage.getItem('admin_settings')) {
        const defaultSettings = {
            shopName: 'Nghệ Thuật',
            adminEmail: 'admin@nghethuat.vn',
            currencyUnit: 'VNĐ',
            primaryColor: '#ff7b00'
        };
        localStorage.setItem('admin_settings', JSON.stringify(defaultSettings));
    }
}



// 2. Hàm Xử lý "Hoạt động gần đây" (Phần HTML class="activity")
function loadRecentActivity(artworks, orders, customers) {
    const activityContainer = document.querySelector('.activity');
    if (!activityContainer) return;

    // Tạo danh sách hoạt động giả lập từ dữ liệu mới nhất
    let activities = [];

    // a. Lấy 1 Tranh mới nhất
    if (artworks.length > 0) {
        const lastArt = artworks[artworks.length - 1];
        activities.push({
            icon: 'ti-plus',
            color: 'text-primary', // Màu xanh (nếu có class css)
            text: `Thêm tranh “${lastArt.name}” vào hệ thống`,
            time: 'Vừa xong' // Giả lập thời gian
        });
    }

    // b. Lấy 1 Đơn hàng mới nhất
    if (orders.length > 0) {
        const lastOrder = orders[orders.length - 1];
        activities.push({
            icon: 'ti-shopping-cart',
            color: 'text-success', // Màu xanh lá
            text: `Đơn hàng #${lastOrder.id} vừa được tạo bởi ${lastOrder.customer}`,
            time: '1 phút trước'
        });
    }

    // c. Lấy 1 Khách hàng mới nhất
    if (customers.length > 0) {
        const lastCustomer = customers[customers.length - 1];
        activities.push({
            icon: 'ti-user',
            color: 'text-info',
            text: `Khách hàng “${lastCustomer.name}” vừa đăng ký tài khoản`,
            time: '5 phút trước'
        });
    }

    // d. Thêm một hoạt động ngẫu nhiên (Cập nhật giá) để danh sách dài hơn
    if (artworks.length > 1) {
        const randomArt = artworks[Math.floor(Math.random() * artworks.length)];
        activities.push({
            icon: 'ti-pencil-alt',
            color: 'text-warning',
            text: `Cập nhật giá cho tranh “${randomArt.name}”`,
            time: '10 phút trước'
        });
    }

    // Sắp xếp: Đưa đơn hàng lên đầu (ưu tiên hiển thị)
    // (Hoặc bạn có thể giữ nguyên thứ tự thêm vào)
    
    // Render ra HTML
    activityContainer.innerHTML = activities.map(act => `
        <div style="margin-bottom: 10px; font-size: 14px; border-bottom: 1px dashed #eee; padding-bottom: 5px;">
            <i class="${act.icon}" style="margin-right: 8px; width: 20px; display:inline-block;"></i> 
            ${act.text} 
            <span style="float:right; color: #888; font-size: 12px;">${act.time}</span>
        </div>
    `).join('');
}


// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Đảm bảo dữ liệu được khởi tạo
    initData();
    
    // Kiểm tra và khôi phục dữ liệu nếu cần
    try {
        // Kiểm tra xem localStorage có hoạt động không
        const testKey = 'admin_storage_test';
        localStorage.setItem(testKey, 'test');
        if (localStorage.getItem(testKey) !== 'test') {
            throw new Error('localStorage không hoạt động đúng cách');
        }
        localStorage.removeItem(testKey);
        
        // Đảm bảo dữ liệu được load lại
        renderArtTable(); // Hiển thị bảng tranh
        loadArtworks();
        loadCustomers();
        loadOrders();
        updateDashboard();
        loadSettings();
        applyThemeSettings(); // Áp dụng theme ngay khi load
        
        console.log('Đã khởi tạo và load dữ liệu thành công');
    } catch (error) {
        console.error('Lỗi khi khởi tạo dữ liệu:', error);
        alert('Cảnh báo: Có vấn đề với việc lưu trữ dữ liệu. Vui lòng kiểm tra cài đặt trình duyệt.');
    }
    
    // Đảm bảo dữ liệu được lưu trước khi đóng trang
    window.addEventListener('beforeunload', function(e) {
        // Kiểm tra xem có dữ liệu chưa lưu không (nếu cần)
        // localStorage tự động lưu, nhưng chúng ta có thể thêm logic kiểm tra ở đây
        try {
            // Đảm bảo tất cả dữ liệu đã được lưu
            const artworks = readArtworks();
            const customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
            const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
            
            // Xác nhận dữ liệu vẫn còn trong localStorage
            if (!localStorage.getItem('admin_artworks') || 
                !localStorage.getItem('admin_customers') || 
                !localStorage.getItem('admin_orders')) {
                console.warn('Cảnh báo: Một số dữ liệu có thể chưa được lưu');
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra dữ liệu trước khi đóng:', error);
        }
    });
    
    // Lưu dữ liệu định kỳ (mỗi 30 giây) để đảm bảo không mất dữ liệu
    setInterval(function() {
        try {
            // Đảm bảo dữ liệu hiện tại được lưu lại
            const artworks = readArtworks();
            writeArtworks(artworks); // Lưu lại để đảm bảo
            
            const customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
            localStorage.setItem('admin_customers', JSON.stringify(customers));
            
            const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
            localStorage.setItem('admin_orders', JSON.stringify(orders));
            
            console.log('Đã tự động lưu dữ liệu định kỳ');
        } catch (error) {
            console.error('Lỗi khi tự động lưu dữ liệu:', error);
        }
    }, 30000); // Mỗi 30 giây
    
    // Event listeners cho tìm kiếm
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', handleGlobalSearch);
    }
    
    // Event listener cho combobox lọc tranh theo chủ đề
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            console.log('Combobox đã thay đổi, giá trị mới:', this.value);
            filterArtworksAdmin();
        });
        console.log('Đã gắn event listener cho categoryFilter');
    } else {
        console.warn('Không tìm thấy categoryFilter khi trang load (có thể do phần art đang bị ẩn)');
    }
    
    // Lọc đơn hàng
    const statusSelect = document.getElementById('statusFilter');
    const dateInput = document.getElementById('dateFilter');
    const searchInput = document.getElementById('searchOrder');
    
    if (statusSelect) statusSelect.addEventListener('change', filterOrders);
    if (dateInput) dateInput.addEventListener('change', filterOrders);
    if (searchInput) searchInput.addEventListener('input', filterOrders);
    
    // Lắng nghe thay đổi từ localStorage để tự động cập nhật đơn hàng
    window.addEventListener('storage', function(e) {
        if (e.key === 'admin_orders') {
            // Chỉ reload nếu đang ở trang đơn hàng
            const ordersPage = document.getElementById('orders');
            if (ordersPage && !ordersPage.classList.contains('hidden')) {
                loadOrders();
                updateDashboard();
            }
        }
    });
    
    // Lắng nghe custom event cho cùng tab
    window.addEventListener('localStorageChange', function() {
        const ordersPage = document.getElementById('orders');
        if (ordersPage && !ordersPage.classList.contains('hidden')) {
            loadOrders();
            updateDashboard();
        }
    });
    
    // Tự động refresh đơn hàng mỗi 2 giây nếu đang ở trang đơn hàng
    setInterval(function() {
        const ordersPage = document.getElementById('orders');
        if (ordersPage && !ordersPage.classList.contains('hidden')) {
            loadOrders();
        }
    }, 2000);
});

// ==================== QUẢN LÝ TRANH ====================
// Storage helpers cho tranh
const STORAGE_KEY = 'admin_artworks';

function readArtworks() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.warn('Lỗi đọc localStorage:', error);
        return [];
    }
}

function writeArtworks(artworks) {
    try {
        const jsonData = JSON.stringify(artworks);
        localStorage.setItem(STORAGE_KEY, jsonData);
        
        // Xác nhận dữ liệu đã được lưu thành công
        const verify = localStorage.getItem(STORAGE_KEY);
        if (!verify || verify !== jsonData) {
            throw new Error('Dữ liệu không được lưu đúng cách');
        }
        
        console.log('Đã lưu tranh thành công:', artworks.length, 'tác phẩm');
        return true;
    } catch (error) {
        console.error('Lỗi khi lưu tranh vào localStorage:', error);
        alert('Lỗi khi lưu dữ liệu! Vui lòng thử lại. Lỗi: ' + error.message);
        return false;
    }
}

// Export hàm ra window để dùng ở nơi khác nếu cần
window.artworkStorage = {
    getAll: readArtworks,
    saveAll: writeArtworks
};

let editingArtId = null;
window.editingArtId = null;

function openArtForm(artId = null) {
    editingArtId = artId;
    window.editingArtId = artId;
    const modal = document.getElementById('artModal');
    const form = document.getElementById('artForm');
    const title = modal.querySelector('h3');
    
    if (artId) {
        title.textContent = 'Chỉnh sửa Tranh';
        const artworks = readArtworks();
        const art = artworks.find(a => a.id === artId);
        if (art) {
            document.getElementById('tenTranh').value = art.name || '';
            document.getElementById('danhMuc').value = art.category || '';
            document.getElementById('giaBan').value = art.price || '';
            document.getElementById('tacGia').value = art.author || '';
            document.getElementById('soLuongTon').value = art.quantity || 1;
            document.getElementById('anhTranh').value = art.image || '';
            document.getElementById('kichThuoc').value = art.size || '';
            document.getElementById('chatLieu').value = art.material || '';
            document.getElementById('chatLieuKhung').value = art.frameMaterial || '';
            document.getElementById('moTa').value = art.description || '';
        }
    } else {
        title.textContent = 'Thêm Tranh Mới';
        form.reset();
    }
    modal.classList.add('show');
}

function closeArtForm() {
    document.getElementById('artModal').classList.remove('show'); 
    editingArtId = null;
    window.editingArtId = null;
    document.getElementById('artForm').reset();
}

// HÀM LƯU TRANH CHÍNH THỨC (từ admin_sanpham.js)
window.saveArt = function() {
    const ten = document.getElementById('tenTranh')?.value.trim();
    const danhMuc = document.getElementById('danhMuc')?.value;
    const gia = document.getElementById('giaBan')?.value;
    const tacGia = document.getElementById('tacGia')?.value.trim();
    const tonKho = document.getElementById('soLuongTon')?.value || '1';
    const anh = document.getElementById('anhTranh')?.value.trim();
    const kichThuoc = document.getElementById('kichThuoc')?.value.trim();
    const chatLieu = document.getElementById('chatLieu')?.value.trim();
    const chatLieuKhung = document.getElementById('chatLieuKhung')?.value.trim();
    const moTa = document.getElementById('moTa')?.value.trim();

    if (!ten || !danhMuc || !gia || !tacGia || !anh) {
        alert('Vui lòng nhập đầy đủ các thông tin bắt buộc!');
        return;
    }

    const isEditing = typeof window.editingArtId !== 'undefined' && window.editingArtId !== null;
    const artworkId = isEditing ? window.editingArtId : Date.now().toString();
    
    const newArtwork = {
        id: artworkId,
        name: ten,
        category: danhMuc,
        price: Number(gia),
        image: anh,
        author: tacGia,
        quantity: Number(tonKho),
        description: moTa,
        size: kichThuoc,
        material: chatLieu,
        frameMaterial: chatLieuKhung
    };

    const artworks = readArtworks();
    
    if (isEditing) {
        const index = artworks.findIndex(a => a.id === artworkId);
        if (index !== -1) {
            artworks[index] = newArtwork;
        } else {
            artworks.push(newArtwork);
        }
        window.editingArtId = null;
    } else {
        artworks.push(newArtwork);
    }
    
    // Lưu dữ liệu và kiểm tra kết quả
    const saveSuccess = writeArtworks(artworks);
    if (!saveSuccess) {
        return; // Dừng lại nếu lưu không thành công
    }
    
    alert(isEditing ? 'Cập nhật tranh thành công!' : 'Đã thêm tác phẩm thành công!');
    closeArtForm();

    // Lấy giá trị bộ lọc hiện tại để giữ nguyên khi cập nhật bảng
    const categoryFilter = document.getElementById('categoryFilter');
    const currentFilter = categoryFilter ? categoryFilter.value : '';

    if (typeof renderArtTable === 'function') {
        renderArtTable(currentFilter);
    }
    if (typeof loadArtworks === 'function') {
        loadArtworks(currentFilter);
    }
    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
};

// HÀM HIỂN THỊ DANH SÁCH TRANH RA BẢNG ADMIN (từ admin_sanpham.js)
function renderArtTable(filterCategory = '') {
    const products = readArtworks();
    // Sử dụng selector chính xác hơn để tìm đúng bảng trong phần art
    const tableBody = document.querySelector('#art .art-table tbody') || document.querySelector('.art-table tbody');
    
    if (!tableBody) {
        console.warn('Không tìm thấy bảng tranh');
        return;
    }

    tableBody.innerHTML = '';

    // Lọc tranh theo category nếu có
    let filteredProducts = products;
    if (filterCategory && filterCategory !== '') {
        filteredProducts = products.filter(p => p.category === filterCategory);
    }

    if (filteredProducts.length === 0) {
        const message = filterCategory 
            ? `Không có tranh nào thuộc chủ đề "${filterCategory}". Hãy thêm mới!`
            : 'Chưa có tác phẩm nào. Hãy thêm mới!';
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px;">${message}</td></tr>`;
        return;
    }

    filteredProducts.forEach((product, index) => {
        const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
        
        const row = `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;"></td>
                <td style="font-weight: bold; color: #333;">${product.name}</td>
                <td>${product.category}</td>
                <td style="color: #d32f2f; font-weight: bold;">${priceFormatted}</td>
                <td>${product.author || product.artist || ''}</td>
                <td style="text-align: center;">${product.quantity || product.stock || 0}</td>
                <td style="text-align: center;">
                    <button class="btn-edit" onclick="openArtForm('${product.id}')" title="Sửa"><i class="ti-pencil"></i></button>
                    <button class="btn-delete" onclick="deleteArt('${product.id}')" title="Xóa" style="color: red;"><i class="ti-trash"></i></button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadArtworks(filterCategory = '') {
    try {
        const artworks = readArtworks();
        console.log('Tổng số tranh:', artworks.length);
        console.log('Đang lọc theo:', filterCategory || 'Tất cả');
        
        const tbody = document.querySelector('#art .art-table tbody');
        
        if (!tbody) {
            console.error('Không tìm thấy tbody của bảng tranh');
            return;
        }
        
        // Lọc tranh theo category nếu có
        let filteredArtworks = artworks;
        if (filterCategory && filterCategory !== '') {
            filteredArtworks = artworks.filter(art => {
                const match = art.category === filterCategory;
                if (!match) {
                    console.log(`Tranh "${art.name}" có category "${art.category}" không khớp với "${filterCategory}"`);
                }
                return match;
            });
        }
        
        console.log('Số tranh sau khi lọc:', filteredArtworks.length);
        
        if (filteredArtworks.length === 0) {
            const message = filterCategory 
                ? `Không có tranh nào thuộc chủ đề "${filterCategory}". Hãy thêm mới!`
                : 'Chưa có tác phẩm nào. Hãy thêm mới!';
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px;">${message}</td></tr>`;
            return;
        }
        
        tbody.innerHTML = filteredArtworks.map(art => {
            // Xử lý giá tiền an toàn
            const price = art.price ? Number(art.price).toLocaleString('vi-VN') : '0';
            
            return `
            <tr>
                <td><img src="${art.image || ''}" alt="${art.name || ''}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;" onerror="this.src='./assets/TrangNgoai/logo1.png'"></td>
                <td>${art.name || 'Chưa có tên'}</td>
                <td>${art.category || 'Chưa phân loại'}</td>
                <td>${price} VNĐ</td>
                <td>${art.author || 'Chưa có'}</td>
                <td>${art.quantity || 0}</td>
                <td>
                    <button class="edit-btn" onclick="openArtForm('${art.id}')"><i class="ti-pencil"></i></button>
                    <button class="delete-btn" onclick="deleteArt('${art.id}')"><i class="ti-trash"></i></button>
                </td>
            </tr>
        `;
        }).join('');
        
        console.log('Đã cập nhật bảng tranh thành công');
    } catch (error) {
        console.error('Lỗi trong loadArtworks:', error);
        alert('Có lỗi xảy ra khi tải tranh: ' + error.message);
    }
}

// Hàm lọc tranh theo chủ đề (admin)
window.filterArtworksAdmin = function() {
    try {
        console.log('=== BẮT ĐẦU LỌC TRANH ===');
        
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) {
            console.error('❌ Không tìm thấy categoryFilter element');
            alert('Không tìm thấy bộ lọc. Vui lòng tải lại trang.');
            return;
        }
        
        const selectedCategory = categoryFilter.value || '';
        console.log('✅ Đã chọn chủ đề:', selectedCategory || 'Tất cả');
        
        // Kiểm tra xem phần art có đang hiển thị không
        const artSection = document.getElementById('art');
        if (!artSection) {
            console.error('❌ Không tìm thấy phần art');
            return;
        }
        
        // Đảm bảo phần art đang hiển thị (không bị hidden)
        if (artSection.classList.contains('hidden')) {
            console.log('⚠️ Phần art đang bị ẩn, nhưng vẫn sẽ cập nhật bảng');
        }
        
        // Cập nhật bảng tranh với bộ lọc
        console.log('🔄 Đang gọi loadArtworks với filter:', selectedCategory);
        loadArtworks(selectedCategory);
        
        console.log('✅ Hoàn thành lọc tranh');
    } catch (error) {
        console.error('❌ Lỗi khi lọc tranh:', error);
        console.error('Stack trace:', error.stack);
        alert('Có lỗi xảy ra khi lọc tranh. Vui lòng mở Console (F12) để xem chi tiết lỗi.\n\nLỗi: ' + error.message);
    }
}

// Giữ lại tên cũ để tương thích
window.filterArtworks = window.filterArtworksAdmin;

// Hàm test để kiểm tra dữ liệu tranh
window.testArtData = function() {
    const artworks = readArtworks();
    console.log('=== KIỂM TRA DỮ LIỆU TRANH ===');
    console.log('Tổng số tranh:', artworks.length);
    
    if (artworks.length === 0) {
        console.warn('⚠️ Không có tranh nào trong hệ thống!');
        return;
    }
    
    const categories = {};
    artworks.forEach(art => {
        const cat = art.category || 'Chưa có category';
        categories[cat] = (categories[cat] || 0) + 1;
    });
    
    console.log('Các category có trong dữ liệu:');
    Object.keys(categories).forEach(cat => {
        console.log(`  - "${cat}": ${categories[cat]} tranh`);
    });
    
    console.log('\nCác category có thể lọc:');
    console.log('  - "Tranh sơn dầu"');
    console.log('  - "Tranh sơn mài"');
    console.log('  - "Tranh cổ điển"');
    
    const validCategories = ['Tranh sơn dầu', 'Tranh sơn mài', 'Tranh cổ điển'];
    const hasValidCategory = artworks.some(art => validCategories.includes(art.category));
    
    if (!hasValidCategory) {
        console.warn('⚠️ KHÔNG CÓ TRANH NÀO CÓ CATEGORY ĐÚNG!');
        console.warn('Bạn cần thêm tranh với category là một trong: "Tranh sơn dầu", "Tranh sơn mài", "Tranh cổ điển"');
    } else {
        console.log('✅ Có tranh với category hợp lệ');
    }
}

// HÀM XÓA TRANH (từ admin_sanpham.js)
window.deleteArt = function(id) {
    if(confirm('Bạn có chắc muốn xóa tác phẩm này không?')) {
        try {
            let products = readArtworks();
            products = products.filter(p => p.id !== id);
            
            const saveSuccess = writeArtworks(products);
            if (!saveSuccess) {
                return; // Dừng lại nếu lưu không thành công
            }
            
            // Lấy giá trị bộ lọc hiện tại để giữ nguyên khi cập nhật bảng
            const categoryFilter = document.getElementById('categoryFilter');
            const currentFilter = categoryFilter ? categoryFilter.value : '';
            
            if (typeof renderArtTable === 'function') {
                renderArtTable(currentFilter);
            }
            if (typeof loadArtworks === 'function') {
                loadArtworks(currentFilter);
            }
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            alert('Đã xóa tranh thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa tranh:', error);
            alert('Lỗi khi xóa tranh! Vui lòng thử lại.');
        }
    }
}

// ==================== QUẢN LÝ KHÁCH HÀNG ====================
let editingCustomerId = null;

function openCustomerForm(customerId = null) {
    editingCustomerId = customerId;
    const modal = document.getElementById('customerModal');
    const form = document.getElementById('customerForm');
    const title = modal.querySelector('h3');
    
    if (customerId) {
        title.textContent = 'Chỉnh sửa Khách hàng';
        const customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
            document.getElementById('tenKhachHang').value = customer.name;
            document.getElementById('sdtKhachHang').value = customer.phone;
            document.getElementById('emailKhachHang').value = customer.email;
            document.getElementById('diaChiKhachHang').value = customer.address;
        }
    } else {
        title.textContent = 'Thêm Khách Hàng Mới';
        form.reset();
    }
    modal.classList.add('show');
}

function closeCustomerForm() {
    document.getElementById('customerModal').classList.remove('show');
    editingCustomerId = null;
    document.getElementById('customerForm').reset();
}

function saveCustomer() {
    const name = document.getElementById('tenKhachHang').value;
    const phone = document.getElementById('sdtKhachHang').value;
    const email = document.getElementById('emailKhachHang').value;
    const address = document.getElementById('diaChiKhachHang').value;

    if (!name || !phone || !email || !address) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    try {
        let customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
        
        if (editingCustomerId) {
            const index = customers.findIndex(c => c.id === editingCustomerId);
            if (index !== -1) {
                customers[index] = { ...customers[index], name, phone, email, address };
            }
        } else {
            const newId = Date.now().toString();
            customers.push({ id: newId, name, phone, email, address });
        }

        // Lưu với error handling
        const jsonData = JSON.stringify(customers);
        localStorage.setItem('admin_customers', jsonData);
        
        // Xác nhận đã lưu thành công
        const verify = localStorage.getItem('admin_customers');
        if (!verify || verify !== jsonData) {
            throw new Error('Dữ liệu không được lưu đúng cách');
        }
        
        alert(editingCustomerId ? 'Cập nhật khách hàng thành công!' : 'Thêm khách hàng thành công!');
        closeCustomerForm();
        loadCustomers();
        updateDashboard();
    } catch (error) {
        console.error('Lỗi khi lưu khách hàng:', error);
        alert('Lỗi khi lưu dữ liệu! Vui lòng thử lại. Lỗi: ' + error.message);
    }
}

function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
    const tbody = document.querySelector('#customers .customer-table tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${customer.address}</td>
            <td>
                <button class="edit-btn" onclick="openCustomerForm('${customer.id}')"><i class="ti-pencil"></i></button>
                <button class="delete-btn" onclick="deleteCustomer('${customer.id}')"><i class="ti-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function deleteCustomer(id) {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
        try {
            let customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
            customers = customers.filter(c => c.id !== id);
            
            const jsonData = JSON.stringify(customers);
            localStorage.setItem('admin_customers', jsonData);
            
            // Xác nhận đã lưu thành công
            const verify = localStorage.getItem('admin_customers');
            if (!verify || verify !== jsonData) {
                throw new Error('Dữ liệu không được lưu đúng cách');
            }
            
            loadCustomers();
            updateDashboard();
            alert('Đã xóa khách hàng thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa khách hàng:', error);
            alert('Lỗi khi xóa khách hàng! Vui lòng thử lại.');
        }
    }
}

// ==================== QUẢN LÝ ĐỚN HÀNG ====================
let editingOrderId = null;

function openInvoiceForm(orderId = null) {
    editingOrderId = orderId;
    const modal = document.getElementById('invoiceModal');
    modal.classList.add('show');
    
    if (orderId) {
        // Chỉnh sửa đơn hàng
        const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        if (order) {
            document.getElementById('maHD').value = order.id;
            document.getElementById('tenKH').value = order.customer;
            document.getElementById('ngayLap').value = order.date;
            document.getElementById('tongTien').value = order.total;
            document.getElementById('maHD').disabled = true;
        }
    } else {
        // Tạo mới
        document.getElementById('invoiceForm').reset();
        document.getElementById('maHD').disabled = false;
        document.getElementById('maHD').value = 'DH' + String(Date.now()).slice(-6);
        document.getElementById('ngayLap').value = new Date().toISOString().split('T')[0];
    }
}

function closeInvoiceForm() {
    document.getElementById('invoiceModal').classList.remove('show');
    editingOrderId = null;
    document.getElementById('invoiceForm').reset();
    document.getElementById('maHD').disabled = false;
}

function saveInvoice() {
    const id = document.getElementById('maHD').value;
    const customer = document.getElementById('tenKH').value;
    const date = document.getElementById('ngayLap').value;
    const total = parseInt(document.getElementById('tongTien').value);

    if (!id || !customer || !date || !total) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    try {
        let orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        
        // Kiểm tra nếu đang chỉnh sửa
        if (editingOrderId) {
            const existingIndex = orders.findIndex(o => o.id === editingOrderId);
            if (existingIndex !== -1) {
                orders[existingIndex] = { ...orders[existingIndex], customer, date, total };
            } else {
                alert('Không tìm thấy đơn hàng để cập nhật!');
                return;
            }
        } else {
            // Kiểm tra xem ID đã tồn tại chưa (tránh trùng lặp)
            const existingIndex = orders.findIndex(o => o.id === id);
            if (existingIndex !== -1) {
                alert('Mã đơn hàng đã tồn tại! Vui lòng sử dụng mã khác.');
                return;
            }
            orders.push({ id, customer, date, status: 'pending', total, items: [] });
        }

        // Lưu với error handling
        const jsonData = JSON.stringify(orders);
        localStorage.setItem('admin_orders', jsonData);
        
        // Xác nhận đã lưu thành công
        const verify = localStorage.getItem('admin_orders');
        if (!verify || verify !== jsonData) {
            throw new Error('Dữ liệu không được lưu đúng cách');
        }
        
        alert(editingOrderId ? 'Cập nhật đơn hàng thành công!' : 'Tạo đơn hàng thành công!');
        closeInvoiceForm();
        loadOrders();
        updateDashboard();
    } catch (error) {
        console.error('Lỗi khi lưu đơn hàng:', error);
        alert('Lỗi khi lưu dữ liệu! Vui lòng thử lại. Lỗi: ' + error.message);
    }
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const tbody = document.querySelector('#orders .styled-table tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = orders.map(order => {
        const statusText = {
            'pending': 'Chờ xử lý',
            'shipped': 'Đang giao',
            'success': 'Hoàn tất',
            'canceled': 'Đã hủy',
            'cancelled': 'Đã hủy'
        };
        const statusClass = order.status;
        
        // Kiểm tra xem đơn hàng đã bị hủy chưa (hỗ trợ cả 'canceled' và 'cancelled')
        const isCancelled = order.status === 'canceled' || order.status === 'cancelled';
        
        return `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${formatDate(order.date)}</td>
                <td><span class="status ${statusClass}">${statusText[order.status] || order.status}</span></td>
                <td>${order.total.toLocaleString('vi-VN')}đ</td>
                <td>
                    <button class="edit" onclick="viewOrder('${order.id}')" title="Xem chi tiết"><i class="ti-eye"></i></button>
                    ${!isCancelled ? `
                        <button class="edit" onclick="openInvoiceForm('${order.id}')" title="Chỉnh sửa"><i class="ti-pencil"></i></button>
                    ` : `
                        <button class="edit" disabled style="opacity: 0.5; cursor: not-allowed;" title="Không thể chỉnh sửa đơn hàng đã hủy"><i class="ti-pencil"></i></button>
                    `}
                    <select 
                        onchange="updateOrderStatus('${order.id}', this.value)" 
                        style="padding: 4px; border-radius: 4px; margin-left: 5px; ${isCancelled ? 'opacity: 0.6; cursor: not-allowed; background-color: #f5f5f5;' : ''}"
                        ${isCancelled ? 'disabled title="Đơn hàng đã hủy, không thể thay đổi trạng thái"' : ''}
                    >
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Đang giao</option>
                        <option value="success" ${order.status === 'success' ? 'selected' : ''}>Hoàn tất</option>
                        <option value="canceled" ${order.status === 'canceled' || order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                    <button class="delete" onclick="deleteOrder('${order.id}')" title="Xóa"><i class="ti-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateOrderStatus(orderId, newStatus) {
    try {
        let orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            alert('Không tìm thấy đơn hàng!');
            return;
        }
        
        // Kiểm tra xem đơn hàng đã bị hủy chưa
        const isCancelled = order.status === 'canceled' || order.status === 'cancelled';
        
        if (isCancelled) {
            alert('Đơn hàng đã bị hủy, không thể thay đổi trạng thái!');
            // Reload lại để đảm bảo select box vẫn ở trạng thái disabled
            loadOrders();
            return;
        }
        
        // Cập nhật trạng thái
        order.status = newStatus;
        
        const jsonData = JSON.stringify(orders);
        localStorage.setItem('admin_orders', jsonData);
        
        // Xác nhận đã lưu thành công
        const verify = localStorage.getItem('admin_orders');
        if (!verify || verify !== jsonData) {
            throw new Error('Dữ liệu không được lưu đúng cách');
        }
        
        loadOrders();
        updateDashboard();
        
        // Thông báo thành công
        const statusText = {
            'pending': 'Chờ xử lý',
            'shipped': 'Đang giao',
            'success': 'Hoàn tất',
            'canceled': 'Đã hủy',
            'cancelled': 'Đã hủy'
        };
        
        console.log(`Đã cập nhật trạng thái đơn hàng ${orderId} thành: ${statusText[newStatus] || newStatus}`);
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        alert('Lỗi khi cập nhật trạng thái! Vui lòng thử lại.');
    }
}

function viewOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (order) {
        let orderDetails = `Chi tiết đơn hàng:\n\nMã đơn: ${order.id}\nKhách hàng: ${order.customer}`;
        if (order.customerPhone) orderDetails += `\nSĐT: ${order.customerPhone}`;
        if (order.customerEmail) orderDetails += `\nEmail: ${order.customerEmail}`;
        if (order.customerAddress) orderDetails += `\nĐịa chỉ: ${order.customerAddress}`;
        orderDetails += `\nNgày đặt: ${formatDate(order.date)}\nTổng tiền: ${order.total.toLocaleString('vi-VN')}đ\nTrạng thái: ${order.status}`;
        
        // Hiển thị danh sách sản phẩm
        if (order.items && order.items.length > 0) {
            orderDetails += `\n\nSản phẩm:\n`;
            order.items.forEach((item, index) => {
                orderDetails += `${index + 1}. ${item.name} - ${item.quantity}x - ${(item.price * item.quantity).toLocaleString('vi-VN')}đ\n`;
            });
        }
        
        if (order.note) {
            orderDetails += `\nGhi chú: ${order.note}`;
        }
        
        alert(orderDetails);
    }
}

function deleteOrder(id) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
        try {
            let orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
            orders = orders.filter(o => o.id !== id);
            
            const jsonData = JSON.stringify(orders);
            localStorage.setItem('admin_orders', jsonData);
            
            // Xác nhận đã lưu thành công
            const verify = localStorage.getItem('admin_orders');
            if (!verify || verify !== jsonData) {
                throw new Error('Dữ liệu không được lưu đúng cách');
            }
            
            loadOrders();
            updateDashboard();
            alert('Đã xóa đơn hàng thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
            alert('Lỗi khi xóa đơn hàng! Vui lòng thử lại.');
        }
    }
}

// Lọc đơn hàng
function filterOrders() {
    const statusFilter = document.getElementById('statusFilter')?.value || 'Tất cả';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    const searchFilter = document.getElementById('searchOrder')?.value.toLowerCase() || '';
    
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const tbody = document.querySelector('#orders .styled-table tbody');
    
    if (!tbody) return;
    
    let filtered = orders.filter(order => {
        // Hỗ trợ lọc cả 'canceled' và 'cancelled'
        const orderStatus = order.status === 'cancelled' ? 'canceled' : order.status;
        const filterStatus = statusFilter === 'cancelled' ? 'canceled' : statusFilter;
        
        const matchStatus = statusFilter === 'Tất cả' || orderStatus === filterStatus || 
                           (statusFilter === 'canceled' && (order.status === 'canceled' || order.status === 'cancelled'));
        const matchDate = !dateFilter || order.date === dateFilter;
        const matchSearch = !searchFilter || 
            order.id.toLowerCase().includes(searchFilter) || 
            order.customer.toLowerCase().includes(searchFilter);
        
        return matchStatus && matchDate && matchSearch;
    });
    
    // Render lại bảng với dữ liệu đã lọc
    const statusText = {
        'pending': 'Chờ xử lý',
        'shipped': 'Đang giao',
        'success': 'Hoàn tất',
        'canceled': 'Đã hủy',
        'cancelled': 'Đã hủy'
    };
    
    tbody.innerHTML = filtered.map(order => {
        const statusClass = order.status;
        // Kiểm tra xem đơn hàng đã bị hủy chưa
        const isCancelled = order.status === 'canceled' || order.status === 'cancelled';
        
        return `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${formatDate(order.date)}</td>
                <td><span class="status ${statusClass}">${statusText[order.status] || order.status}</span></td>
                <td>${order.total.toLocaleString('vi-VN')}đ</td>
                <td>
                    <button class="edit" onclick="viewOrder('${order.id}')" title="Xem chi tiết"><i class="ti-eye"></i></button>
                    ${!isCancelled ? `
                        <button class="edit" onclick="openInvoiceForm('${order.id}')" title="Chỉnh sửa"><i class="ti-pencil"></i></button>
                    ` : `
                        <button class="edit" disabled style="opacity: 0.5; cursor: not-allowed;" title="Không thể chỉnh sửa đơn hàng đã hủy"><i class="ti-pencil"></i></button>
                    `}
                    <select 
                        onchange="updateOrderStatus('${order.id}', this.value)" 
                        style="padding: 4px; border-radius: 4px; margin-left: 5px; ${isCancelled ? 'opacity: 0.6; cursor: not-allowed; background-color: #f5f5f5;' : ''}"
                        ${isCancelled ? 'disabled title="Đơn hàng đã hủy, không thể thay đổi trạng thái"' : ''}
                    >
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Đang giao</option>
                        <option value="success" ${order.status === 'success' ? 'selected' : ''}>Hoàn tất</option>
                        <option value="canceled" ${order.status === 'canceled' || order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                    <button class="delete" onclick="deleteOrder('${order.id}')" title="Xóa"><i class="ti-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}


// ==================== BÁO CÁO ====================
let reportChart = null;
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    
    // Lọc theo ngày
    let filteredOrders = orders;
    if (startDate && endDate) {
        filteredOrders = orders.filter(o => o.date >= startDate && o.date <= endDate);
    } else if (startDate) {
        filteredOrders = orders.filter(o => o.date >= startDate);
    } else if (endDate) {
        filteredOrders = orders.filter(o => o.date <= endDate);
    }
    
    // Mình cho chart hiển thị cho loại "Doanh thu & Lợi nhuận" (sales)
    // và "Đơn hàng" luôn, vì đều dùng chung dữ liệu.
    if (reportType === 'sales' || reportType === 'orders') {
        const totalRevenue = filteredOrders.reduce(
            (sum, o) => sum + (o.status === 'success' ? o.total : 0), 0
        );
        const totalProfit = Math.round(totalRevenue * 0.3); // Giả sử lợi nhuận 30%
        const totalOrders = filteredOrders.length;
        const totalItemsSold = filteredOrders.reduce(
            (sum, o) => sum + (o.items?.length || 0), 0
        );
        
        document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString('vi-VN') + ' VNĐ';
        document.getElementById('totalProfit').textContent = totalProfit.toLocaleString('vi-VN') + ' VNĐ';
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalItemsSold').textContent = totalItemsSold;
        
        // --------- Chuẩn bị dữ liệu chi tiết theo ngày ----------
        const reportTable = document.querySelector('#reportTable tbody');
        const dailyData = {};
        
        filteredOrders.forEach(order => {
            if (!dailyData[order.date]) {
                dailyData[order.date] = { revenue: 0, profit: 0, count: 0 };
            }
            if (order.status === 'success') {
                dailyData[order.date].revenue += order.total;
                dailyData[order.date].profit += Math.round(order.total * 0.3);
            }
            dailyData[order.date].count += 1;
        });
        
        const sortedEntries = Object.entries(dailyData)
            .sort((a, b) => a[0].localeCompare(b[0]));

        // Đổ dữ liệu vào bảng
        reportTable.innerHTML = sortedEntries.map(([date, data]) => `
            <tr>
                <td>${formatDate(date)}</td>
                <td>${data.revenue.toLocaleString('vi-VN')} VNĐ</td>
                <td>${data.profit.toLocaleString('vi-VN')} VNĐ</td>
                <td>${data.count}</td>
            </tr>
        `).join('');

        // --------- Vẽ biểu đồ bằng Chart.js ----------
        const labels = sortedEntries.map(([date]) => formatDate(date));
        const revenues = sortedEntries.map(([_, data]) => data.revenue);
        const profits  = sortedEntries.map(([_, data]) => data.profit);
        const counts   = sortedEntries.map(([_, data]) => data.count);

        const canvas = document.getElementById('reportChart');
        if (!canvas) return;

        // Nếu đã có chart rồi thì hủy đi để vẽ lại
        if (reportChart) {
            reportChart.destroy();
        }

        reportChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Doanh thu (VNĐ)',
                        data: revenues,
                        backgroundColor: 'rgba(46, 204, 113, 0.6)'
                    },
                    {
                        label: 'Lợi nhuận (VNĐ)',
                        data: profits,
                        backgroundColor: 'rgba(231, 76, 60, 0.6)'
                    },
                    {
                        label: 'Số đơn',
                        data: counts,
                        type: 'line',
                        borderWidth: 2,
                        borderColor: 'rgba(241, 196, 15, 1)',
                        fill: false,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'VNĐ'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Số đơn'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
}


// ==================== CÀI ĐẶT ====================
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    if (settings.shopName) document.getElementById('shopName').value = settings.shopName;
    if (settings.adminEmail) document.getElementById('adminEmail').value = settings.adminEmail;
    if (settings.currencyUnit) document.getElementById('currencyUnit').value = settings.currencyUnit;
    if (settings.primaryColor) {
        document.getElementById('primaryColor').value = settings.primaryColor;
        updateColorPreview(settings.primaryColor);
    }
    if (settings.backgroundColor) document.getElementById('backgroundColor').value = settings.backgroundColor;
    if (settings.fontSize) document.getElementById('fontSize').value = settings.fontSize;
    if (settings.shippingFee) document.getElementById('shippingFee').value = settings.shippingFee;
    if (settings.freeShippingThreshold) document.getElementById('freeShippingThreshold').value = settings.freeShippingThreshold;
    if (settings.itemsPerPage) document.getElementById('itemsPerPage').value = settings.itemsPerPage;
    if (settings.lowStockThreshold) document.getElementById('lowStockThreshold').value = settings.lowStockThreshold;
    if (settings.notificationEmail) document.getElementById('notificationEmail').value = settings.notificationEmail;
    if (settings.workStartTime) document.getElementById('workStartTime').value = settings.workStartTime;
    if (settings.workEndTime) document.getElementById('workEndTime').value = settings.workEndTime;
    
    // Load notification settings
    if (settings.notifyNewOrder !== undefined) document.getElementById('notifyNewOrder').checked = settings.notifyNewOrder;
    if (settings.notifyLowStock !== undefined) document.getElementById('notifyLowStock').checked = settings.notifyLowStock;
    if (settings.notifyNewCustomer !== undefined) document.getElementById('notifyNewCustomer').checked = settings.notifyNewCustomer;
    
    // Load working days
    if (settings.workingDays) {
        settings.workingDays.forEach(day => {
            const checkbox = document.querySelector(`input[name="workingDay"][value="${day}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // Áp dụng màu sắc đã lưu
    applyThemeSettings();
}

function updateColorPreview(color) {
    const preview = document.getElementById('colorPreview');
    const code = document.getElementById('colorCode');
    if (preview) preview.style.background = color;
    if (code) code.textContent = color;
}

function saveGeneralSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
        settings.shopName = document.getElementById('shopName').value;
        settings.adminEmail = document.getElementById('adminEmail').value;
        settings.currencyUnit = document.getElementById('currencyUnit').value;
        
        const jsonData = JSON.stringify(settings);
        localStorage.setItem('admin_settings', jsonData);
        
        // Xác nhận đã lưu thành công
        const verify = localStorage.getItem('admin_settings');
        if (!verify || verify !== jsonData) {
            throw new Error('Dữ liệu không được lưu đúng cách');
        }
        
        alert('Đã lưu cài đặt chung thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu cài đặt:', error);
        alert('Lỗi khi lưu cài đặt! Vui lòng thử lại.');
    }
}

function saveThemeSettings() {
    try {
        const primaryColor = document.getElementById('primaryColor').value;
        const backgroundColor = document.getElementById('backgroundColor').value;
        const fontSize = document.getElementById('fontSize').value;
        
        const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
        settings.primaryColor = primaryColor;
        settings.backgroundColor = backgroundColor;
        settings.fontSize = fontSize;
        
        const jsonData = JSON.stringify(settings);
        localStorage.setItem('admin_settings', jsonData);
        
        // Xác nhận đã lưu thành công
        const verify = localStorage.getItem('admin_settings');
        if (!verify || verify !== jsonData) {
            throw new Error('Dữ liệu không được lưu đúng cách');
        }
        
        // Áp dụng ngay lập tức
        applyThemeSettings();
        updateColorPreview(primaryColor);
        
        alert('Đã cập nhật giao diện thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu cài đặt giao diện:', error);
        alert('Lỗi khi lưu cài đặt! Vui lòng thử lại.');
    }
}

function applyThemeSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    
    if (settings.primaryColor) {
        document.querySelector('.sidebar').style.background = settings.primaryColor;
        document.querySelectorAll('.bg-primary').forEach(el => {
            el.style.background = settings.primaryColor;
        });
        document.querySelectorAll('.add-btn').forEach(el => {
            el.style.background = settings.primaryColor;
        });
        document.querySelectorAll('.page h4').forEach(el => {
            el.style.color = settings.primaryColor;
        });
    }
    
    if (settings.backgroundColor) {
        document.body.style.backgroundColor = settings.backgroundColor;
    }
    
    if (settings.fontSize) {
        document.body.style.fontSize = settings.fontSize;
    }
}

function saveSalesSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
        settings.shippingFee = parseInt(document.getElementById('shippingFee').value) || 0;
        settings.freeShippingThreshold = parseInt(document.getElementById('freeShippingThreshold').value) || 0;
        settings.itemsPerPage = parseInt(document.getElementById('itemsPerPage').value) || 20;
        settings.lowStockThreshold = parseInt(document.getElementById('lowStockThreshold').value) || 10;
        
        const jsonData = JSON.stringify(settings);
        localStorage.setItem('admin_settings', jsonData);
        
        // Xác nhận đã lưu thành công
        const verify = localStorage.getItem('admin_settings');
        if (!verify || verify !== jsonData) {
            throw new Error('Dữ liệu không được lưu đúng cách');
        }
        
        alert('Đã lưu cài đặt bán hàng thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu cài đặt bán hàng:', error);
        alert('Lỗi khi lưu cài đặt! Vui lòng thử lại.');
    }
}

function saveNotificationSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
        settings.notifyNewOrder = document.getElementById('notifyNewOrder').checked;
        settings.notifyLowStock = document.getElementById('notifyLowStock').checked;
        settings.notifyNewCustomer = document.getElementById('notifyNewCustomer').checked;
        settings.notificationEmail = document.getElementById('notificationEmail').value;
        
        const jsonData = JSON.stringify(settings);
        localStorage.setItem('admin_settings', jsonData);
        
        // Xác nhận đã lưu thành công
        const verify = localStorage.getItem('admin_settings');
        if (!verify || verify !== jsonData) {
            throw new Error('Dữ liệu không được lưu đúng cách');
        }
        
        alert('Đã lưu cài đặt thông báo thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu cài đặt thông báo:', error);
        alert('Lỗi khi lưu cài đặt! Vui lòng thử lại.');
    }
}

function saveWorkingHours() {
    try {
        const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
        const workingDays = [];
        document.querySelectorAll('input[name="workingDay"]:checked').forEach(checkbox => {
            workingDays.push(checkbox.value);
        });
        settings.workingDays = workingDays;
        settings.workStartTime = document.getElementById('workStartTime').value;
        settings.workEndTime = document.getElementById('workEndTime').value;
        
        const jsonData = JSON.stringify(settings);
        localStorage.setItem('admin_settings', jsonData);
        
        // Xác nhận đã lưu thành công
        const verify = localStorage.getItem('admin_settings');
        if (!verify || verify !== jsonData) {
            throw new Error('Dữ liệu không được lưu đúng cách');
        }
        
        alert('Đã lưu thời gian làm việc thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu thời gian làm việc:', error);
        alert('Lỗi khi lưu cài đặt! Vui lòng thử lại.');
    }
}

// Xử lý color picker và preset
document.addEventListener('DOMContentLoaded', function() {
    // Color picker change
    const colorPicker = document.getElementById('primaryColor');
    if (colorPicker) {
        colorPicker.addEventListener('input', function() {
            updateColorPreview(this.value);
        });
    }
    
    // Color preset click
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            document.getElementById('primaryColor').value = color;
            updateColorPreview(color);
            
            // Highlight preset được chọn
            document.querySelectorAll('.color-preset').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Highlight preset hiện tại khi load
    const currentColor = document.getElementById('primaryColor')?.value;
    if (currentColor) {
        const matchingPreset = document.querySelector(`.color-preset[data-color="${currentColor}"]`);
        if (matchingPreset) {
            matchingPreset.classList.add('active');
        }
    }
});



// ==================== DASHBOARD (CODE MỚI ĐÃ GỘP) ====================

function updateDashboard() {
    const artworks = JSON.parse(localStorage.getItem('admin_artworks') || '[]');
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');

    // --- 1. CẬP NHẬT 4 Ô MÀU TRÊN CÙNG (TỔNG QUAN) ---
    const cards = document.querySelectorAll('.dashboard .card'); // Hoặc selector tương ứng trong HTML của bạn
    // Tính tổng doanh thu đơn hàng thành công
    const totalRevenue = orders
        .filter(o => o.status === 'success')
        .reduce((sum, o) => sum + o.total, 0);

    if (cards.length >= 4) {
        // Ô 1: Tranh
        cards[0].querySelector('h3').textContent = artworks.length;
        // Ô 2: Đơn hàng
        cards[1].querySelector('h3').textContent = orders.length;
        // Ô 3: Khách hàng
        cards[2].querySelector('h3').textContent = customers.length;
        // Ô 4: Lợi nhuận (Giả sử 30% doanh thu)
        const profit = totalRevenue * 0.3;
        cards[3].querySelector('h3').textContent = (profit / 1000000).toFixed(1) + ' triệu';
    }

    // --- 2. CẬP NHẬT HOẠT ĐỘNG GẦN ĐÂY (PHẦN BẠN ĐANG THIẾU) ---
    loadRecentActivity(artworks, orders, customers);

    // --- 3. CẬP NHẬT THỐNG KÊ NHANH (3 Ô DƯỚI) ---
    // Lấy ngày hôm nay theo giờ Việt Nam (để test chính xác hơn)
    const today = new Date().toLocaleDateString('en-CA'); // Định dạng YYYY-MM-DD
    const todayOrders = orders.filter(o => o.date === today);
    const todayRevenue = todayOrders
        .filter(o => o.status === 'success')
        .reduce((sum, o) => sum + o.total, 0);

    const statsDivs = document.querySelectorAll('.stats .stat');
    if (statsDivs.length >= 3) {
        // Doanh thu hôm nay
        statsDivs[0].querySelector('h3').textContent = (todayRevenue / 1000000).toFixed(1) + ' triệu';
        // Đơn hàng hôm nay
        statsDivs[1].querySelector('h3').textContent = todayOrders.length;
        // Khách hàng mới (Hiển thị tổng số khách)
        statsDivs[2].querySelector('h3').textContent = customers.length;
    }
}

// --- HÀM PHỤ TRỢ: TẠO LIST HOẠT ĐỘNG ---
function loadRecentActivity(artworks, orders, customers) {
    // Tìm thẻ div chứa danh sách hoạt động
    const activityContainer = document.querySelector('.activity');
    
    // Nếu không tìm thấy thẻ html này thì dừng lại (tránh lỗi)
    if (!activityContainer) return;

    let activities = [];

    // a. Lấy thông tin tranh mới nhất
    if (artworks.length > 0) {
        const lastArt = artworks[artworks.length - 1];
        activities.push({
            icon: 'ti-plus',
            text: `Thêm tranh “<b>${lastArt.name}</b>” vào hệ thống`,
            time: 'Vừa xong'
        });
    }

    // b. Lấy thông tin đơn hàng mới nhất
    if (orders.length > 0) {
        const lastOrder = orders[orders.length - 1];
        let statusText = lastOrder.status === 'pending' ? 'vừa được tạo' : 'đã cập nhật';
        activities.push({
            icon: 'ti-shopping-cart',
            text: `Đơn hàng <b>#${lastOrder.id}</b> ${statusText}`,
            time: '2 phút trước'
        });
    }

    // c. Lấy thông tin khách hàng mới nhất
    if (customers.length > 0) {
        const lastCustomer = customers[customers.length - 1];
        activities.push({
            icon: 'ti-user',
            text: `Khách hàng “<b>${lastCustomer.name}</b>” vừa đăng ký`,
            time: '5 phút trước'
        });
    }

    // d. Thêm một hoạt động ngẫu nhiên cập nhật giá (để danh sách dài hơn)
    if (artworks.length > 1) {
        // Lấy random 1 tranh
        const randomArt = artworks[Math.floor(Math.random() * artworks.length)];
        activities.push({
            icon: 'ti-pencil-alt',
            text: `Cập nhật giá cho tranh “<b>${randomArt.name}</b>”`,
            time: '10 phút trước'
        });
    }

    // Xóa nội dung tĩnh cũ và thay bằng nội dung động
    if (activities.length === 0) {
        activityContainer.innerHTML = '<div style="color:#999; padding:10px;">Chưa có hoạt động nào</div>';
    } else {
        activityContainer.innerHTML = activities.map(act => `
            <div style="margin-bottom: 12px; font-size: 14px; border-bottom: 1px dashed #eee; padding-bottom: 8px;">
                <i class="${act.icon}" style="margin-right: 10px; color: #ff7b00; width: 20px; text-align: center;"></i> 
                ${act.text} 
                <span style="float:right; color: #999; font-size: 12px; font-style: italic;">${act.time}</span>
            </div>
        `).join('');
    }
}




// ==================== GHI CHÚ ====================
document.addEventListener('DOMContentLoaded', function() {
    const noteTextarea = document.querySelector('#ghichu textarea');
    if (noteTextarea) {
        // Load ghi chú đã lưu
        const savedNote = localStorage.getItem('admin_notes');
        if (savedNote) {
            noteTextarea.value = savedNote;
        }
        
        // Lưu khi thay đổi
        noteTextarea.addEventListener('blur', function() {
            try {
                localStorage.setItem('admin_notes', this.value);
                // Xác nhận đã lưu thành công
                const verify = localStorage.getItem('admin_notes');
                if (verify !== this.value) {
                    throw new Error('Dữ liệu không được lưu đúng cách');
                }
            } catch (error) {
                console.error('Lỗi khi lưu ghi chú:', error);
                alert('Lỗi khi lưu ghi chú! Vui lòng thử lại.');
            }
        });
    }
});

// ==================== TÌM KIẾM TOÀN CỤC ====================


// Hàm phụ: Xóa tìm kiếm sau khi chọn
function clearSearch() {
    document.querySelector('.search-box input').value = '';
    document.getElementById('globalSearchResults').classList.remove('active');
}

// Đóng bảng tìm kiếm khi click ra ngoài
document.addEventListener('click', function(e) {
    const searchBox = document.querySelector('.search-box');
    const resultBox = document.getElementById('globalSearchResults');
    if (searchBox && !searchBox.contains(e.target)) {
        resultBox?.classList.remove('active');
    }
});

// ==================== UTILITY FUNCTIONS ====================
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Đóng modal bằng ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});
