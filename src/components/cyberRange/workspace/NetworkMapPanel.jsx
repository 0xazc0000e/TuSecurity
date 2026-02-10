import React from 'react';
import { Server, Globe, Shield, Skull, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Interactive Network Map Panel
 * Visualizes network topology and discovered entities
 */
export const NetworkMapPanel = ({
    role,
    discoveredIPs = [],
    compromisedSystems = [],
    blockedIPs = [],
    onNodeClick
}) => {
    // Network nodes configuration
    const nodes = [
        {
            id: 'gateway',
            ip: '192.168.1.1',
            hostname: 'gateway-tu-01',
            type: 'gateway',
            icon: Globe,
            position: { x: 50, y: 20 }
        },
        {
            id: 'scada',
            ip: '192.168.1.55',
            hostname: 'smartgrid-ctrl-01',
            type: 'scada',
            icon: Server,
            position: { x: 50, y: 50 }
        },
        {
            id: 'workstation',
            ip: '192.168.1.100',
            hostname: 'admin-ws-01',
            type: 'workstation',
            icon: Server,
            position: { x: 30, y: 70 }
        },
        {
            id: 'backup',
            ip: '192.168.1.201',
            hostname: 'backup-srv-01',
            type: 'server',
            icon: Server,
            position: { x: 70, y: 70 }
        }
    ];

    // Attacker node (external)
    const attackerNode = {
        id: 'attacker',
        ip: '45.33.22.11',
        type: 'threat',
        icon: Skull,
        position: { x: 50, y: 5 }
    };

    // Check node status
    const getNodeStatus = (node) => {
        if (blockedIPs.includes(node.ip)) {
            return 'blocked';
        }
        if (compromisedSystems.includes(node.ip)) {
            return 'compromised';
        }
        if (discoveredIPs.includes(node.ip)) {
            return 'discovered';
        }
        return 'hidden';
    };

    // Node color based on status
    const getNodeColor = (node) => {
        const status = getNodeStatus(node);

        switch (status) {
            case 'compromised':
                return 'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse';
            case 'discovered':
                return 'border-cyan-500 bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.4)]';
            case 'blocked':
                return 'border-gray-500 bg-gray-500/10';
            default:
                return 'border-slate-700 bg-slate-800/50';
        }
    };

    // Render connection lines
    const renderConnections = () => {
        const connections = [
            { from: 'gateway', to: 'scada' },
            { from: 'gateway', to: 'workstation' },
            { from: 'gateway', to: 'backup' }
        ];

        return connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);

            if (!fromNode || !toNode) return null;

            return (
                <line
                    key={i}
                    x1={`${fromNode.position.x}%`}
                    y1={`${fromNode.position.y}%`}
                    x2={`${toNode.position.x}%`}
                    y2={`${toNode.position.y}%`}
                    stroke="rgb(51, 65, 85)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.3"
                />
            );
        });
    };

    // Render attack path (if attacker discovered SCADA)
    const renderAttackPath = () => {
        if (!discoveredIPs.includes('192.168.1.55')) return null;

        const scadaNode = nodes.find(n => n.id === 'scada');

        return (
            <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                x1={`${attackerNode.position.x}%`}
                y1={`${attackerNode.position.y + 5}%`}
                x2={`${scadaNode.position.x}%`}
                y2={`${scadaNode.position.y}%`}
                stroke="rgb(239, 68, 68)"
                strokeWidth="2"
                opacity="0.6"
            />
        );
    };

    return (
        <div className="h-full flex flex-col bg-[#0a0a12] relative overflow-hidden">
            {/* Header */}
            <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center gap-2">
                    <Wifi size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">Network Topology</span>
                </div>

                {/* Discovery counter */}
                <div className="text-[10px] text-slate-500">
                    {discoveredIPs.length}/{nodes.length} hosts discovered
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative p-4">
                {/* Grid background */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />

                {/* SVG for connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {renderConnections()}
                    {role === 'defender' && renderAttackPath()}
                </svg>

                {/* Attacker Node (only visible to defender) */}
                {role === 'defender' && discoveredIPs.includes('45.33.22.11') && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute"
                        style={{
                            left: `${attackerNode.position.x}%`,
                            top: `${attackerNode.position.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <div
                            className="w-12 h-12 rounded-full border-2 border-red-500 bg-red-500/20 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse"
                            onClick={() => onNodeClick?.(attackerNode)}
                        >
                            <Skull size={20} className="text-red-400" />
                        </div>
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <div className="text-[10px] font-mono text-red-400 font-bold">
                                {attackerNode.ip}
                            </div>
                            <div className="text-[9px] text-red-300">THREAT</div>
                        </div>
                    </motion.div>
                )}

                {/* Network Nodes */}
                {nodes.map((node) => {
                    const status = getNodeStatus(node);
                    const Icon = node.icon;
                    const isVisible = status !== 'hidden';

                    return (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: isVisible ? 1 : 0.5,
                                opacity: isVisible ? 1 : 0.3
                            }}
                            transition={{ duration: 0.3 }}
                            className="absolute"
                            style={{
                                left: `${node.position.x}%`,
                                top: `${node.position.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <div
                                className={`
                  w-16 h-16 rounded-lg border-2 flex items-center justify-center cursor-pointer
                  transition-all duration-300 hover:scale-110
                  ${getNodeColor(node)}
                `}
                                onClick={() => isVisible && onNodeClick?.(node)}
                            >
                                <Icon size={24} className={
                                    status === 'compromised' ? 'text-red-400' :
                                        status === 'discovered' ? 'text-cyan-400' :
                                            status === 'blocked' ? 'text-gray-400' :
                                                'text-slate-600'
                                } />

                                {/* Status indicator */}
                                <div className="absolute -top-1 -right-1">
                                    {status === 'compromised' && (
                                        <AlertTriangle size={14} className="text-red-500 animate-pulse" />
                                    )}
                                    {status === 'blocked' && (
                                        <Shield size={14} className="text-gray-500" />
                                    )}
                                    {status === 'discovered' && (
                                        <CheckCircle size={14} className="text-cyan-500" />
                                    )}
                                </div>
                            </div>

                            {/* Node info (only if visible) */}
                            {isVisible && (
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                                    <div className="text-[10px] font-mono text-slate-300 font-bold">
                                        {node.ip}
                                    </div>
                                    <div className="text-[9px] text-slate-500">
                                        {node.hostname}
                                    </div>
                                    {node.type === 'scada' && (
                                        <div className="text-[8px] text-orange-400 mt-0.5">
                                            ⚠️ CRITICAL
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    );
                })}

                {/* Legend */}
                <div className="absolute bottom-2 right-2 bg-black/60 border border-white/10 rounded-lg p-2 text-[9px] space-y-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full border border-slate-700 bg-slate-800/50" />
                        <span className="text-slate-500">Hidden</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full border border-cyan-500 bg-cyan-500/20" />
                        <span className="text-cyan-400">Discovered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full border border-red-500 bg-red-500/20 animate-pulse" />
                        <span className="text-red-400">Compromised</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full border border-gray-500 bg-gray-500/10" />
                        <span className="text-gray-400">Blocked</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
