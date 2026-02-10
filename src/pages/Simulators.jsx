import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Grid, Search } from 'lucide-react';
import LibraryFilters from '../components/cyber-range/dashboard/LibraryFilters';
import SimulatorCard from '../components/simulators/SimulatorCard';
import { SIMULATORS_DATA } from '../data/simulatorsData';

export default function Simulators() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('all');
    const [activeFilters, setActiveFilters] = useState({
        domain: 'all',
        level: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');

    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
    };

    const filteredData = SIMULATORS_DATA.filter(item => {
        const matchView = viewMode === 'all' ? true : item.type === viewMode;
        const matchDomain = activeFilters.domain === 'all' ? true : item.domain === activeFilters.domain;
        const matchLevel = activeFilters.level === 'all' ? true : item.level === activeFilters.level;
        const matchSearch = searchQuery === '' ? true :
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchView && matchDomain && matchLevel && matchSearch;
    });

    const handleCardClick = (simulator) => {
        if (!simulator.comingSoon && simulator.path) {
            navigate(simulator.path);
        }
    };

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo selection:bg-purple-500/30" dir="rtl">
            {/* Header Section */}
            <header className="relative pt-28 pb-12 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2134&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050214] via-transparent to-[#050214]"></div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div>
                        <h4 className="text-purple-500 font-mono mb-2 uppercase tracking-widest text-sm">نادي الأمن السيبراني - جامعة الطائف</h4>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                            <span className="bg-gradient-to-l from-purple-400 to-blue-400 bg-clip-text text-transparent">المحاكيات</span> التفاعلية
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                            تعلم المفاهيم التقنية من خلال التجربة والمشاهدة. بيئة معزولة وآمنة تماماً تسمح لك بارتكاب الأخطاء وفهم آلية عمل الأنظمة خطوة بخطوة.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 backdrop-blur-sm">
                            <div className="text-3xl font-bold text-purple-400">{SIMULATORS_DATA.length}</div>
                            <div className="text-sm text-slate-400">محاكي متاح</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 backdrop-blur-sm">
                            <div className="text-3xl font-bold text-blue-400">
                                {SIMULATORS_DATA.reduce((sum, s) => sum + s.xp, 0)}
                            </div>
                            <div className="text-sm text-slate-400">إجمالي XP</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="ابحث عن محاكي..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <LibraryFilters
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Grid */}
            <main className="max-w-7xl mx-auto px-6 pb-20">
                {filteredData.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
                            <Grid size={48} className="text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج</h3>
                        <p className="text-slate-400">جرب تغيير الفلاتر أو البحث عن شيء آخر</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                عرض {filteredData.length} من {SIMULATORS_DATA.length} محاكي
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Terminal size={16} />
                                <span>بيئة آمنة ومعزولة</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData.map((simulator) => (
                                <SimulatorCard
                                    key={simulator.id}
                                    data={simulator}
                                    onClick={() => handleCardClick(simulator)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* Bottom CTA */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 p-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 opacity-10 blur-[120px] rounded-full"></div>
                    <div className="relative z-10 text-center">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            جاهز لتطوير مهاراتك؟
                        </h3>
                        <p className="text-slate-400 text-lg mb-6 max-w-2xl mx-auto">
                            ابدأ رحلتك في الأمن السيبراني من خلال المحاكيات التفاعلية. تعلم من خلال التجربة العملية واكتسب المهارات التي يحتاجها سوق العمل.
                        </p>
                        <button
                            onClick={() => navigate('/simulators/3d-cybersecurity')}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold hover:from-purple-500 hover:to-blue-500 transition-all hover:scale-105"
                        >
                            جرب 3D Cybersecurity Simulator
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
