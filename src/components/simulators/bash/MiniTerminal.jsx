import React, { useState, useEffect, useRef } from 'react';
import { executeBashCommand, resolvePath } from './bashUtils';
import { useAnalytics } from '../../../context/AnalyticsContext';

export const MiniTerminal = ({ vfs, setVfs, currentPath, setCurrentPath, setLastCommand }) => {
    const { logEvent } = useAnalytics();
    const [history, setHistory] = useState([
        { type: 'output', content: 'Welcome to TUCC Bash Simulator v2.0' },
        { type: 'output', content: 'Type "help" for available commands.' },
        { type: 'input', content: '', prompt: 'user@tucc:~$' }
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Construct prompt string based on current path
    const getPrompt = () => {
        const pathDisplay = currentPath.replace('/home/user', '~');
        return `user@tucc:${pathDisplay}$`;
    };

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const command = input.trim();
            if (!command) {
                setHistory(prev => [...prev, { type: 'input', content: '', prompt: getPrompt() }]);
                setInput('');
                return;
            }

            // 1. Add Input to History
            const newHistory = [...history, { type: 'input', content: command, prompt: getPrompt() }];

            // Analytics: Log Command Attempt
            logEvent('BASH_CMD', { command, path: currentPath });

            // 2. Execute Command
            const result = executeBashCommand(command, currentPath, vfs, 'user');

            // 3. Update State
            if (result.error) {
                newHistory.push({ type: 'error', content: result.error });
                // Analytics: Log Error
                logEvent('BASH_ERROR', { command, error: result.error });
            } else if (result.output) {
                // Handle clear command specifically if needed, or just push output
                if (result.output === 'CLEAR_SIGNAL') {
                    setHistory([{ type: 'output', content: 'Terminal cleared.' }]);
                    setInput('');
                    setLastCommand(command);
                    return;
                }
                newHistory.push({ type: 'output', content: result.output });
            }

            setVfs(result.newVfs);
            setCurrentPath(result.newPath);
            setLastCommand(command); // Trigger checks in parent

            setHistory(newHistory);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            // Check history for up arrow? (Not implemented for brevity, but good for future)
        }
    };

    return (
        <div
            className="flex-1 flex flex-col p-4 font-mono text-sm overflow-hidden cursor-text text-left"
            onClick={() => inputRef.current?.focus()}
            dir="ltr"
        >
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {history.map((line, i) => (
                    <div key={i} className="mb-1 leading-relaxed break-words text-left">
                        {line.type === 'input' ? (
                            <div className="flex gap-2">
                                <span className="text-green-500 font-bold shrink-0">{line.prompt || 'user@tucc:~$'}</span>
                                <span className="text-white">{line.content}</span>
                            </div>
                        ) : line.type === 'error' ? (
                            <div className="text-red-400 whitespace-pre-wrap">{line.content}</div>
                        ) : (
                            <div className="text-slate-300 whitespace-pre-wrap">{line.content}</div>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="flex gap-2 items-center mt-2 border-t border-white/10 pt-2 text-left">
                <span className="text-green-500 font-bold shrink-0">{getPrompt()}</span>
                <input
                    ref={inputRef}
                    id="terminal-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    autoComplete="off"
                    autoFocus
                    className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0"
                />
            </div>
        </div>
    );
};
