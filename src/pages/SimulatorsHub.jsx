import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Terminal, Shield, Target, Cpu, Zap, ArrowRight, Filter, Search,
    Grid, List, ChevronDown, PlayCircle, Star, Clock, BarChart3,
    Award, Users, BookOpen, Code, Globe, Database, Lock, Wifi,
    AlertTriangle, CheckCircle, X
} from 'lucide-react';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import BashSimulatorPro from '../components/simulators/BashSimulatorPro';
import AttackSimulatorPro from '../components/simulators/AttackSimulatorPro';

export default function SimulatorsHub() {
    const [showIntro, setShowIntro] = useState(true);
    const [selectedSimulator, setSelectedSimulator] = useState(null);
    
    // Filter states
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterLevel, setFilterLevel] = useState('all');
    const [filterField, setFilterField] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [viewMode, setViewMode] = useState('grid');

    const SIMULATORS = [
        {
            id: 'bash-pro',
            title: 'محاكي Bash الاحترافي',
            category: 'tools',
            type: 'terminal',
            level: 'beginner',
            field: 'os',
            duration: '4 ساعات',
            xpReward: 500,
            participants: 1234,
            rating: 4.8,
            description: 'تعلم أوامر Linux من الصفر حتى الاحتراف مع بيئة تفاعلية حقيقية',
            tags: ['Linux', 'Bash', 'Terminal', 'OS'],
            status: 'active',
            icon: Terminal
        },
        {
            id: 'attack-operation',
            title: 'عملية الفهد الأسود',
            category: 'attacks',
            type: 'ctf',
            level: 'intermediate',
            field: 'pentesting',
            duration: '6 ساعات',
            xpReward: 800,
            participants: 567,
            rating: 4.9,
            description: 'سيناريو اختراق كامل مع 5 مراحل: استطلاع، مسح، استغلال، ما بعد الاستغلال',
            tags: ['Penetration Testing', 'CTF', 'Red Team', 'Blue Team'],
            status: 'active',
            icon: Shield
        }
    ];

    const CATEGORIES = [
        { id: 'all', label: 'الكل', icon: Grid },
        { id: 'tools', label: 'محاكي الأدوات', icon: Terminal },
        { id: 'attacks', label: 'محاكي الهجمات', icon: Shield }
    ];

    const LEVELS = [
        { id: 'all', label: 'جميع المستويات' },
        { id: 'beginner', label: 'مبتدئ' },
        { id: 'intermediate', label: 'متوسط' },
        { id: 'advanced', label: 'متقدم' }
    ];

    const FIELDS = [
        { id: 'all', label: 'جميع المجالات' },
        { id: 'os', label: 'أنظمة التشغيل' },
        { id: 'network', label: 'الشبكات' },
        { id: 'web', label: 'أمن الويب' },
        { id: 'pentesting', label: 'اختبار الاختراق' },
        { id: 'forensics', label: 'التحقيق الجنائي' }
    ];

    // Filter simulators
    const filteredSimulators = SIMULATORS.filter(sim => {
        const matchesCategory = filterCategory === 'all' || sim.category === filterCategory;
        const matchesLevel = filterLevel === 'all' || sim.level === filterLevel;
        const matchesField = filterField === 'all' || sim.field === filterField;
        const matchesSearch = sim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             sim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             sim.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesLevel && matchesField && matchesSearch;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'popular': return b.participants - a.participants;
            case 'rating': return b.rating - a.rating;
            case 'newest': return b.id.localeCompare(a.id);
            default: return 0;
        }
    });

    const getLevelBadge = (level) => {
        const styles = {
            beginner: 'bg-green-500/20 text-green-400',
            intermediate: 'bg-yellow-500/20 text-yellow-400',
            advanced: 'bg-red-500/20 text-red-400'
        };
        const labels = {
            beginner: 'مبتدئ',
            intermediate: 'متوسط',
            advanced: 'متقدم'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[level]}`}>
                {labels[level]}
            </span>
        );
    };

    const getCategoryBadge = (category) => {
        const styles = {
            tools: 'bg-blue-500/20 text-blue-400',
            attacks: 'bg-red-500/20 text-red-400'
        };
        const labels = {
            tools: 'أدوات',
            attacks: 'هجمات'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[category]}`}>
                {labels[category]}
            </span>
        );
    };

    const tabs = [
        { 
            id: 'tools', 
            label: 'محاكي الأدوات', 
            icon: Terminal,
            color: 'from-[#7112AF] to-[#240993]',
            description: 'تعلم أدوات الأمن السيبراني مع بيئة تفاعلية'
        },
        { 
            id: 'attacks', 
            label: 'محاكي الهجمات', 
            icon: Shield,
            color: 'from-[#ff006e] to-[#7112AF]',
            description: 'اختبر مهاراتك في سيناريوهات هجومية ودفاعية'
        }
    ];

    if (showIntro) {
        return (
            <div className="min-h-screen bg-[#050214] text-white font-cairo relative" dir="rtl">
                <MatrixBackground />
                
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl"
                    >
                        <div className="flex justify-center gap-8 mb-8">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-24 h-24 bg-gradient-to-br from-[#7112AF] to-[#240993] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(113,18,175,0.5)]"
                            >
                                <Terminal size={48} className="text-white" />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-24 h-24 bg-gradient-to-br from-[#ff006e] to-[#7112AF] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,0,110,0.5)]"
                            >
                                <Shield size={48} className="text-white" />
                            </motion.div>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                            مركز المحاكاة التفاعلية
                        </h1>
                        
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                            تعلم الأمن السيبراني بشكل عملي من خلال محاكيات متقدمة 
                            تجمع بين الأدوات والهجمات في بيئة آمنة ومتحكمة
                        </p>

                        <button
                            onClick={() => setShowIntro(false)}
                            className="px-8 py-4 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.5)] transition-all flex items-center gap-2 mx-auto"
                        >
                            <PlayCircle size={24} />
                            استكشف المحاكيات
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Show specific simulator
    if (selectedSimulator) {
        if (selectedSimulator.id === 'bash-pro') {
            return <BashSimulatorPro onBack={() => setSelectedSimulator(null)} />;
        }
        if (selectedSimulator.id === 'attack-operation') {
            return <AttackSimulatorPro onBack={() => setSelectedSimulator(null)} />;
        }
    }

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            <MatrixBackground />
            
            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowIntro(true)}
                                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <ArrowRight size={20} className="rotate-180" />
                            </button>
                            <div className="p-3 bg-[#7112AF]/20 rounded-lg">
                                <Terminal size={24} className="text-[#7112AF]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">مركز المحاكاة</h1>
                                <p className="text-gray-400 text-sm">اختر محاكياً وابدأ رحلة التعلم</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-400">
                                <span className="text-white font-bold">{SIMULATORS.length}</span> محاكي متاح
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                {/* Filters Bar */}
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Search */}
                            <div className="flex-1 min-w-64 relative">
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="البحث في المحاكيات..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pr-12 pl-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7112AF]"
                                />
                            </div>

                            {/* Category Filter */}
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF]"
                            >
                                <option value="all">جميع الفئات</option>
                                <option value="tools">محاكي الأدوات</option>
                                <option value="attacks">محاكي الهجمات</option>
                            </select>

                            {/* Level Filter */}
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF]"
                            >
                                {LEVELS.map(level => (
                                    <option key={level.id} value={level.id}>{level.label}</option>
                                ))}
                            </select>

                            {/* Field Filter */}
                            <select
                                value={filterField}
                                onChange={(e) => setFilterField(e.target.value)}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF]"
                            >
                                {FIELDS.map(field => (
                                    <option key={field.id} value={field.id}>{field.label}</option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF]"
                            >
                                <option value="popular">الأكثر شعبية</option>
                                <option value="rating">الأعلى تقييماً</option>
                                <option value="newest">الأحدث</option>
                            </select>

                            {/* View Mode */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#7112AF]/20 text-[#7112AF]' : 'bg-white/10 text-gray-400'}`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#7112AF]/20 text-[#7112AF]' : 'bg-white/10 text-gray-400'}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>

                            {/* Clear Filters */}
                            {(filterCategory !== 'all' || filterLevel !== 'all' || filterField !== 'all' || searchTerm) && (
                                <button
                                    onClick={() => {
                                        setFilterCategory('all');
                                        setFilterLevel('all');
                                        setFilterField('all');
                                        setSearchTerm('');
                                    }}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Active Filters Display */}
                        {(filterCategory !== 'all' || filterLevel !== 'all' || filterField !== 'all') && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                <span className="text-gray-400 text-sm">عوامل التصفية النشطة:</span>
                                {filterCategory !== 'all' && (
                                    <span className="px-3 py-1 bg-[#7112AF]/20 text-[#7112AF] rounded-full text-xs">
                                        الفئة: {CATEGORIES.find(c => c.id === filterCategory)?.label}
                                    </span>
                                )}
                                {filterLevel !== 'all' && (
                                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                                        المستوى: {LEVELS.find(l => l.id === filterLevel)?.label}
                                    </span>
                                )}
                                {filterField !== 'all' && (
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                        المجال: {FIELDS.find(f => f.id === filterField)?.label}
                                    </span>
                                )}
                                <span className="text-gray-400 text-sm mr-auto">
                                    نتائج: {filteredSimulators.length} محاكي
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Simulators Grid/List */}
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                        {filteredSimulators.map((simulator, index) => {
                            const Icon = simulator.icon;
                            return (
                                <motion.div
                                    key={simulator.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#7112AF]/50 transition-all group cursor-pointer ${
                                        viewMode === 'list' ? 'flex' : ''
                                    }`}
                                    onClick={() => setSelectedSimulator(simulator)}
                                >
                                    {/* Icon/Thumbnail */}
                                    <div className={`${viewMode === 'list' ? 'w-48' : 'h-48'} bg-gradient-to-br from-[#7112AF]/20 to-[#ff006e]/10 flex items-center justify-center relative`}>
                                        <Icon size={64} className="text-white/50" />
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            {getCategoryBadge(simulator.category)}
                                            {getLevelBadge(simulator.level)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#7112AF] transition-colors">
                                            {simulator.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4">{simulator.description}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {simulator.tags.map((tag, i) => (
                                                <span key={i} className="px-2 py-1 bg-white/10 text-gray-400 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {simulator.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users size={14} />
                                                {simulator.participants}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star size={14} className="text-yellow-400" />
                                                {simulator.rating}
                                            </span>
                                            <span className="flex items-center gap-1 text-yellow-400">
                                                <Award size={14} />
                                                +{simulator.xpReward} XP
                                            </span>
                                        </div>

                                        {/* Action */}
                                        <button className="w-full py-3 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(113,18,175,0.5)] transition-all flex items-center justify-center gap-2">
                                            <PlayCircle size={20} />
                                            بدء المحاكاة
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {filteredSimulators.length === 0 && (
                        <div className="text-center py-20">
                            <Search size={64} className="text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
                            <p className="text-gray-400">جرب تغيير عوامل البحث أو التصفية</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
