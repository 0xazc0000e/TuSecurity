import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Map, ArrowLeft, Star, Unlock, Shield, Zap, BookOpen, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../../context/AnalyticsContext';

export const PersonalizedPath = () => {
    const navigate = useNavigate();
    const { cognitiveLayers, ethicalTendency, skillGraph } = useAnalytics();

    const nextSteps = useMemo(() => {
        const steps = [];

        // --- 1. Cognitive Gaps (The "Doctor" Logic) ---
        // Gap: Low Operational in OS
        if (cognitiveLayers.os.operational < 30) {
            steps.push({
                id: 'os-op-gap',
                title: 'تدريب عملي: سطر الأوامر',
                type: 'mission',
                desc: 'لديك فهم نظري جيد، لكنك تحتاج لمزيد من الممارسة العملية. جرب محاكي Bash.',
                icon: <Zap size={18} />,
                color: 'text-yellow-400',
                bg: 'bg-yellow-400/10',
                link: '/simulators/bash'
            });
        }
        // Gap: Low Conceptual in Network
        else if (cognitiveLayers.network.conceptual < 30) {
            steps.push({
                id: 'net-con-gap',
                title: 'قراءة: أساسيات الشبكات',
                type: 'reading',
                desc: 'الشبكات هي عصب الأمن السيبراني. اقرأ هذا المقال لتعميق فهمك.',
                icon: <BookOpen size={18} />,
                color: 'text-blue-400',
                bg: 'bg-blue-400/10',
                link: '/articles/network-basics'
            });
        }

        // --- 2. Skill Unlocks (The "Game" Logic) ---
        if (skillGraph.packet_analysis === 'unlocked') {
            steps.push({
                id: 'packet-unlock',
                title: 'مسار جديد: تحليل الحزم',
                type: 'unlock',
                desc: 'أنت جاهز الآن. تعلم كيف تصطاد التهديدات داخل حركة البيانات.',
                icon: <Unlock size={18} />,
                color: 'text-purple-400',
                bg: 'bg-purple-400/10',
                link: '/simulators/wireshark'
            });
        }

        // --- 3. Ethical Balance (The "Mentor" Logic) ---
        if (ethicalTendency.score < -20) {
            steps.push({
                id: 'ethics-alert',
                title: 'تنبيه: التوازن الدفاعي',
                type: 'alert',
                desc: 'تركيزك الهجومي عالٍ. تذكر أن المدافع يحتاج أن ينجح دائماً، والمهاجم مرة واحدة.',
                icon: <Shield size={18} />,
                color: 'text-green-400',
                bg: 'bg-green-400/10',
                link: '/articles/blue-team-mindset'
            });
        }

        // --- 4. Default / Advanced ---
        if (steps.length === 0) {
            steps.push({
                id: 'mastery-ctf',
                title: 'تحدي النخبة',
                type: 'challenge',
                desc: 'مستواك متوازن ومتقدم. حان وقت اختبار مهاراتك في سيناريو واقعي.',
                icon: <Star size={18} />,
                color: 'text-red-400',
                bg: 'bg-red-400/10',
                link: '/attacks'
            });
        }

        return steps.slice(0, 3); // Show max 3 recommendations
    }, [cognitiveLayers, ethicalTendency, skillGraph]);

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                المسار المقترح <Map size={20} className="text-[#7112AF]" />
            </h3>

            <div className="space-y-4 flex-1">
                {nextSteps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="p-4 rounded-xl border border-white/5 bg-[#050214]/50 hover:bg-[#050214] transition-colors group cursor-pointer relative overflow-hidden"
                        onClick={() => navigate(step.link)}
                    >
                        {/* Glow Effect */}
                        <div className={`absolute top-0 right-0 w-1 h-full ${step.bg.replace('/10', '')}`}></div>

                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${step.bg} ${step.color} shrink-0`}>
                                {step.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold mb-1 group-hover:text-[#7112AF] transition-colors text-sm">{step.title}</h4>
                                <p className="text-slate-400 text-xs leading-relaxed mb-3">
                                    {step.desc}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-[#7112AF]">
                                    <span>ابدأ الآن</span>
                                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <p className="mt-4 text-[10px] text-center text-slate-600">
                يتم تحديث التوصيات تلقائيًا بناءً على أدائك في المحاكيات.
            </p>
        </div>
    );
};
