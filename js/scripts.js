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
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!track || items.length < 1) return;
    
    let currentIndex = 0;
    const itemWidth = items[0].offsetWidth + 24; // 24px est la valeur du gap
    const maxIndex = items.length - Math.floor(track.parentElement.offsetWidth / itemWidth);
    
    function updateCarousel() {
        const translateX = -currentIndex * itemWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Mettre à jour la visibilité des boutons
        if (prevBtn) prevBtn.style.display = currentIndex <= 0 ? 'none' : 'flex';
        if (nextBtn) nextBtn.style.display = currentIndex >= maxIndex ? 'none' : 'flex';
    }
    
    function scrollPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }
    
    function scrollNext() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    }
    
    // Événements des boutons
    if (prevBtn) prevBtn.addEventListener('click', scrollPrev);
    if (nextBtn) nextBtn.addEventListener('click', scrollNext);
    
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
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            scrollNext();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            scrollPrev();
        }
    }
    
    // Mettre à jour le carrousel lors du redimensionnement
    window.addEventListener('resize', function() {
        currentIndex = Math.min(currentIndex, maxIndex);
        updateCarousel();
    });
    
    // Initialisation
    updateCarousel();
}