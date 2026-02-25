import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, ArrowLeft, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const getEnvIcon = (type) => {
    switch (type) {
        case 'article': return <FileText size={24} />;
        case 'course': return <Video size={24} />;
        case 'track': return <GraduationCap size={24} />;
        default: return <BookOpen size={24} />;
    }
};

const getEnvColor = (type) => {
    switch (type) {
        case 'article': return 'text-blue-400';
        case 'course': return 'text-orange-400';
        case 'track': return 'text-purple-400';
        default: return 'text-slate-400';
    }
};

const getEnvLabel = (type) => {
    switch (type) {
        case 'article': return 'مقال تعليمي';
        case 'course': return 'دورة مسجلة';
        case 'track': return 'مسار تعليمي';
        default: return 'محتوى';
    }
};

export const KnowledgeBasePreviewSection = () => {
    const navigate = useNavigate();
    const { apiCall } = useAuth();
    const [latestItems, setLatestItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLatestKnowledge = async () => {
            try {
                // Fetch from the LMS endpoint (assuming public or basic auth)
                const data = await apiCall('/lms/latest');
                if (data && data.success && Array.isArray(data.latest)) {
                    setLatestItems(data.latest);
                }
            } catch (err) {
                console.error("Failed to load knowledge base items:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestKnowledge();
    }, [apiCall]);

    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold mb-4">
                            <BookOpen size={14} />
                            <span>قاعدة المعرفة</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            اكتسب المهارة <br />
                            <span className="text-slate-500">من الصفر للاحتراف</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            نضع بين يديك مكتبة ضخمة من المسارات التعليمية، الدورات المسجلة، والمقالات العميقة لنضمن لك رحلة تعليمية متكاملة.
                        </p>
                        <button
                            onClick={() => navigate('/knowledge')}
                            className="px-8 py-3 bg-[#7112AF] text-white rounded-xl font-bold hover:bg-[#5a0d8e] transition-colors flex items-center gap-2"
                        >
                            تصفح قاعدة المعرفة <ArrowLeft size={18} />
                        </button>
                    </div>

                    <div className="lg:w-1/2 grid gap-4 w-full">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-12 text-slate-500">جاري تحميل المحتوى...</div>
                        ) : latestItems.length > 0 ? (
                            latestItems.map((item, index) => (
                                <motion.div
                                    key={`${item.type}-${item.id}`}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    className="group relative overflow-hidden bg-[#0a051e] border border-white/5 rounded-2xl p-6 hover:border-[#7112AF]/30 transition-colors cursor-pointer"
                                    onClick={() => navigate('/knowledge')}
                                >
                                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#7112AF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg bg-white/5 ${getEnvColor(item.type)}`}>
                                            {getEnvIcon(item.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-white group-hover:text-[#7112AF] transition-colors line-clamp-1">{item.title}</h3>
                                                <span className={`text-xs font-bold px-2 py-1 rounded bg-white/5 ${getEnvColor(item.type)}`}>{getEnvLabel(item.type)}</span>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
                                                {item.description || 'لم يتم توفير وصف إضافي...'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-slate-500 text-center p-8 bg-white/5 rounded-2xl border border-white/5">
                                لا يوجد محتوى متاح حالياً
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
