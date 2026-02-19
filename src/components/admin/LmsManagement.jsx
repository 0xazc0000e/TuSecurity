import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Video, FileText, Tags, Upload, Plus, Trash2, Edit, Save, X,
    ChevronRight, ChevronLeft, ChevronDown, ChevronUp, GripVertical, Eye,
    Terminal, HelpCircle, Image, Play, Search, Filter, BarChart2, Clock,
    User, Link, Hash, Palette, Check, AlertCircle, FolderOpen, File, CheckCircle
} from 'lucide-react';
import { lmsAPI } from '../../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Sidebar Sections ─────────────────────────────────────
const SECTIONS = [
    { id: 'tracks', label: 'المسارات والدروس', icon: BookOpen },
    { id: 'recorded', label: 'الدورات المسجلة', icon: Video },
    { id: 'articles', label: 'المقالات', icon: FileText },
    { id: 'tags', label: 'التصنيفات', icon: Tags },
];

// ─── Reusable Input ────────────────────────────────────────
const Field = ({ label, value, onChange, type = 'text', placeholder, rows, icon: Icon }) => (
    <div className="space-y-1">
        <label className="text-xs text-gray-400 flex items-center gap-1">
            {Icon && <Icon size={12} />} {label}
        </label>
        {rows ? (
            <textarea value={value || ''} onChange={e => onChange(e.target.value)}
                placeholder={placeholder} rows={rows}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none resize-none font-mono" />
        ) : (
            <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none" />
        )}
    </div>
);

const Btn = ({ children, onClick, variant = 'primary', size = 'sm', disabled, className = '' }) => {
    const base = 'flex items-center gap-1.5 font-bold rounded-lg transition-all whitespace-nowrap';
    const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-3 text-sm' };
    const variants = {
        primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20',
        ghost: 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10',
        danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
        success: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
    };
    return (
        <button onClick={onClick} disabled={disabled}
            className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}>
            {children}
        </button>
    );
};

