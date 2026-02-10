import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CryptoBoard } from '../components/simulators/crypto/CryptoBoard';
import { useAnalytics } from '../context/AnalyticsContext';
import { MatrixBackground } from '../components/ui/MatrixBackground';

export default function CryptoSimulator() {
    const navigate = useNavigate();
    const { logEvent } = useAnalytics();
    const [solvedCount, setSolvedCount] = useState(0);
    const [lastSolved, setLastSolved] = useState(null);

    const handleSolve = (challenge) => {
        setSolvedCount(prev => prev + 1);
        setLastSolved(challenge);
        logEvent('CRYPTO_CHALLENGE_SOLVED', { algo: challenge.algo });

        // Auto-hide success message after 3s
        setTimeout(() => setLastSolved(null), 3000);
    };

    return (
        <div className="min-h-screen bg-[#02010a] text-white pt-24 px-6 relative overflow-hidden flex flex-col" dir="ltr">
            <MatrixBackground />

            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col mb-12">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <button onClick={() => navigate('/simulators')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-2 transition-colors text-sm">
                            <ArrowLeft size={16} /> Exit Lab
                        </button>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <Lock size={28} className="text-[#7112AF]" />
                            Cryptography Lab <span className="text-xs bg-[#7112AF]/20 text-[#d4b3ff] px-2 py-1 rounded border border-[#7112AF]/30">v0.9 Beta</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="block text-xs text-slate-500 uppercase tracking-wider">Challenges Solved</span>
                            <span className="block text-2xl font-mono font-bold text-white">{solvedCount}</span>
                        </div>
                    </div>
                </header>

                {/* Main Workspace */}
                <div className="flex-1 bg-[#0f0f16]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                    <AnimatePresence>
                        {lastSolved && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl"
                            >
                                <div className="bg-[#0f0f16] border border-green-500/30 p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={40} className="text-green-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Challenge Solved!</h2>
                                    <p className="text-slate-400 mb-6">+10 Crypto XP</p>
                                    <button onClick={() => setLastSolved(null)} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors">
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <CryptoBoard onSolve={handleSolve} />
                </div>
            </div>
        </div>
    );
}
