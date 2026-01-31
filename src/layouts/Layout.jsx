import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Globe, Terminal, Cpu, User } from 'lucide-react';
import { NavLink } from '../components/ui/NavLink';

const SECTIONS = [
    { id: 'home', label: 'الرئيسية', path: '/' },
    { id: 'simulators', label: 'المحاكيات', path: '/simulators' },
    { id: 'attacks', label: 'مكتبة التهديدات', path: '/attacks' },
    { id: 'articles', label: 'قاعدة المعرفة', path: '/articles' },
    { id: 'news', label: 'الأخبار', path: '/news' },
];

export default function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    return (
        <div dir="rtl" className="bg-[#050214] min-h-screen text-slate-200 selection:bg-[#7112AF]/30 font-['Cocon_Next_Arabic',_'Cairo',_sans-serif] overflow-x-hidden flex flex-col relative">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7112AF]/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#240993]/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <nav className="fixed top-0 w-full z-40 glass border-b-0">
                <div className="w-full px-6 h-24 flex items-center justify-between">

                    {/* Right Side: Club Name & Icon */}
                    {/* 
                        تعليمات إعداد الشعار:
                        1. حجم الحاوية: 'h-full' يجعله يملأ ارتفاع الشريط (24 = 96 بكسل).
                        2. حجم الصورة: 'h-full w-auto' يضمن الحفاظ على نسبة الأبعاد.
                        3. التكبير (Scale): 'scale-[2.5]' يكبر الشعار بنسبة 250%. غيّرها إلى 'scale-150' أو 'scale-[2.0]' لتعديل الحجم.
                        4. التجاوز (Overflow): 'overflow-visible' يسمح للشعار بالامتداد خارج حدوده إذا تم تكبيره.
                        5. نقطة الارتكاز (Origin): 'origin-center' تضمن أن التكبير يبدأ من المنتصف.
                        6. الإزاحة (Translate): '-translate-x-10' تحرك الشعار لليسار أكثر.
                    */}
                    <div className="flex items-center gap-1 cursor-pointer h-full" onClick={() => navigate('/')}>
                        <div className="h-full w-auto relative flex items-center justify-center overflow-visible">
                            <img src="/logop.png" alt="TUCC Logo" className="h-full w-auto object-contain drop-shadow-[0_0_10px_rgba(113,18,175,0.4)] scale-[2.5] origin-center -translate-x-10" />
                        </div>
                    </div>

                    {/* Center: Navigation */}
                    <div className="hidden lg:flex items-center gap-8 bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-md hover:border-[#7112AF]/30 transition-colors">
                        {SECTIONS.map(item => (
                            <NavLink
                                key={item.id}
                                item={item}
                                active={location.pathname === item.path}
                                onClick={(e) => { e.preventDefault(); handleNavClick(item.path); }}
                            />
                        ))}
                    </div>

                    {/* Left Side: Buttons */}
                    <div className="hidden lg:flex items-center gap-6">
                        <button onClick={() => navigate('/profile')} className="p-2 rounded-full hover:bg-white/5 text-slate-300 hover:text-white transition-colors">
                            <User size={20} />
                        </button>
                        <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                            تسجيل الدخول
                        </button>
                        <button onClick={() => navigate('/register')} className="relative group overflow-hidden bg-gradient-to-r from-[#7112AF] to-[#520EA4] px-6 py-3 rounded-xl font-bold text-sm text-white shadow-[0_0_30px_rgba(113,18,175,0.3)] hover:shadow-[0_0_50px_rgba(113,18,175,0.6)] transition-all">
                            <span className="relative z-10 flex items-center gap-2">انضم إلينا</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-24 left-0 w-full bg-[#050214] border-b border-white/10 p-6 flex flex-col gap-4">
                        {SECTIONS.map(item => (
                            <button key={item.id} onClick={() => handleNavClick(item.path)} className="text-right py-2 text-slate-300 hover:text-white border-b border-white/5 last:border-0">
                                {item.label}
                            </button>
                        ))}
                        <button onClick={() => { navigate('/profile'); setIsMenuOpen(false); }} className="text-right py-2 text-slate-300 hover:text-white font-bold">الملف الشخصي</button>
                        <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="text-right py-2 text-[#7112AF] font-bold">تسجيل الدخول</button>
                    </div>
                )}
            </nav>

            <main className="flex-1 relative pt-32">
                <Outlet />
            </main>

            <footer className="py-12 border-t border-white/5 bg-[#02010a] relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3"><Shield className="w-6 h-6 text-[#520EA4]" /><span className="text-slate-500 font-mono text-sm">© 2025 TUCC. التعليم من أجل الحماية.</span></div>
                    <div className="flex gap-6">
                        <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-[#7112AF] text-white transition-all"><Globe size={18} /></a>
                        <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-[#7112AF] text-white transition-all"><Terminal size={18} /></a>
                        <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-[#7112AF] text-white transition-all"><Cpu size={18} /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
