const chapters = [
  { key: "documents", label: "01 / Document Metadata", href: "./docs-metadata.html" },
  { key: "graph", label: "02 / Phone Patterns & Social Graphs", href: "./social-graph.html" },
  { key: "location", label: "03 / Location Analysis", href: "./location-analysis.html" },
  { key: "debate", label: "04 / The Debate", href: "./debate.html" },
  { key: "conclusion", label: "05 / Conclusion", href: "./conclusion.html" },
  { key: "references", label: "06 / References", href: "./references.html" }
];

function renderNav() {
  const state = getState();
  const nav = document.getElementById("chapterNav");
  nav.innerHTML = "";
  chapters.forEach((chapter) => {
    const card = document.createElement("a");
    card.className = "chapter-card";
    card.href = chapter.href;
    card.textContent = chapter.label;
    if (!state.unlocked[chapter.key]) {
      card.classList.add("locked");
      card.textContent += " [LOCKED]";
    }
    nav.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  typeText("typedIntro", "Initializing secure channel... analyst profile accepted.");
  randomGlitch();
  renderNav();
  document.getElementById("resetBtn").addEventListener("click", () => {
    resetInvestigation();
    renderNav();
    alert("Investigation state cleared.");
  });
});
