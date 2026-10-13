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

  // Durée annoncée selon la sévérité
  const DURATIONS = [
    [/double\s*mineure/i, "4 minutes"],
    [/mineure\s*de\s*banc/i, "2 minutes"],
    [/mineure/i, "2 minutes"],
    [/majeure/i, "5 minutes"],
    [/inconduite\s*de\s*match|match/i, ""],
    [/grossi[eè]re/i, ""],
    [/inconduite/i, "10 minutes"],
  ];

  // "- A22 - Coup de bâton (Mineure)" -> { code, infraction, severity, duration }
  const parsePenalty = (text) => {
    let s = clean(text).replace(/^[\-–—:,\s]+/, "");
    let severity = "";
    const sevMatch = s.match(/\(([^()]+)\)\s*$/);
    if (sevMatch) {
      severity = clean(sevMatch[1]);
      s = clean(s.slice(0, sevMatch.index));
    }
    const parts = s.split(/\s+[\-–—]\s+/).map(clean).filter(Boolean);
    let code = "";
    if (parts.length && /^[A-Z]{1,2}\d{1,3}[a-z]?$/i.test(parts[0])) code = parts.shift();
    const infraction = parts.join(" - ");
    const found = DURATIONS.find(([re]) => re.test(severity));
    return { code, infraction, severity, duration: found ? found[1] : "" };
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

  const readEvent = (summaryItem) => {
    const actionEl = summaryItem.querySelector(".action");
    if (!actionEl) return null;
    const cls = actionEl.classList;
    const type = cls.contains("goal") ? "goal" : cls.contains("penalty") ? "penalty" : null;
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

  const timeLine = (ev) => {
    if (!ev.time) return "";
    const period = ev.period ? ` de la ${escapeHtml(ev.period)}` : "";
    const label = ev.type === "penalty" ? "Le temps de la pénalité" : "Le temps du but";
    return `<div class="sa-line">${label} : <strong>${escapeHtml(ev.time)}</strong>${period}.</div>`;
  };

  const SPECIAL_GOAL_FLAGS = [
    { regex: /\[(?:AN|PP)\]/i, label: "en avantage numérique" },
    { regex: /\[(?:DN|SH|IN)\]/i, label: "en infériorité numérique" },
    { regex: /\[(?:FD|EN)\]/i, label: "dans un filet désert" },
  ];

  const buildGoal = (ev) => {
    // Détecte les mentions spéciales [AN], [DN], [FD]
    const specials = [];
    for (const flag of SPECIAL_GOAL_FLAGS) {
      if (flag.regex.test(ev.details)) {
        specials.push(flag.label);
      }
    }

    // Nettoie les balises [AN], [DN], [FD] des détails pour le parsing des noms
    const cleanDetails = ev.details.replace(/\[(?:AN|PP|DN|SH|IN|FD|EN)\]/gi, "").trim();

    // Format observé : "MAYSON GOSSELIN (77)  - PASSES: ARNO ALLAIRE (21)"
    const [scorerPart, ...rest] = cleanDetails.split(/\b(?:PASSES?|ASSISTS?|AIDES?)\s*:/i);
    const scorer = parsePlayers(scorerPart)[0];
    const assists = parsePlayers(rest.join(" "));

    const opening = ev.rank
      ? `Le <strong>${ordinal(ev.rank)}</strong> but des <strong>${escapeHtml(ev.team)}</strong>,`
      : `But des <strong>${escapeHtml(ev.team)}</strong>,`;
    const lines = [`<div class="sa-line">${opening}</div>`];

    if (scorer) {
      lines.push(`<div class="sa-line">marqué par le ${playerHtml(scorer)}.</div>`);
    } else if (cleanDetails) {
      lines.push(`<div class="sa-line">${escapeHtml(cleanDetails)}</div>`);
    }

    if (assists.length) {
      const parts = assists.map((a) => `du ${playerHtml(a)}`);
      lines.push(`<div class="sa-line">Aidé ${parts.join(", et ")}.</div>`);
    } else if (scorer) {
      lines.push(`<div class="sa-line">Sans aide.</div>`);
    }

    // Ajoute la mention spéciale si présente (ex: "But marqué en avantage numérique")
    if (specials.length) {
      lines.push(`<div class="sa-line">Marqué <strong>${escapeHtml(specials.join(" et "))}</strong>.</div>`);
    }

    lines.push(timeLine(ev));
    return lines.join("");
  };

  const buildPenalty = (ev) => {
    // Nettoie les chips comme "1 OAN", "2 OAN" qui polluent le texte de Spordle
    const cleanDetails = ev.details.replace(/\d+\s*OAN/gi, "").trim();

    const players = parsePlayers(cleanDetails);
    const player = players[0];

    const lines = [`<div class="sa-line">Pénalité aux <strong>${escapeHtml(ev.team)}</strong>,</div>`];

    if (player) {
      lines.push(`<div class="sa-line">au ${playerHtml(player)},</div>`);
      // Format observé : "ANTOINE GAGNON (64) - A52 - Accrocher (Mineure)"
      const idx = cleanDetails.indexOf(`(${player.number})`);
      const rest = clean(cleanDetails.slice(idx + player.number.length + 2));
      const pen = parsePenalty(rest);
      const dur = pen.duration ? `<strong>${escapeHtml(pen.duration)}</strong>` : "<strong>2 minutes</strong>";
      const inf = pen.infraction ? `pour ${escapeHtml(pen.infraction.toLowerCase())}` : "";
      lines.push(`<div class="sa-line">${[dur, inf].filter(Boolean).join(" ")}.</div>`);
    } else if (cleanDetails) {
      lines.push(`<div class="sa-line">${escapeHtml(cleanDetails)}</div>`);
    }

    lines.push(timeLine(ev));
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

  const renderEvent = (summaryItem) => () => {
    const ev = readEvent(summaryItem);
    if (!ev) return null;
    const title = ev.type === "goal" ? "🚨 But" : "⛔ Pénalité";
    return {
      type: ev.type,
      title: `${title} — ${escapeHtml(ev.team)}`,
      body: ev.type === "goal" ? buildGoal(ev) : buildPenalty(ev),
    };
  };

  const showPopover = (render, summaryItem, isPinned = false) => {
    const content = render();
    if (!content) return;
    ensureElements();

    pinned = isPinned;
    currentOpenItem = summaryItem;

    popover.className = `sa-visible sa-${content.type}`;
    popover.innerHTML =
      `<button type="button" class="sa-close-btn" aria-label="Fermer">&times;</button>` +
      `<div class="sa-title">${content.title}</div>` +
      content.body +
      `<div class="sa-hint">Cliquer n'importe où, sur le bouton ✕ ou sur Échap pour fermer.</div>`;

    // Clic sur le bouton X pour fermer immédiatement
    const closeBtn = popover.querySelector(".sa-close-btn");
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
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 4.01a1 1 0 0 0-1.05-.08L14 7.27V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1v4a1 1 0 0 0 1.6.8l4.8-3.6H12a2 2 0 0 0 2-2v-2.27l5.95 3.34a1 1 0 0 0 1.05-.08A1 1 0 0 0 22 19V5a1 1 0 0 0-1-.99zM12 15H5V5h7v10zm8 1.93-6-3.37V6.44l6-3.37v13.86zM8 19v-2h2.67L8 19z"/></svg>`;
    btn.title = "Afficher / masquer le texte de l'annonceur";
    btn.setAttribute("aria-label", "Annonce vocale");

    // Survol : affiche si aucun popover n'est épinglé
    btn.addEventListener("mouseenter", () => {
      if (!pinned) {
        showPopover(render, summaryItem, false);
      }
    });

    btn.addEventListener("mouseleave", () => {
      if (!pinned) {
        hidePopover(false);
      }
    });

    // Clic : TOGGLE ON / OFF
    btn.addEventListener("click", (e) => {
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
    
    // Placé STRICTEMENT à gauche de la zone d'actions (.modify / crayon et X)
    const modifyEl = summaryItem.querySelector(".modify");
    if (modifyEl) {
      modifyEl.before(btn);
    } else {
      summaryItem.appendChild(btn);
    }
    summaryItem.classList.add("sa-has-btn");
  };

  const scan = () => {
    document.querySelectorAll(".summary-item").forEach((item) => {
      const action = item.querySelector(".action");
      if (action && (action.classList.contains("goal") || action.classList.contains("penalty"))) {
        decorate(item);
      }
    });
  };

  let scheduled = false;
  const observer = new MutationObserver(() => {
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
