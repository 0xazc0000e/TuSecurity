import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Github, Linkedin, Twitter, Globe as GlobeIcon, Shield, Crown, Award, Star, Zap, Flame, Target } from 'lucide-react';
import { getApiImageUrl } from '../../utils/imageUtils';

export const ProfileHeader = ({ profileData, user, xpData, onLogout }) => {
    const RankIcon = xpData.rankIcon || Target;

    return (
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
                        </div>
                        {/* Title & Social Links */}
                        {user?.title && (
                            <p className="text-gray-400 text-sm mt-1 font-medium flex items-center gap-2">
                                <Shield className="w-3 h-3 text-purple-400" />
                                {user.title}
                            </p>
                        )}

                        <div className="flex items-center gap-3 mt-3">
                            {/* Valid Social Links */}
                            {(() => {
                                let links = user?.social_links;
                                if (typeof links === 'string') {
                                    try { links = JSON.parse(links); } catch { links = {}; }
                                }
                                links = links || {};

                                return (
                                    <>
                                        {links.github && (
                                            <a href={links.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                        {links.linkedin && (
                                            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                        {links.twitter && (
                                            <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-sky-400 hover:bg-sky-500/10 transition-all">
                                                <Twitter className="w-4 h-4" />
                                            </a>
                                        )}
                                        {links.website && (
                                            <a href={links.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                                                <GlobeIcon className="w-4 h-4" />
                                            </a>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogout}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold"
                >
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                </motion.button>
            </div>
        </motion.div>
    );
};
