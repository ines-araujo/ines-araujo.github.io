function guardPage() {
  if (!ensureUnlocked("location")) {
    window.location.href = "./index.html";
    return false;
  }
  return true;
}

function clusterName(point) {
  return point.cluster || "unknown";
}

function colorFor(type) {
  if (type === "night") return "#00695c";
  if (type === "work") return "#e65100";
  if (type === "sensitive") return "#b71c1c";
  return "#37474f";
}

function strokeFor(type) {
  if (type === "night") return "#004d40";
  if (type === "work") return "#bf360c";
  if (type === "sensitive") return "#7f0000";
  return "#263238";
}

function centroid(points) {
  let lat = 0;
  let lng = 0;
  points.forEach((p) => {
    lat += p.lat;
    lng += p.lng;
  });
  return [lat / points.length, lng / points.length];
}

function scheduleMapResize(map) {
  const run = () => {
    try {
      map.invalidateSize();
    } catch (e) {
      /* ignore */
    }
  };
  requestAnimationFrame(run);
  window.setTimeout(run, 100);
  window.setTimeout(run, 400);
}

async function initLocation() {
  if (!guardPage()) {
    return;
  }

  if (typeof L === "undefined" || !L.map) {
    const fb = document.getElementById("locationFeedback");
    if (fb) {
      fb.textContent = "Map library failed to load. Check your network or disable blockers and reload.";
      fb.className = "status warn";
    }
    return;
  }

  mountHintBlock("hintMountLoc", [
    "Nighttime repeats in one cluster usually indicate where someone returns to sleep.",
    "Weekday daytime density near office districts often maps to work—compare timestamps in popups.",
    "The sensitive stop is the rare label away from the home/work loop—here, a clinic visit."
  ]);

  let data;
  try {
    const res = await fetch("./data/location-points.json");
    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }
    data = await res.json();
  } catch (err) {
    const fb = document.getElementById("locationFeedback");
    if (fb) {
      fb.textContent = "Could not load location data. Use a local server (not file://) so ./data/location-points.json can load.";
      fb.className = "status warn";
    }
    return;
  }

  if (!document.getElementById("map")) {
    return;
  }

  const map = L.map("map", { scrollWheelZoom: true });
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    subdomains: "abcd",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
  }).addTo(map);

  map.whenReady(() => {
    scheduleMapResize(map);
  });

  const byCluster = {};
  data.points.forEach((p) => {
    if (!byCluster[p.cluster]) byCluster[p.cluster] = [];
    byCluster[p.cluster].push(p);
  });

  Object.entries(byCluster).forEach(([name, pts]) => {
    if (name === "Transit-Noise") return;
    const [lat, lng] = centroid(pts);
    const radius = name.includes("Night") ? 420 : name.includes("Day") ? 520 : 380;
    L.circle([lat, lng], {
      radius,
      color: "#455a64",
      weight: 2,
      fillColor: "#263238",
      fillOpacity: 0.14,
      dashArray: "6 8"
    }).addTo(map);
  });

  const bounds = L.latLngBounds(data.points.map((p) => [p.lat, p.lng]));
  map.fitBounds(bounds.pad(0.12));
  scheduleMapResize(map);

  data.points.forEach((p) => {
    const fill = colorFor(p.type);
    const stroke = strokeFor(p.type);
    L.circleMarker([p.lat, p.lng], {
      radius: 8,
      color: stroke,
      weight: 3,
      opacity: 1,
      fillColor: fill,
      fillOpacity: 0.95
    })
      .bindPopup(`<strong>${p.label}</strong><br>${p.timestamp}<br><span class="muted">${p.cluster}</span>`)
      .addTo(map);
  });

  const uniqueClusters = [...new Set(data.points.map((p) => clusterName(p)))].filter((c) => c !== "Transit-Noise");
  const sensitiveOptions = [...new Set(data.points.filter((p) => p.type === "sensitive").map((p) => p.label))];
  const homeGuess = document.getElementById("homeGuess");
  const workGuess = document.getElementById("workGuess");
  const sensitiveGuess = document.getElementById("sensitiveGuess");

  if (!homeGuess || !workGuess || !sensitiveGuess) {
    return;
  }

  uniqueClusters.forEach((cluster) => {
    const h = document.createElement("option");
    h.value = cluster;
    h.textContent = cluster;
    homeGuess.appendChild(h);
    const w = document.createElement("option");
    w.value = cluster;
    w.textContent = cluster;
    workGuess.appendChild(w);
  });

  sensitiveOptions.forEach((label) => {
    const option = document.createElement("option");
    option.value = label;
    option.textContent = label;
    sensitiveGuess.appendChild(option);
  });

  const feedback = document.getElementById("locationFeedback");
  const toDebate = document.getElementById("toDebate");
  const syncProceed = bindProceedGuard(
    toDebate,
    "locationSolved",
    "You must complete the analysis before continuing."
  );

  const validateBtn = document.getElementById("validateLocationBtn");
  if (validateBtn) {
    validateBtn.addEventListener("click", () => {
      const home = homeGuess.value;
      const work = workGuess.value;
      const sensitive = sensitiveGuess.value;
      updateState((s) => {
        s.choices.homeGuess = home;
        s.choices.workGuess = work;
      });
      if (home === data.answers.home && work === data.answers.work && sensitive === data.answers.sensitive) {
        markSolved("location");
        if (feedback) {
          feedback.textContent = "Patterns line up. The debate module is unlocked.";
          feedback.className = "status good";
        }
        if (typeof syncProceed === "function") {
          syncProceed();
        }
      } else {
        if (feedback) {
          feedback.textContent = "Mismatch: re-check night vs weekday clusters and the outlier stop.";
          feedback.className = "status warn";
        }
      }
    });
  }

  if (getState().progress.locationSolved) {
    if (feedback) {
      feedback.textContent = "Location task already validated.";
      feedback.className = "status good";
    }
    if (typeof syncProceed === "function") {
      syncProceed();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLocation().catch((err) => {
    const fb = document.getElementById("locationFeedback");
    if (fb) {
      fb.textContent = "Something went wrong loading this case file. See the browser console for details.";
      fb.className = "status warn";
    }
    console.error(err);
  });
});
