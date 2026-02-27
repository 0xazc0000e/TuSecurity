import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    Users, Search, Filter, Shield, Activity,
    Lock, Award, AlertTriangle, CheckCircle,
    XCircle, RefreshCw, Trash2, Ban, Unlock
} from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function UserManagementAdvanced() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [updatingRole, setUpdatingRole] = useState(null);
    const { user: currentUser } = useAuth();
    const [stats, setStats] = useState({ admin_count: 0 });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const [usersData, statsData] = await Promise.all([
                adminAPI.getUsers(),
                adminAPI.getStats()
            ]);
            setUsers(usersData);
            setStats(statsData);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('فشل في تحميل المستخدمين');
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId, currentStatus) => {
        try {
            setActionLoading(true);
            const reason = currentStatus === 'suspended' ? '' : 'Suspended by admin';
            await adminAPI.banUser(userId, reason);

            // Update local state
            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, status: currentStatus === 'suspended' ? 'active' : 'suspended' }
                    : user
            ));
        } catch (err) {
            console.error('Failed to ban/unban user:', err);
            alert('فشل في تغيير حالة المستخدم');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.')) {
            return;
        }

        try {
            setActionLoading(true);
            await adminAPI.deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            console.error('Failed to delete user:', err);
            alert('فشل في حذف المستخدم');
        } finally {
            setActionLoading(false);
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

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        try {
            setActionLoading(true);
            await adminAPI.resetPassword(selectedUser.id, newPassword);
            setShowResetModal(false);
            setNewPassword('');
            setSelectedUser(null);
            alert('تم إعادة تعيين كلمة المرور بنجاح');
        } catch (err) {
            console.error('Failed to reset password:', err);
            alert('فشل في إعادة تعيين كلمة المرور');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle size={14} />
                        نشط
                    </span>
                );
            case 'suspended':
                return (
                    <span className="flex items-center gap-1 text-red-400 text-sm">
                        <Ban size={14} />
                        محظور
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                        <XCircle size={14} />
                        غير نشط
                    </span>
                );
        }
    };

    const getRoleBadge = (role) => {
        const roleUpper = role?.toUpperCase();
        const styles = {
            SUPER_ADMIN: 'text-red-400',
            ADMIN: 'text-purple-400',
            MANAGER: 'text-orange-400',
            EDITOR: 'text-blue-400',
            STUDENT: 'text-gray-400'
        };
        const labels = {
            SUPER_ADMIN: 'Super Admin',
            ADMIN: 'Admin',
            MANAGER: 'Manager',
            EDITOR: 'Editor',
            STUDENT: 'Student'
        };
        const icons = {
            SUPER_ADMIN: <Shield size={14} />,
            ADMIN: <Shield size={14} />,
            MANAGER: <Lock size={14} />,
            EDITOR: <Lock size={14} />,
            STUDENT: <Users size={14} />
        };
        return (
            <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${styles[roleUpper] || 'text-gray-400'}`}>
                {icons[roleUpper] || <Users size={14} />}
                {labels[roleUpper] || role}
            </span>
        );
    };

    const canManageUser = (targetUser) => {
        if (!currentUser) return false;
        if (targetUser.email === 'az.jo.fm@gmail.com') return false; // SUPER_ADMIN is protected

        const ROLE_LEVELS = { 'STUDENT': 1, 'EDITOR': 2, 'MANAGER': 3, 'ADMIN': 4, 'SUPER_ADMIN': 5 };
        const myLevel = ROLE_LEVELS[currentUser.role?.toUpperCase()] || 0;
        const targetLevel = ROLE_LEVELS[targetUser.role?.toUpperCase()] || 0;

        if (currentUser.email === 'az.jo.fm@gmail.com') return true; // Me is super admin

        // Managers only EDITOR/STUDENT
        if (currentUser.role?.toUpperCase() === 'MANAGER') {
            return targetLevel < 3;
        }

        // Admin manage MANAGER/EDITOR/STUDENT
        if (currentUser.role?.toUpperCase() === 'ADMIN') {
            return targetLevel < 4;
        }

        return myLevel > targetLevel;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw className="animate-spin text-purple-400 mx-auto mb-4" size={32} />
                    <p className="text-gray-400">جاري تحميل المستخدمين...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
                <AlertTriangle className="text-red-400 mx-auto mb-4" size={32} />
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">إدارة المستخدمين</h2>
                    <p className="text-gray-400">إدارة حسابات المستخدمين وصلاحياتهم</p>
                </div>
                <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={20} className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Users className="text-blue-400" size={24} />
                        <span className="text-green-400 text-sm">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{users.length}</div>
                    <div className="text-gray-400 text-sm">إجمالي المستخدمين</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Activity className="text-green-400" size={24} />
                        <span className="text-green-400 text-sm">+8%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                        {users.filter(u => u.status === 'active').length}
                    </div>
                    <div className="text-gray-400 text-sm">المستخدمون النشطون</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border rounded-xl p-6 ${stats.admin_count >= 5 ? 'border-red-500/50' : 'border-yellow-500/30'}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <Shield className="text-yellow-400" size={24} />
                        <span className={`text-sm ${stats.admin_count >= 5 ? 'text-red-400' : 'text-green-400'}`}>
                            {stats.admin_count}/5
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                        {stats.admin_count}
                    </div>
                    <div className="text-gray-400 text-sm">المدراء (Admins)</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-red-500/10 to-purple-500/10 border border-red-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <AlertTriangle className="text-red-400" size={24} />
                        <span className="text-red-400 text-sm">تحذير</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                        {users.filter(u => u.status === 'suspended').length}
                    </div>
                    <div className="text-gray-400 text-sm">المستخدمون الموقوفون</div>
                </motion.div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="البحث عن مستخدم..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-12 pl-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7112AF] transition-colors"
                        />
                    </div>

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF] transition-colors"
                    >
                        <option value="all">جميع الأدوار</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="STUDENT">STUDENT</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF] transition-colors"
                    >
                        <option value="all">جميع الحالات</option>
                        <option value="active">نشط</option>
                        <option value="suspended">موقوف</option>
                    </select>

                    <button className="px-4 py-3 bg-[#7112AF]/20 text-[#7112AF] rounded-lg hover:bg-[#7112AF]/30 transition-colors flex items-center justify-center gap-2">
                        <Lock size={20} />
                        تصدير
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 text-right text-gray-400 font-bold">المستخدم</th>
                                <th className="px-6 py-4 text-right text-gray-400 font-bold">الدور</th>
                                <th className="px-6 py-4 text-right text-gray-400 font-bold">الحالة</th>
                                <th className="px-6 py-4 text-right text-gray-400 font-bold">النقاط</th>
                                <th className="px-6 py-4 text-right text-gray-400 font-bold">تاريخ التسجيل</th>
                                <th className="px-6 py-4 text-right text-gray-400 font-bold">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{user.username}</div>
                                                <div className="text-sm text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(user.role)}
                                            {canManageUser(user) && (
                                                <select
                                                    value={user.role?.toUpperCase()}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={updatingRole === user.id}
                                                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-purple-500"
                                                >
                                                    <option value="STUDENT">STUDENT</option>
                                                    <option value="EDITOR">EDITOR</option>
                                                    <option value="MANAGER">MANAGER</option>
                                                    {currentUser?.email === 'az.jo.fm@gmail.com' && <option value="ADMIN">ADMIN</option>}
                                                </select>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Award size={16} />
                                            {user.total_xp || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(user.created_at).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleBanUser(user.id, user.status)}
                                                disabled={actionLoading || !canManageUser(user)}
                                                className={`p-2 rounded-lg transition-colors ${user.status === 'suspended'
                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                    } disabled:opacity-20 disabled:cursor-not-allowed`}
                                                title={user.status === 'suspended' ? 'إلغاء الحظر' : 'حظر'}
                                            >
                                                {user.status === 'suspended' ? <Unlock size={16} /> : <Ban size={16} />}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowResetModal(true);
                                                }}
                                                disabled={actionLoading || !canManageUser(user)}
                                                className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                                                title="إعادة تعيين كلمة المرور"
                                            >
                                                <Lock size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={actionLoading || !canManageUser(user)}
                                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                                                title="حذف"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">إعادة تعيين كلمة المرور</h3>
                        <p className="text-gray-400 mb-4">
                            إعادة تعيين كلمة المرور للمستخدم: <span className="text-white">{selectedUser?.username}</span>
                        </p>
                        <input
                            type="password"
                            placeholder="كلمة المرور الجديدة"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleResetPassword}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                            >
                                {actionLoading ? 'جاري التنفيذ...' : 'تأكيد'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowResetModal(false);
                                    setNewPassword('');
                                    setSelectedUser(null);
                                }}
                                className="flex-1 px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                            >
                                إلغاء
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
