export const BASH_CURRICULUM = {
    title: 'منهجية Bash الاحترافية',
    description: 'تعلم Linux Bash بشكل منهجي ومنظم مع شرح نظري وتطبيقات عملية',
    totalXP: 2000,
    estimatedDuration: '8-10 ساعات',
    
    stages: [
        {
            id: 'stage-1',
            title: 'المرحلة الأولى: أساسيات Bash والتنقل',
            description: 'تعلم الأساسيات وكيفية التنقل في النظام',
            icon: '🚀',
            color: 'green',
            xp: 400,
            duration: '2 ساعة',
            units: [
                {
                    id: 'unit-1-1',
                    title: 'الوحدة الأولى: مقدمة إلى Bash',
                    description: 'فهم طبيعة Bash والـ Shell',
                    theory: {
                        introduction: 'Bash هو Bourne Again Shell، وهو واجهة سطر الأوامر الأكثر شيوعاً في أنظمة Linux. يسمح للمستخدمين بالتفاعل مع النظام عبر أوامر نصية.',
                        keyConcepts: [
                            '什么是 Shell؟ Shell هو برنامج يفسر أوامر المستخدم',
                            'Bash vs Shell: Bash هو نوع من Shell',
                            'Terminal vs Shell: Terminal هو الواجهة، Shell هو المفسر',
                            'لماذا Bash؟ قوة، أتمتة، سكربتات'
                        ],
                        importance: 'Bash هو أساس إدارة أنظمة Linux والأتمتة والDevOps'
                    },
                    tasks: [
                        {
                            id: 'task-1-1-1',
                            title: 'فتح الطرفية',
                            description: 'تعلم كيفية فتح الطرفية والتحقق من نسخة Bash',
                            command: 'bash --version',
                            expectedOutput: 'GNU bash',
                            xp: 20,
                            hints: ['استخدم الأمر bash مع --version']
                        },
                        {
                            id: 'task-1-1-2',
                            title: 'التحقق من الـ Shell الحالي',
                            description: 'معرفة الـ Shell الذي تستخدمه حالياً',
                            command: 'echo $SHELL',
                            expectedOutput: '/bin/bash',
                            xp: 20,
                            hints: ['استخدم echo لعرض متغير SHELL']
                        }
                    ]
                },
                {
                    id: 'unit-1-2',
                    title: 'الوحدة الثانية: التنقل في النظام',
                    description: 'كيفية التنقل بين المجلدات',
                    theory: {
                        introduction: 'فهم هيكل المجلدات في Linux هو أساس العمل مع النظام. Linux يستخدم هيكل شجري يبدأ من الجذر (/).',
                        keyConcepts: [
                            'هيكل المجلدات: / هو الجذر',
                            'المسارات المطلقة vs النسبية',
                            'المجلدات المهمة: /home, /etc, /var, /usr',
                            '. و ..: المجلد الحالي والمجلد الأب'
                        ],
                        importance: 'التنقل الصحيح يمنع الأخطاء ويسهل إدارة الملفات'
                    },
                    tasks: [
                        {
                            id: 'task-1-2-1',
                            title: 'عرض المجلد الحالي',
                            description: 'اعرض المسار الكامل للمجلد الذي أنت فيه',
                            command: 'pwd',
                            expectedOutput: '/home/',
                            xp: 25,
                            hints: ['pwd تعني print working directory']
                        },
                        {
                            id: 'task-1-2-2',
                            title: 'الانتقال إلى مجلد المنزل',
                            description: 'اذهب إلى مجلد المنزل الخاص بك',
                            command: 'cd ~',
                            expectedOutput: '',
                            xp: 25,
                            hints: ['~ اختصار لمجلد المنزل']
                        },
                        {
                            id: 'task-1-2-3',
                            title: 'الانتقال إلى المجلد الأب',
                            description: 'اذهب إلى المجلد الأب من موقعك الحالي',
                            command: 'cd ..',
                            expectedOutput: '',
                            xp: 25,
                            hints: ['.. يعني المجلد الأب']
                        }
                    ]
                },
                {
                    id: 'unit-1-3',
                    title: 'الوحدة الثالثة: عرض محتويات المجلدات',
                    description: 'استكشاف الملفات والمجلدات',
                    theory: {
                        introduction: 'أمر ls هو الأداة الأساسية لعرض محتويات المجلدات. يوفر خيارات متقدمة للعرض المفصل.',
                        keyConcepts: [
                            'ls الأساسي: عرض أسماء الملفات',
                            'ls -l: عرض مفصل مع التفاصيل',
                            'ls -a: إظهار الملفات المخفية',
                            'ls -la: دمج الخيارات',
                            'الألوان: تمييز أنواع الملفات'
                        ],
                        importance: 'معرفة كيفية استكشاف الملفات ضرورية للإدارة الفعالة'
                    },
                    tasks: [
                        {
                            id: 'task-1-3-1',
                            title: 'عرض الملفات الأساسية',
                            description: 'اعرض الملفات في المجلد الحالي',
                            command: 'ls',
                            expectedOutput: '',
                            xp: 25,
                            hints: ['أمر ls بسيط يعرض الملفات']
                        },
                        {
                            id: 'task-1-3-2',
                            title: 'عرض تفاصيل الملفات',
                            description: 'اعرض الملفات مع التفاصيل الكاملة',
                            command: 'ls -l',
                            expectedOutput: 'total',
                            xp: 30,
                            hints: ['أضف -l للعرض المفصل']
                        },
                        {
                            id: 'task-1-3-3',
                            title: 'عرض الملفات المخفية',
                            description: 'اعرض جميع الملفات بما في ذلك المخفية',
                            command: 'ls -la',
                            expectedOutput: '.',
                            xp: 30,
                            hints: ['استخدم -a لإظهار الملفات المخفية']
                        }
                    ]
                }
            ]
        },
        {
            id: 'stage-2',
            title: 'المرحلة الثانية: إدارة الملفات والمجلدات',
            description: 'إنشاء، نسخ، نقل، وحذف الملفات والمجلدات',
            icon: '📁',
            color: 'blue',
            xp: 500,
            duration: '2.5 ساعة',
            units: [
                {
                    id: 'unit-2-1',
                    title: 'الوحدة الأولى: إنشاء الملفات والمجلدات',
                    description: 'تعلم كيفية إنشاء محتوى جديد',
                    theory: {
                        introduction: 'إنشاء الملفات والمجلدات هو عملية أساسية في Linux. هناك طرق متعددة لإنشاء الملفات.',
                        keyConcepts: [
                            'touch: إنشاء ملفات فارغة',
                            'mkdir: إنشاء مجلدات',
                            'mkdir -p: إنشاء مجلدات متداخلة',
                            'echo > : إنشاء ملفات بمحتوى',
                            'cat > : إنشاء ملفات تفاعلية'
                        ],
                        importance: 'تنظيم الملفات والمجلدات هو أساس العمل المنظم'
                    },
                    tasks: [
                        {
                            id: 'task-2-1-1',
                            title: 'إنشاء ملف فارغ',
                            description: 'قم بإنشاء ملف جديد باسم test.txt',
                            command: 'touch test.txt',
                            expectedOutput: '',
                            xp: 30,
                            hints: ['استخدم touch لإنشاء ملف فارغ']
                        },
                        {
                            id: 'task-2-1-2',
                            title: 'إنشاء مجلد جديد',
                            description: 'قم بإنشاء مجلد باسم documents',
                            command: 'mkdir documents',
                            expectedOutput: '',
                            xp: 30,
                            hints: ['استخدم mkdir لإنشاء مجلد']
                        },
                        {
                            id: 'task-2-1-3',
                            title: 'إنشاء مجلدات متداخلة',
                            description: 'قم بإنشاء هيكل مجلدات projects/web',
                            command: 'mkdir -p projects/web',
                            expectedOutput: '',
                            xp: 40,
                            hints: ['استخدم -p للمجلدات المتداخلة']
                        }
                    ]
                },
                {
                    id: 'unit-2-2',
                    title: 'الوحدة الثانية: نسخ الملفات والمجلدات',
                    description: 'تقنيات النسخ المختلفة',
                    theory: {
                        introduction: 'أمر cp هو أداة النسخ الأساسية في Linux. يدعم نسخ الملفات والمجلدات مع خيارات متعددة.',
                        keyConcepts: [
                            'cp file1 file2: نسخ ملف',
                            'cp file directory: نسخ إلى مجلد',
                            'cp -r: نسخ المجلدات بشكل متكرر',
                            'cp -p: الحفاظ على الصلاحيات',
                            'cp -i: السؤال قبل الكتابة'
                        ],
                        importance: 'النسخ الآمن يمنع فقدان البيانات'
                    },
                    tasks: [
                        {
                            id: 'task-2-2-1',
                            title: 'نسخ ملف',
                            description: 'انسخ test.txt إلى backup.txt',
                            command: 'cp test.txt backup.txt',
                            expectedOutput: '',
                            xp: 35,
                            hints: ['cp source destination']
                        },
                        {
                            id: 'task-2-2-2',
                            title: 'نسخ إلى مجلد',
                            description: 'انسخ test.txt إلى مجلد documents',
                            command: 'cp test.txt documents/',
                            expectedOutput: '',
                            xp: 35,
                            hints: ['لا تنسى / في نهاية المجلد']
                        },
                        {
                            id: 'task-2-2-3',
                            title: 'نسخ مجلد كامل',
                            description: 'انسخ مجلد projects بالكامل',
                            command: 'cp -r projects projects_backup',
                            expectedOutput: '',
                            xp: 40,
                            hints: ['استخدم -r للمجلدات']
                        }
                    ]
                },
                {
                    id: 'unit-2-3',
                    title: 'الوحدة الثالثة: نقل وإعادة تسمية',
                    description: 'تنظيم الملفات بالنقل وإعادة التسمية',
                    theory: {
                        introduction: 'أمر mv يستخدم لنقل الملفات وإعادة تسميتها. هو أداة متعددة الاستخدامات.',
                        keyConcepts: [
                            'mv old new: إعادة تسمية',
                            'mv file dir: نقل إلى مجلد',
                            'mv -i: السؤال قبل الكتابة',
                            'mv -f: فرض الكتابة',
                            'نمط إعادة التسمية المتقدم'
                        ],
                        importance: 'تنظيم الملفات يحسن الإنتاجية'
                    },
                    tasks: [
                        {
                            id: 'task-2-3-1',
                            title: 'إعادة تسمية ملف',
                            description: 'غير اسم test.txt إلى new.txt',
                            command: 'mv test.txt new.txt',
                            expectedOutput: '',
                            xp: 35,
                            hints: ['mv oldname newname']
                        },
                        {
                            id: 'task-2-3-2',
                            title: 'نقل ملف',
                            description: 'انقل new.txt إلى مجلد documents',
                            command: 'mv new.txt documents/',
                            expectedOutput: '',
                            xp: 35,
                            hints: ['mv file directory/']
                        }
                    ]
                },
                {
                    id: 'unit-2-4',
                    title: 'الوحدة الرابعة: الحذف الآمن',
                    description: 'حذف الملفات والمجلدات بحذر',
                    theory: {
                        introduction: 'أمر rm هو أداة الحذف القوية. يجب استخدامه بحذر لأنه لا يوجد سلة محذوفات في Linux.',
                        keyConcepts: [
                            'rm file: حذف ملف',
                            'rm -r: حذف مجلد متكرر',
                            'rm -f: فرض الحذف',
                            'rm -i: تأكيد قبل الحذف',
                            'rm -rf: الحذف القوي (خطير!)'
                        ],
                        importance: 'الحذف الخاطئ يمكن أن يكون كارثياً'
                    },
                    tasks: [
                        {
                            id: 'task-2-4-1',
                            title: 'حذف ملف',
                            description: 'احذف backup.txt',
                            command: 'rm backup.txt',
                            expectedOutput: '',
                            xp: 40,
                            hints: ['كن حذراً مع rm']
                        },
                        {
                            id: 'task-2-4-2',
                            title: 'حذف مجلد',
                            description: 'احذف مجلد projects_backup',
                            command: 'rm -r projects_backup',
                            expectedOutput: '',
                            xp: 40,
                            hints: ['استخدم -r للمجلدات']
                        }
                    ]
                }
            ]
        },
        {
            id: 'stage-3',
            title: 'المرحلة الثالثة: قراءة وتحرير الملفات',
            description: 'عرض محتوى الملفات وتحريرها',
            icon: '📖',
            color: 'purple',
            xp: 400,
            duration: '2 ساعة',
            units: [
                {
                    id: 'unit-3-1',
                    title: 'الوحدة الأولى: عرض محتوى الملفات',
                    description: 'طرق مختلفة لعرض الملفات',
                    theory: {
                        introduction: 'Linux يوفر أدوات متعددة لعرض الملفات، كل منها مناسب لاستخدام معين.',
                        keyConcepts: [
                            'cat: عرض الملف بالكامل',
                            'less: عرض تفاعلي',
                            'head: عرض بداية الملف',
                            'tail: عرض نهاية الملف',
                            'more: عرض صفحة بصفحة'
                        ],
                        importance: 'اختيار الأداة المناسبة يحسن الإنتاجية'
                    },
                    tasks: [
                        {
                            id: 'task-3-1-1',
                            title: 'إنشاء ملف تجريبي',
                            description: 'قم بإنشاء ملف demo.txt بمحتوى تجريبي',
                            command: 'echo "Hello Linux Bash Course" > demo.txt',
                            expectedOutput: '',
                            xp: 30,
                            hints: ['استخدم echo مع > لإنشاء محتوى']
                        },
                        {
                            id: 'task-3-1-2',
                            title: 'عرض الملف بالكامل',
                            description: 'اعرض محتوى demo.txt بالكامل',
                            command: 'cat demo.txt',
                            expectedOutput: 'Hello Linux Bash Course',
                            xp: 30,
                            hints: ['cat يعرض الملف كاملاً']
                        },
                        {
                            id: 'task-3-1-3',
                            title: 'عرض أول سطور',
                            description: 'اعرض أول سطر من demo.txt',
                            command: 'head -1 demo.txt',
                            expectedOutput: 'Hello Linux Bash Course',
                            xp: 35,
                            hints: ['head -n يعرض أول n سطر']
                        }
                    ]
                },
                {
                    id: 'unit-3-2',
                    title: 'الوحدة الثانية: البحث في الملفات',
                    description: 'البحث عن النصوص والمحتوى',
                    theory: {
                        introduction: 'grep هو أداة البحث القوية في Linux. يسمح بالبحث باستخدام regex.',
                        keyConcepts: [
                            'grep pattern file: بحث أساسي',
                            'grep -i: بحث غير حساس لحالة الأحرف',
                            'grep -r: بحث متكرر',
                            'grep -n: عرض أرقام السطور',
                            'regex: أنماط البحث المتقدم'
                        ],
                        importance: 'البحث الفعال يوفر الوقت والجهد'
                    },
                    tasks: [
                        {
                            id: 'task-3-2-1',
                            title: 'بحث بسيط',
                            description: 'ابحث عن كلمة Linux في demo.txt',
                            command: 'grep Linux demo.txt',
                            expectedOutput: 'Hello Linux Bash Course',
                            xp: 35,
                            hints: ['grep pattern file']
                        },
                        {
                            id: 'task-3-2-2',
                            title: 'بحث غير حساس',
                            description: 'ابحث عن linux بدون حساسية للأحرف',
                            command: 'grep -i linux demo.txt',
                            expectedOutput: 'Hello Linux Bash Course',
                            xp: 35,
                            hints: ['استخدم -i للحساسية']
                        }
                    ]
                }
            ]
        },
        {
            id: 'stage-4',
            title: 'المرحلة الرابعة: إدارة العمليات',
            description: 'مراقبة وإدارة عمليات النظام',
            icon: '⚙️',
            color: 'orange',
            xp: 350,
            duration: '1.5 ساعة',
            units: [
                {
                    id: 'unit-4-1',
                    title: 'الوحدة الأولى: عرض العمليات',
                    description: 'كيفية رؤية العمليات الجارية',
                    theory: {
                        introduction: 'إدارة العمليات هي مهارة أساسية في Linux. كل أمر وبرنامج يعمل كعملية.',
                        keyConcepts: [
                            'Process ID (PID): معرف فريد لكل عملية',
                            'ps: عرض العمليات الحالية',
                            'top: عرض العمليات بشكل تفاعلي',
                            'ps aux: عرض جميع العمليات',
                            'parent/child processes: العلاقات بين العمليات'
                        ],
                        importance: 'فهم العمليات يساعد في استكشاف الأخطاء'
                    },
                    tasks: [
                        {
                            id: 'task-4-1-1',
                            title: 'عرض عملياتك',
                            description: 'اعرض العمليات التي تشغلها',
                            command: 'ps',
                            expectedOutput: 'PID',
                            xp: 35,
                            hints: ['ps يعرض عمليات المستخدم الحالي']
                        },
                        {
                            id: 'task-4-1-2',
                            title: 'عرض جميع العمليات',
                            description: 'اعرض جميع عمليات النظام',
                            command: 'ps aux',
                            expectedOutput: 'USER',
                            xp: 40,
                            hints: ['ps aux يعرض كل شيء']
                        }
                    ]
                },
                {
                    id: 'unit-4-2',
                    title: 'الوحدة الثانية: إدارة العمليات',
                    description: 'التحكم في العمليات',
                    theory: {
                        introduction: 'يمكنك التحكم في العمليات عبر إشارات. kill و killnext هي الأدوات الرئيسية.',
                        keyConcepts: [
                            'kill PID: إرسال إشارة لعملية',
                            'kill -9 PID: القتل القسري',
                            'Ctrl+C: إيقاف العملية الحالية',
                            'Ctrl+Z: تعليق العملية',
                            'bg/fg: التحكم في الخلفية/المقدمة'
                        ],
                        importance: 'التحكم في العمليات يمنع استهلاك الموارد'
                    },
                    tasks: [
                        {
                            id: 'task-4-2-1',
                            title: 'تشغيل عملية في الخلفية',
                            description: 'شغل sleep 60 في الخلفية',
                            command: 'sleep 60 &',
                            expectedOutput: '[1]',
                            xp: 40,
                            hints: ['& تشغل العملية في الخلفية']
                        }
                    ]
                }
            ]
        },
        {
            id: 'stage-5',
            title: 'المرحلة الخامسة: الصلاحيات والأمان',
            description: 'فهم وإدارة صلاحيات الملفات',
            icon: '🔒',
            color: 'red',
            xp: 350,
            duration: '1.5 ساعة',
            units: [
                {
                    id: 'unit-5-1',
                    title: 'الوحدة الأولى: فهم الصلاحيات',
                    description: 'نظام الصلاحيات في Linux',
                    theory: {
                        introduction: 'Linux يستخدم نظام صلاحيات قوي يعتمد على المالك والمجموعة والآخرين.',
                        keyConcepts: [
                            'rwx: قراءة، كتابة، تنفيذ',
                            ' Owner/Group/Others: ثلاث فئات',
                            'chmod: تغيير الصلاحيات',
                            'chown: تغيير المالك',
                            'الأرقام الثمانية: 755, 644'
                        ],
                        importance: 'الصلاحيات الصحيحة أساس الأمان'
                    },
                    tasks: [
                        {
                            id: 'task-5-1-1',
                            title: 'عرض صلاحيات الملف',
                            description: 'اعرض صلاحيات demo.txt',
                            command: 'ls -l demo.txt',
                            expectedOutput: '-rw',
                            xp: 35,
                            hints: ['ls -l يعرض الصلاحيات']
                        },
                        {
                            id: 'task-5-1-2',
                            title: 'جعل الملف قابلاً للتنفيذ',
                            description: 'اجعل demo.txt قابلاً للتنفيذ',
                            command: 'chmod +x demo.txt',
                            expectedOutput: '',
                            xp: 40,
                            hints: ['chmod +x يضيف صلاحية التنفيذ']
                        }
                    ]
                }
            ]
        }
    ]
};
