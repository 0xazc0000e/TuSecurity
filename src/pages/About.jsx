import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    Users, Target, Shield, Zap, Globe, UserPlus, Layers,
    Award, Rocket, Heart, Sparkles, ChevronDown, Star,
    TrendingUp, BookOpen, Clock, CheckCircle2
} from 'lucide-react';
import { XIcon, LinkedInIcon, TelegramIcon, TikTokIcon, WhatsAppIcon } from '../components/ui/SocialIcons';
import { MatrixBackground } from '../components/ui/MatrixBackground';

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
        color: 'from-blue-500 to-cyan-500',
        stats: '15+ مشروع'
    },
    {
        title: 'لجنة التصميم',
        desc: 'المسؤولة عن الهوية البصرية للنادي وتصميم جميع المواد الإعلامية والإعلانية بإبداع.',
        icon: Layers,
        color: 'from-purple-500 to-pink-500',
        stats: '200+ تصميم'
    },
    {
        title: 'لجنة التواصل والإعلام',
        desc: 'الجسر الذي يربط النادي بجمهوره، وتدير حسابات النادي وتنشر أخباره وتفاعلاته.',
        icon: Globe,
        color: 'from-green-500 to-emerald-500',
        stats: '10K+ متابع'
    },
    {
        title: 'لجنة المحتوى',
        desc: 'العقل المدبر للمواد العلمية والورش والدورات، وتضمن جودة المعلومات المقدمة.',
        icon: Zap,
        color: 'from-yellow-500 to-orange-500',
        stats: '50+ ورشة'
    }
];

