import React from 'react';
import HintSystem from './HintSystem';
import { Trophy, Activity, Terminal } from 'lucide-react';

export default function BashToolsPanel({ task, progress, onHintUsed }) {
    if (!task) return <div className="p-4 text-slate-500 text-center">لا توجد أدوات متاحة</div>;

    return (
        <div className="h-full p-4 overflow-y-auto custom-scrollbar font-cairo" dir="rtl">
            {/* Status Card */}
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-purple-400 font-bold text-sm flex items-center gap-2">
                        <Activity size={16} />
                        الحالة العامة
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">ID: {progress.userId || 'GUEST'}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex-1 bg-black/40 rounded-lg p-2 text-center border border-white/5">
                        <div className="text-2xl font-bold text-white">{progress.totalXP}</div>
                        <div className="text-[10px] text-slate-400 uppercase">XP مكتسب</div>
                    </div>
                    <div className="flex-1 bg-black/40 rounded-lg p-2 text-center border border-white/5">
                        <div className="text-2xl font-bold text-emerald-400">{progress.completedTasks.length}</div>
                        <div className="text-[10px] text-slate-400 uppercase">مهام منجزة</div>
                    </div>
                </div>
            </div>

            {/* Task Specific Tools */}
            {task.hints && task.hints.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-slate-300 font-bold text-sm mb-3">المساعدة والتلميحات</h4>
                    <HintSystem hints={task.hints} onHintUsed={onHintUsed} />
                </div>
            )}

            {/* Command Reference (Mini) */}
            <div>
                <h4 className="text-slate-300 font-bold text-sm mb-3 flex items-center gap-2">
                    <Terminal size={14} />
                    أوامر سريعة
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {['ls', 'cd', 'pwd', 'cat', 'mkdir', 'rm'].map(cmd => (
                        <div key={cmd} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded px-2 py-1 text-xs font-mono text-cyan-400 text-center cursor-help" title="Click to copy (impl later)">
                            {cmd}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
