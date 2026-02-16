import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Edit2, Trash2, RefreshCw, Terminal, Shield,
    CheckCircle, X, Search, AlertTriangle, Code, Key
} from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function ScenarioManagement() {
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        simulator_type: 'bash',
        title: '',
        description: '',
        objective: '',
        expected_answer: '',
        hints: '',
        xp_reward: 10
    });

    useEffect(() => {
        fetchScenarios();
    }, []);

    const fetchScenarios = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getScenarios();
            setScenarios(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch scenarios:', err);
            setError('فشل في تحميل السيناريوهات');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert newline-separated hints to array
            const hintsArray = formData.hints ? formData.hints.split('\n').filter(h => h.trim()) : [];

            const submitData = {
                ...formData,
                hints: hintsArray,
                xp_reward: parseInt(formData.xp_reward)
            };

            if (editingItem) {
                await adminAPI.updateScenario(editingItem.id, submitData);
            } else {
                await adminAPI.createScenario(submitData);
            }
            setShowModal(false);
            setEditingItem(null);
            resetForm();
            fetchScenarios();
        } catch (err) {
            console.error('Submit error:', err);
            alert('فشل في حفظ السيناريو');
        }
    };

    const resetForm = () => {
        setFormData({
            simulator_type: 'bash',
            title: '',
            description: '',
            objective: '',
            expected_answer: '',
            hints: '',
            xp_reward: 10
        });
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            simulator_type: item.simulator_type,
            title: item.title,
            description: item.description || '',
            objective: item.objective,
            expected_answer: item.expected_answer,
            hints: item.hints ? JSON.parse(item.hints).join('\n') : '',
            xp_reward: item.xp_reward
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا السيناريو؟')) return;
        try {
            await adminAPI.deleteScenario(id);
            fetchScenarios();
        } catch (err) {
            alert('فشل في حذف السيناريو');
        }
    };

    const filteredScenarios = scenarios.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.objective?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-purple-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">إدارة السيناريوهات</h2>
                    <p className="text-gray-400 text-sm mt-1">إضافة وتعديل تحديات المحاكيات (Bash / Attack)</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                    <Plus size={20} />
                    إضافة سيناريو
                </button>
            </div>

            {/* Content List */}
            <div className="space-y-4">
                {filteredScenarios.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-purple-500/30 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${item.simulator_type === 'bash' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                {item.simulator_type === 'bash' ? <Terminal size={24} /> : <Shield size={24} />}
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.objective}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-400">XP: {item.xp_reward}</span>
                                    <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-400 font-mono">Ans: {item.expected_answer}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {filteredScenarios.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        لا توجد سيناريوهات مضافة حالياً
                    </div>
                )}
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
                                    {editingItem ? 'تعديل سيناريو' : 'إضافة سيناريو جديد'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">نوع المحاكي</label>
                                    <select
                                        value={formData.simulator_type}
                                        onChange={(e) => setFormData({ ...formData, simulator_type: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="bash">Bash Terminal</option>
                                        <option value="attack">Attack Simulator</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">عنوان السيناريو</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="مثال: البحث عن الملف المخفي"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">المهمة المطلوبة (Objective)</label>
                                    <textarea
                                        value={formData.objective}
                                        onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="شرح ما يجب على الطالب فعله..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">الإجابة الصحيحة (Flag/Command)</label>
                                    <div className="relative">
                                        <Key className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            type="text"
                                            value={formData.expected_answer}
                                            onChange={(e) => setFormData({ ...formData, expected_answer: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-purple-500"
                                            placeholder="cat hidden.txt"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">تلميحات (كل تلميح في سطر)</label>
                                    <textarea
                                        value={formData.hints}
                                        onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="استخدم الأمر ls لعرض الملفات..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">مكافأة XP</label>
                                    <input
                                        type="number"
                                        value={formData.xp_reward}
                                        onChange={(e) => setFormData({ ...formData, xp_reward: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
                                    >
                                        {editingItem ? 'حفظ التغييرات' : 'إضافة السيناريو'}
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
