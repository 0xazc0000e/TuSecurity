import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, HelpCircle, ChevronLeft, ChevronRight, Terminal, BookOpen, AlertCircle } from 'lucide-react';
import { MiniWindows } from './MiniWindows';
import { MiniTerminal } from './MiniTerminal';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_VFS } from './bashUtils';

const LEVELS = [
    {
        id: 1,
        title: "المستوى 1: الاستكشاف (The Explorer)",
        description: "مهمتك الأولى هي تعلم كيفية التجول في النظام.، ومعرفة مكانك، وماذا يوجد حولك.",
        tasks: [
            {
                id: 'l1-1',
                command: 'whoami',
                title: "الهوية",
                description: "اكتشف ما هو اسم المستخدم الخاص بك.",
                details: "`whoami` يخبرك بالهوية الحالية. الصلاحيات تعتمد على هويتك.",
                hint: "فقط اكتب `whoami`",
                check: (vfs, path, lastCmd) => lastCmd === 'whoami'
            },
            {
                id: 'l1-2',
                command: 'pwd',
                title: "الموقع",
                description: "أين أنت الآن؟ اعرض مسار المجلد الحالي.",
                details: "`pwd` (Print Working Directory) يرسم لك خريطة العودة.",
                hint: "اكتب `pwd`",
                check: (vfs, path, lastCmd) => lastCmd === 'pwd'
            },
            {
                id: 'l1-3',
                command: 'ls',
                title: "المسح",
                description: "اعرض الملفات الموجودة حولك.",
                details: "`ls` يسرد المحتويات. جرب `ls -l` للتفاصيل لاحقاً.",
                hint: "اكتب `ls`",
                check: (vfs, path, lastCmd) => lastCmd.startsWith('ls')
            },
            {
                id: 'l1-4',
                command: 'cd',
                title: "الدخول",
                description: "ادخل إلى مجلد 'documents'.",
                details: "`cd` (Change Directory) هو وسيلة النقل الخاصة بك.",
                hint: "اكتب `cd documents`",
                check: (vfs, path) => path === '/home/user/documents'
            },
            {
                id: 'l1-5',
                command: 'cd ..',
                title: "العودة",
                description: "ارجع للخلف خطوة واحدة (إلى المجلد الرئيسي).",
                details: "`..` تعني 'المجلد الأب' أو السابق.",
                hint: "اكتب `cd ..`",
                check: (vfs, path) => path === '/home/user'
            }
        ]
    },
    {
        id: 2,
        title: "المستوى 2: المنشئ والمدمر (The Builder)",
        description: "القوة الحقيقية هي في القدرة على التغيير. ستتعلم الآن كيف تبني عالماً رقمياً وتهدمه.",
        tasks: [
            {
                id: 'l2-1',
                command: 'mkdir',
                title: "التأسيس",
                description: "أنشئ مجلداً جديداً باسم 'mission_data'.",
                details: "`mkdir` ينشئ مجلدات فارغة لتنظيم عملك.",
                hint: "اكتب `mkdir mission_data`",
                check: (vfs) => vfs['/home/user/mission_data']?.type === 'dir'
            },
            {
                id: 'l2-2',
                command: 'touch',
                title: "الخلق",
                description: "أنشئ ملفاً فارغاً داخل المجلد الجديد باسم 'target.txt'.",
                details: "أولاً ادخل المجلد بـ `cd mission_data` ثم استخدم `touch`.",
                hint: "اكتب `cd mission_data` ثم `touch target.txt`",
                check: (vfs) => vfs['/home/user/mission_data/target.txt']?.type === 'file'
            },
            {
                id: 'l2-3',
                command: 'cp',
                title: "الاستنساخ",
                description: "انسخ الملف 'target.txt' باسم 'target_backup.txt'.",
                details: "`cp` ينسخ الملفات. النسخ الاحتياطي هو أهم مهارة.",
                hint: "اكتب `cp target.txt target_backup.txt`",
                check: (vfs) => vfs['/home/user/mission_data/target_backup.txt']?.type === 'file'
            },
            {
                id: 'l2-4',
                command: 'mv',
                title: "النقل",
                description: "عد إلى المجلد الرئيسي، وانقل مجلد 'mission_data' ليصبح داخل 'documents'.",
                details: "استخدم `cd ..` أولاً. ثم `mv mission_data documents`.",
                hint: "اكتب `cd ..` ثم `mv mission_data documents`",
                check: (vfs) => vfs['/home/user/documents/mission_data']?.type === 'dir'
            }
        ]
    },
    {
        id: 3,
        title: "المستوى 3: المشرف (The Admin)",
        description: "الآن ندخل في العمق. الصلاحيات، العمليات، والبحث.",
        tasks: [
            {
                id: 'l3-1',
                command: 'grep',
                title: "البحث",
                description: "ابحث عن كلمة 'Budget' داخل ملفات النظام.",
                details: "`grep` يبحث عن نصوص داخل الملفات. أداة قوية جداً.",
                hint: "جرب `grep Budget` (هذا محاكاة)",
                check: (vfs, path, lastCmd) => lastCmd.includes('grep')
            },
            {
                id: 'l3-2',
                command: 'rm',
                title: "التنظيف",
                description: "احذف الملف 'notes.txt' نهائياً.",
                details: "لا تراجع بعد `rm`. كن حذراً.",
                hint: "اكتب `rm notes.txt`",
                check: (vfs, path) => !vfs['/home/user/notes.txt']
            },
            {
                id: 'l3-3',
                command: 'clear',
                title: "الصفاء",
                description: "نظف شاشتك واستعد للمهمة القادمة.",
                details: "`clear` يمسح الفوضى من أمام عينك.",
                hint: "اكتب `clear`",
                check: (vfs, path, lastCmd) => lastCmd === 'clear'
            }
        ]
    }
];

