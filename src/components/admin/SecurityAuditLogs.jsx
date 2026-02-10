import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, AlertTriangle, User, Lock, FileText, RefreshCw,
    Clock, Terminal, CheckCircle, Ban, AlertCircle
} from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function SecurityAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getLogs(100);
            setLogs(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch logs:', err);
            setError('فشل في تحميل السجلات');
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = filter === 'all' 
        ? logs 
        : logs.filter(log => {
            if (filter === 'security') {
                return ['USER_BANNED', 'USER_UNBANNED', 'ADMIN_PASSWORD_RESET', 'UNAUTHORIZED_ACCESS'].includes(log.action);
            }
            if (filter === 'auth') {
                return ['LOGIN', 'LOGOUT', 'REGISTER'].includes(log.action);
            }
            return true;
        });

    const getActionIcon = (action) => {
        switch (action) {
            case 'LOGIN':
            case 'REGISTER':
                return <User size={16} className="text-blue-400" />;
            case 'USER_BANNED':
                return <Ban size={16} className="text-red-400" />;
            case 'USER_UNBANNED':
                return <CheckCircle size={16} className="text-green-400" />;
            case 'ADMIN_PASSWORD_RESET':
                return <Lock size={16} className="text-yellow-400" />;
            case 'SIMULATOR_COMPLETE':
                return <Terminal size={16} className="text-purple-400" />;
            default:
                return <FileText size={16} className="text-gray-400" />;
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'LOGIN':
                return 'text-blue-400';
            case 'USER_BANNED':
            case 'ADMIN_PASSWORD_RESET':
                return 'text-red-400';
            case 'USER_UNBANNED':
                return 'text-green-400';
            case 'SIMULATOR_COMPLETE':
                return 'text-purple-400';
            default:
                return 'text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw className="animate-spin text-purple-400 mx-auto mb-4" size={32} />
                    <p className="text-gray-400">جاري تحميل السجلات...</p>
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
                    onClick={fetchLogs}
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
                    <h2 className="text-2xl font-bold text-white mb-2">سجلات النظام</h2>
                    <p className="text-gray-400">تتبع جميع الأنشطة والأحداث الأمنية</p>
                </div>
                <button 
                    onClick={fetchLogs}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <RefreshCw size={20} className="text-gray-400" />
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {[
                    { value: 'all', label: 'الكل' },
                    { value: 'security', label: 'أمني' },
                    { value: 'auth', label: 'مصادقة' }
                ].map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === value
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Logs List */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                    {filteredLogs.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            لا توجد سجلات
                        </div>
                    ) : (
                        filteredLogs.map((log, index) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className="border-b border-white/5 p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        {getActionIcon(log.action)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-bold text-sm ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                • {log.username || 'Unknown'}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm">{log.details || log.action}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(log.timestamp).toLocaleString('ar-SA')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Shield size={12} />
                                                {log.ip_address || 'unknown'}
                                            </span>
                                            <span className="px-2 py-0.5 bg-white/5 rounded">
                                                {log.resource_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{logs.length}</div>
                    <div className="text-gray-400 text-sm">إجمالي السجلات</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">
                        {logs.filter(l => l.action === 'USER_BANNED').length}
                    </div>
                    <div className="text-gray-400 text-sm">عمليات الحظر</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                        {logs.filter(l => ['LOGIN', 'REGISTER'].includes(l.action)).length}
                    </div>
                    <div className="text-gray-400 text-sm">عمليات الدخول</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                        {logs.filter(l => l.action === 'SIMULATOR_COMPLETE').length}
                    </div>
                    <div className="text-gray-400 text-sm">إكمال المحاكيات</div>
                </div>
            </div>
        </div>
    );
}
