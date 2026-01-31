import React from 'react';
import { motion } from 'framer-motion';
import { Map, ArrowLeft, Star, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PersonalizedPath = () => {
    const navigate = useNavigate();

    const nextSteps = [
        {
            id: 'net-analysis',
            title: 'تحليل حركة الشبكات',
            type: 'milestone',
            desc: 'بناءً على فهمك لأساسيات الشبكات، أنت جاهز لتعلم كيفية التقاط وتحليل الحزم باستخدام Wireshark.',
            icon: <Unlock size={18} />,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            id: 'linux-adv',
            title: 'صلاحيات Linux المتقدمة',
            type: 'recommendation',
            desc: 'لتعزيز مهاراتك في أنظمة التشغيل، ننصحك باستكشاف إدارة المستخدمين والصلاحيات.',
            icon: <Star size={18} />,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10'
        }
    ];

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                المسار المقترح <Map size={20} className="text-[#7112AF]" />
            </h3>

            <div className="space-y-4">
                {nextSteps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="p-4 rounded-xl border border-white/5 bg-[#050214]/50 hover:bg-[#050214] transition-colors group cursor-pointer"
                        onClick={() => navigate('/learning-path')}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${step.bg} ${step.color}`}>
                                {step.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold mb-1 group-hover:text-[#7112AF] transition-colors">{step.title}</h4>
                                <p className="text-slate-400 text-xs leading-relaxed mb-3">
                                    {step.desc}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-[#7112AF]">
                                    <span>ابداء التعلم</span>
                                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <button className="text-xs text-slate-500 hover:text-white transition-colors border-b border-transparent hover:border-slate-500 pb-0.5">
                    عرض خارطة الطريق الكاملة
                </button>
            </div>
        </div>
    );
};
