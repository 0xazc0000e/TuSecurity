/**
 * 🎓 البنية الموسعة - الوحدات 3-8
 * (تكملة bashModules.js)
 */

// تصدير ملخص للوحدات 3-8 (سيتم توسيعها لاحقاً)
export const BASH_MODULES_EXTENDED = [
    // الوحدة 3: القراءة والكتابة
    {
        id: 'module-3',
        title: '📝 الوحدة 3: القراءة والكتابة',
        subtitle: 'Reading & Writing',
        description: 'تعلم عرض، تحرير، والبحث في الملفات',
        difficulty: 'beginner',
        estimatedTime: '20 دقيقة',
        xp: 350,
        commandsCovered: ['cat', 'more', 'less', 'head', 'tail', 'echo', 'nano basics', 'grep basics'],
        stagesCount: 3
    },

    // الوحدة 4: البحث والاستكشاف المتقدم
    {
        id: 'module-4',
        title: '🔍 الوحدة 4: البحث والاستكشاف المتقدم',
        subtitle: 'Advanced Search',
        description: 'إتقان البحث عن الملفات والمحتوى',
        difficulty: 'intermediate',
        estimatedTime: '25 دقيقة',
        xp: 450,
        commandsCovered: ['find', 'locate', 'which', 'whereis', 'grep advanced', 'wc', 'sort', 'uniq'],
        stagesCount: 3
    },

    // الوحدة 5: العمليات والنظام
    {
        id: 'module-5',
        title: '⚙️ الوحدة 5: العمليات والنظام',
        subtitle: 'Processes & System',
        description: 'مراقبة والتحكم بالعمليات الجارية',
        difficulty: 'intermediate',
        estimatedTime: '30 دقيقة',
        xp: 500,
        commandsCovered: ['ps', 'top', 'htop', 'pgrep', 'kill', 'killall', 'bg', 'fg', 'jobs'],
        stagesCount: 3
    },

    // الوحدة 6: الصلاحيات والأمان
    {
        id: 'module-6',
        title: '🔐 الوحدة 6: الصلاحيات والأمان',
        subtitle: 'Permissions & Security',
        description: 'فهم وإدارة صلاحيات الملفات',
        difficulty: 'advanced',
        estimatedTime: '35 دقيقة',
        xp: 600,
        commandsCovered: ['chmod', 'chown', 'chgrp', 'umask', 'sudo', 'su', 'passwd'],
        stagesCount: 3
    },

    // الوحدة 7: الشبكات والتواصل
    {
        id: 'module-7',
        title: '🌐 الوحدة 7: الشبكات والتواصل',
        subtitle: 'Network & Communication',
        description: 'التعامل مع الشبكات والإنترنت',
        difficulty: 'advanced',
        estimatedTime: '30 دقيقة',
        xp: 550,
        commandsCovered: ['ping', 'ifconfig', 'ip', 'netstat', 'ss', 'wget', 'curl', 'scp', 'ssh', 'nmap basics'],
        stagesCount: 3
    },

    // الوحدة 8: التحديات والمشاريع
    {
        id: 'module-8',
        title: '🎓 الوحدة 8: التحديات النهائية',
        subtitle: 'Challenges & Projects',
        description: 'مشاريع عملية واقعية',
        difficulty: 'expert',
        estimatedTime: '60 دقيقة',
        xp: 1000,
        projects: [
            {
                name: 'بناء بيئة عمل كاملة',
                description: 'إنشاء هيكل مجلدات احترافي لمشروع ويب',
                xp: 300
            },
            {
                name: 'إدارة خادم ويب بسيط',
                description: 'رفع ملفات، مراقبة العمليات، قراءة السجلات',
                xp: 400
            },
            {
                name: 'سكريبت آلي للنسخ الاحتياطي',
                description: 'كتابة سكريبت bash لعمل backup يومي',
                xp: 300
            }
        ],
        stagesCount: 3
    }
];

// تصدير ملخص شامل
export const MODULE_SUMMARY = {
    totalModules: 8,
    totalTasks: 120,
    totalXP: 4150,
    estimatedTotalTime: '245 دقيقة (~4 ساعات)',

    progressionPath: [
        { level: 'Beginner', modules: [1, 2, 3], percentage: 38 },
        { level: 'Intermediate', modules: [4, 5], percentage: 25 },
        { level: 'Advanced', modules: [6, 7], percentage: 25 },
        { level: 'Expert', modules: [8], percentage: 12 }
    ],

    skills: [
        'Navigation', 'File Management', 'Text Processing',
        'Search & Discovery', 'Process Management', 'Security',
        'Networking', 'Automation'
    ]
};
