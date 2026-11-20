// ==UserScript==
// @name         Demo Auto-Update Google BG
// @namespace    https://alainbolduc.github.io/spordle-play/
// @version      1.0.0
// @description  Test de mise à jour autonome sur google.ca / google.com
// @match        *://*.google.com/*
// @match        *://*.google.ca/*
// @connect      alainbolduc.github.io
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-start
// @downloadURL  https://alainbolduc.github.io/spordle-play/demo-bg-changer.user.js
// ==/UserScript==

(function() {
  'use strict';

  const BUILTIN_VERSION = '1.0.0';
  const BUILTIN_COLOR = '#1e3a8a'; // Bleu nuit

  function applyColor(color, version, source) {
    const render = () => {
      document.body.style.backgroundColor = color;

      let badge = document.getElementById('demo-bg-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'demo-bg-badge';
        badge.style.position = 'fixed';
        badge.style.top = '14px';
        badge.style.right = '14px';
        badge.style.zIndex = '9999999';
        badge.style.padding = '10px 18px';
        badge.style.borderRadius = '30px';
        badge.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        badge.style.fontSize = '14px';
        badge.style.fontWeight = 'bold';
        badge.style.color = '#ffffff';
        badge.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        badge.style.transition = 'all 0.4s ease';
        badge.style.cursor = 'pointer';
        badge.title = 'Cliquez pour réinitialiser le cache';
        badge.onclick = () => {
          localStorage.removeItem('sa_demo_version');
          localStorage.removeItem('sa_demo_color');
          alert('Cache local réinitialisé ! Rechargez la page.');
        };
        document.body.appendChild(badge);
      }
      badge.style.backgroundColor = color;
      badge.style.border = '2px solid rgba(255,255,255,0.7)';
      badge.innerHTML = `🎨 Script <strong>v${version}</strong> [${source}] — Fond: <code>${color}</code>`;
    };

    if (document.body) {
      render();
    } else {
      document.addEventListener('DOMContentLoaded', render);
    }
  }

  // 1. Exécution immédiate avec le cache local ou la valeur par défaut
  const cachedVersion = localStorage.getItem('sa_demo_version') || BUILTIN_VERSION;
  const cachedColor = localStorage.getItem('sa_demo_color') || BUILTIN_COLOR;
  applyColor(cachedColor, cachedVersion, localStorage.getItem('sa_demo_version') ? 'Cache autonome' : 'Original');

  // 2. Vérification silencieuse et autonome en arrière-plan (sur GitHub Pages HTTPS)
  const REMOTE_URL = 'https://alainbolduc.github.io/spordle-play/demo-payload.json?t=' + Date.now();

  function requestPayload(url) {
    return new Promise((resolve, reject) => {
      const gmx = (typeof GM !== 'undefined' && GM && GM.xmlHttpRequest) ? GM.xmlHttpRequest
                : (typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : null);

      if (gmx) {
        gmx({
          method: 'GET',
          url: url,
          headers: { 'Cache-Control': 'no-cache' },
          onload: function(res) {
            try {
              resolve(JSON.parse(res.responseText));
            } catch (e) {
              reject(e);
            }
          },
          onerror: reject
        });
      } else {
        fetch(url, { cache: 'no-store' })
          .then(r => r.json())
          .then(resolve)
          .catch(reject);
      }
    });
  }

  requestPayload(REMOTE_URL)
    .then(data => {
      console.log('[Hot-Update] Données distantes reçues :', data);
      if (data && data.version && data.version !== cachedVersion) {
        console.log(`[Hot-Update] Nouvelle version détectée : v${data.version} (${data.color})`);
        localStorage.setItem('sa_demo_version', data.version);
        localStorage.setItem('sa_demo_color', data.color);

        applyColor(data.color, data.version, '⚡ Mise à jour automatique');
      }
    })
    .catch(err => {
      console.warn('[Hot-Update] Erreur de vérification :', err);
    });
})();
