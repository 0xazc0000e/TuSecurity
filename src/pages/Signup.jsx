import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Shield, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tusecurity.onrender.com/api';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('كلمتا المرور غير متطابقتين');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                })
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || 'فشل إنشاء الحساب');
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
                <div className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">

                    {/* Success Overlay */}
                    <AnimatePresence>
                        {success && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 bg-[#0a0a14]/95 flex flex-col items-center justify-center text-center p-6">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} className="text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">تحقق من بريدك الوارد!</h3>
                                <p className="text-slate-400 mb-8">لقد أرسلنا رابط التحقق إلى <br /><span className="text-emerald-400">{formData.email}</span></p>
                                <Link to="/login" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors">
                                    العودة لتسجيل الدخول
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-purple-600/20 mb-4">
                            <Shield className="text-purple-400" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">إنشاء حساب جديد</h2>
                        <p className="text-slate-400">انضم إلى مجتمع الأمن السيبراني</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">الاسم الكامل</label>
                            <div className="relative">
                                <User className="absolute right-3 top-3.5 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                                    placeholder="الاسم الكامل"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
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

                        <div className="space-y-1">
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

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3.5 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-l from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group mt-6"
                        >
                            {loading ? 'جاري المعالجة...' : (
                                <><span>إنشاء الحساب</span> <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        لدي حساب بالفعل؟ <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">تسجيل الدخول</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
