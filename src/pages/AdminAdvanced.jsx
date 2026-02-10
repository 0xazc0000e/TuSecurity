import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, Users, FileText, Terminal, BarChart3, Activity, 
    Settings, Monitor, Lock, TrendingUp, Zap, Clock, Cpu, Database, HardDrive, Wifi
} from 'lucide-react';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

// Modular Components
import UserManagement from '../components/admin/UserManagement';
import ContentManagement from '../components/admin/ContentManagement';
import SimulatorsManagement from '../components/admin/SimulatorsManagement';
import SecurityAuditLogs from '../components/admin/SecurityAuditLogs';
import RestrictedAccess from '../components/admin/RestrictedAccess';

export default function AdminAdvanced() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalSimulators: 0,
        totalContent: 0,
        systemHealth: 98,
        securityScore: 95
    });

    // Fetch stats on mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const data = await adminAPI.getStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [selectedSimulator, setSelectedSimulator] = useState(null);
    const [codeContent, setCodeContent] = useState('');
    const [systemStats, setSystemStats] = useState({
        cpu: 45,
        memory: 62,
        storage: 78,
        network: 23,
        activeUsers: 2847,
        totalRequests: 156789,
        uptime: '99.98%',
        securityScore: 94
    });

    // Menu items with RBAC restrictions
    const menuItems = [
        { id: 'dashboard', label: 'لوحة التحكم', icon: Monitor, requiredRole: 'editor' },
        { id: 'content', label: 'إدارة المحتوى', icon: FileText, requiredRole: 'editor' },
        { id: 'simulators', label: 'المحاكيات', icon: Terminal, requiredRole: 'editor' },
        { id: 'users', label: 'المستخدمون', icon: Users, requiredRole: 'admin' },
        { id: 'security', label: 'الأمان والسجلات', icon: Shield, requiredRole: 'admin' },
    ];

    // Filter menu items based on user role
    const accessibleMenuItems = menuItems.filter(item => {
        if (!user) return false;
        const roleHierarchy = { student: 1, editor: 2, admin: 3 };
        return roleHierarchy[user.role] >= roleHierarchy[item.requiredRole];
    });

    const handleSimulatorUpload = () => {
        const newSimulator = {
            id: Date.now().toString(),
            name: 'New Simulator',
            status: 'development',
            users: 0,
            version: '1.0.0',
            lastUpdate: new Date().toISOString().split('T')[0],
            performance: 0,
            category: 'custom',
            code: codeContent
        };
        setSimulators(prev => [...prev, newSimulator]);
        setShowCodeEditor(false);
        setCodeContent('');
        setActiveTab('simulators');
    };

    const handleSimulatorUpdate = (simulatorId) => {
        setSimulators(prev => prev.map(sim => 
            sim.id === simulatorId 
                ? { ...sim, code: codeContent, lastUpdate: new Date().toISOString().split('T')[0] }
                : sim
        ));
        setShowCodeEditor(false);
        setCodeContent('');
        setSelectedSimulator(null);
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#7112AF]/10 to-[#ff006e]/10 border border-[#7112AF]/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#7112AF]/20 rounded-lg">
                            <Users className="text-[#7112AF]" size={24} />
                        </div>
                        <span className="text-green-400 text-sm">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{systemStats.activeUsers.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">المستخدمون النشطون</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-[#ff006e]/10 to-[#7112AF]/10 border border-[#ff006e]/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#ff006e]/20 rounded-lg">
                            <Terminal className="text-[#ff006e]" size={24} />
                        </div>
                        <span className="text-green-400 text-sm">+8%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stats.totalSimulators || 0}</div>
                    <div className="text-gray-400 text-sm">المحاكيات النشطة</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <TrendingUp className="text-green-400" size={24} />
                        </div>
                        <span className="text-green-400 text-sm">+24%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{systemStats.totalRequests.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">إجمالي الطلبات</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <Shield className="text-yellow-400" size={24} />
                        </div>
                        <span className="text-green-400 text-sm">ممتاز</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{systemStats.securityScore}%</div>
                    <div className="text-gray-400 text-sm">مستوى الأمان</div>
                </motion.div>
            </div>

            {/* System Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Cpu className="text-purple-400" size={24} />
                        أداء النظام
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'المعالج', value: systemStats.cpu, icon: Cpu, color: 'purple' },
                            { label: 'الذاكرة', value: systemStats.memory, icon: Database, color: 'blue' },
                            { label: 'التخزين', value: systemStats.storage, icon: HardDrive, color: 'green' },
                            { label: 'الشبكة', value: systemStats.network, icon: Wifi, color: 'orange' }
                        ].map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <item.icon className={`text-${item.color}-400`} size={16} />
                                        <span className="text-gray-300">{item.label}</span>
                                    </div>
                                    <span className="text-white font-bold">{item.value}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div 
                                        className={`bg-gradient-to-r from-${item.color}-500 to-${item.color}-400 h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="text-green-400" size={24} />
                        النشاط الحالي
                    </h3>
                    <div className="space-y-4">
                        {[
                            { icon: Users, label: 'مستخدمون متصلون', value: '1,247', color: 'blue' },
                            { icon: Terminal, label: 'جلسات المحاكاة', value: '384', color: 'purple' },
                            { icon: Zap, label: 'العمليات/ثانية', value: '2,847', color: 'yellow' },
                            { icon: Clock, label: 'وقت التشغيل', value: systemStats.uptime, color: 'green' }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 bg-${item.color}-500/20 rounded-lg`}>
                                        <item.icon className={`text-${item.color}-400`} size={16} />
                                    </div>
                                    <span className="text-gray-300">{item.label}</span>
                                </div>
                                <span className="text-white font-bold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );

    const renderSimulators = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">إدارة المحاكيات</h2>
                <button
                    onClick={() => setShowCodeEditor(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.5)] transition-all duration-300 flex items-center gap-2"
                >
                    <Upload size={20} />
                    رفع محاكي جديد
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {simulators.map((simulator, index) => (
                    <motion.div
                        key={simulator.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#7112AF]/50 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">{simulator.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                simulator.status === 'active' 
                                    ? 'bg-green-500/20 text-green-400'
                                    : simulator.status === 'maintenance'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-red-500/20 text-red-400'
                            }`}>
                                {simulator.status === 'active' ? 'نشط' : simulator.status === 'maintenance' ? 'صيانة' : 'متوقف'}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">الإصدار:</span>
                                <span className="text-white">{simulator.version}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">المستخدمون:</span>
                                <span className="text-white">{simulator.users.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">الأداء:</span>
                                <span className="text-white">{simulator.performance}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">آخر تحديث:</span>
                                <span className="text-white">{simulator.lastUpdate}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setSelectedSimulator(simulator);
                                    setCodeContent(simulator.code);
                                    setShowCodeEditor(true);
                                }}
                                className="flex-1 px-3 py-2 bg-[#7112AF]/20 text-[#7112AF] rounded-lg hover:bg-[#7112AF]/30 transition-colors text-sm font-bold"
                            >
                                تعديل
                            </button>
                            <button
                                onClick={() => navigate(`/simulators/${simulator.id}`)}
                                className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-bold"
                            >
                                معاينة
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const renderCodeEditor = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                    {selectedSimulator ? 'تعديل المحاكي' : 'رفع محاكي جديد'}
                </h2>
                <button
                    onClick={() => {
                        setShowCodeEditor(false);
                        setSelectedSimulator(null);
                        setCodeContent('');
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                    إلغاء
                </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="mb-4">
                    <label className="block text-white font-bold mb-2">اسم المحاكي</label>
                    <input
                        type="text"
                        placeholder="أدخل اسم المحاكي"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7112AF] transition-colors"
                        defaultValue={selectedSimulator?.name || ''}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-white font-bold mb-2">الفئة</label>
                    <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF] transition-colors">
                        <option value="terminal">طرفية</option>
                        <option value="tools">أدوات</option>
                        <option value="security">أمان</option>
                        <option value="network">شبكات</option>
                        <option value="custom">مخصص</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-white font-bold mb-2">كود المحاكي</label>
                    <div className="relative">
                        <textarea
                            value={codeContent}
                            onChange={(e) => setCodeContent(e.target.value)}
                            placeholder="// اكتب كود React هنا..."
                            className="w-full h-96 px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-[#7112AF] transition-colors resize-none"
                        />
                        <div className="absolute top-2 left-2 flex gap-2">
                            <button className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400 hover:bg-white/20">
                                Format
                            </button>
                            <button className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400 hover:bg-white/20">
                                Validate
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={selectedSimulator ? () => handleSimulatorUpdate(selectedSimulator.id) : handleSimulatorUpload}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.5)] transition-all duration-300"
                    >
                        {selectedSimulator ? 'تحديث المحاكي' : 'رفع المحاكي'}
                    </button>
                    <button
                        onClick={() => {
                            // Preview functionality
                            alert('معاينة المحاكي - سيتم فتح نافذة جديدة');
                        }}
                        className="px-6 py-3 bg-green-500/20 text-green-400 font-bold rounded-xl hover:bg-green-500/30 transition-colors"
                    >
                        معاينة
                    </button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'simulators': return <SimulatorsManagement />;
            case 'users': return <UserManagement />;
            case 'content': return <ContentManagement />;
            case 'security': return <SecurityAuditLogs />;
            default: return renderDashboard();
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
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                            activeTab === item.id
                                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50'
                                                : 'hover:bg-white/10 border border-transparent'
                                        }`}
                                    >
                                        <Icon size={20} className={
                                            activeTab === item.id ? 'text-purple-400' : 'text-gray-400'
                                        } />
                                        <span className={`font-medium ${
                                            activeTab === item.id ? 'text-white' : 'text-gray-400'
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
                    {showCodeEditor ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderCodeEditor()}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
