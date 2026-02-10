import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowRight, CheckCircle, ChevronLeft,
    Crosshair, Flag, Lightbulb,
    Play, RotateCcw, Server, Shield,
    Skull, Trophy,
    Zap, Brain, Cpu, Globe, Wifi,
    Star, MessageSquare,
    Eye,
    BarChart3,
    Network, Flame,
    Terminal,
    Info,
    Search, Target, Radio
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Icon mapping for dynamic icons from data
const IconMap = {
    Search, Target, BarChart3, Shield, Radio, Flame,
    Server, Skull, Crosshair, Flag, Zap, Brain, Cpu, Globe, Wifi, Star, MessageSquare, Eye, Network, Terminal, Info
};

export default function AttackSimulatorEngine({ scenario, onBack }) {
    // State
    const [mode, setMode] = useState('attacker');
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [showStory, setShowStory] = useState(true);
    const [storyIndex, setStoryIndex] = useState(0);
    const [terminalLines, setTerminalLines] = useState([]);
    const [input, setInput] = useState('');
    const [showQuestions, setShowQuestions] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
    const [flagInput, setFlagInput] = useState('');
    const [showFlagInput, setShowFlagInput] = useState(false);
    const [completedPhases, setCompletedPhases] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [guideMessages, setGuideMessages] = useState([]);
    const [networkNodes, setNetworkNodes] = useState(scenario.networkMap || []);
    const [showHint, setShowHint] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showToolInfo, setShowToolInfo] = useState(null);
    const [showCommandHelp, setShowCommandHelp] = useState(null);

    const terminalRef = useRef(null);
    const inputRef = useRef(null);

    const currentPhases = mode === 'attacker' ? scenario.attackerPhases : scenario.defenderPhases;
    const currentPhase = currentPhases[currentPhaseIndex];
    const currentQuestions = currentPhase?.questions || [];
    const currentQuestion = currentQuestions[currentQuestionIndex];

    // Map string icons to components
    const getIcon = (iconName) => {
        const IconComponent = IconMap[iconName] || Info;
        return <IconComponent className="w-5 h-5" />;
    };

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalLines]);

    // Focus input
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Initial guide message
    useEffect(() => {
        if (guideMessages.length === 0) {
            addGuideMessage('info', `Welcome! I'm your guide in this scenario. I'll help you ${mode === 'attacker' ? 'launch the attack' : 'defend the system'}.`);
        }
    }, [mode]);

    const addTerminalLine = (type, content) => {
        setTerminalLines(prev => [...prev, { type, content, timestamp: new Date() }]);
    };

    const addGuideMessage = (type, message) => {
        setGuideMessages(prev => [...prev, { type, message }]);
    };

    const handleCommand = () => {
        if (!input.trim()) return;

        const cmd = input.trim();
        addTerminalLine('input', `root@kali:~# ${cmd}`);

        // Use scenario's simulation logic
        let output = '';
        if (scenario.simulateCommand) {
            output = scenario.simulateCommand(cmd, currentPhase);
        } else {
            output = "Simulation logic not found for this scenario.";
        }

        addTerminalLine('output', output);

        // Check for success condition (simple check: if command matches phase command)
        // In a real engine, we'd check the state or output more robustly
        const isPhaseCommand = currentPhase.commands.some(c => cmd.toLowerCase().includes(c.split(' ')[0].toLowerCase()));

        if (isPhaseCommand) {
            // Just a visual indicator in terminal, functionality is unlocked via UI mostly in this sim
        }

        setInput('');
    };

    const handleAnswerSubmit = () => {
        if (selectedAnswer === null) return;

        setShowAnswerFeedback(true);
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setTimeout(() => {
                if (currentQuestionIndex < currentQuestions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                    setSelectedAnswer(null);
                    setShowAnswerFeedback(false);
                } else {
                    setShowQuestions(false);
                    setShowFlagInput(true);
                    addGuideMessage('success', 'Excellent! You answered all questions correctly. Now, execute the commands and find the flag.');
                }
            }, 1500);
        }
    };

    const handleFlagSubmit = () => {
        if (flagInput === currentPhase.flag) {
            setTotalPoints(prev => prev + currentPhase.points);

            // Update network map status based on phase visual effect
            const newNodes = [...networkNodes];
            if (currentPhase.visualEffect === 'scanning') {
                // visual effect logic
            } else if (currentPhase.visualEffect === 'vulnerability-scan') {
                const webNode = newNodes.find(n => n.id === 'webserver');
                if (webNode) webNode.status = 'scanning';
            }
            else if (currentPhase.visualEffect === 'exploit-success') {
                const webNode = newNodes.find(n => n.id === 'webserver');
                if (webNode) webNode.status = 'compromised';
            }
            setNetworkNodes(newNodes);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setShowFlagInput(false);
                setFlagInput('');

                if (currentPhaseIndex < currentPhases.length - 1) {
                    setCurrentPhaseIndex(prev => prev + 1);
                    setCurrentQuestionIndex(0);
                    setSelectedAnswer(null);
                    setShowAnswerFeedback(false);
                    setTerminalLines([]);
                } else {
                    addGuideMessage('success', 'Congratulations! You have completed all phases in this mode.');
                }
            }, 2000);
        } else {
            addGuideMessage('error', 'Incorrect flag. Try again.');
        }
    };

    // Render Network Node
    const renderNetworkNode = (node) => {
        return (
            <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
                <div className={cn(
                    "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    node.status === 'secure' ? 'bg-green-500/20 border-green-500 text-green-400' :
                        node.status === 'compromised' ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' :
                            node.status === 'attacking' ? 'bg-purple-500/20 border-purple-500 text-purple-400' :
                                'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                )}>
                    {renderNodeIcon(node.type)}

                    {/* Tooltip */}
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-48 bg-[#0a0a0f] border border-[#240993] rounded-lg p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        <p className="font-bold text-white mb-1">{node.name}</p>
                        <p className="text-gray-400">{node.info}</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderNodeIcon = (type) => {
        switch (type) {
            case 'firewall': return <Flame className="w-6 h-6" />;
            case 'server': return <Server className="w-6 h-6" />;
            case 'database': return <Server className="w-6 h-6" />; // Using Server for DB too for now
            case 'router': return <RouterIcon className="w-6 h-6" />;
            case 'workstation': return <Cpu className="w-6 h-6" />;
            case 'attacker': return <Skull className="w-6 h-6" />;
            case 'ids': return <Shield className="w-6 h-6" />;
            case 'dmz': return <Network className="w-6 h-6" />;
            default: return <Server className="w-6 h-6" />;
        }
    };

    // Helper for router icon since it wasn't in imports
    const RouterIcon = ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] cyber-grid font-cairo" dir="rtl">
            {/* Header */}
            <header className="glass-strong sticky top-0 z-50 border-b border-[#24099340]">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>الخروج من السيناريو</span>
                        </button>

                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#240993] to-[#430D9E]">
                            {scenario.title}
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="flex bg-[#111118] rounded-lg p-1">
                                <button
                                    onClick={() => setMode('attacker')}
                                    className={cn(
                                        "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                        mode === 'attacker' ? "bg-red-500/20 text-red-500" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    <Skull className="w-4 h-4" />
                                    مهاجم
                                </button>
                                <button
                                    onClick={() => setMode('defender')}
                                    className={cn(
                                        "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                        mode === 'defender' ? "bg-blue-500/20 text-blue-500" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    <Shield className="w-4 h-4" />
                                    مدافع
                                </button>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#24099320]">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                <span className="font-bold">{totalPoints}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid lg:grid-cols-12 gap-6">

                    {/* Left Sidebar - Status & Tools */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Phase Info */}
                        <div className="glass rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-400">المرحلة الحالية</span>
                                <Badge variant="outline" className={cn(
                                    mode === 'attacker' ? 'border-red-500 text-red-500' : 'border-blue-500 text-blue-500'
                                )}>
                                    {currentPhaseIndex + 1}/{currentPhases.length}
                                </Badge>
                            </div>
                            <h3 className="font-bold text-lg mb-2">{currentPhase.title}</h3>
                            <p className="text-sm text-gray-300 mb-4">{currentPhase.description}</p>

                            <div className="space-y-2">
                                <Button
                                    className="w-full justify-start gap-2"
                                    variant="outline"
                                    onClick={() => setShowQuestions(true)}
                                >
                                    <Brain className="w-4 h-4" />
                                    أسئلة التحدي
                                </Button>
                                {showFlagInput ? (
                                    <Button
                                        className="w-full justify-start gap-2 animate-pulse bg-green-500/20 text-green-500 border-green-500"
                                        variant="outline"
                                        onClick={() => document.getElementById('flagOutputInput')?.focus()}
                                    >
                                        <Flag className="w-4 h-4" />
                                        إدخال العلم (Flag)
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full justify-start gap-2"
                                        variant="outline"
                                        disabled
                                    >
                                        <Flag className="w-4 h-4" />
                                        أكمل الأسئلة أولاً
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Available Tools */}
                        <div className="glass rounded-xl p-4">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-[#430D9E]" />
                                الأدوات المتاحة
                            </h4>
                            <div className="space-y-2">
                                {scenario.tools
                                    .filter(t => currentPhase.tools?.includes(t.id) || currentPhase.tools?.length === 0)
                                    .map(tool => (
                                        <button
                                            key={tool.id}
                                            onClick={() => setShowToolInfo(tool.id)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#111118] hover:bg-[#1a1a24] transition-colors text-right group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[#240993]/20 flex items-center justify-center text-[#430D9E] group-hover:text-white group-hover:bg-[#430D9E] transition-all">
                                                {getIcon(tool.icon)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{tool.name}</p>
                                                <p className="text-xs text-gray-500">{tool.category}</p>
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Center - Terminal & Network Map */}
                    <div className="lg:col-span-6 space-y-4">

                        {/* Network Map Visualization */}
                        <div className="glass rounded-xl p-4 h-64 relative overflow-hidden bg-[#050508]">
                            <div className="absolute inset-0 cyber-grid opacity-30"></div>
                            {/* Render Connections */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                {networkNodes.map(node =>
                                    node.connections.map(targetId => {
                                        const target = networkNodes.find(n => n.id === targetId);
                                        if (!target) return null;
                                        return (
                                            <line
                                                key={`${node.id}-${targetId}`}
                                                x1={`${node.x}%`} y1={`${node.y}%`}
                                                x2={`${target.x}%`} y2={`${target.y}%`}
                                                stroke="#240993" strokeWidth="1" strokeOpacity="0.5"
                                            />
                                        );
                                    })
                                )}
                            </svg>
                            {/* Render Nodes */}
                            {networkNodes.map(node => renderNetworkNode(node))}
                        </div>

                        {/* Terminal */}
                        <div className="terminal rounded-xl overflow-hidden shadow-2xl border border-[#240993]/50 flex flex-col h-[500px]">
                            <div className="bg-[#1a1a24] px-4 py-2 flex items-center justify-between border-b border-[#00ff8820]">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-xs text-gray-500 terminal-text">root@kali: ~</span>
                                <button
                                    onClick={() => setTerminalLines([])}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>

                            <div
                                ref={terminalRef}
                                className="flex-1 p-4 overflow-y-auto terminal-text text-sm bg-[#0a0a0f] font-mono scroll-mb-10"
                                dir="ltr"
                            >
                                {terminalLines.length === 0 && (
                                    <div className="text-gray-500">
                                        <p className="text-[#00ff88] mb-2">{scenario.title} - Terminal</p>
                                        <p className="text-gray-400">Current Phase: {currentPhase.title}</p>
                                        <p className="text-gray-400 mt-2">Objective: {currentPhase.objective}</p>
                                    </div>
                                )}
                                {terminalLines.map((line, i) => (
                                    <div
                                        key={i}
                                        className={cn("mb-1 break-words whitespace-pre-wrap",
                                            line.type === 'input' ? 'text-[#00d4ff]' :
                                                line.type === 'error' ? 'text-[#ff4444]' :
                                                    line.type === 'success' ? 'text-[#00ff88]' :
                                                        line.type === 'info' ? 'text-[#ffd700]' :
                                                            'text-[#e0e0e0]'
                                        )}
                                    >
                                        {line.content}
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 bg-[#0d0d12] border-t border-[#00ff8820]" dir="ltr">
                                {showFlagInput ? (
                                    <div className="flex gap-2">
                                        <span className="text-green-500 font-bold whitespace-nowrap">FLAG {'>'}</span>
                                        <input
                                            id="flagOutputInput"
                                            type="text"
                                            value={flagInput}
                                            onChange={(e) => setFlagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleFlagSubmit()}
                                            className="flex-1 bg-transparent border-none outline-none text-green-500 terminal-text text-sm font-mono"
                                            placeholder="Enter FLAG{...}"
                                            autoFocus
                                        />
                                        <button onClick={handleFlagSubmit} className="text-green-500 hover:text-white">
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#ff4444] terminal-text text-sm font-mono">root@kali:~#</span>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                                            className="flex-1 bg-transparent border-none outline-none text-white terminal-text text-sm font-mono"
                                            placeholder="Execute command..."
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleCommand}
                                            className="p-2 rounded-lg bg-[#240993] hover:bg-[#430D9E] transition-colors"
                                        >
                                            <Play className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Guide & Chat */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Guide Messages */}
                        <div className="glass rounded-xl p-4 h-[600px] flex flex-col">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-[#430D9E]" />
                                المرشد الذكي
                            </h4>

                            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                                {guideMessages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "p-3 rounded-lg text-sm",
                                            msg.type === 'error' ? "bg-red-500/10 border border-red-500/30" :
                                                msg.type === 'success' ? "bg-green-500/10 border border-green-500/30" :
                                                    msg.type === 'warning' ? "bg-yellow-500/10 border border-yellow-500/30" :
                                                        "bg-[#111118]"
                                        )}
                                    >
                                        {msg.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Story Dialog */}
            <Dialog open={showStory} onOpenChange={setShowStory}>
                <DialogContent className="glass-strong max-w-2xl text-center">
                    {scenario.story[storyIndex] && (
                        <div className="py-8">
                            <div className="text-6xl mb-4">{scenario.story[storyIndex].avatar}</div>
                            <h2 className="text-2xl font-bold mb-2">{scenario.story[storyIndex].character}</h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                {scenario.story[storyIndex].message}
                            </p>
                            <Button
                                onClick={() => {
                                    if (storyIndex < scenario.story.length - 1) {
                                        setStoryIndex(prev => prev + 1);
                                    } else {
                                        setShowStory(false);
                                    }
                                }}
                                className="bg-[#430D9E] hover:bg-[#240993]"
                            >
                                {storyIndex < scenario.story.length - 1 ? 'التالي' : 'ابدأ المهمة'}
                                <ArrowRight className="w-4 h-4 mr-2" />
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Questions Dialog */}
            <Dialog open={showQuestions} onOpenChange={setShowQuestions}>
                <DialogContent className="glass-strong max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-[#430D9E]" />
                            سؤال {currentQuestionIndex + 1} من {currentQuestions.length}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                        <p className="text-lg font-medium mb-6">{currentQuestion.question}</p>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !showAnswerFeedback && setSelectedAnswer(idx)}
                                    disabled={showAnswerFeedback}
                                    className={cn(
                                        "w-full text-right p-4 rounded-lg border transition-all",
                                        selectedAnswer === idx ? "border-[#430D9E] bg-[#430D9E]/10" : "border-white/10 hover:bg-white/5",
                                        showAnswerFeedback && idx === currentQuestion.correctAnswer && "bg-green-500/20 border-green-500",
                                        showAnswerFeedback && selectedAnswer === idx && idx !== currentQuestion.correctAnswer && "bg-red-500/20 border-red-500"
                                    )}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {showAnswerFeedback && (
                            <div className={cn(
                                "mt-6 p-4 rounded-lg",
                                selectedAnswer === currentQuestion.correctAnswer ? "bg-green-500/10" : "bg-red-500/10"
                            )}>
                                <p className={cn(
                                    "font-bold mb-2",
                                    selectedAnswer === currentQuestion.correctAnswer ? "text-green-500" : "text-red-500"
                                )}>
                                    {selectedAnswer === currentQuestion.correctAnswer ? "إجابة صحيحة!" : "إجابة خاطئة"}
                                </p>
                                <p className="text-sm text-gray-300">{currentQuestion.explanation}</p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <Button
                                onClick={handleAnswerSubmit}
                                disabled={selectedAnswer === null || showAnswerFeedback}
                                className={cn(selectedAnswer !== null ? "bg-[#430D9E]" : "bg-gray-700")}
                            >
                                تحقق من الإجابة
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Tool Info Dialog */}
            {showToolInfo && (
                <Dialog open={!!showToolInfo} onOpenChange={() => setShowToolInfo(null)}>
                    <DialogContent className="glass-strong">
                        <DialogHeader>
                            <DialogTitle>
                                {scenario.tools.find(t => t.id === showToolInfo)?.name}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            <p className="text-gray-300">{scenario.tools.find(t => t.id === showToolInfo)?.description}</p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Success Dialog */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="glass-strong border-green-500/50 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">مرحلة مكتملة!</h2>
                    <p className="text-gray-400">لقد أكملت مرحلة {currentPhase.title} بنجاح</p>
                    <div className="mt-4 flex justify-center gap-2 font-bold text-yellow-400">
                        <Trophy className="w-5 h-5" />
                        <span>+{currentPhase.points} نقطة</span>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
