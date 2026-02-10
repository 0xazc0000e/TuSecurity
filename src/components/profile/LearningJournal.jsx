import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Brain, Save } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const LearningJournal = () => {
    const { journey, logEvent } = useAnalytics();
    const [manualEntry, setManualEntry] = useState('');

    // Filter journey for meaningful entries (Reflections + Big Struggles + New Concepts)
    const journalEntries = useMemo(() => {
        if (!journey) return [];
        return journey.filter(item =>
            item.type === 'reflection' ||
            item.type === 'learning' ||
            (item.type === 'struggle' && item.title.includes('مفاهيمي'))
        );
    }, [journey]);

    const handleSaveManual = () => {
        if (!manualEntry.trim()) return;

        // Log manual entry as a "Self Reflection"
        logEvent('REFLECTION_ANSWERED', {
            question: 'خواطر ذاتية',
            answer: manualEntry
        });
        setManualEntry('');
    };

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                دفتر التفكير السيبراني <PenTool size={20} className="text-[#7112AF]" />
            </h3>

            <div className="flex-1 overflow-y-auto max-h-[300px] mb-4 space-y-3 pr-2 custom-scrollbar">
                {journalEntries.length === 0 && (
                    <div className="text-center text-slate-500 py-8 text-sm">
                        لم تقم بأي تأملات بعد. <br /> أجب عن الأسئلة في نهاية المحاكيات لتملأ هذا الدفتر.
                    </div>
                )}

                <AnimatePresence>
                    {journalEntries.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 p-4 rounded-xl border border-white/5 relative group"
                        >
                            <div className="absolute top-4 left-4 opacity-50"><Brain size={14} className="text-slate-400" /></div>
                            <h4 className="text-xs font-bold text-[#7112AF] mb-2 uppercase tracking-wide">
                                {entry.title || 'تأمل'}
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-2">
                                {entry.insight?.replace('سؤال:', '').replace('إجابتك:', '\n✍️')}
                            </p>
                            <span className="text-[10px] text-slate-600 font-mono block text-left">
                                {new Date(entry.timestamp).toLocaleDateString()}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="relative mt-auto">
                <textarea
                    value={manualEntry}
                    onChange={(e) => setManualEntry(e.target.value)}
                    placeholder="سجل خواطرك.. ماذا تعلمت اليوم؟"
                    className="w-full bg-[#050214] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#7112AF] min-h-[80px] resize-none placeholder:text-slate-600"
                />
                <button
                    onClick={handleSaveManual}
                    disabled={!manualEntry.trim()}
                    className="absolute bottom-3 left-3 p-2 bg-[#7112AF] text-white rounded-lg hover:bg-[#5a0d8e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-purple-900/20"
                >
                    <Save size={16} />
                </button>
            </div>
        </div>
    );
};
