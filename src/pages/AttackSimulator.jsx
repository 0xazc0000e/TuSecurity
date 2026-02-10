import React, { useState, useEffect } from 'react';
import { Shield, Sword, AlertTriangle, Eye, EyeOff, Award, Clock, Target, BookOpen, Users, Globe, Lock, ChevronRight, ChevronLeft, Skull, Crown, Zap, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AttackSimulator() {
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState('scenario-selection');
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [currentStory, setCurrentStory] = useState(0);
    const [playerTitle, setPlayerTitle] = useState('');
    const [organization, setOrganization] = useState('');
    const [score, setScore] = useState(0);
    const [hints, setHints] = useState(3);
    const [discoveredSecrets, setDiscoveredSecrets] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [victory, setVictory] = useState(false);

    const scenarios = [
        {
            id: 'hospital-ransomware',
            title: 'أزمة مستشفى المدينة',
            description: 'هجوم فدية يستهدف مستشفى يهدد حياة المرضى',
            type: 'ransomware',
            difficulty: 'صعب',
            duration: '90 دقيقة',
            maxScore: 4000,
            image: 'hospital-crisis',
            stakes: 'حياة المرضى في خطر',
            attackerFaction: 'DarkMedusa Gang',
            defenderOrganization: 'City Hospital IT Security'
        },
        {
            id: 'bank-heist',
            title: 'سرقة البنك المركزي',
            description: 'محاولة سرقة ملايين من البنك المركزي عبر الثغرات الرقمية',
            type: 'data-theft',
            difficulty: 'متقدم',
            duration: '120 دقيقة',
            maxScore: 5000,
            image: 'bank-vault',
            stakes: 'خسارة مالية ضخمة',
            attackerFaction: 'Phantom Syndicate',
            defenderOrganization: 'National Cyber Defense Unit'
        },
        {
            id: 'power-grid',
            title: 'انقطاع التيار الكهربائي',
            description: 'هجوم على الشبكة الكهربائية يسبب انقطاع التيار عن مدينة بأكملها',
            type: 'critical-infrastructure',
            difficulty: 'خبير',
            duration: '150 دقيقة',
            maxScore: 6000,
            image: 'power-grid',
            stakes: 'مدينة في الظلام',
            attackerFaction: 'Blackout Collective',
            defenderOrganization: 'Critical Infrastructure Protection Agency'
        }
    ];

    const roles = {
        attacker: {
            title: 'الهاكر',
            description: 'أنت عضو في منظمة قراصنة تسعى لتحقيق أهدافها بأي ثمن',
            color: 'red',
            icon: Skull,
            moralAlignment: 'chaotic',
            winCondition: 'تحقيق أهداف المنظمة والهروب'
        },
        defender: {
            title: 'بطل الأمن السيبراني',
            description: 'أنت حامي البنية التحتية الرقمية للبلاد',
            color: 'blue',
            icon: Shield,
            moralAlignment: 'lawful',
            winCondition: 'حماية الأنظمة ومنع الهجوم'
        }
    };

    const generatePlayerTitle = (role, scenario) => {
        const attackerTitles = [
            'محلل ثغرات متقدم', 'خبير اختراق', 'مهندس هجوم', 'مطور برمجيات خبيثة',
            'متلاعب بالشبكات', 'خبير التشفير', 'مخطط عمليات', 'قائد فريق أحمر'
        ];
        
        const defenderTitles = [
            'محلل أمني أول', 'خبير استجابة للحوادث', 'مهندس أمنية', 'مدير مركز عمليات الأمن',
            'خبير الطب الشرعي الرقمي', 'محلل تهديدات', 'قائد فريق أزرق', 'حامي البوابة'
        ];

        const organizations = {
            attacker: ['DarkWeb Empire', 'Cyber Crime Syndicate', 'Digital Mafia', 'Underground Hackers'],
            defender: ['National Security Agency', 'Cyber Defense Command', 'Digital Protection Unit', 'Security Operations Center']
        };

        const titles = role === 'attacker' ? attackerTitles : defenderTitles;
        const orgs = organizations[role];

        setPlayerTitle(titles[Math.floor(Math.random() * titles.length)]);
        setOrganization(orgs[Math.floor(Math.random() * orgs.length)]);
    };

    const handleScenarioSelection = (scenario) => {
        setSelectedScenario(scenario);
        setCurrentPhase('role-selection');
    };

    const handleRoleSelection = (role) => {
        setSelectedRole(role);
        generatePlayerTitle(role, selectedScenario);
        setCurrentPhase('story-intro');
    };

    const storyParts = {
        'hospital-ransomware': {
            attacker: [
                {
                    title: 'الانضمام للعصابة',
                    content: `انضممت مؤخراً لعصابة DarkMedusa. اسمك في عالم الجريمة الرقمية هو "${playerTitle}". اليوم، مهمتك هي قيادة هجوم فدية على مستشفى المدينة.`,
                    image: 'dark-room',
                    choices: [
                        { text: 'دراسة المستشفى أولاً', impact: 'intelligence', points: 100 },
                        { text: 'الهجوم المباشر', impact: 'aggressive', points: 150 },
                        { text: 'البحث عن حليف داخلي', impact: 'strategic', points: 200 }
                    ]
                },
                {
                    title: 'اكتشاف الضعف',
                    content: 'اكتشفت أن نظام المستشفى يستخدم برنامج إدارة سجلات طبية قديم غير محدث. هذه هي فرصتك.',
                    image: 'vulnerability',
                    secretDiscovery: 'ثغرة يوم الصفر (Zero-day)',
                    choices: [
                        { text: 'استغلال الثغرة فوراً', impact: 'speed', points: 250 },
                        { text: 'بيع الثغرة للمنافسين', impact: 'greedy', points: -100 },
                        { text: 'بناء أداة مخصصة', impact: 'technical', points: 300 }
                    ]
                },
                {
                    title: 'لحظة الحقيقة',
                    content: 'النظام مشفر الآن. المرضى في خطر. تلقيت رسالة من زعيم العصابة: "إما الدفع أو المرضى سيموتون"',
                    image: 'moral-crossroad',
                    moralChoice: true,
                    choices: [
                        { text: 'المتابعة في الهجوم', impact: 'evil', points: 500 },
                        { text: 'إعطاء مفتاح فك التشفير', impact: 'good', points: -300 },
                        { text: 'الابتزاز المزدوج', impact: 'chaotic', points: 200 }
                    ]
                }
            ],
            defender: [
                {
                    title: 'التنبيه الأول',
                    content: `أنت ${playerTitle} في ${organization}. الساعة 3 صباحاً والهاتف يرن. نظام المستشفى تحت هجوم!`,
                    image: 'emergency-call',
                    choices: [
                        { text: 'إيقاع الشبكة فوراً', impact: 'cautious', points: 150 },
                        { text: 'محاولة الاحتواء', impact: 'brave', points: 200 },
                        { text: 'استدعاء الفريق', impact: 'leadership', points: 100 }
                    ]
                },
                {
                    title: 'مواجهة القراصنة',
                    content: 'تواصلت مع المهاجمين عبر القناة المشفرة. يطلبون 10 ملايين دولار كفدية.',
                    image: 'negotiation',
                    choices: [
                        { text: 'التفاوض معهم', impact: 'diplomatic', points: 250 },
                        { text: 'تتبعهم وتعقبهم', impact: 'tactical', points: 300 },
                        { text: 'طلب المساعدة من الحكومة', impact: 'strategic', points: 200 }
                    ]
                },
                {
                    title: 'السباق مع الزمن',
                    content: 'المدير التنفيذي يضغط عليك للدفع. المرضى في خطر. قرارك سيحدد مصير الكثيرين.',
                    image: 'pressure',
                    moralChoice: true,
                    choices: [
                        { text: 'الدفع لإنقاذ الأرواح', impact: 'compassionate', points: 100 },
                        { text: 'رفض الدفع ومواجهة العواقب', impact: 'principled', points: 400 },
                        { text: 'البحث عن حل بديل', impact: 'innovative', points: 350 }
                    ]
                }
            ]
        }
    };

    const currentStoryData = storyParts[selectedScenario?.id]?.[selectedRole] || [];

    const handleStoryChoice = (choice) => {
        setDecisions(prev => [...prev, choice]);
        setScore(prev => prev + choice.points);
        
        // Check for secret discoveries
        if (Math.random() > 0.7 && currentStoryData[currentStory]?.secretDiscovery) {
            const secretPoints = 500;
            setDiscoveredSecrets(prev => [...prev, currentStoryData[currentStory].secretDiscovery]);
            setScore(prev => prev + secretPoints);
        }
        
        nextStory();
    };

    const nextStory = () => {
        if (currentStory < currentStoryData.length - 1) {
            setCurrentStory(prev => prev + 1);
        } else {
            endGame();
        }
    };

    const endGame = () => {
        setGameOver(true);
        const totalPossibleScore = selectedScenario.maxScore;
        const finalScore = score + (discoveredSecrets.length * 500);
        setVictory(finalScore >= totalPossibleScore * 0.6);
    };

    const resetSimulation = () => {
        setCurrentPhase('scenario-selection');
        setSelectedScenario(null);
        setSelectedRole(null);
        setCurrentStory(0);
        setPlayerTitle('');
        setOrganization('');
        setScore(0);
        setHints(3);
        setDiscoveredSecrets([]);
        setDecisions([]);
        setGameOver(false);
        setVictory(false);
    };

    const renderPhase = () => {
        switch (currentPhase) {
            case 'scenario-selection':
                return (
                    <div className="text-center">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-4xl font-bold text-white mb-6">
                                اختر سيناريو الهجوم
                            </h2>
                            <p className="text-gray-300 mb-12 text-lg">
                                كل خطأ هو جريمة. كل قرار له عواقب. اختر بحكمة.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {scenarios.map((scenario) => (
                                    <div
                                        key={scenario.id}
                                        onClick={() => handleScenarioSelection(scenario)}
                                        className="relative group border rounded-2xl p-6 cursor-pointer transition-all duration-500 overflow-hidden transform hover:-translate-y-2 bg-gradient-to-br from-red-900/20 to-purple-900/20 border-red-900/30 hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.3)]"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <AlertTriangle size={120} />
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
                                                    {scenario.difficulty}
                                                </span>
                                                <span className="text-yellow-400 font-bold">{scenario.maxScore} XP</span>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-white mb-3">{scenario.title}</h3>
                                            <p className="text-gray-400 text-sm mb-4">{scenario.description}</p>
                                            
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-red-400">
                                                    <Skull size={16} />
                                                    <span>{scenario.attackerFaction}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-blue-400">
                                                    <Shield size={16} />
                                                    <span>{scenario.defenderOrganization}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-orange-400">
                                                    <AlertTriangle size={16} />
                                                    <span>{scenario.stakes}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-400">{scenario.duration}</span>
                                                    <span className="text-purple-400">اختر الآن</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'role-selection':
                return (
                    <div className="text-center">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    {selectedScenario.title}
                                </h2>
                                <p className="text-gray-300 text-lg">{selectedScenario.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {Object.entries(roles).map(([key, role]) => {
                                    const Icon = role.icon;
                                    return (
                                        <div
                                            key={key}
                                            onClick={() => handleRoleSelection(key)}
                                            className={`relative group border rounded-2xl p-8 cursor-pointer transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${
                                                role.color === 'red' 
                                                    ? 'bg-gradient-to-br from-[#1a0505] to-[#0a0505] border-red-900/30 hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.3)]'
                                                    : 'bg-gradient-to-br from-[#050a1a] to-[#050510] border-blue-900/30 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.3)]'
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
                                                <div className="bg-white/5 rounded-lg p-4">
                                                    <h4 className="font-bold text-white mb-2">شرط الفوز:</h4>
                                                    <p className="text-gray-300 text-sm">{role.winCondition}</p>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2">
                                                    <Crown size={16} className={role.color === 'red' ? 'text-red-400' : 'text-blue-400'} />
                                                    <span className="text-sm">{role.moralAlignment}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 'story-intro':
                return (
                    <div className="max-w-4xl mx-auto">
                        {!gameOver ? (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {currentStoryData[currentStory]?.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full ${
                                                selectedRole === 'attacker' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {playerTitle}
                                            </span>
                                            <span className="text-gray-400">{organization}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentStoryData.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    index === currentStory ? 'bg-purple-400 w-6' : 'bg-gray-700'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                
                                <div className={`rounded-xl p-6 mb-6 ${
                                    currentStoryData[currentStory]?.moralChoice 
                                        ? 'bg-gradient-to-br from-red-900/20 to-blue-900/20 border border-purple-500/30' 
                                        : 'bg-gradient-to-br from-purple-900/20 to-blue-900/20'
                                }`}>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        {currentStoryData[currentStory]?.content}
                                    </p>
                                    
                                    {currentStoryData[currentStory]?.moralChoice && (
                                        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                                <Radio size={20} />
                                                <h4 className="font-bold">قرار مصيري</h4>
                                            </div>
                                            <p className="text-gray-300 text-sm">
                                                هذا القرار سيحدد مصيرك ومصير الآخرين. اختر بحكمة.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-bold text-white mb-3">ماذا ستفعل؟</h4>
                                    {currentStoryData[currentStory]?.choices.map((choice, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleStoryChoice(choice)}
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-right group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-300 group-hover:text-white transition-colors">
                                                    {choice.text}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm ${
                                                        choice.points > 0 ? 'text-green-400' : 'text-red-400'
                                                    }`}>
                                                        {choice.points > 0 ? '+' : ''}{choice.points} XP
                                                    </span>
                                                    <ChevronLeft size={16} className="text-gray-400 group-hover:text-white" />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className={`max-w-2xl mx-auto p-8 rounded-2xl border ${
                                    victory 
                                        ? 'bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30' 
                                        : 'bg-gradient-to-br from-red-900/20 to-purple-900/20 border-red-500/30'
                                }`}>
                                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto">
                                        {victory ? (
                                            <div className="bg-green-600 w-full h-full rounded-full flex items-center justify-center">
                                                <Crown size={48} className="text-white" />
                                            </div>
                                        ) : (
                                            <div className="bg-red-600 w-full h-full rounded-full flex items-center justify-center">
                                                <Skull size={48} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h2 className={`text-3xl font-bold mb-4 ${
                                        victory ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {victory ? 'مهمة مكتملة بنجاح!' : 'فشل في المهمة!'}
                                    </h2>
                                    
                                    <div className="bg-white/5 rounded-lg p-6 mb-6">
                                        <h3 className="font-bold text-white mb-4">ملخص النتائج</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">النقاط النهائية:</span>
                                                <span className="text-yellow-400 font-bold">{score} XP</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">القرارات المتخذة:</span>
                                                <span className="text-blue-400">{decisions.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">الاكتشافات السرية:</span>
                                                <span className="text-purple-400">{discoveredSecrets.length}</span>
                                            </div>
                                        </div>
                                        
                                        {discoveredSecrets.length > 0 && (
                                            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                                <p className="text-purple-400 text-sm">
                                                    🎉 اكتشفت أسراً خفية! مستواك: متقدم
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <button
                                            onClick={resetSimulation}
                                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            محاكاة جديدة
                                        </button>
                                        <button
                                            onClick={() => navigate('/simulators')}
                                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            العودة للمحاكيات
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
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
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <Skull className="text-red-400" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">محاكي الهجمات المتقدم</h1>
                                <p className="text-gray-400 text-sm">سيناريوهات هجوم ودفاع واقعية مع عواقب حقيقية</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Award className="text-yellow-400" size={20} />
                                <span className="font-bold text-yellow-400">{score} XP</span>
                            </div>
                            {selectedScenario && (
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="text-orange-400" size={20} />
                                    <span className="text-orange-400">{selectedScenario.title}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-b border-red-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                        <p className="text-red-400 font-bold">
                            تحذير: هذا المحاكي يحتوي على مواقف أخلاقية صعبة. القرارات لها عواقب واقعية في السيناريو.
                        </p>
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
