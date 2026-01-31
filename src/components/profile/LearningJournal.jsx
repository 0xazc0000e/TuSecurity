import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Save, Plus } from 'lucide-react';

export const LearningJournal = () => {
    const [entries, setEntries] = useState([
        { id: 1, date: '2025-01-28', text: 'اليوم تعلمت الفرق بين التشفير المتماثل وغير المتماثل. التناظر يشبه مفتاح الباب، واللا تناظر يشبه صندوق البريد.' },
        { id: 2, date: '2025-01-25', text: 'أحتاج للتدرب أكثر على أوامر Linux، خصوصاً grep و awk.' }
    ]);
    const [newEntry, setNewEntry] = useState('');

    const handleSave = () => {
        if (!newEntry.trim()) return;
        const entry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            text: newEntry
        };
        setEntries([entry, ...entries]);
        setNewEntry('');
    };

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                مفكرة التعلم <PenTool size={20} className="text-[#7112AF]" />
            </h3>

            <div className="flex-1 overflow-y-auto max-h-[250px] mb-4 space-y-3 pr-2 custom-scrollbar">
                {entries.map((entry) => (
                    <div key={entry.id} className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <p className="text-slate-300 text-sm leading-relaxed mb-2">{entry.text}</p>
                        <span className="text-[10px] text-slate-500 font-mono block text-left">{entry.date}</span>
                    </div>
                ))}
            </div>

            <div className="relative">
                <textarea
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    placeholder="سجل خواطرك.. ماذا تعلمت اليوم؟ ما الذي أثار فضولك؟"
                    className="w-full bg-[#050214] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#7112AF] min-h-[80px] resize-none"
                />
                <button
                    onClick={handleSave}
                    disabled={!newEntry.trim()}
                    className="absolute bottom-3 left-3 p-2 bg-[#7112AF] text-white rounded-lg hover:bg-[#5a0d8e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Save size={16} />
                </button>
            </div>
        </div>
    );
};
