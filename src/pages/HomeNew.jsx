import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Shield, BookOpen, Zap, Globe, Brain, Eye, Lock, Crown, Sword, Radio, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { MatrixBackground } from '../components/ui/MatrixBackground';
import { TypewriterText } from '../components/ui/TypewriterText';
import { GlassTerminal } from '../components/ui/GlassTerminal';

import { SpotlightCard } from '../components/ui/SpotlightCard';
import { StatCounter } from '../components/ui/StatCounter';

import { WhyDifferentSection } from '../components/home/WhyDifferentSection';
import { SimulatorsPreviewSection } from '../components/home/SimulatorsPreviewSection';
import { AttackScenariosPreviewSection } from '../components/home/AttackScenariosPreviewSection';
import { LearningMethodologySection } from '../components/home/LearningMethodologySection';
import { KnowledgeHubSection } from '../components/home/KnowledgeHubSection';
import { AboutClubSection } from '../components/home/AboutClubSection';
import { CtaSection } from '../components/home/CtaSection';

// ... (imports)
import { apiCall } from '../context/AuthContext'; // Import apiCall

export default function Home() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        lessons: 0,
        hours: 0,
        passRate: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiCall('/dashboard/stats'); // Use apiCall for base URL handling
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <>
            <MatrixBackground />

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#240993] rounded-full blur-[120px] opacity-20 mix-blend-screen animate-pulse duration-[5s]" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#7112AF] rounded-full blur-[120px] opacity-10 mix-blend-screen" />
            </div>

            {/* Hero */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-12 overflow-hidden">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="text-center lg:text-right order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7112AF]/10 text-[#d4b3ff] border border-[#7112AF]/30 text-xs font-bold mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(113,18,175,0.2)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7112AF] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7112AF]"></span>
                            </span>
                            <TypewriterText text="البيئة التعليمية الآمنة..." />
                        </div>
                        <h1 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-8 leading-[1.6]">
                            التدريب السيبراني <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#7112AF] via-[#b66dff] to-[#7112AF] bg-[200%_auto] animate-gradient">الإدراكي</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#bbb6d1] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                            ليس مجرد كتابة أوامر. نحن نعلمك كيف تفكر الأنظمة، كيف تفشل، وكيف تحميها. بيئة محاكاة آمنة لبناء نماذج ذهنية صحيحة.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button onClick={() => navigate('/simulators')} className="px-8 py-4 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white hover:shadow-[0_0_30px_rgba(113,18,175,0.5)] rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:scale-105">
                                ابدأ التدريب الآن <Target size={20} />
                            </button>
                            <button onClick={() => navigate('/about')} className="px-8 py-4 bg-white/5 text-white border border-white/20 hover:bg-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                من نحن <ArrowLeft size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
                        <GlassTerminal />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <SpotlightCard>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-[#7112AF] mb-2">
                                    <StatCounter end={3} suffix="+" />
                                </div>
                                <div className="text-gray-400 text-sm">محاكيات متقدمة</div>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-[#ff006e] mb-2">
                                    <StatCounter end={stats.lessons} suffix="+" />
                                </div>
                                <div className="text-gray-400 text-sm">درس تدريبي</div>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-green-400 mb-2">
                                    <StatCounter end={stats.hours} suffix="+" />
                                </div>
                                <div className="text-gray-400 text-sm">ساعة تدريب</div>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-yellow-400 mb-2">
                                    <StatCounter end={stats.passRate} suffix="%" />
                                </div>
                                <div className="text-gray-400 text-sm">معدل التعليم</div>
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            لماذا نحن <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7112AF] to-[#ff006e]">مختلفون</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            نحن لا نعلم فقط الأوامر، نحن نبني عقولاً قادرة على التفكير الأمني الحقيقي
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="group relative bg-gradient-to-br from-[#7112AF]/10 to-[#ff006e]/10 border border-[#7112AF]/30 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(113,18,175,0.3)] transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7112AF]/20 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#7112AF] to-[#ff006e] rounded-xl flex items-center justify-center mb-6">
                                    <Brain className="text-white" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">التفكير الأمني</h3>
                                <p className="text-gray-400">
                                    نعلمك كيف يفكر المهاجمون والمدافعون، ليس فقط كيف تستخدم الأدوات
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="group relative bg-gradient-to-br from-[#ff006e]/10 to-[#7112AF]/10 border border-[#ff006e]/30 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(255,0,110,0.3)] transition-all duration-300"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-[#ff006e]/20 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#ff006e] to-[#7112AF] rounded-xl flex items-center justify-center mb-6">
                                    <Radio className="text-white" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">سيناريوهات واقعية</h3>
                                <p className="text-gray-400">
                                    محاكاة هجمات حقيقية مع عواقب حقيقية وقرارات أخلاقية صعبة
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="group relative bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all duration-300"
                        >
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                                    <Shield className="text-white" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">بيئة آمنة</h3>
                                <p className="text-gray-400">
                                    تدرب بدون مخاطر. كل خطأ هنا هو فرصة للتعلم، ليس جريمة حقيقية
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="group relative bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] transition-all duration-300"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                                    <Crown className="text-white" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">المستوى المتقدم</h3>
                                <p className="text-gray-400">
                                    اكتشاف أسرار وحل ألغاز للوصول إلى مستوى الخبير في الأمن السيبراني
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-300"
                        >
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                                    <Eye className="text-white" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">المراقبة والتحليل</h3>
                                <p className="text-gray-400">
                                    تعلم كيف تراقب الأنظمة وتحلل السجلات وتكتشف التهديدات
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="group relative bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                                    <Lock className="text-white" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">الحماية الشاملة</h3>
                                <p className="text-gray-400">
                                    من الشبكات إلى التطبيقات، تعلم كيف تحمي كل طبقة في البنية التحتية
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative overflow-hidden rounded-3xl border border-[#7112AF]/30 bg-gradient-to-br from-[#7112AF]/10 via-transparent to-[#ff006e]/10 p-12"
                    >
                        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#7112AF] opacity-10 blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#ff006e] opacity-10 blur-[100px] rounded-full" />

                        <div className="relative z-10 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                هل أنت مستعد لتصبح
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7112AF] to-[#ff006e]">
                                    {" "}خبيراً في الأمن السيبراني؟
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                                انضم إلى آلاف الطلاب الذين يتعلمون المهارات الحقيقية التي يحتاجها سوق العمل
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/simulators/bash')}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.5)] transition-all duration-300 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Target size={20} />
                                        ابدأ مع Bash الاحترافي
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff006e] to-[#7112AF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/simulators/attack-simulator')}
                                    className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
                                >
                                    <span className="flex items-center gap-2">
                                        <Sword size={20} />
                                        جرب محاكي الهجمات
                                    </span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Keep existing sections */}
            <SimulatorsPreviewSection />
            <AttackScenariosPreviewSection />
            <LearningMethodologySection />
            <KnowledgeHubSection />
            <AboutClubSection />
            <CtaSection />
        </>
    );
}
