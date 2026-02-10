import { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, CheckCircle, ChevronLeft, 
  Lightbulb, Play, RotateCcw, Terminal, Trophy, Lock, Unlock,
  FileText, Cpu, Globe, Search, HelpCircle, Target,
  GraduationCap, BarChart3, Clock, Award, Layers, Sparkles,
  Folder, FolderOpen, File
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ===== TYPES =====
interface Stage {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  missions: Mission[];
  theoryLesson: TheoryLesson;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  command: string;
  expectedOutput: string;
  hint: string;
  detailedExplanation: string;
  realWorldExample: string;
  points: number;
  helpText: string;
  commonMistakes: string[];
}

interface TheoryLesson {
  title: string;
  content: string;
  keyPoints: string[];
}

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string;
  timestamp: Date;
}

interface UserProgress {
  totalPoints: number;
  completedMissions: string[];
  currentStage: string;
  streak: number;
  timeSpent: number;
}

// ===== BASH LEARNING DATA =====
const stages: Stage[] = [
  {
    id: 'basics',
    title: 'الأساسيات',
    description: 'تعلم الأوامر الأساسية للتنقل في نظام Linux',
    icon: Terminal,
    color: 'from-blue-600 to-cyan-500',
    theoryLesson: {
      title: 'مقدمة في سطر الأوامر',
      content: `سطر الأوامر (Command Line) هو الواجهة النصية للتعامل مع نظام التشغيل. 
في عالم الأمن السيبراني، إتقان سطر الأوامر أمر أساسي لأنه:
- يوفر تحكماً دقيقاً في النظام
- يسمح بأتمتة المهام
- يتيح الوصول إلى أدوات غير متوفرة في الواجهة الرسومية`,
      keyPoints: [
        'الشل (Shell) هو المترجم بينك وبين نظام التشغيل',
        'Bash هو الأكثر شيوعاً في أنظمة Linux',
        'كل أمر يتبع بنية: command [options] [arguments]'
      ]
    },
    missions: [
      {
        id: 'basics_1',
        title: 'أمر pwd - معرفة الموقع',
        description: 'اعرض المسار الكامل للمجلد الحالي',
        command: 'pwd',
        expectedOutput: '/home/student',
        hint: 'pwd = Print Working Directory - يطبع المسار الحالي',
        detailedExplanation: 'أمر pwd يعرض المسار المطلق (Absolute Path) للمجلد الذي أنت فيه حالياً.',
        realWorldExample: 'عندما تكتشف ثغرة، تحتاج لمعرفة في أي مجلد يمكنك كتابة الملفات',
        points: 10,
        helpText: 'pwd',
        commonMistakes: ['كتابة PWD بالأحرف الكبيرة']
      },
      {
        id: 'basics_2',
        title: 'أمر ls - عرض المحتويات',
        description: 'اعرض جميع الملفات والمجلدات في الموقع الحالي',
        command: 'ls',
        expectedOutput: 'documents downloads pictures videos',
        hint: 'ls = List - يعرض قائمة المحتويات',
        detailedExplanation: 'أمر ls يعرض محتويات المجلد. يمكنك إضافة خيارات مثل -l للعرض التفصيلي و -a لعرض الملفات المخفية.',
        realWorldExample: 'عند البحث عن ملفات حساسة، تستخدم ls -la للبحث عن ملفات الإعدادات',
        points: 15,
        helpText: 'ls [options]',
        commonMistakes: ['نسيان الخيارات المفيدة مثل -la']
      },
      {
        id: 'basics_3',
        title: 'أمر cd - التنقل',
        description: 'انتقل إلى مجلد documents',
        command: 'cd documents',
        expectedOutput: '',
        hint: 'cd = Change Directory - تغيير المجلد',
        detailedExplanation: 'أمر cd ينقلك بين المجلدات: cd folder للدخول، cd .. للخروج، cd ~ للعودة للرئيسي.',
        realWorldExample: 'في اختبار الاختراق، تتنقل بين /etc و /var/www للبحث عن معلومات',
        points: 15,
        helpText: 'cd [directory]',
        commonMistakes: ['نسيان حالة الأحرف (Linux حساس)']
      },
      {
        id: 'basics_4',
        title: 'أمر mkdir - إنشاء مجلد',
        description: 'أنشئ مجلد جديد باسم projects',
        command: 'mkdir projects',
        expectedOutput: '',
        hint: 'mkdir = Make Directory - إنشاء مجلد',
        detailedExplanation: 'أمر mkdir ينشئ مجلدات جديدة. استخدم mkdir -p لإنشاء المسار كاملاً.',
        realWorldExample: 'تنشئ مجلدات منظمة لكل عملية اختبار اختراق',
        points: 20,
        helpText: 'mkdir [foldername]',
        commonMistakes: ['إنشاء مجلد باسم موجود']
      },
      {
        id: 'basics_5',
        title: 'أمر clear - مسح الشاشة',
        description: 'امسح شاشة الترمنال',
        command: 'clear',
        expectedOutput: '',
        hint: 'clear = مسح الشاشة للتركيز',
        detailedExplanation: 'أمر clear يمسح الشاشة ويعيد المؤشر للأعلى. مفيد للتركيز عند كثرة المخرجات.',
        realWorldExample: 'بعد تنفيذ أمر طويل المخرجات، تستخدم clear لترتيب الشاشة',
        points: 10,
        helpText: 'clear',
        commonMistakes: ['كتابة cls (من Windows)']
      }
    ]
  },
  {
    id: 'files',
    title: 'إدارة الملفات',
    description: 'التعامل مع الملفات والمجلدات',
    icon: FileText,
    color: 'from-green-600 to-emerald-500',
    theoryLesson: {
      title: 'نظام الملفات في Linux',
      content: `في Linux، كل شيء هو ملف. فهم نظام الملفات ضروري:
- الصلاحيات: read (r), write (w), execute (x)
- الملفات المخفية تبدأ بنقطة (.)
- المسارات المطلقة تبدأ بـ /`,
      keyPoints: [
        'الملفات المخفية تبدأ بنقطة (.)',
        'الصلاحيات تتحكم في من يمكنه فعل ماذا',
        'المسارات المطلقة تبدأ بـ /'
      ]
    },
    missions: [
      {
        id: 'files_1',
        title: 'أمر touch - إنشاء ملف',
        description: 'أنشئ ملفاً فارغاً باسم notes.txt',
        command: 'touch notes.txt',
        expectedOutput: '',
        hint: 'touch ينشئ ملفاً فارغاً أو يحدث وقت الملف',
        detailedExplanation: 'touch ينشئ ملفاً فارغاً. إذا كان الملف موجوداً، يحدث وقت التعديل.',
        realWorldExample: 'تنشئ ملفات log لتسجيل نتائج الفحص',
        points: 15,
        helpText: 'touch [filename]',
        commonMistakes: ['الخلط بين touch و create']
      },
      {
        id: 'files_2',
        title: 'أمر echo - كتابة نص',
        description: 'اكتب "Hello World" في الملف',
        command: 'echo "Hello World" > notes.txt',
        expectedOutput: '',
        hint: 'echo يطبع نصاً، > يعيد التوجيه للملف',
        detailedExplanation: 'echo يطبع نصاً. مع > تعيد التوجيه للملف (كتابة)، مع >> تلحق (إضافة).',
        realWorldExample: 'تسجل نتائج الأوامر في ملف: echo "scan complete" >> results.txt',
        points: 20,
        helpText: 'echo "text" > file',
        commonMistakes: ['نسيان علامات الاقتباس', 'الخلط بين > و >>']
      },
      {
        id: 'files_3',
        title: 'أمر cat - عرض المحتوى',
        description: 'اعرض محتوى الملف notes.txt',
        command: 'cat notes.txt',
        expectedOutput: 'Hello World',
        hint: 'cat = concatenate - عرض محتوى الملف',
        detailedExplanation: 'cat يعرض محتوى الملف. يمكن دمج ملفات: cat file1 file2 > combined.',
        realWorldExample: 'تعرض ملفات الإعدادات: cat /etc/passwd',
        points: 15,
        helpText: 'cat [filename]',
        commonMistakes: ['cat لملفات ضخمة (استخدم less)']
      },
      {
        id: 'files_4',
        title: 'أمر cp - نسخ ملف',
        description: 'انسخ notes.txt إلى backup.txt',
        command: 'cp notes.txt backup.txt',
        expectedOutput: '',
        hint: 'cp = copy - نسخ ملف أو مجلد',
        detailedExplanation: 'cp ينسخ الملفات. استخدم cp -r للمجلدات و cp -p للحفاظ على الصلاحيات.',
        realWorldExample: 'تنسخ ملفات مهمة قبل التعديل: cp config.php config.php.bak',
        points: 20,
        helpText: 'cp [source] [destination]',
        commonMistakes: ['نسيان -r للمجلدات']
      },
      {
        id: 'files_5',
        title: 'أمر mv - نقل/إعادة تسمية',
        description: 'أعد تسمية الملف إلى important.txt',
        command: 'mv notes.txt important.txt',
        expectedOutput: '',
        hint: 'mv = move - نقل أو إعادة تسمية',
        detailedExplanation: 'mv ينقل أو يعيد تسمية الملفات. mv old new للتسمية، mv file folder/ للنقل.',
        realWorldExample: 'تنظم الملفات: mv scan_results.txt archive/',
        points: 20,
        helpText: 'mv [source] [destination]',
        commonMistakes: ['الكتابة فوق ملف موجود']
      },
      {
        id: 'files_6',
        title: 'أمر rm - حذف ملف',
        description: 'احذف الملف backup.txt',
        command: 'rm backup.txt',
        expectedOutput: '',
        hint: 'rm = remove - احذر! هذا الأمر خطير',
        detailedExplanation: 'rm يحذف الملفات نهائياً (لا يوجد سلة محذوفات!). rm -r للمجلدات.',
        realWorldExample: 'تحذف ملفات مؤقتة: rm -rf /tmp/old_files/',
        points: 25,
        helpText: 'rm [filename]',
        commonMistakes: ['rm -rf / (لا تفعلها أبداً!)']
      }
    ]
  },
  {
    id: 'exploration',
    title: 'الاستكشاف',
    description: 'أوامر البحث والاستكشاف المتقدمة',
    icon: Search,
    color: 'from-purple-600 to-violet-500',
    theoryLesson: {
      title: 'البحث والاستكشاف',
      content: `في اختبار الاختراق، البحث عن الملفات والمعلومات أمر أساسي:
- find: البحث عن ملفات في الوقت الفعلي
- grep: البحث في المحتوى باستخدام أنماط`,
      keyPoints: [
        'find يبحث في الوقت الفعلي (أبطأ لكن دقيق)',
        'grep يستخدم Regular Expressions',
        'يمكن دمج find مع grep للبحث في المحتوى'
      ]
    },
    missions: [
      {
        id: 'explore_1',
        title: 'أمر find - البحث عن ملفات',
        description: 'ابحث عن جميع ملفات .txt',
        command: 'find . -name "*.txt"',
        expectedOutput: './important.txt\n./documents/file.txt',
        hint: 'find [path] -name "pattern"',
        detailedExplanation: 'find يبحث عن ملفات. find . -name "*.txt" للملفات النصية، -size +100M للملفات الكبيرة.',
        realWorldExample: 'تبحث عن ملفات الإعدادات: find /etc -name "*.conf"',
        points: 25,
        helpText: 'find [path] -name "pattern"',
        commonMistakes: ['نسيان علامات الاقتباس']
      },
      {
        id: 'explore_2',
        title: 'أمر grep - البحث في المحتوى',
        description: 'ابحث عن كلمة "password" في الملفات',
        command: 'grep "password" important.txt',
        expectedOutput: 'password=secret123',
        hint: 'grep "pattern" [file]',
        detailedExplanation: 'grep يبحث في محتوى الملفات. -i لعدم حساسية الحالة، -r للبحث المتكرر، -n لأرقام الأسطر.',
        realWorldExample: 'تبحث عن كلمات سر: grep -r "password" /var/www/',
        points: 25,
        helpText: 'grep [options] "pattern" [file]',
        commonMistakes: ['البحث بدون -r في مجلدات']
      },
      {
        id: 'explore_3',
        title: 'أمر head - عرض البداية',
        description: 'اعرض أول 5 أسطر من الملف',
        command: 'head -n 5 important.txt',
        expectedOutput: 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5',
        hint: 'head -n [number] [file]',
        detailedExplanation: 'head يعرض بداية الملف. مفيد لملفات السجلات الكبيرة.',
        realWorldExample: 'تعرض أحدث الإدخالات: head -n 20 /var/log/auth.log',
        points: 20,
        helpText: 'head -n [number] [file]',
        commonMistakes: ['نسيان -n']
      },
      {
        id: 'explore_4',
        title: 'أمر tail - عرض النهاية',
        description: 'اعرض آخر 10 أسطر من الملف',
        command: 'tail -n 10 important.txt',
        expectedOutput: 'Line 91\nLine 92\n...',
        hint: 'tail -f لمتابعة الملف في الوقت الفعلي',
        detailedExplanation: 'tail يعرض نهاية الملف. tail -f يتابع التحديثات (مهم جداً!).',
        realWorldExample: 'تراقب سجلات الدخول: tail -f /var/log/auth.log',
        points: 25,
        helpText: 'tail [options] [file]',
        commonMistakes: ['عدم معرفة -f']
      },
      {
        id: 'explore_5',
        title: 'أمر wc - عد الكلمات',
        description: 'اعرض إحصائيات الملف',
        command: 'wc important.txt',
        expectedOutput: '10  50 300 important.txt',
        hint: 'wc = word count - عدد الأسطر والكلمات والأحرف',
        detailedExplanation: 'wc يحسب إحصائيات: أسطر، كلمات، أحرف. wc -l للأسطر فقط.',
        realWorldExample: 'تعدد أسطر الكود: wc -l exploit.py',
        points: 20,
        helpText: 'wc [options] [file]',
        commonMistakes: []
      }
    ]
  },
  {
    id: 'processes',
    title: 'إدارة العمليات',
    description: 'مراقبة وإدارة العمليات',
    icon: Cpu,
    color: 'from-orange-600 to-amber-500',
    theoryLesson: {
      title: 'العمليات في Linux',
      content: `كل برنامج يعمل في Linux هو عملية (Process):
- PID: معرف العملية
- PPID: معرف العملية الأب
- CPU/Memory: استهلاك الموارد`,
      keyPoints: [
        'ps تعرض لقطة من العمليات',
        'top تعرض في الوقت الفعلي',
        'kill ترسل إشارة للعملية'
      ]
    },
    missions: [
      {
        id: 'proc_1',
        title: 'أمر ps - عرض العمليات',
        description: 'اعرض العمليات الجارية',
        command: 'ps',
        expectedOutput: 'PID TTY          TIME CMD',
        hint: 'ps = process status',
        detailedExplanation: 'ps يعرض العمليات الحالية للمستخدم.',
        realWorldExample: 'تتحقق من البرامج العاملة',
        points: 20,
        helpText: 'ps',
        commonMistakes: ['ps فقط يعرض العمليات الحالية']
      },
      {
        id: 'proc_2',
        title: 'أمر ps aux - عرض شامل',
        description: 'اعرض جميع العمليات بتفاصيل كاملة',
        command: 'ps aux',
        expectedOutput: 'USER PID %CPU %MEM COMMAND',
        hint: 'aux = all users + user-oriented + without TTY',
        detailedExplanation: 'ps aux يعرض جميع العمليات لجميع المستخدمين مع استهلاك الموارد.',
        realWorldExample: 'تبحث عن عمليات مشبوهة: ps aux | grep suspicious',
        points: 25,
        helpText: 'ps aux',
        commonMistakes: []
      },
      {
        id: 'proc_3',
        title: 'أمر top - مراقبة تفاعلية',
        description: 'راقب العمليات في الوقت الفعلي',
        command: 'top',
        expectedOutput: 'PID USER PR NI VIRT RES SHR',
        hint: 'اضغط q للخروج من top',
        detailedExplanation: 'top يعرض العمليات واستهلاك الموارد في الوقت الفعلي.',
        realWorldExample: 'تراقب استهلاك CPU: top',
        points: 25,
        helpText: 'top',
        commonMistakes: ['عدم معرفة كيفية الخروج (اضغط q)']
      },
      {
        id: 'proc_4',
        title: 'أمر kill - إنهاء عملية',
        description: 'أنهِ العملية ذات المعرف 1234',
        command: 'kill 1234',
        expectedOutput: '',
        hint: 'kill [PID] - يرسل إشارة SIGTERM',
        detailedExplanation: 'kill يرسل إشارة للعملية: SIGTERM للإنهاء اللطيف، SIGKILL للإجبار.',
        realWorldExample: 'توقف برنامجاً علق: kill -9 1234',
        points: 30,
        helpText: 'kill [PID]',
        commonMistakes: ['kill -9 دون محاولة عادية']
      },
      {
        id: 'proc_5',
        title: 'أمر df - مساحة القرص',
        description: 'اعرض مساحة القرص المتوفرة',
        command: 'df -h',
        expectedOutput: 'Filesystem Size Used Avail',
        hint: '-h = human readable',
        detailedExplanation: 'df يعرض مساحة القرص. -h يجعلها مقروءة (GB, MB).',
        realWorldExample: 'تتحقق من المساحة: df -h',
        points: 20,
        helpText: 'df -h',
        commonMistakes: ['df بدون -h (صعب القراءة)']
      }
    ]
  },
  {
    id: 'network',
    title: 'الشبكات',
    description: 'أوامر الشبكات والاتصال',
    icon: Globe,
    color: 'from-cyan-600 to-blue-500',
    theoryLesson: {
      title: 'الشبكات في Linux',
      content: `Linux يوفر أدوات قوية للشبكات:
- ifconfig/ip: إعدادات الواجهات
- ping: اختبار الاتصال
- netstat/ss: عرض الاتصالات`,
      keyPoints: [
        'كل واجهة لها IP وMAC address',
        'المنافذ (Ports) تصل بين التطبيقات',
        'netstat يعرض الاتصالات النشطة'
      ]
    },
    missions: [
      {
        id: 'net_1',
        title: 'أمر ifconfig - إعدادات الشبكة',
        description: 'اعرض إعدادات واجهات الشبكة',
        command: 'ifconfig',
        expectedOutput: 'eth0: flags=4163<UP> inet 192.168.1.100',
        hint: 'ifconfig = interface configuration',
        detailedExplanation: 'ifconfig يعرض ويعدل إعدادات واجهات الشبكة.',
        realWorldExample: 'تتحقق من IP: ifconfig | grep inet',
        points: 25,
        helpText: 'ifconfig',
        commonMistakes: ['ifconfig يحتاج صلاحيات root للتعديل']
      },
      {
        id: 'net_2',
        title: 'أمر ping - اختبار الاتصال',
        description: 'اختبر الاتصال بـ google.com',
        command: 'ping google.com',
        expectedOutput: '64 bytes from ... time=15.3 ms',
        hint: 'Ctrl+C للتوقف',
        detailedExplanation: 'ping يرسل حزم ICMP لاختبار الاتصال ووقت الاستجابة.',
        realWorldExample: 'تختبر اتصالك: ping 8.8.8.8',
        points: 20,
        helpText: 'ping [host]',
        commonMistakes: ['نسيان Ctrl+C للتوقف']
      },
      {
        id: 'net_3',
        title: 'أمر netstat - إحصائيات الشبكة',
        description: 'اعرض الاتصالات والمنافذ المفتوحة',
        command: 'netstat -tuln',
        expectedOutput: 'Proto Recv-Q Send-Q Local Address',
        hint: '-tuln = TCP + UDP + listening + numeric',
        detailedExplanation: 'netstat يعرض إحصائيات الشبكة. -t للTCP، -u للUDP، -l للlistening، -n للأرقام.',
        realWorldExample: 'تبحث عن منافذ مفتوحة: netstat -tuln | grep :80',
        points: 30,
        helpText: 'netstat [options]',
        commonMistakes: ['نسيان الخيارات المناسبة']
      },
      {
        id: 'net_4',
        title: 'أمر curl - جلب المحتوى',
        description: 'احصل على محتوى موقع',
        command: 'curl https://example.com',
        expectedOutput: '<!DOCTYPE html>...',
        hint: 'curl [URL] - جلب محتوى URL',
        detailedExplanation: 'curl ينقل البيانات من/إلى URLs. -I للheaders، -o لحفظ للملف.',
        realWorldExample: 'تختبر API: curl https://api.example.com/data',
        points: 30,
        helpText: 'curl [options] [URL]',
        commonMistakes: ['عدم فهم HTTP methods']
      },
      {
        id: 'net_5',
        title: 'أمر wget - تحميل الملفات',
        description: 'حمّل ملفاً من الإنترنت',
        command: 'wget https://example.com/file.txt',
        expectedOutput: 'Saving to: file.txt',
        hint: 'wget [URL] - تحميل ملف',
        detailedExplanation: 'wget يحمّل الملفات. -r للتحميل المتكرر، -c لاستكمال التحميل.',
        realWorldExample: 'تحمل أداة: wget https://tools.example.com/tool.sh',
        points: 30,
        helpText: 'wget [options] [URL]',
        commonMistakes: ['التحميل بدون التحقق من المصدر']
      }
    ]
  }
];

