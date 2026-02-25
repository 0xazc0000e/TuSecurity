import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, GraduationCap } from 'lucide-react';

export const AboutClubSection = () => {
    return (
        <section className="py-24 px-6 relative z-10 bg-[#050214] border-y border-white/5 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[#7112AF] rounded-full blur-[150px] opacity-20 animate-pulse" />
                <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-[#ff006e] rounded-full blur-[120px] opacity-15" />
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">

                {/* Text Content */}
                <div className="lg:w-1/2 text-right">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7112AF]/10 text-[#d4b3ff] border border-[#7112AF]/30 text-sm font-bold mb-8 backdrop-blur-md"
                    >
                        <Shield size={16} />
                        <span>من نحن</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight"
                    >
                        نادي الأمن السيبراني <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4b3ff] to-[#ff006e]">
                            بجامعة الطائف
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-300 text-lg md:text-xl leading-relaxed mb-6 font-medium"
                    >
                        مجتمع طلابي أكاديمي يهدف إلى سد الفجوة بين الدراسة النظرية والممارسة العملية في مجال الأمن السيبراني.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-400 text-base md:text-lg leading-relaxed mb-10"
                    >
                        نسعى لتخريج جيل من الخبراء القادرين على حماية الفضاء السيبراني للمملكة، متسلحين بالمعرفة التقنية والوعي الأمني المتقدم.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                    >
                        <div className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                <Users size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-extrabold text-2xl tracking-wider">+500</h4>
                                <span className="text-sm text-slate-400 font-medium">عضو نشط</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                <Award size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-extrabold text-2xl tracking-wider">+15</h4>
                                <span className="text-sm text-slate-400 font-medium">حالة ومسابقة</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-400 shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-extrabold text-2xl tracking-wider">+20</h4>
                                <span className="text-sm text-slate-400 font-medium">دورة معتمدة</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Visual / Logo Section */}
                <div className="lg:w-1/2 relative flex justify-center items-center mt-12 lg:mt-0">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-md flex justify-center items-center"
                        style={{ perspective: "1000px" }}
                    >
                        {/* Dynamic backdrop for the logo to hide rough edges if present, while looking elegant */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#7112AF]/20 to-transparent rounded-full blur-3xl" />

                        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                            {/* Futuristic Rings */}
                            <div className="absolute inset-0 border-2 border-[#7112AF]/30 rounded-full animate-[spin_10s_linear_infinite] shadow-[0_0_30px_rgba(113,18,175,0.2)]" />
                            <div className="absolute inset-4 border border-[#ff006e]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                            <div className="absolute inset-10 border border-[#4361ee]/20 rounded-full animate-[pulse_4s_ease-in-out_infinite]" />

                            {/* The Logo */}
                            <motion.img
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                                src="/logos/TuSecurity_logo_5.png"
                                alt="TuSecurity Club Logo"
                                className="w-[85%] h-[85%] object-contain drop-shadow-[0_0_40px_rgba(113,18,175,0.8)] relative z-20"
                                style={{ mixBlendMode: 'plus-lighter' }}
                            />
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-4 -right-4 bg-gradient-to-br from-[#050214] to-[#1a0b3c] border border-[#7112AF]/40 p-4 rounded-xl shadow-[0_10_30px_rgba(113,18,175,0.4)] backdrop-blur-xl"
                        >
                            <Shield className="text-[#d4b3ff] w-8 h-8" />
                        </motion.div>

                        <motion.div
                            animate={{ y: [15, -15, 15], rotate: [0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-6 -left-6 bg-gradient-to-br from-[#050214] to-[#3a0018] border border-[#ff006e]/40 py-3 px-5 rounded-xl shadow-[0_10_30px_rgba(255,0,110,0.4)] backdrop-blur-xl"
                        >
                            <div className="text-center font-black">
                                <span className="block text-[10px] text-pink-300/70 tracking-widest mb-1">تأسس</span>
                                <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] to-[#ff6b6b]">2024</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};
