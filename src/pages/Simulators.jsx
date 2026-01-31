import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Network, Lock, ChevronLeft, Shield, Cpu, Play } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { MatrixBackground } from '../components/ui/MatrixBackground';

const SimulatorCategory = ({ icon: Icon, label, isActive, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            relative group flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300
            ${isActive
                ? 'bg-[#7112AF]/10 border-[#7112AF] shadow-[0_0_30px_rgba(113,18,175,0.2)]'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:-translate-y-1'}
        `}
    >
        <div className={`p-4 rounded-full mb-4 ${isActive ? 'bg-[#7112AF] text-white' : 'bg-white/10 text-slate-400'}`}>
            <Icon size={32} />
        </div>
        <span className={`text-lg font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{label}</span>
        {disabled && (
            <span className="absolute top-4 left-4 text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-slate-500 border border-white/5">
                قريباً
            </span>
        )}
    </button>
);

export default function Simulators() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-24 px-6 relative overflow-hidden font-cairo">
            <MatrixBackground />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* 1. Page Introduction */}
                <div className="text-center mb-16">
                    <SectionHeader title="المحاكيات التفاعلية" subtitle="بيئة تعلم آمنة" />
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
                        تعلم المفاهيم التقنية من خلال التجربة والمشاهدة. بيئة معزولة وآمنة تماماً تسمح لك بارتتكاب الأخطاء وفهم آلية عمل الأنظمة خطوة بخطوة بعيداً عن التعقيد التقني.
                    </p>
                </div>

                {/* 2. Tool Categorization */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
                    <SimulatorCategory
                        icon={Cpu}
                        label="أنظمة التشغيل"
                        isActive={true}
                        onClick={() => { }}
                    />
                    <SimulatorCategory
                        icon={Network}
                        label="الشبكات"
                        isActive={false}
                        onClick={() => { }}
                        disabled={true}
                    />
                    <SimulatorCategory
                        icon={Lock}
                        label="التشفير"
                        isActive={false}
                        onClick={() => { }}
                        disabled={true}
                    />
                </div>

                {/* 3. Educational Preview Area - Bash Simulator */}
                <div className="max-w-5xl mx-auto">
                    <div className="group relative overflow-hidden rounded-3xl border border-[#7112AF]/30 bg-[#0c0c0c] transition-all hover:border-[#7112AF]/60">

                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7112AF] opacity-5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        <div className="grid grid-cols-1 lg:grid-cols-5 h-full relative z-10">
                            {/* Content Side */}
                            <div className="lg:col-span-3 p-10 flex flex-col justify-center text-right">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 rounded-full bg-[#7112AF]/20 text-[#d4b3ff] text-xs font-bold border border-[#7112AF]/30">
                                        مستوى مبتدئ
                                    </span>
                                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                        <Shield size={12} /> بيئة آمنة
                                    </span>
                                </div>

                                <h3 className="text-4xl font-bold text-white mb-6">أوامر النظام (Bash Fundamentals)</h3>

                                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                    اكتشف القوة الكامنة خلف الشاشة السوداء. في هذا المحاكي، ستربط ذهنياً بين ما تفعله يومياً بالماوس (مثل إنشاء المجلدات) وبين الأوامر النصية التي تتحكم بالنظام فعلياً.
                                </p>

                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#7112AF]"><Terminal size={16} /></div>
                                        <span>ستتعلم: كيفية التحدث مع نظام التشغيل مباشرة</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#7112AF]"><Cpu size={16} /></div>
                                        <span>ستجرب: كتابة أوامر حقيقية ورؤية تأثيرها فوراً</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-400"><Shield size={16} /></div>
                                        <span>لن يحدث: أي ضرر لجهازك، النظام وهمي بالكامل</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/simulators/bash')}
                                    className="w-fit flex items-center gap-3 px-8 py-4 bg-[#7112AF] hover:bg-[#5a0e8c] text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(113,18,175,0.4)] group-hover:scale-105"
                                >
                                    <Play size={20} fill="currentColor" />
                                    ابدأ التجربة الآن
                                </button>
                            </div>

                            {/* Visual Side */}
                            <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-black border-r border-white/5 p-8 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                {/* Abstract Visualization of Terminal vs GUI */}
                                <div className="relative w-full max-w-[300px] aspect-square">
                                    {/* GUI Folder Card */}
                                    <div className="absolute top-4 right-4 w-48 h-32 bg-slate-800 rounded-lg border border-slate-700 p-3 shadow-xl transform rotate-6 z-10 group-hover:rotate-12 transition-transform duration-700">
                                        <div className="flex gap-2 mb-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="aspect-square bg-blue-500/20 rounded flex items-center justify-center"><span className="text-xl">📁</span></div>
                                            <div className="aspect-square bg-blue-500/20 rounded flex items-center justify-center"><span className="text-xl">📁</span></div>
                                            <div className="aspect-square bg-white/5 rounded"></div>
                                        </div>
                                    </div>

                                    {/* Terminal Card */}
                                    <div className="absolute bottom-4 left-4 w-56 h-40 bg-black rounded-lg border border-[#7112AF]/30 p-4 shadow-2xl transform -rotate-6 z-20 group-hover:-rotate-3 transition-transform duration-700 font-mono text-xs text-green-500">
                                        <div className="text-white/50 mb-2 border-b border-white/10 pb-1">terminal</div>
                                        <div>$ mkdir new_folder</div>
                                        <div className="text-white">$ ls</div>
                                        <div className="text-blue-400">new_folder  documents</div>
                                        <div className="animate-pulse">_</div>
                                    </div>

                                    {/* Connecting Line */}
                                    <div className="absolute top-1/2 left-1/2 w-32 h-[2px] bg-gradient-to-r from-green-500 to-blue-500 transform -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-50"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
