/**
 * AFCA Main JavaScript
 * Mobile-First, Modern, Responsive
 */

(function() {
    'use strict';

    // ========================================
    // LOADING SPINNER
    // ========================================
    window.addEventListener('load', function() {
        const spinner = document.getElementById('loading-spinner');
        setTimeout(function() {
            spinner.classList.add('hidden');
        }, 500);
    });

    // ========================================
    // INITIALIZE AOS (Animate On Scroll)
    // ========================================
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });

    // ========================================
    // STICKY HEADER ON SCROLL
    // ========================================
    const header = document.getElementById('main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
            
            // Update hamburger icon
            const svg = this.querySelector('svg');
            const path = svg.querySelector('path');
            
            if (mobileMenu.classList.contains('show')) {
                // Change to X icon
                path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            } else {
                // Change back to hamburger
                path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            }
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                
                // Reset hamburger icon
                const path = mobileMenuToggle.querySelector('svg path');
                path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            });
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ========================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ========================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(function(link) {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveNavLink();

    // ========================================
    // FORM VALIDATION (for contact page)
    // ========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(function(input) {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Show success message
                showFormMessage('success', 'Thank you! Your message has been sent successfully.');
                contactForm.reset();
                
                // Remove validation classes
                inputs.forEach(function(input) {
                    input.classList.remove('is-valid', 'is-invalid');
                });
            } else {
                showFormMessage('error', 'Please correct the errors in the form.');
            }
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.getAttribute('id');
        let isValid = true;
        let errorMessage = '';

        // Remove previous validation
        field.classList.remove('is-valid', 'is-invalid');
        const existingFeedback = field.parentElement.querySelector('.invalid-feedback, .valid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Required validation
        if (field.hasAttribute('required') && value === '') {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        // Email validation
        else if (field.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        // Phone validation
        else if (field.type === 'tel' && value !== '') {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }
        // Minimum length validation
        else if (field.hasAttribute('minlength')) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (value.length < minLength) {
                isValid = false;
                errorMessage = `Minimum ${minLength} characters required.`;
            }
        }

        // Apply validation class
        if (value !== '') {
            if (isValid) {
                field.classList.add('is-valid');
                const feedback = document.createElement('div');
                feedback.className = 'valid-feedback';
                feedback.textContent = 'Looks good!';
                field.parentElement.appendChild(feedback);
            } else {
                field.classList.add('is-invalid');
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = errorMessage;
                field.parentElement.appendChild(feedback);
            }
        }

        return isValid || value === '';
    }

    function showFormMessage(type, message) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message alert alert-${type === 'success' ? 'success' : 'danger'} mt-4`;
        messageDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" style="width: 20px; height: 20px; margin-right: 8px;">
                    ${type === 'success' 
                        ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>'
                        : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>'
                    }
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        contactForm.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            messageDiv.style.transition = 'opacity 0.5s ease';
            messageDiv.style.opacity = '0';
            setTimeout(function() {
                messageDiv.remove();
            }, 500);
        }, 5000);
    }

    // ========================================
    // LAZY LOADING IMAGES
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // PERFORMANCE: Reduce animations on mobile
    // ========================================
    if (window.innerWidth < 768) {
        // Reduce animation duration on mobile for better performance
        AOS.init({
            duration: 600,
            once: true,
            offset: 50
        });
    }

    // ========================================
    // ACCESSIBILITY: Keyboard Navigation
    // ========================================
    document.addEventListener('keydown', function(e) {
        // Close mobile menu on Escape key
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('show')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
            mobileMenuToggle.focus();
        }
    });

    // ========================================
    // DYNAMIC COPYRIGHT YEAR
    // ========================================
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // ========================================
    // PREVENT FOUC (Flash of Unstyled Content)
    // ========================================
    document.documentElement.classList.add('js-loaded');

})();
