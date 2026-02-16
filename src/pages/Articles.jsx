import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Terminal, Globe, Shield, Cpu, ExternalLink, ArrowRight, Zap, Network } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useAnalytics } from '../context/AnalyticsContext';
import { useAuth } from '../context/AuthContext';
import { InteractionBar } from '../components/ui/InteractionBar';

const PORTALS = [
    { id: 'os', title: 'أنظمة التشغيل', icon: Terminal, color: 'text-green-400', bg: 'bg-green-400/10', desc: 'قلب التحكم: Linux & Windows' },
    { id: 'network', title: 'الشبكات والاتصال', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'لغة التخاطب بين الأجهزة' },
    { id: 'security', title: 'أساسيات الأمن', icon: Shield, color: 'text-red-400', bg: 'bg-red-400/10', desc: 'الدفاع والهجوم السيبراني' },
    { id: 'tools', title: 'الأدوات والتقنيات', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-400/10', desc: 'ترسانة الهاكر الأخلاقي' },
];

export default function Articles() {
    const { cognitiveLayers, logEvent } = useAnalytics();
    const { articles: ARTICLES } = useDatabase(); // Kept for fallback
    const { apiCall } = useAuth();
    const [articlesData, setArticlesData] = useState([]);
    const [activePortal, setActivePortal] = useState(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await apiCall('/lms/articles');
                setArticlesData(data);
            } catch (error) {
                console.error("Failed to fetch articles", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const getSmartLevel = (portalId, articleLevel) => {
        const score = cognitiveLayers[portalId]?.conceptual || 0;
        if (score < 30 && articleLevel === 'beginner') return { show: true, label: 'مناسب لك (مبتدئ)', color: 'text-green-400' };
        if (score >= 30 && score < 70 && articleLevel === 'intermediate') return { show: true, label: 'تحدي متوسط', color: 'text-yellow-400' };
        if (score >= 70 && articleLevel === 'advanced') return { show: true, label: 'تعمق للمحترفين', color: 'text-red-400' };
        return { show: true, label: articleLevel, color: 'text-slate-500' };
    };

    const handleXpAward = (xp) => {
        alert(`تم إنهاء القراءة! (+${xp} نقاط مفاهيمية)`);
    };

    return (
        <div className="min-h-screen pt-24 px-6 relative font-cairo">
            <MatrixBackground />
            <div className="max-w-7xl mx-auto">
                <SectionHeader title="قاعدة المعرفة" subtitle="عقل المنصة المركزي" />

                {/* Concept Map Visualization (Static for now) */}
                <div className="mb-12 relative h-40 border border-white/5 rounded-2xl overflow-hidden bg-[#02010a] flex items-center justify-center">
                    <div className="absolute opacity-20 inset-0 flex items-center justify-center gap-12">
                        <Terminal size={40} className="text-green-500 animate-pulse" />
                        <div className="w-20 h-0.5 bg-slate-700"></div>
                        <Globe size={40} className="text-blue-500" />
                        <div className="w-20 h-0.5 bg-slate-700"></div>
                        <Shield size={40} className="text-red-500 animate-pulse delay-75" />
                    </div>
                    <p className="relative z-10 text-slate-500 text-xs font-mono bg-black/50 px-4 py-1 rounded">Visual Concept Map (Simulation)</p>
                </div>

                {/* PORTALS GRID */}
                {!activePortal ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PORTALS.map(portal => (
                            <motion.div
                                key={portal.id}
                                whileHover={{ scale: 1.02, translateY: -5 }}
                                className={`bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer group hover:border-opacity-50 relative overflow-hidden`}
                                onClick={() => setActivePortal(portal.id)}
                            >
                                <div className={`absolute top-0 right-0 w-1 h-full ${portal.color.replace('text', 'bg')}`}></div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${portal.bg} ${portal.color}`}>
                                    <portal.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">{portal.title}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">{portal.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    // ARTICLES LIST
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => setActivePortal(null)}
                            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm font-bold"
                        >
                            <ArrowRight size={16} /> العودة للبوابات
                        </button>

                        <div className="grid gap-4">
                            {articlesData.map(article => {
                                // Default level info if missing
                                const levelInfo = { show: true, label: 'مقال', color: 'text-slate-500' };

                                // Parse tags safely
                                const tags = typeof article.tags === 'string' ? JSON.parse(article.tags || '[]') : article.tags;

                                return (
                                    <div key={article.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#7112AF]/30 transition-all group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 ${levelInfo.color}`}>
                                                    {levelInfo.label}
                                                </span>
                                                {Array.isArray(tags) && tags.map(tag => <span key={tag} className="text-[10px] text-slate-500">#{tag}</span>)}
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#d4b3ff] transition-colors">{article.title}</h3>
                                            <p className="text-slate-400 text-xs line-clamp-2">{article.description || 'مقال تفاعلي يشرح المفهوم ويربطه بالتطبيق العملي.'}</p>
                                        </div>

                                        <div className="flex bg-black/20 rounded-xl p-2 items-center gap-3">
                                            <InteractionBar type="article" itemId={article.id} showView={true} onView={handleXpAward} />
                                            <button className="px-4 py-2 rounded-lg bg-[#7112AF] hover:bg-[#5a0e8b] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#7112AF]/20">
                                                <BookOpen size={12} fill="white" /> اقرأ
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
