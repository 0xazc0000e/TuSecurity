/**
 * Chapter 1: Detection Phase - Detailed Scenarios
 * Both Defender and Attacker perspectives with 3 interconnected tasks each
 */

import { SMARTGRID_STORY } from './storyData';

export const CHAPTER_1_DEFENDER = {
    chapterId: 1,
    role: 'defender',
    title: SMARTGRID_STORY.chapters[0].title,
    objective: SMARTGRID_STORY.chapters[0].defenderGoal,

    // Initial briefing
    briefing: {
        ar: `أنت محلل SOC في مركز العمليات الأمنية لجامعة الطيف.

⏰ الساعة 03:47 صباحًا - هاتفك يرن

📨 تنبيه SIEM عالي الخطورة:
"Unusual outbound traffic detected on SCADA network segment"
Source: 192.168.1.55 (smartgrid-ctrl-01)
Destination: Unknown external IP
Protocol: Modbus TCP (Port 502)

🎯 مهمتك:
1. التحقق من صحة هذا التنبيه
2. تحديد مصدر التهديد (إن وُجد)
3. اتخاذ قرار احتواء مناسب

⚠️ تذكر: كل ثانية مهمة. SCADA تتحكم في شبكة كهرباء الحرم الجامعي.`,
        en: `You are a SOC Analyst at Taif University Security Operations Center.

⏰ 03:47 AM - Your phone rings

📨 High-severity SIEM alert:
"Unusual outbound traffic detected on SCADA network segment"
Source: 192.168.1.55 (smartgrid-ctrl-01)
Destination: Unknown external IP
Protocol: Modbus TCP (Port 502)

🎯 Your mission:
1. Validate this alert
2. Identify the threat source (if exists)
3. Make appropriate containment decision

⚠️ Remember: Every second counts. SCADA controls the campus power grid.`
    },

    // 3 Interconnected Tasks
    tasks: [
        {
            id: 'ch1-def-1',
            order: 1,
            title: { ar: 'الفحص الأولي للسجلات', en: 'Initial Log Triage' },
            objective: {
                ar: 'فحص سجلات النظام لتحديد الأنشطة المشبوهة وIPات المريبة',
                en: 'Examine system logs to identify suspicious activities and suspicious IPs'
            },

            requiredTools: {
                minimum: 2,
                tools: ['grep', 'tail']
            },

            // What the student must discover
            successCriteria: {
                commandsUsed: ['grep', 'tail'],
                entitiesFound: {
                    ips: ['45.33.22.11'],
                    ports: [8080, 502]
                },
                minimumCommandCount: 2
            },

            // What this task produces for next task
            outputs: {
                suspiciousIP: '45.33.22.11',
                attackVector: 'brute_force_attempt',
                affectedService: 'modbus'
            },

            hints: [
                {
                    delay: 30,
                    ar: '💡 جرب البحث عن كلمات مثل "error" أو "failed" في السجلات',
                    en: '💡 Try searching for words like "error" or "failed" in logs'
                },
                {
                    delay: 90,
                    ar: '📝 السجلات العامة في: /var/log/syslog والمصادقة في: /var/log/auth.log',
                    en: '📝 General logs are in: /var/log/syslog and authentication in: /var/log/auth.log'
                }
            ],

            educationalPrompts: [
                {
                    trigger: 'after_grep',
                    question: {
                        ar: '❓ ما الذي يلفت انتباهك في هذه السجلات؟',
                        en: '❓ What catches your attention in these logs?'
                    },
                    correctKeywords: ['ip', '45.33.22.11', 'unauthorized', 'failed'],
                    feedback: {
                        ar: '✓ ممتاز! لاحظت IP المشبوه والمحاولات الفاشلة.',
                        en: '✓ Excellent! You noticed the suspicious IP and failed attempts.'
                    }
                }
            ]
        },

        {
            id: 'ch1-def-2',
            order: 2,
            title: { ar: 'التحقيق في المصدر', en: 'Source Investigation' },
            objective: {
                ar: 'البحث عن معلومات الـ IP المشبوه باستخدام قواعد بيانات التهديدات',
                en: 'Research the suspicious IP using threat intelligence databases'
            },

            // Unlocked after completing task 1
            prerequisite: 'ch1-def-1',

            // Uses output from previous task
            inputFromPrevious: {
                source: 'ch1-def-1',
                field: 'suspiciousIP',
                usage: 'must be used in whois command'
            },

            requiredTools: {
                minimum: 1,
                tools: ['whois']
            },

            successCriteria: {
                commandsUsed: ['whois'],
                entitiesFound: {
                    ips: ['45.33.22.11'],
                    reputation: ['blacklisted']
                }
            },

            outputs: {
                ipReputation: 'blacklisted',
                ipCountry: 'XK',
                threatLevel: 'high'
            },

            hints: [
                {
                    delay: 45,
                    ar: '🔍 استخدم أمر whois متبوعًا بعنوان IP الذي اكتشفته',
                    en: '🔍 Use whois command followed by the IP address you discovered'
                }
            ],

            educationalPrompts: [
                {
                    trigger: 'after_whois',
                    question: {
                        ar: '❓ بناءً على سمعة الـ IP، ما مستوى الخطورة؟ (منخفض/متوسط/مرتفع)',
                        en: '❓ Based on the IP reputation, what is the threat level? (low/medium/high)'
                    },
                    correctAnswer: 'high',
                    feedback: {
                        ar: '✓ صحيح! IP في القائمة السوداء = خطر مرتفع. يجب الاحتواء الفوري.',
                        en: '✓ Correct! Blacklisted IP = high risk. Immediate containment required.'
                    }
                }
            ]
        },

        {
            id: 'ch1-def-3',
            order: 3,
            title: { ar: 'قرار الاحتواء', en: 'Containment Decision' },
            objective: {
                ar: 'اختيار وتنفيذ استراتيجية الاحتواء المناسبة',
                en: 'Choose and execute appropriate containment strategy'
            },

            prerequisite: 'ch1-def-2',
            type: 'decision_point', // Special task type

            inputFromPrevious: {
                source: 'ch1-def-2',
                fields: ['ipReputation', 'threatLevel']
            },

            // Decision choices with consequences
            choices: [
                {
                    id: 'block_ip',
                    title: {
                        ar: '🚫 حظر IP فورًا (iptables)',
                        en: '🚫 Block IP immediately (iptables)'
                    },
                    description: {
                        ar: 'منع كل حركة المرور من هذا IP. رد فعل سريع وآمن.',
                        en: 'Prevent all traffic from this IP. Quick and safe reaction.'
                    },
                    command: 'iptables -A INPUT -s 45.33.22.11 -j DROP',
                    consequence: {
                        ar: '✓ تم حظر المهاجم. لكن قد يعود بـ IP جديد.',
                        en: '✓ Attacker blocked. But may return with new IP.'
                    },
                    score: 70,
                    nextChapterModifier: {
                        attackerStealth: +15, // Attacker becomes more careful
                        defenderVisibility: -10 // Lost visibility into attacker tactics
                    }
                },
                {
                    id: 'monitor',
                    title: {
                        ar: '👁️ المراقبة المستمرة (tcpdump)',
                        en: '👁️ Continuous monitoring (tcpdump)'
                    },
                    description: {
                        ar: 'السماح بالاتصال ومراقبته لجمع معلومات استخباراتية. محفوف بالمخاطر.',
                        en: 'Allow connection and monitor to gather intelligence. Risky.'
                    },
                    command: 'tcpdump -i eth0 host 45.33.22.11',
                    consequence: {
                        ar: '⚠️ جمعت معلومات قيّمة، لكن تعرضت لخطر الاختراق الأعمق.',
                        en: '⚠️ Gathered valuable intel, but risked deeper compromise.'
                    },
                    score: 85,
                    nextChapterModifier: {
                        defenderIntel: +25,
                        attackerProgress: +10 // Attacker gains ground
                    }
                },
                {
                    id: 'isolate_system',
                    title: {
                        ar: '🔒 عزل النظام بالكامل',
                        en: '🔒 Isolate entire system'
                    },
                    description: {
                        ar: 'فصل نظام SCADA عن الشبكة. الأكثر أمانًا، لكن يُعطّل العمليات.',
                        en: 'Disconnect SCADA from network. Safest, but disrupts operations.'
                    },
                    command: 'systemctl stop networking',
                    consequence: {
                        ar: '✓ أقصى حماية. لكن توقفت خدمة الكهرباء لمدة ساعة. -15 نقطة تأثير تشغيلي.',
                        en: '✓ Maximum protection. But power service stopped for 1 hour. -15 operational impact.'
                    },
                    score: 60,
                    nextChapterModifier: {
                        operationalImpact: -15,
                        attackerBlocked: true
                    }
                }
            ],

            educationalPrompts: [
                {
                    trigger: 'before_decision',
                    question: {
                        ar: '❓ ما هي إيجابيات وسلبيات كل خيار؟ فكّر قبل الاختيار.',
                        en: '❓ What are pros and cons of each option? Think before choosing.'
                    }
                },
                {
                    trigger: 'after_decision',
                    question: {
                        ar: '❓ لماذا اخترت هذا القرار بالتحديد؟ اكتب تبريرًا قصيرًا.',
                        en: '❓ Why did you choose this specific decision? Write a brief justification.'
                    },
                    requireTextInput: true
                }
            ]
        }
    ]
};

