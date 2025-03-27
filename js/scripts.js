document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu mobile
    initializeMobileMenu();
    
    // Gestion des dropdowns sur mobile
    initializeDropdowns();
    
    // Gestion du carrousel si présent
    if (document.querySelector('.carousel-track')) {
        initializeCarousel();
    }
});

/**
 * Initialise le menu mobile
 */
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

/**
 * Initialise les dropdowns pour mobile
 */
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.menu-link');
        
        if (window.innerWidth <= 768) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Fermer les autres dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            });
        }
    });
}

/**
 * Initialise le carrousel
 */
function initializeCarousel() {
    const trackContainer = document.querySelector('.carousel-track-container');
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    
    if (!track || items.length < 1) return;
    
    // Ajouter des boutons de navigation
    const carouselContainer = document.querySelector('.carousel-container');
    
    // Créer les boutons de navigation si pas déjà présents
    if (!document.querySelector('.carousel-nav')) {
        const navDiv = document.createElement('div');
        navDiv.className = 'carousel-nav';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-button prev';
        prevBtn.innerHTML = '&#10094;';
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-button next';
        nextBtn.innerHTML = '&#10095;';
        
        navDiv.appendChild(prevBtn);
        navDiv.appendChild(nextBtn);
        carouselContainer.appendChild(navDiv);
        
        // Événements des boutons
        prevBtn.addEventListener('click', scrollPrev);
        nextBtn.addEventListener('click', scrollNext);
    }
    
    // Faire défiler vers la gauche
    function scrollPrev() {
        trackContainer.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    }
    
    // Faire défiler vers la droite
    function scrollNext() {
        trackContainer.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    }
    
    // Navigation par touche clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            scrollPrev();
        } else if (e.key === 'ArrowRight') {
            scrollNext();
        }
    });
    
    // Navigation tactile
    let touchStartX = 0;
    let touchEndX = 0;
    
    trackContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    trackContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe gauche
            scrollNext();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe droite
            scrollPrev();
        }
    }
}