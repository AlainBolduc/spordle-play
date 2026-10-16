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
    scorer: { name: "SARAH ZHANG", number: 25 },
    assists: [{ name: "ALEXE ROUSSON", number: 99 }, { name: "VICTORIA JOSEPH", number: 32 }],
    time: "13:37",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Le premier but des Remparts Est Richelieu,");
  assert.strictEqual(res.lines[1], "marqué par le numéro 25, Sarah Zhang, assisté du numéro 99, Alexe Rousson, et du numéro 32, Victoria Joseph.");
  assert.strictEqual(res.lines[2], "Le temps du but : 13:37 de la 3e période.");
});

test("But 2 : Forces égales avec 1 passe", () => {
  const res = engine.formatGoal({
    teamName: "Express Rive-Sud",
    teamGoalCount: 2,
    scorer: { name: "LOÏC POULIN", number: 74 },
    assists: [{ name: "JACOB LAPIERRE", number: 4 }],
    time: "09:34",
    period: "1"
  });

  assert.strictEqual(res.lines[0], "Le deuxième but des Express Rive-Sud,");
  assert.strictEqual(res.lines[1], "marqué par le numéro 74, Loïc Poulin, assisté du numéro 4, Jacob Lapierre.");
  assert.strictEqual(res.lines[2], "Le temps du but : 9:34 de la 1re période.");
});

test("But 3 : Sans aide", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Ouest Richelieu",
    teamGoalCount: 4,
    scorer: { name: "ABIGAIL HANLEY", number: 10 },
    assists: [],
    time: "00:00",
    period: "1"
  });

  assert.strictEqual(res.lines[0], "Le quatrième but des Remparts Ouest Richelieu,");
  assert.strictEqual(res.lines[1], "marqué par le numéro 10, Abigail Hanley, sans aide.");
});

test("But 4 : Avantage numérique [AN]", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 2,
    scorer: { name: "LUNA ZHANG", number: 23 },
    assists: [{ name: "RAPHAELLE KANASH", number: 24 }],
    isPowerplay: true,
    time: "02:36",
    period: "1"
  });

  assert.strictEqual(res.lines[1], "marqué en avantage numérique par le numéro 23, Luna Zhang, assisté du numéro 24, Raphaelle Kanash.");
});

test("But 5 : Infériorité numérique [DN / IN]", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Ouest Richelieu",
    teamGoalCount: 3,
    scorer: { name: "JULIETTE LAMBERT", number: 14 },
    assists: [],
    isShorthanded: true,
    time: "02:04",
    period: "1"
  });

  assert.strictEqual(res.lines[1], "marqué en infériorité numérique par le numéro 14, Juliette Lambert, sans aide.");
});

test("But 6 : Filet désert [FD]", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 5,
    scorer: { name: "ZELDA BOUTHILLIER", number: 26 },
    assists: [],
    isEmptyNet: true,
    time: "07:48",
    period: "3"
  });

  assert.strictEqual(res.lines[1], "marqué dans un filet désert par le numéro 26, Zelda Bouthillier, sans aide.");
});

test("But 7 : Combo Infériorité + Filet désert [DN + FD]", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 4,
    scorer: { name: "SHAID ZERBISH", number: 25 },
    assists: [],
    isShorthanded: true,
    isEmptyNet: true,
    time: "07:48",
    period: "3"
  });

  assert.strictEqual(res.lines[1], "marqué en infériorité numérique dans un filet désert par le numéro 25, Shaid Zerbish, sans aide.");
});

test("But 8 : Tir de punition", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 3,
    scorer: { name: "LILIANE TOUSIGNANT", number: 21 },
    assists: [],
    isPenaltyShot: true,
    time: "05:12",
    period: "3"
  });

  assert.strictEqual(res.lines[1], "marqué sur un tir de punition par le numéro 21, Liliane Tousignant, sans aide.");
});

test("But 9 : 2e but du même joueur (son deuxième de la rencontre)", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 3,
    scorer: { name: "SARAH ZHANG", number: 25, goalCountInGame: 2 },
    assists: [{ name: "VICTORIA JOSEPH", number: 32 }],
    time: "12:59",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Le troisième but des Remparts Est Richelieu, son deuxième de la rencontre,");
  assert.strictEqual(res.lines[1], "marqué par le numéro 25, Sarah Zhang, assisté du numéro 32, Victoria Joseph.");
});

