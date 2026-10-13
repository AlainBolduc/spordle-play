// ==UserScript==
// @name         Spordle Annonceur
// @namespace    https://github.com/AlainBolduc/spordle-play
// @version      1.0.0
// @description  Affiche le texte exact à lire au micro pour chaque but et punition sur Spordle Play
// @author       Alain Bolduc
// @match        *://*.spordle.com/*
// @match        *://*.spordle.dev/*
// @match        *://*.hisports.app/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/AlainBolduc/spordle-play/main/dist/spordle-annonceur.user.js
// @downloadURL  https://raw.githubusercontent.com/AlainBolduc/spordle-play/main/dist/spordle-annonceur.user.js
// ==/UserScript==

/**
 * =============================================================
 * 1. INJECTION DES STYLES CSS (content.css)
 * =============================================================
 */

(() => {
  try {
    const existing = document.getElementById("spordle-annonceur-styles");
    if (!existing) {
      const css = "/* Bouton placé à gauche du crayon d'édition dans .modify */\n.sa-announce-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  margin: 0 !important;\n  border-radius: 4px;\n  border: none !important;\n  background: transparent !important;\n  color: #003876 !important; /* Même bleu que le bouton crayon de Spordle */\n  cursor: pointer;\n  user-select: none;\n  flex-shrink: 0 !important; /* Ne rétrécit jamais */\n  padding: 0;\n  transition: transform 0.15s ease, color 0.15s ease, background-color 0.15s ease;\n  outline: none;\n}\n.sa-announce-btn svg {\n  display: block;\n  pointer-events: none; /* Évite les conflits d'événements souris sur l'icône */\n}\n.sa-announce-btn:hover {\n  color: #0086d7 !important;\n  background: rgba(0, 56, 118, 0.08) !important;\n  transform: scale(1.1);\n}\n\n/* Préserve la grille et évite tout retour à la ligne des boutons d'action à droite */\n.summary-item {\n  grid-template-columns: 60px 150px 1fr auto !important;\n}\n\n.summary-item .modify {\n  width: auto !important;\n  min-width: 100px !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: flex-end !important;\n  gap: 2px !important;\n}\n\n.summary-item .modify ng-transclude {\n  display: inline-flex !important;\n  align-items: center !important;\n  flex-wrap: nowrap !important;\n  width: auto !important;\n}\n\n/* Lignes de pénalités combinées pour un même joueur au même temps (inset pour préserver l'alignement) */\n.summary-item.sa-penalty-linked {\n  box-shadow: inset 4px 0 0 #ffc900 !important;\n}\n.summary-item.sa-penalty-linked .sa-announce-btn {\n  color: #c9a340 !important;\n}\n\n/* Backdrop sombre pour fermer au clic à l'extérieur */\n#sa-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: rgba(0, 0, 0, 0.65);\n  backdrop-filter: blur(2px);\n  z-index: 2147483646;\n  display: none;\n  cursor: pointer;\n}\n#sa-backdrop.sa-visible {\n  display: block;\n}\n\n/* Popover d'annonceur — Style modal Spordle Play */\n#sa-popover {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 2147483647;\n  width: min(92vw, 1020px);\n  max-height: 90vh;\n  display: none;\n  flex-direction: column;\n  background-color: #33383c;\n  color: #fff;\n  border-radius: 6px;\n  border: 1px solid #4a5058;\n  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05);\n  font-family: \"interregular\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n  overflow: hidden;\n  pointer-events: none; /* Ne capture jamais le curseur en survol d'aperçu */\n}\n#sa-popover.sa-visible {\n  display: flex;\n}\n#sa-popover.sa-pinned {\n  pointer-events: auto !important; /* Cliquable et scrollable uniquement lorsqu'épinglé */\n}\n\n/* En-tête modal bar-dark */\n#sa-popover .sa-modal-header {\n  position: relative !important;\n  top: auto !important;\n  left: auto !important;\n  right: auto !important;\n  width: 100% !important;\n  height: 52px !important;\n  min-height: 52px !important;\n  padding: 0 16px !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: space-between !important;\n  background-color: #252831 !important;\n  border-bottom: 1px solid #1a1c22 !important;\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n  box-sizing: border-box;\n}\n\n/* Badge de type d'événement (BUT ou PÉNALITÉ) */\n#sa-popover .sa-modal-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 5px 12px;\n  border-radius: 4px;\n  font-family: \"interbold\", \"interregular\", sans-serif;\n  font-size: 13px;\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n  font-weight: 700;\n  flex-shrink: 0;\n}\n#sa-popover .sa-modal-badge .sa-badge-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  display: inline-block;\n}\n#sa-popover .sa-modal-badge.sa-badge-goal {\n  background-color: #003876;\n  color: #fff;\n  border: 1px solid #004d99;\n}\n#sa-popover .sa-modal-badge.sa-badge-goal .sa-badge-dot {\n  background-color: #33cd5f;\n  box-shadow: 0 0 6px #33cd5f;\n}\n#sa-popover .sa-modal-badge.sa-badge-penalty {\n  background-color: #b83f43;\n  color: #fff;\n  border: 1px solid #d94b50;\n}\n#sa-popover .sa-modal-badge.sa-badge-penalty .sa-badge-dot {\n  background-color: #ffc900;\n  box-shadow: 0 0 6px #ffc900;\n}\n#sa-popover .sa-modal-badge.sa-badge-goalie {\n  background-color: #4a5058;\n  color: #fff;\n  border: 1px solid #626973;\n}\n#sa-popover .sa-modal-badge.sa-badge-goalie .sa-badge-dot {\n  background-color: #00d2d3;\n  box-shadow: 0 0 6px #00d2d3;\n}\n\n/* Titre central avec logo et nom d'équipe */\n#sa-popover .sa-modal-title {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  flex: 1;\n  min-width: 0;\n  padding: 0 12px;\n  color: #dce2e3;\n  font-family: \"interbold\", \"interregular\", sans-serif;\n  font-size: 17px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n#sa-popover .sa-modal-team-logo {\n  width: 32px;\n  height: 32px;\n  background-size: contain;\n  background-repeat: no-repeat;\n  background-position: center;\n  flex-shrink: 0;\n}\n#sa-popover .sa-team-name {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  letter-spacing: 0.2px;\n}\n\n/* Bouton Fermer (icône discrète Ionicons intégrée au header Spordle) */\n#sa-popover .sa-modal-close-btn {\n  background: transparent !important;\n  border: none !important;\n  color: #a1a3ac !important;\n  padding: 4px 8px !important;\n  margin: 0 !important;\n  height: 36px !important;\n  min-height: 36px !important;\n  line-height: 1 !important;\n  cursor: pointer;\n  border-radius: 4px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px !important;\n  flex-shrink: 0;\n  transition: color 0.15s ease, background-color 0.15s ease;\n}\n#sa-popover .sa-modal-close-btn:hover {\n  color: #fff !important;\n  background-color: rgba(255, 255, 255, 0.08) !important;\n}\n\n/* Corps du popover */\n#sa-popover .sa-modal-body {\n  padding: 22px 24px;\n  overflow-y: auto;\n  flex: 1;\n}\n\n/* Carte de contenu principale calquée sur les sections/cards Spordle */\n#sa-popover .sa-modal-card {\n  background-color: #2b2e34;\n  border: 1px solid #454b54;\n  border-radius: 6px;\n  padding: 24px 30px;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);\n}\n\n/* Accentuation de bordure gauche selon le type d'événement */\n#sa-popover.sa-goal .sa-modal-card {\n  border-left: 5px solid #0086d7;\n}\n#sa-popover.sa-penalty .sa-modal-card {\n  border-left: 5px solid #b83f43;\n}\n#sa-popover.sa-goalie .sa-modal-card {\n  border-left: 5px solid #00d2d3;\n}\n\n/* Lignes de texte d'annonce (gros caractères pour le micro) */\n#sa-popover .sa-line {\n  font-size: clamp(24px, 3.2vw, 38px);\n  line-height: 1.38;\n  font-weight: 500;\n  color: #f0f3f4;\n  margin: 8px 0;\n  font-family: \"interregular\", -apple-system, sans-serif;\n}\n#sa-popover .sa-line strong {\n  font-family: \"interbold\", \"interregular\", sans-serif;\n  color: #ffc900;\n  font-weight: 700;\n}\n\n/* Ligne de temps distincte et légèrement plus sobre */\n#sa-popover .sa-line:last-child {\n  margin-top: 16px;\n  padding-top: 14px;\n  border-top: 1px solid rgba(255, 255, 255, 0.08);\n  font-size: clamp(20px, 2.5vw, 30px);\n  color: #c0cbcc;\n}\n\n/* Footer informatif discret */\n#sa-popover .sa-modal-footer {\n  padding: 10px 24px;\n  background-color: #252831;\n  border-top: 1px solid #1a1c22;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 12px;\n  color: #8c929a;\n  border-bottom-left-radius: 5px;\n  border-bottom-right-radius: 5px;\n}\n#sa-popover .sa-modal-footer .sa-hint-icon {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  color: #ffc900;\n  font-weight: 600;\n}\n#sa-popover .sa-modal-footer .sa-hint-dismiss {\n  color: #7d828a;\n}\n\n/* ==========================================================\n   Bouton et disposition d'inversion des côtés (Visiteur ⇄ Local)\n   ========================================================== */\n\n/* Bouton compact inséré directement à la droite de .game-category */\n.sa-swap-sides-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  background: #2b2e33;\n  color: #dce2e3;\n  border: 1px solid #4a5058;\n  border-radius: 12px;\n  padding: 1px 9px;\n  font-size: 11px;\n  font-weight: 600;\n  cursor: pointer;\n  user-select: none;\n  margin-left: 10px;\n  vertical-align: middle;\n  line-height: 1.5;\n  transition: all 0.15s ease;\n  outline: none;\n}\n\n.game-category {\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n}\n\n.sa-swap-sides-btn:hover {\n  background: #373b40;\n  border-color: #ffc900;\n  color: #ffc900;\n  transform: translateY(-1px);\n}\n\n.sa-swap-sides-btn:active {\n  transform: translateY(0);\n}\n\n.sa-swap-sides-btn .sa-swap-arrow {\n  font-size: 13px;\n  color: #ffc900;\n  display: inline-block;\n  line-height: 1;\n  transition: transform 0.25s ease;\n}\n\n.sa-swapped-sides .sa-swap-sides-btn {\n  background: #1e2023;\n  border-color: #ffc900;\n  color: #ffc900;\n  box-shadow: 0 0 6px rgba(255, 201, 0, 0.25);\n}\n\n.sa-swapped-sides .sa-swap-sides-btn .sa-swap-arrow {\n  transform: rotate(180deg);\n}\n\n\n/* --- Inversion du tableau de pointage (Desktop / >= 900px) --- */\n.sa-swapped-sides .score-view {\n  grid-template-areas:\n    \"home-logo home-name home-name home-score away-score away-name away-name away-logo\"\n    \"buttons buttons buttons buttons buttons buttons buttons buttons\" !important;\n}\n\n/* Inversion de l'alignement des noms :\n   En mode normal : .score-away.score-name est text-align: right (vers le centre),\n   .score-home.score-name est text-align: left / default (vers le centre).\n   En mode inversé : home est à gauche (doit être text-align: right vers le centre),\n   away est à droite (doit être text-align: left vers le centre). */\n@media (min-width: 900px) {\n  .sa-swapped-sides .score-view .score-away.score-name {\n    text-align: left !important;\n  }\n  .sa-swapped-sides .score-view .score-home.score-name {\n    text-align: right !important;\n  }\n}\n\n/* Inversion des boutons sous le score (Desktop) */\n.sa-swapped-sides .score-buttons {\n  grid-template-areas: \"home-swap home-penalty home-goal away-goal away-penalty away-swap\" !important;\n}\n\n/* Inversion des pénalités actives en cours :\n   Dans Spordle : .away-penalties a flex-direction: row-reverse (les chandails s'empilent depuis le centre vers la gauche)\n   et .home-penalties est standard (les chandails s'empilent depuis le centre vers la droite).\n   En mode inversé, on intervertit les côtés (.home-penalties à gauche et .away-penalties à droite)\n   et on échange leur sens d'empilement pour que les pénalités partent toujours du libellé central vers les côtés extérieurs. */\n.sa-swapped-sides .active-penalties {\n  flex-direction: row-reverse !important;\n}\n.sa-swapped-sides .active-penalties .away-penalties {\n  flex-direction: row !important;\n}\n.sa-swapped-sides .active-penalties .home-penalties {\n  flex-direction: row-reverse !important;\n}\n\n/* --- Inversion en affichage mobile / tablette (< 900px) --- */\n@media (max-width: 900px) {\n  .sa-swapped-sides .score-view {\n    grid-template-areas:\n      \"home-name home-name home-name home-name\"\n      \"home-logo home-score away-score away-logo\"\n      \"away-name away-name away-name away-name\"\n      \"buttons buttons buttons buttons\" !important;\n  }\n  .sa-swapped-sides .score-view .score-home.score-score {\n    justify-self: left !important;\n  }\n  .sa-swapped-sides .score-view .score-away.score-score {\n    justify-self: right !important;\n  }\n  .sa-swapped-sides .score-view .score-away.score-score .sportsmanship {\n    order: initial !important;\n  }\n  .sa-swapped-sides .score-view .score-away.score-score .score {\n    order: initial !important;\n  }\n  .sa-swapped-sides .score-view .score-away.score-score .type {\n    order: initial !important;\n  }\n  .sa-swapped-sides .score-view .score-home.score-score .sportsmanship {\n    order: 1 !important;\n  }\n  .sa-swapped-sides .score-view .score-home.score-score .score {\n    order: 2 !important;\n  }\n  .sa-swapped-sides .score-view .score-home.score-score .type {\n    order: 3 !important;\n  }\n  .sa-swapped-sides .score-buttons {\n    grid-template-areas:\n      \"home-goal home-goal away-goal away-goal\"\n      \"home-swap home-penalty away-penalty away-swap\" !important;\n  }\n}\n\n\n";
      const style = document.createElement("style");
      style.id = "spordle-annonceur-styles";
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    }
  } catch (err) {
    console.error("[Spordle Annonceur] Erreur injection CSS:", err);
  }
})();


