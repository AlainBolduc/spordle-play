# Spordle Annonceur — Contexte et Instructions pour Agents

Ce document fournit le contexte complet, les spécifications fonctionnelles et les règles d'implémentation pour continuer le développement de l'extension Chrome **Spordle Annonceur** sur une autre machine ou avec un autre agent.

---

## 1. Objectif du projet

Extension Chrome (Manifest V3) conçue pour aider l'annonceur maison lors d'un match de hockey utilisant l'application officielle de feuille de match électronique **Spordle Play** (`*.spordle.com`, `*.spordle.dev` ou `*.hisports.app`).

L'extension ajoute un bouton discret (icône mégaphone SVG) sur chaque ligne d'événement du sommaire (buts et pénalités). Au survol ou au clic, un popover plein écran s'affiche avec le **texte exact prêt à être lu au micro**, rédigé en gros caractères faciles à lire.

---

## 2. Structure du dépôt

```text
.
├── manifest.json       # Manifest V3 de l'extension Chrome
├── spordle-engine.js   # Moteur pur d'annonces & dictionnaire officiel Hockey Québec 2026-2027
├── test-events.js      # Source unique de vérité : 66 cas de tests & structure de match complète
├── demo-renderer.js    # Rendu dynamique du sommaire Spordle Play pour demo.html
├── test-engine.js      # Suite de tests unitaires automatisés (node test-engine.js)
├── content.js          # Script de contenu injecté (logique DOM & UI)
├── content.css         # Styles de l'extension (boutons, popover, backdrop)
├── spordle.css         # Feuilles de styles officielles extraites de Spordle Play
├── assets/             # Polices (Inter, Ionicons, Montserrat, HiSports) et logos locaux
├── game_data.json      # Données JSON brutes du match (événements, équipes, etc.)
├── demo.html           # Page miroir 100% hors-ligne pilotée par les données de test-events.js
├── icon-16.png         # Icône extension 16x16
├── icon-48.png         # Icône extension 48x48
├── icon-128.png        # Icône extension 128x128
├── build-userscript.js # Script de compilation du Userscript Safari/iOS (node build-userscript.js)
├── dist/               # Fichiers distribués pour Safari iOS (spordle-annonceur.user.js)
├── .gitignore          # Ignore les zips, images de dev et .DS_Store
└── AGENTS.md           # Ce guide de contexte et d'instructions
```

---

## 3. Spécifications fonctionnelles et règles de texte

### A. Annonce d'un but (`buildGoal`)
1. **Rang ordinal du but** : Calculé par rapport à l'équipe (« Le premier but », « Le deuxième but », « Le troisième but », etc.).
2. **Nom d'équipe réel** : Ne jamais afficher « Local » ou « Visiteur » ; extraire le nom officiel (`Express Rive-Sud 7`, etc.) via `.score-home` / `.score-away`.
3. **Joueur et passes** :
   - But & passes sur la **même ligne** (aucun saut de ligne entre le marqueur et les aides/sans aide) :
     - Avec aides : « **marqué [situation spéciale] par le numéro X, [Nom Prénom], assisté du numéro Y, [Nom Prénom], et du numéro Z, [Nom Prénom].** »
     - Sans aide : « **marqué [situation spéciale] par le numéro X, [Nom Prénom], sans aide.** »
   - **Multiples buts du même joueur** : À partir du 2e but d'un même joueur pour son équipe, ajouter après le nom d'équipe : « **, son [deuxième / troisième / ...] de la rencontre,** » (ex. : *« Le troisième but des Remparts Est Richelieu, son troisième de la rencontre, »*).
4. **Situations spéciales** :
   - **Toutes intégrées directement dans la phrase du buteur** :
     - `[DN]`, `[SH]`, ou `[IN]` : **« marqué en infériorité numérique par le numéro X, [Nom Prénom], ... »**
     - `[AN]`, `[PP]`, ou `[SN]` : **« marqué en avantage numérique par le numéro X, [Nom Prénom], ... »**
     - `[FD]`, `[EN]`, ou `[ENG]` : **« marqué dans un filet désert par le numéro X, [Nom Prénom], ... »**
     - `[Tir de punition]` ou `[Penalty shot]` : **« marqué sur un tir de punition par le numéro X, [Nom Prénom], ... »**
     - **Combinaisons** (ex. `[DN]` + `[FD]`) : **« marqué en infériorité numérique dans un filet désert par le numéro X, [Nom Prénom], ... »**
   - Nettoyer ces balises pour ne pas polluer les noms de joueurs.
5. **Temps du but** : Ligne distincte (avec retour à la ligne) :
   - « **Le temps du but : MM:SS de la Xe période.** »

