import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, BookOpen, Calendar, Bookmark, Settings, LogOut, 
    User as UserIcon, Award, TrendingUp, Zap, Target, Clock, 
    ChevronRight, Sparkles, Crown, Shield, Star, Flame
} from 'lucide-react';
import { useAuth, apiCall } from '../context/AuthContext';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { getApiImageUrl } from '../utils/imageUtils';

// Enhanced Components
import { DashboardOverview } from '../components/dashboard/DashboardOverview';
import { MyLearning } from '../components/dashboard/MyLearning';
import { DashboardEvents } from '../components/dashboard/DashboardEvents';
import { SavedItems } from '../components/dashboard/SavedItems';
import { ProfileSettings } from '../components/dashboard/ProfileSettings';

export default function Profile() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [xpData, setXpData] = useState({
        totalXP: 0,
        weeklyXP: 0,
        monthlyXP: 0,
        rank: 'مبتدئ',
        nextRankXP: 1000,
        streakDays: 0,
        completedLessons: 0,
        completedSimulators: 0,
        savedArticles: 0,
        recentActivity: []
    });

    // Fetch comprehensive profile data including XP from all sources
    const fetchProfileData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Fetch main profile
            const profile = await apiCall('/auth/profile');
            setProfileData(profile);
            
            // Fetch comprehensive XP data from all sources
            const xpStats = await apiCall('/user/xp-stats').catch(() => ({
                totalXP: profile.total_xp || 0,
                weeklyXP: 0,
                monthlyXP: 0,
                sources: {}
            }));
            
            // Fetch learning progress
            const progress = await apiCall('/user/learning-progress').catch(() => ({
                enrollments: [],
                completedLessons: 0,
                completedTracks: 0,
                currentStreak: 0
            }));
            
            // Fetch saved items count
            const saved = await apiCall('/user/saved-count').catch(() => ({
                bookmarks: 0,
                likes: 0
            }));
            
            // Calculate rank based on total XP
            const totalXP = xpStats.totalXP || profile.total_xp || 0;
            const rank = getRank(totalXP);
            
            setXpData({
                totalXP,
                weeklyXP: xpStats.weeklyXP || 0,
                monthlyXP: xpStats.monthlyXP || 0,
                rank: rank.title,
                rankColor: rank.color,
                rankIcon: rank.icon,
                nextRankXP: rank.nextLevel,
                streakDays: progress.currentStreak || 0,
                completedLessons: progress.completedLessons || 0,
                completedSimulators: profile.completed_simulators || 0,
                savedArticles: saved.bookmarks || 0,
                recentActivity: xpStats.recentActivity || []
            });
            
        } catch (error) {
            console.error('Failed to load profile data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfileData();
        
        // Set up interval to refresh data every 30 seconds
        const interval = setInterval(fetchProfileData, 30000);
        return () => clearInterval(interval);
    }, [fetchProfileData]);

    const getRank = (xp) => {
        if (xp >= 50000) return { 
            title: 'أسطورة الأمن السيبراني', 
            color: 'from-amber-500 to-orange-500',
            icon: Crown,
            nextLevel: 100000 
        };
        if (xp >= 25000) return { 
            title: 'خبير الأمن السيبراني', 
            color: 'from-purple-500 to-pink-500',
            icon: Shield,
            nextLevel: 50000 
        };
        if (xp >= 10000) return { 
            title: 'محترف الأمن', 
            color: 'from-blue-500 to-cyan-500',
            icon: Award,
            nextLevel: 25000 
        };
        if (xp >= 5000) return { 
            title: 'متقدم', 
            color: 'from-green-500 to-emerald-500',
            icon: Star,
            nextLevel: 10000 
        };
        if (xp >= 2500) return { 
            title: 'متوسط', 
            color: 'from-yellow-500 to-amber-500',
            icon: Zap,
            nextLevel: 5000 
        };
        if (xp >= 1000) return { 
            title: 'مبتدئ متحمس', 
            color: 'from-orange-500 to-red-500',
            icon: Flame,
            nextLevel: 2500 
        };
        return { 
            title: 'مبتدئ', 
            color: 'from-gray-500 to-gray-400',
            icon: Target,
            nextLevel: 1000 
        };
    };

    const handleProfileUpdate = (updatedUser) => {
        setProfileData(prev => ({ ...prev, ...updatedUser }));
        fetchProfileData();
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full rounded-full border-4 border-purple-500/20 border-t-purple-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <UserIcon className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                    <p className="text-white font-bold">جاري تحميل الملف الشخصي...</p>
                </motion.div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    const tabs = [
        { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard, color: 'purple' },
        { id: 'learning', label: 'مساراتي التعليمية', icon: BookOpen, color: 'green' },
        { id: 'saved', label: 'المحفوظات', icon: Bookmark, color: 'blue' },
        { id: 'events', label: 'الفعاليات', icon: Calendar, color: 'orange' },
        { id: 'settings', label: 'الإعدادات', icon: Settings, color: 'gray' },
    ];

    const RankIcon = xpData.rankIcon || Target;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden" dir="rtl">
            <MatrixBackground opacity={0.03} />
            
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                />
                <motion.div 
                    animate={{ 
                        x: [0, -50, 0],
                        y: [0, 100, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Enhanced Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Animated Avatar */}
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="relative"
                            >
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-purple-500/30 shadow-2xl shadow-purple-500/20">
                                    <img 
                                        src={getApiImageUrl(profileData?.avatar)} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Rank Badge */}
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`absolute -bottom-2 -right-2 p-2 rounded-lg bg-gradient-to-r ${xpData.rankColor} shadow-lg`}
                                >
                                    <RankIcon className="w-5 h-5 text-white" />
                                </motion.div>
                                {/* Online Status */}
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-gray-950 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                </div>
                            </motion.div>
                            
                            {/* User Info */}
                            <div>
                                <motion.h1 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-2xl md:text-3xl font-bold text-white mb-2"
                                >
                                    {profileData?.username || user?.username}
                                </motion.h1>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${xpData.rankColor} text-white shadow-lg`}>
                                        {xpData.rank}
                                    </span>
                                    <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-white/10 text-white/80 border border-white/20">
                                        {user?.role === 'admin' ? 'مدير النظام' : user?.role === 'editor' ? 'محرر' : 'عضو نشط'}
                                    </span>
                                </div>
                                
                                {/* Quick Stats Row */}
                                <div className="flex items-center gap-6 mt-4 text-sm">
                                    <div className="flex items-center gap-2 text-yellow-400">
                                        <Zap className="w-4 h-4" />
                                        <span className="font-bold">{xpData.totalXP.toLocaleString()} XP</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-orange-400">
                                        <Flame className="w-4 h-4" />
                                        <span className="font-bold">{xpData.streakDays} يوم متتالي</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <BookOpen className="w-4 h-4" />
                                        <span className="font-bold">{xpData.completedLessons} درس مكتمل</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Logout Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>تسجيل الخروج</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* XP Progress Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${xpData.rankColor} shadow-lg`}>
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">التقدم نحو المستوى التالي</h3>
                                    <p className="text-gray-400 text-sm">
                                        {xpData.totalXP.toLocaleString()} / {xpData.nextRankXP.toLocaleString()} XP
                                    </p>
                                </div>
                            </div>
                            <div className="text-left">
                                <span className="text-2xl font-bold text-white">
                                    {Math.round((xpData.totalXP / xpData.nextRankXP) * 100)}%
                                </span>
                            </div>
                        </div>
                        
                        {/* Animated Progress Bar */}
                        <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(xpData.totalXP / xpData.nextRankXP) * 100}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className={`absolute inset-y-0 right-0 rounded-full bg-gradient-to-l ${xpData.rankColor}`}
                            />
                            {/* Shimmer Effect */}
                            <motion.div
                                animate={{ x: [-200, 400] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                className="absolute inset-y-0 w-20 bg-white/20 skew-x-12"
                            />
                        </div>
                        
                        <div className="flex justify-between mt-3 text-xs text-gray-500">
                            <span>{xpData.rank}</span>
                            <span>{getRank(xpData.nextRankXP).title}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar Navigation */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3 space-y-4"
                    >
                        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
                            {tabs.map((tab, index) => (
                                <motion.button
                                    key={tab.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 font-bold mb-2 group ${
                                        activeTab === tab.id
                                            ? `bg-gradient-to-r from-${tab.color}-600 to-${tab.color}-500 text-white shadow-lg shadow-${tab.color}-500/25`
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                                    <span>{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="mr-auto"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                        
                        {/* Quick Actions Card */}
                        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                إجراءات سريعة
                            </h4>
                            <div className="space-y-2">
                                <a 
                                    href="/knowledge"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all font-bold text-sm"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    <span>اكتشف محتوى جديد</span>
                                </a>
                                <a 
                                    href="/simulators"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all font-bold text-sm"
                                >
                                    <Target className="w-4 h-4" />
                                    <span>ابدأ محاكي</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-9"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl min-h-[500px]"
                            >
                                {activeTab === 'overview' && (
                                    <DashboardOverview 
                                        user={profileData} 
                                        xpData={xpData}
                                        progress={profileData?.progress}
                                    />
                                )}
                                {activeTab === 'learning' && (
                                    <MyLearning 
                                        enrollments={profileData?.enrollments}
                                        onProgressUpdate={fetchProfileData}
                                    />
                                )}
                                {activeTab === 'saved' && (
                                    <SavedItems 
                                        likes={profileData?.likes} 
                                        bookmarks={profileData?.bookmarks}
                                        onUpdate={fetchProfileData}
                                    />
                                )}
                                {activeTab === 'events' && (
                                    <DashboardEvents 
                                        events={profileData?.events}
                                    />
                                )}
                                {activeTab === 'settings' && (
                                    <ProfileSettings 
                                        user={profileData} 
                                        onUpdate={handleProfileUpdate}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
