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
    FileSearch, ScrollText, Cog, Play, Settings, Wrench
} from 'lucide-react';
import { MatrixBackground } from '../ui/MatrixBackground';

const CURRICULUM = {
    // Unit 1: Basics
    basics: {
        id: 'basics',
        title: 'الوحدة الأولى: الأساسيات',
        subtitle: 'كسر حاجز الخوف من الشاشة السوداء',
        color: '#240993',
        icon: Terminal,
        description: 'تعلم الأوامر الأساسية للتنقل في النظام',
        lessons: [
            {
                id: 1,
                title: 'أين أنا؟ (نظام الرادار)',
                command: 'pwd',
                concept: 'في العالم الرقمي، لا يمكنك التحرك إذا لم تعرف موقعك',
                visual: 'radar',
                task: 'المخترق يجب أن يحدد موقعه الحالي داخل السيرفر',
                expectedOutput: '/home/student',
                hint: 'اكتب pwd لمعرفة مسارك الحالي',
                xp: 10,
                completed: false
            },
            {
                id: 2,
                title: 'كشف المستور (الرؤية الليلية)',
                command: 'ls',
                concept: 'غرفة مظلمة، عند تشغيل الكشاف تظهر الصناديق والأوراق',
                visual: 'flashlight',
                task: 'استعرض محتويات المجلد الحالي لرؤية الأدوات المتاحة',
                expectedOutput: 'file1.txt folder1/ data/',
                hint: 'استخدم ls لعرض الملفات والمجلدات',
                xp: 10,
                completed: false
            },
            {
                id: 3,
                title: 'الأسرار المخفية (الأشعة السينية)',
                command: 'ls -a',
                concept: 'بعض الملفات ترتدي عباءة إخفاء، نحتاج نظارة خاصة لكشفها',
                visual: 'xray',
                task: 'المجلد يبدو فارغاً لكن توجد ملفات مخفية. اعثر عليها',
                expectedOutput: '.secret_config .hidden_folder/',
                hint: 'ls -a يعرض الملفات المخفية التي تبدأ بنقطة',
                xp: 15,
                completed: false
            },
            {
                id: 4,
                title: 'الانتقال الآني (بوابة العبور)',
                command: 'cd',
                concept: 'الدخول من باب إلى غرفة أخرى',
                visual: 'portal',
                task: 'ادخل إلى مجلد Tools',
                expectedOutput: 'cd Tools',
                hint: 'استخدم cd followed by اسم المجلد',
                xp: 10,
                completed: false
            },
            {
                id: 5,
                title: 'التراجع التكتيكي',
                command: 'cd ..',
                concept: 'الخروج من الغرفة إلى الممر الرئيسي',
                visual: 'back',
                task: 'عد للمجلد السابق',
                expectedOutput: 'cd ..',
                hint: 'cd .. يرجع مستوى واحد للأعلى',
                xp: 10,
                completed: false
            },
            {
                id: 6,
                title: 'تنظيف الفوضى',
                command: 'clear',
                concept: 'لوح زجاجي مليء بالكتابة، تمسحه ليعود نظيفاً',
                visual: 'clean',
                task: 'نظف الشاشة من الأوامر القديمة',
                expectedOutput: 'clear',
                hint: 'clear يمسح الشاشة',
                xp: 5,
                completed: false
            }
        ]
    },
    
    // Unit 2: File and Directory Management
    file_management: {
        id: 'file_management',
        title: 'الوحدة الثانية: إدارة الملفات والمجلدات',
        subtitle: 'التحكم الكامل في نظام الملفات',
        color: '#7112AF',
        icon: Folder,
        description: 'إنشاء، نسخ، نقل، وحذف الملفات والمجلدات',
        lessons: [
            {
                id: 7,
                title: 'إنشاء القواعد',
                command: 'mkdir',
                concept: 'مهندس يضع مخططاً وعلى الفور يظهر المبنى',
                visual: 'build',
                task: 'أنشئ مجلداً جديداً باسم Hacking_Lab',
                expectedOutput: 'mkdir Hacking_Lab',
                hint: 'mkdir ينشئ مجلد جديد',
                xp: 15,
                completed: false
            },
            {
                id: 8,
                title: 'خلق البيانات',
                command: 'touch',
                concept: 'سحب ورقة بيضاء فارغة من الهواء',
                visual: 'create',
                task: 'أنشئ ملف notes.txt فارغاً',
                expectedOutput: 'touch notes.txt',
                hint: 'touch ينشئ ملف فارغ',
                xp: 10,
                completed: false
            },
            {
                id: 9,
                title: 'الاستنساخ',
                command: 'cp',
                concept: 'آلة تصوير مستندات تخرج نسخة طبق الأصل',
                visual: 'copy',
                task: 'انسخ notes.txt إلى notes_backup.txt',
                expectedOutput: 'cp notes.txt notes_backup.txt',
                hint: 'cp مصدر وجهة',
                xp: 15,
                completed: false
            },
            {
                id: 10,
                title: 'النقل والتمويه',
                command: 'mv',
                concept: 'نقل صندوق أو تغيير اللاصق التعريفي',
                visual: 'move',
                task: 'غير اسم virus.exe إلى game.exe',
                expectedOutput: 'mv virus.exe game.exe',
                hint: 'mv oldname newname',
                xp: 15,
                completed: false
            },
            {
                id: 11,
                title: 'التدمير',
                command: 'rm',
                concept: 'فرامة ورق تحول المستند لشرائح غير قابلة للاستعادة',
                visual: 'destroy',
                task: 'احذف evidence.log',
                expectedOutput: 'rm evidence.log',
                hint: 'rm يحذف الملفات - احذر!',
                xp: 20,
                completed: false
            },
            {
                id: 12,
                title: 'استدعاء الحكيم',
                command: 'man',
                concept: 'فتح موسوعة ضخمة لمعرفة تفاصيل دقيقة',
                visual: 'book',
                task: 'اطلب دليل استخدام أمر ls',
                expectedOutput: 'man ls',
                hint: 'man يعرض الدليل',
                xp: 10,
                completed: false
            }
        ]
    },
    
    // Unit 3: Reading and Writing
    read_write: {
        id: 'read_write',
        title: 'الوحدة الثالثة: القراءة والكتابة',
        subtitle: 'التعامل مع محتوى الملفات',
        color: '#ff006e',
        icon: FileText,
        description: 'قراءة الملفات والكتابة إليها وتوجيه الخرج',
        lessons: [
            {
                id: 13,
                title: 'القراءة السريعة',
                command: 'cat',
                concept: 'عرض محتوى وثيقة على شاشة البروجيكتور',
                visual: 'projector',
                task: 'اعرض محتوى password_hint.txt',
                expectedOutput: 'cat password_hint.txt',
                hint: 'cat يعرض محتوى الملف كاملاً',
                xp: 15,
                completed: false
            },
            {
                id: 14,
                title: 'الصوت والصدى',
                command: 'echo',
                concept: 'التحدث عبر مكبر صوت',
                visual: 'speaker',
                task: 'اطبع "Hacked by TuSecurity"',
                expectedOutput: 'echo "Hacked by TuSecurity"',
                hint: 'echo يطبع نص',
                xp: 10,
                completed: false
            },
            {
                id: 15,
                title: 'التوجيه',
                command: '>',
                concept: 'توجيه الماء للدلو بدلاً من الأرض',
                visual: 'redirect',
                task: 'احفظ كلمة السر في pass.txt',
                expectedOutput: 'echo "password123" > pass.txt',
                hint: '> يوجه الخرج لملف',
                xp: 20,
                completed: false
            },
            {
                id: 16,
                title: 'الإضافة',
                command: '>>',
                concept: 'الكتابة في الصفحة التالية من الدفتر',
                visual: 'append',
                task: 'أضف توقيعك للسجل دون مسحه',
                expectedOutput: 'echo "signed" >> log.txt',
                hint: '>> يضيف للملف',
                xp: 15,
                completed: false
            }
        ]
    },
    
    // Unit 4: Viewing
    viewing: {
        id: 'viewing',
        title: 'الوحدة الرابعة: الاستعراض',
        subtitle: 'عرض الملفات بطرق مختلفة',
        color: '#3b82f6',
        icon: Eye,
        description: 'عرض أجزاء من الملفات وتصفحها',
        lessons: [
            {
                id: 17,
                title: 'البدايات',
                command: 'head',
                concept: 'قراءة العناوين الرئيسية في الجريدة',
                visual: 'headlines',
                task: 'تحقق من أول 5 أسطر في الملف',
                expectedOutput: 'head -n 5 file.txt',
                hint: 'head -n عدد الملف',
                xp: 15,
                completed: false
            },
            {
                id: 18,
                title: 'النهايات',
                command: 'tail',
                concept: 'قراءة آخر صفحة في الرواية',
                visual: 'ending',
                task: 'راقب آخر الأحداث في access.log',
                expectedOutput: 'tail -f access.log',
                hint: 'tail -f للمتابعة المستمرة',
                xp: 20,
                completed: false
            },
            {
                id: 19,
                title: 'القراءة المتأنية',
                command: 'less',
                concept: 'كتاب ضخم تحتاج لتقليب الصفحات',
                visual: 'book-scroll',
                task: 'تصفح ملف system.log الطويل',
                expectedOutput: 'less system.log',
                hint: 'less يسمح بالتنقل في الملف الكبير',
                xp: 15,
                completed: false
            },
            {
                id: 20,
                title: 'المحقق الرقمي',
                command: 'grep',
                concept: 'عدسة مكبرة تبحث عن كلمة وتلونها بالأصفر',
                visual: 'magnifier',
                task: 'ابحث عن كلمة "Error" في السجلات',
                expectedOutput: 'grep "Error" system.log',
                hint: 'grep "نص" ملف',
                xp: 25,
                completed: false
            }
        ]
    },
    
    // Unit 5: Device Management
    device_management: {
        id: 'device_management',
        title: 'الوحدة الخامسة: إدارة الأجهزة',
        subtitle: 'التحكم في الأجهزة والأقراص',
        color: '#10b981',
        icon: HardDrive,
        description: 'إدارة الأقراص والأجهزة المتصلة',
        lessons: [
            {
                id: 21,
                title: 'مساحة القرص',
                command: 'df',
                concept: 'فحص المستودع كم تبقى من المساحة',
                visual: 'warehouse',
                task: 'تحقق من المساحة المتبقية في القرص',
                expectedOutput: 'df -h',
                hint: 'df -h يعرض المساحة بشكل مقروء',
                xp: 15,
                completed: false
            },
            {
                id: 22,
                title: 'حجم المجلدات',
                command: 'du',
                concept: 'ميزان إلكتروني يوزن المجلدات',
                visual: 'scale',
                task: 'احسب حجم مجلد /var/log',
                expectedOutput: 'du -sh /var/log',
                hint: 'du -sh يعرض الحجم بشكل مختصر',
                xp: 20,
                completed: false
            },
            {
                id: 23,
                title: 'الأجهزة المتصلة',
                command: 'mount',
                concept: 'قائمة بكل الأجهزة الموصولة',
                visual: 'list',
                task: 'اعرض الأقراص المُعلقة',
                expectedOutput: 'mount',
                hint: 'mount يعرز الأجهزة المُركبة',
                xp: 15,
                completed: false
            },
            {
                id: 24,
                title: 'معلومات النظام',
                command: 'uname',
                concept: 'بطاقة تعريف للنظام',
                visual: 'id-card',
                task: 'اعرف إصدار النظام واسمه',
                expectedOutput: 'uname -a',
                hint: 'uname -a يعرض كل المعلومات',
                xp: 10,
                completed: false
            }
        ]
    },
    
    // Unit 6: Process Management
    process_management: {
        id: 'process_management',
        title: 'الوحدة السادسة: إدارة العمليات',
        subtitle: 'مراقبة والتحكم في البرامج',
        color: '#f59e0b',
        icon: Cpu,
        description: 'إدارة البرامج والعمليات الجارية',
        lessons: [
            {
                id: 25,
                title: 'العمليات الجارية',
                command: 'ps',
                concept: 'قائمة بالجنود النشطين على الساحة',
                visual: 'soldiers',
                task: 'اعرض العمليات الجارية',
                expectedOutput: 'ps aux',
                hint: 'ps aux يعرض كل العمليات',
                xp: 15,
                completed: false
            },
            {
                id: 26,
                title: 'المراقبة الحية',
                command: 'top',
                concept: 'لوحة تحكم مباشرة للموارد',
                visual: 'dashboard',
                task: 'راقب استهلاك CPU والذاكرة',
                expectedOutput: 'top',
                hint: 'top يعرض العمليات مرتبة حسب الاستهلاك',
                xp: 20,
                completed: false
            },
            {
                id: 27,
                title: 'إنهاء العملية',
                command: 'kill',
                concept: 'إطلاق الرصاصة القاتلة',
                visual: 'target',
                task: 'أوقف العملية ذات PID 1234',
                expectedOutput: 'kill 1234',
                hint: 'kill PID يوقف العملية',
                xp: 25,
                completed: false
            },
            {
                id: 28,
                title: 'البحث في العمليات',
                command: 'pgrep',
                concept: 'نظارة للبحث عن عملية بالاسم',
                visual: 'search',
                task: 'ابحث عن PID لعملية sshd',
                expectedOutput: 'pgrep sshd',
                hint: 'pgrep يبحث عن العمليات بالاسم',
                xp: 15,
                completed: false
            }
        ]
    },
    
    // Unit 7: Permissions and Scripts
    permissions_scripts: {
        id: 'permissions_scripts',
        title: 'الوحدة السابعة: الصلاحيات والسكربتات',
        subtitle: 'التحكم في الوصول وأتمتة المهام',
        color: '#ef4444',
        icon: Settings,
        description: 'إدارة الصلاحيات وكتابة السكربتات',
        lessons: [
            {
                id: 29,
                title: 'مفاتيح التحكم',
                command: 'chmod',
                concept: 'لوحة تحكم بأزرار (R,W,X)',
                visual: 'control-panel',
                task: 'امنح صلاحية التنفيذ لـ tool.sh',
                expectedOutput: 'chmod +x tool.sh',
                hint: 'chmod +x يضيف صلاحية تنفيذ',
                xp: 25,
                completed: false
            },
            {
                id: 30,
                title: 'الملكية المطلقة',
                command: 'chown',
                concept: 'نقل ملكية عقار من شخص لآخر',
                visual: 'ownership',
                task: 'اجعل root_file ملكاً لك',
                expectedOutput: 'chown student root_file',
                hint: 'chown user ملف',
                xp: 30,
                completed: false
            },
            {
                id: 31,
                title: 'صلاحيات المستخدمين',
                command: 'chmod',
                concept: 'توزيع مفاتيح مختلفة لكل مجموعة',
                visual: 'keys',
                task: 'امنح القراءة للجميع والكتابة لك فقط',
                expectedOutput: 'chmod 644 file.txt',
                hint: 'chmod 644 يعني rw-r--r--',
                xp: 30,
                completed: false
            },
            {
                id: 32,
                title: 'كتابة السكربت الأول',
                command: '#!',
                concept: 'وصفة طبخ تحول لطبق جاهز',
                visual: 'recipe',
                task: 'أنشئ سكربت hello.sh يطبع مرحباً',
                expectedOutput: '#!/bin/bash\necho "Hello World"',
                hint: 'ابدأ بـ #!/bin/bash',
                xp: 35,
                completed: false
            }
        ]
    }
};

