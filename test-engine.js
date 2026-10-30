/**
 * Suite de tests unitaires pour spordle-engine.js
 * Exécutable directement avec : node test-engine.js
 */
const assert = require("assert");
const engine = require("./spordle-engine.js");

console.log("=== EXÉCUTION DES TESTS UNITAIRES SPORDLE ENGINE ===\n");
let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

// =========================================================================
// TESTS : BUTS (GOAL ENGINE)
// =========================================================================
console.log("--- Tests du moteur de buts ---");

test("But 1 : Forces égales avec 2 passes", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 1,
    scorer: { name: "SOPHIE TREMBLAY", number: 25 },
    assists: [{ name: "MAUDE CLOUTIER", number: 99 }, { name: "CAMILLE ROY", number: 32 }],
    time: "13:37",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Le premier but des Remparts Est Richelieu,");
  assert.strictEqual(res.lines[1], "marqué par le numéro 25, Sophie Tremblay, avec l'aide du numéro 99, Maude Cloutier, et du numéro 32, Camille Roy.");
  assert.strictEqual(res.lines[2], "Le temps du but : 13:37.");
});

test("But 2 : Forces égales avec 1 passe", () => {
  const res = engine.formatGoal({
    teamName: "Express Rive-Sud",
    teamGoalCount: 2,
    scorer: { name: "LOÏC LAPOINTE", number: 74 },
    assists: [{ name: "JACOB LECLERC", number: 4 }],
    time: "09:34",
    period: "1"
  });

  assert.strictEqual(res.lines[0], "Le deuxième but des Express Rive-Sud,");
  assert.strictEqual(res.lines[1], "marqué par le numéro 74, Loïc Lapointe, avec l'aide du numéro 4, Jacob Leclerc.");
  assert.strictEqual(res.lines[2], "Le temps du but : 9:34.");
});

test("But 3 : Sans aide", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Ouest Richelieu",
    teamGoalCount: 4,
    scorer: { name: "NOÉMIE THIBAULT", number: 10 },
    assists: [],
    time: "00:00",
    period: "1"
  });

  assert.strictEqual(res.lines[0], "Le quatrième but des Remparts Ouest Richelieu,");
  assert.strictEqual(res.lines[1], "marqué sans aide par le numéro 10, Noémie Thibault.");
});

test("But 4 : Avantage numérique [AN]", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 2,
    scorer: { name: "ROSALIE GIRARD", number: 23 },
    assists: [{ name: "JUSTINE DUBÉ", number: 24 }],
    isPowerplay: true,
    time: "02:36",
    period: "1"
  });

  assert.strictEqual(res.lines[1], "marqué en avantage numérique par le numéro 23, Rosalie Girard, avec l'aide du numéro 24, Justine Dubé.");
});

test("But 5 : Désavantage numérique [DN / IN]", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Ouest Richelieu",
    teamGoalCount: 3,
    scorer: { name: "JULIETTE LÉVESQUE", number: 14 },
    assists: [],
    isShorthanded: true,
    time: "02:04",
    period: "1"
  });

  assert.strictEqual(res.lines[1], "marqué en désavantage numérique sans aide par le numéro 14, Juliette Lévesque.");
});

test("But 6 : Filet désert [FD]", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 5,
    scorer: { name: "ÉMILIE LAVOIE", number: 26 },
    assists: [],
    isEmptyNet: true,
    time: "07:48",
    period: "3"
  });

  assert.strictEqual(res.lines[1], "marqué dans un filet désert sans aide par le numéro 26, Émilie Lavoie.");
});

test("But 7 : Combo Désavantage + Filet désert [DN + FD]", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 4,
    scorer: { name: "GABRIEL FOURNIER", number: 25 },
    assists: [],
    isShorthanded: true,
    isEmptyNet: true,
    time: "07:48",
    period: "3"
  });

  assert.strictEqual(res.lines[1], "marqué en désavantage numérique dans un filet désert sans aide par le numéro 25, Gabriel Fournier.");
});

test("But 8 : Tir de punition", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 3,
    scorer: { name: "CHLOÉ CÔTÉ", number: 21 },
    assists: [],
    isPenaltyShot: true,
    time: "05:12",
    period: "3"
  });

  assert.strictEqual(res.lines[1], "marqué sur un tir de punition sans aide par le numéro 21, Chloé Côté.");
});

