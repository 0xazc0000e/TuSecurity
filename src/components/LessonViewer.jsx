import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Terminal, AlertTriangle, Info, HelpCircle, Lightbulb,
    Award, ChevronRight, ChevronDown, Lock, AlertCircle as AlertIcon,
    Sparkles, BookOpen, Brain, Zap, Trophy, RotateCcw, ArrowRight,
    Clock, GraduationCap, Target, Copy, Check, Play,
    Menu, X, ChevronLeft, Layers
} from 'lucide-react';
import mermaid from 'mermaid';
import { apiCall } from '../context/AuthContext';

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

/* ═══════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════ */
const DSP_STYLES = "";

/* ═══════════════════════════════════════════════════════════
   CALLOUT PARSER
   ═══════════════════════════════════════════════════════════ */
function parseCallout(content) {
    if (!content || typeof content !== 'string') return null;
    const lines = content.split('\n');
    const match = (lines[0] || '').match(/^\[!(\w+)\]\s*(.*)/i);
    if (!match) return null;
    return { type: match[1].toLowerCase(), title: match[2] || match[1], body: lines.slice(1).join('\n').trim() };
}
const CALLOUT_ICONS = {
    note: <Info size={16} />, warning: <AlertTriangle size={16} />,
    tip: <Lightbulb size={16} />, danger: <AlertIcon size={16} />,
    important: <AlertIcon size={16} />, caution: <AlertTriangle size={16} />,
};

/* ═══════════════════════════════════════════════════════════
   COPY BUTTON
   ═══════════════════════════════════════════════════════════ */
function CopyBtn({ text }) {
    const [copied, setCopied] = useState(false);
    return (
        <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="absolute top-2 left-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10">
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════
   MERMAID COMPONENT
   ═══════════════════════════════════════════════════════════ */
const MermaidDiagram = ({ code }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current && code) {
            const id = 'm-' + Math.random().toString(36).substr(2, 9);
            mermaid.render(id, code).then(({ svg }) => {
                if (ref.current) ref.current.innerHTML = svg;
            }).catch(e => {
                console.error(e);
                if (ref.current) ref.current.innerHTML = '<div class="text-xs text-red-500">Failed to render diagram</div>';
            });
        }
    }, [code]);
    return <div ref={ref} className="mermaid-container my-8 flex justify-center dir-ltr text-center" />;
};

/* ═══════════════════════════════════════════════════════════
   READING PROGRESS
   ═══════════════════════════════════════════════════════════ */
function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const h = () => {
            const d = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(d > 0 ? Math.min((window.scrollY / d) * 100, 100) : 0);
        };
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, []);
    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-black/20">
            <div className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 transition-[width] duration-100" style={{ width: `${progress}%` }} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   INTERACTIVE TERMINAL
   ═══════════════════════════════════════════════════════════ */
function InteractiveTerminal({ config, onComplete }) {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [cmdIdx, setCmdIdx] = useState(0);
    const [done, setDone] = useState(false);
    const endRef = useRef(null);

    // Safe parse
    let termConfig = config;
    if (typeof termConfig === 'string') { try { termConfig = JSON.parse(termConfig); } catch { termConfig = {}; } }

    if (!termConfig || typeof termConfig !== 'object') termConfig = {};
    const commands = Array.isArray(termConfig.commands) ? termConfig.commands : [];

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

    const handleCommand = (e) => {
        if (e.key !== 'Enter' || !input.trim()) return;
        const cmd = input.trim();
        setInput('');
        const newHistory = [...history, { type: 'input', text: cmd }];
        if (cmdIdx < commands.length) {
            const expected = commands[cmdIdx];
            if (cmd === expected.command) {
                newHistory.push({ type: 'output', text: expected.output || 'Success' });
                const nextIdx = cmdIdx + 1;
                setCmdIdx(nextIdx);
                if (nextIdx >= commands.length) {
                    newHistory.push({ type: 'success', text: termConfig.successMessage || '✅ أحسنت! أكملت جميع الأوامر.' });
                    setDone(true);
                    onComplete?.();
                }
            } else {
                newHistory.push({ type: 'error', text: `أمر غير صحيح. ${expected.hint ? 'تلميح: ' + expected.hint : ''}` });
            }
        }
        setHistory(newHistory);
    };

    if (!commands.length) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a14] border border-green-500/20 rounded-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-green-400" />
                        <span className="text-xs text-green-400 font-bold font-mono">المحاكي التفاعلي</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-mono">{cmdIdx}/{commands.length}</span>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(cmdIdx / commands.length) * 100}%` }} />
                    </div>
                </div>
            </div>
            {termConfig.description && (
                <div className="px-4 py-2 bg-green-500/5 border-b border-white/5 text-xs text-green-300/70">{termConfig.description}</div>
            )}
            <div className="p-4 font-mono text-sm max-h-80 overflow-y-auto" dir="ltr" style={{ minHeight: 100 }}>
                {history.map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className={`mb-1.5 ${line.type === 'error' ? 'text-red-400' : line.type === 'success' ? 'text-green-400 font-bold' : line.type === 'input' ? 'text-white' : 'text-gray-400'}`}>
                        {line.type === 'input' && <span className="text-green-400">❯ </span>}{line.text}
                    </motion.div>
                ))}
                {!done && (
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-green-400">❯</span>
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCommand}
                            autoFocus className="flex-1 bg-transparent outline-none text-white caret-green-400"
                            placeholder={commands[cmdIdx]?.hint || 'Type command...'} />
                    </div>
                )}
                <div ref={endRef} />
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════
   QUIZ BLOCK
   ═══════════════════════════════════════════════════════════ */
