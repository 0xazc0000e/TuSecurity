export const SIMULATORS_DATA = {
    kernel: {
        id: 'kernel',
        title: 'استغلال النواة (Kernel Exploitation)',
        category: 'Exploitation',
        prompt: 'guest@linux:~$ ',
        concept: {
            analogy: 'أنت داخل "الردهة" ببطاقة زائر. هدفك العثور على ثغرة في النظام الأمني لتزور بطاقة "المدير".',
            visual: '🔑 Guest -> 🗝️ Root',
            goal: 'تعلم كيف تمنح الأخطاء البرمجية صلاحيات غير مستحقة.'
        },
        steps: [
            {
                expected: ['whoami'],
                output: 'user: guest (uid=1000)\ngid=1000(guest) groups=1000(guest)',
                hint: 'تحقق من هويتك الحالية. الأمر يبدأ بـ "who..."',
                explanation: 'أنت مستخدم عادي. لاحظ (uid=1000). المدير دائماً رقمه 0.',
                visualState: 'guest_id'
            },
            {
                expected: ['uname -a', 'uname -r'],
                output: 'Linux server 5.8.0-generic #42~20.04.1-Ubuntu SMP',
                hint: 'لمعرفة إصدار النواة، استخدم الأمر "uname" مع خيار "-a" أو "-r".',
                explanation: 'إصدار النواة 5.8. هذا الإصدار قديم وقد يحتوي على ثغرات معروفة.',
                visualState: 'scanning'
            },
            {
                expected: ['searchsploit kernel 5.8', 'searchsploit 5.8'],
                output: '[+] Found Exploit: DirtyPipe (CVE-2022-0847)\n[+] Path: /exploits/linux/local/50808.c',
                hint: 'ابحث عن ثغرة باستخدام أداة "searchsploit" متبوعة بكلمة kernel ورقم الإصدار.',
                explanation: 'وجدنا ثغرة خطيرة تسمى "DirtyPipe" تسمح بالكتابة على ملفات القراءة فقط.',
                visualState: 'vulnerability_found'
            },
            {
                expected: ['gcc exploit.c -o exploit', 'compile'],
                output: 'Compiling exploit.c...\n[Warning] Implicit declaration of function...\nCompilation finished successfully.',
                hint: 'قم بترجمة كود الثغرة باستخدام "gcc exploit.c -o exploit".',
                explanation: 'تم تحويل كود الثغرة المكتوب بلغة C إلى برنامج تنفيذي.',
                visualState: 'compiling'
            },
            {
                expected: ['./exploit'],
                output: '[*] Hijacking pipe flags...\n[*] Writing to read-only page...\n[+] Success! Spawning root shell...',
                hint: 'شغل الأداة التي صنعتها للتو: "./exploit"',
                explanation: 'اللحظة الحاسمة! الأداة استغلت الثغرة وغيرت ذاكرة النواة.',
                visualState: 'exploited'
            },
            {
                expected: ['whoami'],
                output: 'root (uid=0)\nACCESS GRANTED - SYSTEM COMPROMISED',
                hint: 'تحقق من هويتك الآن لترى النتيجة.',
                explanation: 'مبروك! لاحظ (uid=0). أنت الآن تملك النظام بالكامل.',
                visualState: 'root_access'
            }
        ],
        notes: [
            'التصحيح (Patching): التحديث المستمر للنواة يغلق هذه الثغرات.',
            'مبدأ أقل الامتيازات: لا تشغل الخدمات بصلاحيات Root إلا للضرورة.',
            'جريمة: استغلال الأنظمة دون إذن يعاقب عليه القانون.'
        ]
    },
    network: {
        id: 'network',
        title: 'تحليل الشبكات (Traffic Analysis)',
        category: 'Sniffing',
        prompt: 'analyst@tucc-net:~$ ',
        concept: {
            analogy: 'أنت تقف في طريق سريع وتراقب السيارات (الحزم). السيارات الزجاجية تكشف الركاب (HTTP)، والسيارات المصفحة تخفيهم (HTTPS).',
            visual: '🔍 مراقبة الحزم',
            goal: 'التفريق بين البروتوكولات الآمنة وغير الآمنة.'
        },
        steps: [
            {
                expected: ['ifconfig', 'ip addr'],
                output: 'eth0: flags=4163<UP,BROADCAST,RUNNING> mtu 1500\n      inet 192.168.1.105  netmask 255.255.255.0',
                hint: 'تحقق من إعدادات بطاقة الشبكة وعنوان IP الخاص بك (ifconfig).',
                explanation: 'أنت متصل بالشبكة المحلية بعنوان 192.168.1.105.',
                visualState: 'interface_check'
            },
            {
                expected: ['sudo tcpdump -i eth0', 'tcpdump'],
                output: 'tcpdump: verbose output suppressed, use -v or -vv for full protocol decode\nlistening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes',
                hint: 'شغل أداة التنصت "tcpdump" على الواجهة eth0 (تذكر sudo).',
                explanation: 'بدأنا الآن في اعتراض كل ما يمر عبر سلك الشبكة.',
                visualState: 'sniffing_start'
            },
            {
                expected: ['analyze http', 'grep http'],
                output: '14:20:15 IP 192.168.1.20 > 54.20.10.1: HTTP POST /login\n    ... User-Agent: Mozilla/5.0 ...\n    ... body: username=admin&password=Password123 ...',
                hint: 'فلتر النتائج للبحث عن بروتوكول نصي واضح مثل HTTP.',
                explanation: 'كارثة! المستخدم أرسل كلمة المرور عبر HTTP، فظهرت كنص واضح.',
                visualState: 'packet_captured_clear'
            },
            {
                expected: ['analyze https', 'grep https'],
                output: '14:21:30 IP 192.168.1.20 > 172.217.10.1: HTTPS (TLSv1.3)\n    ... Payload: 7f 8a 9c 2b 11 f0 (ENCRYPTED) ...',
                hint: 'انظر الآن إلى حركة المرور المشفرة HTTPS.',
                explanation: 'نرى الاتصال، لكن المحتوى عبارة عن رموز غير مفهومة بسبب التشفير.',
                visualState: 'packet_captured_encrypted'
            }
        ],
        notes: [
            'استخدم Wireshark لتحليل أعمق وواجهة رسومية.',
            'هجمات Man-in-the-Middle تعتمد على اعتراض هذه الحزم.',
            'دائماً استخدم VPN عند الاتصال بشبكات عامة.'
        ]
    },
    crypto: {
        id: 'crypto',
        title: 'كسر التشفير (Hash Cracking)',
        category: 'Cryptography',
        prompt: 'cracker@hashcat:~$ ',
        concept: {
            analogy: 'لديك خزنة (الهاش) وتريد فتحها. بدلاً من كسرها، تجرب كل المفاتيح الممكنة (Brute Force) أو تستخدم دفتر مفاتيح مسروق (Dictionary Attack).',
            visual: '🔓 كسر القفل',
            goal: 'فهم ضعف كلمات المرور البسيطة والخوارزميات القديمة.'
        },
        steps: [
            {
                expected: ['hash-id "5f4dcc3b5aa765d61d8327deb882cf99"', 'identify'],
                output: 'Analyzing hash...\n[+] MD5 (High Probability)\n[+] NTLM (Low Probability)',
                hint: 'حدد نوع الهاش باستخدام أداة "hash-id".',
                explanation: 'الأداة تعرفت على نوع الهاش: MD5، وهي خوارزمية قديمة جداً.',
                visualState: 'identifying'
            },
            {
                expected: ['john --format=Raw-MD5 hash.txt', 'hashcat -m 0 hash.txt'],
                output: 'Loaded 1 password hash (MD5 [128/128 AVX2 4x3])\nPress \'q\' or Ctrl-C to abort...',
                hint: 'ابدأ الهجوم باستخدام "john" وحدد التنسيق Raw-MD5.',
                explanation: 'بدأ "John the Ripper" في تجربة ملايين الاحتمالات في الثانية.',
                visualState: 'cracking_start'
            },
            {
                expected: ['status', 'show'],
                output: 'password (admin) \n1g 0:00:00:02 DONE (2025-10-24 14:20) 0.5g/s',
                hint: 'تحقق مما إذا تم العثور على كلمة المرور.',
                explanation: 'تم كسر الهاش! كلمة المرور كانت "password". سهلة جداً.',
                visualState: 'cracked'
            }
        ],
        notes: [
            'كلمات المرور الضعيفة يتم كسرها في ثوانٍ.',
            'استخدم الـ Salt (قيمة عشوائية) مع الهاش لتصعيب الكسر.',
            'خوارزميات مثل bcrypt و Argon2 مصممة لتكون بطيئة ومقاومة للهجوم.'
        ]
    }
};