test("But 9 : 2e but du même joueur (son deuxième de la rencontre)", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 3,
    scorer: { name: "SOPHIE TREMBLAY", number: 25, goalCountInGame: 2 },
    assists: [{ name: "CAMILLE ROY", number: 32 }],
    time: "12:59",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Le troisième but des Remparts Est Richelieu, son deuxième de la rencontre,");
  assert.strictEqual(res.lines[1], "marqué par le numéro 25, Sophie Tremblay, avec l'aide du numéro 32, Camille Roy.");
});

test("But 10 : Tour du chapeau (son troisième de la rencontre)", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 5,
    scorer: { name: "SOPHIE TREMBLAY", number: 25, goalCountInGame: 3 },
    assists: [],
    time: "01:15",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Le cinquième but des Remparts Est Richelieu, son troisième de la rencontre,");
});

test("But 11 : Rang de but non spécifié ou 0", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 0,
    scorer: { name: "SOPHIE TREMBLAY", number: 25 },
    assists: [],
    time: "10:00",
    period: "2"
  });

  assert.strictEqual(res.lines[0], "Le but des Remparts Est Richelieu,");
  assert.strictEqual(res.htmlLines[0], "Le but des <strong>Remparts Est Richelieu</strong>,");
});

test("But 12 : Temps du but sans mention de période", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 1,
    scorer: { name: "SOPHIE TREMBLAY", number: 25 },
    assists: [],
    time: "10:00",
    period: "2"
  });

  assert.strictEqual(res.lines[2], "Le temps du but : 10:00.");
  assert.strictEqual(res.htmlLines[2], "Le temps du but : <strong>10:00</strong>.");
});

// =========================================================================
// TESTS : PÉNALITÉS (PENALTY ENGINE - HOCKEY QUÉBEC 2026-2027)
// =========================================================================
console.log("\n--- Tests du moteur de pénalités ---");

test("Pénalité 1 : Mineure standard A22 (Coup de bâton)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Est Richelieu",
    penalizedPlayer: { name: "LÉA PELLETIER", number: 30 },
    codes: ["A22"],
    time: "17:37",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Pénalité aux Remparts Est Richelieu,");
  assert.strictEqual(res.lines[1], "au numéro 30, Léa Pelletier,");
  assert.strictEqual(res.lines[2], "2 minutes pour coup de bâton.");
  assert.strictEqual(res.lines[3], "Le temps de la pénalité : 17:37 de la 3e période.");
});

test("Pénalité 2 : Servie par un coéquipier (Gardiens ou blessés)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Est Richelieu",
    penalizedPlayer: { name: "LÉA PELLETIER", number: 30 },
    servedByPlayer: { name: "ALICE BÉLANGER", number: 15 },
    codes: ["A22"],
    time: "17:37",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Pénalité aux Remparts Est Richelieu,");
  assert.strictEqual(res.lines[1], "au numéro 30, Léa Pelletier,");
  assert.strictEqual(res.lines[2], "2 minutes pour coup de bâton.");
  assert.strictEqual(res.lines[3], "La pénalité sera purgée par le numéro 15, Alice Bélanger.");
  assert.strictEqual(res.lines[4], "Le temps de la pénalité : 17:37 de la 3e période.");
});

test("Pénalité 3 : Mineure de banc A80 avec purgeur", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Ouest Richelieu",
    isBenchMinor: true,
    servedByPlayer: { name: "JUSTINE DUBÉ", number: 24 },
    codes: ["A80"],
    time: "15:16",
    period: "2"
  });

  assert.strictEqual(res.lines[0], "Pénalité de banc aux Remparts Ouest Richelieu,");
  assert.strictEqual(res.lines[1], "2 minutes pour trop de joueurs sur la patinoire.");
  assert.strictEqual(res.lines[2], "La pénalité sera purgée par le numéro 24, Justine Dubé.");
  assert.strictEqual(res.lines[3], "Le temps de la pénalité : 15:16 de la 2e période.");
});

