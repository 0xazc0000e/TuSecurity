import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Skull, Terminal, Activity, CheckCircle,
    Server, Globe, Clock, Zap, Info, ArrowRight, Home
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { MatrixBackground } from '../ui/MatrixBackground';

const Typewriter = ({ text, speed = 30, onComplete }) => {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
        let i = 0;
        setDisplayed('');
        const timer = setInterval(() => {
            setDisplayed(text.substring(0, i));
            i++;
            if (i > text.length) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);
    return <span>{displayed}</span>;
}

const SCENARIO_DATA = {
    story: {
        title: "عملية الدرع العظيم",
        description: "لقد تم اكتشاف محاولة اختراق ضخمة لشركة طاقة كبرى (SmartGrid). الأنظمة الحيوية تتعرض لهجوم خطير. لديك خياران: إما أن تنضم لفريق المهاجمين (Red Team) لاختبار الأنظمة واكتشاف الثغرات واستغلالها لفضح نقاط الضعف، أو أن تنضم لفريق المدافعين (SOC Team) لاكتشاف الهجوم، إيقافه، وتأمين النظام. الخيار لك!"
    },
    defender: {
        role: "فريق الدفاع (المدافع)",
        objectives: [
            {
                id: 1,
                text: "تحليل السجلات (Logs) للبحث عن أخطاء أو محاولات دخول غريبة.",
                cmd_hint: "grep 'error' /var/log/syslog",
                learning: {
                    what: "استخدمنا الأمر grep مع الكلمة المفتاحية 'error'.",
                    why: "لأن ملفات السجل (Logs) ضخمة جداً، والأمر grep يقوم بفلترة السطور التي تحتوي على الكلمة المطلوبة فقط، مما يسهل علينا إيجاد المحاولات المشبوهة بدلاً من قراءة آلاف الأسطر يدوياً."
                }
            },
            {
                id: 2,
                text: "تحديد هوية ومصدر عنوان الـ IP المشبوه.",
                cmd_hint: "whois 45.33.22.11",
                learning: {
                    what: "استخدمنا أداة whois للبحث عن تفاصيل عنوان الـ IP.",
                    why: "لمعرفة من يملك هذا العنوان، وموقعه الجغرافي، وما إذا كان مسجلاً كعنوان خبيث أو ينتمي لشبكة وهمية (Proxy) لمعرفة طبيعة المهاجم."
                }
            },
            {
                id: 3,
                text: "حظر عنوان الـ IP لمنع هجماته المستقبلية.",
                cmd_hint: "iptables -A INPUT -s 45.33.22.11 -j DROP",
                learning: {
                    what: "استخدمنا الموثق iptables لإضافة قاعدة (Rule) للإسقاط DROP.",
                    why: "لإيقاف الاتصال الخبيث فوراً. هذه القاعدة تخبر جدار الحماية بإسقاط وتجاهل أي حزمة بيانات قادمة من عنوان الـ IP الخاص بالمهاجم."
                }
            },
            {
                id: 4,
                text: "إغلاق المنفذ المفتوح 8080 الذي تعرض للهجوم.",
                cmd_hint: "ufw deny 8080",
                learning: {
                    what: "استخدمنا ufw لرفض حركة المرور على المنفذ 8080.",
                    why: "لتقليص المساحة المعرضة للهجوم (Attack Surface). أي منفذ مفتوح غير مستخدم يمثل باباً خلفياً يمكن للمهاجمين استغلاله."
                }
            },
            {
                id: 5,
                text: "عمل فحص أمان للملفات للتأكد من عدم وجود برامج خبيثة.",
                cmd_hint: "chkrootkit",
                learning: {
                    what: "استخدمنا أداة chkrootkit لفحص النظام.",
                    why: "للتأكد من أن المهاجم لم يقم بزرع أدوات اختراق خفية (Rootkits) تسمح له بالعودة مجدداً حتى بعد تغيير كلمات المرور وإغلاق المنافذ."
                }
            }
        ],
        commands: {
            'grep': { responses: [{ arg: 'error', output: "[ALERT] Connection refused on port 8080\n[CRITICAL] Unauthorized root access attempt from 45.33.22.11" }, { arg: 'default', output: "Usage: grep [pattern] [file]" }] },
            'whois': { responses: [{ arg: '45.33.22.11', output: "NetRange: 45.0.0.0 - 45.255.255.255\nOrg: Unknown Proxy Service\nCountry: XK (Unknown)\nStatus: BLACKLISTED" }, { arg: 'default', output: "Usage: whois [IP/Domain]" }] },
            'iptables': { responses: [{ arg: '45.33.22.11', output: "Chain INPUT (policy ACCEPT)\nDROP       all  --  45.33.22.11          0.0.0.0/0\n\n[+] تم تطبيق القاعدة بنجاح. عنوان الـ IP محظور." }, { arg: 'default', output: "Usage: iptables [OPTIONS] [Rule]" }] },
            'ufw': { responses: [{ arg: 'deny', output: "Rule updated\nRule updated (v6)\n[+] تم إغلاق المنفذ 8080 بنجاح." }, { arg: 'default', output: "Usage: ufw [allow/deny] [port]" }] },
            'chkrootkit': { responses: [{ arg: 'default', output: "Checking `bindshell`... not found\nChecking `lkm`... not found\nChecking `sniffer`... not found\n\n[+] النظام نظيف، تم تأمين الاختراق بنجاح!" }] }
        }
    },
    attacker: {
        role: "فريق الهجوم (المهاجم)",
        objectives: [
            {
                id: 1,
                text: "إجراء فحص شبكي لمعرفة الخدمات والمنافذ المفتوحة للهدف 192.168.1.55.",
                cmd_hint: "nmap -sV 192.168.1.55",
                learning: {
                    what: "استخدمنا أداة الاستطلاع nmap لاكتشاف المنافذ والخدمات المتوفرة.",
                    why: "لأن الاختراق الناجح يبدأ بجمع المعلومات (Reconnaissance). معرفة الخدمات المفتوحة يساعدنا في إيجاد الثغرات لتنفيذ الهجوم عليها."
                }
            },
            {
                id: 2,
                text: "البحث عن ثغرات في الخدمات التي اكتشفناها على الهدف 192.168.1.55.",
                cmd_hint: "nikto -h 192.168.1.55",
                learning: {
                    what: "استخدمنا أداة فحص الثغرات nikto على خادم الويب.",
                    why: "للبحث عن نقاط ضعف معروفة أو ملفات خفية أو إعدادات خاطئة في الخادم يمكن استغلالها للحصول على وصول غير مصرح به للنظام."
                }
            },
            {
                id: 3,
                text: "استغلال الثغرة في خدمة Modbus للحصول على وصول باستخدام msfconsole.",
                cmd_hint: "msfconsole -x 'use modbus'",
                learning: {
                    what: "استخدمنا منصة Metasploit بإرسال استغلال modbus.",
                    why: "هذه المنصة تمتلك استغلالات جاهزة للثغرات المكتشفة، وبتحديد مسار الثغرة المناسبة تمكنا من التسلل وفتح جلسة تحكم (Session) في نظام الهدف."
                }
            },
            {
                id: 4,
                text: "البحث عن طرق لرفع الصلاحيات لمعرفة ماذا يمكننا أن نفعل عبر أمر sudo.",
                cmd_hint: "sudo -l",
                learning: {
                    what: "استخدمنا الأمر sudo -l لمعرفة الصلاحيات المتاحة لدينا.",
                    why: "بعد الدخول الأولي للنظام، عادة ما نحصل على مستخدم عادي ضعيف الصلاحيات، فنستخدم هذا الأمر للبحث عن برامج يمكن تشغيلها بصلاحيات الـ Root (المدير) لرفع صلاحياتنا."
                }
            },
            {
                id: 5,
                text: "استخراج ملف كلمات المرور shadow باستخدام برنامج cat الذي نمتلك صلاحياته.",
                cmd_hint: "sudo cat shadow",
                learning: {
                    what: "قرأنا ملف shadow المحمي بصلاحيات الـ Root.",
                    why: "هذا الملف يحتوي على الأرقام السرية (Hashes) لجميع مستخدمي النظام. قراءته تدل على نجاحنا بالتحكم الكامل في الخادم (System Compromise)."
                }
            }

        ],
        commands: {
            'nmap': { responses: [{ arg: '192.168.1.55', output: "Starting Nmap 7.92...\nHost is up (0.002s latency).\nPORT     STATE SERVICE VERSION\n80/tcp   open  http    Apache/2.4.41\n502/tcp  open  modbus  Schneider Electric\nMAC Address: 00:0C:29:4F:8E:35" }, { arg: 'default', output: "Usage: nmap [Scan Type(s)] [Options]" }] },
            'nikto': { responses: [{ arg: '192.168.1.55', output: "+ Server: Apache/2.4.41\n+ /admin/config.php: Found sensitive config file.\n+ CVE-2023-502: Modbus service OS Command Injection found." }, { arg: 'default', output: "Usage: nikto -h [Host]" }] },
            'msfconsole': { responses: [{ arg: 'modbus', output: "[*] Started reverse TCP handler on 10.0.0.5:4444\n[*] Sending stage to 192.168.1.55\n[*] Meterpreter session 1 opened!\n\nmeterpreter > system access granted." }, { arg: 'default', output: "Usage: msfconsole -x [command string]" }] },
            'sudo': { responses: [{ arg: '-l', output: "User www-data may run the following commands on target:\n    (ALL : ALL) NOPASSWD: /usr/bin/cat" }, { arg: 'shadow', output: "root:$6$xyz123:19000:0:99999:7:::\nadmin:$6$abc987:19000:0:99999:7:::\n\n[+] تم استخراج كلمات المرور المشفرة بنجاح! المهمة انتهت." }, { arg: 'default', output: "Usage: sudo -h | -K | -k | -V" }] },
            'cat': { responses: [{ arg: 'shadow', output: "cat: shadow: Permission denied" }, { arg: 'default', output: "Usage: cat [OPTION]... [FILE]..." }] },
            'whoami': { responses: [{ arg: 'default', output: "www-data" }] }
        }
    }
};

export default function DualBreachSimulator() {
    const { logEvent } = useAnalytics();

    // Phases: 'intro', 'role_select', 'simulation', 'debrief'
    const [phase, setPhase] = useState('intro');
    const [role, setRole] = useState(null);

    // Simulation State
    const [timeline, setTimeline] = useState([]);
    const [currentObjIndex, setCurrentObjIndex] = useState(0);
    const [terminalLines, setTerminalLines] = useState([]);
    const [commandInput, setCommandInput] = useState('');
    const [score, setScore] = useState(100);
    const terminalEndRef = useRef(null);

    // AI & Modals
    const [aiMessage, setAiMessage] = useState({ text: "في انتظار إدخال الأوامر...", type: "info" });
    const [showLearningModal, setShowLearningModal] = useState(false);
    const [learningData, setLearningData] = useState(null);

    useEffect(() => {
        if (phase === 'simulation') {
            addTimelineEvent({ time: '00:00', msg: 'بدء المحاكاة', type: 'info' });
            const initMsg = role === 'defender'
                ? "تنبيه: تم اكتشاف ضغط عالي وحركة مرور غير طبيعية على الخادم."
                : "بدء المهمة: الهدف هو الدخول لشبكة 192.168.1.1 واستخراج البيانات.";
            setTimeout(() => {
                addTimelineEvent({ time: '00:05', msg: initMsg, type: 'alert' });
                updateAI(initMsg, 'alert');
            }, 1000);
        }
    }, [phase, role]);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [terminalLines]);

    const addTimelineEvent = (event) => setTimeline(prev => [event, ...prev]);
    const updateAI = (msg, type = 'info') => setAiMessage({ text: msg, type });

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        const rawCmd = commandInput.trim();
        if (!rawCmd) return;
        setTerminalLines(prev => [...prev, { type: 'in', text: `${role === 'attacker' ? 'hacker@red' : 'soc@blue'}:~$ ${rawCmd}` }]);
        processCommand(rawCmd);
        setCommandInput('');
    };

    const processCommand = (cmd) => {
        const parts = cmd.split(' ');
        const baseCmd = parts[0].toLowerCase();
        let args = parts.slice(1).join(' ').toLowerCase();

        // Special handling for sudo cat
        let effBase = baseCmd;
        if (baseCmd === 'sudo') {
            if (parts[1] && parts[1].toLowerCase() === 'cat') {
                effBase = 'sudo';
                args = 'shadow';
            }
        }

        const roleData = SCENARIO_DATA[role];
        if (!roleData.commands[effBase]) {
            setTimeout(() => {
                setTerminalLines(prev => [...prev, { type: 'err', text: `bash: ${effBase}: command not found` }]);
                setScore(s => s - 5);
                updateAI(`أمر غير معروف '${effBase}'. تحقق من قائمة الأدوات.`, 'warn');
            }, 200);
            return;
        }

        let success = false;
        let responseText = "تطبيق الأمر فشل أو أن المدخلات غير صحيحة. حاول مرة أخرى.";
        const cmdConfig = roleData.commands[effBase];

        const match = cmdConfig.responses.find(r => args.includes(r.arg)) || cmdConfig.responses.find(r => r.arg === 'default');

        if (match) {
            responseText = match.output;
            const currentObjective = roleData.objectives[currentObjIndex];

            // Loose check for objective completion based on hint content
            const hintTokens = currentObjective.cmd_hint.toLowerCase().split(' ');
            const usedTokens = cmd.toLowerCase().split(' ');

            let matchedCore = true;
            if (hintTokens[0] !== usedTokens[0]) matchedCore = false;
            if (matchedCore && currentObjective.cmd_hint.includes('error') && !args.includes('error')) matchedCore = false;
            if (matchedCore && currentObjective.cmd_hint.includes('45.33') && !args.includes('45.33')) matchedCore = false;
            if (matchedCore && currentObjective.cmd_hint.includes('192.168.1.55') && !args.includes('192.168')) matchedCore = false;
            if (matchedCore && currentObjective.cmd_hint.includes('ufw') && (!args.includes('deny') || !args.includes('8080'))) matchedCore = false;

            if (matchedCore) success = true;
        }

        setTimeout(() => {
            setTerminalLines(prev => [...prev, { type: 'out', text: responseText }]);

            if (success) {
                const finishedObj = roleData.objectives[currentObjIndex];
                setLearningData(finishedObj.learning);
                setShowLearningModal(true);
            }
        }, 500);
    };

    const proceedToNextObjective = () => {
        setShowLearningModal(false);
        const roleData = SCENARIO_DATA[role];
        const nextIndex = currentObjIndex + 1;

        addTimelineEvent({ time: 'الآن', msg: `تم إنجاز المهمة بنجاح`, type: 'success' });

        if (nextIndex < roleData.objectives.length) {
            setCurrentObjIndex(nextIndex);
            updateAI(`مهمة جديدة: ${roleData.objectives[nextIndex].text}`, 'success');
        } else {
            setPhase('debrief');
        }
    };

    const renderIntro = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto z-10" dir="rtl">
            <h1 className="text-5xl font-extrabold text-[#7112AF] mb-6 drop-shadow-lg">{SCENARIO_DATA.story.title}</h1>
            <div className="bg-[#0a0a12]/80 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md mb-8">
                <p className="text-xl text-slate-300 leading-loose">
                    <Typewriter text={SCENARIO_DATA.story.description} speed={25} />
                </p>
            </div>
            <button
                onClick={() => setPhase('role_select')}
                className="px-10 py-4 bg-[#7112AF] hover:bg-purple-700 text-white rounded-xl font-bold text-xl transition-all shadow-[0_0_20px_rgba(113,18,175,0.5)] flex items-center gap-3"
            >
                متابعة واختيار الفريق
                <ArrowRight size={24} className="rotate-180" />
            </button>
        </motion.div>
    );

    const renderRoles = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto z-10" dir="rtl">
            <h2 className="text-4xl font-bold text-white mb-12">اختر مسارك لتحديد مصير العملية</h2>
            <div className="grid md:grid-cols-2 gap-8 w-full">
                <button
                    onClick={() => { setRole('attacker'); setPhase('simulation'); }}
                    className="p-10 bg-red-950/20 border-2 border-red-500/50 rounded-3xl hover:bg-red-900/40 hover:border-red-400 transition-all group relative overflow-hidden flex flex-col items-center shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Skull className="w-24 h-24 text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <h3 className="text-3xl font-bold text-white mb-4 relative z-10">المهاجمين (Red Team)</h3>
                    <p className="text-red-200/80 text-lg leading-relaxed relative z-10">قم بتنفيذ عمليات الاستطلاع، استغلال الثغرات وتخطي الجدران النارية لاختراق الأنظمة الحيوية بنجاح.</p>
                </button>

                <button
                    onClick={() => { setRole('defender'); setPhase('simulation'); }}
                    className="p-10 bg-blue-950/20 border-2 border-blue-500/50 rounded-3xl hover:bg-blue-900/40 hover:border-blue-400 transition-all group relative overflow-hidden flex flex-col items-center shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Shield className="w-24 h-24 text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <h3 className="text-3xl font-bold text-white mb-4 relative z-10">المدافعين (SOC Team)</h3>
                    <p className="text-blue-200/80 text-lg leading-relaxed relative z-10">راقب السجلات، تتبع التهديدات، قم بحظر الهجمات المباشرة وحصن الشبكة ضد الاختراق لإنقاذ الموقف.</p>
                </button>
            </div>
        </motion.div>
    );

    const renderLearningModal = () => {
        if (!showLearningModal || !learningData) return null;
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6" dir="rtl">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#110C24] border-2 border-[#7112AF]/50 rounded-3xl p-8 max-w-2xl w-full shadow-[0_0_60px_rgba(113,18,175,0.3)] relative">
                    <div className="flex items-center gap-4 mb-6 text-[#7112AF]">
                        <Info size={40} />
                        <h3 className="text-3xl font-bold text-white">تحديث المهمة: التعلم والفهم</h3>
                    </div>

                    <div className="space-y-6 text-lg">
                        <div className="bg-[#1E1538] p-5 rounded-xl border border-white/5">
                            <h4 className="font-bold text-purple-300 mb-2 flex items-center gap-2"><Terminal size={20} /> ماذا استخدمنا؟</h4>
                            <p className="text-slate-200 leading-relaxed">{learningData.what}</p>
                        </div>
                        <div className="bg-[#1E1538] p-5 rounded-xl border border-white/5">
                            <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2"><Zap size={20} /> لماذا استخدمناه؟</h4>
                            <p className="text-slate-200 leading-relaxed">{learningData.why}</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={proceedToNextObjective}
                            className="px-8 py-3 bg-[#7112AF] hover:bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer"
                        >
                            انتقل للمهمة التالية
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const renderSimulation = () => {
        const roleConfig = SCENARIO_DATA[role];
        const currentObj = roleConfig.objectives[currentObjIndex];

        return (
            <div className="h-full flex flex-col bg-[#050214] font-mono text-sm overflow-hidden z-10 relative">
                {renderLearningModal()}

                <div className="h-16 border-b border-white/10 bg-[#0a0a12]/90 backdrop-blur flex items-center justify-between px-6" dir="rtl">
                    <div className="flex items-center gap-6">
                        <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${role === 'attacker' ? 'bg-red-900/30 text-red-500 border border-red-500/20' : 'bg-blue-900/30 text-blue-500 border border-blue-500/20'}`}>
                            {role === 'attacker' ? <Skull size={18} /> : <Shield size={18} />}
                            {roleConfig.role}
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            <Clock size={16} className="text-[#b45cf0]" />
                            <span className="font-bold">00:{String(30 - Math.floor(timeline.length)).padStart(2, '0')}:00</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[11px] text-[#7112AF] font-bold uppercase mb-1">المهمة الحالية ({currentObjIndex + 1}/{roleConfig.objectives.length})</span>
                            <span className="text-sm font-bold text-white max-w-md truncate">{currentObj.text}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                            <Activity size={18} className="text-green-500" />
                            <span className="font-bold">{score} XP</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-12 gap-4 p-4 min-h-0" dir="ltr">

                    {/* Left: Info & Tools */}
                    <div className="col-span-3 flex flex-col gap-4 min-h-0">
                        <div className="bg-[#0a0a12] border border-white/10 rounded-xl flex flex-col shrink-0">
                            <div className="p-3 border-b border-white/10 text-xs font-bold text-slate-400 bg-white/5 rounded-t-xl" dir="rtl">
                                مساعد النظام الذكي
                            </div>
                            <div className="p-4" dir="rtl">
                                <div className={`text-sm leading-relaxed p-4 rounded-xl border ${aiMessage.type === 'alert' ? 'bg-red-900/10 border-red-500/30 text-red-200' : 'bg-[#7112AF]/10 border-[#7112AF]/30 text-purple-200'}`}>
                                    <Typewriter text={aiMessage.text} speed={15} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0a0a12] border border-white/10 rounded-xl flex flex-col flex-1 min-h-0">
                            <div className="p-3 border-b border-white/10 text-xs font-bold text-slate-400 bg-white/5 rounded-t-xl text-right" dir="rtl">
                                الأدوات المتاحة (انقر للاستخدام)
                            </div>
                            <div className="p-3 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 gap-2 text-right">
                                {Object.keys(roleConfig.commands).map((cmd, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCommandInput(cmd + ' ')}
                                        className="text-right p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all font-bold text-[#b45cf0] cursor-pointer"
                                        dir="ltr"
                                    >
                                        &gt; {cmd}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Terminal */}
                    <div className="col-span-6 bg-[#04020a] border border-slate-800 rounded-xl flex flex-col shadow-2xl relative">
                        <div className="h-10 bg-[#120a1c] flex items-center justify-between px-4 border-b border-purple-900/30 rounded-t-xl">
                            <div className="flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                                <span className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <span className="text-xs text-slate-400 font-sans tracking-widest text-[#b45cf0]">TuSecurity Terminal Pro</span>
                        </div>
                        <div className="flex-1 p-5 overflow-y-auto text-[14px] leading-relaxed custom-scrollbar" onClick={() => document.getElementById('cmdInput').focus()}>
                            {terminalLines.map((line, i) => (
                                <div key={i} className={`mb-2 whitespace-pre-wrap font-mono ${line.type === 'err' ? 'text-red-400' : line.type === 'in' ? 'text-white' : 'text-green-400/90'}`}>
                                    {line.text}
                                </div>
                            ))}
                            <div ref={terminalEndRef} />
                        </div>
                        <form onSubmit={handleCommandSubmit} className="p-3 bg-[#120a1c] border-t border-purple-900/30 flex items-center gap-3 rounded-b-xl">
                            <span className="text-[#b45cf0] font-bold shrink-0">{role === 'attacker' ? 'hacker@red' : 'soc@blue'}:~$</span>
                            <input
                                id="cmdInput"
                                type="text"
                                value={commandInput}
                                onChange={(e) => setCommandInput(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-white text-[14px] font-mono"
                                autoFocus spellCheck="false" autoComplete="off"
                            />
                        </form>
                    </div>

                    {/* Right: Map & Timeline */}
                    <div className="col-span-3 flex flex-col gap-4 min-h-0">
                        <div className="bg-[#0a0a12] border border-white/10 rounded-xl flex flex-col aspect-square shrink-0 p-4 justify-center items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 animate-pulse mb-4 shadow-[0_0_30px_rgba(34,197,94,0.3)] ${role === 'attacker' ? 'bg-red-900/20 border-red-500/50 shadow-red-500/50' : 'bg-blue-900/20 border-blue-500/50 shadow-blue-500/50'}`}>
                                    <Server size={32} className={role === 'attacker' ? 'text-red-400' : 'text-blue-400'} />
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">TARGET: 192.168.1.55</span>
                                <span className="text-[10px] text-green-400 font-bold tracking-widest uppercase bg-black/50 px-3 py-1 rounded-full border border-green-500/30 mt-2 backdrop-blur-sm shadow-[0_0_10px_rgba(34,197,94,0.2)]">STATUS: ONLINE</span>
                            </div>
                        </div>

                        <div className="bg-[#0a0a12] border border-white/10 rounded-xl flex flex-col flex-1 min-h-0">
                            <div className="p-3 border-b border-white/10 text-xs font-bold text-slate-400 bg-white/5 rounded-t-xl flex justify-between items-center" dir="rtl">
                                <span>سجل الأحداث</span>
                                <span className="text-[10px] text-purple-400 bg-purple-900/20 px-2 py-1 rounded border border-purple-500/20">LIVE</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" dir="rtl">
                                {timeline.map((event, i) => (
                                    <div key={i} className="flex gap-3 text-xs opacity-90 border-r-2 pr-3 border-white/10">
                                        <span className="text-slate-500 shrink-0 font-mono">[{event.time}]</span>
                                        <span className={event.type === 'alert' ? 'text-red-400 font-bold' : event.type === 'success' ? 'text-green-400 font-bold' : 'text-purple-300'}>
                                            {event.msg}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDebrief = () => (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center p-8 text-center z-10" dir="rtl">
            <CheckCircle className="w-32 h-32 text-green-500 mb-8 drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]" />
            <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">اكتملت العملية بنجاح!</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">لقد أثبتت كفاءتك واستكملت جميع الأهداف في المحاكاة الأمنية بنجاح مبهر. هذا الميدان كان نقطة الانطلاق لتصبح خبيراً في الأمن السيبراني.</p>
            <div className="bg-[#110C24] p-10 rounded-[40px] border-2 border-[#7112AF]/30 mb-12 min-w-[350px] shadow-[0_0_50px_rgba(113,18,175,0.4)]">
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#7112AF] mb-3">{score} XP</div>
                <div className="text-sm text-slate-400 uppercase tracking-widest font-bold">نقاط الخبرة المكتسبة</div>
            </div>
            <button onClick={() => window.location.href = '/simulators'} className="px-12 py-5 bg-gradient-to-r from-[#7112AF] to-purple-600 hover:from-purple-600 hover:to-[#7112AF] shadow-[0_0_30px_rgba(113,18,175,0.6)] text-white rounded-2xl font-bold text-xl flex items-center gap-4 transition-all hover:scale-105 cursor-pointer">
                <Home size={24} />
                العودة لقائمة المحاكيات
            </button>
        </motion.div>
    );

    return (
        <div className="h-screen w-screen bg-[#02010a] text-white flex flex-col font-cairo overflow-hidden relative selection:bg-purple-900/50">
            <MatrixBackground />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,1,10,0.8)_100%)] pointer-events-none" />
            <AnimatePresence mode="wait">
                {phase === 'intro' && renderIntro()}
                {phase === 'role_select' && renderRoles()}
                {phase === 'simulation' && renderSimulation()}
                {phase === 'debrief' && renderDebrief()}
            </AnimatePresence>
        </div>
    );
}
