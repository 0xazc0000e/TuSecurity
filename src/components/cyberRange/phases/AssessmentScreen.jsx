import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, AlertCircle, TrendingUp, ChevronRight, Home } from 'lucide-react';

export const AssessmentScreen = ({ role, progress, score, decisions, onRestart }) => {
    return (
        <div className="max-w-4xl mx-auto p-8 animate-fadeIn">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl text-center"
            >
                <div className="w-24 h-24 rounded-full bg-yellow-500/20 border-4 border-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                    <Trophy size={48} className="text-yellow-500" />
                </div>

                <h1 className="text-4xl font-bold text-white mb-2">اكتملت المهمة بنجاح</h1>
                <p className="text-slate-400 mb-10 tracking-wide uppercase text-sm">Post-Incident Review & Assessment</p>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-slate-500 text-xs mb-1 uppercase font-bold">نسبة الإنجاز</div>
                        <div className="text-3xl font-bold text-white">{progress}%</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-slate-500 text-xs mb-1 uppercase font-bold">النقاط المحققة</div>
                        <div className="text-3xl font-bold text-[#7112AF]">{score}</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-slate-500 text-xs mb-1 uppercase font-bold">مستوى الاحترافية</div>
                        <div className="text-lg font-bold text-green-400">{score > 80 ? 'Master' : 'Professional'}</div>
                    </div>
                </div>

                <div className="text-right space-y-6 mb-12">
                    <h3 className="text-xl font-bold text-white flex flex-row-reverse items-center gap-2">
                        <Target className="text-[#7112AF]" size={20} />
                        التحليل المهني لأدائك
                    </h3>

                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                        <div className="flex flex-row-reverse items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <strong>نقاط القوة:</strong> لقد أظهرت سرعة ممتازة في الاستجابة الأولية واستخدام grep لتحديد IP المهاجم بدقة عالية.
                            </p>
                        </div>
                        <div className="flex flex-row-reverse items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <strong>مجال التحسين:</strong> كان قرار عزل النظام متسرعاً بعض الشيء مما تسبب في توقف الخدمة. المحترفون يفضلون الحظر الجزئي (iptables) أولاً.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.href = '/profile'}
                        className="px-8 py-4 bg-[#7112AF] hover:bg-[#5a0e8c] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#7112AF]/20"
                    >
                        عرض في ملفي الشخصي
                        <ChevronRight size={18} />
                    </button>
                    <button
                        onClick={() => window.location.href = '/attacks'}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Home size={18} />
                        العودة للمكتبة
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
