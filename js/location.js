function guardPage() {
  if (!ensureUnlocked("location")) {
    window.location.href = "./index.html";
  }
}

function clusterName(point) {
  return point.cluster || "unknown";
}

function colorFor(type) {
  if (type === "night") return "#66ffc2";
  if (type === "work") return "#f4c26b";
  return "#ff6b6b";
}

async function initLocation() {
  guardPage();
  const res = await fetch("./data/location-points.json");
  const data = await res.json();

  const map = L.map("map").setView(data.mapCenter, 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  data.points.forEach((p) => {
    L.circleMarker([p.lat, p.lng], {
      radius: 6,
      color: colorFor(p.type),
      fillOpacity: 0.75
    })
      .bindPopup(`<strong>${p.label}</strong><br>${p.timestamp}<br>cluster: ${p.cluster}`)
      .addTo(map);
  });

  const uniqueClusters = [...new Set(data.points.map((p) => clusterName(p)))];
  const sensitiveOptions = [...new Set(data.points.filter((p) => p.type === "sensitive").map((p) => p.label))];
  const homeGuess = document.getElementById("homeGuess");
  const workGuess = document.getElementById("workGuess");
  const sensitiveGuess = document.getElementById("sensitiveGuess");

  uniqueClusters.forEach((cluster) => {
    const a = document.createElement("option");
    a.value = cluster;
    a.textContent = cluster;
    homeGuess.appendChild(a);

    const b = document.createElement("option");
    b.value = cluster;
    b.textContent = cluster;
    workGuess.appendChild(b);
  });

  sensitiveOptions.forEach((label) => {
    const option = document.createElement("option");
    option.value = label;
    option.textContent = label;
    sensitiveGuess.appendChild(option);
  });

  const feedback = document.getElementById("locationFeedback");
  if (getState().progress.locationSolved) {
    feedback.textContent = "Location profile previously completed.";
    feedback.className = "status good";
    return;
  }

  document.getElementById("validateLocationBtn").addEventListener("click", () => {
    const home = homeGuess.value;
    const work = workGuess.value;
    const sensitive = sensitiveGuess.value;
    updateState((s) => {
      s.choices.homeGuess = home;
      s.choices.workGuess = work;
    });
    if (home === data.answers.home && work === data.answers.work && sensitive === data.answers.sensitive) {
      markSolved("location");
      feedback.textContent = "Pattern match confirmed. Confrontation unlocked.";
      feedback.className = "status good";
    } else {
      feedback.textContent = "One or more inferences are incorrect. Re-check night and weekday clusters.";
      feedback.className = "status warn";
    }
  });
}

document.addEventListener("DOMContentLoaded", initLocation);
