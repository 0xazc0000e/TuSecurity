import React, { useState } from 'react';
import { Lightbulb, Eye, EyeOff, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HintSystem({ hints = [], onHintUsed }) {
    const [usedHints, setUsedHints] = useState([]);
    const [revealedHints, setRevealedHints] = useState([]);

    if (!hints || hints.length === 0) return null;

    const useHint = (index) => {
        if (!usedHints.includes(index)) {
            setUsedHints([...usedHints, index]);
            if (onHintUsed) {
                onHintUsed(index);
            }
        }

        // Toggle revealed state
        if (revealedHints.includes(index)) {
            setRevealedHints(revealedHints.filter(i => i !== index));
        } else {
            setRevealedHints([...revealedHints, index]);
        }
    };

    const getHintIcon = (index) => {
        if (index === 0) return { icon: Lightbulb, label: 'تلميح عام', color: 'text-cyan-400' };
        if (index === 1) return { icon: Zap, label: 'تلميح محدد', color: 'text-yellow-400' };
        return { icon: Eye, label: 'الحل الكامل', color: 'text-orange-400' };
    };

    return (
        <div className="bg-black/20 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                    لديك {hints.length} تلميحات متاحة
                </h3>
            </div>

            <div className="space-y-2">
                {hints.map((hint, index) => {
                    const { icon: Icon, label, color } = getHintIcon(index);
                    const isRevealed = revealedHints.includes(index);
                    const isUsed = usedHints.includes(index);

                    return (
                        <div key={index}>
                            <button
                                onClick={() => useHint(index)}
                                className={`
                                    w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border
                                    transition-all duration-200
                                    ${isUsed
                                        ? 'bg-white/5 border-white/10'
                                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={16} className={color} />
                                    <span className="text-sm font-medium text-white">
                                        {label} {index + 1}
                                    </span>
                                </div>
                                {isRevealed ? (
                                    <EyeOff size={16} className="text-slate-400" />
                                ) : (
                                    <Eye size={16} className="text-slate-400" />
                                )}
                            </button>

                            <AnimatePresence>
                                {isRevealed && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/5">
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                {hint}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Hints Usage Stats */}
            {usedHints.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="text-xs text-slate-400">
                        استخدمت {usedHints.length} من {hints.length} تلميحات
                    </div>
                </div>
            )}
        </div>
    );
}
