import React, { useState, useEffect } from 'react';
import { Save, Trash2, Clipboard } from 'lucide-react';

export default function PersistentNotepad() {
    const [content, setContent] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('cyber-range-notes');
        if (saved) setContent(saved);
    }, []);

    const handleChange = (e) => {
        const newVal = e.target.value;
        setContent(newVal);
        localStorage.setItem('cyber-range-notes', newVal);
    };

    const clearNotes = () => {
        if (window.confirm('هل أنت متأكد من مسح جميع الملاحظات؟')) {
            setContent('');
            localStorage.removeItem('cyber-range-notes');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] rounded-lg overflow-hidden border border-white/10">
            <div className="bg-[#151515] px-3 py-2 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <Clipboard size={14} /> ملاحظات المهمة
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={clearNotes}
                        className="p-1.5 hover:bg-red-900/20 text-gray-500 hover:text-red-400 rounded transition-colors"
                        title="مسح"
                    >
                        <Trash2 size={14} />
                    </button>
                    <div className="p-1.5 text-green-500/50" title="محفوظ تلقائياً">
                        <Save size={14} />
                    </div>
                </div>
            </div>
            <textarea
                value={content}
                onChange={handleChange}
                placeholder="سجل ملاحظاتك الهامة هنا (IPs, Passwords). سيتم حفظها تلقائياً."
                className="flex-grow bg-transparent p-3 text-sm font-mono text-gray-300 resize-none focus:outline-none placeholder:text-gray-700 leading-relaxed custom-scrollbar"
                spellCheck={false}
            />
        </div>
    );
}
