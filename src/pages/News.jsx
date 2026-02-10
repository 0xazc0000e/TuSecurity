import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Filter, Zap, Globe, Shield, Terminal, AlertTriangle, Play, ChevronLeft, User } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useAnalytics } from '../context/AnalyticsContext';
import { useDatabase } from '../context/DatabaseContext';

const SPOTLIGHT_THREAT = {
    title: 'هجوم SolarWinds: القصة الكاملة',
    subtitle: 'أخطر هجوم Supply Chain في التاريخ',
    steps: ['اختراق نظام التحديث', 'نشر الباب الخلفي', 'التحرك الجانبي', 'سرقة البيانات'],
    visual: <Globe className="text-red-500 animate-pulse" size={64} />
};

export default function News() {
    const { cognitiveLayers, logEvent } = useAnalytics();
    const { news: NEWS_DATA } = useDatabase();
    const [view, setView] = useState('personal'); // personal, spotlight, micro, filter
    const [activeFilter, setActiveFilter] = useState('all');

    // Personalized Sort
    const personalizedNews = useMemo(() => {
        return [...NEWS_DATA].sort((a, b) => {
            const scoreA = cognitiveLayers[a.domain]?.conceptual < 40 ? 10 : 0;
            const scoreB = cognitiveLayers[b.domain]?.conceptual < 40 ? 10 : 0;
            return scoreB - scoreA;
        });
    }, [cognitiveLayers]);

    const handleRead = (news) => {
        logEvent('NEWS_READ', { domain: news.domain, title: news.title });
        alert(`تم تسجيل قراءة: ${news.title} (+3 وعي)`);
    };

    return (
        <div className="min-h-screen pt-24 px-6 relative font-cairo">
            <MatrixBackground />
            <div className="max-w-7xl mx-auto">
                <SectionHeader title="المركز الإعلامي" subtitle="مختبر الوعي السيبراني" />

                {/* VIEW TABS */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
                    {[
                        { id: 'personal', label: 'تغذية شخصية', icon: <User /> },
                        { id: 'spotlight', label: 'بؤرة التهديد', icon: <AlertTriangle /> },
                        { id: 'micro', label: 'موجز سريع', icon: <Zap /> },
                        // { id: 'filter', label: 'تصفية', icon: <Filter /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${view === tab.id ? 'bg-[#7112AF] text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* VIEW 1: PERSONAL FEED */}
                    {view === 'personal' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="grid gap-6"
                        >
                            {personalizedNews.map((news) => (
                                <div key={news.id} className="bg-[#050214]/80 border border-white/10 rounded-2xl p-6 hover:border-[#7112AF]/50 transition-colors group relative overflow-hidden">
                                    {/* Relevance Badge */}
                                    {cognitiveLayers[news.domain]?.conceptual < 40 && (
                                        <div className="absolute top-0 left-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-br-lg z-10">
                                            موصى به لتقوية الضعف
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                                <Calendar size={12} /> {news.date}
                                                <span className="px-2 py-0.5 rounded bg-white/10 text-white">{news.domain}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4b3ff] transition-colors">{news.title}</h3>
                                            <p className="text-slate-300 text-sm mb-4 leading-relaxed">{news.desc}</p>

                                            {/* Mandatory Education Section */}
                                            <div className="bg-white/5 rounded-xl p-4 mb-4 border-r-2 border-[#7112AF]">
                                                <h4 className="text-[#7112AF] font-bold text-xs mb-2 flex items-center gap-2"><Zap size={12} /> لماذا هذا مهم لك؟</h4>
                                                <p className="text-slate-400 text-xs">{news.imp}</p>
                                            </div>

                                            <div className="flex gap-4">
                                                <button onClick={() => handleRead(news)} className="bg-[#7112AF] hover:bg-[#5a0e8b] text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-[#7112AF]/20">
                                                    اقرأ واكسب نقاط وعي
                                                </button>
                                                <button className="text-slate-400 hover:text-white text-sm flex items-center gap-1">
                                                    جرب المحاكي المرتبط <ChevronLeft size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* VIEW 2: SPOTLIGHT */}
                    {view === 'spotlight' && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-900/10 border border-red-500/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_20px_#ef4444]"></div>
                            <div className="mb-6">{SPOTLIGHT_THREAT.visual}</div>
                            <h2 className="text-4xl font-black text-white mb-2">{SPOTLIGHT_THREAT.title}</h2>
                            <p className="text-red-400 font-bold mb-8">{SPOTLIGHT_THREAT.subtitle}</p>

                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                {SPOTLIGHT_THREAT.steps.map((step, i) => (
                                    <div key={i} className="bg-black/40 px-4 py-2 rounded-lg border border-red-500/20 text-slate-300 text-sm flex items-center gap-2">
                                        <span className="w-5 h-5 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                        {step}
                                    </div>
                                ))}
                            </div>

                            <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center gap-2 mx-auto">
                                <Play fill="white" size={18} /> محاكاة الهجوم
                            </button>
                        </motion.div>
                    )}

                    {/* VIEW 3: MICRO NEWS */}
                    {view === 'micro' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {NEWS_DATA.map(news => (
                                <div key={news.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#7112AF] transition-all cursor-pointer group text-center" onClick={() => handleRead(news)}>
                                    <div className="w-10 h-10 bg-[#7112AF]/20 rounded-full flex items-center justify-center mx-auto mb-3 text-[#d4b3ff] group-hover:scale-110 transition-transform">
                                        {news.domain === 'os' ? <Terminal size={18} /> : news.domain === 'network' ? <Globe size={18} /> : <Shield size={18} />}
                                    </div>
                                    <h4 className="font-bold text-white text-sm mb-2 line-clamp-2">{news.title}</h4>
                                    <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">{news.domain}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
