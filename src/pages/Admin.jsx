import React, { useState } from 'react';
import { Settings, Plus, Layout, Users, FileText } from 'lucide-react';
import { MatrixBackground } from '../components/ui/MatrixBackground';

export default function Admin() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="min-h-screen pt-24 px-6 relative flex">
            <MatrixBackground />

            {/* Sidebar */}
            <div className="w-64 bg-[#0f0f16]/80 backdrop-blur-xl border-l border-white/10 hidden lg:block rounded-xl mr-6 h-fit sticky top-24 p-4">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-10 h-10 bg-[#7112AF] rounded-lg flex items-center justify-center text-white"><Settings size={20} /></div>
                    <div>
                        <h3 className="font-bold text-white">لوحة التحكم</h3>
                        <span className="text-xs text-slate-500">v1.2.0</span>
                    </div>
                </div>
                <nav className="space-y-2">
                    {[
                        { id: 'dashboard', label: 'نظرة عامة', icon: Layout },
                        { id: 'users', label: 'الأعضاء', icon: Users },
                        { id: 'content', label: 'إدارة المحتوى', icon: FileText },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === item.id ? 'bg-[#7112AF] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <item.icon size={18} /> {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-8 text-right">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">
                        {activeTab === 'dashboard' && 'نظرة عامة'}
                        {activeTab === 'users' && 'سجل الأعضاء'}
                        {activeTab === 'content' && 'إدارة المحتوى والمحاكيات'}
                    </h2>
                    <button className="flex items-center gap-2 bg-[#7112AF] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#5a0e8b] transition-colors"><Plus size={16} /> اضافة جديد</button>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-slate-400 text-sm mb-1">إجمالي الأعضاء</div>
                            <div className="text-3xl font-bold text-white">150</div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-slate-400 text-sm mb-1">المحاكيات النشطة</div>
                            <div className="text-3xl font-bold text-white">3</div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-slate-400 text-sm mb-1">قراءات المقالات</div>
                            <div className="text-3xl font-bold text-white">1,240</div>
                        </div>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="space-y-6">
                        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4">إضافة محاكي جديد</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="عنوان المحاكي" className="bg-[#050214] border border-white/10 rounded-lg p-3 text-white text-right" />
                                <select className="bg-[#050214] border border-white/10 rounded-lg p-3 text-slate-300 text-right">
                                    <option>اختر التصنيف</option>
                                    <option>شبكات</option>
                                    <option>ويب</option>
                                    <option>تشفير</option>
                                </select>
                                <textarea placeholder="وصف السيناريو..." className="col-span-2 bg-[#050214] border border-white/10 rounded-lg p-3 text-white text-right h-32"></textarea>
                                <div className="col-span-2 text-left">
                                    <button className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-[#d4b3ff]">حفظ المسودة</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
