import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Skull, Terminal, Activity, AlertTriangle, CheckCircle, Lock,
    Server, Cpu, Play, Search, Network, Radio, MessageSquare, AlertOctagon,
    XOctagon, FileText, ChevronRight, Hash, Globe, MousePointer, Siren, Wifi,
    Layout, Settings, Maximize2, Minimize2, Grid, Database, Eye, Command,
    ChevronDown, Clock, Zap
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { MatrixBackground } from '../ui/MatrixBackground';

// --- TYPEWRITER EFFECT HELPER ---
const Typewriter = ({ text, speed = 30, onComplete }) => {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayed(text.substring(0, i));
            i++;
            if (i > text.length) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text]);
    return <span>{displayed}</span>;
}

// --- SCENARIO & COMMANDS DATABASE ---
const SCENARIO_DATA = {
    defender: {
        title: "Incident Response: SmartGrid Breach",
        role: "SOC Analyst",
        objectives: [
            { id: 1, text: "Check System Logs for Anomalies", cmd_hint: "grep 'error' /var/log/syslog" },
            { id: 2, text: "Identify & Analyze Suspicious IP", cmd_hint: "whois [IP]" },
            { id: 3, text: "Block Malicious Traffic", cmd_hint: "iptables -A INPUT -s [IP] -j DROP" }
        ],
        commands: {
            'grep': {
                responses: [
                    { arg: 'error', output: "[ALERT] Connection refused on port 8080\n[CRITICAL] Unauthorized root access attempt from 45.33.22.11" },
                    { arg: 'default', output: "Usage: grep [pattern] [file]" }
                ]
            },
            'whois': {
                responses: [
                    { arg: '45.33.22.11', output: "NetRange: 45.0.0.0 - 45.255.255.255\nOrg: Unknown Proxy Service\nCountry: XK (Unknown)\nStatus: BLACKLISTED" }
                ]
            },
            'iptables': {
                responses: [
                    { arg: 'drop', output: "Chain INPUT (policy ACCEPT)\ntarget     prot opt source               destination\nDROP       all  --  45.33.22.11          0.0.0.0/0\n\n[+] Rule Applied Successfully." }
                ]
            }
        }
    },
    attacker: {
        title: "Operation: Blackout",
        role: "Red Team Operator",
        objectives: [
            { id: 1, text: "Perform Network Recon", cmd_hint: "nmap -sV 192.168.1.55" },
            { id: 2, text: "Scan for Vulnerabilities", cmd_hint: "nikto -h 192.168.1.55" },
            { id: 3, text: "Exploit & Gain Access", cmd_hint: "msfconsole -x 'use exploit/proprietary/scada_overflow'" }
        ],
        commands: {
            'nmap': {
                responses: [
                    { arg: '192.168.1.55', output: "Starting Nmap 7.92...\nHost is up (0.002s latency).\nPORT     STATE SERVICE VERSION\n80/tcp   open  http    Apache/2.4.41\n502/tcp  open  modbus  Schneider Electric\nMAC Address: 00:0C:29:4F:8E:35" }
                ]
            },
            'nikto': {
                responses: [
                    { arg: '192.168.1.55', output: "+ Server: Apache/2.4.41\n+ /admin/config.php: Found sensitive config file.\n+ CVE-2023-502: Modbus service vulnerable to Buffer Overflow." }
                ]
            },
            'msfconsole': {
                responses: [
                    { arg: 'exploit', output: "[*] Started reverse TCP handler on 10.0.0.5:4444\n[*] Sending stage (179 bytes) to 192.168.1.55\n[*] Meterpreter session 1 opened (10.0.0.5:4444 -> 192.168.1.55:51234)\n\nmeterpreter > " }
                ]
            }
        }
    }
};

