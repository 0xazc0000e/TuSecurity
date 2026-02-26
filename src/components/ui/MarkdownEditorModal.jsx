import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Save, Eye, Bold, Italic, Heading1, Heading2,
    List, ListOrdered, Link, Quote, Code, Minus,
    Image as ImageIcon, Tag
} from 'lucide-react';

export function MarkdownEditorModal({ isOpen, onClose, onSubmit, type = 'article', initialData = null }) {
    const [previewMode, setPreviewMode] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        body: initialData?.body || '',
        tags: initialData?.tags || '', // Used for news
        category: initialData?.category || 'general', // Used for articles
        description: initialData?.description || '', // Used for articles
        author: initialData?.author || '', // Used for articles
        image: null
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: initialData?.title || '',
                body: initialData?.body || '',
                tags: initialData?.tags || '',
                category: initialData?.category || 'general',
                description: initialData?.description || '',
                author: initialData?.author || '',
                image: null
            });
            setPreviewMode(false);
        }
    }, [isOpen, initialData]);

    const isArticle = type === 'article';
    const titleLabel = isArticle ? 'عنوان المقال' : 'عنوان الخبر';
    const modalTitle = isArticle ? 'إضافة مقال جديد' : 'أضف خبراً جديداً';

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append(isArticle ? 'content' : 'body', formData.body);

        if (isArticle) {
            data.append('category', formData.category);
            data.append('type', 'article');
            data.append('description', formData.description);
            data.append('author', formData.author);
            if (formData.image) data.append('cover_image', formData.image);
        } else {
            data.append('tags', formData.tags);
            if (formData.image) data.append('image', formData.image);
        }

        onSubmit(data);
    };

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

    const handleToolbarCheckUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fd = new FormData();
            fd.append('image', file);

            const token = localStorage.getItem('token');
            const uploadUrl = (import.meta.env.VITE_API_URL || 'https://tusecurity.onrender.com/api') + '/upload';
            const res = await fetch(uploadUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: fd
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            insertMd(`![وصف الصورة](${data.url})`);
        } catch (error) {
            console.error('Image upload failed', error);
            alert('فشل رفع الصورة');
        } finally {
            e.target.value = '';
        }
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
        { icon: ImageIcon, action: () => fileInputRef.current?.click(), tip: 'إدراج صورة سطرية' },
        { icon: Minus, action: () => insertMd('\n---\n'), tip: 'فاصل' },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#0a0a14] border border-white/15 rounded-2xl w-full max-w-4xl h-[92vh] flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-5 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-white">{modalTitle}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">يدعم تنسيق Markdown</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <X className="text-gray-400 hover:text-white" size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-xs text-gray-400 mb-2 font-bold">{titleLabel} *</label>
                            <input
                                type="text"
                                placeholder="اكتب العنوان هنا..."
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-lg font-bold focus:border-[#7112AF]/50 outline-none transition-colors placeholder-gray-600"
                            />
                        </div>

                        {/* Category / Tags */}
                        {isArticle ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-2 font-bold flex items-center gap-1.5">
                                        <Tag size={12} /> اسم الكاتب
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="اكتب اسمك أو اسم الكاتب..."
                                        value={formData.author}
                                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:border-[#7112AF]/50 outline-none transition-colors placeholder-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-2 font-bold flex items-center gap-1.5">
                                        <Tag size={12} /> وصف المقال (للبطاقة الخارجية)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="وصف مختصر لمحتوى المقال..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:border-[#7112AF]/50 outline-none transition-colors placeholder-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-2 font-bold flex items-center gap-1.5">
                                        <Tag size={12} /> التصنيف الأساسي
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:border-[#7112AF]/50 outline-none transition-colors"
                                    >
                                        <option value="general">عام</option>
                                        <option value="security">أمن سيبراني</option>
                                        <option value="tools">أدوات وتقنيات</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs text-gray-400 mb-2 font-bold flex items-center gap-1.5">
                                    <Tag size={12} /> التصنيفات أو النطاق (مفصولة بفاصلة)
                                </label>
                                <input
                                    type="text"
                                    placeholder="أمن سيبراني, Network, OSINT"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:border-[#7112AF]/50 outline-none transition-colors placeholder-gray-600"
                                />
                            </div>
                        )}

                        {/* Cover Image */}
                        <div>
                            <label className="block text-xs text-gray-400 mb-2 font-bold">صورة الغلاف</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl border border-dashed border-white/20 transition-colors">
                                    <ImageIcon size={18} className="text-[#7112AF]" />
                                    <span className="text-sm text-gray-300">{formData.image ? formData.image.name : 'اختر صورة'}</span>
                                    <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                </label>
                                {formData.image && (
                                    <button onClick={() => setFormData(p => ({ ...p, image: null }))}
                                        className="text-red-400 text-xs hover:text-red-300">إزالة</button>
                                )}
                            </div>
                        </div>

                        {/* Markdown Editor */}
                        <div>
                            <label className="block text-xs text-gray-400 mb-2 font-bold">المحتوى *</label>

                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleToolbarCheckUpload} />

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
                                    className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg font-bold transition-all ${previewMode ? 'bg-[#7112AF] text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                >
                                    <Eye size={14} /> {previewMode ? 'تحرير' : 'معاينة'}
                                </button>
                            </div>

                            {previewMode ? (
                                <div className="obs-prose bg-[#08081a] p-6 rounded-b-xl border border-t-0 border-white/10 min-h-[300px] max-h-[400px] overflow-y-auto w-full">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData.body}</ReactMarkdown>
                                </div>
                            ) : (
                                <textarea
                                    ref={textareaRef}
                                    value={formData.body}
                                    onChange={e => setFormData({ ...formData, body: e.target.value })}
                                    className="w-full h-[300px] bg-[#08081a] border border-t-0 border-white/10 rounded-b-xl p-5 text-gray-300 font-mono text-sm leading-relaxed focus:border-[#7112AF]/50 outline-none resize-none"
                                    placeholder="# اكتب المحتوى هنا..."
                                    dir="rtl"
                                />
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-white/10 flex justify-between items-center">
                        <span className="text-xs text-gray-600">{formData.body.length} حرف</span>
                        <div className="flex gap-3">
                            <button onClick={onClose}
                                className="px-5 py-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors">
                                إلغاء
                            </button>
                            <button onClick={submitHandler}
                                disabled={!formData.title.trim() || !formData.body.trim()}
                                className="px-6 py-2.5 bg-[#7112AF] hover:bg-[#5a0d8e] disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl flex items-center gap-2 font-bold transition-all">
                                <Save size={16} /> نشر
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default MarkdownEditorModal;
