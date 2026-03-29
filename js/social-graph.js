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

function bridgeSpread(nodeId, links) {
  const neighbors = new Set();
  links.forEach((l) => {
    const a = typeof l.source === "object" ? l.source.id : l.source;
    const b = typeof l.target === "object" ? l.target.id : l.target;
    if (a === nodeId) neighbors.add(b);
    if (b === nodeId) neighbors.add(a);
  });
  return neighbors.size;
}

async function initGraph() {
  guardPage();
  mountHintBlock("hintMountGraph", [
    "Click several nodes and compare weighted degree—the insider should lead the pack.",
    "Use Highlight hubs to see who the graph centers on; cross-check with your notes from Case File 01.",
    "The suspect is the person with the most connected node of the graph"
  ]);

  const res = await fetch("./data/communications.json");
  const data = await res.json();
  const degree = computeMetrics(data.nodes, data.links);

  const container = document.getElementById("graph");
  const width = container.clientWidth || 640;
  const height = 460;

  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("role", "img")
    .attr("aria-label", "Communication graph");

  const defs = svg.append("defs");
  const glow = defs
    .append("filter")
    .attr("id", "node-glow")
    .attr("x", "-40%")
    .attr("y", "-40%")
    .attr("width", "180%")
    .attr("height", "180%");
  glow.append("feGaussianBlur").attr("stdDeviation", "1.8").attr("result", "blur");
  const merge = glow.append("feMerge");
  merge.append("feMergeNode").attr("in", "blur");
  merge.append("feMergeNode").attr("in", "SourceGraphic");

  const simulation = d3
    .forceSimulation(data.nodes)
    .force(
      "link",
      d3
        .forceLink(data.links)
        .id((d) => d.id)
        .distance(150)
        .strength(0.35)
    )
    .force("charge", d3.forceManyBody().strength(-140))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(28));

  const link = svg
    .append("g")
    .attr("stroke-linecap", "round")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke", "rgba(120, 170, 200, 0.35)")
    .attr("stroke-width", (d) => Math.max(0.8, d.weight * 0.35));

  const node = svg
    .append("g")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", (d) => 11 + Math.min(degree[d.id] * 0.35, 14))
    .attr("fill", "#0d1824")
    .attr("stroke", "#7df5c8")
    .attr("stroke-width", 2.2)
    .attr("filter", "url(#node-glow)")
    .call(
      d3.drag().on("start", dragStarted).on("drag", dragged).on("end", dragEnded)
    );

  const labels = svg
    .append("g")
    .selectAll("text")
    .data(data.nodes)
    .enter()
    .append("text")
    .text((d) => d.id)
    .attr("fill", "#f1f7fc")
    .attr("font-size", 12)
    .attr("font-weight", 600)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .style("paint-order", "stroke")
    .style("stroke", "#05070a")
    .style("stroke-width", "4px");

  node.on("click", (event, d) => {
    document.getElementById("nodeMetrics").innerHTML = `
      <strong>${d.id}</strong><br>
      Weighted degree (sum of edge weights): ${degree[d.id]}<br>
      Distinct contacts: ${bridgeSpread(d.id, data.links)}
    `;
  });

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.25).restart();
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
    node
      .attr("stroke", (d) => (hubs.has(d.id) ? "#ffb86b" : "#7df5c8"))
      .attr("fill", (d) => (hubs.has(d.id) ? "#1a1420" : "#0d1824"));
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
  const syncProceed = bindProceedGuard(toLocation, "graphSolved");

  document.getElementById("confirmInsiderBtn").addEventListener("click", () => {
    const guess = select.value;
    updateState((s) => {
      s.choices.insiderNode = guess;
    });
    if (guess === data.correctInsider) {
      markSolved("graph");
      feedback.textContent = `${guess} matches the broker pattern. Location analysis is now available.`;
      feedback.className = "status good";
      syncProceed();
    } else {
      feedback.textContent = "Not the strongest match—compare weighted degree and hub highlight.";
      feedback.className = "status warn";
    }
  });

  if (getState().progress.graphSolved) {
    feedback.textContent = "Task already completed. Proceed when ready.";
    feedback.className = "status good";
    syncProceed();
  }
}

document.addEventListener("DOMContentLoaded", initGraph);
