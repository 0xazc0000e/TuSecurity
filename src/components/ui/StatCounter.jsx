import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export const StatCounter = ({ label, value }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000;
            const stepTime = Math.abs(Math.floor(duration / value));
            const timer = setInterval(() => { start += 1; setCount(start); if (start === value) clearInterval(timer); }, stepTime);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);
    return (
        <div ref={ref} className="text-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-[#7112AF]/30 transition-all">
            <div className="text-4xl font-black text-white mb-2">{count}+</div>
            <div className="text-sm text-[#bbb6d1]">{label}</div>
        </div>
    );
};