### B. Annonce d'une pénalité (`buildPenalty`)
1. **Terminologie** : Utiliser impérativement le mot **« Pénalité »** (et non « Punition »).
2. **Formule épurée** :
   - « Pénalité aux **[Équipe]**, »
   - « au numéro **X**, [Nom Prénom], »
   - « **2 minutes** pour [description de l'infraction]. » (ex. : `2 minutes pour coup de bâton`).
3. **Pénalités purgées par un autre joueur / Pénalités de banc** :
   - **Pénalité décernée à un joueur et servie par un autre** (ex: `LILY-ROSE BOILEAU (30) - SERVI: MILA BEAUREGARD (15) - A22 - Coup de bâton (Mineure)`) :
     - « Pénalité aux **[Équipe]**, »
     - « au numéro **30, Lily-Rose Boileau**, »
     - « **2 minutes** pour coup de bâton. »
     - « La pénalité sera purgée par le numéro **15, Mila Beauregard**. »
     - « Le temps de la pénalité : **MM:SS** de la Xe période. »
   - **Pénalité de banc avec purgeur** (ex: `Punition de banc: RAPHAELLE KANASH (24) - A80 - Trop de joueurs sur la patinoire (Mineure)`) :
     - « Pénalité de banc aux **[Équipe]**, »
     - « **2 minutes** pour trop de joueurs sur la patinoire. »
     - « La pénalité sera purgée par le numéro **24, Raphaelle Kanash**. »
     - « Le temps de la pénalité : **MM:SS** de la Xe période. »
   - **Pénalité de banc sans purgeur spécifié** :
     - « Pénalité de banc aux **[Équipe]**, »
     - « **2 minutes** pour [infraction]. »
     - « Le temps de la pénalité : **MM:SS** de la Xe période. »
4. **Pénalités multiples combinées (même joueur au même temps de match)** :
   - **Double mineure** (ex: `Mineure 2/4` + `Mineure 4/4` pour contact à la tête) :
     -> **« 4 minutes pour [infraction]. »**
   - **Majeure + Extrême inconduite** (ex: `Majeure` + `Extrême inconduite` pour mise en échec par derrière) :
     -> **« 5 minutes et extrême inconduite de partie pour [infraction]. »**
   - **Mineure + Inconduite** (2 + 10) :
     -> **« 2 minutes et 10 minutes d'inconduite pour [infraction]. »**
   - Les deux lignes du sommaire affichent le texte combiné et sont visuellement identifiées par une bordure dorée (`.sa-penalty-linked`).
5. **Éléments exclus** :
   - **Ne pas mentionner** « mineure », « majeure », ou le code d'arbitrage (ex: `A22`, `A52`, `B40`, `D40`).
   - **Ignorer** les pastilles de statistiques Spordle comme `1 OAN`, `2 OAN` (Opportunités en Avantage Numérique) et les mentions d'horodatage comme `Début: 07:00`.
6. **Temps de la pénalité** : « Le temps de la pénalité : **MM:SS** de la Xe période. »

### C. Annonce d'un changement de gardien de but (`buildGoalieChange` / `formatGoalieChange`)
1. **Formule officielle** :
   - « Changement de gardien de but du côté des **[Équipe]**, »
   - « maintenant devant le filet : le numéro **X, [Prénom Nom]**. »
   - « Le temps du changement : **MM:SS** de la Xe période. »
2. **Gardien retiré (6e attaquant / filet désert)** :
   - « Le gardien de but des **[Équipe]** est retiré de son filet. »
   - « Le temps du retrait : **MM:SS** de la Xe période. »

---

## 4. Règles d'UI / UX

1. **Position & Style de l'icône dans le sommaire Spordle** :
   - L'icône est le SVG officiel **Ionicons `megaphone-outline`** (contour net sans remplissage).
   - Style discret et transparent parfaitement intégré au thème : sans bordure, sans fond, couleur `#003876` (identique au bleu du bouton crayon de Spordle), survol avec léger grossissement et teinte `#0086d7`.
   - L'icône mégaphone est insérée **à l'intérieur de `.modify`** (`modifyEl.prepend(btn)`), immédiatement à gauche des boutons Spordle.
   - Grille CSS native préservée avec `grid-template-columns: 60px 150px 1fr auto !important;`.
   - `.modify` est configuré en `display: inline-flex !important; align-items: center !important; justify-content: flex-end !important; gap: 2px !important; min-width: 100px !important; width: auto !important;` avec `ng-transclude { flex-wrap: nowrap !important; }` afin d'éviter tout retour à la ligne des boutons d'action (`[📢]`, `[✏️]`, `[❌]`) et de garantir un alignement horizontal parfait avec les lignes gardiens.
   - Les pénalités combinées utilisent un accent doré `box-shadow: inset 4px 0 0 #ffc900 !important;` (`.sa-penalty-linked`) et une icône dorée (`#c9a340`).
2. **Popover Modal & Backdrop (Style Spordle Play)** :
   - Un seul popover ouvert à la fois.
   - **Charte visuelle Spordle Play** : Le popover adopte l'apparence des fenêtres modales officielles de Spordle Play :
     - Fond `#33383c`, bordure `#4a5058`, rayons de courbure cohérents (6px).
     - Barre de titre supérieure `.bar-dark` (`#252831`) intégrant :
       - Une pastille d'événement (`BUT` en bleu officiel `#003876` avec point vert, ou `PÉNALITÉ` en rouge officiel `#b83f43` avec point doré).
       - Le logo officiel de l'équipe (extrait du DOM) et son nom complet en police Spordle `interbold`.
       - Le bouton de fermeture discret avec icône Ionicons `ion-close-round` stylisé comme les boutons d'en-tête Spordle.
     - Conteneur de lecture principal stylisé comme une section/card Spordle (`#2b2e34`, bordure `#454b54`, accent coloré latéral gauche 5px).
     - Pied de modal `.sa-modal-footer` (`#252831`) rappelant l'objectif d'annonce vocale et les raccourcis de fermeture.
   - **Survol sans flicker** : le popover a `pointer-events: none` tant qu'il n'est pas épinglé par un clic (pour ne jamais intercepter le curseur de la souris et déclencher des boucles `mouseleave`/`mouseenter`), accompagné d'un court délai (120ms).
   - **Mode Clic (Toggle épinglé)** : un clic sur l'icône ouvre et épingle (`.sa-pinned` active `pointer-events: auto !important` et affiche le backdrop sombre). Un second clic referme.
   - Un clic sur le backdrop sombre (`#sa-backdrop`), sur le bouton **✕** en haut à droite, ou l'appui sur **Échap** (`Escape`) ferme immédiatement le popover.
   - Textes d'annonce stylisés en très grand format adaptatif (`clamp(24px, 3.2vw, 38px)`), avec les chiffres et noms clés mis en évidence en couleur dorée (`#ffc900`).
3. **Inversion des côtés (Bouton `⇄`)** :
   - Ajout d'un bouton discret inséré directement à la droite de la catégorie du match (`.game-category .sa-swap-sides-btn`) pour permuter visuellement les côtés Visiteur et Local, sans occuper de ligne supplémentaire et sans réduire l'espace d'affichage du sommaire.
   - Idéal lorsque les bancs ou tableaux physiques à l'aréna sont inversés par rapport à la feuille Spordle Play standard.
   - **Garantie d'intégrité** : l'inversion est purement visuelle (CSS Grid / Flexbox via `.sa-swapped-sides`). Le DOM sous-jacent et les bindings Angular restent intacts : chaque bouton physique (`But`, `Punitions`, `Gardien`) déclenche toujours exactement le modal de l'équipe affichée au-dessus de lui.
   - L'état d'inversion est mémorisé spécifiquement pour chaque match dans le `localStorage` (`sa_swap_sides_game_<id>` extrait de l'URL `/scoresheets/<id>` ou du numéro de match dans le DOM).

---

## 5. Environnement de test local (`demo.html`)

- `demo.html` reproduit fidèlement la structure DOM de Spordle Play avec des données réelles de match.
- **Sécurité & Confidentialité** : Ne jamais ajouter de requêtes réseau externes (Cloudflare, polices distantes, analytics). Tout doit fonctionner de manière hermétique en local via `file:///`.

---

## 6. Commandes utiles & Déploiement

- **Règle absolue de versioning (Auto-update iPad / Userscripts)** :
  - **Chaque fois qu'on push sur GitHub, on DOIT obligatoirement incrémenter le numéro de version (`version`) dans `manifest.json` avant le commit.**
  - Sans incrémentation de version (`1.0.0` -> `1.0.1` -> etc.), l'application Userscripts sur les iPads des annonceurs ne détectera pas la mise à jour automatique.
  - Procédure de déploiement systématique :
    1. Modifier `version` dans `manifest.json`.
    2. Exécuter `node build-userscript.js` (recompile `dist/spordle-annonceur.user.js` avec la nouvelle version).
    3. Exécuter les tests : `node test-engine.js`.
    4. Commiter et pousser : `git commit -am "..." && git push origin main`.
- **Recharger dans Chrome** :
  1. Ouvrir `chrome://extensions`.
  2. Mode développeur activé.
  3. Charger le dossier décompressé ou cliquer sur **Actualiser (↻)**.
- **Git Remote & SSH** :
  - Dépôt distant : `git@github-perso:AlainBolduc/spordle-play.git` (ou `git@github.com:AlainBolduc/spordle-play.git`).
  - Branche principale : `main`.