function QuizBlock({ config, onSubmit }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [passed, setPassed] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);

    let questions = config;
    if (typeof questions === 'string') { try { questions = JSON.parse(questions); } catch { questions = []; } }
    if (typeof questions === 'string') { try { questions = JSON.parse(questions); } catch { questions = []; } }
    if (!Array.isArray(questions) || !questions.length) return null;

    const score = questions.reduce((a, q, i) => a + (answers[i] === q.correctAnswer ? 1 : 0), 0);

    const handleSubmit = () => {
        const ok = questions.every((q, i) => answers[i] === q.correctAnswer);
        setSubmitted(true);
        setPassed(ok);

        // Pass results to parent
        onSubmit?.({
            score,
            total_questions: questions.length,
            passed: ok,
            answers
        });
    };

    const reset = () => { setSubmitted(false); setPassed(false); setAnswers({}); setCurrentQ(0); };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#12122a] border border-yellow-500/20 rounded-2xl overflow-hidden my-8" dir="rtl">
            <div className="px-5 py-4 bg-gradient-to-l from-yellow-600/10 to-orange-600/10 border-b border-yellow-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                        <Brain size={20} className="text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-yellow-400">اختبار الفهم</h3>
                        <p className="text-xs text-gray-500">{questions.length} أسئلة</p>
                    </div>
                </div>
                {!submitted && (
                    <div className="flex items-center gap-1.5">
                        {questions.map((_, i) => (
                            <button key={i} onClick={() => setCurrentQ(i)}
                                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${answers[i] !== undefined ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : i === currentQ ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}>{i + 1}</button>
                        ))}
                    </div>
                )}
            </div>
            <div className="p-5">
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                            <p className="font-bold text-white text-base"><span className="text-yellow-400 ml-2">{currentQ + 1}.</span>{questions[currentQ]?.question}</p>
                            <div className="space-y-2">
                                {(questions[currentQ]?.options || []).map((opt, oi) => (
                                    <motion.button key={oi} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                        onClick={() => setAnswers(p => ({ ...p, [currentQ]: oi }))}
                                        className={`w-full text-right px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 border ${answers[currentQ] === oi ? 'bg-purple-500/15 border-purple-500/40 text-white' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}>
                                        <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${answers[currentQ] === oi ? 'border-purple-400 bg-purple-500/20' : 'border-white/20'}`}>
                                            {answers[currentQ] === oi && <div className="w-2.5 h-2.5 rounded bg-purple-400" />}
                                        </span>
                                        {opt}
                                    </motion.button>
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0} className="text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-all flex items-center gap-1"><ChevronRight size={16} /> السابق</button>
                                {currentQ < questions.length - 1
                                    ? <button onClick={() => setCurrentQ(p => p + 1)} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">التالي <ChevronLeft size={16} /></button>
                                    : <button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-l from-yellow-600 to-orange-600 text-white rounded-xl font-bold text-sm disabled:opacity-40"><Zap size={14} /> تحقق</button>
                                }
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className={`text-center p-5 rounded-xl ${passed ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                                <div className={`w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center ${passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                    {passed ? <Trophy size={24} className="text-green-400" /> : <AlertIcon size={24} className="text-red-400" />}
                                </div>
                                <p className={`text-lg font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>{passed ? '🎉 ممتاز!' : `${score}/${questions.length}`}</p>
                            </div>
                            {questions.map((q, qi) => (
                                <div key={qi} className={`p-3 rounded-xl border ${answers[qi] === q.correctAnswer ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                    <p className="text-sm text-white font-bold mb-1">{q.question}</p>
                                    <p className="text-xs"><span className="text-gray-500">إجابتك: </span><span className={answers[qi] === q.correctAnswer ? 'text-green-400' : 'text-red-400'}>{q.options?.[answers[qi]] || '—'}</span></p>
                                    {answers[qi] !== q.correctAnswer && <p className="text-xs"><span className="text-gray-500">الصحيحة: </span><span className="text-green-400">{q.options?.[q.correctAnswer]}</span></p>}
                                </div>
                            ))}
                            {!passed && <button onClick={reset} className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/10 flex items-center justify-center gap-2"><RotateCcw size={14} /> إعادة المحاولة</button>}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR — Units & Lessons navigation
   ═══════════════════════════════════════════════════════════ */
function Sidebar({ course, currentLessonId, completedLessons, onSelectLesson, onBack, open, onToggle }) {
    const [expandedUnits, setExpandedUnits] = useState({});
    const units = course?.units || [];

    // Auto-expand unit containing current lesson
    useEffect(() => {
        if (!currentLessonId) return;
        const found = {};
        units.forEach((u, i) => {
            if (u.lessons?.some(l => l.id === currentLessonId)) found[i] = true;
        });
        setExpandedUnits(prev => ({ ...prev, ...found }));
    }, [currentLessonId]);

    const toggle = (i) => setExpandedUnits(p => ({ ...p, [i]: !p[i] }));

    return (
        <>
            {/* Mobile toggle */}
            <button onClick={onToggle}
                className="lg:hidden fixed bottom-4 right-4 z-50 w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center">
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Overlay on mobile */}
            {open && <div onClick={onToggle} className="lg:hidden fixed inset-0 bg-black/60 z-40" />}

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-[#0a0a18]/95 backdrop-blur-xl border-l border-white/5 z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-10`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-white/5">
                        <button onClick={onBack}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-3 w-full">
                            <ChevronRight size={16} /> عودة للمسار
                        </button>
                        <h3 className="text-sm font-bold text-white truncate">{course?.title || 'الدورة'}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {units.reduce((a, u) => a + (u.lessons?.length || 0), 0)} درس
                        </p>
                    </div>

                    {/* Units & Lessons */}
                    <div className="flex-1 overflow-y-auto lesson-sidebar p-2">
                        {units.map((unit, ui) => (
                            <div key={unit.id || ui} className="mb-1">
                                <button onClick={() => toggle(ui)}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/5 transition-all">
                                    {expandedUnits[ui] ? <ChevronDown size={14} className="text-purple-400 flex-shrink-0" /> : <ChevronLeft size={14} className="text-gray-500 flex-shrink-0" />}
                                    <Layers size={13} className="text-purple-400/60 flex-shrink-0" />
                                    <span className="truncate flex-1 text-right">{unit.title}</span>
                                    <span className="text-[10px] text-gray-600">{unit.lessons?.length || 0}</span>
                                </button>
                                <AnimatePresence>
                                    {expandedUnits[ui] && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden pr-5">
                                            {(unit.lessons || []).map(lesson => {
                                                const isCurrent = lesson.id === currentLessonId;
                                                const isDone = completedLessons.includes(lesson.id);
                                                return (
                                                    <button key={lesson.id} onClick={() => onSelectLesson(lesson)}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all mb-0.5 ${isCurrent
                                                            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                                            : isDone
                                                                ? 'text-green-400/70 hover:bg-white/5'
                                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                            }`}>
                                                        {isDone
                                                            ? <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                                                            : isCurrent
                                                                ? <Play size={13} className="text-purple-400 flex-shrink-0" />
                                                                : <div className="w-3 h-3 rounded-full border border-gray-600 flex-shrink-0" />
                                                        }
                                                        <span className="truncate flex-1 text-right">{lesson.title}</span>
                                                        {lesson.xp_reward > 0 && <span className="text-[9px] text-yellow-500">{lesson.xp_reward}xp</span>}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════
   LESSON VIEWER — Main Component
   ═══════════════════════════════════════════════════════════ */
function LessonViewer({ lesson, onComplete, onBack, course, onSelectLesson, completedLessons = [] }) {
    const [termPassed, setTermPassed] = useState(false);
    const [quizPassed, setQuizPassed] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Reset state when lesson changes
    useEffect(() => {
        setTermPassed(false);
        setQuizPassed(false);
        setCompleted(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [lesson?.id]);

    // Parse configs safely
    const parseJSON = (val, fallback) => {
        let parsed = val;
        if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch { return fallback; } }
        if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch { return fallback; } }
        return parsed ?? fallback;
    };

    const quizConfig = parseJSON(lesson?.quiz_config, []);
    const termConfig = parseJSON(lesson?.terminal_config, {});

    const hasQuiz = Array.isArray(quizConfig) && quizConfig.length > 0;
    const hasTerm = termConfig && typeof termConfig === 'object' && Array.isArray(termConfig.commands) && termConfig.commands.length > 0;
    const canComplete = (!hasQuiz || quizPassed) && (!hasTerm || termPassed);

    const handleQuizSubmit = async (result) => {
        try {
            await apiCall('/lms/quiz/submit', {
                method: 'POST',
                body: JSON.stringify({
                    lesson_id: lesson.id,
                    ...result
                })
            });

            if (result.passed) {
                setQuizPassed(true);
                try { import('canvas-confetti').then(m => m.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } })); } catch { }
            }
        } catch (error) {
            console.error("Quiz submission failed", error);
        }
    };

    const handleComplete = () => {
        setCompleted(true);
        try { import('canvas-confetti').then(m => m.default({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#a855f7', '#ec4899', '#38bdf8', '#4ade80'] })); } catch { }
        setTimeout(() => onComplete?.(), 2500);
    };

    const mdComponents = useMemo(() => ({
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match?.[1];
            const codeStr = String(children).replace(/\n$/, '');

            if (lang === 'mermaid') {
                return <MermaidDiagram code={codeStr} />;
            }

            if (!inline && lang) {
                return (
                    <div className="relative group my-8 dir-ltr">
                        <div className="absolute top-0 right-0 px-3 py-1 bg-[#1e1e2e] text-[10px] text-gray-400 font-mono rounded-bl-lg border-l border-b border-white/10 z-10">
                            {lang}
                        </div>
                        <CopyBtn text={codeStr} />
                        <SyntaxHighlighter
                            style={atomDark}
                            language={lang}
                            PreTag="div"
                            className="!bg-[#0a0a14] !p-6 rounded-xl border border-white/10 shadow-lg !text-sm !font-mono !leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                            showLineNumbers={true}
                            lineNumberStyle={{ minWidth: '2em', opacity: 0.3, paddingRight: '1em', marginRight: '1em', borderRight: '1px solid rgba(255,255,255,0.1)' }}
                            {...props}
                        >
                            {codeStr}
                        </SyntaxHighlighter>
                    </div>
                );
            }

            return (
                <code className="bg-[#1e1e2e] text-[#a78bfa] px-1.5 py-0.5 rounded font-mono text-[0.9em]" {...props}>
                    {children}
                </code>
            );
        },
        img({ src, alt }) {
            const finalSrc = src?.startsWith('http') ? src : `http://localhost:5000${src}`;
            return (
                <div className="my-8 relative group">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a14]">
                        <img
                            src={finalSrc}
                            alt={alt}
                            className="w-full h-auto max-h-[600px] object-contain"
                            loading="lazy"
                        />
                    </div>
                    {alt && <p className="text-center text-gray-500 text-sm mt-3 font-medium">{alt}</p>}
                </div>
            );
        },
        blockquote({ node, children, ...props }) {
            const text = node?.children?.map(c => c.children?.map(t => t.value || '').join('')).join('\n') || '';
            const callout = parseCallout(text);

            if (callout) {
                const typeClass = `obs-callout-${['note', 'warning', 'tip', 'danger', 'important', 'caution'].includes(callout.type) ? callout.type : 'note'}`;
                return (
                    <div className={`obs-callout ${typeClass} my-6`}>
                        <div className="obs-callout-title">{CALLOUT_ICONS[callout.type] || <Info size={16} />}{callout.title}</div>
                        <div className="obs-callout-content text-sm leading-relaxed text-gray-300">
                            <ReactMarkdown components={mdComponents}>{callout.body}</ReactMarkdown>
                        </div>
                    </div>
                );
            }
            return <blockquote className="border-r-4 border-purple-500/50 bg-purple-500/5 pr-4 py-2 my-6 rounded-l-lg italic text-gray-300" {...props}>{children}</blockquote>;
        },
        table({ children }) {
            return (
                <div className="overflow-x-auto my-8 border border-white/10 rounded-xl shadow-lg">
                    <table className="w-full text-sm text-right text-gray-300 divide-y divide-white/5">{children}</table>
                </div>
            );
        },
        thead({ children }) { return <thead className="bg-white/5 font-bold text-white">{children}</thead>; },
        th({ children }) { return <th className="px-6 py-4 whitespace-nowrap">{children}</th>; },
        td({ children }) { return <td className="px-6 py-4 whitespace-nowrap">{children}</td>; },
        a({ href, children }) {
            return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline decoration-blue-400/30 underline-offset-4 transition-all">{children}</a>
        }
    }), []);

    if (!lesson) return null;

    const wordCount = (lesson.content || '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    const hasSidebar = course && course.units?.length > 0;

    return (
        <div className="min-h-screen bg-[#05050f] relative" dir="rtl">

            <ReadingProgress />

            {/* Decorative */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/8 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/8 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
            </div>

            <div className="flex relative z-10">
                {/* Sidebar */}
                {hasSidebar && (
                    <Sidebar
                        course={course}
                        currentLessonId={lesson.id}
                        completedLessons={completedLessons}
                        onSelectLesson={onSelectLesson}
                        onBack={onBack}
                        open={sidebarOpen}
                        onToggle={() => setSidebarOpen(p => !p)}
                    />
                )}

                {/* Main content */}
                <div className={`flex-1 min-w-0 ${hasSidebar ? 'lg:mr-0' : ''}`}>
                    {/* Top bar (when no sidebar) */}
                    {!hasSidebar && onBack && (
                        <nav className="sticky top-0 z-40 bg-[#0a0a18]/90 backdrop-blur border-b border-white/5 px-6 py-3 flex items-center justify-between">
                            <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white text-sm gap-1">
                                <ChevronRight size={16} /> عودة
                            </button>
                            <span className="text-white font-bold text-sm truncate max-w-md">{lesson.title}</span>
                            <div />
                        </nav>
                    )}

                    <div className="max-w-4xl mx-auto px-6 py-10">
                        {/* Hero Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-12 relative"
                        >
                            {/* Gradient border card */}
                            <div className="rounded-3xl p-[1px] bg-gradient-to-br from-purple-500/40 via-pink-500/20 to-blue-500/30">
                                <div className="bg-[#0a0a1a] rounded-3xl p-8 md:p-10">
                                    {/* Top row: course badge + lesson number */}
                                    <div className="flex items-center justify-between mb-6">
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300">
                                            <GraduationCap size={14} /> {course?.title || 'الدرس'}
                                        </motion.div>
                                        {lesson.order_index != null && (
                                            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                                                {lesson.order_index + 1}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-5 leading-[1.6]">{lesson.title}</h1>

                                    {/* Description if available */}
                                    {lesson.description && (
                                        <p className="text-gray-400 text-base mb-6 leading-relaxed max-w-2xl">{lesson.description}</p>
                                    )}

                                    {/* Meta chips */}
                                    <div className="flex flex-wrap gap-3 text-xs">
                                        <span className="flex items-center gap-2 bg-[#12122a] border border-white/8 px-4 py-2 rounded-xl text-gray-400">
                                            <Clock size={13} className="text-purple-400" /> {readTime} دقيقة قراءة
                                        </span>
                                        <span className="flex items-center gap-2 bg-[#12122a] border border-white/8 px-4 py-2 rounded-xl text-gray-400">
                                            <BookOpen size={13} className="text-blue-400" /> {wordCount} كلمة
                                        </span>
                                        {lesson.xp_reward > 0 && (
                                            <span className="flex items-center gap-2 bg-yellow-500/8 border border-yellow-500/15 px-4 py-2 rounded-xl text-yellow-400">
                                                <Award size={13} /> {lesson.xp_reward} XP
                                            </span>
                                        )}
                                        {hasQuiz && (
                                            <span className="flex items-center gap-2 bg-blue-500/8 border border-blue-500/15 px-4 py-2 rounded-xl text-blue-400">
                                                <Brain size={13} /> اختبار تفاعلي
                                            </span>
                                        )}
                                        {hasTerm && (
                                            <span className="flex items-center gap-2 bg-green-500/8 border border-green-500/15 px-4 py-2 rounded-xl text-green-400">
                                                <Terminal size={13} /> تطبيق عملي
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Decorative glow */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 rounded-[2rem] blur-2xl -z-10" />
                        </motion.div>

                        {/* Video */}
                        {lesson.video_url && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40">
                                {lesson.video_url.includes('youtube') || lesson.video_url.includes('youtu.be')
                                    ? <iframe src={lesson.video_url.replace('watch?v=', 'embed/')} className="w-full aspect-video" allowFullScreen />
                                    : <video src={lesson.video_url} controls className="w-full aspect-video" />}
                            </motion.div>
                        )}

                        {/* Content */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="bg-[#0a0a16] border-r-2 border-purple-500/20 rounded-2xl p-8 md:p-12 shadow-sm">
                            <article className="obs-prose max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={mdComponents}
                                >
                                    {lesson.content || ''}
                                </ReactMarkdown>
                            </article>
                        </motion.div>

                        {/* Terminal */}
                        {hasTerm && (
                            <div className="mt-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 h-px bg-gradient-to-l from-green-500/30 to-transparent" />
                                    <span className="text-xs text-green-400 font-bold flex items-center gap-1.5"><Terminal size={12} /> التطبيق العملي</span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent" />
                                </div>
                                <InteractiveTerminal config={termConfig} onComplete={() => setTermPassed(true)} />
                            </div>
                        )}

                        {/* Quiz */}
                        {hasQuiz && (
                            <div className="mt-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 h-px bg-gradient-to-l from-yellow-500/30 to-transparent" />
                                    <span className="text-xs text-yellow-400 font-bold flex items-center gap-1.5"><Brain size={12} /> اختبار الفهم</span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
                                </div>
                                <QuizBlock config={quizConfig} onSubmit={handleQuizSubmit} />
                            </div>
                        )}

                        {/* Completion */}
                        <div className="mt-12 text-center">
                            {(hasQuiz || hasTerm) && !completed && (
                                <div className="bg-[#12122a] border border-white/5 rounded-2xl p-5 mb-6 max-w-sm mx-auto">
                                    <h4 className="text-sm font-bold text-white mb-3 flex items-center justify-center gap-2"><Target size={14} className="text-purple-400" /> المتطلبات</h4>
                                    <div className="space-y-2">
                                        {hasTerm && (
                                            <div className={`flex items-center gap-2 text-sm ${termPassed ? 'text-green-400' : 'text-gray-500'}`}>
                                                {termPassed ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-600" />} المحاكي
                                            </div>
                                        )}
                                        {hasQuiz && (
                                            <div className={`flex items-center gap-2 text-sm ${quizPassed ? 'text-green-400' : 'text-gray-500'}`}>
                                                {quizPassed ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-600" />} الاختبار
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {completed ? (
                                    <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                        className="inline-flex flex-col items-center gap-3 px-10 py-8 bg-[#12122a] border border-green-500/30 rounded-2xl">
                                        <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center"><Trophy size={28} className="text-green-400" /></div>
                                        <span className="text-lg font-bold text-green-400">تم إكمال الدرس! 🎉</span>
                                        {lesson.xp_reward > 0 && <span className="text-sm text-yellow-400 bg-yellow-500/10 px-4 py-1 rounded-full">+{lesson.xp_reward} XP</span>}
                                    </motion.div>
                                ) : (
                                    <motion.button key="btn" whileHover={canComplete ? { scale: 1.03 } : {}} whileTap={canComplete ? { scale: 0.97 } : {}}
                                        onClick={handleComplete} disabled={!canComplete}
                                        className={`inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all ${canComplete
                                            ? 'bg-gradient-to-l from-purple-600 via-pink-600 to-purple-700 text-white shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:shadow-[0_0_60px_rgba(168,85,247,0.25)]'
                                            : 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-white/5'
                                            }`}>
                                        {canComplete ? <CheckCircle size={22} /> : <Lock size={22} />}
                                        {canComplete ? 'إكمال الدرس' : 'أكمل المتطلبات'}
                                        {canComplete && <ArrowRight size={18} className="mr-1" />}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-20" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LessonViewer;