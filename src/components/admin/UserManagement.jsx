import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, Search, Shield, Award, AlertTriangle, CheckCircle,
    XCircle, RefreshCw, Trash2, Ban, Unlock
} from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [updatingRole, setUpdatingRole] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('فشل في تحميل المستخدمين');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            setUpdatingRole(userId);
            await adminAPI.updateUserRole(userId, newRole);
            setUsers(users.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (err) {
            console.error('Failed to update role:', err);
            alert('فشل في تحديث الدور');
        } finally {
            setUpdatingRole(null);
        }
    };

    const handleBanUser = async (userId, currentStatus) => {
        try {
            const reason = currentStatus === 'suspended' ? '' : 'Suspended by admin';
            await adminAPI.banUser(userId, reason);
            setUsers(users.map(user => 
                user.id === userId 
                    ? { ...user, status: currentStatus === 'suspended' ? 'active' : 'suspended' }
                    : user
            ));
        } catch (err) {
            alert('فشل في تغيير حالة المستخدم');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
        try {
            await adminAPI.deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            alert('فشل في حذف المستخدم');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getStatusBadge = (status) => {
        if (status === 'active') return <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle size={14} />نشط</span>;
        if (status === 'suspended') return <span className="flex items-center gap-1 text-red-400 text-sm"><Ban size={14} />محظور</span>;
        return <span className="flex items-center gap-1 text-gray-400 text-sm"><XCircle size={14} />غير نشط</span>;
    };

    const getRoleBadge = (role) => {
        const styles = { admin: 'bg-purple-500/20 text-purple-400', editor: 'bg-blue-500/20 text-blue-400', student: 'bg-gray-500/20 text-gray-400' };
        const labels = { admin: 'مدير', editor: 'محرر', student: 'طالب' };
        return <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[role]}`}>{labels[role]}</span>;
    };

    if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="animate-spin text-purple-400" size={32} /></div>;
    if (error) return <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center"><AlertTriangle className="text-red-400 mx-auto mb-4" size={32} /><p className="text-red-400">{error}</p></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">إدارة المستخدمين</h2>
                    <p className="text-gray-400 text-sm mt-1">تغيير الأدوار وإدارة الصلاحيات</p>
                </div>
                <button onClick={fetchUsers} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"><RefreshCw size={20} className="text-gray-400" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">{users.length}</div>
                    <div className="text-gray-400 text-sm">إجمالي المستخدمين</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</div>
                    <div className="text-gray-400 text-sm">النشطون</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-400">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="text-gray-400 text-sm">المدراء</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-red-400">{users.filter(u => u.status === 'suspended').length}</div>
                    <div className="text-gray-400 text-sm">المحظورون</div>
                </motion.div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="بحث بالاسم أو البريد..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
                    <option value="all">جميع الأدوار</option>
                    <option value="admin">المدراء</option>
                    <option value="editor">المحررون</option>
                    <option value="student">الطلاب</option>
                </select>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-300">المستخدم</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-300">الدور</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-300">الحالة</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-300">النقاط</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-300">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <motion.tr key={user.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">{user.username?.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <div className="text-white font-medium">{user.username}</div>
                                                <div className="text-gray-400 text-sm">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(user.role)}
                                            <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} disabled={updatingRole === user.id} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500">
                                                <option value="student">طالب</option>
                                                <option value="editor">محرر</option>
                                                <option value="admin">مدير</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-1 text-yellow-400"><Award size={16} />{user.total_xp || 0}</div></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleBanUser(user.id, user.status)} className={`p-2 rounded-lg transition-colors ${user.status === 'suspended' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                                                {user.status === 'suspended' ? <Unlock size={16} /> : <Ban size={16} />}
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
