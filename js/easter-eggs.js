document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".easter-flicker").forEach((el) => {
    window.setInterval(() => {
      if (Math.random() > 0.92) {
        el.classList.add("flash-subtle");
        window.setTimeout(() => el.classList.remove("flash-subtle"), 220);
      }
    }, 4500);
  });

  document.querySelectorAll(".easter-egg[data-secret]").forEach((el) => {
    el.setAttribute("title", el.getAttribute("data-secret") || "");
  });
});
