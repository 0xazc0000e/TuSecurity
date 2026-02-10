import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Layers, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Episode1 } from '../components/storySimulator/Episode1';
import CyberWorkspace from '../components/layout/CyberWorkspace';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useAnalytics } from '../context/AnalyticsContext';
import { useScenarioEngine } from '../hooks/useScenarioEngine';
import NetworkMapPanel from '../components/storySimulator/NetworkMapPanel';
import TerminalPanel from '../components/storySimulator/TerminalPanel';
import AttackTaskPanel from '../components/storySimulator/AttackTaskPanel';
import AttackStatusPanel from '../components/storySimulator/AttackStatusPanel';
import TacticalBriefing from '../components/storySimulator/TacticalBriefing';
import NotesPanel from '../components/storySimulator/NotesPanel';

/**
 * Story Simulator - SmartGrid Incident
 * المحاكي القصصي التفاعلي الكامل
 */
export default function StorySimulator() {
    const navigate = useNavigate();
    const { logEvent } = useAnalytics();

    const [phase, setPhase] = useState('episode1'); // episode1, briefing, workspace, complete
    const [playerRole, setPlayerRole] = useState(null); // defender | attacker
    const [showNotes, setShowNotes] = useState(false);

    // Initialize Engine (will load scenario when role is set)
    const {
        scenario,
        currentStep,
        currentStepIndex,
        worldState,
        feedback,
        validateAction
    } = useScenarioEngine(playerRole);

    const handleRoleSelected = (role) => {
        setPlayerRole(role);
        logEvent('STORY_SIM_ROLE_SELECTED', {
            domain: 'simulators',
            role: role,
            timestamp: new Date().toISOString()
        });
    };

    const handleEpisode1Complete = () => {
        setPhase('briefing'); // NEW: Go to briefing first
        logEvent('STORY_SIM_EPISODE_COMPLETE', {
            domain: 'simulators',
            episode: 1,
            role: playerRole
        });
    };

    const handleBriefingComplete = () => {
        setPhase('workspace');
        logEvent('STORY_SIM_BRIEFING_COMPLETE', {
            role: playerRole
        });
    }

    const handleSimulatorExit = () => {
        navigate('/simulators');
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-black font-cairo relative">
            <MatrixBackground />

            {/* Header Bar */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSimulatorExit}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="العودة للمحاكيات"
                    >
                        <Home size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white">SmartGrid Incident Simulator</h1>
                        <p className="text-xs text-slate-400">
                            {playerRole && `الدور: ${playerRole === 'defender' ? 'المدافع' : 'المهاجم التعليمي'}`}
                            {scenario && ` • ${scenario.title?.ar || 'Chapter 1'}`}
                        </p>
                    </div>
                </div>

                {/* Status/Score & Tools */}
                {phase === 'workspace' && (
                    <div className="flex items-center gap-4">
                        {/* Notes Toggle */}
                        <button
                            onClick={() => setShowNotes(!showNotes)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all
                                ${showNotes ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}
                            `}
                        >
                            <FileText size={14} />
                            الملاحظات
                        </button>

                        <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30 text-xs font-bold">
                            Level: {currentStepIndex + 1}/{scenario?.tasks?.length || '?'}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="h-full w-full pt-16">
                <AnimatePresence mode="wait">
                    {phase === 'episode1' && (
                        <motion.div
                            key="episode1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full w-full"
                        >
                            <Episode1
                                onRoleSelected={handleRoleSelected}
                                onComplete={handleEpisode1Complete}
                            />
                        </motion.div>
                    )}

                    {phase === 'briefing' && (
                        <TacticalBriefing
                            role={playerRole}
                            onComplete={handleBriefingComplete}
                        />
                    )}

                    {phase === 'workspace' && (
                        <motion.div
                            key="workspace"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full w-full"
                        >
                            <CyberWorkspace
                                // Configuration
                                config={{
                                    topLeftTitle: "Network Topology",
                                    topRightTitle: "Mission Control",
                                    bottomLeftTitle: "Terminal Access",
                                    bottomRightTitle: showNotes ? "Analyst Notes" : "System Monitor"
                                }}

                                // Panels
                                topLeftContent={
                                    <NetworkMapPanel worldState={worldState} />
                                }

                                topRightContent={
                                    <AttackTaskPanel
                                        step={currentStep}
                                        stepIndex={currentStepIndex}
                                        feedback={feedback}
                                        onValidate={(type, data) => validateAction(type, data)}
                                    />
                                }

                                bottomLeftContent={
                                    <TerminalPanel
                                        role={playerRole}
                                        onCommand={(cmd) => validateAction('COMMAND', { command: cmd })}
                                    />
                                }

                                bottomRightContent={
                                    showNotes ? (
                                        <NotesPanel />
                                    ) : (
                                        <AttackStatusPanel
                                            worldState={worldState}
                                            feedback={feedback}
                                        />
                                    )
                                }
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
