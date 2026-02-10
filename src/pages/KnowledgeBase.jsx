import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    BookOpen, Terminal, Globe, Shield, Cpu, ExternalLink, ArrowRight, Zap, Network,
    Search, Filter, Clock, Eye, Heart, MessageSquare, Share2, Bookmark,
    TrendingUp, Star, Users, Calendar, Award, Target, Brain,
    PlayCircle, CheckCircle, Lock, Unlock, FileText, Video,
    Download, ThumbsUp, ThumbsDown, BarChart3, Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';

const KNOWLEDGE_CATEGORIES = [
    { 
        id: 'os', 
        title: 'أنظمة التشغيل', 
        icon: Terminal, 
        color: 'text-green-400', 
        bg: 'bg-green-400/10', 
        desc: 'قلب التحكم: Linux & Windows',
        count: 45,
        progress: 78
    },
    { 
        id: 'network', 
        title: 'الشبكات والاتصال', 
        icon: Globe, 
        color: 'text-blue-400', 
        bg: 'bg-blue-400/10', 
        desc: 'لغة التواصل بين الأجهزة',
        count: 38,
        progress: 65
    },
    { 
        id: 'security', 
        title: 'أساسيات الأمن', 
        icon: Shield, 
        color: 'text-red-400', 
        bg: 'bg-red-400/10', 
        desc: 'الدفاع والهجوم السيبراني',
        count: 52,
        progress: 82
    },
    { 
        id: 'tools', 
        title: 'الأدوات والتقنيات', 
        icon: Cpu, 
        color: 'text-purple-400', 
        bg: 'bg-purple-400/10', 
        desc: 'ترسانة الهاكر الأخلاقي',
        count: 41,
        progress: 71
    },
    { 
        id: 'cryptography', 
        title: 'التشفير', 
        icon: Lock, 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-400/10', 
        desc: 'فن إخفاء المعلومات',
        count: 29,
        progress: 59
    },
    { 
        id: 'web', 
        title: 'أمن الويب', 
        icon: Globe, 
        color: 'text-orange-400', 
        bg: 'bg-orange-400/10', 
        desc: 'حماية التطبيقات والمواقع',
        count: 36,
        progress: 74
    }
];

const LESSONS = [
    {
        id: 1,
        title: 'مقدمة إلى أوامر Linux الأساسية',
        category: 'os',
        level: 'beginner',
        duration: '45 دقيقة',
        views: 1234,
        likes: 89,
        rating: 4.8,
        author: 'أحمد محمد',
        date: '2024-01-20',
        description: 'تعلم أساسيات التعامل مع سطر الأوامر في Linux',
        tags: ['linux', 'bash', 'أساسيات'],
        thumbnail: 'linux-basics',
        completed: false,
        progress: 0,
        type: 'video'
    },
    {
        id: 2,
        title: 'فهم بروتوكول TCP/IP',
        category: 'network',
        level: 'intermediate',
        duration: '60 دقيقة',
        views: 856,
        likes: 67,
        rating: 4.6,
        author: 'فاطمة علي',
        date: '2024-01-19',
        description: 'شرح مفصل لبروتوكولات الإنترنت الأساسية',
        tags: ['tcp', 'ip', 'شبكات'],
        thumbnail: 'tcp-ip',
        completed: true,
        progress: 100,
        type: 'article'
    },
    {
        id: 3,
        title: 'هجمات حقن SQL',
        category: 'security',
        level: 'advanced',
        duration: '90 دقيقة',
        views: 2341,
        likes: 156,
        rating: 4.9,
        author: 'محمد خالد',
        date: '2024-01-18',
        description: 'كيفية اكتشاف واستغلال ثغرات حقن SQL',
        tags: ['sql', 'حقن', 'أمن'],
        thumbnail: 'sql-injection',
        completed: false,
        progress: 35,
        type: 'interactive'
    },
    {
        id: 4,
        title: 'أدوات Nmap المتقدمة',
        category: 'tools',
        level: 'intermediate',
        duration: '75 دقيقة',
        views: 1567,
        likes: 98,
        rating: 4.7,
        author: 'سارة أحمد',
        date: '2024-01-17',
        description: 'استخدام Nmap لفحص الشبكات واستكشاف الخدمات',
        tags: ['nmap', 'فحص', 'شبكات'],
        thumbnail: 'nmap',
        completed: true,
        progress: 100,
        type: 'video'
    }
];

