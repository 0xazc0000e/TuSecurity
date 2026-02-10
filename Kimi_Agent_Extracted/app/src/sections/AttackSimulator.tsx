import { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, CheckCircle, ChevronLeft, 
  Crosshair, Flag, Lightbulb, 
  Play, RotateCcw, Server, Shield, 
  Skull, Trophy, 
  Zap, Brain, Cpu, Globe, Wifi,
  Star, MessageSquare,
  Eye,
  BarChart3,
  Network, Flame,
  Terminal,
  Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// ===== TYPES =====
interface AttackScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  story: StorySegment[];
  attackerPhases: AttackPhase[];
  defenderPhases: DefensePhase[];
  networkMap: NetworkNode[];
  tools: Tool[];
}

interface StorySegment {
  id: string;
  character: string;
  avatar: string;
  role: 'attacker' | 'defender' | 'narrator';
  message: string;
  mood: 'neutral' | 'tense' | 'urgent' | 'triumphant' | 'dramatic';
}

interface AttackPhase {
  id: string;
  title: string;
  description: string;
  objective: string;
  commands: string[];
  questions: Question[];
  hints: string[];
  flag: string;
  points: number;
  tools: string[];
  visualEffect: string;
  explanation: string;
}

interface DefensePhase {
  id: string;
  title: string;
  description: string;
  objective: string;
  commands: string[];
  questions: Question[];
  hints: string[];
  flag: string;
  points: number;
  tools: string[];
  visualEffect: string;
  explanation: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint?: string;
}

interface NetworkNode {
  id: string;
  name: string;
  type: 'firewall' | 'server' | 'workstation' | 'router' | 'database' | 'attacker' | 'ids' | 'dmz';
  x: number;
  y: number;
  status: 'secure' | 'compromised' | 'attacking' | 'defending' | 'scanning' | 'alert';
  connections: string[];
  info: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'recon' | 'exploit' | 'defense' | 'analysis';
  icon: string;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'warning';
  content: string;
  timestamp: Date;
}

interface GuideMessage {
  type: 'hint' | 'info' | 'warning' | 'success' | 'error';
  message: string;
}

// ===== SCENARIO: NETWORK INTRUSION =====
const networkIntrusionScenario: AttackScenario = {
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
    { id: 'nmap', name: 'Nmap', description: 'مسح الشبكة والمنافذ', category: 'recon', icon: '🔍' },
    { id: 'metasploit', name: 'Metasploit', description: 'إطار العمل للاختراق', category: 'exploit', icon: '🎯' },
    { id: 'wireshark', name: 'Wireshark', description: 'تحليل حركة المرور', category: 'analysis', icon: '📊' },
    { id: 'snort', name: 'Snort', description: 'نظام كشف التسلل', category: 'defense', icon: '🛡️' },
    { id: 'tcpdump', name: 'Tcpdump', description: 'التقاط الحزم', category: 'analysis', icon: '📡' },
    { id: 'iptables', name: 'IPTables', description: 'جدار الحماية', category: 'defense', icon: '🔥' }
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
      explanation: 'في مرحلة الاحتواء، نستخدم iptables لحظر IP المهاجم وإغلاق المنافذ المشبوهة.',
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
  ]
};

interface AttackSimulatorProps {
  onBack: () => void;
}

