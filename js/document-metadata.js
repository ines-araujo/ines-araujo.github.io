const metadataTips = {
  author: "Author fields can reveal real names or shared service accounts.",
  createdAt: "Creation time anchors when the file first existed in this form.",
  modifiedAt: "Last saved time shows late edits—often close to exfiltration.",
  device: "Software/device strings can match a specific workstation image.",
  location: "Embedded or inferred location ties creation to a place.",
  ipAsn: "Network metadata shows where a transfer left the building."
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

function setViewerFileName(fileName) {
  const nameNode = document.getElementById("viewerFileName");
  if (nameNode) {
    nameNode.textContent = fileName;
  }
}

function setModalOpen(isOpen) {
  const modal = document.getElementById("forensicViewerModal");
  if (!modal) return;
  modal.classList.toggle("forensic-modal-open", isOpen);
  modal.setAttribute("aria-hidden", isOpen ? "false" : "true");
  document.body.classList.toggle("forensic-modal-active", isOpen);
}

function wireViewerModal() {
  const closeBtn = document.getElementById("forensicModalClose");
  const modal = document.getElementById("forensicViewerModal");
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener("click", () => setModalOpen(false));
  }
  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.close === "forensic-modal") {
      setModalOpen(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setModalOpen(false);
    }
  });
}

function renderEvidence(files) {
  const wrap = document.getElementById("evidenceList");
  wrap.innerHTML = "";
  files.forEach((file) => {
    const entry = document.createElement("article");
    entry.className = "forensic-card";
    entry.innerHTML = `
      <header class="forensic-card-head">
        <span class="forensic-badge">${file.fileType}</span>
        <span class="forensic-name">${file.fileName}</span>
      </header>
      <p class="forensic-desc">${file.description || ""}</p>
      <button type="button" class="btn btn-secondary" data-file="${file.id}">🔍 Inspect in viewer</button>
    `;
    entry.querySelector("button").addEventListener("click", () => {
      wrap.querySelectorAll(".forensic-card").forEach((card) => card.classList.remove("forensic-card-active"));
      entry.classList.add("forensic-card-active");
      setViewerFileName(file.fileName);
      renderMetadataRows(file.metadata);
      renderTimeline(file.timeline);
      setModalOpen(true);
    });
    wrap.appendChild(entry);
  });
}

function wireSuspectSelection(suspects, answer) {
  const container = document.getElementById("suspectOptions");
  const feedback = document.getElementById("documentFeedback");
  const toGraph = document.getElementById("toGraph");
  const state = getState();
  const syncProceed = bindProceedGuard(toGraph, "documentsSolved");

  suspects.forEach((name) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary suspect-btn";
    btn.textContent = name;
    btn.addEventListener("click", () => {
      updateState((s) => {
        s.choices.suspectDocument = name;
      });
      if (name === answer) {
        markSolved("documents");
        feedback.textContent = "After reviewing the metadata trail, you conclude that all five users from the cryptography lab are equally suspicious, not because any one of them stands out, but because the shared sandbox makes it that all of them are equally likely to have published the leaks.";
        feedback.className = "status good";
        syncProceed();
      } else {
        feedback.textContent = "Not the best match: compare author and edits to the outbound transfer.";
        feedback.className = "status warn";
      }
    });
    container.appendChild(btn);
  });

  if (state.progress.documentsSolved) {
    feedback.textContent = "Task complete. You can proceed to the social graph.";
    feedback.className = "status good";
    syncProceed();
  }
}

async function init() {
  guardPage();
  mountHintBlock("hintMountDoc", [
    "Satellite_Link_Policy_v5.pptx is authored and last modified by t_user on Virtual Station 04. Process logs show that each of the four cryptography‑lab users (Riley Cyrus, Belly Eilish, Lara Larsson and Whitney Dallas) ran sessions on that sandbox around the same window, and the timeline shows overlapping edit events from the same subnet. No per‑user artifact cleanly separates “who pressed save last.”",
    "SecureComms_Net_Audit.xlsx was originally created by Riley Cyrus, but the final save and checksum in the outbound proxy are from t_user. The export timestamp lands five hours after she logged off, and your session logs show that two other lab members were still active on Virtual Station 04 during that window, with no clear audit trail tying the export to any one account.",
    "Budget_proposal_SIGINT_2027.docx carries a hidden XML comment linking Satellite_Link_Policy_v5 to budget Section 3, again authored under t_user. The timeline shows that multiple lab users edited the budget file through the sandbox, and the final save timestamp aligns with the earliest moment the whistleblower site receives the bundle. Because every one of them has recent, logged activity on the same sandbox and the sandbox account is shared, you cannot isolate any individual as the exclusive source."
  ]);

  const res = await fetch("./data/document-metadata.json");
  const data = await res.json();
  wireViewerModal();
  renderEvidence(data.files);
  wireSuspectSelection(data.suspects, data.correctSuspect);
}

document.addEventListener("DOMContentLoaded", init);
