function typeText(targetId, text, speed = 26) {
  const node = document.getElementById(targetId);
  if (!node) return;
  node.textContent = "";
  let idx = 0;
  const timer = setInterval(() => {
    node.textContent += text[idx] || "";
    idx += 1;
    if (idx >= text.length) clearInterval(timer);
  }, speed);
}

function randomGlitch(className = "glitch-target") {
  const nodes = document.querySelectorAll(`.${className}`);
  if (!nodes.length) return;
  setInterval(() => {
    const pick = nodes[Math.floor(Math.random() * nodes.length)];
    pick.classList.add("flash");
    setTimeout(() => pick.classList.remove("flash"), 350);
  }, 6000);
}
