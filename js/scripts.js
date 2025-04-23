document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le thème
    initTheme();
    
    // Gestion du menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    const body = document.body;

    // Fonction pour fermer le menu
    function closeMenu() {
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (body) body.classList.remove('menu-open');
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    }

    // Gestionnaire du bouton menu
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
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
                    
                    // Fermer tous les autres dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
        const isClickInside = e.target.closest('.nav-menu') || e.target.closest('.mobile-menu-btn');
        if (!isClickInside && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Fermer le menu quand on redimensionne la fenêtre
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
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

    // Gestion des filtres de réalisations
    const filterButtons = document.querySelectorAll('.filter-button');
    const articles = document.querySelectorAll('.realisation-article');
    const categoryDescriptions = document.querySelectorAll('.category-description');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedTheme = button.getAttribute('data-theme');

            // Masquer toutes les descriptions de catégories
            categoryDescriptions.forEach(desc => desc.classList.remove('active'));

            // Afficher la description de la catégorie sélectionnée
            if (selectedTheme !== 'all') {
                const selectedDesc = document.getElementById(`category-${selectedTheme}`);
                if (selectedDesc) {
                    selectedDesc.classList.add('active');
                }
            }

            // Filtrer les articles
            articles.forEach(article => {
                if (selectedTheme === 'all') {
                    article.classList.remove('hidden');
                } else {
                    const articleTheme = article.getAttribute('data-theme');
                    if (articleTheme === selectedTheme) {
                        article.classList.remove('hidden');
                    } else {
                        article.classList.add('hidden');
                    }
                }
            });
        });
    });
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

/**
 * Gestion des thèmes multiples
 * Ajoutez ce code à la fin de votre fichier scripts.js
 */
document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitcher();
});

function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeSwitcher = document.querySelector('.theme-switcher');
    const currentThemeIcon = document.querySelector('.current-theme-icon');
    
    if (!themeToggle || !themeSwitcher || !currentThemeIcon) {
        console.warn("Éléments du sélecteur de thème manquants");
        return;
    }
    
    // Définir les icônes pour chaque thème
    const themeIcons = {
        'dark': '🌙',
        'light': '☀️',
        'nature': '🌿',
        'colorblind': '👁️'
    };

    const themeEmojis = {
        'dark': '🌙',
        'light': '☀️',
        'nature': '🌿',
        'colorblind': '👁️'
    };

    // Fonction pour appliquer un thème
    function applyTheme(theme) {
        // Supprimer tous les attributs data-theme précédents
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme');
        
        // Appliquer le nouveau thème
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        
        // Sauvegarder la préférence
        localStorage.setItem('theme', theme);
        
        // Mettre à jour l'interface
        updateActiveTheme(theme);
        
        // Animation du bouton
        themeToggle.classList.add('theme-changing');
        setTimeout(() => {
            themeToggle.classList.remove('theme-changing');
        }, 500);
    }
    
    // Vérifier s'il y a un thème sauvegardé
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Appliquer le thème sauvegardé au chargement
    applyTheme(savedTheme);
    
    // Événement de clic pour ouvrir/fermer le menu des thèmes
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        themeSwitcher.classList.toggle('active');
    });
    
    // Événement de clic pour chaque option de thème
    themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const newTheme = option.getAttribute('data-theme');
            applyTheme(newTheme);
            themeSwitcher.classList.remove('active');
        });
    });
    
    // Fermer le menu des thèmes si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!themeSwitcher.contains(e.target)) {
            themeSwitcher.classList.remove('active');
        }
    });
    
    // Fonction pour mettre à jour l'interface selon le thème actif
    function updateActiveTheme(theme) {
        // Mettre à jour l'icône du bouton principal
        currentThemeIcon.textContent = themeIcons[theme] || '🎨';
        
        // Mettre à jour la classe active sur les options
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
}

function initTheme() {
    // Récupérer le thème sauvegardé ou utiliser le thème par défaut
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Appliquer le thème au document
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    
    // Mettre à jour l'interface du sélecteur de thème si présent
    const currentThemeIcon = document.querySelector('.current-theme-icon');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    if (currentThemeIcon) {
        const themeIcons = {
            'dark': '🌙',
            'light': '☀️',
            'nature': '🌿',
            'colorblind': '👁️'
        };
        currentThemeIcon.textContent = themeIcons[savedTheme] || '🎨';
    }
    
    if (themeOptions.length) {
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === savedTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
}