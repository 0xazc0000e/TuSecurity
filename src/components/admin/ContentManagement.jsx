import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Edit2, Trash2, RefreshCw, FileText, Image, Tag,
    AlertTriangle, CheckCircle, X, Search, Upload
} from 'lucide-react';
import { adminAPI, lmsAPI } from '../../services/api';
import { getApiImageUrl } from '../../utils/imageUtils';

export default function ContentManagement() {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        type: 'news',
        category: 'general',
        image_url: '' // Keep for backward compatibility or external URLs
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            // Fetch Articles (Knowledge Base)
            const data = await lmsAPI.getArticles();
            // Map to unified structure if necessary, or just use as is
            // Articles have 'cover_image', legacy had 'thumbnail'
            const mapped = data.map(item => ({
                ...item,
                type: 'article', // Force type for now
                image_url: item.cover_image,
                thumbnail: item.cover_image,
                body: item.content
            }));
            setContent(mapped);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch content:', err);
            setError('فشل في تحميل المحتوى');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('body', formData.body); // Kept for consistency checking
            data.append('type', formData.type);
            data.append('category', formData.category);

            if (formData.image_url) {
                // For articles, we use 'cover_image' key
                data.append('cover_image', formData.image_url);
                data.append('image_url', formData.image_url); // Keep for legacy safety
            }

            if (selectedFile) {
                // For articles, multer expects 'cover_image' field
                data.append('cover_image', selectedFile);
            }

            // Map fields for Article API (it expects 'content' not 'body')
            data.append('content', formData.body);

            console.log('Submitting to lmsAPI...');

            if (editingItem) {
                await lmsAPI.updateArticle(editingItem.id, data);
            } else {
                await lmsAPI.createArticle(data);
            }
            setShowModal(false);
            setEditingItem(null);
            setFormData({ title: '', body: '', type: 'news', category: 'general', image_url: '' });
            setSelectedFile(null);
            setPreviewUrl(null);
            fetchContent();
        } catch (err) {
            console.error('Submit error:', err);
            alert('فشل في حفظ المحتوى');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            body: item.body || item.content || '',
            type: item.type,
            category: item.category || 'general',
            image_url: item.image_url || item.thumbnail || ''
        });
        setPreviewUrl(item.thumbnail || item.image_url || null);
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return;
        try {
            await adminAPI.deleteContent(id);
            fetchContent();
        } catch (err) {
            alert('فشل في حذف المحتوى');
        }
    };

    const filteredContent = content.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.body || item.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-purple-400" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
                <AlertTriangle className="text-red-400 mx-auto mb-4" size={32} />
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">إدارة المحتوى</h2>
                    <p className="text-gray-400 text-sm mt-1">الأخبار والمقالات التعليمية</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchContent} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
                        <RefreshCw size={20} className="text-gray-400" />
                    </button>
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({ title: '', body: '', type: 'news', category: 'general', image_url: '' });
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                        <Plus size={20} />
                        إضافة محتوى
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="بحث في المحتوى..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-colors"
                    >
                        {(item.thumbnail || item.image_url) ? (
                            <img
                                src={getApiImageUrl(item.thumbnail || item.image_url)}
                                alt={item.title}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                                }}
                            />
                        ) : (
                            <div className="h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                <Image size={32} className="text-gray-400" />
                            </div>
                        )}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">{item.type}</span>
                                <span className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-400">{item.category}</span>
                            </div>
                            <h3 className="text-white font-bold mb-2 line-clamp-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{item.body || item.content}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-xs">
                                    {new Date(item.created_at).toLocaleDateString('ar-SA')}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0f] border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    {editingItem ? 'تعديل محتوى' : 'إضافة محتوى جديد'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">العنوان</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">النوع</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        >
                                            <option value="news">خبر</option>
                                            <option value="article">مقال</option>
                                            <option value="tutorial">درس</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">التصنيف</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        >
                                            <option value="general">عام</option>
                                            <option value="security">أمان</option>
                                            <option value="tools">أدوات</option>
                                            <option value="news">أخبار</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">المحتوى</label>
                                    <textarea
                                        value={formData.body}
                                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                        rows={6}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">الصورة (تحميل ملف)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors text-sm text-gray-300"
                                        >
                                            <Upload size={16} />
                                            <span>{selectedFile ? selectedFile.name : 'اختر صورة'}</span>
                                        </label>
                                    </div>
                                    {previewUrl && (
                                        <div className="mt-4 relative w-full h-40 rounded-lg overflow-hidden border border-white/10">
                                            <img
                                                src={previewUrl.startsWith('blob:') ? previewUrl : getApiImageUrl(previewUrl)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreviewUrl(null);
                                                    setFormData({ ...formData, image_url: '' });
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Fallback URL input */}
                                {!selectedFile && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">أو رابط صورة خارجي</label>
                                        <input
                                            type="url"
                                            value={formData.image_url}
                                            onChange={(e) => {
                                                setFormData({ ...formData, image_url: e.target.value });
                                                setPreviewUrl(e.target.value);
                                            }}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Debug: {formData.image_url}</p>
                                        {/* Debug: {formData.image_url} */}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
                                    >
                                        {editingItem ? 'حفظ التغييرات' : 'إضافة المحتوى'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