export default function AttackSimulator({ onBack }: AttackSimulatorProps) {
  // State
  const [mode, setMode] = useState<'attacker' | 'defender'>('attacker');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [showStory, setShowStory] = useState(true);
  const [storyIndex, setStoryIndex] = useState(0);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [guideMessages, setGuideMessages] = useState<GuideMessage[]>([]);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>(networkIntrusionScenario.networkMap);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showToolInfo, setShowToolInfo] = useState<string | null>(null);
  const [showCommandHelp, setShowCommandHelp] = useState<string | null>(null);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentScenario = networkIntrusionScenario;
  const currentPhases = mode === 'attacker' ? currentScenario.attackerPhases : currentScenario.defenderPhases;
  const currentPhase = currentPhases[currentPhaseIndex];
  const currentQuestions = currentPhase?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initial guide message
  useEffect(() => {
    if (guideMessages.length === 0) {
      addGuideMessage('info', `Welcome! I'm your guide in this scenario. I'll help you ${mode === 'attacker' ? 'launch the attack' : 'defend the system'}.`);
    }
  }, [mode]);

  const addTerminalLine = (type: TerminalLine['type'], content: string) => {
    setTerminalLines(prev => [...prev, { type, content, timestamp: new Date() }]);
  };

  const addGuideMessage = (type: GuideMessage['type'], message: string) => {
    setGuideMessages(prev => [...prev, { type, message }]);
  };

  const simulateCommand = (cmd: string): string => {
    const normalizedCmd = cmd.toLowerCase().trim();
    
    // Check if it's a valid command for this phase
    const validCommand = currentPhase.commands.find(c => 
      normalizedCmd.includes(c.toLowerCase().split(' ')[0])
    );

    if (validCommand) {
      if (normalizedCmd.includes('nmap')) {
        return generateNmapOutput(normalizedCmd);
      }
      if (normalizedCmd.includes('tcpdump')) {
        return generateTcpdumpOutput();
      }
      if (normalizedCmd.includes('iptables')) {
        return generateIptablesOutput(normalizedCmd);
      }
      if (normalizedCmd.includes('msfconsole')) {
        return generateMetasploitOutput();
      }
      if (normalizedCmd.includes('tail') || normalizedCmd.includes('grep')) {
        return generateLogOutput();
      }
      if (normalizedCmd.includes('netstat')) {
        return generateNetstatOutput();
      }
      return `Command executed successfully.\n${validCommand}`;
    }

    return `bash: ${cmd.split(' ')[0]}: command not found or not available in this phase. Type one of the suggested commands.`;
  };

  const generateNmapOutput = (cmd: string): string => {
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

  const generateTcpdumpOutput = (): string => {
    return `tcpdump: listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
10:30:00.123456 IP 192.168.1.50.54321 > 192.168.1.100.80: Flags [S], seq 1234567890, win 29200
10:30:00.123789 IP 192.168.1.100.80 > 192.168.1.50.54321: Flags [S.], seq 9876543210, ack 1234567891
10:30:00.124012 IP 192.168.1.50.54322 > 192.168.1.100.443: Flags [S], seq 2345678901
10:30:00.124345 IP 192.168.1.50.54323 > 192.168.1.100.22: Flags [S], seq 3456789012

[*] Possible port scan detected from 192.168.1.50`;
  };

  const generateIptablesOutput = (cmd: string): string => {
    if (cmd.includes('-A INPUT') && cmd.includes('DROP')) {
      return `iptables: Rule added successfully.

Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
    0     0 DROP       all  --  *      *       192.168.1.50         0.0.0.0/0

[*] Traffic from 192.168.1.50 will now be dropped`;
    }
    return `iptables: Rule processed.`;
  };

  const generateMetasploitOutput = (): string => {
    return `[*] Starting Metasploit Console...
[*] Using configured payload generic/shell_reverse_tcp
[*] Started reverse TCP handler on 192.168.1.50:4444
[*] Exploiting target 192.168.1.100...
[*] Sending stage (36 bytes) to 192.168.1.100
[*] Command shell session 1 opened (192.168.1.50:4444 -> 192.168.1.100:54321)

whoami
www-data

id
uid=33(www-data) gid=33(www-data) groups=33(www-data)

uname -a
Linux webserver 5.4.0-80-generic #90-Ubuntu SMP... x86_64 x86_64 x86_64 GNU/Linux

[*] Session established successfully!`;
  };

  const generateLogOutput = (): string => {
    return `Jan 15 10:25:00 webserver sshd[1234]: Failed password for root from 192.168.1.50 port 54321 ssh2
Jan 15 10:25:02 webserver sshd[1234]: Failed password for admin from 192.168.1.50 port 54321 ssh2
Jan 15 10:25:05 webserver sshd[1234]: Failed password for user from 192.168.1.50 port 54321 ssh2
Jan 15 10:25:10 webserver sshd[1234]: Failed password for test from 192.168.1.50 port 54321 ssh2
Jan 15 10:25:15 webserver sshd[1234]: Failed password for oracle from 192.168.1.50 port 54321 ssh2

[*] Possible brute force attack detected from 192.168.1.50`;
  };

  const generateNetstatOutput = (): string => {
    return `Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN
tcp        0      0 192.168.1.100:80        192.168.1.50:54321      ESTABLISHED
tcp        0      0 192.168.1.100:4444      192.168.1.50:54322      ESTABLISHED

[*] Suspicious connections detected on port 4444`;
  };

  const handleCommand = () => {
    if (!input.trim()) return;

    const cmd = input.trim();
    addTerminalLine('input', `${mode === 'attacker' ? 'root@kali' : 'admin@securetech'}:~# ${cmd}`);
    
    const output = simulateCommand(cmd);
    if (output) {
      addTerminalLine('output', output);
    }

    // Check if command is valid for this phase
    const isValidCommand = currentPhase.commands.some(c => 
      cmd.toLowerCase().includes(c.toLowerCase().split(' ')[0])
    );

    if (isValidCommand) {
      addGuideMessage('success', 'Great! Command executed successfully. Now answer the questions.');
      setShowQuestions(true);
    } else {
      addGuideMessage('warning', 'This command is not suitable for the current phase. Try one of the suggested commands.');
    }

    setInput('');
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowAnswerFeedback(true);

    if (index === currentQuestion.correctAnswer) {
      addGuideMessage('success', 'Correct answer! Well done.');
      
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswerFeedback(false);
        }, 1500);
      } else {
        setTimeout(() => {
          setShowQuestions(false);
          setShowFlagInput(true);
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setShowAnswerFeedback(false);
        }, 1500);
      }
    } else {
      addGuideMessage('error', `Incorrect. ${currentQuestion.explanation}`);
    }
  };

  const handleFlagSubmit = () => {
    if (flagInput.trim() === currentPhase.flag) {
      setShowSuccess(true);
      setCompletedPhases(prev => [...prev, currentPhase.id]);
      setTotalPoints(prev => prev + currentPhase.points);
      addGuideMessage('success', `Congratulations! Phase completed. You earned ${currentPhase.points} points!`);
      
      updateNetworkForPhase();

      setTimeout(() => {
        setShowSuccess(false);
        setShowFlagInput(false);
        setFlagInput('');
        
        if (currentPhaseIndex < currentPhases.length - 1) {
          setCurrentPhaseIndex(prev => prev + 1);
          setTerminalLines([]);
          setShowQuestions(false);
        }
      }, 2000);
    } else {
      addGuideMessage('error', 'Incorrect flag. Try again.');
    }
  };

  const updateNetworkForPhase = () => {
    setNetworkNodes(prev => prev.map(node => {
      if (mode === 'attacker') {
        if (currentPhase.id === 'recon' && node.id === 'webserver') {
          return { ...node, status: 'scanning' as const };
        }
        if (currentPhase.id === 'exploit' && (node.id === 'webserver' || node.id === 'database')) {
          return { ...node, status: 'compromised' as const };
        }
      } else {
        if (currentPhase.id === 'monitoring' && node.id === 'ids') {
          return { ...node, status: 'alert' as const };
        }
        if (currentPhase.id === 'containment' && node.id === 'firewall') {
          return { ...node, status: 'defending' as const };
        }
      }
      return node;
    }));
  };

  const nextStory = () => {
    if (storyIndex < currentScenario.story.length - 1) {
      setStoryIndex(prev => prev + 1);
    } else {
      setShowStory(false);
    }
  };

  const getNodeIcon = (type: NetworkNode['type']) => {
    switch (type) {
      case 'attacker': return <Skull className="w-5 h-5" />;
      case 'firewall': return <Flame className="w-5 h-5" />;
      case 'server': return <Server className="w-5 h-5" />;
      case 'database': return <DatabaseIcon />;
      case 'router': return <Wifi className="w-5 h-5" />;
      case 'workstation': return <Cpu className="w-5 h-5" />;
      case 'ids': return <Eye className="w-5 h-5" />;
      case 'dmz': return <Globe className="w-5 h-5" />;
    }
  };

  const getNodeColor = (status: NetworkNode['status']) => {
    switch (status) {
      case 'secure': return 'bg-green-500';
      case 'compromised': return 'bg-red-500';
      case 'attacking': return 'bg-orange-500';
      case 'defending': return 'bg-blue-500';
      case 'scanning': return 'bg-yellow-500';
      case 'alert': return 'bg-purple-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const phaseProgress = ((currentPhaseIndex + 1) / currentPhases.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0f] cyber-grid">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 border-b border-[#24099340]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>العودة للرئيسية</span>
            </button>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#24099320]">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">{totalPoints}</span>
                <span className="text-gray-400 text-sm">نقطة</span>
              </div>
              <Badge className={`${getDifficultyColor(currentScenario.difficulty)} text-white`}>
                {currentScenario.difficulty === 'easy' ? 'سهل' :
                 currentScenario.difficulty === 'medium' ? 'متوسط' :
                 currentScenario.difficulty === 'hard' ? 'صعب' : 'خبير'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="glass rounded-xl p-2 flex gap-2">
            <button
              onClick={() => setMode('attacker')}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                mode === 'attacker' 
                  ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-500/30' 
                  : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <Skull className="w-5 h-5" />
              <span>وضع المهاجم</span>
            </button>
            <button
              onClick={() => setMode('defender')}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                mode === 'defender' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/30' 
                  : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>وضع المدافع</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - Phase Info & Tools */}
          <div className="lg:col-span-3 space-y-4">
            {/* Phase Card */}
            <div className="gradient-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  mode === 'attacker' ? 'bg-red-500/20' : 'bg-blue-500/20'
                }`}>
                  {mode === 'attacker' ? <Crosshair className="w-5 h-5 text-red-400" /> : <Shield className="w-5 h-5 text-blue-400" />}
                </div>
                <div>
                  <p className="text-xs text-gray-400">المرحلة {currentPhaseIndex + 1} من {currentPhases.length}</p>
                  <h3 className="font-bold">{currentPhase.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3">{currentPhase.description}</p>
              <div className="p-2 rounded-lg bg-[#24099320]">
                <p className="text-xs text-gray-400">الهدف:</p>
                <p className="text-sm">{currentPhase.objective}</p>
              </div>
            </div>

            {/* Phase Explanation */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-cyan-400">
                <Info className="w-5 h-5" />
                شرح المرحلة
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">{currentPhase.explanation}</p>
            </div>

            {/* Tools */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                الأدوات المتاحة
              </h4>
              <div className="space-y-2">
                {currentScenario.tools
                  .filter(tool => currentPhase.tools.includes(tool.id))
                  .map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setShowToolInfo(tool.id)}
                      className="w-full p-2 rounded-lg bg-[#111118] hover:bg-[#24099330] transition-colors text-right"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{tool.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{tool.name}</p>
                          <p className="text-xs text-gray-400">{tool.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Guide Panel */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#430D9E]" />
                المرشد
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {guideMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-2 rounded-lg text-sm ${
                      msg.type === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                      msg.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                      msg.type === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                      'bg-[#24099320]'
                    }`}
                  >
                    <p className="text-gray-300">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Terminal & Questions */}
          <div className="lg:col-span-5 space-y-4">
            {/* Terminal - LTR Direction */}
            <div className="terminal rounded-xl overflow-hidden" dir="ltr">
              <div className="bg-[#1a1a24] px-4 py-2 flex items-center justify-between border-b border-[#00ff8820]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-500 terminal-text">
                  {mode === 'attacker' ? 'root@kali: ~' : 'admin@securetech: ~'}
                </span>
                <button 
                  onClick={() => setTerminalLines([])}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              
              <div 
                ref={terminalRef}
                className="p-4 h-72 overflow-y-auto terminal-text text-sm"
                dir="ltr"
              >
                {terminalLines.length === 0 && (
                  <div className="text-gray-500">
                    <p className="text-[#00ff88] mb-2">╔════════════════════════════════════════╗</p>
                    <p className="text-[#00ff88] mb-2">║  {mode === 'attacker' ? 'Kali Linux - Offensive Security' : 'SecureTech Defense Console'}  ║</p>
                    <p className="text-[#00ff88] mb-4">╚════════════════════════════════════════╝</p>
                    <p className="text-gray-400 mb-2">Current Phase: {currentPhase.title}</p>
                    <p className="text-gray-400 mb-2">Objective: {currentPhase.objective}</p>
                    <p className="text-[#00d4ff] mt-4">Available Commands:</p>
                    {currentPhase.commands.map((cmd, i) => (
                      <p key={i} className="text-[#00ff88] ml-4">• {cmd}</p>
                    ))}
                  </div>
                )}
                {terminalLines.map((line, i) => (
                  <div 
                    key={i} 
                    className={`mb-1 ${
                      line.type === 'input' ? 'text-[#00d4ff]' :
                      line.type === 'error' ? 'text-[#ff4444]' :
                      line.type === 'success' ? 'text-[#00ff88]' :
                      line.type === 'warning' ? 'text-[#ffd700]' :
                      line.type === 'info' ? 'text-[#00d4ff]' :
                      'text-[#e0e0e0]'
                    }`}
                  >
                    {line.content}
                  </div>
                ))}
              </div>
              
              <div className="p-3 bg-[#0d0d12] border-t border-[#00ff8820]" dir="ltr">
                <div className="flex items-center gap-2">
                  <span className="text-[#00ff88] terminal-text text-sm">
                    {mode === 'attacker' ? 'root@kali' : 'admin@securetech'}:~#
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                    className="flex-1 bg-transparent border-none outline-none text-white terminal-text text-sm"
                    placeholder="Type command here..."
                    autoFocus
                  />
                  <button
                    onClick={handleCommand}
                    className="p-2 rounded-lg bg-[#240993] hover:bg-[#430D9E] transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Command Help Panel */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-[#430D9E]">
                <Terminal className="w-5 h-5" />
                الأوامر المتاحة
              </h4>
              <div className="space-y-2">
                {currentPhase.commands.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => setShowCommandHelp(cmd)}
                    className="w-full p-2 rounded-lg bg-[#111118] hover:bg-[#24099330] transition-colors text-left"
                    dir="ltr"
                  >
                    <code className="text-[#00ff88] terminal-text text-sm">{cmd}</code>
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Panel */}
            {showQuestions && currentQuestion && (
              <div className="glass rounded-xl p-4">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#430D9E]" />
                  اختبار المعرفة
                </h4>
                <p className="text-gray-300 mb-3 text-sm">{currentQuestion.question}</p>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => !showAnswerFeedback && handleAnswerSelect(i)}
                      disabled={showAnswerFeedback}
                      className={`w-full p-2 rounded-lg text-right text-sm transition-all ${
                        showAnswerFeedback && i === currentQuestion.correctAnswer
                          ? 'bg-green-500/20 border border-green-500'
                          : showAnswerFeedback && i === selectedAnswer && i !== currentQuestion.correctAnswer
                            ? 'bg-red-500/20 border border-red-500'
                            : 'hover:bg-white/5 bg-[#111118]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#240993] flex items-center justify-center text-xs">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flag Input */}
            {showFlagInput && (
              <div className="glass rounded-xl p-4">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-[#430D9E]" />
                  أدخل الرمز
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFlagSubmit()}
                    placeholder="FLAG{...}"
                    className="flex-1 bg-[#111118] border border-[#240993] rounded-lg px-3 py-2 text-white terminal-text text-sm"
                    dir="ltr"
                  />
                  <Button onClick={handleFlagSubmit} className="btn-cyber text-sm">
                    تحقق
                  </Button>
                </div>
              </div>
            )}

            {/* Hints */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  التلميحات
                </h4>
                <button 
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-[#430D9E] hover:underline"
                >
                  {showHint ? 'إخفاء' : 'عرض'}
                </button>
              </div>
              {showHint && (
                <ul className="space-y-1">
                  {currentPhase.hints.map((hint, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-[#430D9E]">•</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Panel - Network Map & Progress */}
          <div className="lg:col-span-4 space-y-4">
            {/* Network Map */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Network className="w-5 h-5 text-[#430D9E]" />
                خريطة الشبكة
              </h4>
              <div className="relative h-64 bg-[#0a0a0f] rounded-lg overflow-hidden">
                <div className="absolute inset-0 cyber-grid opacity-20" />
                
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  {networkNodes.map(node => 
                    node.connections.map(targetId => {
                      const target = networkNodes.find(n => n.id === targetId);
                      if (!target) return null;
                      return (
                        <line
                          key={`${node.id}-${targetId}`}
                          x1={`${node.x}%`}
                          y1={`${node.y}%`}
                          x2={`${target.x}%`}
                          y2={`${target.y}%`}
                          stroke={node.status === 'compromised' ? '#ff4444' : '#240993'}
                          strokeWidth="1.5"
                          strokeDasharray={node.status === 'attacking' ? '4,4' : '0'}
                          opacity="0.6"
                        />
                      );
                    })
                  )}
                </svg>

                {/* Nodes */}
                {networkNodes.map(node => (
                  <div
                    key={node.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    title={node.info}
                  >
                    <div className={`w-10 h-10 rounded-lg ${getNodeColor(node.status)} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                      {getNodeIcon(node.type)}
                    </div>
                    <p className="text-xs text-center mt-1 text-gray-400 whitespace-nowrap">{node.name}</p>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1a1a24] rounded text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {node.info}
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 text-xs">
                  <span className="flex items-center gap-1 px-1 rounded bg-[#111118]"><span className="w-2 h-2 rounded-full bg-green-500" />آمن</span>
                  <span className="flex items-center gap-1 px-1 rounded bg-[#111118]"><span className="w-2 h-2 rounded-full bg-red-500" />مخترق</span>
                  <span className="flex items-center gap-1 px-1 rounded bg-[#111118]"><span className="w-2 h-2 rounded-full bg-yellow-500" />مسح</span>
                  <span className="flex items-center gap-1 px-1 rounded bg-[#111118]"><span className="w-2 h-2 rounded-full bg-blue-500" />دفاع</span>
                </div>
              </div>
            </div>

            {/* Phase Progress */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#430D9E]" />
                تقدم المراحل
              </h4>
              <div className="space-y-2">
                {currentPhases.map((phase, i) => (
                  <div 
                    key={phase.id}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      i === currentPhaseIndex ? 'bg-[#24099330]' :
                      completedPhases.includes(phase.id) ? 'bg-green-500/10' : 'opacity-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                      completedPhases.includes(phase.id) ? 'bg-green-500' :
                      i === currentPhaseIndex ? 'bg-[#430D9E]' : 'bg-gray-700'
                    }`}>
                      {completedPhases.includes(phase.id) ? <CheckCircle className="w-3 h-3" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{phase.title}</p>
                      <p className="text-xs text-gray-400">{phase.points} نقطة</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Phase Progress */}
            <div className="glass rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">تقدم المرحلة</span>
                <span>{Math.round(phaseProgress)}%</span>
              </div>
              <Progress value={phaseProgress} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Story Dialog */}
      <Dialog open={showStory} onOpenChange={setShowStory}>
        <DialogContent className="glass-strong max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {currentScenario.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6">
            {currentScenario.story[storyIndex] && (
              <div className="text-center">
                <div className="text-6xl mb-4">{currentScenario.story[storyIndex].avatar}</div>
                <h3 className="text-lg font-bold mb-2">{currentScenario.story[storyIndex].character}</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {currentScenario.story[storyIndex].message}
                </p>
              </div>
            )}
            <div className="flex justify-center gap-2 mb-4">
              {currentScenario.story.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === storyIndex ? 'bg-[#430D9E]' : 'bg-gray-600'}`}
                />
              ))}
            </div>
            <Button onClick={nextStory} className="w-full btn-cyber">
              {storyIndex < currentScenario.story.length - 1 ? 'التالي' : 'ابدأ السيناريو'}
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="glass-strong border-green-500/50">
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">أحسنت!</h3>
            <p className="text-gray-300 mb-4">لقد أكملت المرحلة بنجاح</p>
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Flag className="w-6 h-6" />
              <span className="text-xl font-bold">{currentPhase.flag}</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-lg">+{currentPhase.points} نقطة</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tool Info Dialog */}
      <Dialog open={!!showToolInfo} onOpenChange={() => setShowToolInfo(null)}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {currentScenario.tools.find(t => t.id === showToolInfo)?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-300">
              {currentScenario.tools.find(t => t.id === showToolInfo)?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Command Help Dialog */}
      <Dialog open={!!showCommandHelp} onOpenChange={() => setShowCommandHelp(null)}>
        <DialogContent className="glass-strong max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Terminal className="w-6 h-6 text-[#430D9E]" />
              شرح الأمر
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4" dir="ltr">
            <code className="block terminal-text text-[#00ff88] bg-[#0a0a0f] p-4 rounded-lg text-lg">
              {showCommandHelp}
            </code>
            <div className="p-4 rounded-lg bg-[#24099320]">
              <h4 className="font-bold mb-2 text-cyan-400">What does this command do?</h4>
              <p className="text-gray-300">
                {showCommandHelp?.includes('nmap') && 'Nmap is a network scanner used to discover hosts and services on a computer network.'}
                {showCommandHelp?.includes('tcpdump') && 'Tcpdump is a packet analyzer that captures network traffic for analysis.'}
                {showCommandHelp?.includes('iptables') && 'IPTables is a firewall utility that allows you to configure IP packet filter rules.'}
                {showCommandHelp?.includes('msfconsole') && 'Metasploit console is a penetration testing framework for developing and executing exploit code.'}
                {showCommandHelp?.includes('tail') && 'Tail displays the last part of a file. Useful for monitoring log files in real-time.'}
                {showCommandHelp?.includes('netstat') && 'Netstat displays network connections, routing tables, and interface statistics.'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#111118]">
              <h4 className="font-bold mb-2 text-yellow-400">Example Usage</h4>
              <p className="text-gray-300 font-mono text-sm">{showCommandHelp}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DatabaseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  );
}
