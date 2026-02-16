import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Calendar, Bookmark, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth, apiCall } from '../context/AuthContext';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { getApiImageUrl } from '../utils/imageUtils';

// Components
import { DashboardOverview } from '../components/dashboard/DashboardOverview';
import { MyLearning } from '../components/dashboard/MyLearning';
import { DashboardEvents } from '../components/dashboard/DashboardEvents';
import { SavedItems } from '../components/dashboard/SavedItems';
import { ProfileSettings } from '../components/dashboard/ProfileSettings';

export default function Profile() {
    const { user, login } = useAuth(); // login used here to update user state if needed
    const [activeTab, setActiveTab] = useState('overview');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const data = await apiCall('/auth/profile');
            setProfileData(data);
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleProfileUpdate = (updatedUser) => {
        // Update local state and optionally AuthContext
        setProfileData(prev => ({ ...prev, ...updatedUser }));
        // Just reload to be safe and sync everything
        window.location.reload();
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    const tabs = [
        { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
        { id: 'learning', label: 'مساراتي', icon: BookOpen },
        { id: 'events', label: 'الفعاليات', icon: Calendar },
        { id: 'saved', label: 'المحفوظات', icon: Bookmark },
        { id: 'settings', label: 'الإعدادات', icon: Settings },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 relative" dir="rtl">
            <MatrixBackground />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                {/* Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    {/* User Card */}
                    <div className="bg-[#0f0f16]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                        <div className="w-24 h-24 rounded-full border-2 border-purple-500 mx-auto mb-4 overflow-hidden p-1">
                            <img src={getApiImageUrl(profileData.avatar)} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">{profileData.username}</h2>
                        <span className="text-xs text-purple-400 font-bold px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
                            {user.role === 'admin' ? 'مدير النظام' : 'عضو نشط'}
                        </span>

                        <div className="mt-6 flex flex-col gap-2">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                    <tab.icon size={18} /> {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-9">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'overview' && <DashboardOverview user={profileData} progress={profileData.progress} />}
                        {activeTab === 'learning' && <MyLearning enrollments={profileData.enrollments} />}
                        {activeTab === 'events' && <DashboardEvents events={profileData.events} />}
                        {activeTab === 'saved' && <SavedItems likes={profileData.likes} bookmarks={profileData.bookmarks} />}
                        {activeTab === 'settings' && <ProfileSettings user={profileData} onUpdate={handleProfileUpdate} />}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
