import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, Clock, MapPin, Users, Trophy, Target, Zap,
    ChevronRight, ChevronLeft, Plus, Edit, Trash2, CheckCircle,
    Star, Bell, Share2, MessageSquare, BarChart2, BarChart3,
    UserPlus, FileText, Camera, Video, Mic, ExternalLink,
    Heart, Bookmark, Eye, AlertCircle, Filter, Search,
    Grid, List, Download, Send, X, Check, Info,
    Shield, Terminal, Code, Cpu, Globe, Lock, Wifi,
    Award, Medal, Crown, Flag, Flame, Sparkles, Rocket
} from 'lucide-react';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useNavigate } from 'react-router-dom';

const EVENTS = [
    {
        id: 1,
        title: 'هاكاثون الأمن السيبراني 2024',
        type: 'competition',
        category: 'hackathon',
        date: '2024-02-15',
        time: '09:00 - 18:00',
        location: 'قاعة المؤتمرات الرئيسية',
        description: 'تحدي برمجي مكثف لمدة 24 ساعة في مجال اختبار الاختراق وحل الثغرات الأمنية',
        image: 'hackathon',
        maxParticipants: 50,
        registered: 42,
        status: 'open',
        xpReward: 500,
        badges: ['هاكر', 'منافس'],
        organizer: 'فريق قيادة النادي',
        requirements: ['لابتوب', 'معرفة بلغة Python أو Bash'],
        agenda: [
            { time: '09:00', activity: 'تسجيل الدخول والترحيب' },
            { time: '10:00', activity: 'شرح القواعد والتحديات' },
            { time: '11:00', activity: 'بدء الهاكاثون' },
            { time: '18:00', activity: 'الإعلان عن الفائزين' }
        ]
    },
    {
        id: 2,
        title: 'ورشة عمل: اختبار اختراق الويب',
        type: 'workshop',
        category: 'training',
        date: '2024-02-20',
        time: '17:00 - 20:00',
        location: 'مختبر الحاسب الآلي 2',
        description: 'تعلم تقنيات اختبار اختراق تطبيقات الويب بما في ذلك SQL Injection و XSS',
        image: 'workshop',
        maxParticipants: 30,
        registered: 28,
        status: 'almost_full',
        xpReward: 200,
        badges: ['متعلم', 'ممارس'],
        instructor: 'أحمد محمد - خبير أمن سيبراني',
        prerequisites: ['معرفة أساسية بـ HTML و JavaScript'],
        materials: ['Burp Suite', 'OWASP ZAP', 'Kali Linux']
    },
    {
        id: 3,
        title: 'مسابقة Capture The Flag',
        type: 'competition',
        category: 'ctf',
        date: '2024-03-01',
        time: '14:00 - 20:00',
        location: 'أونلاين + قاعة 101',
        description: 'مسابقة CTF تحاكي منصات TryHackMe و Hack The Box مع تحديات متنوعة',
        image: 'ctf',
        maxParticipants: 100,
        registered: 67,
        status: 'open',
        xpReward: 300,
        badges: ['محارب', 'مكتشف'],
        difficulty: 'متوسط',
        categories: ['Web', 'Crypto', 'Forensics', 'Reverse Engineering'],
        prizes: ['مركز 1: 1000 ريال', 'مركز 2: 700 ريال', 'مركز 3: 500 ريال']
    },
    {
        id: 4,
        title: 'محاضرة: مستقبل الذكاء الاصطناعي في الأمن السيبراني',
        type: 'lecture',
        category: 'seminar',
        date: '2024-03-10',
        time: '19:00 - 21:00',
        location: 'قاعة المحاضرات الكبرى',
        description: 'محاضرة من خبير عالمي عن كيفية استخدام AI في الكشف عن التهديدات والهجمات',
        image: 'lecture',
        maxParticipants: 200,
        registered: 156,
        status: 'open',
        xpReward: 150,
        badges: ['مستمع', 'مفكر'],
        speaker: 'د. خالد العلي - مدير الأمن في شركة تقنية',
        topics: ['ML in Security', 'AI-Powered Attacks', 'Defense Strategies']
    },
    {
        id: 5,
        title: 'يوم مفتوح: تعرف على النادي',
        type: 'social',
        category: 'meetup',
        date: '2024-02-25',
        time: '16:00 - 19:00',
        location: 'حديقة الجامعة المركزية',
        description: 'يوم ترفيهي للتعريف بالنادي وأنشطته للطلاب الجدد مع أنشطة تفاعلية',
        image: 'meetup',
        maxParticipants: 150,
        registered: 89,
        status: 'open',
        xpReward: 50,
        badges: ['اجتماعي', 'صديق'],
        activities: ['تعريف بالمحاكيات', 'ورش صغيرة', 'مسابقات', 'هدايا']
    }
];

