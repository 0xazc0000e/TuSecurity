import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CtaSection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-[#7112AF] to-[#5a0d8e] rounded-[3rem] p-12 relative overflow-hidden shadow-[0_0_50px_rgba(113,18,175,0.4)]"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                            الأمن السيبراني يبدأ بخطوة
                        </h2>
                        <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            هل أنت مستعد لتغيير طريقة تفكيرك؟ انضم لأكثر من 500 عضو وابدأ رحلتك في عالم الدفاع الرقمي اليوم.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-8 py-4 bg-white text-[#7112AF] rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl"
                            >
                                <UserPlus size={20} />
                                انضم للنادي الآن
                            </button>
                            <button
                                onClick={() => navigate('/simulators')}
                                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-colors flex items-center gap-2"
                            >
                                جرب المحاكيات مجاناً
                            </button>
                        </div>
                    </div>
                </motion.div>

                <p className="mt-8 text-slate-500 text-sm">
                    © 2025 نادي الأمن السيبراني - جامعة الطائف. جميع الحقوق محفوظة.
                </p>
            </div>
        </section>
    );
};
