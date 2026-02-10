import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Skull, Wrench, Server, Zap, ChevronRight, Info } from 'lucide-react';

const PRE_SETUP_QUESTIONS = {
    attacker: [
        {
            id: 'tools',
            question: 'ما هي مجموعة الأدوات التي ستحتاجها للبدء؟',
            options: [
                { id: 'stealth', label: 'مجموعة التخفي (nmap, whois, ping)', description: 'للعمل بأقل ضوضاء ممكنة' },
                { id: 'aggressive', label: 'مجموعة بروت فورس (hydra, nmap, sqlmap)', description: 'لاختصار الوقت باختراق عنيف' },
            ]
        },
        {
            id: 'environment',
            question: 'ما نوع البيئة المستهدفة؟',
            options: [
                { id: 'hybrid', label: 'بيئة شبكة مختلطة (Hybrid)', description: 'سيرفرات محلية وسحابة معا' },
                { id: 'local', label: 'بيئة شبكة محلية (On-premise)', description: 'خلف جدار ناري داخلي' },
            ]
        }
    ],
    defender: [
        {
            id: 'tools',
            question: 'ما هي الأدوات الدفاعية الضرورية لهذا الحادث؟',
            options: [
                { id: 'triaging', label: 'أدوات الفرز (grep, tail, lsof)', description: 'لفهم ما يحدث الآن في السجلات' },
                { id: 'containment', label: 'أدوات الحظر (iptables, fail2ban)', description: 'لإيقاف المهاجم فوراً' },
            ]
        },
        {
            id: 'environment',
            question: 'من أين ستبدأ المراقبة؟',
            options: [
                { id: 'logs', label: 'مركز السجلات (Log Center)', description: 'لمتابعة كل الأحداث التاريخية' },
                { id: 'live', label: 'حركة الشبكة الحية (Live Traffic)', description: 'لالتقاط المهاجم متلبسا' },
            ]
        }
    ]
};

export const PreSetupPhase = ({ role, onComplete }) => {
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState({});
    const questions = PRE_SETUP_QUESTIONS[role] || [];

    const handleSelect = (optionId) => {
        const newSelections = { ...selections, [questions[step].id]: optionId };
        setSelections(newSelections);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            onComplete(newSelections);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl"
            >
                {/* Progress Bar */}
                <div className="flex gap-2 mb-10">
                    {questions.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx <= step ? 'bg-[#7112AF]' : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="flex items-center gap-3 mb-6 text-[#7112AF]">
                            <Zap className="animate-pulse" size={24} />
                            <span className="text-xs font-bold uppercase tracking-widest">مرحلة التجهيز (Phase 0)</span>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-8 leading-tight">
                            {questions[step]?.question}
                        </h2>

                        <div className="grid gap-6">
                            {questions[step]?.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelect(option.id)}
                                    className="group relative text-right p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#7112AF]/50 hover:bg-[#7112AF]/5 transition-all duration-300"
                                >
                                    <div className="flex flex-row-reverse items-center justify-between">
                                        <div className="flex-1 pr-6">
                                            <div className="text-xl font-bold text-white mb-1 group-hover:text-[#7112AF] transition-colors">
                                                {option.label}
                                            </div>
                                            <div className="text-slate-400 text-sm">
                                                {option.description}
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#7112AF]/30 group-hover:shadow-[0_0_20px_rgba(113,18,175,0.2)] transition-all">
                                            <ChevronRight className="text-slate-500 group-hover:text-[#7112AF]" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-12 flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <Info className="text-blue-500 shrink-0 mt-1" size={18} />
                    <p className="text-sm text-slate-400 leading-relaxed italic">
                        "اختياراتك في هذه المرحلة ستؤثر على شكل البيئة الافتراضية التي ستبنيها لك المنصة. لا توجد إجابة خاطئة تماماً، لكن هناك إجابة أكثر احترافية."
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
