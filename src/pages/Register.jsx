import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Mail, Hash, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        univId: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        if (formData.password.length < 6) {
            setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        setLoading(true);

        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.error || 'Registration failed');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-6 relative overflow-hidden">
            <MatrixBackground />

            <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#7112AF] rounded-full blur-[200px] opacity-10 pointer-events-none animate-pulse" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="bg-[#0f0f16]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">عضوية جديدة</h2>
                        <p className="text-slate-400 text-sm">انضم إلى نخبة حماة المستقبل في TUCC</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-300 block text-right">الرقم الجامعي</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500"><Hash size={16} /></div>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.univId}
                                        onChange={(e) => setFormData({...formData, univId: e.target.value})}
                                        className="w-full bg-[#050214]/50 border border-white/10 rounded-lg py-2.5 pr-10 pl-3 text-white text-sm focus:border-[#7112AF] focus:outline-none transition-all text-right" 
                                        placeholder="44xxxxxxx" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-300 block text-right">الاسم الكامل</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500"><User size={16} /></div>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-[#050214]/50 border border-white/10 rounded-lg py-2.5 pr-10 pl-3 text-white text-sm focus:border-[#7112AF] focus:outline-none transition-all text-right" 
                                        placeholder="الاسم الثلاثي" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 block text-right">البريد الجامعي</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500"><Mail size={16} /></div>
                                <input 
                                    type="email" 
                                    required 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-[#050214]/50 border border-white/10 rounded-lg py-2.5 pr-10 pl-3 text-white text-sm focus:border-[#7112AF] focus:outline-none transition-all text-right" 
                                    placeholder="email@students.tu.edu.sa" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 block text-right">كلمة المرور</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500"><Lock size={16} /></div>
                                <input 
                                    type="password" 
                                    required 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-[#050214]/50 border border-white/10 rounded-lg py-2.5 pr-10 pl-3 text-white text-sm focus:border-[#7112AF] focus:outline-none transition-all text-right" 
                                    placeholder="••••••••" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 block text-right">تأكيد كلمة المرور</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500"><Lock size={16} /></div>
                                <input 
                                    type="password" 
                                    required 
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    className="w-full bg-[#050214]/50 border border-white/10 rounded-lg py-2.5 pr-10 pl-3 text-white text-sm focus:border-[#7112AF] focus:outline-none transition-all text-right" 
                                    placeholder="••••••••" 
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-[#050214] font-bold py-3 rounded-xl hover:bg-[#d4b3ff] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}</span>
                                <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        لديك حساب بالفعل؟ <button onClick={() => navigate('/login')} className="text-[#7112AF] font-bold hover:underline">سجل دخولك</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
