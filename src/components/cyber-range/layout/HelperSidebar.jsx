import React, { useState } from 'react';
import { List, Clipboard, Bot, Flag } from 'lucide-react';
import PersistentNotepad from '../features/PersistentNotepad';
import AiMentor from '../features/AiMentor';

export default function HelperSidebar({ logs, onSolve, activeTask }) {
    const [activeTab, setActiveTab] = useState('tasks'); // tasks, mentor, notes

    return (
        <div className="h-full flex flex-col glass-panel border-l border-white/5 bg-[#08080c]/80 backdrop-blur-md w-96 shrink-0 transition-all">
            {/* Tabs */}
            <div className="flex border-b border-white/5">
                {[
                    { id: 'tasks', icon: List, label: 'Tasks' },
                    { id: 'mentor', icon: Bot, label: 'AI Mentor' },
                    { id: 'notes', icon: Clipboard, label: 'Notes' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-wider transition-all relative
                            ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-grow p-4 overflow-hidden bg-[#0c0c10]">

                {/* 1. Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div className="h-full flex flex-col gap-4 animate-fadeIn">
                        <div className="p-4 bg-gradient-to-br from-purple-900/10 to-blue-900/10 border border-white/10 rounded-xl">
                            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Flag size={16} className="text-purple-500" /> Objective
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {activeTask?.instruction || "Waiting for active mission..."}
                            </p>
                        </div>

                        {activeTask?.setup && (
                            <div className="flex-grow overflow-y-auto">
                                <h4 className="text-xs font-mono text-gray-500 uppercase mb-3">Quiz / Challenge</h4>
                                <div className="bg-[#151515] rounded-lg p-3 border border-white/5">
                                    <p className="text-sm text-gray-200 mb-4">{activeTask.setup.question}</p>
                                    <div className="space-y-2">
                                        {activeTask.setup.options.map(opt => (
                                            <div key={opt.id} className="p-2 rounded bg-black/40 border border-white/5 text-xs text-gray-400">
                                                {opt.text}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-2 bg-blue-500/10 text-blue-400 text-xs text-center rounded border border-blue-500/20">
                                        Answer via Terminal Interaction
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. AI Mentor Tab */}
                {activeTab === 'mentor' && (
                    <div className="h-full animate-fadeIn">
                        <AiMentor logs={logs} />
                    </div>
                )}

                {/* 3. Notes Tab */}
                {activeTab === 'notes' && (
                    <div className="h-full animate-fadeIn">
                        <PersistentNotepad />
                    </div>
                )}

            </div>
        </div>
    );
}
