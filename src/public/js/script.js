// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

//Back to Top Button with Smooth Animations
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        const handleScroll = throttle(() => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.transform = 'translateY(0) scale(1)';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.transform = 'translateY(20px) scale(0.8)';
                setTimeout(() => {
                    if (window.pageYOffset <= 300) {
                        backToTopBtn.style.visibility = 'hidden';
                    }
                }, 300);
            }
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            backToTopBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                backToTopBtn.style.transform = 'scale(1)';
            }, 150);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

//input interactions with ripple effects
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('.auth-form-input');
        
        inputs.forEach(input => {
            // Focus effects with ripple animation
            input.addEventListener('focus', function () {
                this.parentElement.classList.add('focused');

                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.className = 'input-ripple';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.background = 'rgba(74, 144, 226, 0.3)';
                this.parentElement.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });

            input.addEventListener('blur', function () {
                this.parentElement.classList.remove('focused');
            });

            // Debounced input validation with smooth transitions
            const debouncedValidation = debounce(() => {
                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                    input.parentElement.classList.add('has-content');
                } else {
                    input.classList.remove('has-value');
                    input.parentElement.classList.remove('has-content');
                }

                // Real-time validation with smooth color transitions
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    if (input.value.length > 0) {
                        input.classList.add('is-invalid');
                    }
                }
            }, 200);

            input.addEventListener('input', debouncedValidation);
        });

        //form submission with loading animations
        form.addEventListener('submit', function (e) {
            const submitBtn = this.querySelector('.auth-submit-btn');

            if (this.checkValidity()) {
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';

                    // Add success wave animation
                    const formCard = this.closest('.auth-form-card');
                    if (formCard) {
                        formCard.style.animation = 'successPulse 0.6s ease-out';
                    }
                }
            } else {
                e.preventDefault();
                e.stopPropagation();

                // Enhanced shake animation
                this.style.animation = 'shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
                setTimeout(() => {
                    this.style.animation = '';
                }, 600);
            }

            this.classList.add('was-validated');
        });
    });
});

// Beautiful floating particles with varied animations
function createAuthParticles() {
    const authPage = document.querySelector('.auth-page');
    if (!authPage) return;

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';

        // Varied particle styles
        const size = Math.random() * 6 + 3;
        const opacity = Math.random() * 0.4 + 0.1;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = opacity;
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 15) + 's';

        authPage.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createAuthParticles);


//Image Preview with Smooth Animations
function setupImagePreview(inputId, previewId, imgId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const img = document.getElementById(imgId);

    if (input && preview && img) {
        const debouncedPreview = debounce((url) => {
            if (url && isValidUrl(url)) {
                img.src = url;

                // Smooth reveal animation
                preview.style.display = 'block';
                preview.style.animation = 'zoomIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

                img.onload = () => {
                    preview.classList.add('active');
                    img.style.animation = 'imageLoad 0.6s ease-out';
                };

                img.onerror = () => {
                    preview.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        preview.style.display = 'none';
                        preview.classList.remove('active');
                    }, 300);
                };
            } else {
                preview.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    preview.style.display = 'none';
                    preview.classList.remove('active');
                }, 300);
            }
        }, 300);

        input.addEventListener('input', function () {
            debouncedPreview(this.value.trim());
        });
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
}

// Initialize image previews
document.addEventListener('DOMContentLoaded', function() {
    setupImagePreview('createImage', 'createImagePreview', 'createPreviewImg');
    setupImagePreview('editImage', 'editImagePreview', 'editPreviewImg');
});

