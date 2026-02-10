import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sword, RefreshCcw } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const EthicalIndicator = () => {
    const { ethicalTendency } = useAnalytics();
    const balanceScore = ethicalTendency?.score || 0;

    // Helper for message
    const getMessage = () => {
        if (balanceScore > 30) return 'ميلك هذا الأسبوع دفاعي قوي. أنت تبني الحصون.';
        if (balanceScore < -30) return 'ميلك هذا الأسبوع هجومي. تذكر، القوة تتطلب مسؤولية.';
        return 'أنت متوازن هذا الأسبوع. تجمع بين فهم الهجوم وإستراتيجيات الدفاع.';
    };

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                المؤشر الأخلاقي (Weekly Tendency) <RefreshCcw size={20} className="text-[#7112AF]" />
            </h3>

            <div className="relative pt-6 pb-2">
                {/* Balance Bar Background */}
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex relative">
                    <div className="w-1/2 h-full bg-gradient-to-r from-red-500/20 to-red-500/50" />
                    <div className="w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-blue-500/50" />

                    {/* Center Marker */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 -translate-x-1/2" />
                </div>

                {/* Indicator Thumb */}
                <motion.div
                    initial={{ left: '50%' }}
                    animate={{ left: `${50 + (balanceScore / 2)}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="absolute top-4 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-[#050214] bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center z-10"
                >
                    <div className={`w-2 h-2 rounded-full ${balanceScore >= 0 ? 'bg-blue-500' : 'bg-red-500'}`} />
                </motion.div>

                {/* Labels */}
                <div className="flex justify-between mt-4 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2 text-red-400">
                        <Sword size={14} /> الهجوم
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                        الدفاع <Shield size={14} />
                    </div>
                </div>
            </div>

            <div className={`mt-8 p-4 rounded-xl border border-white/5 ${balanceScore >= 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <p className="text-sm leading-relaxed text-slate-300">
                    <span className="font-bold block mb-1 text-white">
                        {balanceScore >= 0 ? 'عقلية الحامي (Guardian Mindset)' : 'عقلية المهاجم (Hunter Mindset)'}
                    </span>
                    {getMessage()}
                </p>
            </div>
        </div>
    );
};
