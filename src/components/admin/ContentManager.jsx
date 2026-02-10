import React, { useState } from 'react';
import { FileText, Plus, Edit3, Trash2, Eye, Calendar, AlertTriangle, X, Check, Upload, Image as ImageIcon, Bold, Italic, List, Link as LinkIcon } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { GlassModal } from '../ui/GlassModal';

export const ContentManager = () => {
    const { news, articles, threats, deleteContent, addContent } = useDatabase();
    const [activeTab, setActiveTab] = useState('articles'); // articles | threats | news
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        image: '',
        author: 'Admin',
        category: 'general',
        risk: 'Medium',
        status: 'published'
    });

    const resetForm = () => {
        setFormData({
            title: '',
            body: '',
            image: '',
            author: 'Admin',
            category: 'general',
            risk: 'Medium',
            status: 'published'
        });
    };

    const handleOpenModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let newItem = {
            ...formData,
            desc: formData.body.substring(0, 100) + '...', // Auto-generate short desc
            date: new Date().toLocaleDateString('en-CA'),
        };

        if (activeTab === 'threats') {
            newItem = {
                name: formData.title,
                type: formData.category,
                risk: formData.risk,
                desc: formData.body,
                discovered: new Date().getFullYear().toString(),
                status: formData.status
            };
        } else if (activeTab === 'news') {
            newItem = {
                ...newItem,
                urgent: formData.risk === 'Critical',
            };
        }

        addContent(activeTab, newItem);
        setIsModalOpen(false);
    };

    const getContent = () => {
        switch (activeTab) {
            case 'articles': return articles.map(i => ({ ...i, type: 'article' }));
            case 'threats': return threats.map(i => ({ ...i, title: i.name, type: 'threat' }));
            case 'news': return news.map(i => ({ ...i, type: 'news' }));
            default: return [];
        }
    };

    const handleDelete = (id) => {
        if (confirm('هل أنت متأكد من الحذف؟')) {
            deleteContent(activeTab, id);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Tabs & Actions */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2 bg-[#050214]/60 p-1 rounded-lg border border-white/10">
                    {['articles', 'threats', 'news'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === tab ? 'bg-[#7112AF] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            {tab === 'articles' ? 'المقالات' : tab === 'threats' ? 'التهديدات' : 'الأخبار'}
                        </button>
                    ))}
                </div>
                <button onClick={handleOpenModal} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors">
                    <Plus size={18} /> إضافة {activeTab === 'articles' ? 'مقال' : activeTab === 'news' ? 'خبر' : 'تهديد'}
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getContent().map(item => (
                    <div key={item.id} className="bg-[#050214]/60 border border-white/5 p-5 rounded-2xl group hover:border-[#7112AF]/30 transition-all flex flex-col relative overflow-hidden">
                        {item.image && (
                            <div className="absolute inset-0 z-0">
                                <img src={item.image} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050214] via-[#050214]/80 to-transparent" />
                            </div>
                        )}

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${item.status === 'published' || activeTab === 'threats' ? 'bg-green-500/10 text-green-500' :
                                        item.status === 'draft' ? 'bg-slate-500/10 text-slate-400' : 'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {item.status || (item.risk ? `Risk: ${item.risk}` : 'draft')}
                                </span>
                                <div className="flex gap-1">
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>

                            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 leading-snug">{item.title || item.name}</h3>
                            <p className="text-slate-400 text-xs line-clamp-2 mb-4 h-8">{item.desc || item.body || 'لا يوجد وصف مختصر...'}</p>

                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                                <span className="flex items-center gap-1"><FileText size={12} /> {activeTab}</span>
                                <span className="flex items-center gap-1"><Calendar size={12} /> {item.date || item.discovered}</span>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                                <div className="flex items-center gap-2">
                                    {item.author && (
                                        <>
                                            <div className="w-6 h-6 rounded-full bg-[#7112AF] flex items-center justify-center text-[10px] text-white font-bold">
                                                {item.author[0]}
                                            </div>
                                            <span className="text-xs text-slate-400">{item.author}</span>
                                        </>
                                    )}
                                </div>
                                <button className="text-xs font-bold text-[#7112AF] hover:underline">معاينة</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ADD CONTENT MODAL (FULL EDITOR) */}
            <GlassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`إضافة ${activeTab === 'articles' ? 'مقال تعليمي' : activeTab === 'news' ? 'خبر جديد' : 'تهديد سيبراني'}`}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">العنوان الرئيسي</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-[#0a0a12] border border-white/10 rounded-xl p-3 text-white focus:border-[#7112AF] outline-none transition-colors text-lg font-bold"
                            placeholder="مثال: تحليل ثغرة Log4j..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">التصنيف</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-[#0a0a12] border border-white/10 rounded-xl p-3 text-white focus:border-[#7112AF] outline-none appearance-none"
                            >
                                <option value="general">عام</option>
                                <option value="linux">Linux / Systems</option>
                                <option value="network">Network Security</option>
                                <option value="crypto">Cryptography</option>
                                <option value="malware">Malware / Ransomware</option>
                            </select>
                        </div>

                        {/* Status / Risk */}
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">
                                {activeTab === 'threats' ? 'مستوى الخطورة' : 'الحالة'}
                            </label>
                            <select
                                value={activeTab === 'threats' ? formData.risk : formData.status}
                                onChange={e => activeTab === 'threats' ? setFormData({ ...formData, risk: e.target.value }) : setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-[#0a0a12] border border-white/10 rounded-xl p-3 text-white focus:border-[#7112AF] outline-none appearance-none"
                            >
                                {activeTab === 'threats' ? (
                                    <>
                                        <option value="Low">منخفض (Low)</option>
                                        <option value="Medium">متوسط (Medium)</option>
                                        <option value="High">مرتفع (High)</option>
                                        <option value="Critical">حرج (Critical)</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="draft">مسودة (Draft)</option>
                                        <option value="published">منشور (Published)</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Image URL & Upload Simul */}
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">صورة الغلاف / المرفقات</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                className="flex-1 bg-[#0a0a12] border border-white/10 rounded-xl p-3 text-white focus:border-[#7112AF] outline-none placeholder-slate-600 text-sm"
                                placeholder="رابط الصورة (URL)..."
                            />
                            <button type="button" className="px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-slate-300">
                                <Upload size={18} />
                            </button>
                        </div>
                        {formData.image && (
                            <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-white/10 relative group">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: '' })}
                                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Rich Text Editor Simulation */}
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">محتوى المقال الكامل</label>
                        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0a0a12] focus-within:border-[#7112AF] transition-colors">
                            {/* Toolbar */}
                            <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-white/5">
                                <button type="button" className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Bold size={16} /></button>
                                <button type="button" className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Italic size={16} /></button>
                                <div className="w-px h-4 bg-white/10 mx-1" />
                                <button type="button" className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white"><List size={16} /></button>
                                <button type="button" className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white"><LinkIcon size={16} /></button>
                                <button type="button" className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white"><ImageIcon size={16} /></button>
                            </div>

                            <textarea
                                required
                                rows="12"
                                value={formData.body}
                                onChange={e => setFormData({ ...formData, body: e.target.value })}
                                className="w-full bg-transparent p-4 text-white outline-none resize-none leading-relaxed"
                                placeholder="اكتب المقال كاملاً هنا..."
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">نصيحة: يمكنك استخدام Markdown للتنسيق.</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-white/10 mt-6 sticky bottom-0 bg-[#0a0a12] pb-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-3 rounded-xl font-bold bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl font-bold bg-[#7112AF] text-white hover:bg-[#5a0e8c] transition-colors shadow-lg shadow-[#7112AF]/20"
                        >
                            نشر المحتوى
                        </button>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
};
