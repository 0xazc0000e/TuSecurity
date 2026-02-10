/**
 * 🎓 البنية الشاملة الجديدة لمحاكي Bash
 * 8 وحدات تعليمية - ~120 مهمة
 * 
 * كل وحدة تحتوي على:
 * - شرح نظري غني
 * - مهام عملية متدرجة
 * - مخططات توضيحية
 * - أمثلة واقعية
 * - تقييمات
 */

export const BASH_MODULES = [
    // ========================================
    // الوحدة 1: الاستكشاف والتوجيه
    // ========================================
    {
        id: 'module-1',
        title: '📍 الوحدة 1: الاستكشاف والتوجيه',
        subtitle: 'Navigation & Orientation',
        description: 'تعلم كيف تتجول في النظام وتحدد موقعك',
        difficulty: 'beginner',
        estimatedTime: '20 دقيقة',
        xp: 300,

        story: {
            intro: `
🎯 **السيناريو:**  
أنت موظف جديد في قسم IT في بنك كبير. اليوم الأول، مديرك يعطيك حساباً على سيرفر الشركة.  
مهمتك الأولى: تعرّف على النظام وتأكد أن كل شيء يعمل قبل أن تستلم المسؤولية الكاملة.

💼 **المدير يقول:**  
"قبل أن أعطيك صلاحيات أعلى، أريد أن تثبت أنك تعرف كيف تتحرك في النظام بدون أن تضيع."
      `,
            context: 'ستبدأ من الأساسيات - معرفة من أنت وأين أنت وماذا حولك.'
        },

        theory: {
            overview: `
## فلسفة سطر الأوامر

عندما تستخدم الماوس لفتح مجلد، أنت في الحقيقة ترسل أمراً للنظام.  
سطر الأوامر يجعلك تتحدث مع النظام **مباشرة** بدون وسيط.

### لماذا CLI أفضل من GUI؟

| الميزة | GUI (الماوس) | CLI (سطر الأوامر) |
|--------|---------------|-------------------|
| السرعة | بطيء (نقرات متعددة) | سريع جداً (أمر واحد) |
| الأتمتة | صعب | سهل (scripts) |
| الدقة | محدود | دقيق 100% |
| التحكم | أساسي | متقدم جداً |

### مخطط العملية

\`\`\`mermaid
graph LR
    A[أنت تكتب أمر] -->|Terminal| B[Shell يترجمه]
    B -->|System| C[النظام ينفذه]
    C -->|Output| D[النتيجة تظهر لك]
    
    style A fill:#7112AF
    style D fill:#10b981
\`\`\`
      `,

            keyCommands: [
                {
                    command: 'whoami',
                    fullName: 'Who Am I',
                    purpose: 'يعرض اسم المستخدم الحالي',
                    analogy: '🎭 مثل بطاقة الهوية - تخبرك من أنت في النظام',
                    realWorld: 'في الهجمات السيبرانية، أول شيء يفعله المخترق هو التحقق من صلاحياته',
                    syntax: 'whoami',
                    examples: [
                        { cmd: 'whoami', output: 'user', explanation: 'أنت مسجل كـ "user" - صلاحيات عادية' },
                        { cmd: 'whoami', output: 'root', explanation: 'أنت root - صلاحيات كاملة (خطير!)' }
                    ],
                    proTips: [
                        '💡 إذا كنت root، احذر جداً! كل شيء مسموح',
                        '🔒 في البيئات الحقيقية، لا تستخدم root إلا للضرورة القصوى'
                    ]
                },
                {
                    command: 'pwd',
                    fullName: 'Print Working Directory',
                    purpose: 'يعرض المسار الكامل للمجلد الحالي',
                    analogy: '🗺️ مثل GPS - يخبرك أنت في أي موقع في خريطة الملفات',
                    realWorld: 'عند العمل على سيرفر بعيد، pwd أساسي لتعرف أين أنت',
                    syntax: 'pwd',
                    examples: [
                        { cmd: 'pwd', output: '/home/user', explanation: 'أنت في المجلد الشخصي' },
                        { cmd: 'pwd', output: '/var/www/html', explanation: 'أنت في مجلد موقع ويب' },
                        { cmd: 'pwd', output: '/', explanation: 'أنت في الجذر - قمة الهرم' }
                    ],
                    proTips: [
                        '📍 دائماً اكتب pwd قبل أي أمر خطير',
                        '🎯 في Scripts، pwd يساعدك تحفظ المسار الحالي'
                    ],
                    diagram: `
## هيكل المجلدات في Linux

\`\`\`
/                        (الجذر - Root)
├── home/                (مجلدات المستخدمين)
│   ├── user/            (مجلدك الشخصي) ← pwd هنا
│   └── admin/
├── etc/                 (إعدادات النظام)
├── var/                 (ملفات متغيرة)
│   └── www/html         (مواقع الويب)
└── bin/                 (البرامج الأساسية)
\`\`\`
          `
                },
                {
                    command: 'ls',
                    fullName: 'List',
                    purpose: 'يعرض محتويات المجلد',
                    analogy: '👀 مثل تشغيل الضوء في غرفة مظلمة',
                    realWorld: 'في الاختراق، ls يكشف الملفات الحساسة المخبأة',
                    syntax: 'ls [options] [path]',
                    examples: [
                        { cmd: 'ls', output: 'documents  images  notes.txt', explanation: 'عرض بسيط' },
                        { cmd: 'ls -l', output: 'drwxr-xr-x 2 user user 4096 Jan 1 12:00 documents', explanation: 'عرض مفصل مع الصلاحيات' },
                        { cmd: 'ls -a', output: '.bashrc  .ssh  documents  images', explanation: 'يظهر الملفات المخفية (تبدأ بـ .)' },
                        { cmd: 'ls -lh', output: 'drwxr-xr-x 2 user user 4.0K', explanation: 'أحجام مفهومة (K, M, G)' }
                    ],
                    optionsTable: `
| الخيار | المعنى | متى تستخدمه |
|--------|---------|--------------|
| \`-l\` | long format | لرؤية الصلاحيات والأحجام |
| \`-a\` | all (مع المخفي) | للبحث عن ملفات الإعدادات |
| \`-h\` | human readable | لفهم الأحجام بسهولة |
| \`-R\` | recursive | لعرض كل المجلدات الفرعية |
| \`-t\` | sort by time | لمعرفة آخر تعديل |
          `,
                    proTips: [
                        '🔍 الملفات المخفية (.bashrc, .ssh) مهمة جداً',
                        '⚡ استخدم \`ls -lhtra\` لعرض شامل مرتب بالوقت',
                        '🎯 في التحقيق الجنائي، \`ls -la /tmp\` يكشف النشاطات المشبوهة'
                    ]
                },
                {
                    command: 'cd',
                    fullName: 'Change Directory',
                    purpose: 'ينقلك بين المجلدات',
                    analogy: '🚪 مثل الانتقال بين الغرف في بيت',
                    realWorld: 'للوصول لملفات التطبيق أو قواعد البيانات',
                    syntax: 'cd [path]',
                    examples: [
                        { cmd: 'cd documents', output: '', explanation: 'دخول لمجلد documents' },
                        { cmd: 'cd ..', output: '', explanation: 'رجوع للمجلد السابق' },
                        { cmd: 'cd ~', output: '', explanation: 'رجوع للمجلد الشخصي' },
                        { cmd: 'cd /', output: '', explanation: 'الذهاب للجذر' },
                        { cmd: 'cd -', output: '', explanation: 'الرجوع للمكان السابق (مثل back)' }
                    ],
                    shortcuts: `
## اختصارات cd المهمة

| الاختصار | المعنى | مثال |
|----------|---------|------|
| \`~\` | المجلد الشخصي | \`cd ~/documents\` |
| \`.\` | المجلد الحالي | \`cd ./subfolder\` |
| \`..\` | المجلد الأب | \`cd ../../\` (رجوع مرتين) |
| \`-\` | المجلد السابق | \`cd -\` |
| \`/\` | الجذر | \`cd /etc\` |
          `,
                    proTips: [
                        '🎯 \`cd\` لوحده يرجعك للـ home',
                        '⚡ استخدم Tab للإكمال التلقائي',
                        '📚 \`pushd\` و \`popd\` لحفظ المواقع'
                    ]
                }
            ]
        },

        stages: [
            // المرحلة 1.1
            {
                id: 'stage-1-1',
                title: 'التعريف بالهوية',
                phaseTitle: 'المرحلة 1.1: معرفة من أنت',
                story: [
                    { speaker: '💼 المدير', text: 'قبل كل شيء، أخبرني: ما اسم المستخدم الذي أعطيتك إياه؟' },
                    { speaker: '🤔 أنت', text: 'همم... كيف أعرف؟' },
                    { speaker: '💡 المدير', text: 'استخدم الأمر الذي يسأل النظام: \"من أنا؟\"' }
                ],
                tasks: [
                    {
                        id: 'task-1-1-1',
                        command: 'whoami',
                        title: 'اكتشف هويتك',
                        description: 'استخدم أمر whoami لمعرفة اسم المستخدم الخاص بك',
                        storyContext: 'النظام يعرفك بهوية محددة. هذه الهوية تحدد صلاحياتك.',
                        details: 'الأمر `whoami` يعرض اسم المستخدم الحالي. بدون معرفة هويتك، لا تعرف ماذا تستطيع أن تفعل.',
                        hint: 'اكتب فقط: whoami',
                        expectedOutput: 'user',
                        difficulty: 'easy',
                        xp: 10,
                        check: (vfs, path, lastCmd) => lastCmd === 'whoami',
                        successMessage: '✅ صحيح! أنت مسجل كـ "user"',
                        learnMore: `
**لماذا هذا مهم؟**  
- المستخدم "user" له صلاحيات محدودة  
- المستخدم "root" له صلاحيات كاملة (خطير!)  
- في الاختراق، معرفة الهوية أول خطوة

**في الواقع:**  
عندما يخترق هاكر سيرفر، أول أمر ينفذه هو whoami ليعرف مستوى صلاحياته.
            `
          },
            {
                id: 'task-1-1-2',
                command: 'id',
                title: 'معلومات الهوية الكاملة',
                description: 'استخدم `id` لمعرفة معلومات أكثر عن حسابك',
                storyContext: 'المدير يريد التأكد من المجموعات (groups) التي أنت فيعضو فيها',
                details: '`id` يعرض UID (رقم المستخدم) و GID (رقم المجموعة) وكل المجموعات',
                hint: 'اكتب: id',
                expectedOutput: 'uid=1000(user)',
                difficulty: 'easy',
                xp: 10,
                check: (vfs, path, lastCmd) => lastCmd === 'id',
                successMessage: '✅ رائع! عرفت معلوماتك الكاملة',
                learnMore: `
**فك شفرة المخرجات:**
\`uid=1000(user)\` - رقمك 1000، اسمك user  
\`gid=1000(user)\` - مجموعتك الأساسية  
\`groups=1000(user),4(adm)\` - المجموعات الإضافية

**مثال واقعي:**  
المجموعة sudo تعطيك صلاحيات المدير. إذا رأيت sudo في groups، فأنت قوي!
            `
          }
]
      },

// المرحلة 1.2
{
    id: 'stage-1-2',
        title: 'تحديد الموقع',
            phaseTitle: 'المرحلة 1.2: أين أنت الآن؟',
                story: [
                    { speaker: '💼 المدير', text: 'جيد! الآن أخبرني: في أي مجلد أنت واقف؟' },
                    { speaker: '🤔 أنت', text: 'كيف أعرف؟ لا أرى شيئاً!' },
                    { speaker: '💡 المدير', text: 'استخدم GPS النظام - أمر pwd' }
                ],
                    tasks: [
                        {
                            id: 'task-1-2-1',
                            command: 'pwd',
                            title: 'اعرض موقعك',
                            description: 'استخدم pwd لمعرفة المسار الكامل للمجلد الحالي',
                            storyContext: 'أنت في متاهة من المجلدات. pwd هو خريطتك.',
                            details: 'pwd (Print Working Directory) يطبع المسار الكامل من الجذر إلى موقعك',
                            hint: 'اكتب: pwd',
                            expectedOutput: '/home/user',
                            difficulty: 'easy',
                            xp: 10,
                            check: (vfs, path, lastCmd) => lastCmd === 'pwd',
                            successMessage: '✅ أنت في /home/user - مجلدك الشخصي',
                            learnMore: `
**فهم المسار:**  
\`/home/user\` يعني:  
- البداية من الجذر \`/\`  
- دخول مجلد \`home\`  
- دخول مجلد \`user\`

**قاعدة ذهبية:**  
دائماً اكتب \`pwd\` قبل أي أمر خطير (مثل \`rm -rf\`)!
            `
                        },
                        {
                            id: 'task-1-2-2',
                            command: 'hostname',
                            title: 'اسم الجهاز',
                            description: 'اعرف اسم السيرفر الذي تعمل عليه',
                            storyContext: 'في الشركات، كل سيرفر له اسم. أريدك أن تتأكد أنك على السيرفر الصحيح.',
                            details: 'hostname يعرض اسم الجهاز على الشبكة',
                            hint: 'اكتب: hostname',
                            expectedOutput: 'tucc-server',
                            difficulty: 'easy',
                            xp: 10,
                            check: (vfs, path, lastCmd) => lastCmd === 'hostname',
                            successMessage: '✅ أنت على tucc-server',
                            learnMore: `
**لماذا hostname مهم؟**  
- في بيئات الشركات، قد تدير 100+ سيرفر  
- \`hostname\` يتأكد أنك لم تكتب الأمر الخطأ في السيرفر الخطأ!  

**نصيحة احترافية:**  
كثير من الأنظمة تعرض hostname في prompt:  
\`user@tucc-server:~$\`
            `
                        }
                    ]
},

// المرحلة 1.3
{
    id: 'stage-1-3',
        title: 'استكشاف المحيط',
            phaseTitle: 'المرحلة 1.3: ماذا يوجد حولك؟',
                story: [
                    { speaker: '💼 المدير', text: 'ممتاز! الآن شغّل \"الضوء\" واعرض الملفات الموجودة' },
                    { speaker: '💡 زميلك', text: 'استخدم ls - هو مثل زر F5 في الويندوز' }
                ],
                    tasks: [
                        {
                            id: 'task-1-3-1',
                            command: 'ls',
                            title: 'عرض بسيط',
                            description: 'اعرض محتويات المجلد الحالي بشكل بسيط',
                            storyContext: 'تريد أن ترى ما في المجلد بدون تفاصيل كثيرة',
                            details: 'ls بدون خيارات يعرض قائمة بسيطة بالأسماء فقط',
                            hint: 'اكتب: ls',
                            expectedOutput: 'documents  images  notes.txt',
                            difficulty: 'easy',
                            xp: 10,
                            check: (vfs, path, lastCmd) => lastCmd.startsWith('ls') && !lastCmd.includes('-'),
                            successMessage: '✅ وجدت: documents, images, notes.txt'
                        },
                        {
                            id: 'task-1-3-2',
                            command: 'ls -l',
                            title: 'عرض مفصّل',
                            description: 'اعرض المحتويات مع التفاصيل (الصلاحيات، الأحجام، التاريخ)',
                            storyContext: 'المدير يريد معلومات أكثر - متى تم إنشاء الملفات وما حجمها',
                            details: '`-l` يعني long format - يعرض 7 أعمدة من المعلومات',
                            hint: 'اكتب: ls -l',
                            expectedOutput: 'drwxr-xr-x',
                            difficulty: 'easy',
                            xp: 15,
                            check: (vfs, path, lastCmd) => lastCmd.includes('ls') && lastCmd.includes('-l'),
                            successMessage: '✅ عرض مفصّل يظهر كل التفاصيل',
                            learnMore: `
**فك شفرة السطر:**  
\`drwxr-xr-x 2 user user 4096 Jan 1 12:00 documents\`

- \`d\` = directory (مجلد)  
- \`rwx\` = المالك يقرأ+يكتب+ينفذ  
- \`r-x\` = المجموعة تقرأ+تنفذ فقط  
- \`r-x\` = الآخرون يقرأون+ينفذون  
- \`2\` = عدد الروابط  
- \`user user\` = المالك والمجموعة  
- \`4096\` = الحجم بالبايت  
- \`Jan 1 12:00\` = تاريخ التعديل  
- \`documents\` = الاسم
            `
                        },
                        {
                            id: 'task-1-3-3',
                            command: 'ls -a',
                            title: 'كشف المخفي',
                            description: 'اعرض حتى الملفات المخفية (التي تبدأ بـ .)',
                            storyContext: 'في Linux، الملفات المهمة مخفية. المالك يريد أن يتأكد أنك تراها.',
                            details: 'الملفات المخفية تبدأ بنقطة مثل .bashrc - غالباً ملفات إعدادات',
                            hint: 'اكتب: ls -a',
                            expectedOutput: '.bashrc',
                            difficulty: 'medium',
                            xp: 20,
                            check: (vfs, path, lastCmd) => lastCmd.includes('ls') && lastCmd.includes('-a'),
                            successMessage: '✅ كشفت الملفات المخفية!',
                            learnMore: `
**ملفات مخفية مهمة:**  
- \`.bashrc\` - إعدادات الـ shell  
- \`.ssh\` - مفاتيح SSH الحساسة  
- \`.env\` - متغيرات البيئة (قد تحتوي أسرار!)  

**في الاختراق:**  
المخترقون يخفون أدواتهم في ملفات تبدأ بـ \`.\` لأن \`ls\` العادي لا يظهرها!
            `
                        },
                        {
                            id: 'task-1-3-4',
                            command: 'ls -lh',
                            title: 'أحجام مفهومة',
                            description: 'عرض مفصّل مع أحجام بصيغة KB, MB بدلاً من bytes',
                            storyContext: 'المدير يريد معرفة كم تشغل الملفات من المساحة بشكل واضح',
                            details: '`-h` تعني human-readable - تحول 1024 إلى 1K',
                            hint: 'اكتب: ls -lh',
                            expectedOutput: '4.0K',
                            difficulty: 'medium',
                            xp: 20,
                            check: (vfs, path, lastCmd) => lastCmd.includes('ls') && lastCmd.includes('-l') && lastCmd.includes('-h'),
                            successMessage: '✅ الأحجام أصبحت واضحة!',
                            learnMore: `
**قراءة الأحجام:**  
- \`4.0K\` = 4 كيلوبايت  
- \`2.5M\` = 2.5 ميجابايت  
- \`1.2G\` = 1.2 جيجابايت  

**نصيحة احترافية:**  
استخدم \`ls -lhS\` للترتيب حسب الحجم - يظهر الأكبر أولاً!
            `
                        }
                    ]
},

// المرحلة 1.4
{
    id: 'stage-1-4',
        title: 'التجوال في النظام',
            phaseTitle: 'المرحلة 1.4: التنقل بين المجلدات',
                story: [
                    { speaker: '💼 المدير', text: 'الآن تعال معي. سندخل لمجلد documents' },
                    { speaker: '🚪 أنت', text: 'كيف أنتقل؟' },
                    { speaker: '💡 المدير', text: 'cd هو مفتاحك لكل الأبواب' }
                ],
                    tasks: [
                        {
                            id: 'task-1-4-1',
                            command: 'cd documents',
                            title: 'دخول لمجلد',
                            description: 'ادخل إلى مجلد documents',
                            storyContext: 'المدير يريدك أن تفحص ملفات المشروع داخل documents',
                            details: 'cd مع اسم المجلد ينقلك إليه',
                            hint: 'اكتب: cd documents',
                            expectedOutput: 'Changed directory',
                            difficulty: 'easy',
                            xp: 15,
                            check: (vfs, path) => path === '/home/user/documents',
                            successMessage: '✅ دخلت لمجلد documents'
                        },
                        {
                            id: 'task-1-4-2',
                            command: 'pwd',
                            title: 'تأكد من موقعك',
                            description: 'تأكد أنك الآن في /home/user/documents',
                            storyContext: 'تريد التأكد أنك في المكان الصحيح',
                            details: 'pwd يتحقق من موقعك الحالي',
                            hint: 'اكتب: pwd',
                            expectedOutput: '/home/user/documents',
                            difficulty: 'easy',
                            xp: 10,
                            check: (vfs, path, lastCmd) => lastCmd === 'pwd' && path === '/home/user/documents',
                            successMessage: '✅ أنت في المكان الصحيح'
                        },
                        {
                            id: 'task-1-4-3',
                            command: 'cd ..',
                            title: 'الرجوع للخلف',
                            description: 'ارجع للمجلد السابق (الأب)',
                            storyContext: 'انتهيت من الفحص، ارجع للمجلد الرئيسي',
                            details: '.. تعني المجلد الأب - خطوة واحدة للخلف',
                            hint: 'اكتب: cd ..',
                            expectedOutput: 'Returned',
                            difficulty: 'easy',
                            xp: 15,
                            check: (vfs, path) => path === '/home/user',
                            successMessage: '✅ رجعت لـ /home/user',
                            learnMore: `
**مسارات نسبية:**  
- \`.\` = المجلد الحالي  
- \`..\` = المجلد الأب  
- \`../..\` = رجوع مرتين  
- \`../documents\` = أخي (مجلد بمستوى)

**مثال عملي:**  
من \`/home/user/documents/project\`  
\`cd ../../images\` ← يوصلك لـ \`/home/user/images\`
            `
                        },
                        {
                            id: 'task-1-4-4',
                            command: 'cd ~',
                            title: 'الرجوع للبيت',
                            description: 'استخدم ~ للرجوع للمجلد الشخصي من أي مكان',
                            storyContext: 'ضعت في النظام؟ ~ يرجعك لنقطة البداية دائماً',
                            details: '~ اختصار لـ /home/user',
                            hint: 'اكتب: cd ~',
                            expectedOutput: 'Home',
                            difficulty: 'easy',
                            xp: 15,
                            check: (vfs, path, lastCmd) => lastCmd.includes('~') && path === '/home/user',
                            successMessage: '✅ رجعت للبيت (home)'
                        },
                        {
                            id: 'task-1-4-5',
                            command: 'cd /',
                            title: 'الذهاب للجذر',
                            description: 'اذهب لأعلى نقطة في النظام - الجذر /',
                            storyContext: 'المدير يريدك أن ترى الهيكل الكامل للنظام',
                            details: '/ هو الجذر - كل شيء يبدأ منه',
                            hint: 'اكتب: cd /',
                            expectedOutput: 'Root',
                            difficulty: 'medium',
                            xp: 20,
                            check: (vfs, path) => path === '/',
                            successMessage: '✅ أنت الآن في قمة الهرم',
                            learnMore: `
**مجلدات مهمة في /:٪**  
- \`/home\` - مجلدات المستخدمين  
- \`/etc\` - ملفات الإعدادات  
- \`/var\` - ملفات متغيرة (logs, cache)  
- \`/bin\` - الأوامر الأساسية  
- \`/usr\` - برامج المستخدمين  
- \`/tmp\` - ملفات مؤقتة

**تحذير:**  
لا تعبث بملفات \`/\` إذا لم تكن تعرف ما تفعل!
            `
                        }
                    ]
}
    ],

// اختبار نهاية الوحدة
finalAssessment: {
    title: '📝 اختبار الوحدة 1',
        passingScore: 70,
            questions: [
                {
                    type: 'multiple-choice',
                    question: 'ما الأمر الذي يعرض اسم المستخدم الحالي؟',
                    options: ['whoami', 'pwd', 'ls', 'cd'],
                    correct: 0,
                    explanation: 'whoami يعرض اسم المستخدم، pwd يعرض المسار'
                },
                {
                    type: 'multiple-choice',
                    question: 'كيف تعرض الملفات المخفية؟',
                    options: ['ls', 'ls -l', 'ls -a', 'ls -h'],
                    correct: 2,
                    explanation: 'الخيار -a يعرض all files بما فيها المخفية'
                },
                {
                    type: 'fill-blank',
                    question: 'للرجوع للمجلد السابق، استخدم: cd ____',
                    answer: '..',
                    explanation: '.. تعني المجلد الأب'
                },
                {
                    type: 'scenario',
                    scenario: 'أنت في /home/user/documents/work وتريد الذهاب لـ /home/user/images',
                    question: 'ما الأمر الأسرع؟',
                    options: ['cd images', 'cd ../images', 'cd ../../images', 'cd ~/images'],
                    correct: 3,
                    explanation: '~/images يعمل من أي مكان'
                }
            ],
                practicalTask: {
        description: 'تحدي عملي: ابدأ من ~ ، اذهب لـ documents، اعرض محتوياته بالتفصيل، ثم ارجع',
            requiredCommands: ['cd ~', 'cd documents', 'ls -l', 'cd ..'],
                timeLimit: 60
    }
}
  },

// ========================================
// الوحدة 2: إدارة الملفات والمجلدات
// ========================================
{
    id: 'module-2',
        title: '📁 الوحدة 2: إدارة الملفات والمجلدات',
            subtitle: 'File & Directory Management',
                description: 'تعلم إنشاء، نسخ، نقل، وحذف الملفات',
                    difficulty: 'beginner',
                        estimatedTime: '25 دقيقة',
                            xp: 400,

                                story: {
        intro: `
🎯 **السيناريو:**  
المدير أعجب بك! الآن يعطيك مشروعاً حقيقياً.  
يجب أن تُجهز بيئة عمل كاملة لمشروع جديد اسمه "SecureVault".

💼 **المدير يقول:**  
"أريدك أن تنشئ المجلدات اللازمة، تنظم الملفات، وتعمل نسخ احتياطية. كل شيء من السطر!"
      `,
            context: 'ستتعلم قوة الإنشاء والتدمير - كن حذراً!'
    },

    theory: {
        overview: `
## فلسفة إدارة الملفات

في الـ CLI، أنت تتحكم بالملفات بدقة 100%.  
لا توجد "سلة محذوفات" - الحذف نهائي!

### القاعدة الذهبية

> 💎 **"With great power comes great responsibility"**  
> قبل أي أمر حذف، تأكد 3 مرات!

### العمليات الأساسية

\`\`\`mermaid
graph TD
    A[إنشاء] -->|mkdir, touch| B[الملف موجود]
    B -->|cp| C[نسخ]
    B -->|mv| D[نقل/إعادة تسمية]
    B -->|rm| E[حذف نهائي]
    
    style A fill:#10b981
    style E fill:#ef4444
\`\`\`
      `,

            keyCommands: [
                {
                    command: 'mkdir',
                    fullName: 'Make Directory',
                    purpose: 'إنشاء مجلد جديد',
                    analogy: '🏗️ مثل بناء غرفة جديدة في بيت',
                    realWorld: 'لتنظيم مشاريعك أو فصل البيانات',
                    syntax: 'mkdir [options] directory_name',
                    examples: [
                        { cmd: 'mkdir project', output: 'Directory created', explanation: 'إنشاء مجلد project' },
                        { cmd: 'mkdir -p work/tasks/urgent', output: '', explanation: '-p تُنشئ المجلدات الوسيطة' },
                        { cmd: 'mkdir dir1 dir2 dir3', output: '', explanation: 'إنشاء عدة مجلدات دفعة واحدة' }
                    ],
                    proTips: [
                        '⚡ استخدم -p لإنشاء مسار كامل دفعة واحدة',
                        '📝 تجنب المسافات في الأسماء - استخدم _ أو -',
                        '🎯 أسماء وصفية واضحة أفضل'
                    ]
                },
                {
                    command: 'touch',
                    fullName: 'Touch (Create/Update)',
                    purpose: 'إنشاء ملف فارغ أو تحديث تاريخ التعديل',
                    analogy: '📄 مثل إنشاء ورقة فارغة',
                    realWorld: 'لإنشاء ملفات نصية أو placeholders',
                    syntax: 'touch filename',
                    examples: [
                        { cmd: 'touch notes.txt', output: 'File created', explanation: 'إنشاء ملف فارغ' },
                        { cmd: 'touch file1.txt file2.txt', output: '', explanation: 'إنشاء عدة ملفات' },
                        { cmd: 'touch existing_file.txt', output: '', explanation: 'تحديث timestamp فقط' }
                    ],
                    proTips: [
                        '💡 إذا الملف موجود، touch يحدث التاريخ فقط',
                        '🔧 مفيد لإنشاء ملفات lock أو flags',
                        '⏰ في الأتمتة، touch يُستخدم لتتبع آخر تشغيل'
                    ]
                },
                {
                    command: 'cp',
                    fullName: 'Copy',
                    purpose: 'نسخ ملفات أو مجلدات',
                    analogy: '📋 مثل نسخ ولصق في GUI',
                    realWorld: 'عمل backup أو مشاركة ملفات',
                    syntax: 'cp [options] source destination',
                    examples: [
                        { cmd: 'cp file.txt backup.txt', output: 'Copied', explanation: 'نسخ ملف' },
                        { cmd: 'cp -r folder1 folder2', output: '', explanation: '-r لنسخ مجلد كامل' },
                        { cmd: 'cp -i file.txt exist.txt', output: 'Overwrite?', explanation: '-i يطلب تأكيد قبل الاستبدال' }
                    ],
                    proTips: [
                        '🔁 استخدم -r لنسخ المجلدات (recursive)',
                        '⚠️ -i يحميك من الاستبدال غير المقصود',
                        '⚡ cp -u ينسخ فقط الملفات الأحدث'
                    ]
                },
                {
                    command: 'mv',
                    fullName: 'Move',
                    purpose: 'نقل أو إعادة تسمية',
                    analogy: '🚚 مثل قص ولصق، أو F2 للتسمية',
                    realWorld: 'تنظيم الملفات أو إخفاءها',
                    syntax: 'mv [options] source destination',
                    examples: [
                        { cmd: 'mv old.txt new.txt', output: 'خ', explanation: 'إعادة تسمية' },
                        { cmd: 'mv file.txt /backup/', output: '', explanation: 'نقل لمجلد آخر' },
                        { cmd: 'mv *.txt documents/', output: '', explanation: 'نقل كل ملفات txt' }
                    ],
                    proTips: [
                        '💡 mv لا يحتاج -r للمجلدات',
                        '🎭 mv قديم جديد = إعادة تسمية',
                        '🚀 mv أسرع من cp+rm'
                    ]
                },
                {
                    command: 'rm',
                    fullName: 'Remove',
                    purpose: 'حذف نهائي',
                    analogy: '🔥 مثل Delete بدون سلة محذوفات',
                    realWorld: 'تنظيف الملفات غير المرغوبة',
                    syntax: 'rm [options] file',
                    examples: [
                        { cmd: 'rm file.txt', output: 'Removed', explanation: 'حذف ملف' },
                        { cmd: 'rm -r folder/', output: '', explanation: '-r لحذف مجلد وكل محتوياته' },
                        { cmd: 'rm -i *.log', output: 'Remove each?', explanation: '-i يطلب تأكيد' }
                    ],
                    danger: true,
                    warnings: [
                        '⚠️ لا توجد سلة محذوفات - الحذف نهائي!',
                        '🚫 لا تستخدم rm -rf / أبداً!',
                        '💀 تحقق من pwd قبل أي rm!'
                    ],
                    proTips: [
                        '🛡️ استخدم -i دائماً عند الشك',
                        '📦 للمجلدات: -r (recursive)',
                        '🔒 -f تجبر الحذف - خطير جداً!'
                    ]
                }
            ]
    },

    stages: [
        // المرحلة 2.1
        {
            id: 'stage-2-1',
            title: 'إنشاء المجلدات',
            phaseTitle: 'المرحلة 2.1: بناء الهيكل',
            story: [
                { speaker: '💼 المدير', text: 'المشروع الجديد "SecureVault" يحتاج 3 مجلدات: src, config, logs' },
                { speaker: '🏗️ أنت', text: 'سأبنيها واحداً واحداً' },
                { speaker: '💡 المدير', text: 'ابدأ بمجلد أساسي اسمه secure_vault' }
            ],
            tasks: [
                {
                    id: 'task-2-1-1',
                    command: 'mkdir secure_vault',
                    title: 'إنشاء المجلد الرئيسي',
                    description: 'أنشئ مجلداً اسمه secure_vault',
                    storyContext: 'كل مشروع يبدأ بمجلده الخاص',
                    details: 'mkdir تُنشئ مجلداً فارغاً جاهزاً لاستقبال الملفات',
                    hint: 'mkdir secure_vault',
                    expectedOutput: 'Directory created',
                    difficulty: 'easy',
                    xp: 15,
                    check: (vfs) => vfs['/home/user/secure_vault']?.type === 'dir',
                    successMessage: '✅ مجلد secure_vault جاهز!'
                },
                {
                    id: 'task-2-1-2',
                    command: 'ls',
                    title: 'تأكد من الإنشاء',
                    description: 'تحقق أن المجلد ظهر في القائمة',
                    storyContext: 'تريد التأكد أن العملية نجحت',
                    details: 'ls يعرض المجلد الجديد',
                    hint: 'ls',
                    expectedOutput: 'secure_vault',
                    difficulty: 'easy',
                    xp: 10,
                    check: (vfs, path, lastCmd) => lastCmd === 'ls',
                    successMessage: '✅ ظهر في القائمة!'
                },
                {
                    id: 'task-2-1-3',
                    command: 'cd secure_vault',
                    title: 'الدخول للمجلد',
                    description: 'ادخل لمجلد secure_vault لتجهيز الداخل',
                    storyContext: 'حان وقت البناء الداخلي',
                    details: 'cd ينقلك للداخل',
                    hint: 'cd secure_vault',
                    expectedOutput: '',
                    difficulty: 'easy',
                    xp: 10,
                    check: (vfs, path) => path === '/home/user/secure_vault',
                    successMessage: '✅ أنت الآن داخل المشروع'
                }
            ]
        }// ... المراحل المتبقية للوحدة 2 - سأضيفها في الملف التالي
    ]
}

  // الوحدات 3-8 ستأتي في ملف منفصل لتجنب حجم الملف الكبير
];
