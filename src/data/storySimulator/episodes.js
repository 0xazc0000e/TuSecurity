/**
 * SmartGrid Incident Simulator - Episodes Data
 * الفصول السبعة للقصة التفاعلية
 */

export const EPISODES = {
    episode1: {
        id: 1,
        title: { ar: 'الإنذار الأول', en: 'The Trigger' },
        description: { ar: 'تنبيه غير متوقع في ليلة هادئة', en: 'Unexpected alert on a quiet night' },
        duration: '5-10 min',

        // Opening cinematic
        cinematic: {
            scene: 'soc_room',
            duration: 10, // seconds
            elements: [
                { type: 'ambient', value: 'red_lights_pulsing' },
                { type: 'sound', value: 'low_alert_beep' },
                { type: 'visual', value: 'network_map_flashing' }
            ],
            narration: {
                ar: 'الساعة 03:42 صباحاً. غرفة SOC. تنبيه جديد...',
                en: '03:42 AM. SOC Room. New Alert...'
            }
        },

        // Main alert
        alert: {
            title: { ar: 'نشاط غير اعتيادي', en: 'Unusual Activity Detected' },
            device: 'EMP-17-LAPTOP',
            severity: 'medium',
            message: {
                ar: 'تم رصد نشاط شبكي غير اعتيادي من جهاز داخلي',
                en: 'Unusual network activity detected from internal device'
            },
            details: {
                ip: '192.168.1.142',
                user: 'rashed.alotaibi',
                department: 'Finance',
                time: '03:35 AM',
                pattern: 'outbound_connections_spike'
            }
        },

        // Role selection
        roleSelection: {
            question: { ar: 'اختر دورك في هذه الحادثة', en: 'Choose your role in this incident' },
            options: [
                {
                    id: 'defender',
                    title: { ar: 'المدافع (Blue Team)', en: 'Defender (Blue Team)' },
                    description: { ar: 'احمِ الشبكة وأوقف التهديد', en: 'Protect the network and stop the threat' },
                    mentor: 'layla',
                    objective: { ar: 'تحديد المشكلة واحتواء الخطر', en: 'Identify and contain the threat' }
                },
                {
                    id: 'attacker',
                    title: { ar: 'المهاجم التعليمي (Red Team)', en: 'Educational Attacker (Red Team)' },
                    description: { ar: 'افهم كيف يفكر المهاجم', en: 'Understand how attackers think' },
                    mentor: 'shadow',
                    objective: { ar: 'اكتشاف الثغرات (تعليمي فقط)', en: 'Discover vulnerabilities (educational only)' }
                }
            ]
        },

        // Branch points based on role
        branches: {
            defender: {
                mentor: 'layla',
                initialDialogue: 'greeting',
                guidance: 'مهمتك ليست الهجوم… بل الفهم. لنبدأ بتحليل التنبيه.',
                nextSteps: ['analyze_alert', 'check_device', 'review_logs']
            },
            attacker: {
                mentor: 'shadow',
                initialDialogue: 'hint',
                guidance: 'أنت لا تبحث عن الباب... بل عن النافذة المفتوحة.',
                nextSteps: ['discover_network', 'find_weakness', 'plan_approach']
            }
        }
    },

    episode2: {
        id: 2,
        title: { ar: 'الإعداد', en: 'Preparation' },
        description: { ar: 'بناء استراتيجية الاستجابة', en: 'Building the response strategy' },
        duration: '10-15 min',

        // Strategic questions
        questions: [
            {
                id: 'q1',
                text: { ar: 'ما أول مصدر معلومات ستبدأ به؟', en: 'What information source will you start with?' },
                options: [
                    { id: 'logs', text: { ar: 'سجلات النظام', en: 'System Logs' }, weight: 'analytical' },
                    { id: 'network', text: { ar: 'حركة الشبكة', en: 'Network Traffic' }, weight: 'technical' },
                    { id: 'device', text: { ar: 'جهاز المستخدم', en: 'User Device' }, weight: 'direct' },
                    { id: 'email', text: { ar: 'البريد الإلكتروني', en: 'Email' }, weight: 'investigative' }
                ],
                impact: 'determines_initial_panel'
            },
            {
                id: 'q2',
                text: { ar: 'ما نوع الخطر الذي تتوقعه؟', en: 'What type of threat do you expect?' },
                options: [
                    { id: 'human_error', text: { ar: 'خطأ بشري', en: 'Human Error' }, severity: 'low' },
                    { id: 'malware', text: { ar: 'برنامج خبيث', en: 'Malware' }, severity: 'high' },
                    { id: 'unauthorized', text: { ar: 'وصول غير مصرح', en: 'Unauthorized Access' }, severity: 'critical' },
                    { id: 'data_leak', text: { ar: 'تسريب بيانات', en: 'Data Leak' }, severity: 'critical' }
                ],
                impact: 'determines_investigation_focus'
            }
        ],

        // Dynamic environment building
        environmentBuilder: {
            logs: { panel: 'terminal', focus: 'log_analysis' },
            network: { panel: 'network_map', focus: 'traffic_patterns' },
            device: { panel: 'target_view', focus: 'endpoint_inspection' },
            email: { panel: 'toolkit', focus: 'email_forensics' }
        }
    },

    episode3: {
        id: 3,
        title: { ar: 'المشهد المتشعب', en: 'The Branching Scene' },
        description: { ar: 'اتخاذ القرار الاستراتيجي الأول', en: 'Making the first strategic decision' },
        duration: '15-20 min',

        // Different paths for defender vs attacker
        defenderPath: {
            characters: ['layla', 'salem'],
            threatLevel: {
                initial: 'green',
                milestones: [
                    { time: 300, level: 'yellow', trigger: 'pattern_detected' },
                    { time: 600, level: 'orange', trigger: 'escalation' },
                    { time: 900, level: 'red', trigger: 'critical' }
                ]
            },
            events: [
                {
                    id: 'pattern_analysis',
                    character: 'salem',
                    dialogue: 'الحركة تزداد كل 15 دقيقة... هذانمط.',
                    visualization: 'traffic_graph',
                    teaches: 'pattern_recognition'
                }
            ]
        },

        attackerPath: {
            characters: ['shadow'],
            discovery: {
                networkMap: 'incomplete',
                revealedBy: 'exploration',
                hints: [
                    'ابحث عن الأجهزة القديمة',
                    'الأنظمة المشغولة دائماً هي الأقل مراقبة',
                    'الموظفون يثقون في الأسماء المألوفة'
                ]
            }
        }
    }

    // Episodes 4-7 will be added progressively
};

/**
 * Helper to get episode by ID
 */
export const getEpisode = (episodeId) => {
    return EPISODES[`episode${episodeId}`];
};

/**
 * Helper to get next episode
 */
export const getNextEpisode = (currentEpisodeId) => {
    const nextId = currentEpisodeId + 1;
    return nextId <= 7 ? getEpisode(nextId) : null;
};
