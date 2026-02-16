import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');

    // Redirect back to where user came from, or to profile
    const from = location.state?.from?.pathname || '/profile';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Client-side validation
        if (!formData.email.trim()) {
            setError('يرجى إدخال البريد الإلكتروني');
            setLoading(false);
            return;
        }

        if (!formData.password) {
            setError('يرجى إدخال كلمة المرور');
            setLoading(false);
            return;
        }

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                setSuccess('تم تسجيل الدخول بنجاح! جارٍ التحويل...');
                setTimeout(() => {
                    // Redirect to onboarding if profile is incomplete
                    const dest = !result.user?.major ? '/onboarding' : from;
                    navigate(dest, { replace: true });
                }, 800);
            } else {
                // Map common errors to Arabic
                let errorMsg = result.error;
                if (errorMsg.includes('Invalid credentials')) {
                    errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
                } else if (errorMsg.includes('suspended') || errorMsg.includes('inactive')) {
                    errorMsg = 'تم تعليق هذا الحساب. تواصل مع المسؤول.';
                } else if (errorMsg.includes('الاتصال')) {
                    errorMsg = 'لا يمكن الاتصال بالخادم. تأكد من تشغيل السيرفر.';
                }
                setError(errorMsg);
            }
        } catch (err) {
            setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
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
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm"
                            >
                                <AlertCircle size={16} className="flex-shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400 text-sm"
                            >
                                <CheckCircle size={16} className="flex-shrink-0" />
                                <span>{success}</span>
                            </motion.div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 block text-right">البريد الإلكتروني</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#7112AF] transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-[#050214]/50 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#7112AF] focus:ring-1 focus:ring-[#7112AF] transition-all text-right"
                                    placeholder="admin@tu.edu.sa"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 block text-right">كلمة المرور</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#7112AF] transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-[#050214]/50 border border-white/10 rounded-xl py-3 pr-12 pl-12 text-white placeholder-slate-600 focus:outline-none focus:border-[#7112AF] focus:ring-1 focus:ring-[#7112AF] transition-all text-right"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#7112AF] to-[#520EA4] text-white font-bold py-3 rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>جاري تسجيل الدخول...</span>
                                </>
                            ) : (
                                <>
                                    <span>دخول</span>
                                    <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
                                </>
                            )}
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
