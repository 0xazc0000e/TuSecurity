import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#05050f]" dir="rtl">
            <MatrixBackground />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 text-center max-w-md"
            >
                <div className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7112AF] to-[#ff006e] leading-none mb-4">
                    404
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">الصفحة غير موجودة</h2>
                <p className="text-slate-400 mb-8">
                    عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(113,18,175,0.5)] transition-all"
                >
                    <Home size={20} />
                    العودة للرئيسية
                </button>
            </motion.div>
        </div>
    );
}
