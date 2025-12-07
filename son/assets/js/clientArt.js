// ./assets/js/clientArt.js

// Lưu trữ danh sách tranh gốc để lọc
let allArtworks = [];
let filteredArtworks = [];

// Lấy danh sách tranh từ localStorage (do admin lưu)
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

// Tạo một thẻ tranh từ template
function createArtworkCard(art, templateCard) {
    const card = templateCard.cloneNode(true);

    // Đảm bảo card có đầy đủ class và style giống template
    card.className = 'painting js-generated';
    card.style.cursor = 'pointer';
    card.removeAttribute('onclick');

    // Cập nhật dữ liệu bên trong
    const imgEl = card.querySelector('img');
    if (imgEl) {
        imgEl.src = art.image || './assets/TrangNgoai/logo1.png';
        imgEl.alt = art.name || 'Tranh';
        imgEl.onerror = function() {
            this.src = './assets/TrangNgoai/logo1.png';
        };
    }

    const nameEl = card.querySelector('.name');
    if (nameEl) {
        nameEl.textContent = art.name || 'Chưa có tên';
    }

    const catEl = card.querySelector('.category');
    if (catEl) {
        catEl.textContent = (art.category || '').toUpperCase();
    }

    const priceEl = card.querySelector('.price');
    if (priceEl) {
        // Xóa các span con nếu có (original-price, discounted-price)
        priceEl.innerHTML = '';
        const priceText = art.price
            ? Number(art.price).toLocaleString('vi-VN') + 'đ'
            : '';
        priceEl.textContent = priceText;
    }

    // Thêm click handler để chuyển đến trang chi tiết
    card.onclick = function() {
        window.location.href = 'product-detail.html?id=' + art.id;
    };

    return card;
}