export const CHAPTER_1_ATTACKER = {
    chapterId: 1,
    role: 'attacker',
    title: SMARTGRID_STORY.chapters[0].title,
    objective: SMARTGRID_STORY.chapters[0].attackerGoal,

    briefing: {
        ar: `🎯 عملية: Blackout
الهدف: شبكة التحكم الذكية SmartGrid-TU

📋 المهمة:
جمع معلومات استخباراتية كاملة عن البنية التحتية للهدف دون إثارة أي إنذارات.

🎖️ القواعد الذهبية:
- الصمت فوق السرعة
- الدقة فوق الكثرة
- كل إجراء قد يُسجَّل في دفاتر الدفاع

🌐 النطاق المعروف: 192.168.1.0/24
🕐 النافذة الزمنية: 45 دقيقة قبل تبديل الوردية`,
        en: `🎯 Operation: Blackout
Target: SmartGrid-TU Control Network

📋 Mission:
Gather complete intelligence about target infrastructure without triggering any alarms.

🎖️ Golden Rules:
- Stealth over speed
- Precision over quantity
- Every action may be logged in defense records

🌐 Known scope: 192.168.1.0/24
🕐 Time window: 45 minutes before shift change`
    },

    tasks: [
        {
            id: 'ch1-atk-1',
            order: 1,
            title: { ar: 'الاستطلاع السلبي', en: 'Passive Reconnaissance' },
            objective: {
                ar: 'التحقق من وجود الهدف وتحديد الأنظمة النشطة',
                en: 'Verify target existence and identify active systems'
            },

            requiredTools: {
                minimum: 2,
                tools: ['ping', 'whois']
            },

            successCriteria: {
                commandsUsed: ['ping'],
                entitiesFound: {
                    ips: ['192.168.1.55'],
                    status: ['alive']
                }
            },

            outputs: {
                aliveHosts: ['192.168.1.55'],
                targetConfirmed: true
            },

            hints: [
                {
                    delay: 20,
                    ar: '💡 ابدأ بأبسط أداة: ping. تحقق من وجود الهدف أولاً.',
                    en: '💡 Start with simplest tool: ping. Verify target existence first.'
                }
            ],

            stealthMechanics: {
                noiseLevel: 'low', // ping is relatively quiet
                detectionRisk: 20 // 20% chance defender sees this
            }
        },

        {
            id: 'ch1-atk-2',
            order: 2,
            title: { ar: 'المسح النشط', en: 'Active Scanning' },
            objective: {
                ar: 'فحص المنافذ المفتوحة والخدمات المتاحة على الهدف',
                en: 'Scan open ports and available services on target'
            },

            prerequisite: 'ch1-atk-1',

            inputFromPrevious: {
                source: 'ch1-atk-1',
                field: 'aliveHosts',
                usage: 'use in nmap scan'
            },

            requiredTools: {
                minimum: 1,
                tools: ['nmap']
            },

            successCriteria: {
                commandsUsed: ['nmap'],
                entitiesFound: {
                    ports: [80, 502],
                    services: ['http', 'modbus']
                }
            },

            outputs: {
                openPorts: [22, 80, 502],
                services: {
                    502: 'modbus',
                    80: 'http',
                    22: 'ssh'
                },
                vulnerableService: 'modbus'
            },

            hints: [
                {
                    delay: 40,
                    ar: '🔍 استخدم nmap مع خيار -sV للكشف عن إصدارات الخدمات',
                    en: '🔍 Use nmap with -sV option to detect service versions'
                }
            ],

            stealthMechanics: {
                noiseLevel: 'high', // nmap is noisy!
                detectionRisk: 75, // 75% chance defender detects this
                triggerEvent: {
                    type: 'DEFENSIVE_ALERT',
                    delay: 15, // seconds after command
                    message: {
                        ar: '🚨 النظام اكتشف مسحًا نشطًا! الدفاع قد يتحرك الآن.',
                        en: '🚨 Active scan detected by defense! They may respond now.'
                    }
                }
            },

            educationalPrompts: [
                {
                    trigger: 'after_nmap',
                    question: {
                        ar: '❓ لاحظت منفذ 502 (Modbus). ما أهمية هذا؟',
                        en: '❓ You noticed port 502 (Modbus). Why is this significant?'
                    },
                    correctKeywords: ['scada', 'industrial', 'control', 'critical'],
                    feedback: {
                        ar: '✓ صحيح! Modbus = نظام تحكم صناعي. هدف عالي القيمة.',
                        en: '✓ Correct! Modbus = Industrial control system. High-value target.'
                    }
                }
            ]
        },

        {
            id: 'ch1-atk-3',
            order: 3,
            title: { ar: 'تقييم المخاطر والانتقال', en: 'Risk Assessment & Transition' },
            objective: {
                ar: 'تقييم المعلومات المجمَّعة وتحديد الخطوة التالية',
                en: 'Assess gathered information and determine next step'
            },

            prerequisite: 'ch1-atk-2',
            type: 'decision_point',

            inputFromPrevious: {
                source: 'ch1-atk-2',
                fields: ['openPorts', 'vulnerableService']
            },

            choices: [
                {
                    id: 'proceed_exploit',
                    title: {
                        ar: '⚡ المتابعة للاستغلال (Chapter 2)',
                        en: '⚡ Proceed to exploitation (Chapter 2)'
                    },
                    description: {
                        ar: 'البدء في محاولة الاختراق الفعلي للـ Modbus service.',
                        en: 'Begin actual exploitation attempts on Modbus service.'
                    },
                    consequence: {
                        ar: '▶ الانتقال إلى الفصل الثاني: الاستطلاع المتقدم',
                        en: '▶ Moving to Chapter 2: Advanced Reconnaissance'
                    },
                    score: 80,
                    nextChapterModifier: {
                        attackerAggression: +10
                    }
                },
                {
                    id: 'abort_stealth',
                    title: {
                        ar: '🌙 التراجع والتخفي',
                        en: '🌙 Retreat and go stealth'
                    },
                    description: {
                        ar: 'الدفاع قد يكون اكتشفك. انتظر قبل المتابعة.',
                        en: 'Defense may have detected you. Wait before proceeding.'
                    },
                    consequence: {
                        ar: '⏸️ تأخير 30 ثانية. لكن تحسّن التخفي في الفصول القادمة.',
                        en: '⏸️ 30 second delay. But improved stealth in next chapters.'
                    },
                    score: 60,
                    nextChapterModifier: {
                        attackerStealth: +20,
                        timeDelay: 30
                    }
                }
            ]
        }
    ]
};

// Export both scenarios
export const CHAPTER_1_SCENARIOS = {
    defender: CHAPTER_1_DEFENDER,
    attacker: CHAPTER_1_ATTACKER
};
