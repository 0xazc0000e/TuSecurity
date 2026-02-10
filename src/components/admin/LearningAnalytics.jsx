import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const LearningAnalytics = () => {
    const SKILLS_DATA = [
        { subject: 'Linux', A: 120, fullMark: 150 },
        { subject: 'Network', A: 98, fullMark: 150 },
        { subject: 'Crypto', A: 86, fullMark: 150 },
        { subject: 'Web', A: 99, fullMark: 150 },
        { subject: 'Forensics', A: 85, fullMark: 150 },
        { subject: 'Social Eng', A: 65, fullMark: 150 },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">تحليلات التعلم المعرفي</h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#050214]/60 border border-white/5 p-6 rounded-2xl">
                    <h3 className="font-bold text-white mb-4 text-center">توزيع المهارات المكتسبة</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILLS_DATA}>
                                <PolarGrid stroke="#ffffff20" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="الطلاب" dataKey="A" stroke="#7112AF" fill="#7112AF" fillOpacity={0.5} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f0f16', color: '#fff' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#050214]/60 border border-white/5 p-6 rounded-2xl">
                    <h3 className="font-bold text-white mb-4">أكثر المفاهيم صعوبة</h3>
                    <ul className="space-y-4">
                        {[
                            { name: 'Packet Analysis (Wireshark)', score: 34 },
                            { name: 'RSA Encryption Math', score: 42 },
                            { name: 'Buffer Overflow', score: 45 },
                            { name: 'SQL Injection Syntax', score: 55 },
                        ].map((item, i) => (
                            <li key={i} className="flex flex-col gap-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300">{item.name}</span>
                                    <span className="text-red-400 font-bold">{item.score}% نجاح</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5">
                                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${item.score}%` }}></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