export const SimulationTab = ({ onComplete }) => {
    const [vfs, setVfs] = useState(INITIAL_VFS);
    const [currentPath, setCurrentPath] = useState('/home/user');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [lastCommand, setLastCommand] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const currentLevel = LEVELS[currentLevelIndex];
    const currentTask = currentLevel.tasks[currentTaskIndex];

    // Check functionality
    useEffect(() => {
        if (currentTask.check(vfs, currentPath, lastCommand)) {
            handleSuccess();
        }
    }, [vfs, lastCommand, currentPath]);

    const handleSuccess = () => {
        setFeedback({ type: 'success', message: 'مذهل! إجابة صحيحة' });

        setTimeout(() => {
            setFeedback(null);
            setLastCommand('');
            setShowHint(false);

            if (currentTaskIndex < currentLevel.tasks.length - 1) {
                setCurrentTaskIndex(prev => prev + 1);
            } else if (currentLevelIndex < LEVELS.length - 1) {
                // Next Level
                setCurrentLevelIndex(prev => prev + 1);
                setCurrentTaskIndex(0);
                setFeedback({ type: 'level-up', message: `مبروك! انتقلت إلى ${LEVELS[currentLevelIndex + 1].title}` });
                setTimeout(() => setFeedback(null), 3000);
            } else {
                // All complete
                onComplete();
            }
        }, 1500);
    };

    const handleReset = () => {
        setVfs(INITIAL_VFS);
        setCurrentPath('/home/user');
        setCurrentLevelIndex(0);
        setCurrentTaskIndex(0);
        setLastCommand('');
        setFeedback(null);
    };

    return (
        <div className="flex flex-col h-full bg-[#0c0c0c] font-cairo text-white">

            {/* Header / Mission Stat */}
            <div className="bg-[#151515] border-b border-white/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="text-xs text-[#7112AF] font-bold mb-1 uppercase tracking-wider">{currentLevel.title}</div>
                    <div className="text-lg font-bold flex items-center gap-2">
                        <Terminal size={18} className="text-slate-400" />
                        {currentTask.title}
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-normal">
                            مهمة {currentTaskIndex + 1} من {currentLevel.tasks.length}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowHint(!showHint)}
                        className="px-3 py-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                        <HelpCircle size={16} /> {showHint ? 'إخفاء التلميح' : 'مساعدة'}
                    </button>
                    <button onClick={handleReset} className="p-2 text-slate-400 hover:bg-white/10 rounded-lg" title="إعادة تشغيل">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Educational Content Area */}
            <div className="bg-[#111] p-4 md:p-6 border-b border-white/5">
                <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_auto] gap-6">
                    <div>
                        <h3 className="text-slate-300 font-bold mb-2 flex items-center gap-2">
                            <BookOpen size={16} className="text-[#7112AF]" />
                            التوجيهات:
                        </h3>
                        <p className="text-xl md:text-2xl font-bold bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent mb-4 leading-relaxed">
                            {currentTask.description}
                        </p>
                        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 text-sm leading-relaxed text-slate-300">
                            <p className="mb-2"><strong className="text-[#b66dff]">شرح الأمر:</strong> {currentTask.details}</p>
                            <AnimatePresence>
                                {showHint && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-2 pt-2 border-t border-white/10 text-yellow-500 font-mono"
                                    >
                                        &gt; {currentTask.hint}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col items-center justify-center p-4 bg-[#0a0a0a] rounded-xl border border-white/5 min-w-[120px]">
                        <div className="text-4xl font-mono text-[#7112AF] font-bold mb-1">{currentTask.command}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest">Command</div>
                    </div>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                {/* Visual Side (GUI) */}
                <div className="hidden md:block w-1/3 border-l border-white/10 bg-[#111] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    <div className="p-2 sticky top-0 bg-[#111]/80 backdrop-blur z-10 border-b border-white/5 text-xs font-bold text-slate-500 uppercase">File Explorer Mockup</div>
                    <MiniWindows vfs={vfs} currentPath={currentPath} />
                </div>

                {/* Terminal Side (CLI) */}
                <div className="flex-1 bg-[#0c0c0c] flex flex-col min-h-[300px] border-t md:border-t-0">
                    <div className="p-2 bg-[#1a1a1a] border-b border-white/5 text-xs font-mono text-green-500 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        Terminal Session - user@tucc
                    </div>
                    <MiniTerminal
                        vfs={vfs}
                        setVfs={setVfs}
                        currentPath={currentPath}
                        setCurrentPath={setCurrentPath}
                        setLastCommand={setLastCommand}
                    />
                </div>
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                    >
                        <div className={`
                            px-6 py-3 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] border flex items-center gap-3
                            ${feedback.type === 'success' || feedback.type === 'level-up'
                                ? 'bg-green-500/10 border-green-500/50 text-green-400'
                                : 'bg-red-500/10 border-red-500/50 text-red-400'}
                        `}>
                            {feedback.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            <span className="font-bold">{feedback.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