test("But 10 : Tour du chapeau (son troisième de la rencontre)", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 5,
    scorer: { name: "SARAH ZHANG", number: 25, goalCountInGame: 3 },
    assists: [],
    time: "01:15",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Le cinquième but des Remparts Est Richelieu, son troisième de la rencontre,");
});

// =========================================================================
// TESTS : PÉNALITÉS (PENALTY ENGINE - HOCKEY QUÉBEC 2026-2027)
// =========================================================================
console.log("\n--- Tests du moteur de pénalités ---");

test("Pénalité 1 : Mineure standard A22 (Coup de bâton)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Est Richelieu",
    penalizedPlayer: { name: "LILY-ROSE BOILEAU", number: 30 },
    codes: ["A22"],
    time: "17:37",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Pénalité aux Remparts Est Richelieu,");
  assert.strictEqual(res.lines[1], "au numéro 30, Lily-Rose Boileau,");
  assert.strictEqual(res.lines[2], "2 minutes pour coup de bâton.");
  assert.strictEqual(res.lines[3], "Le temps de la pénalité : 17:37 de la 3e période.");
});

test("Pénalité 2 : Servie par un coéquipier (Gardiens ou blessés)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Est Richelieu",
    penalizedPlayer: { name: "LILY-ROSE BOILEAU", number: 30 },
    servedByPlayer: { name: "MILA BEAUREGARD", number: 15 },
    codes: ["A22"],
    time: "17:37",
    period: "3"
  });

  assert.strictEqual(res.lines[0], "Pénalité aux Remparts Est Richelieu,");
  assert.strictEqual(res.lines[1], "au numéro 30, Lily-Rose Boileau,");
  assert.strictEqual(res.lines[2], "2 minutes pour coup de bâton.");
  assert.strictEqual(res.lines[3], "La pénalité sera purgée par le numéro 15, Mila Beauregard.");
  assert.strictEqual(res.lines[4], "Le temps de la pénalité : 17:37 de la 3e période.");
});

test("Pénalité 3 : Mineure de banc A80 avec purgeur", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Ouest Richelieu",
    isBenchMinor: true,
    servedByPlayer: { name: "RAPHAELLE KANASH", number: 24 },
    codes: ["A80"],
    time: "15:16",
    period: "2"
  });

  assert.strictEqual(res.lines[0], "Pénalité de banc aux Remparts Ouest Richelieu,");
  assert.strictEqual(res.lines[1], "2 minutes pour trop de joueurs sur la patinoire.");
  assert.strictEqual(res.lines[2], "La pénalité sera purgée par le numéro 24, Raphaelle Kanash.");
  assert.strictEqual(res.lines[3], "Le temps de la pénalité : 15:16 de la 2e période.");
});

test("Pénalité 4 : Double mineure combinée A48+A48 (Contact tête -> 4 min)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Ouest Richelieu",
    penalizedPlayer: { name: "ALEXE ROUSSON", number: 99 },
    codes: ["A48", "A48"],
    time: "05:00",
    period: "2"
  });

  assert.strictEqual(res.lines[0], "Pénalité aux Remparts Ouest Richelieu,");
  assert.strictEqual(res.lines[1], "au numéro 99, Alexe Rousson,");
  assert.strictEqual(res.lines[2], "4 minutes pour contact avec la tête.");
});

test("Pénalité 5 : Majeure + Extrême inconduite B40+D40 (Mise en échec par derrière)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Ouest Richelieu",
    penalizedPlayer: { name: "ZELDA BOUTHILLIER", number: 26 },
    codes: ["B40", "D40"],
    time: "05:00",
    period: "2"
  });

  assert.strictEqual(res.lines[0], "Pénalité aux Remparts Ouest Richelieu,");
  assert.strictEqual(res.lines[1], "au numéro 26, Zelda Bouthillier,");
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

test("Pénalité 8 : Punition de match E32+B32 (Tentative de blesser)", () => {
  const res = engine.formatPenalty({
    teamName: "Express Rive-Sud",
    penalizedPlayer: { name: "MAXIME GAGNON", number: 12 },
    codes: ["E32", "B32"],
    time: "04:30",
    period: "3"
  });

  assert.strictEqual(res.lines[2], "5 minutes et punition de match pour tentative de blesser.");
});

