import React, { useState, useEffect } from 'react';
import { FileText, Save, Trash2, Copy, Check } from 'lucide-react';

export default function NotepadPanel({
    scenarioId,
    initialNotes = '',
    onChange
}) {
    const [notes, setNotes] = useState(initialNotes);
    const [saved, setSaved] = useState(true);
    const [copied, setCopied] = useState(false);

    // Load saved notes on mount
    useEffect(() => {
        if (scenarioId) {
            const savedNotes = localStorage.getItem(`simulator-notes-${scenarioId}`);
            if (savedNotes) {
                setNotes(savedNotes);
            }
        }
    }, [scenarioId]);

    // Auto-save after 1 second of inactivity
    useEffect(() => {
        const timer = setTimeout(() => {
            if (scenarioId && notes !== initialNotes) {
                localStorage.setItem(`simulator-notes-${scenarioId}`, notes);
                setSaved(true);
                if (onChange) onChange(notes);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [notes, scenarioId, initialNotes, onChange]);

    const handleChange = (e) => {
        setNotes(e.target.value);
        setSaved(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(notes);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        if (window.confirm('هل أنت متأكد من مسح جميع الملاحظات؟')) {
            setNotes('');
            if (scenarioId) {
                localStorage.removeItem(`simulator-notes-${scenarioId}`);
            }
        }
    };

    return (
        <div className="h-full flex flex-col font-cairo" dir="rtl">
            {/* Header */}
            <div className="p-3 border-b border-white/10 bg-black/30 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-amber-400" />
                    <h3 className="text-sm font-bold text-white">المفكرة</h3>
                    {saved ? (
                        <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">محفوظ</span>
                    ) : (
                        <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded animate-pulse">جاري الحفظ...</span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleCopy}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                        title="نسخ الملاحظات"
                    >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        title="مسح الملاحظات"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Notepad Body */}
            <div className="flex-1 p-3">
                <textarea
                    value={notes}
                    onChange={handleChange}
                    placeholder="اكتب ملاحظاتك هنا...&#10;&#10;مثال:&#10;- IP: 192.168.1.50&#10;- كلمة المرور: hospital123&#10;- منفذ SSH: 22"
                    className="w-full h-full bg-[#0d1117] border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-none font-mono"
                    style={{
                        direction: 'ltr',
                        textAlign: 'left',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#374151 #0d1117'
                    }}
                />
            </div>

            {/* Quick Templates */}
            <div className="p-3 border-t border-white/10 flex-shrink-0">
                <p className="text-xs text-gray-500 mb-2">إضافة سريعة:</p>
                <div className="flex flex-wrap gap-2">
                    {['IP:', 'Port:', 'User:', 'Pass:', 'Hash:'].map(template => (
                        <button
                            key={template}
                            onClick={() => setNotes(prev => prev + (prev ? '\n' : '') + template + ' ')}
                            className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors font-mono"
                        >
                            {template}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
