import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { MatrixBackground } from '../components/ui/MatrixBackground';

export default function News() {
    return (
        <div className="min-h-screen pt-24 px-6 relative">
            <MatrixBackground />
            <div className="max-w-7xl mx-auto text-right">
                <SectionHeader title="المركز الإعلامي" subtitle="أخبار وفعاليات النادي" />

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 glass-card glass-hover border border-[#7112AF]/30">
                        <div className="flex items-center gap-3 mb-4"><Calendar className="text-[#7112AF]" size={24} /><span className="text-white font-bold text-lg">15 نوفمبر 2025</span></div>
                        <h4 className="text-2xl font-bold text-[#d4b3ff] mb-4">تحدي التقاط العلم (CTF) - النسخة الثالثة</h4>
                        <p className="text-slate-300 leading-relaxed mb-6">يسر نادي TUCC الإعلان عن مسابقة CTF على مستوى الجامعة. التحديات تشمل الويب، التشفير، والتحقيق الجنائي الرقمي. جوائز قيمة للفائزين.</p>
                        <button className="px-6 py-2 bg-[#7112AF] text-white rounded-lg font-bold hover:bg-[#5a0e8b] transition-colors">سجل الآن</button>
                    </div>

                    <div className="p-8 glass-card glass-hover">
                        <div className="flex items-center gap-3 mb-4"><Users className="text-[#7112AF]" size={24} /><span className="text-white font-bold text-lg">20 نوفمبر 2025</span></div>
                        <h4 className="text-2xl font-bold text-white mb-4">لقاء الخبراء: الأمن السيبراني في قطاع الطاقة</h4>
                        <p className="text-slate-300 leading-relaxed mb-6">جلسة حوارية خاصة مع مهندسي أمن المعلومات من شركة أرامكو السعودية للحديث عن حماية البنية التحتية الحساسة (ICS/SCADA).</p>
                        <button className="px-6 py-2 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-colors">تفاصيل أكثر</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
