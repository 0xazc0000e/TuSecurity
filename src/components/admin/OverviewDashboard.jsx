import React from 'react';
import { Users, BookOpen, Skull, Terminal, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { StatCounter } from '../ui/StatCounter';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const METRICS = [
    { label: 'إجمالي الأعضاء', value: 1240, change: '+12%', icon: Users },
    { label: 'الطلاب النشطين اليوم', value: 85, change: '+5%', icon: CheckCircle },
    { label: 'التهديدات المكتشفة', value: 34, change: '+2', icon: Skull },
    { label: 'مهام المحاكاة المنجزة', value: 890, change: '+15%', icon: Terminal },
];

const ACTIVITY_DATA = [
    { name: 'Sat', activity: 400 },
    { name: 'Sun', activity: 300 },
    { name: 'Mon', activity: 500 },
    { name: 'Tue', activity: 280 },
    { name: 'Wed', activity: 590 },
    { name: 'Thu', activity: 430 },
    { name: 'Fri', activity: 600 },
];

export const OverviewDashboard = () => {
    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {METRICS.map((metric, i) => (
                    <div key={i} className="bg-[#050214]/60 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#7112AF]/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <metric.icon size={64} />
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/5 rounded-xl text-[#d4b3ff]">
                                <metric.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{metric.change}</span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1"><StatCounter value={metric.value} /></h3>
                        <p className="text-slate-400 text-sm font-medium">{metric.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Activity Chart */}
                <div className="lg:col-span-2 bg-[#050214]/60 border border-white/5 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-lg">نشاط المنصة الأسبوعي</h3>
                        <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300 px-3 py-1 outline-none">
                            <option>آخر 7 أيام</option>
                            <option>آخر 30 يوم</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ACTIVITY_DATA}>
                                <defs>
                                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7112AF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7112AF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f0f16', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="activity" stroke="#7112AF" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* System Health / Alerts */}
                <div className="bg-[#050214]/60 border border-white/5 p-6 rounded-2xl flex flex-col">
                    <h3 className="font-bold text-white text-lg mb-6">تنبيهات النظام</h3>
                    <div className="space-y-4 flex-1 overflow-y-auto">
                        {[
                            { title: 'خطأ في محاكي Bash', time: '10 دقيقة', type: 'error' },
                            { title: 'تسجيل دخول مشبوه', time: '1 ساعة', type: 'warning' },
                            { title: 'تم تحديث قاعدة البيانات', time: '3 ساعات', type: 'success' },
                            { title: 'ضغط عالي على السيرفر', time: '5 ساعات', type: 'warning' },
                        ].map((alert, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                                <div className={`w-2 h-2 rounded-full ${alert.type === 'error' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={10} /> منذ {alert.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-xs font-bold text-slate-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                        عرض كل السجلات
                    </button>
                </div>
            </div>
        </div>
    );
};
