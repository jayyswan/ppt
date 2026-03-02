import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

const nodeWidth = 200;
const nodeHeight = 50;

// Custom Node Component to hide handles if no edges exist
const ConstructibilityNode = ({ data, targetPosition, sourcePosition }) => {
    const { label, hasIn, hasOut, color, borderColor, opacity } = data;

    return (
        <div style={{
            width: nodeWidth,
            height: nodeHeight,
            position: 'relative',
            opacity: opacity ?? 1,
            transition: 'opacity 0.2s ease'
        }}>
            {/* The actual visible box */}
            <div style={{
                background: color,
                border: `2px solid ${borderColor}`,
                borderRadius: '8px',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}>
                <div className="text-center font-medium pointer-events-none text-sm leading-tight px-3">
                    {label}
                </div>
            </div>

            {hasIn && (
                <Handle
                    type="target"
                    position={targetPosition || Position.Left}
                    style={{
                        background: '#94a3b8',
                        width: 10,
                        height: 10,
                        left: -5, // Perfectly centered on 2px border
                        border: '2px solid white'
                    }}
                />
            )}
            {hasOut && (
                <Handle
                    type="source"
                    position={sourcePosition || Position.Right}
                    style={{
                        background: '#94a3b8',
                        width: 10,
                        height: 10,
                        right: -5, // Perfectly centered on 2px border
                        border: '2px solid white'
                    }}
                />
            )}
        </div>
    );
};

const nodeTypes = {
    constructibility: ConstructibilityNode,
};

// Recursive helper to find all dependencies (ancestors) in the DAG
const getDependencyChain = (nodeId, rawNodes) => {
    const chain = new Set([nodeId]);
    const toProcess = [nodeId];
    const visited = new Set();

    while (toProcess.length > 0) {
        const currentId = toProcess.pop();
        if (visited.has(currentId)) continue;
        visited.add(currentId);

        const node = rawNodes.find(n => n.id === currentId);
        if (!node || !Array.isArray(node.dependencies)) continue;

        node.dependencies.forEach(depId => {
            if (!chain.has(depId)) {
                chain.add(depId);
                toProcess.push(depId);
            }
        });
    }
    return chain;
};

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 50 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            targetPosition: 'left',
            sourcePosition: 'right',
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

export default function ConstructibilityGraph({ rawNodes, onNodeSelect, searchQuery, selectedNodeId }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // 1. Initial configuration and layout - only runs when rawNodes structure changes
    useEffect(() => {
        if (!rawNodes || rawNodes.length === 0) return;

        const initialEdges = [];
        rawNodes.forEach((n) => {
            if (Array.isArray(n.dependencies)) {
                n.dependencies.forEach((depId) => {
                    // Check if this is an operation dependency to style it differently
                    const depNode = rawNodes.find(rn => rn.id === depId);
                    const isOperation = depNode?.type === 'operation';

                    initialEdges.push({
                        id: `e-${depId}-${n.id}`,
                        source: depId,
                        target: n.id,
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: isOperation ? '#fbbf24' : '#94a3b8',
                        },
                        style: {
                            stroke: isOperation ? '#fcd34d' : '#cbd5e1',
                            strokeWidth: 2,
                            strokeDasharray: isOperation ? '5,5' : undefined
                        }
                    });
                });
            }
        });

        // Determine which nodes have incoming/outgoing edges
        const nodesWithIn = new Set(initialEdges.map(e => e.target));
        const nodesWithOut = new Set(initialEdges.map(e => e.source));

        const initialNodes = rawNodes.map((n) => {
            let bgColor = '#f8fafc'; // default Slate 50
            let borderColor = '#94a3b8'; // Slate 400

            if (n.type === 'class') {
                bgColor = '#dcfce7'; // Green 100
                borderColor = '#4ade80'; // Green 400
            } else if (n.type === 'operation') {
                bgColor = '#dbeafe'; // Blue 100
                borderColor = '#60a5fa'; // Blue 400
            } else if (n.type === 'number') {
                bgColor = '#ffedd5'; // Orange 100
                borderColor = '#fb923c'; // Orange 400
            }

            return {
                id: n.id,
                data: {
                    label: n.name,
                    hasIn: nodesWithIn.has(n.id),
                    hasOut: nodesWithOut.has(n.id),
                    color: bgColor,
                    borderColor: borderColor,
                    opacity: 1
                },
                type: 'constructibility',
                position: { x: 0, y: 0 } // Placeholder, will be set by layout
            };
        });

        const layouted = getLayoutedElements(initialNodes, initialEdges, 'LR');

        // Ensure we pass the enriched data to layouted nodes
        const finalNodes = layouted.nodes.map(node => {
            const initial = initialNodes.find(i => i.id === node.id);
            return {
                ...node,
                data: initial.data
            };
        });

        setNodes(finalNodes);
        setEdges(layouted.edges);
    }, [rawNodes]);

    // Compute which nodes should be highlighted based on search and selection
    const visibleChain = useMemo(() => {
        if (!selectedNodeId) return null;
        return getDependencyChain(selectedNodeId, rawNodes);
    }, [selectedNodeId, rawNodes]);

    // 2. Update node opacities based on search or selection WITHOUT resetting positions
    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                const n = rawNodes.find(item => item.id === node.id);
                if (!n) return node;

                // Priority 1: Selection filtering
                let isVisible = true;
                if (visibleChain) {
                    isVisible = visibleChain.has(node.id);
                }

                // Priority 2: Search filtering
                if (isVisible && searchQuery) {
                    const query = searchQuery.toLowerCase();
                    if (!n.name.toLowerCase().includes(query) && !n.id.toLowerCase().includes(query)) {
                        isVisible = false;
                    }
                }

                const newOpacity = isVisible ? 1 : 0.15;
                if (node.style?.opacity === newOpacity) return node;

                return {
                    ...node,
                    style: { ...node.style, opacity: newOpacity }
                };
            })
        );
    }, [searchQuery, visibleChain, setNodes, rawNodes]);

    const handleNodeClick = useCallback((event, node) => {
        if (onNodeSelect && node && node.id) {
            const rawNode = rawNodes.find(n => n.id === node.id);
            if (rawNode) {
                onNodeSelect(rawNode);
            }
        }
    }, [rawNodes, onNodeSelect]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
                fitView
            >
                <Controls />
                <Background color="#e2e8f0" gap={16} size={1} />
            </ReactFlow>
        </div>
    );
}


