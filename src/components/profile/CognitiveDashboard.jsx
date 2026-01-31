import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Network, Globe, Lock, Search, MessageSquare, Terminal } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const CognitiveDashboard = () => {
    const { skills } = useAnalytics();

    // Calculate OS Mastery based on simulator skills
    const osMastery = Math.round((skills.filesystem + skills.manipulation + skills.admin + skills.terminal) / 4);
    const osDepth = osMastery > 80 ? 4 : osMastery > 50 ? 3 : osMastery > 20 ? 2 : 1;

    const domains = [
        { id: 'os', name: 'نظم التشغيل', icon: <Terminal size={20} />, depth: osDepth, maxDepth: 4, color: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/10' },
        { id: 'network', name: 'أمن الشبكات', icon: <Network size={20} />, depth: 3, maxDepth: 4, color: 'text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-400/10' },
        { id: 'web', name: 'أمن الويب', icon: <Globe size={20} />, depth: 2, maxDepth: 4, color: 'text-purple-400', border: 'border-purple-400/30', bg: 'bg-purple-400/10' },
        { id: 'crypto', name: 'التشفير', icon: <Lock size={20} />, depth: 1, maxDepth: 4, color: 'text-yellow-400', border: 'border-yellow-400/30', bg: 'bg-yellow-400/10' },
        { id: 'forensics', name: 'التحقيق الجنائي', icon: <Search size={20} />, depth: 2, maxDepth: 4, color: 'text-green-400', border: 'border-green-400/30', bg: 'bg-green-400/10' },
        { id: 'social', name: 'الهندسة الاجتماعية', icon: <MessageSquare size={20} />, depth: 4, maxDepth: 4, color: 'text-red-400', border: 'border-red-400/30', bg: 'bg-red-400/10' },
    ];

    const getDepthLabel = (level) => {
        switch (level) {
            case 1: return 'استكشاف';
            case 2: return 'تأسيس';
            case 3: return 'تطبيق';
            case 4: return 'تعمق';
            default: return 'بداية';
        }
    };

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#7112AF]/10 rounded-lg text-[#7112AF]">
                    <Brain size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">الخريطة الإدراكية</h2>
                    <p className="text-slate-400 text-xs">عمق فهمك للمفاهيم الأساسية، وليس مجرد إكمال مهام.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {domains.map((domain, index) => (
                    <div key={domain.id} className="flex flex-col items-center group cursor-pointer">
                        <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                            {/* Concentric Circles representing Depth */}
                            {[...Array(domain.maxDepth)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: (i + 1) / domain.maxDepth,
                                        opacity: i < domain.depth ? 1 : 0.1
                                    }}
                                    transition={{ duration: 0.8, delay: index * 0.1 + i * 0.1 }}
                                    className={`absolute inset-0 rounded-full border ${domain.border} ${i < domain.depth ? domain.bg : ''}`}
                                />
                            ))}

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.5 }}
                                className={`text-white z-10 ${domain.color}`}
                            >
                                {domain.icon}
                            </motion.div>
                        </div>

                        <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#7112AF] transition-colors">{domain.name}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 ${domain.color} border border-white/5`}>
                            {getDepthLabel(domain.depth)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Legend / Insight */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
                    "أنت تظهر فهماً عميقاً في <span className="text-red-400">الهندسة الاجتماعية</span> و <span className="text-blue-400">أمن الشبكات</span>.
                    حاول تعزيز معرفتك في <span className="text-yellow-400">التشفير</span> لبناء صورة أمنية متكاملة."
                </p>
            </div>
        </div>
    );
};
