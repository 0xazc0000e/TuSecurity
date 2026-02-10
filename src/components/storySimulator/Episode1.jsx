import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Zap, Network } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';
import { CHARACTERS } from '../../data/storySimulator/characters';
import { getEpisode } from '../../data/storySimulator/episodes';

/**
 * Episode 1: The Trigger
 * الفصل الأول - الإنذار الأول
 */
export const Episode1 = ({ onRoleSelected, onComplete }) => {
    const [phase, setPhase] = useState('cinematic'); // cinematic -> alert -> roleSelection -> transition
    const [selectedRole, setSelectedRole] = useState(null);
    const episode = getEpisode(1);

    useEffect(() => {
        // Cinematic auto-advances after duration
        if (phase === 'cinematic') {
            const timer = setTimeout(() => {
                setPhase('alert');
            }, episode.cinematic.duration * 1000);

            return () => clearTimeout(timer);
        }
    }, [phase, episode.cinematic.duration]);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setPhase('transition');

        // Notify parent and move to next phase
        setTimeout(() => {
            onRoleSelected(role);
            if (onComplete) onComplete();
        }, 2000);
    };

    return (
        <div className="h-full w-full relative overflow-hidden bg-black font-cairo">
            <AnimatePresence mode="wait">
                {/* Phase 1: Cinematic Intro */}
                {phase === 'cinematic' && (
                    <CinematicIntro cinematic={episode.cinematic} />
                )}

                {/* Phase 2: Alert Display */}
                {phase === 'alert' && (
                    <AlertDisplay
                        alert={episode.alert}
                        onAcknowledge={() => setPhase('roleSelection')}
                    />
                )}

                {/* Phase 3: Role Selection */}
                {phase === 'roleSelection' && (
                    <RoleSelection
                        options={episode.roleSelection.options}
                        question={episode.roleSelection.question.ar}
                        onSelect={handleRoleSelect}
                    />
                )}

                {/* Phase 4: Transition */}
                {phase === 'transition' && selectedRole && (
                    <RoleTransition role={selectedRole} episode={episode} />
                )}
            </AnimatePresence>
        </div>
    );
};

/**
 * Cinematic Intro Component
 */
const CinematicIntro = ({ cinematic }) => {
    return (
        <motion.div
            key="cinematic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex items-center justify-center relative"
        >
            {/* SOC Room Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-black">
                {/* Pulsing Red Lights */}
                <motion.div
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-0 left-0 w-32 h-32 bg-red-500 blur-[100px]"
                />
                <motion.div
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    className="absolute bottom-0 right-0 w-32 h-32 bg-red-500 blur-[100px]"
                />
            </div>

            {/* Network Map Silhouette */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Network size={400} className="text-red-500" />
            </div>

            {/* Narration Text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="relative z-10 text-center px-8"
            >
                <p className="text-2xl md:text-4xl text-slate-300 font-bold mb-4 leading-relaxed">
                    {cinematic.narration.ar}
                </p>
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-red-400 text-sm"
                >
                    جاري التحميل...
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

/**
 * Alert Display Component
 */
const AlertDisplay = ({ alert, onAcknowledge }) => {
    return (
        <motion.div
            key="alert"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="h-full w-full flex items-center justify-center p-8"
        >
            <div className="max-w-2xl w-full">
                {/* Alert Card */}
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="bg-gradient-to-br from-red-950/30 to-black border-2 border-red-500/50 rounded-2xl p-8 relative overflow-hidden"
                >
                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 blur-[80px] rounded-full" />

                    {/* Alert Icon */}
                    <div className="flex justify-center mb-6">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="relative"
                        >
                            <AlertTriangle size={64} className="text-red-500" />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-0 bg-red-500/30 blur-xl rounded-full"
                            />
                        </motion.div>
                    </div>

                    {/* Alert Title */}
                    <h2 className="text-3xl font-bold text-center text-white mb-2">
                        {alert.title.ar}
                    </h2>

                    {/* Device Info */}
                    <div className="text-center mb-6">
                        <span className="px-4 py-2 bg-red-500/20 rounded-full text-red-300 font-mono text-sm">
                            {alert.device}
                        </span>
                    </div>

                    {/* Alert Message */}
                    <p className="text-xl text-slate-300 text-center mb-8 leading-relaxed">
                        {alert.message.ar}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <DetailItem label="IP Address" value={alert.details.ip} />
                        <DetailItem label="User" value={alert.details.user} />
                        <DetailItem label="Department" value={alert.details.department} />
                        <DetailItem label="Time" value={alert.details.time} />
                    </div>

                    {/* Acknowledge Button */}
                    <button
                        onClick={onAcknowledge}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    >
                        تأكيد الاستلام والمتابعة
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

/**
 * Detail Item Component
 */
const DetailItem = ({ label, value }) => (
    <div className="bg-white/5 p-3 rounded-lg">
        <div className="text-xs text-slate-500 mb-1">{label}</div>
        <div className="text-white font-mono text-sm">{value}</div>
    </div>
);

/**
 * Role Selection Component
 */
const RoleSelection = ({ options, question, onSelect }) => {
    return (
        <motion.div
            key="roleSelection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex items-center justify-center p-8"
        >
            <div className="max-w-4xl w-full">
                <h2 className="text-3xl font-bold text-center text-white mb-12">
                    {question}
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {options.map((option) => (
                        <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(option.id)}
                            className={`
                                p-8 rounded-2xl border-2 text-right transition-all relative overflow-hidden group
                                ${option.id === 'defender'
                                    ? 'border-blue-500/50 hover:border-blue-500 bg-blue-950/20'
                                    : 'border-red-500/50 hover:border-red-500 bg-red-950/20'
                                }
                            `}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity ${option.id === 'defender' ? 'bg-blue-500' : 'bg-red-500'
                                }`} />

                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                {option.id === 'defender' ? (
                                    <Shield size={48} className="text-blue-400" />
                                ) : (
                                    <Zap size={48} className="text-red-400" />
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-white mb-3 text-center">
                                {option.title.ar}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-300 text-center mb-4">
                                {option.description.ar}
                            </p>

                            {/* Objective */}
                            <div className={`text-sm font-bold text-center ${option.id === 'defender' ? 'text-blue-300' : 'text-red-300'
                                }`}>
                                الهدف: {option.objective.ar}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

/**
 * Role Transition Component
 */
const RoleTransition = ({ role, episode }) => {
    const branch = episode.branches[role];
    const mentor = CHARACTERS[branch.mentor];

    return (
        <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full flex items-center justify-center p-8"
        >
            <div className="max-w-2xl w-full">
                <CharacterAvatar
                    character={mentor}
                    dialogue={branch.guidance}
                    position="left"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-8"
                >
                    <div className="text-[#7112AF] font-bold animate-pulse">
                        جاري تحضير البيئة...
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
