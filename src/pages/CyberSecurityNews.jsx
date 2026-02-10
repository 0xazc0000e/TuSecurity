import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Globe, TrendingUp, AlertTriangle, Shield, Eye, Heart, MessageSquare, Share2, Bookmark,
    Search, Filter, Clock, Calendar, User, ExternalLink, Zap, Target,
    ThumbsUp, ThumbsDown, BarChart3, Hash, Newspaper, Radio,
    PlayCircle, FileText, Download, Bell, TrendingDown, Users,
    Award, Star, ArrowRight, CheckCircle, Lock, Unlock, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { contentAPI } from '../services/api';

const NEWS_CATEGORIES = [
    { 
        id: 'all', 
        title: 'جميع الأخبار', 
        icon: Newspaper, 
        color: 'text-purple-400', 
        bg: 'bg-purple-400/10'
    },
    { 
        id: 'threats', 
        title: 'التهديدات', 
        icon: AlertTriangle, 
        color: 'text-red-400', 
        bg: 'bg-red-400/10'
    },
    { 
        id: 'breaches', 
        title: 'الاختراقات', 
        icon: Shield, 
        color: 'text-orange-400', 
        bg: 'bg-orange-400/10'
    },
    { 
        id: 'research', 
        title: 'الأبحاث', 
        icon: Target, 
        color: 'text-blue-400', 
        bg: 'bg-blue-400/10'
    },
    { 
        id: 'policy', 
        title: 'السياسات', 
        icon: Lock, 
        color: 'text-green-400', 
        bg: 'bg-green-400/10'
    },
    { 
        id: 'industry', 
        title: 'الصناعة', 
        icon: Globe, 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-400/10'
    }
];

