import React from 'react';
import { Lock, CheckCircle, Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const LevelCard = ({ level, isUnlocked, isCurrent, isCompleted, progress, onClick }) => {
    const getLevelColor = () => {
        switch (level.color) {
            case 'green': return 'from-emerald-500 to-green-600';
            case 'blue': return 'from-blue-500 to-cyan-600';
            case 'purple': return 'from-purple-500 to-pink-600';
            case 'orange': return 'from-orange-500 to-amber-600';
            case 'red': return 'from-red-500 to-rose-600';
            default: return 'from-slate-500 to-gray-600';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: level.level * 0.1 }}
            onClick={isUnlocked ? onClick : null}
            className={`
                relative overflow-hidden rounded-xl border transition-all duration-300
                ${isUnlocked ? 'cursor-pointer hover:-translate-y-1' : 'opacity-50 cursor-not-allowed'}
                ${isCurrent ? 'border-purple-500 shadow-lg shadow-purple-500/50' : 'border-white/10'}
                ${!isUnlocked ? 'grayscale' : ''}
            `}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getLevelColor()} opacity-10`} />

            {/* Lock Overlay */}
            {!isUnlocked && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <Lock size={32} className="text-slate-400" />
                </div>
            )}

            {/* Content */}
            <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="text-xs font-mono text-slate-500 mb-1">
                            المستوى {level.level}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                            {level.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                            {level.subtitle}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                        {isCompleted && (
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <CheckCircle size={20} className="text-emerald-400" />
                            </div>
                        )}
                        {isCurrent && !isCompleted && (
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Star size={20} className="text-purple-400" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                {isUnlocked && (
                    <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span>التقدم</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${getLevelColor()} transition-all duration-500`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* XP Info */}
                <div className="flex items-center gap-2 text-xs">
                    <Trophy size={14} className="text-yellow-500" />
                    <span className="text-slate-400">
                        {level.rewardXP} XP
                    </span>
                </div>
            </div>

            {/* Current Indicator */}
            {isCurrent && (
                <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10">
                    <div className="absolute inset-0 bg-purple-500 rotate-45"></div>
                    <Star size={16} className="absolute top-8 right-8 text-white" />
                </div>
            )}
        </motion.div>
    );
};

export default function LevelSelector({
    levels,
    currentLevelId,
    completedLevels = [],
    unlockedLevels = [],
    levelProgress = {},
    onSelectLevel
}) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        مسار التعلم
                    </h2>
                    <p className="text-sm text-slate-400">
                        اختر مستوى للبدء
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold text-purple-400">
                        {completedLevels.length} / {levels.length}
                    </div>
                    <div className="text-xs text-slate-400">
                        مستويات مكتملة
                    </div>
                </div>
            </div>

            {/* Level Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levels.map((level) => {
                    const isUnlocked = unlockedLevels.includes(level.id) || level.level === 1;
                    const isCurrent = currentLevelId === level.id;
                    const isCompleted = completedLevels.includes(level.id);
                    const progress = levelProgress[level.id] || 0;

                    return (
                        <LevelCard
                            key={level.id}
                            level={level}
                            isUnlocked={isUnlocked}
                            isCurrent={isCurrent}
                            isCompleted={isCompleted}
                            progress={progress}
                            onClick={() => isUnlocked && onSelectLevel(level.id)}
                        />
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 pt-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span>مكتمل</span>
                </div>
                <div className="flex items-center gap-2">
                    <Star size={16} className="text-purple-400" />
                    <span>جاري العمل</span>
                </div>
                <div className="flex items-center gap-2">
                    <Lock size={16} className="text-slate-600" />
                    <span>مقفل</span>
                </div>
            </div>
        </div>
    );
}
