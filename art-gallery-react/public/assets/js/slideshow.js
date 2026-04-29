//Tác phẩm liên quan
let sliderInstance = null;

function initRelatedProductsSlider() {
    const slider = document.getElementById("slider");
    if (!slider) return;
    
    // Xóa các clone cũ nếu có
    const oldClones = slider.querySelectorAll(".clone");
    oldClones.forEach(clone => clone.remove());
    
    let slides = slider.querySelectorAll(".info-work");
    const visibleSlides = 4;
    const totalSlides = slides.length;
    
    // Nếu không có slide nào hoặc ít hơn visibleSlides, không cần slider
    if (totalSlides === 0) return;
    if (totalSlides <= visibleSlides) {
        // Nếu ít hơn hoặc bằng số slide hiển thị, không cần clone
        slider.style.transform = 'translateX(0)';
        return;
    }
    
    let currentIndex = visibleSlides;
    let slideWidth;

    function cloneSlides() {
        // Clone các slide đầu và cuối để tạo hiệu ứng vô hạn
        for (let i = 0; i < visibleSlides && i < totalSlides; i++) {
            const first = slides[i].cloneNode(true);
            first.classList.add("clone");
            const last = slides[totalSlides - 1 - i].cloneNode(true);
            last.classList.add("clone");
            slider.appendChild(first);
            slider.insertBefore(last, slider.firstChild);
        }
        slides = slider.querySelectorAll(".info-work");
    }

    function initSlider() {
        cloneSlides();
        if (slides.length > 0) {
            slideWidth = slides[0].offsetWidth;
            slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        }
    }

    function updateSlider() {
        if (slides.length === 0) return;
        slider.style.transition = 'transform 0.5s ease-in-out';
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }

    function nextSlide() {
        if (slides.length === 0 || totalSlides <= visibleSlides) return;
        currentIndex++;
        updateSlider();

        if (currentIndex >= slides.length - visibleSlides) {
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = visibleSlides;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }, 500);
        }
    }

    function prevSlide() {
        if (slides.length === 0 || totalSlides <= visibleSlides) return;
        currentIndex--;
        updateSlider();

        if (currentIndex < visibleSlides) {
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = slides.length - visibleSlides * 2;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }, 500);
        }
    }

    // Khởi tạo slider
    initSlider();

    // Resize lại khi thay đổi kích thước trình duyệt
    window.addEventListener("resize", () => {
        if (slides.length > 0) {
            slideWidth = slides[0].offsetWidth;
            updateSlider();
        }
    });

    // Gán hàm vào window để HTML gọi được onclick="..."
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    
    sliderInstance = { nextSlide, prevSlide, initSlider };
}

// Khởi tạo khi DOM ready
window.addEventListener("DOMContentLoaded", () => {
    // Đợi một chút để đảm bảo các script khác đã chạy
    setTimeout(() => {
        initRelatedProductsSlider();
    }, 100);
});

// Export hàm để có thể gọi lại từ product-detail.js
window.initRelatedProductsSlider = initRelatedProductsSlider;

//chuyển ảnh phần nhận xét khách hàng
let currentIndex = 0;

  function showSlide(index) {
    const track = document.querySelector(".feedback-track");
    const slides = document.querySelectorAll(".feedback-slide");
    const totalSlides = slides.length;

    // Đảm bảo chỉ chạy trong giới hạn số slide
    if (index < 0) {
      index = totalSlides - 1;
    } else if (index >= totalSlides) {
      index = 0;
    }

    // Cập nhật vị trí trượt
    track.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
  }

  function nextslide() {
    showSlide(currentIndex + 1);
  }

  function prevslide() {
    showSlide(currentIndex - 1);
  }

  // Hiển thị slide đầu tiên khi tải trang
  document.addEventListener("DOMContentLoaded", () => {
    showSlide(currentIndex);
});

// Gọi để hiển thị slide đầu tiên ngay khi load trang
document.addEventListener("DOMContentLoaded", () => {
  showSlide(currentIndex);
});



//chuyển ảnh tự động trang chủ
const listImage = document.querySelector('.slider-container');
const imgs = document.querySelectorAll('.slide'); 
const length = imgs.length;
let current = 0;

function nextSlide() {
    if (!imgs.length) return; 

    let width = imgs[0].offsetWidth; 

    current = (current + 1) % length; 

    listImage.style.transform = `translateX(${-width * current}px)`;
    listImage.style.transition = "transform 0.5s ease-in-out"; 
}

// Chạy tự động sau mỗi 4 giây
let slideInterval = setInterval(nextSlide, 4000);


//tác phẩm nỗi bật trang chủ
// Lưu ý: Code này chỉ chạy nếu index.js chưa load dữ liệu từ localStorage
// Nếu có dữ liệu từ localStorage, index.js sẽ xử lý việc khởi tạo slider
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("slided");
    if (!slider) return;
    
    let slides = slider.querySelectorAll(".info-work");
    
    // Chỉ chạy nếu có slides và chưa được xử lý bởi index.js
    if (slides.length === 0) return;
    
    // Kiểm tra xem đã có hàm Nextslide chưa (đã được index.js xử lý)
    if (window.Nextslide && window.Prevslide) {
        // Đã được xử lý bởi index.js, không cần làm gì
        return;
    }

    const totalSlides = slides.length;
    const visibleSlides = 4;
    
    if (totalSlides === 0 || !slides[0]) return;
    
    const slideWidth = slides[0].offsetWidth;
    let currentIndex = visibleSlides; 

    for (let i = slides.length - visibleSlides; i < slides.length; i++) {
        let clone = slides[i].cloneNode(true);
        clone.classList.add("clone");
        slider.insertBefore(clone, slider.firstChild);
    }

    for (let i = 0; i < visibleSlides; i++) {
        let clone = slides[i].cloneNode(true);
        clone.classList.add("clone");
        slider.appendChild(clone);
    }

    // Re-calculate slides after cloning
    slides = slider.querySelectorAll(".info-work");
    slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

    function Nextslide() {
        if (currentIndex >= slides.length - visibleSlides) return;
        currentIndex++;
        slider.style.transition = "transform 0.4s ease";
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

        slider.addEventListener("transitionend", () => {
            if (currentIndex === slides.length - visibleSlides) {
                slider.style.transition = "none";
                currentIndex = visibleSlides;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }
        }, { once: true });
    }

    function Prevslide() {
        if (currentIndex <= 0) return;
        currentIndex--;
        slider.style.transition = "transform 0.4s ease";
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

        slider.addEventListener("transitionend", () => {
            if (currentIndex === 0) {
                slider.style.transition = "none";
                currentIndex = slides.length - visibleSlides * 2;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }
        }, { once: true });
    }

    // Chỉ gán nếu chưa có
    if (!window.Nextslide) window.Nextslide = Nextslide;
    if (!window.Prevslide) window.Prevslide = Prevslide;
});







