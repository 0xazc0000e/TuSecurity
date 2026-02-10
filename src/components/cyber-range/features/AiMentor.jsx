import React, { useEffect, useRef } from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function AiMentor({ logs = [] }) {
    const scrollRef = useRef(null);

    // Mock AI responses based on keywords in the simulation logs
    // In a real app, this would query an LLM backend.

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] rounded-lg overflow-hidden border border-white/10 relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-50"></div>

            <div className="bg-[#151515] px-3 py-2 flex items-center gap-2 border-b border-white/5">
                <div className="p-1 rounded bg-purple-500/10 text-purple-400">
                    <Bot size={16} />
                </div>
                <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">AI Cyber Mentor</span>
            </div>

            <div
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
                {logs.length === 0 && (
                    <div className="text-center py-8 text-gray-600 text-sm">
                        <Sparkles size={32} className="mx-auto mb-2 opacity-20" />
                        <p>ابدأ بتنفيذ الأوامر وسأقوم بتحليل خطواتك هنا.</p>
                    </div>
                )}

                {logs.map((log, idx) => (
                    <div key={idx} className="animate-fadeIn">
                        {log.type === 'user' && (
                            <div className="flex justify-end mb-2">
                                <div className="bg-[#1f2937] text-gray-300 text-xs py-1.5 px-3 rounded-t-lg rounded-bl-lg max-w-[85%] font-mono border border-white/5">
                                    {log.text.split('#')[1] || log.text}
                                </div>
                            </div>
                        )}
                        {log.aiAnalysis && (
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
                                    <Bot size={12} />
                                </div>
                                <div className="bg-purple-900/10 border border-purple-500/20 p-3 rounded-lg text-xs leading-relaxed text-gray-300">
                                    <p className="font-bold text-purple-400 mb-1">Analysis:</p>
                                    {log.aiAnalysis}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
