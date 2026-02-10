import React, { useState, useEffect, useMemo } from 'react';
import { Network, Server, Monitor, Shield, Wifi, AlertTriangle, CheckCircle, Lock } from 'lucide-react';

/**
 * NetworkMapPanel - خريطة الشبكة التفاعلية
 * تصور بصري للشبكة المستهدفة مع حالة كل جهاز
 */
const NetworkMapPanel = ({
    nodes = [],
    connections = [],
    discoveredNodes = [],
    compromisedNodes = [],
    blockedNodes = [],
    activeNode = null,
    onNodeClick,
    role = 'attacker'
}) => {
    const isAttacker = role === 'attacker';

    // Default network topology if none provided
    const defaultNodes = useMemo(() => [
        { id: 'router', type: 'router', label: 'Main Router', x: 50, y: 20, ip: '192.168.1.1' },
        { id: 'firewall', type: 'firewall', label: 'Firewall', x: 50, y: 40, ip: '192.168.1.2' },
        { id: 'server1', type: 'server', label: 'Medical Records', x: 25, y: 65, ip: '192.168.1.50' },
        { id: 'server2', type: 'server', label: 'Database Server', x: 50, y: 65, ip: '192.168.1.51' },
        { id: 'server3', type: 'server', label: 'Backup Server', x: 75, y: 65, ip: '192.168.1.52' },
        { id: 'workstation1', type: 'workstation', label: 'Admin PC', x: 20, y: 85, ip: '192.168.1.100' },
        { id: 'workstation2', type: 'workstation', label: 'Reception', x: 50, y: 85, ip: '192.168.1.101' },
        { id: 'workstation3', type: 'workstation', label: 'Doctor PC', x: 80, y: 85, ip: '192.168.1.102' },
    ], []);

    const defaultConnections = useMemo(() => [
        { from: 'router', to: 'firewall' },
        { from: 'firewall', to: 'server1' },
        { from: 'firewall', to: 'server2' },
        { from: 'firewall', to: 'server3' },
        { from: 'server1', to: 'workstation1' },
        { from: 'server2', to: 'workstation2' },
        { from: 'server3', to: 'workstation3' },
    ], []);

    const networkNodes = nodes.length > 0 ? nodes : defaultNodes;
    const networkConnections = connections.length > 0 ? connections : defaultConnections;

    // Get node status
    const getNodeStatus = (nodeId) => {
        if (compromisedNodes.includes(nodeId)) return 'compromised';
        if (blockedNodes.includes(nodeId)) return 'blocked';
        if (discoveredNodes.includes(nodeId)) return 'discovered';
        return 'unknown';
    };

    // Get icon based on node type
    const getNodeIcon = (type) => {
        switch (type) {
            case 'router': return Wifi;
            case 'firewall': return Shield;
            case 'server': return Server;
            case 'workstation': return Monitor;
            default: return Network;
        }
    };

    // Get status colors
    const getStatusColors = (status) => {
        switch (status) {
            case 'compromised':
                return { bg: 'bg-red-500/30', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-red-500/50' };
            case 'blocked':
                return { bg: 'bg-blue-500/30', border: 'border-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/50' };
            case 'discovered':
                return { bg: 'bg-yellow-500/30', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/50' };
            default:
                return { bg: 'bg-gray-700/30', border: 'border-gray-600', text: 'text-gray-500', glow: '' };
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'compromised': return <AlertTriangle size={10} className="text-red-500" />;
            case 'blocked': return <Lock size={10} className="text-blue-500" />;
            case 'discovered': return <CheckCircle size={10} className="text-yellow-500" />;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#0a0a12] font-cairo overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0f0f18] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Network size={16} className="text-purple-400" />
                    <span className="text-sm font-bold text-white">خريطة الشبكة</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-gray-400">مكتشف</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-gray-400">مخترق</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-400">محمي</span>
                    </div>
                </div>
            </div>

            {/* Network Map SVG */}
            <div className="flex-1 relative overflow-hidden p-4">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Gradient definitions */}
                    <defs>
                        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4B5563" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#6B7280" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#4B5563" stopOpacity="0.3" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Connections */}
                    {networkConnections.map((conn, idx) => {
                        const fromNode = networkNodes.find(n => n.id === conn.from);
                        const toNode = networkNodes.find(n => n.id === conn.to);
                        if (!fromNode || !toNode) return null;

                        const fromStatus = getNodeStatus(conn.from);
                        const toStatus = getNodeStatus(conn.to);
                        const isActive = fromStatus !== 'unknown' && toStatus !== 'unknown';

                        return (
                            <line
                                key={idx}
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke={isActive ? (isAttacker ? '#EF4444' : '#3B82F6') : '#374151'}
                                strokeWidth={isActive ? 0.5 : 0.3}
                                strokeDasharray={isActive ? '' : '1,1'}
                                className={isActive ? 'animate-pulse' : ''}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {networkNodes.map((node) => {
                        const status = getNodeStatus(node.id);
                        const colors = getStatusColors(status);
                        const isActive = activeNode === node.id;
                        const Icon = getNodeIcon(node.type);

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${node.x}, ${node.y})`}
                                onClick={() => onNodeClick?.(node)}
                                className="cursor-pointer"
                            >
                                {/* Background circle */}
                                <circle
                                    r={isActive ? 5 : 4}
                                    fill={status === 'unknown' ? '#1F2937' :
                                        status === 'compromised' ? '#7F1D1D' :
                                            status === 'blocked' ? '#1E3A8A' :
                                                '#713F12'}
                                    stroke={status === 'unknown' ? '#4B5563' :
                                        status === 'compromised' ? '#EF4444' :
                                            status === 'blocked' ? '#3B82F6' :
                                                '#EAB308'}
                                    strokeWidth={isActive ? 0.5 : 0.3}
                                    filter={status !== 'unknown' ? 'url(#glow)' : ''}
                                    className={`transition-all duration-300 ${status !== 'unknown' ? 'animate-pulse' : ''}`}
                                />

                                {/* Node label */}
                                <text
                                    y={8}
                                    textAnchor="middle"
                                    className="text-[2px] fill-gray-400 font-mono"
                                >
                                    {node.ip}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Overlay info when node is selected */}
                {activeNode && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        {(() => {
                            const node = networkNodes.find(n => n.id === activeNode);
                            const status = getNodeStatus(activeNode);
                            const colors = getStatusColors(status);
                            if (!node) return null;

                            return (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-white">{node.label}</p>
                                        <p className="text-xs text-gray-400 font-mono">{node.ip}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs ${colors.bg} ${colors.text} ${colors.border} border`}>
                                        {status === 'compromised' ? 'مخترق' :
                                            status === 'blocked' ? 'محمي' :
                                                status === 'discovered' ? 'مكتشف' : 'غير معروف'}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>

            {/* Stats Footer */}
            <div className="flex items-center justify-around px-4 py-2 border-t border-white/10 bg-[#0f0f18] flex-shrink-0">
                <div className="text-center">
                    <p className="text-lg font-bold text-yellow-400">{discoveredNodes.length}</p>
                    <p className="text-[10px] text-gray-500">مكتشف</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-red-400">{compromisedNodes.length}</p>
                    <p className="text-[10px] text-gray-500">مخترق</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-blue-400">{blockedNodes.length}</p>
                    <p className="text-[10px] text-gray-500">محمي</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-gray-400">{networkNodes.length}</p>
                    <p className="text-[10px] text-gray-500">إجمالي</p>
                </div>
            </div>
        </div>
    );
};

export default NetworkMapPanel;
