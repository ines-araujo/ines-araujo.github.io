/**
 * Persistent Investigation Navigation (all pages).
 * - Coherence / signaling (Mayer): one stable panel for “where am I?” and next steps.
 * - Begin vs Continue: routes to the first incomplete case file based on `progress` in localStorage.
 * - Locked chapters: intercept clicks and show a toast instead of navigating away mid-task.
 * - `bindProceedGuard`: pairs primary “Proceed to …” links with progress flags; blocks early advance.
 */
const INV_CHAPTERS = [
  { key: "landing", label: "00 · Introduction", href: "./index.html" },
  { key: "documents", label: "01 · Document metadata", href: "./docs-metadata.html" },
  { key: "graph", label: "02 · Social graph", href: "./social-graph.html" },
  { key: "location", label: "03 · Location", href: "./location-analysis.html" },
  { key: "debate", label: "04 · Debate", href: "./debate.html" },
  { key: "conclusion", label: "05 · Conclusion", href: "./conclusion.html" },
  { key: "references", label: "06 · References", href: "./references.html" }
];

function getContinueHref() {
  const s = getState();
  if (!s.progress.documentsSolved) return "./docs-metadata.html";
  if (!s.progress.graphSolved) return "./social-graph.html";
  if (!s.progress.locationSolved) return "./location-analysis.html";
  if (!s.progress.debateFinished) return "./debate.html";
  return "./conclusion.html";
}

function hasAnyProgress() {
  const s = getState();
  return (
    s.progress.documentsSolved ||
    s.progress.graphSolved ||
    s.progress.locationSolved ||
    s.progress.debateFinished
  );
}

function renderInvestigationNav() {
  const mount = document.getElementById("investigationNavMount");
  if (!mount) return;

  mount.innerHTML = "";
  mount.classList.add("inv-nav-panel");

  const title = document.createElement("h2");
  title.className = "inv-nav-title";
  title.textContent = "Investigation navigation";

  const primary = document.createElement("a");
  primary.className = "btn btn-primary";
  const started = hasAnyProgress();
  primary.href = getContinueHref();
  primary.textContent = started ? "Continue investigation" : "Begin investigation";

  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "btn btn-secondary";
  reset.textContent = "Reset investigation state";
  reset.addEventListener("click", () => {
    if (window.confirm("Clear all progress and choices for this browser?")) {
      resetInvestigation();
      window.location.href = "./index.html";
    }
  });

  const grid = document.createElement("div");
  grid.className = "inv-nav-chapters";

  const state = getState();
  INV_CHAPTERS.forEach((ch) => {
    const a = document.createElement("a");
    a.href = ch.href;
    a.className = "inv-nav-link";
    a.textContent = ch.label;
    if (!state.unlocked[ch.key]) {
      a.classList.add("inv-nav-link--locked");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        showBlockedMessage();
      });
    }
    grid.appendChild(a);
  });

  mount.appendChild(title);
  mount.appendChild(primary);
  mount.appendChild(reset);
  mount.appendChild(grid);
}

function showBlockedMessage(overrideMessage) {
  const el = document.getElementById("progressToast");
  const msg = overrideMessage || "You must complete this task before continuing.";
  if (el) {
    el.textContent = msg;
    el.classList.add("progress-toast--show");
    window.clearTimeout(showBlockedMessage._t);
    showBlockedMessage._t = window.setTimeout(() => el.classList.remove("progress-toast--show"), 4200);
  } else {
    window.alert(msg);
  }
}

/**
 * Block navigation until a progress flag is true; keeps link styled as disabled when blocked.
 * @param {HTMLElement|null} linkEl
 * @param {keyof ReturnType<typeof getState>["progress"]} progressKey
 * @param {string} [customBlockedMessage] - optional toast when blocked (e.g. location page)
 */
function bindProceedGuard(linkEl, progressKey, customBlockedMessage) {
  if (!linkEl) return;

  function sync() {
    const ok = !!getState().progress[progressKey];
    if (ok) {
      linkEl.classList.remove("btn-disabled");
      linkEl.removeAttribute("aria-disabled");
    } else {
      linkEl.classList.add("btn-disabled");
      linkEl.setAttribute("aria-disabled", "true");
    }
  }

  linkEl.addEventListener("click", (e) => {
    if (!getState().progress[progressKey]) {
      e.preventDefault();
      showBlockedMessage(customBlockedMessage);
    }
  });

  sync();
  return sync;
}

document.addEventListener("DOMContentLoaded", renderInvestigationNav);
