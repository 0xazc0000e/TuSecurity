import React, { useState } from 'react';
import { User, Lock, Mail, Camera, Save, Loader2 } from 'lucide-react';
import { apiCall } from '../../context/AuthContext';
import { getApiImageUrl } from '../../utils/imageUtils';

export const ProfileSettings = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email, // Read only usually
        bio: user.bio || '',
        university_id: user.university_id || '',
        major: user.major || '',
        currentPassword: '',
        newPassword: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(user.avatar);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const data = new FormData();
            data.append('username', formData.username);
            data.append('bio', formData.bio);
            data.append('university_id', formData.university_id);
            data.append('major', formData.major);
            if (avatarFile) data.append('avatar', avatarFile);
            if (formData.newPassword) {
                data.append('password', formData.newPassword);
            }

            const res = await apiCall('/auth/profile', {
                method: 'PUT',
                body: data
            });

            setStatus('✅ تم تحديث الملف الشخصي بنجاح');
            onUpdate(res.user);
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error(error);
            setStatus('❌ فشل التحديث: ' + (error.response?.data?.error || 'حدث خطأ ما'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-[#0f0f16] border border-white/5 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User size={20} className="text-purple-500" /> إعدادات الملف الشخصي
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Avatar */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-purple-500 transition-colors">
                            <img src={preview ? preview : getApiImageUrl(user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                            <Camera size={24} className="text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold">{user.username}</h3>
                        <p className="text-gray-500 text-sm">تغيير صورة الملف الشخصي (Max 5MB)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">اسم المستخدم</label>
                        <input name="username" value={formData.username} onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">البريد الإلكتروني</label>
                        <input value={formData.email} disabled
                            className="w-full bg-black/20 border border-white/5 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">الرقم الجامعي</label>
                        <input name="university_id" value={formData.university_id} onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">التخصص</label>
                        <input name="major" value={formData.major} onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">نبذة عني (Bio)</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>

                <div className="border-t border-white/5 pt-6">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Lock size={16} /> تغيير كلمة المرور</h3>
                    <div className="space-y-4">
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange}
                            placeholder="كلمة المرور الجديدة (اتركها فارغة لعدم التغيير)"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    {status && <span className={`text-sm ${status.includes('❌') ? 'text-red-400' : 'text-green-400'}`}>{status}</span>}
                    <button type="submit" disabled={loading}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        حفظ التغييرات
                    </button>
                </div>
            </form>
        </div>
    );
};
