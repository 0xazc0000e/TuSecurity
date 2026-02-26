import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit2, Trash2, Image as ImageIcon, Eye, X, Save,
    Newspaper, Calendar, Tag, Bold, Italic, Heading1, Heading2,
    List, ListOrdered, Link, Quote, Code, Minus
} from 'lucide-react';
import { newsAPI } from '../../services/api';

export default function NewsManagement() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [previewMode, setPreviewMode] = useState(false);
    const textareaRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        tags: '',
        image: null
    });

    useEffect(() => { fetchNews(); }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const data = await newsAPI.getAll();
            setNews(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch news', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('body', formData.body);
            data.append('tags', formData.tags);
            if (formData.image) data.append('image', formData.image);

            if (editingItem) {
                await newsAPI.update(editingItem.id, data);
            } else {
                await newsAPI.create(data);
            }
            setShowModal(false);
            setEditingItem(null);
            resetForm();
            fetchNews();
        } catch (error) {
            console.error('Submit failed', error);
            alert('فشل في حفظ الخبر');
        }
    };

    const resetForm = () => {
        setFormData({ title: '', body: '', tags: '', image: null });
        setPreviewMode(false);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            body: item.body,
            tags: item.tags || '',
            image: null
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
        try {
            await newsAPI.delete(id);
            fetchNews();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    // Markdown insertion helper
    const insertMd = (before, after = '') => {
        const ta = textareaRef.current;
        if (!ta) return;
        const { selectionStart: s, selectionEnd: e } = ta;
        const text = formData.body;
        const selected = text.substring(s, e);
        const newText = text.substring(0, s) + before + selected + after + text.substring(e);
        setFormData(p => ({ ...p, body: newText }));
        setTimeout(() => {
            ta.focus();
            ta.selectionStart = s + before.length;
            ta.selectionEnd = s + before.length + selected.length;
        }, 0);
    };

    const mdToolbar = [
        { icon: Bold, action: () => insertMd('**', '**'), tip: 'غامق' },
        { icon: Italic, action: () => insertMd('*', '*'), tip: 'مائل' },
        { icon: Heading1, action: () => insertMd('\n# '), tip: 'عنوان رئيسي' },
        { icon: Heading2, action: () => insertMd('\n## '), tip: 'عنوان فرعي' },
        { icon: List, action: () => insertMd('\n- '), tip: 'قائمة' },
        { icon: ListOrdered, action: () => insertMd('\n1. '), tip: 'قائمة مرقمة' },
        { icon: Quote, action: () => insertMd('\n> '), tip: 'اقتباس' },
        { icon: Code, action: () => insertMd('`', '`'), tip: 'كود' },
        { icon: Link, action: () => insertMd('[', '](https://)'), tip: 'رابط' },
        { icon: ImageIcon, action: () => fileInputRef.current?.click(), tip: 'إدراج صورة' },
        { icon: Minus, action: () => insertMd('\n---\n'), tip: 'فاصل' },
    ];

    const fileInputRef = useRef(null);

    const handleToolbarCheckUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('image', file);

            // We need a specific upload endpoint for general images
            // Assuming /api/upload exists and handles generic uploads (documented in backend/routes/uploadRoutes.js)
            const token = localStorage.getItem('token');
            const uploadUrl = (import.meta.env.VITE_API_URL || 'https://tusecurity.onrender.com/api') + '/upload';
            const res = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            insertMd(`![وصف الصورة](${data.url})`);
        } catch (error) {
            console.error('Image upload failed', error);
            alert('فشل رفع الصورة');
        } finally {
            e.target.value = ''; // Reset input
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Newspaper className="text-blue-400" size={24} />
                        إدارة الأخبار
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">{news.length} خبر منشور</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); resetForm(); setShowModal(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition-all"
                >
                    <Plus size={18} /> خبر جديد
                </button>
            </div>

            {/* News List */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">جاري التحميل...</div>
            ) : news.length === 0 ? (
                <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <Newspaper size={48} className="text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد أخبار بعد</p>
                    <button onClick={() => { resetForm(); setShowModal(true); }}
                        className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-bold">+ أضف أول خبر</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {news.map(item => (
                        <motion.div key={item.id} layout
                            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all group"
                        >
                            {item.image_url && (
                                <div className="relative h-36 overflow-hidden">
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{(item.body || '').substring(0, 120)}...</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="text-gray-500" />
                                        <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString('ar-SA')}</span>
                                        {item.tags && (
                                            <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full">{item.tags.split(',')[0]}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => openEdit(item)}
                                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)}
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Editor Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0a0a14] border border-white/15 rounded-2xl w-full max-w-4xl h-[92vh] flex flex-col shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="p-5 border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{editingItem ? 'تعديل الخبر' : 'خبر جديد'}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">يدعم تنسيق Markdown</p>
                                </div>
                                <button onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                    <X className="text-gray-400 hover:text-white" size={20} />
                                </button>
                            </div>

                            {/* Form Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs text-gray-400 mb-2 font-bold">عنوان الخبر *</label>
                                    <input
                                        type="text"
                                        placeholder="اكتب عنوان الخبر هنا..."
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-lg font-bold focus:border-blue-500/50 outline-none transition-colors placeholder-gray-600"
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-xs text-gray-400 mb-2 font-bold flex items-center gap-1.5">
                                        <Tag size={12} /> التصنيفات (مفصولة بفاصلة)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="أمن سيبراني, تحديثات, مسابقات"
                                        value={formData.tags}
                                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:border-blue-500/50 outline-none transition-colors placeholder-gray-600"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-xs text-gray-400 mb-2 font-bold">صورة الغلاف</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl border border-dashed border-white/20 transition-colors">
                                            <ImageIcon size={18} className="text-blue-400" />
                                            <span className="text-sm text-gray-300">{formData.image ? formData.image.name : 'اختر صورة'}</span>
                                            <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                        </label>
                                        {formData.image && (
                                            <button onClick={() => setFormData(p => ({ ...p, image: null }))}
                                                className="text-red-400 text-xs hover:text-red-300">إزالة</button>
                                        )}
                                    </div>
                                </div>

                                {/* Markdown Toolbar */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleToolbarCheckUpload}
                                />
                                <div className="bg-white/5 rounded-t-xl border border-white/10 p-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1 flex-wrap">
                                        {mdToolbar.map((tool, i) => {
                                            const Icon = tool.icon;
                                            return (
                                                <button key={i} type="button" onClick={tool.action} title={tool.tip}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                                    <Icon size={16} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode(!previewMode)}
                                        className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg font-bold transition-all ${previewMode
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white/5 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <Eye size={14} />
                                        {previewMode ? 'تحرير' : 'معاينة'}
                                    </button>
                                </div>

                                {/* Editor / Preview */}
                                {previewMode ? (
                                    <div className="obs-prose bg-[#08081a] p-6 rounded-b-xl border border-t-0 border-white/10 min-h-[300px] max-h-[400px] overflow-y-auto">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData.body}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <textarea
                                        ref={textareaRef}
                                        value={formData.body}
                                        onChange={e => setFormData({ ...formData, body: e.target.value })}
                                        className="w-full h-[300px] bg-[#08081a] border border-t-0 border-white/10 rounded-b-xl p-5 text-gray-300 font-mono text-sm leading-relaxed focus:border-blue-500/50 outline-none resize-none"
                                        placeholder="# اكتب محتوى الخبر هنا...&#10;&#10;يدعم تنسيق Markdown مثل:&#10;- **نص غامق**&#10;- *نص مائل*&#10;- [رابط](https://example.com)&#10;- > اقتباس"
                                        dir="rtl"
                                    />
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-5 border-t border-white/10 flex justify-between items-center">
                                <span className="text-xs text-gray-600">{formData.body.length} حرف</span>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors">
                                        إلغاء
                                    </button>
                                    <button onClick={handleSubmit}
                                        disabled={!formData.title.trim()}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl flex items-center gap-2 font-bold transition-all">
                                        <Save size={16} /> نشر الخبر
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
