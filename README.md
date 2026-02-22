# Application de Sensibilisation à la Biodiversité (SAE 501)

Ce projet est une application web full-stack développée dans le cadre de la SAE 501. Elle vise à sensibiliser les utilisateurs à la biodiversité, aux espèces animales menacées et aux environnements, tout en permettant des dons pour la conservation.

## 🚀 Fonctionnalités

* **Carte Interactive** : Visualisation des habitats animaux et environnements sur une carte (Leaflet).
* **Encyclopédie** : Consultation d'articles détaillés sur les animaux, les pays et les niveaux d'extinction.
* **Système Utilisateur** : Inscription, connexion sécurisée (JWT), et gestion de profil.
* **Favoris** : Possibilité pour les utilisateurs de sauvegarder leurs articles préférés.
* **Dons** : Intégration de Stripe pour effectuer des dons.
* **QR Code Scanner** : Fonctionnalité de scan pour accéder rapidement aux informations (ex: dans un parc ou musée).
* **PWA (Progressive Web App)** : Application installable sur mobile.

## 🛠 Technologies

### Backend
* **Framework** : Symfony 7.4 (PHP 8.2+)
* **API** : API Platform
* **Base de données** : MySQL / Doctrine ORM
* **Authentification** : JWT (LexikJWTAuthenticationBundle)
* **Paiement** : Stripe SDK
* **Emails** : Symfony Mailer (via Mailtrap)

### Frontend
* **Framework** : React 19
* **Build Tool** : Vite
* **Routing** : React Router Dom
* **Cartographie** : React Leaflet / Leaflet
* **UI/UX** : CSS personnalisé, Responsive Design
* **PWA** : Vite PWA Plugin

### Infrastructure
* **Conteneurisation** : Docker & Docker Compose

## 📋 Prérequis

* Docker et Docker Compose installés sur votre machine.
* Node.js et npm (pour le développement local hors Docker).
* Composer (pour le développement local hors Docker).

## 🔧 Installation et Lancement

### Via Docker (Recommandé)

1.  **Cloner le dépôt :**
    ```bash
    git clone <votre-repo-url>
    cd SAE
    ```

2.  **Configurer les variables d'environnement :**
    * Dupliquez `backend/.env` en `backend/.env.local` et configurez votre base de données et clés API (Stripe, Mailtrap, etc.).
    * **Génération des clés JWT** (Obligatoire pour l'authentification) :
        ```bash
        docker compose exec backend bin/console lexik:jwt:generate-keypair
        ```
    * Assurez-vous que le fichier `compose.yaml` (et `compose.override.yaml`) est correct.

3.  **Lancer les conteneurs :**
    ```bash
    cd backend
    docker compose up -d --build
    ```

4.  **Initialiser la base de données (si nécessaire) :**
    ```bash
    docker compose exec backend bin/console doctrine:database:create
    docker compose exec backend bin/console doctrine:migrations:migrate
    docker compose exec backend bin/console doctrine:fixtures:load
    ```

5.  **Lancer le Frontend :**
    * Si le frontend n'est pas dockerisé dans votre stack actuelle, lancez-le manuellement :
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

### Accès

* **API (Documentation)** : `http://localhost:8000/api` (ou port configuré)
* **Frontend** : `http://localhost:5173` (par défaut avec Vite)
  
## 📂 Structure du Projet

```
SAE/
├── backend/        # Code source de l'API Symfony
│   ├── src/        # Entités, Contrôleurs, etc.
│   ├── config/     # Configuration Symfony
│   └── ...
├── frontend/       # Code source de l'application React
│   ├── src/        # Composants, Pages, Services
│   ├── public/     # Assets statiques
│   └── ...
└── data/           # Scripts de données et backups JSON/SQL
```

## 👥 Auteurs

Projet réalisé par BOITEAU Isaure, CLISSON Aaron et LEMOUTON Jolann.
