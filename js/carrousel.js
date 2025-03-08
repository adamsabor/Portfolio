// carousel.js
class CarouselManager {
    constructor(options = {}) {
        this.options = {
            speed: options.speed || 30000,
            pauseOnHover: options.pauseOnHover !== undefined ? options.pauseOnHover : true,
            autoplay: options.autoplay !== undefined ? options.autoplay : true,
            gap: options.gap || 20,
            itemsToShow: options.itemsToShow || 'auto',
            controls: options.controls !== undefined ? options.controls : true
        };
        this.init();
    }

    init() {
        // Initialise tous les carrousels de la page
        document.querySelectorAll('.content-card').forEach(section => {
            if (section.querySelector('.skills-grid, .tools-grid, .certif-grid, .social-grid')) {
                this.convertToCarousel(section);
            }
        });
    }

    convertToCarousel(section) {
        const grid = section.querySelector('.skills-grid, .tools-grid, .certif-grid, .social-grid');
        const items = Array.from(grid.children);
        
        // Création de la structure du carrousel
        const carouselHTML = `
            <div class="carousel-container">
                <div class="carousel-wrapper">
                    <div class="carousel-track">
                        ${items.map(item => `<div class="carousel-item">${item.outerHTML}</div>`).join('')}
                    </div>
                </div>
                ${this.options.controls ? `
                    <button class="carousel-button prev">←</button>
                    <button class="carousel-button next">→</button>
                ` : ''}
            </div>
        `;

        // Remplacement de la grille par le carrousel
        grid.outerHTML = carouselHTML;

        // Configuration du nouveau carrousel
        const container = section.querySelector('.carousel-container');
        this.setupCarousel(container);
    }

    setupCarousel(container) {
        const track = container.querySelector('.carousel-track');
        const items = container.querySelectorAll('.carousel-item');
        const itemCount = items.length;
        
        // Clone des éléments pour un défilement infini
        const clonedItems = Array.from(items).map(item => item.cloneNode(true));
        clonedItems.forEach(item => track.appendChild(item));

        let isAnimating = true;
        let startX = 0;
        let scrollLeft = 0;
        let isMouseDown = false;

        // Configuration de l'autoplay
        if (this.options.autoplay) {
            const animate = () => {
                if (!isAnimating) return;
                
                const currentScroll = track.scrollLeft;
                const maxScroll = track.scrollWidth / 2;

                if (currentScroll >= maxScroll) {
                    track.scrollLeft = 0;
                } else {
                    track.scrollLeft += 1;
                }
                
                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        }

        // Event listeners
        if (this.options.pauseOnHover) {
            container.addEventListener('mouseenter', () => isAnimating = false);
            container.addEventListener('mouseleave', () => isAnimating = true);
        }

        // Contrôles tactiles
        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => isMouseDown = false);
        container.addEventListener('mouseup', () => isMouseDown = false);

        container.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        // Boutons de navigation
        if (this.options.controls) {
            const prevBtn = container.querySelector('.carousel-button.prev');
            const nextBtn = container.querySelector('.carousel-button.next');
            
            prevBtn.addEventListener('click', () => {
                isAnimating = false;
                track.scrollLeft -= 300;
                setTimeout(() => isAnimating = true, 1000);
            });

            nextBtn.addEventListener('click', () => {
                isAnimating = false;
                track.scrollLeft += 300;
                setTimeout(() => isAnimating = true, 1000);
            });
        }
    }
}

// Styles CSS pour le carrousel
const carouselStyles = `
.carousel-container {
    position: relative;
    overflow: hidden;
    padding: 0 40px;
    margin: 20px 0;
}

.carousel-wrapper {
    overflow: hidden;
}

.carousel-track {
    display: flex;
    gap: var(--carousel-gap, 20px);
    scroll-behavior: smooth;
    overflow-x: hidden;
}

.carousel-item {
    flex: 0 0 auto;
    min-width: var(--item-width, 160px);
    transition: transform 0.3s ease;
}

.carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: #2d2d44;
    border: 2px solid #f39c12;
    color: #f39c12;
    padding: 10px 15px;
    cursor: pointer;
    z-index: 2;
    font-family: 'Press Start 2P', cursive;
    font-size: 14px;
    transition: all 0.3s ease;
}

.carousel-button:hover {
    background-color: #f39c12;
    color: #2d2d44;
}

.carousel-button.prev { left: 0; }
.carousel-button.next { right: 0; }

@media (max-width: 768px) {
    .carousel-container {
        padding: 0 30px;
    }
    
    .carousel-button {
        padding: 8px 12px;
        font-size: 12px;
    }
}
`;

// Ajout des styles au document
const styleSheet = document.createElement('style');
styleSheet.textContent = carouselStyles;
document.head.appendChild(styleSheet);

// Initialisation des carrousels
document.addEventListener('DOMContentLoaded', () => {
    new CarouselManager({
        speed: 30000,
        pauseOnHover: true,
        autoplay: true,
        gap: 20,
        controls: true
    });
});