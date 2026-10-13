#!/usr/bin/env node
/**
 * Script de build pour :
 * 1. dist/spordle-bundle.js      : Le code complet (CSS + moteur + UI) hébergé sur GitHub
 * 2. dist/spordle-annonceur.user.js : Le chargeur léger autonome (~2 Ko) installé une seule fois sur l'iPad
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'manifest.json'), 'utf8'));
const version = manifest.version || '1.0.0';

const cssContent = fs.readFileSync(path.join(ROOT_DIR, 'content.css'), 'utf8');
const engineContent = fs.readFileSync(path.join(ROOT_DIR, 'spordle-engine.js'), 'utf8');
const contentJsContent = fs.readFileSync(path.join(ROOT_DIR, 'content.js'), 'utf8');

// -------------------------------------------------------------
// 1. GÉNÉRER dist/spordle-bundle.js (Le payload complet distribué)
// -------------------------------------------------------------
const bundleContent = `/**
 * Spordle Annonceur — Bundle Complet v${version}
 * Généré automatiquement le ${new Date().toISOString()}
 */
(() => {
  "use strict";

  // --- 1. Injection des styles CSS ---
  try {
    const existing = document.getElementById("spordle-annonceur-styles");
    if (!existing) {
      const css = ${JSON.stringify(cssContent)};
      const style = document.createElement("style");
      style.id = "spordle-annonceur-styles";
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    }
  } catch (e) {
    console.error("[Spordle Annonceur] Erreur injection CSS:", e);
  }

  // --- 2. Moteur d'annonces SpordleEngine ---
  ${engineContent}

  // --- 3. Logique d'interface DOM ---
  ${contentJsContent}
})();
`;

fs.writeFileSync(path.join(DIST_DIR, 'spordle-bundle.js'), bundleContent, 'utf8');
console.log(`✅ Bundle complet généré : dist/spordle-bundle.js (${(Buffer.byteLength(bundleContent, 'utf8') / 1024).toFixed(1)} KB)`);

// -------------------------------------------------------------
// 2. GÉNÉRER dist/spordle-annonceur.user.js (Le Loader autonome)
// -------------------------------------------------------------
const loaderContent = `// ==UserScript==
// @name         Spordle Annonceur
// @namespace    https://github.com/AlainBolduc/spordle-play
// @version      ${version}
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
`;

fs.writeFileSync(path.join(DIST_DIR, 'spordle-annonceur.user.js'), loaderContent, 'utf8');
console.log(`✅ Loader autonome généré : dist/spordle-annonceur.user.js (${(Buffer.byteLength(loaderContent, 'utf8') / 1024).toFixed(1)} KB)`);
