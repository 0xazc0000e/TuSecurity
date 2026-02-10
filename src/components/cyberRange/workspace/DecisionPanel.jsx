import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronRight, Zap, Target } from 'lucide-react';

export const DecisionPanel = ({ task, onSelect }) => {
    if (!task || task.type !== 'decision_point') return null;

    return (
        <div className="h-full flex flex-col bg-[#0a0a12] p-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-6 text-yellow-500">
                <AlertTriangle size={18} className="animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">نقطة قرار حاسمة</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                {task.title?.ar || "ما هي خطوتك القادمة؟"}
            </h3>
            <p className="text-sm text-slate-400 mb-8 italic">
                {task.objective?.ar || "يجب اتخاذ قرار استراتيجي للمتابعة."}
            </p>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {task.choices?.map((choice) => (
                    <motion.button
                        key={choice.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(choice)}
                        className="w-full relative group"
                    >
                        <div className="absolute inset-0 bg-[#7112AF]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#7112AF]/50 group-hover:bg-[#7112AF]/5 transition-all text-right">
                            <div className="flex flex-row-reverse items-start justify-between gap-4">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-[#7112AF]/30">
                                    <Target size={20} className="text-slate-400 group-hover:text-[#7112AF]" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-lg font-bold text-white mb-1 group-hover:text-[#7112AF]">
                                        {choice.title?.ar}
                                    </div>
                                    <div className="text-xs text-slate-500 leading-relaxed">
                                        {choice.description?.ar}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-row-reverse items-center justify-between text-[10px] font-bold">
                                <span className="text-[#d4b3ff] flex items-center gap-1">
                                    تنفيذ الاختيار <ChevronRight size={10} />
                                </span>
                                <span className="text-slate-600 uppercase tracking-tighter italic">Strategic Action</span>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 text-[9px] text-slate-600 text-center uppercase tracking-widest">
                قراراتك تُغير مسار القصة وتنعكس في ملفك الشخصي
            </div>
        </div>
    );
};
