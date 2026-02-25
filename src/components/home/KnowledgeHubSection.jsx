import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ArrowLeft, Calendar, FileQuestion, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const getTypeIcon = (type) => {
    switch (type) {
        case 'event': return <Calendar size={24} />;
        case 'survey': return <FileQuestion size={24} />;
        case 'news': return <Newspaper size={24} />;
        default: return <Bell size={24} />;
    }
};

const getTypeColor = (type) => {
    switch (type) {
        case 'event': return 'text-green-400';
        case 'survey': return 'text-yellow-400';
        case 'news': return 'text-blue-400';
        default: return 'text-slate-400';
    }
};

const getTypeLabel = (type) => {
    switch (type) {
        case 'event': return 'فعالية قادمة';
        case 'survey': return 'استبيان';
        case 'news': return 'خبر جديد';
        default: return 'تحديث';
    }
};

export const ClubUpdatesSection = () => {
    const navigate = useNavigate();
    const { apiCall } = useAuth();
    const [latestUpdates, setLatestUpdates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const data = await apiCall('/news/latest-updates');
                if (data && data.success && Array.isArray(data.latest)) {
                    setLatestUpdates(data.latest);
                }
            } catch (err) {
                console.error("Failed to load club updates:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUpdates();
    }, [apiCall]);

    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">أحدث الأخبار والفعاليات</h2>
                        <p className="text-slate-400 max-w-xl">تابع آخر مستجدات النادي من فعاليات قادمة، أخبار حصرية، واستبيانات تهمنا مشاركتك بها.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-3 flex items-center justify-center p-12 text-slate-500">
                            جاري تحميل التحديثات...
                        </div>
                    ) : latestUpdates.length > 0 ? (
                        latestUpdates.map((item, index) => (
                            <motion.div
                                key={`${item.type}-${item.id}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="group p-6 bg-[#050214] border border-white/5 rounded-2xl hover:border-[#7112AF]/30 transition-colors cursor-pointer flex flex-col h-full"
                                onClick={() => navigate('/news')}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg bg-white/5 ${getTypeColor(item.type)}`}>
                                        {getTypeIcon(item.type)}
                                    </div>
                                    <ArrowLeft size={16} className="text-slate-600 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                                </div>

                                <h3 className="text-lg font-bold text-slate-200 mb-3 line-clamp-2 group-hover:text-[#7112AF] transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                    {item.description || 'لا يوجد تفاصيل إضافية لهذا التحديث.'}
                                </p>

                                <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4">
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 ${getTypeColor(item.type)}`}>
                                        {getTypeLabel(item.type)}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono">
                                        {item.type_tag || 'عام'}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-3 text-slate-500 text-center p-8 bg-white/5 rounded-2xl border border-white/5">
                            لا توجد تحديثات متاحة حالياً
                        </div>
                    )}
                </div>

                <div className="mt-10 text-center">
                    <button
                        onClick={() => navigate('/news')}
                        className="text-slate-400 hover:text-white text-sm font-mono border-b border-transparent hover:border-[#7112AF] transition-all pb-1"
                    >
                        عرض جميع الأخبار والفعاليات
                    </button>
                </div>
            </div>
        </section>
    );
};
