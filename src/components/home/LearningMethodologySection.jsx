import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, ShieldCheck, ArrowRight } from 'lucide-react';

export const LearningMethodologySection = () => {
    const steps = [
        {
            id: 1,
            icon: <BookOpen size={24} />,
            title: '1. التأصيل النظري',
            desc: 'لا يمكنك حماية ما لا تفهمه. نبدأ بشرح عميق للبروتوكولات (TCP/IP, HTTP) وأنظمة التشغيل، وكيف تعمل التكنولوجيا خلف الكواليس.',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            border: 'border-blue-400/20'
        },
        {
            id: 2,
            icon: <Target size={24} />,
            title: '2. المحاكاة الهجومية',
            desc: 'ارتد قبعة المهاجم (Red Hat). استخدم أدوات مثل Nmap و Metasploit في بيئة معزولة لتفهم كيف يستغل الهاكرز الثغرات التي درستها.',
            color: 'text-red-400',
            bg: 'bg-red-400/10',
            border: 'border-red-400/20'
        },
        {
            id: 3,
            icon: <ShieldCheck size={24} />,
            title: '3. الدفاع والاستجابة',
            desc: 'الآن، استخدم معرفتك لإغلاق الثغرات. قم بتحصين الأنظمة (Hardening)، تحليل السجلات، وبناء استراتيجيات الكشف والردع.',
            color: 'text-purple-400',
            bg: 'bg-[#7112AF]/10',
            border: 'border-[#7112AF]/20'
        }
    ];

    return (
        <section className="py-24 px-6 relative z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a051e] via-[#02010a] to-[#02010a]">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">دائرة التعلم المتكاملة</h2>
                <p className="text-slate-400">من النظرية إلى التطبيق، ومن الهجوم إلى الدفاع.</p>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="relative flex flex-col md:flex-row gap-8 justify-between items-center">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className={`relative w-full md:w-1/3 p-8 rounded-3xl border ${step.border} bg-[#050214] flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300`}
                        >
                            <div className={`w-14 h-14 ${step.bg} rounded-full flex items-center justify-center mb-6 ${step.color} outline outline-4 outline-[#050214] relative z-10`}>
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {step.desc}
                            </p>

                            {index < steps.length - 1 && (
                                <div className="md:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 text-slate-700 animate-bounce">
                                    <ArrowRight className="rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
