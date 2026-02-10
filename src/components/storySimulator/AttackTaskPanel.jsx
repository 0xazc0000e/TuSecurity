import React, { useState } from 'react';
import { Target, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AttackTaskPanel({ step, stepIndex, feedback, onValidate }) {
    if (!step) return <div className="p-6 text-center text-slate-500">Mission Loading...</div>;

    const [showHint, setShowHint] = useState(false);

    // Determine language (defaulting to 'ar' for this user base, based on previous files)
    const lang = 'ar';
    const title = step.title[lang];
    const objective = step.objective[lang];

    return (
        <div className="h-full bg-black/20 p-6 overflow-y-auto custom-scrollbar font-cairo text-right" dir="rtl">
            {/* Header / Progress */}
            <div className="flex items-center justify-between mb-6">
                <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/20">
                    مرحلة {stepIndex + 1}
                </div>
                {feedback?.type === 'success' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-emerald-400 flex items-center gap-1 text-xs font-bold"
                    >
                        <CheckCircle size={14} /> مكتمل
                    </motion.div>
                )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                {title}
            </h2>

            {/* Objective Box */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-5 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-50">
                    <Target size={100} className="text-blue-500/10" />
                </div>
                <h3 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2 relative z-10">
                    <Target size={16} /> الهدف الحالي
                </h3>
                <p className="text-slate-200 leading-relaxed text-sm relative z-10">
                    {objective}
                </p>

                {step.requiredTools && (
                    <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
                        <span className="text-xs text-slate-400 block mb-2">الأدوات المقترحة:</span>
                        <div className="flex gap-2">
                            {step.requiredTools.tools.map(tool => (
                                <span key={tool} className="px-2 py-1 bg-black/40 rounded text-xs text-cyan-400 font-mono border border-cyan-500/20">
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Feedback / Status Message */}
            <AnimatePresence mode="wait">
                {feedback && feedback.message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        key={feedback.message}
                        className={`p-4 rounded-xl border mb-6 text-sm flex items-start gap-3
                            ${feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : ''}
                            ${feedback.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' : ''}
                            ${feedback.type === 'info' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : ''}
                        `}
                    >
                        {feedback.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> :
                            feedback.type === 'error' ? <AlertTriangle size={18} className="shrink-0 mt-0.5" /> :
                                <HelpCircle size={18} className="shrink-0 mt-0.5" />}

                        <span className="leading-relaxed">{feedback.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hints System */}
            {step.hints && step.hints.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-xs text-slate-500 flex items-center gap-1 hover:text-white transition-colors mb-3"
                    >
                        <HelpCircle size={12} />
                        {showHint ? 'إخفاء التلميحات' : 'احتياج مساعدة؟'}
                    </button>

                    <AnimatePresence>
                        {showHint && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2">
                                    {step.hints.map((hint, i) => (
                                        <div key={i} className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3 text-sm text-yellow-500/80">
                                            {hint.ar}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
