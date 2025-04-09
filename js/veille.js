document.addEventListener('DOMContentLoaded', () => {
    // Sélecteurs des éléments
    const searchInput = document.getElementById('search-input');
    const dateFilter = document.getElementById('date-filter');
    const sortSelect = document.getElementById('sort-select');
    const articlesContainer = document.getElementById('articles-container');

    // Fonction pour récupérer tous les articles
    const getAllArticles = () => Array.from(document.querySelectorAll('.article-box'));

    // Fonction pour filtrer les articles
    const filterArticles = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedDate = dateFilter.value;
        const articles = getAllArticles();

        articles.forEach(article => {
            const title = article.querySelector('h3').textContent.toLowerCase();
            const description = article.querySelector('p').textContent.toLowerCase();
            const articleDate = article.dataset.date;
            const yearMatch = selectedDate === 'all' || articleDate.startsWith(selectedDate);
            const textMatch = title.includes(searchTerm) || description.includes(searchTerm);

            article.style.display = (yearMatch && textMatch) ? 'flex' : 'none';
        });

        // Afficher un message si aucun résultat
        updateNoResultsMessage();
        
        // Mettre à jour le compteur
        updateResultsCounter();
    };

    // Fonction de tri des articles
    const sortArticles = () => {
        const articles = getAllArticles();
        const sortValue = sortSelect.value;

        articles.sort((a, b) => {
            switch(sortValue) {
                case 'date-desc':
                    return b.dataset.date.localeCompare(a.dataset.date);
                case 'date-asc':
                    return a.dataset.date.localeCompare(b.dataset.date);
                case 'note-desc':
                    return parseFloat(b.dataset.note) - parseFloat(a.dataset.note);
                case 'note-asc':
                    return parseFloat(a.dataset.note) - parseFloat(b.dataset.note);
                default:
                    return 0;
            }
        });

        // Réorganiser les articles dans le DOM
        articles.forEach(article => articlesContainer.appendChild(article));
    };

    // Fonction pour mettre à jour le message "Aucun résultat"
    const updateNoResultsMessage = () => {
        let noResultsMsg = document.querySelector('.no-results-message');
        const visibleArticles = getAllArticles().filter(a => a.style.display !== 'none');

        if (visibleArticles.length === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.style.cssText = 'text-align: center; color: #f39c12; padding: 2rem; width: 100%;';
                articlesContainer.appendChild(noResultsMsg);
            }
            noResultsMsg.textContent = 'Aucun article ne correspond à votre recherche';
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    };

    // Fonction pour mettre à jour le compteur de résultats
    const updateResultsCounter = () => {
        let counter = document.querySelector('.results-counter');
        const visibleArticles = getAllArticles().filter(a => a.style.display !== 'none');

        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'results-counter';
            counter.style.cssText = `
                color: #f39c12;
                margin: 2rem 0 1rem;
                text-align: center;
                font-family: 'Press Start 2P', cursive;
                font-size: 0.9rem;
                padding: 1rem;
                border-top: 2px solid #f39c12;
            `;
            document.querySelector('.filters-container').appendChild(counter);
        }

        counter.textContent = `${visibleArticles.length} article${visibleArticles.length > 1 ? 's' : ''} trouvé${visibleArticles.length > 1 ? 's' : ''}`;
    };

    // Ajout des événements
    searchInput.addEventListener('input', filterArticles);
    dateFilter.addEventListener('change', filterArticles);
    sortSelect.addEventListener('change', sortArticles);

    // Animation des articles lors du filtrage
    const addTransitionStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .article-box {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            .article-box[style*="display: none"] {
                opacity: 0;
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
    };

    // Initialisation
    addTransitionStyles();
    updateResultsCounter();

    // Ajout de la fonctionnalité de reset
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Réinitialiser les filtres';
    resetButton.className = 'reset-button';
    resetButton.style.cssText = `
        background: #f39c12;
        color: #2d2d44;
        border: none;
        border-radius: 6px;
        padding: 1rem;
        cursor: pointer;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.8rem;
        margin: 2rem auto 0;
        width: 100%;
        max-width: 250px;
        transition: all 0.3s ease;
        display: block;
    `;
    
    resetButton.addEventListener('mouseenter', () => {
        resetButton.style.backgroundColor = '#e67e22';
    });
    
    resetButton.addEventListener('mouseleave', () => {
        resetButton.style.backgroundColor = '#f39c12';
    });

    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        dateFilter.value = 'all';
        sortSelect.value = 'date-desc';
        filterArticles();
        sortArticles();
    });

    document.querySelector('.filters-section').appendChild(resetButton);
});