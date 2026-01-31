import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BookX, Zap, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';

export const WhyDifferentSection = () => {
    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7112AF]/10 text-[#d4b3ff] border border-[#7112AF]/20 text-xs font-bold mb-4"
                    >
                        <Zap size={14} />
                        <span>لماذا نحن؟</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        لا تحفظ الثغرات، <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7112AF] to-[#b66dff]">افهم كيف تفكر</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        معظم الدورات تعلمك "كيف" تستخدم الأدوات. نحن نعلمك "لماذا" تعمل هذه الأدوات، و"متى" تفشل، وكيف تبني حدسك الأمني.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 text-white">
                    {/* The Old Way */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-red-500/5 rounded-3xl blur-xl group-hover:bg-red-500/10 transition-colors" />
                        <div className="relative h-full p-8 rounded-3xl border border-white/5 bg-[#0a051e]/50 backdrop-blur-sm">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-slate-500 group-hover:text-red-400 transition-colors">
                                <BookX size={24} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-300 group-hover:text-white transition-colors">التعليم التقليدي</h3>
                            <ul className="space-y-4">
                                <b className="flex items-start gap-3 text-slate-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2.5 shrink-0" />
                                    <span>حفظ أوامر <code className="bg-white/5 px-1 py-0.5 rounded text-xs mx-1">nmap</code> دون فهم البنية التحتية.</span>
                                </b>
                                <li className="flex items-start gap-3 text-slate-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2.5 shrink-0" />
                                    <span>الاعتماد على أدوات جاهزة (Script Kiddie).</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2.5 shrink-0" />
                                    <span>سيناريوهات نظرية مملة ومنفصلة عن الواقع.</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* The Cognitive Way */}
                    <SpotlightCard className="h-full p-8 border-[#7112AF]/30 from-[#7112AF]/20 via-[#050214] to-[#050214]">
                        <div className="w-12 h-12 bg-[#7112AF]/20 rounded-2xl flex items-center justify-center mb-6 text-[#7112AF]">
                            <Brain size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">النموذج الإدراكي (TUCC)</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-200">
                                <CheckCircle2 size={18} className="mt-1 text-[#7112AF] shrink-0" />
                                <span>بناء <span className="text-[#b66dff] font-bold">نماذج ذهنية</span> لكيفية عمل الشبكات والأنظمة.</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-200">
                                <CheckCircle2 size={18} className="mt-1 text-[#7112AF] shrink-0" />
                                <span>محاكاة واقعية تفاعلية ترى فيها حركة البيانات.</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-200">
                                <CheckCircle2 size={18} className="mt-1 text-[#7112AF] shrink-0" />
                                <span>فهم "لماذا" نجح الهجوم، وليس فقط "كيف" تنفذه.</span>
                            </li>
                        </ul>
                    </SpotlightCard>
                </div>
            </div>
        </section>
    );
};
