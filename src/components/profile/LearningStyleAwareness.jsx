import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Hammer, BookOpen, Sparkles } from 'lucide-react';

export const LearningStyleAwareness = () => {
    // Mock inferred data
    const styles = [
        { id: 'visual', label: 'بصري', score: 80, icon: <Eye size={16} />, color: 'bg-purple-500', text: 'text-purple-400' },
        { id: 'practical', label: 'تطبيقي', score: 65, icon: <Hammer size={16} />, color: 'bg-blue-500', text: 'text-blue-400' },
        { id: 'theoretical', label: 'نظري', score: 40, icon: <BookOpen size={16} />, color: 'bg-green-500', text: 'text-green-400' }
    ];

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                نمط التعلم <Sparkles size={20} className="text-[#7112AF]" />
            </h3>

            <div className="space-y-6">
                {styles.map((style, index) => (
                    <div key={style.id}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                {style.icon}
                                <span>{style.label}</span>
                            </div>
                            <span className={`text-xs font-bold ${style.text}`}>{style.score}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${style.score}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                                className={`h-full ${style.color}`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 leading-relaxed text-center">
                    يبدو أنك تفضل <span className="text-white font-bold">التعلم البصري</span>.
                    نقترح عليك التركيز على الخرائط الذهنية والمحاكيات الرسومية لتعزيز فهمك.
                </p>
            </div>
        </div>
    );
};
