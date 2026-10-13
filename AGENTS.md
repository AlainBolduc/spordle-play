# Spordle Annonceur — Contexte et Instructions pour Agents

Ce document fournit le contexte complet, les spécifications fonctionnelles et les règles d'implémentation pour continuer le développement de l'extension Chrome **Spordle Annonceur** sur une autre machine ou avec un autre agent.

---

## 1. Objectif du projet

Extension Chrome (Manifest V3) conçue pour aider l'annonceur maison lors d'un match de hockey utilisant l'application officielle de feuille de match électronique **Spordle Play** (`*.spordle.com` ou `*.hisports.app`).

L'extension ajoute un bouton discret (icône mégaphone SVG) sur chaque ligne d'événement du sommaire (buts et pénalités). Au survol ou au clic, un popover plein écran s'affiche avec le **texte exact prêt à être lu au micro**, rédigé en gros caractères faciles à lire.

---

## 2. Structure du dépôt

```text
.
├── manifest.json       # Manifest V3 de l'extension Chrome
├── content.js          # Script de contenu injecté (logique métier & DOM)
├── content.css         # Styles de l'extension (boutons, popover, backdrop)
├── demo.html           # Page miroir 100% hors-ligne pour tester sans réseau
├── icon-16.png         # Icône extension 16x16
├── icon-48.png         # Icône extension 48x48
├── icon-128.png        # Icône extension 128x128
├── .gitignore          # Ignore les zips et .DS_Store
└── AGENTS.md           # Ce guide de contexte et d'instructions
```

---

## 3. Spécifications fonctionnelles et règles de texte

### A. Annonce d'un but (`buildGoal`)
1. **Rang ordinal du but** : Calculé par rapport à l'équipe (« Le premier but », « Le deuxième but », « Le troisième but », etc.).
2. **Nom d'équipe réel** : Ne jamais afficher « Local » ou « Visiteur » ; extraire le nom officiel (`Express Rive-Sud 7`, etc.) via `.score-home` / `.score-away`.
3. **Joueur et passes** :
   - But : « marqué par le numéro **X**, [Nom Prénom] ».
   - Passes : « Aidé du numéro **Y**, [Nom Prénom], et du numéro **Z**, [Nom Prénom]. »
   - Aucun passeur : « Sans aide. »
4. **Situations spéciales** :
   - Détecter les balises dans le sommaire Spordle :
     - `[AN]` ou `[PP]` : **« Marqué en avantage numérique. »**
     - `[DN]`, `[SH]`, ou `[IN]` : **« Marqué en infériorité numérique. »**
     - `[FD]` ou `[EN]` : **« Marqué dans un filet désert. »**
   - Nettoyer ces balises pour ne pas polluer les noms de joueurs.
5. **Temps du but** : « Le temps du but : **MM:SS** de la Xe période. »

### B. Annonce d'une pénalité (`buildPenalty`)
1. **Terminologie** : Utiliser impérativement le mot **« Pénalité »** (et non « Punition »).
2. **Formule épurée** :
   - « Pénalité aux **[Équipe]**, »
   - « au numéro **X**, [Nom Prénom], »
   - « **2 minutes** pour [description de l'infraction]. » (ex. : `2 minutes pour coup de bâton`).
3. **Éléments exclus** :
   - **Ne pas mentionner** « mineure », « majeure », ou le code d'arbitrage (ex: `A22`, `A52`).
   - **Ignorer** les pastilles de statistiques Spordle comme `1 OAN`, `2 OAN` (Opportunités en Avantage Numérique).
4. **Temps de la pénalité** : « Le temps de la pénalité : **MM:SS** de la Xe période. »

---

## 4. Règles d'UI / UX

1. **Position de l'icône dans le sommaire Spordle** :
   - L'icône mégaphone doit être placée **immédiatement à gauche de la zone d'actions** (`.modify` qui contient le crayon d'édition et le X de suppression).
   - Ne **jamais** provoquer de retour à la ligne (`flex-wrap: nowrap !important`).
2. **Popover & Backdrop** :
   - Un seul popover ouvert à la fois.
   - Mode Toggle : un clic sur l'icône ouvre/épingle, un second clic sur la même icône referme.
   - Un clic sur le backdrop sombre (`#sa-backdrop`), sur le bouton **✕** en haut à droite, ou l'appui sur **Échap** (`Escape`) ferme immédiatement le popover.
   - Textes d'annonce stylisés en très grand format (`font-size: ~46px`), avec les chiffres et noms clés mis en évidence en couleur dorée (`#ffc900`).

---

## 5. Environnement de test local (`demo.html`)

- `demo.html` reproduit fidèlement la structure DOM de Spordle Play avec des données réelles de match.
- **Sécurité & Confidentialité** : Ne jamais ajouter de requêtes réseau externes (Cloudflare, polices distantes, analytics). Tout doit fonctionner de manière hermétique en local via `file:///`.

---

## 6. Commandes utiles & Déploiement

- **Recharger dans Chrome** :
  1. Ouvrir `chrome://extensions`.
  2. Mode développeur activé.
  3. Charger le dossier décompressé ou cliquer sur **Actualiser (↻)**.
- **Git Remote & SSH** :
  - Dépôt distant : `git@github-perso:AlainBolduc/spordle-play.git` (ou `git@github.com:AlainBolduc/spordle-play.git`).
  - Branche principale : `main`.