// Simulated file system
const initialFileSystem: Record<string, string[]> = {
  '/home/student': ['documents', 'downloads', 'pictures', 'videos'],
  '/home/student/documents': ['notes.txt', 'important.txt'],
  '/home/student/downloads': [],
  '/home/student/pictures': [],
  '/home/student/videos': [],
};

interface BashSimulatorProps {
  onBack: () => void;
}

export default function BashSimulator({ onBack }: BashSimulatorProps) {
  // State
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [showTheory, setShowTheory] = useState(false);
  const [progress, setProgress] = useState<UserProgress>({
    totalPoints: 0,
    completedMissions: [],
    currentStage: 'basics',
    streak: 0,
    timeSpent: 0
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentDir, setCurrentDir] = useState('/home/student');
  const [files, setFiles] = useState<Record<string, string[]>>({ ...initialFileSystem });
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    '/home/student/documents/notes.txt': 'Hello World',
    '/home/student/documents/important.txt': 'password=secret123\nLine 2\nLine 3\nLine 4\nLine 5'
  });
  const [showStageComplete, setShowStageComplete] = useState(false);
  const [unlockedStages, setUnlockedStages] = useState<string[]>(['basics']);
  const [showHint, setShowHint] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStage = stages[currentStageIndex];
  const currentMission = currentStage.missions[currentMissionIndex];

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

  // Check stage unlock
  useEffect(() => {
    stages.forEach((stage, index) => {
      if (index > 0) {
        const prevStage = stages[index - 1];
        const prevCompleted = prevStage.missions.every(m => progress.completedMissions.includes(m.id));
        if (prevCompleted && !unlockedStages.includes(stage.id)) {
          setUnlockedStages(prev => [...prev, stage.id]);
        }
      }
    });
  }, [progress.completedMissions, unlockedStages]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const addTerminalLine = (type: TerminalLine['type'], content: string) => {
    setTerminalLines(prev => [...prev, { type, content, timestamp: new Date() }]);
  };

  const simulateCommand = (cmd: string): string => {
    const parts = cmd.trim().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case 'pwd': return currentDir;
      
      case 'ls': {
        const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
        const dirContents = files[currentDir] || [];
        
        if (longFormat) {
          return `drwxr-xr-x  5 student student 4096 Jan 15 10:30 .\ndrwxr-xr-x  3 root   root   4096 Jan 15 09:00 ..\n${dirContents.map(f => `-rw-r--r--  1 student student  220 Jan 15 10:00 ${f}`).join('\n')}`;
        }
        return dirContents.join('  ') || 'المجلد فارغ';
      }
      
      case 'cd': {
        if (args.length === 0 || args[0] === '~') {
          setCurrentDir('/home/student');
          return '';
        }
        const targetDir = args[0];
        if (targetDir === '..') {
          const parent = currentDir.split('/').slice(0, -1).join('/') || '/';
          setCurrentDir(parent);
          return '';
        }
        const fullPath = targetDir.startsWith('/') ? targetDir : `${currentDir}/${targetDir}`;
        if (files[fullPath]) {
          setCurrentDir(fullPath);
          return '';
        }
        return `bash: cd: ${targetDir}: No such file or directory`;
      }
      
      case 'mkdir': {
        if (args.length === 0) return 'mkdir: missing operand';
        const newDir = args[0];
        const newPath = newDir.startsWith('/') ? newDir : `${currentDir}/${newDir}`;
        if (files[newPath]) {
          return `mkdir: cannot create directory '${newDir}': File exists`;
        }
        setFiles(prev => ({ ...prev, [newPath]: [], [currentDir]: [...(prev[currentDir] || []), newDir] }));
        return `Directory created: ${newDir}`;
      }
      
      case 'touch': {
        if (args.length === 0) return 'touch: missing file operand';
        const newFile = args[0];
        if (files[currentDir]?.includes(newFile)) {
          return `File updated: ${newFile}`;
        }
        setFiles(prev => ({ ...prev, [currentDir]: [...(prev[currentDir] || []), newFile] }));
        setFileContents(prev => ({ ...prev, [`${currentDir}/${newFile}`]: '' }));
        return `File created: ${newFile}`;
      }
      
      case 'echo': {
        if (args.includes('>')) {
          const redirectIndex = args.indexOf('>');
          const text = args.slice(0, redirectIndex).join(' ').replace(/"/g, '');
          const fileName = args[redirectIndex + 1];
          setFileContents(prev => ({ ...prev, [`${currentDir}/${fileName}`]: text }));
          return `Written to ${fileName}: "${text}"`;
        }
        return args.join(' ').replace(/"/g, '');
      }
      
      case 'cat': {
        if (args.length === 0) return 'cat: missing file operand';
        const catFile = args[0];
        const catPath = catFile.startsWith('/') ? catFile : `${currentDir}/${catFile}`;
        const content = fileContents[catPath];
        if (content !== undefined) {
          return content || '(ملف فارغ)';
        }
        return `cat: ${catFile}: No such file or directory`;
      }
      
      case 'cp': {
        if (args.length < 2) return 'cp: missing file operand';
        const [src, dest] = args;
        const srcPath = src.startsWith('/') ? src : `${currentDir}/${src}`;
        const destPath = dest.startsWith('/') ? dest : `${currentDir}/${dest}`;
        if (fileContents[srcPath] !== undefined) {
          setFileContents(prev => ({ ...prev, [destPath]: prev[srcPath] }));
          setFiles(prev => ({ ...prev, [currentDir]: [...(prev[currentDir] || []), dest] }));
          return `Copied: ${src} -> ${dest}`;
        }
        return `cp: cannot stat '${src}': No such file or directory`;
      }
      
      case 'mv': {
        if (args.length < 2) return 'mv: missing file operand';
        const [mvSrc, mvDest] = args;
        if (files[currentDir]?.includes(mvSrc)) {
          setFiles(prev => ({
            ...prev,
            [currentDir]: prev[currentDir].map(f => f === mvSrc ? mvDest : f)
          }));
          const srcPath = `${currentDir}/${mvSrc}`;
          const destPath = `${currentDir}/${mvDest}`;
          setFileContents(prev => {
            const newContents = { ...prev, [destPath]: prev[srcPath] || '' };
            delete newContents[srcPath];
            return newContents;
          });
          return `Renamed: ${mvSrc} -> ${mvDest}`;
        }
        return `mv: cannot stat '${mvSrc}': No such file or directory`;
      }
      
      case 'rm': {
        if (args.length === 0) return 'rm: missing operand';
        const rmFile = args[0];
        const rmPath = rmFile.startsWith('/') ? rmFile : `${currentDir}/${rmFile}`;
        setFileContents(prev => {
          const newContents = { ...prev };
          delete newContents[rmPath];
          return newContents;
        });
        setFiles(prev => ({
          ...prev,
          [currentDir]: prev[currentDir].filter(f => f !== rmFile)
        }));
        return `Removed: ${rmFile}`;
      }
      
      case 'find': {
        if (args.length < 3) return 'Usage: find [path] -name "pattern"';
        const pattern = args[2].replace(/"/g, '');
        const results: string[] = [];
        Object.entries(files).forEach(([path, fileList]) => {
          fileList.forEach(file => {
            if (pattern === '*.txt' && file.endsWith('.txt')) {
              results.push(`${path}/${file}`.replace('//', '/'));
            }
          });
        });
        return results.join('\n') || 'No files found';
      }
      
      case 'grep': {
        if (args.length < 2) return 'grep: missing operand';
        const searchText = args[0].replace(/"/g, '');
        const grepFile = args[1];
        const grepPath = grepFile.startsWith('/') ? grepFile : `${currentDir}/${grepFile}`;
        const content = fileContents[grepPath] || '';
        const matchingLines = content.split('\n').filter(line => line.includes(searchText));
        if (matchingLines.length > 0) {
          return matchingLines.join('\n');
        }
        return `No matches found for "${searchText}"`;
      }
      
      case 'head': {
        if (args.length === 0) return 'head: missing file operand';
        const nIndex = args.findIndex(a => a === '-n');
        const numLines = nIndex >= 0 ? parseInt(args[nIndex + 1]) || 10 : 10;
        const headFile = args[args.length - 1];
        const headPath = headFile.startsWith('/') ? headFile : `${currentDir}/${headFile}`;
        const content = fileContents[headPath] || '';
        return content.split('\n').slice(0, numLines).join('\n');
      }
      
      case 'tail': {
        if (args.length === 0) return 'tail: missing file operand';
        const tnIndex = args.findIndex(a => a === '-n');
        const tnumLines = tnIndex >= 0 ? parseInt(args[tnIndex + 1]) || 10 : 10;
        const tailFile = args[args.length - 1];
        const tailPath = tailFile.startsWith('/') ? tailFile : `${currentDir}/${tailFile}`;
        const tcontent = fileContents[tailPath] || '';
        return tcontent.split('\n').slice(-tnumLines).join('\n');
      }
      
      case 'wc': {
        if (args.length === 0) return 'wc: missing file operand';
        const wcFile = args[0];
        const wcPath = wcFile.startsWith('/') ? wcFile : `${currentDir}/${wcFile}`;
        const wcContent = fileContents[wcPath] || '';
        const lines = wcContent.split('\n').length;
        const words = wcContent.split(/\s+/).filter(w => w).length;
        const chars = wcContent.length;
        return `${lines} ${words} ${chars} ${wcFile}`;
      }
      
      case 'ps': {
        if (args.includes('aux')) {
          return `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1  18532  3200 ?        Ss   09:00   0:01 /sbin/init
student   1234  0.5  2.0  45200  8200 pts/0    S+   10:00   0:05 bash
student   5678  0.1  1.5  32100  6100 pts/0    R+   10:30   0:01 ps aux`;
        }
        return `  PID TTY          TIME CMD
 1234 pts/0    00:00:05 bash
 5678 pts/0    00:00:00 ps`;
      }
      
      case 'top': {
        return `top - 10:30:00 up 2 days, 1:30, 1 user, load average: 0.50, 0.45, 0.40
Tasks: 150 total,   1 running, 149 sleeping,   0 stopped,   0 zombie
%Cpu(s):  5.0 us,  2.0 sy,  0.0 ni, 92.0 id,  1.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :   8000.0 total,   2000.0 free,   4000.0 used,   2000.0 buff/cache
MiB Swap:   2000.0 total,   1800.0 free,    200.0 used.`;
      }
      
      case 'kill': {
        if (args.length === 0) return 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ...';
        return `Sent termination signal to process ${args[0]}`;
      }
      
      case 'df': {
        if (args.includes('-h')) {
          return `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   20G   28G  42% /
tmpfs           4.0G  500M  3.5G  13% /run`;
        }
        return '';
      }
      
      case 'ifconfig': {
        return `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::20c:29ff:fe9c:1234  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:9c:12:34  txqueuelen 1000  (Ethernet)`;
      }
      
      case 'ping': {
        if (args.length === 0) return 'ping: usage error: Destination address required';
        const host = args[0];
        return `PING ${host} (142.250.80.46) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=117 time=15.3 ms
64 bytes from ${host}: icmp_seq=2 ttl=117 time=14.8 ms
--- ${host} ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms`;
      }
      
      case 'netstat': {
        if (args.includes('-tuln')) {
          return `Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp6       0      0 :::22                   :::*                    LISTEN`;
        }
        return '';
      }
      
      case 'curl': {
        if (args.length === 0) return 'curl: try \'curl --help\' for more information';
        return `<!DOCTYPE html>
<html>
<head><title>Example Domain</title></head>
<body>
<h1>Example Domain</h1>
<p>This domain is for illustrative examples.</p>
</body>
</html>`;
      }
      
      case 'wget': {
        if (args.length === 0) return 'wget: missing URL';
        const url = args[0];
        return `--2025-01-15 10:30:00--  ${url}
Resolving example.com... 93.184.216.34
Connecting to example.com|93.184.216.34|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1256 (1.2K)
Saving to: 'file.txt'

file.txt           100%[===================>]   1.23K  --.-KB/s
2025-01-15 10:30:01 (1.23 MB/s) - 'file.txt' saved [1256/1256]`;
      }
      
      case 'help': {
        return `Available commands:
  pwd, ls, cd, mkdir, touch, echo, cat
  cp, mv, rm, find, grep, head, tail, wc
  ps, top, kill, df, ifconfig, ping
  netstat, curl, wget, clear, help`;
      }
      
      case 'clear': {
        setTerminalLines([]);
        return '';
      }
      
      default:
        return `bash: ${command}: command not found. Type 'help' for available commands.`;
    }
  };

  const handleCommand = () => {
    if (!input.trim()) return;

    const cmd = input.trim();
    addTerminalLine('input', `${currentDir}$ ${cmd}`);
    
    const output = simulateCommand(cmd);
    if (output) {
      addTerminalLine('output', output);
    }

    // Check if command matches mission
    const missionCmd = currentMission.command.split(' ')[0];
    const inputCmd = cmd.split(' ')[0];
    
    if (inputCmd === missionCmd || cmd === currentMission.command) {
      // Check if the command was executed successfully (no error)
      if (!output?.includes('No such file') && !output?.includes('cannot') && !output?.includes('missing')) {
        handleMissionSuccess();
      }
    }

    setInput('');
  };

  const handleMissionSuccess = () => {
    if (progress.completedMissions.includes(currentMission.id)) {
      addTerminalLine('info', '✓ Mission already completed!');
      return;
    }

    setShowSuccess(true);
    
    const newPoints = progress.totalPoints + currentMission.points;
    const newStreak = progress.streak + 1;
    
    setProgress(prev => ({
      ...prev,
      totalPoints: newPoints,
      completedMissions: [...prev.completedMissions, currentMission.id],
      streak: newStreak
    }));

    // Auto advance after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      
      if (currentMissionIndex < currentStage.missions.length - 1) {
        // Next mission in same stage
        setCurrentMissionIndex(prev => prev + 1);
        setTerminalLines([]);
        addTerminalLine('info', `🎯 Mission ${currentMissionIndex + 2}: ${currentStage.missions[currentMissionIndex + 1].title}`);
        addTerminalLine('info', `Task: ${currentStage.missions[currentMissionIndex + 1].description}`);
      } else if (currentStageIndex < stages.length - 1) {
        // Stage complete - check if next stage unlocked
        const nextStageIndex = currentStageIndex + 1;
        if (unlockedStages.includes(stages[nextStageIndex].id)) {
          setShowStageComplete(true);
        } else {
          addTerminalLine('info', '🎉 Stage completed! Next stage locked - complete all missions to unlock.');
        }
      } else {
        // All stages complete
        addTerminalLine('info', '🏆 Congratulations! You have completed all stages!');
      }
    }, 2000);
  };

  const nextMission = () => {
    if (currentMissionIndex < currentStage.missions.length - 1) {
      setCurrentMissionIndex(prev => prev + 1);
    } else if (currentStageIndex < stages.length - 1) {
      const nextStageIndex = currentStageIndex + 1;
      if (unlockedStages.includes(stages[nextStageIndex].id)) {
        setCurrentStageIndex(nextStageIndex);
        setCurrentMissionIndex(0);
      }
    }
    setShowStageComplete(false);
    setTerminalLines([]);
  };

  const selectStage = (index: number) => {
    if (unlockedStages.includes(stages[index].id)) {
      setCurrentStageIndex(index);
      setCurrentMissionIndex(0);
      setTerminalLines([]);
    }
  };

  const getLevel = () => {
    const totalMissions = stages.reduce((acc, s) => acc + s.missions.length, 0);
    const completed = progress.completedMissions.length;
    const percentage = (completed / totalMissions) * 100;
    
    if (percentage < 20) return { name: 'مبتدئ', color: 'bg-slate-500' };
    if (percentage < 40) return { name: 'متعلم', color: 'bg-blue-500' };
    if (percentage < 60) return { name: 'متوسط', color: 'bg-green-500' };
    if (percentage < 80) return { name: 'متقدم', color: 'bg-purple-500' };
    return { name: 'خبير', color: 'bg-yellow-500' };
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}س ${mins}د` : `${mins}د`;
  };

  const level = getLevel();
  const totalMissions = stages.reduce((acc, s) => acc + s.missions.length, 0);
  const completedMissions = progress.completedMissions.length;
  const stageProgress = ((currentMissionIndex + 1) / currentStage.missions.length) * 100;

  // Get current directory contents for GUI
  const currentDirContents = files[currentDir] || [];

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
                <span className="font-bold">{progress.totalPoints}</span>
                <span className="text-gray-400 text-sm">نقطة</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#24099320]">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-bold">{progress.streak}</span>
                <span className="text-gray-400 text-sm">تسلسل</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#24099320]">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-400 text-sm">{formatTime(progress.timeSpent)}</span>
              </div>
              <Badge className={`${level.color} text-white px-3 py-1`}>
                {level.name}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar - Stages */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass rounded-xl p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#430D9E]" />
                المراحل التعليمية
              </h3>
              <div className="space-y-2">
                {stages.map((stage, index) => {
                  const isUnlocked = unlockedStages.includes(stage.id);
                  const isActive = index === currentStageIndex;
                  const StageIcon = stage.icon;
                  const completedCount = stage.missions.filter(m => progress.completedMissions.includes(m.id)).length;
                  const isCompleted = completedCount === stage.missions.length;
                  
                  return (
                    <button
                      key={stage.id}
                      onClick={() => selectStage(index)}
                      disabled={!isUnlocked}
                      className={`w-full text-right p-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#240993] to-[#430D9E] text-white' 
                          : isCompleted
                            ? 'bg-green-500/20 border border-green-500/50'
                            : isUnlocked 
                              ? 'hover:bg-white/5 text-gray-300 bg-[#111118]' 
                              : 'opacity-50 cursor-not-allowed text-gray-500 bg-[#0a0a0f]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isCompleted ? 'bg-green-500' : isActive ? 'bg-white/20' : 'bg-[#240993]'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : <StageIcon className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{stage.title}</p>
                          <p className="text-xs opacity-70">{completedCount}/{stage.missions.length} مهام</p>
                        </div>
                        {!isUnlocked && <Lock className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Overview */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#430D9E]" />
                نظرة عامة
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">التقدم الكلي</span>
                    <span>{Math.round((completedMissions / totalMissions) * 100)}%</span>
                  </div>
                  <Progress value={(completedMissions / totalMissions) * 100} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-[#111118] rounded-lg p-2">
                    <p className="text-2xl font-bold text-[#430D9E]">{completedMissions}</p>
                    <p className="text-xs text-gray-400">مهام مكتملة</p>
                  </div>
                  <div className="bg-[#111118] rounded-lg p-2">
                    <p className="text-2xl font-bold text-green-400">{totalMissions - completedMissions}</p>
                    <p className="text-xs text-gray-400">مهام متبقية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Terminal & Mission */}
          <div className="lg:col-span-5 space-y-4">
            {/* Mission Card */}
            <div className="gradient-border p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`bg-gradient-to-r ${currentStage.color} text-white`}>
                      المرحلة {currentStageIndex + 1}
                    </Badge>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      المهمة {currentMissionIndex + 1} من {currentStage.missions.length}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold">{currentMission.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-lg">{currentMission.points}</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{currentMission.description}</p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTheory(true)}
                  className="border-[#430D9E] hover:bg-[#430D9E]/20"
                >
                  <GraduationCap className="w-4 h-4 ml-2" />
                  الدرس النظري
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="border-yellow-500/50 hover:bg-yellow-500/20"
                >
                  <Lightbulb className="w-4 h-4 ml-2" />
                  تلميح
                </Button>
              </div>
              
              {showHint && (
                <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-sm text-yellow-200">{currentMission.hint}</p>
                </div>
              )}
            </div>

            {/* Terminal */}
            <div className="terminal rounded-xl overflow-hidden">
              <div className="bg-[#1a1a24] px-4 py-2 flex items-center justify-between border-b border-[#00ff8820]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-500 terminal-text">student@kali: ~</span>
                <button 
                  onClick={() => setTerminalLines([])}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              
              <div 
                ref={terminalRef}
                className="p-4 h-64 overflow-y-auto terminal-text text-sm"
              >
                {terminalLines.length === 0 && (
                  <div className="text-gray-500">
                    <p className="text-[#00ff88] mb-2">╔════════════════════════════════════════╗</p>
                    <p className="text-[#00ff88] mb-2">║  TuSecurity Bash Simulator v2.0       ║</p>
                    <p className="text-[#00ff88] mb-4">╚════════════════════════════════════════╝</p>
                    <p className="text-gray-400 mb-2">اكتب <span className="text-[#00d4ff]">help</span> لعرض الأوامر المتاحة</p>
                    <p className="text-gray-400">المهمة الحالية: {currentMission.description}</p>
                  </div>
                )}
                {terminalLines.map((line, i) => (
                  <div 
                    key={i} 
                    className={`mb-1 ${
                      line.type === 'input' ? 'text-[#00d4ff]' :
                      line.type === 'error' ? 'text-[#ff4444]' :
                      line.type === 'success' ? 'text-[#00ff88]' :
                      line.type === 'info' ? 'text-[#ffd700]' :
                      'text-[#e0e0e0]'
                    }`}
                  >
                    {line.content}
                  </div>
                ))}
              </div>
              
              <div className="p-3 bg-[#0d0d12] border-t border-[#00ff8820]">
                <div className="flex items-center gap-2">
                  <span className="text-[#00ff88] terminal-text text-sm">{currentDir}$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                    className="flex-1 bg-transparent border-none outline-none text-white terminal-text text-sm"
                    placeholder="اكتب الأمر هنا..."
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

            {/* Mission Progress */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">تقدم المرحلة الحالية</span>
                <span className="text-sm">{Math.round(stageProgress)}%</span>
              </div>
              <Progress value={stageProgress} className="h-2" />
            </div>
          </div>

          {/* Right Panel - File Explorer & Help */}
          <div className="lg:col-span-4 space-y-4">
            {/* File Explorer GUI */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#430D9E]" />
                مستكشف الملفات
              </h4>
              <div className="bg-[#0a0a0f] rounded-lg p-3">
                {/* Current Path */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#24099340]">
                  <Folder className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-400 font-mono">{currentDir}</span>
                </div>
                
                {/* Directory Contents */}
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {/* Parent Directory */}
                  {currentDir !== '/' && (
                    <button 
                      onClick={() => {
                        const parent = currentDir.split('/').slice(0, -1).join('/') || '/';
                        setCurrentDir(parent);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded hover:bg-[#24099330] transition-colors text-left"
                    >
                      <Folder className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">..</span>
                    </button>
                  )}
                  
                  {/* Files and Folders */}
                  {currentDirContents.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">المجلد فارغ</p>
                  ) : (
                    currentDirContents.map((item, i) => {
                      const isFolder = files[`${currentDir}/${item}`] !== undefined;
                      const itemPath = `${currentDir}/${item}`;
                      const hasContent = fileContents[itemPath] && fileContents[itemPath].length > 0;
                      
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (isFolder) {
                              setCurrentDir(itemPath);
                            }
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded hover:bg-[#24099330] transition-colors text-left group"
                        >
                          {isFolder ? (
                            <Folder className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <File className="w-4 h-4 text-blue-400" />
                          )}
                          <span className={`text-sm ${isFolder ? 'text-yellow-200' : 'text-gray-300'}`}>
                            {item}
                          </span>
                          {!isFolder && hasContent && (
                            <span className="text-xs text-green-400 mr-auto">✓</span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
              
              {/* File Preview */}
              <div className="mt-3 p-3 bg-[#111118] rounded-lg">
                <p className="text-xs text-gray-400 mb-2">المحتوى:</p>
                <div className="text-xs text-gray-300 font-mono max-h-20 overflow-y-auto">
                  {currentDirContents.filter(item => fileContents[`${currentDir}/${item}`]).length > 0 ? (
                    currentDirContents
                      .filter(item => fileContents[`${currentDir}/${item}`])
                      .slice(0, 1)
                      .map(item => (
                        <div key={item}>
                          <span className="text-[#430D9E]">{item}:</span>
                          <pre className="mt-1 text-gray-400">{fileContents[`${currentDir}/${item}`]?.substring(0, 100)}...</pre>
                        </div>
                      ))
                  ) : (
                    <span className="text-gray-500">لا يوجد ملفات بمحتوى في هذا المجلد</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#430D9E]" />
                مساعدة سريعة
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[#111118]">
                  <p className="text-xs text-gray-400 mb-1">الأمر المطلوب:</p>
                  <code className="text-[#00ff88] terminal-text text-sm">{currentMission.command}</code>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">الشرح:</p>
                  <p className="text-sm text-gray-300">{currentMission.helpText}</p>
                </div>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-5 h-5" />
                أخطاء شائعة
              </h4>
              <ul className="space-y-2">
                {currentMission.commonMistakes.map((mistake, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-red-400">×</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>

            {/* Real World Example */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-green-400">
                <Globe className="w-5 h-5" />
                في الواقع العملي
              </h4>
              <p className="text-sm text-gray-300">{currentMission.realWorldExample}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Theory Dialog */}
      <Dialog open={showTheory} onOpenChange={setShowTheory}>
        <DialogContent className="glass-strong max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#430D9E]" />
              {currentStage.theoryLesson.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#24099320] to-[#430D9E20]">
              <h4 className="font-bold mb-3 text-lg">المحتوى النظري</h4>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {currentStage.theoryLesson.content}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                النقاط المهمة
              </h4>
              <div className="grid gap-2">
                {currentStage.theoryLesson.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#111118]">
                    <span className="w-6 h-6 rounded-full bg-[#430D9E] flex items-center justify-center text-sm flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-gray-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#111118]">
              <h4 className="font-bold mb-3">الأمر الحالي: {currentMission.title}</h4>
              <code className="block terminal-text text-[#00ff88] bg-[#0a0a0f] p-4 rounded-lg">
                {currentMission.command}
              </code>
              <p className="mt-3 text-gray-300">{currentMission.detailedExplanation}</p>
            </div>
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
            <p className="text-gray-300 mb-4">لقد أكملت المهمة بنجاح</p>
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Award className="w-6 h-6" />
              <span className="text-xl font-bold">+{currentMission.points} نقطة</span>
            </div>
            <p className="text-sm text-gray-400 mt-4">جاري الانتقال للمهمة التالية...</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stage Complete Dialog */}
      <Dialog open={showStageComplete} onOpenChange={setShowStageComplete}>
        <DialogContent className="glass-strong border-[#430D9E]">
          <div className="text-center py-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#240993] to-[#430D9E] flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Trophy className="w-14 h-14 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">تهانينا!</h3>
            <p className="text-gray-300 mb-4">
              لقد أكملت مرحلة <span className="text-[#430D9E] font-bold">{currentStage.title}</span>
            </p>
            {currentStageIndex < stages.length - 1 && unlockedStages.includes(stages[currentStageIndex + 1].id) && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
                <p className="text-green-400">
                  <Unlock className="w-5 h-5 inline ml-2" />
                  تم فتح المرحلة التالية: {stages[currentStageIndex + 1].title}
                </p>
              </div>
            )}
            <Button onClick={nextMission} className="btn-cyber">
              الانتقال للمرحلة التالية
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
