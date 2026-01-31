import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AsciiLogoText } from './AsciiLogoText';


export const GlassTerminal = () => {
    const [typed, setTyped] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setTyped(true), 800);
        return () => clearTimeout(timer);
    }, []);

    const logoASCII = [
        "           .           ",
        "         .d8b.         ",
        "       .d88888b.       ",
        "      .888888888b.     ",
        "      888888888888     ",
        "      888888888888     ",
        "      '8888888888'     ",
        "       '88888888'      ",
        "        '888888'       ",
        "          '88'         "
    ];

    const infoFields = [
        { label: "OS", value: "Cybersecurity Club - Taif University" },
        { label: "Mission", value: "Ethical Offense & Defensive Security" },
        { label: "Motto", value: "\"Exploit Knowledge to Defend Reality\"" },
        { label: "Kernel", value: "Red Team | Blue Team" },
        { label: "Mode", value: "Research & Practice" },
        { label: "Uptime", value: "∞ (Always Learning)" },
        { label: "Shell", value: "zsh 5.9" },
    ];

    return (
        <motion.div
            className="relative z-10 w-full max-w-4xl min-h-[500px] h-auto rounded-xl overflow-hidden border border-white/10 bg-[#0c0c12]/90 backdrop-blur-xl shadow-[0_0_50px_rgba(113,18,175,0.3)] font-mono text-xs md:text-sm flex flex-col"
            initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
                perspective: '1000px',
                boxShadow: '0 25px 50px -12px rgba(113, 18, 175, 0.25), 0 0 30px rgba(113, 18, 175, 0.3)'
            }}
        >
            {/* Terminal Header */}
            <div className="bg-black/40 backdrop-blur-md p-3 flex items-center gap-2 border-b border-white/5 shrink-0">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
                <div className="flex-1 text-center text-[10px] text-slate-500 opacity-70 font-mono">root@tusecurity: ~</div>
            </div>

            {/* Terminal Body */}
            <div dir="ltr" className="p-4 md:p-6 text-slate-300 flex-1 overflow-y-auto overflow-x-hidden relative font-mono text-left custom-scrollbar">
                {/* Visual Effects: Glitch & Scanline */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#7112AF]/30 animate-[scan_3s_linear_infinite] shadow-[0_0_10px_#7112AF] pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7112AF]/5 to-transparent pointer-events-none animate-pulse"></div>

                {/* Command Line */}
                <div className="flex gap-2 mb-4 text-sm relative z-10">
                    <span className="text-green-500 font-bold">root@tusecurity</span>
                    <span className="text-white">:</span>
                    <span className="text-blue-500 font-bold">~</span>
                    <span className="text-white">$</span>
                    <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "auto" }}
                        transition={{ duration: 0.8, ease: "linear" }}
                        className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-slate-500 pr-1 align-bottom"
                    >
                        fastfetch --load-config tucc
                    </motion.span>
                </div>

                {/* Fastfetch Output */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: typed ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 min-h-[300px]" // Container
                >
                    {/* Logo Section (Background Layer) */}
                    <div className="absolute top-0 left-0 z-0 opacity-50 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-[3px] leading-[3px] font-bold text-[#7112AF] select-none"
                        >
                            <AsciiLogoText />
                        </motion.div>
                    </div>

                    {/* Info Section (Foreground Layer) */}
                    <div className="relative z-10 ml-[250px]"> {/* Shift info right to clear logo, or less to overlap */}
                        <div className="mb-4">
                            <span className="text-green-500 font-bold text-lg">root</span>
                            <span className="text-white text-lg">@</span>
                            <span className="text-green-500 font-bold text-lg">tusecurity</span>
                            <div className="h-[1px] w-full bg-slate-700 mt-2"></div>
                        </div>

                        {infoFields.map((field, i) => (
                            <motion.div
                                key={i}
                                className="flex gap-3 text-sm"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 + (i * 0.1) }}
                            >
                                <span className="text-[#7112AF] font-bold min-w-[100px]">{field.label}:</span>
                                <span className="text-slate-300">{field.value}</span>
                            </motion.div>
                        ))}

                        {/* Extra Visual Data */}
                        <motion.div
                            className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs text-slate-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                        >
                            <div>CPU: <span className="text-white">Neural Net v9.0</span></div>
                            <div>MEM: <span className="text-white">64GB / 128GB</span></div>
                            <div className="col-span-2">
                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                                    <div className="h-full bg-gradient-to-r from-[#7112AF] to-blue-500 w-[45%] animate-pulse"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Color Palette visualization */}
                        <motion.div
                            className="flex gap-2 mt-4 pt-2"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.8 }}
                        >
                            <div className="w-8 h-4 bg-black rounded shadow-sm"></div>
                            <div className="w-8 h-4 bg-red-500 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                            <div className="w-8 h-4 bg-green-500 rounded shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            <div className="w-8 h-4 bg-yellow-500 rounded shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                            <div className="w-8 h-4 bg-blue-500 rounded shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <div className="w-8 h-4 bg-[#7112AF] rounded shadow-[0_0_10px_rgba(113,18,175,0.5)]"></div>
                            <div className="w-8 h-4 bg-cyan-500 rounded shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                            <div className="w-8 h-4 bg-white rounded shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
