import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Shield, BookOpen } from 'lucide-react';
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

export default function Home() {
    const navigate = useNavigate();

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
                        <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[1.2]">
                            التدريب السيبراني <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#7112AF] via-[#b66dff] to-[#7112AF] bg-[200%_auto] animate-gradient">الإدراكي</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#bbb6d1] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                            ليس مجرد كتابة أوامر. نحن نعلمك كيف تفكر الأنظمة، كيف تفشل، وكيف تحميها. بيئة محاكاة آمنة لبناء نماذج ذهنية صحيحة.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button onClick={() => navigate('/simulators')} className="px-8 py-4 bg-white text-[#050214] hover:bg-[#d4b3ff] rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105">
                                تصفح المحاكيات <ArrowLeft size={18} />
                            </button>
                            <button onClick={() => navigate('/about')} className="px-8 py-4 bg-[#white]/5 text-white border border-white/20 hover:bg-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                تعرف علينا
                            </button>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
                        <GlassTerminal />
                    </div>
                </div>
            </section>



            <WhyDifferentSection />
            <SimulatorsPreviewSection />
            <AttackScenariosPreviewSection />
            <LearningMethodologySection />
            <KnowledgeHubSection />
            <AboutClubSection />
            <CtaSection />
        </>
    );
}
