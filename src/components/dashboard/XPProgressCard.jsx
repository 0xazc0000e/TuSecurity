import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { getRank } from '../../utils/rankUtils';

export const XPProgressCard = ({ xpData }) => {
    return (
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
    );
};
