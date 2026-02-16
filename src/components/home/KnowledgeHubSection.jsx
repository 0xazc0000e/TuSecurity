import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Newspaper, Video, ArrowLeft, Clock, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const KnowledgeHubSection = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('articles');

    const tabs = [
        { id: 'articles', label: 'المقالات', icon: <FileText size={18} /> },
        { id: 'news', label: 'الأخبار', icon: <Newspaper size={18} /> },
        { id: 'courses', label: 'الدورات المسجلة', icon: <Video size={18} /> },
    ];

    const content = {
        articles: [
            { id: 1, title: 'كيف تبدأ في مجال اختبار الاختراق؟', category: 'مسار مهني', readTime: '5 دقائق', date: '2025-01-15' },
            { id: 2, title: 'شرح ثغرة SQL Injection للمبتدئين', category: 'Web Security', readTime: '8 دقائق', date: '2025-01-20' },
            { id: 3, title: 'أهم شهادات الأمن السيبراني في 2025', category: 'شهادات', readTime: '6 دقائق', date: '2025-01-25' },
        ],
        news: [
            { id: 1, title: 'اكتشاف ثغرة Zero-day في نظام تشغيل شائع', source: 'TUCC News', date: 'منذ ساعتين' },
            { id: 2, title: 'تقرير: ارتفاع هجمات الفدية بنسبة 300%', source: 'Global Security', date: 'أمس' },
            { id: 3, title: 'النادي يطلق مسابقة CTF الرمضانية', source: 'إعلانات النادي', date: 'قبل يومين' },
        ],
        courses: [
            { id: 1, title: 'أساسيات الشبكات للهاكرز', instructor: 'م. أحمد', duration: '4 ساعات' },
            { id: 2, title: 'دورة بايثون للأمن السيبراني', instructor: 'د. سارة', duration: '6 ساعات' },
            { id: 3, title: 'مقدمة في التحقيق الجنائي الرقمي', instructor: 'أ. خالد', duration: '3 ساعات' },
        ]
    };

    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">قاعدة المعرفة</h2>
                        <p className="text-slate-400 max-w-xl">كل ما تحتاجه لتبقى على اطلاع. مقالات تعليمية، أخبار حصرية، ودورات مسجلة.</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-[#0a051e] p-1 rounded-xl border border-white/10">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#7112AF] rounded-lg shadow-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {tab.icon} {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <AnimatePresence mode='wait'>
                        {content[activeTab].map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="group p-6 bg-[#050214] border border-white/5 rounded-2xl hover:border-[#7112AF]/30 transition-colors cursor-pointer"
                                onClick={() => navigate('/knowledge')}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg bg-white/5 ${activeTab === 'news' ? 'text-green-400' : activeTab === 'courses' ? 'text-orange-400' : 'text-blue-400'}`}>
                                        {activeTab === 'news' ? <Newspaper size={20} /> : activeTab === 'courses' ? <Video size={20} /> : <FileText size={20} />}
                                    </div>
                                    <ArrowLeft size={16} className="text-slate-600 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                                </div>

                                <h3 className="text-lg font-bold text-slate-200 mb-3 line-clamp-2 group-hover:text-[#7112AF] transition-colors">
                                    {item.title}
                                </h3>

                                <div className="flex items-center gap-4 text-xs text-slate-500 mt-auto">
                                    {item.category && (
                                        <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                                            <Tag size={12} /> {item.category}
                                        </span>
                                    )}
                                    {item.readTime && (
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {item.readTime}
                                        </span>
                                    )}
                                    {item.source && <span>{item.source}</span>}
                                    {item.instructor && <span>{item.instructor}</span>}
                                    {item.duration && <span>{item.duration}</span>}
                                    <span className="mr-auto">{item.date}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-10 text-center">
                    <button
                        onClick={() => navigate('/knowledge')}
                        className="text-slate-400 hover:text-white text-sm font-mono border-b border-transparent hover:border-[#7112AF] transition-all pb-1"
                    >
                        عرض المزيد من {tabs.find(t => t.id === activeTab).label}
                    </button>
                </div>
            </div>
        </section>
    );
};
