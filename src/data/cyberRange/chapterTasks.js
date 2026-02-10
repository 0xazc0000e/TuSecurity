/**
 * Chapter Tasks - The core logic of the Cyber Range
 * Each chapter has 3 linked tasks for both Attacker and Defender
 */

export const CHAPTER_TASKS = {
    // CHAPTER 1 - DETECTION (Will be merged from chapter1Scenarios.js or redefined here for consistency)
    1: {
        defender: {
            tasks: [
                {
                    id: 'ch1-def-1',
                    order: 1,
                    title: { ar: 'الفحص الأولي للسجلات', en: 'Initial Log Triage' },
                    objective: { ar: 'فحص سجلات النظام لتحديد الأنشطة المشبوهة', en: 'Examine system logs to identify suspicious activities' },
                    requiredTools: { minimum: 2, tools: ['grep', 'tail'] },
                    successCriteria: { commandsUsed: ['grep'], entitiesFound: { ips: ['45.33.22.11'] } },
                    outputs: { suspiciousIP: '45.33.22.11' }
                },
                {
                    id: 'ch1-def-2',
                    order: 2,
                    title: { ar: 'التحقيق في المصدر', en: 'Source Investigation' },
                    objective: { ar: 'البحث عن معلومات الـ IP المشبوه', en: 'Research the suspicious IP' },
                    requiredTools: { minimum: 1, tools: ['whois'] },
                    successCriteria: { commandsUsed: ['whois'], entitiesFound: { reputation: ['blacklisted'] } },
                    outputs: { threatLevel: 'high' }
                },
                {
                    id: 'ch1-def-3',
                    order: 3,
                    title: { ar: 'قرار الاحتواء', en: 'Containment Decision' },
                    type: 'decision_point',
                    choices: [
                        { id: 'block_ip', title: { ar: 'حظر IP فوراً', en: 'Block IP immediately' }, score: 100 },
                        { id: 'isolate', title: { ar: 'عزل النظام', en: 'Isolate System' }, score: 70 }
                    ]
                }
            ]
        },
        attacker: {
            tasks: [
                {
                    id: 'ch1-atk-1',
                    order: 1,
                    title: { ar: 'الاستطلاع السلبي', en: 'Passive Reconnaissance' },
                    objective: { ar: 'التحقق من وجود الهدف وتحديد الأنظمة النشطة', en: 'Verify target existence and identify active systems' },
                    requiredTools: { minimum: 2, tools: ['ping', 'whois'] },
                    successCriteria: { commandsUsed: ['ping'], entitiesFound: { ips: ['192.168.1.55'] } },
                    outputs: { aliveHosts: ['192.168.1.55'] }
                },
                {
                    id: 'ch1-atk-2',
                    order: 2,
                    title: { ar: 'المسح النشط', en: 'Active Scanning' },
                    objective: { ar: 'فحص المنافذ المفتوحة والخدمات المتاحة', en: 'Scan open ports and available services' },
                    requiredTools: { minimum: 1, tools: ['nmap'] },
                    successCriteria: { commandsUsed: ['nmap'], entitiesFound: { ports: [502] } },
                    outputs: { targetPort: 502 }
                },
                {
                    id: 'ch1-atk-3',
                    order: 3,
                    title: { ar: 'تقييم المخاطر', en: 'Risk Assessment' },
                    type: 'decision_point',
                    choices: [
                        { id: 'proceed', title: { ar: 'المتابعة للهدف', en: 'Proceed to Target' }, score: 100 },
                        { id: 'abort', title: { ar: 'الانسحاب المؤقت', en: 'Temporary Retreat' }, score: 30 }
                    ]
                }
            ]
        }
    },

    // CHAPTER 2 - RECONNAISSANCE
    2: {
        defender: {
            tasks: [
                {
                    id: 'ch2-def-1',
                    order: 1,
                    title: { ar: 'مراقبة حركة الشبكة', en: 'Network Traffic Monitoring' },
                    objective: { ar: 'استخدام tcpdump لتحليل الحزم', en: 'Use tcpdump to analyze packets' },
                    requiredTools: { minimum: 1, tools: ['tcpdump'] },
                    successCriteria: { commandsUsed: ['tcpdump'] }
                },
                {
                    id: 'ch2-def-2',
                    order: 2,
                    title: { ar: 'فحص المنافذ محلياً', en: 'Local Port Audit' },
                    objective: { ar: 'تحديد العمليات التي تستخدم المنافذ الحساسة', en: 'Identify processes using sensitive ports' },
                    requiredTools: { minimum: 1, tools: ['netstat'] },
                    successCriteria: { commandsUsed: ['netstat'] }
                },
                {
                    id: 'ch2-def-3',
                    order: 3,
                    title: { ar: 'إعداد فخ سيبراني', en: 'Deploy Honeypot' },
                    type: 'decision_point',
                    choices: [
                        { id: 'deploy_honey', title: { ar: 'نشر Honeypot', en: 'Deploy Honeypot' }, score: 100 }
                    ]
                }
            ]
        },
        attacker: {
            tasks: [
                {
                    id: 'ch2-atk-1',
                    order: 1,
                    title: { ar: 'مسح الخدمات المتقدم', en: 'Advanced Service Scanning' },
                    objective: { ar: 'تحديد إصدارات الخدمات بدقة', en: 'Identify service versions precisely' },
                    requiredTools: { minimum: 1, tools: ['nmap -sV'] },
                    successCriteria: { commandsUsed: ['nmap'] }
                },
                {
                    id: 'ch2-atk-2',
                    order: 2,
                    title: { ar: 'البحث عن ثغرات الويب', en: 'Web Vulnerability Discovery' },
                    objective: { ar: 'استخدام nikto لفحص خادم الويب', en: 'Use nikto to scan the web server' },
                    requiredTools: { minimum: 1, tools: ['nikto'] },
                    successCriteria: { commandsUsed: ['nikto'] }
                },
                {
                    id: 'ch2-atk-3',
                    order: 3,
                    title: { ar: 'اختيار ثغرة الاستغلال', en: 'Select Exploit Vector' },
                    type: 'decision_point',
                    choices: [
                        { id: 'web_exploit', title: { ar: 'استغلال الويب', en: 'Extract Web' }, score: 100 }
                    ]
                }
            ]
        }
    },

    // CHAPTER 3 - ESCALATION
    3: {
        defender: {
            tasks: [
                {
                    id: 'ch3-def-1',
                    order: 1,
                    title: { ar: 'تحليل الاستغلال', en: 'Analyze Exploit' },
                    objective: { ar: 'فحص سجلات الويب لاكتشاف المحاولات', en: 'Check web logs to discover attempts' },
                    requiredTools: { minimum: 1, tools: ['grep'] }
                },
                {
                    id: 'ch3-def-2',
                    order: 2,
                    title: { ar: 'إغلاق الثغرة', en: 'Patch Vulnerability' },
                    requiredTools: { minimum: 1, tools: ['nano'] }
                }
            ]
        },
        attacker: {
            tasks: [
                {
                    id: 'ch3-atk-1',
                    order: 1,
                    title: { ar: 'تنفيذ الاستغلال', en: 'Initial Exploitation' },
                    requiredTools: { minimum: 1, tools: ['nc'] }
                },
                {
                    id: 'ch3-atk-2',
                    order: 2,
                    title: { ar: 'تصعيد الصلاحيات', en: 'Privilege Escalation' },
                    requiredTools: { minimum: 1, tools: ['find'] }
                }
            ]
        }
    },

    // CHAPTER 4 - ENGAGEMENT
    4: {
        defender: {
            tasks: [
                {
                    id: 'ch4-def-1',
                    order: 1,
                    title: { ar: 'تتبع الحركة الجانبية', en: 'Lateral Movement Tracking' },
                    requiredTools: { minimum: 2, tools: ['tail', 'grep'] }
                }
            ]
        },
        attacker: {
            tasks: [
                {
                    id: 'ch4-atk-1',
                    order: 1,
                    title: { ar: 'التنقل الجانبي', en: 'Lateral Movement' },
                    requiredTools: { minimum: 2, tools: ['ssh', 'scp'] }
                }
            ]
        }
    },

    // CHAPTER 5 - POST-INCIDENT
    5: {
        defender: {
            tasks: [
                {
                    id: 'ch5-def-1',
                    order: 1,
                    title: { ar: 'التحليل الجنائي للذاكرة', en: 'Memory Forensics' },
                    requiredTools: { minimum: 1, tools: ['volatility'] }
                }
            ]
        },
        attacker: {
            tasks: [
                {
                    id: 'ch5-atk-1',
                    order: 1,
                    title: { ar: 'مسح الآثار', en: 'Anti-Forensics' },
                    requiredTools: { minimum: 2, tools: ['rm', 'history'] }
                }
            ]
        }
    }
};