test("Pénalité 9 : Gardien de but A22/G (Suffixe /G)", () => {
  const res = engine.formatPenalty({
    teamName: "Remparts Est Richelieu",
    penalizedPlayer: { name: "CHARLIE HEBERT", number: 1, isGoalie: true },
    servedByPlayer: { name: "JULIETTE LAMBERT", number: 14 },
    codes: ["A22/G"],
    time: "08:00",
    period: "2"
  });

  assert.strictEqual(res.lines[1], "au numéro 1, Charlie Hebert,");
  assert.strictEqual(res.lines[2], "2 minutes pour coup de bâton.");
  assert.strictEqual(res.lines[3], "La pénalité sera purgée par le numéro 14, Juliette Lambert.");
});

// =========================================================================
// TESTS : GARDIENS DE BUT (GOALIE ENGINE)
// =========================================================================
console.log("\n--- Tests du moteur de gardiens de but ---");

test("Gardien 1 : Changement de gardien de but standard", () => {
  const res = engine.formatGoalieChange({
    teamName: "Remparts Ouest Richelieu",
    goalie: { name: "NATHAN BOLDUC", number: 33 },
    time: "10:00",
    period: "2"
  });

  assert.strictEqual(res.lines[0], "Changement de gardien de but du côté des Remparts Ouest Richelieu,");
  assert.strictEqual(res.lines[1], "maintenant devant le filet : le numéro 33, Nathan Bolduc.");
  assert.strictEqual(res.lines[2], "Le temps du changement : 10:00 de la 2e période.");
});

test("Gardien 2 : Changement de gardien sans temps", () => {
  const res = engine.formatGoalieChange({
    teamName: "Express Rive-Sud",
    goalie: { name: "CHARLIE HEBERT", number: 1 }
  });

  assert.strictEqual(res.lines[0], "Changement de gardien de but du côté des Express Rive-Sud,");
  assert.strictEqual(res.lines[1], "maintenant devant le filet : le numéro 1, Charlie Hebert.");
  assert.strictEqual(res.lines.length, 2);
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
          goalie: { name: "ANAELLE LEMIEUX", number: 33 },
          time: ev.time,
          period: period.name
        });
        assert.ok(res.lines.length >= 2, `Le changement de gardien doit générer au moins 2 lignes`);
      }
    });
  });

  assert.strictEqual(eventCount, 66, "Le catalogue doit contenir exactement 66 événements");
});

// =========================================================================
// TESTS : SYNTHÈSE VOCALE (TEXT-TO-SPEECH FORMATTING)
// =========================================================================
console.log("\n--- Tests de l'adaptation phonétique vocale (TTS) ---");

test("TTS 1 : Conversion naturelle du temps et des périodes", () => {
  const raw = "Le premier but des Express Rive-Sud, marqué par le numéro 77, Mayson Gosselin. Le temps du but : 7:48 de la 1re période.";
  const spoken = engine.utils.cleanForSpeech(raw);
  assert.strictEqual(
    spoken,
    "Le premier but des Express Rive-Sud, marqué par le numéro 77, Mayson Gosselin. Le temps du but, 7 minutes 48 de la première période."
  );
});

test("TTS 2 : Temps avec secondes uniques (ex: 14:05 -> 14 minutes et 5 secondes)", () => {
  const raw = "Le temps de la pénalité : 14:05 de la 2e période.";
  const spoken = engine.utils.cleanForSpeech(raw);
  assert.strictEqual(
    spoken,
    "Le temps de la pénalité, 14 minutes et 5 secondes de la deuxième période."
  );
});

test("TTS 3 : Début de période (< 1 minute, ex: 0:45 -> 45 secondes)", () => {
  const raw = "Le temps du but : 0:45 de la 3e période.";
  const spoken = engine.utils.cleanForSpeech(raw);
  assert.strictEqual(
    spoken,
    "Le temps du but, 45 secondes de la troisième période."
  );
});

test("TTS 4 : speechText présent et bien formaté sur un but", () => {
  const res = engine.formatGoal({
    teamName: "Remparts Est Richelieu",
    teamGoalCount: 1,
    scorer: { name: "SARAH ZHANG", number: 25 },
    assists: [{ name: "ALEXE ROUSSON", number: 99 }],
    time: "13:37",
    period: "3"
  });
  assert.ok(res.speechText.includes("13 minutes 37 de la troisième période"));
  assert.ok(!res.speechText.includes(":"));
});

console.log(`\n=== RÉSULTATS : ${passed}/${total} tests réussis ===\n`);
if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
