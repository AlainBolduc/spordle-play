#!/usr/bin/env node
/**
 * Script de compilation officiel pour Spordle Annonceur :
 * 1. Assemble le CSS, le moteur (spordle-engine.js) et le script d'injection DOM (content.js).
 * 2. Obfusque le code JavaScript pour protéger la propriété intellectuelle tout en préservant
 *    la stricte compatibilité CSP Safari iOS (zéro eval(), zéro selfDefending trap).
 * 3. Génère les distributions pour :
 *    - dist/ (distribution standard et compatibilité raw.githubusercontent)
 *    - docs/ (hébergement GitHub Pages autonome avec guide d'installation et script obfusqué)
 */

const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const DOCS_DIST_DIR = path.join(DOCS_DIR, 'dist');
const DOCS_ASSETS_DIR = path.join(DOCS_DIR, 'assets', 'guide');
const SRC_ASSETS_DIR = path.join(ROOT_DIR, 'assets', 'guide');

// Assure l'existence des répertoires de sortie
[DIST_DIR, DOCS_DIR, DOCS_DIST_DIR, DOCS_ASSETS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'manifest.json'), 'utf8'));
const version = manifest.version || '1.0.0';

const cssContent = fs.readFileSync(path.join(ROOT_DIR, 'content.css'), 'utf8');
const engineContent = fs.readFileSync(path.join(ROOT_DIR, 'spordle-engine.js'), 'utf8');
const contentJsContent = fs.readFileSync(path.join(ROOT_DIR, 'content.js'), 'utf8');

// En-tête officiel Userscript (requis en clair par Tampermonkey et l'extension Safari Userscripts)
const USER_SCRIPT_HEADER = `// ==UserScript==
// @name         Spordle Annonceur
// @namespace    https://alainbolduc.github.io/spordle-play/
// @version      ${version}
// @description  Affiche le texte officiel d'annonce à lire au micro sur Spordle Play
// @author       Alain Bolduc
// @copyright    2026, Alain Bolduc. Tous droits réservés.
// @license      Proprietary / Usage bénévole seulement (https://alainbolduc.github.io/spordle-play/)
// @match        *://*.spordle.com/*
// @match        *://*.spordle.dev/*
// @match        *://*.hisports.app/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://alainbolduc.github.io/spordle-play/spordle-annonceur.meta.js
// @downloadURL  https://alainbolduc.github.io/spordle-play/spordle-annonceur.user.js
// ==/UserScript==
`;

// Bannière légale insérée dans le bundle distribué
const LEGAL_BANNER = `/**
 * Spordle Annonceur — v${version}
 * Copyright (c) 2026 Alain Bolduc. Tous droits réservés / All rights reserved.
 * 
 * Distribution officielle : https://alainbolduc.github.io/spordle-play/
 * 
 * LICENCE PROPRIÉTAIRE :
 * Usage bénévole et personnel autorisé pour les matchs de hockey amateur officiels.
 * Toute reproduction, intégration commerciale, redistribution ou rétro-ingénierie
 * sans autorisation écrite préalable est formellement interdite.
 */
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

// Payload complet non-obfusqué
const rawPayload = `
(() => {
  ${CSS_INJECTOR}

  // --- MOTEUR OFFICIEL DES ANNONCES ---
  ${engineContent}

  // --- LOGIQUE D'INJECTION DOM ---
  ${contentJsContent}
})();
`;

console.log(`🔒 Obfuscation du code source en cours (v${version})...`);

// Configuration sécuritaire de l'obfusqueur pour Safari iOS / CSP
const obfuscationResult = JavaScriptObfuscator.obfuscate(rawPayload, {
  compact: true,
  controlFlowFlattening: false, // Évite la surchauffe CPU sur iPad
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false, // Préserve window/document
  selfDefending: false, // Indispensable pour éviter tout blocage CSP
  stringArray: true,
  stringArrayEncoding: ['base64'], // Masque les textes et dictionnaires
  stringArrayThreshold: 0.8,
  target: 'browser'
});

const obfuscatedCode = obfuscationResult.getObfuscatedCode();
const finalUserscript = `${USER_SCRIPT_HEADER}\n${LEGAL_BANNER}\n${obfuscatedCode}\n`;

// 1. Écriture dans dist/
fs.writeFileSync(path.join(DIST_DIR, 'spordle-annonceur.user.js'), finalUserscript, 'utf8');
fs.writeFileSync(path.join(DIST_DIR, 'spordle-annonceur.meta.js'), USER_SCRIPT_HEADER, 'utf8');
fs.writeFileSync(path.join(DIST_DIR, 'spordle-bundle.js'), finalUserscript, 'utf8');

// 2. Écriture dans docs/ (GitHub Pages root et sous-dossier dist/)
fs.writeFileSync(path.join(DOCS_DIR, 'spordle-annonceur.user.js'), finalUserscript, 'utf8');
fs.writeFileSync(path.join(DOCS_DIR, 'spordle-annonceur.meta.js'), USER_SCRIPT_HEADER, 'utf8');
fs.writeFileSync(path.join(DOCS_DIST_DIR, 'spordle-annonceur.user.js'), finalUserscript, 'utf8');
fs.writeFileSync(path.join(DOCS_DIST_DIR, 'spordle-annonceur.meta.js'), USER_SCRIPT_HEADER, 'utf8');

// 3. Copie des images du guide vers docs/assets/guide/
if (fs.existsSync(SRC_ASSETS_DIR)) {
  const assetFiles = fs.readdirSync(SRC_ASSETS_DIR);
  assetFiles.forEach((file) => {
    fs.copyFileSync(path.join(SRC_ASSETS_DIR, file), path.join(DOCS_ASSETS_DIR, file));
  });
}

// 4. Génération de docs/index.html (Guide d'installation officiel GitHub Pages)
let guideHtml = fs.readFileSync(path.join(ROOT_DIR, 'guide-installation.html'), 'utf8');

// Met à jour la version et assure la présence du bouton de téléchargement direct
fs.writeFileSync(path.join(DOCS_DIR, 'index.html'), guideHtml, 'utf8');

console.log(`✅ Compilation & Obfuscation terminées avec succès !`);
console.log(`   📦 dist/spordle-annonceur.user.js (${(Buffer.byteLength(finalUserscript, 'utf8') / 1024).toFixed(1)} KB)`);
console.log(`   📦 docs/spordle-annonceur.user.js (GitHub Pages)`);
console.log(`   📄 docs/index.html (Guide GitHub Pages)`);
