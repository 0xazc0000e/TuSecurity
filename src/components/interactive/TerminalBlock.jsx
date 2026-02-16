import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

const TerminalBlock = ({ terminalConfig }) => {
    const [history, setHistory] = useState([
        { type: 'output', content: 'Secure Shell (SSH) Connection Established.' },
        { type: 'output', content: 'Welcome to TUCC-CyberOS v2.0.4 LTS' },
        { type: 'output', content: 'Type "help" for available commands.' },
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Parse config if string
    const customCommands = typeof terminalConfig === 'string' ? JSON.parse(terminalConfig || '{}') : (terminalConfig || {});

    // Virtual File System (Default)
    const [fileSystem, setFileSystem] = useState({
        '/': { type: 'dir', children: ['home', 'var', 'etc'] },
        '/home': { type: 'dir', children: ['user'] },
        '/home/user': { type: 'dir', children: ['secret.txt', 'notes.md', 'project'] },
        '/home/user/project': { type: 'dir', children: ['main.py'] },
        '/home/user/secret.txt': { type: 'file', content: 'FLAG{CYBER_WARRIOR_2026}' },
        '/home/user/notes.md': { type: 'file', content: '# My Hacking Notes\n\n1. Recon\n2. Scan\n3. Exploit' },
        '/var': { type: 'dir', children: ['log'] },
        '/etc': { type: 'dir', children: ['passwd'] }
    });

    const [currentPath, setCurrentPath] = useState('/home/user');

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    const handleCommand = (cmd) => {
        const parts = cmd.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        let output = '';

        // Check for Custom Scenario Config first
        if (customCommands[command]) {
            output = customCommands[command];
        } else {
            // Default built-in commands
            switch (command) {
                case 'help':
                    output = 'Available commands: help, ls, cd, cat, pwd, whoami, clear, echo' + (Object.keys(customCommands).length > 0 ? ', ' + Object.keys(customCommands).join(', ') : '');
                    break;
                case 'clear':
                    setHistory([]);
                    return;
                case 'whoami':
                    output = 'root';
                    break;
                case 'pwd':
                    output = currentPath;
                    break;
                case 'echo':
                    output = args.join(' ');
                    break;
                case 'ls':
                    const location = fileSystem[currentPath];
                    if (location && location.type === 'dir') {
                        output = location.children.join('  ');
                    } else {
                        output = 'Error: Cannot list directory.';
                    }
                    break;
                case 'cd':
                    if (!args[0]) {
                        setCurrentPath('/home/user');
                        break;
                    }
                    if (args[0] === '..') {
                        if (currentPath === '/') break;
                        const newPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
                        setCurrentPath(newPath);
                    } else if (args[0] === '/') {
                        setCurrentPath('/');
                    } else {
                        const target = currentPath === '/' ? `/${args[0]}` : `${currentPath}/${args[0]}`;
                        if (fileSystem[target] && fileSystem[target].type === 'dir') {
                            setCurrentPath(target);
                        } else {
                            output = `cd: ${args[0]}: No such file or directory`;
                        }
                    }
                    break;
                case 'cat':
                    if (!args[0]) {
                        output = 'Usage: cat [filename]';
                        break;
                    }
                    const filePath = currentPath === '/' ? `/${args[0]}` : `${currentPath}/${args[0]}`;
                    if (fileSystem[filePath] && fileSystem[filePath].type === 'file') {
                        output = fileSystem[filePath].content;
                    } else {
                        output = `cat: ${args[0]}: No such file or directory`;
                    }
                    break;
                default:
                    if (command !== '') {
                        output = `${command}: command not found`;
                    }
            }
        }

        if (output) {
            setHistory(prev => [...prev, { type: 'input', content: cmd }, { type: 'output', content: output }]);
        } else if (command !== '') {
            setHistory(prev => [...prev, { type: 'input', content: cmd }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <div className="my-8 rounded-lg overflow-hidden border border-green-500/30 shadow-2xl bg-black font-mono text-sm" dir="ltr">
            {/* Header */}
            <div className="bg-gray-900 px-4 py-2 border-b border-green-500/20 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-green-500" />
                    <span className="text-green-500/80 font-bold tracking-wider text-xs">INTERACTIVE_ROOT_SHELL</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
            </div>

            {/* Terminal Body */}
            <div
                className="p-4 h-[300px] overflow-y-auto cursor-text bg-black/95 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((line, i) => (
                    <div key={i} className={`${line.type === 'input' ? 'mt-2 mb-1' : 'mb-1 text-green-400/90 whitespace-pre-wrap'}`}>
                        {line.type === 'input' && (
                            <span className="text-green-500 mr-2 select-none">root@kali:{currentPath === '/home/user' ? '~' : currentPath}#</span>
                        )}
                        <span className={line.type === 'input' ? 'text-white' : ''}>{line.content}</span>
                    </div>
                ))}

                <div className="flex items-center mt-2">
                    <span className="text-green-500 mr-2 select-none">root@kali:{currentPath === '/home/user' ? '~' : currentPath}#</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none outline-none text-white flex-1 font-mono p-0 focus:ring-0"
                        autoFocus
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default TerminalBlock;
