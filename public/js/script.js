// Back to Top Button Functionality
window.addEventListener('scroll', function () {
    const backToTopBtn = document.getElementById('backToTop');
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

document.getElementById('backToTop').addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});



//  Range Slider Animation
document.addEventListener('DOMContentLoaded', function () {
    const ratingSlider = document.getElementById('rating');
    const ratingValue = document.getElementById('rating-value');
    const form = document.querySelector('.review-form-custom');

    // Rating slider functionality
    if (ratingSlider && ratingValue) {
        // Create star display container
        const starContainer = document.createElement('div');
        starContainer.className = 'star-display';
        starContainer.innerHTML = generateStars(ratingSlider.value);
        ratingSlider.parentNode.insertBefore(starContainer, ratingSlider.nextSibling);

        // Update rating value display and stars
        ratingSlider.addEventListener('input', function () {
            const value = this.value;
            ratingValue.textContent = value;
            updateRangeBackground(this);
            updateStarDisplay(value);
            addRatingLabel(value);
        });

        // Initialize range background and stars
        updateRangeBackground(ratingSlider);
        updateStarDisplay(ratingSlider.value);
        addRatingLabel(ratingSlider.value);

        // Add smooth transition effect
        ratingSlider.addEventListener('mousedown', function() {
            this.classList.add('sliding');
        });

        ratingSlider.addEventListener('mouseup', function() {
            this.classList.remove('sliding');
        });
    }

    // Function to update range slider background based on value
    function updateRangeBackground(slider) {
        const value = slider.value;
        const colors = {
            1: '#dc3545', // Red
            2: '#fd7e14', // Orange  
            3: '#ffc107', // Yellow
            4: '#20c997', // Teal
            5: '#28a745'  // Green
        };
        const percentage = (value / 5) * 100;
        slider.style.background = `linear-gradient(to right, ${colors[value]} 0%, ${colors[value]} ${percentage}%, #e9ecef ${percentage}%, #e9ecef 100%)`;
        
        // Update thumb color to match
        slider.style.setProperty('--thumb-color', colors[value]);
    }

    // Function to generate star HTML
    function generateStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<span class="star filled">★</span>';
            } else {
                starsHTML += '<span class="star empty">☆</span>';
            }
        }
        return starsHTML;
    }

    // Function to update star display
    function updateStarDisplay(rating) {
        const starContainer = document.querySelector('.star-display');
        if (starContainer) {
            starContainer.innerHTML = generateStars(rating);
            starContainer.className = `star-display rating-${rating}`;
        }
    }

    // Function to add rating label
    function addRatingLabel(rating) {
        const labels = {
            1: 'Poor',
            2: 'Fair', 
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent'
        };
        
        let labelElement = document.querySelector('.rating-label');
        if (!labelElement) {
            labelElement = document.createElement('div');
            labelElement.className = 'rating-label';
            document.querySelector('.star-display').appendChild(labelElement);
        }
        
        labelElement.textContent = labels[rating];
        labelElement.className = `rating-label label-${rating}`;
    }

    // Rest of your existing form validation code...
    if (form) {
        const commentsField = document.getElementById('comments');
        
        form.addEventListener('submit', function (event) {
            const comments = commentsField.value.trim();
            if (comments.length > 0 && comments.length < 5) {
                event.preventDefault();
                commentsField.classList.add('is-invalid');
                commentsField.classList.remove('is-valid');
                return false;
            }
            commentsField.classList.remove('is-invalid', 'is-valid');
        });

        if (commentsField) {
            commentsField.addEventListener('input', function () {
                const value = this.value.trim();
                this.classList.remove('is-invalid', 'is-valid');
                if (value.length > 0) {
                    if (value.length >= 5) {
                        this.classList.add('is-valid');
                    } else {
                        this.classList.add('is-invalid');
                    }
                }
            });

            commentsField.addEventListener('focus', function () {
                if (this.value.trim().length === 0) {
                    this.classList.remove('is-invalid', 'is-valid');
                }
            });
        }
    }
});



// Bootstrap form validation
(function () {
    'use strict';
    window.addEventListener('load', function () {
        var forms = document.getElementsByClassName('needs-validation');
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();


