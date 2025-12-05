#  FORMULAIRE DE LA GLOIRE : ULTIMATE EDITION

> **Défi Nuit de l'Info - Le Formulaire de Contact Arcade**

![Status](https://img.shields.io/badge/Mission-Accomplie-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.5.0-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20Vanilla%20JS-yellow?style=for-the-badge)

## 🚀 Présentation

Le **Formulaire de la Gloire** n'est pas un simple formulaire de contact. C'est une **expérience interactive spatiale** où chaque champ à remplir est un niveau de jeu vidéo arcade. 

Votre mission : Prouver votre valeur en traversant 4 secteurs hostiles pour transmettre votre message au commandement stellaire.

---

##  Les 4 Secteurs (Niveaux)

###  Secteur 1 : IDENTIFICATION (Défense Orbitale)
* **Objectif :** Saisir son Nom.
* **Gameplay :** *Typing Defense*.
* **Mécaniques :**
    * Détruisez les lettres vertes  (qui composent votre nom) pour avancer.
    * Évitez ou détruisez les lettres rouges ❌ (missiles ennemis) qui font perdre des vies.
    * Tirez sur les étoiles jaunes ⭐ pour le **Bonus de Score**.
    * **Système de Combo :** Enchaînez les tirs sans faute pour multiplier vos points !

###  Secteur 2 : RÉSEAU NEURAL (Labyrinthe Tactique)
* **Objectif :** Reconstruire son Email.
* **Gameplay :** *Maze Shooter*.
* **Mécaniques :**
    * Collectez les fragments de données dans l'ordre : `USER` -> `@` -> `DOMAIN`.
    * **Combat :** Utilisez votre **Pistolet Laser** (Barre Espace) pour détruire les murs destructibles (néon) et éliminer les Bots de Sécurité qui patrouillent.
    * Attention aux mines rouges ☢️ !

###  Secteur 3 : ACQUISITION (Radar)
* **Objectif :** Définir le Sujet.
* **Gameplay :** *Target Shooting* (Tir sur cibles mouvantes).
* **Mécaniques :**
    * Des mots-clés traversent l'écran radar.
    * Cliquez pour verrouiller les cibles et construire votre phrase.
    * **Easter Egg :** Ouvrez l'œil pour une visite temporelle... 🚗⚡

###  Secteur 4 : TRANSMISSION (Cockpit Holographique)
* **Objectif :** Rédiger et Envoyer le Message.
* **Gameplay :** *Terminal Simulator*.
* **Mécaniques :**
    * Une jauge de puissance du signal réagit à votre frappe.
    * **Départ Standard :** Envoi classique des données.
    * **CODE OMEGA (Easter Egg) :** Une phrase secrète déclenche un passage en **Hyper-Espace (Warp Speed)** et active le mode Jackpot.

### 🎰 LE FINAL : JACKPOT & HIGHSCORES
* Une fois le message transmis via le mode Omega, une **Machine à Sous** détermine votre destin.
* **Tableau des Scores :** Un classement "Top 5 Capitaines" mondial s'affiche, basé sur les scores cumulés des 4 niveaux.

---

## 🤫 Codes Secrets & Easter Eggs

Le jeu est bourré de références pop-culture. Saurez-vous les trouver ?

| Secteur | Action Secrète | Effet |
| :--- | :--- | :--- |
| **Niv 3** | Cliquer sur le mot **"DELOREAN"** ou **"FUTUR"** | Une DeLorean traverse l'écran (Retour vers le Futur) |
| **Niv 4** | Écrire **"Vers l'infini et au-delà"** | Buzz l'Éclair vient à la rescousse |
| **Niv 4** | Écrire **"It's time"** | Mariah Carey décongèle (Son) |
| **Niv 4** | Écrire **"Félicitations, vous avez gagné !"** | **CODE OMEGA :** Déclenche le Warp Speed et la Victoire Totale |

---

## 🛠️ Installation & Démarrage

### Prérequis
* [Node.js](https://nodejs.org/) installé.

### Installation Locale

1.  **Récupérer le projet** :
    ```bash
    git clone [https://github.com/votre-pseudo/formulaire-gloire.git](https://github.com/votre-pseudo/formulaire-gloire.git)
    cd formulaire-gloire
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

3.  **Lancer le serveur** :
    ```bash
    node server/server.js
    ```

4.  **Jouer** :
    Ouvrez votre navigateur sur `http://localhost:3000`.

---

## Structure du Projet

```text
formulaire-gloire/
├── index.html          # Point d'entrée (SPA)
├── package.json        # Configuration Node
├── css/                # Styles (Néon/Holo)
│   ├── style.css       # Base + Niv 1
│   ├── level2.css      # Labyrinthe
│   ├── level3.css      # Radar
│   ├── level4.css      # Cockpit
│   └── jackpot.css     # Final
├── js/                 # Logique Jeu
│   ├── main.js         # Chef d'orchestre + Audio Manager
│   ├── level1.js       # Typing Game
│   ├── level2.js       # Shooter Game
│   ├── level3.js       # Target Game
│   ├── level4.js       # Terminal + Warp Logic
│   └── jackpot.js      # Slots + Highscores
├── server/             # Backend
│   ├── server.js       # API Express (GET/POST)
│   └── submissions.json # Base de données JSON (auto-générée)
└── assets/             # Médias
    ├── sounds/         # MP3 (music, click, warp, mariah...)
    └── images/         # PNG/GIF (buzz, delorean...)