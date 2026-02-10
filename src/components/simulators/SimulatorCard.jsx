import React from 'react';
import { Play, Star, Clock, Trophy, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SimulatorCard({ data, onClick }) {
    const {
        title,
        description,
        xp,
        difficulty = 'Beginner',
        duration = '10m',
        tags = [],
        icon: Icon,
        progress = 0
    } = data;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 font-cairo cursor-pointer"
            onClick={onClick}
        >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="p-6 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        {Icon ? <Icon size={24} className="text-purple-400" /> : <Terminal size={24} className="text-purple-400" />}
                    </div>
                    {/* Difficulty Badge */}
                    <span className={`
                        px-3 py-1 rounded-full text-xs font-bold border
                        ${difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                        ${difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                        ${difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                    `}>
                        {difficulty}
                    </span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                    {description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 rounded text-slate-500 border border-white/5">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Trophy size={14} />
                            <span>{xp} XP</span>
                        </div>
                    </div>

                    <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                        <Play size={14} className="ml-1" />
                    </button>
                </div>

                {/* Progress Bar (if started) */}
                {progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

import { Terminal } from 'lucide-react'; // Fallback icon
