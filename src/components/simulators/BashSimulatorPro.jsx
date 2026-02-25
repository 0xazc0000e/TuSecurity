import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal, BookOpen, PlayCircle, CheckCircle, Lock, Unlock,
    Eye, EyeOff, ArrowRight, RotateCcw, HelpCircle, Award,
    ChevronRight, ChevronLeft, Folder, FileText, Search,
    Trash2, Copy, Move, Edit, Save, X, Zap, Target,
    AlertCircle, CheckCircle2, Clock, BarChart3, Star,
    TrendingUp, Users, MessageSquare, Lightbulb, Monitor,
    Cpu, Activity, Wifi, Database, Shield, Layers, HardDrive,
    FileSearch, ScrollText, Cog, Play, Settings, Wrench, Globe,
    ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { MatrixBackground } from '../ui/MatrixBackground';
import { apiCall } from '../../context/AuthContext';
import { BASH_THEORY_SLIDES, CURRICULUM, evaluateCommand } from './BashSimulatorData';

export default function BashSimulatorPro({ onBack }) {
    const [showIntro, setShowIntro] = useState(true);
    const [introSlide, setIntroSlide] = useState(0);

    const [currentUnit, setCurrentUnit] = useState('level1');
    const [currentLesson, setCurrentLesson] = useState(0);
    const [currentSubTask, setCurrentSubTask] = useState(0);

    const [showTheory, setShowTheory] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [questionStatus, setQuestionStatus] = useState('waiting');
    const [selectedAnswer, setSelectedAnswer] = useState('');

    const [terminalInput, setTerminalInput] = useState('');
    const [terminalHistory, setTerminalHistory] = useState([]);
    const [fileSystem, setFileSystem] = useState({
        currentPath: '/home/student',
        files: ['passwords.txt', 'script.sh', 'data/', 'folder1/', 'tools/'],
        hiddenFiles: ['.secret_config'],
        selectedFile: null
    });

    const [completedSubTasks, setCompletedSubTasks] = useState([]);
    const [totalXP, setTotalXP] = useState(0);
    const [showUnits, setShowUnits] = useState(false);
    const [expandedLessons, setExpandedLessons] = useState([0]);

    const terminalRef = useRef(null);

    const unit = CURRICULUM[currentUnit];
    const lesson = unit?.lessons[currentLesson];
    const activeSubTask = lesson?.subTasks[currentSubTask];

    let totalSubTasksCount = 0;
    Object.values(CURRICULUM).forEach(u => u.lessons.forEach(l => totalSubTasksCount += l.subTasks.length));

    useEffect(() => {
        if (!showIntro && !showUnits && !showTheory && currentLesson === 0 && currentSubTask === 0) {
            setShowTheory(true);
        }
    }, [showIntro, showUnits]);

    const handleCommandInput = (command) => {
        if (showQuestion) return;

        // 1. Process via Data Module
        const { output, success, newFileSystem } = evaluateCommand(command, fileSystem, activeSubTask);

        let displayOutput = output;

        // 2. Handle System Updates & Overrides
        if (output === 'CLEAR_SIGNAL') {
            setTerminalHistory([]);
            displayOutput = 'Screen cleared';
        } else {
            setFileSystem(newFileSystem);
            const trimmedCommand = command.trim().replace(/\s+/g, ' ');
            const displayPath = fileSystem.currentPath.replace('/home/student', '~');
            setTerminalHistory(prev => [...prev,
            { type: 'input', content: `student@cyberclub:${displayPath}$ ${trimmedCommand}`, path: displayPath, cmd: trimmedCommand },
            { type: 'output', content: displayOutput }
            ]);
        }

        // 3. Question Logic
        if (success && !completedSubTasks.includes(activeSubTask.id)) {
            if (activeSubTask.question) {
                setTimeout(() => {
                    setShowQuestion(true);
                    setQuestionStatus('waiting');
                }, 600);
            } else {
                completeSubTask();
            }
        }
        setTerminalInput('');
    };

    const completeSubTask = () => {
        const newCompleted = [...completedSubTasks, activeSubTask.id];
        setCompletedSubTasks(newCompleted);
        setTotalXP(prev => prev + activeSubTask.xp);
        setShowQuestion(false);
        setSelectedAnswer('');

        const newProgress = Math.round((newCompleted.length / totalSubTasksCount) * 100);
        apiCall('/simulators/progress/update', 'POST', {
            simulator_id: 'bash-pro',
            progress_percentage: newProgress,
            is_completed: newProgress >= 100
        }).catch(console.error);

        setTimeout(() => {
            if (currentSubTask < lesson.subTasks.length - 1) {
                setCurrentSubTask(prev => prev + 1);
            } else if (currentLesson < unit.lessons.length - 1) {
                setCurrentLesson(prev => prev + 1);
                setCurrentSubTask(0);
                setShowTheory(true);
                setExpandedLessons(prev => [...prev, currentLesson + 1]);
            }
        }, 1200);
    };

    const handleQuestionAnswer = (answer) => {
        setSelectedAnswer(answer);
        if (answer === activeSubTask.question.answer) {
            setQuestionStatus('success');
            setTimeout(() => completeSubTask(), 1200);
        } else {
            setQuestionStatus('error');
            setTimeout(() => {
                setQuestionStatus('waiting');
                setSelectedAnswer('');
            }, 1500);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleCommandInput(terminalInput);
    };

    useEffect(() => {
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [terminalHistory, showQuestion]);

    const progress = (completedSubTasks.length / totalSubTasksCount) * 100 || 0;

    // View: Presentation Intro
    if (showIntro) {
        const slide = BASH_THEORY_SLIDES[introSlide];
        const SlideIcon = slide.icon;

        return (
            <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
                <MatrixBackground opacity={0.3} />
                <div className="relative z-10 min-h-screen flex items-center justify-center p-6 flex-col">
                    <div className="w-full max-w-4xl flex items-center gap-2 mb-8">
                        {BASH_THEORY_SLIDES.map((_, idx) => (
                            <div key={idx} className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                <motion.div className="h-full bg-[#ff006e]" initial={{ width: 0 }} animate={{ width: idx <= introSlide ? '100%' : '0%' }} transition={{ duration: 0.5 }} />
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={introSlide} initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} transition={{ duration: 0.4 }} className="max-w-4xl w-full bg-[#110C24] border border-[#ff006e]/30 rounded-3xl p-12 overflow-hidden relative shadow-[0_0_80px_rgba(255,0,110,0.15)] flex flex-col items-center text-center min-h-[400px]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff006e]/10 blur-[100px] rounded-full pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7112AF]/10 blur-[100px] rounded-full pointer-events-none"></div>

                            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }} className="mb-8 w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-xl" style={{ boxShadow: `0 0 40px ${slide.color}40` }}>
                                <SlideIcon size={48} style={{ color: slide.color }} />
                            </motion.div>

                            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-black mb-6 text-white">{slide.title}</motion.h2>
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl text-gray-300 leading-relaxed max-w-2xl">{slide.desc}</motion.p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-10 flex gap-4">
                        {introSlide > 0 && <button onClick={() => setIntroSlide(p => p - 1)} className="px-6 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition">السابق</button>}
                        {introSlide < BASH_THEORY_SLIDES.length - 1 ? (
                            <button onClick={() => setIntroSlide(p => p + 1)} className="px-8 py-3 bg-gradient-to-r from-[#ff006e] to-[#7112AF] rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,0,110,0.4)] flex gap-2">التالي <ArrowRight size={20} className="rotate-180" /></button>
                        ) : (
                            <button onClick={() => { setShowIntro(false); setShowUnits(true); }} className="px-8 py-3 bg-green-500 text-black rounded-xl font-bold hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] flex gap-2">بدء التطبيق العملي <Terminal size={20} /></button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (showUnits) {
        return (
            <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
                <MatrixBackground opacity={0.3} />
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex gap-4">
                            {onBack && <button onClick={onBack} className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><ArrowRight size={20} className="rotate-180" /></button>}
                            <div><h1 className="text-2xl font-bold">اختيار المستوى</h1><p className="text-gray-400">أي جزء تريد احترافه في الـ Bash؟</p></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(CURRICULUM).map(([key, unitData]) => {
                            const UnitIcon = unitData.icon;
                            let completed = 0; let total = 0;
                            unitData.lessons.forEach(l => { total += l.subTasks.length; l.subTasks.forEach(st => { if (completedSubTasks.includes(st.id)) completed++; }); });
                            const isDone = completed === total && total > 0;
                            return (
                                <button key={key} onClick={() => { setCurrentUnit(key); setCurrentLesson(0); setCurrentSubTask(0); setShowUnits(false); setShowTheory(true); setExpandedLessons([0]); }} className={`p-6 rounded-xl border text-right transition ${isDone ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-[#7112AF]'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: `${unitData.color}20` }}><UnitIcon size={32} style={{ color: unitData.color }} /></div>
                                        <div className="text-gray-400 text-sm">{completed}/{total} مهام</div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{unitData.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{unitData.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            <MatrixBackground opacity={0.3} />
            <div className="relative z-10 border-b border-white/10 bg-[#0a0a0f]/90">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        {onBack && <button onClick={onBack} className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><ArrowRight size={20} className="rotate-180" /></button>}
                        <button onClick={() => setShowUnits(true)} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition">
                            <div className="p-2 rounded-lg" style={{ background: `${unit?.color || '#ff006e'}30` }}><Terminal size={20} style={{ color: unit?.color || '#ff006e' }} /></div>
                            <h1 className="text-sm font-bold flex gap-2">{unit?.title} <ChevronDown size={14} className="mt-1" /></h1>
                        </button>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="text-right">
                            <div className="text-sm font-bold">{Math.round(progress)}% إنجاز</div>
                            <div className="w-32 bg-white/10 h-2 rounded-full mt-1"><motion.div className="h-2 rounded-full bg-gradient-to-r from-[#240993] to-[#7112AF]" animate={{ width: `${progress}%` }} /></div>
                        </div>
                        <div className="bg-yellow-500/20 text-yellow-500 font-bold px-4 py-2 rounded-lg border border-yellow-500/30 flex gap-2"><Star size={16} /> {totalXP} XP</div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 p-6 max-w-7xl mx-auto grid grid-cols-12 gap-6">
                {/* Left Accordion Panel */}
                <div className="col-span-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                        <div className="p-4 border-b border-white/10 bg-black/40"><h3 className="font-bold text-white mb-1">مسار المستوى</h3></div>
                        <div className="overflow-y-auto max-h-[70vh]">
                            {unit?.lessons.map((l, index) => {
                                const isExpanded = expandedLessons.includes(index);
                                const isCurrentLesson = currentLesson === index;
                                return (
                                    <div key={l.id} className="border-b border-white/5">
                                        <button onClick={() => { setExpandedLessons(p => p.includes(index) ? p.filter(i => i !== index) : [...p, index]); if (currentLesson !== index) { setCurrentLesson(index); setCurrentSubTask(0); setShowTheory(true); } }} className={`w-full p-4 flex justify-between items-center transition ${isCurrentLesson ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                                            <span className="font-bold text-sm text-right leading-relaxed">{l.title}</span>
                                            {isExpanded ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                                        </button>
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-black/40">
                                                    {l.subTasks.map((st, sIdx) => {
                                                        const isDone = completedSubTasks.includes(st.id);
                                                        const isCur = currentLesson === index && currentSubTask === sIdx;
                                                        return (
                                                            <button key={st.id} onClick={() => { setCurrentLesson(index); setCurrentSubTask(sIdx); setShowTheory(false); }} className={`w-full p-3 pl-6 flex items-center gap-3 border-l-2 text-right transition ${isCur ? 'border-[#7112AF] bg-[#7112AF]/10' : 'border-transparent hover:bg-white/5'}`}>
                                                                {isDone ? <CheckCircle size={14} className="text-green-500 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-500 shrink-0" />}
                                                                <div className={`text-xs font-mono ${isCur ? 'text-white' : 'text-gray-400'}`}>{st.command}</div>
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Center Terminal / Theory */}
                <div className="col-span-6">
                    <AnimatePresence mode="wait">
                        {showTheory ? (
                            <motion.div key="theory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-gradient-to-br from-[#240993]/20 to-[#7112AF]/20 border border-[#7112AF]/40 rounded-xl p-8 backdrop-blur-sm shadow-2xl">
                                <div className="flex gap-4 mb-6"><div className="p-4 bg-[#7112AF]/20 rounded-xl"><BookOpen size={30} className="text-[#7112AF]" /></div><div><div className="text-sm text-gray-400">فهم المبادئ:</div><h2 className="text-2xl font-bold">{lesson?.title}</h2></div></div>
                                <p className="text-gray-300 text-lg leading-relaxed mb-8 p-6 bg-black/50 rounded-lg border border-white/5">{lesson?.concept}</p>
                                <h3 className="font-bold text-[#ff006e] mb-3">المهام في هذا الدرس:</h3>
                                <div className="space-y-3 mb-8">
                                    {lesson?.subTasks.map((t, i) => (
                                        <div key={i} className="flex gap-3 items-center p-3 bg-white/5 rounded-lg border border-white/10">
                                            <code className="bg-black/80 px-3 py-1.5 rounded text-[#10b981] font-mono min-w-[80px] text-center border border-white/5">{t.command}</code>
                                            <span className="text-sm text-gray-300 leading-relaxed">{t.task}</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setShowTheory(false)} className="w-full py-4 bg-gradient-to-r from-[#7112AF] to-[#ff006e] rounded-xl font-bold flex justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,0,110,0.4)] transition"><Terminal size={20} /> الانتقال للطرفية والتطبيق</button>
                            </motion.div>
                        ) : (
                            <motion.div key="terminal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <div className="bg-[#110C24] border border-[#ff006e]/30 rounded-t-xl p-4 flex justify-between items-center shadow-lg">
                                    <div><div className="text-xs text-[#ff006e] font-bold mb-1 uppercase">الهدف النشط</div><div className="font-bold flex gap-2 text-sm max-w-lg leading-relaxed"><Target size={16} className="text-gray-400 shrink-0" />{activeSubTask?.task}</div></div>
                                    <button onClick={() => setShowTheory(true)} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition">المفهوم النظري</button>
                                </div>
                                <div className={`bg-black rounded-b-xl border border-t-0 shadow-2xl overflow-hidden ${showQuestion ? 'border-yellow-500/50' : 'border-[#ff006e]/30'}`}>
                                    <div className="bg-[#1a1b26] px-4 py-2 flex justify-between border-b border-white/10"><div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div><button onClick={() => setTerminalHistory([])} className="text-gray-500 hover:text-white"><RotateCcw size={14} /></button></div>
                                    <div ref={terminalRef} className="h-96 overflow-y-auto p-4 font-mono text-sm relative" dir="ltr">
                                        {terminalHistory.map((entry, idx) => (
                                            <div key={idx} className="mb-3 break-all">
                                                {entry.type === 'input' ? <div className="flex gap-2"><span className="text-green-400 whitespace-nowrap">student@cyberclub:<span className="text-blue-400">{entry.path}</span>$</span><span className="text-white">{entry.cmd}</span></div> : <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{entry.content}</div>}
                                            </div>
                                        ))}
                                        {showQuestion ? (
                                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 border border-yellow-500/30 bg-yellow-500/10 p-5 rounded-xl relative shadow-2xl" dir="rtl">
                                                <div className="flex gap-3 mb-4"><HelpCircle size={24} className="text-yellow-400" /><h3 className="font-bold text-lg text-white">تحدي المخرجات: أثبت فهمك</h3></div>
                                                <p className="text-gray-300 mb-6 text-sm leading-relaxed">{activeSubTask?.question?.text}</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {activeSubTask?.question?.options.map((opt, i) => (
                                                        <button key={i} onClick={() => handleQuestionAnswer(opt)} disabled={questionStatus !== 'waiting'} className={`p-3 rounded-lg text-sm border text-right transition ${selectedAnswer === opt ? (questionStatus === 'success' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400') : 'bg-black/50 border-white/20 hover:border-yellow-400/50 hover:bg-yellow-400/10'}`}>{opt}</button>
                                                    ))}
                                                </div>
                                                {questionStatus === 'success' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center"><div className="bg-green-500 text-black px-6 py-2 rounded-full font-bold flex gap-2 shadow-2xl"><CheckCircle size={20} /> إجابة صحيحة!</div></motion.div>}
                                            </motion.div>
                                        ) : (
                                            <div className="flex items-center mt-2"><span className="text-green-400 whitespace-nowrap mr-2">student@cyberclub:<span className="text-blue-400">{fileSystem.currentPath.replace('/home/student', '~')}</span>$</span><input type="text" value={terminalInput} onChange={e => setTerminalInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent text-white outline-none" autoFocus spellCheck={false} /></div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl flex gap-3 shadow-lg"><Lightbulb className="text-blue-400 shrink-0 mt-0.5" size={18} /><div><div className="text-blue-400 font-bold mb-1 text-sm">تلميح</div><div className="text-gray-400 text-sm leading-relaxed">{activeSubTask?.hint}</div></div></div>

                                {/* Command Details Box */}
                                {activeSubTask?.details && (
                                    <div className="mt-4 p-5 border border-[#7112AF]/30 bg-[#7112AF]/10 rounded-xl text-right shadow-lg">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Info className="text-[#a78bfa] shrink-0" size={18} />
                                            <h4 className="text-[#a78bfa] font-bold text-sm">تشريح الأمر (Command Anatomy)</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div className="bg-black/50 p-3 rounded-lg border border-white/5 shadow-inner">
                                                <div className="text-xs text-gray-500 mb-1">مسار التنفيذ (Binary Path)</div>
                                                <div className="font-mono text-[#a78bfa]">{activeSubTask.details.path}</div>
                                            </div>
                                            <div className="bg-black/50 p-3 rounded-lg border border-white/5 shadow-inner">
                                                <div className="text-xs text-gray-500 mb-1">الاسم الكامل (Full Name)</div>
                                                <div className="text-gray-300">{activeSubTask.details.usage}</div>
                                            </div>
                                            <div className="bg-black/50 p-4 rounded-lg border border-white/5 shadow-inner md:col-span-2">
                                                <div className="text-xs text-gray-500 mb-2">طريقة العمل (Under the hood)</div>
                                                <div className="text-gray-300 leading-relaxed">{activeSubTask.details.desc}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Panel File System */}
                <div className="col-span-3 space-y-4">
                    <div className="bg-[#110C24] border border-[#7112AF]/30 rounded-xl overflow-hidden shadow-xl">
                        <div className="p-4 bg-black/40 border-b border-white/10"><h3 className="font-bold flex gap-2 text-sm"><Folder size={16} className="text-[#a78bfa]" /> نظام الملفات التخيلي</h3></div>
                        <div className="p-4 space-y-2 max-h-[350px] overflow-y-auto">
                            {fileSystem.files.map((file, i) => <div key={i} className="flex gap-2 items-center p-2 rounded hover:bg-white/5 transition"><Folder size={16} className="text-yellow-500" /><span className="text-sm text-gray-300 break-all">{file}</span></div>)}
                            {fileSystem.hiddenFiles.map((file, i) => <div key={`h-${i}`} className="flex gap-2 items-center p-2 opacity-50"><EyeOff size={16} className="text-gray-500" /><span className="text-sm text-gray-400 break-all">{file}</span></div>)}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
