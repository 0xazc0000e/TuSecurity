import React from 'react';
import { Activity, Database, AlertTriangle, Smartphone } from 'lucide-react';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { MatrixBackground } from '../components/ui/MatrixBackground';

const ATTACKS = [
    { title: 'USB Baiting', icon: Activity, desc: 'ماذا تفعل لو وجدت فلاش USB في الممر؟ هل الفضول يغلبك؟', difficulty: 'Easy' },
    { title: 'SQL Injection', icon: Database, desc: 'استخراج بيانات المستخدمين من قاعدة البيانات عبر حقل تسجيل الدخول.', difficulty: 'Hard' },
    { title: 'Phishing Campaign', icon: AlertTriangle, desc: 'تحليل بريد إلكتروني احتيالي وكشف الروابط الملغومة.', difficulty: 'Medium' },
    { title: 'Mobile Malware', icon: Smartphone, desc: 'تطبيق يطلب صلاحيات غريبة. هل تمنحه الإذن؟', difficulty: 'Medium' },
];

export default function Attacks() {
    return (
        <div className="min-h-screen pt-24 px-6 relative">
            <MatrixBackground />
            <div className="max-w-7xl mx-auto">
                <SectionHeader title="المكتبة" subtitle="سيناريوهات التهديد" />
                <div className="grid md:grid-cols-2 gap-6">
                    {ATTACKS.map((atk, i) => (
                        <SpotlightCard key={i} className="flex gap-6 p-8 items-start text-right" isInteractive>
                            <div className="mt-1">
                                <div className="w-14 h-14 bg-[#240993] rounded-xl flex items-center justify-center text-[#d4b3ff] shadow-inner shadow-black/50 border border-white/10">
                                    <atk.icon size={24} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-bold text-white">{atk.title}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${atk.difficulty === 'Easy' ? 'text-green-400 border-green-400/30' : atk.difficulty === 'Medium' ? 'text-yellow-400 border-yellow-400/30' : 'text-red-400 border-red-400/30'}`}>{atk.difficulty}</span>
                                </div>
                                <p className="text-[#bbb6d1] leading-relaxed mb-4 text-sm font-light">{atk.desc}</p>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#7112AF] hover:underline cursor-pointer">ابدأ الحل &larr;</div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
