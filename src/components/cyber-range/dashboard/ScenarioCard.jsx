import React from 'react';
import { Play, BookOpen, Star, Clock, Trophy } from 'lucide-react';

const LEVEL_STARS = {
    beginner: 1,
    intermediate: 2,
    advanced: 3
};

const LEVEL_COLORS = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-red-400'
};

const DOMAIN_LABELS = {
    networking: 'الشبكات',
    os: 'أنظمة التشغيل',
    defense: 'الدفاع السيبراني',
    pentesting: 'اختبار الاختراق',
    crypto: 'التشفير',
    social: 'الهندسة الاجتماعية'
};

export default function ScenarioCard({ data, onClick }) {
    const isSim = data.type === 'simulator';
    const stars = LEVEL_STARS[data.level] || 1;

    return (
        <div
            onClick={onClick}
            className="group relative bg-[#0f1115] border border-white/5 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full font-cairo"
            dir="rtl"
        >
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 via-transparent to-blue-900/0 group-hover:from-purple-900/10 group-hover:to-blue-900/10 transition-all duration-500"></div>

            {/* Top Badge Section */}
            <div className="p-5 flex items-start justify-between relative z-10">
                <div className={`p-2 rounded-lg ${isSim ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {isSim ? <Play size={24} /> : <BookOpen size={24} />}
                </div>
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={`${i < stars ? LEVEL_COLORS[data.level] : 'text-gray-800'} ${i < stars ? 'fill-current' : ''}`}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-5 pb-4 flex-grow relative z-10">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    {DOMAIN_LABELS[data.domain] || data.domain}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors leading-tight">
                    {data.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                    {data.description}
                </p>
            </div>

            {/* Footer / Stats */}
            <div className="mt-auto px-5 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between relative z-10">
                {/* Progress Bar */}
                <div className="flex items-center gap-3 w-1/2">
                    <div className="flex-grow h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                            style={{ width: `${data.progress}%` }}
                        ></div>
                    </div>
                    <span className="text-xs font-mono text-gray-400">{data.progress}%</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-yellow-500/80 font-bold bg-yellow-900/10 px-2 py-1 rounded border border-yellow-500/10">
                    <Trophy size={12} />
                    {data.xp} XP
                </div>
            </div>
        </div>
    );
}
