import React from 'react';
import { motion } from 'framer-motion';
import { User, Hash, Briefcase, PlusCircle } from 'lucide-react';

export const IdentitySection = () => {
    return (
        <div className="bg-[#0f0f16]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 text-right md:text-right relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#7112AF]/10 to-transparent opacity-50 pointer-events-none" />

            <div className="w-32 h-32 rounded-full border-4 border-[#7112AF] bg-[#050214] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(113,18,175,0.3)]">
                <User size={64} className="text-[#7112AF]" />
                <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-[#050214]" />
            </div>

            <div className="flex-1 relative z-10 w-full text-center md:text-right">
                <h1 className="text-3xl font-bold text-white mb-2">الطالب الجامعي</h1>
                <p className="text-slate-400 font-mono mb-6 text-sm">s44123456@students.tu.edu.sa</p>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    {/* Focus Area */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#7112AF]/20 border border-[#7112AF]/30 rounded-xl">
                        <Briefcase size={16} className="text-[#d4b3ff]" />
                        <div>
                            <span className="block text-[10px] text-[#d4b3ff]/70 font-bold uppercase">المجال المفضل</span>
                            <span className="text-[#d4b3ff] text-sm font-bold">Blue Teaming & Defense</span>
                        </div>
                    </div>

                    {/* Academic ID */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <Hash size={16} className="text-slate-400" />
                        <div>
                            <span className="block text-[10px] text-slate-500 font-bold uppercase">الرقم الجامعي</span>
                            <span className="text-slate-300 text-sm font-mono">44123456</span>
                        </div>
                    </div>

                    {/* Add Interest Button */}
                    <button className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-white transition-colors text-xs font-bold border border-dashed border-slate-600 hover:border-white rounded-xl">
                        <PlusCircle size={14} />
                        <span>تحديث الاهتمامات</span>
                    </button>
                </div>
            </div>

            {/* Quote / Motto */}
            <div className="hidden lg:block relative z-10 max-w-xs text-left opacity-60">
                <p className="text-xs font-serif italic text-slate-400 leading-relaxed">
                    "الأمن السيبراني ليس وجهة، بل هو رحلة مستمرة من التعلم والتكيف."
                </p>
            </div>
        </div>
    );
};
