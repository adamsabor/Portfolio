document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalImage = document.getElementById("modal-image");
    const modalDescription = document.getElementById("modal-description");
    const closeBtn = document.querySelector(".close-btn");
    const typeFilter = document.getElementById("type-filter");
    const sortOrderBtn = document.getElementById("sort-order");

    let ascendingOrder = true;

    // Fonction pour ouvrir la modale et afficher les détails de la réalisation
    const openModal = (article) => {
        const title = article.querySelector("h3").innerText;
        const imageSrc = article.querySelector(".realisation-image").src;
        const description = article.getAttribute("data-description") || article.querySelector(".description")?.innerText || "Description non disponible.";

        modalTitle.innerText = title;
        modalImage.src = imageSrc;
        modalDescription.innerText = description;
        modal.style.display = "block";
    };

    // Événement d'ouverture de la modale au clic sur chaque article
    document.querySelectorAll(".realisation-article").forEach(article => {
        article.addEventListener("click", () => openModal(article));
    });

    // Fonction pour fermer la modale
    const closeModal = () => {
        modal.style.display = "none";
    };

    // Fermeture de la modale au clic sur le bouton de fermeture
    closeBtn.addEventListener("click", closeModal);

    // Fermeture de la modale si clic en dehors du contenu
    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };

    // Fonction de filtrage des réalisations en fonction du type sélectionné
    const filterArticles = () => {
        if (!typeFilter) return; // S'assure que le filtre existe avant de continuer
        const selectedType = typeFilter.value;
        document.querySelectorAll(".realisation-article").forEach((article) => {
            if (selectedType === "all" || article.getAttribute("data-type") === selectedType) {
                article.style.display = "block";
            } else {
                article.style.display = "none";
            }
        });
    };

    // Fonction de tri des réalisations par date (ascendant ou descendant)
    const sortArticles = () => {
        if (!sortOrderBtn) return; // S'assure que le bouton de tri existe avant de continuer
        const articlesGrid = document.querySelector(".articles-grid");
        const articles = Array.from(articlesGrid.children);

        articles.sort((a, b) => {
            const dateA = new Date(a.getAttribute("data-date"));
            const dateB = new Date(b.getAttribute("data-date"));
            return ascendingOrder ? dateA - dateB : dateB - dateA;
        });

        articles.forEach((article) => articlesGrid.appendChild(article));
        ascendingOrder = !ascendingOrder;
        sortOrderBtn.textContent = ascendingOrder
            ? "Du plus ancien au plus récent"
            : "Du plus récent au plus ancien";
    };

    // Écouteurs d'événements pour les filtres et le tri
    if (typeFilter) typeFilter.addEventListener("change", filterArticles);
    if (sortOrderBtn) sortOrderBtn.addEventListener("click", sortArticles);

    // Initialisation : tri par défaut et affichage des articles filtrés
    sortArticles();
    filterArticles();
});
