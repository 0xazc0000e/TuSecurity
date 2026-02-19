import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Lock, Mail, Camera, Save, Loader2, Bell, Shield,
    Moon, Sun, Globe, Smartphone, Trash2, AlertTriangle,
    CheckCircle, XCircle, Eye, EyeOff, LogOut,
    Github, Linkedin, Twitter, Link as LinkIcon
} from 'lucide-react';
import { apiCall } from '../../context/AuthContext';
import { getApiImageUrl } from '../../utils/imageUtils';

export const ProfileSettings = ({ user, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        university_id: user?.university_id || '',
        major: user?.major || '',
        phone: user?.phone || '',
        title: user?.title || '',
        website: (() => { try { return (typeof user?.social_links === 'string' ? JSON.parse(user.social_links) : user?.social_links)?.website || ''; } catch { return ''; } })(),
        github: (() => { try { return (typeof user?.social_links === 'string' ? JSON.parse(user.social_links) : user?.social_links)?.github || ''; } catch { return ''; } })(),
        linkedin: (() => { try { return (typeof user?.social_links === 'string' ? JSON.parse(user.social_links) : user?.social_links)?.linkedin || ''; } catch { return ''; } })(),
        twitter: (() => { try { return (typeof user?.social_links === 'string' ? JSON.parse(user.social_links) : user?.social_links)?.twitter || ''; } catch { return ''; } })(),
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [settings, setSettings] = useState({
        darkMode: true,
        notifications: true,
        emailUpdates: true,
        publicProfile: false,
        twoFactor: false,
        language: 'ar'
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(user?.avatar);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setStatus(`✅ تم ${value ? 'تفعيل' : 'تعطيل'} ${getSettingLabel(key)}`);
        setTimeout(() => setStatus(''), 2000);
    };

    const getSettingLabel = (key) => {
        const labels = {
            darkMode: 'الوضع الليلي',
            notifications: 'الإشعارات',
            emailUpdates: 'تحديثات البريد',
            publicProfile: 'الملف العام',
            twoFactor: 'المصادقة الثنائية',
            language: 'اللغة'
        };
        return labels[key] || key;
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setStatus('❌ حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
                return;
            }
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
            data.append('phone', formData.phone);
            data.append('title', formData.title);
            data.append('social_links', JSON.stringify({
                website: formData.website,
                github: formData.github,
                linkedin: formData.linkedin,
                twitter: formData.twitter
            }));
            if (avatarFile) data.append('avatar', avatarFile);
            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    setStatus('❌ كلمات المرور غير متطابقة');
                    setLoading(false);
                    return;
                }
                if (formData.newPassword.length < 6) {
                    setStatus('❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                    setLoading(false);
                    return;
                }
                data.append('password', formData.newPassword);
            }

            const res = await apiCall('/profile/update', {
                method: 'PUT',
                body: data
            });

            setStatus('✅ تم تحديث الملف الشخصي بنجاح');
            onUpdate(res.user);
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error(error);
            setStatus('❌ فشل التحديث: ' + (error.message || 'حدث خطأ ما'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه!')) return;

        try {
            await apiCall('/profile/delete-account', { method: 'DELETE' });
            window.location.href = '/';
        } catch (error) {
            setStatus('❌ فشل حذف الحساب: ' + error.message);
        }
    };

    const tabs = [
        { id: 'profile', label: 'الملف الشخصي', icon: User },
        { id: 'security', label: 'الأمان', icon: Lock },
        { id: 'notifications', label: 'الإشعارات', icon: Bell },
        { id: 'preferences', label: 'التفضيلات', icon: Globe },
        { id: 'danger', label: 'منطقة الخطر', icon: AlertTriangle },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">الإعدادات</h2>
                <p className="text-gray-400">إدارة إعدادات حسابك وتفضيلاتك</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === tab.id
                            ? tab.id === 'danger'
                                ? 'bg-red-500 text-white'
                                : 'bg-purple-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
                {activeTab === 'profile' && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-purple-500/30 shadow-xl">
                                    <img
                                        src={preview ? preview : getApiImageUrl(user?.avatar)}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                                    <Camera size={24} className="text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{user?.username}</h3>
                                <p className="text-gray-500 text-sm mb-2">انقر على الصورة لتغييرها (Max 5MB)</p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">نشط</span>
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-bold">{user?.role || 'عضو'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 flex items-center gap-2">
                                    <User className="w-4 h-4" /> اسم المستخدم
                                </label>
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> البريد الإلكتروني
                                </label>
                                <input
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-black/10 border border-white/5 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">الرقم الجامعي</label>
                                <input
                                    name="university_id"
                                    value={formData.university_id}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">التخصص</label>
                                <input
                                    name="major"
                                    value={formData.major}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm text-gray-400">رقم الهاتف</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="05xxxxxxxx"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>

                            {/* Title & Social Links */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm text-gray-400">المسمى الوظيفي / اللقب</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="مثال: مطور ويب، باحث أمني..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> الموقع الشخصي
                                </label>
                                <input
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 flex items-center gap-2">
                                    <Github className="w-4 h-4" /> GitHub
                                </label>
                                <input
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 flex items-center gap-2">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </label>
                                <input
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 flex items-center gap-2">
                                    <Twitter className="w-4 h-4" /> Twitter (X)
                                </label>
                                <input
                                    name="twitter"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    placeholder="https://twitter.com/..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">نبذة عني</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                placeholder="اكتب نبذة قصيرة عن نفسك..."
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Status & Submit */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            {status && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`text-sm flex items-center gap-2 ${status.includes('❌') ? 'text-red-400' : 'text-green-400'}`}
                                >
                                    {status.includes('❌') ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                    {status}
                                </motion.span>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mr-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/25"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                حفظ التغييرات
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <div className="pb-6 border-b border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-purple-400" /> تغيير كلمة المرور
                            </h3>
                            <div className="space-y-4 max-w-md">
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="كلمة المرور الجديدة"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="تأكيد كلمة المرور"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData.newPassword || loading}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-all disabled:opacity-50"
                                >
                                    تحديث كلمة المرور
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Shield className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">المصادقة الثنائية</h4>
                                    <p className="text-gray-500 text-sm">إضافة طبقة أمان إضافية</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSettingChange('twoFactor', !settings.twoFactor)}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${settings.twoFactor
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white/10 text-gray-400 hover:text-white'
                                    }`}
                            >
                                {settings.twoFactor ? 'مفعل' : 'تفعيل'}
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Smartphone className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">الجلسات النشطة</h4>
                                    <p className="text-gray-500 text-sm">إدارة الأجهزة المتصلة</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white/10 text-gray-400 hover:text-white rounded-lg font-bold transition-all">
                                عرض
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="space-y-4">
                        {[
                            { key: 'notifications', label: 'الإشعارات العامة', desc: 'تلقي إشعارات عن الأنشطة والتحديثات', icon: Bell },
                            { key: 'emailUpdates', label: 'تحديثات البريد الإلكتروني', desc: 'إرسال نشرة أسبوعية بالمحتوى الجديد', icon: Mail },
                            { key: 'courseUpdates', label: 'تحديثات الدورات', desc: 'إشعارات عند إضافة محتوى جديد للمسارات المسجل فيها', icon: User },
                            { key: 'achievementNotifications', label: 'إشعارات الإنجازات', desc: 'إشعارات عند الحصول على شارات أو نقاط XP', icon: Shield },
                        ].map(item => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <item.icon className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{item.label}</h4>
                                        <p className="text-gray-500 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSettingChange(item.key, !settings[item.key])}
                                    className={`w-12 h-6 rounded-full transition-all relative ${settings[item.key] ? 'bg-purple-500' : 'bg-gray-600'
                                        }`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.key] ? 'right-1' : 'left-1'
                                        }`} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'preferences' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    {settings.darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">الوضع الليلي</h4>
                                    <p className="text-gray-500 text-sm">تفعيل الوضع الداكن للموقع</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                                className={`w-12 h-6 rounded-full transition-all relative ${settings.darkMode ? 'bg-indigo-500' : 'bg-gray-600'
                                    }`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.darkMode ? 'right-1' : 'left-1'
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Globe className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">اللغة</h4>
                                    <p className="text-gray-500 text-sm">لغة واجهة المستخدم</p>
                                </div>
                            </div>
                            <select
                                value={settings.language}
                                onChange={(e) => handleSettingChange('language', e.target.value)}
                                className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                            >
                                <option value="ar">العربية</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <User className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">الملف الشخصي العام</h4>
                                    <p className="text-gray-500 text-sm">السماح للآخرين برؤية ملفك الشخصي</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSettingChange('publicProfile', !settings.publicProfile)}
                                className={`w-12 h-6 rounded-full transition-all relative ${settings.publicProfile ? 'bg-green-500' : 'bg-gray-600'
                                    }`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.publicProfile ? 'right-1' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'danger' && (
                    <div className="space-y-6">
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <LogOut className="w-5 h-5 text-red-400" />
                                <div>
                                    <h4 className="text-white font-bold">تسجيل الخروج من جميع الأجهزة</h4>
                                    <p className="text-gray-500 text-sm">سيتم تسجيل خروجك من جميع الجلسات النشطة</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    window.location.href = '/login';
                                }}
                                className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-all"
                            >
                                تسجيل الخروج من الجميع
                            </button>
                        </div>

                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Trash2 className="w-5 h-5 text-red-400" />
                                <div>
                                    <h4 className="text-white font-bold">حذف الحساب</h4>
                                    <p className="text-gray-500 text-sm">حذف حسابك نهائياً - لا يمكن التراجع عن هذا الإجراء</p>
                                </div>
                            </div>
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-all"
                                >
                                    حذف الحساب
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-red-400 text-sm">اكتب "DELETE" للتأكيد:</p>
                                    <input
                                        type="text"
                                        placeholder="DELETE"
                                        className="w-full bg-black/20 border border-red-500/30 rounded-lg px-4 py-2 text-white"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold"
                                        >
                                            تأكيد الحذف
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-4 py-2 bg-white/10 text-gray-400 hover:text-white rounded-lg font-bold"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
