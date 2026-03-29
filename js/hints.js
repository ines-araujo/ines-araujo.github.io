/**
 * Progressive hint UI: "Need a hint?" reveals hints one at a time (2–3 per task).
 * @param {string} mountId - Element id to render into
 * @param {string[]} hintLines - Ordered hint strings (mild → stronger)
 */
function mountHintBlock(mountId, hintLines) {
  const mount = document.getElementById(mountId);
  if (!mount || !hintLines.length) return;

  const wrap = document.createElement("div");
  wrap.className = "hint-block";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-hint";
  btn.setAttribute("aria-expanded", "false");
  btn.textContent = "Need a hint?";

  const panel = document.createElement("div");
  panel.className = "hint-panel";
  panel.setAttribute("hidden", "true");
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-label", "Hints");

  let step = 0;
  const list = document.createElement("ol");
  list.className = "hint-list";

  btn.addEventListener("click", () => {
    if (step >= hintLines.length) {
      btn.textContent = "No more hints";
      btn.disabled = true;
      return;
    }
    const li = document.createElement("li");
    li.textContent = hintLines[step];
    list.appendChild(li);
    step += 1;
    panel.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "true");
    if (step >= hintLines.length) {
      btn.textContent = "All hints shown";
      btn.disabled = true;
    }
  });

  panel.appendChild(list);
  wrap.appendChild(btn);
  wrap.appendChild(panel);
  mount.appendChild(wrap);
}
