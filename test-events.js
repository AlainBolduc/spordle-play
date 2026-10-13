/**
 * Catalogue complet des 66 cas de tests et événements de match.
 * Compatible Node.js (CommonJS) et Navigateur (variable globale TEST_GAME_DATA).
 */
const TEST_GAME_DATA = {
  "game": {
    "number": "1021",
    "category": "M12 AA",
    "arena": "Glaces de la Rive-Sud - Glace 2",
    "date": "12 oct. 2026",
    "homeTeam": {
      "name": "REMPARTS OUEST RICHELIEU",
      "shortName": "REMPARTS OUEST RICHELIEU",
      "logo": "assets/logos/remparts-ouest.png"
    },
    "awayTeam": {
      "name": "REMPARTS EST RICHELIEU",
      "shortName": "REMPARTS EST RICHELIEU",
      "logo": "assets/logos/remparts-est.png"
    }
  },
  "periods": [
    {
      "name": "PÉRIODE DE PROLONGATION",
      "length": "05:00",
      "events": [
        {
          "type": "goal",
          "side": "away",
          "time": "03:45",
          "scorer": {
            "name": "SARAH ZHANG",
            "number": 25
          },
          "assists": [
            {
              "name": "VICTORIA JOSEPH",
              "number": 32
            }
          ],
          "isPowerplay": true,
          "isShorthanded": false,
          "isEmptyNet": false,
          "isPenaltyShot": false
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "04:10",
          "player": {
            "name": "JEAN-LUC MERCIER",
            "number": 17
          },
          "servedBy": null,
          "isBench": false,
          "code": "A53",
          "label": "Faire trébucher",
          "severity": "Mineure"
        },
        {
          "type": "goal",
          "side": "home",
          "time": "04:45",
          "scorer": {
            "name": "LILIANE TOUSIGNANT",
            "number": 21
          },
          "assists": [],
          "isPowerplay": false,
          "isShorthanded": false,
          "isEmptyNet": false,
          "isPenaltyShot": true
        }
      ]
    },
    {
      "name": "3E PÉRIODE",
      "length": "20:00",
      "events": [
        {
          "type": "penalty",
          "side": "away",
          "time": "19:55",
          "player": {
            "name": "FÉLIX DUPUIS",
            "number": 8
          },
          "servedBy": null,
          "isBench": false,
          "code": "B2",
          "label": "Bagarre",
          "severity": "Majeure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "19:55",
          "player": {
            "name": "FÉLIX DUPUIS",
            "number": 8
          },
          "servedBy": null,
          "isBench": false,
          "code": "D2",
          "label": "Bagarre",
          "severity": "Extrême inconduite"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "19:55",
          "player": {
            "name": "SAMUEL NADEAU",
            "number": 19
          },
          "servedBy": null,
          "isBench": false,
          "code": "B2",
          "label": "Bagarre",
          "severity": "Majeure"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "19:55",
          "player": {
            "name": "SAMUEL NADEAU",
            "number": 19
          },
          "servedBy": null,
          "isBench": false,
          "code": "D2",
          "label": "Bagarre",
          "severity": "Extrême inconduite"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "19:20",
          "player": {
            "name": "THOMAS BOUCHARD",
            "number": 71
          },
          "servedBy": null,
          "isBench": false,
          "code": "C5",
          "label": "Demeurer sur les lieux d'une bagarre",
          "severity": "Inconduite"
        },
        {
          "type": "goal",
          "side": "home",
          "time": "19:10",
          "scorer": {
            "name": "ZELDA BOUTHILLIER",
            "number": 26
          },
          "assists": [],
          "isPowerplay": false,
          "isShorthanded": true,
          "isEmptyNet": true,
          "isPenaltyShot": false
        },
        {
          "type": "goal",
          "side": "away",
          "time": "18:45",
          "scorer": {
            "name": "AMHOUD BOUDHABI",
            "number": 34
          },
          "assists": [
            {
              "name": "MAYSON GOSSELIN",
              "number": 77
            }
          ],
          "isPowerplay": false,
          "isShorthanded": false,
          "isEmptyNet": true,
          "isPenaltyShot": false
        },
        {
          "type": "goalie",
          "side": "home",
          "time": "18:00",
          "details": "ANAELLE LEMIEUX (33) - Retiré du filet"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "17:37",
          "player": {
            "name": "LILY-ROSE BOILEAU",
            "number": 30
          },
          "servedBy": {
            "name": "MILA BEAUREGARD",
            "number": 15
          },
          "isBench": false,
          "code": "A22",
          "label": "Coup de bâton",
          "severity": "Mineure"
        },
        {
          "type": "goal",
          "side": "away",
          "time": "16:30",
          "scorer": {
            "name": "SARAH ZHANG",
            "number": 25
          },
          "assists": [
            {
              "name": "JULIETTE LAMBERT",
              "number": 14
            }
          ],
          "isPowerplay": true,
          "isShorthanded": false,
          "isEmptyNet": true,
          "isPenaltyShot": false
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "15:10",
          "player": {
            "name": "MAXIME GAGNON",
            "number": 12
          },
          "servedBy": null,
          "isBench": false,
          "code": "E32",
          "label": "Tentative de blesser",
          "severity": "Punition de match"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "15:10",
          "player": {
            "name": "MAXIME GAGNON",
            "number": 12
          },
          "servedBy": null,
          "isBench": false,
          "code": "B32",
          "label": "Tentative de blesser",
          "severity": "Majeure"
        },
        {
          "type": "goal",
          "side": "home",
          "time": "14:02",
          "scorer": {
            "name": "EVA RODRIGUES",
            "number": 21
          },
          "assists": [
            {
              "name": "KAMÉLY CORRIVEAU",
              "number": 22
            },
            {
              "name": "LUNA ZHANG",
              "number": 23
            }
          ],
          "isPowerplay": false,
          "isShorthanded": false,
          "isEmptyNet": false,
          "isPenaltyShot": false
        },
        {
          "type": "goal",
          "side": "away",
          "time": "12:59",
          "scorer": {
            "name": "SARAH ZHANG",
            "number": 25
          },
          "assists": [
            {
              "name": "VICTORIA JOSEPH",
              "number": 32
            }
          ],
          "isPowerplay": false,
          "isShorthanded": true,
          "isEmptyNet": false,
          "isPenaltyShot": false
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "11:20",
          "player": {
            "name": "CHARLIE HEBERT",
            "number": 1
          },
          "servedBy": {
            "name": "JULIETTE LAMBERT",
            "number": 14
          },
          "isBench": false,
          "code": "A22/G",
          "label": "Coup de bâton",
          "severity": "Mineure"
        },
        {
          "type": "goal",
          "side": "away",
          "time": "10:31",
          "scorer": {
            "name": "EMME GUERIN-CARANGI",
            "number": 13
          },
          "assists": [
            {
              "name": "JULIETTE LAMBERT",
              "number": 14
            },
            {
              "name": "ANNABELLA VERBUK",
              "number": 16
            }
          ],
          "isPowerplay": false,
          "isShorthanded": false,
          "isEmptyNet": false,
          "isPenaltyShot": false
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "09:15",
          "player": {
            "name": "ZELDA BOUTHILLIER",
            "number": 26
          },
          "servedBy": null,
          "isBench": false,
          "code": "B40",
          "label": "Mise en échec par derrière",
          "severity": "Majeure"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "09:15",
          "player": {
            "name": "ZELDA BOUTHILLIER",
            "number": 26
          },
          "servedBy": null,
          "isBench": false,
          "code": "D40",
          "label": "Mise en échec par derrière",
          "severity": "Extrême inconduite"
        },
        {
          "type": "goal",
          "side": "home",
          "time": "07:48",
          "scorer": {
            "name": "ZELDA BOUTHILLIER",
            "number": 26
          },
          "assists": [],
          "isPowerplay": false,
          "isShorthanded": false,
          "isEmptyNet": true,
          "isPenaltyShot": false
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "06:12",
          "player": {
            "name": "NICOLAS CLOUTIER",
            "number": 66
          },
          "servedBy": null,
          "isBench": false,
          "code": "D62",
          "label": "Propos discriminatoires",
          "severity": "Extrême inconduite"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "05:00",
          "player": {
            "name": "ALEXE ROUSSON",
            "number": 99
          },
          "servedBy": null,
          "isBench": false,
          "code": "A48",
          "label": "Contact avec la tête",
          "severity": "Mineure 4/4"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "05:00",
          "player": {
            "name": "ALEXE ROUSSON",
            "number": 99
          },
          "servedBy": null,
          "isBench": false,
          "code": "A48",
          "label": "Contact avec la tête",
          "severity": "Mineure 2/4"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "02:30",
          "player": {
            "name": "JULIETTE LAMBERT",
            "number": 14
          },
          "servedBy": null,
          "isBench": false,
          "code": "A83",
          "label": "Refus de mesurage",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "02:30",
          "player": {
            "name": "JULIETTE LAMBERT",
            "number": 14
          },
          "servedBy": null,
          "isBench": false,
          "code": "C83",
          "label": "Refus de mesurage",
          "severity": "Inconduite"
        },
        {
          "type": "goal",
          "side": "away",
          "time": "01:10",
          "scorer": {
            "name": "SARAH ZHANG",
            "number": 25
          },
          "assists": [],
          "isPowerplay": false,
          "isShorthanded": true,
          "isEmptyNet": false,
          "isPenaltyShot": false
        }
      ]
    },
    {
      "name": "2E PÉRIODE",
      "length": "20:00",
      "events": [
        {
          "type": "penalty",
          "side": "home",
          "time": "18:40",
          "player": null,
          "servedBy": {
            "name": "RAPHAELLE KANASH",
            "number": 24
          },
          "isBench": true,
          "code": "A80",
          "label": "Trop de joueurs sur la patinoire",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "17:15",
          "player": null,
          "servedBy": null,
          "isBench": true,
          "code": "A87",
          "label": "Punition de banc",
          "severity": "Mineure"
        },
        {
          "type": "goal",
          "side": "home",
          "time": "16:05",
          "scorer": {
            "name": "LUNA ZHANG",
            "number": 23
          },
          "assists": [
            {
              "name": "RAPHAELLE KANASH",
              "number": 24
            }
          ],
          "isPowerplay": true,
          "isShorthanded": false,
          "isEmptyNet": false,
          "isPenaltyShot": false
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "15:30",
          "player": {
            "name": "ARNO ALLAIRE",
            "number": 21
          },
          "servedBy": null,
          "isBench": false,
          "code": "A23",
          "label": "Darder",
          "severity": "Mineure 2/4"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "15:30",
          "player": {
            "name": "ARNO ALLAIRE",
            "number": 21
          },
          "servedBy": null,
          "isBench": false,
          "code": "A23",
          "label": "Darder",
          "severity": "Mineure 4/4"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "14:12",
          "player": {
            "name": "VICTORIA JOSEPH",
            "number": 32
          },
          "servedBy": null,
          "isBench": false,
          "code": "A24",
          "label": "Donner un six pouces",
          "severity": "Mineure 2/4"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "14:12",
          "player": {
            "name": "VICTORIA JOSEPH",
            "number": 32
          },
          "servedBy": null,
          "isBench": false,
          "code": "A24",
          "label": "Donner un six pouces",
          "severity": "Mineure 4/4"
        },
        {
          "type": "goalie",
          "side": "home",
          "time": "13:00",
          "details": "ANAELLE LEMIEUX (33) - Mis dans le filet"
        },
        {
          "type": "goal",
          "side": "away",
          "time": "12:40",
          "scorer": {
            "name": "SHAID ZERBISH",
            "number": 25
          },
          "assists": [],
          "isPowerplay": false,
          "isShorthanded": true,
          "isEmptyNet": false,
          "isPenaltyShot": false
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "11:15",
          "player": {
            "name": "MILA BEAUREGARD",
            "number": 15
          },
          "servedBy": null,
          "isBench": false,
          "code": "A25",
          "label": "Double échec",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "10:20",
          "player": {
            "name": "KAMÉLY CORRIVEAU",
            "number": 22
          },
          "servedBy": null,
          "isBench": false,
          "code": "A26",
          "label": "Bâton trop élevé",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "09:05",
          "player": {
            "name": "EMME GUERIN-CARANGI",
            "number": 13
          },
          "servedBy": null,
          "isBench": false,
          "code": "A35",
          "label": "Donner du genou",
          "severity": "Mineure 2/4"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "09:05",
          "player": {
            "name": "EMME GUERIN-CARANGI",
            "number": 13
          },
          "servedBy": null,
          "isBench": false,
          "code": "A35",
          "label": "Donner du genou",
          "severity": "Mineure 4/4"
        },
        {
          "type": "goalie",
          "side": "away",
          "time": "08:00",
          "details": "CHARLIE HEBERT (1) - Mis dans le filet"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "07:18",
          "player": {
            "name": "LILIANE TOUSIGNANT",
            "number": 21
          },
          "servedBy": null,
          "isBench": false,
          "code": "A37",
          "label": "Donner un coup de tête",
          "severity": "Mineure 2/4"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "07:18",
          "player": {
            "name": "LILIANE TOUSIGNANT",
            "number": 21
          },
          "servedBy": null,
          "isBench": false,
          "code": "A37",
          "label": "Donner un coup de tête",
          "severity": "Mineure 4/4"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "05:40",
          "player": {
            "name": "ANNABELLA VERBUK",
            "number": 16
          },
          "servedBy": null,
          "isBench": false,
          "code": "A39",
          "label": "Mise en échec corporelle",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "05:40",
          "player": {
            "name": "ANNABELLA VERBUK",
            "number": 16
          },
          "servedBy": null,
          "isBench": false,
          "code": "D39",
          "label": "Mise en échec corporelle",
          "severity": "Extrême inconduite"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "04:12",
          "player": {
            "name": "LOÏC POULIN",
            "number": 74
          },
          "servedBy": null,
          "isBench": false,
          "code": "B31",
          "label": "Assaut",
          "severity": "Majeure"
        },
        {
          "type": "goal",
          "side": "home",
          "time": "03:00",
          "scorer": {
            "name": "LOÏC POULIN",
            "number": 74
          },
          "assists": [
            {
              "name": "JACOB LAPIERRE",
              "number": 4
            }
          ],
          "isPowerplay": false,
          "isShorthanded": false,
          "isEmptyNet": false,
          "isPenaltyShot": false
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "01:45",
          "player": {
            "name": "MAYSON GOSSELIN",
            "number": 77
          },
          "servedBy": null,
          "isBench": false,
          "code": "A44",
          "label": "Donner de la bande",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "01:45",
          "player": {
            "name": "MAYSON GOSSELIN",
            "number": 77
          },
          "servedBy": null,
          "isBench": false,
          "code": "D44",
          "label": "Donner de la bande",
          "severity": "Extrême inconduite"
        }
      ]
    },
    {
      "name": "1RE PÉRIODE",
      "length": "20:00",
      "events": [
        {
          "type": "penalty",
          "side": "home",
          "time": "18:22",
          "player": {
            "name": "SAMUEL NADEAU",
            "number": 19
          },
          "servedBy": null,
          "isBench": false,
          "code": "A47/S",
          "label": "Rudesse",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "16:50",
          "player": {
            "name": "ALEXANDRE CARON",
            "number": 42
          },
          "servedBy": null,
          "isBench": false,
          "code": "A50",
          "label": "Retenir",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "15:10",
          "player": {
            "name": "GABRIEL BELLEFLEUR",
            "number": 5
          },
          "servedBy": null,
          "isBench": false,
          "code": "A51",
          "label": "Avoir retenu le bâton",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "13:30",
          "player": {
            "name": "LILIANE TOUSIGNANT",
            "number": 21
          },
          "servedBy": null,
          "isBench": false,
          "code": "A52",
          "label": "Accrocher",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "12:05",
          "player": {
            "name": "MATHIS DION",
            "number": 9
          },
          "servedBy": null,
          "isBench": false,
          "code": "A54",
          "label": "Faucher les patins",
          "severity": "Mineure 2/4"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "12:05",
          "player": {
            "name": "MATHIS DION",
            "number": 9
          },
          "servedBy": null,
          "isBench": false,
          "code": "A54",
          "label": "Faucher les patins",
          "severity": "Mineure 4/4"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "10:40",
          "player": {
            "name": "FÉLIX DUPUIS",
            "number": 8
          },
          "servedBy": null,
          "isBench": false,
          "code": "A56",
          "label": "Obstruction",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "09:12",
          "player": {
            "name": "VICTORIA JOSEPH",
            "number": 32
          },
          "servedBy": null,
          "isBench": false,
          "code": "A58",
          "label": "Obstruction sur le gardien de but",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "08:00",
          "player": {
            "name": "JEAN-LUC MERCIER",
            "number": 17
          },
          "servedBy": null,
          "isBench": false,
          "code": "A61",
          "label": "Conduite antisportive",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "06:45",
          "player": {
            "name": "RAPHAELLE KANASH",
            "number": 24
          },
          "servedBy": null,
          "isBench": false,
          "code": "C61",
          "label": "Inconduite",
          "severity": "Inconduite"
        },
        {
          "type": "goal",
          "side": "away",
          "time": "05:44",
          "scorer": {
            "name": "SHAID ZERBISH",
            "number": 25
          },
          "assists": [
            {
              "name": "ARNO ALLAIRE",
              "number": 21
            }
          ],
          "isPowerplay": false,
          "isShorthanded": false,
          "isEmptyNet": false,
          "isPenaltyShot": false
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "04:15",
          "player": {
            "name": "THOMAS BOUCHARD",
            "number": 71
          },
          "servedBy": null,
          "isBench": false,
          "code": "A81",
          "label": "Jouer avec un bâton brisé",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "03:00",
          "player": {
            "name": "SAMUEL NADEAU",
            "number": 19
          },
          "servedBy": null,
          "isBench": false,
          "code": "A91",
          "label": "Lancer son bâton",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "01:30",
          "player": {
            "name": "NICOLAS CLOUTIER",
            "number": 66
          },
          "servedBy": null,
          "isBench": false,
          "code": "A92",
          "label": "Retarder le jeu",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "00:30",
          "player": {
            "name": "ZELDA BOUTHILLIER",
            "number": 26
          },
          "servedBy": null,
          "isBench": false,
          "code": "A93",
          "label": "Déplacer intentionnellement le but",
          "severity": "Mineure"
        },
        {
          "type": "goal",
          "side": "away",
          "time": "00:00",
          "scorer": {
            "name": "ABIGAIL HANLEY",
            "number": 10
          },
          "assists": [],
          "isPowerplay": false,
          "isShorthanded": false,
          "isEmptyNet": false,
          "isPenaltyShot": false
        }
      ]
    }
  ]
};

if (typeof module !== undefined && module.exports) {
  module.exports = TEST_GAME_DATA;
}
