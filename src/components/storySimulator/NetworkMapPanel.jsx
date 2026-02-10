import React from 'react';
import { motion } from 'framer-motion';

export default function NetworkMapPanel({ worldState }) {
    // Base network layout
    // Nodes visibility depends on worldState.discoveredHosts
    // We always show "Gateway" and "Attacker" (self)
    // "Target" (192.168.1.55) is shown only if in discoveredHosts

    const nodes = [
        { id: 'attacker', label: 'Kali Linux (You)', ip: '192.168.1.100', x: 10, y: 50, type: 'attacker', visible: true },
        { id: 'gateway', label: 'Gateway', ip: '192.168.1.1', x: 30, y: 50, type: 'infrastructure', visible: true },
        { id: 'target', label: 'SmartGrid Ctrl', ip: '192.168.1.55', x: 70, y: 50, type: 'target', visible: worldState?.discoveredHosts?.includes('192.168.1.55') || worldState?.networkVisible }
    ];

    return (
        <div className="h-full bg-[#050510] relative overflow-hidden font-mono">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            <svg className="w-full h-full relative z-10">
                {/* Connections */}
                {nodes.filter(n => n.visible).map((node, i) => {
                    // Simple logic: Connect everything to Gateway
                    if (node.id === 'gateway') return null;
                    const gateway = nodes.find(n => n.id === 'gateway');
                    return (
                        <motion.line
                            key={`link-${node.id}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            x1={`${node.x}%`} y1={`${node.y}%`}
                            x2={`${gateway.x}%`} y2={`${gateway.y}%`}
                            stroke={node.type === 'attacker' ? '#3B82F6' : '#EF4444'}
                            strokeWidth="2"
                            strokeDasharray="5,5"
                        />
                    );
                })}

                {/* Nodes */}
                {nodes.map(node => (
                    node.visible && (
                        <g key={node.id}>
                            <motion.circle
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                cx={`${node.x}%`}
                                cy={`${node.y}%`}
                                r="8"
                                fill={node.type === 'attacker' ? '#3B82F6' : (node.type === 'target' ? '#EF4444' : '#6B7280')}
                                stroke="white"
                                strokeWidth="2"
                            />

                            {/* Pulse effect for scanning */}
                            {node.type === 'target' && (
                                <motion.circle
                                    animate={{
                                        scale: [1, 2],
                                        opacity: [0.5, 0]
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    cx={`${node.x}%`}
                                    cy={`${node.y}%`}
                                    r="8"
                                    fill="none"
                                    stroke="#EF4444"
                                />
                            )}

                            <text
                                x={`${node.x}%`}
                                y={`${node.y + 12}%`}
                                textAnchor="middle"
                                fill="white"
                                fontSize="12"
                                className="font-bold shadow-black drop-shadow-md"
                            >
                                {node.label}
                            </text>
                            <text
                                x={`${node.x}%`}
                                y={`${node.y + 16}%`}
                                textAnchor="middle"
                                fill="#9CA3AF"
                                fontSize="10"
                            >
                                {node.ip}
                            </text>
                        </g>
                    )
                ))}
            </svg>

            {!worldState.networkVisible && (
                <div className="absolute top-4 left-4 text-xs text-slate-500">
                    Network Map: Unknown
                </div>
            )}
        </div>
    );
}
