const fs = require('fs');

const fileContent = `import React, { useState, useEffect, useRef } from 'react';
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
    ChevronDown, ChevronUp
} from 'lucide-react';
import { MatrixBackground } from '../ui/MatrixBackground';
import { apiCall } from '../../context/AuthContext';

const BASH_THEORY_SLIDES = [
    {
        icon: Terminal, color: '#ff006e',
        title: 'المترجم بينك وبين النواة (Kernel)',
        desc: 'الـ Bash ليس النظام بحد ذاته، بل هو نافذة التخاطب بينك (المستخدم) وبين عقل النظام (Kernel). عندما تكتب أمراً، يقوم Bash بترجمته إلى نبضات يفهمها المعالج.'
    },
    {
        icon: Globe, color: '#7112AF',
        title: 'لماذا لا نستخدم الفأرة؟',
        desc: 'في الأمن السيبراني وإدارة السيرفرات السحابية، الأجهزة غالباً تكون بدون واجهة رسومية لتقليل استهلاك الموارد وتقليل الثغرات. لذلك، التحكم السطري عبر Bash هو الطريقة الوحيدة والأسرع.'
    },
    {
        icon: Zap, color: '#eab308',
        title: 'قوة الأوامر المركبة',
        desc: 'بعكس الواجهات الرسومية، في الـ Terminal يمكنك الجمع بين عشرات الأدوات بضغطة زر واحدة (باستخدام العلامات والروابط) لأداء مهام قد تستغرق ساعات بالطرق العادية.'
    },
    {
        icon: Shield, color: '#10b981',
        title: 'لغة المخترقين',
        desc: 'كل أدوات الاختراق واكتشاف الثغرات (مثل Nmap و Metasploit) مصممة لتعمل عبر الـ Terminal. إتقانك له هو خطوتك الأولى الحقيقية في هذا المجال.'
    }
];

const CURRICULUM = {
    basics: {
        id: 'basics', title: 'الوحدة الأولى: الأساسيات', subtitle: 'كسر حاجز الخوف من الشاشة السوداء', color: '#240993', icon: Terminal,
        description: 'تعلم الأوامر الأساسية للتنقل في النظام',
        lessons: [
            {
                id: 1, title: 'الاستكشاف والرؤية (ls)', concept: 'غرفة مظلمة، عند تشغيل الكشاف تظهر الصناديق والأوراق. نعرض محتويات المجلد لمعرفة ما بداخله.',
                subTasks: [
                    {
                        id: '1a', command: 'ls', task: 'استعرض محتويات المجلد الحالي لرؤية الأدوات المتاحة', hint: 'استخدم ls לעرض الملفات والمجلدات', xp: 10,
                        question: { text: 'كم عدد المجلدات (Folders) الواضحة في المخرجات؟', options: ['0', '1', '2', '3'], answer: '2' }
                    },
                    {
                        id: '1b', command: 'ls -a', task: 'ابحث عن الملفات المخفية (التي تبدأ بنقطة).', hint: 'استخدم ls -a לעرض المخفي', xp: 15,
                        question: { text: 'ما هو اسم المجلد المخفي الذي ظهر للتو؟', options: ['.hidden_folder', '.secret_config', '.git', '.bashrc'], answer: '.secret_config' }
                    },
                    {
                        id: '1c', command: 'ls -la', task: 'عرض تفاصيل الملفات من صلاحيات وتواريخ للصناديق والمخفي.', hint: 'استخدم ls -la', xp: 20,
                        question: { text: 'من مخرجات مساحة الحجم، كم حجم المجلدات الافتراضي المعروض؟', options: ['4096', '15', '1024', '0'], answer: '4096' }
                    }
                ]
            },
            {
                id: 2, title: 'التحركات والمواقع (cd & pwd)', concept: 'في العالم الرقمي، لا يمكنك التحرك إذا لم تعرف موقعك، وكيف تفتح الأبواب للغرف المجاورة.',
                subTasks: [
                    {
                        id: '2a', command: 'pwd', task: 'المخترق يجب أن يحدد موقعه الحالي لتجنب الضياع.', hint: 'اكتب pwd لمعرفة مسارك', xp: 10,
                        question: { text: 'ما هو المسار المطبوع على الشاشة؟', options: ['/', '/home/student', '/root', '/var/www'], answer: '/home/student' }
                    },
                    {
                        id: '2b', command: 'cd data', task: 'ادخل إلى مجلد data لاستكشافه.', hint: 'اكتب cd data', xp: 10,
                        question: { text: 'كيف تتأكد أنك انتقلت؟', options: ['مؤشر الطرفية تغير', 'صدر صوت', 'الشاشة انطفأت'], answer: 'مؤشر الطرفية تغير' }
                    },
                    {
                        id: '2c', command: 'cd ..', task: 'تراجع خطوة للوراء إلى المجلد الأب.', hint: 'اكتب cd .. بمسافة', xp: 10,
                        question: { text: 'النقطتان (..) تعبران عن ماذا في نظام اللينكس؟', options: ['المجلد السابق (الأب)', 'المجلد الجذري', 'مجلد المنزل'], answer: 'المجلد السابق (الأب)' }
                    },
                    {
                        id: '2d', command: 'clear', task: 'نظف الشاشة من الأوامر المزدحمة لتبدأ بصفحة بيضاء.', hint: 'استخدم clear', xp: 5,
                        question: { text: 'هل مسح الشاشة يحذف أو يلغي ما تم عمله سابقاً؟', options: ['نعم', 'لا، هو إجراء شكلي فقط لإراحة العين'], answer: 'لا، هو إجراء شكلي فقط لإراحة العين' }
                    }
                ]
            }
        ]
    },
    symbols: {
        id: 'symbols', title: 'الوحدة الثانية: الرموز السحرية', subtitle: 'نواة الاختراق الفعلي', color: '#ff006e', icon: Zap,
        description: 'دمج الأوامر وتحويل المخرجات في سطر واحد',
        lessons: [
            {
                id: 3, title: 'الربط الأنبوبي (Pipe |)', concept: 'مثل توصيل خرطوم مياه بمصنع، مخرجات الأداة الأولى تدخل كتيار للأداة الثانية.',
                subTasks: [
                    {
                        id: '3a', command: 'ls | grep txt', task: 'اعرض فقط الملفات النصية من مجلدك مستخدماً الأنبوب.', hint: 'اجمع ls مع grep عن طريق العارض |', xp: 20,
                        question: { text: 'في الأمر السابق، ما الذي كان يبحث عنه grep؟', options: ['داخل الملفات', 'داخل مخرجات أمر ls', 'داخل الإنترنت'], answer: 'داخل مخرجات أمر ls' }
                    }
                ]
            },
            {
                id: 4, title: 'إعادة التوجيه (> و >>)', concept: 'تحويل مجرى المياه (المخرجات) إلى دلو (ملف) بدلاً من أن يسكب على الشاشة.',
                subTasks: [
                    {
                        id: '4a', command: 'echo "hello root" > target.txt', task: 'اكتب رسالة داخل ملف جديد باسم target.txt.', hint: 'استخدم علامة > لكتابة الملف', xp: 15,
                        question: { text: 'أين ذهبت مخرجات أمر echo؟', options: ['إلى الشاشة', 'إلى الملف target.txt', 'ضاعت'], answer: 'إلى الملف target.txt' }
                    }
                ]
            },
            {
                id: 5, title: 'النجمة المدمرة (*)', concept: 'وحش يطابق أي نص. خطير ولكنه فعال جداً.',
                subTasks: [
                    {
                        id: '5a', command: 'rm *.txt', task: 'أخفِ أثرك بمسح كل الملفات النصية بضربة واحدة.', hint: 'استخدم rm متبوعاً بمطابقة النجمة *.txt', xp: 20,
                        question: { text: 'لو كتبنا rm * ماذا سيحدث؟', options: ['يمسح المجلد الحالي كاملاً (كل الملفات)', 'يعرض النجوم', 'يرفض النظام'], answer: 'يمسح المجلد الحالي كاملاً (كل الملفات)' }
                    }
                ]
            }
        ]
    }
};

export default function BashSimulatorPro({ onBack }) {
    const [showIntro, setShowIntro] = useState(true);
    const [introSlide, setIntroSlide] = useState(0);

    const [currentUnit, setCurrentUnit] = useState('basics');
    const [currentLesson, setCurrentLesson] = useState(0);
    const [currentSubTask, setCurrentSubTask] = useState(0);

    const [showTheory, setShowTheory] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [questionStatus, setQuestionStatus] = useState(null); // 'waiting', 'success', 'error'
    const [selectedAnswer, setSelectedAnswer] = useState('');

    const [terminalInput, setTerminalInput] = useState('');
    const [terminalHistory, setTerminalHistory] = useState([]);
    const [fileSystem, setFileSystem] = useState({
        currentPath: '/home/student',
        files: ['notes.txt', 'data/', 'tools/', 'evidence.log'],
        hiddenFiles: ['.secret_config'],
        selectedFile: null
    });
    
    const [completedSubTasks, setCompletedSubTasks] = useState([]);
    const [totalXP, setTotalXP] = useState(0);
    const [showUnits, setShowUnits] = useState(false);
    const [expandedLessons, setExpandedLessons] = useState([0]); // Accordion state

    const terminalRef = useRef(null);

    const unit = CURRICULUM[currentUnit];
    const lesson = unit.lessons[currentLesson];
    const activeSubTask = lesson.subTasks[currentSubTask];
    
    let totalSubTasksCount = 0;
    Object.values(CURRICULUM).forEach(u => u.lessons.forEach(l => totalSubTasksCount += l.subTasks.length));

    // Handle initial state setup depending on whether intro is dismissed
    useEffect(() => {
        if (!showIntro && !showUnits && !showTheory && currentLesson === 0 && currentSubTask === 0) {
            setShowTheory(true);
        }
    }, [showIntro, showUnits]);

    const handleCommand = (command) => {
        if (showQuestion) return; // Prevent typing while question is active
        
        const trimmedCommand = command.trim().replace(/\s+/g, ' '); // Normalize spaces but strictly
        const parts = trimmedCommand.split(' ');
        const baseCommand = parts[0];
        const args = parts.slice(1);

        let output = '';
        let success = false;

        switch (baseCommand) {
            case 'pwd':
                output = fileSystem.currentPath;
                if (activeSubTask?.command === 'pwd') success = true;
                break;

            case 'ls':
                if (trimmedCommand === 'ls -la' || trimmedCommand === 'ls -al') {
                    output = \`drwxr-xr-x 2 student student 4096 Jan 1 .\\ndrwxr-xr-x 3 root    root    4096 Jan 1 ..\\ndrwxr-xr-x 2 student student 4096 Jan 1 .secret_config\\n-rw-r--r-- 1 student student   15 Jan 1 file1.txt\\ndrwxr-xr-x 2 student student 4096 Jan 1 folder1\\ndrwxr-xr-x 2 student student 4096 Jan 1 data\`;
                    if (activeSubTask?.command === 'ls -la') success = true;
                } else if (trimmedCommand === 'ls -a') {
                    output = ['.', '..', ...fileSystem.files, ...fileSystem.hiddenFiles].join('  ');
                    if (activeSubTask?.command === 'ls -a') success = true;
                } else if (trimmedCommand === 'ls -l') {
                    output = \`-rw-r--r-- 1 student student 15 Jan 1 file1.txt\\ndrwxr-xr-x 2 student student 4096 Jan 1 folder1\\ndrwxr-xr-x 2 student student 4096 Jan 1 data\`;
                } else if (trimmedCommand === 'ls') {
                    output = fileSystem.files.join('  ');
                    if (activeSubTask?.command === 'ls') success = true;
                } else if (trimmedCommand === 'ls | grep txt') {
                    output = 'file1.txt\\nnotes.txt';
                    if (activeSubTask?.command === 'ls | grep txt') success = true;
                } else {
                    output = \`ls: invalid option or incorrect spacing\`;
                }
                break;

            case 'cd':
                if (trimmedCommand === 'cd ..') {
                    const parentPath = fileSystem.currentPath.split('/').slice(0, -1).join('/') || '/';
                    setFileSystem(prev => ({ ...prev, currentPath: parentPath }));
                    output = \`Moved to \${parentPath}\`;
                    if (activeSubTask?.command === 'cd ..') success = true;
                } else if (args[0] && trimmedCommand === \`cd \${args[0]}\`) {
                    setFileSystem(prev => ({
                        ...prev,
                        currentPath: \`\${prev.currentPath}/\${args[0]}\`.replace(/\\/+/g, '/')
                    }));
                    output = \`Moved to \${args[0]}\`;
                    if (activeSubTask?.command === \`cd \${args[0]}\`) success = true;
                } else {
                    output = \`bash: cd: command physically requires a space, e.g., 'cd folder'\`;
                }
                break;

            case 'clear':
                setTerminalHistory([]);
                output = 'Screen cleared';
                if (activeSubTask?.command === 'clear') success = true;
                break;

            case 'rm':
                if (trimmedCommand === 'rm *.txt') {
                    setFileSystem(prev => ({
                        ...prev,
                        files: prev.files.filter(f => !f.endsWith('.txt'))
                    }));
                    output = \`Removed all .txt files\`;
                    if (activeSubTask?.command === 'rm *.txt') success = true;
                } else if (args[0]) {
                    setFileSystem(prev => ({
                        ...prev,
                        files: prev.files.filter(f => f !== args[0])
                    }));
                    output = \`Removed: \${args[0]}\`;
                    if (activeSubTask?.command === \`rm \${args[0]}\`) success = true;
                }
                break;

            case 'echo':
                // rudimentary redirect check
                if (trimmedCommand.includes('>')) {
                    const splitCommand = trimmedCommand.split('>');
                    const text = splitCommand[0].replace('echo', '').trim().replace(/["']/g, '');
                    const file = splitCommand[1].trim();
                    if (!fileSystem.files.includes(file)) {
                        setFileSystem(prev => ({ ...prev, files: [...prev.files, file] }));
                    }
                    output = \`Redirected text to \${file}\`;
                    if (activeSubTask?.command.includes(text) && activeSubTask?.command.includes('>')) success = true;
                } else {
                    output = args.join(' ').replace(/["']/g, '');
                    if (activeSubTask?.command === 'echo') success = true;
                }
                break;

            case 'help':
                output = \`Available commands:\\n  pwd, ls, cd, clear, rm, echo\\nSymbols:\\n  |, >, >>, *\`;
                break;

            default:
                output = \`Command not found: \${baseCommand}. Did you miss a space?\`;
        }

        const displayPath = fileSystem.currentPath.replace('/home/student', '~');
        setTerminalHistory(prev => [...prev,
            { type: 'input', content: \`student@cyberclub:\${displayPath}$ \${trimmedCommand}\`, path: displayPath, cmd: trimmedCommand },
            { type: 'output', content: output }
        ]);

        if (success && !completedSubTasks.includes(activeSubTask.id)) {
            // Trigger Follow-up Question
            if (activeSubTask.question) {
                setTimeout(() => {
                    setShowQuestion(true);
                    setQuestionStatus('waiting');
                }, 800);
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

        // Progress update logic
        const newProgress = Math.round((newCompleted.length / totalSubTasksCount) * 100);
        apiCall('/simulators/progress/update', 'POST', {
            simulator_id: 'bash-pro',
            progress_percentage: newProgress,
            is_completed: newProgress >= 100
        }).catch(err => console.error("Failed to save progress", err));

        // Advance logic
        setTimeout(() => {
            if (currentSubTask < lesson.subTasks.length - 1) {
                setCurrentSubTask(prev => prev + 1);
            } else if (currentLesson < unit.lessons.length - 1) {
                setCurrentLesson(prev => prev + 1);
                setCurrentSubTask(0);
                setShowTheory(true);
                setExpandedLessons(prev => [...prev, currentLesson + 1]);
            }
        }, 1500);
    };

    const handleQuestionAnswer = (answer) => {
        setSelectedAnswer(answer);
        if (answer === activeSubTask.question.answer) {
            setQuestionStatus('success');
            setTimeout(() => {
                completeSubTask();
            }, 1500);
        } else {
            setQuestionStatus('error');
            setTimeout(() => {
                setQuestionStatus('waiting');
                setSelectedAnswer('');
            }, 2000);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleCommand(terminalInput);
    };

    useEffect(() => {
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [terminalHistory, showQuestion]);

    const progress = (completedSubTasks.length / totalSubTasksCount) * 100;

    // View: Presentation Intro
    if (showIntro) {
        const slide = BASH_THEORY_SLIDES[introSlide];
        const SlideIcon = slide.icon;
        
        return (
            <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
                <MatrixBackground opacity={0.3} />
                <div className="relative z-10 min-h-screen flex items-center justify-center p-6 flex-col">
                    
                    {/* Progress Bar Top */}
                    <div className="w-full max-w-4xl flex items-center gap-2 mb-8">
                        {BASH_THEORY_SLIDES.map((_, idx) => (
                            <div key={idx} className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                <motion.div 
                                    className="h-full bg-[#ff006e]"
                                    initial={{ width: 0 }}
                                    animate={{ width: idx <= introSlide ? '100%' : '0%' }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={introSlide}
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl w-full bg-[#110C24] border border-[#ff006e]/30 rounded-3xl p-12 overflow-hidden relative shadow-[0_0_80px_rgba(255,0,110,0.15)] flex flex-col items-center text-center min-h-[400px]"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff006e]/10 blur-[100px] rounded-full pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7112AF]/10 blur-[100px] rounded-full pointer-events-none"></div>

                            <motion.div 
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                                className="mb-8 w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-xl"
                                style={{ boxShadow: \`0 0 40px \${slide.color}40\` }}
                            >
                                <SlideIcon size={48} style={{ color: slide.color }} />
                            </motion.div>

                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-black mb-6 text-white"
                            >
                                {slide.title}
                            </motion.h2>

                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-gray-300 leading-relaxed max-w-2xl"
                            >
                                {slide.desc}
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="mt-10 flex gap-4">
                        {introSlide > 0 && (
                            <button
                                onClick={() => setIntroSlide(prev => prev - 1)}
                                className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors"
                            >
                                السابق
                            </button>
                        )}
                        
                        {introSlide < BASH_THEORY_SLIDES.length - 1 ? (
                            <button
                                onClick={() => setIntroSlide(prev => prev + 1)}
                                className="px-8 py-3 bg-gradient-to-r from-[#ff006e] to-[#7112AF] text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,0,110,0.4)] transition-all flex items-center gap-2"
                            >
                                التالي <ArrowRight size={20} className="rotate-180" />
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setShowIntro(false);
                                    setShowUnits(true);
                                }}
                                className="px-8 py-3 bg-green-500 text-black rounded-xl font-bold hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all flex items-center gap-2"
                            >
                                بدء التطبيق العملي <Terminal size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // View: Unit Selection
    if (showUnits) {
        return (
            <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
                <MatrixBackground opacity={0.3} />
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            {onBack && (
                                <button onClick={onBack} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                                    <ArrowRight size={20} className="rotate-180" />
                                </button>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold">اختيار الوحدة</h1>
                                <p className="text-gray-400">اختر الوحدة للبدء</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(CURRICULUM).map(([key, unitData]) => {
                            const Unitcon = unitData.icon;
                            let userCompletedSubTasks = 0;
                            let unitTotalSubTasks = 0;
                            unitData.lessons.forEach(l => {
                                unitTotalSubTasks += l.subTasks.length;
                                l.subTasks.forEach(st => {
                                    if(completedSubTasks.includes(st.id)) userCompletedSubTasks++;
                                });
                            });
                            const isCompleted = userCompletedSubTasks === unitTotalSubTasks && unitTotalSubTasks > 0;

                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setCurrentUnit(key);
                                        setCurrentLesson(0);
                                        setCurrentSubTask(0);
                                        setShowUnits(false);
                                        setShowTheory(true);
                                        setExpandedLessons([0]);
                                    }}
                                    className={\`p-6 rounded-xl border text-right transition-all \${isCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-[#7112AF]/50'}\`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: \`\${unitData.color}20\` }}>
                                            <Unitcon size={32} style={{ color: unitData.color }} />
                                        </div>
                                        <div className="text-gray-400 text-sm">{userCompletedSubTasks}/{unitTotalSubTasks} مهام</div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{unitData.title}</h3>
                                    <p className="text-gray-400 text-sm">{unitData.description}</p>
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
            
            {/* Topbar */}
            <div className="relative z-10 border-b border-white/10 bg-[#0a0a0f]/90">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                         {onBack && (
                            <button onClick={onBack} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
                                <ArrowRight size={20} className="rotate-180" />
                            </button>
                        )}
                        <button onClick={() => setShowUnits(true)} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10">
                            <div className="p-2 rounded-lg" style={{ background: \`\${unit.color}30\` }}>
                                <Terminal size={20} style={{ color: unit.color }} />
                            </div>
                            <h1 className="text-sm font-bold flex gap-2">
                                {unit.title} <ChevronDown size={14} className="mt-1" />
                            </h1>
                        </button>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-sm font-bold">{Math.round(progress)}% إنجاز</div>
                                <div className="w-32 bg-white/10 h-2 rounded-full mt-1">
                                    <motion.div className="h-2 rounded-full bg-gradient-to-r from-[#240993] to-[#7112AF]" animate={{ width: \`\${progress}%\` }} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-yellow-500/20 text-yellow-500 font-bold px-4 py-2 rounded-lg border border-yellow-500/30 flex items-center gap-2">
                            <Star size={16} /> {totalXP} XP
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout */}
            <div className="relative z-10 p-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Panel: Nested Accordion */}
                    <div className="col-span-3">
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-white/10">
                                <h3 className="font-bold text-white mb-1">مسار الوحدة</h3>
                            </div>
                            <div className="overflow-y-auto max-h-[70vh]">
                                {unit.lessons.map((l, index) => {
                                    const isExpanded = expandedLessons.includes(index);
                                    const isCurrentLesson = currentLesson === index;
                                    
                                    return (
                                        <div key={l.id} className="border-b border-white/5">
                                            <button 
                                                onClick={() => {
                                                    setExpandedLessons(prev => 
                                                        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
                                                    );
                                                    if (currentLesson !== index) {
                                                        setCurrentLesson(index);
                                                        setCurrentSubTask(0);
                                                        setShowTheory(true);
                                                    }
                                                }}
                                                className={\`w-full p-4 flex justify-between items-center transition-colors \${isCurrentLesson ? 'bg-white/10' : 'hover:bg-white/5'}\`}
                                            >
                                                <span className="font-bold text-sm">{l.title}</span>
                                                {isExpanded ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                                            </button>
                                            
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div 
                                                        initial={{ height: 0 }} 
                                                        animate={{ height: 'auto' }} 
                                                        exit={{ height: 0 }} 
                                                        className="overflow-hidden bg-black/40"
                                                    >
                                                        {l.subTasks.map((st, sIdx) => {
                                                            const isCompleted = completedSubTasks.includes(st.id);
                                                            const isCurrentSub = currentLesson === index && currentSubTask === sIdx;
                                                            return (
                                                                <button
                                                                    key={st.id}
                                                                    onClick={() => {
                                                                        setCurrentLesson(index);
                                                                        setCurrentSubTask(sIdx);
                                                                        setShowTheory(false);
                                                                    }}
                                                                    className={\`w-full p-3 pl-6 flex items-center gap-3 border-l-2 text-right transition-colors \${isCurrentSub ? 'border-[#7112AF] bg-[#7112AF]/10' : 'border-transparent hover:bg-white/5'}\`}
                                                                >
                                                                    {isCompleted ? <CheckCircle size={14} className="text-green-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-500" />}
                                                                    <div>
                                                                        <div className={\`text-xs \${isCurrentSub ? 'text-white' : 'text-gray-400'}\`}>{st.command}</div>
                                                                    </div>
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

                    {/* Middle: Terminal or Theory */}
                    <div className="col-span-6">
                        <AnimatePresence mode="wait">
                            {showTheory ? (
                                <motion.div key="theory" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="bg-gradient-to-br from-[#240993]/20 to-[#7112AF]/20 border border-[#7112AF]/40 rounded-xl p-8 backdrop-blur-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-4 bg-[#7112AF]/20 rounded-xl"><BookOpen size={30} className="text-[#7112AF]"/></div>
                                        <div>
                                            <div className="text-sm text-gray-400">فهم المبادئ:</div>
                                            <h2 className="text-2xl font-bold">{lesson.title}</h2>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-lg leading-relaxed mb-8 p-4 bg-black/40 rounded-lg border border-white/5">{lesson.concept}</p>
                                    
                                    <h3 className="font-bold text-[#ff006e] mb-3">المهام في هذا الدرس:</h3>
                                    <div className="space-y-3 mb-8">
                                        {lesson.subTasks.map((t, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                                <code className="bg-black/50 px-3 py-1 rounded text-[#10b981] font-mono min-w-[80px] text-center">{t.command}</code>
                                                <span className="text-sm text-gray-300">{t.task}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button onClick={() => setShowTheory(false)} className="w-full py-4 bg-gradient-to-r from-[#7112AF] to-[#ff006e] rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,0,110,0.4)] transition-all flex justify-center items-center gap-2">
                                        <Terminal size={20} /> الانتقال للطرفية
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="terminal" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}}>
                                    
                                    {/* Task Banner */}
                                    <div className="bg-[#110C24] border border-[#ff006e]/30 rounded-t-xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-[#ff006e] font-bold mb-1 uppercase tracking-wider">الهدف النشط</div>
                                            <div className="font-bold flex items-center gap-2 text-sm max-w-lg">
                                                <Target size={16} className="text-gray-400" />
                                                {activeSubTask.task}
                                            </div>
                                        </div>
                                        <button onClick={() => setShowTheory(true)} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">
                                            المفهوم النظري
                                        </button>
                                    </div>

                                    {/* TERMINAL UI */}
                                    <div className={\`bg-black rounded-b-xl border border-t-0 shadow-2xl overflow-hidden \${showQuestion ? 'border-yellow-500/50' : 'border-[#ff006e]/30'}\`}>
                                        <div className="bg-[#1a1b26] px-4 py-2 flex items-center justify-between border-b border-white/10">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <span className="text-xs text-gray-500 font-mono">student@cyberclub</span>
                                            <button onClick={() => setTerminalHistory([])} className="text-gray-500 hover:text-white transition-colors"><RotateCcw size={14} /></button>
                                        </div>

                                        <div ref={terminalRef} className="h-80 overflow-y-auto p-4 font-mono text-sm relative" dir="ltr">
                                            {terminalHistory.map((entry, idx) => (
                                                <div key={idx} className="mb-2 break-all">
                                                    {entry.type === 'input' ? (
                                                        <div className="flex gap-2">
                                                            <span className="text-green-400 whitespace-nowrap">student@cyberclub:<span className="text-blue-400">{entry.path}</span>$</span>
                                                            <span className="text-white">{entry.cmd}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-300 whitespace-pre-wrap">{entry.content}</div>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            {/* ACTIVE INPUT OR QUESTION */}
                                            {showQuestion ? (
                                                <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="mt-6 border border-yellow-500/30 bg-yellow-500/10 p-4 rounded-xl relative overflow-hidden" dir="rtl">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <HelpCircle size={24} className="text-yellow-400" />
                                                        <h3 className="font-bold text-lg text-white">تحدي المخرجات: أثبت فهمك</h3>
                                                    </div>
                                                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">{activeSubTask.question.text}</p>
                                                    
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {activeSubTask.question.options.map((opt, i) => (
                                                            <button 
                                                                key={i}
                                                                onClick={() => handleQuestionAnswer(opt)}
                                                                disabled={questionStatus !== 'waiting'}
                                                                className={\`p-3 rounded-lg text-sm transition-all border text-right \${
                                                                    selectedAnswer === opt 
                                                                    ? (questionStatus === 'success' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400')
                                                                    : 'bg-black/50 border-white/20 hover:border-yellow-400/50 hover:bg-yellow-400/10'
                                                                }\`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    
                                                    {questionStatus === 'success' && (
                                                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                                                            <div className="bg-green-500 text-black px-6 py-2 rounded-full font-bold flex gap-2 items-center">
                                                                <CheckCircle size={20} /> إجابة صحيحة!
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <span className="text-green-400 whitespace-nowrap mr-2">student@cyberclub:<span className="text-blue-400">{fileSystem.currentPath.replace('/home/student', '~')}</span>$</span>
                                                    <input
                                                        type="text"
                                                        value={terminalInput}
                                                        onChange={(e) => setTerminalInput(e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                        className="flex-1 bg-transparent text-white outline-none border-none caret-[#ff006e]"
                                                        autoFocus
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hint Box */}
                                    <div className="mt-4 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl flex gap-3">
                                        <Lightbulb className="text-blue-400 mt-0.5 shrink-0" size={18} />
                                        <div className="text-sm">
                                            <div className="text-blue-400 font-bold mb-1">تلميح</div>
                                            <div className="text-gray-400">{activeSubTask.hint}</div>
                                        </div>
                                    </div>
                                    
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Panel: File System Visual */}
                    <div className="col-span-3 space-y-4">
                        <div className="bg-[#110C24] border border-[#7112AF]/30 rounded-xl overflow-hidden shadow-xl">
                            <div className="p-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2 text-sm"><Folder size={16} className="text-[#a78bfa]" /> نظام الملفات</h3>
                            </div>
                            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                                {fileSystem.files.map((file, i) => (
                                    <div key={i} className="flex gap-2 items-center p-2 rounded hover:bg-white/5 cursor-default transition-colors">
                                        {file.endsWith('/') ? <Folder size={16} className="text-yellow-500" /> : <FileText size={16} className="text-gray-400" />}
                                        <span className="text-sm text-gray-300">{file}</span>
                                    </div>
                                ))}
                                {fileSystem.hiddenFiles.map((file, i) => (
                                    <div key={\`h-\${i}\`} className="flex gap-2 items-center p-2 rounded opacity-50 border border-dashed border-gray-600">
                                        <EyeOff size={16} className="text-gray-500" />
                                        <span className="text-sm text-gray-400">{file}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

`;

fs.writeFileSync('/home/azo/Documents/tu_clup_cyper_the_end111/src/components/simulators/BashSimulatorProV3.jsx', fileContent);
console.log('File written to BashSimulatorProV3.jsx');
