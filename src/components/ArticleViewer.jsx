import React, { useState, useEffect } from 'react';
import { ChevronRight, Heart, Bookmark, Share2, User, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiCall } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ArticleViewer({ article, onBack }) {
    const [artLiked, setArtLiked] = useState(false);
    const [artSaved, setArtSaved] = useState(false);
    const [artLoading, setArtLoading] = useState(false);

    // Check status when article is selected
    useEffect(() => {
        const checkArtStatus = async () => {
            try {
                const status = await apiCall(`/user/item-status/article/${article.id}`);
                setArtLiked(status.isLiked);
                setArtSaved(status.isBookmarked);
            } catch (err) {
                // Silent fail
            }
        };
        if (article?.id) checkArtStatus();
    }, [article?.id]);

    const toggleArtLike = async () => {
        if (artLoading) return;
        setArtLoading(true);
        try {
            if (artLiked) {
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
            setArtLiked(!artLiked);
        } catch (err) {
            alert('خطأ: ' + (err.message || 'فشل في حفظ الإعجاب'));
        } finally {
            setArtLoading(false);
        }
    };

    const toggleArtSave = async () => {
        if (artLoading) return;
        setArtLoading(true);
        try {
            if (artSaved) {
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
            setArtSaved(!artSaved);
        } catch (err) {
            alert('خطأ: ' + (err.message || 'فشل في حفظ المقال'));
        } finally {
            setArtLoading(false);
        }
    };

    const shareArt = () => {
        if (navigator.share) navigator.share({ title: article.title, text: article.description, url: window.location.href });
        else { navigator.clipboard.writeText(window.location.href); alert('تم نسخ الرابط'); }
    };

    if (!article) return null;

    return (
        <div className="min-h-screen bg-[#05050f]" dir="rtl">
            <nav className="sticky top-0 z-50 bg-[#12122a]/90 backdrop-blur border-b border-[#1f1f3d] px-6 py-3 flex items-center justify-between">
                <button onClick={onBack}
                    className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                    <ChevronRight size={18} className="ml-1" /> عودة للمقالات
                </button>
                <span className="text-white font-bold text-sm">{article.title}</span>
                <div className="flex items-center gap-2">
                    <button onClick={toggleArtLike} className={`p-2 rounded-lg transition-all ${artLiked ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:text-red-400'}`}>
                        <Heart size={16} className={artLiked ? 'fill-current' : ''} />
                    </button>
                    <button onClick={toggleArtSave} className={`p-2 rounded-lg transition-all ${artSaved ? 'text-yellow-400 bg-yellow-500/10' : 'text-gray-400 hover:text-yellow-400'}`}>
                        <Bookmark size={16} className={artSaved ? 'fill-current' : ''} />
                    </button>
                    <button onClick={shareArt} className="p-2 rounded-lg text-gray-400 hover:text-blue-400 transition-all">
                        <Share2 size={16} />
                    </button>
                </div>
            </nav>
            {/* Hero Image */}
            {article.cover_image && (
                <div className="w-full h-64 md:h-80 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-[#05050f]/50 to-transparent z-10" />
                    <img
                        src={article.cover_image.startsWith('http') ? article.cover_image : `${BASE_URL}${article.cover_image}`}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-full p-6 z-20 max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 shadow-black drop-shadow-lg">{article.title}</h1>
                    </div>
                </div>
            )}

            {/* Article Content */}
            <div className="max-w-3xl mx-auto px-6 py-8 relative z-20">
                {/* Author & meta */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1f1f3d]">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <User size={18} className="text-orange-400" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">{article.author || 'غير محدد'}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                            <Clock size={12} /> {article.read_time || 5} دقيقة قراءة
                        </p>
                    </div>
                </div>
                {/* Markdown body - Obsidian Theme */}
                <div className="obs-prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.content || ''}
                    </ReactMarkdown>
                </div>
                {/* Bottom actions */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#1f1f3d]">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleArtLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${artLiked ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-red-500/10 hover:text-red-400'}`}>
                            <Heart size={16} className={artLiked ? 'fill-current' : ''} /> إعجاب
                        </button>
                        <button onClick={toggleArtSave}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${artSaved ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-yellow-500/10 hover:text-yellow-400'}`}>
                            <Bookmark size={16} className={artSaved ? 'fill-current' : ''} /> حفظ
                        </button>
                        <button onClick={shareArt}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white/5 text-gray-400 border border-white/10 hover:bg-blue-500/10 hover:text-blue-400 transition-all">
                            <Share2 size={16} /> مشاركة
                        </button>
                    </div>
                    <button onClick={onBack}
                        className="text-sm text-gray-500 hover:text-white transition-colors">
                        عودة للمقالات →
                    </button>
                </div>
            </div>
        </div>
    );
}
