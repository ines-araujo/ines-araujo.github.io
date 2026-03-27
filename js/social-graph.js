function guardPage() {
  if (!ensureUnlocked("graph")) {
    window.location.href = "./index.html";
  }
}

function computeMetrics(nodes, links) {
  const degree = {};
  nodes.forEach((n) => {
    degree[n.id] = 0;
  });
  links.forEach((l) => {
    degree[l.source] += l.weight;
    degree[l.target] += l.weight;
  });
  return degree;
}

function bridgeScore(nodeId, links) {
  const touched = links.filter((l) => l.source === nodeId || l.target === nodeId);
  const groups = new Set();
  touched.forEach((l) => {
    groups.add(l.source[0]);
    groups.add(l.target[0]);
  });
  return groups.size;
}

async function initGraph() {
  guardPage();
  const res = await fetch("./data/communications.json");
  const data = await res.json();
  const degree = computeMetrics(data.nodes, data.links);

  const width = document.getElementById("graph").clientWidth;
  const height = 440;
  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "transparent");

  const simulation = d3
    .forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id((d) => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-250))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg
    .append("g")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke", "#3b536a")
    .attr("stroke-width", (d) => Math.max(1, d.weight / 2));

  const node = svg
    .append("g")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", (d) => 9 + degree[d.id] * 0.7)
    .attr("fill", "#66ffc2")
    .call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    );

  const labels = svg
    .append("g")
    .selectAll("text")
    .data(data.nodes)
    .enter()
    .append("text")
    .text((d) => d.id)
    .attr("fill", "#d9e3ef")
    .attr("font-size", 11);

  node.on("click", (event, d) => {
    document.getElementById("nodeMetrics").innerHTML = `
      <strong>${d.id}</strong><br>
      Degree centrality (weighted): ${degree[d.id]}<br>
      Bridge indicator: ${bridgeScore(d.id, data.links)}
    `;
  });

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    labels.attr("x", (d) => d.x + 8).attr("y", (d) => d.y + 4);
  });

  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  const sorted = Object.entries(degree).sort((a, b) => b[1] - a[1]);
  document.getElementById("highlightHubBtn").addEventListener("click", () => {
    const hubs = new Set(sorted.slice(0, 2).map((x) => x[0]));
    node.attr("fill", (d) => (hubs.has(d.id) ? "#ff6b6b" : "#66ffc2"));
  });

  const select = document.getElementById("insiderSelect");
  data.nodes.forEach((n) => {
    const opt = document.createElement("option");
    opt.value = n.id;
    opt.textContent = n.id;
    select.appendChild(opt);
  });

  const feedback = document.getElementById("graphFeedback");
  const toLocation = document.getElementById("toLocation");
  if (getState().progress.graphSolved) {
    feedback.textContent = "Insider already verified.";
    feedback.className = "status good";
    return;
  }

  document.getElementById("confirmInsiderBtn").addEventListener("click", () => {
    const guess = select.value;
    updateState((s) => {
      s.choices.insiderNode = guess;
    });
    if (guess === data.correctInsider) {
      markSolved("graph");
      feedback.textContent = `${guess} confirmed as broker node. Next section unlocked.`;
      feedback.className = "status good";
      toLocation.removeAttribute("aria-disabled");
    } else {
      feedback.textContent = `${guess} is connected, but not the central broker.`;
      feedback.className = "status warn";
    }
  });
}

document.addEventListener("DOMContentLoaded", initGraph);
