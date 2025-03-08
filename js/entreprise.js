document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-org');
    const orgButton = document.getElementById('orgButton');
    const closeBtn = document.querySelector('.close-btn');

    // Modal handlers
    orgButton.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    // Scroll animation avec options ajustées
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        { 
            threshold: 0.05, // Déclenche plus tôt (5% de visibilité)
            rootMargin: '50px 0px' // Déclenche 50px avant que la section entre dans la vue
        }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(15px)'; // Distance réduite
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
});