import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, CheckCircle2, AlertCircle, Lightbulb, Terminal } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const SimulationHistory = () => {
    const { history: rawHistory } = useAnalytics();
    const [expandedId, setExpandedId] = useState(null);

    // Transform raw logs into visual cards
    const historyItems = rawHistory.filter(item => ['TASK_COMPLETE', 'BASH_ERROR', 'LEVEL_UP'].includes(item.type)).map(item => {
        if (item.type === 'TASK_COMPLETE') {
            return {
                id: item.id,
                tool: 'Bash Simulator',
                date: new Date(item.timestamp).toLocaleDateString('ar-EG'),
                outcome: 'mastery',
                title: `إنجاز مهمة: ${item.payload.task}`,
                insight: `أتممت مهمة في مستوى ${item.payload.level} باستخدام الأمر ${item.payload.command}.`,
                learningMoment: 'الممارسة العملية هي مفتاح الإتقان.'
            };
        }
        if (item.type === 'BASH_ERROR') {
            return {
                id: item.id,
                tool: 'Bash Simulator',
                date: new Date(item.timestamp).toLocaleDateString('ar-EG'),
                outcome: 'struggle',
                title: `خطأ في الأمر: ${item.payload.command}`,
                insight: `رسالة الخطأ: ${item.payload.error}`,
                learningMoment: 'قراءة رسائل الخطأ بعناية هي نصف الحل.',
                needsReview: true
            };
        }
        if (item.type === 'LEVEL_UP') {
            return {
                id: item.id,
                tool: 'Bash Simulator',
                date: new Date(item.timestamp).toLocaleDateString('ar-EG'),
                outcome: 'discovery',
                title: `ترقية مستوى!`,
                insight: `وصلت إلى ${item.payload.newLevel}.`,
                learningMoment: 'الاستمرار في التقدم يفتح أبواباً جديدة.',
            };
        }
        return null;
    });



    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                سجل الرحلة <History size={20} className="text-[#7112AF]" />
            </h3>

            <div className="space-y-4">
                {historyItems.length === 0 && <p className="text-slate-500 text-center py-4">لا يوجد نشاط مسجل بعد.</p>}
                {historyItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-xl border ${item.needsReview ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-white/5 bg-white/5'} overflow-hidden transition-all duration-300 ${expandedId === item.id ? 'bg-white/10' : ''}`}
                    >
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${item.needsReview ? 'bg-yellow-500/20 text-yellow-500' : 'bg-[#7112AF]/20 text-[#7112AF]'}`}>
                                    {item.needsReview ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">{item.title}</h4>
                                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                                        <Terminal size={10} /> {item.tool} • {item.date}
                                    </span>
                                </div>
                            </div>
                            <ChevronDown size={16} className={`text-slate-500 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                            {expandedId === item.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-4 pb-4 border-t border-white/5"
                                >
                                    <div className="pt-3 space-y-3">
                                        <div className="flex gap-2 items-start">
                                            <Lightbulb size={16} className="text-yellow-400 mt-1 shrink-0" />
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                <span className="font-bold text-white block mb-1">الاستنتاج:</span>
                                                {item.insight}
                                            </p>
                                        </div>
                                        <div className="bg-[#050214]/50 p-3 rounded-lg border border-white/5">
                                            <span className="text-[#7112AF] text-xs font-bold block mb-1">لحظة التعلم:</span>
                                            <p className="text-slate-400 text-xs">{item.learningMoment}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
