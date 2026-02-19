import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, GraduationCap } from 'lucide-react';

export const AboutClubSection = () => {
    return (
        <section className="py-24 px-6 relative z-10 bg-[#0a051e]/50 border-y border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">

                {/* Text Content */}
                <div className="lg:w-1/2 text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7112AF]/10 text-[#d4b3ff] border border-[#7112AF]/20 text-xs font-bold mb-6">
                        <Shield size={14} />
                        <span>من نحن</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                        نادي الأمن السيبراني <br />
                        <span className="text-slate-400">بجامعة الطائف</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-6">
                        مجتمع طلابي أكاديمي يهدف إلى سد الفجوة بين الدراسة النظرية والممارسة العملية في مجال الأمن السيبراني.
                    </p>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        نسعى لتخريج جيل من الخبراء القادرين على حماية الفضاء السيبراني للمملكة، متسلحين بالمعرفة التقنية والوعي الأمني المتقدم.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#7112AF]">
                                <Users size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-xl">500+</h4>
                                <span className="text-xs text-slate-500">عضو نشط</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#7112AF]">
                                <Award size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-xl">15+</h4>
                                <span className="text-xs text-slate-500">جائزة ومسابقة</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#7112AF]">
                                <GraduationCap size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-xl">20+</h4>
                                <span className="text-xs text-slate-500">دورة معتمدة</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual / Logo Section */}
                <div className="lg:w-1/2 relative flex justify-center items-center">
                    {/* Enhanced Glow Effects */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7112AF] rounded-full blur-[100px] opacity-20 animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#ff006e] rounded-full blur-[80px] opacity-15 mix-blend-screen" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        <div className="relative w-[350px] md:w-[500px] aspect-square flex items-center justify-center">
                            {/* Animated Rings - No Box */}
                            <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_8s_linear_infinite]" />
                            <div className="absolute inset-8 border border-[#7112AF]/20 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                            <div className="absolute inset-16 border border-[#ff006e]/10 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />

                            {/* Logo - Larger and clearer */}
                            <img
                                src="/logos/logo_web.png"
                                alt="TuSecurity Club Logo"
                                className="w-[140%] h-[140%] object-contain drop-shadow-[0_0_60px_rgba(113,18,175,0.5)] relative z-20 scale-110 hover:scale-125 transition-transform duration-700"
                            />

                            {/* Floating Particles/Decorations */}
                            <motion.div
                                animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-12 -right-12 bg-[#050214]/60 backdrop-blur-sm border border-[#7112AF]/30 p-4 rounded-full shadow-[0_0_20px_rgba(113,18,175,0.2)]"
                            >
                                <Shield className="text-[#d4b3ff] w-8 h-8" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [15, -15, 15], rotate: [0, -10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-8 -left-8 bg-[#050214]/60 backdrop-blur-sm border border-[#ff006e]/30 p-4 rounded-full shadow-[0_0_20px_rgba(255,0,110,0.2)]"
                            >
                                <div className="text-white font-bold text-center leading-none">
                                    <span className="block text-[10px] text-gray-400">EST</span>
                                    <span className="text-lg text-[#ff006e]">2024</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};
