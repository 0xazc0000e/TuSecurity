import React, { useState, useEffect, useRef } from 'react';
import { Bot, Lightbulb, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react';

export default function MentorPanel({
    messages = [],
    currentPhase,
    role,
    onAskQuestion
}) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const isAttacker = role === 'attacker';
    const accentColor = isAttacker ? 'red' : 'blue';

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getMessageIcon = (type) => {
        switch (type) {
            case 'tip': return <Lightbulb size={16} className="text-yellow-400" />;
            case 'warning': return <AlertTriangle size={16} className="text-orange-400" />;
            case 'info': return <BookOpen size={16} className="text-blue-400" />;
            case 'ethical': return <AlertTriangle size={16} className="text-purple-400" />;
            default: return <Bot size={16} className="text-purple-400" />;
        }
    };

    const getMessageStyle = (type) => {
        switch (type) {
            case 'tip': return 'bg-yellow-500/10 border-yellow-500/30';
            case 'warning': return 'bg-orange-500/10 border-orange-500/30';
            case 'info': return 'bg-blue-500/10 border-blue-500/30';
            case 'ethical': return 'bg-purple-500/10 border-purple-500/30';
            default: return 'bg-white/5 border-white/10';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && onAskQuestion) {
            onAskQuestion(input.trim());
            setInput('');
        }
    };

    return (
        <div className="h-full flex flex-col font-cairo" dir="rtl">
            {/* Header */}
            <div className="p-3 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-transparent flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20">
                        <Bot size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">المرشد الذكي</h3>
                        <p className="text-[10px] text-gray-500">يشرح لك كل خطوة</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* Initial Welcome */}
                {messages.length === 0 && (
                    <div className="text-center py-8">
                        <Bot size={48} className="mx-auto text-purple-400/50 mb-4" />
                        <p className="text-gray-500 text-sm">أنا هنا لمساعدتك!</p>
                        <p className="text-gray-600 text-xs mt-1">سأشرح لك كل أمر تنفذه</p>
                    </div>
                )}

                {/* Phase Context */}
                {currentPhase && (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="text-xs font-bold text-purple-400 mb-1">المرحلة الحالية</h4>
                        <p className="text-sm text-white">{currentPhase.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{currentPhase.concept}</p>
                    </div>
                )}

                {/* Messages */}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-lg border ${getMessageStyle(msg.type)}`}
                    >
                        <div className="flex items-start gap-2">
                            {getMessageIcon(msg.type)}
                            <div className="flex-1">
                                {msg.title && (
                                    <h4 className="text-sm font-bold text-white mb-1">{msg.title}</h4>
                                )}
                                <p className="text-sm text-gray-300 leading-relaxed">{msg.text}</p>

                                {/* Command explanation */}
                                {msg.command && (
                                    <div className="mt-2 p-2 bg-black/30 rounded font-mono text-xs" dir="ltr">
                                        <code className="text-green-400">{msg.command}</code>
                                    </div>
                                )}

                                {/* Links */}
                                {msg.links && msg.links.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {msg.links.map((link, j) => (
                                            <a
                                                key={j}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                                            >
                                                <ExternalLink size={10} />
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Ethical Reminder for Attacker */}
                {isAttacker && currentPhase?.order === 5 && (
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <div className="flex items-start gap-2">
                            <AlertTriangle size={16} className="text-purple-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-purple-400 mb-1">تذكير أخلاقي</h4>
                                <p className="text-xs text-gray-300">
                                    هذه المهارات للتعلم والدفاع فقط. استخدامها لإيذاء الآخرين جريمة يعاقب عليها القانون.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input (Optional - for asking questions) */}
            {onAskQuestion && (
                <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 flex-shrink-0">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="اسأل المرشد..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                        >
                            إرسال
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
