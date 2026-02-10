import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Skull, Play, ChevronRight, Clock, Activity, AlertTriangle } from 'lucide-react';
import { WorkspaceLayout } from './workspace/WorkspaceLayout';
import { useCommandParser } from '../../hooks/useCommandParser';
import { useTaskChain } from '../../hooks/useTaskChain';
import { useAnalytics } from '../../context/AnalyticsContext';
import { MatrixBackground } from '../ui/MatrixBackground';
import { SMARTGRID_STORY } from '../../data/cyberRange/storyData';
import { CHAPTER_1_SCENARIOS } from '../../data/cyberRange/chapter1Scenarios';
import { getAvailableTools } from '../../data/cyberRange/toolsRegistry';

import { PreSetupPhase } from './phases/PreSetupPhase';
import { AssessmentScreen } from './phases/AssessmentScreen';
import { CHAPTER_TASKS } from '../../data/cyberRange/chapterTasks';

/**
 * Main Cyber Range Component
 * Orchestrates the entire experience: story, tasks, workspace
 */
export default function CyberRange() {
    const { logEvent } = useAnalytics();

    // Core state
    const [phase, setPhase] = useState('briefing'); // briefing, setup, simulation, debrief
    const [role, setRole] = useState(null); // attacker, defender
    const [currentChapter, setCurrentChapter] = useState(1);
    const [setupConfig, setSetupConfig] = useState(null);

    // Story state
    const [storyState, setStoryState] = useState({
        discoveredIPs: [],
        compromisedSystems: [],
        blockedIPs: [],
        openPorts: [],
        services: [],
        threats: [],
        commandsExecuted: []
    });

    // Terminal state
    const [terminalLines, setTerminalLines] = useState([]);

    // Logs state (for defender)
    const [systemLogs, setSystemLogs] = useState([
        {
            timestamp: '03:47:10',
            level: 'warning',
            message: 'High network latency detected on SCADA interface'
        },
        {
            timestamp: '03:47:45',
            level: 'critical',
            message: 'SIEM Alert: Unusual outbound traffic on port 502'
        }
    ]);

    // Target status (for attacker)
    const [targetStatus, setTargetStatus] = useState({
        hostname: null,
        ip: null,
        os: null,
        openPorts: [],
        compromised: false,
        loot: []
    });

    // Get current scenario based on chapter and role
    const currentScenario = role && currentChapter ? CHAPTER_TASKS[currentChapter]?.[role] : null;

    // Initialize hooks
    const { executeCommand, commandHistory } = useCommandParser({
        role,
        chapter: currentChapter,
        storyState,
        onOutputGenerated: handleCommandOutput
    });

    const taskChain = useTaskChain({
        chapter: currentChapter,
        role,
        scenarioData: currentScenario
    });

    // Get available tools for current role
    const availableTools = role ? getAvailableTools(role, currentChapter) : [];

    // Handle command execution
    function handleCommandOutput(outputData) {
        const { command, tool, output, entities, hints, triggerEvent, success } = outputData;

        // Add command to terminal
        addTerminalLine('input', command);

        // Add output
        addTerminalLine(success ? 'output' : 'error', output);

        // Add hint if available
        if (hints?.ar) {
            addTerminalLine('hint', hints.ar);
        }

        // Update story state with discovered entities
        if (entities && success) {
            setStoryState(prev => ({
                ...prev,
                discoveredIPs: [...new Set([...prev.discoveredIPs, ...(entities.ips || [])])],
                openPorts: [...new Set([...prev.openPorts, ...(entities.ports || [])])],
                services: [...new Set([...prev.services, ...(entities.services || [])])],
                threats: [...new Set([...prev.threats, ...(entities.threats || [])])],
                commandsExecuted: [...prev.commandsExecuted, command]
            }));

            // Collect entities for task validation
            if (entities.ips) {
                entities.ips.forEach(ip => taskChain.collectEntity('ips', ip));
            }
            if (entities.ports) {
                entities.ports.forEach(port => taskChain.collectEntity('ports', port));
            }
            if (entities.services) {
                entities.services.forEach(service => taskChain.collectEntity('services', service));
            }
        }

        // Handle triggered events (e.g., defensive alerts)
        if (triggerEvent) {
            handleEvent(triggerEvent);
        }

        // Check if task is complete
        checkTaskProgress();

        // Log to analytics
        logEvent('CYBER_RANGE_COMMAND', {
            domain: 'cyber_range',
            chapter: currentChapter,
            role,
            tool,
            success
        });
    }

    // Add line to terminal
    function addTerminalLine(type, text) {
        setTerminalLines(prev => [...prev, { type, text }]);
    }

    // Check task completion
    function checkTaskProgress() {
        const isComplete = taskChain.checkTaskCompletion(
            storyState.commandsExecuted,
            taskChain.collectedEntities
        );

        if (isComplete && taskChain.currentTask) {
            // Task complete!
            const outputs = extractTaskOutputs(taskChain.currentTask);
            taskChain.completeTask(taskChain.currentTaskId, outputs);

            // Show success message
            addTerminalLine('hint', `\n✅ Task Complete: ${taskChain.currentTask?.title?.ar || 'Task Done'}\n`);

            // Check if all tasks in chapter complete
            if (taskChain.getProgress() === 100) {
                if (currentChapter < 5) {
                    setTimeout(() => {
                        setCurrentChapter(prev => prev + 1);
                        addTerminalLine('hint', `\n🚀 Moving to Chapter ${currentChapter + 1}...\n`);
                    }, 2000);
                } else {
                    setTimeout(() => {
                        setPhase('debrief');
                    }, 2000);
                }
            }
        }
    }

    // Extract outputs from current task state
    function extractTaskOutputs(task) {
        if (!task.outputs) return {};

        const outputs = {};
        Object.keys(task.outputs).forEach(key => {
            // Map story state to task outputs
            if (key === 'suspiciousIP') {
                outputs[key] = storyState.discoveredIPs.find(ip => ip.includes('45.33.22.11'));
            } else if (key === 'aliveHosts') {
                outputs[key] = storyState.discoveredIPs;
            } else if (key === 'openPorts') {
                outputs[key] = storyState.openPorts;
            }
            // ... other mappings
        });

        return outputs;
    }

    // Handle dynamic events
    function handleEvent(event) {
        if (event.type === 'DEFENSIVE_ALERT' && role === 'attacker') {
            addTerminalLine('hint', `\n${event.message?.ar}\n`);

            // Add log entry for defender
            if (role === 'defender') {
                addLog('warning', event.message?.ar);
            }
        }

        if (event.type === 'IP_BLOCKED') {
            setStoryState(prev => ({
                ...prev,
                blockedIPs: [...prev.blockedIPs, event.data.ip]
            }));
            addLog('info', `IP ${event.data.ip} has been blocked by firewall`);
        }
    }

    // Add system log (defender view)
    function addLog(level, message) {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8);
        setSystemLogs(prev => [...prev, { timestamp, level, message }]);
    }

    // Handle tool revelation (NOT execution)
    function handleToolReveal(tool) {
        // Show command syntax in terminal without executing
        addTerminalLine('hint', `\n💡 Tool: ${tool.name}\n   Syntax: ${tool.syntax}\n   Example: ${tool.examples[0]}\n`);
    }

    // Handle defensive actions
    function handleDefensiveAction(action) {
        if (action === 'block_ip') {
            const ip = storyState.discoveredIPs.find(ip => ip.includes('45.33.22.11'));
            if (ip) {
                addTerminalLine('hint', `\n🛡️ Quick Action: Use "iptables -A INPUT -s ${ip} -j DROP" to block this IP\n`);
            }
        } else if (action === 'isolate') {
            addTerminalLine('hint', '\n🔒 Quick Action: Use "systemctl stop networking" to isolate the system\n');
        }
    }

    // Handle node click on network map
    function handleNodeClick(node) {
        addTerminalLine('hint', `\n🔍 Node Details:\n   IP: ${node.ip}\n   Hostname: ${node.hostname || 'Unknown'}\n   Type: ${node.type}\n`);
    }

    // ========== PHASE RENDERERS ==========

    // Briefing phase: Role selection
    const renderBriefing = () => (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-5xl mx-auto animate-fadeIn">
            {/* Story intro */}
            <div className="mb-12">
                <h1 className="text-5xl font-bold text-white mb-4">
                    {SMARTGRID_STORY.title}
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    {SMARTGRID_STORY.incident?.ar}
                </p>
                <div className="mt-4 text-sm text-slate-500">
                    <Clock className="inline w-4 h-4 mr-2" />
                    {SMARTGRID_STORY.timeline.start} - {SMARTGRID_STORY.timeline.end}
                </div>
            </div>

            {/* Role selection */}
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Defender */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setRole('defender');
                        logEvent('CYBER_RANGE_ROLE_SELECTED', { domain: 'cyber_range', role: 'defender' });
                    }}
                    className="p-8 bg-blue-950/20 border-2 border-blue-500/30 rounded-2xl hover:bg-blue-950/40 hover:border-blue-500 transition-all group"
                >
                    <Shield className="w-20 h-20 text-blue-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <h2 className="text-3xl font-bold text-white mb-3">Defender</h2>
                    <p className="text-slate-400 mb-4 leading-relaxed">
                        {SMARTGRID_STORY.chapters[0].defenderGoal.ar}
                    </p>
                    <div className="text-xs text-blue-400 font-bold flex items-center justify-center gap-2">
                        <span>SOC Analyst Role</span>
                        <ChevronRight size={14} />
                    </div>
                </motion.button>

                {/* Attacker */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setRole('attacker');
                        logEvent('CYBER_RANGE_ROLE_SELECTED', { domain: 'cyber_range', role: 'attacker' });
                    }}
                    className="p-8 bg-red-950/20 border-2 border-red-500/30 rounded-2xl hover:bg-red-950/40 hover:border-red-500 transition-all group"
                >
                    <Skull className="w-20 h-20 text-red-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <h2 className="text-3xl font-bold text-white mb-3">Attacker</h2>
                    <p className="text-slate-400 mb-4 leading-relaxed">
                        {SMARTGRID_STORY.chapters[0].attackerGoal.ar}
                    </p>
                    <div className="text-xs text-red-400 font-bold flex items-center justify-center gap-2">
                        <span>Red Team Operator Role</span>
                        <ChevronRight size={14} />
                    </div>
                </motion.button>
            </div>
        </div>
    );

    // Show role-specific briefing and start button
    useEffect(() => {
        if (role && !currentScenario) return;

        if (role && phase === 'briefing') {
            // Delay to show role-specific briefing
            const timer = setTimeout(() => {
                setPhase('briefing-details');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [role, phase]);

    // Dynamic Events Logic
    useEffect(() => {
        if (phase !== 'simulation') return;

        const eventInterval = setInterval(() => {
            const rand = Math.random();
            if (rand < 0.1) { // 10% chance every 30s
                const events = [
                    { ar: '⚠️ تنبيه: تم اكتشاف محاولة اتصال غريبة من شبكة فرعية أخرى.', en: 'ALERT: Unusual connection attempt from another subnet detected.' },
                    { ar: 'ℹ️ تحديث: النظام يواجه حملاً مرتفعاً، قد تلاحظ بطء في استجابة الأوامر.', en: 'INFO: High system load detected, response times may increase.' },
                    { ar: '🚩 ملاحظة: تم تغيير شهادة SSL الخاصة بالخادم المستهدف.', en: 'NOTE: Target server SSL certificate has been rotated.' }
                ];
                const event = events[Math.floor(Math.random() * events.length)];
                addTerminalLine('error', `\n[SYSTEM EVENT] ${role === 'attacker' ? event?.en : event?.ar}\n`);

                logEvent('CYBER_RANGE_DYNAMIC_EVENT', {
                    domain: 'cyber_range',
                    chapter: currentChapter,
                    eventType: 'random_alert'
                });
            }
        }, 30000);

        return () => clearInterval(eventInterval);
    }, [phase, currentChapter, role]);

    // Detailed briefing with mission details
    const renderBriefingDetails = () => (
        <div className="h-full flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
            <div className={`w-full p-8 rounded-2xl border-2 ${role === 'defender'
                ? 'bg-blue-950/20 border-blue-500/30'
                : 'bg-red-950/20 border-red-500/30'
                }`}>
                <div className="text-center mb-6">
                    {role === 'defender' ? (
                        <Shield className="w-16 h-16 text-blue-500 mx-auto mb-3" />
                    ) : (
                        <Skull className="w-16 h-16 text-red-500 mx-auto mb-3" />
                    )}
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {currentScenario?.title?.ar || ''}
                    </h2>
                    <p className="text-slate-400">
                        {currentScenario?.objective?.ar || ''}
                    </p>
                </div>

                {/* Mission briefing */}
                <div className={`p-6 rounded-xl border whitespace-pre-line text-sm leading-relaxed mb-6 ${role === 'defender'
                    ? 'bg-blue-900/10 border-blue-500/20 text-blue-100'
                    : 'bg-red-900/10 border-red-500/20 text-red-100'
                    }`}>
                    {currentScenario?.briefing?.ar || ''}
                </div>

                {/* Start button */}
                <button
                    onClick={() => {
                        setPhase('setup');
                        logEvent('CYBER_RANGE_SETUP_STARTED', { domain: 'cyber_range', role, chapter: currentChapter });
                    }}
                    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all ${role === 'defender'
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                        : 'bg-red-600 hover:bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                        }`}
                >
                    <Play size={20} fill="white" />
                    <span>بدء المهمة - Start Mission</span>
                </button>
            </div>
        </div>
    );

    // Simulation phase: Main workspace
    const renderSimulation = () => {
        if (!role || !currentScenario) return null;

        return (
            <div className="h-full flex flex-col bg-[#02010a]">
                {/* HUD Header */}
                <div className="h-14 border-b border-white/10 bg-[#0a0a12] flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${role === 'attacker'
                            ? 'bg-red-600/20 text-red-500 border border-red-500/30'
                            : 'bg-blue-600/20 text-blue-500 border border-blue-500/30'
                            }`}>
                            {role === 'attacker' ? 'Red Team' : 'Blue Team'}
                        </div>

                        <div className="text-slate-300 text-sm font-mono">
                            Chapter {currentChapter}: {SMARTGRID_STORY.chapters[currentChapter - 1]?.title?.ar}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Current task */}
                        {taskChain.currentTask && (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-slate-500 uppercase">Current Task</span>
                                <span className="text-xs font-bold text-white">
                                    {taskChain.currentTask?.title?.ar || '...'}
                                </span>
                            </div>
                        )}

                        {/* Progress */}
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                            <Activity size={16} className="text-green-500" />
                            <span className="font-bold text-sm">{taskChain.getProgress()}%</span>
                        </div>
                    </div>
                </div>

                {/* Workspace */}
                <div className="flex-1 overflow-hidden">
                    <WorkspaceLayout
                        role={role}
                        currentChapter={currentChapter}
                        currentTask={taskChain.currentTask}
                        // Terminal
                        onCommandExecute={(cmd) => {
                            const result = executeCommand(cmd);
                            // Result is already handled by onOutputGenerated callback
                        }}
                        terminalLines={terminalLines}
                        availableCommands={availableTools.map(t => t.name)}
                        // Network map
                        discoveredIPs={storyState.discoveredIPs}
                        compromisedSystems={storyState.compromisedSystems}
                        blockedIPs={storyState.blockedIPs}
                        onNodeClick={handleNodeClick}
                        // Tools
                        availableTools={availableTools}
                        lockedTools={[]} // TODO: implement locked tools based on task
                        onToolReveal={handleToolReveal}
                        // Logs/Target
                        logs={systemLogs}
                        targetStatus={role === 'attacker' ? {
                            hostname: 'smartgrid-ctrl-01',
                            ip: storyState.discoveredIPs.includes('192.168.1.55') ? '192.168.1.55' : null,
                            os: 'Ubuntu Server 20.04',
                            openPorts: storyState.openPorts.map(p => ({
                                number: p,
                                service: storyState.services.find(s => true) || 'unknown',
                                vulnerable: p === 502
                            })),
                            compromised: storyState.compromisedSystems.length > 0,
                            loot: []
                        } : {}}
                        onDefensiveAction={handleDefensiveAction}
                        onDecisionSelect={(choice) => {
                            addTerminalLine('hint', `\nDecision Made: ${choice?.title?.ar || ''}\nResult: ${choice?.consequence?.ar || 'Moving to next phase'}\n`);

                            logEvent('CYBER_RANGE_DECISION', {
                                domain: 'cyber_range',
                                taskId: taskChain.currentTaskId,
                                choiceId: choice.id,
                                score: choice.score
                            });

                            taskChain.completeTask(taskChain.currentTaskId, { decision: choice.id });
                        }}
                    />
                </div>
            </div>
        );
    };

    // Debrief phase: Results
    const renderDebrief = () => (
        <div className="h-full flex flex-col items-center justify-center p-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
            >
                <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto mb-6">
                    <Activity size={48} className="text-green-500" />
                </div>

                <h2 className="text-4xl font-bold text-white mb-4">Mission Complete</h2>
                <p className="text-slate-400 mb-8">
                    Chapter 1: {SMARTGRID_STORY.chapters[0]?.title?.ar}
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 max-w-md mx-auto">
                    <div className="text-6xl font-bold text-white mb-2">{taskChain.getProgress()}%</div>
                    <div className="text-sm text-slate-500">Tasks Completed</div>
                </div>

                <button
                    onClick={() => window.location.href = '/attacks'}
                    className="px-8 py-3 bg-[#7112AF] hover:bg-[#5a0e8c] text-white rounded-xl font-bold transition-all"
                >
                    Return to Attack Library
                </button>
            </motion.div>
        </div>
    );

    // ========== MAIN RENDER ==========

    return (
        <div className="h-screen w-screen bg-[#02010a] text-white overflow-hidden flex flex-col font-cairo">
            <MatrixBackground />

            <div className="flex-1 relative z-10 overflow-hidden">
                <AnimatePresence mode="wait">
                    {phase === 'briefing' && !role && (
                        <motion.div
                            key="briefing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full"
                        >
                            {renderBriefing()}
                        </motion.div>
                    )}

                    {phase === 'briefing-details' && role && (
                        <motion.div
                            key="briefing-details"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            {renderBriefingDetails()}
                        </motion.div>
                    )}

                    {phase === 'setup' && role && (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex items-center justify-center"
                        >
                            <PreSetupPhase
                                role={role}
                                onComplete={(config) => {
                                    setSetupConfig(config);
                                    setPhase('simulation');
                                    logEvent('CYBER_RANGE_SETUP_COMPLETE', { domain: 'cyber_range', role, config });
                                }}
                            />
                        </motion.div>
                    )}

                    {phase === 'simulation' && (
                        <motion.div
                            key="simulation"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full"
                        >
                            {renderSimulation()}
                        </motion.div>
                    )}

                    {phase === 'debrief' && (
                        <motion.div
                            key="debrief"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full flex items-center justify-center"
                        >
                            <AssessmentScreen
                                role={role}
                                progress={taskChain.getProgress()}
                                score={85} // TODO: Calculate based on decisions and speed
                                onRestart={() => window.location.reload()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
