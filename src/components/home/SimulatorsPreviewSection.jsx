import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Hardcoded simulators data (matches SimulatorsHub.jsx)
const SIMULATORS_PREVIEW = [
    {
        id: 'bash-pro',
        title: 'محاكي Bash الاحترافي',
        category: 'أداة',
        difficulty: 'مبتدئ',
        description: 'تعلم أوامر Linux من الصفر حتى الاحتراف مع بيئة تفاعلية حقيقية',
        icon: Terminal,
    },
    {
        id: 'attack-operation',
        title: 'عملية الفهد الأسود',
        category: 'سيناريو هجوم',
        difficulty: 'متوسط',
        description: 'سيناريو اختراق كامل مع 5 مراحل: استطلاع، مسح، استغلال، ما بعد الاستغلال',
        icon: Shield,
    },
];

export const SimulatorsPreviewSection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 px-6 relative z-10 bg-[#050214]/50 backdrop-blur-sm border-y border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-16">
                    <div className="lg:w-1/2 text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7112AF]/10 text-[#d4b3ff] border border-[#7112AF]/20 text-xs font-bold mb-4 justify-end">
                            <span>المختبر الافتراضي</span>
                            <Terminal size={14} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            جرب أدوات الاختراق <br />
                            <span className="text-[#b66dff]">في بيئة آمنة</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            لا حاجة لتثبيت أدوات معقدة أو المخاطرة بجهازك. وفرنا لك محاكيات تفاعلية تعمل مباشرة من المتصفح لتفهم كيف تعمل الأدوات الحقيقية.
                        </p>
                        <button
                            onClick={() => navigate('/simulators')}
                            className="px-8 py-3 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center gap-2 mr-auto lg:mr-0 ml-auto"
                        >
                            تصفح جميع المحاكيات <ArrowLeft size={18} />
                        </button>
                    </div>

                    <div className="lg:w-1/2 grid gap-4 w-full">
                        {SIMULATORS_PREVIEW.map((sim, index) => {
                            const Icon = sim.icon;
                            return (
                                <motion.div
                                    key={sim.id}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    className="group relative overflow-hidden bg-[#0a051e] border border-white/5 rounded-2xl p-6 hover:border-[#7112AF]/30 transition-colors cursor-pointer text-right"
                                    onClick={() => navigate('/simulators')}
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#7112AF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-start gap-4 flex-row-reverse">
                                        <div className="p-3 rounded-lg bg-[#7112AF]/10 text-[#d4b3ff]">
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2 flex-row-reverse">
                                                <h3 className="text-xl font-bold text-white group-hover:text-[#7112AF] transition-colors">{sim.title}</h3>
                                                <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 text-slate-400 border border-white/5">{sim.category}</span>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
                                                {sim.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 flex-row-reverse">
                                                <span>المستوى:</span>
                                                <span className="text-[#b66dff]">{sim.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
