import React, { useEffect, useState } from 'react';
import ConstructibilityGraph from './components/ConstructibilityGraph';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';

function App() {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/nodes.json')
      .then(r => {
        if (!r.ok) throw new Error("Could not load nodes.json");
        return r.json();
      })
      .then(data => {
        setNodes(data.nodes || data); // handle either { nodes: [...] } or [...]
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* App Title UI Overlay */}
      <div className="absolute bottom-6 left-16 z-10 pointer-events-none">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 drop-shadow-sm">
          PowerPoint <span className="text-blue-600">Constructibility</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Formal Dependency Explorer
        </p>
      </div>

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-blue-600 font-medium animate-pulse">
            <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            Loading graph structure...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 right-4 z-50 bg-red-50 text-red-600 p-4 border border-red-200 rounded-lg shadow-lg max-w-sm">
          <strong>Error Loading Data:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <Toolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <ConstructibilityGraph
            rawNodes={nodes}
            onNodeSelect={setSelectedNode}
            searchQuery={searchQuery}
            selectedNodeId={selectedNode?.id}
          />

          {/* Sidebar handles animation internally via CSS transform depending on selectedNode presence */}
          {selectedNode && (
            <Sidebar
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
