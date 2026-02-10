import React, { useState, useEffect } from 'react';
import { Lock, Unlock, RefreshCw, Key, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALGORITHMS = [
    { id: 'base64', name: 'Base64', type: 'encoding' },
    { id: 'hex', name: 'Hexadecimal', type: 'encoding' },
    { id: 'rot13', name: 'ROT13', type: 'substitution' },
    { id: 'caesar', name: 'Caesar Cipher', type: 'substitution', shift: 3 },
];

export const CryptoBoard = ({ onSolve }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('encode'); // encode | decode
    const [selectedAlgo, setSelectedAlgo] = useState('base64');
    const [challenge, setChallenge] = useState(null);

    // Challenges
    const CHALLENGES = [
        { id: 1, type: 'decode', algo: 'base64', input: 'U2VjcmV0IFBhc3N3b3Jk', expected: 'Secret Password', hint: 'This looks like Base64 padding (=)' },
        { id: 2, type: 'decode', algo: 'rot13', input: 'uryyb jbeyq', expected: 'hello world', hint: 'Rotation by 13 positions.' },
        { id: 3, type: 'encode', algo: 'hex', input: 'admin', expected: '61646d696e', hint: 'Convert ASCII to Hex.' },
    ];

    const generateChallenge = () => {
        const random = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
        setChallenge(random);
        setInput(random.type === 'decode' ? random.input : random.input);
        setMode(random.type);
        setSelectedAlgo(random.algo); // Auto-select for learning, or hide for harder difficulty?
    };

    // Processing Logic
    useEffect(() => {
        if (!input) {
            setOutput('');
            return;
        }

        try {
            let result = '';
            if (selectedAlgo === 'base64') {
                result = mode === 'encode' ? btoa(input) : atob(input);
            } else if (selectedAlgo === 'hex') {
                if (mode === 'encode') {
                    result = input.split('').map(c => c.charCodeAt(0).toString(16)).join('');
                } else {
                    result = input.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
                }
            } else if (selectedAlgo === 'rot13') {
                result = input.replace(/[a-zA-Z]/g, (c) => {
                    const base = c <= 'Z' ? 65 : 97;
                    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
                });
            } else if (selectedAlgo === 'caesar') {
                const shift = mode === 'encode' ? 3 : -3;
                result = input.replace(/[a-zA-Z]/g, (c) => {
                    const base = c <= 'Z' ? 65 : 97;
                    return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
                });
            }
            setOutput(result);

            // Check Challenge
            if (challenge && result === challenge.expected && mode === challenge.type) {
                onSolve(challenge);
                setChallenge(null);
            }

        } catch (e) {
            setOutput('Error: Invalid Input');
        }
    }, [input, mode, selectedAlgo, challenge]);

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-[#0a0a12] p-4 rounded-xl border border-white/10">
                <div className="flex gap-2">
                    {ALGORITHMS.map(algo => (
                        <button
                            key={algo.id}
                            onClick={() => setSelectedAlgo(algo.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedAlgo === algo.id ? 'bg-[#7112AF] text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                        >
                            {algo.name}
                        </button>
                    ))}
                </div>
                <button
                    onClick={generateChallenge}
                    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-bold text-xs px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg transition-colors"
                >
                    <Trophy size={14} /> Challenge Me!
                </button>
            </div>

            {challenge && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-center justify-between"
                >
                    <div>
                        <h4 className="text-yellow-400 font-bold mb-1 flex items-center gap-2"><Lock size={16} /> Active Challenge</h4>
                        <p className="text-slate-300 text-sm">Target: <span className="font-mono bg-black/30 px-2 py-0.5 rounded text-white">{challenge.expected}</span></p>
                    </div>
                </motion.div>
            )}

            {/* Editor Area */}
            <div className="flex-1 grid md:grid-cols-[1fr,auto,1fr] gap-4">
                {/* Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-xs font-bold uppercase">Input ({mode === 'encode' ? 'Plaintext' : 'Ciphertext'})</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-[#0a0a12] border border-white/10 rounded-xl p-4 text-white font-mono text-sm resize-none focus:border-[#7112AF] outline-none transition-colors"
                        placeholder="Type here..."
                    />
                </div>

                {/* Controls */}
                <div className="flex flex-col justify-center gap-4">
                    <button
                        onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}
                        className="p-3 rounded-full bg-white/5 hover:bg-[#7112AF] text-slate-300 hover:text-white transition-all shadow-lg border border-white/5"
                    >
                        <RefreshCw size={20} className={mode === 'decode' ? 'rotate-180' : ''} />
                    </button>
                    <div className="text-[10px] text-center text-slate-500 font-mono uppercase tracking-widest rotate-90 mt-4 origin-center">
                        {mode}
                    </div>
                </div>

                {/* Output */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-xs font-bold uppercase">Output ({mode === 'encode' ? 'Ciphertext' : 'Plaintext'})</label>
                    <div className="flex-1 bg-[#050214] border border-white/10 rounded-xl p-4 text-[#d4b3ff] font-mono text-sm relative group">
                        {output}
                        {output && (
                            <button
                                onClick={() => navigator.clipboard.writeText(output)}
                                className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20 rounded text-xs transition-opacity"
                                title="Copy"
                            >
                                Copy
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
