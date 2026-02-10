import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, Target, Terminal, BookOpen, PlayCircle, CheckCircle, Lock, Unlock,
    AlertTriangle, Flag, Trophy, Clock, Users, MessageSquare, Lightbulb,
    ChevronRight, ChevronLeft, Search, Eye, EyeOff, Network, Database,
    FileText, ShieldAlert, Zap, Skull, Crown, Sword, Castle,
    Radio, Wifi, Globe, Server, Activity, BarChart3, Star,
    TrendingUp, AlertCircle, CheckCircle2, HelpCircle, RotateCcw,
    Send, Map, Compass, Scan, RadioTower
} from 'lucide-react';
import { MatrixBackground } from '../ui/MatrixBackground';

const STORY = {
    title: 'عملية الفهد الأسود',
    subtitle: 'سيناريو اختراق حقيقي',
    description: 'تعرضت شركة "تقنية المستقبل" لهجوم سيبراني معقد. أنت مطلوب للتحقيق في الحادثة وإيقاف المهاجمين.',
    phases: [
        {
            id: 'recon',
            title: 'الاستطلاع',
            description: 'جمع المعلومات عن الهدف',
            attackerObjective: 'اكتشاف نقاط الضعف في النظام',
            defenderObjective: 'اكتشاف نشاط الاستطلاع المشبوه',
            xp: 100
        },
        {
            id: 'scanning',
            title: 'المسح',
            description: 'فحص الشبكة والخدمات',
            attackerObjective: 'تحديد المنافذ المفتوحة والخدمات',
            defenderObjective: 'اكتشاف وفهم أنماط المسح',
            xp: 150
        },
        {
            id: 'exploitation',
            title: 'الاستغلال',
            description: 'استغلال الثغرات الأمنية',
            attackerObjective: 'الحصول على وصول أولي للنظام',
            defenderObjective: 'منع واكتشاف محاولات الاستغلال',
            xp: 200
        },
        {
            id: 'post_exploitation',
            title: 'ما بعد الاستغلال',
            description: 'الارتقاء في الصلاحيات والانتشار',
            attackerObjective: 'الوصول للنظام بأكمله والبقاء مستمراً',
            defenderObjective: 'احتواء الحادثة وإزالة الاختراق',
            xp: 250
        },
        {
            id: 'capture_flag',
            title: 'النهاية - Capture The Flag',
            description: 'المهمة النهائية',
            attackerObjective: 'سرقة ملف secrets.txt والهروب',
            defenderObjective: 'حماية الأصول واعتقال المهاجم',
            xp: 300
        }
    ]
};

const ATTACKER_TASKS = [
    {
        id: 1,
        phase: 'recon',
        title: 'جمع المعلومات العامة',
        command: 'whois future-tech.com',
        description: 'استخدم whois لجمع معلومات عن النطاق',
        hint: 'اكتب whois متبوعاً باسم النطاق',
        xp: 25,
        completed: false
    },
    {
        id: 2,
        phase: 'recon',
        title: 'اكتشاف DNS',
        command: 'dig MX future-tech.com',
        description: 'اكتشف سجلات DNS للبريد الإلكتروني',
        hint: 'dig MX يعرض سجلات البريد',
        xp: 25,
        completed: false
    },
    {
        id: 3,
        phase: 'scanning',
        title: 'مسح المنافذ',
        command: 'nmap -sS 192.168.1.1',
        description: 'استخدم nmap لمسح المنافذ المفتوحة',
        hint: 'nmap -sS لمسح SYN stealth',
        xp: 50,
        completed: false
    },
    {
        id: 4,
        phase: 'scanning',
        title: 'تحديد الخدمات',
        command: 'nmap -sV 192.168.1.1',
        description: 'حدد إصدارات الخدمات المشغلة',
        hint: 'nmap -sV لكشف الإصدارات',
        xp: 50,
        completed: false
    },
    {
        id: 5,
        phase: 'exploitation',
        title: 'استغلال ثغرة SSH',
        command: 'hydra -l admin -P passwords.txt ssh://192.168.1.1',
        description: 'حاول كسر كلمة مرور SSH بالقوة الغاشية',
        hint: 'hydra للهجوم بالقوة الغاشية',
        xp: 75,
        completed: false
    },
    {
        id: 6,
        phase: 'exploitation',
        title: 'حقن SQL',
        command: "sqlmap -u 'http://192.168.1.1/login.php?id=1' --dbs",
        description: 'استخدم sqlmap لاكتشاف قواعد البيانات',
        hint: 'sqlmap --dbs لعرض قواعد البيانات',
        xp: 75,
        completed: false
    },
    {
        id: 7,
        phase: 'post_exploitation',
        title: 'الارتقاء للصلاحيات',
        command: 'sudo -l',
        description: 'تحقق من صلاحيات sudo المتاحة',
        hint: 'sudo -l لعرض الصلاحيات',
        xp: 100,
        completed: false
    },
    {
        id: 8,
        phase: 'capture_flag',
        title: 'سرقة العلم',
        command: 'cat /root/secrets.txt',
        description: 'اقرأ ملف الأسرار النهائي',
        hint: 'cat لعرض محتوى الملف',
        xp: 150,
        completed: false
    }
];

