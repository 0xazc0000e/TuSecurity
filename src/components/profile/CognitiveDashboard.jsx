import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Network, Globe, Lock, Search, MessageSquare, Terminal } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const CognitiveDashboard = () => {
    const { cognitiveLayers } = useAnalytics();

    // Map domain IDs to display config
    const domainConfig = {
        os: { name: 'نظم التشغيل', icon: <Terminal size={20} />, color: 'emerald' },
        network: { name: 'أمن الشبكات', icon: <Network size={20} />, color: 'blue' },
        web: { name: 'أمن الويب', icon: <Globe size={20} />, color: 'purple' },
        crypto: { name: 'التشفير', icon: <Lock size={20} />, color: 'yellow' },
    };

    // Helper to get tailwind classes dynamically
    const getColor = (color, opacity = 100) => `text-${color}-${opacity}`;
    const getBg = (color) => `bg-${color}-500/10`;
    const getBorder = (color) => `border-${color}-500/30`;

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#7112AF]/10 rounded-lg text-[#7112AF]">
                    <Brain size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">الخريطة الإدراكية (3D Cognition)</h2>
                    <p className="text-slate-400 text-xs">تمثيل ثلاثي الأبعاد: المفاهيم (خارجي)، التطبيق (وسط)، البصري (داخلي).</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(cognitiveLayers).map(([id, layers]) => {
                    const config = domainConfig[id] || { name: id, icon: <Brain />, color: 'slate' };
                    // Normalize 0-100 to 0-1 scale for opacity/scale
                    const conceptual = layers.conceptual / 100;
                    const operational = layers.operational / 100;
                    const visual = layers.visual / 100;

                    return (
                        <div key={id} className="flex flex-col items-center group cursor-pointer relative">
                            <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                                {/* Layer 1: Conceptual (Outer Ring) */}
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="2" fill="transparent" className={`text-slate-800`} />
                                    <motion.circle
                                        cx="64" cy="64" r="60"
                                        stroke="currentColor" strokeWidth="4"
                                        fill="transparent"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: conceptual }}
                                        className={`text-${config.color}-500 opacity-30`}
                                        strokeLinecap="round"
                                    />
                                </svg>

                                {/* Layer 2: Operational (Middle Ring) */}
                                <svg className="absolute inset-0 w-full h-full -rotate-90 scale-75">
                                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="2" fill="transparent" className={`text-slate-800`} />
                                    <motion.circle
                                        cx="64" cy="64" r="60"
                                        stroke="currentColor" strokeWidth="6"
                                        fill="transparent"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: operational }}
                                        className={`text-${config.color}-500 opacity-60`}
                                        strokeLinecap="round"
                                    />
                                </svg>

                                {/* Layer 3: Visual (Inner Ring/Fill) */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 0.5 + (visual * 0.5) }} // Min size 0.5
                                    className={`absolute inset-0 m-auto w-16 h-16 rounded-full bg-${config.color}-500 blur-xl opacity-20`}
                                />

                                {/* Icon */}
                                <div className={`z-10 text-white relative`}>
                                    {config.icon}
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-white mb-1">{config.name}</h3>
                            <div className="flex gap-2 text-[10px] font-mono text-slate-500">
                                <span title="مفاهيمي">C:{layers.conceptual}%</span>
                                <span title="تشغيلي">O:{layers.operational}%</span>
                                <span title="بصري">V:{layers.visual}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500 flex justify-center gap-6">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full border border-slate-500"></div> الفهم المفاهيمي</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full border-2 border-slate-500"></div> الفهم التشغيلي</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-500/50 blur-[2px]"></div> الذاكرة البصرية</div>
            </div>
        </div>
    );
};
