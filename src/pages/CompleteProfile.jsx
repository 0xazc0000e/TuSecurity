import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ChevronLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '../components/ui/MatrixBackground';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const INTERESTS_LIST = [
    "اختبار الاختراق", "محلل مركز العمليات الأمنية (SOC)", "تحليل البرمجيات الخبيثة",
    "التشفير", "أمن الشبكات", "أمن السحابة",
    "التحقيق الجنائي الرقمي", "أمن تطبيقات الويب"
];

export default function CompleteProfile() {
    const navigate = useNavigate();
    const [bio, setBio] = useState('');
    const [interests, setInterests] = useState([]);
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const toggleInterest = (interest) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter(i => i !== interest));
        } else {
            setInterests([...interests, interest]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('interests', JSON.stringify(interests));
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();

            if (data.success || res.ok) {
                // Determine redirect or default to dashboard
                const redirect = data.redirectTo || '/profile';
                // Force reload to update user state in AuthContext
                window.location.href = (redirect === '/dashboard' ? '/profile' : redirect);
            } else {
                alert('فشل التحديث');
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-[#05050f]" dir="rtl">
            <MatrixBackground />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl relative z-10">
                <div className="bg-[#0a0a14]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-3xl font-bold text-white mb-2">أكمل ملفك الشخصي</h2>
                    <p className="text-slate-400 mb-8">أخبرنا المزيد عن نفسك لتخصيص تجربتك.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Avatar Uploader */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden hover:border-purple-500 transition-colors cursor-pointer group">
                                <input type="file" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                                {preview ? (
                                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center group-hover:text-purple-400 transition-colors">
                                        <Upload className="mx-auto mb-2 text-slate-500 group-hover:text-purple-400" size={24} />
                                        <span className="text-xs text-slate-400">رفع صورة</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">نبذة عنك</label>
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-[120px]"
                                placeholder="أنا مهتم بالأمن السيبراني وأرغب في تعلم..."
                            />
                        </div>

                        {/* Interests */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-300">الاهتمامات</label>
                            <div className="flex flex-wrap gap-2">
                                {INTERESTS_LIST.map(interest => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${interests.includes(interest)
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-l from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'جاري الحفظ...' : (
                                <><span>إكمال الإعداد</span> <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
