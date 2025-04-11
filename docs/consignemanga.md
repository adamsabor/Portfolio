# Projet E-commerce de Mangas - Cahier des charges

## 1. Objectif du projet
Développer un site e-commerce de vente de mangas avec les fonctionnalités essentielles utilisant PHP et une base de données MySQL.

## 2. Spécifications techniques
- Languages: PHP, HTML, CSS, JavaScript
- Base de données: MySQL 
- Serveur local: MAMP/WAMP/XAMPP

## 3. Fonctionnalités requises

### 3.1 Gestion des produits
- Catalogue de mangas avec images, descriptions et prix
- Système de catégories (shonen, seinen, etc.)
- Moteur de recherche
- Filtres (prix, popularité, nouveautés)

### 3.2 Gestion des utilisateurs
- Inscription/Connexion
- Profil utilisateur
- Historique des commandes
- Gestion des adresses de livraison

### 3.3 Panier d'achat
- Ajout/Suppression de produits
- Modification des quantités
- Calcul automatique du total
- Sauvegarde du panier

### 3.4 Administration
- Interface administrateur sécurisée
- Gestion du catalogue (CRUD)
- Gestion des commandes
- Gestion des utilisateurs

## 4. Structure de la base de données

### Tables principales:
- users (id, username, password, email, etc.)
- products (id, title, description, price, stock, etc.)
- categories (id, name)
- orders (id, user_id, total, status, date)
- order_items (id, order_id, product_id, quantity)

## 5. Critères d'évaluation
- Qualité du code et organisation
- Sécurité (injections SQL, XSS, etc.)
- Design responsive
- Expérience utilisateur
- Documentation du code

## 6. Livrables attendus
- Code source commenté
- Base de données exportée
- Documentation d'installation
- Manuel d'utilisation
- Présentation du projet

## 7. Planning suggéré
- Semaine 1: Conception et structure BDD
- Semaine 2: Développement backend base
- Semaine 3: Développement frontend
- Semaine 4: Tests et finalisation

## 8. Bonus possibles
- Système de notation et avis
- Liste de souhaits
- Recommandations personnalisées
- Newsletter
- Intégration réseaux sociaux

## 9. Ressources
- Documentation PHP: [php.net](https://www.php.net)
- Documentation MySQL: [mysql.com](https://www.mysql.com)
- Bootstrap pour le design: [getbootstrap.com](https://getbootstrap.com)
