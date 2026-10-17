/**
 * Rendu dynamique du sommaire Spordle Play à partir de TEST_GAME_DATA.
 * Permet à demo.html d'être entièrement piloté par les données (sans HTML hardcodé).
 */
(() => {
  "use strict";

  if (typeof TEST_GAME_DATA === "undefined") {
    console.warn("[demo-renderer] TEST_GAME_DATA n'est pas défini.");
    return;
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function formatEventDetails(ev) {
    if (ev.type === "goal") {
      let flags = [];
      if (ev.isPowerplay) flags.push("[AN]");
      if (ev.isShorthanded) flags.push("[DN]");
      if (ev.isEmptyNet) flags.push("[FD]");
      if (ev.isPenaltyShot) flags.push("[Tir de punition]");
      const flagStr = flags.length ? " " + flags.join(" ") : "";
      let str = `${escapeHtml(ev.scorer.name)} (${escapeHtml(ev.scorer.number)})${flagStr}`;
      if (ev.assists && ev.assists.length) {
        str += ` - PASSES: ` + ev.assists.map(a => `${escapeHtml(a.name)} (${escapeHtml(a.number)})`).join(", ");
      }
      return str;
    }

    if (ev.type === "penalty") {
      let parts = [];
      if (ev.isBench) {
        if (ev.servedBy) {
          parts.push(`Punition de banc: ${escapeHtml(ev.servedBy.name)} (${escapeHtml(ev.servedBy.number)})`);
        } else {
          parts.push(`Punition de banc`);
        }
      } else {
        parts.push(`${escapeHtml(ev.player.name)} (${escapeHtml(ev.player.number)})`);
        if (ev.servedBy) {
          parts.push(`SERVI: ${escapeHtml(ev.servedBy.name)} (${escapeHtml(ev.servedBy.number)})`);
        }
      }
      if (ev.code) parts.push(escapeHtml(ev.code));
      let desc = ev.label || "";
      if (ev.severity) desc += ` (${ev.severity})`;
      if (desc) parts.push(escapeHtml(desc));
      return parts.join(" - ");
    }

    if (ev.type === "goalie") {
      return escapeHtml(ev.details);
    }

    return "";
  }

  function renderSummary(container, data) {
    if (!container) return;
    container.innerHTML = "";

    (data.periods || []).forEach((period) => {
      // En-tête de période
      const header = document.createElement("div");
      header.className = "summary-period-header ng-binding";
      header.innerHTML = `${escapeHtml(period.name)} - ${escapeHtml(period.length || "20:00")}<button class="button no-border ion-edit"></button>`;
      container.appendChild(header);

      // Événements de la période
      (period.events || []).forEach((ev) => {
        const itemHost = document.createElement("hi-summary-item");
        // Attacher l'objet structuré à l'élément pour une inspection directe (mode hybride)
        itemHost.dataset.event = JSON.stringify(ev);

        const isGoal = ev.type === "goal";
        const isPenalty = ev.type === "penalty";
        const isGoalie = ev.type === "goalie";

        const actionClass = isGoal ? "goal" : isPenalty ? "penalty" : "goalie";
        const actionSideClass = ev.side === "home" ? "home" : "away";
        const actionLabel = isGoal
          ? (ev.side === "home" ? "But - Local" : "But - Visiteur")
          : isPenalty
          ? (ev.side === "home" ? "Punition - Local" : "Punition - Visiteur")
          : (ev.side === "home" ? "Gardien - Local" : "Gardien - Visiteur");

        const detailsText = formatEventDetails(ev);

        itemHost.innerHTML = `
          <div class="summary-item">
            <div class="time ng-binding">${escapeHtml(ev.time)}</div>
            <div class="action ng-binding ${actionSideClass} ${actionClass}">${escapeHtml(actionLabel)}</div>
            <div class="details ng-binding">${detailsText}</div>
            <div class="modify">
              <ng-transclude>
                <button class="button button-balanced button-outline no-border ion-edit"></button>
                <button class="button button-energized button-outline no-border ion-close"></button>
              </ng-transclude>
            </div>
          </div>
        `.trim();

        container.appendChild(itemHost);
      });

      // Pied de période
      const footer = document.createElement("div");
      footer.className = "summary-period-footer ng-binding ng-hide";
      footer.textContent = "0 événements cachés par le filtre actuel";
      container.appendChild(footer);
    });
  }

  // Initialisation au chargement du DOM
  const container = document.querySelector(".summary-items");
  if (container) {
    renderSummary(container, TEST_GAME_DATA);
  }

  // Gestion interactive des filtres de demo.html
  function setupFilters() {
    const filterButtons = document.querySelectorAll(".summary-filters .filter");
    if (!filterButtons.length) return;

    let activeTeam = null; // 'away' | 'home' | null
    let activeType = null; // 'goal' | 'penalty' | null
    let activeOption = null; // 'minor' | 'major' | null

    const optionFiltersContainer = document.querySelector(".summary-filters .filters.hidden") ||
                                    document.querySelectorAll(".summary-filters .filters")[2];

    function applyFilters() {
      const items = document.querySelectorAll("hi-summary-item");
      items.forEach((item) => {
        let ev = null;
        try {
          ev = JSON.parse(item.dataset.event);
        } catch (_) {}
        if (!ev) return;

        let visible = true;
        if (activeTeam && ev.side !== activeTeam) visible = false;
        if (activeType && ev.type !== activeType) visible = false;
        if (activeType === "penalty" && activeOption) {
          const sev = (ev.severity || "").toLowerCase();
          if (activeOption === "minor" && !/mineure|minor/.test(sev)) visible = false;
          if (activeOption === "major" && !/majeure|major/.test(sev)) visible = false;
        }

        if (visible) {
          item.classList.remove("ng-hide");
          item.style.display = "";
        } else {
          item.classList.add("ng-hide");
          item.style.display = "none";
        }
      });

      document.querySelectorAll(".summary-period-footer").forEach((footer) => {
        footer.classList.remove("ng-hide");
        footer.style.display = "";
      });
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.textContent.trim().toUpperCase();
        if (text === "VISITEUR") {
          activeTeam = activeTeam === "away" ? null : "away";
        } else if (text === "LOCAL") {
          activeTeam = activeTeam === "home" ? null : "home";
        } else if (text === "BUTS") {
          activeType = activeType === "goal" ? null : "goal";
          activeOption = null;
        } else if (text === "PUNITIONS") {
          activeType = activeType === "penalty" ? null : "penalty";
          if (!activeType) activeOption = null;
        } else if (text === "MINEURE") {
          activeOption = activeOption === "minor" ? null : "minor";
        } else if (text === "MAJEURE") {
          activeOption = activeOption === "major" ? null : "major";
        }

        filterButtons.forEach((b) => {
          const t = b.textContent.trim().toUpperCase();
          if (t === "VISITEUR") b.classList.toggle("selected", activeTeam === "away");
          if (t === "LOCAL") b.classList.toggle("selected", activeTeam === "home");
          if (t === "BUTS") b.classList.toggle("selected", activeType === "goal");
          if (t === "PUNITIONS") b.classList.toggle("selected", activeType === "penalty");
          if (t === "MINEURE") b.classList.toggle("selected", activeOption === "minor");
          if (t === "MAJEURE") b.classList.toggle("selected", activeOption === "major");
        });

        if (optionFiltersContainer) {
          if (activeType === "penalty") {
            optionFiltersContainer.classList.remove("hidden");
          } else {
            optionFiltersContainer.classList.add("hidden");
          }
        }

        applyFilters();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupFilters);
  } else {
    setupFilters();
  }

  // Exposer les données de match synthétiques simulant la réponse de l'API Spordle
  if (typeof window !== "undefined") {
    window.__SPORDLE_GAME_DATA__ = TEST_GAME_DATA;
    try {
      document.dispatchEvent(new CustomEvent("spordle:game-data", { detail: TEST_GAME_DATA }));
    } catch (_) {}
  }
})();
