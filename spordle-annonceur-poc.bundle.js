
(() => {
  window.__SA_POC_ACTIVE_VERSION__ = "1.0.1";
  window.__SA_POC_IS_HOT__ = true;

  // Injection CSS
  try {
    const existing = document.getElementById("spordle-annonceur-styles");
    if (!existing) {
      const css = "/* Bouton placé à gauche du crayon d'édition dans .modify */\n.sa-announce-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  margin: 0 !important;\n  border-radius: 4px;\n  border: none !important;\n  background: transparent !important;\n  color: #003876 !important; /* Même bleu que le bouton crayon de Spordle */\n  cursor: pointer;\n  user-select: none;\n  flex-shrink: 0 !important; /* Ne rétrécit jamais */\n  padding: 0;\n  transition: transform 0.15s ease, color 0.15s ease, background-color 0.15s ease;\n  outline: none;\n}\n.sa-announce-btn svg {\n  display: block;\n  pointer-events: none; /* Évite les conflits d'événements souris sur l'icône */\n}\n.sa-announce-btn:hover {\n  color: #0086d7 !important;\n  background: rgba(0, 56, 118, 0.08) !important;\n  transform: scale(1.1);\n}\n\n/* Préserve la grille et évite tout retour à la ligne des boutons d'action à droite */\n.summary-item {\n  grid-template-columns: 60px 150px 1fr auto !important;\n}\n\n.summary-item .modify {\n  width: auto !important;\n  min-width: 100px !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: flex-end !important;\n  gap: 2px !important;\n}\n\n.summary-item .modify ng-transclude {\n  display: inline-flex !important;\n  align-items: center !important;\n  flex-wrap: nowrap !important;\n  width: auto !important;\n}\n\n/* Lignes de pénalités combinées pour un même joueur au même temps (inset pour préserver l'alignement) */\n.summary-item.sa-penalty-linked {\n  box-shadow: inset 4px 0 0 #ffc900 !important;\n}\n.summary-item.sa-penalty-linked .sa-announce-btn {\n  color: #c9a340 !important;\n}\n\n/* Backdrop sombre pour fermer au clic à l'extérieur */\n#sa-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: rgba(0, 0, 0, 0.65);\n  backdrop-filter: blur(2px);\n  z-index: 2147483646;\n  display: none;\n  cursor: pointer;\n}\n#sa-backdrop.sa-visible {\n  display: block;\n}\n\n/* Popover d'annonceur — Style modal Spordle Play */\n#sa-popover {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 2147483647;\n  width: min(92vw, 1020px);\n  max-height: 90vh;\n  display: none;\n  flex-direction: column;\n  background-color: #33383c;\n  color: #fff;\n  border-radius: 6px;\n  border: 1px solid #4a5058;\n  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05);\n  font-family: \"interregular\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n  overflow: hidden;\n  pointer-events: none; /* Ne capture jamais le curseur en survol d'aperçu */\n}\n#sa-popover.sa-visible {\n  display: flex;\n}\n#sa-popover.sa-pinned {\n  pointer-events: auto !important; /* Cliquable et scrollable uniquement lorsqu'épinglé */\n}\n\n/* En-tête modal bar-dark */\n#sa-popover .sa-modal-header {\n  position: relative !important;\n  top: auto !important;\n  left: auto !important;\n  right: auto !important;\n  width: 100% !important;\n  height: 52px !important;\n  min-height: 52px !important;\n  padding: 0 16px !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: space-between !important;\n  background-color: #252831 !important;\n  border-bottom: 1px solid #1a1c22 !important;\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n  box-sizing: border-box;\n}\n\n/* Badge de type d'événement (BUT ou PÉNALITÉ) */\n#sa-popover .sa-modal-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 5px 12px;\n  border-radius: 4px;\n  font-family: \"interbold\", \"interregular\", sans-serif;\n  font-size: 13px;\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n  font-weight: 700;\n  flex-shrink: 0;\n}\n#sa-popover .sa-modal-badge .sa-badge-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  display: inline-block;\n}\n#sa-popover .sa-modal-badge.sa-badge-goal {\n  background-color: #003876;\n  color: #fff;\n  border: 1px solid #004d99;\n}\n#sa-popover .sa-modal-badge.sa-badge-goal .sa-badge-dot {\n  background-color: #33cd5f;\n  box-shadow: 0 0 6px #33cd5f;\n}\n#sa-popover .sa-modal-badge.sa-badge-penalty {\n  background-color: #b83f43;\n  color: #fff;\n  border: 1px solid #d94b50;\n}\n#sa-popover .sa-modal-badge.sa-badge-penalty .sa-badge-dot {\n  background-color: #ffc900;\n  box-shadow: 0 0 6px #ffc900;\n}\n#sa-popover .sa-modal-badge.sa-badge-goalie {\n  background-color: #4a5058;\n  color: #fff;\n  border: 1px solid #626973;\n}\n#sa-popover .sa-modal-badge.sa-badge-goalie .sa-badge-dot {\n  background-color: #00d2d3;\n  box-shadow: 0 0 6px #00d2d3;\n}\n\n/* Titre central avec logo et nom d'équipe */\n#sa-popover .sa-modal-title {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  flex: 1;\n  min-width: 0;\n  padding: 0 12px;\n  color: #dce2e3;\n  font-family: \"interbold\", \"interregular\", sans-serif;\n  font-size: 17px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n#sa-popover .sa-modal-team-logo {\n  width: 32px;\n  height: 32px;\n  background-size: contain;\n  background-repeat: no-repeat;\n  background-position: center;\n  flex-shrink: 0;\n}\n#sa-popover .sa-team-name {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  letter-spacing: 0.2px;\n}\n\n/* Bouton Fermer (icône discrète Ionicons intégrée au header Spordle) */\n#sa-popover .sa-modal-close-btn {\n  background: transparent !important;\n  border: none !important;\n  color: #a1a3ac !important;\n  padding: 4px 8px !important;\n  margin: 0 !important;\n  height: 36px !important;\n  min-height: 36px !important;\n  line-height: 1 !important;\n  cursor: pointer;\n  border-radius: 4px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px !important;\n  flex-shrink: 0;\n  transition: color 0.15s ease, background-color 0.15s ease;\n}\n#sa-popover .sa-modal-close-btn:hover {\n  color: #fff !important;\n  background-color: rgba(255, 255, 255, 0.08) !important;\n}\n\n/* Corps du popover */\n#sa-popover .sa-modal-body {\n  padding: 22px 24px;\n  overflow-y: auto;\n  flex: 1;\n}\n\n/* Carte de contenu principale calquée sur les sections/cards Spordle */\n#sa-popover .sa-modal-card {\n  background-color: #2b2e34;\n  border: 1px solid #454b54;\n  border-radius: 6px;\n  padding: 24px 30px;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);\n}\n\n/* Accentuation de bordure gauche selon le type d'événement */\n#sa-popover.sa-goal .sa-modal-card {\n  border-left: 5px solid #0086d7;\n}\n#sa-popover.sa-penalty .sa-modal-card {\n  border-left: 5px solid #b83f43;\n}\n#sa-popover.sa-goalie .sa-modal-card {\n  border-left: 5px solid #00d2d3;\n}\n\n/* Lignes de texte d'annonce (gros caractères pour le micro) */\n#sa-popover .sa-line {\n  font-size: clamp(24px, 3.2vw, 38px);\n  line-height: 1.38;\n  font-weight: 500;\n  color: #f0f3f4;\n  margin: 8px 0;\n  font-family: \"interregular\", -apple-system, sans-serif;\n}\n#sa-popover .sa-line strong {\n  font-family: \"interbold\", \"interregular\", sans-serif;\n  color: #ffc900;\n  font-weight: 700;\n}\n\n/* Ligne de temps distincte et légèrement plus sobre */\n#sa-popover .sa-line:last-child {\n  margin-top: 16px;\n  padding-top: 14px;\n  border-top: 1px solid rgba(255, 255, 255, 0.08);\n  font-size: clamp(20px, 2.5vw, 30px);\n  color: #c0cbcc;\n}\n\n/* Footer informatif discret */\n#sa-popover .sa-modal-footer {\n  padding: 10px 24px;\n  background-color: #252831;\n  border-top: 1px solid #1a1c22;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 12px;\n  color: #8c929a;\n  border-bottom-left-radius: 5px;\n  border-bottom-right-radius: 5px;\n}\n#sa-popover .sa-modal-footer .sa-hint-icon {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  color: #ffc900;\n  font-weight: 600;\n}\n#sa-popover .sa-modal-footer .sa-hint-dismiss {\n  color: #7d828a;\n}\n\n/* ==========================================================\n   Bouton et disposition d'inversion des côtés (Visiteur ⇄ Local)\n   ========================================================== */\n\n/* Bouton compact inséré directement à la droite de .game-category */\n.sa-swap-sides-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  background: #2b2e33;\n  color: #dce2e3;\n  border: 1px solid #4a5058;\n  border-radius: 12px;\n  padding: 1px 9px;\n  font-size: 11px;\n  font-weight: 600;\n  cursor: pointer;\n  user-select: none;\n  margin-left: 10px;\n  vertical-align: middle;\n  line-height: 1.5;\n  transition: all 0.15s ease;\n  outline: none;\n}\n\n.game-category {\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n}\n\n.sa-swap-sides-btn:hover {\n  background: #373b40;\n  border-color: #ffc900;\n  color: #ffc900;\n  transform: translateY(-1px);\n}\n\n.sa-swap-sides-btn:active {\n  transform: translateY(0);\n}\n\n.sa-swap-sides-btn .sa-swap-arrow {\n  font-size: 13px;\n  color: #ffc900;\n  display: inline-block;\n  line-height: 1;\n  transition: transform 0.25s ease;\n}\n\n.sa-swapped-sides .sa-swap-sides-btn {\n  background: #1e2023;\n  border-color: #ffc900;\n  color: #ffc900;\n  box-shadow: 0 0 6px rgba(255, 201, 0, 0.25);\n}\n\n.sa-swapped-sides .sa-swap-sides-btn .sa-swap-arrow {\n  transform: rotate(180deg);\n}\n\n\n/* --- Inversion du tableau de pointage (Desktop / >= 900px) --- */\n.sa-swapped-sides .score-view {\n  grid-template-areas:\n    \"home-logo home-name home-name home-score away-score away-name away-name away-logo\"\n    \"buttons buttons buttons buttons buttons buttons buttons buttons\" !important;\n}\n\n/* Inversion de l'alignement des noms :\n   En mode normal : .score-away.score-name est text-align: right (vers le centre),\n   .score-home.score-name est text-align: left / default (vers le centre).\n   En mode inversé : home est à gauche (doit être text-align: right vers le centre),\n   away est à droite (doit être text-align: left vers le centre). */\n@media (min-width: 900px) {\n  .sa-swapped-sides .score-view .score-away.score-name {\n    text-align: left !important;\n  }\n  .sa-swapped-sides .score-view .score-home.score-name {\n    text-align: right !important;\n  }\n}\n\n/* Inversion des boutons sous le score (Desktop) */\n.sa-swapped-sides .score-buttons {\n  grid-template-areas: \"home-swap home-penalty home-goal away-goal away-penalty away-swap\" !important;\n}\n\n/* Inversion des pénalités actives en cours :\n   Dans Spordle : .away-penalties a flex-direction: row-reverse (les chandails s'empilent depuis le centre vers la gauche)\n   et .home-penalties est standard (les chandails s'empilent depuis le centre vers la droite).\n   En mode inversé, on intervertit les côtés (.home-penalties à gauche et .away-penalties à droite)\n   et on échange leur sens d'empilement pour que les pénalités partent toujours du libellé central vers les côtés extérieurs. */\n.sa-swapped-sides .active-penalties {\n  flex-direction: row-reverse !important;\n}\n.sa-swapped-sides .active-penalties .away-penalties {\n  flex-direction: row !important;\n}\n.sa-swapped-sides .active-penalties .home-penalties {\n  flex-direction: row-reverse !important;\n}\n\n/* --- Inversion en affichage mobile / tablette (< 900px) --- */\n@media (max-width: 900px) {\n  .sa-swapped-sides .score-view {\n    grid-template-areas:\n      \"home-name home-name home-name home-name\"\n      \"home-logo home-score away-score away-logo\"\n      \"away-name away-name away-name away-name\"\n      \"buttons buttons buttons buttons\" !important;\n  }\n  .sa-swapped-sides .score-view .score-home.score-score {\n    justify-self: left !important;\n  }\n  .sa-swapped-sides .score-view .score-away.score-score {\n    justify-self: right !important;\n  }\n  .sa-swapped-sides .score-view .score-away.score-score .sportsmanship {\n    order: initial !important;\n  }\n  .sa-swapped-sides .score-view .score-away.score-score .score {\n    order: initial !important;\n  }\n  .sa-swapped-sides .score-view .score-away.score-score .type {\n    order: initial !important;\n  }\n  .sa-swapped-sides .score-view .score-home.score-score .sportsmanship {\n    order: 1 !important;\n  }\n  .sa-swapped-sides .score-view .score-home.score-score .score {\n    order: 2 !important;\n  }\n  .sa-swapped-sides .score-view .score-home.score-score .type {\n    order: 3 !important;\n  }\n  .sa-swapped-sides .score-buttons {\n    grid-template-areas:\n      \"home-goal home-goal away-goal away-goal\"\n      \"home-swap home-penalty away-penalty away-swap\" !important;\n  }\n}\n\n/* ==========================================================\n   Bouton et modal du Mot de bienvenue d'avant-match\n   ========================================================== */\n\n.sa-welcome-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  background: #2b2e33;\n  color: #dce2e3;\n  border: 1px solid #4a5058;\n  border-radius: 12px;\n  padding: 1px 9px;\n  font-size: 11px;\n  font-weight: 600;\n  cursor: pointer;\n  user-select: none;\n  margin-left: 8px;\n  vertical-align: middle;\n  line-height: 1.5;\n  transition: all 0.15s ease;\n  outline: none;\n}\n.sa-welcome-btn:hover {\n  background: #373b40;\n  border-color: #9e77ed;\n  color: #d6bbfb;\n  transform: translateY(-1px);\n}\n.sa-welcome-btn:active {\n  transform: translateY(0);\n}\n.sa-welcome-btn .sa-welcome-icon {\n  font-size: 13px;\n  line-height: 1;\n}\n\n/* Badge spécifique avant-match */\n#sa-popover .sa-modal-badge.sa-badge-welcome {\n  background-color: #3b2d54;\n  color: #d6bbfb;\n  border: 1px solid #6941c6;\n}\n#sa-popover .sa-modal-badge.sa-badge-welcome .sa-badge-dot {\n  background-color: #9e77ed;\n  box-shadow: 0 0 6px #9e77ed;\n}\n\n#sa-popover.sa-welcome .sa-modal-card {\n  border-left: 5px solid #9e77ed;\n}\n\n/* Barre de configuration rapide des chandails dans le modal de bienvenue */\n.sa-welcome-toolbar {\n  display: flex !important;\n  flex-wrap: wrap !important;\n  align-items: center !important;\n  justify-content: flex-start !important;\n  gap: 14px 24px !important;\n  margin-bottom: 20px !important;\n  padding-bottom: 16px !important;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;\n  font-size: 13px !important;\n  color: #a0a6b0 !important;\n}\n.sa-welcome-config-group {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 8px !important;\n}\n.sa-welcome-config-group strong {\n  color: #fff !important;\n  font-weight: 600 !important;\n}\n.sa-welcome-label {\n  display: inline-block !important;\n  white-space: nowrap !important;\n}\n.sa-welcome-color-btn {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 7px !important;\n  padding: 5px 12px !important;\n  border-radius: 6px !important;\n  font-size: 13px !important;\n  font-weight: 600 !important;\n  border: 1px solid #4a5058 !important;\n  background: #202328 !important;\n  color: #fff !important;\n  cursor: pointer !important;\n  transition: all 0.15s ease !important;\n  outline: none !important;\n}\n.sa-welcome-color-btn:hover {\n  background: #2b3038 !important;\n  border-color: #ffc900 !important;\n  transform: translateY(-1px) !important;\n}\n.sa-welcome-color-btn .sa-team-color-swatch {\n  width: 14px !important;\n  height: 14px !important;\n  border-radius: 50% !important;\n  display: inline-block !important;\n  flex-shrink: 0 !important;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;\n}\n.sa-welcome-color-btn .sa-welcome-color-arrow {\n  font-size: 10px !important;\n  color: #adb5bd !important;\n  margin-left: 2px !important;\n}\n\n/* ==========================================================================\n   Thématisation dynamique des couleurs d'équipes\n   ========================================================================== */\n\n/* Alignement flex des noms d'équipes pour accueillir la pastille de couleur */\n.score-view .score-away.score-name {\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: flex-end !important;\n  gap: 6px !important;\n}\n\n.score-view .score-home.score-name {\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: flex-start !important;\n  gap: 6px !important;\n}\n\n@media (max-width: 900px) {\n  .score-view .score-away.score-name,\n  .score-view .score-home.score-name {\n    justify-content: center !important;\n  }\n}\n\n/* Pastille cliquable */\n.sa-team-color-btn {\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  width: 22px !important;\n  height: 22px !important;\n  min-width: 22px !important;\n  min-height: 22px !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  border: 1.5px solid rgba(255, 255, 255, 0.4) !important;\n  border-radius: 50% !important;\n  background: rgba(0, 0, 0, 0.3) !important;\n  cursor: pointer !important;\n  outline: none !important;\n  transition: transform 0.15s ease, border-color 0.15s ease !important;\n  box-sizing: border-box !important;\n  vertical-align: middle !important;\n  flex-shrink: 0 !important;\n}\n\n.sa-team-color-btn:hover {\n  transform: scale(1.15) !important;\n  border-color: #ffc900 !important;\n}\n\n.sa-team-color-swatch {\n  width: 13px !important;\n  height: 13px !important;\n  border-radius: 50% !important;\n  display: block !important;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;\n  box-sizing: border-box !important;\n}\n\n.sa-team-color-swatch.sa-swatch-empty {\n  background: conic-gradient(#c8102e, #ea5b0c, #f2a900, #00843d, #0046ad, #552583, #c8102e) !important;\n  border: 1px solid rgba(255, 255, 255, 0.3) !important;\n}\n\n/* Palette Popover */\n.sa-color-picker-popover {\n  position: fixed !important;\n  z-index: 2147483648 !important;\n  background: #252831 !important;\n  border: 1px solid #4a5058 !important;\n  border-radius: 8px !important;\n  padding: 10px !important;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6) !important;\n  width: 220px !important;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif !important;\n  animation: sa-popover-in 0.15s ease-out !important;\n}\n\n.sa-color-picker-title {\n  font-size: 11px !important;\n  font-weight: 700 !important;\n  text-transform: uppercase !important;\n  letter-spacing: 0.5px !important;\n  color: #adb5bd !important;\n  margin-bottom: 8px !important;\n  display: flex !important;\n  justify-content: space-between !important;\n  align-items: center !important;\n}\n\n.sa-color-picker-grid {\n  display: grid !important;\n  grid-template-columns: repeat(4, 1fr) !important;\n  gap: 8px !important;\n  margin-bottom: 8px !important;\n}\n\n.sa-color-choice-btn {\n  width: 44px !important;\n  height: 38px !important;\n  border-radius: 6px !important;\n  border: 2px solid transparent !important;\n  cursor: pointer !important;\n  padding: 0 !important;\n  position: relative !important;\n  transition: transform 0.12s ease, border-color 0.12s ease !important;\n  outline: none !important;\n  box-sizing: border-box !important;\n}\n\n.sa-color-choice-btn:hover {\n  transform: scale(1.12) !important;\n  border-color: #ffffff !important;\n  z-index: 2 !important;\n}\n\n.sa-color-choice-btn.selected {\n  border-color: #ffc900 !important;\n  box-shadow: 0 0 0 2px rgba(255, 201, 0, 0.5) !important;\n}\n\n.sa-color-choice-btn.selected::after {\n  content: \"✓\" !important;\n  position: absolute !important;\n  top: 50% !important;\n  left: 50% !important;\n  transform: translate(-50%, -50%) !important;\n  font-weight: 900 !important;\n  font-size: 16px !important;\n  color: inherit !important;\n}\n\n.sa-color-reset-btn {\n  width: 100% !important;\n  padding: 6px 8px !important;\n  background: #33383c !important;\n  color: #dee2e6 !important;\n  border: 1px solid #4a5058 !important;\n  border-radius: 4px !important;\n  font-size: 11px !important;\n  cursor: pointer !important;\n  transition: background 0.15s ease, color 0.15s ease !important;\n}\n\n.sa-color-reset-btn:hover {\n  background: #42484f !important;\n  color: #ffffff !important;\n}\n\n/* --- Effets sur les boutons d'action du score --- */\n\nbody.sa-has-away-color .score-away.score-goal {\n  background-color: var(--sa-away-color) !important;\n  border-color: var(--sa-away-border-color, var(--sa-away-color)) !important;\n  color: var(--sa-away-text-color, #ffffff) !important;\n}\nbody.sa-has-away-color .score-away.score-penalty {\n  background-color: var(--sa-away-color) !important;\n  border-color: var(--sa-away-border-color, var(--sa-away-color)) !important;\n  color: var(--sa-away-text-color, #ffffff) !important;\n  filter: brightness(0.92) !important;\n}\nbody.sa-has-away-color .score-away.score-swap {\n  background-color: var(--sa-away-color) !important;\n  border-color: var(--sa-away-border-color, var(--sa-away-color)) !important;\n  color: var(--sa-away-text-color, #ffffff) !important;\n  filter: brightness(0.85) !important;\n}\n\nbody.sa-has-home-color .score-home.score-goal {\n  background-color: var(--sa-home-color) !important;\n  border-color: var(--sa-home-border-color, var(--sa-home-color)) !important;\n  color: var(--sa-home-text-color, #ffffff) !important;\n}\nbody.sa-has-home-color .score-home.score-penalty {\n  background-color: var(--sa-home-color) !important;\n  border-color: var(--sa-home-border-color, var(--sa-home-color)) !important;\n  color: var(--sa-home-text-color, #ffffff) !important;\n  filter: brightness(0.92) !important;\n}\nbody.sa-has-home-color .score-home.score-swap {\n  background-color: var(--sa-home-color) !important;\n  border-color: var(--sa-home-border-color, var(--sa-home-color)) !important;\n  color: var(--sa-home-text-color, #ffffff) !important;\n  filter: brightness(0.85) !important;\n}\n\n/* --- Effets sur les pastilles d'action du sommaire --- */\n\n/* Visiteur : fond plein dans la couleur de l'équipe */\nbody.sa-has-away-color .summary-item .action.away {\n  background-color: var(--sa-away-color) !important;\n  border-color: var(--sa-away-border-color, var(--sa-away-color)) !important;\n  color: var(--sa-away-text-color, #ffffff) !important;\n}\n\n/* Local : contour de la couleur de l'équipe avec fond blanc et texte assorti */\nbody.sa-has-home-color .summary-item .action.home {\n  border: 2px solid var(--sa-home-border-badge, var(--sa-home-color)) !important;\n  color: var(--sa-home-text-badge, var(--sa-home-color)) !important;\n  background-color: #ffffff !important;\n}\n\n/* Accent dans le modal de l'annonceur selon l'équipe */\nbody.sa-has-away-color #sa-popover.sa-away .sa-modal-card {\n  border-left-color: var(--sa-away-color) !important;\n}\nbody.sa-has-home-color #sa-popover.sa-home .sa-modal-card {\n  border-left-color: var(--sa-home-color) !important;\n}\n\n/* ==========================================================================\n   Modale de configuration des fonctionnalités expérimentales (Settings Modal)\n   ========================================================================== */\n\n.sa-settings-overlay {\n  position: fixed !important;\n  top: 0 !important;\n  left: 0 !important;\n  width: 100vw !important;\n  height: 100vh !important;\n  background: rgba(0, 0, 0, 0.75) !important;\n  z-index: 100000 !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  animation: sa-popover-in 0.15s ease-out !important;\n}\n\n.sa-settings-dialog {\n  background: #252831 !important;\n  border: 1px solid #4a5058 !important;\n  border-radius: 10px !important;\n  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6) !important;\n  width: 90% !important;\n  max-width: 480px !important;\n  max-height: 90vh !important;\n  display: flex !important;\n  flex-direction: column !important;\n  color: #fff !important;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif !important;\n  overflow: hidden !important;\n}\n\n.sa-settings-header {\n  padding: 14px 18px !important;\n  background: #1e2027 !important;\n  border-bottom: 1px solid #373b40 !important;\n  display: flex !important;\n  justify-content: space-between !important;\n  align-items: center !important;\n}\n\n.sa-settings-header h3 {\n  margin: 0 !important;\n  font-size: 15px !important;\n  font-weight: 700 !important;\n  color: #fff !important;\n  display: flex !important;\n  align-items: center !important;\n  gap: 8px !important;\n}\n\n.sa-settings-body {\n  padding: 16px 18px !important;\n  display: flex !important;\n  flex-direction: column !important;\n  gap: 12px !important;\n  overflow-y: auto !important;\n  -webkit-overflow-scrolling: touch !important;\n  max-height: calc(90vh - 130px) !important;\n}\n\n.sa-settings-intro {\n  font-size: 12px !important;\n  color: #98a2b3 !important;\n  line-height: 1.4 !important;\n  margin: 0 0 4px 0 !important;\n}\n\n.sa-settings-item {\n  display: flex !important;\n  align-items: center !important;\n  justify-content: space-between !important;\n  padding: 10px 14px !important;\n  background: #2e323b !important;\n  border: 1px solid #404552 !important;\n  border-radius: 8px !important;\n  cursor: pointer !important;\n  transition: background 0.15s ease !important;\n}\n\n.sa-settings-item:hover {\n  background: #373c47 !important;\n}\n\n.sa-settings-item-label {\n  display: flex !important;\n  flex-direction: column !important;\n  gap: 2px !important;\n}\n\n.sa-settings-item-title {\n  font-size: 13px !important;\n  font-weight: 600 !important;\n  color: #fff !important;\n}\n\n.sa-settings-item-desc {\n  font-size: 11px !important;\n  color: #98a2b3 !important;\n}\n\n/* Switch toggle */\n.sa-toggle-switch {\n  position: relative !important;\n  display: inline-block !important;\n  width: 44px !important;\n  height: 24px !important;\n  flex-shrink: 0 !important;\n}\n\n.sa-toggle-switch input {\n  opacity: 0 !important;\n  width: 0 !important;\n  height: 0 !important;\n}\n\n.sa-toggle-slider {\n  position: absolute !important;\n  cursor: pointer !important;\n  top: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  background-color: #4b5565 !important;\n  transition: 0.2s !important;\n  border-radius: 24px !important;\n}\n\n.sa-toggle-slider:before {\n  position: absolute !important;\n  content: \"\" !important;\n  height: 18px !important;\n  width: 18px !important;\n  left: 3px !important;\n  bottom: 3px !important;\n  background-color: white !important;\n  transition: 0.2s !important;\n  border-radius: 50% !important;\n}\n\n.sa-toggle-switch input:checked + .sa-toggle-slider {\n  background-color: #ffc900 !important;\n}\n\n.sa-toggle-switch input:checked + .sa-toggle-slider:before {\n  transform: translateX(20px) !important;\n  background-color: #1a1a1a !important;\n}\n\n.sa-settings-footer {\n  padding: 12px 18px !important;\n  background: #1e2027 !important;\n  border-top: 1px solid #373b40 !important;\n  display: flex !important;\n  justify-content: flex-end !important;\n  gap: 8px !important;\n}\n\n.sa-settings-version {\n  margin-right: auto !important;\n  align-self: center !important;\n  font-size: 11px !important;\n  color: #8a9099 !important;\n  font-variant-numeric: tabular-nums !important;\n}\n\n.sa-settings-btn {\n  padding: 6px 14px !important;\n  border-radius: 6px !important;\n  font-size: 12px !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  border: 1px solid transparent !important;\n  outline: none !important;\n}\n\n.sa-settings-btn-primary {\n  background: #ffc900 !important;\n  color: #111 !important;\n}\n\n.sa-settings-btn-primary:hover {\n  background: #e6b400 !important;\n}\n\n.sa-settings-btn-cancel {\n  background: transparent !important;\n  color: #adb5bd !important;\n  border-color: #4a5058 !important;\n}\n\n.sa-settings-btn-cancel:hover {\n  background: #33383c !important;\n  color: #fff !important;\n}\n\n.sa-settings-divider {\n  height: 1px !important;\n  background: #373b40 !important;\n  margin: 4px 0 !important;\n}\n\n.sa-settings-reset-box {\n  display: flex !important;\n  align-items: center !important;\n  justify-content: space-between !important;\n  padding: 10px 14px !important;\n  background: rgba(220, 53, 69, 0.08) !important;\n  border: 1px dashed rgba(220, 53, 69, 0.4) !important;\n  border-radius: 8px !important;\n  gap: 12px !important;\n}\n\n.sa-settings-reset-btn {\n  padding: 6px 12px !important;\n  background: #dc3545 !important;\n  color: #ffffff !important;\n  border: none !important;\n  border-radius: 6px !important;\n  font-size: 11px !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  white-space: nowrap !important;\n  transition: background 0.15s ease, transform 0.1s ease !important;\n  flex-shrink: 0 !important;\n}\n\n.sa-settings-reset-btn:hover {\n  background: #bd2130 !important;\n}\n\n.sa-settings-reset-btn:active {\n  transform: scale(0.96) !important;\n}\n\n/* ==========================================================================\n   MODULE DES PÉNALITÉS FRÉQUENTES (SPORDLE ANNONCEUR)\n   ========================================================================== */\n\n/* Onglet Fréquentes & Conteneur des onglets (garantit un espacement net entre chaque onglet) */\n.filter-toggle {\n  display: flex !important;\n  align-items: center !important;\n  gap: 12px !important;\n  margin-bottom: 8px !important;\n}\n\n.filter-toggle button {\n  margin: 0 !important;\n}\n\n.filter-toggle .sa-frequents-tab,\n.filter-toggle .sa-favorites-tab {\n  margin: 0 !important;\n}\n\n/* Masquer le champ de filtre quand on est dans l'onglet Fréquentes */\n.penalty-infraction-view.sa-tab-frequents-active .infraction-filter input,\n.penalty-infraction-view.sa-tab-favorites-active .infraction-filter input {\n  display: none !important;\n}\n\n/* Grille des pénalités fréquentes */\n.sa-frequents-code-list,\n.sa-favorites-code-list {\n  max-height: 85% !important;\n  overflow-y: auto !important;\n  padding: 10px !important;\n  display: grid !important;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;\n  grid-auto-rows: minmax(85px, auto) !important;\n  gap: 10px !important;\n  box-sizing: border-box !important;\n}\n\n/* Boutons d'infractions fréquentes (même style que les boutons By code de Spordle) */\n.sa-fav-card,\n.sa-frequent-card {\n  position: relative !important;\n  display: flex !important;\n  flex-direction: column !important;\n  justify-content: center !important;\n  align-items: center !important;\n  text-align: center !important;\n  padding: 10px 14px !important;\n  margin: 0 !important;\n  background-color: #4b4e53 !important;\n  border: 1px solid rgba(0, 0, 0, 0) !important;\n  border-radius: 4px !important;\n  cursor: pointer !important;\n  transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease !important;\n  user-select: none !important;\n  -webkit-user-select: none !important;\n  -webkit-touch-callout: none !important;\n  touch-action: manipulation !important;\n  box-sizing: border-box !important;\n  min-height: 85px !important;\n}\n\n.sa-fav-card:hover,\n.sa-frequent-card:hover {\n  background-color: #585c62 !important;\n}\n\n.sa-fav-card:active,\n.sa-frequent-card:active {\n  transform: scale(0.98) !important;\n}\n\n/* Carte sélectionnée (identique aux boutons bleus natifs By code de Spordle) */\n.sa-fav-card.selected,\n.sa-frequent-card.selected {\n  background-color: #0066a4 !important;\n  border-color: #0086d7 !important;\n  box-shadow: 0 0 0 2px #0086d7 !important;\n}\n\n.sa-fav-card.selected:hover,\n.sa-frequent-card.selected:hover {\n  background-color: #0077be !important;\n  border-color: #38bdf8 !important;\n}\n\n/* Typographie Spordle native : h6.no-margin et h6.calm (pas de jaune, même taille) */\n.sa-fav-card h6.no-margin,\n.sa-frequent-card h6.no-margin {\n  font-size: 14px !important;\n  font-weight: 600 !important;\n  color: #ffffff !important;\n  margin: 0 0 4px 0 !important;\n  line-height: 1.25 !important;\n  pointer-events: none !important;\n}\n\n.sa-fav-card h6.calm,\n.sa-frequent-card h6.calm {\n  font-size: 13px !important;\n  font-weight: 500 !important;\n  color: #dce2e3 !important;\n  margin: 0 !important;\n  line-height: 1.2 !important;\n  pointer-events: none !important;\n}\n\n.sa-fav-card.selected h6.calm,\n.sa-frequent-card.selected h6.calm {\n  color: #ffffff !important;\n}\n\n/* Modal de confirmation de retrait */\n#sa-demo-penalty-modal-wrapper {\n  position: fixed !important;\n  top: 0 !important;\n  left: 0 !important;\n  width: 100vw !important;\n  height: 100vh !important;\n  background-color: rgba(0, 0, 0, 0.75) !important;\n  backdrop-filter: blur(2px) !important;\n  z-index: 9999 !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  pointer-events: auto !important;\n}\n\n#sa-demo-penalty-modal-wrapper .modal-wrapper {\n  position: relative !important;\n  width: 85% !important;\n  max-width: 960px !important;\n  height: 88% !important;\n  max-height: 820px !important;\n  display: flex !important;\n  flex-direction: column !important;\n}\n\n#sa-demo-penalty-modal-wrapper .modal-add-penalty {\n  position: relative !important;\n  width: 100% !important;\n  height: 100% !important;\n  top: auto !important;\n  left: auto !important;\n  right: auto !important;\n  bottom: auto !important;\n  background-color: #2b2e34 !important;\n  border: 1px solid #4a5058 !important;\n  border-radius: 8px !important;\n  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8) !important;\n  overflow: hidden !important;\n  display: flex !important;\n  flex-direction: column !important;\n}\n\n#sa-demo-penalty-modal-wrapper hi-add-penalty,\n#sa-demo-penalty-modal-wrapper .scroll,\n#sa-demo-penalty-modal-wrapper hi-add-penalty-infraction-select {\n  display: flex !important;\n  flex-direction: column !important;\n  width: 100% !important;\n  height: 100% !important;\n  position: relative !important;\n}\n\n#sa-demo-penalty-modal-wrapper .penalty-infraction-view {\n  position: relative !important;\n  top: auto !important;\n  bottom: auto !important;\n  flex: 1 1 auto !important;\n  overflow: hidden !important;\n  display: flex !important;\n  flex-direction: column !important;\n}\n\n#sa-demo-penalty-modal-wrapper .bar-header {\n  position: relative !important;\n  height: 48px !important;\n  background-color: #252831 !important;\n  border-bottom: 1px solid #3e444e !important;\n}\n\n#sa-demo-penalty-modal-wrapper .bar-footer {\n  position: relative !important;\n  height: 52px !important;\n  background-color: #252831 !important;\n  border-top: 1px solid #3e444e !important;\n}\n\n/* ==========================================================================\n   BOUTONS QUICK ACCESS SUR LA 1RE PAGE (HI-ADD-PENALTY-SUMMARY)\n   6 BOUTONS : 3 COLONNES SUR LAPTOP, 2 COLONNES SUR IPAD\n   ========================================================================== */\n\n.sa-summary-quick-grid {\n  display: grid !important;\n  grid-template-columns: repeat(3, 1fr) !important;\n  gap: 8px !important;\n  margin: 8px 0 10px 0 !important;\n  width: 100% !important;\n  box-sizing: border-box !important;\n  cursor: default !important;\n}\n\n@media (max-width: 900px) {\n  .sa-summary-quick-grid {\n    grid-template-columns: repeat(2, 1fr) !important;\n  }\n}\n\n.sa-quick-unavailable {\n  margin: 8px 0 10px 0 !important;\n  padding: 8px 10px !important;\n  border-radius: 6px !important;\n  background-color: #fff4e5 !important;\n  color: #7a4b00 !important;\n  font-size: 13px !important;\n  line-height: 1.35 !important;\n}\n\n.sa-summary-quick-btn {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 8px 6px !important;\n  min-height: 52px !important;\n  background-color: #2b2e34 !important;\n  border: 1px solid #4a5058 !important;\n  border-radius: 6px !important;\n  color: #ffffff !important;\n  font-family: \"interregular\", \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif !important;\n  cursor: pointer !important;\n  transition: all 0.15s ease !important;\n  user-select: none !important;\n  -webkit-user-select: none !important;\n  -webkit-touch-callout: none !important;\n  touch-action: manipulation !important;\n  box-sizing: border-box !important;\n}\n\n.sa-summary-quick-btn:hover {\n  background-color: #353a42 !important;\n  border-color: #0086d7 !important;\n  transform: translateY(-1px) !important;\n}\n\n.sa-summary-quick-btn:active {\n  transform: scale(0.97) !important;\n}\n\n.sa-summary-quick-btn.selected {\n  background-color: #0066a4 !important;\n  border-color: #0086d7 !important;\n  box-shadow: 0 0 0 2px #0086d7 !important;\n}\n\n.sa-summary-quick-btn .sa-quick-btn-name {\n  font-family: \"interbold\", \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif !important;\n  font-size: 12px !important;\n  font-weight: 700 !important;\n  color: #ffffff !important;\n  text-align: center !important;\n  line-height: 1.25 !important;\n  margin-bottom: 3px !important;\n  pointer-events: none !important;\n}\n\n.sa-summary-quick-btn .sa-quick-btn-code {\n  font-family: \"interregular\", \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif !important;\n  font-size: 13px !important;\n  font-weight: normal !important;\n  color: #dce2e3 !important;\n  background: none !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  border-radius: 0 !important;\n  pointer-events: none !important;\n}\n\n.sa-summary-quick-btn.selected .sa-quick-btn-code {\n  background: none !important;\n  color: #ffffff !important;\n  opacity: 0.9 !important;\n}\n\n/* ==========================================================================\n   Bouton Spordle Annonceur dans le menu contextuel Options Spordle\n   ========================================================================== */\n\n.sa-menu-options-item {\n  display: flex !important;\n  align-items: center !important;\n  column-gap: 0.5rem !important;\n  text-align: left !important;\n  width: 100% !important;\n  padding: 8px 12px !important;\n  background: transparent !important;\n  border: none !important;\n  color: #fff !important;\n  font-family: \"interregular\", -apple-system, BlinkMacSystemFont, sans-serif !important;\n  font-size: 0.95rem !important;\n  cursor: pointer !important;\n  border-radius: 4px !important;\n  transition: background 0.15s ease, opacity 0.15s ease !important;\n  box-sizing: border-box !important;\n}\n\n.sa-menu-options-item:hover,\n.sa-menu-options-item:active {\n  background: rgba(255, 255, 255, 0.12) !important;\n  opacity: 1 !important;\n}\n\n.sa-menu-options-item .sa-menu-icon {\n  font-size: 1.15rem !important;\n  line-height: 1 !important;\n}\n\n.sa-menu-divider {\n  height: 1px !important;\n  background: rgba(255, 255, 255, 0.15) !important;\n  margin: 4px 0 !important;\n  border: none !important;\n}\n\n\n\n";
      const style = document.createElement("style");
      style.id = "spordle-annonceur-styles";
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    }
  } catch (err) {
    console.error("[Spordle POC] Erreur injection CSS:", err);
  }

  // Badge visuel POC
  
(() => {
  function showPocBadge() {
    let badge = document.getElementById('sa-poc-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'sa-poc-badge';
      badge.style.position = 'fixed';
      badge.style.bottom = '16px';
      badge.style.right = '16px';
      badge.style.zIndex = '999999';
      badge.style.padding = '10px 20px';
      badge.style.borderRadius = '24px';
      badge.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      badge.style.fontSize = '14px';
      badge.style.fontWeight = 'bold';
      badge.style.color = '#ffffff';
      badge.style.boxShadow = '0 6px 18px rgba(0,0,0,0.5)';
      badge.style.pointerEvents = 'none';
      badge.style.transition = 'all 0.4s ease';
      document.body.appendChild(badge);
    }
    const ver = '1.0.1';
    const hot = true;
    badge.style.background = hot ? '#10b981' : '#0284c7'; // Vert si autonome, bleu si initial
    badge.innerHTML = '📢 Spordle Annonceur POC <strong>v' + ver + '</strong> [' + (hot ? '⚡ Autonome' : 'Local') + ']' + (hot ? ' — 🚀 Auto-update actif !' : '');
  }
  if (document.body) showPocBadge();
  else document.addEventListener('DOMContentLoaded', showPocBadge);
})();


  // Moteur officiel
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
    E: { code: "E", name: "Punition de match", minutes: 5, isEjection: true, french: "punition de match et 5 minutes" },
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
    61: { id: 61, group: 5, name: "Abus verbal et conduite antisportive", spoken: "conduite antisportive" },
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

  /**
   * Convertit une infraction en verbe d'action au passé composé pour l'annonce d'un tir de punition
   * Ex: "avoir fait trébucher" -> "a fait trébucher", "coup de bâton" -> "a donné un coup de bâton"
   */
  const formatPenaltyShotAction = (infractionSpoken) => {
    const s = clean(infractionSpoken).toLowerCase();
    if (/^avoir\s+/i.test(s)) {
      return s.replace(/^avoir\s+/i, "a ");
    }
    const actionMap = {
      "coup de bâton": "a donné un coup de bâton",
      "double échec": "a donné un double échec",
      "bâton trop élevé": "a porté son bâton trop élevé",
      "assaut": "a commis un assaut",
      "mise en échec par derrière": "a donné une mise en échec par derrière",
      "mise en échec corporelle": "a donné une mise en échec corporelle",
      "contact avec la tête": "a fait un contact avec la tête",
      "rudesse": "a fait de la rudesse",
      "obstruction": "a fait de l'obstruction",
      "refus de se mettre au jeu": "a refusé de se mettre au jeu"
    };
    if (actionMap[s]) return actionMap[s];
    return `a été pénalisé pour ${s}`;
  };

  /**
   * Détecte si le joueur pénalisé est un entraîneur ou officiel d'équipe (E1-E5, ENT, Entraîneur, Coach)
   */
  const isCoachMember = (penalty) => {
    if (!penalty) return false;
    if (penalty.isCoach) return true;
    const p = penalty.penalizedPlayer;
    if (!p) return false;
    if (p.isCoach || p.role === "coach") return true;
    const numStr = String(p.number || "").trim();
    if (/^(?:E[1-5]|ENT|COACH|ENTRA[IÎ]NEUR|AC|HC|GER|G[EÉ]R)$/i.test(numStr)) return true;
    const nameStr = String(p.name || "").trim();
    if (/\b(?:entra[iî]neur|coach|adjoint|g[eé]rant)\b/i.test(nameStr)) return true;
    return false;
  };

  // =========================================================================
  // 3. MOTEUR DE DÉCODAGE DES CODES HOCKEY QUÉBEC
  // =========================================================================

  /**
   * Décode un code comme "A22", "B40", "A80", "A22/G", "F53"
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
      isNonCarrier: mod === "NP",
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

    // Règles de combinaison officielles Hockey Québec (Manuel des officiels hors glace)
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
      return { durationText: "punition de match et 5 minutes", spokenInfraction: primaryInfraction };
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
   * Génère l'annonce complète d'un but selon le Manuel des officiels hors glace.
   * 
   * @param {Object} goal
   *   - teamName: string (ex: "Remparts Est Richelieu")
   *   - teamGoalCount: number (rang du but de l'équipe dans le match: 1, 2, 3...)
   *   - scorer: { name: string, number: string|number }
   *   - assists: Array<{ name: string, number: string|number }>
   *   - isPowerplay?: boolean (Avantage numérique)
   *   - isShorthanded?: boolean (Désavantage numérique)
   *   - isEmptyNet?: boolean (Filet désert)
   *   - isPenaltyShot?: boolean (Tir de punition)
   *   - time: string (ex: "07:48")
   *   - period?: string|number (conservé pour compatibilité mais non affiché dans le temps du but)
   */
  const formatGoal = (goal) => {
    const team = clean(goal.teamName || "Équipe");
    const count = goal.teamGoalCount > 0 ? goal.teamGoalCount : 0;
    const ordinalMasc = count > 0 ? getOrdinalMasc(count) : "";
    const countText = count === 1 ? "Le premier" : count > 1 ? `Le ${ordinalMasc}` : "Le";

    // Ligne 1 : Titre et compteur de buts de l'équipe
    const line1 = `${countText} but des ${team},`;

    // Situation spéciale intégrée (avec « désavantage numérique » selon le manuel)
    const specParts = [];
    if (goal.isPenaltyShot) {
      specParts.push("sur un tir de punition");
    } else {
      if (goal.isShorthanded) specParts.push("en désavantage numérique");
      if (goal.isPowerplay) specParts.push("en avantage numérique");
      if (goal.isEmptyNet) specParts.push("dans un filet désert");
    }
    const specPhrase = specParts.length > 0 ? ` ${specParts.join(" ")}` : "";

    // Buteur et aides sur la même phrase (Ligne 2)
    // Manuel : « marqué sans aide par le numéro (# + nom). » / « marqué par le numéro (# et nom) avec l'aide du numéro (# et nom) et du numéro (# et nom). »
    let line2 = "";
    const sNum = goal.scorer && goal.scorer.number !== undefined && goal.scorer.number !== null ? String(goal.scorer.number).trim() : "";
    const sName = goal.scorer && goal.scorer.name ? titleCase(goal.scorer.name) : "Inconnu";
    const scorerPhrase = sNum ? `par le numéro ${sNum}, ${sName}` : `par ${sName}`;
    const scorerHtmlPhrase = sNum ? `par le numéro <strong>${escapeHtml(sNum)}</strong>, ${escapeHtml(sName)}` : `par ${escapeHtml(sName)}`;

    const assists = Array.isArray(goal.assists) ? goal.assists.filter((a) => a && a.name).slice(0, 2) : [];
    if (assists.length === 0) {
      line2 = `marqué${specPhrase} sans aide ${scorerPhrase}.`;
    } else if (assists.length === 1) {
      const a1Num = assists[0].number !== undefined && assists[0].number !== null ? String(assists[0].number).trim() : "";
      const a1Name = titleCase(assists[0].name);
      const a1Phrase = a1Num ? `avec l'aide du numéro ${a1Num}, ${a1Name}` : `avec l'aide de ${a1Name}`;
      line2 = `marqué${specPhrase} ${scorerPhrase}, ${a1Phrase}.`;
    } else {
      const a1Num = assists[0].number !== undefined && assists[0].number !== null ? String(assists[0].number).trim() : "";
      const a1Name = titleCase(assists[0].name);
      const a1Phrase = a1Num ? `avec l'aide du numéro ${a1Num}, ${a1Name}` : `avec l'aide de ${a1Name}`;
      const a2Num = assists[1].number !== undefined && assists[1].number !== null ? String(assists[1].number).trim() : "";
      const a2Name = titleCase(assists[1].name);
      const a2Phrase = a2Num ? `et du numéro ${a2Num}, ${a2Name}` : `et de ${a2Name}`;
      line2 = `marqué${specPhrase} ${scorerPhrase}, ${a1Phrase}, ${a2Phrase}.`;
    }

    // Ligne 3 : Temps du but (sans période, selon le manuel : « Le temps du but : (minute et seconde). »)
    const t = clean(goal.time || "").replace(/^0(\d)/, "$1");
    const line3 = t ? `Le temps du but : ${t}.` : "";

    // Ligne 1 HTML
    const htmlLine1 = count === 1
      ? `Le <strong>premier</strong> but des <strong>${escapeHtml(team)}</strong>,`
      : count > 1
      ? `Le <strong>${ordinalMasc}</strong> but des <strong>${escapeHtml(team)}</strong>,`
      : `Le but des <strong>${escapeHtml(team)}</strong>,`;

    // Ligne 2 HTML
    let htmlLine2 = "";
    if (assists.length === 0) {
      htmlLine2 = `marqué${specPhrase} sans aide ${scorerHtmlPhrase}.`;
    } else if (assists.length === 1) {
      const a1Num = assists[0].number !== undefined && assists[0].number !== null ? String(assists[0].number).trim() : "";
      const a1Name = titleCase(assists[0].name);
      const a1HtmlPhrase = a1Num ? `avec l'aide du numéro <strong>${escapeHtml(a1Num)}</strong>, ${escapeHtml(a1Name)}` : `avec l'aide de ${escapeHtml(a1Name)}`;
      htmlLine2 = `marqué${specPhrase} ${scorerHtmlPhrase}, ${a1HtmlPhrase}.`;
    } else {
      const a1Num = assists[0].number !== undefined && assists[0].number !== null ? String(assists[0].number).trim() : "";
      const a1Name = titleCase(assists[0].name);
      const a1HtmlPhrase = a1Num ? `avec l'aide du numéro <strong>${escapeHtml(a1Num)}</strong>, ${escapeHtml(a1Name)}` : `avec l'aide de ${escapeHtml(a1Name)}`;
      const a2Num = assists[1].number !== undefined && assists[1].number !== null ? String(assists[1].number).trim() : "";
      const a2Name = titleCase(assists[1].name);
      const a2HtmlPhrase = a2Num ? `et du numéro <strong>${escapeHtml(a2Num)}</strong>, ${escapeHtml(a2Name)}` : `et de ${escapeHtml(a2Name)}`;
      htmlLine2 = `marqué${specPhrase} ${scorerHtmlPhrase}, ${a1HtmlPhrase}, ${a2HtmlPhrase}.`;
    }

    // Ligne 3 HTML
    const htmlLine3 = t ? `Le temps du but : <strong>${escapeHtml(t)}</strong>.` : "";

    const lines = [line1, line2];
    const htmlLines = [htmlLine1, htmlLine2];
    if (line3) lines.push(line3);
    if (htmlLine3) htmlLines.push(htmlLine3);

    return {
      type: "goal",
      title: `BUT — ${team.toUpperCase()}`,
      teamName: team,
      lines,
      htmlLines,
      speechText: lines.join(" ")
    };
  };

  // =========================================================================
  // 5. MOTEUR DE GÉNÉRATION DES PÉNALITÉS (PENALTY ANNOUNCER)
  // =========================================================================

  /**
   * Génère l'annonce complète d'une pénalité (simple, combinée, coïncidente, tir de punition, ou entraîneur).
   */
  const formatPenalty = (penalty) => {
    const team = clean(penalty.teamName || "Équipe");
    const isBench = !!penalty.isBenchMinor;
    const lines = [];
    const htmlLines = [];

    // Décodage des codes éventuels
    let durationText = penalty.durationDescription || "2 minutes";
    let infractionText = penalty.infractionDescription ? penalty.infractionDescription.toLowerCase() : "infraction";
    let parsedCodes = [];

    if (Array.isArray(penalty.codes) && penalty.codes.length > 0) {
      parsedCodes = penalty.codes.map(parsePenaltyCode).filter(Boolean);
      if (parsedCodes.length > 0) {
        const resolved = resolvePenaltyCombination(parsedCodes);
        durationText = resolved.durationText;
        infractionText = resolved.spokenInfraction;
      }
    }

    // Formatage de la période et du temps
    const t = clean(penalty.time || "").replace(/^0(\d)/, "$1");
    let pLabel = "";
    const pStr = String(penalty.period || "").trim().toLowerCase();
    if (pStr === "1" || pStr.includes("1re") || pStr.includes("1er")) pLabel = "1re période";
    else if (pStr === "2" || pStr.includes("2e")) pLabel = "2e période";
    else if (pStr === "3" || pStr.includes("3e")) pLabel = "3e période";
    else if (pStr === "ot" || pStr.includes("prolongation") || pStr === "4") pLabel = "période de prolongation";

    const periodSuffix = pLabel ? ` de la ${pLabel}` : "";
    const htmlPeriodSuffix = pLabel ? ` de la ${escapeHtml(pLabel)}` : "";

    // CAS SPÉCIAL 1 : Extrême inconduite décernée à un membre du groupe d'entraîneurs (Manuel p. 42)
    const hasGameMisconduct =
      parsedCodes.some((c) => c.prefix === "D") ||
      /extr[eê]me\s*inconduite|grossi[eè]re\s*inconduite|game\s*misconduct/i.test(
        `${durationText} ${penalty.severity || ""}`
      );

    if (isCoachMember(penalty) && hasGameMisconduct) {
      const warnLine1 = "Ne pas annoncer au micro — Extrême inconduite à un entraîneur";
      const warnLine2 = "Si la pénalité d'extrême inconduite est donnée à un membre du groupe d'entraîneurs, ne jamais l'annoncer.";
      return {
        type: "penalty",
        isDoNotAnnounce: true,
        title: `PÉNALITÉ — ${team.toUpperCase()}`,
        teamName: team,
        lines: [warnLine1, warnLine2],
        htmlLines: [
          `<strong>⚠️ ${escapeHtml(warnLine1)}</strong>`,
          escapeHtml(warnLine2)
        ],
        speechText: ""
      };
    }

    // CAS SPÉCIAL 2 : Tir de punition décerné (Code F — Manuel p. 42)
    const isPenaltyShotCode =
      !!penalty.isPenaltyShot ||
      (parsedCodes.length > 0 && parsedCodes.every((c) => c.prefix === "F"));

    if (isPenaltyShotCode) {
      const awardedTeam = clean(penalty.awardedTeamName || "l'équipe adverse");
      const actionPhrase = formatPenaltyShotAction(infractionText);

      if (penalty.penalizedPlayer && penalty.penalizedPlayer.name) {
        const pNum = String(penalty.penalizedPlayer.number).trim();
        const pName = titleCase(penalty.penalizedPlayer.name);
        lines.push(`Un tir de punition est accordé aux ${awardedTeam}`);
        lines.push(`puisque le numéro ${pNum}, ${pName}, des ${team} ${actionPhrase}.`);
        htmlLines.push(`Un tir de punition est accordé aux <strong>${escapeHtml(awardedTeam)}</strong>`);
        htmlLines.push(
          `puisque le numéro <strong>${escapeHtml(pNum)}</strong>, ${escapeHtml(pName)}, des <strong>${escapeHtml(team)}</strong> ${escapeHtml(actionPhrase)}.`
        );
      } else {
        lines.push(`Un tir de punition est accordé aux ${awardedTeam}`);
        lines.push(`puisque les ${team} ${actionPhrase}.`);
        htmlLines.push(`Un tir de punition est accordé aux <strong>${escapeHtml(awardedTeam)}</strong>`);
        htmlLines.push(`puisque les <strong>${escapeHtml(team)}</strong> ${escapeHtml(actionPhrase)}.`);
      }

      const shooter = penalty.shooterPlayer || penalty.servedByPlayer;
      if (shooter && shooter.name) {
        const sNum = String(shooter.number).trim();
        const sName = titleCase(shooter.name);
        lines.push(`Le tir sera effectué par le numéro ${sNum}, ${sName}.`);
        htmlLines.push(`Le tir sera effectué par le numéro <strong>${escapeHtml(sNum)}</strong>, ${escapeHtml(sName)}.`);
      }

      if (t) {
        lines.push(`Le temps de la pénalité : ${t}${periodSuffix}.`);
        htmlLines.push(`Le temps de la pénalité : <strong>${escapeHtml(t)}</strong>${htmlPeriodSuffix}.`);
      }

      return {
        type: "penalty",
        title: `TIR DE PUNITION — ${awardedTeam.toUpperCase()}`,
        teamName: team,
        lines,
        htmlLines,
        speechText: lines.join(" ")
      };
    }

    // CAS SPÉCIAL 3 : Deux punitions pareilles / coïncidentes (Manuel p. 42)
    if (penalty.coincidentWith && penalty.coincidentWith.penalizedPlayer && penalty.penalizedPlayer) {
      const other = penalty.coincidentWith;
      const isCurrentAway = penalty.side === "away" || other.side === "home";
      const awayEntry = isCurrentAway
        ? { teamName: team, player: penalty.penalizedPlayer }
        : { teamName: clean(other.teamName || "Visiteur"), player: other.penalizedPlayer };
      const homeEntry = isCurrentAway
        ? { teamName: clean(other.teamName || "Local"), player: other.penalizedPlayer }
        : { teamName: team, player: penalty.penalizedPlayer };

      const aNum = String(awayEntry.player.number).trim();
      const aName = titleCase(awayEntry.player.name);
      const hNum = String(homeEntry.player.number).trim();
      const hName = titleCase(homeEntry.player.name);

      lines.push(`Pénalité aux ${awayEntry.teamName}, au numéro ${aNum}, ${aName},`);
      lines.push(`et aux ${homeEntry.teamName}, au numéro ${hNum}, ${hName},`);
      lines.push(`${durationText} chacun pour ${infractionText}.`);

      htmlLines.push(
        `Pénalité aux <strong>${escapeHtml(awayEntry.teamName)}</strong>, au numéro <strong>${escapeHtml(aNum)}</strong>, ${escapeHtml(aName)},`
      );
      htmlLines.push(
        `et aux <strong>${escapeHtml(homeEntry.teamName)}</strong>, au numéro <strong>${escapeHtml(hNum)}</strong>, ${escapeHtml(hName)},`
      );
      htmlLines.push(`<strong>${escapeHtml(durationText)} chacun</strong> pour ${escapeHtml(infractionText)}.`);

      if (t) {
        lines.push(`Le temps de la pénalité : ${t}${periodSuffix}.`);
        htmlLines.push(`Le temps de la pénalité : <strong>${escapeHtml(t)}</strong>${htmlPeriodSuffix}.`);
      }

      return {
        type: "penalty",
        isCoincident: true,
        title: `PÉNALITÉS PAREILLES — ${awayEntry.teamName.toUpperCase()} / ${homeEntry.teamName.toUpperCase()}`,
        teamName: team,
        lines,
        htmlLines,
        speechText: lines.join(" ")
      };
    }

    // CAS STANDARD : Pénalité d'équipe (banc) ou de joueur
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
    lines.push(`Le temps de la pénalité : ${t}${periodSuffix}.`);
    htmlLines.push(`Le temps de la pénalité : <strong>${escapeHtml(t)}</strong>${htmlPeriodSuffix}.`);

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
   * 5b. FORMATAGE D'UN CHANGEMENT DE GARDIEN DE BUT (Manuel p. 43)
   * 
   * Règle d'annonce :
   * « Changement de gardien de but pour les [Équipe], »
   * « maintenant devant le filet le numéro [X, Prénom Nom]. »
   */
  const formatGoalieChange = (goalieEvent) => {
    const lines = [];
    const htmlLines = [];

    const team = clean(goalieEvent.teamName || "l'équipe");
    const num = goalieEvent.goalie ? String(goalieEvent.goalie.number || "").trim() : "";
    const name = goalieEvent.goalie ? titleCase(goalieEvent.goalie.name || "") : "";
    const rawDetails = clean(goalieEvent.details || "");

    const isEmptyNet =
      !!goalieEvent.isEmptyNet ||
      !!goalieEvent.isPulled ||
      /empty\s*net|filet\s*d[eé]sert|aucun\s*gardien|no\s*goalie|retir[eé]\s*du\s*filet|pulled|sorti\s*du\s*filet/i.test(
        `${name} ${rawDetails}`
      ) ||
      (!num && !name);

    if (isEmptyNet) {
      const warnLine1 = "Ne pas annoncer au micro — Filet désert";
      const warnLine2 = "Il n'y a pas d'annonce à faire pour un filet désert (gardien retiré).";
      return {
        type: "goalie",
        isDoNotAnnounce: true,
        title: `GARDIEN — ${team.toUpperCase()}`,
        teamName: team,
        lines: [warnLine1, warnLine2],
        htmlLines: [
          `<strong>⚠️ ${escapeHtml(warnLine1)}</strong>`,
          escapeHtml(warnLine2)
        ],
        speechText: ""
      };
    }

    // Ligne 1 : Annonce de l'équipe (selon le manuel : « Changement de gardien de but pour les (équipe) »)
    lines.push(`Changement de gardien de but pour les ${team},`);
    htmlLines.push(`Changement de gardien de but pour les <strong>${escapeHtml(team)}</strong>,`);

    // Ligne 2 : Nouveau gardien devant le filet
    if (num && name) {
      lines.push(`maintenant devant le filet le numéro ${num}, ${name}.`);
      htmlLines.push(`maintenant devant le filet le numéro <strong>${escapeHtml(num)}</strong>, ${escapeHtml(name)}.`);
    } else {
      lines.push(`maintenant devant le filet ${name}.`);
      htmlLines.push(`maintenant devant le filet <strong>${escapeHtml(name)}</strong>.`);
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
  // 5.5. MOT DE BIENVENUE D'AVANT-MATCH (WELCOME ANNOUNCEMENT - Manuel p. 41)
  // =========================================================================

  /**
   * Convertit une catégorie Hockey Canada (U11, U13, etc.) en nomenclature officielle Hockey Québec (M11, M13, etc.)
   */
  const convertCategoryToQuebec = (catStr) => {
    if (!catStr) return "M11";
    let cleaned = clean(catStr);
    cleaned = cleaned.replace(/\b[Uu][\s-]?(\d{1,2})[-]/g, "M$1 ");
    cleaned = cleaned.replace(/\b[Uu][\s-]?(\d{1,2})\b/g, "M$1");
    cleaned = clean(cleaned);
    return cleaned;
  };

  /**
   * Adapte phonétiquement la catégorie pour la synthèse vocale (TTS québécois)
   */
  const phonetizeCategory = (catStr) => {
    if (!catStr) return "";
    let s = clean(catStr);
    s = s.replace(/\bM(\d{1,2})\b/g, "M $1");
    s = s.replace(/\bAAA\b/g, "triple A");
    s = s.replace(/\bAA\b/g, "double A");
    s = s.replace(/\bBB\b/g, "double B");
    s = s.replace(/\bCC\b/g, "double C");
    return s;
  };

  /**
   * Détermine la salutation appropriée selon l'heure ("Bonjour", "Bon après-midi", "Bonsoir")
   */
  const getGreetingForHour = (hour) => {
    if (typeof hour !== "number" || Number.isNaN(hour)) return "Bonjour";
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  /**
   * Formate l'annonce officielle d'avant-match selon le Manuel des officiels hors glace (p. 41)
   */
  const formatWelcomeMessage = (options = {}) => {
    const rawCategory = options.category || "M11 AA";
    const category = convertCategoryToQuebec(rawCategory);
    const categorySpoken = phonetizeCategory(category);

    const greeting = clean(options.greeting || getGreetingForHour(options.hour));
    const rawArena = clean(options.arena || "");
    let arenaText = "";
    let arenaHtml = "";
    if (rawArena) {
      const startsWithArena = /^ar[eé]na\b/i.test(rawArena);
      const cleanArenaName = startsWithArena ? clean(rawArena.replace(/^ar[eé]na\s+/i, "")) : rawArena;
      arenaText = ` à l'aréna ${cleanArenaName}`;
      arenaHtml = ` à l'aréna <strong>${escapeHtml(cleanArenaName)}</strong>`;
    }

    const awayTeam = clean(options.awayTeam || "Visiteurs");
    const homeTeam = clean(options.homeTeam || "Locaux");

    const awayJersey = clean(options.awayJersey || "blanc").toLowerCase();
    const homeJersey = clean(options.homeJersey || "bleu").toLowerCase();

    const awayGoalieNum = clean(String(options.awayGoalie?.number || options.awayGoalieNumber || "30"));
    const awayGoalieName = titleCase(options.awayGoalie?.name || options.awayGoalieName || "Félix Tremblay");

    const homeGoalieNum = clean(String(options.homeGoalie?.number || options.homeGoalieNumber || "33"));
    const homeGoalieName = titleCase(options.homeGoalie?.name || options.homeGoalieName || "Jacob Gagnon");

    // Ligne 1 : Salutation, aréna, division/classe, équipes et couleurs de chandails
    const line1 = `${greeting} mesdames et messieurs et bienvenue${arenaText} à cette rencontre de la division ${category}, entre les ${awayTeam} en chandail ${awayJersey} et les ${homeTeam} en chandail ${homeJersey}.`;
    const htmlLine1 = `${escapeHtml(greeting)} mesdames et messieurs et bienvenue${arenaHtml} à cette rencontre de la division <strong>${escapeHtml(category)}</strong>, entre les <strong>${escapeHtml(awayTeam)}</strong> en chandail <strong>${escapeHtml(awayJersey)}</strong> et les <strong>${escapeHtml(homeTeam)}</strong> en chandail <strong>${escapeHtml(homeJersey)}</strong>.`;

    // Ligne 2 : Gardiens de but partants
    const line2 = `Les gardiens de but partant : pour les ${awayTeam}, le numéro ${awayGoalieNum}, ${awayGoalieName} et pour les ${homeTeam}, le numéro ${homeGoalieNum}, ${homeGoalieName}.`;
    const htmlLine2 = `Les gardiens de but partant : pour les <strong>${escapeHtml(awayTeam)}</strong>, le numéro <strong>${escapeHtml(awayGoalieNum)}</strong>, <strong>${escapeHtml(awayGoalieName)}</strong> et pour les <strong>${escapeHtml(homeTeam)}</strong>, le numéro <strong>${escapeHtml(homeGoalieNum)}</strong>, <strong>${escapeHtml(homeGoalieName)}</strong>.`;

    const lines = [line1, line2];
    const htmlLines = [htmlLine1, htmlLine2];
    const speechParts = [
      `${greeting} mesdames et messieurs et bienvenue${arenaText} à cette rencontre de la division ${categorySpoken}, entre les ${awayTeam} en chandail ${awayJersey} et les ${homeTeam} en chandail ${homeJersey}.`,
      line2
    ];

    // Ligne 3 (optionnelle) : Les officiels pour cette rencontre
    const officials = options.officials;
    if (officials && (officials.referee || (Array.isArray(officials.linesmen) && officials.linesmen.length > 0))) {
      const refName = clean(officials.referee || "");
      const linesmen = Array.isArray(officials.linesmen) ? officials.linesmen.map(clean).filter(Boolean) : [];
      let offLine = "";
      let offHtml = "";

      if (refName && linesmen.length >= 2) {
        offLine = `Les officiels pour cette rencontre : l'arbitre en chef ${refName}, ses adjoints, les juges de lignes ${linesmen[0]} et ${linesmen[1]}.`;
        offHtml = `Les officiels pour cette rencontre : l'arbitre en chef <strong>${escapeHtml(refName)}</strong>, ses adjoints, les juges de lignes <strong>${escapeHtml(linesmen[0])}</strong> et <strong>${escapeHtml(linesmen[1])}</strong>.`;
      } else if (refName && linesmen.length === 1) {
        offLine = `Les officiels pour cette rencontre : l'arbitre en chef ${refName}, et le juge de lignes ${linesmen[0]}.`;
        offHtml = `Les officiels pour cette rencontre : l'arbitre en chef <strong>${escapeHtml(refName)}</strong>, et le juge de lignes <strong>${escapeHtml(linesmen[0])}</strong>.`;
      } else if (refName) {
        offLine = `Les officiels pour cette rencontre : l'arbitre en chef ${refName}.`;
        offHtml = `Les officiels pour cette rencontre : l'arbitre en chef <strong>${escapeHtml(refName)}</strong>.`;
      } else if (linesmen.length >= 2) {
        offLine = `Les officiels pour cette rencontre : les juges de lignes ${linesmen[0]} et ${linesmen[1]}.`;
        offHtml = `Les officiels pour cette rencontre : les juges de lignes <strong>${escapeHtml(linesmen[0])}</strong> et <strong>${escapeHtml(linesmen[1])}</strong>.`;
      }

      if (offLine) {
        lines.push(offLine);
        htmlLines.push(offHtml);
        speechParts.push(offLine);
      }
    }

    // Ligne finale : Formule de clôture du manuel
    const closingLine = `Bon match mesdames messieurs et bonne chance aux deux équipes.`;
    lines.push(closingLine);
    htmlLines.push(closingLine);
    speechParts.push(closingLine);

    return {
      type: "welcome",
      title: "AVANT-MATCH — MOT DE BIENVENUE",
      greeting,
      arena: rawArena,
      category,
      awayTeam,
      homeTeam,
      awayJersey,
      homeJersey,
      awayGoalie: { number: awayGoalieNum, name: awayGoalieName },
      homeGoalie: { number: homeGoalieNum, name: homeGoalieName },
      lines,
      htmlLines,
      speechText: speechParts.join(" ")
    };
  };

  // =========================================================================
  // 6. GESTION DES PÉNALITÉS FAVORITES & RÉSOLUTION DE CODE
  // =========================================================================

  /**
   * Trouve le nom d'infraction à partir d'une chaîne de codes (ex: "A53", "A23 + A23", "A1 + B2 + D2")
   */
  const getInfractionNameByCode = (codeStr) => {
    if (!codeStr) return "";
    const cleanStr = String(codeStr).trim();
    const parts = cleanStr.split("+").map((p) => p.trim());
    
    // Cas spécial: "67" (Warning Discrimination)
    if (cleanStr === "67") {
      return "Avertissement discrimination";
    }

    const foundNames = [];
    for (const part of parts) {
      const parsed = parsePenaltyCode(part);
      if (parsed && parsed.infraction && parsed.infraction.name) {
        if (!foundNames.includes(parsed.infraction.name)) {
          foundNames.push(parsed.infraction.name);
        }
      }
    }

    if (foundNames.length > 0) {
      return foundNames.join(" + ");
    }

    // Recherche par chiffre direct si non préfixé par A-F
    const numMatch = cleanStr.match(/\d+/);
    if (numMatch) {
      const id = parseInt(numMatch[0], 10);
      if (INFRACTIONS[id]) return INFRACTIONS[id].name;
    }

    return "";
  };

  const sortPenaltiesAlphabetically = (list) => {
    return [...list].sort((a, b) => {
      const comp = (a.name || "").localeCompare(b.name || "", "fr", { sensitivity: "base" });
      if (comp !== 0) return comp;
      return (a.code || "").localeCompare(b.code || "");
    });
  };

  const sortFavoritesAlphabetically = sortPenaltiesAlphabetically;

  // Liste officielle des 12 pénalités les plus fréquentes du hockey mineur québécois (couvrant 95.7% des appels)
  // + traitement spécial pour Contact avec la tête (A48 + A48), soit 13 entrées au total, triées en ordre alphabétique.
  const FREQUENT_PENALTIES = Object.freeze(sortPenaltiesAlphabetically([
    { code: "A52", name: "Accrocher", severity: "Minor" },
    { code: "A61", name: "Abus verbal et conduite antisportive", severity: "Minor" },
    { code: "A48", name: "Contact avec la tête", severity: "Minor" },
    { code: "A48 + A48", name: "Contact avec la tête", severity: "Minor + Minor" },
    { code: "A22", name: "Coup de bâton", severity: "Minor" },
    { code: "A44", name: "Donner de la bande", severity: "Minor" },
    { code: "A25", name: "Double échec", severity: "Minor" },
    { code: "A53", name: "Faire trébucher", severity: "Minor" },
    { code: "A39", name: "Mise en échec corporelle", severity: "Minor" },
    { code: "A56", name: "Obstruction", severity: "Minor" },
    { code: "A50", name: "Retenir", severity: "Minor" },
    { code: "A47", name: "Rudesse", severity: "Minor" },
    { code: "A80", name: "Trop de joueurs sur la patinoire", severity: "Minor" }
  ]));

  const DEFAULT_FAVORITE_PENALTIES = FREQUENT_PENALTIES;

  const getFrequentPenalties = () => {
    return [...FREQUENT_PENALTIES];
  };

  const getFavoritePenalties = getFrequentPenalties;

  // Grille déterministe O(1) de Quick Access (6 boutons en ordre alphabétique par catégorie)
  const QUICK_ACCESS_BY_CATEGORY = {
    M11: [
      { code: "A52", name: "Accrocher", severity: "Minor" },
      { code: "A22", name: "Coup de bâton", severity: "Minor" },
      { code: "A53", name: "Faire trébucher", severity: "Minor" },
      { code: "A39", name: "Mise en échec corporelle", severity: "Minor" },
      { code: "A56", name: "Obstruction", severity: "Minor" },
      { code: "A47", name: "Rudesse", severity: "Minor" }
    ],
    M13: [
      { code: "A48", name: "Contact avec la tête", severity: "Minor" },
      { code: "A48 + A48", name: "Contact avec la tête", severity: "Minor + Minor" },
      { code: "A53", name: "Faire trébucher", severity: "Minor" },
      { code: "A39", name: "Mise en échec corporelle", severity: "Minor" },
      { code: "A56", name: "Obstruction", severity: "Minor" },
      { code: "A47", name: "Rudesse", severity: "Minor" }
    ],
    M15: [
      { code: "A48", name: "Contact avec la tête", severity: "Minor" },
      { code: "A48 + A48", name: "Contact avec la tête", severity: "Minor + Minor" },
      { code: "A22", name: "Coup de bâton", severity: "Minor" },
      { code: "A53", name: "Faire trébucher", severity: "Minor" },
      { code: "A56", name: "Obstruction", severity: "Minor" },
      { code: "A47", name: "Rudesse", severity: "Minor" }
    ],
    M17: [
      { code: "A61", name: "Abus verbal et conduite antisportive", severity: "Minor" },
      { code: "A48", name: "Contact avec la tête", severity: "Minor" },
      { code: "A48 + A48", name: "Contact avec la tête", severity: "Minor + Minor" },
      { code: "A25", name: "Double échec", severity: "Minor" },
      { code: "A53", name: "Faire trébucher", severity: "Minor" },
      { code: "A47", name: "Rudesse", severity: "Minor" }
    ],
    M18: [
      { code: "A61", name: "Abus verbal et conduite antisportive", severity: "Minor" },
      { code: "A48", name: "Contact avec la tête", severity: "Minor" },
      { code: "A48 + A48", name: "Contact avec la tête", severity: "Minor + Minor" },
      { code: "A25", name: "Double échec", severity: "Minor" },
      { code: "A53", name: "Faire trébucher", severity: "Minor" },
      { code: "A47", name: "Rudesse", severity: "Minor" }
    ],
    DEFAULT: [
      { code: "A48", name: "Contact avec la tête", severity: "Minor" },
      { code: "A48 + A48", name: "Contact avec la tête", severity: "Minor + Minor" },
      { code: "A22", name: "Coup de bâton", severity: "Minor" },
      { code: "A53", name: "Faire trébucher", severity: "Minor" },
      { code: "A56", name: "Obstruction", severity: "Minor" },
      { code: "A47", name: "Rudesse", severity: "Minor" }
    ]
  };

  const getQuickAccessPenalties = (category, calibre) => {
    let catKey = "DEFAULT";
    if (category) {
      const upper = String(category).toUpperCase().replace(/\s+/g, "");
      if (upper.includes("M11") || upper.includes("U11") || upper.includes("ATOME")) catKey = "M11";
      else if (upper.includes("M13") || upper.includes("U13") || upper.includes("PEEWEE") || upper.includes("PIEWEE")) catKey = "M13";
      else if (upper.includes("M15") || upper.includes("U15") || upper.includes("BANTAM")) catKey = "M15";
      else if (upper.includes("M17") || upper.includes("U17")) catKey = "M17";
      else if (upper.includes("M18") || upper.includes("U18") || upper.includes("MIDGET")) catKey = "M18";
      else if (upper.includes("M21") || upper.includes("JUNIOR")) catKey = "M18";
    }
    const list = QUICK_ACCESS_BY_CATEGORY[catKey] || QUICK_ACCESS_BY_CATEGORY.DEFAULT;
    return [...list];
  };

  const setPenaltyQuickAccess = () => getQuickAccessPenalties();
  const togglePenaltyQuickAccess = () => getQuickAccessPenalties();
  const saveFavoritePenalties = () => {};

  const isFavoritePenalty = (code) => {
    if (!code) return false;
    const norm = String(code).replace(/\s+/g, "").toUpperCase();
    return FREQUENT_PENALTIES.some((f) => String(f.code).replace(/\s+/g, "").toUpperCase() === norm);
  };

  const addFavoritePenalty = () => getFrequentPenalties();
  const reorderFavoritePenalties = () => getFrequentPenalties();
  const removeFavoritePenalty = () => getFrequentPenalties();

  const resolveQuickPenaltySelection = (meta, code, favOverride) => {
    if (!meta || !code) return { rule: null, option: null, error: "PARAM_MISSING" };
    const rules = meta.rules || [];
    const options = meta.options || [];

    const norm = String(code).replace(/\s+/g, "").toUpperCase();
    const stripped = norm.replace(/^A/, "");
    const codeParts = String(code).split("+").map((s) => s.trim().toUpperCase());
    const baseNorm = codeParts[0].replace(/\s+/g, "");
    const baseStripped = baseNorm.replace(/^A/, "");

    const pickBestRule = (candidates) => {
      if (!candidates || candidates.length === 0) return null;
      if (candidates.length === 1) return candidates[0];

      if (baseStripped === "61") {
        const abuseRule = candidates.find((r) => {
          const n = String(r.name || "").toUpperCase();
          return n.includes("ABUS") || n.includes("VERBAL");
        });
        if (abuseRule) return abuseRule;

        const unsportRule = candidates.find((r) => {
          const n = String(r.name || "").toUpperCase();
          return (n.includes("UNSPORTSMAN") || n.includes("ANTISPORT")) && !n.includes("MANIFESTATION");
        });
        if (unsportRule) return unsportRule;
      }

      if (favOverride && favOverride.name) {
        const reqUpper = String(favOverride.name).toUpperCase();
        const exact = candidates.find((r) => String(r.name || "").toUpperCase() === reqUpper);
        if (exact) return exact;
        const partial = candidates.find((r) => {
          const rn = String(r.name || "").toUpperCase();
          return rn.includes(reqUpper) || reqUpper.includes(rn);
        });
        if (partial) return partial;
      }

      return candidates[0];
    };

    // 1. Trouver la règle officielle
    const codeMatchedRules = rules.filter((r) => {
      const rCode = String(r.code || r.ruleCode || "").replace(/\s+/g, "").toUpperCase();
      return rCode === norm || rCode === stripped || rCode === baseNorm || rCode === baseStripped || rCode.replace(/^A/, "") === baseStripped;
    });
    let matchedRule = pickBestRule(codeMatchedRules);

    // Si aucune règle trouvée par code direct, vérifier les options correspondant exactement au code demandé
    if (!matchedRule && options && options.length > 0) {
      const matchingOpts = options.filter((o) => {
        const optCode = String(o.code || (o.codes && o.codes.join(" + ")) || "").replace(/\s+/g, "").toUpperCase();
        return optCode === norm;
      });
      const optRules = [];
      matchingOpts.forEach((o) => {
        if (o.ruleId != null) {
          const r = rules.find((rule) => rule.id === o.ruleId);
          if (r && !optRules.includes(r)) optRules.push(r);
        }
      });
      matchedRule = pickBestRule(optRules);
    }

    if (!matchedRule) {
      matchedRule = rules.find((r) => {
        const rName = String(r.name || "").toUpperCase();
        if ((baseStripped === "48" || stripped === "48") && (rName.includes("HEAD") || rName.includes("TÊTE"))) return true;
        if (baseStripped === "22" && rName.includes("SLASH")) return true;
        if (baseStripped === "26" && rName.includes("HIGH")) return true;
        if (baseStripped === "53" && rName.includes("TRIP")) return true;
        if (baseStripped === "39" && (rName.includes("BODY") || rName.includes("CHECK"))) return true;
        if (baseStripped === "52" && rName.includes("HOOK")) return true;
        if (baseStripped === "47" && rName.includes("ROUGH")) return true;
        if (baseStripped === "80" && (rName.includes("TOO MANY") || rName.includes("TROP"))) return true;
        if (baseStripped === "25" && rName.includes("CROSS")) return true;
        if (baseStripped === "50" && rName.includes("HOLD")) return true;
        if (baseStripped === "56" && (rName.includes("INTERFERENCE") || rName.includes("OBSTRUCTION"))) return true;
        if (baseStripped === "44" && (rName.includes("BOARD") || rName.includes("BANDE"))) return true;
        if (baseStripped === "61") {
          if (rName.includes("ABUS") || rName.includes("VERBAL")) return true;
          if (rName.includes("UNSPORTSMAN") || rName.includes("ANTISPORT")) {
            const hasAbuseRule = rules.some((rule) => {
              const n = String(rule.name || "").toUpperCase();
              return n.includes("ABUS") || n.includes("VERBAL");
            });
            if (!hasAbuseRule) return true;
          }
        }
        return false;
      });
    }

    if (!matchedRule) {
      return { rule: null, option: null, error: "RULE_NOT_FOUND" };
    }

    // 2. Trouver les options associées à cette règle (triées par ordre croissant)
    const ruleOptions = options.filter((o) => o.ruleId === matchedRule.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // 3. Identifier l'item fréquent correspondant pour connaître la sévérité demandée
    let fav = favOverride;
    if (!fav && typeof getFrequentPenalties === "function") {
      const freqs = getFrequentPenalties();
      fav = freqs.find((f) => String(f.code).replace(/\s+/g, "").toUpperCase() === norm);
    }

    let targetOption = null;
    const reqSeverity = (fav && fav.severity) || "";
    const isDoubleMinor = norm.includes("+") || reqSeverity.toLowerCase().includes("double") || reqSeverity.toLowerCase().includes("minor + minor");
    const isSingleMinor = !isDoubleMinor && (norm.startsWith("A") || !reqSeverity || reqSeverity.toLowerCase() === "minor" || reqSeverity.toLowerCase() === "mineure");

    if (isDoubleMinor) {
      // Correspondance pour double mineure (ex: A48 + A48)
      targetOption = ruleOptions.find((o) => {
        const optCode = String(o.code || (o.codes && o.codes.join(" + ")) || "").replace(/\s+/g, "").toUpperCase();
        if (optCode === norm) return true;
        const name = (o.name || "").toLowerCase();
        return name.includes("minor + minor") || name.includes("mineure + mineure") || name.includes("double");
      });
      if (!targetOption) {
        targetOption = ruleOptions.find((o) => {
          const name = (o.name || "").toLowerCase();
          return o.members && o.members.length === 2 && !name.includes("major") && !name.includes("misconduct");
        });
      }
    } else if (isSingleMinor) {
      // Correspondance pour pénalité mineure simple (A52, A22, A53, etc.) :
      // INTERDICTION ABSOLUE de sélectionner une option Major ou Game Misconduct !
      // 1. Nom exact ou contenant "minor" / "mineure" sans mention de major ni misconduct
      targetOption = ruleOptions.find((o) => {
        const name = (o.name || "").toLowerCase();
        return (name === "minor" || name === "mineure") ||
               ((name.includes("minor") || name.includes("mineur")) && !name.includes("+") && !name.includes("major") && !name.includes("misconduct") && !name.includes("match"));
      });

      // 2. Order === 1 sans mention de Major ni Misconduct
      if (!targetOption) {
        targetOption = ruleOptions.find((o) => {
          const name = (o.name || "").toLowerCase();
          return o.order === 1 && !name.includes("major") && !name.includes("misconduct") && !name.includes("match");
        });
      }

      // 3. Option à 1 seul membre sans mention de Major ni Misconduct
      if (!targetOption) {
        targetOption = ruleOptions.find((o) => {
          const name = (o.name || "").toLowerCase();
          return o.members && o.members.length === 1 && !name.includes("major") && !name.includes("misconduct") && !name.includes("match");
        });
      }

      // 4. Option sans mention de Major ni Misconduct
      if (!targetOption) {
        targetOption = ruleOptions.find((o) => {
          const name = (o.name || "").toLowerCase();
          return !name.includes("major") && !name.includes("misconduct") && !name.includes("match");
        });
      }
    } else {
      // Autre sévérité explicite (Major, Misconduct, etc.)
      if (reqSeverity) {
        targetOption = ruleOptions.find((o) => o.name && o.name.toLowerCase() === reqSeverity.toLowerCase());
      }
      if (!targetOption && ruleOptions.length > 0) {
        targetOption = ruleOptions.find((o) => {
          const name = (o.name || "").toLowerCase();
          return !name.includes("major") && !name.includes("misconduct") && !name.includes("match");
        }) || ruleOptions[0];
      }
    }

    if (!targetOption) {
      return { rule: matchedRule, option: null, error: "OPTION_NOT_FOUND" };
    }

    // S'assurer que l'option a des members valides
    if (!targetOption.members || !Array.isArray(targetOption.members) || targetOption.members.length === 0) {
      targetOption.members = [{ order: 1 }];
    }

    return { rule: matchedRule, option: targetOption, error: null };
  };

  const isDoubleMinor = (s) => {
    if (!s) return false;
    const str = String(s).toUpperCase();
    return str.includes("+") || str.includes("DOUBLE") || str.includes("4 MIN");
  };

  const matchesSelectedInfraction = (pen, selectedRef) => {
    if (!pen || !selectedRef) return false;
    const penCodeNorm = String(pen.code || pen).replace(/\s+/g, "").toUpperCase();
    const refCodeNorm = String(selectedRef.code || selectedRef).replace(/\s+/g, "").toUpperCase();
    const penIsDouble = penCodeNorm.includes("+") || isDoubleMinor(pen.severity);
    const refIsDouble = refCodeNorm.includes("+") || isDoubleMinor(selectedRef.severity || selectedRef);

    // Règle stricte d'indépendance A48 vs A48+A48 :
    // Si l'une est double mineure et l'autre est simple, elles ne peuvent JAMAIS matcher ensemble.
    if (penIsDouble !== refIsDouble) return false;

    if (penIsDouble && refIsDouble) {
      const penParts = penCodeNorm.split("+").map((p) => p.replace(/^A/, "").trim());
      const refParts = refCodeNorm.split("+").map((p) => p.replace(/^A/, "").trim());
      if (penParts.length === refParts.length && penParts.every((val, i) => val === refParts[i])) {
        return true;
      }
      const num = penParts[0];
      if (num && refCodeNorm.includes(num)) {
        return true;
      }
      return false;
    }

    const penStripped = penCodeNorm.replace(/^A/, "");
    const refStripped = refCodeNorm.replace(/^A/, "");
    if (penCodeNorm === refCodeNorm || penStripped === refStripped || penCodeNorm === refStripped || penStripped === refCodeNorm) {
      return true;
    }

    const numRegex = new RegExp("(?:^|[^0-9])" + penStripped + "(?:[^0-9]|$)");
    if (penStripped.length >= 1 && numRegex.test(refCodeNorm)) {
      return true;
    }

    if (pen.name && refCodeNorm.includes(pen.name.toUpperCase())) {
      return true;
    }

    return false;
  };

  // =========================================================================
  // 7. EXPORT DU MODULE
  // =========================================================================

  return {
    SEVERITY_TYPES,
    INFRACTIONS,
    FREQUENT_PENALTIES,
    DEFAULT_FAVORITE_PENALTIES,
    parsePenaltyCode,
    resolvePenaltyCombination,
    formatGoal,
    formatPenalty,
    formatGoalieChange,
    formatWelcomeMessage,
    convertCategoryToQuebec,
    getInfractionNameByCode,
    getFrequentPenalties,
    getFavoritePenalties,
    saveFavoritePenalties,
    getQuickAccessPenalties,
    setPenaltyQuickAccess,
    togglePenaltyQuickAccess,
    isFavoritePenalty,
    addFavoritePenalty,
    removeFavoritePenalty,
    sortFavoritesAlphabetically,
    reorderFavoritePenalties,
    resolveQuickPenaltySelection,
    matchesSelectedInfraction,
    utils: {
      clean,
      titleCase,
      escapeHtml,
      getOrdinalMasc,
      formatPeriodTime,
      formatPenaltyShotAction,
      isCoachMember,
      getGreetingForHour,
      phonetizeCategory
    }
  };
});


  // Pont page-bridge
  const SA_IS_USERSCRIPT = true;
  const SA_PAGE_BRIDGE_SOURCE = "(function () {\n  \"use strict\";\n\n  if (window.__saPageBridgeLoaded) return;\n  window.__saPageBridgeLoaded = true;\n\n  // Debug output is off in production. Turn it on by opening any Spordle page with ?sa_debug=1 (persists,\n  // ?sa_debug=0 turns it off). The content script stores it and sets data-sa-debug on <html> before injecting\n  // this bridge. Spordle wipes localStorage on reload, so localStorage only works until the next reload.\n  var SA_DEBUG = (function () {\n    try {\n      if (document.documentElement.dataset.saDebug === \"true\") return true;\n      return localStorage.getItem(\"sa_debug\") === \"true\";\n    } catch (_) { return false; }\n  })();\n  function debugLog() { if (SA_DEBUG) console.log.apply(console, arguments); }\n  function debugWarn() { if (SA_DEBUG) console.warn.apply(console, arguments); }\n\n  // Capability check for the content script. The marker proves this script ran in the page (an inline\n  // script blocked by CSP never sets it). The probe answers synchronously through the shared DOM whether\n  // Spordle's AngularJS internals the selection relies on are still reachable.\n  document.documentElement.dataset.saBridge = \"loaded\";\n  window.addEventListener(\"sa:bridge-probe\", function (evt) {\n    var probeId = typeof evt.detail === \"string\" ? evt.detail : \"\";\n    var status = \"ok\";\n    try {\n      if (!window.angular || typeof window.angular.element !== \"function\") {\n        status = \"no-angular\";\n      } else {\n        var modal = document.querySelector(\"hi-add-penalty\");\n        if (modal) {\n          var scope = window.angular.element(modal).scope();\n          var ctrl = scope ? (scope.$ctrl || window.angular.element(modal).controller(\"hiAddPenalty\")) : null;\n          if (!scope) status = \"no-scope\";\n          else if (!ctrl || !ctrl.manager || !ctrl.manager.meta) status = \"no-manager\";\n        }\n      }\n    } catch (_) {\n      status = \"error\";\n    }\n    document.documentElement.dataset.saBridgeProbe = probeId + \":\" + status;\n  });\n\n  // Exploration récursive pour trouver l'option de règle dans le PenaltyManager de Spordle\n  function findRuleOptionDeep(obj, norm, stripped, depth, seen) {\n    if (!obj || depth > 5) return null;\n    seen = seen || new Set();\n    if (seen.has(obj)) return null;\n    seen.add(obj);\n\n    if (Array.isArray(obj)) {\n      for (var i = 0; i < obj.length; i++) {\n        var item = obj[i];\n        if (!item || typeof item !== \"object\") continue;\n        var itemCode = String(item.code || (item.codes && item.codes.join(\" + \")) || item.ruleCode || \"\").replace(/\\s+/g, \"\").toUpperCase();\n        if (itemCode && (itemCode === norm || itemCode === stripped || itemCode.replace(/^A/, \"\") === stripped)) {\n          return item;\n        }\n        var found = findRuleOptionDeep(item, norm, stripped, depth + 1, seen);\n        if (found) return found;\n      }\n    } else if (typeof obj === \"object\") {\n      for (var k in obj) {\n        if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;\n        if (k.startsWith(\"$\") || k === \"parent\" || k === \"document\" || k === \"window\") continue;\n        try {\n          var res = findRuleOptionDeep(obj[k], norm, stripped, depth + 1, seen);\n          if (res) return res;\n        } catch (_) {}\n      }\n    }\n    return null;\n  }\n\n  // Protection préventive du prototype de PenaltySummaryCtrl contre le bug de Spordle (absence de null-check sur infractionType)\n  function securePenaltySummaryPrototype() {\n    if (!window.angular) return false;\n    try {\n      var rootEl = document.querySelector(\".modal-add-penalty\") || document.body;\n      var injector = window.angular.element(rootEl).injector();\n      if (!injector || !injector.has(\"hiPenaltySummaryDirective\")) return false;\n\n      var ddos = injector.get(\"hiPenaltySummaryDirective\");\n      for (var d = 0; d < ddos.length; d++) {\n        var Ctrl = ddos[d] && ddos[d].controller;\n        if (Ctrl && Ctrl.prototype && !Ctrl.prototype.__saOriginalGetInfractionLabel) {\n          Ctrl.prototype.__saOriginalGetInfractionLabel = Ctrl.prototype.getInfractionLabel;\n          Ctrl.prototype.getInfractionLabel = function () {\n            try {\n              var res = this.__saOriginalGetInfractionLabel ? this.__saOriginalGetInfractionLabel.apply(this, arguments) : null;\n              if (res) return res;\n            } catch (err) {\n              // Secours gracieux : intercepte le crash de Spordle et génère le libellé officiel\n            }\n            if (this.penalty) {\n              var p = this.penalty;\n              var code = p.code || (p.rule && p.rule.code) || (p.option && p.option.code) || \"\";\n              var name = (p.rule && p.rule.name) || (p.option && p.option.name) || (p.infraction && p.infraction.name) || \"\";\n              return (code && name) ? (code + \" - \" + name) : (name || code || \"Infraction\");\n            }\n            return \"\";\n          };\n          debugLog(\"🛡️ [Spordle Annonceur Bridge] hiPenaltySummary.getInfractionLabel sécurisé contre les erreurs de Spordle !\");\n          return true;\n        }\n      }\n    } catch (_) {}\n    return false;\n  }\n\n  // Tenter la sécurisation dès que possible\n  securePenaltySummaryPrototype();\n  window.addEventListener(\"DOMContentLoaded\", securePenaltySummaryPrototype);\n\n  // Synchronisation de l'infraction en cours d'édition depuis le modèle officiel de Spordle\n  function syncActiveModalPenaltyCode() {\n    var modal = document.querySelector(\"hi-add-penalty\");\n    if (!modal || !window.angular) return null;\n    try {\n      var scope = window.angular.element(modal).scope();\n      var ctrl = scope ? (scope.$ctrl || window.angular.element(modal).controller(\"hiAddPenalty\")) : null;\n      if (!ctrl) return null;\n\n      var code = null;\n      var manager = ctrl.manager;\n      if (manager) {\n        if (manager.rule && manager.rule.code) {\n          code = \"A\" + String(manager.rule.code).replace(/^A/, \"\");\n          if (manager.option && manager.option.name && (manager.option.name.includes(\"+\") || manager.option.name.toLowerCase().includes(\"double\"))) {\n            code = code + \" + \" + code;\n          }\n        } else if (manager.option && manager.option.code) {\n          code = manager.option.code;\n        }\n      }\n\n      if (!code && ctrl.penalties && ctrl.penalties.length) {\n        var p0 = ctrl.penalties[0];\n        var c0 = p0 && (p0.code || (p0.rule && p0.rule.code) || (p0.option && p0.option.code));\n        if (c0) {\n          code = \"A\" + String(c0).replace(/^A/, \"\");\n          if (ctrl.penalties.length >= 2) {\n            code = code + \" + \" + code;\n          }\n        }\n      }\n\n      if (code) {\n        modal.dataset.saSelectedCode = code;\n        document.body.dataset.saActiveModalPenaltyCode = code;\n        return code;\n      }\n    } catch (_) {}\n    return null;\n  }\n\n  setInterval(function() {\n    if (document.querySelector(\"hi-add-penalty\")) {\n      syncActiveModalPenaltyCode();\n    }\n  }, 250);\n\n  // Diagnostic et découverte automatique du workflow natif de sélection de Spordle\n  window.saDiscoverNativePenaltyFlow = function () {\n    if (!window.angular) return;\n    try {\n      var modal = document.querySelector(\"hi-add-penalty\");\n      if (!modal) return;\n      var scope = window.angular.element(modal).scope();\n      var ctrl = scope ? (scope.$ctrl || window.angular.element(modal).controller(\"hiAddPenalty\")) : null;\n      var injector = window.angular.element(modal).injector();\n      var $templateCache = injector.get(\"$templateCache\");\n\n      console.group(\"🧭 [Spordle Native Flow Discovery]\");\n      console.log(\"Ctrl methods:\", Object.getOwnPropertyNames(Object.getPrototypeOf(ctrl || {})));\n      if (ctrl && ctrl.manager) {\n        console.log(\"Manager methods:\", Object.getOwnPropertyNames(Object.getPrototypeOf(ctrl.manager)));\n      }\n\n      // Chercher les templates liés aux pénalités\n      // Dans Angular $templateCache.info() donne le nombre, et on peut itérer ou chercher des clés courantes\n      [\"add-penalty\", \"penalty\", \"infraction\", \"summary\"].forEach(function (term) {\n        try {\n          // Si $templateCache a des clés\n          if (typeof $templateCache.get === \"function\") {\n            // Chercher des URL courantes\n            var urls = [\n              \"views/add-penalty.html\",\n              \"views/penalty-summary.html\",\n              \"views/infraction-select.html\",\n              \"components/hi-add-penalty/hi-add-penalty.html\",\n              \"components/hi-add-penalty-summary/hi-add-penalty-summary.html\",\n              \"components/hi-add-penalty-infraction/hi-add-penalty-infraction.html\"\n            ];\n            urls.forEach(function (u) {\n              var t = $templateCache.get(u);\n              if (t) console.log(\"Found template:\", u, t.substring(0, 300));\n            });\n          }\n        } catch (_) {}\n      });\n\n      console.groupEnd();\n    } catch (e) {\n      console.warn(\"Discovery err:\", e);\n    }\n  };\n\n  // Exécuter la découverte dès qu'on inspecte ou tente une sélection\n  if (SA_DEBUG) {\n    window.addEventListener(\"sa:select-and-next-penalty\", function () {\n      window.saDiscoverNativePenaltyFlow();\n    });\n  }\n  window.saInspectPenalty = function () {\n    var modal = document.querySelector(\"hi-add-penalty\");\n    var summary = document.querySelector(\"hi-add-penalty-summary\");\n    var section = document.querySelector(\"section[ng-click*='infractionSelect']\");\n\n    console.group(\"🔍 [Spordle Annonceur] Diagnostic Modal Pénalité\");\n    console.log(\"Modal Element:\", modal);\n    console.log(\"Summary Element:\", summary);\n    console.log(\"Section Element:\", section);\n\n    if (window.angular) {\n      if (modal) {\n        var modalScope = window.angular.element(modal).scope();\n        var modalCtrl = modalScope ? (modalScope.$ctrl || window.angular.element(modal).controller(\"hiAddPenalty\")) : null;\n        console.log(\"Modal Scope:\", modalScope);\n        console.log(\"Modal $ctrl:\", modalCtrl);\n        if (modalCtrl) {\n          console.log(\"Modal $ctrl.manager:\", modalCtrl.manager);\n          console.log(\"Modal $ctrl.penalties:\", modalCtrl.penalties);\n        }\n      }\n      if (summary) {\n        var summaryScope = window.angular.element(summary).scope();\n        var summaryCtrl = summaryScope ? (summaryScope.$ctrl || window.angular.element(summary).controller(\"hiAddPenaltySummary\")) : null;\n        console.log(\"Summary Scope:\", summaryScope);\n        console.log(\"Summary $ctrl:\", summaryCtrl);\n        if (summaryCtrl) {\n          console.log(\"Summary $ctrl.penalties:\", summaryCtrl.penalties);\n        }\n      }\n    } else {\n      console.warn(\"window.angular n'est pas encore disponible dans le contexte de la page.\");\n    }\n    console.groupEnd();\n  };\n\n  // Résolution stricte et déterministe de la règle et de l'option officielle dans Spordle\n  function resolveRuleAndOption(meta, code, reqSeverity, reqName) {\n    if (!meta || !code) return { rule: null, option: null };\n    var rules = meta.rules || [];\n    var options = meta.options || [];\n\n    var norm = String(code).replace(/\\s+/g, \"\").toUpperCase();\n    var stripped = norm.replace(/^A/, \"\");\n    var codeParts = String(code).split(\"+\").map(function (s) { return s.trim().toUpperCase(); });\n    var baseNorm = codeParts[0].replace(/\\s+/g, \"\");\n    var baseStripped = baseNorm.replace(/^A/, \"\");\n\n    function pickBestRule(candidates) {\n      if (!candidates || candidates.length === 0) return null;\n      if (candidates.length === 1) return candidates[0];\n\n      if (baseStripped === \"61\") {\n        var abuseRule = candidates.find(function (r) {\n          var n = String(r.name || \"\").toUpperCase();\n          return n.includes(\"ABUS\") || n.includes(\"VERBAL\");\n        });\n        if (abuseRule) return abuseRule;\n\n        var unsportRule = candidates.find(function (r) {\n          var n = String(r.name || \"\").toUpperCase();\n          return (n.includes(\"UNSPORTSMAN\") || n.includes(\"ANTISPORT\")) && !n.includes(\"MANIFESTATION\");\n        });\n        if (unsportRule) return unsportRule;\n      }\n\n      if (reqName) {\n        var reqUpper = String(reqName).toUpperCase();\n        var exact = candidates.find(function (r) {\n          return String(r.name || \"\").toUpperCase() === reqUpper;\n        });\n        if (exact) return exact;\n        var partial = candidates.find(function (r) {\n          var rn = String(r.name || \"\").toUpperCase();\n          return rn.includes(reqUpper) || reqUpper.includes(rn);\n        });\n        if (partial) return partial;\n      }\n\n      return candidates[0];\n    }\n\n    // 1. Trouver la règle officielle\n    var codeMatchedRules = rules.filter(function (r) {\n      var rCode = String(r.code || r.ruleCode || \"\").replace(/\\s+/g, \"\").toUpperCase();\n      return rCode === norm || rCode === stripped || rCode === baseNorm || rCode === baseStripped || rCode.replace(/^A/, \"\") === baseStripped;\n    });\n    var matchedRule = pickBestRule(codeMatchedRules);\n\n    // Si aucune règle trouvée par code direct, vérifier les options correspondant exactement au code demandé\n    if (!matchedRule && options && options.length > 0) {\n      var matchingOpts = options.filter(function (o) {\n        var optCode = String(o.code || (o.codes && o.codes.join(\" + \")) || \"\").replace(/\\s+/g, \"\").toUpperCase();\n        return optCode === norm;\n      });\n      var optRules = [];\n      for (var oi = 0; oi < matchingOpts.length; oi++) {\n        var o = matchingOpts[oi];\n        if (o.ruleId != null) {\n          var foundR = rules.find(function (r) { return r.id === o.ruleId; });\n          if (foundR && optRules.indexOf(foundR) === -1) optRules.push(foundR);\n        }\n      }\n      matchedRule = pickBestRule(optRules);\n    }\n\n    if (!matchedRule) {\n      matchedRule = rules.find(function (r) {\n        var rName = String(r.name || \"\").toUpperCase();\n        if ((baseStripped === \"48\" || stripped === \"48\") && (rName.includes(\"HEAD\") || rName.includes(\"TÊTE\"))) return true;\n        if (baseStripped === \"22\" && rName.includes(\"SLASH\")) return true;\n        if (baseStripped === \"26\" && rName.includes(\"HIGH\")) return true;\n        if (baseStripped === \"53\" && rName.includes(\"TRIP\")) return true;\n        if (baseStripped === \"39\" && (rName.includes(\"BODY\") || rName.includes(\"CHECK\"))) return true;\n        if (baseStripped === \"52\" && rName.includes(\"HOOK\")) return true;\n        if (baseStripped === \"47\" && rName.includes(\"ROUGH\")) return true;\n        if (baseStripped === \"80\" && (rName.includes(\"TOO MANY\") || rName.includes(\"TROP\"))) return true;\n        if (baseStripped === \"25\" && rName.includes(\"CROSS\")) return true;\n        if (baseStripped === \"50\" && rName.includes(\"HOLD\")) return true;\n        if (baseStripped === \"56\" && (rName.includes(\"INTERFERENCE\") || rName.includes(\"OBSTRUCTION\"))) return true;\n        if (baseStripped === \"44\" && (rName.includes(\"BOARD\") || rName.includes(\"BANDE\"))) return true;\n        if (baseStripped === \"61\") {\n          if (rName.includes(\"ABUS\") || rName.includes(\"VERBAL\")) return true;\n          if (rName.includes(\"UNSPORTSMAN\") || rName.includes(\"ANTISPORT\")) {\n            var hasAbuseRule = rules.some(function (rule) {\n              var n = String(rule.name || \"\").toUpperCase();\n              return n.includes(\"ABUS\") || n.includes(\"VERBAL\");\n            });\n            if (!hasAbuseRule) return true;\n          }\n        }\n        return false;\n      });\n    }\n\n    if (!matchedRule) {\n      return { rule: null, option: null };\n    }\n\n    // 2. Options associées à cette règle (triées par order croissant)\n    var ruleOptions = options.filter(function (o) { return o.ruleId === matchedRule.id; })\n      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });\n\n    var targetOption = null;\n    var sev = (reqSeverity || \"\").toLowerCase();\n    var isDoubleMinor = norm.includes(\"+\") || sev.includes(\"double\") || sev.includes(\"minor + minor\");\n    var isSingleMinor = !isDoubleMinor && (norm.startsWith(\"A\") || !sev || sev === \"minor\" || sev === \"mineure\");\n\n    if (isDoubleMinor) {\n      // Pour une double mineure (ex: A48 + A48)\n      targetOption = ruleOptions.find(function (o) {\n        var optCode = String(o.code || (o.codes && o.codes.join(\" + \")) || \"\").replace(/\\s+/g, \"\").toUpperCase();\n        if (optCode === norm) return true;\n        var name = (o.name || \"\").toLowerCase();\n        return name.includes(\"minor + minor\") || name.includes(\"mineure + mineure\") || name.includes(\"double\");\n      });\n      if (!targetOption) {\n        targetOption = ruleOptions.find(function (o) {\n          var name = (o.name || \"\").toLowerCase();\n          return o.members && o.members.length === 2 && !name.includes(\"major\") && !name.includes(\"misconduct\");\n        });\n      }\n    } else if (isSingleMinor) {\n      // Pour une pénalité mineure simple (A22, A52, A53, etc.) :\n      // INTERDICTION ABSOLUE de sélectionner une option Major ou Game Misconduct !\n      // 1. Nom exact ou contenant \"minor\" / \"mineure\" sans mention de major ni misconduct\n      targetOption = ruleOptions.find(function (o) {\n        var name = (o.name || \"\").toLowerCase();\n        return (name === \"minor\" || name === \"mineure\") ||\n               ((name.includes(\"minor\") || name.includes(\"mineur\")) && !name.includes(\"+\") && !name.includes(\"major\") && !name.includes(\"misconduct\") && !name.includes(\"match\"));\n      });\n\n      // 2. Order === 1 sans mention de Major ni Misconduct\n      if (!targetOption) {\n        targetOption = ruleOptions.find(function (o) {\n          var name = (o.name || \"\").toLowerCase();\n          return o.order === 1 && !name.includes(\"major\") && !name.includes(\"misconduct\") && !name.includes(\"match\");\n        });\n      }\n\n      // 3. Option à 1 seul membre sans mention de Major ni Misconduct\n      if (!targetOption) {\n        targetOption = ruleOptions.find(function (o) {\n          var name = (o.name || \"\").toLowerCase();\n          return o.members && o.members.length === 1 && !name.includes(\"major\") && !name.includes(\"misconduct\") && !name.includes(\"match\");\n        });\n      }\n\n      // 4. Option sans mention de Major ni Misconduct\n      if (!targetOption) {\n        targetOption = ruleOptions.find(function (o) {\n          var name = (o.name || \"\").toLowerCase();\n          return !name.includes(\"major\") && !name.includes(\"misconduct\") && !name.includes(\"match\");\n        });\n      }\n    } else {\n      if (sev) {\n        targetOption = ruleOptions.find(function (o) { return o.name && o.name.toLowerCase() === sev; });\n      }\n      if (!targetOption && ruleOptions.length > 0) {\n        targetOption = ruleOptions.find(function (o) {\n          var name = (o.name || \"\").toLowerCase();\n          return !name.includes(\"major\") && !name.includes(\"misconduct\") && !name.includes(\"match\");\n        }) || ruleOptions[0];\n      }\n    }\n\n    if (!targetOption) {\n      return { rule: matchedRule, option: null };\n    }\n\n    if (!targetOption.members || !Array.isArray(targetOption.members) || targetOption.members.length === 0) {\n      targetOption.members = [{ order: 1 }];\n    }\n\n    return { rule: matchedRule, option: targetOption };\n  }\n\n  // Recherche déterministe d'un bouton d'infraction natif de l'onglet By code\n  function findNativeOptionInPage(code, targetOption, matchedRule) {\n    if (!code) return null;\n    var normTarget = String(code).replace(/\\s+/g, \"\").toUpperCase();\n    var isDouble = normTarget.includes(\"+\");\n    var allButtons = document.querySelectorAll(\".option-code-list .button-duration, .penalty-infraction-view .button-duration\");\n    var matches = [];\n\n    for (var i = 0; i < allButtons.length; i++) {\n      var btn = allButtons[i];\n      if (btn.classList.contains(\"sa-fav-card\") || btn.classList.contains(\"sa-frequent-card\") || (btn.closest && btn.closest(\".sa-frequents-code-list\"))) continue;\n\n      var h6s = btn.querySelectorAll(\"h6\");\n      var btnCode = \"\";\n      if (h6s.length >= 2) {\n        btnCode = (h6s[1].textContent || \"\").replace(/\\s+/g, \"\").toUpperCase();\n      } else {\n        btnCode = (btn.textContent || \"\").replace(/\\s+/g, \"\").toUpperCase();\n      }\n\n      var btnIsDouble = btnCode.includes(\"+\");\n      if (isDouble !== btnIsDouble) continue;\n\n      if (btnCode === normTarget) matches.push(btn);\n    }\n\n    if (matches.length === 0) {\n      var strippedTarget = normTarget.replace(/A/g, \"\");\n      for (var j = 0; j < allButtons.length; j++) {\n        var b = allButtons[j];\n        if (b.classList.contains(\"sa-fav-card\") || b.classList.contains(\"sa-frequent-card\") || (b.closest && b.closest(\".sa-frequents-code-list\"))) continue;\n        var h = b.querySelectorAll(\"h6\");\n        var rawCode = (h[1] ? h[1].textContent : b.textContent || \"\").replace(/\\s+/g, \"\").toUpperCase();\n        var bDouble = rawCode.includes(\"+\");\n        if (isDouble !== bDouble) continue;\n\n        var strippedBtn = rawCode.replace(/A/g, \"\");\n        if (strippedBtn === strippedTarget) matches.push(b);\n      }\n    }\n\n    if (matches.length === 0) return null;\n    if (matches.length === 1 && !targetOption && !matchedRule) return matches[0];\n\n    if (window.angular && (targetOption || matchedRule)) {\n      for (var k = 0; k < matches.length; k++) {\n        try {\n          var bScope = window.angular.element(matches[k]).scope();\n          var scopeOpt = bScope && (bScope.option || bScope.opt || bScope.item || bScope.ruleOption);\n          if (scopeOpt) {\n            if (targetOption && targetOption.id != null && scopeOpt.id === targetOption.id) {\n              return matches[k];\n            }\n            if (matchedRule && matchedRule.id != null && scopeOpt.ruleId === matchedRule.id) {\n              return matches[k];\n            }\n          }\n        } catch (_) {}\n      }\n      if (matches.length > 1) return null;\n    }\n\n    return matches[0];\n  }\n\n  // Fonction de test globale pour appliquer un code directement\n  window.saSelectQuick = function (code, severity) {\n    window.dispatchEvent(new CustomEvent(\"sa:select-and-next-penalty\", { detail: { code: code, severity: severity } }));\n  };\n\n  window.addEventListener(\"sa:select-and-next-penalty\", function (evt) {\n    // The content script sends the detail as a JSON string (object details do not cross worlds reliably).\n    var detail = evt.detail;\n    if (typeof detail === \"string\") {\n      try { detail = JSON.parse(detail); } catch (_) { detail = null; }\n    }\n    var e = { detail: detail };\n    var code = e.detail && e.detail.code;\n    var reqName = e.detail && e.detail.name;\n    var reqSeverity = e.detail && e.detail.severity;\n    var requestId = e.detail && e.detail.requestId;\n    // Synchronous ack through the shared DOM: lets the content script (isolated world)\n    // skip its native-click fallback when the bridge already applied the selection.\n    function ack(status) {\n      if (requestId) document.documentElement.dataset.saBridgeAck = requestId + \":\" + status;\n    }\n    if (!code) return;\n    var norm = String(code).replace(/\\s+/g, \"\").toUpperCase();\n    var stripped = norm.replace(/^A/, \"\");\n\n    // Extraire le code de base pour les pénalités combinées (ex: \"A48 + A48\" -> \"A48\", \"48\")\n    var codeParts = String(code).split(\"+\").map(function(s) { return s.trim().toUpperCase(); });\n    var baseNorm = codeParts[0].replace(/\\s+/g, \"\");\n    var baseStripped = baseNorm.replace(/^A/, \"\");\n\n    debugLog(\"⚡ [Spordle Annonceur Bridge] Activation native de la pénalité rapide:\", code, \"(norm:\", norm, \"baseNorm:\", baseNorm, \"sev:\", reqSeverity || \"auto\", \")\");\n\n    try {\n      var modal = document.querySelector(\"hi-add-penalty\");\n      if (!modal || !window.angular) {\n        debugWarn(\"[Spordle Annonceur Bridge] Modal hi-add-penalty ou window.angular introuvable.\");\n        return;\n      }\n\n      var scope = window.angular.element(modal).scope();\n      var ctrl = scope ? (scope.$ctrl || window.angular.element(modal).controller(\"hiAddPenalty\")) : null;\n\n      if (!ctrl || !ctrl.manager) {\n        debugWarn(\"[Spordle Annonceur Bridge] Contrôleur ou Manager introuvable.\");\n        return;\n      }\n\n      var manager = ctrl.manager;\n      var meta = manager.meta || {};\n      var rules = meta.rules || [];\n      var options = meta.options || [];\n\n      debugLog(\"⚡ [Spordle Annonceur Bridge] Rules count:\", rules.length, \"Options count:\", options.length);\n\n      // 1. Résolution déterministe et autonome de la règle et de l'option officielle\n      var resolved = resolveRuleAndOption(meta, code, reqSeverity, reqName);\n      var matchedRule = resolved ? resolved.rule : null;\n      var targetOption = resolved ? resolved.option : null;\n\n      debugLog(\"⚡ [Spordle Annonceur Bridge] Matched Rule:\", matchedRule);\n      debugLog(\"⚡ [Spordle Annonceur Bridge] Target Option:\", targetOption);\n\n      if (!matchedRule || !targetOption) {\n        debugWarn(\"⚠️ [Spordle Annonceur Bridge] Règle ou option introuvable pour le code:\", code);\n        return;\n      }\n\n      // 2. ONE selection entry point, in priority order. Selection handlers may toggle,\n      //    so calling several of them (or the same one twice) makes the result depend on parity.\n      var nativeBtn = findNativeOptionInPage(code, targetOption, matchedRule);\n      try {\n        if (nativeBtn) {\n          window.angular.element(nativeBtn).triggerHandler(\"click\");\n        } else if (typeof ctrl.selection === \"function\") {\n          ctrl.selection(targetOption);\n        } else if (typeof manager.selectRuleOption === \"function\") {\n          manager.selectRuleOption(targetOption);\n        } else if (typeof manager.selectRule === \"function\") {\n          manager.selectRule(matchedRule);\n        }\n      } catch (selErr) {\n        debugWarn(\"[Spordle Annonceur Bridge] Native selection failed:\", selErr);\n      }\n      ack(\"applied\");\n\n      // 3. Converge on the requested option without calling any handler again.\n      var sameOption = manager.option && (manager.option === targetOption ||\n        (manager.option.id != null && manager.option.id === targetOption.id));\n      if (!sameOption) {\n        manager.rule = matchedRule;\n        manager.option = targetOption;\n      }\n\n      document.body.dataset.saSelectedPenaltyCode = code;\n      window.__saActivePenaltyCode = code;\n\n      debugLog(\"⚡ [Spordle Annonceur Bridge] manager.rule vérifié:\", manager.rule);\n      debugLog(\"⚡ [Spordle Annonceur Bridge] manager.option vérifié:\", manager.option);\n\n      // 5. Synchronisation déclarative du sous-contrôleur d'infraction s'il est présent (Step 2)\n      var infractionSelectView = modal.querySelector(\"hi-add-penalty-infraction-select, hi-add-penalty-infraction, .penalty-infraction-view\");\n      if (infractionSelectView && window.angular) {\n        try {\n          var infScope = window.angular.element(infractionSelectView).scope();\n          var infCtrl = infScope ? (infScope.$ctrl || window.angular.element(infractionSelectView).controller()) : null;\n          if (infCtrl) {\n            // Only select if the sub-controller is not already on the target option:\n            // the single entry point above usually ran this same handler, and a second call can toggle it off.\n            var infOption = infCtrl.manager && infCtrl.manager.option;\n            var infAlreadySelected = infOption && (infOption === targetOption ||\n              (infOption.id != null && infOption.id === targetOption.id));\n            if (!infAlreadySelected && typeof infCtrl.selection === \"function\") {\n              try { infCtrl.selection(targetOption); } catch (_) {}\n            }\n            if (infCtrl.manager) {\n              infCtrl.manager.rule = matchedRule;\n              infCtrl.manager.option = targetOption;\n            }\n          }\n          if (infScope && typeof infScope.$evalAsync === \"function\") {\n            infScope.$evalAsync();\n          }\n        } catch (_) {}\n      }\n\n      // 6. Appel natif officiel de Spordle : getResultingPenalties(this.teamPenalties)\n      var resulting = null;\n      if (typeof manager.getResultingPenalties === \"function\") {\n        resulting = manager.getResultingPenalties(ctrl.teamPenalties || []);\n      }\n\n      debugLog(\"⚡ [Spordle Annonceur Bridge] Native Resulting Penalties:\", resulting);\n\n      if (resulting && resulting.length) {\n        ctrl.penalties = resulting;\n      }\n\n      // 7. Synchronisation déclarative du sous-contrôleur du sommaire (hiAddPenaltySummary) s'il est présent (Step 1)\n      var summaryEl = modal.querySelector(\"hi-add-penalty-summary, .penalty-summary-view\");\n      if (summaryEl && window.angular) {\n        try {\n          var sScope = window.angular.element(summaryEl).scope();\n          var sCtrl = sScope ? (sScope.$ctrl || window.angular.element(summaryEl).controller(\"hiAddPenaltySummary\")) : null;\n          if (sCtrl && resulting && resulting.length) {\n            sCtrl.penalties = resulting;\n          }\n          if (sScope && typeof sScope.$evalAsync === \"function\") {\n            sScope.$evalAsync();\n          }\n        } catch (_) {}\n      }\n\n      // 8. Basculer l'écran sur \"summary\" uniquement si on vient d'un écran secondaire (sauf si stayInView ou fromQuickAccess est demandé)\n      var isFromQuickAccess = e.detail && e.detail.fromQuickAccess;\n      var stayInView = e.detail && e.detail.stayInView;\n      if (!stayInView && !isFromQuickAccess) {\n        if (typeof ctrl.go === \"function\") {\n          ctrl.go(\"summary\");\n        } else {\n          ctrl.state = \"summary\";\n        }\n      }\n\n      // 9. Cycle digest réactif Angular : Angular applique lui-même ses bindings déclaratifs\n      // (ng-disabled, ng-class=\"$ctrl.nextStyle()\", etc.) sans AUCUNE manipulation directe du DOM.\n      if (scope && typeof scope.$evalAsync === \"function\") {\n        scope.$evalAsync();\n      } else if (scope && typeof scope.$apply === \"function\") {\n        scope.$apply();\n      }\n\n      debugLog(\"✅ [Spordle Annonceur Bridge] Pénalité appliquée nativement avec succès !\", ctrl.penalties);\n      window.dispatchEvent(new CustomEvent(\"sa:penalty-applied-success\", { detail: { code: code } }));\n    } catch (err) {\n      console.error(\"[Spordle Annonceur Bridge] Erreur lors de l'application native:\", err);\n    }\n  });\n})();\n";

  // Logique UI
  // Spordle Annonceur — ajoute une icône 📢 à chaque but / punition du sommaire
// et affiche, au survol, le texte à lire en gros caractères.
(() => {
  "use strict";

  const BTN_CLASS = "sa-announce-btn";
  // Set by build-userscript.js. The userscript can run where a `chrome` object exists (it belongs to the
  // userscript manager, not to us), so never detect the platform from `chrome` alone.
  const IS_USERSCRIPT = typeof SA_IS_USERSCRIPT !== "undefined" && SA_IS_USERSCRIPT === true;

  // ---------- Persistent storage (strategy) ----------
  // Spordle clears the site's localStorage on reload, so everything the extension must remember goes
  // through saStore, which uses the first backend available:
  //   1. "chrome": chrome.storage.local. Belongs to the extension, shared by every Spordle domain.
  //   2. "gm": GM.getValue / GM.setValue (userscript, stored by the userscript manager). One JSON blob
  //      under GM_BLOB_KEY, so only the two GM calls verified on the iPad are used.
  //   3. "local": localStorage (offline demo, tests).
  // Reads are synchronous against an in-memory cache filled once at startup (saStore.ready). Values are
  // strings, like localStorage, so call sites keep localStorage semantics (null when absent).
  // Only keys starting with "sa_" are stored.
  const SA_KEY_PREFIX = "sa_";
  const GM_BLOB_KEY = "sa_store";
  const SA_STORE_MIGRATED_KEY = "sa_store_migrated";
  const STORE_READY_TIMEOUT_MS = 1500;

  const createSaStore = () => {
    const cache = {};
    const toStoredString = (v) => (typeof v === "string" ? v : JSON.stringify(v));

    const readLocalStorage = () => {
      const out = {};
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(SA_KEY_PREFIX)) out[k] = localStorage.getItem(k);
        }
      } catch (_) {}
      return out;
    };

    // The GM backend rewrites one blob, so it must not flush before the stored blob is read: a write made
    // after a startup timeout would otherwise replace every stored setting with the few keys in the cache.
    let loadSettled = false;
    let gmFlushPending = false;
    let gmFlushQueued = false;
    const scheduleGmFlush = () => {
      if (!loadSettled) { gmFlushPending = true; return; }
      if (gmFlushQueued) return;
      gmFlushQueued = true;
      Promise.resolve().then(() => {
        gmFlushQueued = false;
        try { Promise.resolve(GM.setValue(GM_BLOB_KEY, JSON.stringify(cache))).catch(() => {}); } catch (_) {}
      });
    };

    const backends = {
      chrome: {
        available: () => !IS_USERSCRIPT && typeof chrome !== "undefined" &&
          !!(chrome.runtime && chrome.runtime.id && chrome.storage && chrome.storage.local),
        load: () => new Promise((resolve) => chrome.storage.local.get(null, (all) => resolve(all || {}))),
        set: (k, v) => chrome.storage.local.set({ [k]: v }),
        remove: (k) => chrome.storage.local.remove(k),
      },
      gm: {
        available: () => IS_USERSCRIPT && typeof GM !== "undefined" &&
          typeof GM.getValue === "function" && typeof GM.setValue === "function",
        load: () => Promise.resolve(GM.getValue(GM_BLOB_KEY, "{}")).then((raw) => {
          try { return (typeof raw === "string" ? JSON.parse(raw) : raw) || {}; } catch (_) { return {}; }
        }),
        set: () => scheduleGmFlush(),
        remove: () => scheduleGmFlush(),
      },
      local: {
        available: () => true,
        load: () => Promise.resolve(readLocalStorage()),
        set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} },
        remove: (k) => { try { localStorage.removeItem(k); } catch (_) {} },
      },
    };

    const backendName = ["chrome", "gm", "local"].find((name) => {
      try { return backends[name].available(); } catch (_) { return false; }
    });
    const backend = backends[backendName];

    // A backend that never answers must not block the whole extension: after STORE_READY_TIMEOUT_MS the
    // extension starts with defaults. A late load then only fills keys nobody has written in the meantime.
    let timedOut = false;
    const timeout = new Promise((resolve) => setTimeout(() => {
      timedOut = true;
      resolve();
    }, STORE_READY_TIMEOUT_MS));

    const loadDone = Promise.resolve()
      .then(() => backend.load())
      .catch(() => ({}))
      .then((loaded) => {
        Object.keys(loaded || {}).forEach((k) => {
          if (!k.startsWith(SA_KEY_PREFIX) || loaded[k] == null) return;
          if (timedOut && Object.prototype.hasOwnProperty.call(cache, k)) return;
          cache[k] = toStoredString(loaded[k]);
        });
        loadSettled = true;
        if (gmFlushPending) scheduleGmFlush();
        // One-time copy of whatever localStorage still holds from earlier versions.
        if (backendName !== "local" && cache[SA_STORE_MIGRATED_KEY] !== "true") {
          const legacy = readLocalStorage();
          Object.keys(legacy).forEach((k) => {
            if (!(k in cache)) {
              cache[k] = legacy[k];
              try { backend.set(k, legacy[k]); } catch (_) {}
            }
          });
          cache[SA_STORE_MIGRATED_KEY] = "true";
          try { backend.set(SA_STORE_MIGRATED_KEY, "true"); } catch (_) {}
        }
        // Keep several open Spordle tabs in sync (Chrome only; GM has no change events in Userscripts).
        if (backendName === "chrome") {
          try {
            chrome.storage.onChanged.addListener((changes, area) => {
              if (area !== "local") return;
              Object.keys(changes).forEach((k) => {
                if (!k.startsWith(SA_KEY_PREFIX)) return;
                if (changes[k].newValue == null) delete cache[k];
                else cache[k] = toStoredString(changes[k].newValue);
              });
            });
          } catch (_) {}
        }
      });

    const ready = Promise.race([loadDone, timeout]);

    return {
      backend: backendName,
      ready,
      getItem: (k) => (Object.prototype.hasOwnProperty.call(cache, k) ? cache[k] : null),
      setItem: (k, v) => {
        const s = String(v);
        cache[k] = s;
        try { backend.set(k, s); } catch (_) {}
      },
      removeItem: (k) => {
        delete cache[k];
        try { backend.remove(k); } catch (_) {}
      },
    };
  };

  const saStore = createSaStore();
  let popover = null;
  let pinned = false;

  // ---------- Utilitaires de texte ----------

  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

  // "MAXIME GAGNÉ" -> "Maxime Gagné" (gère tirets et apostrophes)
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

  // Extrait les joueurs ou entraîneurs au format "NOM PRÉNOM (77)" ou "NOM PRÉNOM (E1)" / "(ENT)"
  const parsePlayers = (text) => {
    const players = [];
    const re = /([^,():]+?)\s*\((\d+|E[1-5]|ENT|COACH|ENTRA[IÎ]NEUR(?:[\s\-]CHEF|[\s\-]ADJOINT)?|AC|HC|G[EÉ]R(?:ANT)?)\)/gi;
    let m;
    while ((m = re.exec(text))) {
      const name = m[1].replace(/^[\s\-–—]+/, "");
      const num = m[2];
      const isCoach = /^(?:E[1-5]|ENT|COACH|ENTRA|AC|HC|G[EÉ]R)/i.test(num);
      players.push({ name: titleCase(name), number: num, isCoach });
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
    [/p[eé]nalit[eé]\s*de\s*match|punition\s*de\s*match|match\s*penalty/i, "punition de match et 5 minutes"],
    [/tir\s*de\s*(?:punition|p[eé]nalit[eé])|penalty\s*shot/i, "tir de punition"],
    [/grossi[eè]re/i, "grossière inconduite"],
    [/inconduite|misconduct/i, "10 minutes"],
  ];

  const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Extrait les informations de pénalité : joueur fautif, purgeur, sévérité, infraction
  // Gère :
  // - "LÉA PELLETIER (30) - SERVI: ALICE BÉLANGER (15) - A22 - Coup de bâton (Mineure)"
  // - "Punition de banc: JUSTINE DUBÉ (24) - A80 - Trop de joueurs sur la patinoire (Mineure)"
  // - "MAUDE CLOUTIER (99) - A48 - Contact avec la tête (Mineure 4/4)"
  // - "MARTIN GIRARD (E1) - D61 - Abus verbal envers un officiel (Extrême inconduite)"
  const parsePenaltyEvent = (details) => {
    const cleaned = cleanPenaltyDetails(details);
    const isBench = /\b(?:banc|bench)\b/i.test(cleaned);
    const isCoachPrefix = /^(?:entra[iî]neur|coach)\s*[:\-–—]/i.test(cleaned);

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
      } else if (isCoachPrefix) {
        const coachMatch = s.match(/^(?:entra[iî]neur|coach)\s*[:\-–—]?\s*([^-–—()]+)/i);
        if (coachMatch) {
          player = { name: titleCase(coachMatch[1]), number: "ENT", isCoach: true };
          s = s.slice(coachMatch[0].length).trim();
        }
      }
    }

    // On retire le joueur fautif ou purgeur du début pour ne garder que l'infraction et la sévérité
    if (player && player.number) {
      s = s.replace(new RegExp(`^[^()]+?\\(${escapeRegExp(player.number)}\\)`, "i"), "").trim();
    } else if (isBench && servedBy && servedBy.number) {
      s = s.replace(new RegExp(`^[^()]+?\\(${escapeRegExp(servedBy.number)}\\)`, "i"), "").trim();
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
    const isCoach = isCoachPrefix || !!(player && player.isCoach);

    return {
      isBench,
      isCoach,
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
    if (itemHost && itemHost._saPeriod) return itemHost._saPeriod;
    let el = itemHost ? itemHost.previousElementSibling : null;
    while (el) {
      if (el.classList && el.classList.contains("summary-period-header")) {
        const raw = clean(el.childNodes[0]?.textContent || el.textContent);
        const label = raw.split(" - ")[0].toLowerCase();
        if (itemHost) itemHost._saPeriod = label;
        return label;
      }
      el = el.previousElementSibling;
    }
    return itemHost?._saPeriod || "";
  };

  // Le sommaire est affiché du plus récent au plus ancien (fusillade, prolongation, 3e, 2e, 1re).
  // Le rang d'un but = nombre de buts de la même équipe entre cette ligne et le bas de la liste.
  const goalRank = (summaryItem, side) => {
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
    if (ev.type === "goal") {
      return `Le temps du but : <strong>${escapeHtml(ev.time)}</strong>.`;
    }
    const period = ev.period ? ` de la ${escapeHtml(ev.period)}` : "";
    return `Le temps de la pénalité : <strong>${escapeHtml(ev.time)}</strong>${period}.`;
  };

  const buildGoal = (ev) => {
    // Détecte les situations numériques et spéciales
    const isShortHanded = /\[(?:DN|SH|SHG|IN)\]/i.test(ev.details);
    const isPowerPlay = /\[(?:AN|PP|PPG|SN)\]/i.test(ev.details);
    const isPenaltyShot = /\[(?:tir\s*de\s*(?:punition|p[eé]nalit[eé])|penalty\s*shot|TP|PS)\]/i.test(ev.details);
    const isEmptyNet = /\[(?:FD|EN|ENG)\]/i.test(ev.details);

    // Nettoie les balises spéciales des détails pour le parsing des noms
    const cleanDetails = ev.details
      .replace(/\[(?:AN|PP|PPG|SN|DN|SH|SHG|IN|FD|EN|ENG|tir\s*de\s*(?:punition|p[eé]nalit[eé])|penalty\s*shot|TP|PS)\]/gi, "")
      .trim();

    // Format observé : "MAXIME GAGNÉ (77)  - PASSES: XAVIER POIRIER (21)"
    const [scorerPart, ...rest] = cleanDetails.split(/\b(?:PASSES?|ASSISTS?|AIDES?)\s*:/i);
    const scorer = parsePlayers(scorerPart)[0];
    const assists = parsePlayers(rest.join(" "));

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

    const opening = ev.rank
      ? `Le <strong>${ordinal(ev.rank)}</strong> but des <strong>${escapeHtml(ev.team)}</strong>,`
      : `Le but des <strong>${escapeHtml(ev.team)}</strong>,`;
    const lines = [`<div class="sa-line">${opening}</div>`];

    // Construction de la mention spéciale intégrée directement dans la phrase du but
    const modifiers = [];
    if (isShortHanded) {
      modifiers.push("en désavantage numérique");
    } else if (isPowerPlay) {
      modifiers.push("en avantage numérique");
    } else if (isPenaltyShot) {
      modifiers.push("sur un tir de punition");
    }

    if (isEmptyNet) {
      modifiers.push("dans un filet désert");
    }

    const modStr = modifiers.length ? ` ${modifiers.join(" ")}` : "";

    if (scorer) {
      let scorerAndAssists = "";
      if (assists.length) {
        const parts = assists.map((a) => `du ${playerHtml(a)}`);
        scorerAndAssists = `marqué${modStr} par le ${playerHtml(scorer)}, avec l'aide ${parts.join(", et ")}.`;
      } else {
        scorerAndAssists = `marqué${modStr} sans aide par le ${playerHtml(scorer)}.`;
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

  const companionPenaltyRegistry = new Map();
  const coincidentPenaltyRegistry = new Map();

  // Retrouve toutes les lignes de pénalité associées au même joueur au même temps de match
  const findCompanionPenalties = (summaryItem, ev, player) => {
    if (!player || !player.number) return [summaryItem];

    const host = summaryItem.closest(".summary-items") || summaryItem.closest("hi-summary-list") || document.body;
    const allItems = [...host.querySelectorAll(".summary-item")].filter((item) => {
      const a = item.querySelector(".action");
      return a && a.classList.contains("penalty");
    });

    const visibleCompanions = allItems.filter((item) => {
      const oEv = readEvent(item);
      if (!oEv) return false;
      if (oEv.period !== ev.period || oEv.time !== ev.time || oEv.side !== ev.side) return false;
      const parsed = parsePenaltyEvent(oEv.details);
      return parsed.player && parsed.player.number === player.number;
    });

    const key = `${ev.side}_${ev.period}_${ev.time}_${player.number}`;
    if (visibleCompanions.length > 1) {
      companionPenaltyRegistry.set(key, visibleCompanions);
      return visibleCompanions;
    }

    if (companionPenaltyRegistry.has(key)) {
      const cached = companionPenaltyRegistry.get(key);
      if (cached && cached.length > 1) {
        return cached;
      }
    }

    return visibleCompanions.length ? visibleCompanions : [summaryItem];
  };

  // Détecte deux punitions pareilles (coïncidentes) entre un joueur visiteur et un joueur local au même temps
  const findCoincidentOpponentPenalty = (summaryItem, ev, player, myCodes, myPenInfo) => {
    if (!player || !player.number || player.isCoach || myPenInfo.isBench || myPenInfo.isCoach) return null;
    if (myCodes.some((c) => /^F/i.test(c))) return null;

    const mySig = myCodes.length > 0
      ? [...myCodes].map((c) => c.toUpperCase()).sort().join("+")
      : `${(myPenInfo.duration || "").toLowerCase()}_${(myPenInfo.infraction || "").toLowerCase()}`;
    if (!mySig) return null;

    const oppSide = ev.side === "home" ? "away" : "home";
    const host = summaryItem.closest(".summary-items") || summaryItem.closest("hi-summary-list") || document.body;
    const allItems = [...host.querySelectorAll(".summary-item")].filter((item) => {
      const a = item.querySelector(".action");
      return a && a.classList.contains("penalty");
    });

    // Regrouper les pénalités de l'équipe adverse au même temps par joueur
    const oppGroups = new Map();
    allItems.forEach((item) => {
      const oEv = readEvent(item);
      if (!oEv || oEv.side !== oppSide || oEv.period !== ev.period || oEv.time !== ev.time) return;
      const parsed = parsePenaltyEvent(oEv.details);
      if (!parsed.player || !parsed.player.number || parsed.player.isCoach || parsed.isBench || parsed.isCoach) return;
      const pNum = parsed.player.number;
      if (!oppGroups.has(pNum)) {
        oppGroups.set(pNum, { player: parsed.player, codes: [], penInfo: parsed, items: [] });
      }
      const grp = oppGroups.get(pNum);
      if (parsed.code) grp.codes.push(parsed.code);
      grp.items.push(item);
    });

    const matchingOpp = [];
    oppGroups.forEach((grp) => {
      const oppSig = grp.codes.length > 0
        ? [...grp.codes].map((c) => c.toUpperCase()).sort().join("+")
        : `${(grp.penInfo.duration || "").toLowerCase()}_${(grp.penInfo.infraction || "").toLowerCase()}`;
      if (oppSig === mySig) {
        matchingOpp.push(grp);
      }
    });

    const cacheKey = `${ev.period}_${ev.time}_${ev.side}_${player.number}_${mySig}`;
    if (matchingOpp.length === 1) {
      const match = {
        teamName: getTeamName(oppSide),
        penalizedPlayer: matchingOpp[0].player,
        side: oppSide,
        items: matchingOpp[0].items
      };
      coincidentPenaltyRegistry.set(cacheKey, match);
      return match;
    }

    if (coincidentPenaltyRegistry.has(cacheKey)) {
      return coincidentPenaltyRegistry.get(cacheKey);
    }

    return null;
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

      const oppSide = ev.side === "home" ? "away" : "home";
      const coincidentWith = summaryItem && penInfo.player
        ? findCoincidentOpponentPenalty(summaryItem, ev, penInfo.player, codes, penInfo)
        : null;

      const formatted = SpordleEngine.formatPenalty({
        teamName: ev.team,
        side: ev.side,
        awardedTeamName: getTeamName(oppSide),
        isBenchMinor: penInfo.isBench,
        isCoach: penInfo.isCoach,
        penalizedPlayer: penInfo.player,
        servedByPlayer: penInfo.servedBy,
        coincidentWith,
        codes: codes.length > 0 ? codes : undefined,
        infractionDescription: penInfo.infraction,
        durationDescription: penInfo.duration,
        severity: penInfo.severity,
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

  const isEmptyNetGoalieEvent = (details) => {
    const d = clean(details || "");
    if (!d) return true;
    if (/empty\s*net|filet\s*d[eé]sert|aucun\s*gardien|no\s*goalie|retir[eé]\s*du\s*filet|pulled|sorti\s*du\s*filet/i.test(d)) {
      return true;
    }
    return parsePlayers(d).length === 0;
  };

  const buildGoalieChange = (ev, summaryItem) => {
    const players = parsePlayers(ev.details);
    const goalie = players.length ? players[0] : null;
    const emptyNet = isEmptyNetGoalieEvent(ev.details);

    if (typeof SpordleEngine !== "undefined" && SpordleEngine.formatGoalieChange) {
      const formatted = SpordleEngine.formatGoalieChange({
        teamName: ev.team,
        goalie,
        details: ev.details,
        isEmptyNet: emptyNet,
        time: ev.time,
        period: ev.period
      });
      return formatted.htmlLines.map((l) => `<div class="sa-line">${l}</div>`).join("");
    }

    if (emptyNet) {
      return (
        `<div class="sa-line"><strong>⚠️ Ne pas annoncer au micro — Filet désert</strong></div>` +
        `<div class="sa-line">Il n'y a pas d'annonce à faire pour un filet désert (gardien retiré).</div>`
      );
    }

    // Fallback direct (sans temps, selon le manuel)
    const numStr = goalie ? `le numéro <strong>${escapeHtml(goalie.number)}</strong>, ${escapeHtml(goalie.name)}` : "";
    const lines = [
      `<div class="sa-line">Changement de gardien de but pour les <strong>${escapeHtml(ev.team)}</strong>,</div>`
    ];
    if (numStr) {
      lines.push(`<div class="sa-line">maintenant devant le filet ${numStr}.</div>`);
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
      if (content && content.type) {
        sendAnalytics("announcement_view", {
          announcement_type: content.type
        });
      }
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
    if (e.key === "Escape") {
      if (typeof activeColorPicker !== "undefined" && activeColorPicker) {
        if (typeof closeColorPicker === "function") closeColorPicker();
        e.stopPropagation();
        return;
      }
      hidePopover(true);
    }
  });

  document.addEventListener("click", (e) => {
    if (
      typeof activeColorPicker !== "undefined" &&
      activeColorPicker &&
      !activeColorPicker.contains(e.target) &&
      !e.target.closest(".sa-team-color-btn") &&
      !e.target.closest(".sa-welcome-color-btn")
    ) {
      if (typeof closeColorPicker === "function") closeColorPicker();
    }
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

  // ---------- Gestion globale des options de l'application ----------

  const SA_OPTIONS_PREFIX = "sa_opt_";
  const DEFAULT_OPTIONS = {
    welcome: false,          // Annonce du début de match (off par défaut)
    quick_penalties: true,   // Sélections de pénalités rapides (on par défaut)
    team_colors: true,       // Sélecteur de couleur pour les équipes (on par défaut)
    swap_sides: true,        // Inverseur de côté (on par défaut)
    telemetry_opt_out: false // Opt-out des statistiques (off par défaut)
  };

  const getOption = (key) => {
    try {
      // The opt-out persists in extension / GM storage (telemetryState), which survives Spordle's localStorage wipe.
      if (key === "telemetry_opt_out" && telemetryState.optOut) return true;
      const stored = saStore.getItem(`${SA_OPTIONS_PREFIX}${key}`);
      if (stored === null) {
        if (key === "welcome") {
          const legacy = saStore.getItem("sa_feature_welcome");
          if (legacy !== null) return legacy === "true";
        }
        if (key === "telemetry_opt_out") {
          const legacy = saStore.getItem("sa_telemetry_opt_out");
          if (legacy !== null) return legacy === "true";
        }
        return DEFAULT_OPTIONS[key] ?? false;
      }
      return stored === "true";
    } catch (_) {
      return DEFAULT_OPTIONS[key] ?? false;
    }
  };

  const setOption = (key, val) => {
    try {
      const boolVal = !!val;
      saStore.setItem(`${SA_OPTIONS_PREFIX}${key}`, boolVal ? "true" : "false");
      if (key === "welcome") {
        if (boolVal) saStore.setItem("sa_feature_welcome", "true");
        else saStore.removeItem("sa_feature_welcome");
      }
      if (key === "telemetry_opt_out") {
        setTelemetryEnabled(!boolVal);
      }
    } catch (_) {}
  };

  const isFeatureEnabled = (flag) => {
    try {
      if (typeof window !== "undefined" && window.location) {
        const params = new URLSearchParams(window.location.search);
        const featParam = params.get("features");
        if (featParam === "all" || (featParam && featParam.split(",").includes(flag))) {
          return true;
        }
        const singleParam = params.get(flag);
        if (singleParam === "true" || singleParam === "1") {
          return true;
        }
        if (params.get(`disable_${flag}`) === "true" || params.get(`disable_${flag}`) === "1") {
          return false;
        }
      }
      return getOption(flag);
    } catch (_) {
      return getOption(flag);
    }
  };

  const setFeatureEnabled = (flag, enabled) => {
    setOption(flag, enabled);
  };

  const applyOptions = () => {
    setupWelcomeButton();
    injectSwapSidesButton();
    injectTeamColorButtons();
    enhancePenaltySummaryView();
    enhancePenaltyInfractionView();
  };

  const openSettingsModal = () => {
    const existing = document.getElementById("sa-settings-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "sa-settings-overlay";
    overlay.className = "sa-settings-overlay";

    const welcomeActive = getOption("welcome");
    const quickActive = getOption("quick_penalties");
    const colorsActive = getOption("team_colors");
    const swapActive = getOption("swap_sides");
    const optOutActive = getOption("telemetry_opt_out");

    overlay.innerHTML = `
      <div class="sa-settings-dialog" role="dialog" aria-labelledby="sa-settings-title">
        <div class="sa-settings-header">
          <h3 id="sa-settings-title">
            <span>⚙️</span> Spordle Annonceur — Options
          </h3>
          <button type="button" class="button button-clear ion-close-round sa-settings-close-btn" style="color: #adb5bd; font-size: 15px;" aria-label="Fermer"></button>
        </div>
        <div class="sa-settings-body">
          <p class="sa-settings-intro">
            Personnalisez les modules de l'extension. Ces options sont enregistrées sur cet appareil pour l'ensemble des matchs.
          </p>
          <label class="sa-settings-item">
            <div class="sa-settings-item-label">
              <span class="sa-settings-item-title">🎙️ Annonce du début de match</span>
              <span class="sa-settings-item-desc">Bouton pour annoncer le mot de bienvenue officiel d'avant-match</span>
            </div>
            <div class="sa-toggle-switch">
              <input type="checkbox" id="sa-toggle-welcome"${welcomeActive ? " checked" : ""}>
              <span class="sa-toggle-slider"></span>
            </div>
          </label>
          <label class="sa-settings-item">
            <div class="sa-settings-item-label">
              <span class="sa-settings-item-title">⚡ Sélections de pénalités rapides</span>
              <span class="sa-settings-item-desc">Accès rapide dans la saisie et onglet Fréquentes dans la liste d'infractions</span>
            </div>
            <div class="sa-toggle-switch">
              <input type="checkbox" id="sa-toggle-quick-penalties"${quickActive ? " checked" : ""}>
              <span class="sa-toggle-slider"></span>
            </div>
          </label>
          <label class="sa-settings-item">
            <div class="sa-settings-item-label">
              <span class="sa-settings-item-title">🎨 Sélecteur de couleur pour les équipes</span>
              <span class="sa-settings-item-desc">Pastilles pour choisir et mémoriser les couleurs de chandails</span>
            </div>
            <div class="sa-toggle-switch">
              <input type="checkbox" id="sa-toggle-team-colors"${colorsActive ? " checked" : ""}>
              <span class="sa-toggle-slider"></span>
            </div>
          </label>
          <label class="sa-settings-item">
            <div class="sa-settings-item-label">
              <span class="sa-settings-item-title">⇄ Inverseur de côté</span>
              <span class="sa-settings-item-desc">Bouton pour permuter visuellement les côtés Visiteur et Local</span>
            </div>
            <div class="sa-toggle-switch">
              <input type="checkbox" id="sa-toggle-swap-sides"${swapActive ? " checked" : ""}>
              <span class="sa-toggle-slider"></span>
            </div>
          </label>
          <label class="sa-settings-item">
            <div class="sa-settings-item-label">
              <span class="sa-settings-item-title">🛡️ Opt-out des statistiques</span>
              <span class="sa-settings-item-desc">Désactiver la télémétrie anonyme (aucune donnée personnelle n'est transmise)</span>
            </div>
            <div class="sa-toggle-switch">
              <input type="checkbox" id="sa-toggle-telemetry-opt-out"${optOutActive ? " checked" : ""}>
              <span class="sa-toggle-slider"></span>
            </div>
          </label>

          <div class="sa-settings-divider"></div>

          <div class="sa-settings-reset-box">
            <div class="sa-settings-item-label">
              <span class="sa-settings-item-title" style="color: #ff858d;">🔄 Réinitialiser ce match</span>
              <span class="sa-settings-item-desc">Efface les couleurs choisies et rétablit les côtés par défaut</span>
            </div>
            <button type="button" class="sa-settings-reset-btn" id="sa-settings-clear-match">
              Effacer
            </button>
          </div>
        </div>
        <div class="sa-settings-footer">
          <span class="sa-settings-version">v${escapeHtml(getAppVersion())} · ${escapeHtml(getPlatform() === "chrome_extension" ? "Chrome" : "Userscript")}</span>
          <button type="button" class="sa-settings-btn sa-settings-btn-cancel" id="sa-settings-cancel">Annuler</button>
          <button type="button" class="sa-settings-btn sa-settings-btn-primary" id="sa-settings-save">Enregistrer</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    const close = () => {
      document.removeEventListener("keydown", onKeyDown);
      overlay.remove();
    };

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    const closeBtn = overlay.querySelector(".sa-settings-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", close);

    const cancelBtn = overlay.querySelector("#sa-settings-cancel");
    if (cancelBtn) cancelBtn.addEventListener("click", close);

    const clearMatchBtn = overlay.querySelector("#sa-settings-clear-match");
    if (clearMatchBtn) {
      clearMatchBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        try {
          const gameKey = getGameKey();
          const awayName = getTeamName("away");
          const homeName = getTeamName("home");
          const normAway = normalizeTeamName(awayName);
          const normHome = normalizeTeamName(homeName);

          // Effacer les couleurs personnalisées pour ce match et ces équipes
          saStore.removeItem(`sa_team_color_${gameKey}_away`);
          saStore.removeItem(`sa_team_color_${gameKey}_home`);
          if (normAway) saStore.removeItem(`sa_team_color_${normAway}`);
          if (normHome) saStore.removeItem(`sa_team_color_${normHome}`);
          saStore.removeItem("sa_jersey_away");
          saStore.removeItem("sa_jersey_home");

          // Effacer l'inversion des côtés pour ce match
          saStore.removeItem(getSwapStorageKey());

          // Réinitialiser immédiatement dans le DOM
          applySwapSidesState();
          applyTeamColors();
          updateSwapButtonLabel();
          scan();

          // Confirmation visuelle avant fermeture
          clearMatchBtn.textContent = "✓ Effacé !";
          clearMatchBtn.style.background = "#28a745";
          setTimeout(() => {
            close();
          }, 450);
        } catch (_) {}
      });
    }

    const saveBtn = overlay.querySelector("#sa-settings-save");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const welcomeVal = overlay.querySelector("#sa-toggle-welcome")?.checked || false;
        const quickVal = overlay.querySelector("#sa-toggle-quick-penalties")?.checked || false;
        const colorsVal = overlay.querySelector("#sa-toggle-team-colors")?.checked || false;
        const swapVal = overlay.querySelector("#sa-toggle-swap-sides")?.checked || false;
        const optOutVal = overlay.querySelector("#sa-toggle-telemetry-opt-out")?.checked || false;

        setOption("welcome", welcomeVal);
        setOption("quick_penalties", quickVal);
        setOption("team_colors", colorsVal);
        setOption("swap_sides", swapVal);

        const prevOptOut = getOption("telemetry_opt_out");
        if (optOutVal !== prevOptOut) {
          if (optOutVal) {
            sendAnalytics("telemetry_opt_out");
            setTelemetryEnabled(false);
          } else {
            setTelemetryEnabled(true);
          }
          setOption("telemetry_opt_out", optOutVal);
        }

        close();

        // Réappliquer immédiatement les fonctionnalités
        applyOptions();
        scan();
      });
    }
  };

  // ---------- Intégration dans le menu contextuel Options Spordle ----------

  const checkAndInjectInContainer = (container) => {
    if (!container) return;
    const menuDropdown = container.querySelector("div");
    if (!menuDropdown) return;
    if (menuDropdown.querySelector("#sa-menu-options-btn")) return;

    const divider = document.createElement("div");
    divider.className = "sa-menu-divider";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "sa-menu-options-btn";
    btn.className = "button button-stable button-clear sa-menu-options-item";
    btn.innerHTML = `<span class="sa-menu-icon">📢</span><span>Options Spordle Annonceur</span>`;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      menuDropdown.remove();
      openSettingsModal();
    });

    menuDropdown.appendChild(divider);
    menuDropdown.appendChild(btn);
  };

  const injectOptionsMenuButton = () => {
    const allParents = document.querySelectorAll(".contextual-menu-parent");
    for (const p of allParents) {
      if (p.querySelector("button.ion-android-settings, [logo*='settings']")) {
        checkAndInjectInContainer(p.querySelector(".contextual-menu-container"));
        return;
      }
    }
  };

  const setupContextualMenuIntegration = () => {
    const optButtons = document.querySelectorAll(
      '.contextual-menu-parent button.ion-android-settings, hi-contextual-menu[logo*="settings"] button, hi-contextual-menu[label*="options"] button'
    );
    optButtons.forEach((btn) => {
      if (btn.__saBound) return;
      btn.__saBound = true;
      btn.addEventListener("click", () => {
        setTimeout(injectOptionsMenuButton, 15);
        setTimeout(injectOptionsMenuButton, 60);
        setTimeout(injectOptionsMenuButton, 180);
      });
    });
  };

  window.addEventListener("spordle:options-menu-opened", injectOptionsMenuButton);

  let globalTapTimes = [];
  let globalLastTapHandled = 0;

  const setupSettingsTrigger = () => {
    // 1. Amélioration visuelle si l'en-tête est présent
    const targetEl = document.querySelector(".game-number") || document.querySelector(".game-category");
    if (targetEl) {
      targetEl.style.cursor = "pointer";
      targetEl.style.touchAction = "manipulation"; // Évite le délai et zoom du double-tap sur Safari iOS
      if (!targetEl.title || !targetEl.title.includes("Triple-tap")) {
        targetEl.title = (targetEl.title ? targetEl.title + "\n" : "") + "Triple-tap pour ouvrir les options de Spordle Annonceur";
      }
    }

    // 2. Délégation d'événements globale sur document : fonctionne à 100% même si Angular recrée le DOM
    if (document.__saSettingsDelegationBound) return;
    document.__saSettingsDelegationBound = true;

    const handleTap = (e) => {
      const target = e.target;
      if (!target) return;
      const match = target.closest && (target.closest(".game-number") || target.closest(".game-category"));
      if (!match) return;

      const now = Date.now();
      if (now - globalLastTapHandled < 60) return; // Débouncing des événements tactiles synthétiques
      globalLastTapHandled = now;

      globalTapTimes = globalTapTimes.filter((t) => now - t < 1000);
      globalTapTimes.push(now);

      if (globalTapTimes.length >= 3) {
        globalTapTimes = [];
        if (e && e.cancelable) e.preventDefault();
        if (e) e.stopPropagation();
        openSettingsModal();
      }
    };

    document.addEventListener("click", handleTap, true);
    document.addEventListener("touchend", handleTap, { passive: false, capture: true });
  };

  const scan = () => {
    checkAndTrackGame();
    const items = [...document.querySelectorAll(".summary-item")];
    items.forEach((item) => {
      const action = item.querySelector(".action");
      if (!action) return;
      if (action.classList.contains("goalie")) {
        const detailsText = item.querySelector(".details")?.textContent || "";
        if (isEmptyNetGoalieEvent(detailsText)) {
          const existingBtn = item.querySelector(`.${BTN_CLASS}`);
          if (existingBtn) existingBtn.remove();
          item.classList.remove("sa-has-btn");
          return;
        }
      }
      if (action.classList.contains("goal") || action.classList.contains("penalty") || action.classList.contains("goalie")) {
        decorate(item);
      }
    });

    // Marquer visuellement les pénalités combinées (même joueur ou punitions pareilles coïncidentes)
    items.forEach((item) => {
      const action = item.querySelector(".action");
      if (action && action.classList.contains("penalty")) {
        const ev = readEvent(item);
        if (ev) {
          const penInfo = parsePenaltyEvent(ev.details);
          if (penInfo.player) {
            const companions = findCompanionPenalties(item, ev, penInfo.player);
            const itemsToCombine = companions.length ? companions : [item];
            const codes = [];
            itemsToCombine.forEach((cItem) => {
              const oEv = cItem === item ? ev : readEvent(cItem);
              const parsed = parsePenaltyEvent(oEv.details);
              if (parsed.code) codes.push(parsed.code);
            });
            const coincident = findCoincidentOpponentPenalty(item, ev, penInfo.player, codes, penInfo);

            if (companions.length > 1 || coincident) {
              item.classList.add("sa-penalty-linked");
              const btn = item.querySelector(`.${BTN_CLASS}`);
              if (btn) {
                btn.title = coincident
                  ? "Punitions pareilles (coïncidentes) — Afficher / masquer le texte de l'annonceur"
                  : "Pénalité combinée — Afficher / masquer le texte de l'annonceur";
              }
            } else {
              item.classList.remove("sa-penalty-linked");
            }
          }
        }
      }
    });

    // Options et intégration du menu Spordle
    setupSettingsTrigger();
    setupContextualMenuIntegration();
    injectOptionsMenuButton();

    // Bouton d'inversion des côtés (Visiteur ⇄ Local)
    injectSwapSidesButton();

    // Bouton du mot de bienvenue officiel
    setupWelcomeButton();

    // Pastilles de couleurs des équipes
    injectTeamColorButtons();

    // Nettoyage des états résiduels dès que la modale de pénalité est fermée
    if (!document.querySelector(".modal-add-penalty, hi-add-penalty")) {
      delete document.body.dataset.saSelectedPenaltyCode;
      delete document.body.dataset.saActiveModalPenaltyCode;
      window.__saActivePenaltyCode = null;
    }

    // Module des pénalités favorites dans le modal de sélection d'infractions
    injectMainWorldBridge();
    enhancePenaltyInfractionView();
    enhancePenaltySummaryView();
  };

  // =========================================================================
  // GESTION DES PÉNALITÉS FRÉQUENTES DANS LE SÉLECTEUR D'INFRACTIONS
  // =========================================================================

  const triggerElementClick = (elem) => {
    if (!elem) return;
    try {
      const rect = elem.getBoundingClientRect();
      const clientX = rect.left + rect.width / 2;
      const clientY = rect.top + rect.height / 2;
      const opts = { bubbles: true, cancelable: true, view: window, clientX, clientY };

      elem.dispatchEvent(new PointerEvent("pointerdown", opts));
      elem.dispatchEvent(new MouseEvent("mousedown", opts));
      elem.dispatchEvent(new PointerEvent("pointerup", opts));
      elem.dispatchEvent(new MouseEvent("mouseup", opts));
    } catch (_) {}
    // Exactly one click: a synthetic click plus elem.click() would run ng-click twice.
    if (typeof elem.click === "function") {
      try { elem.click(); } catch (_) {}
    }
  };

  // Both builds run isolated from the page, so page-bridge.js must be injected into the page to reach window.angular.
  // Chrome: loaded from the extension package. Userscript: inline source embedded at build time (SA_PAGE_BRIDGE_SOURCE).
  // bridgeScriptSettled: the injected script has run or failed, so a missing data-sa-bridge marker means
  // the page refused it (CSP). An inline script runs during appendChild; a src script settles on load/error.
  let bridgeScriptSettled = false;
  const injectMainWorldBridge = () => {
    if (document.documentElement.dataset.saBridge === "loaded") bridgeScriptSettled = true;
    if (window.__saPageBridgeLoaded || document.getElementById("sa-main-bridge")) return;
    const script = document.createElement("script");
    script.id = "sa-main-bridge";
    let inline = false;
    try {
      if (IS_USERSCRIPT && typeof SA_PAGE_BRIDGE_SOURCE === "string") {
        script.textContent = SA_PAGE_BRIDGE_SOURCE;
        inline = true;
      } else if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
        script.src = chrome.runtime.getURL("page-bridge.js");
        const settle = () => {
          bridgeScriptSettled = true;
          enhancePenaltySummaryView();
        };
        script.addEventListener("load", settle);
        script.addEventListener("error", settle);
      } else {
        return;
      }
    } catch (_) {
      return;
    }
    (document.head || document.documentElement).appendChild(script);
    if (inline) bridgeScriptSettled = true;
  };

  // "pending" | "ok" | "blocked" (bridge never ran) | "no-response" | "no-angular" | "no-scope" | "no-manager" | "error"
  const getBridgeCapability = () => {
    if (!bridgeScriptSettled) return "pending";
    const root = document.documentElement;
    if (root.dataset.saBridge !== "loaded") return "blocked";
    const probeId = `probe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    window.dispatchEvent(new CustomEvent("sa:bridge-probe", { detail: probeId }));
    const answer = root.dataset.saBridgeProbe || "";
    return answer.startsWith(`${probeId}:`) ? answer.slice(probeId.length + 1) : "no-response";
  };

  let quickAccessUnavailableReported = false;

  // Event details cross from the isolated world to the page as a JSON string: object details are not
  // reliably readable across worlds in every browser (Safari, Firefox). page-bridge.js parses it.
  const dispatchToBridge = (detail) => {
    window.dispatchEvent(new CustomEvent("sa:select-and-next-penalty", { detail: JSON.stringify(detail) }));
  };

  // Gestionnaire de tap tactile sécurisé pour iPad et tactile (évite tout déclenchement lors d'un swipe/scroll)
  const attachSafeTap = (elem, onAction) => {
    if (!elem || typeof onAction !== "function") return;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let touchMoved = false;
    let lastTouchTime = 0;

    // --- GESTION TACTILE STRICTEMENT POUR ÉCRANS TACTILES (iPad / iPhone) ---
    elem.addEventListener("touchstart", (e) => {
      if (e.touches.length > 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startTime = Date.now();
      touchMoved = false;
    }, { passive: true });

    elem.addEventListener("touchmove", (e) => {
      if (touchMoved || e.touches.length > 1) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      // Au-delà de 10px de déplacement, c'est un swipe/scroll, PAS un tap
      if (Math.hypot(dx, dy) > 10) {
        touchMoved = true;
      }
    }, { passive: true });

    elem.addEventListener("touchend", (e) => {
      // 1. Ignorer impérativement si le doigt a bougé (swipe / scroll vers le haut)
      if (touchMoved) return;

      // 2. Ignorer les appuis longs prolongés (> 650ms)
      if (Date.now() - startTime > 650) return;

      // 3. Vérifier que le point de relâchement est bien toujours sur le même bouton
      const t = e.changedTouches && e.changedTouches[0];
      if (t) {
        const releasedEl = document.elementFromPoint(t.clientX, t.clientY);
        // Accept the same button even if it was re-rendered during the touch (same data-code).
        const releasedCode = releasedEl && releasedEl.closest && releasedEl.closest("[data-code]");
        const sameButton = releasedEl && (elem.contains(releasedEl) ||
          (elem.dataset.code && releasedCode && releasedCode.dataset.code === elem.dataset.code));
        if (!sameButton) {
          return;
        }
      }

      e.preventDefault();
      e.stopPropagation();
      lastTouchTime = Date.now();
      onAction(e);
    });

    elem.addEventListener("touchcancel", () => {
      touchMoved = true;
    }, { passive: true });

    // --- GESTION DU CLIC SOURIS NORMAL (Desktop / Mac / Souris / Trackpad) ---
    elem.addEventListener("click", (e) => {
      // Ignorer si ce clic provient d'un tap tactile déjà traité
      if (Date.now() - lastTouchTime < 450) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      onAction(e);
    });
  };

  const enhancePenaltyInfractionView = () => {
    const infractionView = document.querySelector(".penalty-infraction-view");
    if (!infractionView) return;

    // Traitement automatique si déclenché depuis un bouton Quick Access de la 1re page
    if (window.__saAutoApplyCode) {
      const codeToApply = window.__saAutoApplyCode;
      window.__saAutoApplyCode = null;

      const norm = String(codeToApply).replace(/\s+/g, "").toUpperCase();
      const stripped = norm.replace(/^A/, "");

      const triggerApply = () => {
        const buttons = infractionView.querySelectorAll(".option-code-list .button-duration, .option-section-list .button-duration, .sa-favorites-code-list .sa-fav-card");
        let matched = null;
        for (const btn of buttons) {
          const h6s = btn.querySelectorAll("h6");
          const codeText = (h6s[1]?.textContent || btn.dataset?.code || "").replace(/\s+/g, "").toUpperCase();
          const btnText = (btn.textContent || "").replace(/\s+/g, "").toUpperCase();

          if (codeText === norm || codeText === stripped || codeText.replace(/^A/, "") === stripped) {
            matched = btn;
            break;
          }
          if (btnText.includes(norm) || (stripped.length >= 2 && btnText.includes(stripped))) {
            matched = btn;
            break;
          }
        }

        if (matched) {
          triggerElementClick(matched);
          setTimeout(() => {
            const modalEl = infractionView.closest(".modal-add-penalty, hi-add-penalty") || document.querySelector(".modal-add-penalty");
            const nextBtn = modalEl ? modalEl.querySelector(".bar-footer button, #sa-demo-next-btn, button[ng-click*='next'], .button-assertive") : null;
            if (nextBtn) {
              triggerElementClick(nextBtn);
            }
            const hideStyle = document.getElementById("sa-temp-hide-infraction");
            if (hideStyle) hideStyle.remove();
          }, 35);
        } else {
          const hideStyle = document.getElementById("sa-temp-hide-infraction");
          if (hideStyle) hideStyle.remove();
        }
      };

      setTimeout(triggerApply, 15);
    }

    const filterToggle = infractionView.querySelector(".filter-toggle");
    if (!filterToggle) return;

    let freqTabBtn = filterToggle.querySelector(".sa-frequents-tab, .sa-favorites-tab");
    let freqListContainer = infractionView.querySelector(".sa-frequents-code-list, .sa-favorites-code-list");

    if (!getOption("quick_penalties")) {
      if (freqTabBtn) freqTabBtn.remove();
      if (freqListContainer) freqListContainer.remove();
      if (infractionView.__saActiveTab === "frequents" || infractionView.__saActiveTab === "favorites") {
        infractionView.__saActiveTab = "spordle";
        infractionView.classList.remove("sa-tab-frequents-active", "sa-tab-favorites-active");
        const spordleContainers = infractionView.querySelectorAll(".option-code-list, .category-list, .option-section-list, .infraction-rule-name");
        spordleContainers.forEach((el) => el.style.removeProperty("display"));
        const filterInput = infractionView.querySelector('.infraction-filter input, input[name="filter"]');
        if (filterInput) filterInput.style.removeProperty("display");
        const codeBtn = filterToggle.querySelector('button[data-mode="code"]');
        if (codeBtn) codeBtn.classList.add("active");
      }
      return;
    }

    // État actif de l'onglet : 'frequents' par défaut à l'ouverture
    if (!infractionView.__saActiveTab) {
      infractionView.__saActiveTab = "frequents";
    }

    const setDisplayForSpordleContent = (hide) => {
      const spordleContainers = infractionView.querySelectorAll(".option-code-list, .category-list, .option-section-list, .infraction-rule-name");
      spordleContainers.forEach((el) => {
        if (hide) {
          el.style.setProperty("display", "none", "important");
        } else {
          el.style.removeProperty("display");
        }
      });
    };

    const setFilterInputVisibility = (show) => {
      const filterInput = infractionView.querySelector('.infraction-filter input, input[name="filter"]');
      if (filterInput) {
        if (show) {
          filterInput.style.removeProperty("display");
        } else {
          filterInput.style.setProperty("display", "none", "important");
        }
      }
    };

    const getSelectedCodeFromContext = () => {
      if (infractionView.__saSelectedCode) return infractionView.__saSelectedCode;
      if (document.body.dataset.saSelectedPenaltyCode) return document.body.dataset.saSelectedPenaltyCode;
      if (window.__saActivePenaltyCode) return window.__saActivePenaltyCode;

      const summarySection = document.querySelector(".modal-add-penalty .section-infractions, .modal-add-penalty [ng-click*='infraction']");
      if (summarySection && summarySection.dataset.saSelectedCode) {
        return summarySection.dataset.saSelectedCode;
      }

      // Vérifier si un bouton natif d'infraction est actif dans infractionView
      const activeNative = infractionView.querySelector(".button-duration.active, .button-duration.button-positive, .button-duration.selected");
      if (activeNative) {
        const h6s = activeNative.querySelectorAll("h6");
        const codeText = (h6s[1]?.textContent || activeNative.textContent || "").trim();
        if (codeText) return codeText;
      }

      // Vérifier les éléments de résumé dans la modale
      const summaryElements = document.querySelectorAll(".modal-add-penalty hi-penalty-summary, .modal-add-penalty .rounded-box, .modal-add-penalty .penalty-minor, .modal-add-penalty .penalty-major, .modal-add-penalty [ng-repeat*='penalty'], #sa-demo-selected-infraction-preview");
      if (summaryElements.length >= 2) {
        const joined = Array.from(summaryElements).map((el) => (el.textContent || "").trim()).join(" + ");
        if (joined) return joined;
      }
      for (const el of summaryElements) {
        const txt = (el.textContent || "").trim();
        if (txt) return txt;
      }

      return null;
    };

    const isDoubleMinor = (s) => {
      if (!s) return false;
      const str = String(s).toUpperCase();
      return str.includes("+") || str.includes("DOUBLE") || str.includes("4 MIN");
    };

    const matchesSelected = (pen, selectedRef) => {
      if (typeof SpordleEngine !== "undefined" && typeof SpordleEngine.matchesSelectedInfraction === "function") {
        return SpordleEngine.matchesSelectedInfraction(pen, selectedRef);
      }
      if (!pen || !selectedRef) return false;
      const penCodeNorm = String(pen.code || pen).replace(/\s+/g, "").toUpperCase();
      const refCodeNorm = String(selectedRef.code || selectedRef).replace(/\s+/g, "").toUpperCase();
      const penIsDouble = penCodeNorm.includes("+") || isDoubleMinor(pen.severity);
      const refIsDouble = refCodeNorm.includes("+") || isDoubleMinor(selectedRef.severity || selectedRef);

      // Règle stricte d'indépendance A48 vs A48+A48 :
      // Si l'une est double mineure et l'autre est simple, elles ne peuvent JAMAIS se chicaner ni matcher ensemble.
      if (penIsDouble !== refIsDouble) return false;

      if (penIsDouble && refIsDouble) {
        const penParts = penCodeNorm.split("+").map((p) => p.replace(/^A/, "").trim());
        const refParts = refCodeNorm.split("+").map((p) => p.replace(/^A/, "").trim());
        if (penParts.length === refParts.length && penParts.every((val, i) => val === refParts[i])) {
          return true;
        }
        const num = penParts[0];
        if (num && refCodeNorm.includes(num)) {
          return true;
        }
        return false;
      }

      const penStripped = penCodeNorm.replace(/^A/, "");
      const refStripped = refCodeNorm.replace(/^A/, "");
      if (penCodeNorm === refCodeNorm || penStripped === refStripped || penCodeNorm === refStripped || penStripped === refCodeNorm) {
        return true;
      }

      const numRegex = new RegExp("(?:^|[^0-9])" + penStripped + "(?:[^0-9]|$)");
      if (penStripped.length >= 1 && numRegex.test(refCodeNorm)) {
        return true;
      }

      if (pen.name && refCodeNorm.includes(pen.name.toUpperCase())) {
        return true;
      }

      return false;
    };

    // Recherche stricte du bouton natif correspondant dans l'onglet By code (sépare strictement A48 et A48+A48)
    const findNativeByCodeButton = (targetCode) => {
      const normTarget = String(targetCode).replace(/\s+/g, "").toUpperCase();
      const isDouble = normTarget.includes("+");
      const candidateButtons = infractionView.querySelectorAll(".option-code-list .button-duration, .penalty-infraction-view .button-duration");

      for (const btn of candidateButtons) {
        if (btn.classList.contains("sa-fav-card") || btn.closest(".sa-frequents-code-list")) continue;

        const h6s = btn.querySelectorAll("h6");
        let btnCode = "";
        if (h6s.length >= 2) {
          btnCode = (h6s[1].textContent || "").replace(/\s+/g, "").toUpperCase();
        } else {
          btnCode = (btn.textContent || "").replace(/\s+/g, "").toUpperCase();
        }

        const btnIsDouble = btnCode.includes("+");
        if (isDouble !== btnIsDouble) continue;

        if (btnCode === normTarget) {
          return btn;
        }
      }

      const strippedTarget = normTarget.replace(/A/g, "");
      for (const btn of candidateButtons) {
        if (btn.classList.contains("sa-fav-card") || btn.closest(".sa-frequents-code-list")) continue;
        const h6s = btn.querySelectorAll("h6");
        const rawCode = (h6s[1]?.textContent || btn.textContent || "").replace(/\s+/g, "").toUpperCase();
        const btnIsDouble = rawCode.includes("+");
        if (isDouble !== btnIsDouble) continue;

        const strippedBtn = rawCode.replace(/A/g, "");
        if (strippedBtn === strippedTarget) {
          return btn;
        }
      }

      return null;
    };

    // Secours démo hors-ligne uniquement (demo.html sans AngularJS)
    const syncDemoNextButton = () => {
      if (typeof window.angular === "undefined") {
        const demoNext = infractionView.querySelector("#sa-demo-next-btn");
        if (demoNext) {
          demoNext.removeAttribute("disabled");
          demoNext.classList.remove("button-bleak", "disable-pointer-events");
        }
      }
    };

    const refreshFrequentsList = () => {
      if (!freqListContainer) return;
      freqListContainer.innerHTML = "";

      const penalties = (typeof SpordleEngine !== "undefined" && SpordleEngine.getFrequentPenalties)
        ? SpordleEngine.getFrequentPenalties()
        : [];

      const currentSelectedRef = getSelectedCodeFromContext();

      penalties.forEach((pen, index) => {
        const isSelected = matchesSelected(pen, currentSelectedRef);
        const card = document.createElement("button");
        card.type = "button";
        card.className = "button button-duration button-dreary sa-fav-card sa-frequent-card" + (isSelected ? " selected active" : "");
        card.dataset.code = pen.code;
        card.dataset.index = String(index);

        if (isSelected) {
          infractionView.__saSelectedCode = pen.code;
        }

        let displayName = pen.name || (typeof SpordleEngine !== "undefined" && SpordleEngine.getInfractionNameByCode ? SpordleEngine.getInfractionNameByCode(pen.code) : "") || "Infraction";
        if (displayName === "Faire trébucher") {
          displayName = "Trébucher";
        }
        const severityLabel = pen.severity || "Minor";

        card.innerHTML = `
          <h6 class="no-margin ng-binding">${escapeHtml(displayName)}</h6>
          <h6 class="calm no-margin ng-binding">${escapeHtml(pen.code)} (${escapeHtml(severityLabel)})</h6>
        `.trim();

        // Tap sécurisé sur le bouton (résistant au swipe sur iPad) :
        // Traitement identique aux boutons de l'onglet By code + activation du bouton Next dans le bas
        const handleCardAction = () => {
          // Mémoriser la sélection active
          infractionView.__saSelectedCode = pen.code;
          document.body.dataset.saSelectedPenaltyCode = pen.code;
          window.__saActivePenaltyCode = pen.code;

          // Mise en évidence bleue (.selected .active)
          freqListContainer.querySelectorAll(".sa-frequent-card").forEach((c) => c.classList.remove("selected", "active"));
          card.classList.add("selected", "active");

          sendAnalytics("quick_access_used", { source: "infraction_list" });

          // A single selection path: the bridge applies it through Spordle's model.
          // The native click runs only when the bridge did not apply anything (bridge absent, rule not found),
          // so a toggling ng-click never runs more than once per tap.
          const requestId = `sa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          dispatchToBridge({ code: pen.code, name: pen.name, severity: pen.severity || "Minor", stayInView: true, requestId });
          if (document.documentElement.dataset.saBridgeAck !== `${requestId}:applied`) {
            const matchedBtn = findNativeByCodeButton(pen.code);
            if (matchedBtn) triggerElementClick(matchedBtn);
          }

          // Secours démo hors-ligne uniquement (si AngularJS n'est pas présent)
          syncDemoNextButton();
        };

        attachSafeTap(card, handleCardAction);

        freqListContainer.appendChild(card);
      });
    };

    // 1. Création de l'onglet Fréquentes (100% même look que les boutons natifs Spordle)
    if (!freqTabBtn) {
      freqTabBtn = document.createElement("button");
      freqTabBtn.type = "button";
      freqTabBtn.className = "button button-assertive sa-frequents-tab sa-favorites-tab";
      freqTabBtn.textContent = "Fréquentes";
      filterToggle.prepend(freqTabBtn);

      freqListContainer = document.createElement("div");
      freqListContainer.className = "sa-frequents-code-list sa-favorites-code-list";
      const filterDiv = infractionView.querySelector(".infraction-filter");
      if (filterDiv && filterDiv.nextSibling) {
        infractionView.insertBefore(freqListContainer, filterDiv.nextSibling);
      } else {
        infractionView.appendChild(freqListContainer);
      }

      // Clic sur l'onglet Fréquentes
      freqTabBtn.addEventListener("click", () => {
        infractionView.__saActiveTab = "frequents";
        infractionView.classList.add("sa-tab-frequents-active", "sa-tab-favorites-active");
        freqTabBtn.classList.add("active");
        filterToggle.querySelectorAll("button:not(.sa-frequents-tab):not(.sa-favorites-tab)").forEach((b) => b.classList.remove("active"));
        freqListContainer.style.setProperty("display", "grid", "important");
        setDisplayForSpordleContent(true);
        setFilterInputVisibility(false);
        refreshFrequentsList();
      });

      // Écoute des clics sur les onglets natifs SANS bloquer Angular
      filterToggle.addEventListener("click", (e) => {
        const nativeBtn = e.target.closest("button:not(.sa-frequents-tab):not(.sa-favorites-tab)");
        if (nativeBtn) {
          infractionView.__saActiveTab = "spordle";
          infractionView.classList.remove("sa-tab-frequents-active", "sa-tab-favorites-active");
          freqTabBtn.classList.remove("active");
          freqListContainer.style.setProperty("display", "none", "important");
          setDisplayForSpordleContent(false);
          setFilterInputVisibility(true);
        }
      });

      // Mémoriser la sélection lors d'un clic sur un bouton natif d'infraction
      infractionView.addEventListener("click", (e) => {
        const nativeBtn = e.target.closest(".button-duration");
        if (nativeBtn) {
          const h6s = nativeBtn.querySelectorAll("h6");
          const code = (h6s[1]?.textContent || nativeBtn.textContent || "").trim();
          if (code) {
            infractionView.__saSelectedCode = code;
            document.body.dataset.saSelectedPenaltyCode = code;
            window.__saActivePenaltyCode = code;
          }
        }
      });
    }

    // Appliquer l'état d'affichage selon l'onglet courant
    if (infractionView.__saActiveTab === "frequents" || infractionView.__saActiveTab === "favorites") {
      infractionView.classList.add("sa-tab-frequents-active", "sa-tab-favorites-active");
      freqTabBtn.classList.add("active");
      filterToggle.querySelectorAll("button:not(.sa-frequents-tab):not(.sa-favorites-tab)").forEach((b) => b.classList.remove("active"));
      freqListContainer.style.setProperty("display", "grid", "important");
      setDisplayForSpordleContent(true);
      setFilterInputVisibility(false);
      
      if (!freqListContainer.children.length) {
        refreshFrequentsList();
      } else {
        // Synchroniser la classe .selected sans détruire les éléments du DOM
        const currentRef = getSelectedCodeFromContext();
        const penalties = (typeof SpordleEngine !== "undefined" && SpordleEngine.getFrequentPenalties)
          ? SpordleEngine.getFrequentPenalties()
          : [];
        freqListContainer.querySelectorAll(".sa-fav-card, .sa-frequent-card").forEach((c) => {
          const cardCode = c.dataset.code;
          const cardPen = penalties.find((p) => p.code === cardCode) || { code: cardCode };
          if (matchesSelected(cardPen, currentRef)) {
            c.classList.add("selected", "active");
          } else {
            c.classList.remove("selected", "active");
          }
        });
      }
    } else {
      infractionView.classList.remove("sa-tab-frequents-active", "sa-tab-favorites-active");
      freqTabBtn.classList.remove("active");
      freqListContainer.style.setProperty("display", "none", "important");
      setDisplayForSpordleContent(false);
      setFilterInputVisibility(true);
    }
  };

  const enhancePenaltySummaryView = () => {
    // 1. Détecter si on est sur la vue 1re page (summary de la pénalité)
    const summaryView = document.querySelector(".modal-add-penalty .penalty-summary-view, hi-add-penalty-summary .penalty-summary-view, .modal-add-penalty hi-add-penalty-summary");
    if (!summaryView) return;

    if (!getOption("quick_penalties")) {
      const existingGrid = summaryView.querySelector(".sa-summary-quick-grid");
      if (existingGrid) existingGrid.remove();
      return;
    }

    // Si infraction-view est actuellement visible, on ne touche pas au summary
    const infractionView = document.querySelector(".penalty-infraction-view");
    if (infractionView && infractionView.offsetParent !== null) return;

    // 2. Trouver la section des infractions
    let infractionSection = summaryView.querySelector(".section-infractions, [ng-click*='infraction']");
    if (!infractionSection) {
      const candidates = summaryView.querySelectorAll("section, .item, .list > div, .card, div");
      for (const el of candidates) {
        const txt = (el.textContent || "").toLowerCase();
        if (txt.includes("tap to add") || txt.includes("infractions") || txt.includes("infraction")) {
          infractionSection = el.closest("section") || el;
          break;
        }
      }
    }
    if (!infractionSection) return;

    // S'assurer que le pont MAIN_WORLD est injecté
    injectMainWorldBridge();

    // Summary quick buttons have no native fallback: without a working bridge a tap would do nothing.
    // Say so instead of showing dead buttons. The infraction list keeps its native-click fallback.
    const bridgeCapability = getBridgeCapability();
    if (bridgeCapability === "pending") return;
    let unavailableNotice = infractionSection.querySelector(".sa-quick-unavailable");
    if (bridgeCapability !== "ok") {
      const staleGrid = infractionSection.querySelector(".sa-summary-quick-grid");
      if (staleGrid) staleGrid.remove();
      if (!unavailableNotice) {
        unavailableNotice = document.createElement("div");
        unavailableNotice.className = "sa-quick-unavailable";
        unavailableNotice.textContent = "Accès rapide indisponible sur cette page. Touchez « Tap to add infractions » pour choisir l'infraction.";
        const hint = infractionSection.querySelector("h6");
        if (hint) hint.after(unavailableNotice);
        else infractionSection.prepend(unavailableNotice);
      }
      if (!quickAccessUnavailableReported) {
        quickAccessUnavailableReported = true;
        sendAnalytics("quick_access_unavailable", { reason: bridgeCapability });
      }
      return;
    }
    if (unavailableNotice) unavailableNotice.remove();

    // 3. Récupérer les pénalités d'accès rapide selon la catégorie du match
    const categoryName = typeof getGameCategoryName === "function" ? getGameCategoryName() : "";
    const quickPenalties = (typeof SpordleEngine !== "undefined" && SpordleEngine.getQuickAccessPenalties)
      ? SpordleEngine.getQuickAccessPenalties(categoryName)
      : [];

    let quickGrid = infractionSection.querySelector(".sa-summary-quick-grid");

    if (quickPenalties.length === 0) {
      if (quickGrid) quickGrid.remove();
      return;
    }

    if (!quickGrid) {
      quickGrid = document.createElement("div");
      quickGrid.className = "sa-summary-quick-grid";

      // L'insérer immédiatement sous le label "Tap to add infractions." (h6)
      const hintH6 = infractionSection.querySelector("h6");
      if (hintH6 && hintH6.nextSibling) {
        infractionSection.insertBefore(quickGrid, hintH6.nextSibling);
      } else if (hintH6) {
        hintH6.after(quickGrid);
      } else {
        const titleH5 = infractionSection.querySelector("h5");
        if (titleH5 && titleH5.nextSibling) {
          infractionSection.insertBefore(quickGrid, titleH5.nextSibling);
        } else {
          infractionSection.prepend(quickGrid);
        }
      }

      // Bloquer la propagation UNIQUEMENT si on clique dans l'espace vide entre les boutons (la grille elle-même)
      // pour éviter d'ouvrir la vue d'infractions, tout en laissant les boutons et la boîte du bas fonctionner normalement
      const handleGridGapClick = (e) => {
        if (e.target === quickGrid) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      quickGrid.addEventListener("click", handleGridGapClick);
      quickGrid.addEventListener("touchend", handleGridGapClick);
    }

    // Détection de l'infraction actuellement sélectionnée dans la section
    const detectActivePenaltyCode = () => {
      // 1. Code extrait directement depuis Angular / page-bridge pour ce modal (ex: édition de pénalité)
      const modalEl = document.querySelector(".modal-add-penalty, hi-add-penalty");
      if (modalEl && modalEl.dataset.saSelectedCode) {
        return modalEl.dataset.saSelectedCode;
      }
      if (document.body.dataset.saActiveModalPenaltyCode) {
        return document.body.dataset.saActiveModalPenaltyCode;
      }

      // 2. Code mémorisé suite à un clic récent dans cette section
      if (infractionSection.dataset.saSelectedCode) {
        return infractionSection.dataset.saSelectedCode;
      }

      // 3. Inspecter les éléments de résumé dans TOUTE la vue de sommaire (summaryView)
      const penElements = summaryView.querySelectorAll(
        "hi-penalty-summary, .rounded-box, .penalty-minor, .penalty-major, [ng-repeat*='penalty'], #sa-demo-selected-infraction-preview"
      );

      if (penElements.length > 0) {
        const isDoubleSection = penElements.length >= 2;
        const allTexts = Array.from(penElements)
          .map((el) => (el.textContent || "").replace(/\s+/g, " ").toUpperCase())
          .filter((t) => t.length > 0);

        if (allTexts.length > 0) {
          const combinedText = allTexts.join(" + ");

          for (const f of quickPenalties) {
            if (typeof matchesSelected === "function" && matchesSelected(f, combinedText)) {
              return f.code;
            }

            const norm = String(f.code).replace(/\s+/g, "").toUpperCase();
            const fIsDouble = norm.includes("+");
            if (isDoubleSection !== fIsDouble) continue;

            const stripped = norm.replace(/^A/, "");
            const numRegex = new RegExp("(?:^|[^0-9])" + stripped + "(?:[^0-9]|$)");
            if (combinedText.includes(norm) || (stripped.length >= 1 && numRegex.test(combinedText))) {
              return f.code;
            }
            if (f.name && combinedText.includes(f.name.toUpperCase())) {
              return f.code;
            }
          }
        }
      }

      // 4. Si aucun élément spécifique n'est trouvé, inspecter le texte général de la section (ex: "52 - Hooking")
      const sectionText = (infractionSection.textContent || "").replace(/\s+/g, " ").toUpperCase();
      if (!sectionText.includes("TAP TO ADD") && sectionText.length > 15) {
        for (const f of quickPenalties) {
          if (typeof matchesSelected === "function" && matchesSelected(f, sectionText)) {
            return f.code;
          }
        }
      }

      return null;
    };

    const activeCode = detectActivePenaltyCode();
    const isQuickSelected = (fav) => !!(activeCode && (
      fav.code === activeCode ||
      (typeof matchesSelected === "function" ? matchesSelected(fav, activeCode) : false)
    ));

    // Rebuild only when the list of buttons changes. Rebuilding on every scan replaced the buttons
    // between touchstart and touchend, so iPad taps were rejected (the finger lifted on a new element).
    const quickSig = quickPenalties.map((f) => f.code).join("|");
    if (quickGrid.dataset.saSig === quickSig && quickGrid.children.length === quickPenalties.length) {
      quickGrid.querySelectorAll(".sa-summary-quick-btn").forEach((b) => {
        const fav = quickPenalties.find((f) => f.code === b.dataset.code);
        b.classList.toggle("selected", !!fav && isQuickSelected(fav));
      });
      return;
    }
    quickGrid.dataset.saSig = quickSig;

    // Nettoyer les anciens boutons
    quickGrid.innerHTML = "";

    quickPenalties.forEach((fav) => {
      const isSelected = !!(activeCode && (
        fav.code === activeCode ||
        (typeof matchesSelected === "function" ? matchesSelected(fav, activeCode) : false)
      ));
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sa-summary-quick-btn" + (isSelected ? " selected" : "");
      btn.dataset.code = fav.code;
      btn.title = `${fav.name || fav.code} (${fav.code})`;
      btn.innerHTML = `
        <span class="sa-quick-btn-name">${escapeHtml(fav.name || fav.code)}</span>
        <span class="sa-quick-btn-code">${escapeHtml(fav.code)}</span>
      `;

      const handleQuickClick = (e) => {
        // Bloquer impérativement la propagation pour ne JAMAIS ouvrir l'écran d'infractions
        if (e) {
          if (typeof e.preventDefault === "function") e.preventDefault();
          if (typeof e.stopPropagation === "function") e.stopPropagation();
        }

        infractionSection.dataset.saSelectedCode = fav.code;
        document.body.dataset.saSelectedPenaltyCode = fav.code;
        window.__saActivePenaltyCode = fav.code;

        quickGrid.querySelectorAll(".sa-summary-quick-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");

        sendAnalytics("quick_access_used", { source: "summary" });

        // Activer directement la pénalité dans le contexte de la 1re fenêtre (sans toucher au bouton Sauvegarder)
        dispatchToBridge({ code: fav.code, name: fav.name, severity: fav.severity || "Minor", fromQuickAccess: true });
      };

      // Attacher le tap sécurisé : seul un tap franc (down + up sur le même bouton sans mouvement) déclenche
      attachSafeTap(btn, handleQuickClick);

      quickGrid.appendChild(btn);
    });
  };

  window.addEventListener("sa:penalty-applied-success", () => {
    enhancePenaltySummaryView();
  });

  // ---------- Récupération des données officielles de l'API Spordle ----------

  let cachedApiGameData = null;

  document.addEventListener("spordle:game-data", (e) => {
    if (e.detail) {
      cachedApiGameData = e.detail;
      applyTeamColors();
    }
  });

  const getGameData = () => {
    if (cachedApiGameData) return cachedApiGameData;
    if (typeof window !== "undefined") {
      if (window.__SPORDLE_GAME_DATA__) return window.__SPORDLE_GAME_DATA__;
      if (window.TEST_GAME_DATA) return window.TEST_GAME_DATA;
    }
    return null;
  };

  // ---------- Thématisation des couleurs d'équipes ----------

  const COLOR_DICTIONARY = {
    // Français
    "bleu": { hex: "#0046ad", text: "#ffffff", name: "Bleu royal", spoken: "bleu" },
    "bleu royal": { hex: "#0046ad", text: "#ffffff", name: "Bleu royal", spoken: "bleu" },
    "bleu marin": { hex: "#041e42", text: "#ffffff", name: "Bleu marin", spoken: "bleu marin" },
    "marine": { hex: "#041e42", text: "#ffffff", name: "Bleu marin", spoken: "bleu marin" },
    "navy": { hex: "#041e42", text: "#ffffff", name: "Bleu marin", spoken: "bleu marin" },
    "bleu ciel": { hex: "#00a3e0", text: "#ffffff", name: "Bleu ciel", spoken: "bleu ciel" },
    "ciel": { hex: "#00a3e0", text: "#ffffff", name: "Bleu ciel", spoken: "bleu ciel" },
    "blanc": { hex: "#ffffff", text: "#111111", border: "#ced4da", name: "Blanc", spoken: "blanc" },
    "rouge": { hex: "#c8102e", text: "#ffffff", name: "Rouge", spoken: "rouge" },
    "noir": { hex: "#1a1a1a", text: "#ffffff", name: "Noir", spoken: "noir" },
    "vert": { hex: "#005936", text: "#ffffff", name: "Vert forêt", spoken: "vert" },
    "vert forêt": { hex: "#005936", text: "#ffffff", name: "Vert forêt", spoken: "vert" },
    "vert kelly": { hex: "#00843d", text: "#ffffff", name: "Vert kelly", spoken: "vert" },
    "vert lime": { hex: "#69be28", text: "#ffffff", name: "Vert lime", spoken: "vert lime" },
    "lime": { hex: "#69be28", text: "#ffffff", name: "Vert lime", spoken: "vert lime" },
    "jaune": { hex: "#f2a900", text: "#111111", name: "Jaune or", spoken: "jaune" },
    "or": { hex: "#f2a900", text: "#111111", name: "Jaune or", spoken: "jaune" },
    "jaune or": { hex: "#f2a900", text: "#111111", name: "Jaune or", spoken: "jaune" },
    "gold": { hex: "#f2a900", text: "#111111", name: "Jaune or", spoken: "jaune" },
    "orange": { hex: "#ea5b0c", text: "#ffffff", name: "Orange", spoken: "orange" },
    "gris": { hex: "#6c757d", text: "#ffffff", name: "Gris", spoken: "gris" },
    "argent": { hex: "#adb5bd", text: "#111111", name: "Argent", spoken: "argent" },
    "silver": { hex: "#adb5bd", text: "#111111", name: "Argent", spoken: "argent" },
    "bourgogne": { hex: "#6f263d", text: "#ffffff", name: "Bourgogne", spoken: "bourgogne" },
    "marron": { hex: "#6f263d", text: "#ffffff", name: "Bourgogne", spoken: "bourgogne" },
    "maroon": { hex: "#6f263d", text: "#ffffff", name: "Bourgogne", spoken: "bourgogne" },
    "mauve": { hex: "#552583", text: "#ffffff", name: "Mauve", spoken: "mauve" },
    "violet": { hex: "#552583", text: "#ffffff", name: "Mauve", spoken: "mauve" },
    "pourpre": { hex: "#552583", text: "#ffffff", name: "Mauve", spoken: "mauve" },
    // Anglais
    "blue": { hex: "#0046ad", text: "#ffffff", name: "Bleu royal", spoken: "bleu" },
    "white": { hex: "#ffffff", text: "#111111", border: "#ced4da", name: "Blanc", spoken: "blanc" },
    "red": { hex: "#c8102e", text: "#ffffff", name: "Rouge", spoken: "rouge" },
    "black": { hex: "#1a1a1a", text: "#ffffff", name: "Noir", spoken: "noir" },
    "green": { hex: "#005936", text: "#ffffff", name: "Vert forêt", spoken: "vert" },
    "yellow": { hex: "#f2a900", text: "#111111", name: "Jaune or", spoken: "jaune" },
    "gray": { hex: "#6c757d", text: "#ffffff", name: "Gris", spoken: "gris" },
    "grey": { hex: "#6c757d", text: "#ffffff", name: "Gris", spoken: "gris" },
    "purple": { hex: "#552583", text: "#ffffff", name: "Mauve", spoken: "mauve" }
  };

  const parseTeamColor = (raw) => {
    if (!raw) return null;
    const str = String(raw).trim().toLowerCase();
    if (/^#[0-9a-f]{3,8}$/i.test(str)) {
      return { hex: str, text: "#ffffff", name: "Couleur officielle", spoken: "officielle" };
    }
    return COLOR_DICTIONARY[str] || null;
  };

  const TEAM_COLOR_PALETTE = [
    { name: "Blanc", hex: "#ffffff", text: "#111111", border: "#ced4da", spoken: "blanc" },
    { name: "Bleu royal", hex: "#0046ad", text: "#ffffff", spoken: "bleu" },
    { name: "Bleu marin", hex: "#041e42", text: "#ffffff", spoken: "bleu marin" },
    { name: "Rouge", hex: "#c8102e", text: "#ffffff", spoken: "rouge" },
    { name: "Noir", hex: "#1a1a1a", text: "#ffffff", spoken: "noir" },
    { name: "Vert forêt", hex: "#005936", text: "#ffffff", spoken: "vert" },
    { name: "Jaune or", hex: "#f2a900", text: "#111111", spoken: "jaune" },
    { name: "Orange", hex: "#ea5b0c", text: "#ffffff", spoken: "orange" },
    { name: "Gris", hex: "#6c757d", text: "#ffffff", spoken: "gris" },
    { name: "Bourgogne", hex: "#6f263d", text: "#ffffff", spoken: "bourgogne" },
    { name: "Bleu ciel", hex: "#00a3e0", text: "#ffffff", spoken: "bleu ciel" },
    { name: "Vert lime", hex: "#69be28", text: "#ffffff", spoken: "vert lime" },
  ];

  const normalizeTeamName = (name) =>
    (name || "").toLowerCase().replace(/[^a-z0-9]/g, "_");

  const getTeamColor = (side) => {
    const teamName = getTeamName(side);
    const norm = normalizeTeamName(teamName);
    try {
      // 1. Choix manuel explicite de l'utilisateur
      if (norm) {
        const raw = saStore.getItem(`sa_team_color_${norm}`);
        if (raw) return JSON.parse(raw);
      }
      const rawSide = saStore.getItem(`sa_team_color_${getGameKey()}_${side}`);
      if (rawSide) return JSON.parse(rawSide);
    } catch (_) {}

    // 2. Déduction automatique depuis l'API call Spordle (homeColor / awayColor)
    const data = getGameData();
    if (data) {
      const isHome = side === "home";
      const teamObj = isHome ? (data.homeTeam || data.game?.homeTeam) : (data.awayTeam || data.game?.awayTeam);
      if (teamObj) {
        const rawColor = teamObj.homeColor || teamObj.awayColor || teamObj.office?.color;
        const parsed = parseTeamColor(rawColor);
        if (parsed) return parsed;
      }
    }

    // 3. Repli si sa_jersey_${side} a été défini précédemment
    try {
      const savedJersey = saStore.getItem(`sa_jersey_${side}`);
      if (savedJersey) {
        const parsed = parseTeamColor(savedJersey);
        if (parsed) return parsed;
      }
    } catch (_) {}

    return null;
  };


  const setTeamColor = (side, colorObj) => {
    const teamName = getTeamName(side);
    const norm = normalizeTeamName(teamName);
    try {
      if (colorObj) {
        const spoken = colorObj.spoken || colorObj.name.toLowerCase();
        if (norm) saStore.setItem(`sa_team_color_${norm}`, JSON.stringify(colorObj));
        saStore.setItem(`sa_team_color_${getGameKey()}_${side}`, JSON.stringify(colorObj));
        saStore.setItem(`sa_jersey_${side}`, spoken);
      } else {
        if (norm) saStore.removeItem(`sa_team_color_${norm}`);
        saStore.removeItem(`sa_team_color_${getGameKey()}_${side}`);
        saStore.removeItem(`sa_jersey_${side}`);
      }
    } catch (_) {}
    applyTeamColors();
  };

  const applyTeamColors = () => {
    if (!document.body) return;
    const root = document.documentElement;

    const awayColor = getTeamColor("away");
    const homeColor = getTeamColor("home");

    if (awayColor) {
      document.body.classList.add("sa-has-away-color");
      root.style.setProperty("--sa-away-color", awayColor.hex);
      root.style.setProperty("--sa-away-text-color", awayColor.text);
      root.style.setProperty("--sa-away-border-color", awayColor.border || awayColor.hex);
    } else {
      document.body.classList.remove("sa-has-away-color");
      root.style.removeProperty("--sa-away-color");
      root.style.removeProperty("--sa-away-text-color");
      root.style.removeProperty("--sa-away-border-color");
    }

    if (homeColor) {
      document.body.classList.add("sa-has-home-color");
      root.style.setProperty("--sa-home-color", homeColor.hex);
      root.style.setProperty("--sa-home-text-color", homeColor.text);
      root.style.setProperty("--sa-home-border-color", homeColor.border || homeColor.hex);
      const isWhite = homeColor.hex.toLowerCase() === "#ffffff";
      root.style.setProperty("--sa-home-border-badge", isWhite ? "#495057" : homeColor.hex);
      root.style.setProperty("--sa-home-text-badge", isWhite ? "#212529" : homeColor.hex);
    } else {
      document.body.classList.remove("sa-has-home-color");
      root.style.removeProperty("--sa-home-color");
      root.style.removeProperty("--sa-home-text-color");
      root.style.removeProperty("--sa-home-border-color");
      root.style.removeProperty("--sa-home-border-badge");
      root.style.removeProperty("--sa-home-text-badge");
    }

    updateTeamColorSwatches();
  };

  const updateTeamColorSwatches = () => {
    ["away", "home"].forEach((side) => {
      const btn = document.querySelector(`.sa-team-color-btn[data-side="${side}"]`);
      if (!btn) return;
      const color = getTeamColor(side);
      const swatch = btn.querySelector(".sa-team-color-swatch");
      if (swatch) {
        if (color) {
          swatch.classList.remove("sa-swatch-empty");
          swatch.style.background = color.hex;
          swatch.style.border = color.border ? `1px solid ${color.border}` : "none";
          btn.title = `Couleur : ${color.name} (${side === "home" ? "Local" : "Visiteur"})\nCliquez pour changer`;
        } else {
          swatch.classList.add("sa-swatch-empty");
          swatch.style.background = "";
          swatch.style.border = "";
          btn.title = `Choisir la couleur de l'équipe (${side === "home" ? "Local" : "Visiteur"})`;
        }
      }
    });
  };

  let activeColorPicker = null;

  const closeColorPicker = () => {
    if (activeColorPicker) {
      activeColorPicker.remove();
      activeColorPicker = null;
    }
  };

  const openColorPicker = (anchorBtn, side, onColorSelected) => {
    closeColorPicker();

    const teamName = getTeamName(side);
    const currentColor = getTeamColor(side);

    const pop = document.createElement("div");
    pop.className = "sa-color-picker-popover";
    pop.id = "sa-color-picker";

    let gridHtml = "";
    TEAM_COLOR_PALETTE.forEach((col) => {
      const isSelected = currentColor && currentColor.hex.toLowerCase() === col.hex.toLowerCase();
      const borderStyle = col.border ? `border: 1px solid ${col.border};` : "";
      gridHtml += `
        <button type="button" class="sa-color-choice-btn${isSelected ? " selected" : ""}"
                data-hex="${col.hex}"
                title="${col.name}"
                style="background-color: ${col.hex}; color: ${col.text}; ${borderStyle}">
        </button>
      `;
    });

    pop.innerHTML = `
      <div class="sa-color-picker-title">
        <span>Couleur — ${escapeHtml(teamName || (side === "home" ? "Local" : "Visiteur"))}</span>
        <button type="button" class="button button-clear ion-close-round sa-color-picker-close" style="color: #adb5bd; font-size: 13px; min-width: 20px; height: 20px; line-height: 20px; padding: 0;"></button>
      </div>
      <div class="sa-color-picker-grid">
        ${gridHtml}
      </div>
      <button type="button" class="sa-color-reset-btn">Réinitialiser (par défaut)</button>
    `;

    document.body.appendChild(pop);
    const rect = anchorBtn.getBoundingClientRect();
    const popWidth = 220;
    let left = rect.left;
    if (side === "away") {
      left = Math.max(10, rect.right - popWidth);
    } else {
      left = Math.min(window.innerWidth - popWidth - 10, rect.left);
    }
    if (left < 10) left = 10;
    if (left + popWidth > window.innerWidth - 10) {
      left = window.innerWidth - popWidth - 10;
    }

    let top = rect.bottom + 6;
    if (top + 230 > window.innerHeight) {
      top = Math.max(10, rect.top - 230);
    }

    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;

    pop.querySelector(".sa-color-picker-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closeColorPicker();
    });

    pop.querySelectorAll(".sa-color-choice-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const hex = btn.dataset.hex;
        const found = TEAM_COLOR_PALETTE.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
        if (found) {
          setTeamColor(side, found);
          sendAnalytics("team_color_set", { side, color: found.name });
          if (typeof onColorSelected === "function") {
            onColorSelected(found);
          }
        }
        closeColorPicker();
      });
    });

    pop.querySelector(".sa-color-reset-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      setTeamColor(side, null);
      sendAnalytics("team_color_reset", { side });
      if (typeof onColorSelected === "function") {
        onColorSelected(null);
      }
      closeColorPicker();
    });

    activeColorPicker = pop;
  };

  const injectTeamColorButtons = () => {
    if (!getOption("team_colors")) {
      document.querySelectorAll(".sa-team-color-btn").forEach((btn) => btn.remove());
      closeColorPicker();
      return;
    }

    // 1. Bouton Visiteur
    const awayNameEl = document.querySelector(".score-away.score-name");
    if (awayNameEl && !awayNameEl.querySelector('.sa-team-color-btn[data-side="away"]')) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sa-team-color-btn";
      btn.dataset.side = "away";
      btn.innerHTML = `<span class="sa-team-color-swatch sa-swatch-empty"></span>`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (activeColorPicker && activeColorPicker.dataset.side === "away") {
          closeColorPicker();
        } else {
          openColorPicker(btn, "away");
          if (activeColorPicker) activeColorPicker.dataset.side = "away";
        }
      });
      awayNameEl.appendChild(btn);
    }

    // 2. Bouton Local
    const homeNameEl = document.querySelector(".score-home.score-name");
    if (homeNameEl && !homeNameEl.querySelector('.sa-team-color-btn[data-side="home"]')) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sa-team-color-btn";
      btn.dataset.side = "home";
      btn.innerHTML = `<span class="sa-team-color-swatch sa-swatch-empty"></span>`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (activeColorPicker && activeColorPicker.dataset.side === "home") {
          closeColorPicker();
        } else {
          openColorPicker(btn, "home");
          if (activeColorPicker) activeColorPicker.dataset.side = "home";
        }
      });
      homeNameEl.insertBefore(btn, homeNameEl.firstChild);
    }

    updateTeamColorSwatches();
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

  // ---------- Télémétrie & Statistiques Anonymes (GA4 Measurement Protocol) ----------
  const GA_MEASUREMENT_ID = "G-30M1Y8HPSD";
  const GA_API_SECRET = "5SlJw3JQQd63lAiiDgPdsQ";

  const getClientId = () => {
    if (!telemetryState.clientId) {
      telemetryState.clientId = "sa." + randomId();
      persistTelemetryState();
    }
    return telemetryState.clientId;
  };

  const getAppVersion = () => {
    try {
      if (typeof SPORDLE_VERSION !== "undefined" && SPORDLE_VERSION) {
        return SPORDLE_VERSION;
      }
      if (typeof chrome !== "undefined" && chrome.runtime?.getManifest) {
        return chrome.runtime.getManifest()?.version || "1.0.41";
      }
    } catch (_) {}
    return "1.0.41";
  };

  const getPlatform = () => {
    try {
      if (typeof navigator !== "undefined" && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))) {
        return "safari_ios";
      }
      if (!IS_USERSCRIPT && typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
        return "chrome_extension";
      }
    } catch (_) {}
    return "userscript_other";
  };

  // ---------- Telemetry privacy ----------
  // No scoresheet ID, team, arena or player name ever leaves the device.
  // Games are grouped with a random per-device ID whose link to the scoresheet stays on the device.
  //
  // Storage: the IDs and the opt-out live in saStore under TELEMETRY_STORE_KEY (see "Persistent storage"),
  // which survives Spordle's localStorage wipe on both Chrome and the userscript.
  const TELEMETRY_OPT_OUT_KEY = "sa_telemetry_opt_out";
  const TELEMETRY_STORE_KEY = "sa_telemetry";
  const GAME_REFS_KEY = "sa_game_refs";
  const GAME_REFS_MAX = 50;
  const GAME_REFS_TTL_MS = 60 * 24 * 60 * 60 * 1000;

  const normalizeTelemetryState = (saved) => ({
    clientId: (saved && saved.clientId) || null,
    gameRefs: (saved && saved.gameRefs) || {},
    optOut: !!(saved && saved.optOut),
  });

  let telemetryState = normalizeTelemetryState(null);
  let telemetryLoaded = false;

  const telemetryReady = saStore.ready.then(() => {
    let saved = null;
    try { saved = JSON.parse(saStore.getItem(TELEMETRY_STORE_KEY) || "null"); } catch (_) { saved = null; }
    if (!saved) {
      // Values written by versions before saStore (copied from localStorage by the store migration).
      let refs = {};
      try { refs = JSON.parse(saStore.getItem(GAME_REFS_KEY) || "{}") || {}; } catch (_) { refs = {}; }
      saved = {
        clientId: saStore.getItem("sa_client_id"),
        gameRefs: refs,
        optOut: saStore.getItem(TELEMETRY_OPT_OUT_KEY) === "true",
      };
    }
    telemetryState = normalizeTelemetryState(saved);
    telemetryLoaded = true;
  });

  const persistTelemetryState = () => {
    saStore.setItem(TELEMETRY_STORE_KEY, JSON.stringify(telemetryState));
  };

  const isTelemetryEnabled = () => {
    if (telemetryState.optOut) return false;
    try {
      if (typeof getOption === "function") {
        return !getOption("telemetry_opt_out");
      }
      return saStore.getItem(TELEMETRY_OPT_OUT_KEY) !== "true";
    } catch (_) {
      return false;
    }
  };

  const setTelemetryEnabled = (enabled) => {
    telemetryState.optOut = !enabled;
    if (!enabled) {
      telemetryState.clientId = null;
      telemetryState.gameRefs = {};
    }
    persistTelemetryState();
    saStore.setItem(`${SA_OPTIONS_PREFIX}telemetry_opt_out`, enabled ? "false" : "true");
    saStore.removeItem(TELEMETRY_OPT_OUT_KEY);
    saStore.removeItem(GAME_REFS_KEY);
    saStore.removeItem("sa_client_id");
  };

  const randomId = () =>
    (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);

  // Returns { ref, isNew } for the current game. Beyond GAME_REFS_MAX, the least recently opened game is dropped.
  const ensureGameRef = () => {
    const key = getGameKey();
    if (!key || key === "game_default") return null;
    try {
      const now = Date.now();
      const refs = Object.assign({}, telemetryState.gameRefs || {});

      let isNew = false;
      if (refs[key] && refs[key].ref) {
        refs[key].ts = now;
      } else {
        refs[key] = { ref: `g.${randomId()}`, ts: now };
        isNew = true;
      }

      const kept = Object.entries(refs)
        .filter(([, v]) => v && v.ref && now - (v.ts || 0) < GAME_REFS_TTL_MS)
        .sort((a, b) => (b[1].ts || 0) - (a[1].ts || 0))
        .slice(0, GAME_REFS_MAX);
      telemetryState.gameRefs = Object.fromEntries(kept);
      persistTelemetryState();
      return { ref: refs[key].ref, isNew };
    } catch (_) {
      return null;
    }
  };

  const getGameRef = () => {
    const entry = ensureGameRef();
    return entry ? entry.ref : null;
  };

  // Division label only (e.g. "M13 A"), read from the page header. No default value, to avoid fake data.
  const getTelemetryDivision = () => {
    try {
      const catEl = document.querySelector(".game-category");
      const raw = clean(catEl ? (catEl.childNodes[0]?.textContent || catEl.textContent) : "");
      if (!raw) return undefined;
      const label = (typeof SpordleEngine !== "undefined" && SpordleEngine.convertCategoryToQuebec)
        ? SpordleEngine.convertCategoryToQuebec(raw)
        : raw;
      return clean(label).slice(0, 40) || undefined;
    } catch (_) {
      return undefined;
    }
  };

  // Waits for the stored IDs on first use. Once loaded, sends synchronously, so an event sent right
  // before an opt-out (telemetry_opt_out) still goes out under the existing client ID.
  const sendAnalytics = (eventName, params = {}) => {
    if (telemetryLoaded) {
      sendAnalyticsNow(eventName, params);
    } else {
      telemetryReady.then(() => sendAnalyticsNow(eventName, params));
    }
  };

  const sendAnalyticsNow = (eventName, params = {}) => {
    try {
      if (!isTelemetryEnabled()) return;

      // Ignorer tout environnement de test ou de démo local
      if (typeof window !== "undefined" && window.location) {
        const proto = window.location.protocol;
        const host = window.location.hostname;
        if (proto === "file:" || host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
          return;
        }
      }

      // Defensive: never forward an identifying key, even if a caller passes one.
      const { game_key, team, team_name, arena, player, ...safeParams } = params;

      const payload = {
        client_id: getClientId(),
        events: [
          {
            name: eventName,
            params: {
              ...safeParams,
              game_ref: getGameRef() || undefined,
              division: getTelemetryDivision(),
              platform: getPlatform(),
              version: getAppVersion(),
              engagement_time_msec: 100
            }
          }
        ]
      };

      const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;

      // text/plain is a CORS-safelisted type: no preflight. GA does not answer preflights, so
      // application/json gets blocked by CORS. GA reads the JSON body whatever the content type.
      const body = JSON.stringify(payload);
      let queued = false;
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        try {
          queued = navigator.sendBeacon(url, new Blob([body], { type: "text/plain;charset=UTF-8" }));
        } catch (_) {
          queued = false;
        }
      }
      if (!queued && typeof fetch === "function") {
        fetch(url, { method: "POST", mode: "no-cors", body, keepalive: true }).catch(() => {});
      }
    } catch (_) {}
  };

  let lastTrackedGameKey = null;
  const checkAndTrackGame = () => {
    if (!telemetryLoaded) {
      telemetryReady.then(checkAndTrackGame);
      return;
    }
    try {
      const key = getGameKey();
      if (key && key !== "game_default" && key !== lastTrackedGameKey) {
        lastTrackedGameKey = key;
        // game_start fires once per game per device, so its event count is the number of games in GA.
        const entry = isTelemetryEnabled() ? ensureGameRef() : null;
        if (entry && entry.isNew) sendAnalytics("game_start");
        sendAnalytics("game_view");
      }
    } catch (_) {}
  };

  const getSwapStorageKey = () => `sa_swap_sides_${getGameKey()}`;

  const isSidesSwappedForCurrentGame = () => {
    try {
      return saStore.getItem(getSwapStorageKey()) === "true";
    } catch (_) {
      return false;
    }
  };

  const applySwapSidesState = () => {
    if (!document.body) return;
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
        saStore.setItem(getSwapStorageKey(), "true");
      } else {
        saStore.removeItem(getSwapStorageKey());
      }
    } catch (_) {}
    applySwapSidesState();
    updateSwapButtonLabel();
    sendAnalytics("swap_sides", { swapped: nextState ? "yes" : "no" });
  };

  const updateSwapButtonLabel = () => {
    const btn = document.getElementById("sa-swap-sides-btn");
    if (!btn) return;
    const isSwapped = isSidesSwappedForCurrentGame();
    const labelSpan = btn.querySelector(".sa-swap-label");
    if (labelSpan) {
      labelSpan.textContent = isSwapped ? "Côtés inversés" : "Inverser côtés";
    }
    btn.title = isSwapped
      ? "Disposition inversée : Local à gauche, Visiteur à droite.\nCliquez pour rétablir la disposition normale pour ce match."
      : "Disposition normale : Visiteur à gauche, Local à droite.\nCliquez pour inverser les côtés pour correspondre à votre vue de la patinoire pour ce match.";
  };

  const injectSwapSidesButton = () => {
    const existing = document.getElementById("sa-swap-sides-btn");
    if (!getOption("swap_sides")) {
      if (existing) existing.remove();
      return;
    }
    if (existing) {
      updateSwapButtonLabel();
      return;
    }

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

    categoryEl.appendChild(btn);
    updateSwapButtonLabel();
    setupWelcomeButton();
  };

  // Extrait la catégorie officielle depuis les données de l'appel API (i18n.fr.name ou nameFr)
  const getGameCategoryName = () => {
    const data = getGameData();
    if (data) {
      // 1. Priorité absolue : i18n officiel français de l'API Spordle
      const frName =
        data.homeTeam?.category?.i18n?.fr?.name ||
        data.awayTeam?.category?.i18n?.fr?.name ||
        data.homeTeam?.category?.nameFr ||
        data.awayTeam?.category?.nameFr ||
        data.game?.categoryFr;
      if (frName && clean(frName)) return clean(frName);

      // 2. Division + Classe avec i18n fr (ex: division "M12" + class "AA" -> "M12 AA")
      const divFr =
        data.homeTeam?.category?.division?.i18n?.fr?.name ||
        data.awayTeam?.category?.division?.i18n?.fr?.name;
      const classFr =
        data.homeTeam?.category?.class?.i18n?.fr?.name ||
        data.awayTeam?.category?.class?.i18n?.fr?.name ||
        data.game?.category;
      if (divFr && classFr) {
        return `${clean(divFr)} ${clean(classFr)}`.trim();
      }
      if (divFr) return clean(divFr);

      // 3. Category brut de l'API (ex: "U12 AA") -> conversion règle Québec Mxx
      const rawCat = data.homeTeam?.category?.name || data.awayTeam?.category?.name || data.game?.category;
      if (rawCat && typeof SpordleEngine !== "undefined" && SpordleEngine.convertCategoryToQuebec) {
        return SpordleEngine.convertCategoryToQuebec(clean(rawCat));
      }
    }

    // 4. Repli si l'API n'a pas encore répondu : conversion de l'en-tête DOM
    const catEl = document.querySelector(".game-category");
    const raw = catEl ? catEl.childNodes[0]?.textContent || catEl.textContent : "";
    if (typeof SpordleEngine !== "undefined" && SpordleEngine.convertCategoryToQuebec) {
      return SpordleEngine.convertCategoryToQuebec(clean(raw) || "M11 AA");
    }
    return clean(raw) || "M11 AA";
  };

  // Déduit les couleurs des chandails d'après les données de l'appel API
  const getInitialJerseysFromApi = () => {
    const data = getGameData();
    let awayJersey = "blanc";
    let homeJersey = "bleu";
    if (data) {
      const isHomeDefault = data.game?.homeDefaultColor !== false;
      const isAwayDefault = data.game?.awayDefaultColor !== false;

      const rawHomeColor = isHomeDefault ? (data.homeTeam?.homeColor || "BLEU") : (data.homeTeam?.awayColor || "BLANC");
      const rawAwayColor = isAwayDefault ? (data.awayTeam?.awayColor || "BLANC") : (data.awayTeam?.homeColor || "BLEU");

      if (rawHomeColor) homeJersey = clean(rawHomeColor).toLowerCase();
      if (rawAwayColor) awayJersey = clean(rawAwayColor).toLowerCase();
    }
    return { awayJersey, homeJersey };
  };

  const getGoaliesFromSummary = () => {
    let awayGoalie = null;
    let homeGoalie = null;
    const items = [...document.querySelectorAll(".summary-item")].reverse();
    items.forEach((item) => {
      const ev = readEvent(item);
      if (ev && ev.type === "goalie" && !isEmptyNetGoalieEvent(ev.details)) {
        const players = parsePlayers(ev.details);
        if (players.length) {
          if (ev.side === "home" && !homeGoalie) {
            homeGoalie = players[0];
          } else if (ev.side === "away" && !awayGoalie) {
            awayGoalie = players[0];
          }
        }
      }
    });
    return {
      away: awayGoalie || { number: "30", name: "Lily-Rose Boileau" },
      home: homeGoalie || { number: "24", name: "Raphaelle Kanash" }
    };
  };

  const setupWelcomeButton = () => {
    const existing = document.getElementById("sa-welcome-btn");
    if (!getOption("welcome")) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const categoryEl = document.querySelector(".game-category") || document.querySelector(".game-number");
    if (!categoryEl) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "sa-welcome-btn";
    btn.className = "sa-welcome-btn";
    btn.title = "Annoncer le mot de bienvenue officiel d'avant-match";
    btn.innerHTML = `<span class="sa-welcome-icon">🎙️</span><span class="sa-welcome-label">Bienvenue</span>`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      openWelcomeModal();
    });

    categoryEl.appendChild(btn);
  };

  const getGameArenaName = () => {
    const data = getGameData();
    if (data) {
      const arena =
        data.arena?.name ||
        data.game?.arena?.name ||
        (typeof data.game?.arena === "string" ? data.game.arena : "") ||
        (typeof data.arena === "string" ? data.arena : "");
      if (arena && clean(arena)) return clean(arena);
    }
    return "";
  };

  const getGameOfficials = () => {
    const data = getGameData();
    if (!data) return null;
    if (data.officials && (data.officials.referee || data.officials.linesmen)) {
      return data.officials;
    }
    if (data.game?.officials && (data.game.officials.referee || data.game.officials.linesmen)) {
      return data.game.officials;
    }
    return null;
  };

  const openWelcomeModal = () => {
    ensureElements();
    pinned = true;

    sendAnalytics("announcement_view", {
      announcement_type: "welcome"
    });

    // Catégorie issue des données de l'API (i18n.fr.name = "M12 AA")
    const category = getGameCategoryName();
    const arena = getGameArenaName();
    const officials = getGameOfficials();
    const awayTeam = getTeamName("away");
    const homeTeam = getTeamName("home");

    const apiJerseys = getInitialJerseysFromApi();
    let awayColorObj = getTeamColor("away");
    let homeColorObj = getTeamColor("home");

    const goalies = getGoaliesFromSummary();

    const renderWelcome = () => {
      const awayJersey = awayColorObj
        ? (awayColorObj.spoken || awayColorObj.name.toLowerCase())
        : (saStore.getItem("sa_jersey_away") || apiJerseys.awayJersey);
      const homeJersey = homeColorObj
        ? (homeColorObj.spoken || homeColorObj.name.toLowerCase())
        : (saStore.getItem("sa_jersey_home") || apiJerseys.homeJersey);

      const data = SpordleEngine.formatWelcomeMessage({
        hour: new Date().getHours(),
        arena,
        officials,
        category,
        awayTeam,
        homeTeam,
        awayJersey,
        homeJersey,
        awayGoalie: goalies.away,
        homeGoalie: goalies.home
      });

      const awayEffective = awayColorObj || parseTeamColor(awayJersey) || { hex: "#ffffff", name: "Blanc", border: "#ced4da" };
      const awaySwatchStyle = `background-color: ${awayEffective.hex}; ${awayEffective.border ? `border: 1px solid ${awayEffective.border};` : ""}`;
      const awayDisplayName = awayEffective.name || titleCase(awayJersey);

      const homeEffective = homeColorObj || parseTeamColor(homeJersey) || { hex: "#0046ad", name: "Bleu royal" };
      const homeSwatchStyle = `background-color: ${homeEffective.hex}; ${homeEffective.border ? `border: 1px solid ${homeEffective.border};` : ""}`;
      const homeDisplayName = homeEffective.name || titleCase(homeJersey);

      const linesHtml = data.htmlLines.map((l) => `<div class="sa-line">${l}</div>`).join("");

      popover.className = "sa-visible sa-welcome sa-pinned";
      popover.innerHTML =
        `<div class="sa-modal-header bar bar-header bar-dark">` +
          `<div class="sa-modal-badge sa-badge-welcome">` +
            `<span class="sa-badge-dot"></span>` +
            `<span class="sa-badge-text">AVANT-MATCH</span>` +
          `</div>` +
          `<div class="sa-modal-title">` +
            `<span class="sa-team-name">MOT DE BIENVENUE OFFICIEL</span>` +
          `</div>` +
          `<button type="button" class="sa-modal-close-btn button button-stable button-clear" aria-label="Fermer">` +
            `<i class="icon ion-close-round"></i>` +
          `</button>` +
        `</div>` +
        `<div class="sa-modal-body">` +
          `<div class="sa-modal-card">` +
            `<div class="sa-welcome-toolbar">` +
              `<div class="sa-welcome-config-group">` +
                `<span class="sa-welcome-label">Chandail <strong>${escapeHtml(awayTeam)}</strong> :</span> ` +
                `<button type="button" class="sa-welcome-color-btn" data-side="away" title="Changer la couleur du chandail (${escapeHtml(awayTeam)})">` +
                  `<span class="sa-team-color-swatch" style="${awaySwatchStyle}"></span>` +
                  `<span class="sa-welcome-color-name">${escapeHtml(awayDisplayName)}</span>` +
                  `<span class="sa-welcome-color-arrow">▾</span>` +
                `</button>` +
              `</div>` +
              `<div class="sa-welcome-config-group">` +
                `<span class="sa-welcome-label">Chandail <strong>${escapeHtml(homeTeam)}</strong> :</span> ` +
                `<button type="button" class="sa-welcome-color-btn" data-side="home" title="Changer la couleur du chandail (${escapeHtml(homeTeam)})">` +
                  `<span class="sa-team-color-swatch" style="${homeSwatchStyle}"></span>` +
                  `<span class="sa-welcome-color-name">${escapeHtml(homeDisplayName)}</span>` +
                  `<span class="sa-welcome-color-arrow">▾</span>` +
                `</button>` +
              `</div>` +
            `</div>` +
            linesHtml +
          `</div>` +
        `</div>` +
        `<div class="sa-modal-footer">` +
          `<span class="sa-hint-icon"><i class="icon ion-mic-a"></i> Prêt pour l'annonce au micro</span>` +
          `<span class="sa-hint-dismiss">Cliquer n'importe où, sur ✕ ou sur Échap pour fermer</span>` +
        `</div>`;

      // Clic sur les boutons de couleur pour ouvrir le color picker officiel
      popover.querySelectorAll(".sa-welcome-color-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          const side = btn.dataset.side;
          if (activeColorPicker && activeColorPicker.dataset.side === side && activeColorPicker.dataset.context === "welcome") {
            closeColorPicker();
          } else {
            openColorPicker(btn, side, (selectedColor) => {
              if (side === "away") {
                awayColorObj = selectedColor;
              } else {
                homeColorObj = selectedColor;
              }
              renderWelcome();
            });
            if (activeColorPicker) {
              activeColorPicker.dataset.side = side;
              activeColorPicker.dataset.context = "welcome";
            }
          }
        });
      });

      // Fermeture par bouton X
      const closeBtn = popover.querySelector(".sa-modal-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          closeColorPicker();
          hidePopover(true);
        });
      }
    };

    renderWelcome();
    backdrop.className = "sa-visible";
  };

  let scheduled = false;
  const observer = new MutationObserver((mutations) => {
    try {
      // Ignorer les mutations générées par nos propres éléments (popover, backdrop, swap btn, welcome btn, color picker, settings modal)
      const onlyOurNodes = mutations.every((m) => {
        const el = m.target;
        return el && (
          el.id === "sa-popover" ||
          el.id === "sa-backdrop" ||
          el.id === "sa-swap-sides-btn" ||
          el.id === "sa-welcome-btn" ||
          el.id === "sa-color-picker" ||
          el.id === "sa-settings-overlay" ||
          el.id === "sa-fav-confirm-backdrop" ||
          (el.closest && (
            el.closest("#sa-popover") ||
            el.closest("#sa-backdrop") ||
            el.closest("#sa-swap-sides-btn") ||
            el.closest("#sa-welcome-btn") ||
            el.closest("#sa-color-picker") ||
            el.closest(".sa-team-color-btn") ||
            el.closest("#sa-settings-overlay") ||
            el.closest(".sa-favorites-code-list") ||
            el.closest(".sa-frequents-code-list") ||
            el.closest(".sa-summary-quick-grid") ||
            el.closest(".sa-quick-unavailable") ||
            el.closest(".sa-favorites-tab") ||
            el.closest(".sa-frequents-tab")
          ))
        );
      });
      if (onlyOurNodes) return;

      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        scan();
      });
    } catch (_) {}
  });

  window.addEventListener("spordle:modal-opened", () => {
    enhancePenaltyInfractionView();
    enhancePenaltySummaryView();
  });

  // Debug flag for page-bridge.js (page world, cannot read saStore): ?sa_debug=1 / ?sa_debug=0 persists it,
  // and it is handed to the bridge through a DOM attribute before the bridge is injected.
  const applyDebugFlag = () => {
    try {
      const param = new URLSearchParams(window.location.search).get("sa_debug");
      if (param === "1" || param === "true") saStore.setItem("sa_debug", "true");
      if (param === "0" || param === "false") saStore.removeItem("sa_debug");
      if (saStore.getItem("sa_debug") === "true") document.documentElement.dataset.saDebug = "true";
      else delete document.documentElement.dataset.saDebug;
    } catch (_) {}
  };

  // Nothing renders before stored options, colours and telemetry IDs are loaded (one async read at startup).
  const start = () => {
    applyDebugFlag();

    // Appliquer l'état initial (côtés inversés, couleurs) une fois les valeurs enregistrées chargées
    try {
      applySwapSidesState();
      applyTeamColors();
    } catch (_) {}

    const targetNode = document.body || document.documentElement;
    if (targetNode) {
      observer.observe(targetNode, { childList: true, subtree: true });
    }

    // Si le body n'était pas encore disponible lors du chargement initial
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", () => {
        try {
          applySwapSidesState();
          applyTeamColors();
          if (document.body && document.body !== targetNode) {
            observer.observe(document.body, { childList: true, subtree: true });
          }
        } catch (_) {}
        scan();
      });
    }

    scan();
  };

  saStore.ready.then(start, start);
})();

})();
