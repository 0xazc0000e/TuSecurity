import React, { useState } from 'react';
import { FileText, Filter, Activity, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Target/Victim Logs Panel
 * Shows system logs for defender, target status for attacker
 */
export const TargetLogsPanel = ({
    role,
    logs = [],
    targetStatus = {},
    onDefensiveAction
}) => {
    const [filterLevel, setFilterLevel] = useState('all'); // all, critical, warning, info

    // Filter logs by severity
    const filteredLogs = logs.filter(log => {
        if (filterLevel === 'all') return true;
        return log.level === filterLevel;
    });

    // Get severity color
    const getLevelColor = (level) => {
        switch (level) {
            case 'critical':
                return 'text-red-400 bg-red-500/20';
            case 'warning':
                return 'text-yellow-400 bg-yellow-500/20';
            case 'error':
                return 'text-orange-400 bg-orange-500/20';
            case 'info':
                return 'text-blue-400 bg-blue-500/20';
            default:
                return 'text-slate-400 bg-slate-500/20';
        }
    };

    // Defender view: System logs
    const renderDefenderView = () => (
        <>
            {/* Filter controls */}
            <div className="p-2 border-b border-white/10 flex items-center gap-2 shrink-0 flex-wrap">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Filter size={10} />
                    <span>Filter:</span>
                </div>
                {['all', 'critical', 'warning', 'info'].map(level => (
                    <button
                        key={level}
                        onClick={() => setFilterLevel(level)}
                        className={`text-[9px] px-2 py-1 rounded ${filterLevel === level
                                ? 'bg-[#7112AF] text-white'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {/* Logs feed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {filteredLogs.length === 0 && (
                    <div className="text-center text-slate-500 text-xs py-8">
                        {filterLevel === 'all' ? 'No logs yet' : `No ${filterLevel} logs`}
                    </div>
                )}

                <AnimatePresence>
                    {filteredLogs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] font-mono"
                        >
                            {/* Log entry */}
                            <div className="flex items-start gap-2 p-2 rounded hover:bg-white/5 transition-colors">
                                {/* Timestamp */}
                                <span className="text-slate-600 shrink-0">
                                    [{log.timestamp || 'N/A'}]
                                </span>

                                {/* Level badge */}
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${getLevelColor(log.level)}`}>
                                    {log.level}
                                </span>

                                {/* Message */}
                                <span className={`flex-1 ${log.level === 'critical' ? 'text-red-300 font-bold' :
                                        log.level === 'warning' ? 'text-yellow-300' :
                                            'text-slate-300'
                                    }`}>
                                    {log.message}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Defensive actions */}
            {onDefensiveAction && (
                <div className="p-2 border-t border-white/10 shrink-0">
                    <div className="text-[9px] text-slate-500 mb-1">Quick Actions:</div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onDefensiveAction('block_ip')}
                            className="flex-1 text-[9px] px-2 py-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors"
                        >
                            🚫 Block IP
                        </button>
                        <button
                            onClick={() => onDefensiveAction('isolate')}
                            className="flex-1 text-[9px] px-2 py-1.5 rounded bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30 transition-colors"
                        >
                            🔒 Isolate System
                        </button>
                    </div>
                </div>
            )}
        </>
    );

    // Attacker view: Target status
    const renderAttackerView = () => (
        <>
            {/* Target system info */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                {/* Target header */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                        <Activity size={12} className="text-cyan-400" />
                        <span>Target Status</span>
                    </div>

                    <div className="space-y-2 text-[10px]">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Hostname:</span>
                            <span className="text-white font-mono">{targetStatus.hostname || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">IP Address:</span>
                            <span className="text-cyan-400 font-mono">{targetStatus.ip || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">OS:</span>
                            <span className="text-white">{targetStatus.os || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Status:</span>
                            <span className={`font-bold ${targetStatus.compromised ? 'text-red-400' : 'text-green-400'
                                }`}>
                                {targetStatus.compromised ? '🔴 Compromised' : '🟢 Secure'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Open Ports */}
                {targetStatus.openPorts && targetStatus.openPorts.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="text-xs font-bold text-white mb-2">Open Ports</div>
                        <div className="space-y-1">
                            {targetStatus.openPorts.map((port, i) => (
                                <div key={i} className="text-[10px] flex items-center justify-between p-1.5 bg-black/30 rounded">
                                    <span className="text-yellow-400 font-mono">{port.number}</span>
                                    <span className="text-slate-400">{port.service}</span>
                                    {port.vulnerable && (
                                        <span className="text-red-400 text-[8px]">⚠️ Vulnerable</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loot/Gains */}
                {targetStatus.loot && targetStatus.loot.length > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                        <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-2">
                            <span>💰</span>
                            <span>Acquired Assets</span>
                        </div>
                        <div className="space-y-1">
                            {targetStatus.loot.map((item, i) => (
                                <div key={i} className="text-[10px] text-emerald-300">
                                    • {item}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!targetStatus.ip && (
                    <div className="text-center text-slate-500 text-xs py-8">
                        No target information yet.<br />
                        Complete reconnaissance tasks to discover targets.
                    </div>
                )}
            </div>
        </>
    );

    return (
        <div className="h-full flex flex-col bg-[#0a0a12]">
            {/* Header */}
            <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center gap-2">
                    {role === 'defender' ? (
                        <>
                            <FileText size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-300">System Logs</span>
                        </>
                    ) : (
                        <>
                            <AlertOctagon size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-300">Target Intelligence</span>
                        </>
                    )}
                </div>

                {role === 'defender' && (
                    <div className="text-[10px] text-slate-500">
                        {logs.length} entries
                    </div>
                )}
            </div>

            {/* Content */}
            {role === 'defender' ? renderDefenderView() : renderAttackerView()}
        </div>
    );
};
