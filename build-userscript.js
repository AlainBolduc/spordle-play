#!/usr/bin/env node
/**
 * Script de build pour générer le Userscript Safari / Tampermonkey :
 * dist/spordle-annonceur.user.js
 * 
 * Combine :
 * 1. En-tête de métadonnées UserScript
 * 2. Injection CSS (content.css)
 * 3. Moteur pur (spordle-engine.js)
 * 4. Logique DOM & UI (content.js)
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
// @grant        GM_addStyle
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/AlainBolduc/spordle-play/main/dist/spordle-annonceur.user.js
// @downloadURL  https://raw.githubusercontent.com/AlainBolduc/spordle-play/main/dist/spordle-annonceur.user.js
// ==/UserScript==
`;

// Helper d'injection CSS compatible GM_addStyle ou fallback DOM standard
const CSS_INJECTOR = `
(() => {
  const css = ${JSON.stringify(cssContent)};
  if (typeof GM_addStyle === "function") {
    GM_addStyle(css);
  } else {
    const style = document.createElement("style");
    style.id = "spordle-annonceur-styles";
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }
})();
`;

const bundled = `${USER_SCRIPT_HEADER}
/**
 * -------------------------------------------------------------
 * 1. STYLES CSS (content.css)
 * -------------------------------------------------------------
 */
${CSS_INJECTOR}

/**
 * -------------------------------------------------------------
 * 2. MOTEUR OFFICIEL (spordle-engine.js)
 * -------------------------------------------------------------
 */
${engineContent}

/**
 * -------------------------------------------------------------
 * 3. LOGIQUE D'INJECTION DOM (content.js)
 * -------------------------------------------------------------
 */
${contentJsContent}
`;

const outputFile = path.join(DIST_DIR, 'spordle-annonceur.user.js');
fs.writeFileSync(outputFile, bundled, 'utf8');

console.log(`✅ Userscript généré avec succès dans: dist/spordle-annonceur.user.js`);
console.log(`📦 Taille: ${(Buffer.byteLength(bundled, 'utf8') / 1024).toFixed(1)} KB`);