// ═══════════════════════════════════════════════════════════
//  TRACKS & LESSONS SECTION (Miller Columns)
// ═══════════════════════════════════════════════════════════
function TracksSection() {
    const [syllabus, setSyllabus] = useState([]);
    const [sel, setSel] = useState({ track: null, course: null, unit: null, lesson: null });
    const [editLesson, setEditLesson] = useState(null);
    const [editorTab, setEditorTab] = useState('content');
    const [showBulk, setShowBulk] = useState(false);
    const [bulkFiles, setBulkFiles] = useState([]);
    const [newName, setNewName] = useState('');
    const [addingTo, setAddingTo] = useState(null); // 'track'|'course'|'unit'
    const [status, setStatus] = useState('');

    const load = useCallback(async () => {
        try {
            const data = await lmsAPI.getSyllabus();
            setSyllabus(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); setStatus('❌ فشل تحميل المنهج: ' + (e.message)); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async (type) => {
        if (!newName.trim()) return;
        try {
            if (type === 'track') await lmsAPI.createTrack({ title: newName });
            if (type === 'course') await lmsAPI.createCourse({ track_id: sel.track.id, title: newName });
            if (type === 'unit') await lmsAPI.createUnit({ course_id: sel.course.id, title: newName });
            setNewName(''); setAddingTo(null);
            setStatus('✅ تمت الإضافة'); setTimeout(() => setStatus(''), 2000);
            load();
        } catch (e) {
            console.error(e);
            setStatus('❌ فشلت الإضافة: ' + (e.message));
        }
    };

    const handleDelete = async (type, id) => {
        if (!confirm('حذف؟')) return;
        try {
            if (type === 'tracks') await lmsAPI.deleteTrack(id);
            if (type === 'courses') await lmsAPI.deleteCourse(id);
            if (type === 'units') await lmsAPI.deleteUnit(id);
            if (type === 'lessons') await lmsAPI.deleteLesson(id);

            if (type === 'tracks') setSel(p => ({ ...p, track: null, course: null, unit: null, lesson: null }));
            if (type === 'courses') setSel(p => ({ ...p, course: null, unit: null, lesson: null }));
            if (type === 'units') setSel(p => ({ ...p, unit: null, lesson: null }));
            if (type === 'lessons') setSel(p => ({ ...p, lesson: null }));
            load();
        } catch (e) { console.error(e); setStatus('❌ فشل الحذف'); }
    };

    const handleSaveLesson = async () => {
        if (!editLesson) return;
        const payload = {
            title: editLesson.title, content: editLesson.content,
            xp_reward: parseInt(editLesson.xp_reward) || 10,
            video_url: editLesson.video_url || '',
            terminal_config: JSON.stringify(editLesson._term || {}),
            quiz_config: JSON.stringify(editLesson._quiz || []),
            sort_order: editLesson.sort_order || 0,
        };
        try {
            if (editLesson.id) {
                await lmsAPI.updateLesson(editLesson.id, payload);
            } else {
                await lmsAPI.createLesson({ ...payload, unit_id: sel.unit.id });
            }
            setStatus('✅ تم حفظ الدرس بنجاح'); setTimeout(() => setStatus(''), 3000);
            setEditLesson(null); load();
        } catch (e) {
            console.error(e);
            setStatus('❌ فشل حفظ الدرس: ' + (e.message));
        }
    };

    const handleBulkUpload = async () => {
        if (!sel.unit || bulkFiles.length === 0) return;
        const lessons = await Promise.all(bulkFiles.map(async (file, idx) => {
            const text = await file.text();
            return {
                unit_id: sel.unit.id,
                title: file.name.replace(/\.md$/i, '').replace(/[-_]/g, ' '),
                content: text, xp_reward: 10, sort_order: idx + 1,
            };
        }));
        try {
            await lmsAPI.bulkUploadLessons({ lessons });
            setBulkFiles([]); setShowBulk(false); load();
        } catch (e) { console.error(e); }
    };

    const handleImportMd = () => {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = '.md,.markdown';
        input.onchange = async (e) => {
            const file = e.target.files[0]; if (!file) return;
            const text = await file.text();
            setEditLesson(prev => ({ ...prev, content: text, title: prev.title || file.name.replace(/\.md$/i, '').replace(/[-_]/g, ' ') }));
        };
        input.click();
    };

    // Parse quiz/terminal from lesson for editing
    const openLessonEditor = (lesson) => {
        let quizArr = [];
        let termObj = {};
        try { quizArr = JSON.parse(lesson.quiz_config || '[]'); } catch { }
        try { termObj = JSON.parse(lesson.terminal_config || '{}'); } catch { }
        setEditLesson({ ...lesson, _quiz: Array.isArray(quizArr) ? quizArr : [], _term: termObj });
        setEditorTab('content');
    };

    const newLesson = () => {
        setEditLesson({
            title: '', content: '', xp_reward: 10, video_url: '',
            terminal_config: '{}', quiz_config: '[]', sort_order: 0,
            _quiz: [], _term: {},
        });
        setEditorTab('content');
    };

    // Quiz helpers
    const addQuizQ = () => {
        const q = [...(editLesson._quiz || []), { question: '', options: ['', '', '', ''], correctAnswer: 0 }];
        setEditLesson(p => ({ ...p, _quiz: q, quiz_config: JSON.stringify(q) }));
    };
    const updateQuizQ = (idx, field, val) => {
        const q = [...editLesson._quiz];
        q[idx] = { ...q[idx], [field]: val };
        setEditLesson(p => ({ ...p, _quiz: q, quiz_config: JSON.stringify(q) }));
    };
    const updateQuizOption = (qIdx, oIdx, val) => {
        const q = [...editLesson._quiz];
        q[qIdx].options[oIdx] = val;
        setEditLesson(p => ({ ...p, _quiz: q, quiz_config: JSON.stringify(q) }));
    };
    const removeQuizQ = (idx) => {
        const q = editLesson._quiz.filter((_, i) => i !== idx);
        setEditLesson(p => ({ ...p, _quiz: q, quiz_config: JSON.stringify(q) }));
    };

    // Terminal helpers
    const updateTerm = (field, val) => {
        const t = { ...editLesson._term, [field]: val };
        setEditLesson(p => ({ ...p, _term: t, terminal_config: JSON.stringify(t) }));
    };
    const addTermCmd = () => {
        const cmds = [...(editLesson._term.commands || []), { command: '', output: '', hint: '' }];
        const t = { ...editLesson._term, commands: cmds };
        setEditLesson(p => ({ ...p, _term: t, terminal_config: JSON.stringify(t) }));
    };
    const updateTermCmd = (idx, field, val) => {
        const cmds = [...(editLesson._term.commands || [])];
        cmds[idx] = { ...cmds[idx], [field]: val };
        const t = { ...editLesson._term, commands: cmds };
        setEditLesson(p => ({ ...p, _term: t, terminal_config: JSON.stringify(t) }));
    };
    const removeTermCmd = (idx) => {
        const cmds = (editLesson._term.commands || []).filter((_, i) => i !== idx);
        const t = { ...editLesson._term, commands: cmds };
        setEditLesson(p => ({ ...p, _term: t, terminal_config: JSON.stringify(t) }));
    };

    // Column renderer
    const Col = ({ title, items: rawItems, onSelect, selectedId, onAdd, onDelete, typeLabel }) => {
        const items = Array.isArray(rawItems) ? rawItems : [];
        return (
            <div className="flex-1 min-w-0 bg-[#0a0a14] border border-white/10 rounded-xl overflow-hidden flex flex-col">
                <div className="px-3 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300">{title}</span>
                    {onAdd && <button onClick={onAdd} className="p-1 hover:bg-white/10 rounded"><Plus size={14} className="text-purple-400" /></button>}
                </div>
                <div className="flex-1 overflow-y-auto p-1 space-y-0.5" style={{ maxHeight: '300px' }}>
                    {items.map(item => (
                        <div key={item.id}
                            onClick={() => onSelect(item)}
                            className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-all ${selectedId === item.id ? 'bg-purple-600/20 text-white border border-purple-500/30' : 'text-gray-400 hover:bg-white/5'
                                }`}>
                            <span className="truncate">{item.title}</span>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                className="p-0.5 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                        </div>
                    ))}
                    {items.length === 0 && <div className="text-xs text-gray-600 text-center py-4">فارغ</div>}
                </div>
            </div>
        );
    };

    const tracks = Array.isArray(syllabus) ? syllabus : [];
    const courses = Array.isArray(sel.track?.courses) ? sel.track.courses : [];
    const units = Array.isArray(sel.course?.units) ? sel.course.units : [];
    const lessons = Array.isArray(sel.unit?.lessons) ? sel.unit.lessons : [];

    return (
        <div className="space-y-4">
            {status && <div className={`text-sm font-bold px-3 py-2 rounded-lg ${status.startsWith('✅') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{status}</div>}
            {/* Miller Columns */}
            <div className="flex gap-2" dir="rtl">
                <Col title="المسارات" items={tracks}
                    selectedId={sel.track?.id}
                    onSelect={t => setSel({ track: t, course: null, unit: null, lesson: null })}
                    onAdd={() => setAddingTo('track')}
                    onDelete={id => handleDelete('tracks', id)} />
                <Col title="الدورات" items={courses}
                    selectedId={sel.course?.id}
                    onSelect={c => setSel(p => ({ ...p, course: c, unit: null, lesson: null }))}
                    onAdd={sel.track ? () => setAddingTo('course') : null}
                    onDelete={id => handleDelete('courses', id)} />
                <Col title="الوحدات" items={units}
                    selectedId={sel.unit?.id}
                    onSelect={u => setSel(p => ({ ...p, unit: u, lesson: null }))}
                    onAdd={sel.course ? () => setAddingTo('unit') : null}
                    onDelete={id => handleDelete('units', id)} />
                <Col title="الدروس" items={lessons}
                    selectedId={sel.lesson?.id}
                    onSelect={l => { setSel(p => ({ ...p, lesson: l })); openLessonEditor(l); }}
                    onAdd={sel.unit ? () => newLesson() : null}
                    onDelete={id => handleDelete('lessons', id)} />
            </div>

            {/* Add Name Modal */}
            {addingTo && (
                <div className="flex gap-2 items-center bg-white/5 p-3 rounded-lg border border-white/10" dir="rtl">
                    <input value={newName} onChange={e => setNewName(e.target.value)}
                        placeholder={`اسم ${addingTo === 'track' ? 'المسار' : addingTo === 'course' ? 'الدورة' : 'الوحدة'}`}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                        onKeyDown={e => e.key === 'Enter' && handleAdd(addingTo)} autoFocus />
                    <Btn onClick={() => handleAdd(addingTo)}><Check size={14} /> إضافة</Btn>
                    <Btn variant="ghost" onClick={() => { setAddingTo(null); setNewName(''); }}><X size={14} /></Btn>
                </div>
            )}

            {/* Bulk Upload */}
            {sel.unit && (
                <div className="flex gap-2" dir="rtl">
                    <Btn variant="ghost" onClick={() => setShowBulk(!showBulk)}><Upload size={14} /> رفع دروس بالجملة</Btn>
                </div>
            )}
            {showBulk && sel.unit && (
                <div className="bg-white/5 border border-dashed border-purple-500/30 rounded-xl p-4 space-y-3" dir="rtl">
                    <div className="text-center"
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); setBulkFiles([...e.dataTransfer.files].filter(f => f.name.endsWith('.md'))); }}>
                        <input type="file" multiple accept=".md" onChange={e => setBulkFiles([...e.target.files])}
                            className="hidden" id="bulk-input" />
                        <label htmlFor="bulk-input" className="cursor-pointer text-sm text-gray-400 hover:text-white">
                            <Upload size={24} className="mx-auto mb-2 text-purple-400" />
                            اسحب ملفات .md هنا أو اضغط للاختيار
                        </label>
                    </div>
                    {bulkFiles.length > 0 && (
                        <>
                            <div className="text-xs text-gray-400">{bulkFiles.length} ملف جاهز</div>
                            <Btn onClick={handleBulkUpload}><Upload size={14} /> رفع {bulkFiles.length} درس</Btn>
                        </>
                    )}
                </div>
            )}

            {/* Lesson Editor */}
            {editLesson && (
                <div className="bg-[#0c0c18] border border-white/10 rounded-xl overflow-hidden" dir="rtl">
                    {/* Editor Tabs */}
                    <div className="flex border-b border-white/10">
                        {[
                            { id: 'content', label: 'المحتوى', icon: FileText },
                            { id: 'terminal', label: 'المحاكي', icon: Terminal },
                            { id: 'quiz', label: 'الاختبار', icon: HelpCircle },
                            { id: 'visuals', label: 'المرئيات', icon: Image },
                            { id: 'video', label: 'فيديو', icon: Video },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setEditorTab(tab.id)}
                                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-colors border-b-2 ${editorTab === tab.id ? 'text-purple-400 border-purple-500 bg-purple-500/10' : 'text-gray-500 border-transparent hover:text-gray-300'
                                    }`}>
                                <tab.icon size={14} /> {tab.label}
                            </button>
                        ))}
                        <div className="flex-1" />
                        <Btn variant="ghost" size="sm" onClick={() => setEditLesson(null)} className="m-1"><X size={14} /></Btn>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Content Tab */}
                        {editorTab === 'content' && (
                            <>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <Field label="عنوان الدرس" value={editLesson.title}
                                            onChange={v => setEditLesson(p => ({ ...p, title: v }))} placeholder="عنوان الدرس" />
                                    </div>
                                    <Field label="نقاط XP" value={editLesson.xp_reward} type="number"
                                        onChange={v => setEditLesson(p => ({ ...p, xp_reward: v }))} />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-xs text-gray-400">محتوى Markdown</label>
                                        <div className="flex gap-2">
                                            <Btn variant="ghost" size="sm" onClick={() => document.getElementById('media-upload').click()}>
                                                <Image size={14} /> إدراج وسائط
                                            </Btn>
                                            <Btn variant="ghost" size="sm" onClick={handleImportMd}><FolderOpen size={12} /> استيراد ملف .md</Btn>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        id="media-upload"
                                        className="hidden"
                                        accept="image/*,video/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            try {
                                                const formData = new FormData();
                                                formData.append('image', file);
                                                const token = localStorage.getItem('token');
                                                setStatus('جاري الرفع...');
                                                const res = await fetch(`${API_BASE}/upload`, {
                                                    method: 'POST',
                                                    headers: { 'Authorization': `Bearer ${token}` },
                                                    body: formData
                                                });
                                                if (!res.ok) throw new Error('Upload failed');
                                                const data = await res.json();

                                                const isVideo = file.type.startsWith('video/');
                                                const md = isVideo ? `\n<video src="${data.url}" controls width="100%"></video>\n` : `\n![${file.name}](${data.url})\n`;

                                                setEditLesson(p => ({ ...p, content: (p.content || '') + md }));
                                                setStatus('✅ تم الرفع');
                                                setTimeout(() => setStatus(''), 2000);
                                            } catch (err) {
                                                console.error(err);
                                                setStatus('❌ فشل الرفع');
                                            }
                                            e.target.value = '';
                                        }}
                                    />
                                    <textarea value={editLesson.content || ''} rows={12}
                                        onChange={e => setEditLesson(p => ({ ...p, content: e.target.value }))}
                                        className="w-full px-3 py-2 bg-[#0a0a12] border border-white/10 rounded-lg text-white text-sm font-mono focus:border-purple-500 focus:outline-none resize-y"
                                        placeholder="# عنوان الدرس&#10;&#10;اكتب محتوى الدرس بصيغة Markdown..." />
                                </div>
                            </>
                        )}

                        {/* Terminal Tab */}
                        {editorTab === 'terminal' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Terminal size={16} className="text-green-400" /> إعداد المحاكي التفاعلي
                                    </h4>
                                    <Btn variant="ghost" size="sm" onClick={addTermCmd}><Plus size={12} /> أمر جديد</Btn>
                                </div>
                                <Field label="وصف المهمة" value={editLesson._term.description}
                                    onChange={v => updateTerm('description', v)} placeholder="وصف ما يجب على الطالب فعله..." />
                                <Field label="رسالة النجاح" value={editLesson._term.successMessage}
                                    onChange={v => updateTerm('successMessage', v)} placeholder="أحسنت! أكملت المهمة بنجاح" />
                                {(editLesson._term.commands || []).map((cmd, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-purple-400 font-bold">الأمر #{i + 1}</span>
                                            <button onClick={() => removeTermCmd(i)} className="text-red-400 hover:text-red-300"><Trash2 size={12} /></button>
                                        </div>
                                        <Field label="الأمر" value={cmd.command} onChange={v => updateTermCmd(i, 'command', v)} placeholder="ls -la" />
                                        <Field label="المخرج المتوقع" value={cmd.output} onChange={v => updateTermCmd(i, 'output', v)} placeholder="المخرج الذي يظهر عند التنفيذ" />
                                        <Field label="تلميح" value={cmd.hint} onChange={v => updateTermCmd(i, 'hint', v)} placeholder="تلميح للطالب (اختياري)" />
                                    </div>
                                ))}
                                {(editLesson._term.commands || []).length === 0 && (
                                    <div className="text-center py-6 text-gray-600 text-sm">لم يتم إضافة أوامر بعد. اضغط "أمر جديد" للبدء.</div>
                                )}
                                {/* Live Preview */}
                                {(editLesson._term.commands || []).length > 0 && (
                                    <div className="bg-black rounded-lg p-3 border border-green-500/20">
                                        <div className="text-xs text-green-400 mb-2 font-bold">معاينة:</div>
                                        {editLesson._term.commands.map((cmd, i) => (
                                            <div key={i} className="font-mono text-xs">
                                                <span className="text-green-400">$ </span>
                                                <span className="text-white">{cmd.command || '...'}</span>
                                                {cmd.output && <div className="text-gray-400 mr-4">{cmd.output}</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Quiz Tab */}
                        {editorTab === 'quiz' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <HelpCircle size={16} className="text-yellow-400" /> أسئلة نهاية الدرس
                                        {(editLesson._quiz || []).length > 0 && (
                                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-[10px]">{(editLesson._quiz || []).length} سؤال</span>
                                        )}
                                    </h4>
                                </div>
                                <p className="text-xs text-gray-500">يجب على الطالب الإجابة على جميع الأسئلة بشكل صحيح للانتقال للدرس التالي</p>
                                {(editLesson._quiz || []).map((q, qi) => (
                                    <div key={qi} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded-lg">السؤال {qi + 1}</span>
                                            <button onClick={() => removeQuizQ(qi)} className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                                        </div>
                                        <Field label="نص السؤال" value={q.question} onChange={v => updateQuizQ(qi, 'question', v)} placeholder="اكتب السؤال هنا..." />
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400">الخيارات <span className="text-gray-600">(اضغط الدائرة لتحديد الإجابة الصحيحة)</span></label>
                                            {(q.options || []).map((opt, oi) => (
                                                <div key={oi} className="flex items-center gap-2">
                                                    <button onClick={() => updateQuizQ(qi, 'correctAnswer', oi)}
                                                        title={q.correctAnswer === oi ? 'هذه الإجابة الصحيحة' : 'اضغط لتحديد كإجابة صحيحة'}
                                                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${q.correctAnswer === oi ? 'border-green-400 bg-green-400/20 shadow-[0_0_8px_rgba(74,222,128,0.3)]' : 'border-white/20 hover:border-green-400/50'
                                                            }`}>
                                                        {q.correctAnswer === oi && <Check size={12} className="text-green-400" />}
                                                    </button>
                                                    <span className="text-xs text-gray-600 w-4">{String.fromCharCode(1571 + oi)}</span>
                                                    <input value={opt} onChange={e => updateQuizOption(qi, oi, e.target.value)}
                                                        placeholder={`الخيار ${oi + 1}`}
                                                        className={`flex-1 px-3 py-2 bg-white/5 border rounded-lg text-white text-sm focus:outline-none transition-all ${q.correctAnswer === oi ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 focus:border-purple-500'}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {/* Add Question Button */}
                                <button onClick={addQuizQ}
                                    className="w-full py-4 border-2 border-dashed border-yellow-500/30 rounded-xl text-yellow-400/70 hover:text-yellow-400 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all flex items-center justify-center gap-2 text-sm font-bold">
                                    <Plus size={16} /> إضافة سؤال جديد
                                </button>
                                {(editLesson._quiz || []).length > 0 && (
                                    <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-lg p-3 text-xs text-yellow-300/70 flex items-center gap-2">
                                        <HelpCircle size={12} /> تذكر: اضغط "حفظ الدرس" بالأسفل لحفظ الأسئلة مع الدرس
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Visuals Tab (Mermaid) */}
                        {editorTab === 'visuals' && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Image size={16} className="text-cyan-400" /> رسوم توضيحية (Mermaid)
                                </h4>
                                <p className="text-xs text-gray-500">أضف كود Mermaid لإنشاء رسوم بيانية. سيتم إدراجها تلقائياً في المحتوى.</p>
                                <textarea value={editLesson._mermaid || ''} rows={8}
                                    onChange={e => {
                                        const m = e.target.value;
                                        setEditLesson(p => ({ ...p, _mermaid: m }));
                                    }}
                                    className="w-full px-3 py-2 bg-[#0a0a12] border border-white/10 rounded-lg text-green-400 text-sm font-mono focus:border-cyan-500 focus:outline-none resize-y"
                                    placeholder={'graph TD\n    A[بداية] --> B{قرار}\n    B -->|نعم| C[تنفيذ]\n    B -->|لا| D[إلغاء]'} />
                                <Btn variant="ghost" onClick={() => {
                                    const block = '\n\n```mermaid\n' + (editLesson._mermaid || '') + '\n```\n';
                                    setEditLesson(p => ({ ...p, content: (p.content || '') + block }));
                                }}><Plus size={14} /> إدراج في المحتوى</Btn>
                            </div>
                        )}

                        {/* Video Tab */}
                        {editorTab === 'video' && (
                            <div className="space-y-4">
                                <Field label="رابط الفيديو" value={editLesson.video_url} icon={Link}
                                    onChange={v => setEditLesson(p => ({ ...p, video_url: v }))}
                                    placeholder="https://youtube.com/watch?v=... أو رابط MP4" />
                                {editLesson.video_url && (
                                    <div className="bg-black rounded-lg overflow-hidden border border-white/10">
                                        {editLesson.video_url.includes('youtube') || editLesson.video_url.includes('youtu.be') ? (
                                            <iframe src={editLesson.video_url.replace('watch?v=', 'embed/')}
                                                className="w-full aspect-video" allowFullScreen />
                                        ) : (
                                            <video src={editLesson.video_url} controls className="w-full aspect-video" />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Save Bar */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                            <Btn variant="ghost" onClick={() => setEditLesson(null)}><X size={14} /> إلغاء</Btn>
                            <Btn onClick={handleSaveLesson}><Save size={14} /> حفظ الدرس</Btn>
                        </div>
                    </div>
                </div >
            )
            }
        </div >
    );
}

// ═══════════════════════════════════════════════════════════
//  RECORDED COURSES SECTION
// ═══════════════════════════════════════════════════════════
function RecordedCoursesSection() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [allTags, setAllTags] = useState([]);
    const [status, setStatus] = useState('');

    // Convert to useCallback or just call in useEffect
    const load = async () => {
        try {
            const r = await lmsAPI.getRecordedCourses();
            const t = await lmsAPI.getTags();
            setItems(Array.isArray(r) ? r : []);
            setAllTags(Array.isArray(t) ? t : []);
        } catch (e) { console.error(e); setStatus('❌ فشل التحميل'); }
    };
    useEffect(() => { load(); }, []);

    const parseItemTags = (item) => {
        if (Array.isArray(item.tags)) return item.tags;
        try { const p = JSON.parse(item.tags || '[]'); return Array.isArray(p) ? p : []; } catch { return []; }
    };

    const toggleTag = (tagName) => {
        setEditing(p => {
            const current = parseItemTags(p);
            const next = current.includes(tagName) ? current.filter(t => t !== tagName) : [...current, tagName];
            return { ...p, tags: next };
        });
    };

    const save = async () => {
        if (!editing) return;
        try {
            const payload = { ...editing, tags: parseItemTags(editing) };
            if (editing.id) await lmsAPI.updateRecordedCourse(editing.id, payload);
            else await lmsAPI.createRecordedCourse(payload);
            setEditing(null); setStatus('✅ تم الحفظ'); load();
            setTimeout(() => setStatus(''), 2000);
        } catch (e) { console.error(e); setStatus('❌ فشل الحفظ: ' + (e.message)); }
    };
    const del = async (id) => {
        if (confirm('حذف؟')) {
            try { await lmsAPI.deleteRecordedCourse(id); load(); } catch (e) { console.error(e); }
        }
    };

    return (
        <div className="space-y-4" dir="rtl">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Video size={20} className="text-blue-400" /> الدورات المسجلة</h3>
                <div className="flex items-center gap-2">
                    {status && <span className="text-xs text-green-400">{status}</span>}
                    <Btn onClick={() => setEditing({ title: '', description: '', instructor: '', video_url: '', duration: '', tags: [], thumbnail_url: '' })}><Plus size={14} /> دورة جديدة</Btn>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map(item => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0"><Video size={24} className="text-blue-400" /></div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                            <p className="text-xs text-gray-400 truncate">{item.instructor}</p>
                            <p className="text-xs text-gray-500">{item.duration}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {parseItemTags(item).map(t => <span key={t} className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full">{t}</span>)}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <button onClick={() => setEditing({ ...item, tags: parseItemTags(item) })} className="p-1 hover:bg-white/10 rounded"><Edit size={14} className="text-gray-400" /></button>
                            <button onClick={() => del(item.id)} className="p-1 hover:bg-red-500/10 rounded"><Trash2 size={14} className="text-red-400" /></button>
                        </div>
                    </div>
                ))}
            </div>
            {editing && (
                <div className="bg-[#0c0c18] border border-white/10 rounded-xl p-4 space-y-3">
                    <Field label="عنوان الدورة" value={editing.title} onChange={v => setEditing(p => ({ ...p, title: v }))} />
                    <Field label="الوصف" value={editing.description} onChange={v => setEditing(p => ({ ...p, description: v }))} rows={3} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="المحاضر" value={editing.instructor} onChange={v => setEditing(p => ({ ...p, instructor: v }))} icon={User} />
                        <Field label="المدة" value={editing.duration} onChange={v => setEditing(p => ({ ...p, duration: v }))} icon={Clock} placeholder="2:30:00" />
                    </div>
                    <Field label="رابط الفيديو" value={editing.video_url} onChange={v => setEditing(p => ({ ...p, video_url: v }))} icon={Link} />
                    <Field label="صورة مصغرة (URL)" value={editing.thumbnail_url} onChange={v => setEditing(p => ({ ...p, thumbnail_url: v }))} icon={Image} />
                    {/* Tag selector */}
                    <div>
                        <label className="text-xs text-gray-400 block mb-1.5">التصنيفات</label>
                        <div className="flex flex-wrap gap-1.5">
                            {allTags.map(tag => {
                                const selected = parseItemTags(editing).includes(tag.name);
                                return (
                                    <button key={tag.id} onClick={() => toggleTag(tag.name)}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${selected
                                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                                        <Hash size={10} />
                                        {tag.name}
                                        {selected && <Check size={10} className="text-green-400" />}
                                    </button>
                                );
                            })}
                            {allTags.length === 0 && <span className="text-xs text-gray-600">لا توجد تصنيفات — أضف تصنيفات من قسم التصنيفات أولاً</span>}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Btn variant="ghost" onClick={() => setEditing(null)}><X size={14} /> إلغاء</Btn>
                        <Btn onClick={save}><Save size={14} /> حفظ</Btn>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
//  ARTICLES SECTION
// ═══════════════════════════════════════════════════════════
function ArticlesSection() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [allTags, setAllTags] = useState([]);
    const [status, setStatus] = useState('');

    const load = async () => {
        try {
            const r = await lmsAPI.getArticles();
            const t = await lmsAPI.getTags();
            setItems(Array.isArray(r) ? r : []);
            setAllTags(Array.isArray(t) ? t : []);
        } catch (e) {
            console.error(e);
            setStatus('❌ فشل التحميل');
        }
    };
    useEffect(() => { load(); }, []);

    const parseItemTags = (item) => {
        if (Array.isArray(item.tags)) return item.tags;
        try { const p = JSON.parse(item.tags || '[]'); return Array.isArray(p) ? p : []; } catch { return []; }
    };

    const toggleTag = (tagName) => {
        setEditing(p => {
            const current = parseItemTags(p);
            const next = current.includes(tagName) ? current.filter(t => t !== tagName) : [...current, tagName];
            return { ...p, tags: next };
        });
    };

    const save = async () => {
        if (!editing) return;
        try {
            const formData = new FormData();
            formData.append('title', editing.title);
            formData.append('content', editing.content || '');
            formData.append('description', editing.description || '');
            formData.append('author', editing.author || '');
            formData.append('read_time', editing.read_time || 5);
            formData.append('tags', JSON.stringify(parseItemTags(editing)));

            if (selectedFile) {
                formData.append('cover_image', selectedFile);
            } else if (editing.cover_image) {
                // If existing image, we might not need to send it again or send it as string
                // But if we want to update other fields, FormData handles it.
                // If it's a URL string, append it.
                formData.append('cover_image', editing.cover_image);
            }

            if (editing.id) {
                await lmsAPI.updateArticle(editing.id, formData);
            } else {
                await lmsAPI.createArticle(formData);
            }

            setEditing(null); setSelectedFile(null); setStatus('✅ تم الحفظ'); load();
            setTimeout(() => setStatus(''), 2000);
        } catch (e) {
            console.error(e);
            setStatus('❌ فشل الحفظ: ' + (e.message));
        }
    };
    const del = async (id) => {
        if (confirm('حذف؟')) {
            try { await lmsAPI.deleteArticle(id); load(); } catch (e) { console.error(e); }
        }
    };
    const importMd = () => {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = '.md';
        input.onchange = async (e) => {
            const file = e.target.files[0]; if (!file) return;
            const text = await file.text();
            setEditing(p => ({ ...p, content: text, title: p.title || file.name.replace(/\.md$/i, '').replace(/[-_]/g, ' ') }));
        };
        input.click();
    };

    return (
        <div className="space-y-4" dir="rtl">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><FileText size={20} className="text-orange-400" /> المقالات</h3>
                <div className="flex items-center gap-2">
                    {status && <span className="text-xs text-green-400">{status}</span>}
                    <Btn onClick={() => setEditing({ title: '', content: '', description: '', author: '', tags: [], read_time: 5, cover_image: '' })}><Plus size={14} /> مقال جديد</Btn>
                </div>
            </div>
            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center"><FileText size={18} className="text-orange-400" /></div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-400">{item.author} • {item.read_time || 5} دقيقة قراءة</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {parseItemTags(item).map(t => <span key={t} className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded-full">{t}</span>)}
                            </div>
                        </div>
                        <button onClick={() => setEditing({ ...item, tags: parseItemTags(item) })} className="p-1 hover:bg-white/10 rounded"><Edit size={14} className="text-gray-400" /></button>
                        <button onClick={() => del(item.id)} className="p-1 hover:bg-red-500/10 rounded"><Trash2 size={14} className="text-red-400" /></button>
                    </div>
                ))}
            </div>
            {editing && (
                <div className="bg-[#0c0c18] border border-white/10 rounded-xl p-4 space-y-3">
                    <Field label="عنوان المقال" value={editing.title} onChange={v => setEditing(p => ({ ...p, title: v }))} />
                    <Field label="وصف مختصر" value={editing.description} onChange={v => setEditing(p => ({ ...p, description: v }))} rows={2} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="الكاتب" value={editing.author} onChange={v => setEditing(p => ({ ...p, author: v }))} icon={User} />
                        <Field label="وقت القراءة (دقائق)" value={editing.read_time} type="number" onChange={v => setEditing(p => ({ ...p, read_time: v }))} icon={Clock} />
                    </div>

                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 flex items-center gap-1">
                            <Image size={12} /> صورة الغلاف
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files[0]) setSelectedFile(e.target.files[0]);
                                }}
                                className="hidden"
                                id="article-cover-upload"
                            />
                            <label
                                htmlFor="article-cover-upload"
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors text-sm text-gray-300"
                            >
                                <Upload size={16} />
                                {selectedFile ? selectedFile.name : 'اختر صورة'}
                            </label>
                            {editing.cover_image && !selectedFile && (
                                <span className="text-gray-500 text-xs truncate max-w-[150px]">{editing.cover_image}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-2">
                            <textarea
                                value={editing.content || ''}
                                onChange={e => setEditing(p => ({ ...p, content: e.target.value }))}
                                rows={10}
                                className="w-full px-3 py-2 bg-[#0a0a12] border border-white/10 rounded-lg text-white text-sm font-mono focus:border-orange-500 focus:outline-none resize-y"
                                placeholder="# محتوى المقال (MD)..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Btn variant="ghost" onClick={importMd} className="w-full justify-center"><FolderOpen size={14} /> استيراد ملف MD</Btn>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">التصنيفات</label>
                                <div className="flex flex-wrap gap-1">
                                    {allTags.map(tag => (
                                        <button key={tag.id} onClick={() => toggleTag(tag.name)}
                                            className={`px-2 py-1 rounded text-[10px] border ${parseItemTags(editing).includes(tag.name) ? 'border-orange-500 bg-orange-500/20 text-orange-300' : 'border-white/10 text-gray-500'}`}>
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Btn variant="ghost" onClick={() => { setEditing(null); setSelectedFile(null); }}><X size={14} /> إلغاء</Btn>
                        <Btn onClick={save}><Save size={14} /> حفظ</Btn>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
//  TAGS SECTION
// ═══════════════════════════════════════════════════════════
function TagsSection() {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState({ name: '', color: '#7112AF', type: 'general' });
    const [status, setStatus] = useState('');

    const load = async () => {
        try {
            const data = await lmsAPI.getTags();
            setTags(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
    };
    useEffect(() => { load(); }, []);

    const add = async () => {
        if (!newTag.name.trim()) return;
        try {
            await lmsAPI.createTag(newTag);
            setNewTag({ name: '', color: '#7112AF', type: 'general' });
            load(); setStatus('✅ تم'); setTimeout(() => setStatus(''), 2000);
        } catch (e) {
            console.error(e);
            setStatus('❌ خطأ');
        }
    };

    const del = async (id) => {
        if (confirm('حذف؟')) {
            try { await lmsAPI.deleteTag(id); load(); } catch (e) { console.error(e); }
        }
    };

    return (
        <div className="space-y-4" dir="rtl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Tags size={20} className="text-pink-400" /> إدارة التصنيفات</h3>
            {status && <span className="text-xs text-green-400">{status}</span>}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-end gap-3">
                <div className="flex-1">
                    <Field label="اسم التصنيف" value={newTag.name} onChange={v => setNewTag(p => ({ ...p, name: v }))} placeholder="مثال: شبكات, برمجة..." />
                </div>
                <div className="w-32">
                    <Field label="لون (Hex)" value={newTag.color} onChange={v => setNewTag(p => ({ ...p, color: v }))} placeholder="#RRGGBB" />
                </div>
                <Btn onClick={add}><Plus size={14} /> إضافة</Btn>
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <div key={tag.id} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }}></div>
                        <span className="text-sm text-gray-300">{tag.name}</span>
                        <button onClick={() => del(tag.id)} className="text-red-400 hover:text-white ml-2"><X size={12} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function LmsManagement() {
    const [activeSection, setActiveSection] = useState('tracks');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" dir="rtl">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
                {SECTIONS.map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeSection === section.id
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-white shadow-lg shadow-purple-900/20'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <section.icon size={18} className={activeSection === section.id ? 'text-purple-400' : 'text-gray-500'} />
                        {section.label}
                        {activeSection === section.id && <ChevronLeft size={16} className="mr-auto text-purple-400" />}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 min-h-[600px]"
                    >
                        {activeSection === 'tracks' && <TracksSection />}
                        {activeSection === 'recorded' && <RecordedCoursesSection />}
                        {activeSection === 'articles' && <ArticlesSection />}
                        {activeSection === 'tags' && <TagsSection />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