export default function KnowledgeBase() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('trending');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    const filteredLessons = LESSONS.filter(lesson => {
        const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesLevel = filterLevel === 'all' || lesson.level === filterLevel;
        const matchesType = filterType === 'all' || lesson.type === filterType;
        return matchesCategory && matchesSearch && matchesLevel && matchesType;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'trending':
                return b.views - a.views;
            case 'rating':
                return b.rating - a.rating;
            case 'recent':
                return new Date(b.date) - new Date(a.date);
            case 'duration':
                return parseInt(a.duration) - parseInt(b.duration);
            default:
                return 0;
        }
    });

    const getLevelBadge = (level) => {
        const styles = {
            beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
            intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
        const labels = {
            beginner: 'مبتدئ',
            intermediate: 'متوسط',
            advanced: 'متقدم'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[level]}`}>
                {labels[level]}
            </span>
        );
    };

    const getTypeIcon = (type) => {
        const icons = {
            video: PlayCircle,
            article: FileText,
            interactive: Target
        };
        return icons[type] || FileText;
    };

    const handleLessonInteraction = (lesson, action) => {
        switch (action) {
            case 'view':
                console.log(`Viewing lesson: ${lesson.title}`);
                break;
            case 'like':
                console.log(`Liking lesson: ${lesson.title}`);
                break;
            case 'bookmark':
                console.log(`Bookmarking lesson: ${lesson.title}`);
                break;
            case 'share':
                console.log(`Sharing lesson: ${lesson.title}`);
                break;
        }
    };

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            <MatrixBackground />

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#7112AF]/20 rounded-lg">
                                <BookOpen className="text-[#7112AF]" size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">قاعدة المعرفة</h1>
                                <p className="text-gray-400">عقل المنصة المركزي للتعلم السيبراني</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Brain className="text-purple-400" size={20} />
                                <span className="text-purple-400">{LESSONS.length} درس</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="text-blue-400" size={20} />
                                <span className="text-blue-400">2.3K طالب</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                {/* Categories */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedCategory('all')}
                            className={`p-6 rounded-xl border transition-all duration-300 ${
                                selectedCategory === 'all'
                                    ? 'bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/20 border-[#7112AF]/50'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#7112AF] to-[#ff006e] rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <BookOpen className="text-white" size={24} />
                                </div>
                                <h3 className="font-bold text-white mb-1">جميع الدروس</h3>
                                <p className="text-sm text-gray-400">{LESSONS.length} درس</p>
                            </div>
                        </motion.button>

                        {KNOWLEDGE_CATEGORIES.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <motion.button
                                    key={category.id}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`p-6 rounded-xl border transition-all duration-300 ${
                                        selectedCategory === category.id
                                            ? `${category.bg} border-current/50`
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className={`w-12 h-12 ${category.bg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                                            <Icon className={category.color} size={24} />
                                        </div>
                                        <h3 className="font-bold text-white mb-1">{category.title}</h3>
                                        <p className="text-xs text-gray-400 mb-2">{category.desc}</p>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <div 
                                                className="bg-gradient-to-r from-[#7112AF] to-[#ff006e] h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${category.progress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{category.count} درس</p>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="max-w-7xl mx-auto px-6 pb-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="البحث في الدروس..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pr-12 pl-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7112AF] transition-colors"
                                />
                            </div>

                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF] transition-colors"
                            >
                                <option value="all">جميع المستويات</option>
                                <option value="beginner">مبتدئ</option>
                                <option value="intermediate">متوسط</option>
                                <option value="advanced">متقدم</option>
                            </select>

                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF] transition-colors"
                            >
                                <option value="all">جميع الأنواع</option>
                                <option value="video">فيديو</option>
                                <option value="article">مقال</option>
                                <option value="interactive">تفاعلي</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF] transition-colors"
                            >
                                <option value="trending">الأكثر مشاهدة</option>
                                <option value="rating">الأعلى تقييماً</option>
                                <option value="recent">الأحدث</option>
                                <option value="duration">الأقصر</option>
                            </select>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-[#7112AF]/20 text-[#7112AF]' 
                                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                    }`}
                                >
                                    <div className="grid grid-cols-2 gap-1 mx-auto">
                                        <div className="w-1 h-1 bg-current rounded"></div>
                                        <div className="w-1 h-1 bg-current rounded"></div>
                                        <div className="w-1 h-1 bg-current rounded"></div>
                                        <div className="w-1 h-1 bg-current rounded"></div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-[#7112AF]/20 text-[#7112AF]' 
                                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                    }`}
                                >
                                    <div className="space-y-1">
                                        <div className="w-4 h-0.5 bg-current rounded"></div>
                                        <div className="w-4 h-0.5 bg-current rounded"></div>
                                        <div className="w-4 h-0.5 bg-current rounded"></div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lessons Grid/List */}
                <div className="max-w-7xl mx-auto px-6 pb-12">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredLessons.map((lesson, index) => {
                                const TypeIcon = getTypeIcon(lesson.type);
                                return (
                                    <motion.div
                                        key={lesson.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#7112AF]/50 transition-all duration-300 group"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative h-48 bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/20 flex items-center justify-center">
                                            <TypeIcon className="text-white/50" size={48} />
                                            {lesson.completed && (
                                                <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="text-white" size={16} />
                                                </div>
                                            )}
                                            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white">
                                                {lesson.duration}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                {getLevelBadge(lesson.level)}
                                                <div className="flex items-center gap-1">
                                                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                                    <span className="text-sm text-gray-300">{lesson.rating}</span>
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-white mb-2 line-clamp-2">{lesson.title}</h3>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{lesson.description}</p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {lesson.tags.map((tag, tagIndex) => (
                                                    <span key={tagIndex} className="px-2 py-1 bg-[#7112AF]/20 text-[#7112AF] rounded text-xs">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Progress */}
                                            {lesson.progress > 0 && lesson.progress < 100 && (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                                        <span>التقدم</span>
                                                        <span>{lesson.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-[#7112AF] to-[#ff006e] h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${lesson.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Meta */}
                                            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={12} />
                                                        {lesson.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart size={12} />
                                                        {lesson.likes}
                                                    </span>
                                                </div>
                                                <span>{lesson.date}</span>
                                            </div>

                                            {/* Author */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-[#7112AF]/20 rounded-full flex items-center justify-center">
                                                        <Users size={16} className="text-[#7112AF]" />
                                                    </div>
                                                    <span className="text-sm text-gray-300">{lesson.author}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleLessonInteraction(lesson, 'view')}
                                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(113,18,175,0.5)] transition-all duration-300"
                                                >
                                                    {lesson.completed ? 'إعادة مشاهدة' : 'ابدأ الدرس'}
                                                </button>
                                                <button
                                                    onClick={() => handleLessonInteraction(lesson, 'bookmark')}
                                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                >
                                                    <Bookmark size={16} className="text-gray-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleLessonInteraction(lesson, 'share')}
                                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                >
                                                    <Share2 size={16} className="text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">الدرس</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">المستوى</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">المدة</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">المشاهدات</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">التقييم</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">التقدم</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLessons.map((lesson, index) => (
                                            <motion.tr
                                                key={lesson.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/20 rounded-lg flex items-center justify-center">
                                                            {getTypeIcon(lesson.type)({ size: 20, className: "text-white/50" })}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white">{lesson.title}</div>
                                                            <div className="text-sm text-gray-400">{lesson.author}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">{getLevelBadge(lesson.level)}</td>
                                                <td className="px-6 py-4 text-white">{lesson.duration}</td>
                                                <td className="px-6 py-4 text-white">{lesson.views.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                                        <span className="text-white">{lesson.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {lesson.completed ? (
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="text-green-400" size={16} />
                                                            <span className="text-green-400">مكتمل</span>
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 bg-white/10 rounded-full h-2">
                                                            <div 
                                                                className="bg-gradient-to-r from-[#7112AF] to-[#ff006e] h-2 rounded-full"
                                                                style={{ width: `${lesson.progress}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleLessonInteraction(lesson, 'view')}
                                                            className="px-3 py-1 bg-[#7112AF]/20 text-[#7112AF] rounded-lg hover:bg-[#7112AF]/30 transition-colors text-sm"
                                                        >
                                                            {lesson.completed ? 'إعادة' : 'مشاهدة'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleLessonInteraction(lesson, 'bookmark')}
                                                            className="p-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                        >
                                                            <Bookmark size={14} className="text-gray-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
