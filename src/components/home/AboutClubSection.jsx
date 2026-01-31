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

                {/* Visual / Image Placeholder */}
                <div className="lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#7112AF]/20 to-transparent rounded-3xl blur-2xl" />
                    <div className="relative border border-white/10 bg-[#050214] p-8 rounded-3xl overflow-hidden aspect-video flex items-center justify-center group">
                        {/* Abstract Visual Representation of "Identity" */}
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 border-2 border-[#7112AF] rounded-full animate-ping opacity-20" />
                            <div className="absolute inset-2 border-2 border-[#7112AF] rounded-full animate-spin duration-[10s]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Shield size={48} className="text-white drop-shadow-[0_0_15px_rgba(113,18,175,0.5)]" />
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#050214] to-transparent">
                            <p className="text-center text-slate-300 font-mono text-xs">
                                EST. 2024 - TAIF UNIVERSITY
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
