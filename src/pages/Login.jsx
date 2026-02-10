import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.error || 'Login failed');
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-6 relative overflow-hidden">
            <MatrixBackground />

            {/* Decorative Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7112AF] rounded-full blur-[150px] opacity-20 pointer-events-none mix-blend-screen animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#240993] rounded-full blur-[150px] opacity-20 pointer-events-none mix-blend-screen" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-[#0f0f16]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#7112AF]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#7112AF]/30">
                            <Shield className="text-[#7112AF]" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">مرحباً بعودتك</h2>
                        <p className="text-slate-400 text-sm">سجل دخولك للوصول إلى منصة المحاكاة</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 block text-right">البريد الجامعي</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#7112AF] transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-[#050214]/50 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#7112AF] focus:ring-1 focus:ring-[#7112AF] transition-all text-right"
                                    placeholder="s44xxxxxxx@students.tu.edu.sa"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 block text-right">كلمة المرور</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#7112AF] transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-[#050214]/50 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#7112AF] focus:ring-1 focus:ring-[#7112AF] transition-all text-right"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <a href="#" className="text-[#bbb6d1] hover:text-white transition-colors">نسيت كلمة المرور؟</a>
                            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                                <span>تذكرني</span>
                                <input type="checkbox" className="rounded border-white/10 bg-[#050214] text-[#7112AF] focus:ring-0" />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#7112AF] to-[#520EA4] text-white font-bold py-3 rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{loading ? 'جاري تسجيل الدخول...' : 'دخول'}</span>
                            <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-400">
                        لست عضواً بعد؟ <button onClick={() => navigate('/register')} className="text-[#7112AF] font-bold hover:underline">انشئ حساب جديد</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
