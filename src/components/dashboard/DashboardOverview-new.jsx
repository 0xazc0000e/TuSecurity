import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, Star, Zap, Target, Award, TrendingUp, 
    Flame, Clock, BookOpen, Activity, Calendar,
    ChevronRight, Sparkles, Crown, Shield, Sword
} from 'lucide-react';
import { apiCall } from '../../context/AuthContext';

export const DashboardOverview = ({ user, xpData, progress }) => {
    const [stats, setStats] = useState({
        totalXP: 0,
        weeklyXP: 0,
        monthlyXP: 0,
        completedLessons: 0,
        completedSimulators: 0,
        savedArticles: 0,
        streakDays: 0,
        rank: 'مبتدئ',
        nextRankXP: 1000,
        recentActivity: [],
        xpSources: {
            lessons: 0,
            simulators: 0,
            quizzes: 0,
            dailyLogin: 0,
            streakBonus: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComprehensiveStats();
    }, [user, xpData]);

    const fetchComprehensiveStats = async () => {
        try {
            setLoading(true);
            
            // Fetch comprehensive XP stats from all sources
            const xpResponse = await apiCall('/user/xp-detailed-stats').catch(() => ({
                total: user?.total_xp || 0,
                weekly: 0,
                monthly: 0,
                sources: {
                    lessons: Math.floor((user?.total_xp || 0) * 0.4),
                    simulators: Math.floor((user?.total_xp || 0) * 0.3),
                    quizzes: Math.floor((user?.total_xp || 0) * 0.2),
                    dailyLogin: Math.floor((user?.total_xp || 0) * 0.1),
                    streakBonus: 0
                }
            }));

            // Fetch learning progress
            const learningResponse = await apiCall('/user/learning-stats').catch(() => ({
                completedLessons: progress?.completedLessons || 0,
                completedTracks: 0,
                inProgressLessons: 0,
                totalLearningTime: 0
            }));

            // Fetch activity history
            const activityResponse = await apiCall('/user/recent-activity').catch(() => ({
                activities: []
            }));

            setStats({
                totalXP: xpResponse.total || user?.total_xp || 0,
                weeklyXP: xpResponse.weekly || 0,
                monthlyXP: xpResponse.monthly || 0,
                completedLessons: learningResponse.completedLessons || 0,
                completedSimulators: user?.completed_simulators || 0,
                savedArticles: user?.bookmarks_count || 0,
                streakDays: user?.streak_days || xpData?.streakDays || 0,
                rank: xpData?.rank || 'مبتدئ',
                nextRankXP: xpData?.nextRankXP || 1000,
                recentActivity: activityResponse.activities || [],
                xpSources: xpResponse.sources || {
                    lessons: Math.floor((user?.total_xp || 0) * 0.4),
                    simulators: Math.floor((user?.total_xp || 0) * 0.3),
                    quizzes: Math.floor((user?.total_xp || 0) * 0.2),
                    dailyLogin: Math.floor((user?.total_xp || 0) * 0.1),
                    streakBonus: 0
                }
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        switch(rank) {
            case 'أسطورة الأمن السيبراني': return Crown;
            case 'خبير الأمن السيبراني': return Shield;
            case 'محترف الأمن': return Sword;
            case 'متقدم': return Star;
            case 'متوسط': return Zap;
            case 'مبتدئ متحمس': return Flame;
            default: return Target;
        }
    };

    const RankIcon = getRankIcon(stats.rank);
    const progressToNext = Math.min(100, (stats.totalXP / stats.nextRankXP) * 100);

    const statCards = [
        { 
            icon: Zap, 
            label: 'نقاط الخبرة (XP)', 
            value: stats.totalXP.toLocaleString(), 
            subtext: `+${stats.weeklyXP} هذا الأسبوع`,
            color: 'yellow',
            gradient: 'from-yellow-500/20 to-amber-500/20',
            iconBg: 'bg-yellow-500/20',
            iconColor: 'text-yellow-400'
        },
        { 
            icon: RankIcon, 
            label: 'المستوى الحالي', 
            value: stats.rank, 
            subtext: `${Math.round(progressToNext)}% للمستوى التالي`,
            color: 'purple',
            gradient: 'from-purple-500/20 to-pink-500/20',
            iconBg: 'bg-purple-500/20',
            iconColor: 'text-purple-400',
            isRank: true
        },
        { 
            icon: BookOpen, 
            label: 'الدروس المكتملة', 
            value: stats.completedLessons.toString(), 
            subtext: `${stats.completedLessons > 0 ? 'أداء ممتاز!' : 'ابدأ التعلم'}`,
            color: 'green',
            gradient: 'from-green-500/20 to-emerald-500/20',
            iconBg: 'bg-green-500/20',
            iconColor: 'text-green-400'
        },
        { 
            icon: Target, 
            label: 'المحاكيات المنجزة', 
            value: stats.completedSimulators.toString(), 
            subtext: 'تم إكمالها بنجاح',
            color: 'blue',
            gradient: 'from-blue-500/20 to-cyan-500/20',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400'
        },
        { 
            icon: Flame, 
            label: 'أيام التتالي', 
            value: stats.streakDays.toString(), 
            subtext: 'استمر في التعلم!',
            color: 'orange',
            gradient: 'from-orange-500/20 to-red-500/20',
            iconBg: 'bg-orange-500/20',
            iconColor: 'text-orange-400'
        },
        { 
            icon: Award, 
            label: 'الأوسمة', 
            value: (user?.badges_count || 0).toString(), 
            subtext: 'ميدالية وشارة',
            color: 'pink',
            gradient: 'from-pink-500/20 to-rose-500/20',
            iconBg: 'bg-pink-500/20',
            iconColor: 'text-pink-400'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h2 className="text-2xl font-bold text-white mb-2">
                    مرحباً، {user?.username} 👋
                </h2>
                <p className="text-gray-400">
                    إليك نظرة عامة على تقدمك وإنجازاتك في رحلة تعلم الأمن السيبراني
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${card.gradient} border border-white/5 backdrop-blur-sm group cursor-pointer`}
                    >
                        {/* Background Glow Effect */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 ${card.iconBg} rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity`} />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2.5 rounded-lg ${card.iconBg} ${card.iconColor}`}>
                                    <card.icon size={22} />
                                </div>
                                <span className="text-gray-400 text-sm font-bold">{card.label}</span>
                            </div>
                            
                            <div className={`text-3xl font-bold text-white mb-1 ${card.isRank ? 'text-lg' : ''}`}>
                                {card.value}
                            </div>
                            
                            <div className={`text-xs ${card.iconColor} opacity-80`}>
                                {card.subtext}
                            </div>

                            {/* Progress bar for rank */}
                            {card.isRank && (
                                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressToNext}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full bg-gradient-to-l ${card.color === 'purple' ? 'from-purple-500 to-pink-500' : ''}`}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* XP Sources Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">توزيع نقاط الخبرة (XP)</h3>
                </div>

                <div className="space-y-4">
                    {Object.entries(stats.xpSources).map(([source, xp], index) => {
                        const percentage = stats.totalXP > 0 ? (xp / stats.totalXP) * 100 : 0;
                        const sourceNames = {
                            lessons: 'إكمال الدروس',
                            simulators: 'المحاكيات',
                            quizzes: 'الاختبارات',
                            dailyLogin: 'تسجيل الدخول اليومي',
                            streakBonus: 'مكافأة التتالي'
                        };
                        const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
                        
                        return (
                            <div key={source} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">{sourceNames[source]}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold">{xp.toLocaleString()} XP</span>
                                        <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.8, delay: 0.1 * index }}
                                        className={`h-full ${colors[index]} rounded-full`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">النشاطات الأخيرة</h3>
                    </div>
                    <a href="/activity" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                        عرض الكل <ChevronRight className="w-4 h-4" />
                    </a>
                </div>

                {stats.recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>لا توجد نشاطات حديثة. ابدأ التعلم الآن!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {stats.recentActivity.slice(0, 5).map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <div className={`p-2 rounded-lg ${
                                    activity.type === 'lesson_completed' ? 'bg-green-500/20 text-green-400' :
                                    activity.type === 'simulator_completed' ? 'bg-blue-500/20 text-blue-400' :
                                    activity.type === 'xp_earned' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-purple-500/20 text-purple-400'
                                }`}>
                                    {activity.type === 'lesson_completed' ? <BookOpen className="w-4 h-4" /> :
                                     activity.type === 'simulator_completed' ? <Target className="w-4 h-4" /> :
                                     activity.type === 'xp_earned' ? <Zap className="w-4 h-4" /> :
                                     <Award className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-bold text-sm">{activity.title}</p>
                                    <p className="text-gray-500 text-xs">{new Date(activity.date).toLocaleDateString('ar-SA')}</p>
                                </div>
                                {activity.xp && (
                                    <span className="text-yellow-400 font-bold text-sm">+{activity.xp} XP</span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Weekly Goals */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">أهداف هذا الأسبوع</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { goal: 'إكمال 5 دروس', current: Math.min(stats.completedLessons, 5), total: 5, icon: BookOpen },
                        { goal: 'تسجيل الدخول 7 أيام', current: Math.min(stats.streakDays, 7), total: 7, icon: Flame },
                        { goal: 'كسب 500 XP', current: Math.min(stats.weeklyXP, 500), total: 500, icon: Zap }
                    ].map((item, index) => (
                        <div key={index} className="bg-white/5 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <item.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm text-gray-300">{item.goal}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl font-bold text-white">{item.current}</span>
                                <span className="text-sm text-gray-500">/ {item.total}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.current / item.total) * 100}%` }}
                                    transition={{ duration: 0.8, delay: 0.2 * index }}
                                    className={`h-full rounded-full ${
                                        item.current >= item.total ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
