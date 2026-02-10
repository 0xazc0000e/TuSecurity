import React, { useState, useEffect } from 'react';
import {
    RefreshCw, CheckCircle, Terminal, BookOpen,
    Trophy, ChevronRight, Play, Layers, Target, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MiniWindows } from './MiniWindows';
import { MiniTerminal } from './MiniTerminal';
import HintSystem from './HintSystem';
import { BASH_LEVELS } from '../../../data/bashLevels';
import {
    loadProgress,
    updateProgress,
    completeTask
} from '../../../utils/progressManager';
import { INITIAL_VFS } from './bashUtils';

export default function SimulationTab() {
    const [progress, setProgress] = useState(loadProgress());
    const [vfs, setVfs] = useState(INITIAL_VFS);
    const [currentPath, setCurrentPath] = useState('/home/user');
    const [lastCommand, setLastCommand] = useState('');

    // View: 'stages' | 'theory' | 'practice'
    const [view, setView] = useState('stages');
    const [currentLevelId] = useState('level-1'); // Only Level 1 for now
    const [currentStageId, setCurrentStageId] = useState(null);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [showHints, setShowHints] = useState(false);

    const currentLevel = BASH_LEVELS.find(l => l.id === currentLevelId);
    const currentStage = currentLevel?.stages.find(s => s.id === currentStageId);
    const currentTask = currentStage?.tasks.find(t => t.id === currentTaskId);

    // Start a stage
    const startStage = (stageId) => {
        setCurrentStageId(stageId);
        const stage = currentLevel.stages.find(s => s.id === stageId);
        if (stage && stage.tasks.length > 0) {
            setCurrentTaskId(stage.tasks[0].id);
            setView('theory'); // Always start with theory
        }
    };

    const goToPractice = () => {
        setView('practice');
    };

    const handleCommandExecuted = (cmd, output) => {
        // Check if task completed
        if (currentTask && currentTask.validation && currentTask.validation.type === 'command') {
            const isComplete = currentTask.validation.check(cmd, output, { currentPath });
            if (isComplete) {
                const xp = currentTask.xp || 0;
                const updatedProgress = completeTask(currentTaskId, xp, currentLevelId, currentStageId);
                setProgress(updatedProgress);

                // Move to next task
                moveToNextTask();
            }
        }
    };

    const moveToNextTask = () => {
        if (!currentStage) return;
        const currentTaskIndex = currentStage.tasks.findIndex(t => t.id === currentTaskId);

        if (currentTaskIndex < currentStage.tasks.length - 1) {
            const nextTask = currentStage.tasks[currentTaskIndex + 1];
            setCurrentTaskId(nextTask.id);
            // If next task is theory, switch to theory view
            if (nextTask.type === 'theory') {
                setView('theory');
            }
        } else {
            // Stage complete - return to stages list
            setView('stages');
            setCurrentStageId(null);
            setCurrentTaskId(null);
        }
    };

    const handleReset = () => {
        setVfs(INITIAL_VFS);
        setCurrentPath('/home/user');
        setLastCommand('');
    };

    // ===== STAGES LIST VIEW =====
    const renderStagesList = () => (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-3">
                        {currentLevel?.title}
                    </h2>
                    <p className="text-lg text-slate-400">
                        {currentLevel?.subtitle}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <span className="text-purple-400 font-bold">{progress.totalXP} XP</span>
                        </div>
                    </div>
                </div>

                {/* Stages Grid */}
                <div className="grid gap-6">
                    {currentLevel?.stages.map((stage, idx) => {
                        const isCompleted = progress.completedStages.includes(stage.id);
                        const tasksCount = stage.tasks.length;
                        const completedTasksCount = stage.tasks.filter(t =>
                            progress.completedTasks.includes(t.id)
                        ).length;
                        const stageProgress = tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 0;

                        return (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => startStage(stage.id)}
                                className="group bg-[#0d0d0d] border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all cursor-pointer"
                                dir="rtl"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="text-xs text-purple-400 font-bold mb-2">
                                            المرحلة {stage.stageNumber}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                            {stage.title}
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            {stage.description}
                                        </p>
                                    </div>

                                    {isCompleted ? (
                                        <CheckCircle className="text-emerald-400" size={24} />
                                    ) : (
                                        <ChevronRight className="text-purple-400 group-hover:translate-x-1 transition-transform" size={24} />
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>{completedTasksCount} / {tasksCount} مهام</span>
                                        <span>{stageProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                                            style={{ width: `${stageProgress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* XP Badge */}
                                <div className="flex items-center gap-2 text-xs text-yellow-500">
                                    <Trophy size={14} />
                                    <span>{stage.xp} XP</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    // ===== THEORY VIEW =====
    const renderTheory = () => {
        if (!currentTask || currentTask.type !== 'theory') {
            // Auto-skip to practice if not theory
            if (currentTask?.type === 'interactive') {
                setView('practice');
            }
            return null;
        }

        return (
            <div className="h-full flex flex-col bg-[#0a0a0a]" dir="rtl">
                {/* Header */}
                <div className="flex-shrink-0 p-6 border-b border-white/10 bg-gradient-to-b from-blue-500/10 to-transparent">
                    <button
                        onClick={() => setView('stages')}
                        className="flex items-center gap-2 text-blue-400 text-sm mb-4 hover:text-blue-300 transition-colors"
                    >
                        <Layers size={14} />
                        <span>العودة للمراحل</span>
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <BookOpen size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {currentTask.title}
                            </h2>
                            <p className="text-sm text-slate-400">
                                {currentStage?.title}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="max-w-3xl mx-auto prose prose-invert prose-slate">
                        {currentTask.content && (
                            <div
                                className="text-slate-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: currentTask.content.replace(/\n/g, '<br/>') }}
                            />
                        )}
                    </div>
                </div>

                {/* Next Button */}
                <div className="flex-shrink-0 p-6 border-t border-white/10">
                    <button
                        onClick={moveToNextTask}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg text-white font-bold transition-all"
                    >
                        <span>التالي</span>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };

    // ===== PRACTICE VIEW =====
    const renderPractice = () => {
        if (!currentTask || currentTask.type !== 'interactive') {
            return null;
        }

        return (
            <div className="h-full flex" dir="ltr">
                {/* Main Area - Terminal & File Explorer */}
                <div className="flex-1 flex flex-col bg-[#0a0a0a]">
                    {/* Task Bar - Clear instruction */}
                    <div className="flex-shrink-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-purple-500/30 p-4" dir="rtl">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Target size={20} className="text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-1">
                                    {currentTask.title}
                                </h3>
                                {currentTask.instructions && (
                                    <div className="bg-black/20 border border-white/10 rounded-lg p-3 mb-2">
                                        <div className="text-sm font-mono text-cyan-400">
                                            ← {currentTask.instructions}
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm text-slate-300">
                                    {currentTask.description}
                                </p>
                            </div>
                            <div className="text-xs text-yellow-500 font-bold bg-yellow-900/10 px-3 py-1 rounded border border-yellow-500/20">
                                {currentTask.xp} XP
                            </div>
                        </div>
                    </div>

                    {/* Terminal & File Explorer */}
                    <div className="flex-1 flex overflow-hidden p-6 gap-6">
                        {/* File Explorer */}
                        <div className="w-1/3 min-w-[280px] max-w-[400px]">
                            <MiniWindows vfs={vfs} currentPath={currentPath} />
                        </div>

                        {/* Terminal */}
                        <div className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden">
                            <MiniTerminal
                                vfs={vfs}
                                setVfs={setVfs}
                                currentPath={currentPath}
                                setCurrentPath={setCurrentPath}
                                setLastCommand={setLastCommand}
                                onCommandExecuted={handleCommandExecuted}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Hints & Help */}
                <div className="w-80 bg-[#0d0d0d] border-l border-white/5 flex flex-col" dir="rtl">
                    <div className="p-4 border-b border-white/10">
                        <button
                            onClick={() => setView('stages')}
                            className="flex items-center gap-2 text-purple-400 text-sm hover:text-purple-300 transition-colors"
                        >
                            <Layers size={14} />
                            <span>العودة للمراحل</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                        {/* Hints */}
                        {currentTask.hints && currentTask.hints.length > 0 && (
                            <div className="mb-4">
                                <button
                                    onClick={() => setShowHints(!showHints)}
                                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-3 transition-colors"
                                >
                                    <Lightbulb size={16} />
                                    <span className="text-sm font-bold">
                                        {showHints ? 'إخفاء' : 'عرض'} التلميحات
                                    </span>
                                </button>
                                {showHints && (
                                    <HintSystem hints={currentTask.hints} />
                                )}
                            </div>
                        )}

                        {/* Theory Link if available */}
                        {currentTask.theory && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <div className="text-xs text-blue-400 font-bold mb-2">💡 نظرية</div>
                                <p className="text-xs text-slate-300">{currentTask.theory}</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleReset}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-400 hover:text-white transition-all"
                        >
                            <RefreshCw size={14} />
                            <span>إعادة تعيين</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-[#0a0a0a]">
            {view === 'stages' && renderStagesList()}
            {view === 'theory' && renderTheory()}
            {view === 'practice' && renderPractice()}
        </div>
    );
}
