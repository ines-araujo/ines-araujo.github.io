function guardPage() {
  if (!ensureUnlocked("debate")) {
    window.location.href = "./index.html";
  }
}

const dialogueTree = {

  start: {
    speaker: "SABRINA",
    text: "You traced me using document trails, call graphs, and GPS points—classic metadata. That is the same class of information agencies long framed as ‘harmless’ compared to message content. Do we still believe that?",
    choices: [
      { text: "Surveillance tools are essential for national security.", next: "securityA" },
      { text: "Metadata can be as invasive as reading messages.", next: "privacyA" },
      { text: "It depends on who controls the data.", next: "governanceA" }
    ]
  },

  // --- Slide 1: Privacy vs. Security ---
  securityA: {
    speaker: "SABRINA",
    text: "You say surveillance is the price of security. But surveillance is not security itself—it’s a tool that reshapes how we see risk and who we trust.",
    choices: [
      { text: "Security can’t exist without full visibility.", next: "securityB" },
      { text: "Maybe privacy and security aren’t opposites.", next: "privacyB" },
      { text: "We need better limits on what’s visible.", next: "governanceB" }
    ]
  },

  privacyA: {
    speaker: "SABRINA",
    text: "Exactly. Metadata reveals patterns of life: who you meet, when you move, and what you do. With that, you can reconstruct relationships and routines without ever reading a message.",
    choices: [
      { text: "So is all metadata inherently dangerous?", next: "overreachB" },
      { text: "Maybe targeted metadata is acceptable.", next: "governanceB" },
      { text: "Then privacy is a security property, not a tradeoff.", next: "securityC" }
    ]
  },

  governanceA: {
    speaker: "SABRINA",
    text: "You’re right to focus on control. The critical question isn’t just what data we collect, but who writes the rules, who reviews the queries, and who audits the results.",
    choices: [
      { text: "Strong legal frameworks can contain abuse.", next: "governanceB" },
      { text: "Technically enforced limits beat legal promises.", next: "privacyC" },
      { text: "Even with rules, institutions expand their reach.", next: "overreachB" }
    ]
  },

  // --- Slide 2: Surveillance Is Not Always Effective ---
  securityB: {
    speaker: "SABRINA",
    text: "Even if we assume full visibility, the real actors you care about—sophisticated criminals, state‑backed hackers, network‑coordinated disinformation—often use encrypted channels and operational tradecraft. The metadata you see is mostly of ordinary users, not the hardest targets.",
    choices: [
      { text: "But metadata still helps spot patterns.", next: "patternB" },
      { text: "Then bulk metadata is mostly hitting the wrong people.", next: "biasB" }
    ]
  },

  patternB: {
    speaker: "SABRINA",
    text: "Those patterns are noisy. False positives, misinterpreted links, and ‘guilt by association’ mean that most investigative energy is spent on innocent people, not the real threats.",
    choices: [
      { text: "Still, some signals are genuinely useful.", next: "governanceC" },
      { text: "So bulk metadata distorts rather than clarifies risk.", next: "biasB" }
    ]
  },

  biasB: {
    speaker: "SABRINA",
    text: "Precisely. Mass metadata collection often gives the illusion of coverage while disproportionately impacting users who lack encryption, anonymity tools, or technical literacy. The ‘easy’ targets bear the cost of the tradeoff.",
    choices: [
      { text: "Then we must minimize data collection.", next: "privacyC" },
      { text: "Maybe we focus only on high‑risk individuals.", next: "governanceC" }
    ]
  },

  // --- Slide 3: Surveillance Can Be Abused ---
  governanceB: {
    speaker: "SABRINA",
    text: "Laws and oversight help, but history shows that once surveillance infrastructure exists, it expands: scope creep, new uses, and cross‑agency sharing. The metadata you benignly call ‘records’ becomes a permanent social map.",
    choices: [
      { text: "So abuse is inevitable if the system exists.", next: "abuseD" },
      { text: "Then we must design technical safeguards.", next: "privacyC" }
    ]
  },

  abuseD: {
    speaker: "SABRINA",
    text: "We see this in the NSA’s bulk phone‑metadata program under Section 215, and in reports of Spanish authorities using broad surveillance powers against Catalan independence leaders. The infrastructure moves beyond its original justification, and the affected communities are rarely the ones who consented.",
    choices: [
      { text: "Still, some capabilities are legally constrained.", next: "governanceC" },
      { text: "Then the risk isn’t just error—it’s normalization of overreach.", next: "privacyC" }
    ]
  },

  // --- Slide 4: Surveillance Tools Can Be Subverted ---
  securityC: {
    speaker: "SABRINA",
    text: "Even ‘lawful’ systems can be hijacked. In Greece, attackers abused lawful‑interception modules on Vodafone’s switches to wiretap over 100 state officials—including the Prime Minister—for months. The backdoors meant for state agencies became attack surfaces for criminals and insiders.",
    choices: [
      { text: "That’s a failure of implementation, not design.", next: "securityD" },
      { text: "Then building backdoors always weakens security.", next: "privacyC" }
    ]
  },

  securityD: {
    speaker: "SABRINA",
    text: "Even if each case is ‘one‑off’, the pattern is clear: every interception‑ready architecture increases the risk that legitimate access mechanisms will be exploited beyond their intent. Convenience for law‑enforcement can become a vulnerability for everyone.",
    choices: [
      { text: "We must still have some access mechanisms.", next: "governanceC" },
      { text: "Then default encryption is safer than default backdoors.", next: "privacyC" }
    ]
  },

  // --- Slide 5: Privacy Is Security ---
  privacyB: {
    speaker: "SABRINA",
    text: "You’re close. The stronger framing is that privacy *is* a security property. It protects individuals from profiling and manipulation, companies from theft of IP, and governments from exposure of sources and operations.",
    choices: [
      { text: "But total privacy hinders legitimate investigations.", next: "governanceC" },
      { text: "Then strong encryption and minimal data collection are security features.", next: "privacyC" }
    ]
  },

  privacyC: {
    speaker: "SABRINA",
    text: "Yes. Privacy‑by‑design and security‑by‑design treat confidentiality and control as core goals, not luxuries. Encryption, minimization, and strong access controls make systems more resilient—against criminals, insiders, and state overreach at once. The default security posture shouldn’t be: ‘we see everything and hope for the best.’",
    choices: [
      { text: "So metadata‑heavy investigations like mine are risky.", next: "reflectA" },
      { text: "Then we need privacy‑preserving analytics tools.", next: "reflectB" }
    ]
  },

  // --- Slide 6: The Tradeoff Is a Myth ---
  governanceC: {
    speaker: "SABRINA",
    text: "That’s the common response: ‘design rules, add oversight, and audit everything.’ But once collection is cheap and capabilities are baked in, the temptation is always to extend the scope—‘one more hop,’ ‘one more pattern.’ The tradeoff myth endures because it’s convenient for institutions, not because it’s accurate.",
    choices: [
      { text: "So we must reject the ‘tradeoff’ framing.", next: "privacyC" },
      { text: "Then at least we should constrain metadata use.", next: "reflectA" }
    ]
  },

  overreachB: {
    speaker: "SABRINA",
    text: "Then why keep building systems that prioritize omniscience over restraint? The Greek wiretapping case, the NSA bulk‑metadata program, and reports of surveillance used against activists show that the infrastructure inevitably leaks beyond its ‘legitimate’ boundaries.",
    choices: [
      { text: "We must dismantle the tools.", next: "overreachC" },
      { text: "We must redesign them to resist abuse.", next: "privacyC" }
    ]
  },

  overreachC: {
    speaker: "SABRINA",
    text: "In practice, dismantling rarely happens. So the more realistic path is to constrain collection, shorten retention, enforce strong encryption, and require independent, technical review of any metadata‑heavy investigation. The question becomes: do we want security built on surveillance—or on resilience?",
    choices: [{ text: "Continue", next: "reflectA" }]
  },

  // --- Final reflection branches (Slide 6) ---
  reflectA: {
    speaker: "DISCUSSION",
    text: "Given what metadata revealed here, was the analyst’s pursuit justified—even if it reproduced some mass‑surveillance dynamics at a smaller scale?",
    choices: [
      { text: "Yes—targeted metadata can be proportionate in a concrete leak case.", next: "endA" },
      { text: "No—relying on metadata habits risks normalizing surveillance.", next: "endB" },
      { text: "Only with strict minimization, short retention, and independent review.", next: "endC" }
    ]
  },

  reflectB: {
    speaker: "DISCUSSION",
    text: "If privacy is a security property, what technical safeguards would you introduce to handle metadata‑heavy investigations without repeating mass‑surveillance patterns?",
    choices: [
      { text: "Strong encryption and zero‑retention of raw data.", next: "endC" },
      { text: "Privacy‑preserving analytics and differential privacy.", next: "endD" },
      { text: "Auditable query logs and external review committees.", next: "endE" }
    ]
  },
  
  endA: {
    speaker: "HANDLER",
    text: "Stance logged: you accept that targeted metadata can be proportionate in high‑stakes leak investigations. But ask: how long does that exception stay ‘targeted’ before it becomes the default?",
    choices: [{ text: "Decide the suspect’s fate", next: "finalChoice" }]
  },

  endB: {
    speaker: "HANDLER",
    text: "Stance logged: you reject metadata‑heavy investigations as a normal mode. The challenge is to uphold security while avoiding the normalization of surveillance‑style habits and tooling.",
    choices: [{ text: "Decide the suspect’s fate", next: "finalChoice" }]
  },

  endC: {
    speaker: "HANDLER",
    text: "Stance logged: you demand strict technical and procedural limits—minimization, short retention, and independent review. That’s where many privacy‑by‑design frameworks begin. The real test is whether institutions actually enforce those constraints.",
    choices: [{ text: "Decide the suspect’s fate", next: "finalChoice" }]
  },

  endD: {
    speaker: "HANDLER",
    text: "Stance logged: you lean into privacy‑preserving analytics and differential privacy. This is the research frontier: balancing utility for analysts with protection for individuals. Ask who benefits most when these tools stay in labs, not in practice.",
    choices: [{ text: "Decide the suspect’s fate", next: "finalChoice" }]
  },

  endE: {
    speaker: "HANDLER",
    text: "Stance logged: you trust in auditable logs and external review. But ask: can oversight keep up once collection becomes cheap and automated? The weakest link is rarely the law; it’s the enforcement of it.",
    choices: [{ text: "Decide the suspect’s fate", next: "finalChoice" }]
  },

  finalChoice: {
    speaker: "HANDLER",
    text: "After reviewing the metadata trail, the analyst’s stance, and the broader implications for surveillance and privacy, the final decision is yours: what happens to the whistleblower?",
    choices: [
      { text: "Let the whistleblower go free.", next: "fateFreedom" },
      { text: "Take the whistleblower to justice.", next: "fateJustice" }
    ]
  },

  fateFreedom: {
    speaker: "DISCUSSION",
    text: "You choose to let the whistleblower go free. The investigation remains on record, but no formal charges are filed. Institutions may adapt rules or internal policies, but the precedent is clear: exposing systemic risks can be treated as a service, not a crime. Ask: does this outcome encourage future transparency, or does it undermine accountability for classified leaks?",
    choices: []
  },

  fateJustice: {
    speaker: "DISCUSSION",
    text: "You choose to take the whistleblower to justice. The case proceeds through legal channels, reinforcing the idea that leaking classified data is a serious offense, regardless of the whistleblower’s motives. Ask: does this outcome deter abuse of power, or does it primarily deter those who would expose it?",
    choices: []
  }

};

