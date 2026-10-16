# Guide de soumission — Spordle Annonceur (Chrome Web Store)

Ce dossier contient tous les fichiers prêts pour créer et soumettre une nouvelle extension sur le [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

---

## 📦 Fichiers prêts à l'emploi

| Élément | Emplacement | Format / Taille | Description |
| :--- | :--- | :--- | :--- |
| **Archive ZIP de l'extension** | `dist/spordle-annonceur-cws.zip` | ZIP (97 Ko) | Contient uniquement `manifest.json`, `content.js`, `content.css`, `spordle-engine.js` et les 3 icônes |
| **Icône du Store** | `store-assets/icon-128.png` | PNG 128x128 | Logo officiel de l'extension |
| **Capture 1** | `store-assets/screenshot-1-sommaire.png` | PNG 1280x800 | Sommaire Spordle Play avec boutons 📢 intégrés |
| **Capture 2** | `store-assets/screenshot-2-annonce-but.png` | PNG 1280x800 | Popover d'annonce d'un but (passes, AN, gros caractères) |
| **Capture 3** | `store-assets/screenshot-3-annonce-penalite.png` | PNG 1280x800 | Popover d'annonce d'une pénalité (formule officielle) |
| **Capture 4** | `store-assets/screenshot-4-penalite-combinee.png` | PNG 1280x800 | Détection & fusion automatique des punitions multiples |
| **Capture 5** | `store-assets/screenshot-5-inversion-bancs.png` | PNG 1280x800 | Fonction d'inversion des côtés Visiteur/Local (⇄) |
| **Mosaïque promo (optionnelle)** | `store-assets/promo-tile-440x280.png` | PNG 440x280 | Petite bannière promo pour la vitrine du Store |

---

## 📋 Textes à copier-coller dans la fiche Chrome Web Store

### 1. Fiche de la boutique (Store Listing)

#### **Nom de l'extension** *(max 45 caractères)*
```text
Spordle Annonceur
```

#### **Brève description** *(max 132 caractères)*
```text
Ajoute une icône 📢 sur chaque but et punition de la feuille de match Spordle Play pour afficher en gros le texte à annoncer.
```

#### **Description détaillée**
```markdown
Spordle Annonceur est l'outil indispensable pour l'annonceur maison et les bénévoles à la table de marque lors d'un match de hockey sur Spordle Play (HiSports).

Terminé d'hésiter au micro ou de déchiffrer les petits caractères de la feuille de match ! L'extension ajoute une icône mégaphone discrète (📢) sur chaque événement du sommaire (buts, pénalités et changements de gardien). En un simple survol ou clic, elle affiche en très gros caractères le texte officiel exact prêt à être lu au micro.

CARACTÉRISTIQUES PRINCIPALES :

📢 Annonces de buts complètes et impeccables :
- Respect de l'ordre officiel : ordinal du but, équipe, situation spéciale (avantage numérique, infériorité, filet désert, tir de punition), numéro et nom du buteur, passes et temps de jeu.
- Mention automatique des buts multiples du même joueur (« son deuxième de la rencontre »).

⚖️ Annonces de pénalités officielles Hockey Québec :
- Traduction claire et épurée des codes d'infraction.
- Prise en charge des pénalités de banc et des punitions purgées par un coéquipier.
- Fusion automatique intelligente des pénalités combinées (double mineure, majeure + extrême inconduite de partie, 2+10) avec repérage visuel doré.

🥅 Changements de gardien de but :
- Annonces adaptées pour les entrées de gardien et les retraits en fin de match (filet désert).

⇄ Inversion instantanée des bancs (Visiteur / Local) :
- Un bouton discret permet d'inverser visuellement les côtés gauche et droit pour faire correspondre l'écran de pointage à la disposition physique des bancs de votre aréna.

🔒 Confidentialité totale et respect de la vie privée :
- Fonctionnement 100% local dans le navigateur.
- Aucune donnée transmise vers un serveur externe.
- Aucun pistage ni collecte de statistiques.
```

#### **Catégorie**
* **Productivité** (ou **Sports**)

#### **Langue principale**
* **Français** (ou **Français (Canada)**)

---

### 2. Pratiques de confidentialité (Privacy Practices)

#### **Description de la finalité unique (Single purpose)**
```text
Aider l'annonceur maison lors d'un match de hockey sur Spordle Play en affichant en gros caractères le texte officiel à lire au micro pour chaque événement (but, pénalité, gardien).
```
*(Version anglaise si demandée : "Assist hockey arena announcers by displaying formatted, easy-to-read public address announcements for goals, penalties, and goalie changes directly inside Spordle Play.")*

#### **Justification des autorisations d'hôtes (Host permissions justification)**
Pour les domaines `*://*.spordle.com/*`, `*://*.spordle.dev/*`, `*://*.hisports.app/*` :
```text
L'extension a besoin d'accéder à ces domaines pour injecter les boutons d'annonce mégaphone (📢) et afficher les modales d'annonces directement sur la feuille de match électronique officielle Spordle Play.
```

#### **Collecte de données utilisateur (User Data)**
* Cochez **NON** à toutes les catégories de données (aucune collecte de PII, cookies, identifiants, localisation, navigation, etc.).
* Cochez la case de confirmation certifiant que l'extension respecte la politique de Google sur les données utilisateur.

---

## 🚀 Étapes dans la Google Chrome Developer Console

1. Rendez-vous sur https://chrome.google.com/webstore/devconsole
2. Cliquez sur le bouton bleu **« Nouvel élément » (New item)**.
3. Glissez-déposez le fichier `dist/spordle-annonceur-cws.zip`.
4. Remplissez les champs de l'onglet **Fiche de la boutique** en utilisant les textes et images ci-dessus :
   - Téléversez les 5 captures d'écran depuis le dossier `store-assets/`.
   - Téléversez l'icône 128x128 (`store-assets/icon-128.png`).
   - Téléversez la mosaïque promotionnelle (`store-assets/promo-tile-440x280.png`).
5. Remplissez l'onglet **Confidentialité** avec les justifications fournies ci-dessus.
6. Cliquez sur **« Envoyer pour examen » (Submit for review)**.