/**
 * =============================================================
 * 2. MOTEUR OFFICIEL DES ANNONCES (spordle-engine.js)
 * =============================================================
 */
/**
 * Spordle Annonceur — Moteur métier pur (Spordle Engine)
 * 
 * Codification officielle Hockey Québec (Saison 2026-2027)
 * Ce module est 100% indépendant du DOM et de Chrome.
 * Il peut être exécuté dans Node.js, le navigateur, ou porté vers Swift, React Native, etc.
 */
((root, factory) => {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    root.SpordleEngine = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  "use strict";

  // =========================================================================
  // 1. DICTIONNAIRE OFFICIEL HOCKEY QUÉBEC 2026-2027
  // =========================================================================

  /**
   * Types de punition de base (Préfixes de code)
   */
  const SEVERITY_TYPES = {
    A: { code: "A", name: "Mineure", minutes: 2, french: "2 minutes" },
    B: { code: "B", name: "Majeure", minutes: 5, french: "5 minutes" },
    C: { code: "C", name: "Inconduite", minutes: 10, french: "10 minutes d'inconduite" },
    D: { code: "D", name: "Extrême inconduite", minutes: 0, isEjection: true, french: "extrême inconduite de partie" },
    E: { code: "E", name: "Punition de match", minutes: 5, isEjection: true, french: "5 minutes et punition de match" },
    F: { code: "F", name: "Tir de punition", minutes: 0, isPenaltyShot: true, french: "tir de punition" }
  };

  /**
   * Table exhaustive des infractions Hockey Québec (Codes 1 à 99)
   * Fournit le nom officiel et la formulation parlée naturelle au micro.
   */
  const INFRACTIONS = {
    // --- GROUPE 1 : FAUTES RELATIVES AUX BAGARRES ---
    1: { id: 1, group: 1, name: "Agresseur", spoken: "agresseur" },
    2: { id: 2, group: 1, name: "Bagarre", spoken: "s'être battu" },
    3: { id: 3, group: 1, name: "Bagarre (1 seul joueur impliqué)", spoken: "s'être battu" },
    4: { id: 4, group: 1, name: "Instigateur", spoken: "instigateur" },
    5: { id: 5, group: 1, name: "Demeurer sur les lieux d'une bagarre", spoken: "avoir demeuré sur les lieux d'une bagarre" },
    6: { id: 6, group: 1, name: "Bagarre secondaire au cours d'un même arrêt de jeu", spoken: "bagarre secondaire" },
    7: { id: 7, group: 1, name: "Troisième joueur à intervenir dans une bagarre", spoken: "troisième joueur à intervenir dans une bagarre" },
    8: { id: 8, group: 1, name: "Quitter le banc lors d'une bagarre", spoken: "avoir quitté le banc lors d'une bagarre" },
    9: { id: 9, group: 1, name: "Gardien qui quitte son enceinte lors d'une bagarre", spoken: "gardien ayant quitté son enceinte lors d'une bagarre" },
    10: { id: 10, group: 1, name: "Saisir les cheveux ou protecteur facial", spoken: "avoir saisi le protecteur facial" },
    11: { id: 11, group: 1, name: "Saisir protecteur facial avec avantage", spoken: "avoir saisi le protecteur facial pour infliger une blessure" },
    12: { id: 12, group: 1, name: "Utiliser protecteur facial comme une arme", spoken: "utilisation du protecteur facial comme une arme" },
    13: { id: 13, group: 1, name: "Matériau sur les mains pour blesser", spoken: "matériau sur les mains pour blesser" },
    14: { id: 14, group: 1, name: "Enlever son casque pour se battre", spoken: "avoir enlevé son casque pour se battre" },
    15: { id: 15, group: 1, name: "Chandail non attaché lors d'une bagarre", spoken: "chandail non attaché lors d'une bagarre" },

    // --- GROUPE 2 : FAUTES COMMISES AVEC LE BÂTON ---
    22: { id: 22, group: 2, name: "Coup de bâton", spoken: "coup de bâton" },
    23: { id: 23, group: 2, name: "Darder", spoken: "avoir dardé" },
    24: { id: 24, group: 2, name: "Donner un six pouces", spoken: "avoir donné un six pouces" },
    25: { id: 25, group: 2, name: "Double échec", spoken: "double échec" },
    26: { id: 26, group: 2, name: "Bâton trop élevé", spoken: "bâton trop élevé" },

    // --- GROUPE 3 : FAUTES PHYSIQUES ---
    31: { id: 31, group: 3, name: "Assaut", spoken: "assaut" },
    32: { id: 32, group: 3, name: "Tentative de blesser", spoken: "tentative de blesser" },
    34: { id: 34, group: 3, name: "Donner du coude", spoken: "avoir donné du coude" },
    35: { id: 35, group: 3, name: "Donner du genou", spoken: "avoir donné du genou" },
    36: { id: 36, group: 3, name: "Donner un coup de patin", spoken: "avoir donné un coup de patin" },
    37: { id: 37, group: 3, name: "Donner un coup de tête", spoken: "avoir donné un coup de tête" },
    39: { id: 39, group: 3, name: "Mise en échec corporelle", spoken: "mise en échec corporelle" },
    40: { id: 40, group: 3, name: "Mise en échec par derrière", spoken: "mise en échec par derrière" },
    41: { id: 41, group: 3, name: "Charge en T", spoken: "charge en T" },
    44: { id: 44, group: 3, name: "Donner de la bande", spoken: "avoir donné de la bande" },
    47: { id: 47, group: 3, name: "Rudesse", spoken: "rudesse" },
    48: { id: 48, group: 3, name: "Contact avec la tête", spoken: "contact avec la tête" },

    // --- GROUPE 4 : FAUTES D'ENTRAVE ---
    50: { id: 50, group: 4, name: "Retenir", spoken: "avoir retenu" },
    51: { id: 51, group: 4, name: "Avoir retenu le bâton", spoken: "avoir retenu le bâton" },
    52: { id: 52, group: 4, name: "Accrocher", spoken: "avoir accroché" },
    53: { id: 53, group: 4, name: "Faire trébucher", spoken: "avoir fait trébucher" },
    54: { id: 54, group: 4, name: "Faucher les patins", spoken: "avoir fauché les patins" },
    55: { id: 55, group: 4, name: "Frapper en bas des hanches", spoken: "avoir frappé en bas des hanches" },
    56: { id: 56, group: 4, name: "Obstruction", spoken: "obstruction" },
    57: { id: 57, group: 4, name: "Obstruction du banc", spoken: "obstruction du banc" },
    58: { id: 58, group: 4, name: "Obstruction sur le gardien de but", spoken: "obstruction sur le gardien de but" },

    // --- GROUPE 5 : FAUTES RELATIVES AU COMPORTEMENT ---
    61: { id: 61, group: 5, name: "Abus verbal / Conduite antisportive", spoken: "conduite antisportive" },
    62: { id: 62, group: 5, name: "Propos discriminatoires", spoken: "propos discriminatoires" },
    63: { id: 63, group: 5, name: "Manifestation antisportive d'équipe", spoken: "manifestation antisportive d'équipe" },
    64: { id: 64, group: 5, name: "Attroupement poignée de mains", spoken: "avoir causé un attroupement lors de la poignée de mains" },
    66: { id: 66, group: 5, name: "Inconduite grossière", spoken: "inconduite grossière" },
    67: { id: 67, group: 5, name: "Discrimination", spoken: "discrimination" },
    70: { id: 70, group: 5, name: "Comportement irrespectueux", spoken: "comportement irrespectueux" },
    72: { id: 72, group: 5, name: "Refus de se rendre au banc des punitions", spoken: "refus de se rendre immédiatement au banc des punitions" },
    75: { id: 75, group: 5, name: "Geste négligent", spoken: "geste négligent" },
    76: { id: 76, group: 5, name: "Force physique accidentelle envers un officiel", spoken: "force physique accidentelle envers un officiel" },
    77: { id: 77, group: 5, name: "Menace envers un officiel", spoken: "tentative ou menace de frapper un officiel" },
    78: { id: 78, group: 5, name: "Agression physique envers un officiel", spoken: "agression physique envers un officiel" },
    79: { id: 79, group: 5, name: "Cracher", spoken: "avoir craché" },

    // --- GROUPE 6 : AUTRES FAUTES ---
    80: { id: 80, group: 6, name: "Trop de joueurs sur la patinoire", spoken: "trop de joueurs sur la patinoire", isBenchMinor: true },
    81: { id: 81, group: 6, name: "Bâton brisé ou illégal", spoken: "avoir joué avec un bâton brisé" },
    82: { id: 82, group: 6, name: "Demande non justifiée de mesurage", spoken: "demande non justifiée de mesurage" },
    83: { id: 83, group: 6, name: "Refus de mesurage", spoken: "refus de se soumettre à un mesurage" },
    84: { id: 84, group: 6, name: "Équipement protecteur inapproprié", spoken: "équipement protecteur inapproprié" },
    85: { id: 85, group: 6, name: "Équipement non certifié ou dangereux", spoken: "équipement non certifié ou dangereux" },
    86: { id: 86, group: 6, name: "Équipement non réglementaire", spoken: "équipement non réglementaire" },
    87: { id: 87, group: 6, name: "Punition de banc d'équipe", spoken: "punition de banc", isBenchMinor: true },
    88: { id: 88, group: 6, name: "Deuxième punition d'inconduite", spoken: "deuxième punition d'inconduite" },
    89: { id: 89, group: 6, name: "Tir botté", spoken: "tir botté" },
    90: { id: 90, group: 6, name: "Avoir quitté le banc des joueurs", spoken: "avoir quitté le banc" },
    91: { id: 91, group: 6, name: "Lancer son bâton ou un objet", spoken: "avoir lancé son bâton" },
    92: { id: 92, group: 6, name: "Retarder le jeu", spoken: "avoir retardé le jeu" },
    93: { id: 93, group: 6, name: "Déplacer intentionnellement le but", spoken: "avoir déplacé intentionnellement le but" },
    95: { id: 95, group: 6, name: "Mise au jeu illégale", spoken: "mise au jeu illégale" },
    96: { id: 96, group: 6, name: "Saisir ou geler la rondelle", spoken: "avoir gelé la rondelle" },
    97: { id: 97, group: 6, name: "Refus de se mettre au jeu", spoken: "refus de se mettre au jeu" },
    98: { id: 98, group: 6, name: "Quitter le banc en fin de période", spoken: "avoir quitté le banc en fin de période" },
    99: { id: 99, group: 6, name: "Infraction diverse", spoken: "infraction diverse" }
  };

  // =========================================================================
  // 2. UTILITAIRES DE TEXTE & FORMATAGE
  // =========================================================================

  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

  const titleCase = (s) =>
    clean(s)
      .toLowerCase()
      .replace(/(^|[\s\-'’])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const ORDINALS_MASC = [
    "", "premier", "deuxième", "troisième", "quatrième", "cinquième",
    "sixième", "septième", "huitième", "neuvième", "dixième",
    "onzième", "douzième", "treizième", "quatorzième", "quinzième"
  ];

  const getOrdinalMasc = (n) => ORDINALS_MASC[n] || `${n}e`;

  /**
   * "17:37" / "3" -> "17:37 de la 3e période."
   */
  const formatPeriodTime = (time, period) => {
    const t = clean(time).replace(/^0(\d)/, "$1");
    const pStr = String(period || "").trim().toLowerCase();
    let pLabel = "3e période";
    if (pStr === "1" || pStr.includes("1re") || pStr.includes("1er")) {
      pLabel = "1re période";
    } else if (pStr === "2" || pStr.includes("2e")) {
      pLabel = "2e période";
    } else if (pStr === "3" || pStr.includes("3e")) {
      pLabel = "3e période";
    } else if (pStr === "ot" || pStr.includes("prolongation") || pStr === "4") {
      pLabel = "période de prolongation";
    } else if (pStr) {
      pLabel = `${pStr} période`;
    }
    return `Le temps ${pLabel.includes("prolongation") ? "du but" : ""} : ${t} de la ${pLabel}.`;
  };

  // =========================================================================
  // 3. MOTEUR DE DÉCODAGE DES CODES HOCKEY QUÉBEC
  // =========================================================================

  /**
   * Décode un code comme "A22", "B40", "A80", "A22/G"
   */
  const parsePenaltyCode = (codeStr) => {
    if (!codeStr) return null;
    const match = String(codeStr).trim().match(/^([A-F])(\d{1,2})(?:\/([A-Z]+))?$/i);
    if (!match) return null;

    const prefix = match[1].toUpperCase();
    const num = parseInt(match[2], 10);
    const mod = match[3] ? match[3].toUpperCase() : null;

    const severity = SEVERITY_TYPES[prefix] || { code: prefix, name: prefix, minutes: 2, french: "2 minutes" };
    const infraction = INFRACTIONS[num] || { id: num, name: `Code ${num}`, spoken: `infraction ${num}` };

    return {
      rawCode: codeStr,
      prefix,
      number: num,
      modifier: mod,
      isGoaliePenalty: mod === "G",
      isAfterWhistle: mod === "S",
      severity,
      infraction
    };
  };

  /**
   * Détermine la durée et formule d'une liste de pénalités combinées du même joueur
   */
  const resolvePenaltyCombination = (parsedCodes) => {
    if (!parsedCodes || parsedCodes.length === 0) {
      return { durationText: "2 minutes", spokenInfraction: "infraction" };
    }

    const prefixes = parsedCodes.map((c) => c.prefix).sort();
    const key = prefixes.join("+");

    // Infraction principale parlée (priorité à la première connue)
    const primaryInfraction = parsedCodes[0].infraction.spoken;

    // Règles de combinaison officielles Hockey Québec
    if (key === "A+A") {
      return { durationText: "4 minutes", spokenInfraction: primaryInfraction };
    }
    if (key === "B+D") {
      return { durationText: "5 minutes et extrême inconduite de partie", spokenInfraction: primaryInfraction };
    }
    if (key === "A+C") {
      return { durationText: "2 minutes et 10 minutes d'inconduite", spokenInfraction: primaryInfraction };
    }
    if (key === "A+D") {
      return { durationText: "2 minutes et extrême inconduite de partie", spokenInfraction: primaryInfraction };
    }
    if (key === "B+E" || key === "E+B") {
      return { durationText: "5 minutes et punition de match", spokenInfraction: primaryInfraction };
    }
    if (key === "A+A+D") {
      return { durationText: "4 minutes et extrême inconduite de partie", spokenInfraction: primaryInfraction };
    }

    // Code unique
    if (parsedCodes.length === 1) {
      const p = parsedCodes[0];
      return {
        durationText: p.severity.french,
        spokenInfraction: p.infraction.spoken
      };
    }

    // Fallback dynamique
    let totalMin = 0;
    const extras = [];
    parsedCodes.forEach((c) => {
      if (c.severity.minutes) totalMin += c.severity.minutes;
      if (c.severity.isEjection) extras.push("extrême inconduite de partie");
      if (c.severity.code === "C") extras.push("10 minutes d'inconduite");
    });

    let parts = [];
    if (totalMin > 0) parts.push(`${totalMin} minutes`);
    if (extras.length > 0) parts.push([...new Set(extras)].join(" et "));

    return {
      durationText: parts.join(" et ") || "2 minutes",
      spokenInfraction: primaryInfraction
    };
  };

  // =========================================================================
  // 4. MOTEUR DE GÉNÉRATION DES BUTS (GOAL ANNOUNCER)
  // =========================================================================

  /**
   * Génère l'annonce complète d'un but.
   * 
   * @param {Object} goal
   *   - teamName: string (ex: "Remparts Est Richelieu")
   *   - teamGoalCount: number (rang du but de l'équipe dans le match: 1, 2, 3...)
   *   - scorer: { name: string, number: string|number, goalCountInGame?: number }
   *   - assists: Array<{ name: string, number: string|number }>
   *   - isPowerplay?: boolean (Avantage numérique)
   *   - isShorthanded?: boolean (Infériorité numérique)
   *   - isEmptyNet?: boolean (Filet désert)
   *   - isPenaltyShot?: boolean (Tir de punition)
   *   - time: string (ex: "07:48")
   *   - period: string|number (ex: "3" ou "3e période")
   */
  const formatGoal = (goal) => {
    const team = clean(goal.teamName || "Équipe");
    const count = goal.teamGoalCount || 1;
    const ordinalMasc = getOrdinalMasc(count);
    const countText = count === 1 ? "Le premier" : `Le ${ordinalMasc}`;

    // Ligne 1 : Titre et compteur de buts
    let line1 = `${countText} but des ${team},`;
    if (goal.scorer && goal.scorer.goalCountInGame && goal.scorer.goalCountInGame >= 2) {
      const playerOrdinal = getOrdinalMasc(goal.scorer.goalCountInGame);
      line1 = `${countText} but des ${team}, son ${playerOrdinal} de la rencontre,`;
    }

    // Situation spéciale intégrée
    const specParts = [];
    if (goal.isPenaltyShot) {
      specParts.push("sur un tir de punition");
    } else {
      if (goal.isShorthanded) specParts.push("en infériorité numérique");
      if (goal.isPowerplay) specParts.push("en avantage numérique");
      if (goal.isEmptyNet) specParts.push("dans un filet désert");
    }
    const specPhrase = specParts.length > 0 ? ` ${specParts.join(" ")}` : "";

    // Buteur et aides sur la même phrase (Ligne 2)
    let line2 = "";
    const sNum = goal.scorer ? String(goal.scorer.number).trim() : "?";
    const sName = goal.scorer ? titleCase(goal.scorer.name) : "Inconnu";

    const assists = Array.isArray(goal.assists) ? goal.assists.filter((a) => a && a.name) : [];
    if (assists.length === 0) {
      line2 = `marqué${specPhrase} par le numéro ${sNum}, ${sName}, sans aide.`;
    } else if (assists.length === 1) {
      const a1Num = String(assists[0].number).trim();
      const a1Name = titleCase(assists[0].name);
      line2 = `marqué${specPhrase} par le numéro ${sNum}, ${sName}, assisté du numéro ${a1Num}, ${a1Name}.`;
    } else {
      const a1Num = String(assists[0].number).trim();
      const a1Name = titleCase(assists[0].name);
      const a2Num = String(assists[1].number).trim();
      const a2Name = titleCase(assists[1].name);
      line2 = `marqué${specPhrase} par le numéro ${sNum}, ${sName}, assisté du numéro ${a1Num}, ${a1Name}, et du numéro ${a2Num}, ${a2Name}.`;
    }

    // Ligne 3 : Temps
    const t = clean(goal.time || "").replace(/^0(\d)/, "$1");
    let pLabel = "3e période";
    const pStr = String(goal.period || "").trim().toLowerCase();
    if (pStr === "1" || pStr.includes("1re") || pStr.includes("1er")) pLabel = "1re période";
    else if (pStr === "2" || pStr.includes("2e")) pLabel = "2e période";
    else if (pStr === "3" || pStr.includes("3e")) pLabel = "3e période";
    else if (pStr === "ot" || pStr.includes("prolongation") || pStr === "4") pLabel = "période de prolongation";

    const line3 = `Le temps du but : ${t} de la ${pLabel}.`;

    // Ligne 1 HTML
    let htmlLine1 = `Le <strong>${ordinalMasc}</strong> but des <strong>${escapeHtml(team)}</strong>,`;
    if (count === 1) htmlLine1 = `Le <strong>premier</strong> but des <strong>${escapeHtml(team)}</strong>,`;
    if (goal.scorer && goal.scorer.goalCountInGame && goal.scorer.goalCountInGame >= 2) {
      const pOrd = getOrdinalMasc(goal.scorer.goalCountInGame);
      htmlLine1 = `${htmlLine1.slice(0, -1)}, son <strong>${pOrd}</strong> de la rencontre,`;
    }

    // Ligne 2 HTML
    let htmlLine2 = "";
    if (assists.length === 0) {
      htmlLine2 = `marqué${specPhrase} par le numéro <strong>${escapeHtml(sNum)}</strong>, ${escapeHtml(sName)}, sans aide.`;
    } else if (assists.length === 1) {
      const a1Num = String(assists[0].number).trim();
      const a1Name = titleCase(assists[0].name);
      htmlLine2 = `marqué${specPhrase} par le numéro <strong>${escapeHtml(sNum)}</strong>, ${escapeHtml(sName)}, assisté du numéro <strong>${escapeHtml(a1Num)}</strong>, ${escapeHtml(a1Name)}.`;
    } else {
      const a1Num = String(assists[0].number).trim();
      const a1Name = titleCase(assists[0].name);
      const a2Num = String(assists[1].number).trim();
      const a2Name = titleCase(assists[1].name);
      htmlLine2 = `marqué${specPhrase} par le numéro <strong>${escapeHtml(sNum)}</strong>, ${escapeHtml(sName)}, assisté du numéro <strong>${escapeHtml(a1Num)}</strong>, ${escapeHtml(a1Name)}, et du numéro <strong>${escapeHtml(a2Num)}</strong>, ${escapeHtml(a2Name)}.`;
    }

    // Ligne 3 HTML
    const htmlLine3 = `Le temps du but : <strong>${escapeHtml(t)}</strong> de la ${escapeHtml(pLabel)}.`;

    return {
      type: "goal",
      title: `BUT — ${team.toUpperCase()}`,
      teamName: team,
      lines: [line1, line2, line3],
      htmlLines: [htmlLine1, htmlLine2, htmlLine3],
      speechText: `${line1} ${line2} ${line3}`
    };
  };

  // =========================================================================
  // 5. MOTEUR DE GÉNÉRATION DES PÉNALITÉS (PENALTY ANNOUNCER)
  // =========================================================================

  /**
   * Génère l'annonce complète d'une pénalité (simple ou combinée).
   */
  const formatPenalty = (penalty) => {
    const team = clean(penalty.teamName || "Équipe");
    const isBench = !!penalty.isBenchMinor;
    const lines = [];
    const htmlLines = [];

    // Ligne 1 : Équipe
    if (isBench) {
      lines.push(`Pénalité de banc aux ${team},`);
      htmlLines.push(`Pénalité de banc aux <strong>${escapeHtml(team)}</strong>,`);
    } else {
      lines.push(`Pénalité aux ${team},`);
      htmlLines.push(`Pénalité aux <strong>${escapeHtml(team)}</strong>,`);
      if (penalty.penalizedPlayer && penalty.penalizedPlayer.name) {
        const pNum = String(penalty.penalizedPlayer.number).trim();
        const pName = titleCase(penalty.penalizedPlayer.name);
        lines.push(`au numéro ${pNum}, ${pName},`);
        htmlLines.push(`au numéro <strong>${escapeHtml(pNum)}</strong>, ${escapeHtml(pName)},`);
      }
    }

    // Résolution durée & infraction
    let durationText = penalty.durationDescription || "2 minutes";
    let infractionText = penalty.infractionDescription || "infraction";

    if (Array.isArray(penalty.codes) && penalty.codes.length > 0) {
      const parsed = penalty.codes.map(parsePenaltyCode).filter(Boolean);
      if (parsed.length > 0) {
        const resolved = resolvePenaltyCombination(parsed);
        durationText = resolved.durationText;
        infractionText = resolved.spokenInfraction;
      }
    }

    // Ligne Infraction
    lines.push(`${durationText} pour ${infractionText}.`);
    htmlLines.push(`<strong>${escapeHtml(durationText)}</strong> pour ${escapeHtml(infractionText)}.`);

    // Ligne Purgeur éventuel (si pénalité servie par un autre joueur)
    if (penalty.servedByPlayer && penalty.servedByPlayer.name) {
      const sNum = String(penalty.servedByPlayer.number).trim();
      const sName = titleCase(penalty.servedByPlayer.name);
      lines.push(`La pénalité sera purgée par le numéro ${sNum}, ${sName}.`);
      htmlLines.push(`La pénalité sera purgée par le numéro <strong>${escapeHtml(sNum)}</strong>, ${escapeHtml(sName)}.`);
    }

    // Ligne Temps
    const t = clean(penalty.time || "").replace(/^0(\d)/, "$1");
    let pLabel = "3e période";
    const pStr = String(penalty.period || "").trim().toLowerCase();
    if (pStr === "1" || pStr.includes("1re") || pStr.includes("1er")) pLabel = "1re période";
    else if (pStr === "2" || pStr.includes("2e")) pLabel = "2e période";
    else if (pStr === "3" || pStr.includes("3e")) pLabel = "3e période";
    else if (pStr === "ot" || pStr.includes("prolongation") || pStr === "4") pLabel = "période de prolongation";

    lines.push(`Le temps de la pénalité : ${t} de la ${pLabel}.`);
    htmlLines.push(`Le temps de la pénalité : <strong>${escapeHtml(t)}</strong> de la ${escapeHtml(pLabel)}.`);

    return {
      type: "penalty",
      title: `PÉNALITÉ — ${team.toUpperCase()}`,
      teamName: team,
      lines,
      htmlLines,
      speechText: lines.join(" ")
    };
  };

  /**
   * 5b. FORMATAGE D'UN CHANGEMENT DE GARDIEN DE BUT
   * 
   * Règle d'annonce :
   * « Changement de gardien de but du côté de [Équipe]. »
   * « Maintenant devant le filet : le numéro [X, Prénom Nom]. »
   * « Le temps du changement : [MM:SS] de la [Xe période]. » (si le temps est spécifié)
   */
  const formatGoalieChange = (goalieEvent) => {
    const lines = [];
    const htmlLines = [];

    const team = clean(goalieEvent.teamName || "l'équipe");
    const num = goalieEvent.goalie ? String(goalieEvent.goalie.number || "").trim() : "";
    const name = goalieEvent.goalie ? titleCase(goalieEvent.goalie.name || "") : "";

    // Ligne 1 : Annonce de l'équipe
    lines.push(`Changement de gardien de but du côté des ${team},`);
    htmlLines.push(`Changement de gardien de but du côté des <strong>${escapeHtml(team)}</strong>,`);

    // Ligne 2 : Nouveau gardien devant le filet
    if (num && name) {
      lines.push(`maintenant devant le filet : le numéro ${num}, ${name}.`);
      htmlLines.push(`maintenant devant le filet : le numéro <strong>${escapeHtml(num)}</strong>, ${escapeHtml(name)}.`);
    } else if (name) {
      lines.push(`maintenant devant le filet : ${name}.`);
      htmlLines.push(`maintenant devant le filet : <strong>${escapeHtml(name)}</strong>.`);
    } else {
      lines.push(`maintenant devant le filet.`);
      htmlLines.push(`maintenant devant le filet.`);
    }

    // Ligne 3 : Temps du changement
    if (goalieEvent.time) {
      const t = clean(goalieEvent.time).replace(/^0(\d)/, "$1");
      let pLabel = "3e période";
      const pStr = String(goalieEvent.period || "").trim().toLowerCase();
      if (pStr === "1" || pStr.includes("1re") || pStr.includes("1er")) pLabel = "1re période";
      else if (pStr === "2" || pStr.includes("2e")) pLabel = "2e période";
      else if (pStr === "3" || pStr.includes("3e")) pLabel = "3e période";
      else if (pStr === "ot" || pStr.includes("prolongation") || pStr === "4") pLabel = "période de prolongation";

      lines.push(`Le temps du changement : ${t} de la ${pLabel}.`);
      htmlLines.push(`Le temps du changement : <strong>${escapeHtml(t)}</strong> de la ${escapeHtml(pLabel)}.`);
    }

    return {
      type: "goalie",
      title: `GARDIEN — ${team.toUpperCase()}`,
      teamName: team,
      lines,
      htmlLines,
      speechText: lines.join(" ")
    };
  };

  // =========================================================================
  // 6. EXPORT DU MODULE
  // =========================================================================

  return {
    SEVERITY_TYPES,
    INFRACTIONS,
    parsePenaltyCode,
    resolvePenaltyCombination,
    formatGoal,
    formatPenalty,
    formatGoalieChange,
    utils: {
      clean,
      titleCase,
      escapeHtml,
      getOrdinalMasc,
      formatPeriodTime
    }
  };
});


/**
 * =============================================================
 * 3. LOGIQUE D'INJECTION DANS LE SOMMAIRE SPORDLE PLAY (content.js)
 * =============================================================
 */
// Spordle Annonceur — ajoute une icône 📢 à chaque but / punition du sommaire
// et affiche, au survol, le texte à lire en gros caractères.
(() => {
  "use strict";

  const BTN_CLASS = "sa-announce-btn";
  let popover = null;
  let pinned = false;

  // ---------- Utilitaires de texte ----------

  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

  // "MAYSON GOSSELIN" -> "Mayson Gosselin" (gère tirets et apostrophes)
  const titleCase = (s) =>
    clean(s)
      .toLowerCase()
      .replace(/(^|[\s\-'’])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  // "05:44" -> "5:44"
  const formatTime = (t) => clean(t).replace(/^0(\d)/, "$1");

  // Extrait les joueurs au format "NOM PRÉNOM (77)"
  const parsePlayers = (text) => {
    const players = [];
    const re = /([^,():]+?)\s*\((\d+)\)/g;
    let m;
    while ((m = re.exec(text))) {
      const name = m[1].replace(/^[\s\-–—]+/, "");
      players.push({ name: titleCase(name), number: m[2] });
    }
    return players;
  };

  const playerHtml = (p) =>
    `numéro <strong>${escapeHtml(p.number)}</strong>, ${escapeHtml(p.name)}`;

  const cleanPenaltyDetails = (text) =>
    (text || "")
      .replace(/\d+\s*(?:OAN|PPO)\b/gi, "")
      .replace(/(?:D[eé]but|Start|Fin|End)\s*:\s*\d{1,2}:\d{2}/gi, "")
      .replace(/\s+/g, " ")
      .trim();

  // Durée annoncée selon la sévérité
  const DURATIONS = [
    [/double\s*mineure|double\s*minor/i, "4 minutes"],
    [/mineure\s*de\s*banc|bench\s*minor/i, "2 minutes"],
    [/mineure\s*\d\/\d|minor\s*\d\/\d/i, "2 minutes"],
    [/mineure|minor/i, "2 minutes"],
    [/majeure|major/i, "5 minutes"],
    [/extr[eê]me\s*inconduite|game\s*misconduct/i, "extrême inconduite de partie"],
    [/inconduite\s*de\s*match/i, "inconduite de match"],
    [/p[eé]nalit[eé]\s*de\s*match|match\s*penalty/i, "5 minutes et pénalité de match"],
    [/grossi[eè]re/i, "grossière inconduite"],
    [/inconduite|misconduct/i, "10 minutes"],
  ];

  // Extrait les informations de pénalité : joueur fautif, purgeur, sévérité, infraction
  // Gère :
  // - "LILY-ROSE BOILEAU (30) - SERVI: MILA BEAUREGARD (15) - A22 - Coup de bâton (Mineure)"
  // - "Punition de banc: RAPHAELLE KANASH (24) - A80 - Trop de joueurs sur la patinoire (Mineure)"
  // - "ALEXE ROUSSON (99) - A48 - Contact avec la tête (Mineure 4/4)"
  const parsePenaltyEvent = (details) => {
    const cleaned = cleanPenaltyDetails(details);
    const isBench = /\b(?:banc|bench)\b/i.test(cleaned);

    // Extraction d'un éventuel joueur purgeur via "- SERVI: NOM (NUM)" ou "SERVED / PURGÉ"
    let servedBy = null;
    const servedMatch = cleaned.match(/\b(?:SERVI|SERVED|PURG[EÉ])\s*:\s*([^()]+?\(\d+\))/i);
    if (servedMatch) {
      const parsedServer = parsePlayers(servedMatch[1]);
      if (parsedServer.length) servedBy = parsedServer[0];
    }

    // Retirer le segment de purge pour le traitement de l'infraction
    let s = cleaned.replace(/\s*-\s*(?:SERVI|SERVED|PURG[EÉ])\s*:\s*[^()]+?\(\d+\)/gi, "");

    // Retirer le préfixe de banc éventuel
    s = s.replace(/^(?:punition|p[eé]nalit[eé]|penalty)?\s*de\s*banc\s*[:\-–—]?\s*/i, "").trim();

    // Trouver les joueurs restants dans la chaîne
    const players = parsePlayers(s);
    let player = null;

    if (isBench) {
      // Pour une pénalité de banc : s'il y a un joueur indiqué, c'est celui qui purge
      if (!servedBy && players.length > 0) {
        servedBy = players[0];
      }
    } else {
      // Pour une pénalité normale : le premier joueur est le fautif
      if (players.length > 0) {
        player = players[0];
      }
    }

    // On retire le joueur fautif ou purgeur du début pour ne garder que l'infraction et la sévérité
    if (player) {
      s = s.replace(new RegExp(`^[^()]+?\\(${player.number}\\)`), "").trim();
    } else if (isBench && servedBy) {
      s = s.replace(new RegExp(`^[^()]+?\\(${servedBy.number}\\)`), "").trim();
    }

    s = clean(s).replace(/^[\-–—:,\s]+/, "").replace(/[\-–—:,\s]+$/, "");
    s = s.replace(/^(?:banc|bench|équipe|equipe)\s*[\-–—:]*\s*/i, "");
    s = clean(s).replace(/^[\-–—:,\s]+/, "").replace(/[\-–—:,\s]+$/, "");

    let severity = "";
    const sevMatch = s.match(/\(([^()]+)\)\s*$/);
    if (sevMatch) {
      severity = clean(sevMatch[1]);
      s = clean(s.slice(0, sevMatch.index)).replace(/^[\-–—:,\s]+/, "").replace(/[\-–—:,\s]+$/, "");
    }
    const parts = s.split(/\s+[\-–—]\s+/).map(clean).filter(Boolean);
    let code = "";
    if (parts.length && /^[A-Z]{1,2}\d{1,3}[a-z]?(?:\/[A-Z]+)?$/i.test(parts[0])) code = parts.shift();
    const infraction = parts.join(" - ");
    const found = DURATIONS.find(([re]) => re.test(severity));
    const duration = found ? found[1] : (severity ? "" : "2 minutes");

    return {
      isBench,
      player,
      servedBy,
      code,
      infraction,
      severity,
      duration,
    };
  };

  // "- A22 - Coup de bâton (Mineure)" -> { code, infraction, severity, duration }
  const parsePenalty = (text) => {
    let s = clean(cleanPenaltyDetails(text)).replace(/^[\-–—:,\s]+/, "");
    s = s.replace(/^(?:banc|bench|équipe|equipe)\s*[\-–—:]*\s*/i, "");

    let severity = "";
    const sevMatch = s.match(/\(([^()]+)\)\s*$/);
    if (sevMatch) {
      severity = clean(sevMatch[1]);
      s = clean(s.slice(0, sevMatch.index));
    }
    const parts = s.split(/\s+[\-–—]\s+/).map(clean).filter(Boolean);
    let code = "";
    if (parts.length && /^[A-Z]{1,2}\d{1,3}[a-z]?(?:\/[A-Z]+)?$/i.test(parts[0])) code = parts.shift();
    const infraction = parts.join(" - ");
    const found = DURATIONS.find(([re]) => re.test(severity));
    return { code, infraction, severity, duration: found ? found[1] : (severity ? "" : "2 minutes") };
  };

  // ---------- Lecture du DOM Spordle ----------

  const getTeamName = (side) => {
    // Plusieurs sélecteurs pour garantir la récupération selon le DOM de Spordle
    const selectors = [
      `.score-${side}.score-name span`,
      `.score-${side}.score-name`,
      `[class*="score-${side}"][class*="score-name"] span`,
      `[class*="score-${side}"][class*="score-name"]`,
      `.score-${side} span`,
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && clean(el.textContent)) {
        return titleCase(el.textContent);
      }
    }
    return side === "home" ? "Local" : "Visiteur";
  };

  // Trouve l'en-tête de période qui précède la ligne (ex: "1RE PÉRIODE - 10:00")
  const getPeriodLabel = (itemHost) => {
    let el = itemHost.previousElementSibling;
    while (el) {
      if (el.classList && el.classList.contains("summary-period-header")) {
        const raw = clean(el.childNodes[0]?.textContent || el.textContent);
        return raw.split(" - ")[0].toLowerCase();
      }
      el = el.previousElementSibling;
    }
    return "";
  };

  // Le sommaire est affiché du plus récent au plus ancien (fusillade, prolongation, 3e, 2e, 1re).
  // Le rang d'un but = nombre de buts de la même équipe entre cette ligne et le bas de la liste.
  const goalRank = (summaryItem, side) => {
    // Un filtre actif cache des lignes : le compte serait faux.
    if (document.querySelector(".summary-filters .filter.selected")) return 0;
    const goals = [...document.querySelectorAll(".summary-item")].filter((item) => {
      const a = item.querySelector(".action");
      if (!a || !a.classList.contains("goal") || !a.classList.contains(side)) return false;
      const host = item.closest("hi-summary-item") || item;
      return !/fusillade|shootout/i.test(getPeriodLabel(host));
    });
    const idx = goals.indexOf(summaryItem);
    return idx === -1 ? 0 : goals.length - idx;
  };

  const ORDINALS = [
    "", "premier", "deuxième", "troisième", "quatrième", "cinquième", "sixième", "septième",
    "huitième", "neuvième", "dixième", "onzième", "douzième", "treizième", "quatorzième",
    "quinzième", "seizième", "dix-septième", "dix-huitième", "dix-neuvième", "vingtième",
  ];
  const ordinal = (n) => ORDINALS[n] || `${n}e`;

  const getScorerNumberFromItem = (item) => {
    const rawDetails = item.querySelector(".details")?.textContent || "";
    const cleanDetails = rawDetails
      .replace(/\[(?:AN|PP|PPG|SN|DN|SH|SHG|IN|FD|EN|ENG|tir\s*de\s*(?:punition|p[eé]nalit[eé])|penalty\s*shot|TP|PS)\]/gi, "")
      .trim();
    const [scorerPart] = cleanDetails.split(/\b(?:PASSES?|ASSISTS?|AIDES?)\s*:/i);
    const players = parsePlayers(scorerPart);
    return players.length ? players[0].number : null;
  };

  // Calcule le n-ième but du même joueur dans le match pour son équipe
  const playerGoalRank = (summaryItem, side, playerNumber) => {
    if (!playerNumber) return 0;
    if (document.querySelector(".summary-filters .filter.selected")) return 0;

    const host = summaryItem.closest(".summary-items") || summaryItem.closest("hi-summary-list") || document.body;
    const goals = [...host.querySelectorAll(".summary-item")].filter((item) => {
      const a = item.querySelector(".action");
      if (!a || !a.classList.contains("goal") || !a.classList.contains(side)) return false;
      const periodHost = item.closest("hi-summary-item") || item;
      if (/fusillade|shootout/i.test(getPeriodLabel(periodHost))) return false;
      return getScorerNumberFromItem(item) === playerNumber;
    });

    const idx = goals.indexOf(summaryItem);
    return idx === -1 ? 0 : goals.length - idx;
  };

  const readEvent = (summaryItem) => {
    const actionEl = summaryItem.querySelector(".action");
    if (!actionEl) return null;
    const cls = actionEl.classList;
    const type = cls.contains("goal") ? "goal" : cls.contains("penalty") ? "penalty" : cls.contains("goalie") ? "goalie" : null;
    if (!type) return null;

    const side = cls.contains("home") ? "home" : "away";
    const host = summaryItem.closest("hi-summary-item") || summaryItem;

    return {
      type,
      side,
      team: getTeamName(side),
      sideLabel: side === "home" ? "Local" : "Visiteur",
      time: formatTime(summaryItem.querySelector(".time")?.textContent),
      period: getPeriodLabel(host),
      details: clean(summaryItem.querySelector(".details")?.textContent),
      rank: type === "goal" ? goalRank(summaryItem, side) : 0,
    };
  };

  // ---------- Construction du texte à annoncer ----------

  const timeSentence = (ev) => {
    if (!ev.time) return "";
    const period = ev.period ? ` de la ${escapeHtml(ev.period)}` : "";
    const label = ev.type === "penalty" ? "Le temps de la pénalité" : "Le temps du but";
    return `${label} : <strong>${escapeHtml(ev.time)}</strong>${period}.`;
  };

  const buildGoal = (ev, summaryItem) => {
    // Détecte les situations numériques et spéciales
    const isShortHanded = /\[(?:DN|SH|SHG|IN)\]/i.test(ev.details);
    const isPowerPlay = /\[(?:AN|PP|PPG|SN)\]/i.test(ev.details);
    const isPenaltyShot = /\[(?:tir\s*de\s*(?:punition|p[eé]nalit[eé])|penalty\s*shot|TP|PS)\]/i.test(ev.details);
    const isEmptyNet = /\[(?:FD|EN|ENG)\]/i.test(ev.details);

    // Nettoie les balises spéciales des détails pour le parsing des noms
    const cleanDetails = ev.details
      .replace(/\[(?:AN|PP|PPG|SN|DN|SH|SHG|IN|FD|EN|ENG|tir\s*de\s*(?:punition|p[eé]nalit[eé])|penalty\s*shot|TP|PS)\]/gi, "")
      .trim();

    // Format observé : "MAYSON GOSSELIN (77)  - PASSES: ARNO ALLAIRE (21)"
    const [scorerPart, ...rest] = cleanDetails.split(/\b(?:PASSES?|ASSISTS?|AIDES?)\s*:/i);
    const scorer = parsePlayers(scorerPart)[0];
    const assists = parsePlayers(rest.join(" "));

    // Calcule si c'est le 2e, 3e, etc. but de ce joueur dans le match
    const pRank = summaryItem && scorer ? playerGoalRank(summaryItem, ev.side, scorer.number) : 0;
    if (scorer) scorer.goalCountInGame = pRank;

    // Délégation vers le moteur pur SpordleEngine si présent
    if (typeof SpordleEngine !== "undefined") {
      const formatted = SpordleEngine.formatGoal({
        teamName: ev.team,
        teamGoalCount: ev.rank,
        scorer,
        assists,
        isPowerplay: isPowerPlay,
        isShorthanded: isShortHanded,
        isEmptyNet,
        isPenaltyShot,
        time: ev.time,
        period: ev.period,
      });
      return formatted.htmlLines.map((l) => `<div class="sa-line">${l}</div>`).join("");
    }

    const playerRankSuffix = pRank >= 2 ? `, son <strong>${ordinal(pRank)}</strong> de la rencontre` : "";
    const opening = ev.rank
      ? `Le <strong>${ordinal(ev.rank)}</strong> but des <strong>${escapeHtml(ev.team)}</strong>${playerRankSuffix},`
      : `Le but des <strong>${escapeHtml(ev.team)}</strong>${playerRankSuffix},`;
    const lines = [`<div class="sa-line">${opening}</div>`];

    // Construction de la mention spéciale intégrée directement dans la phrase du but
    const modifiers = [];
    if (isShortHanded) {
      modifiers.push("en infériorité numérique");
    } else if (isPowerPlay) {
      modifiers.push("en avantage numérique");
    } else if (isPenaltyShot) {
      modifiers.push("sur un tir de punition");
    }

    if (isEmptyNet) {
      modifiers.push("dans un filet désert");
    }

    const modStr = modifiers.length ? ` ${modifiers.join(" ")}` : "";
    const verb = `marqué${modStr} par le`;

    if (scorer) {
      let scorerAndAssists = `${verb} ${playerHtml(scorer)}, `;
      if (assists.length) {
        const parts = assists.map((a) => `du ${playerHtml(a)}`);
        scorerAndAssists += `assisté ${parts.join(", et ")}.`;
      } else {
        scorerAndAssists += `sans aide.`;
      }
      lines.push(`<div class="sa-line">${scorerAndAssists}</div>`);
    } else if (cleanDetails) {
      const extra = modStr ? ` (${modifiers.join(", ")})` : "";
      lines.push(`<div class="sa-line">${escapeHtml(cleanDetails)}${extra}.</div>`);
    }

    const timeStr = timeSentence(ev);
    if (timeStr) {
      lines.push(`<div class="sa-line">${timeStr}</div>`);
    }

    return lines.join("");
  };

  // Retrouve toutes les lignes de pénalité associées au même joueur au même temps de match
  const findCompanionPenalties = (summaryItem, ev, player) => {
    if (!player || !player.number) return [summaryItem];

    const host = summaryItem.closest(".summary-items") || summaryItem.closest("hi-summary-list") || document.body;
    const allItems = [...host.querySelectorAll(".summary-item")].filter((item) => {
      const a = item.querySelector(".action");
      return a && a.classList.contains("penalty");
    });

    return allItems.filter((item) => {
      const oEv = readEvent(item);
      if (!oEv) return false;
      if (oEv.period !== ev.period || oEv.time !== ev.time || oEv.side !== ev.side) return false;
      const parsed = parsePenaltyEvent(oEv.details);
      return parsed.player && parsed.player.number === player.number;
    });
  };

  // Combine intelligemment les pénalités multiples d'un même joueur au même temps (ex: 2/4 + 4/4 ou Majeure + Extrême inconduite)
  const combinePenalties = (group) => {
    if (group.length <= 1) {
      const p = group[0]?.pen || {};
      const dur = p.duration ? `<strong>${escapeHtml(p.duration)}</strong>` : "<strong>2 minutes</strong>";
      const infLower = p.infraction ? p.infraction.toLowerCase() : "";
      const isRedundant = p.duration && infLower.includes(p.duration.toLowerCase());
      const inf = (infLower && !isRedundant) ? `pour ${escapeHtml(infLower)}` : "";
      return [dur, inf].filter(Boolean).join(" ");
    }

    const severities = group.map((g) => (g.pen.severity || "").toLowerCase());
    const infractions = [...new Set(group.map((g) => g.pen.infraction).filter(Boolean))];
    const mainInfraction = (infractions[0] || "").toLowerCase();

    // Cas 1: Double mineure (2/4 et 4/4, ou deux mineures pour la même infraction)
    const isDoubleMinor =
      (severities.some((s) => s.includes("2/4")) && severities.some((s) => s.includes("4/4"))) ||
      (group.length === 2 && severities.every((s) => /mineure|minor/.test(s) && !/banc/.test(s)));

    if (isDoubleMinor) {
      const inf = mainInfraction ? `pour ${escapeHtml(mainInfraction)}` : "";
      return [`<strong>4 minutes</strong>`, inf].filter(Boolean).join(" ");
    }

    // Cas 2: Majeure + Extrême inconduite (ou inconduite de partie / match)
    const hasMajor = severities.some((s) => /majeure|major/.test(s));
    const hasExtreme = severities.some((s) =>
      /extr[eê]me\s*inconduite|inconduite\s*de\s*(?:partie|match)|game\s*misconduct/.test(s)
    );

    if (hasMajor && hasExtreme) {
      const majorItem = group.find((g) => /majeure|major/.test((g.pen.severity || "").toLowerCase()));
      const inf = (majorItem?.pen?.infraction || mainInfraction || "").toLowerCase();
      const infStr = inf ? `pour ${escapeHtml(inf)}` : "";
      return [`<strong>5 minutes et extrême inconduite de partie</strong>`, infStr].filter(Boolean).join(" ");
    }

    // Cas 3: Mineure + Inconduite (2 + 10)
    const hasMinor = severities.some((s) => /mineure|minor/.test(s));
    const has10 = severities.some((s) => /inconduite|misconduct/.test(s) && !/extr[eê]me|match|partie/.test(s));
    if (hasMinor && has10) {
      const infStr = mainInfraction ? `pour ${escapeHtml(mainInfraction)}` : "";
      return [`<strong>2 minutes et 10 minutes d'inconduite</strong>`, infStr].filter(Boolean).join(" ");
    }

    // Fallback combiné pour plusieurs infractions
    const parts = group.map((g) => {
      const dur = g.pen.duration ? `<strong>${escapeHtml(g.pen.duration)}</strong>` : "<strong>2 minutes</strong>";
      const inf = g.pen.infraction ? `pour ${escapeHtml(g.pen.infraction.toLowerCase())}` : "";
      return [dur, inf].filter(Boolean).join(" ");
    });
    return parts.join(", et ");
  };

  const buildPenalty = (ev, summaryItem) => {
    const penInfo = parsePenaltyEvent(ev.details);

    // Délégation vers le moteur pur SpordleEngine si présent
    if (typeof SpordleEngine !== "undefined") {
      const companions = summaryItem && penInfo.player ? findCompanionPenalties(summaryItem, ev, penInfo.player) : [];
      const itemsToCombine = companions.length ? companions : [summaryItem];
      const codes = [];

      itemsToCombine.forEach((item) => {
        const oEv = item === summaryItem ? ev : readEvent(item);
        const parsed = parsePenaltyEvent(oEv.details);
        if (parsed.code) codes.push(parsed.code);
      });

      const formatted = SpordleEngine.formatPenalty({
        teamName: ev.team,
        isBenchMinor: penInfo.isBench,
        penalizedPlayer: penInfo.player,
        servedByPlayer: penInfo.servedBy,
        codes: codes.length > 0 ? codes : undefined,
        infractionDescription: penInfo.infraction,
        durationDescription: penInfo.duration,
        time: ev.time,
        period: ev.period,
      });

      return formatted.htmlLines.map((l) => `<div class="sa-line">${l}</div>`).join("");
    }

    const lines = [];

    if (penInfo.isBench) {
      // Pénalité de banc
      lines.push(`<div class="sa-line">Pénalité de banc aux <strong>${escapeHtml(ev.team)}</strong>,</div>`);
      const dur = penInfo.duration ? `<strong>${escapeHtml(penInfo.duration)}</strong>` : "<strong>2 minutes</strong>";
      const infLower = penInfo.infraction ? penInfo.infraction.toLowerCase() : "";
      const isRedundant = penInfo.duration && infLower.includes(penInfo.duration.toLowerCase());
      const inf = (infLower && !isRedundant) ? `pour ${escapeHtml(infLower)}` : "";

      if (inf || penInfo.duration) {
        lines.push(`<div class="sa-line">${[dur, inf].filter(Boolean).join(" ")}.</div>`);
      } else {
        lines.push(`<div class="sa-line"><strong>2 minutes</strong>.</div>`);
      }

      if (penInfo.servedBy) {
        lines.push(`<div class="sa-line">La pénalité sera purgée par le ${playerHtml(penInfo.servedBy)}.</div>`);
      }
    } else if (penInfo.player) {
      // Pénalité à un joueur
      lines.push(`<div class="sa-line">Pénalité aux <strong>${escapeHtml(ev.team)}</strong>,</div>`);
      lines.push(`<div class="sa-line">au ${playerHtml(penInfo.player)},</div>`);

      // Vérifie si le même joueur a d'autres pénalités au même temps de match
      const companions = summaryItem ? findCompanionPenalties(summaryItem, ev, penInfo.player) : [];
      const itemsToCombine = companions.length ? companions : [summaryItem];

      const penaltyInfos = itemsToCombine.map((item) => {
        const oEv = item === summaryItem ? ev : readEvent(item);
        const parsed = parsePenaltyEvent(oEv.details);
        return { item, ev: oEv, player: parsed.player || penInfo.player, pen: parsed };
      });

      const sentence = combinePenalties(penaltyInfos);
      lines.push(`<div class="sa-line">${sentence}.</div>`);

      if (penInfo.servedBy) {
        lines.push(`<div class="sa-line">La pénalité sera purgée par le ${playerHtml(penInfo.servedBy)}.</div>`);
      }
    } else {
      // Cas générique sans joueur
      const dur = penInfo.duration ? `<strong>${escapeHtml(penInfo.duration)}</strong>` : "<strong>2 minutes</strong>";
      const infLower = penInfo.infraction ? penInfo.infraction.toLowerCase() : "";
      const isRedundant = penInfo.duration && infLower.includes(penInfo.duration.toLowerCase());
      const inf = (infLower && !isRedundant) ? `pour ${escapeHtml(infLower)}` : "";
      lines.push(`<div class="sa-line">Pénalité aux <strong>${escapeHtml(ev.team)}</strong>,</div>`);
      if (inf || penInfo.duration) {
        lines.push(`<div class="sa-line">${[dur, inf].filter(Boolean).join(" ")}.</div>`);
      }
    }

    const pTime = timeSentence(ev);
    if (pTime) lines.push(`<div class="sa-line">${pTime}</div>`);
    return lines.join("");
  };

  // ---------- Popover ----------

  let backdrop = null;
  let currentOpenItem = null; // Un seul popover ouvert à la fois

  const ensureElements = () => {
    if (!backdrop || !document.body.contains(backdrop)) {
      backdrop = document.createElement("div");
      backdrop.id = "sa-backdrop";
      backdrop.addEventListener("click", () => hidePopover(true));
      document.body.appendChild(backdrop);
    }

    if (!popover || !document.body.contains(popover)) {
      popover = document.createElement("div");
      popover.id = "sa-popover";
      document.body.appendChild(popover);
    }
  };

  const buildGoalieChange = (ev, summaryItem) => {
    // Format attendu de ev.details : "ANAELLE LEMIEUX (33) - Mis dans le filet" ou "Retiré du filet"
    const isIntoNet = /mis\s*dans\s*le\s*filet|in\s*net|entr[eé]/i.test(ev.details);
    const isPulled = /retir[eé]\s*du\s*filet|pulled|out/i.test(ev.details);

    const players = parsePlayers(ev.details);
    const goalie = players.length ? players[0] : null;

    if (typeof SpordleEngine !== "undefined" && SpordleEngine.formatGoalieChange) {
      if (isIntoNet) {
        const formatted = SpordleEngine.formatGoalieChange({
          teamName: ev.team,
          goalie,
          time: ev.time,
          period: ev.period
        });
        return formatted.htmlLines.map((l) => `<div class="sa-line">${l}</div>`).join("");
      } else if (isPulled) {
        // Gardien retiré (ex: 6e attaquant ou fin de match)
        const lines = [
          `<div class="sa-line">Le gardien de but des <strong>${escapeHtml(ev.team)}</strong> est retiré de son filet.</div>`
        ];
        if (ev.time) {
          lines.push(`<div class="sa-line">Le temps du retrait : <strong>${escapeHtml(ev.time)}</strong>${ev.period ? ` de la ${escapeHtml(ev.period)}` : ""}.</div>`);
        }
        return lines.join("");
      }
    }

    // Fallback direct
    const numStr = goalie ? `le numéro <strong>${escapeHtml(goalie.number)}</strong>, ${escapeHtml(goalie.name)}` : "";
    const lines = [
      `<div class="sa-line">Changement de gardien de but du côté des <strong>${escapeHtml(ev.team)}</strong>,</div>`
    ];
    if (numStr) {
      lines.push(`<div class="sa-line">maintenant devant le filet : ${numStr}.</div>`);
    }
    if (ev.time) {
      lines.push(`<div class="sa-line">Le temps du changement : <strong>${escapeHtml(ev.time)}</strong>${ev.period ? ` de la ${escapeHtml(ev.period)}` : ""}.</div>`);
    }
    return lines.join("");
  };

  const getTeamLogo = (side) => {
    const el = document.querySelector(`.score-${side}.score-logo .hi-logo`) || document.querySelector(`.score-${side}.score-logo`);
    return el?.style?.backgroundImage || "";
  };

  const renderEvent = (summaryItem) => () => {
    const ev = readEvent(summaryItem);
    if (!ev) return null;
    const isGoal = ev.type === "goal";
    const isGoalie = ev.type === "goalie";
    const typeLabel = isGoal ? "BUT" : isGoalie ? "GARDIEN" : "PÉNALITÉ";
    const logoUrl = getTeamLogo(ev.side);
    return {
      type: ev.type,
      side: ev.side,
      sideLabel: ev.sideLabel,
      team: ev.team,
      typeLabel,
      logoUrl,
      body: isGoal ? buildGoal(ev, summaryItem) : isGoalie ? buildGoalieChange(ev, summaryItem) : buildPenalty(ev, summaryItem),
    };
  };

  const showPopover = (render, summaryItem, isPinned = false) => {
    const content = render();
    if (!content) return;
    ensureElements();

    pinned = isPinned;
    currentOpenItem = summaryItem;

    popover.className = `sa-visible sa-${content.type} sa-${content.side}${isPinned ? " sa-pinned" : ""}`;
    
    const logoHtml = content.logoUrl
      ? `<div class="sa-modal-team-logo" style="background-image: ${escapeHtml(content.logoUrl)};"></div>`
      : "";

    popover.innerHTML =
      `<div class="sa-modal-header bar bar-header bar-dark">` +
        `<div class="sa-modal-badge sa-badge-${content.type}">` +
          `<span class="sa-badge-dot"></span>` +
          `<span class="sa-badge-text">${content.typeLabel}</span>` +
        `</div>` +
        `<div class="sa-modal-title">` +
          logoHtml +
          `<span class="sa-team-name">${escapeHtml(content.team)}</span>` +
        `</div>` +
        `<button type="button" class="sa-modal-close-btn button button-stable button-clear" aria-label="Fermer">` +
          `<i class="icon ion-close-round"></i>` +
        `</button>` +
      `</div>` +
      `<div class="sa-modal-body">` +
        `<div class="sa-modal-card">` +
          content.body +
        `</div>` +
      `</div>` +
      `<div class="sa-modal-footer">` +
        `<span class="sa-hint-icon"><i class="icon ion-volume-high"></i> Annonce vocale</span>` +
        `<span class="sa-hint-dismiss">Cliquer n'importe où, sur ✕ ou sur Échap pour fermer</span>` +
      `</div>`;

    // Clic sur le bouton X pour fermer immédiatement
    const closeBtn = popover.querySelector(".sa-modal-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        hidePopover(true);
      });
    }

    if (pinned) {
      backdrop.className = "sa-visible";
    } else {
      backdrop.className = "";
    }
  };

  const hidePopover = (force = false) => {
    if (pinned && !force) return;
    pinned = false;
    currentOpenItem = null;
    if (popover) {
      popover.className = "";
      popover.innerHTML = "";
    }
    if (backdrop) {
      backdrop.className = "";
    }
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hidePopover(true);
  });

  // ---------- Injection des icônes ----------

  const makeButton = (summaryItem, render, extraClass = "") => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `${BTN_CLASS} ${extraClass}`.trim();
    btn.innerHTML = `<svg viewBox="0 0 512 512" width="18" height="18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"><path d="M407.94 52.22S321.3 160 240 160H80a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h160c81.3 0 167.94 108.23 167.94 108.23 6.06 8 24.06 2.52 24.06-9.83V62C432 49.69 415 43.18 407.94 52.22Z"/><path d="M64 256s-16-6-16-32 16-32 16-32"/><path d="M448 246s16-4.33 16-22-16-22-16-22"/><line x1="256" y1="160" x2="256" y2="288"/><line x1="112" y1="160" x2="112" y2="288"/><path d="M144 288V456a8 8 0 0 0 8 8h53a16 16 0 0 0 15.29-20.73C211.91 416.39 192 386.08 192 336h16a16 16 0 0 0 16-16V304a16 16 0 0 0-16-16H192"/></svg>`;
    btn.title = "Afficher / masquer le texte de l'annonceur";
    btn.setAttribute("aria-label", "Annonce vocale");

    let hoverTimer = null;

    // Survol : affiche après un très court délai si aucun popover n'est épinglé
    btn.addEventListener("mouseenter", () => {
      if (pinned) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (!pinned) {
          showPopover(render, summaryItem, false);
        }
      }, 120);
    });

    btn.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimer);
      hoverTimer = null;
      if (!pinned) {
        hidePopover(false);
      }
    });

    // Clic : TOGGLE ON / OFF
    btn.addEventListener("click", (e) => {
      clearTimeout(hoverTimer);
      hoverTimer = null;
      e.stopPropagation();
      e.preventDefault();

      // Si le popover actuel est déjà ouvert pour CET item, on le ferme (Toggle OFF)
      if (pinned && currentOpenItem === summaryItem) {
        hidePopover(true);
      } else {
        // Sinon, on ouvre / remplace (1 seul popover possible à la fois)
        showPopover(render, summaryItem, true);
      }
    });

    return btn;
  };

  const decorate = (summaryItem) => {
    if (summaryItem.querySelector(`.${BTN_CLASS}`)) return;
    const btn = makeButton(summaryItem, renderEvent(summaryItem));
    
    // Placé dans la zone d'actions (.modify) à gauche des boutons Spordle
    const modifyEl = summaryItem.querySelector(".modify");
    if (modifyEl) {
      modifyEl.prepend(btn);
    } else {
      summaryItem.appendChild(btn);
    }
    summaryItem.classList.add("sa-has-btn");
  };

  const scan = () => {
    const items = [...document.querySelectorAll(".summary-item")];
    items.forEach((item) => {
      const action = item.querySelector(".action");
      if (action && (action.classList.contains("goal") || action.classList.contains("penalty") || action.classList.contains("goalie"))) {
        decorate(item);
      }
    });

    // Marquer visuellement les pénalités combinées du même joueur au même temps
    items.forEach((item) => {
      const action = item.querySelector(".action");
      if (action && action.classList.contains("penalty")) {
        const ev = readEvent(item);
        if (ev) {
          const penInfo = parsePenaltyEvent(ev.details);
          if (penInfo.player) {
            const companions = findCompanionPenalties(item, ev, penInfo.player);
            if (companions.length > 1) {
              item.classList.add("sa-penalty-linked");
              const btn = item.querySelector(`.${BTN_CLASS}`);
              if (btn) btn.title = "Pénalité combinée — Afficher / masquer le texte de l'annonceur";
            } else {
              item.classList.remove("sa-penalty-linked");
            }
          }
        }
      }
    });

    // Bouton d'inversion des côtés (Visiteur ⇄ Local)
    injectSwapSidesButton();
  };

  // ---------- Inversion des côtés (Visiteur ⇄ Local) ----------

  // Extrait un identifiant unique pour le match en cours (URL ou numéro de match dans le DOM)
  const getGameKey = () => {
    // 1. Depuis l'URL de Spordle (ex: /scoresheets/933175/...)
    const urlMatch = window.location.pathname.match(/\/scoresheets\/([^\/?#]+)/i) ||
                     window.location.hash.match(/\/scoresheets\/([^\/?#]+)/i);
    if (urlMatch && urlMatch[1]) {
      return `game_${urlMatch[1]}`;
    }

    // 2. Depuis le numéro de match affiché dans le DOM (ex: "MATCH 1021" ou "MATCH 2007")
    const gameNumEl = document.querySelector(".game-number");
    if (gameNumEl) {
      const text = (gameNumEl.textContent || "").trim();
      const numMatch = text.match(/\b(?:MATCH|GAME)\s*#?\s*([A-Za-z0-9\-]+)/i);
      if (numMatch && numMatch[1]) {
        return `game_${numMatch[1]}`;
      }
    }

    // 3. Repli si page statique ou demo sans identifiant
    return "game_default";
  };

  const getSwapStorageKey = () => `sa_swap_sides_${getGameKey()}`;

  const isSidesSwappedForCurrentGame = () => {
    try {
      return localStorage.getItem(getSwapStorageKey()) === "true";
    } catch (_) {
      return false;
    }
  };

  const applySwapSidesState = () => {
    if (isSidesSwappedForCurrentGame()) {
      document.body.classList.add("sa-swapped-sides");
    } else {
      document.body.classList.remove("sa-swapped-sides");
    }
  };

  const toggleSwapSides = () => {
    const nextState = !isSidesSwappedForCurrentGame();
    try {
      if (nextState) {
        localStorage.setItem(getSwapStorageKey(), "true");
      } else {
        localStorage.removeItem(getSwapStorageKey());
      }
    } catch (_) {}
    applySwapSidesState();
    updateSwapButtonLabel();
  };

  const updateSwapButtonLabel = () => {
    const btn = document.getElementById("sa-swap-sides-btn");
    if (!btn) return;
    const isSwapped = isSidesSwappedForCurrentGame();
    const labelSpan = btn.querySelector(".sa-swap-label");
    if (labelSpan) {
      labelSpan.textContent = isSwapped ? "🔥 TEST AUTO-UPDATE OK 🔥" : "🚀 TEST AUTO-UPDATE ACTIF 🚀";
    }
    btn.title = isSwapped
      ? "Disposition inversée : Local à gauche, Visiteur à droite.\nCliquez pour rétablir la disposition normale pour ce match."
      : "Disposition normale : Visiteur à gauche, Local à droite.\nCliquez pour inverser les côtés pour correspondre à votre vue de la patinoire pour ce match.";
  };

  const injectSwapSidesButton = () => {
    // Si le bouton existe déjà et est toujours attaché au DOM
    const existing = document.getElementById("sa-swap-sides-btn");
    if (existing) {
      updateSwapButtonLabel();
      return;
    }

    // Cible en priorité l'élément de catégorie (.game-category) ou le numéro de match (.game-number)
    const categoryEl = document.querySelector(".game-category") || document.querySelector(".game-number");
    if (!categoryEl) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "sa-swap-sides-btn";
    btn.className = "sa-swap-sides-btn";
    btn.innerHTML = `<span class="sa-swap-arrow">⇄</span><span class="sa-swap-label"></span>`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleSwapSides();
    });

    // Inséré directement à l'intérieur à droite du texte de la catégorie
    categoryEl.appendChild(btn);

    updateSwapButtonLabel();
  };

  // Appliquer l'état initial dès le chargement
  applySwapSidesState();

  let scheduled = false;
  const observer = new MutationObserver((mutations) => {
    // Ignorer les mutations générées par nos propres éléments (popover, backdrop, swap btn)
    const onlyOurNodes = mutations.every((m) => {
      const el = m.target;
      return el && (
        el.id === "sa-popover" ||
        el.id === "sa-backdrop" ||
        el.id === "sa-swap-sides-btn" ||
        (el.closest && (el.closest("#sa-popover") || el.closest("#sa-backdrop") || el.closest("#sa-swap-sides-btn")))
      );
    });
    if (onlyOurNodes) return;

    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      scan();
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  scan();
})();



