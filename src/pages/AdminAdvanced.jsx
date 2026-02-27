import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, BookOpen, Shield, Activity, Settings, LogOut,
    Plus, Search, Trash2, Edit, Save, X, ChevronRight,
    Terminal, Layout, FileText, Play, Image, LayoutDashboard, ShieldAlert, Database,
    TrendingUp, Folder, Video, FileUp, Monitor, Cpu, Trash, Calendar, Newspaper
} from 'lucide-react';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, lmsAPI } from '../services/api';

// Modular Components
import UserManagementAdvanced from '../components/admin/UserManagementAdvanced';
import ContentManagement from '../components/admin/ContentManagement';
import ScenarioManagement from '../components/admin/ScenarioManagement';
import NewsManagement from '../components/admin/NewsManagement';
import LmsManagement from '../components/admin/LmsManagement';
import EventsManagement from '../components/admin/EventsManagement';
import ReportsManagement from '../components/admin/ReportsManagement';
import SecurityAuditLogs from '../components/admin/SecurityAuditLogs';

export default function AdminAdvanced() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalSimulators: 0, totalContent: 0, systemHealth: 98, securityScore: 95 });

    // Security Check
    useEffect(() => {
        if (user && user.role !== 'admin' && user.role !== 'editor' && user.role !== 'manager') navigate('/dashboard');
    }, [user, navigate]);

    // Fetch stats on mount
    useEffect(() => {
        if (user && (user.role === 'admin' || user.role === 'editor' || user.role === 'manager')) fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        try { const data = await adminAPI.getStats(); setStats(data); } catch (err) { console.error('Failed to fetch stats:', err); }
    };

    // Menu Configuration
    const menuItems = [
        { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, requiredRole: 'EDITOR' },
        { id: 'users', label: 'المستخدمين', icon: Users, requiredRole: 'MANAGER' },
        { id: 'lms', label: 'المحتوى التعليمي', icon: BookOpen, requiredRole: 'EDITOR' },
        { id: 'events', label: 'الفعاليات', icon: Calendar, requiredRole: 'EDITOR' },
        { id: 'reports', label: 'البلاغات', icon: MessageSquare, requiredRole: 'MANAGER' },
        { id: 'security', label: 'سجلات الأمان', icon: Shield, requiredRole: 'ADMIN' },
        { id: 'settings', label: 'الإعدادات', icon: Settings, requiredRole: 'ADMIN' },
    ];

    const hasPermission = (requiredRole) => {
        const ROLE_LEVELS = { 'STUDENT': 1, 'EDITOR': 2, 'MANAGER': 3, 'ADMIN': 4, 'SUPER_ADMIN': 5 };
        const userRole = user?.role?.toUpperCase() || 'STUDENT';
        return (ROLE_LEVELS[userRole] || 0) >= (ROLE_LEVELS[requiredRole.toUpperCase()] || 0);
    };

    const accessibleMenuItems = menuItems.filter(item => hasPermission(item.requiredRole));

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#7112AF]/10 to-[#ff006e]/10 border border-[#7112AF]/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#7112AF]/20 rounded-lg"><Users className="text-[#7112AF]" size={24} /></div>
                        <span className="text-green-400 text-sm">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{(stats.activeUsers || stats.totalUsers || 0).toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">المستخدمون النشطون</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[#ff006e]/10 to-[#7112AF]/10 border border-[#ff006e]/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#ff006e]/20 rounded-lg"><Terminal className="text-[#ff006e]" size={24} /></div>
                        <span className="text-green-400 text-sm">+8%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stats.totalSimulators || 0}</div>
                    <div className="text-gray-400 text-sm">المحاكيات النشطة</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/20 rounded-lg"><TrendingUp className="text-green-400" size={24} /></div>
                        <span className="text-green-400 text-sm">+24%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{(stats.totalContent || 0).toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">إجمالي المحتوى</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-500/20 rounded-lg"><Shield className="text-yellow-400" size={24} /></div>
                        <span className="text-green-400 text-sm">ممتاز</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stats.securityScore || 95}%</div>
                    <div className="text-gray-400 text-sm">مستوى الأمان</div>
                </motion.div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'users': return <UserManagementAdvanced />;
            case 'events': return <EventsManagement />;
            case 'lms': return <LmsManagement />;
            case 'reports':
                return <ReportsManagement />;
            case 'security':
                return <SecurityAuditLogs />;
            case 'settings':
                return (
                    <div className="flex items-center justify-center h-64 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-center text-gray-400">
                            <Settings size={48} className="mx-auto mb-4 opacity-50" />
                            <p>الإعدادات قيد التطوير</p>
                        </div>
                    </div>
                );
            default:
                return renderDashboard();
        }
    };

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            <MatrixBackground />

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#7112AF]/20 rounded-lg">
                                <Shield className="text-[#7112AF]" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">لوحة التحكم المتقدمة</h1>
                                <p className="text-gray-400 text-sm">إدارة شاملة للمنصة التعليمية</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400">النظام يعمل</span>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-sm"
                            >
                                العودة للموقع
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex">
                {/* Sidebar */}
                <div className="w-64 min-h-screen bg-[#0a0a0f]/50 backdrop-blur-md border-l border-white/10">
                    <div className="p-6">
                        <nav className="space-y-2">
                            {accessibleMenuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === item.id
                                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50'
                                            : 'hover:bg-white/10 border border-transparent'
                                            }`}
                                    >
                                        <Icon size={20} className={
                                            activeTab === item.id ? 'text-purple-400' : 'text-gray-400'
                                        } />
                                        <span className={`font-medium ${activeTab === item.id ? 'text-white' : 'text-gray-400'
                                            }`}>
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
