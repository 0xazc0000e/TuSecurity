export const SIMULATORS_DATA = [
    {
        id: 'bash-fundamentals',
        title: 'أوامر النظام (Bash)',
        description: 'تعلم Linux Bash بشكل احترافي. منهج متكامل مقسم إلى مراحل ووحدات ومهمات مع شرح نظري وتطبيقات عملية.',
        type: 'simulator',
        domain: 'os',
        level: 'beginner',
        progress: 0,
        xp: 2000,
        path: '/simulators/bash',
        tags: ['Linux', 'CLI', 'Terminal', 'Professional', 'Structured'],
        lessons: 50,
        duration: '8-10 ساعات',
        featured: true
    },
    {
        id: 'tools-simulator',
        title: 'محاكي الأدوات الاحترافي',
        description: 'بيئة عمل متكاملة لأدوات الأمن السيبراني. اختر دورك (مدافع/مهاجم) واكتشف الأدوات المناسبة لكل سيناريو.',
        type: 'simulator',
        domain: 'tools',
        level: 'intermediate',
        progress: 0,
        xp: 2500,
        path: '/simulators/tools-simulator',
        tags: ['Tools', 'Red Team', 'Blue Team', 'Interactive'],
        lessons: 30,
        duration: '6-8 ساعات',
        featured: true
    },
    {
        id: 'attack-simulator',
        title: 'محاكي الهجمات المتقدم',
        description: 'سيناريوهات هجوم ودفاع واقعية. قصص تفاعلية مع أدوار متعددة واكتشافات سرية للنقاط الإضافية.',
        type: 'simulator',
        domain: 'attacks',
        level: 'advanced',
        progress: 0,
        xp: 3000,
        path: '/simulators/attack-simulator',
        tags: ['Attacks', 'Defense', 'Scenarios', 'Story-driven'],
        lessons: 40,
        duration: '10-12 ساعة',
        featured: true
    }
];

// Domain metadata for filtering
export const SIMULATOR_DOMAINS = {
    all: { label: 'الكل', icon: 'Grid' },
    os: { label: 'أنظمة التشغيل', icon: 'Cpu' },
    tools: { label: 'الأدوات', icon: 'Tool' },
    attacks: { label: 'الهجمات', icon: 'Shield' }
};

// Level metadata
export const SIMULATOR_LEVELS = {
    all: { label: 'جميع المستويات', color: 'slate' },
    beginner: { label: 'مبتدئ', color: 'green' },
    intermediate: { label: 'متوسط', color: 'yellow' },
    advanced: { label: 'متقدم', color: 'red' }
};
