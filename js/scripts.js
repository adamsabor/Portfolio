document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    
    let position = 0;
    const itemWidth = items[0].offsetWidth + 20; // largeur + gap
    const visibleItems = Math.floor(track.offsetWidth / itemWidth);
    const maxPosition = -(items.length - visibleItems) * itemWidth;

    next.addEventListener('click', () => {
        position = Math.max(position - itemWidth, maxPosition);
        track.style.transform = `translateX(${position}px)`;
    });

    prev.addEventListener('click', () => {
        position = Math.min(position + itemWidth, 0);
        track.style.transform = `translateX(${position}px)`;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
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
});