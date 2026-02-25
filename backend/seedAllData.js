const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'cyberclub.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Connection error', err);
        process.exit(1);
    }
});

const terminalConfig1 = JSON.stringify({
    type: 'bash_simulator',
    tasks: [
        { title: 'عرض محتويات الدليل', description: 'استخدم الأمر ls لعرض الملفات', command: 'ls', expectedOutput: 'file1.txt' }
    ],
    fileSystem: {
        '/home/user': { type: 'dir', children: { 'file1.txt': { type: 'file', content: 'test content' } } }
    }
});

const quizConfig1 = JSON.stringify([
    { question: 'ما هو الأمر المستخدم لعرض محتويات الدليل في لينكس؟', options: ['cd', 'ls', 'pwd', 'mkdir'], correctOption: 1 }
]);

const terminalConfig2 = JSON.stringify({
    type: 'bash_simulator',
    tasks: [
        { title: 'معرفة مسار الدليل الحالي', description: 'استخدم الأمر pwd لمعرفة المسار', command: 'pwd', expectedOutput: '/home/user' }
    ],
    fileSystem: {
        '/home/user': { type: 'dir', children: {} }
    }
});

const quizConfig2 = JSON.stringify([
    { question: 'أي من الأوامر التالية يستخدم لتغيير الدليل؟', options: ['cd', 'ls', 'pwd', 'rm'], correctOption: 0 }
]);

const terminalConfig3 = JSON.stringify({
    type: 'bash_simulator',
    tasks: [
        { title: 'إنشاء ملف جديد', description: 'استخدم الأمر touch لإنشاء ملف باسم test.txt', command: 'touch test.txt', expectedOutput: '' }
    ],
    fileSystem: {
        '/home/user': { type: 'dir', children: {} }
    }
});

const quizConfig3 = JSON.stringify([
    { question: 'الأمر touch يستخدم لـ:', options: ['إنشاء مجلد', 'عرض الملفات', 'إنشاء ملف فارغ', 'نسخ الملفات'], correctOption: 2 }
]);

const tracks = [
    {
        title: 'أساسيات الأمن السيبراني',
        description: 'مسار شامل لتعلم أساسيات الأمن السيبراني والشبكات',
        icon: 'ShieldCore',
        course: {
            title: 'مقدمة في الأمن السيبراني',
            description: 'تعرف على المفاهيم الأساسية للأمن وحماية البيانات',
            unit: {
                title: 'الوحدة الأولى: المفاهيم الأساسية ولينكس',
                lesson: {
                    title: 'درس 1: أوامر لينكس الأساسية',
                    content: 'في هذا الدرس سنتعلم الأوامر الأساسية في نظام تشغيل لينكس للتعامل مع الملفات والمجلدات.',
                    terminal_config: terminalConfig1,
                    quiz_config: quizConfig1,
                    is_interactive: true
                }
            }
        }
    },
    {
        title: 'اختبار الاختراق',
        description: 'مسار متقدم لتعلم تقنيات وأدوات اختبار الاختراق الأخلاقي',
        icon: 'Sword',
        course: {
            title: 'أساسيات اختبار الاختراق',
            description: 'دورة تركز على جمع المعلومات وفحص الثغرات',
            unit: {
                title: 'الوحدة الأولى: جمع المعلومات',
                lesson: {
                    title: 'درس 1: استكشاف الشبكة وأنظمة التشغيل',
                    content: 'تعرف على أساسيات الشبكات وكيفية التعامل مع موجه الأوامر لاكتشاف المنافذ.',
                    terminal_config: terminalConfig2,
                    quiz_config: quizConfig2,
                    is_interactive: true
                }
            }
        }
    },
    {
        title: 'التحقيق الجنائي الرقمي',
        description: 'مسار متخصص في تحليل الأدلة الرقمية والتحقيق في الحوادث',
        icon: 'Search',
        course: {
            title: 'التحقيق الجنائي للحواسيب',
            description: 'دورة توفر المهارات اللازمة للتحليل الجنائي',
            unit: {
                title: 'الوحدة الأولى: تحليل الأدلة',
                lesson: {
                    title: 'درس 1: استخراج الملفات المخفية',
                    content: 'تعلم كيفية استرجاع واستخراج البيانات المخفية باستخدام سطر الأوامر.',
                    terminal_config: terminalConfig3,
                    quiz_config: quizConfig3,
                    is_interactive: true
                }
            }
        }
    }
];

