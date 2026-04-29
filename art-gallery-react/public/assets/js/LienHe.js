// LienHe.js - Xử lý form liên hệ và hiệu ứng

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    // Intersection Observer cho animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Áp dụng animation
    const fadeElements = document.querySelectorAll('.fade-in-left, .fade-in-right, .fade-in');
    fadeElements.forEach((el, index) => {
        el.style.opacity = '0';
        if (el.classList.contains('fade-in-left')) {
            el.style.transform = 'translateX(-50px)';
        } else if (el.classList.contains('fade-in-right')) {
            el.style.transform = 'translateX(50px)';
        } else {
            el.style.transform = 'translateY(30px)';
        }
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Form Validation
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset errors
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('error'));
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // Validate name
            if (!name || name.length < 2) {
                showError('name', 'Vui lòng nhập họ và tên (ít nhất 2 ký tự)');
                isValid = false;
            }
            
            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailPattern.test(email)) {
                showError('email', 'Vui lòng nhập email hợp lệ');
                isValid = false;
            }
            
            // Validate phone
            const phonePattern = /^0[0-9]{9,10}$/;
            if (!phone || !phonePattern.test(phone.replace(/\s/g, ''))) {
                showError('phone', 'Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)');
                isValid = false;
            }
            
            // Validate message
            if (!message || message.length < 10) {
                showError('message', 'Vui lòng nhập tin nhắn (ít nhất 10 ký tự)');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission
                submitForm(name, email, phone, message);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.parentElement.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    const errorSpan = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function validateField(field) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorSpan = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    
    if (field.hasAttribute('required') && !value) {
        formGroup.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = 'Trường này là bắt buộc';
        }
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            formGroup.classList.add('error');
            if (errorSpan) {
                errorSpan.textContent = 'Email không hợp lệ';
            }
            return false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phonePattern = /^0[0-9]{9,10}$/;
        if (!phonePattern.test(value.replace(/\s/g, ''))) {
            formGroup.classList.add('error');
            if (errorSpan) {
                errorSpan.textContent = 'Số điện thoại không hợp lệ';
            }
            return false;
        }
    }
    
    if (field.id === 'name' && value && value.length < 2) {
        formGroup.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = 'Tên phải có ít nhất 2 ký tự';
        }
        return false;
    }
    
    if (field.id === 'message' && value && value.length < 10) {
        formGroup.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = 'Tin nhắn phải có ít nhất 10 ký tự';
        }
        return false;
    }
    
    return true;
}

function submitForm(name, email, phone, message) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Đang gửi...</span><i class="ti-reload"></i>';
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 1500);
}

function showSuccessMessage() {
    // Create success message if not exists
    let successMsg = document.querySelector('.success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <i class="ti-check" style="font-size: 1.5rem;"></i>
            <div>
                <strong>Cảm ơn bạn đã liên hệ!</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem;">Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
            </div>
        `;
        
        const formHeader = document.querySelector('.form-header');
        formHeader.insertAdjacentElement('afterend', successMsg);
    }
    
    successMsg.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);
}