export default function BashSimulatorPro({ onBack }) {
    const [currentUnit, setCurrentUnit] = useState('basics');
    const [currentLesson, setCurrentLesson] = useState(0);
    const [showTheory, setShowTheory] = useState(true);
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalHistory, setTerminalHistory] = useState([]);
    const [fileSystem, setFileSystem] = useState({
        currentPath: '/home/student',
        files: ['notes.txt', 'data/', 'tools/'],
        hiddenFiles: ['.secret_config'],
        selectedFile: null
    });
    const [completedLessons, setCompletedLessons] = useState([]);
    const [totalXP, setTotalXP] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [showUnits, setShowUnits] = useState(false);
    const terminalRef = useRef(null);

    const unit = CURRICULUM[currentUnit];
    const lesson = unit.lessons[currentLesson];
    const totalLessons = Object.values(CURRICULUM).reduce((acc, u) => acc + u.lessons.length, 0);

    const handleCommand = (command) => {
        const trimmedCommand = command.trim();
        const parts = trimmedCommand.split(' ');
        const baseCommand = parts[0];
        const args = parts.slice(1);

        let output = '';
        let success = false;

        switch (baseCommand) {
            case 'pwd':
                output = fileSystem.currentPath;
                if (lesson.command === 'pwd') success = true;
                break;

            case 'ls':
                if (args.includes('-a')) {
                    output = [...fileSystem.files, ...fileSystem.hiddenFiles].join('  ');
                    if (lesson.command === 'ls' && args.includes('-a')) success = true;
                } else {
                    output = fileSystem.files.join('  ');
                    if (lesson.command === 'ls' && !args.includes('-a')) success = true;
                }
                break;

            case 'cd':
                if (args[0] === '..') {
                    const parentPath = fileSystem.currentPath.split('/').slice(0, -1).join('/') || '/';
                    setFileSystem(prev => ({ ...prev, currentPath: parentPath }));
                    output = `Moved to ${parentPath}`;
                    if (lesson.command === 'cd' && args[0] === '..') success = true;
                } else if (args[0]) {
                    setFileSystem(prev => ({ 
                        ...prev, 
                        currentPath: `${prev.currentPath}/${args[0]}`.replace(/\/+/g, '/')
                    }));
                    output = `Moved to ${args[0]}`;
                    if (lesson.command === 'cd' && args[0] !== '..') success = true;
                }
                break;

            case 'clear':
                setTerminalHistory([]);
                output = 'Screen cleared';
                if (lesson.command === 'clear') success = true;
                break;

            case 'mkdir':
                if (args[0]) {
                    setFileSystem(prev => ({
                        ...prev,
                        files: [...prev.files, `${args[0]}/`]
                    }));
                    output = `Created directory: ${args[0]}`;
                    if (lesson.command === 'mkdir') success = true;
                }
                break;

            case 'touch':
                if (args[0]) {
                    setFileSystem(prev => ({
                        ...prev,
                        files: [...prev.files, args[0]]
                    }));
                    output = `Created file: ${args[0]}`;
                    if (lesson.command === 'touch') success = true;
                }
                break;

            case 'cp':
                if (args.length >= 2) {
                    output = `Copied ${args[0]} to ${args[1]}`;
                    if (lesson.command === 'cp') success = true;
                }
                break;

            case 'mv':
                if (args.length >= 2) {
                    output = `Moved/Renamed ${args[0]} to ${args[1]}`;
                    if (lesson.command === 'mv') success = true;
                }
                break;

            case 'rm':
                if (args[0]) {
                    setFileSystem(prev => ({
                        ...prev,
                        files: prev.files.filter(f => f !== args[0])
                    }));
                    output = `Removed: ${args[0]}`;
                    if (lesson.command === 'rm') success = true;
                }
                break;

            case 'cat':
                if (args[0]) {
                    output = `Contents of ${args[0]}:\nThis is a sample file content for demonstration purposes.`;
                    if (lesson.command === 'cat') success = true;
                }
                break;

            case 'echo':
                const echoText = args.join(' ').replace(/["']/g, '');
                output = echoText;
                if (lesson.command === 'echo') success = true;
                break;

            case 'man':
                if (args[0]) {
                    output = `MANUAL PAGE FOR ${args[0].toUpperCase()}\n\nNAME\n    ${args[0]} - command description\n\nSYNOPSIS\n    ${args[0]} [options] [arguments]\n\nDESCRIPTION\n    Detailed description of the command...`;
                    if (lesson.command === 'man') success = true;
                }
                break;

            case 'grep':
                if (args.length >= 2) {
                    const searchTerm = args[0].replace(/["']/g, '');
                    output = `Searching for "${searchTerm}"...\nLine 5: ...${searchTerm}...\nLine 12: ...${searchTerm}...\nLine 23: ...${searchTerm}...`;
                    if (lesson.command === 'grep') success = true;
                }
                break;

            case 'chmod':
                if (args.includes('+x') && args[1]) {
                    output = `Added execute permission to ${args[1]}`;
                    if (lesson.command === 'chmod') success = true;
                }
                break;

            case 'head':
                if (args[0]) {
                    const lines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 5 : 10;
                    output = `First ${lines} lines of ${args[0]}:\nLine 1: ...\nLine 2: ...\n...\nLine ${lines}: ...`;
                    if (lesson.command === 'head') success = true;
                }
                break;

            case 'tail':
                if (args[0]) {
                    const lines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 5 : 10;
                    output = `Last ${lines} lines of ${args[0]}:\n...\nLine X-2: ...\nLine X-1: ...\nLine X: ...`;
                    if (lesson.command === 'tail') success = true;
                }
                break;

            case 'less':
                if (args[0]) {
                    output = `Viewing ${args[0]} (use q to quit, space to scroll):\n[File content displayed in pager]`;
                    if (lesson.command === 'less') success = true;
                }
                break;

            case 'chown':
                if (args.length >= 2) {
                    output = `Changed ownership of ${args[1]} to ${args[0]}`;
                    if (lesson.command === 'chown') success = true;
                }
                break;

            case 'df':
                output = `Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   20G   28G  42% /\n/dev/sdb1       100G   45G   51G  47% /data`;
                if (lesson.command === 'df') success = true;
                break;

            case 'du':
                if (args[0]) {
                    output = `4.0K    ${args[0]}`;
                    if (lesson.command === 'du') success = true;
                }
                break;

            case 'mount':
                output = `/dev/sda1 on / type ext4 (rw,relatime)\n/dev/sdb1 on /data type ext4 (rw,relatime)`;
                if (lesson.command === 'mount') success = true;
                break;

            case 'uname':
                output = 'Linux server 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux';
                if (lesson.command === 'uname') success = true;
                break;

            case 'ps':
                output = `  PID TTY          TIME CMD\n    1 ?        00:00:01 systemd\n  234 ?        00:00:00 sshd\n  567 ?        00:00:02 apache2\n  890 pts/0    00:00:00 bash`;
                if (lesson.command === 'ps') success = true;
                break;

            case 'top':
                output = `top - 14:30:00 up 5 days, 2:15\nTasks: 150 total,   1 running, 149 sleeping\n%Cpu(s):  5.0 us,  2.0 sy,  0.0 ni, 92.0 id\nMiB Mem :   8192.0 total,   4096.0 free`;
                if (lesson.command === 'top') success = true;
                break;

            case 'kill':
                if (args[0]) {
                    output = `Process ${args[0]} terminated`;
                    if (lesson.command === 'kill') success = true;
                }
                break;

            case 'pgrep':
                if (args[0]) {
                    output = `234\n567\n890`;
                    if (lesson.command === 'pgrep') success = true;
                }
                break;

            case 'help':
                output = `Available commands:\n  pwd, ls, cd, clear, mkdir, touch, cp, mv, rm\n  cat, echo, man, grep, head, tail, less\n  chmod, chown, df, du, mount, uname\n  ps, top, kill, pgrep`;
                break;

            default:
                output = `Command not found: ${baseCommand}. Type 'help' for available commands.`;
        }

        // Add to history
        setTerminalHistory(prev => [...prev, 
            { type: 'input', content: `${fileSystem.currentPath}$ ${trimmedCommand}` },
            { type: 'output', content: output }
        ]);

        // Check if task completed
        if (success && !completedLessons.includes(lesson.id)) {
            setCompletedLessons(prev => [...prev, lesson.id]);
            setTotalXP(prev => prev + lesson.xp);
            
            // Auto advance after 2 seconds
            setTimeout(() => {
                if (currentLesson < unit.lessons.length - 1) {
                    setCurrentLesson(prev => prev + 1);
                    setShowTheory(true);
                }
            }, 2000);
        }

        setTerminalInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(terminalInput);
        }
    };

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalHistory]);

    const progress = (completedLessons.length / totalLessons) * 100;

    // Unit selection modal
    if (showUnits) {
        return (
            <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
                <MatrixBackground opacity={0.3} />
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <ArrowRight size={20} className="rotate-180" />
                                </button>
                            )}
                            <div className="p-3 bg-gradient-to-br from-[#240993] to-[#7112AF] rounded-lg">
                                <Layers size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">اختيار الوحدة</h1>
                                <p className="text-gray-400">اختر وحدة التعلم التي تريد بدءها</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                            <Star size={16} className="text-yellow-400" />
                            <span className="text-yellow-400 font-bold">{totalXP} XP</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(CURRICULUM).map(([key, unitData]) => {
                            const UnitIcon = unitData.icon;
                            const unitProgress = unitData.lessons.filter(l => completedLessons.includes(l.id)).length;
                            const isCompleted = unitProgress === unitData.lessons.length;
                            
                            return (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setCurrentUnit(key);
                                        setCurrentLesson(0);
                                        setShowUnits(false);
                                        setShowTheory(true);
                                    }}
                                    className={`p-6 rounded-xl border transition-all text-right ${
                                        isCompleted 
                                            ? 'bg-green-500/10 border-green-500/30' 
                                            : 'bg-white/5 border-white/10 hover:border-[#7112AF]/50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div 
                                            className="p-3 rounded-lg"
                                            style={{ backgroundColor: `${unitData.color}20` }}
                                        >
                                            <UnitIcon size={32} style={{ color: unitData.color }} />
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {unitProgress}/{unitData.lessons.length}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-white mb-2">{unitData.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{unitData.description}</p>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-white/10 rounded-full h-2">
                                            <div 
                                                className="h-2 rounded-full transition-all"
                                                style={{ 
                                                    width: `${(unitProgress / unitData.lessons.length) * 100}%`,
                                                    backgroundColor: unitData.color
                                                }}
                                            />
                                        </div>
                                        {isCompleted && (
                                            <CheckCircle size={16} className="text-green-400" />
                                        )}
                                    </div>
                                </motion.button>
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
            
            {/* Top Navigation */}
            <div className="relative z-10 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <ArrowRight size={20} className="rotate-180" />
                                </button>
                            )}
                            <div 
                                className="p-3 rounded-lg"
                                style={{ background: `linear-gradient(135deg, ${unit.color}20, ${unit.color}40)` }}
                            >
                                <Terminal size={24} style={{ color: unit.color }} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">محاكي Bash الاحترافي</h1>
                                <p className="text-sm text-gray-400">{unit.title}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Progress */}
                            <div className="flex items-center gap-3">
                                <div className="text-left">
                                    <div className="text-sm text-gray-400">التقدم الكلي</div>
                                    <div className="text-lg font-bold text-white">{completedLessons.length}/{totalLessons}</div>
                                </div>
                                <div className="w-32 bg-white/10 rounded-full h-2">
                                    <motion.div 
                                        className="h-2 rounded-full bg-gradient-to-r from-[#240993] to-[#7112AF]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* XP */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                                <Star size={16} className="text-yellow-400" />
                                <span className="text-yellow-400 font-bold">{totalXP} XP</span>
                            </div>

                            {/* Unit Selector */}
                            <button
                                onClick={() => setShowUnits(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <Layers size={18} />
                                <span>الوحدات</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-12 gap-6">
                        
                        {/* Left Panel - Lessons List */}
                        <div className="col-span-3">
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-white/10">
                                    <h3 className="font-bold text-white">دروس الوحدة</h3>
                                    <p className="text-sm text-gray-400">{unit.subtitle}</p>
                                </div>
                                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                                    {unit.lessons.map((l, index) => (
                                        <button
                                            key={l.id}
                                            onClick={() => {
                                                setCurrentLesson(index);
                                                setShowTheory(true);
                                            }}
                                            className={`w-full p-4 flex items-center gap-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                                                currentLesson === index ? 'bg-[#7112AF]/20 border-r-2 border-r-[#7112AF]' : ''
                                            } ${completedLessons.includes(l.id) ? 'opacity-60' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                completedLessons.includes(l.id)
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : currentLesson === index
                                                    ? 'bg-[#7112AF]/20 text-[#7112AF]'
                                                    : 'bg-white/10 text-gray-400'
                                            }`}>
                                                {completedLessons.includes(l.id) ? (
                                                    <CheckCircle size={16} />
                                                ) : (
                                                    <span className="text-sm font-bold">{l.id}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 text-right">
                                                <div className="text-sm font-medium text-white truncate">{l.title}</div>
                                                <div className="text-xs text-gray-500">{l.command}</div>
                                            </div>
                                            <div className="text-xs text-yellow-400">+{l.xp}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Center - Theory & Terminal */}
                        <div className="col-span-6">
                            <AnimatePresence mode="wait">
                                {showTheory ? (
                                    <motion.div
                                        key="theory"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-gradient-to-br from-[#240993]/30 to-[#7112AF]/10 border border-[#7112AF]/30 rounded-xl p-8 mb-6"
                                    >
                                        {/* Concept Card */}
                                        <div className="mb-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div 
                                                    className="p-3 rounded-lg"
                                                    style={{ backgroundColor: `${unit.color}20` }}
                                                >
                                                    <BookOpen size={24} style={{ color: unit.color }} />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-400">الدرس {lesson.id}</div>
                                                    <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                <h3 className="text-lg font-bold mb-3" style={{ color: unit.color }}>المفهوم النظري</h3>
                                                <p className="text-gray-300 leading-relaxed">{lesson.concept}</p>
                                            </div>
                                        </div>

                                        {/* Command Box */}
                                        <div className="bg-black/50 rounded-xl p-6 border border-white/10 mb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-green-400">الأمر</h3>
                                                <code className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-mono text-lg">
                                                    {lesson.command}
                                                </code>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-4">
                                                <h4 className="text-sm font-bold text-gray-400 mb-2">المهمة</h4>
                                                <p className="text-white">{lesson.task}</p>
                                            </div>
                                        </div>

                                        {/* Hint */}
                                        <div className="flex items-start gap-3 bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                                            <Lightbulb size={20} className="text-yellow-400 mt-1" />
                                            <div>
                                                <h4 className="text-sm font-bold text-yellow-400 mb-1">تلميح</h4>
                                                <p className="text-gray-300 text-sm">{lesson.hint}</p>
                                            </div>
                                        </div>

                                        {/* Start Button */}
                                        <button
                                            onClick={() => setShowTheory(false)}
                                            className="w-full mt-6 py-4 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.5)] transition-all flex items-center justify-center gap-2"
                                        >
                                            <PlayCircle size={24} />
                                            فهمت، ابدأ التنفيذ
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="terminal"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        {/* Task Bar */}
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Target size={20} className="text-[#7112AF]" />
                                                    <span className="text-white font-bold">المهمة {currentLesson + 1}/{unit.lessons.length}:</span>
                                                    <span className="text-gray-300">{lesson.task}</span>
                                                </div>
                                                <button
                                                    onClick={() => setShowTheory(true)}
                                                    className="px-3 py-1 bg-[#7112AF]/20 text-[#7112AF] rounded-lg text-sm hover:bg-[#7112AF]/30 transition-colors"
                                                >
                                                    عرض الشرح
                                                </button>
                                            </div>
                                        </div>

                                        {/* Terminal */}
                                        <div className="bg-black rounded-xl border border-white/20 overflow-hidden shadow-2xl">
                                            {/* Terminal Header */}
                                            <div className="bg-white/10 px-4 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                    </div>
                                                    <span className="text-gray-400 text-sm ml-4 font-mono">bash — 80×24</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setTerminalHistory([])}
                                                        className="p-1 hover:bg-white/10 rounded"
                                                    >
                                                        <RotateCcw size={14} className="text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Terminal Body */}
                                            <div 
                                                ref={terminalRef}
                                                className="p-4 h-80 overflow-y-auto font-mono text-sm" dir="ltr"
                                            >
                                                {terminalHistory.length === 0 && (
                                                    <div className="text-gray-500 mb-4">
                                                        Welcome to Bash Simulator v2.0<br />
                                                        Type 'help' for available commands.<br />
                                                        Current directory: {fileSystem.currentPath}
                                                    </div>
                                                )}
                                                
                                                {terminalHistory.map((entry, index) => (
                                                    <div key={index} className="mb-2">
                                                        {entry.type === 'input' ? (
                                                            <div className="text-green-400">{entry.content}</div>
                                                        ) : (
                                                            <div className="text-white whitespace-pre-wrap">{entry.content}</div>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Input Line */}
                                                <div className="flex items-center">
                                                    <span className="text-green-400 mr-2">{fileSystem.currentPath}$</span>
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

                                        {/* Quick Help */}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="text-gray-400 text-sm">أوامر سريعة:</span>
                                            {['pwd', 'ls', 'cd', 'mkdir', 'touch', 'cp', 'mv', 'rm', 'cat', 'echo'].map(cmd => (
                                                <button
                                                    key={cmd}
                                                    onClick={() => setTerminalInput(cmd + ' ')}
                                                    className="px-2 py-1 bg-white/5 text-gray-400 rounded text-xs hover:bg-white/10 transition-colors"
                                                >
                                                    {cmd}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Panel - File System & Stats */}
                        <div className="col-span-3 space-y-6">
                            {/* File System Visual */}
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Folder size={18} className="text-yellow-400" />
                                        نظام الملفات
                                    </h3>
                                    <span className="text-xs text-gray-400 font-mono">{fileSystem.currentPath}</span>
                                </div>
                                <div className="p-4 space-y-2">
                                    {fileSystem.files.map((file, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                                fileSystem.selectedFile === file ? 'bg-[#7112AF]/20' : 'hover:bg-white/5'
                                            }`}
                                            onClick={() => setFileSystem(prev => ({ ...prev, selectedFile: file }))}
                                        >
                                            {file.endsWith('/') ? (
                                                <Folder size={18} className="text-yellow-400" />
                                            ) : (
                                                <FileText size={18} className="text-blue-400" />
                                            )}
                                            <span className="text-sm text-gray-300">{file}</span>
                                        </motion.div>
                                    ))}
                                    {fileSystem.hiddenFiles.map((file, index) => (
                                        <motion.div
                                            key={`hidden-${index}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.5 }}
                                            className="flex items-center gap-3 p-2 rounded-lg"
                                        >
                                            <FileText size={18} className="text-gray-600" />
                                            <span className="text-sm text-gray-500">{file}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Lesson Stats */}
                            <div className="bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/10 border border-[#7112AF]/30 rounded-xl p-4">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <BarChart3 size={18} className="text-[#7112AF]" />
                                    إحصائيات الدرس
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-sm">الأمر</span>
                                        <code className="text-green-400 font-mono">{lesson.command}</code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-sm">النقاط</span>
                                        <span className="text-yellow-400 font-bold">+{lesson.xp} XP</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-sm">الحالة</span>
                                        <span className={`text-sm ${completedLessons.includes(lesson.id) ? 'text-green-400' : 'text-gray-400'}`}>
                                            {completedLessons.includes(lesson.id) ? 'مكتمل' : 'قيد التنفيذ'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Help Panel */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <HelpCircle size={18} className="text-blue-400" />
                                    مساعدة
                                </h3>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>• اكتب الأمر في الطرفية</p>
                                    <p>• اضغط Enter للتنفيذ</p>
                                    <p>• استخدم التلميح إذا علقت</p>
                                    <p>• أكمل المهمة للحصول على XP</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
