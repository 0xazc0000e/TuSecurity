import React from 'react';
import { Wrench, Lock, Search, Shield, Zap, Info } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Context-Aware Tools Panel
 * Shows available tools for current task with command revelation (NOT execution)
 */
export const ToolsPanel = ({
    availableTools = [],
    lockedTools = [],
    onToolReveal
}) => {
    // Tool icons mapping
    const toolIcons = {
        recon: Search,
        analysis: Info,
        exploitation: Zap,
        defense: Shield,
        forensics: Lock
    };

    return (
        <div className="h-full flex flex-col bg-[#0a0a12]">
            {/* Header */}
            <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center gap-2">
                    <Wrench size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">Available Tools</span>
                </div>
                <div className="text-[10px] text-slate-500">
                    {availableTools.length} tools
                </div>
            </div>

            {/* Tools Grid */}
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                {/* Helper message */}
                {availableTools.length === 0 && (
                    <div className="text-center text-slate-500 text-xs py-8">
                        No tools available yet.<br />
                        Tools unlock as you progress through tasks.
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                    {availableTools.map((tool, index) => {
                        const Icon = toolIcons[tool.category] || Wrench;
                        const isLocked = lockedTools.includes(tool.id);

                        return (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <button
                                    onClick={() => !isLocked && onToolReveal?.(tool)}
                                    disabled={isLocked}
                                    className={`
                    w-full p-3 rounded-xl border text-left transition-all
                    ${isLocked
                                            ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed grayscale'
                                            : 'border-white/10 bg-white/5 hover:border-[#7112AF]/50 hover:bg-[#7112AF]/10 cursor-pointer group'
                                        }
                  `}
                                >
                                    <div className="flex items-start gap-2 mb-2">
                                        <div className={`p-1.5 rounded ${isLocked ? 'bg-white/5' : 'bg-[#7112AF]/20 group-hover:bg-[#7112AF]/30'}`}>
                                            {isLocked ? (
                                                <Lock size={14} className="text-slate-600" />
                                            ) : (
                                                <Icon size={14} className="text-[#d4b3ff]" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-white font-mono truncate">
                                                {tool.name}
                                            </div>
                                            {tool.description?.ar && (
                                                <div className="text-[9px] text-slate-400 mt-0.5 line-clamp-2">
                                                    {tool.description.ar}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tool category badge */}
                                    <div className="flex items-center justify-between mt-2">
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${isLocked
                                                ? 'bg-white/5 text-slate-600'
                                                : 'bg-white/10 text-slate-400'
                                            }`}>
                                            {tool.category}
                                        </span>

                                        {!isLocked && (
                                            <span className="text-[8px] text-[#7112AF] group-hover:text-[#d4b3ff] font-bold">
                                                Click to reveal →
                                            </span>
                                        )}

                                        {isLocked && (
                                            <span className="text-[8px] text-slate-600">
                                                🔒 Locked
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Locked tools section */}
                {lockedTools.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-[10px] text-slate-500 mb-2 px-1">
                            🔒 Locked Tools ({lockedTools.length})
                        </div>
                        <div className="text-[9px] text-slate-600 px-1">
                            Complete current task to unlock more tools
                        </div>
                    </div>
                )}

                {/* Quick reference */}
                <div className="mt-6 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                    <div className="text-[10px] text-blue-300 font-bold mb-1.5 flex items-center gap-1">
                        <Info size={10} />
                        <span>Quick Tip</span>
                    </div>
                    <div className="text-[9px] text-blue-200/80 leading-relaxed">
                        Click a tool to reveal its command syntax in the terminal.
                        You must type and execute commands manually - no shortcuts!
                    </div>
                </div>
            </div>
        </div>
    );
};
