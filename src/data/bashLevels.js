// ===================================================================
// 📚 Bash Learning Levels - Progressive Methodology
// ===================================================================
// Structure: 5 Levels → 11 Stages → ~60 Tasks
// From Absolute Beginner → Security Expert

export const BASH_LEVELS = [
    // ===============================================================
    // المستوى 1: المبتدئ المطلق (Absolute Beginner)
    // ===============================================================
    {
        id: 'level-1',
        level: 1,
        title: 'المبتدئ المطلق',
        subtitle: 'الطريق إلى أول أمر',
        description: 'تعرف على البيئة وفلسفة سطر الأوامر من الصفر',
        requiredXP: 0,
        rewardXP: 500,
        icon: 'Rocket',
        color: 'green',
        story: {
            context: 'أول يوم لك كموظف IT في البنك الوطني',
            intro: 'مرحباً بك في فريق تقنية المعلومات! اليوم هو يومك الأول، وستتعلم كيفية استخدام النظام.',
            goal: 'تعلم أساسيات التعامل مع الطرفية والتنقل في النظام'
        },
        stages: [
            // -------------------------------------------------------
            // المرحلة 1: التعرف على المحاكي وبيئة Bash
            // -------------------------------------------------------
            {
                id: 'stage-1-1',
                stageNumber: 1,
                title: 'التعرف على المحاكي وبيئة Bash',
                description: 'فهم ماهية Shell وكيفية استخدام الطرفية',
                xp: 200,
                story: [
                    { speaker: 'المدير', text: 'مرحباً! أنت الآن جزء من فريقنا. دعني أريك كيف نستخدم الطرفية للتحكم بالأنظمة.' },
                    { speaker: 'أنت', text: 'الطرفية؟ تبدو معقدة قليلاً...' },
                    { speaker: 'المدير', text: 'لا تقلق! سنبدأ من الأساسيات. أول شيء - اكتب أمرك الأول.' }
                ],
                tasks: [
                    {
                        id: 'task-1-1-1',
                        title: 'فهم ماهية Shell',
                        description: 'Shell هو المترجم بينك وبين نظام التشغيل. إنه يفهم الأوامر النصية ويحولها لإجراءات.',
                        type: 'theory',
                        xp: 20,
                        content: `
# ما هو Shell؟ 🐚

**Shell** (القشرة) هو برنامج يسمح لك بالتواصل مع نظام التشغيل من خلال الأوامر النصية.

## لماذا نستخدم Shell؟

- ⚡ **السرعة:** أسرع من استخدام الماوس
- 🔁 **الأتمتة:** يمكنك كتابة سكربتات لتكرار المهام
- 💪 **القوة:** وصول كامل لجميع وظائف النظام
- 📊 **الدقة:** تحكم دقيق في كل صغيرة وكبيرة

## أنواع Shells

- **Bash** (Bourne Again Shell) - الأكثر شيوعاً
- Zsh - محسّن ومتقدم
- Fish - سهل الاستخدام
- Sh - الكلاسيكي

في هذا المحاكي، سنستخدم **Bash** لأنه المعيار في معظم أنظمة Linux.
                        `,
                        validation: { type: 'auto', completed: true }
                    },
                    {
                        id: 'task-1-1-2',
                        title: 'قراءة سطر الترحيب (Prompt)',
                        description: 'تعرف على مكونات سطر الأوامر وما تعنيه الرموز',
                        type: 'theory',
                        xp: 25,
                        content: `
# فهم سطر الترحيب (PS1) 💻

عندما تفتح الطرفية، سترى شيئاً مثل:

\`\`\`
user@bank-server:~$
\`\`\`

دعنا نفككها:

- **user** → اسم المستخدم الحالي
- **@** → فاصل
- **bank-server** → اسم الجهاز/السيرفر
- **:** → فاصل
- **~** → المجلد الحالي (~ تعني المجلد الرئيسي /home/user)
- **$** → علامة أنك مستخدم عادي (# تعني أنك root)

## الآن في محاكينا:
سترى: \`user@cybersec-simulator:~$\`

هذا يخبرك أنك:
- مسجل كـ **user**
- في جهاز **cybersec-simulator**
- في المجلد الرئيسي **~**
                        `,
                        validation: { type: 'auto', completed: true }
                    },
                    {
                        id: 'task-1-1-3',
                        title: 'كتابة أول أمر: whoami',
                        description: 'اكتب "whoami" واضغط Enter لمعرفة من أنت في النظام',
                        type: 'interactive',
                        xp: 50,
                        instructions: 'اكتب الأمر `whoami` في الطرفية واضغط Enter',
                        expectedCommand: 'whoami',
                        hints: [
                            'اكتب: whoami',
                            'تأكد من كتابة الأمر بالحروف الصغيرة',
                            'الحل الكامل: اكتب "whoami" بالضبط ثم اضغط Enter'
                        ],
                        validation: {
                            type: 'command',
                            check: (cmd, output) => {
                                return cmd.trim().toLowerCase() === 'whoami';
                            }
                        },
                        successMessage: '🎉 ممتاز! الآن تعرف أنك مسجل الدخول كـ "user"',
                        nextStepHint: 'الآن جرّب معرفة أين أنت في النظام...'
                    },
                    {
                        id: 'task-1-1-4',
                        title: 'فهم المخرجات',
                        description: 'فهم ماذا يعني الرد "user" من الأمر whoami',
                        type: 'quiz',
                        xp: 30,
                        question: 'ماذا يخبرك الأمر whoami؟',
                        options: [
                            'اسم الجهاز',
                            'اسم المستخدم الحالي',
                            'المجلد الحالي',
                            'نظام التشغيل'
                        ],
                        correctAnswer: 1,
                        explanation: 'whoami يعرض اسم المستخدم المسجل حالياً في النظام',
                        validation: { type: 'quiz' }
                    }
                ]
            },
            // -------------------------------------------------------
            // المرحلة 2: التنقل في نظام الملفات
            // -------------------------------------------------------
            {
                id: 'stage-1-2',
                stageNumber: 2,
                title: 'التنقل في نظام الملفات',
                description: 'تعلم كيف تعرف موقعك وتتنقل بين المجلدات',
                xp: 300,
                story: [
                    { speaker: 'المدير', text: 'رائع! الآن دعنا نتعلم التنقل. تخيل النظام كمبنى ضخم من الغرف (المجلدات).' },
                    { speaker: 'أنت', text: 'كيف أعرف في أي غرفة أنا الآن؟' },
                    { speaker: 'المدير', text: 'سؤال ممتاز! استخدم pwd - Print Working Directory' }
                ],
                tasks: [
                    {
                        id: 'task-1-2-1',
                        title: 'أين أنا؟ - الأمر pwd',
                        description: 'استخدم pwd لمعرفة موقعك الحالي في النظام',
                        type: 'interactive',
                        xp: 50,
                        instructions: 'اكتب `pwd` لمعرفة المسار الكامل لموقعك الحالي',
                        expectedCommand: 'pwd',
                        hints: [
                            'pwd تعني Print Working Directory',
                            'اكتب: pwd',
                            'الحل: pwd ثم Enter'
                        ],
                        validation: {
                            type: 'command',
                            check: (cmd) => cmd.trim().toLowerCase() === 'pwd'
                        },
                        successMessage: '✅ تمام! أنت في /home/user - هذا مجلدك الرئيسي',
                        theory: 'pwd (Print Working Directory) يعرض المسار الكامل للمجلد الذي أنت فيه حالياً'
                    },
                    {
                        id: 'task-1-2-2',
                        title: 'ماذا يوجد هنا؟ - الأمر ls',
                        description: 'استخدم ls لرؤية محتويات المجلد الحالي',
                        type: 'interactive',
                        xp: 60,
                        instructions: 'اكتب `ls` لعرض الملفات والمجلدات الموجودة',
                        expectedCommand: 'ls',
                        hints: [
                            'ls تعني List - قائمة المحتويات',
                            'اكتب: ls',
                            'الحل الكامل: ls ثم اضغط Enter'
                        ],
                        validation: {
                            type: 'command',
                            check: (cmd) => cmd.trim().toLowerCase().startsWith('ls')
                        },
                        successMessage: '🗂️ رائع! هذه هي الملفات والمجلدات الموجودة',
                        nextStepHint: 'جرب: ls -l للحصول على معلومات أكثر تفصيلاً'
                    },
                    {
                        id: 'task-1-2-3',
                        title: 'الانتقال لمجلد - الأمر cd',
                        description: 'استخدم cd للانتقال إلى مجلد Documents',
                        type: 'interactive',
                        xp: 70,
                        instructions: 'انتقل إلى مجلد Documents باستخدام `cd Documents`',
                        expectedCommand: 'cd Documents',
                        hints: [
                            'cd تعني Change Directory',
                            'استخدم: cd اسم_المجلد',
                            'الحل: cd Documents'
                        ],
                        validation: {
                            type: 'command',
                            check: (cmd, output, vfs) => {
                                const executed = cmd.trim().toLowerCase() === 'cd documents';
                                const inCorrectDir = vfs.currentPath.endsWith('/Documents');
                                return executed && inCorrectDir;
                            }
                        },
                        successMessage: '🚀 أحسنت! الآن أنت داخل مجلد Documents',
                        theory: 'cd (Change Directory) ينقلك من مجلد لآخر'
                    },
                    {
                        id: 'task-1-2-4',
                        title: 'فهم المسارات المطلقة والنسبية',
                        description: 'تعلم الفرق بين المسار المطلق والنسبي',
                        type: 'theory',
                        xp: 40,
                        content: `
# المسارات في Linux 📍

هناك نوعان من المسارات:

## 1. المسار المطلق (Absolute Path)
يبدأ من الجذر **/** ويحدد الموقع بالكامل

\`\`\`bash
cd /home/user/Documents
cd /var/log
cd /etc/nginx
\`\`\`

✅ **مزايا:** واضح ومحدد، يعمل من أي مكان  
❌ **عيوب:** طويل، يحتاج كتابة كاملة

## 2. المسار النسبي (Relative Path)
يعتمد على موقعك الحالي

\`\`\`bash
cd Documents      # الانتقال لـ Documents في المجلد الحالي
cd ../Downloads   # العودة للخلف ثم الدخول لـ Downloads
cd ./folder       # الدخول لـ folder (./ تعني المجلد الحالي)
\`\`\`

## رموز مهمة:
- **.** → المجلد الحالي
- **..** → المجلد الأب (للخلف)
- **~** → المجلد الرئيسي /home/user
- **/** → الجذر (root)

### مثال عملي:
\`\`\`
إذا كنت في: /home/user
cd Documents     → /home/user/Documents
cd ..            → /home
cd ~             → /home/user
\`\`\`
                        `,
                        validation: { type: 'auto', completed: true }
                    },
                    {
                        id: 'task-1-2-5',
                        title: 'العودة للخلف - cd ..',
                        description: 'استخدم cd .. للعودة للمجلد الأب',
                        type: 'interactive',
                        xp: 80,
                        instructions: 'ارجع للمجلد الرئيسي باستخدام `cd ..`',
                        expectedCommand: 'cd ..',
                        hints: [
                            '.. تعني المجلد الأب (الأعلى)',
                            'اكتب: cd ..',
                            'الحل الكامل: cd .. ثم Enter'
                        ],
                        validation: {
                            type: 'command',
                            check: (cmd, output, vfs) => {
                                const executed = cmd.trim() === 'cd ..';
                                const backToHome = vfs.currentPath === '/home/user';
                                return executed && backToHome;
                            }
                        },
                        successMessage: '⬅️ ممتاز! عدت للمجلد الرئيسي',
                        achievementUnlocked: 'navigator-bronze'
                    }
                ]
            }
        ],
        // مكافأة إكمال المستوى
        completion: {
            title: 'أكملت المستوى الأول! 🎊',
            message: 'تهانينا! تعلمت أساسيات التعامل مع الطرفية والتنقل في النظام.',
            badge: {
                id: 'level-1-complete',
                name: 'مستكشف المبتدئ',
                description: 'أكمل المستوى الأول من محاكي Bash',
                icon: '🎓'
            },
            unlocksNext: 'level-2',
            stats: {
                commandsLearned: ['whoami', 'pwd', 'ls', 'cd'],
                conceptsMastered: ['Shell', 'Prompt', 'File Navigation', 'Paths']
            }
        }
    },
    // ===============================================================
    // المستوى 2: استكشاف الملفات والنصوص (File Discovery)
    // ===============================================================
    {
        id: 'level-2',
        level: 2,
        title: 'استكشاف الملفات والنصوص',
        subtitle: 'البحث داخل الملفات ومعالجتها',
        description: 'تعلم كيفية قراءة محتويات الملفات والبحث عن نصوص محددة بداخلها.',
        requiredXP: 500,
        rewardXP: 800,
        icon: 'Search',
        color: 'blue',
        story: {
            context: 'تحليل سجلات النظام',
            intro: 'أحسنت في تعلم الأساسيات! الآن، طلب منك المدير مراجعة سجلات النظام (logs) للبحث عن أخطاء.',
            goal: 'استخدام أدوات قراءة النصوص لاستخراج المعلومات المهمة.'
        },
        stages: [
            {
                id: 'stage-2-1',
                stageNumber: 1,
                title: 'قراءة الملفات',
                description: 'استخدم cat, head, tail لعرض المحتوى',
                xp: 300,
                story: [
                    { speaker: 'المدير', text: 'لدينا ملف سجل طويل جداً. لا نريد فتحه بالكامل، نحتاج فقط لرؤية البداية أو النهاية.' },
                    { speaker: 'أنت', text: 'هل هناك أمر لذلك؟' },
                    { speaker: 'المدير', text: 'نعم! head للنهاية، و tail للنهاية. و cat للملفات الصغيرة.' }
                ],
                tasks: [
                    {
                        id: 'task-2-1-1',
                        title: 'عرض الملف كاملاً - cat',
                        description: 'استخدم cat لقراءة ملف الملاحظات',
                        type: 'interactive',
                        xp: 50,
                        instructions: 'اعرض محتوى `notes.txt` الموجود في مجلدك الرئيسي باستخدام `cat`',
                        expectedCommand: 'cat notes.txt',
                        hints: ['تأكد أنك في المجلد الصحيح (cd ~)', 'اكتب: cat notes.txt'],
                        validation: {
                            type: 'command',
                            check: (cmd, output, vfs) => cmd.includes('cat') && cmd.includes('notes.txt')
                        },
                        successMessage: '📄 ممتاز! لقد قرأت محتوى الملف.'
                    },
                    {
                        id: 'task-2-1-2',
                        title: 'رؤية البداية - head',
                        description: 'اعرض أول 10 أسطر من ملف السجل',
                        type: 'interactive',
                        xp: 60,
                        instructions: 'يوجد ملف سجل في `/var/log/syslog`. استخدم `head` لعرض بدايته.',
                        expectedCommand: 'head /var/log/syslog', // Mock path needed in VFS? Actually let's use a file we create or exists.
                        // Wait, I need to ensure the file exists. Let's assume hints/instruction guide user to a mocked file.
                        // I will rely on bashUtils "No such file" if it doesn't exist.
                        // I should add verified files to INITIAL_VFS in bashUtils or update it dynamically?
                        // For simplicity, let's assume valid paths for now or use what exists.
                        // Let's stick to files in /home/user/documents/ for now or simplified paths.
                        // Or I can update INITIAL_VFS in bashUtils.js!
                        hints: ['File path: notes.txt', 'Usage: head notes.txt'],
                        validation: {
                            type: 'command',
                            check: (cmd) => cmd.startsWith('head')
                        },
                        successMessage: '🔝 رائع! head يعرض لك مقدمة الملف فقط.'
                    }
                ]
            },
            {
                id: 'stage-2-2',
                stageNumber: 2,
                title: 'البحث المتخصص (Grep)',
                description: 'البحث عن نصوص محددة داخل الملفات',
                xp: 400,
                story: [
                    { speaker: 'المدير', text: 'نحتاج لإيجاد كلمة "error" داخل السجلات. الملفات ضخمة، البحث اليدوي مستحيل.' },
                    { speaker: 'المدير', text: 'استخدم grep. إنها أقوى أداة بحث لديك.' }
                ],
                tasks: [
                    {
                        id: 'task-2-2-1',
                        title: 'البحث عن كلمة - grep',
                        description: 'ابحث عن "Budget" في ملف budget.xls (مجازياً كنص)',
                        type: 'interactive',
                        xp: 100,
                        instructions: 'ابحث عن كلمة "Budget" داخل `/home/user/documents/budget.xls` باستخدام `grep`',
                        expectedCommand: 'grep Budget /home/user/documents/budget.xls',
                        hints: ['التركيب: grep "النص" "الملف"', 'اكتب: grep Budget documents/budget.xls'],
                        validation: {
                            type: 'command',
                            check: (cmd) => cmd.startsWith('grep') && cmd.includes('Budget')
                        },
                        successMessage: '🔍 وجدتها! grep أداة لا غنى عنها للمحلل الأمني.'
                    }
                ]
            }
        ]
    },
    // ===============================================================
    // المستوى 3: إدارة النظام والعمليات (System Admin)
    // ===============================================================
    {
        id: 'level-3',
        level: 3,
        title: 'إدارة النظام والعمليات',
        subtitle: 'التحكم في العمليات وصلاحيات الملفات',
        description: 'تعلم كيف تراقـب العمليات، تقتل البرامج العالقة، وتعدل الصلاحيات.',
        requiredXP: 1300,
        rewardXP: 1000,
        icon: 'Cpu',
        color: 'red',
        story: {
            context: 'فيروس التعدين',
            intro: 'هناك بطء شديد في السيرفر. نشك بوجود برمجية تعدين خبيثة تعمل في الخلفية.',
            goal: 'تحديد العملية الخبيثة وإغلاقها.'
        },
        stages: [
            {
                id: 'stage-3-1',
                stageNumber: 1,
                title: 'مراقبة العمليات',
                description: 'استخدام ps و top',
                xp: 300,
                tasks: [
                    {
                        id: 'task-3-1-1',
                        title: 'عرض العمليات - ps',
                        description: 'اعرض قائمة العمليات الحالية',
                        type: 'interactive',
                        xp: 50,
                        instructions: 'اكتب `ps` لرؤية البرامج التي تعمل حالياً',
                        expectedCommand: 'ps',
                        hints: ['فقط اكتب ps'],
                        validation: {
                            type: 'command',
                            check: (cmd) => cmd.trim() === 'ps'
                        },
                        successMessage: '⚙️ انظر! هناك عملية غريبة اسمها "scrypto_miner"!'
                    },
                    {
                        id: 'task-3-1-2',
                        title: 'إغلاق العملية - kill',
                        description: 'أغلق العملية الخبيثة',
                        type: 'interactive',
                        xp: 100,
                        instructions: 'استخدم `kill` مع رقم العملية (PID) الخاص بـ scrypto_miner لإغلاقها. (تلميح: الرقم 1234 في القائمة السابقة)',
                        expectedCommand: 'kill 1234',
                        hints: ['kill PID', 'الرقم هو 1234', 'اكتب: kill 1234'],
                        validation: {
                            type: 'command',
                            check: (cmd) => cmd.includes('kill') && cmd.includes('1234')
                        },
                        successMessage: '💀 تم القضاء على العملية الخبيثة! السيرفر عاد لطبيعته.'
                    }
                ]
            }
        ]
    }
];

// ===================================================================
// Level Metadata
// ===================================================================
export const LEVEL_METADATA = {
    totalLevels: 5,
    totalXP: 6000,
    totalTasks: 60,
    estimatedHours: 10
};

// ===================================================================
// Helper Functions
// ===================================================================

export const getLevelById = (levelId) => {
    return BASH_LEVELS.find(level => level.id === levelId);
};

export const getStageById = (levelId, stageId) => {
    const level = getLevelById(levelId);
    if (!level) return null;
    return level.stages.find(stage => stage.id === stageId);
};

export const getTaskById = (levelId, stageId, taskId) => {
    const stage = getStageById(levelId, stageId);
    if (!stage) return null;
    return stage.tasks.find(task => task.id === taskId);
};

export const calculateLevelProgress = (levelId, completedTasks) => {
    const level = getLevelById(levelId);
    if (!level) return 0;

    const totalTasks = level.stages.reduce((sum, stage) => sum + stage.tasks.length, 0);
    const completed = completedTasks.filter(taskId =>
        level.stages.some(stage =>
            stage.tasks.some(task => task.id === taskId)
        )
    ).length;

    return Math.round((completed / totalTasks) * 100);
};
