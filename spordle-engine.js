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

  /**
   * Adapte phonétiquement un texte d'annonce pour une synthèse vocale (TTS) naturelle et fluide :
   * - Développe les abréviations de périodes ("1re période" -> "première période")
   * - Convertit les temps de jeu MM:SS en minutes/secondes parlées ("7:48" -> "7 minutes 48")
   * - Remplace les deux-points isolés par des virgules pour des pauses orales naturelles
   */
  const cleanForSpeech = (text) => {
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
      speechText: cleanForSpeech(`${line1} ${line2} ${line3}`)
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
      speechText: cleanForSpeech(lines.join(" "))
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
      speechText: cleanForSpeech(lines.join(" "))
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
      formatPeriodTime,
      cleanForSpeech
    }
  };
});
