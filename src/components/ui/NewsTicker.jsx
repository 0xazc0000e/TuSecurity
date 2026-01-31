import React from 'react';
import { motion } from 'framer-motion';

export const NewsTicker = () => (
    <div className="w-full bg-[#7112AF]/10 border-y border-[#7112AF]/20 py-2 overflow-hidden flex whitespace-nowrap">
        <motion.div className="flex gap-12 text-sm font-mono text-[#bbb6d1]" animate={{ x: [window.innerWidth, -1000] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
            <span>🔴 عاجل: اكتشاف ثغرة Zero-Day في أنظمة SSH</span><span>🟢 تم تحديث تحديات CTF الأسبوعية</span><span>🔵 ورشة عمل "الهندسة الاجتماعية" يوم الخميس القادم</span><span>🔴 تنبيه: حملة تصيد جديدة تستهدف الطلاب الجامعيين</span>
        </motion.div>
    </div>
);