export default function CyberSecurityNews() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [sortBy, setSortBy] = useState('trending');
    const [viewMode, setViewMode] = useState('grid');
    const [savedArticles, setSavedArticles] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch articles from API
    useEffect(() => {
        fetchArticles();
    }, [selectedCategory, sortBy]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const params = {
                type: 'news',
                category: selectedCategory === 'all' ? '' : selectedCategory,
                limit: 20
            };
            const data = await contentAPI.getAll(params);
            setArticles(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch articles:', err);
            setError('Failed to load news articles');
        } finally {
            setLoading(false);
        }
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesSeverity = filterSeverity === 'all' || article.severity === filterSeverity;
        return matchesSearch && matchesSeverity;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'trending':
                return b.views - a.views;
            case 'recent':
                return new Date(b.date_published) - new Date(a.date_published);
            case 'popular':
                return b.likes - a.likes;
            default:
                return 0;
        }
    });

    const handleArticleInteraction = async (article, action) => {
        switch (action) {
            case 'like':
                try {
                    await contentAPI.like(article.id);
                    // Refresh articles to get updated like count
                    fetchArticles();
                } catch (err) {
                    console.error('Failed to like article:', err);
                }
                break;
            case 'save':
                if (savedArticles.includes(article.id)) {
                    setSavedArticles(prev => prev.filter(id => id !== article.id));
                } else {
                    setSavedArticles(prev => [...prev, article.id]);
                }
                break;
            case 'share':
                console.log(`Sharing article: ${article.title}`);
                break;
        }
    };

    const getSeverityBadge = (isUrgent) => {
        const styles = isUrgent
            ? 'bg-red-500/20 text-red-400 border-red-500/30'
            : 'bg-green-500/20 text-green-400 border-green-500/30';
        const label = isUrgent ? 'عاجل' : 'عادي';
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
                {label}
            </span>
        );
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050214] text-white font-cairo flex items-center justify-center" dir="rtl">
                <MatrixBackground />
                <div className="relative z-10 text-center">
                    <Loader2 className="w-12 h-12 text-[#7112AF] animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">جاري تحميل الأخبار...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#050214] text-white font-cairo flex items-center justify-center" dir="rtl">
                <MatrixBackground />
                <div className="relative z-10 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400">{error}</p>
                    <button 
                        onClick={fetchArticles}
                        className="mt-4 px-4 py-2 bg-[#7112AF]/20 text-[#7112AF] rounded-lg hover:bg-[#7112AF]/30 transition-colors"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            <MatrixBackground />

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#ff006e]/20 rounded-lg">
                                <Newspaper className="text-[#ff006e]" size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">الأخبار السيبرانية</h1>
                                <p className="text-gray-400">آخر التطورات في عالم الأمن السيبراني</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="text-green-400" size={20} />
                                <span className="text-green-400">مباشر</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Bell className="text-yellow-400" size={20} />
                                <span className="text-yellow-400">تنبيهات</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                {/* Breaking News Ticker */}
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 py-3 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-red-500/30 px-3 py-1 rounded-full">
                                <Zap className="text-red-400" size={16} />
                                <span className="text-red-400 font-bold text-sm">عاجل</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex animate-scroll-right">
                                    <span className="text-white font-bold">
                                        ثغرة خطيرة في OpenSSL • هجوم فدية على مستشفى أوروبي • بحث جديد في الذكاء الاصطناعي • تشريعات أوروبية جديدة • استثمار مايكروسوفت في الأمن السيبراني •
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {NEWS_CATEGORIES.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <motion.button
                                    key={category.id}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`p-4 rounded-xl border transition-all duration-300 ${
                                        selectedCategory === category.id
                                            ? `${category.bg} border-current/50`
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="text-center">
                                        <Icon className={`${category.color} mx-auto mb-2`} size={24} />
                                        <h3 className="font-bold text-white text-sm">{category.title}</h3>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="max-w-7xl mx-auto px-6 pb-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="البحث في الأخبار..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pr-12 pl-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ff006e] transition-colors"
                                />
                            </div>

                            <select
                                value={filterSeverity}
                                onChange={(e) => setFilterSeverity(e.target.value)}
                                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#ff006e] transition-colors"
                            >
                                <option value="all">جميع الخطورة</option>
                                <option value="critical">حرج</option>
                                <option value="high">عالي</option>
                                <option value="medium">متوسط</option>
                                <option value="low">منخفض</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#ff006e] transition-colors"
                            >
                                <option value="trending">الأكثر مشاهدة</option>
                                <option value="recent">الأحدث</option>
                                <option value="popular">الأعلى تقييماً</option>
                                <option value="comments">الأكثر تعليقاً</option>
                            </select>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-[#ff006e]/20 text-[#ff006e]' 
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
                                            ? 'bg-[#ff006e]/20 text-[#ff006e]' 
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

                {/* Featured Article */}
                {filteredArticles.filter(a => a.featured).length > 0 && (
                    <div className="max-w-7xl mx-auto px-6 pb-8">
                        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="relative h-96 bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="flex items-center gap-2 bg-red-500/30 px-3 py-1 rounded-full">
                                            <Zap className="text-red-400" size={16} />
                                            <span className="text-red-400 font-bold text-sm">مميز</span>
                                        </div>
                                    </div>
                                    <AlertTriangle className="text-red-400/50" size={80} />
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <h2 className="text-3xl font-bold text-white mb-4">
                                        {filteredArticles.find(a => a.featured)?.title}
                                    </h2>
                                    <p className="text-gray-300 mb-6 line-clamp-3">
                                        {filteredArticles.find(a => a.featured)?.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="text-gray-400 text-sm">
                                                {filteredArticles.find(a => a.featured)?.author}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span className="text-gray-400 text-sm">
                                                {filteredArticles.find(a => a.featured)?.date}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-gray-400" />
                                            <span className="text-gray-400 text-sm">
                                                {filteredArticles.find(a => a.featured)?.readTime}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300 flex items-center gap-2">
                                        اقرأ المقال
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* News Grid/List */}
                <div className="max-w-7xl mx-auto px-6 pb-12">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.filter(a => !a.featured).map((article, index) => (
                                <motion.article
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#ff006e]/50 transition-all duration-300 group"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center">
                                        {article.trending && (
                                            <div className="absolute top-3 right-3">
                                                <div className="flex items-center gap-1 bg-yellow-500/30 px-2 py-1 rounded-full">
                                                    <TrendingUp className="text-yellow-400" size={12} />
                                                    <span className="text-yellow-400 font-bold text-xs">رائج</span>
                                                </div>
                                            </div>
                                        )}
                                        {article.verified && (
                                            <div className="absolute top-3 left-3">
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="text-white" size={14} />
                                                </div>
                                            </div>
                                        )}
                                        <Newspaper className="text-white/20" size={48} />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            {getSeverityBadge(article.severity)}
                                            <span className="text-xs text-gray-400">{article.readTime}</span>
                                        </div>

                                        <h3 className="font-bold text-white mb-2 line-clamp-2">{article.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {article.tags.slice(0, 3).map((tag, tagIndex) => (
                                                <span key={tagIndex} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Meta */}
                                        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <Eye size={12} />
                                                    {formatNumber(article.views)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Heart size={12} />
                                                    {formatNumber(article.likes)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare size={12} />
                                                    {article.comments}
                                                </span>
                                            </div>
                                            <span>{article.date}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleArticleInteraction(article, 'like')}
                                                className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-bold"
                                            >
                                                إعجاب
                                            </button>
                                            <button
                                                onClick={() => handleArticleInteraction(article, 'save')}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    savedArticles.includes(article.id)
                                                        ? 'bg-yellow-500/20 text-yellow-400'
                                                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                                }`}
                                            >
                                                <Bookmark size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleArticleInteraction(article, 'share')}
                                                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                            >
                                                <Share2 size={16} className="text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">الخبر</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">الخطورة</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">المشاهدات</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">التقييم</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">التعليقات</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">التاريخ</th>
                                            <th className="px-6 py-4 text-right text-gray-400 font-bold">الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredArticles.filter(a => !a.featured).map((article, index) => (
                                            <motion.tr
                                                key={article.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-lg flex items-center justify-center">
                                                            <Newspaper size={20} className="text-white/50" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white">{article.title}</div>
                                                            <div className="text-sm text-gray-400">{article.author}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">{getSeverityBadge(article.severity)}</td>
                                                <td className="px-6 py-4 text-white">{formatNumber(article.views)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                                        <span className="text-white">4.8</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-white">{article.comments}</td>
                                                <td className="px-6 py-4 text-white">{article.date}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleArticleInteraction(article, 'like')}
                                                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                                                        >
                                                            إعجاب
                                                        </button>
                                                        <button
                                                            onClick={() => handleArticleInteraction(article, 'save')}
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
