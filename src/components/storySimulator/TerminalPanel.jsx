import React, { useState, useEffect, useRef } from 'react';
import { executeAttackCommand } from './attackUtils'; // We'll create this

export default function TerminalPanel({ role, onCommand }) {
    const [history, setHistory] = useState([
        { type: 'system', text: 'SmartGrid Security Terminal v2.1' },
        { type: 'system', text: `Mode: ${role === 'defender' ? 'Defense' : 'Educational Red Team'}` },
        { type: 'hint', text: 'Type "help" for available commands.' }
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            if (!cmd) return;

            // 1. Add Input to History
            const newHistory = [...history, { type: 'input', text: cmd }];

            // 2. Execute Command (Local Simulation)
            // We'll trust attackUtils to give us some realistic looking output
            const output = executeAttackCommand(cmd, role);
            if (output) {
                newHistory.push({ type: 'output', text: output });
            }

            // 3. Game Validation
            if (onCommand) {
                onCommand(cmd);
            }

            setHistory(newHistory);
            setInput('');
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#0c0c0c] p-4 font-mono text-xs md:text-sm text-slate-300 overflow-hidden" dir="ltr">
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                {history.map((line, i) => (
                    <div key={i} className={`break-words leading-tight
                        ${line.type === 'input' ? 'text-white font-bold mt-2' : ''}
                        ${line.type === 'system' ? 'text-green-500' : ''}
                        ${line.type === 'error' ? 'text-red-400' : ''}
                        ${line.type === 'hint' ? 'text-yellow-500 italic' : ''}
                        ${line.type === 'output' ? 'text-slate-400 whitespace-pre-wrap' : ''}
                    `}>
                        {line.type === 'input' ? <span className="text-green-500 mr-2">$</span> : null}
                        {line.text}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                <span className="text-green-500 font-bold">$</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none text-white placeholder-slate-600"
                    placeholder="Enter command..."
                    autoFocus
                    autoComplete="off"
                />
            </div>
        </div>
    );
}
