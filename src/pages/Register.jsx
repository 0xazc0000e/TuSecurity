import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Mail, Hash, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Client-side validation
        if (!formData.name.trim()) {
            setError('يرجى إدخال الاسم الكامل');
            return;
        }

        if (!formData.email.trim()) {
            setError('يرجى إدخال البريد الإلكتروني');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        if (formData.password.length < 6) {
            setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        setLoading(true);

        try {
            const result = await register({
                username: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (result.success) {
                setSuccess('تم إنشاء الحساب بنجاح! جارٍ التحويل...');
                setTimeout(() => {
                    navigate('/onboarding');
                }, 1000);
            } else {
                // Map common errors to Arabic
                let errorMsg = result.error;
                if (errorMsg.includes('already exists')) {
                    errorMsg = 'البريد الإلكتروني أو اسم المستخدم مسجل بالفعل';
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

            <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#7112AF] rounded-full blur-[200px] opacity-10 pointer-events-none animate-pulse" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="bg-[#0f0f16]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#7112AF]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#7112AF]/30">
                            <Shield className="text-[#7112AF]" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">عضوية جديدة</h2>
                        <p className="text-slate-400 text-sm">انضم إلى نخبة حماة المستقبل في TUCC</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-300 block text-right">الاسم الكامل <span className="text-red-400">*</span></label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500"><User size={16} /></div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#050214]/50 border border-white/10 rounded-lg py-2.5 pr-10 pl-3 text-white text-sm focus:border-[#7112AF] focus:outline-none transition-all text-right"
                                        placeholder="الاسم الثلاثي"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 block text-right">البريد الإلكتروني <span className="text-red-400">*</span></label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500"><Mail size={16} /></div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#050214]/50 border border-white/10 rounded-lg py-2.5 pr-10 pl-3 text-white text-sm focus:border-[#7112AF] focus:outline-none transition-all text-right"
                                    placeholder="email@students.tu.edu.sa"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 block text-right">كلمة المرور <span className="text-red-400">*</span></label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500"><Lock size={16} /></div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-[#050214]/50 border border-white/10 rounded-lg py-2.5 pr-10 pl-10 text-white text-sm focus:border-[#7112AF] focus:outline-none transition-all text-right"
                                    placeholder="6 أحرف على الأقل"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {formData.password && formData.password.length < 6 && (
                                <p className="text-xs text-red-400 text-right">كلمة المرور يجب أن تكون 6 أحرف على الأقل</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 block text-right">تأكيد كلمة المرور <span className="text-red-400">*</span></label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500"><Lock size={16} /></div>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-[#050214]/50 border border-white/10 rounded-lg py-2.5 pr-10 pl-3 text-white text-sm focus:border-[#7112AF] focus:outline-none transition-all text-right"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="text-xs text-red-400 text-right">كلمات المرور غير متطابقة</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#7112AF] to-[#520EA4] text-white font-bold py-3 rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>جاري إنشاء الحساب...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>إنشاء الحساب</span>
                                        <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    </>
                                )}
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
