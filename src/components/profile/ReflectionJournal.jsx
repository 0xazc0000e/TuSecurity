import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Send, CheckCircle } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const ReflectionJournal = () => {
    const { reflections, dispatch } = useAnalytics();
    const [activeId, setActiveId] = useState(null);
    const [response, setResponse] = useState('');

    const activeReflections = reflections ? reflections.filter(r => !r.answered) : [];

    const handleSubmit = (id) => {
        if (!response.trim()) return;

        dispatch({
            type: 'ANSWER_REFLECTION',
            payload: { id, response }
        });

        setResponse('');
        setActiveId(null);
    };

    if (activeReflections.length === 0) return null; // Hide if no questions

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 mt-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                دفتر التفكير السيبراني <BookOpen size={20} className="text-[#7112AF]" />
            </h3>

            <div className="space-y-4">
                {activeReflections.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="text-xs text-[#7112AF] font-bold uppercase tracking-wider mb-1 block">تأمل في {item.context}</span>
                                <p className="text-white font-medium text-lg leading-relaxed">
                                    {item.question}
                                </p>
                            </div>
                        </div>

                        {activeId === item.id ? (
                            <div className="mt-4">
                                <textarea
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    placeholder="اكتب أفكارك هنا..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-slate-300 text-sm focus:outline-none focus:border-[#7112AF] min-h-[80px]"
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        onClick={() => setActiveId(null)}
                                        className="px-4 py-2 text-slate-400 text-xs hover:bg-white/5 rounded-lg"
                                    >
                                        تأجيل
                                    </button>
                                    <button
                                        onClick={() => handleSubmit(item.id)}
                                        disabled={!response.trim()}
                                        className="px-4 py-2 bg-[#7112AF] text-white text-xs rounded-lg flex items-center gap-2 hover:bg-[#5a0e8c] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={14} /> حفظ التأمل
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setActiveId(item.id)}
                                className="text-sm text-slate-400 hover:text-white underline decoration-dashed underline-offset-4 transition-colors"
                            >
                                كتابة إجابة...
                            </button>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
