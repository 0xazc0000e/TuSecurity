import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, User, FileText, ArrowRight, CheckCircle, AlertCircle, Sparkles, Shield, Zap, Globe, Terminal, Lock, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { useAuth } from '../context/AuthContext';

const SKILL_LEVELS = [
    { value: 'beginner', label: 'مبتدئ', icon: '🌱' },
    { value: 'intermediate', label: 'متوسط', icon: '⚡' },
    { value: 'advanced', label: 'متقدم', icon: '🔥' },
];

const INTERESTS = [
    { value: 'web_pentesting', label: 'اختبار اختراق الويب', icon: <Globe size={16} /> },
    { value: 'forensics', label: 'التحقيق الجنائي الرقمي', icon: <Shield size={16} /> },
    { value: 'network_security', label: 'أمن الشبكات', icon: <Wifi size={16} /> },
    { value: 'malware_analysis', label: 'تحليل البرمجيات الخبيثة', icon: <Terminal size={16} /> },
    { value: 'cryptography', label: 'التشفير', icon: <Lock size={16} /> },
    { value: 'reverse_engineering', label: 'الهندسة العكسية', icon: <Zap size={16} /> },
];

export default function Onboarding() {
    const navigate = useNavigate();
    const { updateProfile, user } = useAuth();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        bio: '',
        skill_level: '',
        interests: [],
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
            return;
        }

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
        setError('');
    };

    const toggleInterest = (value) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(value)
                ? prev.interests.filter(i => i !== value)
                : [...prev.interests, value],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username.trim()) {
            setError('يرجى إدخال اسم المستخدم');
            return;
        }
        if (!formData.skill_level) {
            setError('يرجى اختيار مستوى المهارة');
            return;
        }
        if (formData.interests.length === 0) {
            setError('يرجى اختيار اهتمام واحد على الأقل');
            return;
        }

        setLoading(true);

        try {
            // Build FormData for multipart upload
            const fd = new FormData();
            fd.append('username', formData.username);
            fd.append('bio', formData.bio || '');
            fd.append('skill_level', formData.skill_level);
            fd.append('interests', JSON.stringify(formData.interests));
            fd.append('major', formData.skill_level); // reuse skill_level as major to satisfy needsOnboarding check
            if (avatarFile) {
                fd.append('avatar', avatarFile);
            }

            const result = await updateProfile(fd);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1200);
            } else {
                setError(result.error || 'فشل حفظ البيانات. حاول مرة أخرى.');
            }
        } catch (err) {
            setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 relative overflow-hidden">
            <MatrixBackground />

            {/* Decorative glows */}
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#7112AF] rounded-full blur-[200px] opacity-15 pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[#240993] rounded-full blur-[180px] opacity-10 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="bg-[#0f0f16]/70 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)]">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-20 h-20 bg-gradient-to-br from-[#7112AF] to-[#240993] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#7112AF]/40 shadow-[0_0_30px_rgba(113,18,175,0.3)]"
                        >
                            <Sparkles className="text-white" size={36} />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-2 font-['Tajawal',sans-serif]">أكمل ملفك الشخصي</h2>
                        <p className="text-slate-400 text-sm">
                            مرحباً <span className="text-[#7112AF] font-bold">{user?.username}</span>! أكمل بياناتك للانضمام إلى النخبة
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error / Success Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm"
                                >
                                    <AlertCircle size={16} className="flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-400"
                                >
                                    <CheckCircle size={20} />
                                    <span className="font-bold">تم حفظ البيانات بنجاح! جارٍ التحويل...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Avatar Upload + Username Row */}
                        <div className="flex flex-col sm:flex-row gap-5 items-center">
                            {/* Avatar Upload */}
                            <div className="flex-shrink-0">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    disabled={loading || success}
                                />
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading || success}
                                    className="relative w-28 h-28 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#7112AF] transition-all overflow-hidden group cursor-pointer bg-[#050214]/50"
                                >
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-500 group-hover:text-[#7112AF] transition-colors">
                                            <Camera size={28} />
                                            <span className="text-[10px] mt-1 font-bold">صورة شخصية</span>
                                        </div>
                                    )}
                                    {avatarPreview && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={20} className="text-white" />
                                        </div>
                                    )}
                                </motion.button>
                            </div>

                            {/* Username */}
                            <div className="flex-1 w-full space-y-2">
                                <label className="text-xs font-bold text-slate-300 block text-right">
                                    اسم المستخدم <span className="text-red-400">*</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#7112AF] transition-colors">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-[#050214]/50 border border-white/10 rounded-xl py-3 pr-10 pl-4 text-white text-sm focus:border-[#7112AF] focus:ring-1 focus:ring-[#7112AF] focus:outline-none transition-all text-right"
                                        placeholder="اختر اسم مستخدم مميز"
                                        disabled={loading || success}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 block text-right">
                                <span className="inline-flex items-center gap-1.5">
                                    <FileText size={13} />
                                    نبذة عنك
                                </span>
                            </label>
                            <textarea
                                rows={3}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full bg-[#050214]/50 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-[#7112AF] focus:ring-1 focus:ring-[#7112AF] focus:outline-none transition-all text-right resize-none"
                                placeholder="اكتب نبذة قصيرة عن نفسك... 🔥"
                                disabled={loading || success}
                                maxLength={300}
                            />
                            <p className="text-xs text-slate-600 text-left">{formData.bio.length}/300</p>
                        </div>

                        {/* Skill Level */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-300 block text-right">
                                مستوى المهارة <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {SKILL_LEVELS.map((level) => (
                                    <motion.button
                                        key={level.value}
                                        type="button"
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => setFormData({ ...formData, skill_level: level.value })}
                                        disabled={loading || success}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.skill_level === level.value
                                                ? 'border-[#7112AF] bg-[#7112AF]/20 shadow-[0_0_20px_rgba(113,18,175,0.3)]'
                                                : 'border-white/10 bg-[#050214]/40 hover:border-white/20'
                                            }`}
                                    >
                                        <span className="text-2xl">{level.icon}</span>
                                        <span className="text-xs text-white font-bold">{level.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-300 block text-right">
                                الاهتمامات <span className="text-red-400">*</span>
                                <span className="text-slate-500 font-normal mr-2">(اختر واحد أو أكثر)</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {INTERESTS.map((interest) => {
                                    const selected = formData.interests.includes(interest.value);
                                    return (
                                        <motion.button
                                            key={interest.value}
                                            type="button"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => toggleInterest(interest.value)}
                                            disabled={loading || success}
                                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer text-right ${selected
                                                    ? 'border-[#7112AF] bg-[#7112AF]/15 text-white'
                                                    : 'border-white/10 bg-[#050214]/40 text-slate-400 hover:border-white/20 hover:text-slate-300'
                                                }`}
                                        >
                                            <div className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${selected
                                                    ? 'bg-[#7112AF] border-[#7112AF]'
                                                    : 'border-slate-600'
                                                }`}>
                                                {selected && <CheckCircle size={12} className="text-white" />}
                                            </div>
                                            <span className={`flex-shrink-0 ${selected ? 'text-[#7112AF]' : ''}`}>{interest.icon}</span>
                                            <span className="text-xs font-medium leading-tight">{interest.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="w-full bg-gradient-to-r from-[#7112AF] to-[#520EA4] text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>جاري الحفظ...</span>
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle size={18} />
                                        <span>تم بنجاح!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>انطلق!</span>
                                        <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
