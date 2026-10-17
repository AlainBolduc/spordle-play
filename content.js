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

  // ---------- Gestion des fonctionnalités expérimentales (Feature Flags) ----------

  const isFeatureEnabled = (flag) => {
    try {
      if (typeof window !== "undefined" && window.location) {
        const params = new URLSearchParams(window.location.search);
        const featParam = params.get("features");
        if (featParam === "all" || (featParam && featParam.split(",").includes(flag))) {
          localStorage.setItem(`sa_feature_${flag}`, "true");
          return true;
        }
        const singleParam = params.get(flag);
        if (singleParam === "true" || singleParam === "1") {
          localStorage.setItem(`sa_feature_${flag}`, "true");
          return true;
        }
        if (params.get(`disable_${flag}`) === "true" || params.get(`disable_${flag}`) === "1") {
          localStorage.removeItem(`sa_feature_${flag}`);
          return false;
        }
      }
      return localStorage.getItem(`sa_feature_${flag}`) === "true";
    } catch (_) {
      return false;
    }
  };

  const setFeatureEnabled = (flag, enabled) => {
    try {
      if (enabled) {
        localStorage.setItem(`sa_feature_${flag}`, "true");
      } else {
        localStorage.removeItem(`sa_feature_${flag}`);
      }
    } catch (_) {}
  };

  const openSettingsModal = () => {
    const existing = document.getElementById("sa-settings-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "sa-settings-overlay";
    overlay.className = "sa-settings-overlay";

    const welcomeActive = isFeatureEnabled("welcome");
    const colorsActive = isFeatureEnabled("team_colors");

    overlay.innerHTML = `
      <div class="sa-settings-dialog" role="dialog" aria-labelledby="sa-settings-title">
        <div class="sa-settings-header">
          <h3 id="sa-settings-title">
            <span>⚙️</span> Spordle Annonceur — Options
          </h3>
          <button type="button" class="button button-clear ion-close-round sa-settings-close-btn" style="color: #adb5bd; font-size: 15px;"></button>
        </div>
        <div class="sa-settings-body">
          <p class="sa-settings-intro">
            Activez ou désactivez les fonctionnalités en cours de développement. Les options sont enregistrées sur cet appareil.
          </p>
          <label class="sa-settings-item">
            <div class="sa-settings-item-label">
              <span class="sa-settings-item-title">🎙️ Mot de bienvenue</span>
              <span class="sa-settings-item-desc">Annonce officielle d'avant-match avec couleurs et gardiens</span>
            </div>
            <div class="sa-toggle-switch">
              <input type="checkbox" id="sa-toggle-welcome"${welcomeActive ? " checked" : ""}>
              <span class="sa-toggle-slider"></span>
            </div>
          </label>
          <label class="sa-settings-item">
            <div class="sa-settings-item-label">
              <span class="sa-settings-item-title">🎨 Couleurs d'équipes</span>
              <span class="sa-settings-item-desc">Pastilles de sélection et boutons d'action colorés</span>
            </div>
            <div class="sa-toggle-switch">
              <input type="checkbox" id="sa-toggle-colors"${colorsActive ? " checked" : ""}>
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
          <button type="button" class="sa-settings-btn sa-settings-btn-primary" id="sa-settings-save">Enregistrer</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    const closeBtn = overlay.querySelector(".sa-settings-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", close);

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
          localStorage.removeItem(`sa_team_color_${gameKey}_away`);
          localStorage.removeItem(`sa_team_color_${gameKey}_home`);
          if (normAway) localStorage.removeItem(`sa_team_color_${normAway}`);
          if (normHome) localStorage.removeItem(`sa_team_color_${normHome}`);
          localStorage.removeItem("sa_jersey_away");
          localStorage.removeItem("sa_jersey_home");

          // Effacer l'inversion des côtés pour ce match
          localStorage.removeItem(getSwapStorageKey());

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
        const welcomeChecked = overlay.querySelector("#sa-toggle-welcome")?.checked || false;
        const colorsChecked = overlay.querySelector("#sa-toggle-colors")?.checked || false;

        setFeatureEnabled("welcome", welcomeChecked);
        setFeatureEnabled("team_colors", colorsChecked);

        close();

        // Réappliquer immédiatement les fonctionnalités
        applyTeamColors();
        scan();
      });
    }
  };

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

    // Options expérimentales (triple clic sur .game-number ou .game-category)
    setupSettingsTrigger();

    // Bouton d'inversion des côtés (Visiteur ⇄ Local)
    injectSwapSidesButton();

    // Bouton du mot de bienvenue officiel
    setupWelcomeButton();

    // Pastilles de couleurs des équipes
    injectTeamColorButtons();
  };

  // ---------- Récupération des données officielles de l'API Spordle ----------

  let cachedApiGameData = null;

  document.addEventListener("spordle:game-data", (e) => {
    if (e.detail) {
      cachedApiGameData = e.detail;
      applyTeamColors();
    }
  });

  const injectPageBridge = () => {
    try {
      if (document.getElementById("sa-page-bridge")) return;
      const script = document.createElement("script");
      script.id = "sa-page-bridge";
      script.textContent = `
        (() => {
          const origFetch = window.fetch;
          if (origFetch) {
            window.fetch = async function(...args) {
              const resp = await origFetch.apply(this, args);
              try {
                const url = (args[0] && args[0].url) || (typeof args[0] === "string" ? args[0] : "");
                if (/scoresheets|games|game_data/i.test(url)) {
                  const clone = resp.clone();
                  clone.json().then(data => {
                    if (data && (data.game || data.homeTeam || data.awayTeam)) {
                      window.__SPORDLE_GAME_DATA__ = data;
                      document.dispatchEvent(new CustomEvent("spordle:game-data", { detail: data }));
                    }
                  }).catch(() => {});
                }
              } catch (_) {}
              return resp;
            };
          }

          const origOpen = XMLHttpRequest.prototype.open;
          const origSend = XMLHttpRequest.prototype.send;
          XMLHttpRequest.prototype.open = function(method, url) {
            this.__sa_url = url;
            return origOpen.apply(this, arguments);
          };
          XMLHttpRequest.prototype.send = function() {
            this.addEventListener("load", function() {
              try {
                if (this.__sa_url && /scoresheets|games|game_data/i.test(this.__sa_url)) {
                  const data = JSON.parse(this.responseText);
                  if (data && (data.game || data.homeTeam || data.awayTeam)) {
                    window.__SPORDLE_GAME_DATA__ = data;
                    document.dispatchEvent(new CustomEvent("spordle:game-data", { detail: data }));
                  }
                }
              } catch (_) {}
            });
            return origSend.apply(this, arguments);
          };

          const checkAngular = () => {
            try {
              if (window.__SPORDLE_GAME_DATA__) return;
              const el = document.querySelector("hi-scoresheet");
              if (el && window.angular) {
                const ctrl = window.angular.element(el).controller("hiScoresheet");
                const scope = window.angular.element(el).scope();
                const g = ctrl?.$game || scope?.$game || scope?.$ctrl?.$game;
                if (g && (g.game || g.homeTeam || g.awayTeam)) {
                  window.__SPORDLE_GAME_DATA__ = g;
                  document.dispatchEvent(new CustomEvent("spordle:game-data", { detail: g }));
                }
              }
            } catch (_) {}
          };
          checkAngular();
          setInterval(checkAngular, 1000);

          if (window.__SPORDLE_GAME_DATA__) {
            document.dispatchEvent(new CustomEvent("spordle:game-data", { detail: window.__SPORDLE_GAME_DATA__ }));
          } else if (window.TEST_GAME_DATA) {
            document.dispatchEvent(new CustomEvent("spordle:game-data", { detail: window.TEST_GAME_DATA }));
          }
        })();
      `;
      const target = document.head || document.documentElement || document.body;
      if (target && typeof target.appendChild === "function") {
        target.appendChild(script);
      }
    } catch (_) {}
  };

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
        const raw = localStorage.getItem(`sa_team_color_${norm}`);
        if (raw) return JSON.parse(raw);
      }
      const rawSide = localStorage.getItem(`sa_team_color_${getGameKey()}_${side}`);
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
      const savedJersey = localStorage.getItem(`sa_jersey_${side}`);
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
        if (norm) localStorage.setItem(`sa_team_color_${norm}`, JSON.stringify(colorObj));
        localStorage.setItem(`sa_team_color_${getGameKey()}_${side}`, JSON.stringify(colorObj));
        localStorage.setItem(`sa_jersey_${side}`, spoken);
      } else {
        if (norm) localStorage.removeItem(`sa_team_color_${norm}`);
        localStorage.removeItem(`sa_team_color_${getGameKey()}_${side}`);
        localStorage.removeItem(`sa_jersey_${side}`);
      }
    } catch (_) {}
    applyTeamColors();
  };

  const applyTeamColors = () => {
    if (!document.body) return;
    const root = document.documentElement;

    if (!isFeatureEnabled("team_colors")) {
      document.body.classList.remove("sa-has-away-color");
      document.body.classList.remove("sa-has-home-color");
      root.style.removeProperty("--sa-away-color");
      root.style.removeProperty("--sa-away-text-color");
      root.style.removeProperty("--sa-away-border-color");
      root.style.removeProperty("--sa-home-color");
      root.style.removeProperty("--sa-home-text-color");
      root.style.removeProperty("--sa-home-border-color");
      root.style.removeProperty("--sa-home-border-badge");
      root.style.removeProperty("--sa-home-text-badge");
      document.querySelectorAll(".sa-team-color-btn").forEach(el => el.remove());
      closeColorPicker();
      return;
    }

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
      if (typeof onColorSelected === "function") {
        onColorSelected(null);
      }
      closeColorPicker();
    });

    activeColorPicker = pop;
  };

  const injectTeamColorButtons = () => {
    if (!isFeatureEnabled("team_colors")) {
      document.querySelectorAll(".sa-team-color-btn").forEach(el => el.remove());
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

  const getSwapStorageKey = () => `sa_swap_sides_${getGameKey()}`;

  const isSidesSwappedForCurrentGame = () => {
    try {
      return localStorage.getItem(getSwapStorageKey()) === "true";
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
      labelSpan.textContent = isSwapped ? "Côtés inversés" : "Inverser côtés";
    }
    btn.title = isSwapped
      ? "Disposition inversée : Local à gauche, Visiteur à droite.\nCliquez pour rétablir la disposition normale pour ce match."
      : "Disposition normale : Visiteur à gauche, Local à droite.\nCliquez pour inverser les côtés pour correspondre à votre vue de la patinoire pour ce match.";
  };

  const injectSwapSidesButton = () => {
    const existing = document.getElementById("sa-swap-sides-btn");
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
    const items = [...document.querySelectorAll(".summary-item")];
    items.forEach((item) => {
      const ev = readEvent(item);
      if (ev && ev.type === "goalie") {
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
    if (!isFeatureEnabled("welcome")) {
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

  const openWelcomeModal = () => {
    ensureElements();
    pinned = true;

    // Catégorie issue des données de l'API (i18n.fr.name = "M12 AA")
    const category = getGameCategoryName();
    const awayTeam = getTeamName("away");
    const homeTeam = getTeamName("home");

    const apiJerseys = getInitialJerseysFromApi();
    let awayColorObj = getTeamColor("away");
    let homeColorObj = getTeamColor("home");

    const goalies = getGoaliesFromSummary();

    const renderWelcome = () => {
      const awayJersey = awayColorObj
        ? (awayColorObj.spoken || awayColorObj.name.toLowerCase())
        : (localStorage.getItem("sa_jersey_away") || apiJerseys.awayJersey);
      const homeJersey = homeColorObj
        ? (homeColorObj.spoken || homeColorObj.name.toLowerCase())
        : (localStorage.getItem("sa_jersey_home") || apiJerseys.homeJersey);

      const data = SpordleEngine.formatWelcomeMessage({
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
            `<div class="sa-line">${data.htmlLines[0]}</div>` +
            `<div class="sa-line">${data.htmlLines[1]}</div>` +
            `<div class="sa-line">${data.htmlLines[2]}</div>` +
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

  // Appliquer l'état initial dès le chargement
  try {
    injectPageBridge();
  } catch (_) {}
  try {
    applySwapSidesState();
    applyTeamColors();
  } catch (_) {}

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
          (el.closest && (
            el.closest("#sa-popover") ||
            el.closest("#sa-backdrop") ||
            el.closest("#sa-swap-sides-btn") ||
            el.closest("#sa-welcome-btn") ||
            el.closest("#sa-color-picker") ||
            el.closest(".sa-team-color-btn") ||
            el.closest("#sa-settings-overlay")
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
})();



