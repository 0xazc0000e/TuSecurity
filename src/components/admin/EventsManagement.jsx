import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, MapPin, Users, Trophy, Target,
    Plus, Edit, Trash2, Save, X, ChevronDown, ChevronUp,
    Star, Bell, BarChart2, FileText, Mic, Terminal, Code,
    Rocket, Info, AlertCircle, CheckCircle, Eye, Lock, Unlock,
    User, Mail, Phone, Hash, Award, MessageSquare, Send
} from 'lucide-react';
import { eventsAPI, distinguishedAPI } from '../../services/api';

const Btn = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const base = 'inline-flex items-center gap-2 font-bold rounded-lg transition-all disabled:opacity-40';
    const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' };
    const variants = {
        primary: 'bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white hover:shadow-[0_0_20px_rgba(113,18,175,.4)]',
        ghost: 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10',
        danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30',
        success: 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
    };
    return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Input = ({ label, ...props }) => (
    <div>
        {label && <label className="block text-xs text-gray-400 mb-1">{label}</label>}
        <input className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#7112AF] focus:outline-none" {...props} />
    </div>
);

const TextArea = ({ label, ...props }) => (
    <div>
        {label && <label className="block text-xs text-gray-400 mb-1">{label}</label>}
        <textarea className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#7112AF] focus:outline-none resize-none" rows={3} {...props} />
    </div>
);

