import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Link as LinkIcon, Box, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function Sidebar({ node, allNodes, onClose, onNodeSelect }) {
    const [proofContent, setProofContent] = useState('');

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (node && node.proofDoc) {
            fetch(`/${node.proofDoc}`)
                .then(res => {
                    if (!res.ok) throw new Error('Not found');
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('text/html')) {
                        throw new Error('Fallback HTML returned instead of Markdown.');
                    }
                    return res.text();
                })
                .then(text => setProofContent(text))
                .catch(() => setProofContent('Proof documentation not yet written.'));
        } else {
            setProofContent('');
        }
    }, [node]);

    if (!node) return null;

    const NodeLink = ({ id }) => {
        const targetNode = allNodes?.find(n => n.id === id);
        if (!targetNode) return <span className="font-mono">{id}</span>;

        return (
            <button
                onClick={() => onNodeSelect(targetNode)}
                className="font-mono text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors cursor-pointer text-left"
            >
                {targetNode.name}
            </button>
        );
    };

    return (
        <div style={{ zIndex: 99999, position: 'fixed', right: 0, top: 0, height: '100vh', width: '24rem', backgroundColor: 'white', display: 'flex' }} className="shadow-2xl border-l border-slate-200 flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {node.name}
                    </h2>
                    <span className="text-sm font-mono text-slate-500 bg-slate-200 px-2 py-1 rounded mt-2 inline-block">
                        {node.id}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Body scrollable content */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="text-xs text-blue-600 font-bold uppercase mb-1 flex items-center gap-1">
                            <Box className="w-3 h-3" /> Type
                        </div>
                        <div className="text-slate-800 font-medium capitalize">{node.type}</div>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <div className="text-xs text-indigo-600 font-bold uppercase mb-1 flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" /> Output
                        </div>
                        <div className="text-slate-800 font-medium">{node.output_type}</div>
                    </div>
                    {node.construction && (
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 col-span-2">
                            <div className="text-xs text-emerald-600 font-bold uppercase mb-1 flex items-center gap-1">
                                <Cpu className="w-3 h-3" /> Construction Method
                            </div>
                            <div className="text-slate-800 font-medium capitalize">
                                {node.construction.method.replace('_', ' ')}
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase mb-2">Description</h3>
                    <div className="text-slate-600 leading-relaxed text-sm prose prose-slate prose-sm max-w-none prose-p:my-0">
                        {node.description ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {node.description}
                            </ReactMarkdown>
                        ) : "No description provided."}
                    </div>
                </div>

                {/* Operation Signature */}
                {node.type === 'operation' && node.signature && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase mb-2 flex items-center gap-2">
                            <Cpu className="w-4 h-4" /> Signature
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Parameters:</span>
                                <div className="mt-1 space-y-1">
                                    {node.signature.params.map((param, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{param.name}</span>
                                            <span className="text-slate-400">:</span>
                                            <span className="text-slate-600">{param.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase">Returns:</span>
                                <div className="mt-1 text-sm text-slate-600">
                                    {node.signature.returns}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Composition: Construction Recipe */}
                {node.construction && node.construction.method === 'composition' && node.construction.inputs && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase mb-2 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" /> Construction Recipe
                        </h3>
                        <div className="mb-3 text-xs text-slate-500 font-medium">
                            Applies operation: <NodeLink id={node.construction.operation} />
                        </div>
                        <ul className="space-y-2">
                            {Object.entries(node.construction.inputs).map(([param, depId]) => (
                                <li key={param} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-sm text-slate-700">{param}</span>
                                        <NodeLink id={depId} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Primitive Construction Steps */}
                {node.construction && node.construction.method === 'primitive_steps' && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase mb-2 flex items-center gap-2">
                            <Box className="w-4 h-4" /> Primitive Construction
                        </h3>

                        {node.construction.ppt_features && node.construction.ppt_features.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-1">
                                {node.construction.ppt_features.map((feature, idx) => (
                                    <span key={idx} className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        )}

                        {node.construction.steps && (
                            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                                {node.construction.steps.map((step, idx) => {
                                    const stepText = step.replace(/^\d+\.\s*/, '');
                                    return <li key={idx}><span>{stepText}</span></li>;
                                })}
                            </ol>
                        )}
                    </div>
                )}

                {/* Dependencies */}
                {node.dependencies && node.dependencies.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase mb-2">Direct Dependencies</h3>
                        <div className="flex flex-wrap gap-2">
                            {node.dependencies.map(depId => (
                                <NodeLink key={depId} id={depId} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Proof Viewer */}
                {node.proofDoc && (
                    <div className="mt-4 border-t border-slate-100 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-800 uppercase">Proof Documentation</h3>
                            <a
                                href={`/${node.proofDoc}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-1 rounded"
                            >
                                Open Raw <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm overflow-x-auto max-h-96 overflow-y-auto prose prose-slate prose-sm prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100">
                            {proofContent ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {proofContent}
                                </ReactMarkdown>
                            ) : 'Loading proof...'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
