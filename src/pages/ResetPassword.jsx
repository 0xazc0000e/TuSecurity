import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle, CheckCircle, ChevronLeft, Key } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';

import { apiCall } from '../context/AuthContext';

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email] = useState(location.state?.email || '');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await apiCall('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email, code, newPassword })
            });

            setSuccess('تم تغيير كلمة المرور بنجاح! جاري تحويلك لتسجيل الدخول...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'لا يمكن الاتصال بالخادم.');
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#05050f] text-white">
                <div className="text-center">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">خطأ في الوصول</h2>
                    <p className="text-slate-400 mb-4">يجب البدء من صفحة "نسيت كلمة المرور"</p>
                    <button onClick={() => navigate('/forgot-password')} className="text-purple-400 hover:text-purple-300">العودة</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#05050f]">
            <MatrixBackground />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
                <div className="relative bg-[#0a0a14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">إعادة تعيين كلمة المرور</h2>
                        <p className="text-slate-400 text-sm">للحساب: <span className="text-purple-400">{email}</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle size={16} />{error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-sm">
                                    <CheckCircle size={16} />{success}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 block text-right">رمز التحقق</label>
                            <div className="relative">
                                <Key className="absolute right-4 top-3.5 text-slate-500" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pr-12 pl-4 text-white text-right focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono tracking-widest text-center"
                                    placeholder="######"
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 block text-right">كلمة المرور الجديدة</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-3.5 text-slate-500" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pr-12 pl-4 text-white text-right focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'جاري التحديث...' : <><span>تغيير كلمة المرور</span><CheckCircle size={18} /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-1 mx-auto transition-colors">
                            <ChevronLeft size={16} /> إلغاء
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
