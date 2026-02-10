import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Plus, Edit2, Trash2, RefreshCw, Terminal, Shield,
    AlertTriangle, X, Search, Layers
} from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function SimulatorsManagement() {
    const [simulators, setSimulators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'tool',
        difficulty: 'easy',
        category: 'general'
    });

    useEffect(() => {
        fetchSimulators();
    }, []);

    const fetchSimulators = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getSimulators();
            setSimulators(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch simulators:', err);
            setError('فشل في تحميل المحاكيات');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await adminAPI.updateSimulator(editingItem.id, formData);
            } else {
                await adminAPI.createSimulator(formData);
            }
            setShowModal(false);
            setEditingItem(null);
            setFormData({ title: '', description: '', type: 'tool', difficulty: 'easy', category: 'general' });
            fetchSimulators();
        } catch (err) {
            alert('فشل في حفظ المحاكي');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            type: item.type,
            difficulty: item.difficulty,
            category: item.category || 'general'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المحاكي؟')) return;
        try {
            await adminAPI.deleteSimulator(id);
            fetchSimulators();
        } catch (err) {
            alert('فشل في حذف المحاكي');
        }
    };

    const filteredSimulators = simulators.filter(item => 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'text-green-400 bg-green-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/20';
            case 'hard': return 'text-red-400 bg-red-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    const getTypeIcon = (type) => {
        return type === 'attack' ? <Shield size={16} className="text-red-400" /> : <Terminal size={16} className="text-blue-400" />;
    };

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
                    <h2 className="text-2xl font-bold text-white">إدارة المحاكيات</h2>
                    <p className="text-gray-400 text-sm mt-1">الدروس والتدريبات العملية</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchSimulators} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
                        <RefreshCw size={20} className="text-gray-400" />
                    </button>
                    <button 
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({ title: '', description: '', type: 'tool', difficulty: 'easy', category: 'general' });
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                        <Plus size={20} />
                        إضافة محاكي
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="بحث في المحاكيات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
            </div>

            {/* Simulators List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSimulators.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    {getTypeIcon(item.type)}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">{item.title}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(item.difficulty)}`}>
                                        {item.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-xs">
                                {item.category}
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
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0f] border border-white/10 rounded-xl w-full max-w-lg"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    {editingItem ? 'تعديل محاكي' : 'إضافة محاكي جديد'}
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
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">النوع</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        >
                                            <option value="tool">أداة</option>
                                            <option value="attack">هجوم</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">المستوى</label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        >
                                            <option value="easy">مبتدئ</option>
                                            <option value="medium">متوسط</option>
                                            <option value="hard">متقدم</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">التصنيف</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="general">عام</option>
                                        <option value="linux">Linux</option>
                                        <option value="networking">شبكات</option>
                                        <option value="web">أمن الويب</option>
                                        <option value="forensics">التحقيق الجنائي</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">الوصف</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
                                    >
                                        {editingItem ? 'حفظ التغييرات' : 'إضافة المحاكي'}
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