let syncConclusion;

function renderNode(nodeKey) {
  const node = dialogueTree[nodeKey];
  const speaker = document.getElementById("speaker");
  const text = document.getElementById("dialogueText");
  const choices = document.getElementById("choiceBox");
  const feedback = document.getElementById("debateFeedback");

  speaker.textContent = `SPEAKER: ${node.speaker}`;
  const intervention = document.createElement("p");
  intervention.textContent = `\n ${node.speaker}: ${node.text}`;
  text.appendChild(intervention);
  choices.innerHTML = "";

  if (!node.choices.length) {
    markSolved("debate");
    feedback.textContent = "Debate complete. Continue to the conclusion and curated resources.";
    feedback.className = "status good";
    if (typeof syncConclusion === "function") syncConclusion();
    return;
  }

  node.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => {
      const reply = document.createElement("p");
      reply.textContent = `\n YOU: ${choice.text}`;
      text.appendChild(reply);
      renderNode(choice.next)});
    choices.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  guardPage();
  mountHintBlock("hintMountDebate", [
    "There's no right or wrong aswer to this task. Just debate with the whistleblower and see if her arguments convince you to let her go free.",
  ]);

  const toConclusion = document.getElementById("toConclusion");
  syncConclusion = bindProceedGuard(toConclusion, "debateFinished");

  if (getState().progress.debateFinished) {
    document.getElementById("debateFeedback").textContent = "You already completed this debate.";
    document.getElementById("debateFeedback").className = "status good";
    document.getElementById("dialogueText").textContent =
      "Revisit the conclusion page for references, videos, and reflection prompts.";
    document.getElementById("choiceBox").innerHTML = "";
    syncConclusion();
    return;
  }

  renderNode("start");
});
