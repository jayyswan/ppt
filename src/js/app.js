// Basic placeholder for front-end logic
console.log('app.js loaded');

// filtering/searching
function filterNodes(nodes, query, engine) {
  return nodes.filter(n => {
    const matchesQuery = !query || n.id.includes(query) || n.name.toLowerCase().includes(query.toLowerCase());
    const matchesEngine = !engine || n.engine === engine;
    return matchesQuery && matchesEngine;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    fetch('api_nodes.json').then(r => r.json()).catch(e => { console.error('Failed to fetch api_nodes.json:', e); return []; }),
    fetch('data_engines.json').then(r => r.json()).catch(e => { console.error('Failed to fetch data_engines.json:', e); return []; })
  ]).then(([nodes, engines]) => {
    console.log('Loaded nodes:', nodes);
    console.log('Loaded engines:', engines);
    window.allNodes = nodes;
    populateEngineFilter(engines);
    updateGraph();
  });

  document.getElementById('search').addEventListener('input', updateGraph);
  document.getElementById('engineFilter').addEventListener('change', updateGraph);
});

function populateEngineFilter(engines) {
  const sel = document.getElementById('engineFilter');
  engines.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.id;
    opt.textContent = e.name;
    sel.appendChild(opt);
  });
}

function updateGraph() {
  if (!window.allNodes) return;
  const query = document.getElementById('search').value;
  const engine = document.getElementById('engineFilter').value;
  const filtered = filterNodes(window.allNodes, query, engine);
  initGraph(filtered);
}

function buildEdges(nodes) {
  const edges = [];
  nodes.forEach(n => {
    if (Array.isArray(n.inputs)) {
      n.inputs.forEach(inp => {
        if (inp.source) {
          edges.push({ source: inp.source, target: n.id });
        }
      });
    }
  });
  return edges;
}

function initGraph(nodes) {
  const container = document.getElementById('graph');
  container.innerHTML = '';

  if (nodes.length === 0) {
    container.textContent = 'No nodes match filter';
    return;
  }

  const edges = buildEdges(nodes);
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  // Simple grid layout: arrange nodes in columns by depth
  const nodePositions = {};
  const depths = {};
  
  // Calculate depth (distance from primitives)
  function getDepth(id, visited = new Set()) {
    if (visited.has(id)) return 0;
    visited.add(id);
    const node = nodeMap[id];
    if (!node || !Array.isArray(node.inputs) || node.inputs.length === 0) {
      return 0;
    }
    const maxDepth = Math.max(...node.inputs.map(inp => {
      if (inp.source) return getDepth(inp.source, new Set(visited));
      return 0;
    }));
    return maxDepth + 1;
  }

  nodes.forEach(n => {
    depths[n.id] = getDepth(n.id);
  });

  // Position nodes in columns by depth
  const depthGroups = {};
  nodes.forEach(n => {
    const d = depths[n.id];
    if (!depthGroups[d]) depthGroups[d] = [];
    depthGroups[d].push(n.id);
  });

  const nodeSize = 60;
  const nodeSpacing = 100;
  const colSpacing = 200;
  
  Object.keys(depthGroups).forEach(d => {
    const ids = depthGroups[d];
    const x = parseInt(d) * colSpacing + 50;
    ids.forEach((id, idx) => {
      const y = idx * nodeSpacing + 50;
      nodePositions[id] = { x, y };
    });
  });

  // Create SVG
  const width = 800;
  const height = 600;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.style.border = '1px solid #ccc';
  svg.style.background = '#fafafa';

  // Draw edges first (so they appear behind nodes)
  edges.forEach(edge => {
    const src = nodePositions[edge.source];
    const tgt = nodePositions[edge.target];
    if (src && tgt) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', src.x);
      line.setAttribute('y1', src.y);
      line.setAttribute('x2', tgt.x);
      line.setAttribute('y2', tgt.y);
      line.setAttribute('stroke', '#999');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('marker-end', 'url(#arrowhead)');
      svg.appendChild(line);
    }
  });

  // Add arrowhead marker
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '10');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '3');
  marker.setAttribute('orient', 'auto');
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', '0 0, 10 3, 0 6');
  polygon.setAttribute('fill', '#999');
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.appendChild(defs);

  // Draw nodes
  nodes.forEach(node => {
    const pos = nodePositions[node.id];
    if (!pos) return;

    // Circle background
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', nodeSize);
    circle.setAttribute('fill', node.engine === 'primitive' ? '#e8f5e9' : '#bbdefb');
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '2');
    circle.style.cursor = 'pointer';
    circle.onclick = () => showNodeDetails(node.id);
    svg.appendChild(circle);

    // Text label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x);
    text.setAttribute('y', pos.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dy', '0.35em');
    text.setAttribute('font-size', '11px');
    text.setAttribute('pointer-events', 'none');
    text.textContent = node.id;
    svg.appendChild(text);
  });

  container.appendChild(svg);
  console.log('Graph rendered with', nodes.length, 'nodes and', edges.length, 'edges');
}

function showNodeDetails(id) {
  const node = window.allNodes.find(n => n.id === id);
  if (!node) return;
  const panel = document.getElementById('docPanel');
  let inputsHtml = '';
  if (node.inputs && node.inputs.length > 0) {
    inputsHtml = '<h4>Inputs:</h4><ul>' +
      node.inputs.map(inp => '<li>' + (inp.source || inp.name) + ': ' + inp.type + '</li>').join('') +
      '</ul>';
  }
  panel.innerHTML = `<h2>${node.name}</h2>
    <p><strong>ID:</strong> ${node.id}</p>
    <p><strong>Type:</strong> ${node.type}</p>
    <p><strong>Output Type:</strong> ${node.outputType}</p>
    <p><strong>Engine:</strong> ${node.engine}</p>
    <p><strong>Rounding:</strong> ${node.rounding}</p>
    ${inputsHtml}
    <p>${node.description}</p>
    <p><a href="${node.proofDoc}" target="_blank">View proof</a></p>`;
  console.log('Showing details for:', node.id);
}

