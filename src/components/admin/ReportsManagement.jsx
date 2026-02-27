import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle, CheckCircle, Clock, Search,
    MessageSquare, User, Filter, RefreshCw
} from 'lucide-react';
import { reportsAPI } from '../../services/api';

export default function ReportsManagement() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const data = await reportsAPI.getReports();
            setReports(data);
            setError(null);
        } catch (err) {
            setError('فشل في تحميل التقارير');
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id, currentStatus) => {
        const newStatus = currentStatus === 'PENDING' ? 'RESOLVED' : 'PENDING';
        try {
            await reportsAPI.updateReportStatus(id, newStatus);
            setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (err) {
            alert('فشل في تحديث حالة التقرير');
        }
    };

    const filteredReports = reports.filter(r => {
        const matchesFilter = filter === 'ALL' || r.status === filter;
        const matchesSearch = r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.users?.username?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <RefreshCw className="animate-spin text-purple-400" size={32} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">إدارة البلاغات والشكاوى</h2>
                    <p className="text-gray-400 text-sm mt-1">عرض ومعالجة تقارير المستخدمين</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="بحث في البلاغات..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 w-64"
                        />
                    </div>
                    <button
                        onClick={fetchReports}
                        className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw size={20} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['ALL', 'PENDING', 'RESOLVED'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {f === 'ALL' ? 'الكل' : f === 'PENDING' ? 'قيد الانتظار' : 'تم الحل'}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredReports.length === 0 ? (
                    <div className="p-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
                        <p className="text-gray-500">لا توجد بلاغات مطابقة للبحث</p>
                    </div>
                ) : (
                    filteredReports.map(report => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${report.status === 'RESOLVED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {report.status === 'RESOLVED' ? 'تم الحل' : 'قيد الانتظار'}
                                        </span>
                                        <h3 className="text-lg font-bold text-white">{report.subject}</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                        {report.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} />
                                            <span>{report.users?.full_name || report.users?.username} ({report.users?.email})</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            <span>{new Date(report.created_at).toLocaleString('ar-SA')}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleResolve(report.id, report.status)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${report.status === 'RESOLVED'
                                            ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20'
                                        }`}
                                >
                                    {report.status === 'RESOLVED' ? (
                                        <>إعادة فتح</>
                                    ) : (
                                        <><CheckCircle size={16} /> علامة كتم الحل</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
