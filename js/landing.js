document.addEventListener("DOMContentLoaded", () => {
  typeText(
    "typedIntro",
    "“We Kill People Based on Metadata”\n -- General Michael Hayden"
  );
  const nav = document.getElementById("chapterNav");
  if (nav) {
    nav.innerHTML = "";
  }
});
