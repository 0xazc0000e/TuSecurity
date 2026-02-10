import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Cpu, Lock } from 'lucide-react';

export default function AttackStatusPanel({ worldState, feedback }) {
    // Determine content based on worldState
    // If target discovered, show target details.
    // If ports scanned, show services.

    // Default view: System Logs
    return (
        <div className="h-full bg-[#080808] flex flex-col font-mono text-xs overflow-hidden" dir="ltr">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-slate-300">
                    <Activity size={14} className="text-blue-500" />
                    <span className="font-bold">System Monitor</span>
                </div>
                <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">LIVE</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">

                {/* 1. Target Overview (Unlockable) */}
                {worldState.discoveredHosts.length > 0 ? (
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
                        <h4 className="flex items-center gap-2 text-slate-300 font-bold mb-3 border-b border-slate-700/50 pb-2">
                            <Cpu size={14} className="text-purple-400" />
                            Target Systems ({worldState.discoveredHosts.length})
                        </h4>

                        {worldState.discoveredHosts.map(host => (
                            <div key={host} className="mb-3 last:mb-0">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-emerald-400 font-bold">{host}</span>
                                    <span className="text-slate-500">Linux/Unix</span>
                                </div>

                                {/* Services (if scanned) */}
                                {worldState.scannedPorts[host] ? (
                                    <div className="pl-2 border-l-2 border-slate-700 space-y-1 mt-2">
                                        {worldState.scannedPorts[host].map(port => (
                                            <div key={port} className="flex items-center gap-2 text-slate-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                                <span>Port {port} (OPEN)</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-slate-600 italic text-[10px] pl-2">
                                        No services detected. Run nmap scan.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 text-slate-600 border border-dashed border-slate-800 rounded-lg">
                        <Lock size={24} className="mx-auto mb-2 opacity-50" />
                        <p>No target systems identified.</p>
                        <p className="text-[10px] opacity-70">Start discovery phase (ping, whois).</p>
                    </div>
                )}

                {/* 2. Action Log / Feedback Stream */}
                <div className="space-y-2 mt-4">
                    <h4 className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Activity Log</h4>
                    <div className="space-y-1">
                        <AnimatePresence>
                            {/* We could accumulate logs here, but for now showing the latest impactful feedback */}
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={feedback.message + Date.now()}
                                    className={`p-2 rounded border-l-2 border-blue-500 bg-blue-900/10 text-blue-300`}
                                >
                                    <span className="opacity-50 text-[10px] block mb-0.5">{new Date().toLocaleTimeString()}</span>
                                    {feedback.message}
                                </motion.div>
                            )}

                            {/* Mock background noise logs */}
                            {worldState.networkVisible && (
                                <div className="text-slate-500 text-[10px]">
                                    [SYSTEM] Network interface eth0: UP
                                </div>
                            )}
                            <div className="text-slate-600 text-[10px]">
                                [SYSTEM] Monitor initialized...
                            </div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
}