// Render danh sách tranh
function renderArtworks(artworks) {
    const container = document.getElementById('art-list');
    if (!container) return;

    // Tìm template card (card có class template-card hoặc card đầu tiên)
    const templateCard = container.querySelector('.template-card') || 
                        container.querySelector('.painting:not(.js-generated)') ||
                        container.querySelector('.painting');
    
    if (!templateCard) {
        console.warn('Không tìm thấy .painting nào để làm mẫu');
        return;
    }

    // Xóa tất cả các card được tạo từ JavaScript (có class js-generated)
    // Nhưng giữ lại template card
    const jsGeneratedCards = container.querySelectorAll('.painting.js-generated');
    jsGeneratedCards.forEach(card => card.remove());
    
    // Xóa thông báo không có kết quả nếu có
    const noResultMsg = container.querySelector('.no-result-message');
    if (noResultMsg) noResultMsg.remove();

    if (!artworks.length) {
        // Hiển thị thông báo không có kết quả
        const noResult = document.createElement('div');
        noResult.className = 'no-result-message';
        noResult.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px; font-size: 18px; color: #666;';
        noResult.textContent = 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc đã chọn.';
        container.appendChild(noResult);
        return;
    }

    // Tạo fragment để append cho mượt
    const fragment = document.createDocumentFragment();

    artworks.forEach(art => {
        const card = createArtworkCard(art, templateCard);
        // Đánh dấu card được tạo từ JavaScript
        card.classList.add('js-generated');
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

// Lọc tranh theo các tiêu chí
function filterArtworks() {
    const container = document.getElementById('art-list');
    if (!container) return;

    const pageCategory = (container.dataset.artCategory || 'all').toLowerCase();
    
    // Lấy giá trị từ các combobox
    const categoryFilter = document.getElementById('filterCategory')?.value || '';
    const authorFilter = document.getElementById('filterAuthor')?.value || '';
    const sizeFilter = document.getElementById('filterSize')?.value || '';

    // Bắt đầu với danh sách gốc
    let filtered = [...allArtworks];

    // Nếu có chọn chuyên mục trong filter, cho phép chọn tùy ý (không giới hạn theo trang)
    // Nếu KHÔNG có chọn chuyên mục, mới lọc theo danh mục của trang
    if (categoryFilter) {
        // Có chọn chuyên mục → lọc theo chuyên mục đã chọn (cho phép chọn tùy ý)
        filtered = filtered.filter(art =>
            (art.category || '').toLowerCase() === categoryFilter.toLowerCase()
        );
    } else if (pageCategory !== 'all') {
        // Không chọn chuyên mục → lọc theo danh mục của trang (mặc định)
        filtered = filtered.filter(art =>
            (art.category || '').toLowerCase() === pageCategory ||
            (art.category || '').toLowerCase().includes(pageCategory)
        );
    }

    // Lọc theo họa sĩ (nếu có chọn)
    if (authorFilter) {
        filtered = filtered.filter(art =>
            (art.author || '').toLowerCase() === authorFilter.toLowerCase()
        );
    }

    // Lọc theo kích thước (nếu có chọn)
    if (sizeFilter) {
        filtered = filtered.filter(art =>
            (art.size || '').toLowerCase() === sizeFilter.toLowerCase()
        );
    }

    filteredArtworks = filtered;
    renderArtworks(filteredArtworks);
}

// Điền dữ liệu vào combobox họa sĩ và kích thước
function populateFilterOptions() {
    const container = document.getElementById('art-list');
    if (!container) return;

    const pageCategory = (container.dataset.artCategory || 'all').toLowerCase();
    
    // Lọc tranh theo danh mục trang trước (chỉ để lấy danh sách họa sĩ và kích thước)
    let artworks = allArtworks.filter(art => {
        if (pageCategory === 'all') return true;
        const artCategory = (art.category || '').toLowerCase();
        return artCategory === pageCategory || artCategory.includes(pageCategory);
    });

    // Tự động điền các chuyên mục từ dữ liệu vào combobox (nếu chưa có)
    const categorySelect = document.getElementById('filterCategory');
    if (categorySelect && allArtworks.length > 0) {
        // Lấy danh sách chuyên mục duy nhất từ tất cả tranh
        const categories = [...new Set(allArtworks.map(art => art.category).filter(Boolean))].sort();
        
        // Kiểm tra xem đã có option nào chưa (trừ option đầu tiên)
        const existingOptions = Array.from(categorySelect.options).slice(1).map(opt => opt.value);
        
        // Thêm các chuyên mục mới nếu chưa có
        categories.forEach(category => {
            if (!existingOptions.includes(category)) {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            }
        });
    }

    // Lấy danh sách họa sĩ duy nhất
    const authors = [...new Set(artworks.map(art => art.author).filter(Boolean))].sort();
    const authorSelect = document.getElementById('filterAuthor');
    if (authorSelect) {
        // Giữ lại option đầu tiên (placeholder)
        const placeholder = authorSelect.querySelector('option[value=""]');
        authorSelect.innerHTML = '';
        if (placeholder) {
            authorSelect.appendChild(placeholder);
        } else {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '- Chọn họa sĩ -';
            authorSelect.appendChild(defaultOption);
        }
        
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            authorSelect.appendChild(option);
        });
    }

    // Lấy danh sách kích thước duy nhất
    const sizes = [...new Set(artworks.map(art => art.size).filter(Boolean))].sort();
    const sizeSelect = document.getElementById('filterSize');
    if (sizeSelect) {
        // Giữ lại option đầu tiên (placeholder)
        const placeholder = sizeSelect.querySelector('option[value=""]');
        sizeSelect.innerHTML = '';
        if (placeholder) {
            sizeSelect.appendChild(placeholder);
        } else {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '- Chọn kích thước -';
            sizeSelect.appendChild(defaultOption);
        }
        
        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    }
}

// Render tranh ra trang người dùng, MỖI TRANG CHỈ GỌI 1 LẦN KHI LOAD
function renderArtworksForPage() {
    const container = document.getElementById('art-list');
    if (!container) {
        console.warn('Không tìm thấy #art-list trên trang người dùng');
        return;
    }

    // Lấy tất cả tranh từ storage
    allArtworks = getArtworksFromStorage();
    
    if (!allArtworks.length) {
        // Không có dữ liệu từ admin → giữ nguyên tranh có sẵn, không có chức năng lọc
        console.log('Không có dữ liệu từ admin, giữ nguyên tranh HTML có sẵn');
        // Đánh dấu các card HTML hiện có để không bị xóa
        const existingCards = container.querySelectorAll('.painting:not(.js-generated)');
        existingCards.forEach(card => {
            card.classList.add('html-original');
        });
        return;
    }

    // Nếu có dữ liệu từ admin, lưu template card và xóa tất cả card HTML cũ
    // CHỈ XÓA các card không phải là template và không có class html-keep
    const existingCards = container.querySelectorAll('.painting:not(.template-card):not(.html-keep)');
    if (existingCards.length > 0) {
        // Lưu card đầu tiên làm template nếu chưa có template
        let templateCard = container.querySelector('.template-card');
        if (!templateCard && existingCards.length > 0) {
            templateCard = existingCards[0];
            templateCard.classList.add('template-card');
            // Giữ lại template card, xóa các card còn lại
            existingCards.forEach((card, index) => {
                if (card !== templateCard) {
                    card.remove();
                }
            });
        } else {
            // Nếu đã có template, xóa tất cả card không phải template
            existingCards.forEach(card => {
                if (!card.classList.contains('template-card')) {
                    card.remove();
                }
            });
        }
    }

    // Điền dữ liệu vào combobox
    populateFilterOptions();

    // Render tranh ban đầu (chưa lọc)
    filterArtworks();
}

// Khởi động khi trang load
document.addEventListener('DOMContentLoaded', function() {
    renderArtworksForPage();
    
    // Thêm event listener cho các combobox
    const categorySelect = document.getElementById('filterCategory');
    const authorSelect = document.getElementById('filterAuthor');
    const sizeSelect = document.getElementById('filterSize');
    
    if (categorySelect) {
        categorySelect.addEventListener('change', filterArtworks);
    }
    if (authorSelect) {
        authorSelect.addEventListener('change', filterArtworks);
    }
    if (sizeSelect) {
        sizeSelect.addEventListener('change', filterArtworks);
    }
});
