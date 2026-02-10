import React from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Shield, Monitor, Lock } from 'lucide-react';

const NodeIcon = ({ type, size = 32, scanned }) => {
    if (type === 'firewall') return <Shield size={size} className={scanned ? 'text-green-400' : 'text-blue-400'} />;
    if (type === 'server') return <Server size={size} className={scanned ? 'text-green-400' : 'text-purple-400'} />;
    if (type === 'database') return <Database size={size} className={scanned ? 'text-green-400' : 'text-yellow-400'} />;
    return <Monitor size={size} className="text-slate-400" />;
};

export const TopologyMap = ({ nodes }) => {
    const gateway = nodes.find(n => n.id === 'gateway');
    const others = nodes.filter(n => n.id !== 'gateway');

    return (
        <div className="w-full h-full flex items-center justify-center relative bg-[url('/grid.svg')] bg-center opacity-90">
            {/* Central Gateway */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute left-1/4 top-1/2 -translate-y-1/2 z-10"
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-[#0a0a12] border-2 border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                        <Shield className="text-blue-500" size={32} />
                    </div>
                    <span className="text-xs font-mono text-blue-400 bg-[#0a0a12]/80 px-2 py-1 rounded">Gateway (192.168.1.1)</span>
                </div>
            </motion.div>

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#7112AF" stopOpacity="0.5" />
                    </linearGradient>
                </defs>
                {others.map((node, i) => (
                    node.status !== 'hidden' && (
                        <motion.line
                            key={node.id}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1 }}
                            x1="28%" y1="50%"
                            x2="70%" y2={20 + (i * 30) + "%"}
                            stroke="url(#lineGrad)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                    )
                ))}
            </svg>

            {/* Target Nodes */}
            <div className="absolute right-1/4 top-0 bottom-0 flex flex-col justify-center gap-16">
                {others.map((node) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: node.status === 'hidden' ? 0 : 1, x: node.status === 'hidden' ? 20 : 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-500 ${node.status === 'scanned'
                                ? 'bg-green-500/10 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                : 'bg-[#0a0a12] border-white/10'
                            }`}>
                            <NodeIcon type={node.type} size={24} scanned={node.status === 'scanned'} />

                            {node.status === 'scanned' && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-black font-bold">✓</div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white uppercase">{node.id}</span>
                            <span className="text-xs font-mono text-slate-400">{node.ip}</span>
                            {node.status === 'scanned' ? (
                                <div className="flex gap-1 mt-1">
                                    {node.ports.map(p => <span key={p} className="text-[10px] bg-green-500/20 text-green-400 px-1 rounded">{p}</span>)}
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-[10px] text-red-400 mt-1">
                                    <Lock size={10} /> Ports Locked
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
