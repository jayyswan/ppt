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
    fetch('data/nodes.json')
      .then(r => {
        if (!r.ok) throw new Error("Could not load nodes.json");
        return r.json();
      })
      .then(data => {
        const allNodes = data.nodes || data;
        setNodes(allNodes);

        // Deep-link: open node from URL hash, e.g. #arc_length -> id "arc_length"
        const hashId = window.location.hash.replace(/^#/, '').trim();
        if (hashId) {
          const match = allNodes.find(n => n.id === hashId);
          if (match) setSelectedNode(match);
        }

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
      {/* Report Issue Button */}
      <a
        href="https://github.com/jayyswan/ppt/issues/new"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 right-6 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm text-xs font-medium text-slate-500 hover:text-red-500 hover:border-red-300 hover:shadow-md transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Report Issue
      </a>

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
            onNodeSelect={(node) => {
              setSelectedNode(node);
              window.location.hash = node ? node.id : '';
            }}
            searchQuery={searchQuery}
            selectedNodeId={selectedNode?.id}
          />

          {/* Sidebar handles animation internally via CSS transform depending on selectedNode presence */}
          {selectedNode && (
            <Sidebar
              node={selectedNode}
              allNodes={nodes}
              onClose={() => {
                setSelectedNode(null);
                window.location.hash = '';
              }}
              onNodeSelect={(node) => {
                setSelectedNode(node);
                window.location.hash = node.id;
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
