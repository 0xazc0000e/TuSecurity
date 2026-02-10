import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Gamepad2, Search } from 'lucide-react';
import LibraryFilters from '../components/cyber-range/dashboard/LibraryFilters';
import ScenarioCard from '../components/cyber-range/dashboard/ScenarioCard';

const MOCK_DATA = [
    {
        id: 'smartgrid-incident-1',
        title: 'SmartGrid Incident (Cyber Range)',
        description: 'سيناريو تفاعلي: قم بدور المهاجم أو المدافع في شبكة بنية تحتية حرجة. اكتشف الأجهزة، افحص المنافذ، وحلل الهجمات.',
        type: 'simulator',
        domain: 'defense',
        level: 'intermediate',
        progress: 0,
        xp: 2000,
        path: '/simulators/story-incident'
    },
    {
        id: 'ransomware-op-1',
        title: 'عملية: التشفير الشامل',
        description: 'محاكاة هجوم فدية كامل على بنية مستشفى. تعلم أدوات Kill, Top, Nmap, و Hydra.',
        type: 'simulator',
        domain: 'networking',
        level: 'intermediate',
        progress: 85,
        xp: 1200,
        path: '/simulators/ransomware-op'
    },
    {
        id: 'phishing-101',
        title: 'تحليل مصداقية البريد',
        description: 'تعلم تشريح رؤوس البريد الإلكتروني، واكتشاف محاولات الانتحال، وتتبع المرفقات الخبيثة.',
        type: 'lesson',
        domain: 'social',
        level: 'beginner',
        progress: 100,
        xp: 500
    },
    {
        id: 'linux-priv-esc',
        title: 'تصعيد الصلاحيات في لينكس',
        description: 'استغلال ملفات SUID وثغرات النواة للحصول على صلاحيات Root من مستخدم محدود.',
        type: 'simulator',
        domain: 'os',
        level: 'advanced',
        progress: 12,
        xp: 2500
    },
    {
        id: 'sql-injection',
        title: 'إتقان حقن SQL',
        description: 'فهم بنية قواعد البيانات وتعلم استخراج البيانات المخفية باستخدام هجمات UNION.',
        type: 'simulator',
        domain: 'pentesting',
        level: 'intermediate',
        progress: 0,
        xp: 1500
    },
    {
        id: 'crypto-basics',
        title: 'التشفير المتماثل vs غير المتماثل',
        description: 'درس تفاعلي يشرح RSA و AES وأهمية إدارة المفاتيح في الأمن الحديث.',
        type: 'lesson',
        domain: 'crypto',
        level: 'beginner',
        progress: 45,
        xp: 300
    },
    {
        id: 'firewall-config',
        title: 'إعداد جدار الحماية Iptables',
        description: 'تكوين جدار حماية لينكس لحظر حركة المرور الخبيثة مع السماح للخدمات الشرعية.',
        type: 'simulator',
        domain: 'defense',
        level: 'intermediate',
        progress: 0,
        xp: 1000
    }
];

export default function ThreatLibrary() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('all');
    const [activeFilters, setActiveFilters] = useState({
        domain: 'all',
        level: 'all'
    });

    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
    };

    const filteredData = MOCK_DATA.filter(item => {
        const matchView = viewMode === 'all' ? true : item.type === viewMode;
        const matchDomain = activeFilters.domain === 'all' ? true : item.domain === activeFilters.domain;
        const matchLevel = activeFilters.level === 'all' ? true : item.level === activeFilters.level;
        return matchView && matchDomain && matchLevel;
    });

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo selection:bg-purple-500/30" dir="rtl">
            {/* Header Section */}
            <header className="relative pt-28 pb-12 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050214] via-transparent to-[#050214]"></div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div>
                        <h4 className="text-purple-500 font-mono mb-2 uppercase tracking-widest text-sm">نادي الأمن السيبراني - جامعة الطائف</h4>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                            مكتبة <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">التهديدات</span>
                        </h1>
                        <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                            تعلم الأمن السيبراني من خلال المحاكاة والقصص والأدوات العملية.
                            أتقن فن الهجوم والدفاع في بيئة آمنة.
                        </p>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
                        <button
                            onClick={() => setViewMode('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'all' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setViewMode('simulator')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'simulator' ? 'bg-[#7112AF] text-white shadow-lg shadow-purple-900/50' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Gamepad2 size={16} /> المحاكيات
                        </button>
                        <button
                            onClick={() => setViewMode('lesson')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'lesson' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:text-white'}`}
                        >
                            <BookOpen size={16} /> الدروس
                        </button>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <LibraryFilters
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
            />

            {/* Content Grid */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredData.map(item => (
                            <ScenarioCard
                                key={item.id}
                                data={item}
                                onClick={() => item.path && navigate(item.path)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Search size={64} className="mb-4 text-gray-600" />
                        <p className="text-xl text-gray-400 font-bold">لا توجد نتائج تطابق الفلاتر المحددة.</p>
                        <button
                            onClick={() => {
                                setViewMode('all');
                                setActiveFilters({ domain: 'all', level: 'all' });
                            }}
                            className="mt-4 text-purple-400 hover:text-purple-300 underline"
                        >
                            إعادة تعيين الفلاتر
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