const DEFENDER_TASKS = [
    {
        id: 1,
        phase: 'recon',
        title: 'تحليل سجلات DNS',
        command: 'grep "query" /var/log/named.log',
        description: 'ابحث عن استعلامات DNS مشبوهة',
        hint: 'grep للبحث في السجلات',
        xp: 25,
        completed: false
    },
    {
        id: 2,
        phase: 'scanning',
        title: 'كشف المسح',
        command: 'tcpdump -i eth0 port 80',
        description: 'راقب حركة HTTP للكشف عن المسح',
        hint: 'tcpdump لمراقبة الشبكة',
        xp: 50,
        completed: false
    },
    {
        id: 3,
        phase: 'scanning',
        title: 'تحليل IDS',
        command: 'tail -f /var/log/snort/alert',
        description: 'راقب تنبيهات Snort IDS',
        hint: 'tail -f للمتابعة المستمرة',
        xp: 50,
        completed: false
    },
    {
        id: 4,
        phase: 'exploitation',
        title: 'كشف الهجوم',
        command: 'grep "Failed password" /var/log/auth.log',
        description: 'ابحث عن محاولات تسجيل دخول فاشلة',
        hint: 'grep للبحث عن الأنماط',
        xp: 75,
        completed: false
    },
    {
        id: 5,
        phase: 'exploitation',
        title: 'حظر IP',
        command: 'iptables -A INPUT -s 192.168.1.100 -j DROP',
        description: 'احظر عنوان IP المهاجم',
        hint: 'iptables -A INPUT -s IP -j DROP',
        xp: 75,
        completed: false
    },
    {
        id: 6,
        phase: 'post_exploitation',
        title: 'تحليل العمليات',
        command: 'ps aux | grep suspicious',
        description: 'ابحث عن عمليات مشبوهة',
        hint: 'ps aux لعرض جميع العمليات',
        xp: 100,
        completed: false
    },
    {
        id: 7,
        phase: 'capture_flag',
        title: 'حماية الأصول',
        command: 'chmod 600 /root/secrets.txt',
        description: 'أغلق صلاحيات ملف الأسرار',
        hint: 'chmod 600 للقراءة فقط للمالك',
        xp: 150,
        completed: false
    }
];

const ENVIRONMENT_QUESTIONS = [
    {
        id: 1,
        question: 'ما هي أنظمة التشغيل المستهدفة في هذه البيئة؟',
        options: ['Windows Server 2019', 'Ubuntu 20.04', 'CentOS 8', 'كل ما سبق'],
        correct: 3,
        xp: 20
    },
    {
        id: 2,
        question: 'أي منفذ يجب أن تراقبه بشكل خاص؟',
        options: ['Port 80 (HTTP)', 'Port 443 (HTTPS)', 'Port 22 (SSH)', 'جميعها'],
        correct: 3,
        xp: 20
    },
    {
        id: 3,
        question: 'ما هي أداة IDS المستخدمة؟',
        options: ['Snort', 'Suricata', 'Zeek', 'OSSEC'],
        correct: 0,
        xp: 30
    }
];

