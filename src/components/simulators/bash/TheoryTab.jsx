import React, { useState } from 'react';
import { ArrowLeft, Terminal, MousePointer2, Map, Hammer, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TheoryTab = ({ onNext }) => {
    const [activeSection, setActiveSection] = useState(0);

    const sections = [
        {
            title: "المستوى 1: الاستكشاف (The Explorer)",
            icon: <Map className="text-blue-400" />,
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>في هذا المستوى، ستتعلم كيف تكون "العيون" التي ترى كل شيء في النظام. الهاكر المحترف لا يلمس شيئاً قبل أن يفهم أين هو وماذا يوجد حوله.</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-400">
                        <li><strong className="text-white">whoami</strong>: لتعرف هويتك وصلاحياتك.</li>
                        <li><strong className="text-white">pwd</strong>: لتعرف موقعك الحالي في الخريطة.</li>
                        <li><strong className="text-white">ls</strong>: لكشف الملفات والمجلدات المخفية والظاهرة.</li>
                        <li><strong className="text-white">cd</strong>: للانتقال بين الغرف (المجلدات) المختلفة.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "المستوى 2: البناء (The Builder)",
            icon: <Hammer className="text-emerald-400" />,
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>بعد أن جمعت المعلومات، حان وقت العمل. في هذا المستوى ستتعلم كيف تشكل النظام الرقمي بيديك.</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-400">
                        <li><strong className="text-white">mkdir</strong>: لبناء قواعد (مجلدات) جديدة.</li>
                        <li><strong className="text-white">touch</strong>: لإنشاء ملفات جديدة من العدم.</li>
                        <li><strong className="text-white">cp</strong>: لاستنساخ البيانات المهمة قبل التعديل عليها.</li>
                        <li><strong className="text-white">mv</strong>: لنقل الملفات أو إعادة تسميتها لإخفائها.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "المستوى 3: الإدارة (The Admin)",
            icon: <ShieldAlert className="text-red-400" />,
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>القوة العظمى تتطلب حذراً شديداً. هنا ستتعامل مع أدوات قوية يمكنها تدمير البيانات أو كشف أدق الأسرار.</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-400">
                        <li><strong className="text-white">grep</strong>: "إبرة في كومة قش". يبحث عن كلمة محددة داخل آلاف الملفات.</li>
                        <li><strong className="text-white">rm</strong>: الممحاة النهائية. يحذف الملفات بلا رجعة.</li>
                        <li><strong className="text-white">clear</strong>: لتنظيف أثرك وترتيب أفكارك.</li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6 md:p-8 font-cairo">
            <div className="max-w-4xl mx-auto w-full">

                {/* Intro Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">رحلتك لاحتراف سطر الأوامر</h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        ستنتقل عبر ثلاثة مستويات تدريبية، مصممة لتحويلك من مبتدئ إلى مستخدم واثق.
                    </p>
                </motion.div>

                {/* GUI vs CLI Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                        <div className="bg-blue-500/10 p-3 rounded-full text-blue-400 mb-3"><MousePointer2 size={24} /></div>
                        <h3 className="font-bold text-white mb-1">الواجهة الرسومية (GUI)</h3>
                        <p className="text-xs text-slate-400">سهلة ولكنها محدودة وبطيئة للمحترفين.</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#7112AF]/30 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#7112AF] blur-[40px] opacity-20"></div>
                        <div className="bg-[#7112AF]/10 p-3 rounded-full text-[#7112AF] mb-3"><Terminal size={24} /></div>
                        <h3 className="font-bold text-white mb-1">سطر الأوامر (CLI)</h3>
                        <p className="text-xs text-slate-400">قوة مطلقة، سرعة، وتحكم كامل.</p>
                    </div>
                </div>

                {/* Accordion Learning Path */}
                <div className="space-y-4 mb-12">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="bg-[#151515] border border-white/5 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setActiveSection(activeSection === index ? -1 : index)}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-black/30 rounded-lg">{section.icon}</div>
                                    <div className="text-right">
                                        <h3 className="font-bold text-white text-lg">{section.title}</h3>
                                    </div>
                                </div>
                                {activeSection === index ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
                            </button>
                            <AnimatePresence>
                                {activeSection === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-0 border-t border-white/5 bg-black/20">
                                            {section.content}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <button
                        onClick={onNext}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#7112AF] hover:bg-[#5a0e8c] text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(113,18,175,0.4)] hover:shadow-[0_0_30px_rgba(113,18,175,0.6)] hover:-translate-y-1"
                    >
                        <span>ابدأ المحاكاة الآن</span>
                        <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

