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

  // Adapte phonétiquement le texte pour la synthèse vocale (TTS)
  const cleanForSpeech = (text) => {
    if (typeof SpordleEngine !== "undefined" && SpordleEngine.utils && SpordleEngine.utils.cleanForSpeech) {
      return SpordleEngine.utils.cleanForSpeech(text);
    }
    if (!text) return "";
    return text
      .replace(/<[^>]+>/g, " ")
      .replace(/\b1(?:re|er)\s+p[eé]riode\b/gi, "première période")
      .replace(/\b2e\s+p[eé]riode\b/gi, "deuxième période")
      .replace(/\b3e\s+p[eé]riode\b/gi, "troisième période")
      .replace(/\b4e\s+p[eé]riode\b/gi, "quatrième période")
      .replace(/\b00?:0?1\b/g, "1 seconde")
      .replace(/\b00?:0?(\d+)\b/g, "$1 secondes")
      .replace(/\b1:00\b/g, "1 minute")
      .replace(/\b1:01\b/g, "1 minute et 1 seconde")
      .replace(/\b1:0(\d)\b/g, "1 minute et $1 secondes")
      .replace(/\b1:(\d{2})\b/g, "1 minute $1")
      .replace(/\b(\d+):00\b/g, "$1 minutes")
      .replace(/\b(\d+):01\b/g, "$1 minutes et 1 seconde")
      .replace(/\b(\d+):0(\d)\b/g, "$1 minutes et $2 secondes")
      .replace(/\b(\d+):(\d{2})\b/g, "$1 minutes $2")
      .replace(/\s*:\s*/g, ", ")
      .replace(/\s+/g, " ")
      .trim();
  };

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
      return {
        html: formatted.htmlLines.map((l) => `<div class="sa-line">${l}</div>`).join(""),
        speechText: formatted.speechText
      };
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

    return {
      html: lines.join(""),
      speechText: cleanForSpeech(lines.join(" "))
    };
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

      return {
        html: formatted.htmlLines.map((l) => `<div class="sa-line">${l}</div>`).join(""),
        speechText: formatted.speechText
      };
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
    return {
      html: lines.join(""),
      speechText: cleanForSpeech(lines.join(" "))
    };
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
        return {
          html: formatted.htmlLines.map((l) => `<div class="sa-line">${l}</div>`).join(""),
          speechText: formatted.speechText
        };
      } else if (isPulled) {
        // Gardien retiré (ex: 6e attaquant ou fin de match)
        const lines = [
          `<div class="sa-line">Le gardien de but des <strong>${escapeHtml(ev.team)}</strong> est retiré de son filet.</div>`
        ];
        if (ev.time) {
          lines.push(`<div class="sa-line">Le temps du retrait : <strong>${escapeHtml(ev.time)}</strong>${ev.period ? ` de la ${escapeHtml(ev.period)}` : ""}.</div>`);
        }
        return {
          html: lines.join(""),
          speechText: cleanForSpeech(lines.join(" "))
        };
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
    return {
      html: lines.join(""),
      speechText: cleanForSpeech(lines.join(" "))
    };
  };

  const getTeamLogo = (side) => {
    const el = document.querySelector(`.score-${side}.score-logo .hi-logo`) || document.querySelector(`.score-${side}.score-logo`);
    return el?.style?.backgroundImage || "";
  };

  // ---------- Synthèse vocale (Text-To-Speech & Gemini IA) ----------

  let currentUtterance = null;
  let currentAudio = null;
  let isSpeaking = false;
  let settingsModal = null;

  const GEMINI_VOICES = [
    { id: "Puck", name: "Puck (Homme — le plus dynamique & énergique, style aréna)", gender: "male" },
    { id: "Fenrir", name: "Fenrir (Homme — puissant & grave)", gender: "male" },
    { id: "Kore", name: "Kore (Femme — très vive & dynamique)", gender: "female" },
    { id: "Charon", name: "Charon (Homme — posé & officiel)", gender: "male" },
    { id: "Aoede", name: "Aoede (Femme — chaleureuse & claire)", gender: "female" },
  ];

  const getGeminiStylePrompt = (styleKey = "extreme") => {
    switch (styleKey) {
      case "extreme":
        return "Annonceur maison officiel dans un aréna de hockey sur glace québécois. Ton extrêmement survolté, passionné, très énergique, percutant et vibrant au micro devant une foule en délire ! Voix puissante, fière et projetée avec enthousiasme communicatif.";
      case "high":
        return "Annonceur maison officiel dans un aréna de hockey québécois. Ton très énergique, dynamique, percutant, fier et enthousiaste au micro devant la foule de l'aréna ! Voix puissante et rythmée.";
      case "classic":
        return "Annonceur de match officiel. Ton posé, professionnel, classique, articulé et clair au micro.";
      default:
        return "Annonceur maison officiel dans un aréna de hockey québécois. Ton très énergique, percutant et dynamique au micro de l'aréna !";
    }
  };

  const writePcmString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const pcmToWav = (pcmBase64, sampleRate = 24000) => {
    const binaryStr = atob(pcmBase64);
    const len = binaryStr.length;
    const buffer = new ArrayBuffer(44 + len);
    const view = new DataView(buffer);

    writePcmString(view, 0, "RIFF");
    view.setUint32(4, 36 + len, true);
    writePcmString(view, 8, "WAVE");

    writePcmString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);

    writePcmString(view, 36, "data");
    view.setUint32(40, len, true);

    const bytes = new Uint8Array(buffer, 44);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const blob = new Blob([buffer], { type: "audio/wav" });
    return URL.createObjectURL(blob);
  };

  const scoreVoice = (v) => {
    if (!v || !v.lang) return 0;
    const lang = v.lang.toLowerCase().replace("_", "-");
    const name = (v.name || "").toLowerCase();
    const isCA = lang === "fr-ca" || name.includes("canada") || name.includes("canad");
    const isFR = lang.startsWith("fr") || name.includes("french") || name.includes("français");
    if (!isFR) return 0;

    let score = isCA ? 1000 : 100;
    if (name.includes("premium")) score += 500;
    else if (name.includes("enhanced") || name.includes("amélior") || name.includes("amelior")) score += 400;
    else if (name.includes("natural") || name.includes("online")) score += 350;
    else if (name.includes("siri")) score += 300;
    else if (name.includes("google")) score += 250;

    if (name.includes("compact")) score -= 200;
    return score;
  };

  const getAvailableFrenchVoices = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
    const voices = window.speechSynthesis.getVoices() || [];
    const frVoices = voices.filter((v) => {
      const l = (v.lang || "").toLowerCase().replace("_", "-");
      const n = (v.name || "").toLowerCase();
      return l.startsWith("fr") || n.includes("french") || n.includes("français");
    });
    return frVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));
  };

  const getBestFrenchVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;

    try {
      const savedVoice = localStorage.getItem("sa_tts_voice_name");
      if (savedVoice) {
        const found = voices.find((v) => v.name === savedVoice);
        if (found) return found;
      }
    } catch (_) {}

    const sorted = getAvailableFrenchVoices();
    return sorted.length > 0 ? sorted[0] : null;
  };

  const populateVoiceSelect = (selectEl) => {
    if (!selectEl) return;
    const apiKey = (localStorage.getItem("sa_gemini_api_key") || "").trim();
    const currentEngine = localStorage.getItem("sa_tts_engine") || (apiKey ? "gemini" : "local");
    const geminiVoice = localStorage.getItem("sa_gemini_voice") || "Fenrir";

    selectEl.style.display = "inline-block";
    selectEl.innerHTML = "";

    // Groupe Gemini IA
    const geminiGroup = document.createElement("optgroup");
    geminiGroup.label = "✨ Voix IA Réaliste (Gemini)";

    if (apiKey) {
      GEMINI_VOICES.forEach((gv) => {
        const opt = document.createElement("option");
        opt.value = `gemini:${gv.id}`;
        opt.textContent = `✨ ${gv.id} (IA)`;
        if (currentEngine === "gemini" && geminiVoice === gv.id) {
          opt.selected = true;
        }
        geminiGroup.appendChild(opt);
      });
    } else {
      const optCfg = document.createElement("option");
      optCfg.value = "__configure_gemini__";
      optCfg.textContent = "⚙️ Activer Gemini IA...";
      geminiGroup.appendChild(optCfg);
    }
    selectEl.appendChild(geminiGroup);

    // Groupe Voix locales
    const localGroup = document.createElement("optgroup");
    localGroup.label = "🤖 Voix de l'appareil (Hors-ligne)";

    const frVoices = getAvailableFrenchVoices();
    const activeLocalVoice = getBestFrenchVoice();

    if (frVoices.length > 0) {
      frVoices.forEach((v) => {
        const opt = document.createElement("option");
        opt.value = `local:${v.name}`;
        let label = v.name
          .replace(/\s*\(French\s*\([A-Za-z\s]+\)\)/gi, "")
          .replace(/\s*\(Français\s*\([A-Za-z\s]+\)\)/gi, "")
          .trim();
        const isCA = (v.lang || "").toLowerCase().includes("ca") || v.name.toLowerCase().includes("canad");
        if (isCA && !label.includes("QC") && !label.includes("CA") && !label.includes("Canad")) {
          label += " (QC)";
        }
        opt.textContent = label;
        if (currentEngine === "local" && activeLocalVoice && activeLocalVoice.name === v.name) {
          opt.selected = true;
        }
        localGroup.appendChild(opt);
      });
    } else {
      const optDefault = document.createElement("option");
      optDefault.value = "local:default";
      optDefault.textContent = "Voix système standard";
      if (currentEngine === "local") optDefault.selected = true;
      localGroup.appendChild(optDefault);
    }
    selectEl.appendChild(localGroup);

    selectEl.onchange = (e) => {
      const val = e.target.value;
      if (val === "__configure_gemini__") {
        openSettingsModal();
        populateVoiceSelect(selectEl);
        return;
      }
      if (val.startsWith("gemini:")) {
        const vId = val.replace("gemini:", "");
        localStorage.setItem("sa_tts_engine", "gemini");
        localStorage.setItem("sa_gemini_voice", vId);
      } else if (val.startsWith("local:")) {
        const vName = val.replace("local:", "");
        localStorage.setItem("sa_tts_engine", "local");
        if (vName !== "default") {
          localStorage.setItem("sa_tts_voice_name", vName);
        }
      }
    };
  };

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (_) {}
      currentAudio = null;
    }
    isSpeaking = false;
    currentUtterance = null;
    if (popover) {
      const btn = popover.querySelector(".sa-tts-btn");
      if (btn) {
        btn.classList.remove("sa-speaking");
        const icon = btn.querySelector(".sa-tts-icon");
        if (icon) icon.className = "icon ion-volume-high sa-tts-icon";
        const label = btn.querySelector(".sa-tts-label");
        if (label) label.textContent = "Annoncer vocalement";
      }
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const playGeminiSpeech = async (text, btn) => {
    const apiKey = (localStorage.getItem("sa_gemini_api_key") || "").trim();
    if (!apiKey) {
      openSettingsModal();
      return;
    }

    stopSpeech();

    isSpeaking = true;
    if (btn) {
      btn.classList.add("sa-speaking");
      const icon = btn.querySelector(".sa-tts-icon");
      if (icon) icon.className = "icon ion-load-c sa-spin sa-tts-icon";
      const label = btn.querySelector(".sa-tts-label");
      if (label) label.textContent = "Génération IA...";
    }

    const voiceName = localStorage.getItem("sa_gemini_voice") || "Puck";
    const styleKey = localStorage.getItem("sa_gemini_style") || "extreme";
    const stylePrompt = getGeminiStylePrompt(styleKey);
    const prompt = `${stylePrompt}\n\nLis UNIQUEMENT l'annonce suivante au micro mot pour mot avec cette énergie festive, sans phrase d'introduction ni de conclusion :\n\n${text}`;

    try {
      const candidateModels = [
        "gemini-3.8-flash-lite-tts",
        "gemini-3.8-flash-tts",
        "gemini-3.1-flash-tts-preview",
        "gemini-2.5-flash-preview-tts",
        "gemini-3.8-flash"
      ];
      let audioData = null;
      let lastError = null;

      for (const model of candidateModels) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const isTtsModel = model.includes("-tts");
            const contents = isTtsModel
              ? [
                  {
                    role: "user",
                    parts: [
                      {
                        text: text,
                        speechMetadata: { style: stylePrompt },
                        speech_metadata: { style: stylePrompt }
                      }
                    ]
                  }
                ]
              : [
                  {
                    role: "user",
                    parts: [{ text: prompt }]
                  }
                ];

            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: contents,
                generationConfig: {
                  responseModalities: ["AUDIO"],
                  speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: {
                        voiceName: voiceName
                      }
                    }
                  }
                }
              })
            });

            if (!res.ok) {
              const errJson = await res.json().catch(() => ({}));
              const errMsg = errJson?.error?.message || `Erreur HTTP ${res.status}`;
              if (errMsg.includes("API key not valid") || errMsg.includes("API_KEY_INVALID")) {
                throw new Error("Clé d'API invalide. Veuillez vérifier votre clé Google AI Studio.");
              }

              const isHighDemand =
                res.status === 503 ||
                res.status === 429 ||
                errMsg.includes("high demand") ||
                errMsg.includes("temporarily");

              if (isHighDemand && attempt === 0) {
                console.warn(`[Spordle Annonceur] Forte demande sur ${model}, réessai dans 1.2s...`);
                await sleep(1200);
                continue;
              }

              lastError = new Error(errMsg);
              break; // Passe au modèle candidat suivant
            }

            const json = await res.json();
            const parts = json?.candidates?.[0]?.content?.parts || [];
            let foundAudio = null;
            for (const p of parts) {
              if (p.inlineData && p.inlineData.data) {
                foundAudio = p.inlineData;
                break;
              }
            }

            if (!foundAudio) {
              console.warn(`[Spordle Annonceur] Pas de flux audio retourné par ${model}, essai du modèle suivant...`);
              lastError = new Error(`Le modèle ${model} n'a pas retourné de données audio.`);
              break; // Passe au modèle suivant
            }

            audioData = foundAudio;
            break; // Modèle exécuté avec succès
          } catch (e) {
            if (e.message.includes("Clé d'API invalide")) throw e;
            lastError = e;
            console.warn(`[Spordle Annonceur] Tentative ${attempt + 1} échouée sur ${model}:`, e.message);
            if (attempt === 0) {
              await sleep(1000);
            }
          }
        }
        if (audioData) break;
      }

      if (!audioData) {
        throw lastError || new Error("Les serveurs Google IA sont temporairement surchargés.");
      }

      let audioSrc;
      const mime = (audioData.mimeType || "audio/wav").toLowerCase();
      if (mime.includes("pcm") || mime.includes("l16")) {
        const rateMatch = mime.match(/rate=(\d+)/);
        const rate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
        audioSrc = pcmToWav(audioData.data, rate);
      } else {
        audioSrc = `data:${mime};base64,${audioData.data}`;
      }

      const audio = new Audio(audioSrc);
      currentAudio = audio;

      if (btn) {
        const icon = btn.querySelector(".sa-tts-icon");
        if (icon) icon.className = "icon ion-stop sa-tts-icon";
        const label = btn.querySelector(".sa-tts-label");
        if (label) label.textContent = "Arrêter l'annonce";
      }

      audio.onended = () => {
        stopSpeech();
      };
      audio.onerror = (e) => {
        console.error("[Spordle Annonceur] Erreur lecture audio Gemini:", e);
        stopSpeech();
      };

      await audio.play();
    } catch (err) {
      console.warn("[Spordle Annonceur] Erreur Gemini:", err);
      stopSpeech();
      const retryLocal = confirm(
        `Impossible d'utiliser la voix IA Gemini (${err.message}).\n\nSouhaitez-vous utiliser la voix intégrée de l'appareil à la place ?`
      );
      if (retryLocal) {
        playLocalSpeech(text, btn);
      }
    }
  };

  const playLocalSpeech = (text, btn) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    stopSpeech();

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestFrenchVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || "fr-CA";
    } else {
      utterance.lang = "fr-CA";
    }

    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      isSpeaking = true;
      if (btn) {
        btn.classList.add("sa-speaking");
        const icon = btn.querySelector(".sa-tts-icon");
        if (icon) icon.className = "icon ion-stop sa-tts-icon";
        const label = btn.querySelector(".sa-tts-label");
        if (label) label.textContent = "Arrêter l'annonce";
      }
    };

    utterance.onend = () => {
      stopSpeech();
    };

    utterance.onerror = (err) => {
      if (err.error !== "interrupted" && err.error !== "canceled") {
        console.warn("[Spordle Annonceur] Synthèse vocale arrêtée:", err);
      }
      stopSpeech();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const playSpeech = (text, btn) => {
    const engineMode = localStorage.getItem("sa_tts_engine") || "local";
    const apiKey = (localStorage.getItem("sa_gemini_api_key") || "").trim();

    if (engineMode === "gemini" && apiKey) {
      playGeminiSpeech(text, btn);
    } else {
      playLocalSpeech(text, btn);
    }
  };

  const toggleSpeech = (text, btn) => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      playSpeech(text, btn);
    }
  };

  const closeSettingsModal = () => {
    if (settingsModal && document.body.contains(settingsModal)) {
      document.body.removeChild(settingsModal);
      settingsModal = null;
    }
  };

  const openSettingsModal = () => {
    closeSettingsModal();

    const currentKey = localStorage.getItem("sa_gemini_api_key") || "";
    const currentEngine = localStorage.getItem("sa_tts_engine") || (currentKey ? "gemini" : "local");
    const currentVoice = localStorage.getItem("sa_gemini_voice") || "Puck";
    const currentStyle = localStorage.getItem("sa_gemini_style") || "extreme";

    const backdropEl = document.createElement("div");
    backdropEl.id = "sa-settings-backdrop";

    const voiceOptionsHtml = GEMINI_VOICES.map(
      (v) => `<option value="${escapeHtml(v.id)}" ${currentVoice === v.id ? "selected" : ""}>${escapeHtml(v.name)}</option>`
    ).join("");

    backdropEl.innerHTML = `
      <div class="sa-settings-card" role="dialog" aria-modal="true">
        <div class="sa-settings-title">
          <span>🎙️ Voix IA Réaliste — Configuration Gemini</span>
          <button type="button" class="sa-settings-close-btn" aria-label="Fermer">✕</button>
        </div>
        <div class="sa-settings-desc">
          Propulsez vos annonces avec la voix d'un annonceur sportif réaliste grâce à <strong>Gemini Flash</strong> (gratuit avec votre compte Google sur Google AI Studio).
        </div>

        <div class="sa-form-group">
          <label class="sa-form-label">Mode d'annonce vocale :</label>
          <div class="sa-radio-group">
            <label class="sa-radio-label">
              <input type="radio" name="sa_engine_mode" value="gemini" ${currentEngine === "gemini" ? "checked" : ""}>
              <span>✨ Voix IA Réaliste (Gemini Flash)</span>
            </label>
            <label class="sa-radio-label">
              <input type="radio" name="sa_engine_mode" value="local" ${currentEngine === "local" ? "checked" : ""}>
              <span>🤖 Voix locale de l'appareil (100% hors-ligne)</span>
            </label>
          </div>
        </div>

        <div class="sa-gemini-fields" style="${currentEngine === "gemini" ? "" : "opacity: 0.5;"}">
          <div class="sa-form-group">
            <label class="sa-form-label" for="sa-gemini-key-input">
              <span>Clé d'API Google AI Studio :</span>
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" class="sa-link-hint">Obtenir gratuitement ↗</a>
            </label>
            <div class="sa-key-input-wrapper">
              <input type="password" id="sa-gemini-key-input" class="sa-input-text" placeholder="Collez votre clé AIzaSy..." value="${escapeHtml(currentKey)}" autocomplete="off" />
              <button type="button" class="sa-toggle-key-btn" title="Afficher / Masquer la clé">👁️</button>
            </div>
            <div class="sa-field-hint">Votre clé est enregistrée uniquement dans votre navigateur sur cet appareil.</div>
          </div>

          <div class="sa-form-group">
            <label class="sa-form-label" for="sa-gemini-voice-select">Voix de l'annonceur Gemini :</label>
            <select id="sa-gemini-voice-select" class="sa-select-input">
              ${voiceOptionsHtml}
            </select>
          </div>

          <div class="sa-form-group">
            <label class="sa-form-label" for="sa-gemini-style-select">Niveau d'énergie & dynamisme :</label>
            <select id="sa-gemini-style-select" class="sa-select-input">
              <option value="extreme" ${currentStyle === "extreme" ? "selected" : ""}>🔥 Aréna survolté (Maximum d'énergie & punch)</option>
              <option value="high" ${currentStyle === "high" ? "selected" : ""}>⚡ Énergique standard (Annonceur aréna pro)</option>
              <option value="classic" ${currentStyle === "classic" ? "selected" : ""}>🎙️ Classique & Posé (Ton calme)</option>
            </select>
          </div>
        </div>

        <div class="sa-settings-actions">
          ${currentKey ? `<button type="button" class="sa-btn-danger" id="sa-btn-delete-key">Effacer la clé</button>` : ""}
          <button type="button" class="sa-btn-test" id="sa-btn-test-voice">🔊 Tester</button>
          <button type="button" class="sa-btn-secondary" id="sa-btn-cancel">Annuler</button>
          <button type="button" class="sa-btn-primary" id="sa-btn-save">Enregistrer</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdropEl);
    settingsModal = backdropEl;

    const closeBtn = backdropEl.querySelector(".sa-settings-close-btn");
    closeBtn?.addEventListener("click", closeSettingsModal);

    const cancelBtn = backdropEl.querySelector("#sa-btn-cancel");
    cancelBtn?.addEventListener("click", closeSettingsModal);

    backdropEl.addEventListener("click", (e) => {
      if (e.target === backdropEl) closeSettingsModal();
    });

    const radioGemini = backdropEl.querySelector('input[value="gemini"]');
    const radioLocal = backdropEl.querySelector('input[value="local"]');
    const geminiFields = backdropEl.querySelector(".sa-gemini-fields");

    const updateFieldsState = () => {
      if (geminiFields) {
        geminiFields.style.opacity = radioGemini?.checked ? "1" : "0.5";
      }
    };
    radioGemini?.addEventListener("change", updateFieldsState);
    radioLocal?.addEventListener("change", updateFieldsState);

    const keyInput = backdropEl.querySelector("#sa-gemini-key-input");
    const toggleKeyBtn = backdropEl.querySelector(".sa-toggle-key-btn");
    toggleKeyBtn?.addEventListener("click", () => {
      if (keyInput) {
        keyInput.type = keyInput.type === "password" ? "text" : "password";
      }
    });

    const voiceSelect = backdropEl.querySelector("#sa-gemini-voice-select");
    const styleSelect = backdropEl.querySelector("#sa-gemini-style-select");

    // Bouton Test
    const testBtn = backdropEl.querySelector("#sa-btn-test-voice");
    testBtn?.addEventListener("click", async () => {
      const testKey = (keyInput?.value || "").trim();
      const testVoice = voiceSelect?.value || "Puck";
      const testStyle = styleSelect?.value || "extreme";
      if (!testKey) {
        alert("Veuillez d'abord coller votre clé d'API pour tester.");
        return;
      }
      testBtn.disabled = true;
      testBtn.textContent = "Génération...";
      try {
        localStorage.setItem("sa_gemini_api_key", testKey);
        localStorage.setItem("sa_gemini_voice", testVoice);
        localStorage.setItem("sa_gemini_style", testStyle);
        await playGeminiSpeech(
          "Le premier but des Remparts ! Marqué par le numéro 77, Mayson Gosselin ! Le temps du but, 7 minutes 48 de la première période."
        );
      } catch (err) {
        alert("Erreur test : " + err.message);
      } finally {
        testBtn.disabled = false;
        testBtn.textContent = "🔊 Tester";
      }
    });

    // Bouton Delete
    const deleteBtn = backdropEl.querySelector("#sa-btn-delete-key");
    deleteBtn?.addEventListener("click", () => {
      if (confirm("Supprimer la clé Gemini enregistrée ?")) {
        localStorage.removeItem("sa_gemini_api_key");
        localStorage.setItem("sa_tts_engine", "local");
        closeSettingsModal();
        const sel = popover?.querySelector(".sa-voice-select");
        if (sel) populateVoiceSelect(sel);
      }
    });

    // Bouton Save
    const saveBtn = backdropEl.querySelector("#sa-btn-save");
    saveBtn?.addEventListener("click", () => {
      const mode = radioGemini?.checked ? "gemini" : "local";
      const key = (keyInput?.value || "").trim();
      const v = voiceSelect?.value || "Puck";
      const s = styleSelect?.value || "extreme";

      localStorage.setItem("sa_tts_engine", mode);
      if (key) {
        localStorage.setItem("sa_gemini_api_key", key);
      }
      localStorage.setItem("sa_gemini_voice", v);
      localStorage.setItem("sa_gemini_style", s);

      closeSettingsModal();

      const sel = popover?.querySelector(".sa-voice-select");
      if (sel) populateVoiceSelect(sel);
    });
  };

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
        const sel = popover?.querySelector(".sa-voice-select");
        if (sel) populateVoiceSelect(sel);
      };
    }
  }

  const renderEvent = (summaryItem) => () => {
    const ev = readEvent(summaryItem);
    if (!ev) return null;
    const isGoal = ev.type === "goal";
    const isGoalie = ev.type === "goalie";
    const typeLabel = isGoal ? "BUT" : isGoalie ? "GARDIEN" : "PÉNALITÉ";
    const logoUrl = getTeamLogo(ev.side);
    const eventRes = isGoal ? buildGoal(ev, summaryItem) : isGoalie ? buildGoalieChange(ev, summaryItem) : buildPenalty(ev, summaryItem);
    const body = typeof eventRes === "object" && eventRes !== null ? eventRes.html : eventRes;
    const rawSpeech = typeof eventRes === "object" && eventRes !== null && eventRes.speechText ? eventRes.speechText : body;
    return {
      type: ev.type,
      side: ev.side,
      sideLabel: ev.sideLabel,
      team: ev.team,
      typeLabel,
      logoUrl,
      body,
      speechText: cleanForSpeech(rawSpeech),
    };
  };

  const showPopover = (render, summaryItem, isPinned = false) => {
    const content = render();
    if (!content) return;
    ensureElements();
    stopSpeech();

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
        `<div class="sa-tts-controls">` +
          `<button type="button" class="sa-tts-btn" aria-label="Annoncer vocalement" title="Lire l'annonce au micro">` +
            `<i class="icon ion-volume-high sa-tts-icon"></i>` +
            `<span class="sa-tts-label">Annoncer vocalement</span>` +
          `</button>` +
          `<select class="sa-voice-select" aria-label="Choisir la voix de l'annonceur" title="Changer la voix de synthèse"></select>` +
          `<button type="button" class="sa-settings-btn" aria-label="Paramètres voix & clé Gemini" title="Configurer la voix IA Gemini...">⚙️</button>` +
        `</div>` +
        `<span class="sa-hint-dismiss">Cliquer n'importe où, sur ✕ ou sur Échap pour fermer</span>` +
      `</div>`;

    // Clic sur le bouton TTS
    const ttsBtn = popover.querySelector(".sa-tts-btn");
    if (ttsBtn) {
      ttsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleSpeech(content.speechText, ttsBtn);
      });
    }

    // Remplissage du sélecteur de voix
    const voiceSelect = popover.querySelector(".sa-voice-select");
    if (voiceSelect) {
      populateVoiceSelect(voiceSelect);
    }

    // Clic sur le bouton Paramètres
    const settingsBtn = popover.querySelector(".sa-settings-btn");
    if (settingsBtn) {
      settingsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        openSettingsModal();
      });
    }

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
    stopSpeech();
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
      hidePopover(true);
    } else if ((e.key === " " || e.code === "Space") && pinned && popover && popover.classList.contains("sa-visible")) {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      const ttsBtn = popover.querySelector(".sa-tts-btn");
      if (ttsBtn) {
        e.preventDefault();
        ttsBtn.click();
      }
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
      labelSpan.textContent = isSwapped ? "Côtés inversés" : "Inverser côtés";
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