const SURVEYS = [
    {
        id: 1,
        title: 'استبيان: ما المواضيع التي تريد تعلمها؟',
        description: 'ساعدنا في تحديد المحتوى التعليمي للفصل القادم',
        endDate: '2024-02-28',
        participants: 234,
        status: 'active',
        questions: 5,
        xpReward: 20,
        options: [
            { label: 'اختراق الشبكات', votes: 89 },
            { label: ' forensics التحقيق الجنائي الرقمي', votes: 67 },
            { label: 'Reverse Engineering', votes: 45 },
            { label: 'Cloud Security', votes: 78 }
        ]
    },
    {
        id: 2,
        title: 'تقييم: ورشة الباش الأخيرة',
        description: 'أخبرنا رأيك لتطوير الورش القادمة',
        endDate: '2024-02-15',
        participants: 156,
        status: 'active',
        questions: 8,
        xpReward: 15,
        rating: 4.7
    },
    {
        id: 3,
        title: 'اقتراح: اختيار موعد الهاكاثون القادم',
        description: 'صوت على أفضل وقت يناسبك',
        endDate: '2024-03-01',
        participants: 89,
        status: 'active',
        questions: 1,
        xpReward: 10,
        options: [
            { label: 'نهاية الأسبوع', votes: 56 },
            { label: 'يوم الخميس', votes: 23 },
            { label: 'أثناء الإجازة', votes: 34 }
        ]
    }
];

const ANNOUNCEMENTS = [
    {
        id: 1,
        title: 'افتتاح التسجيل في برنامج القادة',
        content: 'انضم إلى برنامج تدريب القادة للعام الدراسي القادم وكن من أوائل المساهمين في النادي',
        date: '2024-02-10',
        priority: 'high',
        type: 'opportunity',
        link: '/programs/leaders'
    },
    {
        id: 2,
        title: 'تحديث جديد في محاكي الهجمات',
        content: 'تم إضافة 5 سيناريوهات جديدة ووضع المدافع بشكل كامل',
        date: '2024-02-08',
        priority: 'medium',
        type: 'update'
    },
    {
        id: 3,
        title: 'فريق النادي يحصد المركز الأول',
        content: 'تهانينا لفريق النادي للفوز بالمركز الأول في مسابقة الجامعات للأمن السيبراني',
        date: '2024-02-05',
        priority: 'high',
        type: 'achievement'
    }
];

const LEADERBOARD = [
    { rank: 1, name: 'أحمد خالد', xp: 12500, badges: 12, events: 8 },
    { rank: 2, name: 'سارة محمد', xp: 11800, badges: 10, events: 7 },
    { rank: 3, name: 'فاطمة علي', xp: 10900, badges: 9, events: 6 },
    { rank: 4, name: 'محمد عبدالله', xp: 9800, badges: 8, events: 5 },
    { rank: 5, name: 'نور الدين', xp: 8700, badges: 7, events: 5 }
];