export default function DualBreachSimulator() {
    const { logEvent } = useAnalytics();

    // --- STATE ---
    const [phase, setPhase] = useState('brief'); // brief, simulation, debrief
    const [role, setRole] = useState('defender'); // defender, attacker

    // Simulation State
    const [timeline, setTimeline] = useState([]);
    const [currentObjIndex, setCurrentObjIndex] = useState(0);
    const [terminalLines, setTerminalLines] = useState([]);
    const [commandInput, setCommandInput] = useState('');
    const [score, setScore] = useState(100);
    const terminalEndRef = useRef(null);

    // AI Assistant State
    const [aiMessage, setAiMessage] = useState({ text: "System Initialized. Waiting for input...", type: "info" });

    // Pre-load events
    useEffect(() => {
        if (phase === 'simulation') {
            addTimelineEvent({ time: '00:00', msg: 'Simulation Started', type: 'info' });
            setTimeout(() => {
                const initMsg = role === 'defender'
                    ? "ALERT: High latency detected on SCADA Controller."
                    : "Mission Start: Target scope is 192.168.1.1/24.";
                addTimelineEvent({ time: '00:05', msg: initMsg, type: 'alert' });
                updateAI(initMsg, 'alert');
            }, 2000);
        }
    }, [phase, role]);

    // Auto-scroll terminal
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [terminalLines]);

    // --- HELPERS ---
    const addTimelineEvent = (event) => {
        setTimeline(prev => [event, ...prev]);
    };

    const updateAI = (msg, type = 'info') => {
        setAiMessage({ text: msg, type });
    };

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        const rawCmd = commandInput.trim();
        if (!rawCmd) return;

        // Add to terminal history
        setTerminalLines(prev => [...prev, { type: 'in', text: `root@${role}:~# ${rawCmd}` }]);

        // Process Command
        processCommand(rawCmd);
        setCommandInput('');
    };

    const processCommand = (cmd) => {
        const parts = cmd.split(' ');
        const baseCmd = parts[0].toLowerCase();
        const roleData = SCENARIO_DATA[role];

        // Check if command is valid for this role
        if (!roleData.commands[baseCmd]) {
            setTimeout(() => {
                setTerminalLines(prev => [...prev, { type: 'err', text: `bash: ${baseCmd}: command not found` }]);
                setScore(s => s - 5);
                updateAI(`Unknown command '${baseCmd}'. Check your tools manual.`, 'warn');
            }, 200);
            return;
        }

        // Logic for specific objectives
        const currentObjective = roleData.objectives[currentObjIndex];
        let success = false;
        let responseText = "Command failed or incorrect arguments.";

        // Simple Keyword Matching for specific Objective
        // e.g. for grep, check if 'error' or 'var' exists
        const cmdConfig = roleData.commands[baseCmd];

        // Find matching response based on args
        const match = cmdConfig.responses.find(r => cmd.includes(r.arg)) || cmdConfig.responses.find(r => r.arg === 'default');

        if (match) {
            responseText = match.output;
            // Check if this command fulfills the current objective
            // Very simplified logic: if command helps current objective
            if (currentObjective.cmd_hint.includes(baseCmd)) { // loose check
                success = true;
            }
        }

        setTimeout(() => {
            setTerminalLines(prev => [...prev, { type: 'out', text: responseText }]);

            if (success) {
                const nextIndex = currentObjIndex + 1;
                if (nextIndex < roleData.objectives.length) {
                    setCurrentObjIndex(nextIndex);
                    updateAI(`Objective Complete. Next: ${roleData.objectives[nextIndex].text}`, 'success');
                    addTimelineEvent({ time: 'NOW', msg: `Objective [${currentObjective.id}] Completed`, type: 'success' });
                } else {
                    setPhase('debrief');
                }
            }
        }, 500);
    };

    // --- RENDERERS ---

    const renderBrief = () => (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold text-white mb-8">Command-Based Cyber Range</h1>
            <div className="grid md:grid-cols-2 gap-8 w-full">
                <button
                    onClick={() => { setRole('attacker'); setPhase('simulation'); }}
                    className="p-8 bg-red-950/20 border border-red-500/30 rounded-2xl hover:bg-red-950/40 hover:border-red-500 transition-all group"
                >
                    <Skull className="w-16 h-16 text-red-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <h2 className="text-2xl font-bold text-white mb-2">Attacker Mode</h2>
                    <p className="text-slate-400">Execute recon, exploit vulnerabilities, and gain root access using CLI tools.</p>
                </button>

                <button
                    onClick={() => { setRole('defender'); setPhase('simulation'); }}
                    className="p-8 bg-blue-950/20 border border-blue-500/30 rounded-2xl hover:bg-blue-950/40 hover:border-blue-500 transition-all group"
                >
                    <Shield className="w-16 h-16 text-blue-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <h2 className="text-2xl font-bold text-white mb-2">Defender Mode</h2>
                    <p className="text-slate-400">Analyze logs, hunt threats, and block attacks using system commands.</p>
                </button>
            </div>
        </div>
    );

    const renderSimulation = () => {
        const roleConfig = SCENARIO_DATA[role];
        const currentObj = roleConfig.objectives[currentObjIndex];

        return (
            <div className="h-full flex flex-col bg-[#050214] font-mono text-sm overflow-hidden">
                {/* HUD HEADER */}
                <div className="h-14 border-b border-white/10 bg-[#0a0a12] flex items-center justify-between px-4 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${role === 'attacker' ? 'bg-red-600/20 text-red-500' : 'bg-blue-600/20 text-blue-500'}`}>
                            {roleConfig.role}
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                            <Clock size={16} className="text-slate-500" />
                            <span className="font-bold">00:{String(30 - Math.floor(timeline.length)).padStart(2, '0')}:00</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-500 uppercase">Current Objective</span>
                            <span className="text-xs font-bold text-white animate-pulse">{currentObj.text}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                            <Activity size={16} className={score > 50 ? 'text-green-500' : 'text-red-500'} />
                            <span className="font-bold">{score} PTS</span>
                        </div>
                    </div>
                </div>

                {/* MAIN GRID WORKSPACE */}
                <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-1 p-1 bg-black overflow-hidden">

                    {/* LEFT PANEL: TIMELINE & AI (Col 1-3) */}
                    <div className="col-span-3 row-span-6 bg-[#0a0a12] border border-white/10 rounded flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-white/10 flex items-center gap-2 font-bold text-xs text-slate-400 bg-white/5">
                            <Zap size={14} className="text-yellow-500" />
                            <span>LIVE OPERATIONS</span>
                        </div>

                        {/* AI ASSISTANT BOX */}
                        <div className="p-4 border-b border-white/10 bg-blue-900/5">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-xs font-bold text-blue-400">TAIF-SEC ASSISTANT</span>
                            </div>
                            <div className={`text-xs leading-relaxed p-3 rounded border ${aiMessage.type === 'alert' ? 'bg-red-900/10 border-red-500/30 text-red-200' : 'bg-blue-900/10 border-blue-500/30 text-blue-200'}`}>
                                <Typewriter text={aiMessage.text} speed={20} />
                            </div>
                        </div>

                        {/* TIMELINE FEED */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                            {timeline.map((event, i) => (
                                <div key={i} className="flex gap-2 text-[10px] opacity-80 hover:opacity-100 transition-opacity">
                                    <span className="text-slate-500 font-mono shrink-0">[{event.time}]</span>
                                    <span className={event.type === 'alert' ? 'text-red-400' : event.type === 'success' ? 'text-green-400' : 'text-slate-300'}>
                                        {event.msg}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CENTER PANEL: TERMINAL (Col 4-9, Row 1-4) */}
                    <div className="col-span-6 row-span-4 bg-black border border-slate-800 rounded flex flex-col relative shadow-2xl">
                        <div className="h-8 bg-slate-900 flex items-center justify-between px-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-300">Terminal ({role === 'attacker' ? 'Kali Linux' : 'SecureShell'})</span>
                            </div>
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500/50" />
                                <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                <span className="w-2 h-2 rounded-full bg-green-500/50" />
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto text-xs font-mono" onClick={() => document.getElementById('cmdInput').focus()}>
                            {terminalLines.map((line, i) => (
                                <div key={i} className={`mb-1 break-words ${line.type === 'err' ? 'text-red-500' : line.type === 'in' ? 'text-white font-bold' : 'text-green-400 opacity-90'}`}>
                                    {line.text}
                                </div>
                            ))}
                            <div ref={terminalEndRef} />
                        </div>

                        {/* INPUT FIELD */}
                        <form onSubmit={handleCommandSubmit} className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                            <span className="text-green-500 font-bold shrink-0">root@sim:~#</span>
                            <input
                                id="cmdInput"
                                type="text"
                                value={commandInput}
                                onChange={(e) => setCommandInput(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs"
                                placeholder="Type command here (e.g., nmap, grep, help)..."
                                autoFocus
                                autoComplete="off"
                            />
                        </form>
                    </div>

                    {/* RIGHT PANEL: CONTEXT/MAP (Col 10-12, Row 1-4) */}
                    <div className="col-span-3 row-span-4 bg-[#0a0a12] border border-white/10 rounded flex flex-col relative overflow-hidden">
                        <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-3">
                            <span className="text-xs font-bold text-slate-300">Target Topology</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-4">
                            {/* Simplified Static Map for Visual Feedback */}
                            <div className="relative w-full h-full">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-900/20 rounded-full border border-blue-500 flex items-center justify-center animate-pulse">
                                    <Server className="text-blue-400" size={24} />
                                </div>
                                {/* Connecting Lines (CSS logic for simplicity) */}
                                <div className="absolute top-1/2 left-0 w-1/2 h-px bg-slate-700 -z-10" />
                                <div className="absolute top-1/2 right-0 w-1/2 h-px bg-slate-700 -z-10" />
                                {/* Nodes */}
                                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 p-2 bg-black border border-red-500 rounded text-red-500"><Skull size={16} /></div>
                                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 p-2 bg-black border border-slate-500 rounded text-slate-500"><Globe size={16} /></div>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM PANEL: INFO / HINTS (Col 4-12, Row 5-6) */}
                    <div className="col-span-9 row-span-2 bg-[#0a0a12] border border-white/10 rounded flex flex-col">
                        <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-3 justify-between">
                            <span className="text-xs font-bold text-slate-300">Tool Manual & Shortcuts</span>
                        </div>
                        <div className="flex-1 p-3 grid grid-cols-3 gap-3 overflow-y-auto">
                            {/* Command Shortcuts (Click to Type) */}
                            {Object.entries(roleConfig.commands).map(([cmd, data], i) => (
                                <button
                                    key={i}
                                    onClick={() => setCommandInput(cmd + ' ')}
                                    className="text-left p-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                                >
                                    <div className="text-xs font-bold text-[#7112AF] font-mono group-hover:text-white transition-colors">
                                        &gt; {cmd}
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate">
                                        Click to use
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDebrief = () => (
        <div className="h-full flex flex-col items-center justify-center p-8 animate-fadeIn text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">Scenario Completed</h2>
            <p className="text-slate-400 mb-8">You successfully handled the incident using CLI commands.</p>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                <div className="text-4xl font-bold text-white mb-1">{score}/100</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Final Score</div>
            </div>
            <button onClick={() => window.location.href = '/attacks'} className="px-8 py-3 bg-[#7112AF] text-white rounded-xl font-bold">Return to Library</button>
        </div>
    );

    return (
        <div className="h-screen w-screen bg-[#02010a] text-white overflow-hidden flex flex-col font-cairo">
            <MatrixBackground />
            <div className="flex-1 relative z-10">
                <AnimatePresence mode="wait">
                    {phase === 'brief' && renderBrief()}
                    {phase === 'simulation' && renderSimulation()}
                    {phase === 'debrief' && renderDebrief()}
                </AnimatePresence>
            </div>
        </div>
    );
}
