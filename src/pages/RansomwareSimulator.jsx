import React, { useState, useEffect, useRef } from 'react';
import {
    Shield, Sword, Terminal, Play, AlertTriangle,
    Cpu, Lock, Eye, ChevronLeft, CheckCircle,
    XCircle, Server, Search, HelpCircle,
    MessageSquare, Send, Zap, Skull, Database, Activity,
    BookOpen, Lightbulb, Globe, Layout, Clipboard, Hash,
    HardDrive, Wifi, Key, StopCircle, Radio, ArrowRight,
    FileText, UploadCloud, File, Award, FileCode, Clock, Target, List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RangeLayout from '../components/cyber-range/layout/RangeLayout';

/**
 * بيانات السيناريو (SCENARIO_DATA)
 */
const SCENARIO_DATA = {
    id: 'ransomware-op-1',
    title: 'عملية: "التشفير الشامل" (Operation Blackout)',
    shortDesc: 'سيناريو متسلسل: عش دورة حياة الهجوم والدفاع مرحلة بمرحلة.',
    roles: {
        attacker: {
            title: 'المهاجم: The Architect',
            theme: 'red',
            missionSteps: [
                {
                    id: 1,
                    phaseTitle: "المرحلة 1: الاستطلاع (Reconnaissance)",
                    story: [
                        { text: 'النظام: تم تحديد الهدف: 192.168.1.50 (خادم السجلات الطبية).', speaker: 'System' },
                        { text: 'الوسيط: "المستشفى يعتمد على أنظمة قديمة. نحتاج لمعرفة المنافذ المفتوحة أولاً."', speaker: 'Handler' }
                    ],
                    setup: {
                        question: 'للبدء في الاستطلاع واكتشاف الخدمات، ما هي الأداة القياسية لفحص المنافذ؟',
                        options: [
                            { id: 1, text: 'Nmap', correct: true },
                            { id: 2, text: 'Photoshop', correct: false },
                            { id: 3, text: 'Word', correct: false }
                        ]
                    },
                    tool: 'nmap',
                    instruction: 'افحص الهدف لاكتشاف منفذ SSH.',
                    concept: 'اكتشاف الخدمات',
                    visualType: 'radar',
                    hint: 'nmap -p 22 192.168.1.50',
                    successMsg: 'PORT 22/tcp OPEN (OpenSSH 7.2)',
                    requiredCmd: 'nmap',
                    requiredArg: '22',
                    learnNote: 'وجدنا منفذ SSH مفتوحاً! هذا هو مدخلنا.'
                },
                {
                    id: 2,
                    phaseTitle: "المرحلة 2: الوصول الأولي (Initial Access)",
                    story: [
                        { text: 'الوسيط: "ممتاز، المنفذ 22 مفتوح. لكننا لا نملك المفتاح."', speaker: 'Handler' },
                        { text: 'الوسيط: "كلمات المرور في هذه المستشفيات عادة ما تكون ضعيفة. جرب كسرها."', speaker: 'Handler' }
                    ],
                    setup: {
                        question: 'نحتاج لشن هجوم تخمين (Brute Force) على بروتوكول SSH. أي أداة تختار؟',
                        options: [
                            { id: 1, text: 'Hydra', correct: true },
                            { id: 2, text: 'Wireshark', correct: false },
                            { id: 3, text: 'Ping', correct: false }
                        ]
                    },
                    tool: 'hydra',
                    instruction: 'اكسر كلمة مرور المستخدم `admin`.',
                    concept: 'هجوم التخمين',
                    visualType: 'unlock',
                    hint: 'hydra -l admin -P passlist.txt ssh://192.168.1.50',
                    successMsg: 'LOGIN FOUND: [admin] / [hospital123]',
                    outputData: 'hospital123',
                    requiredCmd: 'hydra',
                    requiredArg: 'ssh',
                    learnNote: 'نجحنا! كلمة المرور هي "hospital123".'
                },
                {
                    id: 3,
                    phaseTitle: "المرحلة 3: التثبيت والدخول (Execution)",
                    story: [
                        { text: 'الوسيط: "لدينا اسم المستخدم وكلمة المرور. الطريق ممهد الآن."', speaker: 'Handler' },
                        { text: 'الهدف: "ادخل للنظام وأثبت وجودنا."', speaker: 'Mission' }
                    ],
                    setup: {
                        question: 'ما هو البروتوكول الذي نستخدمه للدخول الآمن والتحكم بالسيرفر عن بعد؟',
                        options: [
                            { id: 1, text: 'SSH (Secure Shell)', correct: true },
                            { id: 2, text: 'HTTP', correct: false },
                            { id: 3, text: 'FTP', correct: false }
                        ]
                    },
                    tool: 'ssh',
                    instruction: 'ادخل للنظام باستخدام البيانات المكتشفة.',
                    concept: 'التحكم عن بعد',
                    visualType: 'terminal_connect',
                    hint: 'ssh admin@192.168.1.50',
                    successMsg: 'Welcome to Ubuntu Server.',
                    requiredCmd: 'ssh',
                    requiredArg: 'admin',
                    learnNote: 'أنت الآن داخل السيرفر.'
                },
                {
                    id: 4,
                    phaseTitle: "المرحلة 4: الاستكشاف الداخلي (Discovery)",
                    story: [
                        { text: 'الوسيط: "نحن في الداخل. لا تتسرع في التشفير. يجب أن نعرف ماذا نملك أولاً."', speaker: 'Handler' },
                        { text: 'المهمة: "ابحث عن المجلدات التي تحتوي على بيانات المرضى الحساسة."', speaker: 'Objective' }
                    ],
                    setup: {
                        question: 'ما الأمر المستخدم في لينكس لعرض محتويات المجلد الحالي بما في ذلك الملفات المخفية والتفاصيل؟',
                        options: [
                            { id: 1, text: 'ls -la', correct: true },
                            { id: 2, text: 'cd ..', correct: false },
                            { id: 3, text: 'mkdir', correct: false }
                        ]
                    },
                    tool: 'ls',
                    instruction: 'استعرض الملفات لتحديد موقع البيانات.',
                    concept: 'استكشاف الملفات',
                    visualType: 'files',
                    hint: 'ls -la',
                    successMsg: 'drwx------ patients_db (Sensitive)',
                    requiredCmd: 'ls',
                    requiredArg: '-la',
                    learnNote: 'وجدنا مجلد `patients_db` يحتوي على السجلات الطبية.'
                },
                {
                    id: 5,
                    phaseTitle: "المرحلة 5: سرقة البيانات (Exfiltration)",
                    story: [
                        { text: 'الوسيط: "كنز ثمين! قبل أن نشفر البيانات، يجب أن نسرق نسخة منها."', speaker: 'Handler' },
                        { text: 'الوسيط: "سنبتزهم مرتين: مرة لفك التشفير، ومرة لعدم نشر بيانات المرضى (Double Extortion)."', speaker: 'Handler' }
                    ],
                    setup: {
                        question: 'نريد نقل المجلد بأمان وتشفير إلى خادمنا الخارجي. ما الأداة الأنسب؟',
                        options: [
                            { id: 1, text: 'SCP (Secure Copy)', correct: true },
                            { id: 2, text: 'Telnet', correct: false },
                            { id: 3, text: 'Copy-Paste', correct: false }
                        ]
                    },
                    tool: 'scp',
                    instruction: 'انسخ مجلد `patients_db` إلى خادم الهجوم.',
                    concept: 'تسريب البيانات',
                    visualType: 'upload',
                    hint: 'scp -r patients_db attacker@10.66.66.1:/loot',
                    successMsg: 'Transfer Complete: 100% (2.4GB)',
                    requiredCmd: 'scp',
                    requiredArg: 'patients_db',
                    learnNote: 'تم تأمين نسخة من البيانات لدينا. الآن يمكننا التدمير.'
                },
                {
                    id: 6,
                    phaseTitle: "المرحلة 6: التشفير (Impact)",
                    story: [
                        { text: 'الوسيط: "البيانات معنا. الآن حان وقت الضربة القاضية."', speaker: 'Handler' },
                        { text: 'الهدف: "شغل البرمجية، شفر كل شيء، واترك رسالة الفدية."', speaker: 'Mission' }
                    ],
                    setup: {
                        question: 'البرمجية `dark_locker.py` جاهزة. كيف ننفذ سكربت بايثون؟',
                        options: [
                            { id: 1, text: 'python3 script.py', correct: true },
                            { id: 2, text: 'click script', correct: false },
                            { id: 3, text: 'read script', correct: false }
                        ]
                    },
                    tool: 'python',
                    instruction: 'شغل برمجية الفدية لتشفير الملفات.',
                    concept: 'تنفيذ البرمجيات الخبيثة',
                    visualType: 'encrypt',
                    hint: 'python3 dark_locker.py',
                    successMsg: 'ENCRYPTION COMPLETE. ALL FILES LOCKED.',
                    requiredCmd: 'python',
                    requiredArg: 'dark_locker',
                    learnNote: 'تمت المهمة. النظام مشلول بالكامل.'
                }
            ],
            debrief: {
                summary: "لقد نفذت هجوم 'Kill Chain' متكامل: استطلاع -> وصول -> استكشاف -> سرقة -> تشفير.",
                realWorld: "تكتيك 'الابتزاز المزدوج' (Double Extortion) الذي مارسته هو المعيار الحالي لعصابات الفدية. السرقة تضمن الدفع حتى لو كان لدى الضحية نسخ احتياطية (Backups) لأنهم يخافون من الفضيحة.",
                commands: [
                    { cmd: "nmap", desc: "استكشاف الشبكة." },
                    { cmd: "hydra", desc: "كسر كلمات المرور." },
                    { cmd: "ssh", desc: "الدخول للنظام." },
                    { cmd: "ls", desc: "استكشاف الملفات." },
                    { cmd: "scp", desc: "نقل وسرقة البيانات." },
                    { cmd: "python", desc: "تشغيل التشفير." }
                ]
            }
        },
        defender: {
            title: 'المدافع: The Hunter',
            theme: 'blue',
            missionSteps: [
                {
                    id: 1,
                    phaseTitle: "المرحلة 1: التشخيص (Detection)",
                    story: [
                        { text: 'النظام: تنبيه! استهلاك المعالج 99% في سيرفر السجلات.', speaker: 'Monitoring' },
                        { text: 'المدير: "الخدمة توقفت! اكتشف السبب حالاً."', speaker: 'IT Manager' }
                    ],
                    setup: {
                        question: 'السيرفر بطيء. ما الأداة التي تعرض العمليات (Processes) الأكثر استهلاكاً للموارد؟',
                        options: [
                            { id: 1, text: 'Top / Htop', correct: true },
                            { id: 2, text: 'Ls', correct: false },
                            { id: 3, text: 'Cat', correct: false }
                        ]
                    },
                    tool: 'top',
                    instruction: 'اكتشف العملية الخبيثة.',
                    concept: 'مراقبة العمليات',
                    visualType: 'cpu_graph',
                    hint: 'top',
                    successMsg: 'PID: 4455 | COMMAND: python3 dark_locker.py',
                    outputData: '4455',
                    requiredCmd: 'top',
                    requiredArg: '',
                    learnNote: 'عملية `dark_locker.py` هي السبب.'
                },
                {
                    id: 2,
                    phaseTitle: "المرحلة 2: الاستجابة (Eradication)",
                    story: [
                        { text: 'المحلل: "إنها برمجية فدية نشطة! تقوم بتشفير الملفات الآن!"', speaker: 'SOC Analyst' },
                        { text: 'المدير: "أقتلها فوراً قبل أن تفقد البيانات المتبقية!"', speaker: 'IT Manager' }
                    ],
                    setup: {
                        question: 'ما هو الأمر المستخدم لإنهاء عملية (Process) بالقوة اعتماداً على رقمها (PID)؟',
                        options: [
                            { id: 1, text: 'Kill', correct: true },
                            { id: 2, text: 'Stop', correct: false },
                            { id: 3, text: 'End', correct: false }
                        ]
                    },
                    tool: 'kill',
                    instruction: 'اقتل العملية الخبيثة رقم 4455.',
                    concept: 'إنهاء العمليات',
                    visualType: 'stop_process',
                    hint: 'kill -9 4455',
                    successMsg: 'Process 4455 Killed.',
                    requiredCmd: 'kill',
                    requiredArg: '4455',
                    learnNote: 'تم إيقاف التشفير.'
                }
            ],
            debrief: {
                summary: "لقد نجحت في احتواء حادث سيبراني نشط (Active Incident) وتقليل الأضرار.",
                realWorld: "في مراكز العمليات (SOC)، السرعة هي العامل الحاسم. كل دقيقة تأخير في اكتشاف العملية الخبيثة تعني فقدان آلاف الملفات الإضافية. الخطوة التالية عادة تكون عزل الجهاز عن الشبكة (Isolation).",
                commands: [
                    { cmd: "top", desc: "يعرض العمليات النشطة واستهلاك الموارد لكشف البرمجيات المتطلبة." },
                    { cmd: "kill", desc: "يرسل إشارة (Signal) لإنهاء العملية فوراً وإيقاف الضرر." }
                ]
            }
        }
    }
};

// --- Extracted Components (Legacy Phase Components Adapted) ---

const RoleSelection = ({ onStart, onBack }) => (
    <div className="max-w-6xl mx-auto p-8 animate-fadeIn pt-24 font-cairo">
        <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
            <ChevronLeft className="ml-1" /> العودة لقائمة الهجمات
        </button>
        <h2 className="text-4xl font-bold text-white mb-12 text-center drop-shadow-lg">{SCENARIO_DATA.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
                onClick={() => onStart('attacker')}
                className="relative group border rounded-2xl p-8 cursor-pointer transition-all duration-500 overflow-hidden transform hover:-translate-y-2 bg-[#1a0505] border-red-900/30 hover:border-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Skull size={140} />
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-red-500">
                    <Sword size={28} /> مسار المهاجم
                </h3>
                <p className="text-white font-bold text-xl mb-4">{SCENARIO_DATA.roles.attacker.title}</p>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    تقمص دور المهاجم (Red Team)، وابدأ بجمع المعلومات، واكتشاف الثغرات، وصولاً إلى تشفير النظام بالكامل.
                </p>
                <button className="w-full py-3 text-white rounded-lg font-bold shadow-lg transition-colors bg-red-600 hover:bg-red-700 mt-8">
                    بدء العملية
                </button>
            </div>
            <div
                onClick={() => onStart('defender')}
                className="relative group border rounded-2xl p-8 cursor-pointer transition-all duration-500 overflow-hidden transform hover:-translate-y-2 bg-[#050a1a] border-blue-900/30 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield size={140} />
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-blue-500">
                    <Shield size={28} /> مسار المدافع
                </h3>
                <p className="text-white font-bold text-xl mb-4">{SCENARIO_DATA.roles.defender.title}</p>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    بصفتك (Blue Team)، دورك هو اكتشاف التسلل، تحليل السلوك المشبوه، وإيقاف الهجوم قبل وقوع الكارثة.
                </p>
                <button className="w-full py-3 text-white rounded-lg font-bold shadow-lg transition-colors bg-blue-600 hover:bg-blue-700 mt-8">
                    بدء الاستجابة
                </button>
            </div>
        </div>
    </div>
);

const PhaseStory = ({ data, onComplete, selectedRole }) => {
    const isAttacker = selectedRole === 'attacker';
    const [index, setIndex] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fadeIn font-cairo">
            <div className={`w-full max-w-2xl p-1 rounded-3xl bg-gradient-to-r shadow-2xl ${isAttacker ? 'from-red-900 to-red-600' : 'from-blue-900 to-blue-600'}`}>
                <div className="bg-[#0f1115] rounded-[22px] p-10 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border mb-6 border-white/10 bg-white/5 text-gray-300">
                            {data.story[index].speaker}
                        </div>
                        <p className="text-3xl text-white leading-relaxed font-light drop-shadow-md">"{data.story[index].text}"</p>
                    </div>
                    <div className="flex justify-end mt-10">
                        <button
                            onClick={() => {
                                if (index < data.story.length - 1) setIndex(index + 1);
                                else onComplete();
                            }}
                            className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                        >
                            {index === data.story.length - 1 ? 'متابعة للإعداد' : 'التالي'} <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PhaseSetup = ({ data, onComplete }) => {
    const [selected, setSelected] = useState(null);
    const [status, setStatus] = useState(null);

    const handleSelect = (opt) => {
        setSelected(opt.id);
        if (opt.correct) {
            setStatus('correct');
            setTimeout(onComplete, 1500);
        } else {
            setStatus('wrong');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fadeIn font-cairo">
            <h2 className="text-2xl font-bold text-white mb-2">{data.phaseTitle}</h2>
            <p className="text-gray-400 mb-8">تهيئة بيئة العمل</p>

            <div className="w-full max-w-xl bg-[#0f1115] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-start gap-4 mb-8">
                    <div className="p-3 bg-[#7112AF]/20 rounded-lg text-[#7112AF]"><Lightbulb size={24} /></div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">سؤال تقني</h3>
                        <p className="text-gray-300 leading-relaxed">{data.setup.question}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {data.setup.options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => !status && handleSelect(opt)}
                            className={`w-full p-4 rounded-xl border text-right transition-all flex justify-between items-center ${selected === opt.id
                                    ? opt.correct
                                        ? 'bg-green-500/20 border-green-500 text-green-400'
                                        : 'bg-red-500/20 border-red-500 text-red-400'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300'
                                }`}
                        >
                            <span>{opt.text}</span>
                            {selected === opt.id && (opt.correct ? <CheckCircle /> : <XCircle />)}
                        </button>
                    ))}
                </div>
                {status === 'correct' && <div className="mt-6 text-center text-green-400 text-sm font-bold animate-pulse">إجابة صحيحة! جاري تحميل المحاكي...</div>}
                {status === 'wrong' && <div className="mt-6 text-center text-red-400 text-sm font-bold animate-pulse">إجابة خاطئة. حاول مرة أخرى!</div>}
            </div>
        </div>
    );
};

const PhaseWorkspace = ({ data, onComplete, selectedRole, onAddLog }) => {
    const isAttacker = selectedRole === 'attacker';
    const [lines, setLines] = useState([{ type: 'sys', text: `Initializing ${data.tool ? data.tool.toUpperCase() : 'SYSTEM'} environment...` }]);
    const [input, setInput] = useState('');
    const terminalBodyRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll Logic
    useEffect(() => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
    }, [lines]);

    // Focus Logic
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const handleCmd = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const cmd = input.trim();
            if (!cmd) return;

            const newLine = { type: 'user', text: `${isAttacker ? 'root@kali' : 'admin@soc'}:~/missions/active# ${cmd}` };
            const newLines = [...lines, newLine];

            // Add to Global Logs
            onAddLog(newLine);

            const baseCmd = cmd.split(' ')[0].toLowerCase();
            const required = data.requiredCmd ? data.requiredCmd.toLowerCase() : '';
            const arg = data.requiredArg ? data.requiredArg.toLowerCase() : '';

            // Advanced Logic Check
            let success = false;
            let errorMsg = '';

            if (baseCmd === required || (required === 'python' && baseCmd === 'python3')) {
                if (!arg || cmd.toLowerCase().includes(arg)) {
                    success = true;
                } else {
                    errorMsg = `Error: Missing required argument. Hint: ${data.hint}`;
                }
            } else {
                errorMsg = `Command not found: ${baseCmd}. Required: ${data.tool}`;
            }

            if (success) {
                const successLogs = [
                    { type: 'success', text: `[+] Executing ${data.tool}...` },
                    { type: 'success', text: data.successMsg },
                    { type: 'info', text: '--- PHASE COMPLETE ---' }
                ];
                setLines(prev => [...prev, ...newLines.slice(prev.length), ...successLogs]);
                successLogs.forEach(l => onAddLog(l));

                setInput('');
                setTimeout(onComplete, 2000);
            } else {
                const errLog = { type: 'err', text: errorMsg };
                newLines.push(errLog);
                setLines(newLines);
                onAddLog(errLog);
                setInput('');
            }
        }
    };

    const handleTerminalClick = () => {
        if (inputRef.current) inputRef.current.focus();
    }

    return (
        <div className="flex flex-col h-full gap-4">

            <style>{`
                .terminal-scroll::-webkit-scrollbar { width: 8px; }
                .terminal-scroll::-webkit-scrollbar-track { background: #1a1d24; }
                .terminal-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
            `}</style>

            {/* Active Terminal */}
            <div
                className="flex-grow bg-[#0f1115] rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden relative"
                onClick={handleTerminalClick}
            >
                {/* Terminal Header */}
                <div className="bg-[#1f232b] px-4 py-2 flex items-center justify-between border-b border-gray-700 flex-shrink-0" dir="ltr">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                    </div>
                    <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                        <Terminal size={12} />
                        {isAttacker ? 'root@kali: ~/missions/active' : 'admin@soc: ~/incidents/active'}
                    </div>
                    <div className="w-10"></div>
                </div>

                {/* Terminal Body */}
                <div
                    className="flex-grow p-6 font-mono text-sm overflow-y-auto terminal-scroll text-gray-300"
                    dir="ltr"
                    ref={terminalBodyRef}
                >
                    {lines.map((l, i) => (
                        <div key={i} className={`mb-1 ${l.type === 'user' ? 'text-white font-bold mt-2' :
                                l.type === 'err' ? 'text-red-400' :
                                    l.type === 'success' ? 'text-green-400' :
                                        l.type === 'hint' ? 'text-yellow-400 font-bold bg-yellow-400/10 p-2 rounded border border-yellow-400/20 my-2' :
                                            l.type === 'info' ? 'text-blue-300' : 'text-gray-400'
                            }`}>
                            {l.type === 'user' ? l.text : (l.type === 'hint' ? l.text : <span><span className={isAttacker ? 'text-red-500' : 'text-blue-500'}>➜</span> {l.text}</span>)}
                        </div>
                    ))}
                    <div className="flex items-center gap-2 mt-2">
                        <span className={isAttacker ? 'text-red-500' : 'text-blue-500'}>{isAttacker ? 'root@kali' : 'admin@soc'}:~/missions/active#</span>
                        <input
                            ref={inputRef}
                            className="bg-transparent outline-none flex-1 text-white border-none focus:ring-0 p-0"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleCmd}
                            spellCheck={false}
                            autoComplete="off"
                        />
                        <span className="w-2.5 h-5 bg-gray-400 animate-pulse block"></span>
                    </div>
                </div>
            </div>

            {/* Active Instruction Bar - NOW PART OF WORKSPACE CONTENT */}
            <div className="relative overflow-hidden rounded-xl bg-[#101622] border border-[#0d59f2]/40 shadow-[0_0_30px_rgba(13,89,242,0.15)] p-1 group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d59f2]/10 to-transparent opacity-50"></div>
                <div className="relative bg-[#161b22] rounded-lg p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative p-3 rounded-full bg-[#0d59f2]/20 text-[#0d59f2]">
                            <Zap size={24} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-white font-bold">Terminal Access Granted</h3>
                            <p className="text-[#0d59f2]/90 text-sm">Execute the specific command to complete this phase.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MissionComplete = ({ role, onHome }) => {
    const data = SCENARIO_DATA.roles[role].debrief;
    const isAttacker = role === 'attacker';

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fadeIn font-cairo">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isAttacker ? 'bg-red-600 shadow-red-900/50' : 'bg-green-600 shadow-green-900/50'}`}>
                <CheckCircle size={48} className="text-white" />
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">تم إنجاز المهمة بنجاح</h1>
            <p className="text-gray-400 mb-10 text-lg">تقرير العملية النهائي (Operational Debrief)</p>

            <button onClick={onHome} className="mt-10 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors shadow-lg flex items-center gap-2">
                <ChevronLeft size={20} /> العودة للقائمة الرئيسية
            </button>
        </div>
    );
};