export default function ClubActivities() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('events');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [registeredEvents, setRegisteredEvents] = useState([2]);
    const [surveyAnswers, setSurveyAnswers] = useState({});
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [registrationForm, setRegistrationForm] = useState({
        name: '',
        email: '',
        phone: '',
        studentId: '',
        experience: ''
    });

    const filteredEvents = EVENTS.filter(event => {
        if (filterCategory === 'all') return true;
        return event.category === filterCategory || event.type === filterCategory;
    });

    const handleRegister = (eventId) => {
        setSelectedEvent(EVENTS.find(e => e.id === eventId));
        setShowRegistrationModal(true);
    };

    const submitRegistration = () => {
        setRegisteredEvents(prev => [...prev, selectedEvent.id]);
        setShowRegistrationModal(false);
        setRegistrationForm({ name: '', email: '', phone: '', studentId: '', experience: '' });
    };

    const handleSurveyVote = (surveyId, optionIndex) => {
        setSurveyAnswers(prev => ({
            ...prev,
            [surveyId]: optionIndex
        }));
    };

    const submitSurvey = (surveyId) => {
        alert('تم إرسال إجاباتك بنجاح! +20 نقطة XP');
        setSelectedSurvey(null);
    };

    const getEventIcon = (category) => {
        const icons = {
            hackathon: <Terminal className="text-[#7112AF]" size={32} />,
            workshop: <Code className="text-blue-400" size={32} />,
            ctf: <Target className="text-red-400" size={32} />,
            seminar: <Mic className="text-yellow-400" size={32} />,
            meetup: <Users className="text-green-400" size={32} />
        };
        return icons[category] || <Calendar className="text-gray-400" size={32} />;
    };

    const getCategoryBadge = (category) => {
        const styles = {
            hackathon: 'bg-[#7112AF]/20 text-[#7112AF]',
            workshop: 'bg-blue-500/20 text-blue-400',
            ctf: 'bg-red-500/20 text-red-400',
            seminar: 'bg-yellow-500/20 text-yellow-400',
            meetup: 'bg-green-500/20 text-green-400'
        };
        const labels = {
            hackathon: 'هاكاثون',
            workshop: 'ورشة عمل',
            ctf: 'مسابقة CTF',
            seminar: 'محاضرة',
            meetup: 'لقاء اجتماعي'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[category]}`}>
                {labels[category]}
            </span>
        );
    };

    const getStatusBadge = (status, registered, max) => {
        const isFull = registered >= max;
        const isAlmostFull = registered / max >= 0.8;
        
        if (isFull) return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400">مكتمل</span>;
        if (isAlmostFull) return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400">أماكن محدودة</span>;
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">متاح</span>;
    };

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            <MatrixBackground opacity={0.2} />
            
            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-[#7112AF] to-[#ff006e] rounded-xl shadow-[0_0_30px_rgba(113,18,175,0.3)]">
                                <Calendar size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">فعاليات النادي</h1>
                                <p className="text-gray-400">اكتشف الفعاليات، سجل في الأحداث، وشارك في استبيانات النادي</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                <span className="text-gray-400 text-sm">فعاليات هذا الشهر: </span>
                                <span className="text-[#7112AF] font-bold">{EVENTS.length}</span>
                            </div>
                            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors relative">
                                <Bell size={20} className="text-gray-400" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="relative z-10 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-2">
                        {[
                            { id: 'events', label: 'الفعاليات', icon: Calendar },
                            { id: 'surveys', label: 'استبيانات', icon: BarChart2 },
                            { id: 'announcements', label: 'إعلانات', icon: Bell },
                            { id: 'leaderboard', label: 'المتصدرين', icon: Trophy }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-bold transition-colors border-b-2 ${
                                        activeTab === tab.id
                                            ? 'text-[#7112AF] border-[#7112AF]'
                                            : 'text-gray-400 border-transparent hover:text-white'
                                    }`}
                                >
                                    <Icon size={20} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Filters */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {[
                                        { id: 'all', label: 'الكل' },
                                        { id: 'hackathon', label: 'هاكاثونات' },
                                        { id: 'workshop', label: 'ورش عمل' },
                                        { id: 'ctf', label: 'مسابقات CTF' },
                                        { id: 'seminar', label: 'محاضرات' },
                                        { id: 'meetup', label: 'لقاءات' }
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setFilterCategory(cat.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                                filterCategory === cat.id
                                                    ? 'bg-[#7112AF]/20 text-[#7112AF]'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#7112AF]/20 text-[#7112AF]' : 'bg-white/5 text-gray-400'}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#7112AF]/20 text-[#7112AF]' : 'bg-white/5 text-gray-400'}`}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Events Grid/List */}
                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                                {filteredEvents.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#7112AF]/50 transition-all group ${
                                            viewMode === 'list' ? 'flex' : ''
                                        }`}
                                    >
                                        {/* Event Image/Icon */}
                                        <div className={`${viewMode === 'list' ? 'w-48' : 'h-48'} bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/10 flex items-center justify-center relative`}>
                                            {getEventIcon(event.category)}
                                            <div className="absolute top-3 right-3">
                                                {getCategoryBadge(event.category)}
                                            </div>
                                            <div className="absolute top-3 left-3">
                                                {getStatusBadge(event.status, event.registered, event.maxParticipants)}
                                            </div>
                                        </div>

                                        {/* Event Content */}
                                        <div className="p-6 flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                                            {/* Event Meta */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Calendar size={16} className="text-[#7112AF]" />
                                                    {new Date(event.date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Clock size={16} className="text-[#7112AF]" />
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <MapPin size={16} className="text-[#7112AF]" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Users size={16} className="text-[#7112AF]" />
                                                    {event.registered} / {event.maxParticipants} مشارك
                                                </div>
                                            </div>

                                            {/* Badges & XP */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex gap-2">
                                                    {event.badges.map((badge, i) => (
                                                        <span key={i} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                                                            {badge}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-400">
                                                    <Star size={16} />
                                                    <span className="font-bold">+{event.xpReward} XP</span>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                    <span>نسبة التسجيل</span>
                                                    <span>{Math.round((event.registered / event.maxParticipants) * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-[#7112AF] to-[#ff006e] h-2 rounded-full"
                                                        style={{ width: `${(event.registered / event.maxParticipants) * 100}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRegister(event.id)}
                                                    disabled={registeredEvents.includes(event.id) || event.registered >= event.maxParticipants}
                                                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                                                        registeredEvents.includes(event.id)
                                                            ? 'bg-green-500/20 text-green-400 cursor-default'
                                                            : event.registered >= event.maxParticipants
                                                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white hover:shadow-[0_0_20px_rgba(113,18,175,0.5)]'
                                                    }`}
                                                >
                                                    {registeredEvents.includes(event.id) ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <CheckCircle size={16} />
                                                            مسجل
                                                        </span>
                                                    ) : event.registered >= event.maxParticipants ? (
                                                        'مكتمل'
                                                    ) : (
                                                        'سجل الآن'
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setSelectedEvent(event)}
                                                    className="px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                >
                                                    <Info size={20} className="text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Surveys Tab */}
                    {activeTab === 'surveys' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {SURVEYS.map((survey, index) => (
                                <motion.div
                                    key={survey.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#7112AF]/50 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-500/20 rounded-lg">
                                            <BarChart2 className="text-blue-400" size={24} />
                                        </div>
                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                                            نشط
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-2">{survey.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{survey.description}</p>

                                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Users size={14} />
                                            {survey.participants} مشارك
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FileText size={14} />
                                            {survey.questions} سؤال
                                        </span>
                                    </div>

                                    {survey.options && (
                                        <div className="space-y-2 mb-4">
                                            {survey.options.map((option, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleSurveyVote(survey.id, i)}
                                                        className={`flex-1 p-2 rounded-lg text-right text-sm transition-colors ${
                                                            surveyAnswers[survey.id] === i
                                                                ? 'bg-[#7112AF]/30 text-white border border-[#7112AF]'
                                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                    <div className="w-20">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 bg-white/10 rounded-full h-2">
                                                                <div 
                                                                    className="bg-blue-500 h-2 rounded-full"
                                                                    style={{ width: `${(option.votes / survey.participants) * 100}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-gray-400 w-8">{option.votes}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            ينتهي: {new Date(survey.endDate).toLocaleDateString('ar-SA')}
                                        </span>
                                        <button
                                            onClick={() => submitSurvey(survey.id)}
                                            disabled={surveyAnswers[survey.id] === undefined}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                                surveyAnswers[survey.id] !== undefined
                                                    ? 'bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white'
                                                    : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            إرسال
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Announcements Tab */}
                    {activeTab === 'announcements' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 max-w-3xl mx-auto"
                        >
                            {ANNOUNCEMENTS.map((announcement, index) => (
                                <motion.div
                                    key={announcement.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-6 rounded-xl border ${
                                        announcement.priority === 'high'
                                            ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30'
                                            : 'bg-white/5 border-white/10'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${
                                            announcement.type === 'opportunity' ? 'bg-[#7112AF]/20' :
                                            announcement.type === 'achievement' ? 'bg-yellow-500/20' :
                                            'bg-blue-500/20'
                                        }`}>
                                            {announcement.type === 'opportunity' ? <Rocket className="text-[#7112AF]" size={24} /> :
                                             announcement.type === 'achievement' ? <Trophy className="text-yellow-400" size={24} /> :
                                             <Info className="text-blue-400" size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-2">{announcement.title}</h3>
                                            <p className="text-gray-400 mb-3">{announcement.content}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-500">{new Date(announcement.date).toLocaleDateString('ar-SA')}</span>
                                                {announcement.link && (
                                                    <button className="text-[#7112AF] hover:text-[#ff006e] text-sm font-bold flex items-center gap-1">
                                                        اقرأ المزيد
                                                        <ChevronRight size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Leaderboard Tab */}
                    {activeTab === 'leaderboard' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/10 border border-[#7112AF]/30 rounded-2xl p-8">
                                <div className="text-center mb-8">
                                    <Trophy size={48} className="text-yellow-400 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-white">لوحة المتصدرين</h2>
                                    <p className="text-gray-400">أكثر الأعضاء نشاطاً ومساهمة في فعاليات النادي</p>
                                </div>

                                <div className="space-y-4">
                                    {LEADERBOARD.map((user, index) => (
                                        <motion.div
                                            key={user.rank}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`flex items-center gap-4 p-4 rounded-xl ${
                                                user.rank === 1 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
                                                user.rank === 2 ? 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border border-gray-400/30' :
                                                user.rank === 3 ? 'bg-gradient-to-r from-orange-700/20 to-orange-600/20 border border-orange-700/30' :
                                                'bg-white/5'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                                                user.rank === 1 ? 'bg-yellow-500 text-black' :
                                                user.rank === 2 ? 'bg-gray-300 text-black' :
                                                user.rank === 3 ? 'bg-orange-600 text-white' :
                                                'bg-white/10 text-white'
                                            }`}>
                                                {user.rank}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-white">{user.name}</div>
                                                <div className="text-sm text-gray-400">{user.events} فعالية • {user.badges} شارة</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-yellow-400 font-bold text-lg">{user.xp.toLocaleString()} XP</div>
                                                <div className="text-xs text-gray-400">نقطة خبرة</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
                {showRegistrationModal && selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowRegistrationModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">تسجيل في الفعالية</h2>
                                <button 
                                    onClick={() => setShowRegistrationModal(false)}
                                    className="p-2 bg-white/5 rounded-lg hover:bg-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-[#7112AF]/10 rounded-xl border border-[#7112AF]/30">
                                <h3 className="font-bold text-white mb-1">{selectedEvent.title}</h3>
                                <p className="text-sm text-gray-400">{selectedEvent.date} • {selectedEvent.time}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">الاسم الكامل</label>
                                    <input
                                        type="text"
                                        value={registrationForm.name}
                                        onChange={e => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-[#7112AF] focus:outline-none"
                                        placeholder="أدخل اسمك"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value={registrationForm.email}
                                        onChange={e => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-[#7112AF] focus:outline-none"
                                        placeholder="example@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">رقم الجوال</label>
                                    <input
                                        type="tel"
                                        value={registrationForm.phone}
                                        onChange={e => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-[#7112AF] focus:outline-none"
                                        placeholder="05xxxxxxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">الرقم الجامعي</label>
                                    <input
                                        type="text"
                                        value={registrationForm.studentId}
                                        onChange={e => setRegistrationForm(prev => ({ ...prev, studentId: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-[#7112AF] focus:outline-none"
                                        placeholder="44xxxxxxxx"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={submitRegistration}
                                className="w-full mt-6 py-4 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.5)] transition-all"
                            >
                                تأكيد التسجيل
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
