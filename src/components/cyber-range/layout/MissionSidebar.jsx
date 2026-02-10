import React from 'react';
import { Clock, CheckCircle, Lock, Target, AlertTriangle } from 'lucide-react';

export default function MissionSidebar({ role, steps, currentStepIndex }) {
    const isAttacker = role === 'attacker';
    const accentColor = isAttacker ? 'text-red-500' : 'text-blue-500';
    const accentBg = isAttacker ? 'bg-red-500' : 'bg-blue-500';
    const accentBorder = isAttacker ? 'border-red-500' : 'border-blue-500';

    return (
        <div className="h-full flex flex-col glass-panel border-r border-white/5 bg-[#08080c]/80 backdrop-blur-md w-80 shrink-0">
            {/* Mission Header */}
            <div className={`p-6 border-b border-white/5 relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${accentBg}`}></div>
                <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-1">Current Operation</h2>
                <h1 className="text-xl font-bold text-white leading-tight">Operation Blackout</h1>
                <div className="flex items-center gap-2 mt-4 text-xs font-mono">
                    <span className={`px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300`}>
                        {role === 'attacker' ? 'RED TEAM' : 'BLUE TEAM'}
                    </span>
                    <span className="px-2 py-1 rounded bg-green-900/20 text-green-400 border border-green-500/20 animate-pulse">
                        ACTIVE
                    </span>
                </div>
            </div>

            {/* Timeline */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
                <div className="relative border-l-2 border-white/5 ml-3 space-y-8 pb-10">
                    {steps.map((step, idx) => {
                        const status = idx < currentStepIndex ? 'completed' : idx === currentStepIndex ? 'active' : 'pending';

                        return (
                            <div key={idx} className="relative pl-8 group">
                                {/* Dot */}
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 
                                    ${status === 'completed' ? 'bg-green-500 border-green-500' :
                                        status === 'active' ? `${accentBg} ${accentBorder} shadow-[0_0_15px_currentColor]` :
                                            'bg-[#0f1115] border-gray-700'}`}
                                >
                                    {status === 'completed' && <CheckCircle size={10} className="text-black absolute top-0.5 left-0.5" />}
                                    {status === 'active' && <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-current"></div>}
                                </div>

                                {/* Content */}
                                <div className={`transition-all duration-300 ${status === 'pending' ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}>
                                    <span className="text-[10px] font-mono text-gray-500 block mb-1">PHASE {idx + 1}</span>
                                    <h3 className={`font-bold text-sm mb-2 ${status === 'active' ? 'text-white' : 'text-gray-400'}`}>
                                        {step.phaseTitle.split(':')[1] || step.phaseTitle}
                                    </h3>

                                    {status === 'active' && (
                                        <div className="bg-white/5 rounded-lg p-3 border border-white/10 mt-2">
                                            <p className="text-xs text-gray-300 leading-relaxed">
                                                {step.instruction}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Status */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>SYS_STATUS: ONLINE</span>
                    <span>v2.4.0</span>
                </div>
            </div>
        </div>
    );
}
