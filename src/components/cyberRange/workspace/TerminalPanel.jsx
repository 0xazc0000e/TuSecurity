import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, HelpCircle, History, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Enhanced Terminal Panel
 * Features: command history, autocomplete hints, entity highlighting
 */
export const TerminalPanel = ({
    role,
    onCommandExecute,
    terminalLines = [],
    availableCommands = []
}) => {
    const [input, setInput] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [localHistory, setLocalHistory] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [autocompleteOptions, setAutocompleteOptions] = useState([]);

    const terminalEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [terminalLines]);

    // Handle command submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        // Add to local history
        setLocalHistory(prev => [...prev, input]);
        setHistoryIndex(-1);

        // Execute command
        if (onCommandExecute) {
            onCommandExecute(input);
        }

        // Clear input
        setInput('');
        setShowAutocomplete(false);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        // Arrow up - previous command
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (localHistory.length > 0) {
                const newIndex = historyIndex < localHistory.length - 1 ? historyIndex + 1 : historyIndex;
                setHistoryIndex(newIndex);
                setInput(localHistory[localHistory.length - 1 - newIndex]);
            }
        }

        // Arrow down - next command
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(localHistory[localHistory.length - 1 - newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
        }

        // Tab - autocomplete
        if (e.key === 'Tab' && autocompleteOptions.length > 0) {
            e.preventDefault();
            setInput(autocompleteOptions[0] + ' ');
            setShowAutocomplete(false);
        }

        // Escape - close autocomplete
        if (e.key === 'Escape') {
            setShowAutocomplete(false);
        }
    };

    // Handle input change and autocomplete
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);

        // Show autocomplete if typing command (no spaces yet)
        if (value && !value.includes(' ')) {
            const matches = availableCommands.filter(cmd =>
                cmd.toLowerCase().startsWith(value.toLowerCase())
            );

            if (matches.length > 0 && value.length > 0) {
                setAutocompleteOptions(matches);
                setShowAutocomplete(true);
            } else {
                setShowAutocomplete(false);
            }
        } else {
            setShowAutocomplete(false);
        }
    };

    // Highlight entities (IPs, ports) in output
    const highlightOutput = (text) => {
        if (!text) return text;

        // Highlight IP addresses
        let highlighted = text.replace(
            /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
            '<span class="text-cyan-400 font-bold">$&</span>'
        );

        // Highlight ports
        highlighted = highlighted.replace(
            /port\s+(\d+)|:(\d+)/gi,
            (match, p1, p2) => `<span class="text-yellow-400 font-bold">${match}</span>`
        );

        // Highlight critical keywords
        highlighted = highlighted.replace(
            /\b(ERROR|CRITICAL|WARNING|ALERT|BLACKLISTED|UNAUTHORIZED)\b/g,
            '<span class="text-red-400 font-bold animate-pulse">$&</span>'
        );

        highlighted = highlighted.replace(
            /\b(SUCCESS|ACCEPTED|ALLOWED)\b/g,
            '<span class="text-green-400 font-bold">$&</span>'
        );

        return highlighted;
    };

    return (
        <div className="h-full flex flex-col bg-black font-mono text-sm relative">
            {/* Terminal Header */}
            <div className="h-10 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center gap-2">
                    <TerminalIcon size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">
                        Terminal ({role === 'attacker' ? 'Kali Linux' : 'Ubuntu Server'})
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* History indicator */}
                    {localHistory.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <History size={12} />
                            <span>{localHistory.length} cmds</span>
                        </div>
                    )}

                    {/* Window controls */}
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                </div>
            </div>

            {/* Terminal Output */}
            <div
                className="flex-1 p-3 overflow-y-auto custom-scrollbar"
                onClick={() => inputRef.current?.focus()}
            >
                {/* Welcome message */}
                {terminalLines.length === 0 && (
                    <div className="text-slate-500 text-xs space-y-1 mb-4">
                        <div>Welcome to Cyber Range Terminal</div>
                        <div>Type 'help' for available commands</div>
                        <div>Use ↑/↓ arrows for command history</div>
                        <div className="pt-2 border-t border-slate-800" />
                    </div>
                )}

                {/* Command output lines */}
                {terminalLines.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`mb-1 ${line.type === 'input'
                                ? 'text-white font-bold'
                                : line.type === 'error'
                                    ? 'text-red-400'
                                    : line.type === 'hint'
                                        ? 'text-blue-300 italic'
                                        : 'text-green-300/90'
                            }`}
                    >
                        {line.type === 'input' ? (
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">root@{role}:~#</span>
                                <span>{line.text}</span>
                            </div>
                        ) : (
                            <pre
                                className="whitespace-pre-wrap font-mono text-xs leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: highlightOutput(line.text) }}
                            />
                        )}
                    </motion.div>
                ))}

                <div ref={terminalEndRef} />
            </div>

            {/* Autocomplete Suggestions */}
            <AnimatePresence>
                {showAutocomplete && autocompleteOptions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-12 left-3 right-3 bg-slate-800 border border-slate-600 rounded-lg p-2 shadow-xl z-10"
                    >
                        <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                            <HelpCircle size={10} />
                            <span>Available commands (press Tab):</span>
                        </div>
                        <div className="space-y-1">
                            {autocompleteOptions.slice(0, 5).map((cmd, i) => (
                                <div
                                    key={i}
                                    className="text-xs text-cyan-400 font-mono flex items-center gap-2 hover:bg-slate-700 px-2 py-1 rounded cursor-pointer"
                                    onClick={() => {
                                        setInput(cmd + ' ');
                                        setShowAutocomplete(false);
                                        inputRef.current?.focus();
                                    }}
                                >
                                    <ChevronRight size={12} className="text-slate-500" />
                                    {cmd}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Command Input */}
            <form
                onSubmit={handleSubmit}
                className="p-2 bg-slate-900 border-t border-slate-700 flex items-center gap-2 shrink-0"
            >
                <span className="text-green-500 font-bold shrink-0 text-sm">
                    root@{role}:~#
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder:text-slate-600"
                    placeholder="Type command here (e.g., nmap, grep, help)..."
                    autoFocus
                    autoComplete="off"
                />
            </form>
        </div>
    );
};
