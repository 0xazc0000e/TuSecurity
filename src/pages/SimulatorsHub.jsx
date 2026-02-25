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
import { apiCall } from '../context/AuthContext';

export default function SimulatorsHub() {
    const [selectedSimulator, setSelectedSimulator] = useState(null);
    const [progressMap, setProgressMap] = useState({});
    const [loadingProgress, setLoadingProgress] = useState(true);

    // Filter states
    const [activeTab, setActiveTab] = useState('tools');
    const [filterLevel, setFilterLevel] = useState('all');
    const [filterField, setFilterField] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [viewMode, setViewMode] = useState('grid');
    const [startingSimulatorId, setStartingSimulatorId] = useState(null);

    const handleStartSimulator = async (simulator) => {
        try {
            setStartingSimulatorId(simulator.id);
            await apiCall(`/simulators/start/${simulator.id}`, 'POST');
            setSelectedSimulator(simulator);
        } catch (error) {
            console.error('Failed to start simulator:', error);
            // Open it anyway to avoid blocking user if backend is missing temporarily
            setSelectedSimulator(simulator);
        } finally {
            setStartingSimulatorId(null);
        }
    };

    // Fetch user progress on mount
    React.useEffect(() => {
        const fetchProgress = async () => {
            try {
                const data = await apiCall('/simulators/progress');
                if (data && Array.isArray(data)) {
                    const mappedProgress = {};
                    data.forEach(item => {
                        // Store the percentage mapped by string ID 
                        // Note: Depending on backend returns simulator ID might be an int or a string
                        mappedProgress[item.simulator_id.toString()] = item.progress_percentage || 0;
                    });

                    // Specific mapping for hardcoded simulator IDs since they differ from int database IDs right now
                    if (data.length > 0) {
                        // Force a fallback mapping if the DB is still empty or ID format mismatches the strings 'bash-pro'/'attack-operation'
                        mappedProgress['bash-pro'] = data.find(p => p.type === 'tool' || String(p.simulator_id) === '1')?.progress_percentage || 0;
                        mappedProgress['attack-operation'] = data.find(p => p.type === 'attack' || String(p.simulator_id) === '2')?.progress_percentage || 0;
                    }
                    setProgressMap(mappedProgress);
                }
            } catch (err) {
                console.error("Failed to load simulator progress:", err);
            } finally {
                setLoadingProgress(false);
            }
        };

        fetchProgress();
    }, []);

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
        { id: 'tools', label: 'محاكي الأدوات', icon: Terminal },
        { id: 'attacks', label: 'محاكي السيناريوهات', icon: Shield }
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
        const matchesCategory = sim.category === activeTab;
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
    }).map(sim => ({
        ...sim,
        progress: progressMap[sim.id] || 0
    }));

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
            attacks: 'سيناريوهات'
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
            label: 'محاكي السيناريوهات',
            icon: Shield,
            color: 'from-[#ff006e] to-[#7112AF]',
            description: 'اختبر مهاراتك في سيناريوهات هجومية ودفاعية'
        }
    ];

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
                    <div className="flex items-center justify-between pl-6 pr-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-[#7112AF] to-[#ff006e] rounded-lg shadow-lg">
                                <Terminal size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-wide">بيئة المحاكاة التفاعلية</h1>
                                <p className="text-gray-400 text-sm">اختر محاكياً وابدأ رحلة التعلم العملية</p>
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
                {/* Tabs Bar */}
                <div className="max-w-7xl mx-auto px-6 pt-6">
                    <div className="flex gap-4 mb-2 overflow-x-auto pb-4 hide-scrollbar">
                        {tabs.map((tab) => {
                            const TabIcon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 min-w-[240px] ${isActive
                                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                                        <TabIcon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                                    </div>
                                    <div className="text-right">
                                        <h3 className={`font-bold ${isActive ? 'text-white' : 'text-gray-200'}`}>
                                            {tab.label}
                                        </h3>
                                        <p className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                                            {tab.description}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabBadge"
                                            className="absolute inset-0 border-2 border-white/20 rounded-xl"
                                            initial={false}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

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
                            {(filterLevel !== 'all' || filterField !== 'all' || searchTerm) && (
                                <button
                                    onClick={() => {
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
                        {(filterLevel !== 'all' || filterField !== 'all') && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                <span className="text-gray-400 text-sm">عوامل التصفية النشطة:</span>
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
                                    className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#7112AF]/50 transition-all group cursor-pointer ${viewMode === 'list' ? 'flex' : ''
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
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStartSimulator(simulator);
                                            }}
                                            disabled={startingSimulatorId === simulator.id}
                                            className={`w-full py-3 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(113,18,175,0.5)] transition-all flex items-center justify-center gap-2 ${startingSimulatorId === simulator.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {startingSimulatorId === simulator.id ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <PlayCircle size={20} />
                                            )}
                                            {startingSimulatorId === simulator.id ? 'جاري البدء...' : 'بدء المحاكاة'}
                                        </button>

                                        {/* Progress Bar (if started) */}
                                        {simulator.progress > 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 mt-4 rounded-b-xl overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                                    style={{ width: `${Math.min(100, simulator.progress)}%` }}
                                                ></div>
                                            </div>
                                        )}
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
        </div >
    );
}
