import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Target, Terminal, Clock, Calendar, Users, Star,
    ChevronRight, ChevronDown, Play, BookOpen, Award, Filter,
    Video, FileText, Hash, Lock, CheckCircle, User, Eye,
    Heart, Bookmark, Share2, Plus
} from 'lucide-react';
import { lmsAPI } from '../services/api';
// apiCall removed because we will use useAuth for apiCall and user
import axios from 'axios';
import LessonViewer from '../components/LessonViewer';
import ArticleViewer from '../components/ArticleViewer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MarkdownEditorModal from '../components/ui/MarkdownEditorModal';
import { useAuth } from '../context/AuthContext';

const ICON_MAP = {
    'Shield': Shield, 'Target': Target, 'Terminal': Terminal,
    'Cpu': Terminal, 'Server': Terminal
};


import { useAuth, API_BASE_URL } from '../context/AuthContext';

const MEDIA_URL = API_BASE_URL.replace(/\/api\/?$/, '');

// ─── Progress helpers (localStorage) ──────────────────────
// (Progress helpers removed)


// ─── Track Card ───────────────────────────────────────────
function TrackCard({ track, onClick, onEnroll, enrolled, completedLessons = [] }) {
    const Icon = ICON_MAP[track.icon] || Shield;
    const totalLessons = track.courses?.reduce((a, c) => a + (c.units?.reduce((b, u) => b + (u.lessons?.length || 0), 0) || 0), 0) || 0;
    const totalXP = track.courses?.reduce((a, c) => a + (c.units?.reduce((b, u) => b + (u.lessons?.reduce((x, l) => x + (l.xp_reward || 0), 0) || 0), 0) || 0), 0) || 0;

    // Calculate progress if enrolled
    const completedCount = track.courses?.reduce((a, c) => a + (c.units?.reduce((b, u) => b + (u.lessons?.filter(l => completedLessons.includes(l.id))?.length || 0), 0) || 0), 0) || 0;
    const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

    const handleEnroll = async (e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            if (!token) return alert('يجب تسجيل يالدخول أولاً');

            await lmsAPI.enroll({ type: 'track', itemId: track.id });
            if (onEnroll) onEnroll(track);
        } catch (error) {
            console.error(error);
            alert(`فشل التسجيل: ${error.message}`);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4 }}
            onClick={enrolled ? () => onClick(track) : undefined}
            className={`bg-[#050214] border ${enrolled ? 'border-[#7112AF]' : 'border-white/10'} rounded-2xl p-6 cursor-pointer hover:border-[#ff006e] hover:shadow-[0_0_30px_rgba(255,0,110,0.2)] transition-all duration-300 group relative overflow-hidden backdrop-blur-md`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7112AF]/20 rounded-full blur-3xl group-hover:bg-[#ff006e]/20 transition-colors duration-500" />
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-4 bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/10 rounded-xl border border-[#7112AF]/30 shadow-[0_0_15px_rgba(113,18,175,0.3)]">
                        <Icon size={32} className="text-[#d4b3ff] group-hover:scale-110 transition-transform" />
                    </div>
                    {enrolled && progress > 0 && (
                        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">{progress}% مكتمل</span>
                    )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff006e] transition-colors">{track.title}</h3>
                <p className="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed">{track.description}</p>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2 text-xs font-bold">
                        <span className="bg-[#7112AF]/20 text-[#d4b3ff] px-2 py-1 rounded inline-flex items-center gap-1"><BookOpen size={12} /> {totalLessons} درس</span>
                        <span className="bg-[#ff006e]/20 text-[#ffb3d9] px-2 py-1 rounded inline-flex items-center gap-1"><Star size={12} /> {totalXP} XP</span>
                    </div>

                    {!enrolled ? (
                        <button onClick={handleEnroll} className="px-5 py-2 bg-gradient-to-r from-[#7112AF] to-[#ff006e] hover:shadow-[0_0_20px_rgba(113,18,175,0.5)] text-white text-xs font-bold rounded-lg transition-all hover:scale-105 z-20">
                            تسجيل في المسار
                        </button>
                    ) : (
                        <span className="text-sm font-bold text-green-400 flex items-center gap-1 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                            <CheckCircle size={16} /> مسجل بالفعل
                        </span>
                    )}
                </div>

                {enrolled && progress > 0 && (
                    <div className="mt-4 w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progress}%` }}>
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─── Recorded Course Card ─────────────────────────────────
function CourseCard({ course }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#12122a] border border-[#1f1f3d] rounded-xl overflow-hidden hover:border-blue-500/30 transition-all">
            <div className="h-40 bg-gradient-to-br from-blue-600/20 to-cyan-600/10 flex items-center justify-center relative">
                {course.thumbnail_url ? <img src={course.thumbnail_url.startsWith('http') ? course.thumbnail_url : `${MEDIA_URL}${course.thumbnail_url}`} alt="" className="w-full h-full object-cover" />
                    : <Video size={40} className="text-blue-400" />}
                {course.duration && (
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Clock size={10} /> {course.duration}
                    </span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-white mb-1">{course.title}</h3>
                {course.instructor && <p className="text-xs text-gray-400 flex items-center gap-1 mb-2"><User size={12} /> {course.instructor}</p>}
                <p className="text-sm text-gray-400 line-clamp-2">{course.description}</p>
                {course.video_url && (
                    <button onClick={() => setExpanded(!expanded)}
                        className="mt-3 flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 font-bold">
                        <Play size={14} /> {expanded ? 'إخفاء' : 'مشاهدة'}
                    </button>
                )}
                {expanded && course.video_url && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                        {course.video_url.includes('youtube') || course.video_url.includes('youtu.be') ? (
                            <iframe src={course.video_url.replace('watch?v=', 'embed/')} className="w-full aspect-video" allowFullScreen />
                        ) : (
                            <video src={course.video_url} controls className="w-full aspect-video" />
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─── Article Card ─────────────────────────────────────────
function ArticleCard({ article, onClick }) {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check initial status from backend
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const status = await apiCall(`/user/item-status/article/${article.id}`);
                setLiked(status.isLiked);
                setSaved(status.isBookmarked);
            } catch (err) {
                // Silent fail - just show as not liked/saved
            }
        };
        if (article.id) checkStatus();
    }, [article.id]);

    const toggleLike = async (e) => {
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        try {
            if (liked) {
                await apiCall('/user/likes/remove', {
                    method: 'POST',
                    body: JSON.stringify({ itemId: article.id, itemType: 'article' })
                });
            } else {
                await apiCall('/user/likes/add', {
                    method: 'POST',
                    body: JSON.stringify({ itemId: article.id, itemType: 'article' })
                });
            }
            setLiked(!liked);
        } catch (err) {
            alert('خطأ: ' + (err.message || 'فشل في حفظ الإعجاب'));
        } finally {
            setLoading(false);
        }
    };

    const toggleSave = async (e) => {
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        try {
            if (saved) {
                await apiCall('/user/bookmarks/remove', {
                    method: 'POST',
                    body: JSON.stringify({ itemId: article.id, itemType: 'article' })
                });
            } else {
                await apiCall('/user/bookmarks/add', {
                    method: 'POST',
                    body: JSON.stringify({ itemId: article.id, itemType: 'article', note: article.title })
                });
            }
            setSaved(!saved);
        } catch (err) {
            alert('خطأ: ' + (err.message || 'فشل في حفظ المقال'));
        } finally {
            setLoading(false);
        }
    };

    const handleShare = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({ title: article.title, text: article.description, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('تم نسخ الرابط');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className="bg-[#12122a] border border-[#1f1f3d] rounded-xl overflow-hidden hover:border-orange-500/30 transition-all cursor-pointer group">
            {article.cover_image && (
                <img
                    src={article.cover_image.startsWith('http') || article.cover_image.startsWith('data:') ? article.cover_image : `${MEDIA_URL}${article.cover_image}`}
                    alt={article.title}
                    className="w-full h-36 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">{article.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{article.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User size={12} /> {article.author || 'غير محدد'}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {article.read_time || 5} دقيقة</span>
                </div>
                {/* Interaction buttons */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#1f1f3d]">
                    <button onClick={toggleLike}
                        className={`flex items-center gap-1 text-xs transition-all ${liked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}>
                        <Heart size={14} className={liked ? 'fill-current' : ''} />
                        <span>إعجاب</span>
                    </button>
                    <button onClick={toggleSave}
                        className={`flex items-center gap-1 text-xs transition-all ${saved ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}>
                        <Bookmark size={14} className={saved ? 'fill-current' : ''} />
                        <span>حفظ</span>
                    </button>
                    <button onClick={handleShare}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-400 transition-all">
                        <Share2 size={14} />
                        <span>مشاركة</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Collapsible Unit (with lock/progress) ────────────────
function CollapsibleUnit({ unit, unitIndex, onLessonSelect, completedLessons }) {
    const [open, setOpen] = useState(unitIndex === 0);
    const totalL = unit.lessons?.length || 0;
    const doneL = unit.lessons?.filter(l => completedLessons.includes(l.id))?.length || 0;
    const pct = totalL ? Math.round((doneL / totalL) * 100) : 0;

    return (
        <div className="bg-[#12122a] border border-[#1f1f3d] rounded-xl overflow-hidden">
            <button onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                    {open ? <ChevronDown size={16} className="text-purple-400" /> : <ChevronRight size={16} className="text-gray-500" />}
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="font-bold text-sm text-gray-200">{unit.title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{doneL}/{totalL}</span>
                    <div className="w-16 bg-white/10 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                </div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden">
                        <div className="p-2 space-y-0.5 border-t border-[#1f1f3d]">
                            {unit.lessons?.map((lesson, li) => {
                                const isDone = completedLessons.includes(lesson.id);
                                const prevDone = li === 0 || completedLessons.includes(unit.lessons[li - 1]?.id);
                                const isLocked = li > 0 && !prevDone;

                                return (
                                    <button key={lesson.id}
                                        onClick={() => !isLocked && onLessonSelect(lesson)}
                                        disabled={isLocked}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg text-right transition-all ${isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5 cursor-pointer'
                                            }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-md ${isDone ? 'bg-green-500/20' : isLocked ? 'bg-gray-800' : 'bg-[#1f1f3d]'}`}>
                                                {isDone ? <CheckCircle size={14} className="text-green-400" />
                                                    : isLocked ? <Lock size={14} className="text-gray-600" />
                                                        : <Play size={14} className="text-gray-400 fill-current" />}
                                            </div>
                                            <span className={`text-sm ${isDone ? 'text-green-400' : isLocked ? 'text-gray-600' : 'text-gray-300'}`}>
                                                {lesson.title}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {lesson.xp_reward > 0 && (
                                                <span className="text-xs font-mono text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">{lesson.xp_reward} XP</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
//  MAIN: KnowledgeBase
// ═══════════════════════════════════════════════════════════
export default function KnowledgeBase() {
    const { "*": param } = useParams();
    const trackIdFromUrl = param ? parseInt(param.split('/')[0]) : null;

    const [activeTab, setActiveTab] = useState('tracks');
    const [syllabus, setSyllabus] = useState([]);
    const [recordedCourses, setRecordedCourses] = useState([]);
    const [articles, setArticles] = useState([]);
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [activeTag, setActiveTag] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [completedLessons, setCompletedLessons] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [showEditorModal, setShowEditorModal] = useState(false);
    const { user, apiCall } = useAuth();
    const isEditor = user?.role === 'admin' || user?.role === 'editor';

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            lmsAPI.getSyllabus().catch(() => []),
            lmsAPI.getRecordedCourses().catch(() => []),
            lmsAPI.getArticles().catch(() => []),
            lmsAPI.getTags().catch(() => []),
        ]).then(([syl, rc, art, tgs]) => {
            const syllabusData = Array.isArray(syl) ? syl : [];
            setSyllabus(syllabusData);
            setRecordedCourses(Array.isArray(rc) ? rc : []);
            setArticles(Array.isArray(art) ? art : []);
            setTags(Array.isArray(tgs) ? tgs : []);

            // Deep Linking Logic
            if (param) {
                if (param.startsWith('articles/')) {
                    const articleId = parseInt(param.split('/')[1]);
                    const foundArticle = (Array.isArray(art) ? art : []).find(a => a.id === articleId);
                    if (foundArticle) {
                        setSelectedArticle(foundArticle);
                        setActiveTab('articles');
                    }
                } else {
                    const trackId = parseInt(param.split('/')[0]);
                    if (!isNaN(trackId)) {
                        const foundTrack = syllabusData.find(t => t.id === trackId);
                        if (foundTrack) setSelectedTrack(foundTrack);
                    }
                }
            }
        }).catch(err => console.error("Error fetching data:", err)).finally(() => setIsLoading(false));

        // Fetch enrollments and history reliably
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const profileData = await apiCall('/auth/profile');
                    if (profileData && profileData.enrollments) {
                        const trackIds = profileData.enrollments
                            .filter(e => e.type === 'track')
                            .map(e => Number(e.item_id));
                        setEnrollments(trackIds);
                    }

                    const completedKeys = await lmsAPI.getCompletedLessons();
                    setCompletedLessons(completedKeys);
                }
            } catch (err) {
                console.warn('Failed to fetch user progress:', err);
            }
        };
        fetchUserData();

    }, [param, apiCall]); // Depend on param to re-run if URL changes

    const handleCreateArticle = async (formData) => {
        try {
            await lmsAPI.createArticle(formData);
            setShowEditorModal(false);
            // Refresh articles
            const updatedArgs = await lmsAPI.getArticles();
            setArticles(Array.isArray(updatedArgs) ? updatedArgs : []);
        } catch (error) {
            console.error('Failed to create article:', error);
            alert('فشل في نشر المقال');
        }
    };

    // (Duplicate useEffect removed)

    const handleLessonComplete = () => {
        if (selectedLesson) {
            lmsAPI.markLessonComplete(selectedLesson.id)
                .then(() => {
                    setCompletedLessons(prev => [...prev, selectedLesson.id]);
                    alert(`أحسنت! أكملت الدرس وحصلت على ${selectedLesson.xp_reward || 10} XP`);
                })
                .catch(err => {
                    console.error('Lesson completion error:', err);
                    alert(`خطأ في حفظ التقدم: ${err.response?.data?.error || err.message}`);
                });
        }
    };

    const filteredTracks = syllabus.filter(t =>
        !searchQuery || t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const TABS = [
        { id: 'tracks', label: 'المسارات والدروس', icon: BookOpen },
        { id: 'recorded', label: 'الدورات المسجلة', icon: Video },
        { id: 'articles', label: 'المقالات', icon: FileText },
    ];

    // ─── Level 3: Lesson Viewer ───
    if (selectedLesson) {
        // Find the course containing this lesson for sidebar navigation
        let currentCourse = null;
        if (selectedTrack) {
            for (const course of selectedTrack.courses || []) {
                for (const unit of course.units || []) {
                    if ((unit.lessons || []).some(l => l.id === selectedLesson.id)) {
                        currentCourse = course;
                        break;
                    }
                }
                if (currentCourse) break;
            }
        }

        return (
            <LessonViewer
                lesson={selectedLesson}
                course={currentCourse}
                completedLessons={completedLessons}
                onBack={() => setSelectedLesson(null)}
                onSelectLesson={(lesson) => setSelectedLesson(lesson)}
                onComplete={() => {
                    handleLessonComplete();
                    // Find next lesson
                    if (selectedTrack) {
                        for (const course of selectedTrack.courses || []) {
                            for (const unit of course.units || []) {
                                const lessons = unit.lessons || [];
                                const idx = lessons.findIndex(l => l.id === selectedLesson.id);
                                if (idx >= 0 && idx < lessons.length - 1) {
                                    setSelectedLesson(lessons[idx + 1]);
                                    return;
                                }
                            }
                        }
                    }
                    setSelectedLesson(null);
                }}
            />
        );
    }

    // ─── Level 3: Article Viewer ───
    // ─── Level 3: Article Viewer ───
    if (selectedArticle) {
        return (
            <ArticleViewer
                article={selectedArticle}
                onBack={() => setSelectedArticle(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#05050f] text-white font-cairo" dir="rtl">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Header */}
            <div className="relative z-10 border-b border-white/5 bg-[#050214]/80 backdrop-blur-xl">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 right-0 w-96 h-96 bg-[#7112AF] rounded-full blur-[150px] opacity-10" />
                </div>
                <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/10 rounded-2xl border border-[#7112AF]/30 shadow-[0_0_30px_rgba(113,18,175,0.2)]">
                                <BookOpen size={36} className="text-white drop-shadow-md" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-400 mb-1">قاعدة المعرفة</h1>
                                <p className="text-gray-400 font-medium tracking-wide">تعلم، تدرب، واحترف الأمن السيبراني معنا</p>
                            </div>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ff006e] transition-colors" size={18} />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                placeholder="ابحث في المسارات، الدورات، أو المقالات..."
                                className="w-full pr-12 pl-4 py-3 bg-[#0a051e] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff006e] focus:ring-1 focus:ring-[#ff006e] shadow-inner transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs (ClubActivities-inspired) */}
            <div className="relative z-10 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-2">
                        {TABS.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setSelectedTrack(null); }}
                                    className={`flex items-center gap-2 px-6 py-4 font-bold transition-colors border-b-2 ${activeTab === tab.id
                                        ? 'text-purple-400 border-purple-500'
                                        : 'text-gray-400 border-transparent hover:text-white'
                                        }`}>
                                    <Icon size={18} /> {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tag Filter Bar */}
            {tags.length > 0 && (
                <div className="relative z-10 border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
                        <button onClick={() => setActiveTag(null)}
                            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${!activeTag ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}>الكل</button>
                        {tags.map(tag => (
                            <button key={tag.id} onClick={() => setActiveTag(tag.name)}
                                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${activeTag === tag.name ? 'border' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                                style={activeTag === tag.name ? { backgroundColor: tag.color + '20', borderColor: tag.color + '40', color: tag.color } : {}}>
                                <Hash size={10} /> {tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-[#12122a] rounded-xl animate-pulse" />)}
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {/* ═══ TRACKS TAB ═══ */}
                            {activeTab === 'tracks' && !selectedTrack && (
                                <motion.div key="tracks-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredTracks.map(track => (
                                            <TrackCard
                                                key={track.id}
                                                track={track}
                                                onClick={setSelectedTrack}
                                                onEnroll={(t) => {
                                                    setEnrollments(prev => [...prev, t.id]);
                                                    setSelectedTrack(t);
                                                }}
                                                enrolled={enrollments.includes(track.id)}
                                                completedLessons={completedLessons}
                                            />
                                        ))}
                                    </div>
                                    {filteredTracks.length === 0 && (
                                        <div className="text-center py-20 text-gray-500"><p className="text-lg">لا توجد مسارات حالياً</p></div>
                                    )}
                                </motion.div>
                            )}

                            {/* ═══ TRACK DETAIL ═══ */}
                            {activeTab === 'tracks' && selectedTrack && (
                                <motion.div key="track-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                                    <button onClick={() => setSelectedTrack(null)}
                                        className="flex items-center text-gray-400 hover:text-white mb-6 group transition-colors">
                                        <ChevronRight className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" />
                                        <span>عودة للمسارات</span>
                                    </button>

                                    {/* Track Header */}
                                    <div className="bg-[#12122a] border border-[#1f1f3d] rounded-2xl p-6 mb-6">
                                        <h2 className="text-2xl font-bold text-white mb-2">{selectedTrack.title}</h2>
                                        <p className="text-gray-400 text-sm mb-4">{selectedTrack.description}</p>
                                        {(() => {
                                            const totalL = selectedTrack.courses?.reduce((a, c) => a + (c.units?.reduce((b, u) => b + (u.lessons?.length || 0), 0) || 0), 0) || 0;
                                            const doneL = selectedTrack.courses?.reduce((a, c) => a + (c.units?.reduce((b, u) => b + (u.lessons?.filter(l => completedLessons.includes(l.id))?.length || 0), 0) || 0), 0) || 0;
                                            const pct = totalL ? Math.round((doneL / totalL) * 100) : 0;
                                            return (
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 bg-white/10 rounded-full h-2.5">
                                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-sm font-bold text-purple-400 whitespace-nowrap">{pct}% مكتمل</span>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Courses > Units > Lessons */}
                                    <div className="space-y-6">
                                        {selectedTrack.courses?.map(course => (
                                            <div key={course.id}>
                                                <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                                                    <BookOpen size={18} /> {course.title}
                                                </h3>
                                                <div className="space-y-2">
                                                    {course.units?.map((unit, ui) => (
                                                        <CollapsibleUnit key={unit.id} unit={unit} unitIndex={ui}
                                                            onLessonSelect={(l) => { setSelectedLesson(l); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                            completedLessons={completedLessons} />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ RECORDED COURSES TAB ═══ */}
                            {activeTab === 'recorded' && (
                                <motion.div key="recorded" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {recordedCourses.map(c => <CourseCard key={c.id} course={c} />)}
                                    </div>
                                    {recordedCourses.length === 0 && (
                                        <div className="text-center py-20 text-gray-500"><p className="text-lg">لا توجد دورات مسجلة حالياً</p></div>
                                    )}
                                </motion.div>
                            )}

                            {/* ═══ ARTICLES TAB ═══ */}
                            {activeTab === 'articles' && (
                                <motion.div key="articles" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                                    {isEditor && (
                                        <div className="flex justify-end mb-6">
                                            <button
                                                onClick={() => setShowEditorModal(true)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all"
                                            >
                                                <Plus size={18} /> إضافة مقال
                                            </button>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {articles.map(a => <ArticleCard key={a.id} article={a} onClick={() => setSelectedArticle(a)} />)}
                                    </div>
                                    {articles.length === 0 && (
                                        <div className="text-center py-20 text-gray-500"><p className="text-lg">لا توجد مقالات حالياً</p></div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            <MarkdownEditorModal
                isOpen={showEditorModal}
                onClose={() => setShowEditorModal(false)}
                onSubmit={handleCreateArticle}
                type="article"
            />
        </div>
    );
}
