// ==UserScript==
// @name         Spordle Annonceur
// @namespace    https://github.com/AlainBolduc/spordle-play
// @version      1.0.0
// @description  Chargeur automatique Spordle Annonceur avec cache hors-ligne
// @author       Alain Bolduc
// @match        *://*.spordle.com/*
// @match        *://*.spordle.dev/*
// @match        *://*.hisports.app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/AlainBolduc/spordle-play/main/dist/spordle-annonceur.user.js
// @downloadURL  https://raw.githubusercontent.com/AlainBolduc/spordle-play/main/dist/spordle-annonceur.user.js
// ==/UserScript==

(() => {
  "use strict";

  const STORAGE_KEY = "sa_engine_bundle_code";
  const BUNDLE_URL = "https://raw.githubusercontent.com/AlainBolduc/spordle-play/main/dist/spordle-bundle.js";

  // Évite d'exécuter le bundle deux fois sur la même page
  let executed = false;

  const runBundle = (code, source) => {
    if (executed || !code) return;
    try {
      executed = true;
      // Exécution directe et sécurisée dans le contexte actuel
      const runner = new Function(code);
      runner();
      console.log("[Spordle Annonceur] Bundle exécuté avec succès (Source: " + source + ")");
    } catch (err) {
      console.error("[Spordle Annonceur] Erreur lors de l'exécution du bundle:", err);
      executed = false;
    }
  };

  // 1. Démarrage instantané : Exécuter immédiatement le code en cache local (hors-ligne ready)
  let cachedCode = null;
  try {
    cachedCode = localStorage.getItem(STORAGE_KEY);
  } catch (_) {}

  if (cachedCode) {
    runBundle(cachedCode, "cache-local");
  }

  // 2. En arrière-plan : Télécharger la dernière version sur GitHub
  const fetchLatest = () => {
    const url = BUNDLE_URL + "?_cb=" + Date.now();

    // Utilise GM_xmlhttpRequest si disponible (contourne les CORS stricts), sinon fetch standard
    if (typeof GM_xmlhttpRequest === "function") {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: (res) => handleResponse(res.responseText),
        onerror: (err) => console.warn("[Spordle Annonceur] Réseau indisponible (mode hors-ligne):", err)
      });
    } else {
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.text();
        })
        .then(handleResponse)
        .catch((err) => console.warn("[Spordle Annonceur] Réseau indisponible (mode hors-ligne):", err));
    }
  };

  const handleResponse = (freshCode) => {
    if (!freshCode || typeof freshCode !== "string" || freshCode.length < 500) return;

    if (freshCode !== cachedCode) {
      console.log("[Spordle Annonceur] 🚀 Nouvelle version détectée ! Mise à jour du cache local.");
      try {
        localStorage.setItem(STORAGE_KEY, freshCode);
      } catch (e) {
        console.warn("[Spordle Annonceur] Impossible d'écrire dans localStorage:", e);
      }

      // Si le script n'avait jamais été exécuté (1er lancement sans cache)
      if (!executed) {
        runBundle(freshCode, "github-live");
      }
    } else {
      console.log("[Spordle Annonceur] Le script local est à jour.");
    }
  };

  fetchLatest();
})();