test("Pénalité 4 : Double mineure combinée A48+A48 (Contact tête -> 4 min)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Ouest Richelieu",
    penalizedPlayer: { name: "MAUDE CLOUTIER", number: 99 },
    codes: ["A48", "A48"],
    time: "05:00",
    period: "2"
  });

  assert.strictEqual(res.lines[0], "Pénalité aux Remparts Ouest Richelieu,");
  assert.strictEqual(res.lines[1], "au numéro 99, Maude Cloutier,");
  assert.strictEqual(res.lines[2], "4 minutes pour contact avec la tête.");
});

test("Pénalité 5 : Majeure + Extrême inconduite B40+D40 (Mise en échec par derrière)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Ouest Richelieu",
    penalizedPlayer: { name: "ÉMILIE LAVOIE", number: 26 },
    codes: ["B40", "D40"],
    time: "05:00",
    period: "2"
  });

  assert.strictEqual(res.lines[0], "Pénalité aux Remparts Ouest Richelieu,");
  assert.strictEqual(res.lines[1], "au numéro 26, Émilie Lavoie,");
  assert.strictEqual(res.lines[2], "5 minutes et extrême inconduite de partie pour mise en échec par derrière.");
});

test("Pénalité 6 : Bagarre B2+D2 (5 minutes et extrême inconduite)", () => {
  const res = engine.formatPenalty({
    teamName: "Express Rive-Sud",
    penalizedPlayer: { name: "JEAN TREMBLAY", number: 7 },
    codes: ["B2", "D2"],
    time: "10:00",
    period: "1"
  });

  assert.strictEqual(res.lines[2], "5 minutes et extrême inconduite de partie pour s'être battu.");
});

test("Pénalité 7 : Mineure + Inconduite A83+C83 (Refus mesurage)", () => {
  const res = engine.formatPenalty({
    teamName: "Express Rive-Sud",
    penalizedPlayer: { name: "PIERRE ROY", number: 18 },
    codes: ["A83", "C83"],
    time: "08:15",
    period: "2"
  });

  assert.strictEqual(res.lines[2], "2 minutes et 10 minutes d'inconduite pour refus de se soumettre à un mesurage.");
});

test("Pénalité 8 : Punition de match E32+B32 (Tentative de blesser — ordre du manuel)", () => {
  const res = engine.formatPenalty({
    teamName: "Express Rive-Sud",
    penalizedPlayer: { name: "SIMON BERGERON", number: 12 },
    codes: ["E32", "B32"],
    time: "04:30",
    period: "3"
  });

  assert.strictEqual(res.lines[2], "punition de match et 5 minutes pour tentative de blesser.");
});

test("Pénalité 9 : Gardien de but A22/G (Suffixe /G)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Est Richelieu",
    penalizedPlayer: { name: "ANTOINE SIMARD", number: 1, isGoalie: true },
    servedByPlayer: { name: "JULIETTE LÉVESQUE", number: 14 },
    codes: ["A22/G"],
    time: "08:00",
    period: "2"
  });

  assert.strictEqual(res.lines[1], "au numéro 1, Antoine Simard,");
  assert.strictEqual(res.lines[2], "2 minutes pour coup de bâton.");
  assert.strictEqual(res.lines[3], "La pénalité sera purgée par le numéro 14, Juliette Lévesque.");
});

test("Pénalité 10 : Extrême inconduite à un entraîneur (E1 D61) -> Avertissement Ne pas annoncer", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Est Richelieu",
    penalizedPlayer: { name: "MARTIN GIRARD", number: "E1", isCoach: true },
    codes: ["D61"],
    time: "12:30",
    period: "3"
  });

  assert.strictEqual(res.isDoNotAnnounce, true);
  assert.strictEqual(res.lines[0], "Ne pas annoncer au micro — Extrême inconduite à un entraîneur");
  assert.ok(res.htmlLines[0].includes("Ne pas annoncer au micro"));
});

