import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target, Award, TrendingUp } from 'lucide-react';

export const DashboardOverview = ({ user, progress }) => {
    // Calculate Rank based on total_xp
    const getRank = (xp) => {
        if (xp >= 10000) return { title: 'Grandmaster (خبير)', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
        if (xp >= 5000) return { title: 'Master (متقن)', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
        if (xp >= 2500) return { title: 'Advanced (متقدم)', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
        if (xp >= 1000) return { title: 'Intermediate (متوسط)', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
        return { title: 'Novice (مبتدئ)', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-white/10' };
    };

    const rank = getRank(user.total_xp || 0);
    const nextRankXp =
        user.total_xp < 1000 ? 1000 :
            user.total_xp < 2500 ? 2500 :
                user.total_xp < 5000 ? 5000 :
                    user.total_xp < 10000 ? 10000 : 10000;

    const progressToNext = Math.min(100, (user.total_xp / nextRankXp) * 100);

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total XP */}
                <div className="bg-[#0f0f16] border border-white/5 rounded-xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={60} />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Zap size={20} /></div>
                        <span className="text-gray-400 text-sm font-bold">نقاط الخبرة (XP)</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{user.total_xp || 0}</div>
                    <div className="text-xs text-yellow-500/70">مجموع النقاط المكتسبة</div>
                </div>

                {/* Rank */}
                <div className={`bg-[#0f0f16] border ${rank.border} rounded-xl p-5 relative overflow-hidden`}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 ${rank.bg} rounded-lg ${rank.color}`}><Trophy size={20} /></div>
                        <span className="text-gray-400 text-sm font-bold">المستوى الحالي</span>
                    </div>
                    <div className={`text-xl font-bold ${rank.color} mb-1`}>{rank.title}</div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full ${rank.bg.replace('/10', '')} ${rank.color.replace('text-', 'bg-')}`} style={{ width: `${progressToNext}%` }} />
                    </div>
                </div>

                {/* Completed Simulators */}
                <div className="bg-[#0f0f16] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Target size={20} /></div>
                        <span className="text-gray-400 text-sm font-bold">المحاكيات المنجزة</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{user.completed_simulators || 0}</div>
                    <div className="text-xs text-gray-500">تم إكمالها بنجاح</div>
                </div>

                {/* Badges */}
                <div className="bg-[#0f0f16] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Award size={20} /></div>
                        <span className="text-gray-400 text-sm font-bold">الأوسمة</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{user.badges_count || 0}</div>
                    <div className="text-xs text-gray-500">ميدالية وشارة</div>
                </div>
            </div>

            {/* Recent Activity / Progress Chart Placeholder */}
            {/* Can add a chart here if needed later */}
        </div>
    );
};
