/**
 * Core Story: SmartGrid-TU Breach Incident
 * Unified narrative for both Attacker and Defender perspectives
 */

export const SMARTGRID_STORY = {
    id: 'smartgrid-breach',
    title: 'حادثة اختراق شبكة الطاقة الذكية SmartGrid-TU',
    titleEn: 'SmartGrid-TU Breach Incident',

    setting: {
        ar: 'نظام التحكم في الشبكة الذكية لجامعة الطيف - مبنى الهندسة الكهربائية',
        en: 'Taif University Smart Energy Grid Control System - Electrical Engineering Building'
    },

    incident: {
        ar: 'اشتباه في هجوم APT يستهدف البنية التحتية SCADA',
        en: 'Suspected APT targeting SCADA infrastructure'
    },

    timeline: {
        start: 'Day 0, 03:47 AM',
        end: 'Day 1, 14:20 PM'
    },

    // Central entities that both roles interact with
    keyAssets: {
        targetNetwork: '192.168.1.0/24',
        scadaController: {
            ip: '192.168.1.55',
            hostname: 'smartgrid-ctrl-01',
            services: ['http:80', 'modbus:502', 'ssh:22'],
            vendor: 'Schneider Electric'
        },
        gatewayRouter: {
            ip: '192.168.1.1',
            hostname: 'gateway-tu-01'
        }
    },

    chapters: [
        {
            id: 1,
            title: { ar: 'الاكتشاف', en: 'Detection' },
            defenderGoal: {
                ar: 'التحقق من صحة التنبيه وتحديد مصدر الخطر',
                en: 'Validate the alert and identify the threat source'
            },
            attackerGoal: {
                ar: 'جمع المعلومات دون إثارة الشكوك',
                en: 'Gather intelligence without triggering alarms'
            },
            timeline: '03:47 AM - 04:30 AM',
            pressure: 'high', // منخفض/متوسط/مرتفع
            duration: 900 // seconds (15 min)
        },
        {
            id: 2,
            title: { ar: 'الاستطلاع', en: 'Reconnaissance' },
            defenderGoal: {
                ar: 'مراقبة الشبكة والبحث عن التهديدات',
                en: 'Monitor network and hunt for threats'
            },
            attackerGoal: {
                ar: 'فحص الثغرات وتحديد نقاط الضعف',
                en: 'Scan for vulnerabilities and identify weaknesses'
            },
            timeline: '04:30 AM - 05:45 AM',
            pressure: 'medium',
            duration: 1200
        },
        {
            id: 3,
            title: { ar: 'التصعيد', en: 'Escalation' },
            defenderGoal: {
                ar: 'احتواء التهديد واتخاذ قرارات حاسمة',
                en: 'Contain threat and make critical decisions'
            },
            attackerGoal: {
                ar: 'استغلال الثغرات والحصول على وصول أولي',
                en: 'Exploit vulnerabilities and gain initial access'
            },
            timeline: '05:45 AM - 07:00 AM',
            pressure: 'critical',
            duration: 1500
        },
        {
            id: 4,
            title: { ar: 'المواجهة', en: 'Engagement' },
            defenderGoal: {
                ar: 'الدفاع النشط وتعقب المهاجم',
                en: 'Active defense and attacker tracking'
            },
            attackerGoal: {
                ar: 'الاستمرارية والانتشار الجانبي',
                en: 'Persistence and lateral movement'
            },
            timeline: '07:00 AM - 09:30 AM',
            pressure: 'extreme',
            duration: 1800
        },
        {
            id: 5,
            title: { ar: 'ما بعد الحادث', en: 'Post-Incident Review' },
            defenderGoal: {
                ar: 'التحليل الجنائي واستخلاص الدروس',
                en: 'Forensic analysis and lessons learned'
            },
            attackerGoal: {
                ar: 'تغطية الآثار وتقييم النجاح',
                en: 'Cover tracks and assess success'
            },
            timeline: '10:00 AM - 14:20 PM',
            pressure: 'low',
            duration: 1200
        }
    ]
};

/**
 * Story beats - timed narrative events
 */
export const STORY_BEATS = {
    chapter1: {
        defender: [
            {
                time: 0,
                type: 'narration',
                content: {
                    ar: '⏰ 03:47 صباحًا. هاتفك يهتز. تنبيه من نظام SIEM: حركة مرور غير عادية على شبكة SCADA.',
                    en: '⏰ 03:47 AM. Your phone buzzes. SIEM alert: Unusual traffic on SCADA network.'
                },
                urgent: true
            },
            {
                time: 30,
                type: 'pressure',
                content: {
                    ar: '📞 المشغل الفني يبلغ عن بطء في النظام. يجب التحقيق بسرعة.',
                    en: '📞 Operator reports system lag. Investigate quickly.'
                }
            },
            {
                time: 120,
                type: 'conditional',
                condition: 'no_logs_checked',
                content: {
                    ar: '⚠️ تم تصعيد التنبيه إلى كبير محللي SOC. -10 نقاط.',
                    en: '⚠️ Alert escalated to senior SOC. -10 points.'
                },
                scorePenalty: 10
            }
        ],
        attacker: [
            {
                time: 0,
                type: 'narration',
                content: {
                    ar: '🎯 المهمة: عملية Blackout. الهدف: نظام SmartGrid-TU. التكتيك: الصمت والدقة.',
                    en: '🎯 Mission: Operation Blackout. Target: SmartGrid-TU. Tactics: Stealth and precision.'
                },
                urgent: false
            },
            {
                time: 45,
                type: 'intel',
                content: {
                    ar: '💡 نطاق الهدف: 192.168.1.0/24. ابدأ بالاستطلاع السلبي.',
                    en: '💡 Target scope: 192.168.1.0/24. Begin passive reconnaissance.'
                }
            }
        ]
    }
    // chapters 2-5 will be added as templates
};