test("Pénalité 11 : Deux punitions pareilles / coïncidentes (Visiteur + Local)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Ouest Richelieu",
    side: "home",
    penalizedPlayer: { name: "SAMUEL GAUTHIER", number: 19 },
    coincidentWith: {
      teamName: "Remparts Est Richelieu",
      side: "away",
      penalizedPlayer: { name: "FÉLIX BOUCHARD", number: 8 }
    },
    codes: ["A47"],
    time: "10:15",
    period: "2"
  });

  assert.strictEqual(res.isCoincident, true);
  assert.strictEqual(res.lines[0], "Pénalité aux Remparts Est Richelieu, au numéro 8, Félix Bouchard,");
  assert.strictEqual(res.lines[1], "et aux Remparts Ouest Richelieu, au numéro 19, Samuel Gauthier,");
  assert.strictEqual(res.lines[2], "2 minutes chacun pour rudesse.");
  assert.strictEqual(res.lines[3], "Le temps de la pénalité : 10:15 de la 2e période.");
});

test("Pénalité 12 : Tir de punition décerné (Code F53)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Ouest Richelieu",
    awardedTeamName: "Remparts Est Richelieu",
    penalizedPlayer: { name: "ALEXANDRE GAGNON", number: 17 },
    shooterPlayer: { name: "SOPHIE TREMBLAY", number: 25 },
    codes: ["F53"],
    time: "15:00",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Un tir de punition est accordé aux Remparts Est Richelieu");
  assert.strictEqual(res.lines[1], "puisque le numéro 17, Alexandre Gagnon, des Remparts Ouest Richelieu a fait trébucher.");
  assert.strictEqual(res.lines[2], "Le tir sera effectué par le numéro 25, Sophie Tremblay.");
  assert.strictEqual(res.lines[3], "Le temps de la pénalité : 15:00 de la 3e période.");
});

// =========================================================================
// TESTS : GARDIENS DE BUT (GOALIE ENGINE)
// =========================================================================
console.log("\n--- Tests du moteur de gardiens de but ---");

test("Gardien 1 : Changement de gardien de but standard (sans temps selon le manuel)", () => {
  const res = engine.formatGoalieChange({
    teamName: "Remparts Ouest Richelieu",
    goalie: { name: "MATHIEU TREMBLAY", number: 33 },
    time: "10:00",
    period: "2"
  });

  assert.strictEqual(res.lines[0], "Changement de gardien de but pour les Remparts Ouest Richelieu,");
  assert.strictEqual(res.lines[1], "maintenant devant le filet le numéro 33, Mathieu Tremblay.");
  assert.strictEqual(res.lines.length, 2);
});

test("Gardien 2 : Changement de gardien sans temps fourni", () => {
  const res = engine.formatGoalieChange({
    teamName: "Express Rive-Sud",
    goalie: { name: "ANTOINE SIMARD", number: 1 }
  });

  assert.strictEqual(res.lines[0], "Changement de gardien de but pour les Express Rive-Sud,");
  assert.strictEqual(res.lines[1], "maintenant devant le filet le numéro 1, Antoine Simard.");
  assert.strictEqual(res.lines.length, 2);
});

test("Gardien 3 : Empty net / Filet désert / Gardien retiré -> Aucune annonce", () => {
  const res = engine.formatGoalieChange({
    teamName: "Remparts Ouest Richelieu",
    details: "Empty net - Mis dans le filet"
  });

  assert.strictEqual(res.isDoNotAnnounce, true);
  assert.strictEqual(res.lines[0], "Ne pas annoncer au micro — Filet désert");
});

// =========================================================================
// TESTS : VALIDATION DU CATALOGUE COMPLET (test-events.js)
// =========================================================================
console.log("\n--- Validation du catalogue complet de match (test-events.js) ---");

