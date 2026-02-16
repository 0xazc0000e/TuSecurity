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
    Award, Medal, Crown, Flag, Flame, Sparkles, Rocket, Newspaper
} from 'lucide-react';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, distinguishedAPI, newsAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ClubActivities() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('events');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [surveyAnswers, setSurveyAnswers] = useState({});
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [registrationForm, setRegistrationForm] = useState({
        name: '', email: '', phone: '', studentId: '', experience: ''
    });

    // Dynamic data from API
    const [events, setEvents] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [news, setNews] = useState([]);
    const [expandedNews, setExpandedNews] = useState(null);

    // Distinguished members state
    const [distinguishedMembers, setDistinguishedMembers] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [messageModal, setMessageModal] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [messageSent, setMessageSent] = useState(false);
    const [viewingMemberMsgs, setViewingMemberMsgs] = useState({});
    const [memberMessages, setMemberMessages] = useState({});

    useEffect(() => {
        eventsAPI.getEvents().then(data => {
            // Normalize field names (DB uses snake_case, UI uses camelCase)
            const normalized = (Array.isArray(data) ? data : []).map(e => ({
                ...e,
                maxParticipants: e.max_participants || e.maxParticipants || 50,
                xpReward: e.xp_reward || e.xpReward || 100
            }));
            setEvents(normalized);
        }).catch(() => setEvents([]));

        eventsAPI.getSurveys().then(data => {
            const normalized = (Array.isArray(data) ? data : []).map(s => ({
                ...s,
                endDate: s.end_date || s.endDate,
                xpReward: s.xp_reward || s.xpReward || 10
            }));
            setSurveys(normalized);
        }).catch(() => setSurveys([]));

        eventsAPI.getAnnouncements().then(data => {
            setAnnouncements(Array.isArray(data) ? data : []);
        }).catch(() => setAnnouncements([]));

        // Load news
        newsAPI.getAll().then(data => {
            setNews(Array.isArray(data) ? data : []);
        }).catch(() => setNews([]));

        // Load distinguished months
        distinguishedAPI.getMonths().then(months => {
            const m = Array.isArray(months) ? months : [];
            setAvailableMonths(m);
            if (m.length > 0) {
                setSelectedMonth(m[0]);
                loadDistinguished(m[0]);
            } else {
                // Default to current month
                const now = new Date().toISOString().slice(0, 7);
                setSelectedMonth(now);
                loadDistinguished(now);
            }
        }).catch(() => { });
    }, []);

    const loadDistinguished = (month) => {
        distinguishedAPI.getMembers(month).then(data => {
            setDistinguishedMembers(Array.isArray(data) ? data : []);
        }).catch(() => setDistinguishedMembers([]));
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
        loadDistinguished(month);
    };

    const handleSendMessage = async () => {
        if (!messageModal || !messageText.trim()) return;
        try {
            await distinguishedAPI.sendMessage(messageModal.id, messageText.trim());
            setMessageSent(true);
            setMessageText('');
            setTimeout(() => { setMessageModal(null); setMessageSent(false); }, 1500);
        } catch { alert('حدث خطأ'); }
    };

    const filteredEvents = events.filter(event => {
        if (filterCategory === 'all') return true;
        return event.category === filterCategory || event.type === filterCategory;
    });

    const handleRegister = (eventId) => {
        setSelectedEvent(events.find(e => e.id === eventId));
        setShowRegistrationModal(true);
    };

    const submitRegistration = async () => {
        if (!selectedEvent || !registrationForm.name) return;
        try {
            await eventsAPI.registerForEvent(selectedEvent.id, {
                name: registrationForm.name,
                email: registrationForm.email,
                phone: registrationForm.phone,
                student_id: registrationForm.studentId,
                experience: registrationForm.experience
            });
            setRegisteredEvents(prev => [...prev, selectedEvent.id]);
            // Update local count
            setEvents(prev => prev.map(e => e.id === selectedEvent.id
                ? { ...e, registered: (e.registered || 0) + 1 }
                : e
            ));
            setShowRegistrationModal(false);
            setRegistrationForm({ name: '', email: '', phone: '', studentId: '', experience: '' });
        } catch (err) {
            alert('حدث خطأ أثناء التسجيل: ' + (err.message || ''));
        }
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
        if (status === 'closed') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400">مغلق</span>;
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
                                <span className="text-[#7112AF] font-bold">{events.length}</span>
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
                            { id: 'news', label: 'الأخبار', icon: Newspaper },
                            { id: 'distinguished', label: 'المتميزين', icon: Award }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-bold transition-colors border-b-2 ${activeTab === tab.id
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
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filterCategory === cat.id
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
                                        className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#7112AF]/50 transition-all group ${viewMode === 'list' ? 'flex' : ''
                                            }`}
                                    >
                                        {/* Event Image/Icon */}
                                        <div className={`${viewMode === 'list' ? 'w-48' : 'h-48'} relative overflow-hidden`}>
                                            {event.image ? (
                                                <>
                                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                                    <div className="absolute inset-0" style={{ mixBlendMode: 'color', background: 'linear-gradient(135deg, rgba(113,18,175,0.3), rgba(255,0,110,0.15))' }} />
                                                </>
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/10 flex items-center justify-center">
                                                    {getEventIcon(event.category)}
                                                </div>
                                            )}
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
                                                    disabled={registeredEvents.includes(event.id) || event.registered >= event.maxParticipants || event.status === 'closed'}
                                                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${registeredEvents.includes(event.id)
                                                        ? 'bg-green-500/20 text-green-400 cursor-default'
                                                        : (event.status === 'closed' || event.registered >= event.maxParticipants)
                                                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white hover:shadow-[0_0_20px_rgba(113,18,175,0.5)]'
                                                        }`}
                                                >
                                                    {registeredEvents.includes(event.id) ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <CheckCircle size={16} />
                                                            مسجل
                                                        </span>
                                                    ) : event.status === 'closed' ? (
                                                        '🔒 مغلق'
                                                    ) : event.registered >= event.maxParticipants ? (
                                                        'مكتمل'
                                                    ) : (
                                                        'سجل الآن'
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedEvent(event); setShowDetailModal(true); }}
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
                            {surveys.map((survey, index) => (
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
                                                        className={`flex-1 p-2 rounded-lg text-right text-sm transition-colors ${surveyAnswers[survey.id] === i
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
                                        <span className="text-xs text-gray-500" dir="ltr">
                                            ينتهي: {new Date(survey.endDate).toLocaleDateString('ar-SA')}
                                        </span>
                                        <button
                                            onClick={() => submitSurvey(survey.id)}
                                            disabled={surveyAnswers[survey.id] === undefined}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${surveyAnswers[survey.id] !== undefined
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
                            {announcements.map((announcement, index) => (
                                <motion.div
                                    key={announcement.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-6 rounded-xl border ${announcement.priority === 'high'
                                        ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30'
                                        : 'bg-white/5 border-white/10'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${announcement.type === 'opportunity' ? 'bg-[#7112AF]/20' :
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

                    {/* News Tab */}
                    {activeTab === 'news' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto space-y-6"
                        >
                            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-8 text-center">
                                <Newspaper size={48} className="text-blue-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-white">أخبار النادي</h2>
                                <p className="text-gray-400">آخر الأخبار والتحديثات</p>
                            </div>

                            {news.length === 0 ? (
                                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                    <Newspaper size={48} className="text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400">لا توجد أخبار حالياً</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {news.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all"
                                        >
                                            {/* Image Banner */}
                                            {item.image_url && (
                                                <div className="relative h-52 overflow-hidden">
                                                    <img src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`} alt={item.title} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-transparent to-transparent" />
                                                    <div className="absolute inset-0" style={{ mixBlendMode: 'color', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.1))' }} />
                                                </div>
                                            )}

                                            <div className="p-6">
                                                {/* Tags & Date */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.tags && item.tags.split(',').filter(Boolean).map((tag, i) => (
                                                            <span key={i} className="text-[10px] px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full font-bold">{tag.trim()}</span>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                                        <Calendar size={12} />
                                                        {new Date(item.created_at).toLocaleDateString('ar-SA')}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>

                                                {/* Body */}
                                                <div className={`obs-prose text-sm leading-relaxed ${expandedNews !== item.id ? 'max-h-32 overflow-hidden relative' : ''}`}>
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.body || ''}</ReactMarkdown>
                                                    {expandedNews !== item.id && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0d1a] to-transparent" />
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => setExpandedNews(expandedNews === item.id ? null : item.id)}
                                                    className="mt-3 text-sm text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5"
                                                >
                                                    {expandedNews === item.id ? (
                                                        <><ChevronRight size={14} className="rotate-90" /> عرض أقل</>
                                                    ) : (
                                                        <><ChevronRight size={14} className="-rotate-90" /> اقرأ المزيد</>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Distinguished Members Tab */}
                    {activeTab === 'distinguished' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto space-y-6"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/10 border border-[#7112AF]/30 rounded-2xl p-8 text-center">
                                <Award size={48} className="text-yellow-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-white">لائحة المتميزين</h2>
                                <p className="text-gray-400">أعضاء النادي المتميزين عبر تاريخ الموقع</p>
                            </div>

                            {/* Month Calendar Selector */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2"><Calendar size={16} /> اختر الشهر</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(availableMonths.length > 0 ? availableMonths : [selectedMonth]).map((m) => {
                                        const [y, mo] = m.split('-');
                                        const label = new Date(y, parseInt(mo) - 1).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' });
                                        return (
                                            <button
                                                key={m}
                                                onClick={() => handleMonthChange(m)}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedMonth === m
                                                    ? 'bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white shadow-[0_0_15px_rgba(113,18,175,0.4)]'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Members Grid */}
                            {distinguishedMembers.length === 0 ? (
                                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                    <Award size={48} className="text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400">لا يوجد متميزين لهذا الشهر</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                    {distinguishedMembers.map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="rounded-xl p-6 transition-all"
                                            style={{
                                                background: `linear-gradient(135deg, ${member.color || '#f59e0b'}15, ${member.color || '#f59e0b'}08)`,
                                                border: `1px solid ${member.color || '#f59e0b'}33`
                                            }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-black flex-shrink-0"
                                                    style={{ background: `linear-gradient(135deg, ${member.color || '#f59e0b'}, ${member.color || '#f59e0b'}cc)` }}
                                                >
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-white text-lg">{member.name}</h3>
                                                    {member.committee && (
                                                        <span className="inline-block px-3 py-1 bg-[#7112AF]/20 text-[#7112AF] rounded-full text-xs font-bold mt-1">
                                                            {member.committee}
                                                        </span>
                                                    )}
                                                    {member.reason && (
                                                        <p className="text-gray-400 text-sm mt-2">✨ {member.reason}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => setMessageModal(member)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
                                                >
                                                    <Send size={14} />
                                                    أرسل رسالة
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const isOpen = viewingMemberMsgs[member.id];
                                                        setViewingMemberMsgs(prev => ({ ...prev, [member.id]: !isOpen }));
                                                        if (!isOpen) {
                                                            try {
                                                                const msgs = await distinguishedAPI.getMessages(member.id);
                                                                setMemberMessages(prev => ({ ...prev, [member.id]: Array.isArray(msgs) ? msgs : [] }));
                                                            } catch { setMemberMessages(prev => ({ ...prev, [member.id]: [] })); }
                                                        }
                                                    }}
                                                    className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg text-sm transition-all ${viewingMemberMsgs[member.id]
                                                        ? 'bg-[#7112AF]/20 border-[#7112AF]/50 text-[#7112AF]'
                                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
                                                        }`}
                                                >
                                                    <MessageSquare size={14} />
                                                    الرسائل
                                                </button>
                                            </div>
                                            {/* Messages Display */}
                                            <AnimatePresence>
                                                {viewingMemberMsgs[member.id] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden mt-4 pt-4 border-t border-white/10"
                                                    >
                                                        <h4 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
                                                            <MessageSquare size={12} />
                                                            رسائل مجهولة ({(memberMessages[member.id] || []).length})
                                                        </h4>
                                                        {(memberMessages[member.id] || []).length === 0 ? (
                                                            <p className="text-xs text-gray-500 text-center py-3">لا توجد رسائل بعد — كن أول من يرسل! 💬</p>
                                                        ) : (
                                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                                {(memberMessages[member.id] || []).map(msg => (
                                                                    <div key={msg.id} className="bg-white/5 rounded-lg p-3">
                                                                        <p className="text-white text-sm">{msg.message}</p>
                                                                        <span className="text-xs text-gray-500 mt-1 block">{new Date(msg.created_at).toLocaleDateString('ar-SA')}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Anonymous Message Modal */}
                    <AnimatePresence>
                        {messageModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                onClick={() => { setMessageModal(null); setMessageText(''); setMessageSent(false); }}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    onClick={e => e.stopPropagation()}
                                    className="bg-[#0a0a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md"
                                >
                                    {messageSent ? (
                                        <div className="text-center py-8">
                                            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                                            <h3 className="text-xl font-bold text-white mb-2">تم الإرسال!</h3>
                                            <p className="text-gray-400">تم إرسال رسالتك المجهولة بنجاح</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Send size={20} className="text-[#7112AF]" />
                                                    رسالة مجهولة لـ {messageModal.name}
                                                </h3>
                                                <button onClick={() => { setMessageModal(null); setMessageText(''); }} className="p-1 hover:bg-white/10 rounded-lg">
                                                    <X size={20} className="text-gray-400" />
                                                </button>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-4">رسالتك ستكون مجهولة تماماً. الحد الأقصى 200 حرف.</p>
                                            <textarea
                                                value={messageText}
                                                onChange={e => setMessageText(e.target.value.slice(0, 200))}
                                                placeholder="اكتب رسالتك هنا..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 resize-none h-28 focus:outline-none focus:border-[#7112AF]/50"
                                                dir="rtl"
                                            />
                                            <div className="flex items-center justify-between mt-2 mb-4">
                                                <span className="text-xs text-gray-500">{messageText.length}/200</span>
                                            </div>
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!messageText.trim()}
                                                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${messageText.trim()
                                                    ? 'bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white hover:shadow-[0_0_20px_rgba(113,18,175,0.5)]'
                                                    : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Send size={16} />
                                                إرسال
                                            </button>
                                        </>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
            {/* Event Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0a0a0f] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                            dir="rtl"
                        >
                            {/* Header */}
                            <div className="p-6 bg-gradient-to-r from-[#7112AF]/20 to-[#ff006e]/10 border-b border-white/10">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                                        <div className="flex gap-2 flex-wrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedEvent.status === 'open' ? 'bg-green-500/20 text-green-400' :
                                                selectedEvent.status === 'almost_full' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {selectedEvent.status === 'open' ? 'مفتوح' : selectedEvent.status === 'almost_full' ? 'أماكن محدودة' : 'مغلق'}
                                            </span>
                                            <span className="px-3 py-1 bg-[#7112AF]/20 text-[#7112AF] rounded-full text-xs font-bold">
                                                {selectedEvent.type}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Description */}
                                {selectedEvent.description && (
                                    <div>
                                        <h3 className="text-sm font-bold text-[#7112AF] mb-2">الوصف</h3>
                                        <p className="text-gray-300 leading-relaxed">{selectedEvent.description}</p>
                                    </div>
                                )}

                                {/* Key Info Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-2 text-[#7112AF] mb-1">
                                            <Calendar size={16} />
                                            <span className="text-xs font-bold">التاريخ</span>
                                        </div>
                                        <p className="text-white text-sm">{selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-2 text-[#7112AF] mb-1">
                                            <Clock size={16} />
                                            <span className="text-xs font-bold">الوقت</span>
                                        </div>
                                        <p className="text-white text-sm">{selectedEvent.time || '-'}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-2 text-[#7112AF] mb-1">
                                            <MapPin size={16} />
                                            <span className="text-xs font-bold">المكان</span>
                                        </div>
                                        <p className="text-white text-sm">{selectedEvent.location || '-'}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-2 text-[#7112AF] mb-1">
                                            <Users size={16} />
                                            <span className="text-xs font-bold">السعة</span>
                                        </div>
                                        <p className="text-white text-sm">{selectedEvent.registered || 0} / {selectedEvent.maxParticipants || 50} مشارك</p>
                                    </div>
                                </div>

                                {/* XP & Badges */}
                                <div className="flex items-center gap-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                                    <div className="flex items-center gap-2 text-yellow-400">
                                        <Star size={20} />
                                        <span className="font-bold">+{selectedEvent.xpReward || selectedEvent.xp_reward || 0} XP</span>
                                    </div>
                                    {selectedEvent.badges && selectedEvent.badges.length > 0 && (
                                        <div className="flex gap-2 mr-auto">
                                            {selectedEvent.badges.map((b, i) => (
                                                <span key={i} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">{b}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Organizer / Instructor */}
                                {(selectedEvent.organizer || selectedEvent.instructor || selectedEvent.speaker) && (
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        {selectedEvent.organizer && (
                                            <div className="mb-2"><span className="text-xs text-gray-400">المنظم: </span><span className="text-white text-sm font-bold">{selectedEvent.organizer}</span></div>
                                        )}
                                        {(selectedEvent.instructor || selectedEvent.speaker) && (
                                            <div><span className="text-xs text-gray-400">المحاضر: </span><span className="text-white text-sm font-bold">{selectedEvent.instructor || selectedEvent.speaker}</span></div>
                                        )}
                                    </div>
                                )}

                                {/* Requirements */}
                                {selectedEvent.requirements && selectedEvent.requirements.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-[#7112AF] mb-2">المتطلبات</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedEvent.requirements.map((r, i) => (
                                                <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs border border-red-500/20">{r}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Prerequisites */}
                                {selectedEvent.prerequisites && selectedEvent.prerequisites.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-[#7112AF] mb-2">المتطلبات المسبقة</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedEvent.prerequisites.map((p, i) => (
                                                <span key={i} className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-lg text-xs border border-orange-500/20">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Materials */}
                                {selectedEvent.materials && selectedEvent.materials.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-[#7112AF] mb-2">الأدوات والمواد</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedEvent.materials.map((m, i) => (
                                                <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs border border-blue-500/20">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Agenda */}
                                {selectedEvent.agenda && selectedEvent.agenda.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-[#7112AF] mb-3">جدول الفعالية</h3>
                                        <div className="space-y-2 border-r-2 border-[#7112AF]/30 pr-4 mr-2">
                                            {selectedEvent.agenda.map((item, i) => (
                                                <div key={i} className="flex items-start gap-3 relative">
                                                    <div className="absolute -right-[1.35rem] top-1 w-3 h-3 rounded-full bg-[#7112AF] border-2 border-[#0a0a0f]" />
                                                    <span className="text-[#7112AF] font-mono text-xs mt-0.5 min-w-[3rem]">{item.time}</span>
                                                    <span className="text-gray-300 text-sm">{item.activity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Categories / Topics */}
                                {selectedEvent.categories && selectedEvent.categories.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-[#7112AF] mb-2">التصنيفات</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedEvent.categories.map((c, i) => (
                                                <span key={i} className="px-3 py-1 bg-[#7112AF]/10 text-[#7112AF] rounded-lg text-xs border border-[#7112AF]/20">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedEvent.topics && selectedEvent.topics.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-[#7112AF] mb-2">المواضيع</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedEvent.topics.map((t, i) => (
                                                <span key={i} className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs border border-cyan-500/20">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Prizes */}
                                {selectedEvent.prizes && selectedEvent.prizes.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-yellow-400 mb-2 flex items-center gap-2"><Trophy size={16} /> الجوائز</h3>
                                        <div className="space-y-2">
                                            {selectedEvent.prizes.map((p, i) => (
                                                <div key={i} className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                                    <span className="text-yellow-400 font-bold text-sm">🏆</span>
                                                    <span className="text-yellow-200 text-sm">{p}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Activities */}
                                {selectedEvent.activities && selectedEvent.activities.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-[#7112AF] mb-2">الأنشطة</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedEvent.activities.map((a, i) => (
                                                <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs border border-green-500/20">{a}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Register Button */}
                                <button
                                    onClick={() => { setShowDetailModal(false); handleRegister(selectedEvent.id); }}
                                    disabled={registeredEvents.includes(selectedEvent.id) || selectedEvent.registered >= selectedEvent.maxParticipants || selectedEvent.status === 'closed'}
                                    className={`w-full py-4 rounded-xl font-bold transition-all ${registeredEvents.includes(selectedEvent.id)
                                        ? 'bg-green-500/20 text-green-400'
                                        : (selectedEvent.status === 'closed' || selectedEvent.registered >= selectedEvent.maxParticipants)
                                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white hover:shadow-[0_0_30px_rgba(113,18,175,0.5)]'
                                        }`}
                                >
                                    {registeredEvents.includes(selectedEvent.id) ? '✅ مسجل' :
                                        selectedEvent.status === 'closed' ? '🔒 مغلق' :
                                            selectedEvent.registered >= selectedEvent.maxParticipants ? 'مكتمل' : 'سجل الآن'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
