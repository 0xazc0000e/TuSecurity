import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Terminal, Book, Target, Award, Clock, CheckCircle, Lock, Play, HelpCircle } from 'lucide-react';
import { BASH_CURRICULUM } from '../data/bashCurriculum';
import { useNavigate } from 'react-router-dom';

export default function BashSimulatorNew() {
    const navigate = useNavigate();
    const [currentStage, setCurrentStage] = useState(0);
    const [currentUnit, setCurrentUnit] = useState(0);
    const [currentTask, setCurrentTask] = useState(0);
    const [completedTasks, setCompletedTasks] = useState({});
    const [showTheory, setShowTheory] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState('');
    const [currentCommand, setCurrentCommand] = useState('');
    const [score, setScore] = useState(0);
    const [hints, setHints] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const terminalRef = useRef(null);

    const stage = BASH_CURRICULUM.stages[currentStage];
    const unit = stage.units[currentUnit];
    const task = unit.tasks[currentTask];
    const progress = calculateProgress();

    function calculateProgress() {
        let total = 0;
        let completed = 0;
        BASH_CURRICULUM.stages.forEach((stage, sIndex) => {
            stage.units.forEach((unit, uIndex) => {
                unit.tasks.forEach((task, tIndex) => {
                    total++;
                    if (completedTasks[`${sIndex}-${uIndex}-${tIndex}`]) {
                        completed++;
                    }
                });
            });
        });
        return (completed / total) * 100;
    }

    const executeCommand = () => {
        const output = `$ ${currentCommand}\n`;
        
        if (currentCommand.trim() === task.command) {
            const successOutput = `${output}✅ Correct! Well done!\n${task.expectedOutput ? `Output: ${task.expectedOutput}\n` : ''}`;
            setTerminalOutput(prev => prev + successOutput);
            
            if (!completedTasks[`${currentStage}-${currentUnit}-${currentTask}`]) {
                const taskKey = `${currentStage}-${currentUnit}-${currentTask}`;
                setCompletedTasks(prev => ({ ...prev, [taskKey]: true }));
                setScore(prev => prev + task.xp);
            }
            
            setTimeout(() => {
                nextTask();
            }, 2000);
        } else {
            const errorOutput = `${output}❌ Not quite right. Try again!\n`;
            setTerminalOutput(prev => prev + errorOutput);
        }
        
        setCurrentCommand('');
    };

    const nextTask = () => {
        if (currentTask < unit.tasks.length - 1) {
            setCurrentTask(prev => prev + 1);
            setShowHint(false);
        } else if (currentUnit < stage.units.length - 1) {
            setCurrentUnit(prev => prev + 1);
            setCurrentTask(0);
            setShowHint(false);
        } else if (currentStage < BASH_CURRICULUM.stages.length - 1) {
            setCurrentStage(prev => prev + 1);
            setCurrentUnit(0);
            setCurrentTask(0);
            setShowHint(false);
        } else {
            // Course completed
            setTerminalOutput(prev => prev + '\n🎉 Congratulations! You completed the entire Bash course!\n');
        }
    };

    const useHint = () => {
        if (task.hints && hints < task.hints.length) {
            setShowHint(true);
            setHints(prev => prev + 1);
            setScore(prev => Math.max(0, prev - 5)); // Deduct points for hints
        }
    };

    const resetTerminal = () => {
        setTerminalOutput('');
        setCurrentCommand('');
    };

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            {/* Header */}
            <div className="border-b border-white/10 bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <Terminal className="text-green-400" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{BASH_CURRICULUM.title}</h1>
                                <p className="text-gray-400 text-sm">{BASH_CURRICULUM.description}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Award className="text-yellow-400" size={20} />
                                <span className="font-bold text-yellow-400">{score} XP</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="text-purple-400" size={20} />
                                <span className="text-purple-400">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="text-blue-400" size={20} />
                                <span className="text-blue-400">{stage.duration}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-[#0a0a0f] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-200px)]">
                {/* Left Sidebar - Curriculum Navigation */}
                <div className="w-80 bg-[#0a0a0f] border-l border-white/10 overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Book size={20} />
                            المنهج الدراسي
                        </h3>
                        
                        {BASH_CURRICULUM.stages.map((stage, sIndex) => (
                            <div key={stage.id} className="mb-6">
                                <div 
                                    className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                                        currentStage === sIndex 
                                            ? 'bg-green-500/20 border border-green-500/30' 
                                            : 'bg-white/5 hover:bg-white/10'
                                    }`}
                                    onClick={() => {
                                        setCurrentStage(sIndex);
                                        setCurrentUnit(0);
                                        setCurrentTask(0);
                                    }}
                                >
                                    <span className="text-2xl">{stage.icon}</span>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">{stage.title}</h4>
                                        <p className="text-xs text-gray-400">{stage.description}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-green-400">{stage.xp} XP</span>
                                            <span className="text-xs text-gray-500">•</span>
                                            <span className="text-xs text-gray-400">{stage.duration}</span>
                                        </div>
                                    </div>
                                    {currentStage === sIndex && <CheckCircle className="text-green-400" size={20} />}
                                </div>
                                
                                {currentStage === sIndex && (
                                    <div className="mt-2 mr-4 space-y-2">
                                        {stage.units.map((unit, uIndex) => (
                                            <div
                                                key={unit.id}
                                                className={`p-2 rounded cursor-pointer transition-colors ${
                                                    currentUnit === uIndex
                                                        ? 'bg-blue-500/20 border border-blue-500/30'
                                                        : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                                onClick={() => {
                                                    setCurrentUnit(uIndex);
                                                    setCurrentTask(0);
                                                }}
                                            >
                                                <h5 className="font-semibold text-white text-sm">{unit.title}</h5>
                                                <p className="text-xs text-gray-400">{unit.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Task Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="max-w-4xl mx-auto">
                            {/* Stage and Unit Info */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">{stage.icon}</span>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{stage.title}</h2>
                                        <p className="text-gray-400">{stage.description}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-bold text-white mb-2">{unit.title}</h3>
                                    <p className="text-gray-400 mb-4">{unit.description}</p>
                                    
                                    {/* Theory Section */}
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-blue-400 flex items-center gap-2">
                                                <Book size={16} />
                                                الشرح النظري
                                            </h4>
                                            <button
                                                onClick={() => setShowTheory(!showTheory)}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                {showTheory ? 'إخفاء' : 'عرض'}
                                            </button>
                                        </div>
                                        
                                        {showTheory && (
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <h5 className="font-bold text-white mb-1">مقدمة:</h5>
                                                    <p className="text-gray-300">{unit.theory.introduction}</p>
                                                </div>
                                                
                                                <div>
                                                    <h5 className="font-bold text-white mb-1">مفاهيم أساسية:</h5>
                                                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                                                        {unit.theory.keyConcepts.map((concept, index) => (
                                                            <li key={index}>{concept}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                
                                                <div>
                                                    <h5 className="font-bold text-white mb-1">الأهمية:</h5>
                                                    <p className="text-gray-300">{unit.theory.importance}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Current Task */}
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-bold text-green-400 flex items-center gap-2">
                                                <Target size={16} />
                                                المهمة الحالية: {task.title}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs bg-green-500/20 px-2 py-1 rounded text-green-400">
                                                    {task.xp} XP
                                                </span>
                                                {completedTasks[`${currentStage}-${currentUnit}-${currentTask}`] && (
                                                    <CheckCircle className="text-green-400" size={16} />
                                                )}
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-300 mb-3">{task.description}</p>
                                        
                                        {showHint && task.hints && (
                                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 mb-3">
                                                <p className="text-yellow-400 text-sm flex items-center gap-2">
                                                    <HelpCircle size={14} />
                                                    تلميح: {task.hints[hints - 1]}
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-2">
                                            <button
                                                onClick={useHint}
                                                disabled={!task.hints || hints >= task.hints.length}
                                                className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            >
                                                <HelpCircle size={14} className="inline ml-1" />
                                                تلميح ({hints}/{task.hints?.length || 0})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terminal Section */}
                    <div className="border-t border-white/10 bg-[#0a0a0f] p-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-black rounded-lg border border-green-500/30 overflow-hidden">
                                <div className="bg-green-500/10 px-4 py-2 border-b border-green-500/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Terminal size={16} className="text-green-400" />
                                        <span className="text-green-400 font-mono text-sm">Terminal</span>
                                    </div>
                                    <button
                                        onClick={resetTerminal}
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        مسح
                                    </button>
                                </div>
                                
                                <div 
                                    ref={terminalRef}
                                    className="p-4 font-mono text-sm text-green-400 h-48 overflow-y-auto"
                                    dir="ltr"
                                >
                                    <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
                                    <div className="flex items-center">
                                        <span className="mr-2">$</span>
                                        <input
                                            type="text"
                                            value={currentCommand}
                                            onChange={(e) => setCurrentCommand(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                                            className="flex-1 bg-transparent outline-none text-green-400"
                                            placeholder="اكتب أمرك هنا..."
                                            dir="ltr"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