const STATS = [
    { number: '500+', label: 'عضو نشط', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { number: '50+', label: 'ورشة تدريبية', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { number: '15+', label: 'مسابقة CTF', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
    { number: '3', label: 'سنوات من التميز', icon: Clock, color: 'from-green-500 to-emerald-500' },
];

const VISION_MISSION = [
    {
        title: 'رؤيتنا',
        icon: Rocket,
        content: 'أن نكون النادي الرائد في مجال الأمن السيبراني على مستوى الجامعات السعودية، ونحقق الريادة في بناء جيل واعٍ وحماية المجتمع الرقمي.',
        color: 'from-purple-600 to-blue-600'
    },
    {
        title: 'رسالتنا',
        icon: Heart,
        content: 'تمكين الطلاب بالمعرفة والمهارات السيبرانية اللازمة، وخلق بيئة تعليمية محفزة للابتكار والإبداع في مجال الأمن السيبراني.',
        color: 'from-pink-600 to-rose-600'
    }
];

export default function About() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const [hoveredLeader, setHoveredLeader] = useState(null);

    return (
        <div className="min-h-screen relative font-cairo overflow-x-hidden bg-[#05050f]">
            <MatrixBackground />

            {/* Floating particles effect */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
                        initial={{ x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) }}
                        animate={{ y: [null, -100], opacity: [0, 1, 0] }}
                        transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
                    />
                ))}
            </div>

            {/* Hero Section with Logo */}
            <motion.section style={{ opacity }} className="relative min-h-screen flex items-center justify-center px-6">
                {/* Background glow effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse" />
                    <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse delay-2000" />
                </div>

                <div className="relative z-10 text-center max-w-5xl mx-auto">
                    {/* Logo with glow effect - Updated Design */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1, type: "spring", stiffness: 100 }}
                        className="relative w-64 h-64 md:w-96 md:h-96 mx-auto mb-12 flex items-center justify-center"
                    >
                        {/* Enhanced Outer glow */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7112AF] to-[#ff006e] blur-[100px] opacity-40 animate-pulse" />
                        <div className="absolute inset-4 rounded-full bg-blue-600/20 blur-[80px] opacity-30 animate-pulse delay-500" />

                        {/* Animated Rings - No Box */}
                        <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-8 border border-[#7112AF]/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                        <div className="absolute inset-16 border border-[#ff006e]/20 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />

                        {/* Logo - Large and clear */}
                        <img
                            src="/logos/TuSecurity_logo_5.png"
                            alt="TU Security Club Logo"
                            className="w-[140%] h-[140%] object-contain drop-shadow-[0_0_60px_rgba(113,18,175,0.6)] relative z-10 scale-110 hover:scale-125 transition-transform duration-700"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />

                        {/* Orbiting elements */}
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-[-20px] pointer-events-none">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0a0a16]/80 backdrop-blur-md border border-[#7112AF]/50 p-3 rounded-full shadow-[0_0_20px_rgba(113,18,175,0.3)]">
                                <Shield size={24} className="text-[#d4b3ff]" />
                            </div>
                        </motion.div>
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-[-40px] pointer-events-none">
                            <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-[#0a0a16]/80 backdrop-blur-md border border-[#ff006e]/50 p-3 rounded-full shadow-[0_0_20px_rgba(255,0,110,0.3)]">
                                <div className="text-white font-bold text-[10px] text-center leading-none">
                                    EST<br /><span className="text-[#ff006e] text-xs">2024</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Title with gradient */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">نادي الأمن السيبراني</span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-purple-400 font-bold">TuSecurity Club</p>
                    </motion.div>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        نحن نخبة من الطلاب الشغوفين، نسعى لبناء مجتمع سيبراني واعٍ ومحترف،
                        <br /><span className="text-purple-400">نحمي المستقبل بالعلم والمعرفة.</span>
                    </motion.p>

                    {/* Scroll indicator */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 text-gray-500">

                            <ChevronDown size={24} />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Stats Section */}
            <section className="relative py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {STATS.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="group relative"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                                <div className="relative bg-[#0a0a16]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-all">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="text-white" size={32} />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                                    <div className="text-gray-400">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="relative py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-center mb-16">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">رؤيتنا ورسالتنا</span>
                    </motion.h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {VISION_MISSION.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                whileHover={{ y: -10 }}
                                className="group relative"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                                <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                                        <item.icon className="text-white" size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-lg">{item.content}</p>
                                    <div className="absolute top-4 right-4 opacity-10">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Committees Section */}
            <section className="relative py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">لجان النادي</h2>
                        <p className="text-gray-400 text-xl">هيكل تنظيمي متكامل يحقق التميز</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COMMITTEES.map((committee, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="group relative"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${committee.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />
                                <div className="relative h-full bg-[#0a0a16]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden hover:border-white/20 transition-all">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${committee.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${committee.color} text-white opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        {committee.stats}
                                    </div>
                                    <div className="relative z-10">
                                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className={`w-14 h-14 rounded-xl bg-gradient-to-br ${committee.color} bg-opacity-10 mb-4 flex items-center justify-center shadow-lg`}>
                                            <committee.icon className="text-white" size={28} />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-white mb-3">{committee.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{committee.desc}</p>
                                    </div>
                                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="relative py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">قادة النادي</h2>
                        <p className="text-gray-400 text-xl">نخبة المستقبل يصنعون التغيير</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {LEADERS.map((leader, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                onHoverStart={() => setHoveredLeader(idx)}
                                onHoverEnd={() => setHoveredLeader(null)}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-all overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 p-[2px]">
                                            <div className="w-full h-full rounded-full bg-[#0a0a16] flex items-center justify-center">
                                                <span className="text-2xl font-bold text-white">{leader.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#0a0a16] flex items-center justify-center">
                                            <CheckCircle2 size={12} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{leader.name}</h4>
                                        <span className="text-sm text-purple-400 font-medium">{leader.role}</span>
                                        <AnimatePresence>
                                            {hoveredLeader === idx && (
                                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex gap-1 mt-2">
                                                    {[...Array(3)].map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="relative bg-gradient-to-br from-purple-900/30 via-[#0a0a16] to-pink-900/30 border border-purple-500/30 rounded-3xl p-12 md:p-16 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM3MTEyQUYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-10 right-10 opacity-20">
                            <Sparkles size={60} className="text-purple-400" />
                        </motion.div>
                        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-10 left-10 opacity-20">
                            <Shield size={50} className="text-pink-400" />
                        </motion.div>

                        <div className="relative z-10 text-center">
                            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} className="inline-block p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
                                <UserPlus size={48} className="text-purple-400" />
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">انضم إلينا اليوم</h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">كن جزءاً من رحلتنا في استكشاف وحماية الفضاء السيبراني. نحن نرحب بكل شغوف ومبدع.</p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <motion.a href="https://chat.whatsapp.com/IVCQBV5NnGiDcVi8anuvZo" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#25D366]/30 transition-all">
                                    <WhatsAppIcon size={24} />
                                    <span>انضم عبر واتساب</span>
                                </motion.a>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold border border-white/20 transition-all">
                                    <Award size={24} />
                                    <span>اعرف المزيد</span>
                                </motion.button>
                            </div>

                            <div className="flex justify-center flex-wrap gap-3">
                                {[
                                    { icon: XIcon, href: "https://x.com/TuSecurityClub", color: "hover:bg-gray-800", label: "X" },
                                    { icon: LinkedInIcon, href: "https://www.linkedin.com/company/cybersecurity-club-tu/", color: "hover:bg-[#0077b5]", label: "LinkedIn" },
                                    { icon: TelegramIcon, href: "https://t.me/TuSecurityClub", color: "hover:bg-[#0088cc]", label: "Telegram" },
                                    { icon: TikTokIcon, href: "https://www.tiktok.com/@tusecurityclub", color: "hover:bg-[#000000]", label: "TikTok" },
                                    { icon: WhatsAppIcon, href: "https://chat.whatsapp.com/IVCQBV5NnGiDcVi8anuvZo", color: "hover:bg-[#25D366]", label: "WhatsApp" },
                                ].map((social, idx) => (
                                    <motion.a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, y: -5 }} whileTap={{ scale: 0.9 }} className={`p-4 rounded-full bg-white/5 ${social.color} text-white transition-all border border-white/10 hover:border-white/30 group`} title={social.label}>
                                        <social.icon size={24} className="group-hover:scale-110 transition-transform" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className="h-24 bg-gradient-to-t from-[#0a0a16] to-transparent" />
        </div>
    );
}

// Trophy icon component
function Trophy({ size, className }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    );
}
