import React, { useState, useRef, useEffect } from 'react';

export const NetworkTerminal = ({ commands, onCommand }) => {
    const [input, setInput] = useState('');
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [commands]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (input.trim()) {
                onCommand(input);
                setInput('');
            }
        }
    };

    return (
        <div className="flex-1 bg-[#0a0a12] border border-white/10 rounded-xl p-4 font-mono text-sm overflow-hidden flex flex-col shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-xs text-slate-500 ml-2">kali@tucc-lab:~</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar text-slate-300">
                <div className="text-slate-500 mb-2">Welcome to TUCC Network Lab. Type 'help' for commands.</div>
                {commands.map((entry, i) => (
                    <div key={i} className="mb-2">
                        <div className="flex gap-2 text-white">
                            <span className="text-green-400">➜</span>
                            <span className="text-blue-400">~</span>
                            <span>{entry.cmd}</span>
                        </div>
                        <div className="text-slate-400 whitespace-pre-wrap pl-4 border-l-2 border-white/5 mt-1">{entry.output}</div>
                    </div>
                ))}

                <div className="flex gap-2 items-center text-white mt-2">
                    <span className="text-green-400">➜</span>
                    <span className="text-blue-400">~</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent outline-none flex-1 text-white placeholder-slate-600"
                        autoFocus
                    />
                </div>
                <div ref={endRef} />
            </div>
        </div>
    );
};
