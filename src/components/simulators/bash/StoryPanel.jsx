import React from 'react';
import { Sparkles, Book, Target, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function StoryPanel({ story, isVisible = true }) {
    if (!story || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-b from-amber-500 /10 to - transparent border border - amber - 500 / 20 rounded - xl p - 5 mb - 6"
            >
                {/* Story Context */}
                {
                    story.context && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                                <Book size={16} />
                                <span>السياق</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {story.context}
                            </p>
                        </div>
                    )
                }

                {/* Story Intro */}
                {
                    story.intro && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
                                <Sparkles size={16} />
                                <span>المقدمة</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed italic">
                                "{story.intro}"
                            </p>
                        </div>
                    )
                }

                {/* Story Goal */}
                {
                    story.goal && (
                        <div>
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                                <Target size={16} />
                                <span>الهدف</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed font-bold">
                                {story.goal}
                            </p>
                        </div>
                    )
                }

                {/* Dialogue (for stage stories) */}
                {
                    story.length > 0 && typeof story[0] === 'object' && story[0].speaker && (
                        <div className="space-y-3 mt-4">
                            {story.map((dialogue, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="bg-black/20 rounded-lg p-3 border border-white/5"
                                >
                                    <div className="flex items-start gap-3">
                                        <MessageCircle size={16} className="text-purple-400 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-bold text-amber-300 text-xs mb-1">
                                                {dialogue.speaker}
                                            </div>
                                            <div className="text-sm text-slate-300">
                                                {dialogue.text}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )
                }
            </motion.div >
        </AnimatePresence >
    );
}
