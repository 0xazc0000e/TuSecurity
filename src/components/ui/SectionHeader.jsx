import React from 'react';
import { motion } from 'framer-motion';

export const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-16 md:mb-24 relative z-10 text-right">
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-4 justify-start">
            <div className="w-8 h-[2px] bg-gradient-to-l from-[#7112AF] to-[#240993]" />
            <span className="text-[#bbb6d1] font-mono text-xs uppercase tracking-[0.1em] shadow-purple-glow animate-pulse">نادي الأمن السيبراني // {title}</span>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-lg relative inline-block">
            {subtitle}
            <span className="absolute top-0 left-0 -ml-1 text-[#7112AF] opacity-50 animate-pulse" style={{ clipPath: 'inset(40% 0 61% 0)' }}>{subtitle}</span>
            <span className="absolute top-0 left-0 ml-1 text-cyan-500 opacity-50 animate-pulse" style={{ clipPath: 'inset(10% 0 80% 0)' }}>{subtitle}</span>
        </motion.h2>
    </div>
);
