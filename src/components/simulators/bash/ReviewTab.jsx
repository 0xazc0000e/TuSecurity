import React, { useState } from 'react';
import { CheckCircle, Award, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export const ReviewTab = () => {
    const [rating] = useState("فهم تشغيلي جيد"); // Static for this version, could be dynamic based on errors

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 font-cairo text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6 shadow-lg shadow-green-500/20"
            >
                <CheckCircle size={48} />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-4"
            >
                أحسنت! أكملت المهمة بنجاح
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-slate-400 max-w-lg mb-8"
            >
                لقد قمت بربط الأوامر النصية بالفعل الحقيقي في النظام. لم يعد سطر الأوامر صندوقاً أسود، بل هو مجرد طريقة أخرى للتحدث مع الكمبيوتر.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#1a1a1a] border border-[#7112AF] rounded-2xl p-6 w-full max-w-md mb-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-full h-1 bg-[#7112AF]"></div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 font-bold">التقييم العام</span>
                    <Award className="text-[#7112AF]" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{rating}</div>
                <div className="text-xs text-slate-500">تمكنت من تنفيذ الأوامر الأساسية لإنشاء الملفات وإدارتها.</div>
            </motion.div>

            {/* Reflection Question */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 rounded-xl p-6 max-w-lg w-full text-right"
            >
                <h3 className="text-sm font-bold text-[#7112AF] mb-2">سؤال للتفكير:</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    برأيك، إذا كنت تريد إنشاء 100 مجلد بأسماء مختلفة، هل سيكون استخدام الماوس أسرع، أم كتابة أمر واحد في الطرفية؟
                </p>
                <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-black/30 rounded text-slate-400 text-xs hover:bg-[#7112AF]/20 hover:text-white transition-colors">الماوس أسرع</button>
                    <button className="flex-1 py-2 bg-black/30 rounded text-slate-400 text-xs hover:bg-[#7112AF]/20 hover:text-white transition-colors">الطرفية أسرع</button>
                </div>
            </motion.div>

            <div className="mt-8">
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm"
                >
                    <RefreshCcw size={14} />
                    <span>إعادة المحاولة</span>
                </button>
            </div>
        </div>
    );
};