const newsList = [
    { title: 'اكتشاف ثغرة خطيرة في بروتوكول WPA3', body: 'اكتشف باحثون ثغرة جديدة في بروتوكول WPA3 للشبكات اللاسلكية تسمح باعتراض البيانات.', tags: '["ثغرات", "شبكات"]', type: 'news', image_url: '/assets/news/1.jpg' },
    { title: 'هجوم سيبراني يستهدف خوادم مايكروسوفت إكستشينج', body: 'تعرضت العديد من المؤسسات لاختراقات بسبب سلسلة عيوب في خوادم البريد مايكروسوفت.', tags: '["اختراق", "هجمات"]', type: 'news', image_url: '/assets/news/2.jpg' },
    { title: 'إطلاق أداة جديدة مفتوحة المصدر لتحليل البرمجيات الخبيثة', body: 'قام فريق أمني بإطلاق أداة جديدة تساعد المحللين في تفكيك البرمجيات الرانسوموير.', tags: '["أدوات", "برمجيات خبيثة"]', type: 'news', image_url: '/assets/news/3.jpg' },
    { title: 'تحذير من هجمات التصيد الاحتيالي باستخدام تقنية Deepfake', body: 'أصدر الخبراء تحذيراً من تزايد استخدام التزييف العميق لخداع الموظفين في الشركات الكبرى.', tags: '["تزييف عميق", "تصيد"]', type: 'news', image_url: '/assets/news/4.jpg' },
    { title: 'شركة أمن سيبراني سعودية تعلن عن تمويل جديد', body: 'أعلنت إحدى الشركات الناشئة في مجال الأمن السيبراني في المملكة عن جولة تمويلية بأكثر من مليار ريال.', tags: '["استثمار", "السعودية"]', type: 'news', image_url: '/assets/news/5.jpg' },
    { title: 'ارتفاع حوادث برمجيات الفدية بنسبة 30% خلال الربع الأخير', body: 'أظهر تقرير جديد زيادة ملحوظة في هجمات المطالبة بالفدية في قطاعات الرعاية الصحية والتعليم.', tags: '["فدية", "إحصائيات"]', type: 'news', image_url: '/assets/news/6.jpg' },
    { title: 'الكشف عن تسريب بيانات لأكثر من مليون مستخدم بتطبيق شهير', body: 'تم رصد قاعدة بيانات على الإنترنت المظلم تحتوي على أسماء وأرقام هواتف لمستخدمين في تطبيق المراسلات.', tags: '["تسريب", "بيانات"]', type: 'news', image_url: '/assets/news/7.jpg' },
    { title: 'تحديث أمني عاجل لأنظمة أبل لمعالجة ثغرة زيرو داي', body: 'أطلقت شركة أبل تحديثاً جديداً لسد ثغرة خطيرة قد تسمح بالتحكم الكامل بالأجهزة.', tags: '["أبل", "تحديثات"]', type: 'news', image_url: '/assets/news/8.jpg' },
    { title: 'اعتقال مجموعة قراصنة مسؤولة عن هجمات طلب الفدية', body: 'أعلنت الشرطة الدولية (الإنتربول) عن تفكيك عصابة سيبرانية بعد تحقيقات استمرت لعام.', tags: '["قانون", "جرائم سيبرانية"]', type: 'news', image_url: '/assets/news/9.jpg' },
    { title: 'إصدار التقرير السنوي للتهديدات السيبرانية', body: 'أصدر المركز الوطني للأمن السيبراني التقرير السنوي الذي يوضح أبرز التوجهات الأمنية للعام الجاري.', tags: '["تقارير", "وعي أمني"]', type: 'news', image_url: '/assets/news/10.jpg' }
];

