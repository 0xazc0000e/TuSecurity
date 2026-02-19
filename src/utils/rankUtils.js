/**
 * Calculate user rank based on total XP
 * @param {number} xp 
 * @returns {object} Rank object with title, color, icon, and nextLevel
 */
import { Crown, Shield, Award, Star, Zap, Flame, Target } from 'lucide-react';

export const getRank = (xp) => {
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
