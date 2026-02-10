import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Trash2 } from 'lucide-react';

export default function TerminalPanel({
    history = [],
    onCommand,
    config = {},
    role,
    disabled = false,
    availableCommands = []
}) {
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const terminalRef = useRef(null);
    const inputRef = useRef(null);

    const isAttacker = role === 'attacker';
    const prompt = config.prompt || (isAttacker ? 'root@kali:~#' : 'admin@soc:~$');

    // Auto-scroll
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Focus on click
    const handleTerminalClick = () => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            const cmd = input.trim();

            // Add to command history
            setCommandHistory(prev => [...prev, cmd]);
            setHistoryIndex(-1);

            // Execute command
            onCommand(cmd);
            setInput('');
        }

        // Autocomplete
        if (e.key === 'Tab') {
            e.preventDefault();
            if (input.trim()) {
                const match = availableCommands.find(cmd => cmd.startsWith(input));
                if (match) {
                    setInput(match);
                }
            }
        }

        // Command history navigation
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    const getLineClass = (type) => {
        switch (type) {
            case 'user': return 'text-white font-bold';
            case 'success': return 'text-green-400';
            case 'error': return 'text-red-400';
            case 'warning': return 'text-yellow-400';
            case 'info': return 'text-blue-400';
            case 'sys': return 'text-gray-500 italic';
            default: return 'text-gray-300';
        }
    };

    const formatOutput = (text) => {
        // Highlight IPs
        const parts = text.split(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g);
        return parts.map((part, i) => {
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(part)) {
                return <span key={i} className="text-cyan-400 font-bold">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div className="h-full flex flex-col bg-[#0d1117] rounded-lg border border-gray-800 overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800" dir="ltr">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono mr-3">
                        <Terminal size={12} className="inline mr-1" />
                        {isAttacker ? 'attacker-terminal' : 'soc-terminal'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigator.clipboard.writeText(history.map(l => l.text).join('\n'))}
                        className="p-1 text-gray-500 hover:text-white transition-colors"
                        title="Copy output"
                    >
                        <Copy size={14} />
                    </button>
                </div>
            </div>

            {/* Terminal Body */}
            <div
                ref={terminalRef}
                onClick={handleTerminalClick}
                className="flex-1 p-4 font-mono text-sm overflow-y-auto cursor-text"
                dir="ltr"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#374151 #0d1117'
                }}
            >
                {history.map((line, i) => (
                    <div key={i} className={`mb-1 ${getLineClass(line.type)}`}>
                        {line.type === 'user' ? (
                            <span>
                                <span className={isAttacker ? 'text-red-500' : 'text-blue-500'}>{prompt}</span> {line.text}
                            </span>
                        ) : (
                            <span>
                                <span className={isAttacker ? 'text-red-600' : 'text-blue-600'}>➜</span> {formatOutput(line.text)}
                            </span>
                        )}
                    </div>
                ))}

                {/* Input Line */}
                {!disabled && (
                    <div className="flex items-center mt-1">
                        <span className={isAttacker ? 'text-red-500' : 'text-blue-500'}>{prompt}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent outline-none border-none text-white ml-2 caret-white"
                            spellCheck={false}
                            autoComplete="off"
                            autoFocus
                        />
                        <span className="w-2 h-5 bg-white/70 animate-pulse ml-0.5"></span>
                    </div>
                )}
            </div>

            {/* Hint Bar */}
            {config.hint && (
                <div className="px-4 py-2 bg-yellow-500/10 border-t border-yellow-500/30" dir="ltr">
                    <p className="text-xs text-yellow-400 font-mono">
                        💡 Hint: <code className="bg-black/30 px-1 rounded">{config.hint}</code>
                    </p>
                </div>
            )}
        </div>
    );
}
