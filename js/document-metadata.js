const metadataTips = {
  author: "Author tags can expose internal identities or reused pseudonyms.",
  createdAt: "Creation timestamps establish sequence and potential alibi windows.",
  modifiedAt: "Modification time often reveals editing after original drafting.",
  device: "Device fingerprints can tie files to specific hardware owners.",
  location: "Embedded geotags can reveal where content was produced.",
  ipAsn: "IP/ASN traces indicate networks and organizations involved in transfer."
};

function guardPage() {
  if (!ensureUnlocked("documents")) {
    window.location.href = "./index.html";
  }
}

function renderMetadataRows(meta) {
  const panel = document.getElementById("metadataPanel");
  panel.innerHTML = "";
  Object.entries(meta).forEach(([key, value]) => {
    const row = document.createElement("li");
    const field = document.createElement("span");
    field.className = "field";
    field.textContent = key;
    const val = document.createElement("span");
    val.textContent = value;

    const tip = document.createElement("div");
    tip.className = "tooltip";
    tip.textContent = metadataTips[key] || "Metadata field";
    row.appendChild(field);
    row.appendChild(val);
    row.appendChild(tip);
    row.addEventListener("mouseenter", () => {
      tip.style.display = "block";
      tip.style.left = "0";
      tip.style.top = "-6px";
    });
    row.addEventListener("mouseleave", () => {
      tip.style.display = "none";
    });
    panel.appendChild(row);
  });
}

function renderTimeline(events) {
  const node = document.getElementById("timeline");
  node.innerHTML = "";
  events.forEach((event) => {
    const div = document.createElement("div");
    div.className = "event";
    div.innerHTML = `<strong>${event.time}</strong><br>${event.label}`;
    node.appendChild(div);
  });
}

function renderEvidence(files) {
  const wrap = document.getElementById("evidenceList");
  wrap.innerHTML = "";
  files.forEach((file) => {
    const entry = document.createElement("div");
    entry.className = "evidence-item";
    entry.innerHTML = `
      <strong>${file.fileName}</strong><br>
      <span class="muted">${file.fileType}</span><br>
      <a class="btn" href="${file.link}" download>Download</a>
      <button type="button" data-file="${file.id}">Inspect Metadata</button>
    `;
    entry.querySelector("button").addEventListener("click", () => {
      renderMetadataRows(file.metadata);
      renderTimeline(file.timeline);
    });
    wrap.appendChild(entry);
  });
}

function wireSuspectSelection(suspects, answer) {
  const container = document.getElementById("suspectOptions");
  const feedback = document.getElementById("documentFeedback");
  const toGraph = document.getElementById("toGraph");
  const state = getState();

  suspects.forEach((name) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = name;
    btn.addEventListener("click", () => {
      updateState((s) => {
        s.choices.suspectDocument = name;
      });
      if (name === answer) {
        markSolved("documents");
        feedback.textContent = "Correct. Timeline points to " + answer + ". Next file unlocked.";
        feedback.className = "status good";
        toGraph.removeAttribute("aria-disabled");
      } else {
        feedback.textContent = "Partial match, but this suspect does not align with first transfer event.";
        feedback.className = "status warn";
      }
    });
    container.appendChild(btn);
  });

  if (state.progress.documentsSolved) {
    feedback.textContent = "Case solved earlier. Proceed when ready.";
    feedback.className = "status good";
    toGraph.removeAttribute("aria-disabled");
  }
}

async function init() {
  guardPage();
  const res = await fetch("./data/document-metadata.json");
  const data = await res.json();
  renderEvidence(data.files);
  renderMetadataRows(data.files[0].metadata);
  renderTimeline(data.files[0].timeline);
  wireSuspectSelection(data.suspects, data.correctSuspect);
}

document.addEventListener("DOMContentLoaded", init);
