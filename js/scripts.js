document.addEventListener('DOMContentLoaded', () => {
    // Gestion du menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    const body = document.body;

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
    }

    // Gestion des dropdowns sur mobile
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.menu-link');
        
        if (dropdownLink) {
            dropdownLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container') && !e.target.closest('.nav-menu')) {
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            if (body) body.classList.remove('menu-open');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Fermer le menu quand on redimensionne la fenêtre
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            if (body) body.classList.remove('menu-open');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Empêcher le défilement quand le menu est ouvert
    if (body) {
        body.addEventListener('touchmove', (e) => {
            if (body.classList.contains('menu-open')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Gestion du carrousel si présent
    if (document.querySelector('.carousel-track')) {
        initializeCarousel();
    }
});

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