export default function AttackSimulatorPro() {
    const [mode, setMode] = useState(null); // 'attacker' | 'defender'
    const [currentPhase, setCurrentPhase] = useState(0);
    const [currentTask, setCurrentTask] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalHistory, setTerminalHistory] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [totalXP, setTotalXP] = useState(0);
    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [discoveredFlags, setDiscoveredFlags] = useState([]);
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const terminalRef = useRef(null);

    const phase = STORY.phases[currentPhase];
    const tasks = mode === 'attacker' ? ATTACKER_TASKS : DEFENDER_TASKS;
    const currentTasks = tasks.filter(t => t.phase === phase.id);
    const task = currentTasks[currentTask];

    useEffect(() => {
        const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCommand = (command) => {
        const trimmedCommand = command.trim();
        
        // Simulate command execution
        let output = '';
        
        if (trimmedCommand === task?.command) {
            output = generateSuccessOutput(task);
            if (!completedTasks.includes(task.id)) {
                setCompletedTasks(prev => [...prev, task.id]);
                setTotalXP(prev => prev + task.xp);
                setDiscoveredFlags(prev => [...prev, `FLAG_${task.id}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`]);
            }
        } else {
            output = generateErrorOutput(trimmedCommand);
        }

        setTerminalHistory(prev => [...prev,
            { type: 'input', content: `$ ${trimmedCommand}`, timestamp: new Date().toLocaleTimeString() },
            { type: 'output', content: output }
        ]);

        setTerminalInput('');
    };

    const generateSuccessOutput = (task) => {
        const outputs = {
            'whois': `Domain Name: FUTURE-TECH.COM\nRegistry Domain ID: 1234567890_DOMAIN_COM-VRSN\nRegistrar WHOIS Server: whois.registrar.com\nName Server: ns1.future-tech.com\nName Server: ns2.future-tech.com\nDNSSEC: unsigned\nStatus: Active`,
            'nmap': `Starting Nmap 7.92 ( https://nmap.org )\nNmap scan report for 192.168.1.1\nHost is up (0.0023s latency).\nNot shown: 995 closed tcp ports (reset)\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\n3306/tcp open  mysql\n8080/tcp open  http-proxy`,
            'hydra': `[22][ssh] host: 192.168.1.1   login: admin   password: Password123!`,
            'sqlmap': `available databases [5]:\n[*] information_schema\n[*] mysql\n[*] future_db\n[*] performance_schema\n[*] sys`,
            'grep': `Failed password for invalid user admin from 192.168.1.100 port 54321 ssh2`,
            'iptables': `Rules updated\niptables: Saving firewall rules to /etc/sysconfig/iptables`,
            'cat': `[ALERT] CRITICAL SYSTEM FLAG CAPTURED\nFLAG{BLACK_PANTHER_OPERATION_COMPLETE}\nContents: TOP SECRET - PROJECT NEXUS`,
            'chmod': `File permissions updated successfully\n-rw------- 1 root root 1024 Jan 20 14:30 secrets.txt`
        };
        
        for (const [key, value] of Object.entries(outputs)) {
            if (task.command.includes(key)) return value;
        }
        
        return `Command executed successfully\nOutput: ${task.command}\nTimestamp: ${new Date().toISOString()}`;
    };

    const generateErrorOutput = (command) => {
        const errors = [
            `Command '${command}' not found. Did you mean: ${task?.command}?`,
            `Error: Permission denied. Try checking your privileges.`,
            `Connection refused. Target may be behind a firewall.`,
            `Invalid syntax. Check the command format and try again.`
        ];
        return errors[Math.floor(Math.random() * errors.length)];
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(terminalInput);
        }
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalHistory]);

    if (!mode) {
        return (
            <div className="min-h-screen bg-[#050214] text-white font-cairo flex items-center justify-center" dir="rtl">
                <MatrixBackground opacity={0.3} />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 max-w-4xl w-full mx-6"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#ff006e] via-[#7112AF] to-[#ff006e] bg-clip-text text-transparent">
                            {STORY.title}
                        </h1>
                        <p className="text-xl text-gray-400">{STORY.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setMode('attacker')}
                            className="p-8 bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 rounded-2xl hover:border-red-500/50 transition-all group"
                        >
                            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-500/30 transition-colors">
                                <Sword size={40} className="text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">وضع المهاجم</h2>
                            <p className="text-gray-400 mb-4">اخترق النظام، اكتشف الثغرات، وسرق الأعلام</p>
                            <div className="flex items-center justify-center gap-2 text-red-400">
                                <span>ابدأ الهجوم</span>
                                <ChevronRight size={20} />
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setMode('defender')}
                            className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-2xl hover:border-blue-500/50 transition-all group"
                        >
                            <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/30 transition-colors">
                                <Shield size={40} className="text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">وضع المدافع</h2>
                            <p className="text-gray-400 mb-4">اكتشف الهجمات، أغلق الثغرات، وحما النظام</p>
                            <div className="flex items-center justify-center gap-2 text-blue-400">
                                <span>ابدأ الدفاع</span>
                                <ChevronRight size={20} />
                            </div>
                        </motion.button>
                    </div>

                    {/* Story Phases Preview */}
                    <div className="mt-12 grid grid-cols-5 gap-4">
                        {STORY.phases.map((p, index) => (
                            <div key={p.id} className="text-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                                    index === 0 ? 'bg-[#ff006e] text-white' : 'bg-white/10 text-gray-400'
                                }`}>
                                    <span className="font-bold">{index + 1}</span>
                                </div>
                                <div className="text-xs text-gray-400">{p.title}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            <MatrixBackground opacity={0.2} />
            
            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMode(null)}
                                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight size={20} className="rotate-180" />
                            </button>
                            <div className={`p-3 rounded-lg ${mode === 'attacker' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                {mode === 'attacker' ? (
                                    <Sword size={24} className="text-red-400" />
                                ) : (
                                    <Shield size={24} className="text-blue-400" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">{STORY.title}</h1>
                                <p className="text-sm text-gray-400">
                                    {mode === 'attacker' ? 'وضع المهاجم' : 'وضع المدافع'} - {phase.title}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Timer */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                                <Clock size={18} className="text-gray-400" />
                                <span className="font-mono text-lg">{formatTime(timeElapsed)}</span>
                            </div>

                            {/* XP */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                                <Trophy size={18} className="text-yellow-400" />
                                <span className="text-yellow-400 font-bold">{totalXP} XP</span>
                            </div>

                            {/* Progress */}
                            <div className="w-48">
                                <div className="flex justify-between text-sm text-gray-400 mb-1">
                                    <span>التقدم</span>
                                    <span>{Math.round((completedTasks.length / tasks.length) * 100)}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <motion.div 
                                        className={`h-2 rounded-full ${mode === 'attacker' ? 'bg-red-500' : 'bg-blue-500'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phase Navigation */}
            <div className="relative z-10 bg-white/5 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {STORY.phases.map((p, index) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setCurrentPhase(index);
                                        setCurrentTask(0);
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                                        currentPhase === index
                                            ? mode === 'attacker'
                                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            : 'text-gray-400 hover:bg-white/5'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                        currentPhase === index
                                            ? mode === 'attacker' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                            : 'bg-white/10'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <span className="hidden md:inline">{p.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowNotes(!showNotes)}
                                className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-[#7112AF]/20 text-[#7112AF]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                <BookOpen size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-12 gap-6">
                        
                        {/* Left Panel - Tasks */}
                        <div className="col-span-3">
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-white/10">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Target size={18} className={mode === 'attacker' ? 'text-red-400' : 'text-blue-400'} />
                                        المهام
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {mode === 'attacker' ? phase.attackerObjective : phase.defenderObjective}
                                    </p>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {currentTasks.map((t, index) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setCurrentTask(index)}
                                            className={`w-full p-4 text-right hover:bg-white/5 transition-colors ${
                                                currentTask === index ? 'bg-white/10 border-r-2 ' + (mode === 'attacker' ? 'border-r-red-500' : 'border-r-blue-500') : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    completedTasks.includes(t.id)
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : currentTask === index
                                                        ? mode === 'attacker' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-white/10 text-gray-400'
                                                }`}>
                                                    {completedTasks.includes(t.id) ? (
                                                        <CheckCircle size={14} />
                                                    ) : (
                                                        <span className="text-xs">{index + 1}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-white">{t.title}</div>
                                                    <div className="text-xs text-gray-500 mt-1">+{t.xp} XP</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Discovered Flags */}
                            <div className="mt-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4">
                                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <Flag size={18} className="text-yellow-400" />
                                    الأعلام المكتشفة
                                </h3>
                                {discoveredFlags.length === 0 ? (
                                    <p className="text-gray-400 text-sm">لم تكتشف أي أعلام بعد</p>
                                ) : (
                                    <div className="space-y-2">
                                        {discoveredFlags.map((flag, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                <Trophy size={14} className="text-yellow-400" />
                                                <code className="text-yellow-400 font-mono">{flag}</code>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Center - Task & Terminal */}
                        <div className="col-span-6">
                            {task && (
                                <>
                                    {/* Task Card */}
                                    <div className={`bg-gradient-to-br ${mode === 'attacker' ? 'from-red-500/10 to-orange-500/10 border-red-500/30' : 'from-blue-500/10 to-cyan-500/10 border-blue-500/30'} border rounded-xl p-6 mb-6`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${mode === 'attacker' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                                    {mode === 'attacker' ? (
                                                        <Sword size={24} className="text-red-400" />
                                                    ) : (
                                                        <Shield size={24} className="text-blue-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-white">{task.title}</h2>
                                                    <p className="text-sm text-gray-400">{task.description}</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                                                +{task.xp} XP
                                            </div>
                                        </div>

                                        <div className="bg-black/50 rounded-lg p-4 font-mono">
                                            <div className="text-gray-400 text-sm mb-2">الأمر المتوقع:</div>
                                            <code className={`text-lg ${mode === 'attacker' ? 'text-red-400' : 'text-blue-400'}`}>
                                                {task.command}
                                            </code>
                                        </div>

                                        <div className="mt-4 flex items-start gap-3 bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30">
                                            <Lightbulb size={18} className="text-yellow-400 mt-1" />
                                            <div>
                                                <div className="text-sm font-bold text-yellow-400">تلميح</div>
                                                <div className="text-sm text-gray-300">{task.hint}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Terminal */}
                                    <div className="bg-black rounded-xl border border-white/20 overflow-hidden shadow-2xl">
                                        <div className={`px-4 py-3 flex items-center justify-between ${mode === 'attacker' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                </div>
                                                <span className="text-gray-400 text-sm ml-4 font-mono">
                                                    {mode === 'attacker' ? 'kali@attacker:~/exploits' : 'admin@server:~/security'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setTerminalHistory([])}
                                                className="p-1 hover:bg-white/10 rounded"
                                            >
                                                <RotateCcw size={14} className="text-gray-400" />
                                            </button>
                                        </div>

                                        <div ref={terminalRef} className="p-4 h-64 overflow-y-auto font-mono text-sm" dir="ltr">
                                            {terminalHistory.length === 0 && (
                                                <div className="text-gray-500 mb-4">
                                                    {mode === 'attacker' ? (
                                                        <>Welcome to Kali Linux (GNU/Linux 5.18.0-kali5-amd64)<br />Ready to start offensive operations...</>
                                                    ) : (
                                                        <>Welcome to Ubuntu 20.04.4 LTS<br />Security monitoring active...</>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {terminalHistory.map((entry, index) => (
                                                <div key={index} className="mb-2">
                                                    {entry.type === 'input' ? (
                                                        <div className={`${mode === 'attacker' ? 'text-red-400' : 'text-blue-400'}`}>
                                                            {entry.content}
                                                        </div>
                                                    ) : (
                                                        <div className="text-white whitespace-pre-wrap">{entry.content}</div>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="flex items-center">
                                                <span className={`mr-2 ${mode === 'attacker' ? 'text-red-400' : 'text-blue-400'}`}>
                                                    {mode === 'attacker' ? '➜' : '$'}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={terminalInput}
                                                    onChange={(e) => setTerminalInput(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                                                    placeholder="Enter command..."
                                                    autoFocus
                                                    spellCheck={false}
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Commands */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {['whois', 'nmap', 'hydra', 'sqlmap', 'grep', 'tcpdump', 'iptables', 'netstat'].map(cmd => (
                                            <button
                                                key={cmd}
                                                onClick={() => setTerminalInput(cmd + ' ')}
                                                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                                                    mode === 'attacker'
                                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                        : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                                }`}
                                            >
                                                {cmd}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Environment Question */}
                            {showQuestion && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6"
                                >
                                    <h3 className="text-lg font-bold text-white mb-4">اختبار المعرفة</h3>
                                    <p className="text-gray-300 mb-4">{ENVIRONMENT_QUESTIONS[currentQuestion].question}</p>
                                    <div className="space-y-2">
                                        {ENVIRONMENT_QUESTIONS[currentQuestion].options.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (index === ENVIRONMENT_QUESTIONS[currentQuestion].correct) {
                                                        setTotalXP(prev => prev + ENVIRONMENT_QUESTIONS[currentQuestion].xp);
                                                    }
                                                    if (currentQuestion < ENVIRONMENT_QUESTIONS.length - 1) {
                                                        setCurrentQuestion(prev => prev + 1);
                                                    } else {
                                                        setShowQuestion(false);
                                                    }
                                                }}
                                                className="w-full p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-right"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Panel - Visual & Notes */}
                        <div className="col-span-3 space-y-6">
                            {/* Network Visual */}
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-white/10">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Network size={18} className="text-green-400" />
                                        خريطة الشبكة
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="relative h-48 bg-black/30 rounded-lg overflow-hidden">
                                        {/* Network visualization */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative">
                                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${mode === 'attacker' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                                    {mode === 'attacker' ? (
                                                        <Skull size={24} className="text-red-400" />
                                                    ) : (
                                                        <Shield size={24} className="text-blue-400" />
                                                    )}
                                                </div>
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                                                    {mode === 'attacker' ? 'Attacker' : 'Defender'}
                                                </div>
                                            </div>
                                            
                                            {/* Connection lines */}
                                            <svg className="absolute inset-0 w-full h-full">
                                                <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                                                <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                                                <line x1="50%" y1="50%" x2="50%" y2="80%" stroke={mode === 'attacker' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'} strokeWidth="2" strokeDasharray="5,5">
                                                    <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
                                                </line>
                                            </svg>
                                            
                                            {/* Target */}
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <Server size={20} className="text-green-400" />
                                                </div>
                                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                                                    Target Server
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Panel */}
                            {showNotes && (
                                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            <BookOpen size={18} className="text-yellow-400" />
                                            الملاحظات
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="اكتب ملاحظاتك هنا..."
                                            className="w-full h-32 bg-black/30 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-[#7112AF]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Operation Stats */}
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                                <h3 className="font-bold text-white mb-4">إحصائيات العملية</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">المهام المكتملة</span>
                                        <span className="text-white font-bold">{completedTasks.length}/{tasks.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">الأعلام</span>
                                        <span className="text-yellow-400 font-bold">{discoveredFlags.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">الوقت المنقضي</span>
                                        <span className="text-white font-mono">{formatTime(timeElapsed)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">المرحلة الحالية</span>
                                        <span className="text-purple-400">{currentPhase + 1}/5</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hints */}
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                                <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                                    <Lightbulb size={18} />
                                    إرشادات
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li>• اقرأ المهمة بعناية قبل البدء</li>
                                    <li>• استخدم التلميح إذا علقت</li>
                                    <li>• سجل ملاحظاتك في لوحة الملاحظات</li>
                                    <li>• تابع التقدم في شريط المهام</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