// Enhanced Form Validation with Animations
(function () {
    'use strict';
    window.addEventListener('load', function () {
        const forms = document.getElementsByClassName('needs-validation');
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', function (event) {
                const submitBtn = form.querySelector('.submit-btn');

                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();

                    // Enhanced shake animation
                    form.style.animation = 'shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
                    setTimeout(() => form.style.animation = '', 600);
                } else {
                    // Success animation
                    if (submitBtn) {
                        submitBtn.classList.add('loading');
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating...';
                        submitBtn.style.animation = 'pulse 1s infinite';
                    }

                    const formCard = form.closest('.form-card');
                    if (formCard) {
                        formCard.style.animation = 'successWave 0.8s ease-out';
                    }
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

// GSAP Animation with proper error handling
document.addEventListener('DOMContentLoaded', function () {
    // Check if GSAP is available
  if (typeof gsap !== 'undefined') {
    const authElements = document.querySelectorAll(".auth-form-group");
    const formElements = document.querySelectorAll(".form-floating");
    const submitBtn = document.querySelectorAll(".submit-btn");
    const authBtns = document.querySelectorAll(".auth-submit-btn");
    const img = document.querySelector(".img-upload")
    
    if (authElements.length > 0) {
        // Use fromTo to explicitly control both start and end states
        gsap.fromTo(authElements, 
            // FROM state (initial)
            {
                y: 100,
                opacity: 0,
            },
            // TO state (final)
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }
        );
    }
    if (formElements.length > 0) {
        // Use fromTo to explicitly control both start and end states
        gsap.fromTo([formElements, img], 
            // FROM state (initial)
            {
                y: 100,
                opacity: 0,
            },
            // TO state (final)
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }
        );
    }    
    if (img) {
        // Use fromTo to explicitly control both start and end states
        gsap.fromTo(img, 
            // FROM state (initial)
            {
                y: 100,
                opacity: 0,
            },
            // TO state (final)
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }
        );
    }

}
});

// Beautiful 3D Card Animations (Optimized)
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.form-card, .auth-form-card');

    cards.forEach(card => {
        let isAnimating = false;

        card.addEventListener('mouseenter', function () {
            if (!isAnimating) {
                this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                this.style.transform = 'translateY(-15px) scale(1.02)';
                this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2)';
                this.style.filter = 'brightness(1.05)';
            }
        });

        card.addEventListener('mouseleave', function () {
            this.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            this.style.filter = 'brightness(1)';
        });

        // Click animation with ripple effect
        card.addEventListener('mousedown', function (e) {
            isAnimating = true;
            this.style.transition = 'all 0.1s ease-out';
            this.style.transform = 'translateY(-10px) scale(0.98)';

            // Create click ripple
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });

        card.addEventListener('mouseup', function () {
            this.style.transition = 'all 0.3s ease-out';
            this.style.transform = 'translateY(-15px) scale(1.02)';
            setTimeout(() => isAnimating = false, 300);
        });
    });
});

// Enhanced Floating Particles
function createFloatingParticles() {
    const container = document.querySelector('.form-container');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';

        // Varied particle properties
        const size = Math.random() * 8 + 2;
        const opacity = Math.random() * 0.3 + 0.1;
        const hue = Math.random() * 360;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = opacity;
        particle.style.background = `hsl(${hue}, 70%, 70%)`;
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 20 + 20) + 's';

        container.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createFloatingParticles);

// Enhanced Intersection Observer for Reveal Animations
document.addEventListener('DOMContentLoaded', function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.form-card, .demo-switcher').forEach(el => {
        observer.observe(el);
    });
});

// Enhanced Flash Messages with Slide Animations
document.addEventListener('DOMContentLoaded', function () {
    const alerts = document.querySelectorAll('.alert');

    alerts.forEach(alert => {
        alert.style.animation = 'slideInDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        setTimeout(() => alert.classList.add('show'), 100);

        setTimeout(() => {
            if (alert.classList.contains('show')) {
                alert.style.animation = 'slideOutUp 0.4s ease-in';
                setTimeout(() => alert.remove(), 400);
            }
        }, 5000);

        const closeBtn = alert.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                alert.style.animation = 'slideOutUp 0.4s ease-in';
                setTimeout(() => alert.remove(), 400);
            });
        }
    });
});