const articlesList = [
    { title: 'دليلك الشامل لتعلم أساسيات الأمن السيبراني', content: 'في هذه المقالة، سنستعرض الخطوات الأساسية التي يجب على كل مبتدئ اتباعها لتعلم الأمن السيبراني بنجاح وتأسيس معرفة قوية.', author: 'أحمد محمد', tags: '["مبتدئين", "دليل"]' },
    { title: 'أهمية التشفير في حماية البيانات الخاصة', content: 'التشفير هو حجر الزاوية في الحفاظ على خصوصيتنا عبر الإنترنت. يناقش المقال تقنيات التشفير الحديثة وطرق عملها.', author: 'فاطمة السعيد', tags: '["تشفير", "خصوصية"]' },
    { title: 'كيف تتجنب أساليب الهندسة الاجتماعية والمخادعين المهرة', content: 'الهندسة الاجتماعية تعتمد على التلاعب النفسي. سنتعلم كيفية التعرف على رسائل المتصيدين والحيل التي يمكن أن تورطك.', author: 'عمر القحطاني', tags: '["هندسة اجتماعية", "توعية"]' },
    { title: 'نظرة معمقة في تحليل البرمجيات الخبيثة وتفكيك الكود', content: 'تحليل الفيروسات والتروجانات يتطلب بيئات معزولة وأدوات احترافية، نلقي نظرة على منهجيات المحللين.', author: 'ياسر خالد', tags: '["برمجيات خبيثة", "هندسة عكسية"]' },
    { title: 'حماية شبكات الواي فاي المنزلية بخطوات عملية بسيطة', content: 'شبكات الواي فاي غير المحمية تعتبر باباً مفتوحاً للقراصنة، نشرح في هذا الدليل خطوات تأمين الشبكة وإغلاق الثغرات.', author: 'ريم عبد العزيز', tags: '["شبكات", "واي فاي", "حماية"]' },
    { title: 'مستقبل الذكاء الاصطناعي في الدفاع السيبراني', content: 'كيف يساهم الذكاء الاصطناعي في كشف التهديدات بسرعة، وهل سيرجح كفة المدافعين أم المهاجمين في المستقبل؟', author: 'د. سامي العتيبي', tags: '["ذكاء اصطناعي", "مستقبل"]' },
    { title: 'أدوات اختبار الاختراق التي لا غنى عنها لكل هاكر أخلاقي', content: 'من الميتاسبلويت إلى الإن ماب، هذه المقالة تسرد أهم الأدوات وتطبيقاتها في اختبار قوة وأمان الأنظمة المعاصرة.', author: 'سالم الدوسري', tags: '["أدوات", "اختبار اختراق"]' },
    { title: 'فهم هجمات حجب الخدمة الموزعة وكيفية التخفيف منها', content: 'نظرة تقنية حول آليات عمل هجمات DDoS والطرق الفعّالة لحماية البنية التحتية والخوادم منها.', author: 'محمد العمري', tags: '["DDoS", "هجمات شبكات"]' },
    { title: 'التحقيق الرقمي بعد حدوث اختراق أمني داخل الشركة', content: 'ما هي أول الخطوات التي يجب اتخاذها عندما يتم الكشف عن اختراق؟ مقال يشرح خطة الاستجابة السريعة.', author: 'نورة الحسن', tags: '["استجابة حوادث", "تحقيق رقمي"]' },
    { title: 'كيف تختار نظام تشغيل آمن مناسب لعمليات الأمن السيبراني؟', content: 'مقارنة بين توزيعات لينكس المختلفة ككالي لينكس وباروت أمن ومزايا كل منها في توفير بيئة عمل آمنة ومريحة.', author: 'حسن الفايز', tags: '["أنظمة تشغيل", "كالي", "لينكس"]' }
];

