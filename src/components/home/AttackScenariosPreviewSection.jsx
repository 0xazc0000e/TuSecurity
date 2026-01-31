import React from 'react';
import { motion } from 'framer-motion';
import { Skull, ShieldAlert, FileWarning, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AttackScenariosPreviewSection = () => {
    const navigate = useNavigate();

    const scenarios = [
        {
            id: 'phishing',
            icon: <FileWarning size={24} />,
            title: 'رسالة البريد القاتلة',
            type: 'هندسة اجتماعية',
            story: 'موظف يستلم بريداً عاجلاً من "المدير التنفيذي". نقرة واحدة كانت كافية لتشفير ملفات الشركة.',
            role: 'Red Team',
            color: 'text-orange-400'
        },
        {
            id: 'ransomware',
            icon: <Skull size={24} />,
            title: 'إغلاق القبو الرقمي',
            type: 'Ransomware',
            story: 'شاشة حمراء، عداد تنازلي، ومطالبة بمليون دولار. كيف تتعامل مع الموقف قبل نفاذ الوقت؟',
            role: 'Blue Team',
            color: 'text-red-500'
        },
        {
            id: 'ddos',
            icon: <ShieldAlert size={24} />,
            title: 'طوفان البيانات',
            type: 'DDoS Attack',
            story: 'ملايين الطلبات الوهمية تغرق الخادم في ثوانٍ. هل يصمد الجدار الناري أم ينهار؟',
            role: 'Purple Team',
            color: 'text-purple-400'
        }
    ];

    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold mb-4">
                            <Skull size={14} />
                            <span>مكتبة التهديدات</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            عش قصة الهجوم <br />
                            <span className="text-slate-500">قبل أن تحدث في الواقع</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            لا نعلمك الأكواد فقط، بل نضعك في قلب السيناريو. اختر جانبك: هل أنت المهاجم الذي يبحث عن الثغرة؟ أم المدافع الذي يغلق الأبواب؟
                        </p>
                        <button
                            onClick={() => navigate('/attacks')}
                            className="px-8 py-3 bg-[#7112AF] text-white rounded-xl font-bold hover:bg-[#5a0d8e] transition-colors flex items-center gap-2"
                        >
                            استكشف السيناريوهات <ArrowLeft size={18} />
                        </button>
                    </div>

                    <div className="lg:w-1/2 grid gap-4 w-full">
                        {scenarios.map((scenario, index) => (
                            <motion.div
                                key={scenario.id}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="group relative overflow-hidden bg-[#0a051e] border border-white/5 rounded-2xl p-6 hover:border-[#7112AF]/30 transition-colors cursor-pointer"
                                onClick={() => navigate(`/attacks/${scenario.id}`)}
                            >
                                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#7112AF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg bg-white/5 ${scenario.color}`}>
                                        {scenario.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#7112AF] transition-colors">{scenario.title}</h3>
                                            <span className={`text-xs font-bold px-2 py-1 rounded bg-white/5 ${scenario.color}`}>{scenario.type}</span>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-3">
                                            {scenario.story}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                            <span>الدور المطلوب:</span>
                                            <span className="text-white">{scenario.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
