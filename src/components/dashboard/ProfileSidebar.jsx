import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, BookOpen, Target, LayoutDashboard, Calendar, Bookmark, Settings } from 'lucide-react';

export const ProfileSidebar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard, color: 'purple' },
        { id: 'learning', label: 'مساراتي التعليمية', icon: BookOpen, color: 'green' },
        { id: 'saved', label: 'المحفوظات', icon: Bookmark, color: 'blue' },
        { id: 'events', label: 'الفعاليات', icon: Calendar, color: 'orange' },
        { id: 'settings', label: 'الإعدادات', icon: Settings, color: 'gray' },
    ];

    return (
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
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 font-bold mb-2 group ${activeTab === tab.id
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
                    <Link
                        to="/knowledge"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all font-bold text-sm"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>اكتشف محتوى جديد</span>
                    </Link>
                    <Link
                        to="/simulators"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all font-bold text-sm"
                    >
                        <Target className="w-4 h-4" />
                        <span>ابدأ محاكي</span>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};
