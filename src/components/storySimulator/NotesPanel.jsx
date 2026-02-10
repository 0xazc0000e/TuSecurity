import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';

export default function NotesPanel() {
    const [notes, setNotes] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedNotes = localStorage.getItem('cyber_lab_notes');
        if (savedNotes) setNotes(savedNotes);
    }, []);

    const handleSave = () => {
        localStorage.setItem('cyber_lab_notes', notes);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="h-full bg-[#1a1a1a] flex flex-col font-cairo text-right" dir="rtl">
            <div className="flex items-center justify-between p-3 bg-[#2a2a2a] border-b border-white/5">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span>📝 ملاحظات المهمة</span>
                </h3>
                <button
                    onClick={handleSave}
                    className={`p-1.5 rounded transition-colors ${saved ? 'text-green-400' : 'text-slate-400 hover:text-white'}`}
                    title="حفظ"
                >
                    <Save size={16} />
                </button>
            </div>

            <textarea
                className="flex-1 bg-transparent p-4 outline-none text-slate-300 text-sm resize-none"
                placeholder="سجّل ملاحظاتك، عناوين الـ IP المكتشفة، أو استراتيجياتك هنا..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />

            <div className="p-2 text-xs text-slate-500 border-t border-white/5 flex items-center gap-2">
                <AlertCircle size={12} />
                <span>يتم حفظ الملاحظات محلياً تلقائياً.</span>
            </div>
        </div>
    );
}
