import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Lightbulb, HelpCircle, ChevronLeft } from 'lucide-react';

export const MentorPanel = ({ task, chapter, role }) => {
    if (!task) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-[#7112AF]/10 border border-[#7112AF]/20 rounded-2xl"
        >
            <div className="flex items-center gap-3 mb-4 text-[#7112AF]">
                <div className="p-2 bg-[#7112AF]/20 rounded-lg">
                    <UserCheck size={18} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold">توجيه احترافي</span>
                    <span className="text-sm font-bold text-white">المرشد السيبراني</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <Lightbulb size={14} />
                        <span className="text-xs font-bold">منطق التفكير</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                        {task.mentorLogic?.ar || "في هذه المرحلة، يجب التركيز على فهم أثر كل أداة قبل استخدامها. المحترف لا يطلق النار بشكل عشوائي."}
                    </p>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-yellow-500">
                        <HelpCircle size={14} />
                        <span className="text-xs font-bold">سؤال توجيهي</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        {task.mentorQuestion?.ar || "ما هو الدليل الذي يجعلك تثق في IP الذي اخترته كهدف؟"}
                    </p>
                </div>
            </div>

            <button className="w-full mt-4 py-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1 group">
                عرض النصائح المتقدمة
                <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
};
