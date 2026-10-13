#!/usr/bin/env node
/**
 * Script de build officiel pour Spordle Annonceur :
 * dist/spordle-annonceur.user.js
 * 
 * Fichier autonome 100% fiable pour Safari iOS / Mac / Tampermonkey.
 * Aucun fetch dynamique ni eval() : compatible avec la stricte Content Security Policy (CSP) d'iOS.
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

const USER_SCRIPT_HEADER = `// ==UserScript==
// @name         Spordle Annonceur
// @namespace    https://github.com/AlainBolduc/spordle-play
// @version      ${version}
// @description  Affiche le texte exact à lire au micro pour chaque but et punition sur Spordle Play
// @author       Alain Bolduc
// @match        *://*.spordle.com/*
// @match        *://*.spordle.dev/*
// @match        *://*.hisports.app/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/AlainBolduc/spordle-play/main/dist/spordle-annonceur.meta.js
// @downloadURL  https://raw.githubusercontent.com/AlainBolduc/spordle-play/main/dist/spordle-annonceur.user.js
// ==/UserScript==
`;

// Helper d'injection CSS 100% natif dans le DOM
const CSS_INJECTOR = `
(() => {
  try {
    const existing = document.getElementById("spordle-annonceur-styles");
    if (!existing) {
      const css = ${JSON.stringify(cssContent)};
      const style = document.createElement("style");
      style.id = "spordle-annonceur-styles";
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    }
  } catch (err) {
    console.error("[Spordle Annonceur] Erreur injection CSS:", err);
  }
})();
`;

const bundled = `${USER_SCRIPT_HEADER}
/**
 * =============================================================
 * 1. INJECTION DES STYLES CSS (content.css)
 * =============================================================
 */
${CSS_INJECTOR}

/**
 * =============================================================
 * 2. MOTEUR OFFICIEL DES ANNONCES (spordle-engine.js)
 * =============================================================
 */
${engineContent}

/**
 * =============================================================
 * 3. LOGIQUE D'INJECTION DANS LE SOMMAIRE SPORDLE PLAY (content.js)
 * =============================================================
 */
${contentJsContent}
`;

const outputFile = path.join(DIST_DIR, 'spordle-annonceur.user.js');
fs.writeFileSync(outputFile, bundled, 'utf8');

// Écrit également le fichier léger .meta.js requis pour les vérifications de versions Safari/Userscripts
const metaFile = path.join(DIST_DIR, 'spordle-annonceur.meta.js');
fs.writeFileSync(metaFile, USER_SCRIPT_HEADER, 'utf8');

// Écrit également spordle-bundle.js pour compatibilité si nécessaire
fs.writeFileSync(path.join(DIST_DIR, 'spordle-bundle.js'), bundled, 'utf8');

console.log(`✅ Fichier Userscript autonome généré avec succès : dist/spordle-annonceur.user.js`);
console.log(`✅ Fichier Metadata généré avec succès : dist/spordle-annonceur.meta.js`);
console.log(`📦 Taille : ${(Buffer.byteLength(bundled, 'utf8') / 1024).toFixed(1)} KB`);

