import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, CheckCircle2, AlertCircle, Lightbulb, Terminal, Zap, BookOpen, Brain, Trophy } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const SimulationHistory = () => {
    const { journey } = useAnalytics();
    const [expandedId, setExpandedId] = useState(null);

    const getEventConfig = (type) => {
        switch (type) {
            case 'achievement':
                return { icon: <Trophy size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/30' };
            case 'milestone':
                return { icon: <Zap size={16} />, color: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-400/30' };
            case 'struggle':
                return { icon: <AlertCircle size={16} />, color: 'text-red-400', bg: 'bg-red-400/20', border: 'border-red-400/30' };
            case 'reflection':
                return { icon: <Brain size={16} />, color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/30' };
            case 'learning':
                return { icon: <BookOpen size={16} />, color: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/30' };
            default:
                return { icon: <CheckCircle2 size={16} />, color: 'text-slate-400', bg: 'bg-slate-400/20', border: 'border-slate-400/30' };
        }
    };

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-full flex flex-col max-h-[600px]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 shrink-0">
                سجل الرحلة <History size={20} className="text-[#7112AF]" />
            </h3>

            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                {(!journey || journey.length === 0) && (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                        <History size={40} className="opacity-20 mb-2" />
                        <p>لا يوجد نشاط مسجل بعد.</p>
                    </div>
                )}

                {journey && journey.map((item, index) => {
                    const config = getEventConfig(item.type);
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`rounded-xl border ${config.border} bg-white/5 overflow-hidden transition-all duration-300 ${expandedId === item.id ? 'bg-white/10 ring-1 ring-white/20' : ''}`}
                        >
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer"
                                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${config.bg} ${config.color}`}>
                                        {config.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{item.title}</h4>
                                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                            {new Date(item.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} • {new Date(item.timestamp).toLocaleDateString('ar-EG')}
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
                                            {item.insight && (
                                                <div className="flex gap-2 items-start bg-black/20 p-3 rounded-lg">
                                                    <Lightbulb size={16} className="text-yellow-400 mt-1 shrink-0" />
                                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                        <span className="font-bold text-white block mb-1 text-xs uppercase tracking-wider opacity-70">الرؤية:</span>
                                                        {item.insight}
                                                    </p>
                                                </div>
                                            )}
                                            {item.errorType && (
                                                <div className="flex gap-2 text-xs font-mono text-pink-400">
                                                    <Terminal size={12} />
                                                    <span>Type: {item.errorType} | Cmd: {item.command}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
