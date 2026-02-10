import React from 'react';
import { Layout, Users, FileText, Terminal, BarChart2, Radio, Bell, Settings, LogOut, Activity } from 'lucide-react';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const MENU_ITEMS = [
        { id: 'overview', label: 'نظرة عامة', icon: Layout },
        { id: 'users', label: 'إدارة المستخدمين', icon: Users },
        { id: 'content', label: 'إدارة المحتوى', icon: FileText },
        { id: 'simulators', label: 'المحاكيات', icon: Terminal },
        { id: 'analytics', label: 'التحليلات التعليمية', icon: BarChart2 },
        { id: 'logs', label: 'سجلات النظام', icon: Activity },
        { id: 'notifications', label: 'الإشعارات', icon: Bell },
        { id: 'settings', label: 'الإعدادات', icon: Settings },
    ];

    return (
        <div className="w-64 bg-[#0f0f16]/90 backdrop-blur-xl border-l border-white/10 hidden lg:flex flex-col rounded-xl mr-6 h-[calc(100vh-8rem)] sticky top-28 p-4 shadow-xl shadow-black/20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-[#7112AF] to-[#a855f7] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#7112AF]/30">
                    <Radio size={20} className="animate-pulse" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">منصة القيادة</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] text-green-400 font-mono">System Online</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                {MENU_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden group ${activeTab === item.id
                                ? 'bg-gradient-to-r from-[#7112AF]/20 to-[#7112AF]/5 text-white border border-[#7112AF]/30 shadow-inner'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={18} className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110 text-[#d4b3ff]' : 'group-hover:scale-110'}`} />
                        <span>{item.label}</span>
                        {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7112AF]" />}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-white/5">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut size={18} /> تسجيل الخروج
                </button>
            </div>
        </div>
    );
};
