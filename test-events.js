/**
 * Catalogue complet des 66 cas de tests et événements de match.
 * Compatible Node.js (CommonJS) et Navigateur (variable globale TEST_GAME_DATA).
 */
const TEST_GAME_DATA = {
  "game": {
    "number": "1021",
    "division": "U12",
    "category": "AA",
    "homeDefaultColor": true,
    "awayDefaultColor": true,
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
  "homeTeam": {
    "name": "REMPARTS OUEST RICHELIEU",
    "shortName": "REMPARTS OUEST RICHELIEU",
    "logo": "assets/logos/remparts-ouest.png",
    "homeColor": "BLEU",
    "awayColor": "BLANC",
    "category": {
      "id": "ff6437de-8fee-4641-b672-ecb91859aa0f",
      "name": "U12 AA",
      "nameFr": "M12 AA",
      "i18n": {
        "fr": {
          "name": "M12 AA"
        }
      }
    }
  },
  "awayTeam": {
    "name": "REMPARTS EST RICHELIEU",
    "shortName": "REMPARTS EST RICHELIEU",
    "logo": "assets/logos/remparts-est.png",
    "homeColor": "ROUGE",
    "awayColor": "BLANC",
    "category": {
      "id": "ff6437de-8fee-4641-b672-ecb91859aa0f",
      "name": "U12 AA",
      "nameFr": "M12 AA",
      "i18n": {
        "fr": {
          "name": "M12 AA"
        }
      }
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
            "name": "SOPHIE TREMBLAY",
            "number": 25
          },
          "assists": [
            {
              "name": "CAMILLE ROY",
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
            "name": "ALEXANDRE GAGNON",
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
            "name": "CHLOÉ CÔTÉ",
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
            "name": "FÉLIX BOUCHARD",
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
            "name": "FÉLIX BOUCHARD",
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
          "time": "19:40",
          "player": {
            "name": "SAMUEL GAUTHIER",
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
          "time": "19:40",
          "player": {
            "name": "SAMUEL GAUTHIER",
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
            "name": "THOMAS MORIN",
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
            "name": "ÉMILIE LAVOIE",
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
            "name": "OLIVIER FORTIN",
            "number": 34
          },
          "assists": [
            {
              "name": "MAXIME GAGNÉ",
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
          "details": "MARIE-ÈVE OUELLET (33) - Retiré du filet"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "17:37",
          "player": {
            "name": "LÉA PELLETIER",
            "number": 30
          },
          "servedBy": {
            "name": "ALICE BÉLANGER",
            "number": 15
          },
          "isBench": false,
          "code": "A22",
          "label": "Coup de bâton",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "16:30",
          "player": {
            "name": "JULIETTE LÉVESQUE",
            "number": 14
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
          "time": "15:10",
          "player": {
            "name": "SIMON BERGERON",
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
            "name": "SIMON BERGERON",
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
            "name": "CLARA LEBLANC",
            "number": 21
          },
          "assists": [
            {
              "name": "BÉATRICE PAQUETTE",
              "number": 22
            },
            {
              "name": "ROSALIE GIRARD",
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
            "name": "SOPHIE TREMBLAY",
            "number": 25
          },
          "assists": [
            {
              "name": "CAMILLE ROY",
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
            "name": "ANTOINE SIMARD",
            "number": 1
          },
          "servedBy": {
            "name": "JULIETTE LÉVESQUE",
            "number": 14
          },
          "isBench": false,
          "code": "A22/G",
          "label": "Coup de bâton",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "10:31",
          "player": {
            "name": "FLORENCE BOUCHER",
            "number": 13
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
          "time": "09:15",
          "player": {
            "name": "ÉMILIE LAVOIE",
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
            "name": "ÉMILIE LAVOIE",
            "number": 26
          },
          "servedBy": null,
          "isBench": false,
          "code": "D40",
          "label": "Mise en échec par derrière",
          "severity": "Extrême inconduite"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "07:48",
          "player": {
            "name": "ÉMILIE LAVOIE",
            "number": 26
          },
          "servedBy": null,
          "isBench": false,
          "code": "A22",
          "label": "Coup de bâton",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "06:12",
          "player": {
            "name": "NICOLAS BEAULIEU",
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
            "name": "MAUDE CLOUTIER",
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
            "name": "MAUDE CLOUTIER",
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
            "name": "JULIETTE LÉVESQUE",
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
            "name": "JULIETTE LÉVESQUE",
            "number": 14
          },
          "servedBy": null,
          "isBench": false,
          "code": "C83",
          "label": "Refus de mesurage",
          "severity": "Inconduite"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "01:10",
          "player": {
            "name": "MAXIME GAGNÉ",
            "number": 77
          },
          "servedBy": null,
          "isBench": false,
          "code": "A50",
          "label": "Retenir",
          "severity": "Mineure"
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
            "name": "JUSTINE DUBÉ",
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
            "name": "ROSALIE GIRARD",
            "number": 23
          },
          "assists": [
            {
              "name": "JUSTINE DUBÉ",
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
            "name": "XAVIER POIRIER",
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
            "name": "XAVIER POIRIER",
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
            "name": "CAMILLE ROY",
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
            "name": "CAMILLE ROY",
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
          "details": "MARIE-ÈVE OUELLET (33) - Mis dans le filet"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "12:40",
          "player": {
            "name": "GABRIEL FOURNIER",
            "number": 28
          },
          "servedBy": null,
          "isBench": false,
          "code": "A53",
          "label": "Faire trébucher",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "11:15",
          "player": {
            "name": "ALICE BÉLANGER",
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
            "name": "BÉATRICE PAQUETTE",
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
            "name": "FLORENCE BOUCHER",
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
            "name": "FLORENCE BOUCHER",
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
          "details": "ANTOINE SIMARD (1) - Mis dans le filet"
        },
        {
          "type": "penalty",
          "side": "home",
          "time": "07:18",
          "player": {
            "name": "CHLOÉ CÔTÉ",
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
            "name": "CHLOÉ CÔTÉ",
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
            "name": "LAURENCE CARON",
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
            "name": "LAURENCE CARON",
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
            "name": "LOÏC LAPOINTE",
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
            "name": "LOÏC LAPOINTE",
            "number": 74
          },
          "assists": [
            {
              "name": "JACOB LECLERC",
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
            "name": "MAXIME GAGNÉ",
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
            "name": "MAXIME GAGNÉ",
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
            "name": "SAMUEL GAUTHIER",
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
            "name": "RAPHAËL LEFEBVRE",
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
            "name": "NOAH MARTEL",
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
            "name": "CHLOÉ CÔTÉ",
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
            "name": "MATHIS LANDRY",
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
            "name": "MATHIS LANDRY",
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
            "name": "FÉLIX BOUCHARD",
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
            "name": "CAMILLE ROY",
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
            "name": "ALEXANDRE GAGNON",
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
            "name": "JUSTINE DUBÉ",
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
            "name": "GABRIEL FOURNIER",
            "number": 28
          },
          "assists": [
            {
              "name": "XAVIER POIRIER",
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
            "name": "THOMAS MORIN",
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
            "name": "SAMUEL GAUTHIER",
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
            "name": "NICOLAS BEAULIEU",
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
            "name": "ÉMILIE LAVOIE",
            "number": 26
          },
          "servedBy": null,
          "isBench": false,
          "code": "A93",
          "label": "Déplacer intentionnellement le but",
          "severity": "Mineure"
        },
        {
          "type": "penalty",
          "side": "away",
          "time": "00:00",
          "player": {
            "name": "NOÉMIE THIBAULT",
            "number": 10
          },
          "servedBy": null,
          "isBench": false,
          "code": "A47",
          "label": "Rudesse",
          "severity": "Mineure"
        }
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = TEST_GAME_DATA;
}
