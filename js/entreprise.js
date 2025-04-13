document.addEventListener('DOMContentLoaded', () => {
    // --- MODAL HANDLING ---
    const modal = document.getElementById('modal-org');
    const orgButton = document.getElementById('orgButton');
    const closeBtn = document.querySelector('.close-btn');
    let scale = 1;
    const scaleStep = 0.1;
    
    // Create zoom control buttons if they don't exist
    if (!document.querySelector('.zoom-in')) {
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';
        
        const zoomIn = document.createElement('button');
        zoomIn.className = 'zoom-btn zoom-in';
        zoomIn.textContent = '+';
        
        const zoomOut = document.createElement('button');
        zoomOut.className = 'zoom-btn zoom-out';
        zoomOut.textContent = '-';
        
        const zoomReset = document.createElement('button');
        zoomReset.className = 'zoom-btn zoom-reset';
        zoomReset.textContent = 'R';
        
        zoomControls.appendChild(zoomIn);
        zoomControls.appendChild(zoomOut);
        zoomControls.appendChild(zoomReset);
        document.querySelector('.modal-content').appendChild(zoomControls);
    }
    
    // Zoom functionality
    const zoomIn = document.querySelector('.zoom-in');
    const zoomOut = document.querySelector('.zoom-out');
    const zoomReset = document.querySelector('.zoom-reset');
    
    if (zoomIn && zoomOut && zoomReset) {
        zoomIn.addEventListener('click', () => {
            scale += scaleStep;
            updateZoom();
        });
        
        zoomOut.addEventListener('click', () => {
            scale = Math.max(0.1, scale - scaleStep);
            updateZoom();
        });
        
        zoomReset.addEventListener('click', () => {
            scale = 1;
            updateZoom();
        });
    }
    
    function updateZoom() {
        const img = document.querySelector('.modal-content img');
        if (img) {
            img.style.transform = `scale(${scale})`;
        }
    }

    // Modal show/hide handlers
    orgButton.onclick = () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent page scrolling
        window.scrollTo(0, 0); // Force scroll to top
        scale = 1; // Reset zoom level
        updateZoom();
    };
    
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };
    
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    };

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    });

    // --- SCROLL ANIMATIONS ---
    // Create an observer with improved options
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Apply staggered animation based on index
                    const delay = Array.from(document.querySelectorAll('section')).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
            });
        },
        { 
            threshold: 0.05, // Trigger at 5% visibility
            rootMargin: '50px 0px' // Trigger 50px before section enters view
        }
    );

    // Apply animation to all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(15px)'; // Reduced distance for more subtle animation
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // --- TECH CARDS HOVER EFFECT ---
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('img').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('img').style.transform = 'scale(1)';
        });
    });
});