const eventsList = [
    { title: 'ورشة عمل حول التحليل الجنائي', type: 'workshop', category: 'training', date: '2026-03-01', time: '18:00', location: 'أونلاين عبر زووم', description: 'ورشة عملية شاملة تغطي أساسيات جمع الأدلة الرقمية.', image: '/assets/events/1.jpg' },
    { title: 'تحدي التقاط العلم الأول لعام 2026', type: 'competition', category: 'event', date: '2026-03-10', time: '10:00', location: 'جامعة طويق', description: 'مسابقة CTF ضخمة لتحدي قدرات الطلاب في مختلف التخصصات السيبرانية.', image: '/assets/events/2.jpg' },
    { title: 'ندوة عن الأمن السحابي وحماية البنية التحتية', type: 'seminar', category: 'seminar', date: '2026-03-15', time: '20:00', location: 'المسرح الرئيسي', description: 'محاضرة يقدمها خبراء حول كيفية تأمين البيانات والخدمات السحابية.', image: '/assets/events/3.jpg' },
    { title: 'دورة تأهيلية لشهادة سيسكو للشبكات السيبرانية', type: 'course', category: 'training', date: '2026-03-20', time: '17:00', location: 'مبنى الحاسبات', description: 'دورة مكثفة تغطي منهج شهادة CCNA وتطبيقاتها في أمان الشبكات.', image: '/assets/events/4.jpg' },
    { title: 'لقاء مفتوح مع خبراء الأمن السيبراني في سابك', type: 'meetup', category: 'talks', date: '2026-03-25', time: '19:00', location: 'قاعة المؤتمرات', description: 'جلسة حوارية مع مهندسين لمناقشة تحديات أمن المعلومات في القطاع الصناعي.', image: '/assets/events/5.jpg' },
    { title: 'معسكر تدريبي مكثف: الهاكر الأخلاقي المحترف', type: 'bootcamp', category: 'training', date: '2026-04-01', time: '09:00', location: 'قاعات التدريب المركزية', description: 'برنامج مكثف لمدة أسبوع لتجهيز المتدربين لاختراق الأنظمة برخصة أخلاقية.', image: '/assets/events/6.jpg' },
    { title: 'مسابقة محاكاة اختراق تطبيقات الويب', type: 'competition', category: 'event', date: '2026-04-10', time: '12:00', location: 'أونلاين - منصة النادي', description: 'تحدي عملي لايجاد ثغرات ويب وإبلاغ منصات Bug Bounty.', image: '/assets/events/7.jpg' },
    { title: 'استعراض أدوات استخبارات التهديدات مفتوحة المصدر (OSINT)', type: 'workshop', category: 'workshop', date: '2026-04-15', time: '16:00', location: 'معمل الأمن السيبراني', description: 'تعلم كيفية جمع المعلومات عن الأهداف المحتملة من المصادر المفتوحة.', image: '/assets/events/8.jpg' },
    { title: 'جلسة توعوية: حماية البيانات الشخصية والوعي الرقمي', type: 'seminar', category: 'seminar', date: '2026-04-20', time: '21:00', location: 'أونلاين', description: 'تثقيف عام للطلاب حول أهمية كلمات المرور القوية وتفعيل المصادقة الثنائية.', image: '/assets/events/9.jpg' },
    { title: 'مؤتمر نادي الأمن السيبراني السنوي المجمع', type: 'conference', category: 'conference', date: '2026-05-01', time: '09:00', location: 'فندق ماريوت', description: 'الحدث السنوي الأكبر للنادي لاستعراض إنجازات الأعضاء وتوزيع الجوائز.', image: '/assets/events/10.jpg' }
];

const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

async function main() {
    console.log('Starting exact data seed...');

    try {
        // Tracks, Courses, Units, Lessons
        for (const trackData of tracks) {
            const trackId = await runQuery(
                `INSERT INTO tracks (title, description, icon) VALUES (?, ?, ?)`,
                [trackData.title, trackData.description, trackData.icon]
            );

            const courseId = await runQuery(
                `INSERT INTO courses (track_id, title, description) VALUES (?, ?, ?)`,
                [trackId, trackData.course.title, trackData.course.description]
            );

            const unitId = await runQuery(
                `INSERT INTO units (course_id, title) VALUES (?, ?)`,
                [courseId, trackData.course.unit.title]
            );

            const lesson = trackData.course.unit.lesson;
            await runQuery(
                `INSERT INTO lessons (unit_id, title, content, terminal_config, quiz_config, is_interactive, xp_reward) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [unitId, lesson.title, lesson.content, lesson.terminal_config, lesson.quiz_config, lesson.is_interactive ? 1 : 0, 50]
            );
            console.log(`Created Track: ${trackData.title} -> Lesson: ${lesson.title}`);
        }

        // News
        for (const news of newsList) {
            await runQuery(
                `INSERT INTO news (title, body, tags, type, image_url) VALUES (?, ?, ?, ?, ?)`,
                [news.title, news.body, news.tags, news.type, news.image_url]
            );
        }
        console.log(`Created ${newsList.length} News items.`);

        // Articles
        for (const article of articlesList) {
            await runQuery(
                `INSERT INTO articles (title, content, author, tags) VALUES (?, ?, ?, ?)`,
                [article.title, article.content, article.author, article.tags]
            );
        }
        console.log(`Created ${articlesList.length} Articles.`);

        // Events
        for (const event of eventsList) {
            await runQuery(
                `INSERT INTO club_events (title, type, category, date, time, location, description, image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [event.title, event.type, event.category, event.date, event.time, event.location, event.description, event.image]
            );
        }
        console.log(`Created ${eventsList.length} Events.`);

        console.log('Done!');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
}

// Start seeding
main();