const Select = ({ label, options, ...props }) => (
    <div>
        {label && <label className="block text-xs text-gray-400 mb-1">{label}</label>}
        <select className="w-full px-3 py-2 bg-[#0a0a14] border border-white/10 rounded-lg text-white text-sm focus:border-[#7112AF] focus:outline-none" {...props}>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

// ═══════════════════════════════════════════
// Tag Input: comma-separated dynamic list
// ═══════════════════════════════════════════
const TagInput = ({ label, value = [], onChange }) => {
    const [input, setInput] = useState('');
    const add = () => {
        const v = input.trim();
        if (v && !value.includes(v)) { onChange([...value, v]); setInput(''); }
    };
    return (
        <div>
            {label && <label className="block text-xs text-gray-400 mb-1">{label}</label>}
            <div className="flex flex-wrap gap-1 mb-1">
                {value.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#7112AF]/20 text-[#7112AF] rounded text-xs flex items-center gap-1">
                        {t}
                        <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="hover:text-red-400">×</button>
                    </span>
                ))}
            </div>
            <div className="flex gap-1">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
                    className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:border-[#7112AF] focus:outline-none"
                    placeholder="اكتب ثم Enter" />
                <Btn variant="ghost" size="sm" onClick={add}><Plus size={12} /></Btn>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════
// Agenda Editor (time + activity pairs)
// ═══════════════════════════════════════════
const AgendaEditor = ({ value = [], onChange }) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1">جدول الفعالية</label>
        {value.map((item, i) => (
            <div key={i} className="flex gap-2 mb-1">
                <input value={item.time || ''} onChange={e => { const a = [...value]; a[i] = { ...a[i], time: e.target.value }; onChange(a); }}
                    className="w-24 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs" placeholder="09:00" />
                <input value={item.activity || ''} onChange={e => { const a = [...value]; a[i] = { ...a[i], activity: e.target.value }; onChange(a); }}
                    className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs" placeholder="النشاط" />
                <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><X size={14} /></button>
            </div>
        ))}
        <Btn variant="ghost" size="sm" onClick={() => onChange([...value, { time: '', activity: '' }])}><Plus size={12} /> إضافة بند</Btn>
    </div>
);

// ═══════════════════════════════════════════
// Survey Options Editor (label + votes pairs)
// ═══════════════════════════════════════════
const OptionsEditor = ({ value = [], onChange }) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1">خيارات التصويت</label>
        {value.map((item, i) => (
            <div key={i} className="flex gap-2 mb-1">
                <input value={item.label || ''} onChange={e => { const a = [...value]; a[i] = { ...a[i], label: e.target.value }; onChange(a); }}
                    className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs" placeholder="الخيار" />
                <input type="number" value={item.votes || 0} onChange={e => { const a = [...value]; a[i] = { ...a[i], votes: Number(e.target.value) }; onChange(a); }}
                    className="w-20 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs" placeholder="الأصوات" />
                <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><X size={14} /></button>
            </div>
        ))}
        <Btn variant="ghost" size="sm" onClick={() => onChange([...value, { label: '', votes: 0 }])}><Plus size={12} /> إضافة خيار</Btn>
    </div>
);

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
export default function EventsManagement() {
    const [activeTab, setActiveTab] = useState('events');
    const [events, setEvents] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewingRegistrations, setViewingRegistrations] = useState(null); // event id
    const [registrations, setRegistrations] = useState([]);
    const [regsLoading, setRegsLoading] = useState(false);

    // Distinguished members state
    const [dMembers, setDMembers] = useState([]);
    const [dMemberForm, setDMemberForm] = useState({ name: '', committee: '', month: new Date().toISOString().slice(0, 7), reason: '', color: '#f59e0b' });
    const [dMemberMessages, setDMemberMessages] = useState({});
    const [viewingMessages, setViewingMessages] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const [ev, sv, an] = await Promise.all([
                eventsAPI.getEvents().catch(() => []),
                eventsAPI.getSurveys().catch(() => []),
                eventsAPI.getAnnouncements().catch(() => [])
            ]);
            setEvents(Array.isArray(ev) ? ev : []);
            setSurveys(Array.isArray(sv) ? sv : []);
            setAnnouncements(Array.isArray(an) ? an : []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadDistinguished = async () => {
        try {
            const data = await distinguishedAPI.getMembers();
            setDMembers(Array.isArray(data) ? data : []);
        } catch { setDMembers([]); }
    };

    useEffect(() => { load(); loadDistinguished(); }, []);

    const flash = (msg) => { setStatus(msg); setTimeout(() => setStatus(''), 3000); };

    // ─── Save Handler ───
    const handleSave = async () => {
        if (!editItem) return;
        try {
            const { _type, id, _isNew, created_at, ...payload } = editItem;
            if (_type === 'event') {
                if (_isNew) await eventsAPI.createEvent(payload);
                else await eventsAPI.updateEvent(id, payload);
            } else if (_type === 'survey') {
                if (_isNew) await eventsAPI.createSurvey(payload);
                else await eventsAPI.updateSurvey(id, payload);
            } else if (_type === 'announcement') {
                if (_isNew) await eventsAPI.createAnnouncement(payload);
                else await eventsAPI.updateAnnouncement(id, payload);
            }
            flash('✅ تم الحفظ بنجاح');
            setEditItem(null);
            load();
        } catch (e) {
            flash('❌ فشل الحفظ: ' + (e.message || ''));
        }
    };

    // ─── Delete Handler ───
    const handleDelete = async (type, id) => {
        if (!confirm('هل تريد حذف هذا العنصر؟')) return;
        try {
            if (type === 'event') await eventsAPI.deleteEvent(id);
            else if (type === 'survey') await eventsAPI.deleteSurvey(id);
            else await eventsAPI.deleteAnnouncement(id);
            flash('🗑️ تم الحذف');
            load();
        } catch (e) { flash('❌ فشل الحذف'); }
    };

    // ─── Toggle Event Status ───
    const toggleEventStatus = async (event) => {
        const newStatus = event.status === 'closed' ? 'open' : 'closed';
        try {
            await eventsAPI.updateEvent(event.id, { ...event, status: newStatus });
            flash(newStatus === 'closed' ? '🔒 تم إغلاق الفعالية' : '🔓 تم فتح الفعالية');
            load();
        } catch (e) { flash('❌ فشل تحديث الحالة'); }
    };

    // ─── View Registrations ───
    const viewRegistrations = async (eventId) => {
        if (viewingRegistrations === eventId) {
            setViewingRegistrations(null);
            return;
        }
        setRegsLoading(true);
        try {
            const data = await eventsAPI.getEventRegistrations(eventId);
            setRegistrations(Array.isArray(data) ? data : []);
        } catch (e) { setRegistrations([]); }
        setRegsLoading(false);
        setViewingRegistrations(eventId);
    };

    // ─── New item templates ───
    const newEvent = () => setEditItem({
        _type: 'event', _isNew: true,
        title: '', type: 'workshop', category: 'training',
        date: new Date().toISOString().split('T')[0], time: '17:00 - 20:00',
        location: '', description: '', max_participants: 50,
        xp_reward: 100, badges: [], organizer: '', requirements: [],
        agenda: [], instructor: '', speaker: '', prerequisites: [],
        materials: [], difficulty: '', categories: [], prizes: [],
        topics: [], activities: [], status: 'open', link: '', image: ''
    });

    const newSurvey = () => setEditItem({
        _type: 'survey', _isNew: true,
        title: '', description: '',
        end_date: new Date().toISOString().split('T')[0],
        questions: 0, xp_reward: 10, options: [], status: 'active'
    });

    const newAnnouncement = () => setEditItem({
        _type: 'announcement', _isNew: true,
        title: '', content: '',
        date: new Date().toISOString().split('T')[0],
        priority: 'normal', type: 'info', link: ''
    });

    const openEdit = (type, item) => setEditItem({ ...item, _type: type });

    const TABS = [
        { id: 'events', label: 'الفعاليات', icon: Calendar, count: events.length },
        { id: 'surveys', label: 'الاستبيانات', icon: BarChart2, count: surveys.length },
        { id: 'announcements', label: 'الإعلانات', icon: Bell, count: announcements.length },
        { id: 'distinguished', label: 'المتميزين', icon: Award, count: dMembers.length }
    ];

    const categoryLabels = {
        hackathon: 'هاكاثون', training: 'ورشة عمل', ctf: 'مسابقة CTF',
        seminar: 'محاضرة', meetup: 'لقاء اجتماعي'
    };
    const typeColors = {
        competition: 'text-red-400', workshop: 'text-blue-400',
        lecture: 'text-yellow-400', social: 'text-green-400'
    };

    return (
        <div className="space-y-4" dir="rtl">
            {/* Status */}
            <AnimatePresence>
                {status && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-center">
                        {status}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setEditItem(null); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-bold text-sm transition-colors ${activeTab === tab.id ? 'bg-[#7112AF]/20 text-[#7112AF] border-b-2 border-[#7112AF]' : 'text-gray-400 hover:text-white'}`}>
                            <Icon size={16} />
                            {tab.label}
                            <span className="px-1.5 py-0.5 bg-white/10 rounded text-xs">{tab.count}</span>
                        </button>
                    );
                })}
                <div className="flex-1" />
                <Btn size="sm" onClick={() => {
                    if (activeTab === 'events') newEvent();
                    else if (activeTab === 'surveys') newSurvey();
                    else newAnnouncement();
                }}>
                    <Plus size={14} /> إضافة جديد
                </Btn>
            </div>

            {/* ═══ Editor Panel ═══ */}
            <AnimatePresence>
                {editItem && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="bg-[#0a0a14] border border-[#7112AF]/30 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-[#7112AF]/10 border-b border-[#7112AF]/20">
                            <span className="text-sm font-bold text-white">
                                {editItem._isNew ? '➕ إنشاء' : '✏️ تعديل'} {editItem._type === 'event' ? 'فعالية' : editItem._type === 'survey' ? 'استبيان' : 'إعلان'}
                            </span>
                            <div className="flex gap-2">
                                <Btn variant="ghost" size="sm" onClick={() => setEditItem(null)}><X size={14} /> إلغاء</Btn>
                                <Btn size="sm" onClick={handleSave}><Save size={14} /> حفظ</Btn>
                            </div>
                        </div>

                        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* ─── Event Editor ─── */}
                            {editItem._type === 'event' && (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="عنوان الفعالية" value={editItem.title || ''} onChange={e => setEditItem(p => ({ ...p, title: e.target.value }))} />
                                        <Select label="النوع" value={editItem.type || 'workshop'}
                                            onChange={e => setEditItem(p => ({ ...p, type: e.target.value }))}
                                            options={[
                                                { value: 'competition', label: 'مسابقة' },
                                                { value: 'workshop', label: 'ورشة عمل' },
                                                { value: 'lecture', label: 'محاضرة' },
                                                { value: 'social', label: 'اجتماعي' }
                                            ]} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <Select label="التصنيف" value={editItem.category || 'training'}
                                            onChange={e => setEditItem(p => ({ ...p, category: e.target.value }))}
                                            options={[
                                                { value: 'hackathon', label: 'هاكاثون' },
                                                { value: 'training', label: 'تدريب' },
                                                { value: 'ctf', label: 'CTF' },
                                                { value: 'seminar', label: 'ندوة' },
                                                { value: 'meetup', label: 'لقاء' }
                                            ]} />
                                        <Select label="الحالة" value={editItem.status || 'open'}
                                            onChange={e => setEditItem(p => ({ ...p, status: e.target.value }))}
                                            options={[
                                                { value: 'open', label: 'مفتوح' },
                                                { value: 'almost_full', label: 'أماكن محدودة' },
                                                { value: 'closed', label: 'مغلق' }
                                            ]} />
                                        <Input label="المستوى" value={editItem.difficulty || ''} onChange={e => setEditItem(p => ({ ...p, difficulty: e.target.value }))} placeholder="مبتدئ / متوسط / متقدم" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <Input label="التاريخ" type="date" value={editItem.date || ''} onChange={e => setEditItem(p => ({ ...p, date: e.target.value }))} />
                                        <Input label="الوقت" value={editItem.time || ''} onChange={e => setEditItem(p => ({ ...p, time: e.target.value }))} placeholder="09:00 - 18:00" />
                                        <Input label="المكان" value={editItem.location || ''} onChange={e => setEditItem(p => ({ ...p, location: e.target.value }))} />
                                    </div>
                                    <TextArea label="الوصف" value={editItem.description || ''} onChange={e => setEditItem(p => ({ ...p, description: e.target.value }))} />
                                    <div className="grid grid-cols-3 gap-3">
                                        <Input label="الحد الأقصى" type="number" value={editItem.max_participants || 50} onChange={e => setEditItem(p => ({ ...p, max_participants: Number(e.target.value) }))} />
                                        <Input label="نقاط XP" type="number" value={editItem.xp_reward || 100} onChange={e => setEditItem(p => ({ ...p, xp_reward: Number(e.target.value) }))} />
                                        <Input label="المنظم" value={editItem.organizer || ''} onChange={e => setEditItem(p => ({ ...p, organizer: e.target.value }))} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="المدرب / المحاضر" value={editItem.instructor || editItem.speaker || ''} onChange={e => setEditItem(p => ({ ...p, instructor: e.target.value, speaker: e.target.value }))} />
                                        <TagInput label="الشارات" value={editItem.badges || []} onChange={v => setEditItem(p => ({ ...p, badges: v }))} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <TagInput label="المتطلبات" value={editItem.requirements || []} onChange={v => setEditItem(p => ({ ...p, requirements: v }))} />
                                        <TagInput label="المتطلبات المسبقة" value={editItem.prerequisites || []} onChange={v => setEditItem(p => ({ ...p, prerequisites: v }))} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <TagInput label="المواد والأدوات" value={editItem.materials || []} onChange={v => setEditItem(p => ({ ...p, materials: v }))} />
                                        <TagInput label="الجوائز" value={editItem.prizes || []} onChange={v => setEditItem(p => ({ ...p, prizes: v }))} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <TagInput label="التصنيفات" value={editItem.categories || []} onChange={v => setEditItem(p => ({ ...p, categories: v }))} />
                                        <TagInput label="المواضيع" value={editItem.topics || []} onChange={v => setEditItem(p => ({ ...p, topics: v }))} />
                                    </div>
                                    <TagInput label="الأنشطة" value={editItem.activities || []} onChange={v => setEditItem(p => ({ ...p, activities: v }))} />
                                    <AgendaEditor value={editItem.agenda || []} onChange={v => setEditItem(p => ({ ...p, agenda: v }))} />
                                    <Input label="رابط الفعالية (اختياري)" value={editItem.link || ''} onChange={e => setEditItem(p => ({ ...p, link: e.target.value }))} placeholder="https://..." />

                                    {/* Image Upload with Crop */}
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">صورة الفعالية</label>
                                        {editItem.image ? (
                                            <div className="relative rounded-xl overflow-hidden mb-2">
                                                <img src={editItem.image} alt="" className="w-full h-40 object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <button onClick={() => setEditItem(p => ({ ...p, image: '' }))}
                                                    className="absolute top-2 left-2 p-1.5 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors">
                                                    <X size={14} className="text-white" />
                                                </button>
                                            </div>
                                        ) : null}
                                        <div className="flex gap-2">
                                            <label className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl cursor-pointer text-sm text-gray-400 transition-all">
                                                <Plus size={16} />
                                                {editItem.image ? 'تغيير الصورة' : 'رفع صورة'}
                                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;
                                                    // Create canvas for crop (16:9 ratio, 800x450)
                                                    const img = new Image();
                                                    img.onload = async () => {
                                                        const canvas = document.createElement('canvas');
                                                        const W = 800, H = 450;
                                                        canvas.width = W; canvas.height = H;
                                                        const ctx = canvas.getContext('2d');
                                                        // Cover crop: fill the 16:9 frame
                                                        const scale = Math.max(W / img.width, H / img.height);
                                                        const sw = W / scale, sh = H / scale;
                                                        const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
                                                        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
                                                        // Apply dark/cyber filter overlay
                                                        ctx.fillStyle = 'rgba(10, 10, 26, 0.25)';
                                                        ctx.fillRect(0, 0, W, H);
                                                        // Upload
                                                        canvas.toBlob(async (blob) => {
                                                            const fd = new FormData();
                                                            fd.append('image', blob, 'event-cover.jpg');
                                                            try {
                                                                const uploadUrl = (import.meta.env.VITE_API_URL || 'https://tusecurity.onrender.com/api') + '/upload';
                                                                const token = localStorage.getItem('token');
                                                                const resp = await fetch(uploadUrl, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
                                                                const data = await resp.json();
                                                                if (data.url) setEditItem(p => ({ ...p, image: data.url }));
                                                            } catch { alert('فشل رفع الصورة'); }
                                                        }, 'image/jpeg', 0.85);
                                                    };
                                                    img.src = URL.createObjectURL(file);
                                                    e.target.value = '';
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ─── Survey Editor ─── */}
                            {editItem._type === 'survey' && (
                                <>
                                    <Input label="عنوان الاستبيان" value={editItem.title || ''} onChange={e => setEditItem(p => ({ ...p, title: e.target.value }))} />
                                    <TextArea label="الوصف" value={editItem.description || ''} onChange={e => setEditItem(p => ({ ...p, description: e.target.value }))} />
                                    <div className="grid grid-cols-3 gap-3">
                                        <Input label="تاريخ الانتهاء" type="date" value={editItem.end_date || ''} onChange={e => setEditItem(p => ({ ...p, end_date: e.target.value }))} />
                                        <Input label="عدد الأسئلة" type="number" value={editItem.questions || 0} onChange={e => setEditItem(p => ({ ...p, questions: Number(e.target.value) }))} />
                                        <Input label="نقاط XP" type="number" value={editItem.xp_reward || 10} onChange={e => setEditItem(p => ({ ...p, xp_reward: Number(e.target.value) }))} />
                                    </div>
                                    <Select label="الحالة" value={editItem.status || 'active'}
                                        onChange={e => setEditItem(p => ({ ...p, status: e.target.value }))}
                                        options={[
                                            { value: 'active', label: 'نشط' },
                                            { value: 'closed', label: 'مغلق' },
                                            { value: 'draft', label: 'مسودة' }
                                        ]} />
                                    <OptionsEditor value={editItem.options || []} onChange={v => setEditItem(p => ({ ...p, options: v }))} />
                                </>
                            )}

                            {/* ─── Announcement Editor ─── */}
                            {editItem._type === 'announcement' && (
                                <>
                                    <Input label="العنوان" value={editItem.title || ''} onChange={e => setEditItem(p => ({ ...p, title: e.target.value }))} />
                                    <TextArea label="المحتوى" value={editItem.content || ''} onChange={e => setEditItem(p => ({ ...p, content: e.target.value }))} />
                                    <div className="grid grid-cols-3 gap-3">
                                        <Input label="التاريخ" type="date" value={editItem.date || ''} onChange={e => setEditItem(p => ({ ...p, date: e.target.value }))} />
                                        <Select label="الأولوية" value={editItem.priority || 'normal'}
                                            onChange={e => setEditItem(p => ({ ...p, priority: e.target.value }))}
                                            options={[
                                                { value: 'normal', label: 'عادي' },
                                                { value: 'high', label: 'عاجل' }
                                            ]} />
                                        <Select label="النوع" value={editItem.type || 'info'}
                                            onChange={e => setEditItem(p => ({ ...p, type: e.target.value }))}
                                            options={[
                                                { value: 'info', label: 'معلومات' },
                                                { value: 'opportunity', label: 'فرصة' },
                                                { value: 'achievement', label: 'إنجاز' }
                                            ]} />
                                    </div>
                                    <Input label="رابط (اختياري)" value={editItem.link || ''} onChange={e => setEditItem(p => ({ ...p, link: e.target.value }))} placeholder="https://..." />
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ List Views ═══ */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">جارٍ التحميل...</div>
            ) : (
                <>
                    {/* Events List */}
                    {activeTab === 'events' && (
                        <div className="space-y-3">
                            {events.length === 0 ? (
                                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                    <Calendar size={48} className="mx-auto mb-4 text-gray-500" />
                                    <p className="text-gray-400">لا توجد فعاليات بعد</p>
                                    <Btn className="mt-4" onClick={newEvent}><Plus size={14} /> إنشاء فعالية</Btn>
                                </div>
                            ) : events.map(event => (
                                <div key={event.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#7112AF]/30 transition-colors">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-white">{event.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${event.category === 'hackathon' ? 'bg-[#7112AF]/20 text-[#7112AF]' :
                                                        event.category === 'ctf' ? 'bg-red-500/20 text-red-400' :
                                                            event.category === 'seminar' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                event.category === 'meetup' ? 'bg-green-500/20 text-green-400' :
                                                                    'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                        {categoryLabels[event.category] || event.category}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-xs ${event.status === 'open' ? 'bg-green-500/20 text-green-400' :
                                                        event.status === 'almost_full' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {event.status === 'open' ? 'مفتوح' : event.status === 'almost_full' ? 'أماكن محدودة' : 'مغلق'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                                                    <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                                                    <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400" /> {event.xp_reward} XP</span>
                                                </div>
                                                {/* Registration Stats Bar */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Users size={14} className="text-[#7112AF]" />
                                                        <span className="text-white font-bold">{event.registered || 0}</span>
                                                        <span className="text-gray-400">/ {event.max_participants} مسجّل</span>
                                                    </div>
                                                    <div className="flex-1 bg-white/10 rounded-full h-2 max-w-[200px]">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${(event.registered || 0) >= event.max_participants ? 'bg-red-500' :
                                                                (event.registered || 0) >= event.max_participants * 0.8 ? 'bg-yellow-500' : 'bg-gradient-to-r from-[#7112AF] to-[#ff006e]'
                                                                }`}
                                                            style={{ width: `${Math.min(100, ((event.registered || 0) / event.max_participants) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-400">{Math.round(((event.registered || 0) / event.max_participants) * 100)}%</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Btn variant="ghost" size="sm" onClick={() => viewRegistrations(event.id)}
                                                    title="عرض المسجلين">
                                                    <Eye size={14} />
                                                    <span className="text-xs">{event.registered || 0}</span>
                                                </Btn>
                                                <Btn variant={event.status === 'closed' ? 'success' : 'ghost'} size="sm" onClick={() => toggleEventStatus(event)}
                                                    title={event.status === 'closed' ? 'فتح الفعالية' : 'إغلاق الفعالية'}>
                                                    {event.status === 'closed' ? <Unlock size={14} /> : <Lock size={14} />}
                                                </Btn>
                                                <Btn variant="ghost" size="sm" onClick={() => openEdit('event', event)}><Edit size={14} /></Btn>
                                                <Btn variant="danger" size="sm" onClick={() => handleDelete('event', event.id)}><Trash2 size={14} /></Btn>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Registrations Drawer */}
                                    <AnimatePresence>
                                        {viewingRegistrations === event.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/10 overflow-hidden"
                                            >
                                                <div className="p-4 bg-[#0a0a14]">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-sm font-bold text-[#7112AF] flex items-center gap-2">
                                                            <Users size={16} /> المسجلون ({registrations.length})
                                                        </h4>
                                                        <button onClick={() => setViewingRegistrations(null)} className="text-gray-400 hover:text-white">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                    {regsLoading ? (
                                                        <div className="text-center py-4 text-gray-400 text-sm">جارٍ التحميل...</div>
                                                    ) : registrations.length === 0 ? (
                                                        <div className="text-center py-4 text-gray-500 text-sm">لم يسجل أحد بعد</div>
                                                    ) : (
                                                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                                            {registrations.map((reg, idx) => (
                                                                <div key={reg.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                                                    <div className="w-8 h-8 rounded-full bg-[#7112AF]/20 flex items-center justify-center text-[#7112AF] font-bold text-sm">
                                                                        {idx + 1}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <User size={12} className="text-gray-400" />
                                                                            <span className="text-white text-sm font-bold truncate">{reg.name}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                                                            {reg.email && <span className="flex items-center gap-1"><Mail size={10} /> {reg.email}</span>}
                                                                            {reg.phone && <span className="flex items-center gap-1"><Phone size={10} /> {reg.phone}</span>}
                                                                            {reg.student_id && <span className="flex items-center gap-1"><Hash size={10} /> {reg.student_id}</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {reg.registered_at ? new Date(reg.registered_at).toLocaleDateString('ar-SA') : ''}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Surveys List */}
                    {activeTab === 'surveys' && (
                        <div className="space-y-3">
                            {surveys.length === 0 ? (
                                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                    <BarChart2 size={48} className="mx-auto mb-4 text-gray-500" />
                                    <p className="text-gray-400">لا توجد استبيانات بعد</p>
                                    <Btn className="mt-4" onClick={newSurvey}><Plus size={14} /> إنشاء استبيان</Btn>
                                </div>
                            ) : surveys.map(survey => (
                                <div key={survey.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-white">{survey.title}</h3>
                                                <span className={`px-2 py-0.5 rounded text-xs ${survey.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                    {survey.status === 'active' ? 'نشط' : 'مغلق'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-2">{survey.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <span>ينتهي: {survey.end_date}</span>
                                                <span>{survey.participants} مشارك</span>
                                                <span>{(survey.options || []).length} خيار</span>
                                                <span>{survey.xp_reward} XP</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Btn variant="ghost" size="sm" onClick={() => openEdit('survey', survey)}><Edit size={14} /></Btn>
                                            <Btn variant="danger" size="sm" onClick={() => handleDelete('survey', survey.id)}><Trash2 size={14} /></Btn>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Announcements List */}
                    {activeTab === 'announcements' && (
                        <div className="space-y-3">
                            {announcements.length === 0 ? (
                                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                    <Bell size={48} className="mx-auto mb-4 text-gray-500" />
                                    <p className="text-gray-400">لا توجد إعلانات بعد</p>
                                    <Btn className="mt-4" onClick={newAnnouncement}><Plus size={14} /> إنشاء إعلان</Btn>
                                </div>
                            ) : announcements.map(ann => (
                                <div key={ann.id} className={`border rounded-xl p-4 transition-colors ${ann.priority === 'high'
                                    ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30 hover:border-red-500/50'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-white">{ann.title}</h3>
                                                <span className={`px-2 py-0.5 rounded text-xs ${ann.type === 'opportunity' ? 'bg-[#7112AF]/20 text-[#7112AF]' :
                                                    ann.type === 'achievement' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {ann.type === 'opportunity' ? 'فرصة' : ann.type === 'achievement' ? 'إنجاز' : 'معلومات'}
                                                </span>
                                                {ann.priority === 'high' && (
                                                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">عاجل</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 line-clamp-2">{ann.content}</p>
                                            <div className="text-xs text-gray-500 mt-2">{ann.date}</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Btn variant="ghost" size="sm" onClick={() => openEdit('announcement', ann)}><Edit size={14} /></Btn>
                                            <Btn variant="danger" size="sm" onClick={() => handleDelete('announcement', ann.id)}><Trash2 size={14} /></Btn>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Distinguished Members Tab */}
            {activeTab === 'distinguished' && (
                <div className="space-y-4">
                    {/* Add Form */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Award size={18} className="text-yellow-400" /> إضافة متميز جديد</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <Input label="الاسم" value={dMemberForm.name} onChange={e => setDMemberForm(p => ({ ...p, name: e.target.value }))} />
                            <Input label="اللجنة" value={dMemberForm.committee} onChange={e => setDMemberForm(p => ({ ...p, committee: e.target.value }))} />
                            <Input label="الشهر" type="month" value={dMemberForm.month} onChange={e => setDMemberForm(p => ({ ...p, month: e.target.value }))} />
                            <Input label="سبب التميز" value={dMemberForm.reason} onChange={e => setDMemberForm(p => ({ ...p, reason: e.target.value }))} />
                        </div>
                        <div className="mb-3">
                            <label className="block text-xs text-gray-400 mb-2">لون البطاقة</label>
                            <div className="flex gap-2 flex-wrap">
                                {['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'].map(c => (
                                    <button key={c} onClick={() => setDMemberForm(p => ({ ...p, color: c }))}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${dMemberForm.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }} />
                                ))}
                                <input type="color" value={dMemberForm.color} onChange={e => setDMemberForm(p => ({ ...p, color: e.target.value }))}
                                    className="w-8 h-8 rounded-full cursor-pointer bg-transparent border border-white/20" title="لون مخصص" />
                            </div>
                        </div>
                        <Btn onClick={async () => {
                            if (!dMemberForm.name || !dMemberForm.month) return setStatus('الاسم والشهر مطلوبان');
                            try {
                                await distinguishedAPI.addMember(dMemberForm);
                                setStatus('✅ تم إضافة المتميز');
                                setDMemberForm({ name: '', committee: '', month: new Date().toISOString().slice(0, 7), reason: '', color: '#f59e0b' });
                                loadDistinguished();
                            } catch { setStatus('❌ خطأ في الإضافة'); }
                            setTimeout(() => setStatus(''), 3000);
                        }}><Plus size={14} /> إضافة</Btn>
                    </div>

                    {/* Members List */}
                    <div className="space-y-3">
                        {dMembers.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">لا يوجد متميزين بعد</div>
                        ) : dMembers.map(m => (
                            <div key={m.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-yellow-500/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black" style={{ background: `linear-gradient(135deg, ${m.color || '#f59e0b'}, ${m.color || '#f59e0b'}cc)` }}>
                                            {m.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{m.name}</div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                {m.committee && <span className="px-2 py-0.5 bg-[#7112AF]/20 text-[#7112AF] rounded">{m.committee}</span>}
                                                <span>{new Date(m.month + '-01').toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}</span>
                                                {m.reason && <span>• {m.reason}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Btn variant="ghost" size="sm" onClick={async () => {
                                            if (viewingMessages === m.id) { setViewingMessages(null); return; }
                                            try {
                                                const msgs = await distinguishedAPI.getMessages(m.id);
                                                setDMemberMessages(prev => ({ ...prev, [m.id]: Array.isArray(msgs) ? msgs : [] }));
                                            } catch { setDMemberMessages(prev => ({ ...prev, [m.id]: [] })); }
                                            setViewingMessages(m.id);
                                        }}><MessageSquare size={14} /></Btn>
                                        <Btn variant="danger" size="sm" onClick={async () => {
                                            if (!confirm('حذف هذا المتميز؟')) return;
                                            await distinguishedAPI.deleteMember(m.id);
                                            loadDistinguished();
                                            setStatus('تم الحذف');
                                            setTimeout(() => setStatus(''), 2000);
                                        }}><Trash2 size={14} /></Btn>
                                    </div>
                                </div>
                                {/* Messages Drawer */}
                                <AnimatePresence>
                                    {viewingMessages === m.id && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden mt-3 pt-3 border-t border-white/10">
                                            <h4 className="text-xs font-bold text-gray-400 mb-2">الرسائل المجهولة ({(dMemberMessages[m.id] || []).length})</h4>
                                            {(dMemberMessages[m.id] || []).length === 0 ? (
                                                <p className="text-xs text-gray-500">لا توجد رسائل بعد</p>
                                            ) : (dMemberMessages[m.id] || []).map(msg => (
                                                <div key={msg.id} className="bg-white/5 rounded-lg p-3 mb-2 text-sm">
                                                    <p className="text-white">{msg.message}</p>
                                                    <span className="text-xs text-gray-500 mt-1 block">{new Date(msg.created_at).toLocaleDateString('ar-SA')}</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