test("Validation de l'ensemble des 66 événements de test-events.js", () => {
  const testData = require("./test-events.js");
  assert.ok(testData.periods && testData.periods.length > 0, "test-events.js doit contenir des périodes");
  
  let eventCount = 0;
  testData.periods.forEach((period) => {
    period.events.forEach((ev) => {
      eventCount++;
      const teamName = ev.side === "home" ? testData.game.homeTeam.name : testData.game.awayTeam.name;

      if (ev.type === "goal") {
        const res = engine.formatGoal({
          teamName,
          teamGoalCount: 1,
          scorer: ev.scorer,
          assists: ev.assists,
          isPowerplay: ev.isPowerplay,
          isShorthanded: ev.isShorthanded,
          isEmptyNet: ev.isEmptyNet,
          isPenaltyShot: ev.isPenaltyShot,
          time: ev.time,
          period: period.name
        });
        assert.ok(res.lines.length >= 2, `Le but ${ev.scorer.name} doit générer au moins 2 lignes`);
        assert.ok(res.htmlLines.length >= 2, `Le but ${ev.scorer.name} doit générer des lignes HTML`);
      } else if (ev.type === "penalty") {
        const res = engine.formatPenalty({
          teamName,
          penalizedPlayer: ev.player,
          servedByPlayer: ev.servedBy,
          isBenchMinor: ev.isBench,
          codes: ev.code ? [ev.code] : [],
          time: ev.time,
          period: period.name
        });
        assert.ok(res.lines.length >= 2, `La pénalité (${ev.code}) doit générer au moins 2 lignes`);
        assert.ok(res.htmlLines.length >= 2, `La pénalité (${ev.code}) doit générer des lignes HTML`);
      } else if (ev.type === "goalie") {
        const res = engine.formatGoalieChange({
          teamName,
          goalie: { name: "MARIE-ÈVE OUELLET", number: 33 },
          time: ev.time,
          period: period.name
        });
        assert.ok(res.lines.length >= 2, `Le changement de gardien doit générer au moins 2 lignes`);
      }
    });
  });

  assert.strictEqual(eventCount, 66, "Le catalogue doit contenir exactement 66 événements");
});

console.log("\n--- Tests du mot de bienvenue d'avant-match ---");

test("Bienvenue 1 : Conversion catégorie U11 AA -> M11 AA", () => {
  assert.strictEqual(engine.convertCategoryToQuebec("U11 AA"), "M11 AA");
  assert.strictEqual(engine.convertCategoryToQuebec("U13 AAA"), "M13 AAA");
  assert.strictEqual(engine.convertCategoryToQuebec("U15-BB"), "M15 BB");
  assert.strictEqual(engine.convertCategoryToQuebec("U18 D1"), "M18 D1");
  assert.strictEqual(engine.convertCategoryToQuebec("M11 A"), "M11 A");
});

test("Bienvenue 2 : Génération complète de l'annonce d'avant-match (avec aréna et officiels)", () => {
  const res = engine.formatWelcomeMessage({
    hour: 19,
    arena: "Glaces de la Rive-Sud",
    category: "U11 AA",
    awayTeam: "Remparts Est Richelieu",
    homeTeam: "Remparts Ouest Richelieu",
    awayJersey: "blanc",
    homeJersey: "bleu",
    awayGoalie: { number: "30", name: "FÉLIX TREMBLAY" },
    homeGoalie: { number: "33", name: "JACOB GAGNON" },
    officials: {
      referee: "Marc Lavoie",
      linesmen: ["Sophie Côté", "Éric Bélanger"]
    }
  });

  assert.strictEqual(res.category, "M11 AA");
  assert.strictEqual(res.greeting, "Bonsoir");
  assert.strictEqual(res.lines[0], "Bonsoir mesdames et messieurs et bienvenue à l'aréna Glaces de la Rive-Sud à cette rencontre de la division M11 AA, entre les Remparts Est Richelieu en chandail blanc et les Remparts Ouest Richelieu en chandail bleu.");
  assert.strictEqual(res.lines[1], "Les gardiens de but partant : pour les Remparts Est Richelieu, le numéro 30, Félix Tremblay et pour les Remparts Ouest Richelieu, le numéro 33, Jacob Gagnon.");
  assert.strictEqual(res.lines[2], "Les officiels pour cette rencontre : l'arbitre en chef Marc Lavoie, ses adjoints, les juges de lignes Sophie Côté et Éric Bélanger.");
  assert.strictEqual(res.lines[3], "Bon match mesdames messieurs et bonne chance aux deux équipes.");
  assert.ok(res.htmlLines[0].includes("<strong>M11 AA</strong>"));
  assert.ok(res.htmlLines[0].includes("<strong>blanc</strong>"));
  assert.ok(res.htmlLines[1].includes("<strong>30</strong>"));
  assert.ok(res.speechText.includes("double A"));
});

console.log(`\n=== RÉSULTATS : ${passed}/${total} tests réussis ===\n`);
if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
