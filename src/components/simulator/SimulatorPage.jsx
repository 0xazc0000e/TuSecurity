import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Sword, ChevronLeft, ChevronRight, Skull,
    Trophy, Clock, Zap, CheckCircle, ArrowRight, Play
} from 'lucide-react';
// Note: Using CSS Grid layout instead of react-resizable-panels for reliable sizing

// Hooks
import { useSimulator } from '../../hooks/useSimulator';
import { useScoring } from '../../hooks/useScoring';

// Panels
import ToolkitPanel from './panels/ToolkitPanel';
import TaskPanel from './panels/TaskPanel';
import TerminalPanel from './panels/TerminalPanel';
import MentorPanel from './panels/MentorPanel';
import NotepadPanel from './panels/NotepadPanel';
import NetworkMapPanel from './panels/NetworkMapPanel';
import sfx from '../../utils/SoundEffects';

// Scenario Data
import scenarioData from '../../data/scenarios/ransomware-op.json';

// === Role Selection Screen ===
const RoleSelection = ({ scenario, onStart, onBack }) => (
    <div className="min-h-screen bg-[#050214] flex items-center justify-center p-8 font-cairo" dir="rtl">
        <div className="max-w-5xl w-full">
            <button
                onClick={onBack}
                className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
            >
                <ChevronRight className="ml-1" /> العودة لمكتبة التهديدات
            </button>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{scenario.title}</h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">{scenario.description}</p>
                <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                    <span className="flex items-center gap-2 text-yellow-400">
                        <Trophy size={16} /> {scenario.xpReward} XP
                    </span>
                    <span className="flex items-center gap-2 text-blue-400">
                        <Clock size={16} /> {scenario.estimatedTime} دقيقة
                    </span>
                    <span className="flex items-center gap-2 text-purple-400">
                        <Zap size={16} /> {scenario.difficulty}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Attacker Card */}
                <div
                    onClick={() => onStart('attacker')}
                    className="relative group border rounded-2xl p-8 cursor-pointer transition-all duration-500 overflow-hidden transform hover:-translate-y-2 bg-gradient-to-br from-[#1a0505] to-[#0a0505] border-red-900/30 hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.2)]"
                >
                    <div className="absolute top-0 left-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Skull size={180} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <Sword size={28} className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-red-500">مسار المهاجم</h3>
                                <p className="text-white font-bold">{scenario.roles.attacker.title}</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {scenario.roles.attacker.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                            <span className="px-2 py-1 bg-red-500/10 rounded">Red Team</span>
                            <span className="px-2 py-1 bg-white/5 rounded">{scenario.phases.length} مراحل</span>
                        </div>
                        <button className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold shadow-lg hover:from-red-500 hover:to-red-600 transition-all flex items-center justify-center gap-2">
                            <Play size={20} /> بدء الهجوم
                        </button>
                    </div>
                </div>

                {/* Defender Card */}
                <div
                    onClick={() => onStart('defender')}
                    className="relative group border rounded-2xl p-8 cursor-pointer transition-all duration-500 overflow-hidden transform hover:-translate-y-2 bg-gradient-to-br from-[#050a1a] to-[#050510] border-blue-900/30 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.2)]"
                >
                    <div className="absolute top-0 left-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Shield size={180} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Shield size={28} className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-blue-500">مسار المدافع</h3>
                                <p className="text-white font-bold">{scenario.roles.defender.title}</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {scenario.roles.defender.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                            <span className="px-2 py-1 bg-blue-500/10 rounded">Blue Team</span>
                            <span className="px-2 py-1 bg-white/5 rounded">{scenario.phases.length} مراحل</span>
                        </div>
                        <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-lg hover:from-blue-500 hover:to-blue-600 transition-all flex items-center justify-center gap-2">
                            <Shield size={20} /> بدء الدفاع
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// === Story Phase Component ===
const StoryPhase = ({ storyData, onComplete, role }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const isAttacker = role === 'attacker';

    const handleNext = () => {
        if (currentIndex < storyData.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const current = storyData[currentIndex];

    return (
        <div className="flex items-center justify-center h-full p-8 font-cairo" dir="rtl">
            <div className={`w-full max-w-2xl p-1 rounded-3xl bg-gradient-to-r shadow-2xl ${isAttacker ? 'from-red-900 to-red-600' : 'from-blue-900 to-blue-600'}`}>
                <div className="bg-[#0f1115] rounded-[22px] p-10 min-h-[300px] flex flex-col justify-between">
                    <div>
                        <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border mb-6 ${current.type === 'system' ? 'border-gray-500 bg-gray-500/10 text-gray-400' :
                            current.type === 'handler' ? 'border-purple-500 bg-purple-500/10 text-purple-400' :
                                current.type === 'alert' ? 'border-red-500 bg-red-500/10 text-red-400' :
                                    current.type === 'critical' ? 'border-orange-500 bg-orange-500/10 text-orange-400 animate-pulse' :
                                        'border-white/10 bg-white/5 text-gray-300'
                            }`}>
                            {current.speaker}
                        </div>
                        <p className="text-2xl md:text-3xl text-white leading-relaxed font-light">
                            "{current.text}"
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-10">
                        <div className="flex gap-1">
                            {storyData.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? (isAttacker ? 'bg-red-500 w-6' : 'bg-blue-500 w-6') : 'bg-gray-700'}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={handleNext}
                            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all ${isAttacker ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/30' : 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30'
                                }`}
                        >
                            {currentIndex === storyData.length - 1 ? 'متابعة' : 'التالي'} <ArrowRight size={20} className="mr-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === Mission Complete Screen ===
const MissionComplete = ({ role, scoring, scenario, onHome }) => {
    const isAttacker = role === 'attacker';
    const summary = scoring.getSummary();
    const debrief = scenario.debrief[role];

    useEffect(() => {
        scoring.submitToProfile();
    }, []);

    return (
        <div className="min-h-screen bg-[#050214] flex items-center justify-center p-8 font-cairo" dir="rtl">
            <div className="max-w-2xl w-full text-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto shadow-[0_0_60px_rgba(0,0,0,0.5)] ${isAttacker ? 'bg-red-600 shadow-red-900/50' : 'bg-green-600 shadow-green-900/50'}`}>
                    <CheckCircle size={48} className="text-white" />
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">تم إنجاز المهمة بنجاح!</h1>
                <p className="text-gray-400 mb-8">{debrief.summary}</p>

                {/* Score Summary */}
                <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-yellow-400">{summary.totalScore}</p>
                            <p className="text-xs text-gray-500">النقاط</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-purple-400">{summary.grade}</p>
                            <p className="text-xs text-gray-500">التقدير</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-400">{summary.bonusTasksCompleted}</p>
                            <p className="text-xs text-gray-500">ألغاز</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">{summary.hintsUsed}</p>
                            <p className="text-xs text-gray-500">تلميحات</p>
                        </div>
                    </div>
                </div>

                {/* Real World Context */}
                <div className="bg-purple-500/10 rounded-xl p-6 mb-8 border border-purple-500/30 text-right">
                    <h3 className="text-lg font-bold text-purple-400 mb-2">في العالم الحقيقي</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{debrief.realWorld}</p>
                </div>

                {debrief.ethicalNote && (
                    <div className="bg-orange-500/10 rounded-xl p-4 mb-8 border border-orange-500/30 text-right">
                        <p className="text-sm text-orange-300">{debrief.ethicalNote}</p>
                    </div>
                )}

                <button
                    onClick={onHome}
                    className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto"
                >
                    <ChevronRight size={20} /> العودة لمكتبة التهديدات
                </button>
            </div>
        </div>
    );
};

// === Main Simulator Page ===
export default function SimulatorPage() {
    const navigate = useNavigate();
    const simulator = useSimulator(scenarioData);
    const scoring = useScoring(scenarioData.id);

    const [activeTool, setActiveTool] = useState(null);
    const [activeNode, setActiveNode] = useState(null);
    const [mentorMessages, setMentorMessages] = useState([]);
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(true);

    const { role, currentPhase, phaseState, currentPhaseIndex, totalPhases } = simulator;
    const isAttacker = role === 'attacker';

    // Get role-specific data
    const currentStory = currentPhase?.story?.[role] || [];
    const currentTools = currentPhase?.tools?.[role] || [];
    const currentTasks = currentPhase?.tasks?.[role] || [];
    const currentQuestions = currentPhase?.questions?.[role] || [];
    const terminalConfig = currentPhase?.terminalConfig?.[role] || {};

    // Sound Effects
    // ... existing imports ...

    // Handle terminal command
    const handleCommand = useCallback((cmd) => {
        const baseCmd = cmd.split(' ')[0].toLowerCase();
        sfx.play('typing');

        // Add user command to history
        simulator.addTerminalLine({ type: 'user', text: cmd });

        // Check if command matches any task
        let taskCompleted = false;
        currentTasks.forEach(task => {
            if (!simulator.isTaskCompleted(task.id) && task.validation) {
                const cmdMatches = task.validation.command && baseCmd.includes(task.validation.command);
                const argsMatch = !task.validation.argsContain || cmd.toLowerCase().includes(task.validation.argsContain.toLowerCase());

                if (cmdMatches && argsMatch) {
                    taskCompleted = true;
                    simulator.completeTask(task.id, task.points);
                    sfx.play('task_complete'); // Success sound

                    if (task.type === 'bonus') {
                        scoring.completeBonusTask(task.points);
                    } else {
                        scoring.completeRequiredTask(task.points);
                    }

                    simulator.addTerminalLine({ type: 'success', text: terminalConfig.successOutput || 'Command executed successfully.' });

                    // Add mentor explanation
                    setMentorMessages(prev => [...prev, {
                        type: 'info',
                        title: `تم تنفيذ: ${baseCmd}`,
                        text: currentPhase.mentorNotes?.[role] || 'أحسنت! أكملت هذه المهمة بنجاح.',
                        command: cmd
                    }]);
                }
            }
        });

        if (!taskCompleted) {
            // Check if it's a valid tool command
            const validTool = currentTools.find(t => t.id === baseCmd);
            if (validTool) {
                setActiveTool(baseCmd);
                simulator.addTerminalLine({ type: 'info', text: `Using ${validTool.name}...` });
                sfx.play('command_success'); // Regular command success
            } else if (['clear', 'help', 'ls', 'whoami'].includes(baseCmd)) {
                // Basic commands
                sfx.play('command_success');
            } else {
                simulator.addTerminalLine({ type: 'error', text: `Command not found: ${baseCmd}` });
                sfx.play('command_error'); // Error sound
            }
        }
    }, [currentTasks, currentTools, simulator, scoring, terminalConfig, currentPhase, role]);

    // Handle task completion check
    const handleTaskComplete = useCallback((taskId) => {
        const task = currentTasks.find(t => t.id === taskId);
        if (task && !simulator.isTaskCompleted(taskId)) {
            simulator.completeTask(taskId, task.points);
            scoring.completeRequiredTask(task.points);
        }
    }, [currentTasks, simulator, scoring]);

    // Handle question answer
    const handleQuestionAnswer = useCallback((questionId, isCorrect) => {
        if (isCorrect) {
            scoring.correctFirstTry(50);
        } else {
            scoring.recordWrongAnswer(10);
        }
    }, [scoring]);

    // Handle hint usage
    const handleUseHint = useCallback((cost) => {
        scoring.useHint(cost);
    }, [scoring]);

    // Check if phase is complete
    const isPhaseComplete = useCallback(() => {
        const requiredTasks = currentTasks.filter(t => t.type === 'required');
        return requiredTasks.every(t => simulator.isTaskCompleted(t.id));
    }, [currentTasks, simulator]);

    // Effect to auto-advance when all tasks complete
    useEffect(() => {
        if (phaseState === 'workspace' && isPhaseComplete()) {
            setTimeout(() => {
                simulator.nextPhase();
            }, 2000);
        }
    }, [phaseState, isPhaseComplete, simulator]);

    // === Render Logic ===

    // Role Selection
    if (!role) {
        return (
            <RoleSelection
                scenario={scenarioData}
                onStart={simulator.startSimulation}
                onBack={() => navigate('/attacks')}
            />
        );
    }

    // Mission Complete
    if (phaseState === 'complete') {
        return (
            <MissionComplete
                role={role}
                scoring={scoring}
                scenario={scenarioData}
                onHome={() => navigate('/attacks')}
            />
        );
    }

    // Story Phase
    if (phaseState === 'story') {
        return (
            <div className="h-screen bg-[#050214]">
                <StoryPhase
                    storyData={currentStory}
                    onComplete={simulator.completeStory}
                    role={role}
                />
            </div>
        );
    }

    // Questions Phase
    if (phaseState === 'questions') {
        return (
            <div className="min-h-screen bg-[#050214] flex items-center justify-center p-8 font-cairo" dir="rtl">
                <div className="max-w-xl w-full">
                    <h2 className="text-2xl font-bold text-white mb-2 text-center">{currentPhase.title}</h2>
                    <p className="text-gray-400 text-center mb-8">أجب على الأسئلة للمتابعة</p>

                    <TaskPanel
                        tasks={[]}
                        questions={currentQuestions}
                        onQuestionAnswer={(qId, correct) => {
                            handleQuestionAnswer(qId, correct);
                            // Auto-advance after all questions answered
                            setTimeout(() => simulator.completeQuestions(), 1500);
                        }}
                        onUseHint={handleUseHint}
                        role={role}
                    />
                </div>
            </div>
        );
    }

    // Main Workspace
    return (
        <div className="h-screen bg-[#050214] flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className={`h-14 border-b flex items-center justify-between px-4 flex-shrink-0 ${isAttacker ? 'bg-red-950/30 border-red-900/30' : 'bg-blue-950/30 border-blue-900/30'}`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/attacks')}
                        className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronRight size={18} />
                        <span className="text-sm font-cairo">الخروج</span>
                    </button>
                    <div className="h-6 w-px bg-white/10"></div>
                    <h1 className="text-white font-bold font-cairo">{scenarioData.title}</h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Progress */}
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 font-cairo">المرحلة</span>
                        <span className={`font-bold ${isAttacker ? 'text-red-400' : 'text-blue-400'}`}>
                            {currentPhaseIndex + 1}/{totalPhases}
                        </span>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-2 text-sm bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                        <Trophy size={14} className="text-yellow-400" />
                        <span className="font-bold text-yellow-400">{scoring.score}</span>
                    </div>

                    {/* Role Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isAttacker ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                        {isAttacker ? <Sword size={14} /> : <Shield size={14} />}
                        <span className="text-sm font-bold font-cairo">{isAttacker ? 'مهاجم' : 'مدافع'}</span>
                    </div>
                </div>
            </header>

            {/* Phase Title Bar */}
            <div className={`h-12 border-b flex items-center justify-center gap-4 ${isAttacker ? 'bg-red-900/10 border-red-900/20' : 'bg-blue-900/10 border-blue-900/20'}`}>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${isAttacker ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    المرحلة {currentPhaseIndex + 1}
                </div>
                <h2 className="text-white font-bold font-cairo">{currentPhase?.title}</h2>
                <span className="text-gray-500 font-cairo">|</span>
                <span className="text-gray-400 text-sm font-cairo">{currentPhase?.concept}</span>
            </div>

            {/* Main Content - Using CSS Grid for reliable layout */}
            <div className="flex-1 grid grid-cols-[280px_1fr_320px] overflow-hidden">
                {/* Left Panel - Tasks & Tools */}
                <div className="h-full flex flex-col bg-[#0a0a0f] border-r border-white/10 overflow-hidden">
                    {/* Tasks Section */}
                    <div className="flex-1 overflow-hidden min-h-0">
                        <TaskPanel
                            tasks={currentTasks}
                            questions={[]}
                            completedTasks={simulator.completedTasks[currentPhaseIndex] || {}}
                            onTaskComplete={handleTaskComplete}
                            onQuestionAnswer={handleQuestionAnswer}
                            onUseHint={handleUseHint}
                            role={role}
                        />
                    </div>

                    {/* Divider */}
                    <div className="h-1 bg-white/10 flex-shrink-0" />

                    {/* Tools Section */}
                    <div className="flex-1 overflow-hidden min-h-0">
                        <ToolkitPanel
                            tools={currentTools}
                            activeTool={activeTool}
                            onToolSelect={setActiveTool}
                            role={role}
                        />
                    </div>
                </div>

                {/* Center - Terminal */}
                <div className="h-full p-4 overflow-hidden">
                    <TerminalPanel
                        history={simulator.terminalHistory}
                        onCommand={handleCommand}
                        config={terminalConfig}
                        role={role}
                        availableCommands={[...currentTools.map(t => t.id), 'clear', 'help', 'ls', 'whoami']}
                    />
                </div>

                {/* Right Panel - Mentor & Notes */}
                <div className="h-full flex flex-col bg-[#0a0a0f] border-l border-white/10 overflow-hidden">
                    {/* Network Map Section */}
                    <div className="flex-[2] overflow-hidden min-h-0 border-b border-white/10">
                        <NetworkMapPanel
                            nodes={scenarioData.networkMap?.nodes}
                            connections={scenarioData.networkMap?.connections}
                            discoveredNodes={simulator.networkState?.discovered || []}
                            compromisedNodes={simulator.networkState?.compromised || []}
                            blockedNodes={simulator.networkState?.blocked || []}
                            activeNode={activeNode}
                            onNodeClick={(node) => setActiveNode(node.id)}
                            role={role}
                        />
                    </div>

                    {/* Mentor Section */}
                    <div className="flex-[2] overflow-hidden min-h-0">
                        <MentorPanel
                            messages={mentorMessages}
                            currentPhase={currentPhase}
                            role={role}
                        />
                    </div>

                    {/* Divider */}
                    <div className="h-1 bg-white/10 flex-shrink-0" />

                    {/* Notes Section */}
                    <div className="flex-[1] overflow-hidden min-h-0">
                        <NotepadPanel
                            scenarioId={scenarioData.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
