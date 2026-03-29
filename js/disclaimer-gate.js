const DISCLAIMER_KEY = "disclaimerAccepted";

function setGateInitText() {
  const line = "Initializing system...";
  const target = document.getElementById("gateInit");
  if (!target) return;
  let idx = 0;
  const timer = setInterval(() => {
    target.textContent += line[idx] || "";
    idx += 1;
    if (idx >= line.length) clearInterval(timer);
  }, 30);
}

function openGate() {
  document.body.classList.add("gate-active");
  document.body.classList.remove("gate-exit");
  setGateInitText();

  const checkbox = document.getElementById("disclaimerCheck");
  const button = document.getElementById("enterSystemBtn");

  // Keep action disabled until explicit user consent is given.
  checkbox.addEventListener("change", () => {
    button.disabled = !checkbox.checked;
  });

  // Save acceptance, play exit animation, and restore page interactivity.
  button.addEventListener("click", () => {
    // Persist consent so returning visitors skip the gate (see initDisclaimerGate).
    localStorage.setItem(DISCLAIMER_KEY, "true");
    document.body.classList.add("gate-exit");
    window.setTimeout(() => {
      document.body.classList.remove("gate-active", "gate-exit");
      const gate = document.getElementById("disclaimerGate");
      if (gate) gate.setAttribute("hidden", "true");
    }, 340);
  });
}

function initDisclaimerGate() {
  const accepted = localStorage.getItem(DISCLAIMER_KEY) === "true";
  if (accepted) {
    document.body.classList.remove("gate-active", "gate-exit");
    const gate = document.getElementById("disclaimerGate");
    if (gate) gate.setAttribute("hidden", "true");
    return;
  }
  openGate();
}

document.addEventListener("DOMContentLoaded", initDisclaimerGate);
