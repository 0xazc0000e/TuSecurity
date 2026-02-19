import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Lock, User, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff,
    Mail, UserCircle, Terminal, Wifi, Globe, Key, Sparkles,
    ShieldCheck, ArrowLeft, Check, RefreshCw,
    Send, MailCheck, AtSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, MicrosoftIcon } from '../components/ui/SocialIcons';

// API URL
const API_BASE_URL = 'http://localhost:5000/api';

// Password strength meter with detailed feedback
function PasswordStrength({ password }) {
    const requirements = [
        { label: '8+ characters', met: password.length >= 8, icon: '01' },
        { label: 'Uppercase letter', met: /[A-Z]/.test(password), icon: 'Aa' },
        { label: 'Lowercase letter', met: /[a-z]/.test(password), icon: 'aa' },
        { label: 'One number', met: /\d/.test(password), icon: '1+' },
        { label: 'Special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password), icon: '#!' }
    ];

    const metCount = requirements.filter(r => r.met).length;
    const strength = metCount === 5 ? { label: 'Strong', color: 'from-emerald-500 to-teal-500', score: 100 } :
        metCount >= 3 ? { label: 'Medium', color: 'from-yellow-500 to-orange-500', score: 60 } :
            metCount >= 1 ? { label: 'Weak', color: 'from-red-500 to-pink-500', score: 30 } :
                { label: 'Too short', color: 'from-slate-600 to-slate-500', score: 0 };

    return (
        <div className="space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Password Strength</span>
                <span className={`text-xs font-bold bg-gradient-to-r ${strength.color} bg-clip-text text-transparent`}>
                    {strength.label}
                </span>
            </div>
            <div className="flex gap-1 h-2">
                {[1, 2, 3, 4, 5].map(i => (
                    <motion.div
                        key={i}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex-1 rounded-full origin-left ${i <= metCount ? `bg-gradient-to-r ${strength.color}` : 'bg-slate-700'}`}
                    />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
                {requirements.map((req, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex items-center gap-2 text-xs ${req.met ? 'text-emerald-400' : 'text-slate-500'}`}
                    >
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold transition-colors ${req.met ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                            }`}>
                            {req.met ? <Check size={12} /> : req.icon}
                        </div>
                        <span>{req.label}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}



export default function Register() {
    const navigate = useNavigate();
    const { register, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Email verification state
    const [showVerification, setShowVerification] = useState(false);
    const [pendingUserId, setPendingUserId] = useState(null);
    const [pendingEmail, setPendingEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);
    const [verifying, setVerifying] = useState(false);
    const inputRefs = useRef([]);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Handle resend timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(t => t - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const validateForm = () => {
        setError('');

        if (!formData.username.trim() || formData.username.length < 3) {
            setError('يرجى إدخال اسم المستخدم (3 أحرف على الأقل)');
            return false;
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(formData.username)) {
            setError('اسم المستخدم يجب أن يحتوي على حروف إنجليزية وأرقام وشرطة سفلية فقط');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('كلمتا المرور غير متطابقتين');
            return false;
        }
        if (!agreedToTerms) {
            setError('يجب الموافقة على شروط الخدمة وسياسة الخصوصية');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.username, // Use username as placeholder
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: 'student'
                })
            });

            const result = await response.json();

            if (response.ok && result.requiresVerification) {
                setPendingUserId(result.userId);
                setPendingEmail(result.email);
                setShowVerification(true);
                setResendTimer(60); // 60 seconds before resend is allowed
                setResendTimer(60); // 60 seconds before resend is allowed
                setSuccess('تم إنشاء الحساب! يرجى إدخال رمز التحقق المرسل إلى بريدك الإلكتروني');

                // DEBUG: Show code validation for testing (since email service might not be configured)
                if (result.verificationCode) {
                    alert(`رمز التحقق الخاص بك هو: ${result.verificationCode}`);
                    // Also console log it
                    console.log('Verification Code:', result.verificationCode);
                }
            } else {
                setError(result.error || 'حدث خطأ أثناء التسجيل');
            }
        } catch (err) {
            setError('لا يمكن الاتصال بالخادم. تأكد من تشغيل السيرفر.');
        }

        setLoading(false);
    };

    // Handle verification code input
    const handleCodeChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // Only allow single digit

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits filled
        if (index === 5 && value) {
            const fullCode = [...newCode.slice(0, 5), value].join('');
            if (fullCode.length === 6) {
                handleVerifyEmail(fullCode);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyEmail = async (code = null) => {
        const fullCode = code || verificationCode.join('');
        if (fullCode.length !== 6) {
            setError('يرجى إدخال الرمز الكامل (6 أرقام)');
            return;
        }

        setVerifying(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: pendingUserId,
                    code: fullCode
                })
            });

            const result = await response.json();

            if (response.ok && result.verified) {
                // Save token and redirect to profile setup
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                setSuccess('تم تأكيد البريد الإلكتروني بنجاح! جارٍ التحويل...');
                setTimeout(() => navigate('/onboarding'), 1500);
            } else {
                if (result.expired) {
                    setError('انتهت صلاحية الرمز. اضغط على "إعادة الإرسال" للحصول على رمز جديد');
                } else {
                    setError(result.error || 'رمز التحقق غير صحيح');
                }
                setVerificationCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            setError('حدث خطأ أثناء التحقق. حاول مرة أخرى.');
        }

        setVerifying(false);
    };

    const handleResendCode = async () => {
        if (resendTimer > 0) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: pendingUserId,
                    email: pendingEmail
                })
            });

            const result = await response.json();

            if (response.ok && result.sent) {
                setSuccess('تم إرسال رمز تحقق جديد!');
                setResendTimer(60);
                setVerificationCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();

                // DEBUG: Show code validation
                if (result.verificationCode) {
                    alert(`رمز التحقق الجديد هو: ${result.verificationCode}`);
                }
            } else {
                setError(result.error || 'فشل إعادة إرسال الرمز');
            }
        } catch (err) {
            setError('حدث خطأ أثناء إعادة الإرسال');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#05050f]">
            <MatrixBackground />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-lg relative z-10">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl blur opacity-25" />
                    <div className="relative bg-[#0a0a14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                        {showVerification ? (
                            // Email Verification UI
                            <>
                                <div className="text-center mb-8">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="relative w-20 h-20 mx-auto mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl blur opacity-50" />
                                        <div className="relative w-full h-full bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center border border-white/20">
                                            <MailCheck className="text-white" size={36} />
                                        </div>
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-white mb-2">تأكيد البريد الإلكتروني</h2>
                                    <p className="text-slate-400 text-sm">تم إرسال رمز التحقق إلى</p>
                                    <p className="text-purple-400 font-semibold text-sm mt-1" dir="ltr">{pendingEmail}</p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                                            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-red-400 text-sm">{error}</span>
                                        </motion.div>
                                    )}
                                    {success && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                                            <CheckCircle size={16} className="text-emerald-400" />
                                            <span className="text-emerald-400 text-sm font-medium">{success}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Code Input */}
                                <div className="mb-6">
                                    <label className="text-sm font-semibold text-slate-300 block text-center mb-4">
                                        أدخل رمز التحقق (6 أرقام)
                                    </label>
                                    <div className="flex gap-2 justify-center" dir="ltr">
                                        {verificationCode.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={el => inputRefs.current[index] = el}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                disabled={verifying}
                                                className="w-12 h-14 bg-slate-900/50 border border-slate-700 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Verify Button */}
                                <motion.button
                                    onClick={() => handleVerifyEmail()}
                                    disabled={verifying || verificationCode.join('').length !== 6}
                                    whileHover={{ scale: verifying ? 1 : 1.02 }}
                                    whileTap={{ scale: verifying ? 1 : 0.98 }}
                                    className="w-full relative group disabled:opacity-50 mb-4"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition" />
                                    <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                                        {verifying ? (
                                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>جاري التحقق...</span></>
                                        ) : (
                                            <><ShieldCheck size={18} /><span>تأكيد البريد الإلكتروني</span></>
                                        )}
                                    </div>
                                </motion.button>

                                {/* Resend */}
                                <div className="text-center space-y-3">
                                    <p className="text-slate-400 text-sm">لم تستلم الرمز؟</p>
                                    <button
                                        onClick={handleResendCode}
                                        disabled={resendTimer > 0 || loading}
                                        className="flex items-center justify-center gap-2 mx-auto text-purple-400 hover:text-purple-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                        <span className="text-sm">
                                            {resendTimer > 0 ? `إعادة الإرسال بعد ${resendTimer} ثانية` : 'إعادة إرسال الرمز'}
                                        </span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Registration Form
                            <>
                                <div className="text-center mb-6">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="relative w-20 h-20 mx-auto mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl blur opacity-50" />
                                        <div className="relative w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center border border-white/20">
                                            <Sparkles className="text-white" size={36} />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#0a0a14] flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        </div>
                                    </motion.div>
                                    <h2 className="text-3xl font-bold text-white mb-2">انضم إلى النادي</h2>
                                    <p className="text-slate-400 text-sm">ابدأ رحلتك في عالم الأمن السيبراني</p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                                            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-red-400 text-sm">{error}</span>
                                        </motion.div>
                                    )}
                                    {success && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                                            <CheckCircle size={16} className="text-emerald-400" />
                                            <span className="text-emerald-400 text-sm font-medium">{success}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                                    {/* Social Login */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <a href={`${API_BASE_URL}/auth/google`} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 transition-all group">
                                            <GoogleIcon size={20} />
                                            <span className="text-sm font-medium text-white group-hover:text-white/90">Google</span>
                                        </a>
                                        <a href={`${API_BASE_URL}/auth/microsoft`} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 transition-all group">
                                            <MicrosoftIcon size={20} />
                                            <span className="text-sm font-medium text-white group-hover:text-white/90">Microsoft</span>
                                        </a>
                                    </div>

                                    <div className="relative flex items-center gap-4 py-2">
                                        <div className="h-px bg-white/10 flex-1" />
                                        <span className="text-xs text-slate-500 font-medium">أو التسجيل عبر البريد</span>
                                        <div className="h-px bg-white/10 flex-1" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300 block text-right flex items-center justify-end gap-2">
                                            <AtSign size={14} className="text-purple-400" />اسم المستخدم
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <Terminal size={20} className="text-slate-500" />
                                            </div>
                                            <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-right"
                                                placeholder="mohammed_ali" />
                                        </div>
                                        <p className="text-xs text-slate-500 text-right">حروف إنجليزية وأرقام وشرطة سفلية فقط</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300 block text-right flex items-center justify-end gap-2">
                                            <Mail size={14} className="text-purple-400" />البريد الإلكتروني
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <Mail size={20} className="text-slate-500" />
                                            </div>
                                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-right"
                                                placeholder="your@email.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300 block text-right flex items-center justify-end gap-2">
                                            <Lock size={14} className="text-purple-400" />كلمة المرور
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <Lock size={20} className="text-slate-500" />
                                            </div>
                                            <input type={showPassword ? 'text' : 'password'} value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pr-12 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-right"
                                                placeholder="••••••••" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 hover:text-white">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <PasswordStrength password={formData.password} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300 block text-right flex items-center justify-end gap-2">
                                            <ShieldCheck size={14} className="text-purple-400" />تأكيد كلمة المرور
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <Lock size={20} className="text-slate-500" />
                                            </div>
                                            <input type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword}
                                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pr-12 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-right"
                                                placeholder="••••••••" />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 hover:text-white">
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-emerald-400 text-sm">
                                                <CheckCircle size={14} /><span>كلمتا المرور متطابقتان</span>
                                            </motion.div>
                                        )}
                                    </div>

                                    <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-purple-500/30 transition-colors">
                                        <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="sr-only" />
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreedToTerms ? 'bg-purple-600 border-purple-600' : 'bg-slate-800 border-slate-600 group-hover:border-slate-500'
                                            }`}>
                                            {agreedToTerms && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className="text-sm text-slate-400">أوافق على <button type="button" className="text-purple-400 hover:text-purple-300 underline">شروط الخدمة</button> و <button type="button" className="text-purple-400 hover:text-purple-300 underline">سياسة الخصوصية</button></span>
                                    </label>

                                    <motion.button onClick={handleSubmit} disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                                        className="w-full relative group disabled:opacity-50">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition" />
                                        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                                            {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>جاري إنشاء الحساب...</span></> : <><Shield size={18} /><span>إنشاء الحساب الآمن</span></>}
                                        </div>
                                    </motion.button>
                                </motion.div>

                                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                    <p className="text-slate-400 text-sm mb-4">
                                        لديك حساب بالفعل؟ <button onClick={() => navigate('/login')} className="text-purple-400 font-semibold hover:text-purple-300 inline-flex items-center gap-1">تسجيل الدخول<ArrowLeft size={14} /></button>
                                    </p>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><Wifi size={12} className="text-emerald-400" /><span>TLS 1.3</span></div>
                                        <div className="w-px h-3 bg-slate-700" />
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><Globe size={12} className="text-blue-400" /><span>256-bit</span></div>
                                        <div className="w-px h-3 bg-slate-700" />
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><Terminal size={12} className="text-purple-400" /><span>Secure</span></div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
