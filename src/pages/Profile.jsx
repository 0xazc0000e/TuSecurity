import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon } from 'lucide-react';
import { useAuth, apiCall } from '../context/AuthContext';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { getRank } from '../utils/rankUtils';
import { ProfileHeader } from '../components/dashboard/ProfileHeader';
import { XPProgressCard } from '../components/dashboard/XPProgressCard';
import { ProfileSidebar } from '../components/dashboard/ProfileSidebar';

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

            // Fetch events
            const events = await apiCall('/profile/events').catch(() => []);

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

            setProfileData({ ...profile, events });

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
                completedLessons: Array.isArray(progress.completedLessons) ? progress.completedLessons.length : (progress.completedLessons || 0),
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
                <ProfileHeader
                    profileData={profileData}
                    user={user}
                    xpData={xpData}
                    onLogout={handleLogout}
                />

                <XPProgressCard xpData={xpData} />

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <ProfileSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

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
