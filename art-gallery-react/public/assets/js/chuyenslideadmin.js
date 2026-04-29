function showSection(id, event) {
  try {
    console.log('showSection called with id:', id);
    
    // Ẩn tất cả các phần nội dung
    const sections = document.querySelectorAll("#home, #orders, #art, #customers, #warehouse, #report, #settings");
    console.log('Found sections:', sections.length);
    sections.forEach(sec => {
      if (sec) {
        sec.classList.add("hidden");
        sec.style.display = 'none';
        console.log('Hidden section:', sec.id);
      }
    });

    // Hiện phần được chọn
    const targetSection = document.getElementById(id);
    if (!targetSection) {
      console.error('Không tìm thấy section với id:', id);
      alert('Không tìm thấy phần: ' + id + '. Vui lòng kiểm tra lại!');
      return;
    }
    
    console.log('Target section found:', targetSection);
    // Force hiển thị bằng nhiều cách
    targetSection.classList.remove("hidden");
    targetSection.removeAttribute('style'); // Xóa style cũ nếu có
    targetSection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important;';
    console.log('Section displayed:', id, 'Classes:', targetSection.className);

    // Cập nhật trạng thái active trong sidebar
    const items = document.querySelectorAll(".sidebar ul li");
    items.forEach(li => li.classList.remove("active"));
    
    // Thêm class active cho item vừa được click
    if (event && event.currentTarget) {
      event.currentTarget.classList.add("active");
    } else {
      // Fallback: Tìm li element chứa onclick với id tương ứng
      const clickedItem = Array.from(items).find(li => {
        const onclickAttr = li.getAttribute('onclick');
        return onclickAttr && (onclickAttr.includes(`'${id}'`) || onclickAttr.includes(`"${id}"`));
      });
      
      if (clickedItem) {
        clickedItem.classList.add("active");
      }
    }
    
    // Nếu là phần settings, load lại settings
    if (id === 'settings') {
      setTimeout(() => {
        if (typeof loadSettings === 'function') {
          loadSettings();
        }
      }, 100);
    }
    
    // Nếu là phần orders, load lại đơn hàng để cập nhật trạng thái mới nhất
    if (id === 'orders') {
      setTimeout(() => {
        if (typeof loadOrders === 'function') {
          loadOrders();
        }
        if (typeof updateDashboard === 'function') {
          updateDashboard();
        }
      }, 100);
    }
    
    // Nếu là phần art, load lại bảng tranh với bộ lọc hiện tại
    if (id === 'art') {
      setTimeout(() => {
        const categoryFilter = document.getElementById('categoryFilter');
        
        // Đảm bảo event listener được gắn
        if (categoryFilter && !categoryFilter.hasAttribute('data-listener-attached')) {
          categoryFilter.addEventListener('change', function() {
            console.log('Combobox thay đổi trong showSection, giá trị:', this.value);
            if (typeof filterArtworksAdmin === 'function') {
              filterArtworksAdmin();
            } else if (typeof window.filterArtworks === 'function') {
              window.filterArtworks();
            }
          });
          categoryFilter.setAttribute('data-listener-attached', 'true');
          console.log('Đã gắn event listener cho categoryFilter');
        }
        
        const currentFilter = categoryFilter ? categoryFilter.value : '';
        
        // Chỉ sử dụng loadArtworks để tránh xung đột
        if (typeof loadArtworks === 'function') {
          loadArtworks(currentFilter);
        }
      }, 150);
    }
  } catch (error) {
    console.error('Lỗi trong showSection:', error);
    alert('Có lỗi xảy ra: ' + error.message);
  }
}

function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
    window.location.href = "index.html";
  }
}