// --- Main Container ---

export default function RansomwareSimulator() {
    const [currentStage, setCurrentStage] = useState('details');
    const [simulationState, setSimulationState] = useState('idle');
    const [selectedRole, setSelectedRole] = useState(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [systemLogs, setSystemLogs] = useState([]);

    const navigate = useNavigate();

    const startSimulation = (role) => {
        setSelectedRole(role);
        setCurrentStepIndex(0);
        setCurrentStage('active_simulation');
        setSimulationState('story');
    };

    const handlePhaseComplete = () => {
        const roleData = SCENARIO_DATA.roles[selectedRole];
        if (currentStepIndex < roleData.missionSteps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            setSimulationState('story');
        } else {
            setSimulationState('finished');
        }
    };

    const handleAddLog = (log) => {
        setSystemLogs(prev => [...prev, log]);
    }

    const currentRoleData = selectedRole ? SCENARIO_DATA.roles[selectedRole] : null;
    const currentStepData = currentRoleData ? currentRoleData.missionSteps[currentStepIndex] : null;

    if (currentStage === 'details') {
        return <RoleSelection onStart={startSimulation} onBack={() => navigate('/attacks')} />;
    }

    return (
        <RangeLayout
            role={selectedRole}
            onSwitchRole={setSelectedRole}
            steps={currentRoleData?.missionSteps || []}
            currentStepIndex={currentStepIndex}
            activeTask={currentStepData}
            systemLogs={systemLogs}
        >
            {simulationState === 'story' && (
                <PhaseStory
                    data={currentStepData}
                    onComplete={() => setSimulationState('setup')}
                    selectedRole={selectedRole}
                />
            )}
            {simulationState === 'setup' && (
                <PhaseSetup
                    data={currentStepData}
                    onComplete={() => setSimulationState('workspace')}
                />
            )}
            {simulationState === 'workspace' && (
                <PhaseWorkspace
                    data={currentStepData}
                    onComplete={handlePhaseComplete}
                    selectedRole={selectedRole}
                    onAddLog={handleAddLog}
                />
            )}
            {simulationState === 'finished' && (
                <MissionComplete
                    role={selectedRole}
                    onHome={() => navigate('/attacks')}
                />
            )}
        </RangeLayout>
    );
}
