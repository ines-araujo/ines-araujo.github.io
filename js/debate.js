function guardPage() {
  if (!ensureUnlocked("debate")) {
    window.location.href = "./index.html";
  }
}

const dialogueTree = {
  start: {
    speaker: "ACTIVIST",
    text: "You traced me through metadata. You still think content is the only thing that matters?",
    choices: [
      { text: "Metadata can save lives by preventing attacks.", next: "agency1" },
      { text: "People deserve privacy, even when watched by the state.", next: "activist1" }
    ]
  },
  agency1: {
    speaker: "HANDLER",
    text: "Analyst, stay focused. National security depends on broad visibility.",
    choices: [
      { text: "How broad?", next: "twist1" },
      { text: "Understood. Continue extraction.", next: "twist1" }
    ]
  },
  activist1: {
    speaker: "ACTIVIST",
    text: "Visibility became profiling. Profiling became targeting. You know this.",
    choices: [
      { text: "Then why leak?", next: "twist1" },
      { text: "What was in the files?", next: "twist1" }
    ]
  },
  twist1: {
    speaker: "SYSTEM",
    text: "Alert: Analyst behavioral telemetry exported to Oversight Unit. Session recorded.",
    choices: [{ text: "What telemetry?", next: "twist2" }]
  },
  twist2: {
    speaker: "ACTIVIST",
    text: "They said I was the threat. Then I found my own movement profile in their archive. You should request yours.",
    choices: [{ text: "Finish report.", next: "end" }]
  },
  end: {
    speaker: "HANDLER",
    text: "Debrief complete. Your recommendation is logged. Trust protocol remains in effect.",
    choices: []
  }
};

function renderNode(nodeKey) {
  const node = dialogueTree[nodeKey];
  const speaker = document.getElementById("speaker");
  const text = document.getElementById("dialogueText");
  const choices = document.getElementById("choiceBox");
  const feedback = document.getElementById("debateFeedback");
  const toConclusion = document.getElementById("toConclusion");

  speaker.textContent = `SPEAKER: ${node.speaker}`;
  text.textContent = node.text;
  choices.innerHTML = "";

  if (!node.choices.length) {
    markSolved("debate");
    feedback.textContent = "Debate logged. Final debrief unlocked.";
    feedback.className = "status good";
    toConclusion.removeAttribute("aria-disabled");
    return;
  }

  node.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => renderNode(choice.next));
    choices.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  guardPage();
  if (getState().progress.debateFinished) {
    document.getElementById("debateFeedback").textContent = "Debate previously completed.";
    document.getElementById("debateFeedback").className = "status good";
  }
  renderNode("start");
});
