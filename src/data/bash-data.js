import {
    Terminal, FileText, Search, Cpu, Globe
} from 'lucide-react';

export const stages = [
    {
        id: 'basics',
        title: 'الأساسيات',
        description: 'تعلم الأوامر الأساسية للتنقل في نظام Linux',
        icon: Terminal,
        color: 'from-blue-600 to-cyan-500',
        theoryLesson: {
            title: 'مقدمة في سطر الأوامر',
            content: `سطر الأوامر (Command Line) هو الواجهة النصية للتعامل مع نظام التشغيل. 
في عالم الأمن السيبراني، إتقان سطر الأوامر أمر أساسي لأنه:
- يوفر تحكماً دقيقاً في النظام
- يسمح بأتمتة المهام
- يتيح الوصول إلى أدوات غير متوفرة في الواجهة الرسومية`,
            keyPoints: [
                'الشل (Shell) هو المترجم بينك وبين نظام التشغيل',
                'Bash هو الأكثر شيوعاً في أنظمة Linux',
                'كل أمر يتبع بنية: command [options] [arguments]'
            ]
        },
        missions: [
            {
                id: 'basics_1',
                title: 'أمر pwd - معرفة الموقع',
                description: 'اعرض المسار الكامل للمجلد الحالي',
                command: 'pwd',
                expectedOutput: '/home/student',
                hint: 'pwd = Print Working Directory - يطبع المسار الحالي',
                detailedExplanation: 'أمر pwd يعرض المسار المطلق (Absolute Path) للمجلد الذي أنت فيه حالياً.',
                realWorldExample: 'عندما تكتشف ثغرة، تحتاج لمعرفة في أي مجلد يمكنك كتابة الملفات',
                points: 10,
                helpText: 'pwd',
                commonMistakes: ['كتابة PWD بالأحرف الكبيرة']
            },
            {
                id: 'basics_2',
                title: 'أمر ls - عرض المحتويات',
                description: 'اعرض جميع الملفات والمجلدات في الموقع الحالي',
                command: 'ls',
                expectedOutput: 'documents downloads pictures videos',
                hint: 'ls = List - يعرض قائمة المحتويات',
                detailedExplanation: 'أمر ls يعرض محتويات المجلد. يمكنك إضافة خيارات مثل -l للعرض التفصيلي و -a لعرض الملفات المخفية.',
                realWorldExample: 'عند البحث عن ملفات حساسة، تستخدم ls -la للبحث عن ملفات الإعدادات',
                points: 15,
                helpText: 'ls [options]',
                commonMistakes: ['نسيان الخيارات المفيدة مثل -la']
            },
            {
                id: 'basics_3',
                title: 'أمر cd - التنقل',
                description: 'انتقل إلى مجلد documents',
                command: 'cd documents',
                expectedOutput: '',
                hint: 'cd = Change Directory - تغيير المجلد',
                detailedExplanation: 'أمر cd ينقلك بين المجلدات: cd folder للدخول، cd .. للخروج، cd ~ للعودة للرئيسي.',
                realWorldExample: 'في اختبار الاختراق، تتنقل بين /etc و /var/www للبحث عن معلومات',
                points: 15,
                helpText: 'cd [directory]',
                commonMistakes: ['نسيان حالة الأحرف (Linux حساس)']
            },
            {
                id: 'basics_4',
                title: 'أمر mkdir - إنشاء مجلد',
                description: 'أنشئ مجلد جديد باسم projects',
                command: 'mkdir projects',
                expectedOutput: '',
                hint: 'mkdir = Make Directory - إنشاء مجلد',
                detailedExplanation: 'أمر mkdir ينشئ مجلدات جديدة. استخدم mkdir -p لإنشاء المسار كاملاً.',
                realWorldExample: 'تنشئ مجلدات منظمة لكل عملية اختبار اختراق',
                points: 20,
                helpText: 'mkdir [foldername]',
                commonMistakes: ['إنشاء مجلد باسم موجود']
            },
            {
                id: 'basics_5',
                title: 'أمر clear - مسح الشاشة',
                description: 'امسح شاشة الترمنال',
                command: 'clear',
                expectedOutput: '',
                hint: 'clear = مسح الشاشة للتركيز',
                detailedExplanation: 'أمر clear يمسح الشاشة ويعيد المؤشر للأعلى. مفيد للتركيز عند كثرة المخرجات.',
                realWorldExample: 'بعد تنفيذ أمر طويل المخرجات، تستخدم clear لترتيب الشاشة',
                points: 10,
                helpText: 'clear',
                commonMistakes: ['كتابة cls (من Windows)']
            }
        ]
    },
    {
        id: 'files',
        title: 'إدارة الملفات',
        description: 'التعامل مع الملفات والمجلدات',
        icon: FileText,
        color: 'from-green-600 to-emerald-500',
        theoryLesson: {
            title: 'نظام الملفات في Linux',
            content: `في Linux، كل شيء هو ملف. فهم نظام الملفات ضروري:
- الصلاحيات: read (r), write (w), execute (x)
- الملفات المخفية تبدأ بنقطة (.)
- المسارات المطلقة تبدأ بـ /`,
            keyPoints: [
                'الملفات المخفية تبدأ بنقطة (.)',
                'الصلاحيات تتحكم في من يمكنه فعل ماذا',
                'المسارات المطلقة تبدأ بـ /'
            ]
        },
        missions: [
            {
                id: 'files_1',
                title: 'أمر touch - إنشاء ملف',
                description: 'أنشئ ملفاً فارغاً باسم notes.txt',
                command: 'touch notes.txt',
                expectedOutput: '',
                hint: 'touch ينشئ ملفاً فارغاً أو يحدث وقت الملف',
                detailedExplanation: 'touch ينشئ ملفاً فارغاً. إذا كان الملف موجوداً، يحدث وقت التعديل.',
                realWorldExample: 'تنشئ ملفات log لتسجيل نتائج الفحص',
                points: 15,
                helpText: 'touch [filename]',
                commonMistakes: ['الخلط بين touch و create']
            },
            {
                id: 'files_2',
                title: 'أمر echo - كتابة نص',
                description: 'اكتب "Hello World" في الملف',
                command: 'echo "Hello World" > notes.txt',
                expectedOutput: '',
                hint: 'echo يطبع نصاً، > يعيد التوجيه للملف',
                detailedExplanation: 'echo يطبع نصاً. مع > تعيد التوجيه للملف (كتابة)، مع >> تلحق (إضافة).',
                realWorldExample: 'تسجل نتائج الأوامر في ملف: echo "scan complete" >> results.txt',
                points: 20,
                helpText: 'echo "text" > file',
                commonMistakes: ['نسيان علامات الاقتباس', 'الخلط بين > و >>']
            },
            {
                id: 'files_3',
                title: 'أمر cat - عرض المحتوى',
                description: 'اعرض محتوى الملف notes.txt',
                command: 'cat notes.txt',
                expectedOutput: 'Hello World',
                hint: 'cat = concatenate - عرض محتوى الملف',
                detailedExplanation: 'cat يعرض محتوى الملف. يمكن دمج ملفات: cat file1 file2 > combined.',
                realWorldExample: 'تعرض ملفات الإعدادات: cat /etc/passwd',
                points: 15,
                helpText: 'cat [filename]',
                commonMistakes: ['cat لملفات ضخمة (استخدم less)']
            },
            {
                id: 'files_4',
                title: 'أمر cp - نسخ ملف',
                description: 'انسخ notes.txt إلى backup.txt',
                command: 'cp notes.txt backup.txt',
                expectedOutput: '',
                hint: 'cp = copy - نسخ ملف أو مجلد',
                detailedExplanation: 'cp ينسخ الملفات. استخدم cp -r للمجلدات و cp -p للحفاظ على الصلاحيات.',
                realWorldExample: 'تنسخ ملفات مهمة قبل التعديل: cp config.php config.php.bak',
                points: 20,
                helpText: 'cp [source] [destination]',
                commonMistakes: ['نسيان -r للمجلدات']
            },
            {
                id: 'files_5',
                title: 'أمر mv - نقل/إعادة تسمية',
                description: 'أعد تسمية الملف إلى important.txt',
                command: 'mv notes.txt important.txt',
                expectedOutput: '',
                hint: 'mv = move - نقل أو إعادة تسمية',
                detailedExplanation: 'mv ينقل أو يعيد تسمية الملفات. mv old new للتسمية، mv file folder/ للنقل.',
                realWorldExample: 'تنظم الملفات: mv scan_results.txt archive/',
                points: 20,
                helpText: 'mv [source] [destination]',
                commonMistakes: ['الكتابة فوق ملف موجود']
            },
            {
                id: 'files_6',
                title: 'أمر rm - حذف ملف',
                description: 'احذف الملف backup.txt',
                command: 'rm backup.txt',
                expectedOutput: '',
                hint: 'rm = remove - احذر! هذا الأمر خطير',
                detailedExplanation: 'rm يحذف الملفات نهائياً (لا يوجد سلة محذوفات!). rm -r للمجلدات.',
                realWorldExample: 'تحذف ملفات مؤقتة: rm -rf /tmp/old_files/',
                points: 25,
                helpText: 'rm [filename]',
                commonMistakes: ['rm -rf / (لا تفعلها أبداً!)']
            }
        ]
    },
    {
        id: 'exploration',
        title: 'الاستكشاف',
        description: 'أوامر البحث والاستكشاف المتقدمة',
        icon: Search,
        color: 'from-purple-600 to-violet-500',
        theoryLesson: {
            title: 'البحث والاستكشاف',
            content: `في اختبار الاختراق، البحث عن الملفات والمعلومات أمر أساسي:
- find: البحث عن ملفات في الوقت الفعلي
- grep: البحث في المحتوى باستخدام أنماط`,
            keyPoints: [
                'find يبحث في الوقت الفعلي (أبطأ لكن دقيق)',
                'grep يستخدم Regular Expressions',
                'يمكن دمج find مع grep للبحث في المحتوى'
            ]
        },
        missions: [
            {
                id: 'explore_1',
                title: 'أمر find - البحث عن ملفات',
                description: 'ابحث عن جميع ملفات .txt',
                command: 'find . -name "*.txt"',
                expectedOutput: './important.txt\n./documents/file.txt',
                hint: 'find [path] -name "pattern"',
                detailedExplanation: 'find يبحث عن ملفات. find . -name "*.txt" للملفات النصية، -size +100M للملفات الكبيرة.',
                realWorldExample: 'تبحث عن ملفات الإعدادات: find /etc -name "*.conf"',
                points: 25,
                helpText: 'find [path] -name "pattern"',
                commonMistakes: ['نسيان علامات الاقتباس']
            },
            {
                id: 'explore_2',
                title: 'أمر grep - البحث في المحتوى',
                description: 'ابحث عن كلمة "password" في الملفات',
                command: 'grep "password" important.txt',
                expectedOutput: 'password=secret123',
                hint: 'grep "pattern" [file]',
                detailedExplanation: 'grep يبحث في محتوى الملفات. -i لعدم حساسية الحالة، -r للبحث المتكرر، -n لأرقام الأسطر.',
                realWorldExample: 'تبحث عن كلمات سر: grep -r "password" /var/www/',
                points: 25,
                helpText: 'grep [options] "pattern" [file]',
                commonMistakes: ['البحث بدون -r في مجلدات']
            },
            {
                id: 'explore_3',
                title: 'أمر head - عرض البداية',
                description: 'اعرض أول 5 أسطر من الملف',
                command: 'head -n 5 important.txt',
                expectedOutput: 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5',
                hint: 'head -n [number] [file]',
                detailedExplanation: 'head يعرض بداية الملف. مفيد لملفات السجلات الكبيرة.',
                realWorldExample: 'تعرض أحدث الإدخالات: head -n 20 /var/log/auth.log',
                points: 20,
                helpText: 'head -n [number] [file]',
                commonMistakes: ['نسيان -n']
            },
            {
                id: 'explore_4',
                title: 'أمر tail - عرض النهاية',
                description: 'اعرض آخر 10 أسطر من الملف',
                command: 'tail -n 10 important.txt',
                expectedOutput: 'Line 91\nLine 92\n...',
                hint: 'tail -f لمتابعة الملف في الوقت الفعلي',
                detailedExplanation: 'tail يعرض نهاية الملف. tail -f يتابع التحديثات (مهم جداً!).',
                realWorldExample: 'تراقب سجلات الدخول: tail -f /var/log/auth.log',
                points: 25,
                helpText: 'tail [options] [file]',
                commonMistakes: ['عدم معرفة -f']
            },
            {
                id: 'explore_5',
                title: 'أمر wc - عد الكلمات',
                description: 'اعرض إحصائيات الملف',
                command: 'wc important.txt',
                expectedOutput: '10  50 300 important.txt',
                hint: 'wc = word count - عدد الأسطر والكلمات والأحرف',
                detailedExplanation: 'wc يحسب إحصائيات: أسطر، كلمات، أحرف. wc -l للأسطر فقط.',
                realWorldExample: 'تعدد أسطر الكود: wc -l exploit.py',
                points: 20,
                helpText: 'wc [options] [file]',
                commonMistakes: []
            }
        ]
    },
    {
        id: 'processes',
        title: 'إدارة العمليات',
        description: 'مراقبة وإدارة العمليات',
        icon: Cpu,
        color: 'from-orange-600 to-amber-500',
        theoryLesson: {
            title: 'العمليات في Linux',
            content: `كل برنامج يعمل في Linux هو عملية (Process):
- PID: معرف العملية
- PPID: معرف العملية الأب
- CPU/Memory: استهلاك الموارد`,
            keyPoints: [
                'ps تعرض لقطة من العمليات',
                'top تعرض في الوقت الفعلي',
                'kill ترسل إشارة للعملية'
            ]
        },
        missions: [
            {
                id: 'proc_1',
                title: 'أمر ps - عرض العمليات',
                description: 'اعرض العمليات الجارية',
                command: 'ps',
                expectedOutput: 'PID TTY          TIME CMD',
                hint: 'ps = process status',
                detailedExplanation: 'ps يعرض العمليات الحالية للمستخدم.',
                realWorldExample: 'تتحقق من البرامج العاملة',
                points: 20,
                helpText: 'ps',
                commonMistakes: ['ps فقط يعرض العمليات الحالية']
            },
            {
                id: 'proc_2',
                title: 'أمر ps aux - عرض شامل',
                description: 'اعرض جميع العمليات بتفاصيل كاملة',
                command: 'ps aux',
                expectedOutput: 'USER PID %CPU %MEM COMMAND',
                hint: 'aux = all users + user-oriented + without TTY',
                detailedExplanation: 'ps aux يعرض جميع العمليات لجميع المستخدمين مع استهلاك الموارد.',
                realWorldExample: 'تبحث عن عمليات مشبوهة: ps aux | grep suspicious',
                points: 25,
                helpText: 'ps aux',
                commonMistakes: []
            },
            {
                id: 'proc_3',
                title: 'أمر top - مراقبة تفاعلية',
                description: 'راقب العمليات في الوقت الفعلي',
                command: 'top',
                expectedOutput: 'PID USER PR NI VIRT RES SHR',
                hint: 'اضغط q للخروج من top',
                detailedExplanation: 'top يعرض العمليات واستهلاك الموارد في الوقت الفعلي.',
                realWorldExample: 'تراقب استهلاك CPU: top',
                points: 25,
                helpText: 'top',
                commonMistakes: ['عدم معرفة كيفية الخروج (اضغط q)']
            },
            {
                id: 'proc_4',
                title: 'أمر kill - إنهاء عملية',
                description: 'أنهِ العملية ذات المعرف 1234',
                command: 'kill 1234',
                expectedOutput: '',
                hint: 'kill [PID] - يرسل إشارة SIGTERM',
                detailedExplanation: 'kill يرسل إشارة للعملية: SIGTERM للإنهاء اللطيف، SIGKILL للإجبار.',
                realWorldExample: 'توقف برنامجاً علق: kill -9 1234',
                points: 30,
                helpText: 'kill [PID]',
                commonMistakes: ['kill -9 دون محاولة عادية']
            },
            {
                id: 'proc_5',
                title: 'أمر df - مساحة القرص',
                description: 'اعرض مساحة القرص المتوفرة',
                command: 'df -h',
                expectedOutput: 'Filesystem Size Used Avail',
                hint: '-h = human readable',
                detailedExplanation: 'df يعرض مساحة القرص. -h يجعلها مقروءة (GB, MB).',
                realWorldExample: 'تتحقق من المساحة: df -h',
                points: 20,
                helpText: 'df -h',
                commonMistakes: ['df بدون -h (صعب القراءة)']
            }
        ]
    },
    {
        id: 'network',
        title: 'الشبكات',
        description: 'أوامر الشبكات والاتصال',
        icon: Globe,
        color: 'from-cyan-600 to-blue-500',
        theoryLesson: {
            title: 'الشبكات في Linux',
            content: `Linux يوفر أدوات قوية للشبكات:
- ifconfig/ip: إعدادات الواجهات
- ping: اختبار الاتصال
- netstat/ss: عرض الاتصالات`,
            keyPoints: [
                'كل واجهة لها IP وMAC address',
                'المنافذ (Ports) تصل بين التطبيقات',
                'netstat يعرض الاتصالات النشطة'
            ]
        },
        missions: [
            {
                id: 'net_1',
                title: 'أمر ifconfig - إعدادات الشبكة',
                description: 'اعرض إعدادات واجهات الشبكة',
                command: 'ifconfig',
                expectedOutput: 'eth0: flags=4163<UP> inet 192.168.1.100',
                hint: 'ifconfig = interface configuration',
                detailedExplanation: 'ifconfig يعرض ويعدل إعدادات واجهات الشبكة.',
                realWorldExample: 'تتحقق من IP: ifconfig | grep inet',
                points: 25,
                helpText: 'ifconfig',
                commonMistakes: ['ifconfig يحتاج صلاحيات root للتعديل']
            },
            {
                id: 'net_2',
                title: 'أمر ping - اختبار الاتصال',
                description: 'اختبر الاتصال بـ google.com',
                command: 'ping google.com',
                expectedOutput: '64 bytes from ... time=15.3 ms',
                hint: 'Ctrl+C للتوقف',
                detailedExplanation: 'ping يرسل حزم ICMP لاختبار الاتصال ووقت الاستجابة.',
                realWorldExample: 'تختبر اتصالك: ping 8.8.8.8',
                points: 20,
                helpText: 'ping [host]',
                commonMistakes: ['نسيان Ctrl+C للتوقف']
            },
            {
                id: 'net_3',
                title: 'أمر netstat - إحصائيات الشبكة',
                description: 'اعرض الاتصالات والمنافذ المفتوحة',
                command: 'netstat -tuln',
                expectedOutput: 'Proto Recv-Q Send-Q Local Address',
                hint: '-tuln = TCP + UDP + listening + numeric',
                detailedExplanation: 'netstat يعرض إحصائيات الشبكة. -t للTCP، -u للUDP، -l للlistening، -n للأرقام.',
                realWorldExample: 'تبحث عن منافذ مفتوحة: netstat -tuln | grep :80',
                points: 30,
                helpText: 'netstat [options]',
                commonMistakes: ['نسيان الخيارات المناسبة']
            },
            {
                id: 'net_4',
                title: 'أمر curl - جلب المحتوى',
                description: 'احصل على محتوى موقع',
                command: 'curl https://example.com',
                expectedOutput: '<!DOCTYPE html>...',
                hint: 'curl [URL] - جلب محتوى URL',
                detailedExplanation: 'curl ينقل البيانات من/إلى URLs. -I للheaders، -o لحفظ للملف.',
                realWorldExample: 'تختبر API: curl https://api.example.com/data',
                points: 30,
                helpText: 'curl [options] [URL]',
                commonMistakes: ['عدم فهم HTTP methods']
            },
            {
                id: 'net_5',
                title: 'أمر wget - تحميل الملفات',
                description: 'حمّل ملفاً من الإنترنت',
                command: 'wget https://example.com/file.txt',
                expectedOutput: 'Saving to: file.txt',
                hint: 'wget [URL] - تحميل ملف',
                detailedExplanation: 'wget يحمّل الملفات. -r للتحميل المتكرر، -c لاستكمال التحميل.',
                realWorldExample: 'تحمل أداة: wget https://tools.example.com/tool.sh',
                points: 30,
                helpText: 'wget [options] [URL]',
                commonMistakes: ['التحميل بدون التحقق من المصدر']
            }
        ]
    }
];

export const initialFileSystem = {
    '/home/student': ['documents', 'downloads', 'pictures', 'videos'],
    '/home/student/documents': ['notes.txt', 'important.txt'],
    '/home/student/downloads': [],
    '/home/student/pictures': [],
    '/home/student/videos': [],
};
