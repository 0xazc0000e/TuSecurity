import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react'; // Basic icons
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { GoogleIcon, MicrosoftIcon } from '../components/ui/SocialIcons.jsx';

import { useAuth, API_BASE_URL } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check for social login token in URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const redirectTo = params.get('redirectTo');
        const errorMsg = params.get('error');

        if (token) {
            localStorage.setItem('token', token);
            navigate(redirectTo || '/');
        } else if (errorMsg) {
            setError('فشل تسجيل الدخول الاجتماعي. يرجى المحاولة مرة أخرى.');
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Determine target redirect
                const target = result.user?.bio ? '/profile' : '/complete-profile';
                window.location.href = target;
            } else {
                setError(result.error || 'فشل تسجيل الدخول');
            }
        } catch (err) {
            setError('خطأ في الاتصال');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-[#05050f] overflow-hidden" dir="rtl">
            <MatrixBackground />

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative z-10">
                <div className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">مرحباً بعودتك</h2>
                        <p className="text-slate-400">سجل الدخول للمتابعة إلى المنصة</p>
                    </div>

                    {error && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${error.includes('السيرفر قيد التشغيل')
                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-3.5 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3.5 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-l from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'جاري التحقق...' : (
                                <><span>تسجيل الدخول</span> <LogIn size={18} className="rotate-180" /></>
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-xs text-slate-500 font-medium">أو تابع باستخدام</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <a href={`${API_BASE_URL}/auth/google`} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 transition-all text-white text-sm font-medium">
                            <GoogleIcon size={18} /> Google
                        </a>
                        <a href={`${API_BASE_URL}/auth/microsoft`} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 transition-all text-white text-sm font-medium">
                            <MicrosoftIcon size={18} /> Microsoft
                        </a>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-400">
                        ليس لديك حساب؟ <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">إنشاء حساب جديد</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
