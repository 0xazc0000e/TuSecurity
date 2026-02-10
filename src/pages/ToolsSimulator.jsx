import React, { useState, useEffect } from 'react';
import { Shield, Sword, Search, AlertTriangle, Lightbulb, ChevronRight, Eye, EyeOff, Award, Clock, Target, BookOpen, Users, Globe, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ToolsSimulator() {
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState('intro');
    const [selectedRole, setSelectedRole] = useState(null);
    const [currentStory, setCurrentStory] = useState(0);
    const [selectedTools, setSelectedTools] = useState([]);
    const [hints, setHints] = useState(3);
    const [score, setScore] = useState(0);
    const [discoveredSecrets, setDiscoveredSecrets] = useState([]);
    const [showEnvironment, setShowEnvironment] = useState(false);

    const scenarios = [
        {
            id: 'network-breach',
            title: 'اختراق الشبكة الداخلية',
            description: 'شركة تقنية تواجه هجوماً على شبكتها الداخلية',
            image: 'network-security',
            difficulty: 'متوسط',
            duration: '45 دقيقة',
            maxScore: 2500
        },
        {
            id: 'data-exfiltration',
            title: 'تسريب البيانات الحساسة',
            description: 'محاولة سرقة بيانات العملاء من نظام بنكي',
            image: 'data-security',
            difficulty: 'متقدم',
            duration: '60 دقيقة',
            maxScore: 3000
        },
        {
            id: 'ransomware-attack',
            title: 'هجوم الفدية',
            description: 'مستشفى يتعرض لهجوم فدية يهدد المرضى',
            image: 'ransomware',
            difficulty: 'صعب',
            duration: '90 دقيقة',
            maxScore: 4000
        }
    ];

    const currentScenario = scenarios[0]; // Start with first scenario

    const roles = {
        attacker: {
            title: 'القراصنة',
            description: 'أنت جزء من فريق قراصنة محترفين يهدف لاختراق الأنظمة',
            color: 'red',
            icon: Sword,
            tools: ['nmap', 'metasploit', 'hydra', 'sqlmap', 'burpsuite'],
            objective: 'اختراق النظام واستخراج البيانات الحساسة'
        },
        defender: {
            title: 'فريق الأمن',
            description: 'أنت محلل أمني مسؤول عن حماية البنية التحتية',
            color: 'blue',
            icon: Shield,
            tools: ['wireshark', 'snort', 'ossec', 'splunk', 'nessus'],
            objective: 'اكتشاف التهديدات ومنع الهجمات'
        }
    };

    const storyParts = [
        {
            title: 'الوضع الحالي',
            content: selectedRole === 'attacker' 
                ? 'تم توظيفك من قبل منظمة قراصنة "DarkWeb" لاختراق شركة TechCorp. المعلومات الاستخباراتية تشير إلى وجود ثغرات في شبكتهم الداخلية.'
                : 'أنت محلل أمني في شركة TechCorp. تلقيت تنبيهاً من نظام كشف التسلل يشير إلى نشاط مشبوه في الشبكة.',
            image: 'situation-room'
        },
        {
            title: 'المهمة',
            content: selectedRole === 'attacker'
                ? 'مهمتك: الدخول إلى الشبكة، الوصول إلى قاعدة بيانات العملاء، واستخراج 1000 سجل على الأقل. لديك 60 دقيقة فقط.'
                : 'مهمتك: تحديد مصدر التهديد، منع الوصول غير المصرح به، وحماية البيانات الحساسة. يجب عليك إبلاغ الإدارة خلال 30 دقيقة.',
            image: 'mission-briefing'
        },
        {
            title: 'البيئة',
            content: 'الشركة تستخدم شبكة محلية مع خوادم Windows و Linux. جدار الحماية من نوع Cisco، ونظام مراقبة SIEM. البيانات الحساسة مخزنة في خادم قاعدة بيانات MySQL.',
            image: 'network-diagram'
        }
    ];

    const tools = {
        'nmap': { name: 'Nmap', category: 'استكشاف', description: 'فحص المنافذ والخدمات' },
        'metasploit': { name: 'Metasploit', category: 'استغلال', description: 'إطار عمل لاختراق الأنظمة' },
        'hydra': { name: 'Hydra', category: 'كسر', description: 'أداة لكسر كلمات المرور' },
        'sqlmap': { name: 'SQLMap', category: 'حقن', description: 'اكتشاف واستغلال حقن SQL' },
        'burpsuite': { name: 'Burp Suite', category: 'ويب', description: 'اختبار أمان تطبيقات الويب' },
        'wireshark': { name: 'Wireshark', category: 'تحليل', description: 'تحليل حزم الشبكة' },
        'snort': { name: 'Snort', category: 'كشف', description: 'نظام كشف التسلل' },
        'ossec': { name: 'OSSEC', category: 'مراقبة', description: 'مراقبة سلامة المضيف' },
        'splunk': { name: 'Splunk', category: 'تحليل', description: 'تحليل السجلات والبيانات' },
        'nessus': { name: 'Nessus', category: 'فحص', description: 'فحص الثغرات الأمنية' }
    };

    const secretDiscoveries = [
        { id: 'backdoor', name: 'باب خلفي مخفي', points: 500, hint: 'تحقق من الملفات غير المتوقعة في /tmp' },
        { id: 'weak-password', name: 'كلمة مرور ضعيفة', points: 300, hint: 'جرب كلمات المرور الافتراضية' },
        { id: 'unencrypted-traffic', name: 'حركة مرور غير مشفرة', points: 400, hint: 'راقب بروتوكول FTP' },
        { id: 'outdated-software', name: 'برنامج قديم', points: 350, hint: 'تحقق من إصدارات الخدمات' }
    ];

    const handleRoleSelection = (role) => {
        setSelectedRole(role);
        setCurrentPhase('story');
    };

    const handleNextStory = () => {
        if (currentStory < storyParts.length - 1) {
            setCurrentStory(prev => prev + 1);
        } else {
            setCurrentPhase('environment');
            setShowEnvironment(true);
        }
    };

    const handleToolSelection = (tool) => {
        if (selectedTools.includes(tool)) {
            setSelectedTools(prev => prev.filter(t => t !== tool));
        } else {
            setSelectedTools(prev => [...prev, tool]);
        }
    };

    const handleUseHint = () => {
        if (hints > 0) {
            setHints(prev => prev - 1);
            setScore(prev => Math.max(0, prev - 100));
        }
    };

    const handleDiscovery = (discoveryId) => {
        if (!discoveredSecrets.includes(discoveryId)) {
            const discovery = secretDiscoveries.find(d => d.id === discoveryId);
            setDiscoveredSecrets(prev => [...prev, discoveryId]);
            setScore(prev => prev + discovery.points);
        }
    };

    const resetSimulation = () => {
        setCurrentPhase('intro');
        setSelectedRole(null);
        setCurrentStory(0);
        setSelectedTools([]);
        setHints(3);
        setScore(0);
        setDiscoveredSecrets([]);
        setShowEnvironment(false);
    };

    const renderPhase = () => {
        switch (currentPhase) {
            case 'intro':
                return (
                    <div className="text-center">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-white mb-6">
                                اختر دورك في سيناريو: {currentScenario.title}
                            </h2>
                            <p className="text-gray-300 mb-8 text-lg">
                                {currentScenario.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {Object.entries(roles).map(([key, role]) => {
                                    const Icon = role.icon;
                                    return (
                                        <div
                                            key={key}
                                            onClick={() => handleRoleSelection(key)}
                                            className={`relative group border rounded-2xl p-8 cursor-pointer transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${
                                                role.color === 'red' 
                                                    ? 'bg-gradient-to-br from-[#1a0505] to-[#0a0505] border-red-900/30 hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.2)]'
                                                    : 'bg-gradient-to-br from-[#050a1a] to-[#050510] border-blue-900/30 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.2)]'
                                            }`}
                                        >
                                            <div className="absolute top-0 left-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <Icon size={180} />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={`p-3 ${role.color === 'red' ? 'bg-red-500/20' : 'bg-blue-500/20'} rounded-xl`}>
                                                        <Icon size={28} className={role.color === 'red' ? 'text-red-500' : 'text-blue-500'} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white">{role.title}</h3>
                                                        <p className="text-gray-400">{role.description}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-4 mb-6">
                                                    <h4 className="font-bold text-white mb-2">الهدف:</h4>
                                                    <p className="text-gray-300 text-sm">{role.objective}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Users size={16} />
                                                    <span>فريق {role.color === 'red' ? 'Red' : 'Blue'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-white">معلومات السيناريو</h3>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-yellow-400 flex items-center gap-1">
                                            <Target size={16} />
                                            {currentScenario.maxScore} نقطة
                                        </span>
                                        <span className="text-blue-400 flex items-center gap-1">
                                            <Clock size={16} />
                                            {currentScenario.duration}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-purple-400">{roles.attacker.tools.length}</div>
                                        <div className="text-xs text-gray-400">أدوات هجوم</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-400">{roles.defender.tools.length}</div>
                                        <div className="text-xs text-gray-400">أدوات دفاع</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-orange-400">{secretDiscoveries.length}</div>
                                        <div className="text-xs text-gray-400">اكتشافات سرية</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'story':
                return (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white">
                                    {storyParts[currentStory].title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    {storyParts.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                index === currentStory ? 'bg-purple-400 w-6' : 'bg-gray-700'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 mb-6">
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    {storyParts[currentStory].content}
                                </p>
                            </div>

                            {currentStory === storyParts.length - 1 && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                        <Lightbulb size={20} />
                                        <h4 className="font-bold">معلومات إضافية</h4>
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        تذكر: كل تلميح يستخدم يقلل من نقاطك. ابحث عن الاكتشافات السرية للحصول على نقاط إضافية ومستوى متقدم.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setCurrentPhase('intro')}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    تغيير الدور
                                </button>
                                <button
                                    onClick={handleNextStory}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all flex items-center gap-2"
                                >
                                    {currentStory === storyParts.length - 1 ? 'بدء المهمة' : 'التالي'}
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'environment':
                return (
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Tools Selection */}
                            <div className="lg:col-span-2">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <BookOpen size={20} />
                                        اختر الأدوات المناسبة
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {roles[selectedRole].tools.map(toolId => {
                                            const tool = tools[toolId];
                                            return (
                                                <div
                                                    key={toolId}
                                                    onClick={() => handleToolSelection(toolId)}
                                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                                        selectedTools.includes(toolId)
                                                            ? 'bg-purple-500/20 border-purple-500/50'
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <h4 className="font-bold text-white mb-1">{tool.name}</h4>
                                                    <p className="text-xs text-gray-400 mb-2">{tool.category}</p>
                                                    <p className="text-xs text-gray-300">{tool.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                        <h4 className="font-bold text-blue-400 mb-2">معلومات البيئة</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-400">الشبكة:</span>
                                                <span className="text-white mr-2">192.168.1.0/24</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">الخوادم:</span>
                                                <span className="text-white mr-2">Windows/Linux</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">جدار الحماية:</span>
                                                <span className="text-white mr-2">Cisco ASA</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">قاعدة البيانات:</span>
                                                <span className="text-white mr-2">MySQL</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Side Panel */}
                            <div className="space-y-6">
                                {/* Score and Hints */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h4 className="font-bold text-white mb-4">الحالة</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">النقاط:</span>
                                            <span className="text-yellow-400 font-bold">{score}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">التلميحات:</span>
                                            <span className="text-blue-400">{hints}/3</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">الأدوات:</span>
                                            <span className="text-purple-400">{selectedTools.length}</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={handleUseHint}
                                        disabled={hints === 0}
                                        className="w-full mt-4 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        استخدام تلميح (-100 نقطة)
                                    </button>
                                </div>

                                {/* Secret Discoveries */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <Eye size={16} />
                                        الاكتشافات السرية
                                    </h4>
                                    <div className="space-y-2">
                                        {secretDiscoveries.map(discovery => (
                                            <div
                                                key={discovery.id}
                                                className={`p-3 rounded-lg border ${
                                                    discoveredSecrets.includes(discovery.id)
                                                        ? 'bg-green-500/20 border-green-500/50'
                                                        : 'bg-white/5 border-white/10'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm">{discovery.name}</span>
                                                    {discoveredSecrets.includes(discovery.id) ? (
                                                        <span className="text-green-400 text-xs">+{discovery.points}</span>
                                                    ) : (
                                                        <span className="text-gray-500 text-xs">???</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <button
                                        onClick={resetSimulation}
                                        className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        إعادة المحاكاة
                                    </button>
                                    <button
                                        onClick={() => navigate('/simulators')}
                                        className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        العودة للمحاكيات
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            {/* Header */}
            <div className="border-b border-white/10 bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Target className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">محاكي الأدوات الاحترافي</h1>
                                <p className="text-gray-400 text-sm">بيئة عمل متكاملة لأدوات الأمن السيبراني</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Award className="text-yellow-400" size={20} />
                                <span className="font-bold text-yellow-400">{score} XP</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="text-blue-400" size={20} />
                                <span className="text-blue-400">{currentScenario.title}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {renderPhase()}
            </div>
        </div>
    );
}
