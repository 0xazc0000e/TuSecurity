import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Shield, Zap, Globe, UserPlus, Layers } from 'lucide-react';
import { XIcon, LinkedInIcon, TelegramIcon, TikTokIcon, WhatsAppIcon } from '../components/ui/SocialIcons';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { SectionHeader } from '../components/ui/SectionHeader';

const LEADERS = [
    { name: 'محمد العتيبي', role: 'رئيس النادي', image: null },
    { name: 'سارة الزهراني', role: 'نائب الرئيس', image: null },
    { name: 'فهد القحطاني', role: 'رئيس لجنة المتابعة والتطوير', image: null },
    { name: 'نورة السبيعي', role: 'رئيسة لجنة التصميم', image: null },
    { name: 'خالد العمري', role: 'رئيس لجنة التواصل والإعلام', image: null },
    { name: 'أمل الشمري', role: 'رئيسة لجنة المحتوى', image: null },
];

const COMMITTEES = [
    {
        title: 'لجنة المتابعة والتطوير',
        desc: 'تعمل على ضمان سير العمل بكفاءة ومتابعة تنفيذ الخطط الاستراتيجية وتطوير أداء الأعضاء.',
        icon: Target,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        title: 'لجنة التصميم',
        desc: 'المسؤولة عن الهوية البصرية للنادي وتصميم جميع المواد الإعلامية والإعلانية بإبداع.',
        icon: Layers,
        color: 'from-purple-500 to-pink-500'
    },
    {
        title: 'لجنة التواصل والإعلام',
        desc: 'الجسر الذي يربط النادي بجمهوره، وتدير حسابات النادي وتنشر أخباره وتفاعلاته.',
        icon: Globe,
        color: 'from-green-500 to-emerald-500'
    },
    {
        title: 'لجنة المحتوى',
        desc: 'العقل المدبر للمواد العلمية والورش والدورات، وتضمن جودة المعلومات المقدمة.',
        icon: Zap,
        color: 'from-yellow-500 to-orange-500'
    }
];

export default function About() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-6 relative font-cairo">
            <MatrixBackground />

            <div className="max-w-7xl mx-auto space-y-24 relative z-10">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4 animate-pulse">
                        <Shield size={48} className="text-[#7112AF]" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white pb-2">
                        نادي الأمن السيبراني
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        نحن نخبة من الطلاب الشغوفين، نسعى لبناء مجتمع سيبراني واعٍ ومحترف،
                        نحمي المستقبل بالعلم والمعرفة.
                    </p>
                </motion.div>

                {/* Committees Grid */}
                <div>
                    <SectionHeader title="لجان النادي" subtitle="هيكل تنظيمي متكامل" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COMMITTEES.map((committee, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-[#0a0a16] border border-white/10 rounded-2xl p-6 overflow-hidden hover:border-[#7112AF]/50 transition-all duration-300"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${committee.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${committee.color} bg-opacity-10 mb-4 flex items-center justify-center`}>
                                        <committee.icon className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{committee.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{committee.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Leadership Section */}
                <div>
                    <SectionHeader title="قادة النادي" subtitle="نخبة المستقبل" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {LEADERS.map((leader, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors"
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple-500/20">
                                    {leader.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{leader.name}</h4>
                                    <span className="text-sm text-[#7112AF] font-bold">{leader.role}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Closing Statement */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center bg-gradient-to-r from-[#7112AF]/20 to-[#ff006e]/10 border border-[#7112AF]/30 rounded-3xl p-12 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                    <UserPlus size={64} className="mx-auto text-[#7112AF] mb-6 animate-pulse opacity-50 relative z-10" />
                    <h2 className="text-3xl font-bold text-white mb-4 relative z-10">انضم إلينا اليوم</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-8 relative z-10">
                        كن جزءاً من رحلتنا في استكشاف وحماية الفضاء السيبراني. نحن نرحب بكل شغوف ومبدع.
                    </p>
                    <a href="https://chat.whatsapp.com/IVCQBV5NnGiDcVi8anuvZo" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 flex items-center gap-2 mx-auto w-fit relative z-20">
                        <WhatsAppIcon size={20} />
                        <span>تواصل معنا عبر واتساب</span>
                    </a>
                    <div className="flex justify-center flex-wrap gap-4 mt-8 relative z-20">
                        <a href="https://x.com/TuSecurityClub" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-[#7112AF] text-white transition-all group" title="X (Twitter)">
                            <XIcon size={24} className="group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://www.linkedin.com/company/cybersecurity-club-tu/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-[#0077b5] text-white transition-all group" title="LinkedIn">
                            <LinkedInIcon size={24} className="group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://t.me/TuSecurityClub" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-[#0088cc] text-white transition-all group" title="Telegram">
                            <TelegramIcon size={24} className="group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://www.tiktok.com/@tusecurityclub?_r=1&_t=ZS-93wzzH31v9u" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-[#000000] text-white transition-all group" title="TikTok">
                            <TikTokIcon size={24} className="group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://chat.whatsapp.com/IVCQBV5NnGiDcVi8anuvZo" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-[#25D366] text-white transition-all group" title="WhatsApp">
                            <WhatsAppIcon size={24} className="group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
