import React, { useState } from 'react';
import {
    ArrowLeft, Terminal, BookOpen, Lightbulb, Code, Zap, Shield,
    TrendingUp, Award, Clock, Target, User, Map as MapIcon,
    Search, AlertTriangle, CheckCircle, Info, Sparkles,
    ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BASH_MODULES } from '../../../data/bashModules';
import { MODULE_SUMMARY } from '../../../data/bashModulesExtended';
import { MermaidDiagram } from './MermaidDiagram';


// Icon mapping for emojis
const iconMap = {
    '🎯': <Target className="inline w-5 h-5" />,
    '💼': <User className="inline w-5 h-5" />,
    '🎭': <Sparkles className="inline w-5 h-5" />,
    '🗺️': <MapIcon className="inline w-5 h-5" />,
    '👀': <Search className="inline w-5 h-5" />,
    '🚪': <ArrowLeft className="inline w-5 h-5" />,
    '📍': <MapIcon className="inline w-5 h-5" />,
    '💡': <Lightbulb className="inline w-5 h-5 text-amber-400" />,
    '🔍': <Search className="inline w-5 h-5" />,
    '⚡': <Zap className="inline w-5 h-5 text-yellow-400" />,
    '⚠️': <AlertTriangle className="inline w-5 h-5 text-red-400" />,
    '✅': <CheckCircle className="inline w-5 h-5 text-green-400" />,
    '🔒': <Shield className="inline w-5 h-5" />,
    '🏗️': <Code className="inline w-5 h-5" />,
    '📄': <BookOpen className="inline w-5 h-5" />,
    '📋': <BookOpen className="inline w-5 h-5" />,
    '🚚': <ArrowLeft className="inline w-5 h-5" />,
    '🔥': <AlertTriangle className="inline w-5 h-5 text-red-500" />,
    '📖': <BookOpen className="inline w-5 h-5 text-blue-400" />,
    '🌍': <Target className="inline w-5 h-5 text-green-400" />,
};

// Replace emoji with icons
const replaceEmojisWithIcons = (text) => {
    if (!text) return text;

    const parts = [];
    let lastIndex = 0;
    const emojiRegex = /(🎯|💼|🎭|🗺️|👀|🚪|📍|💡|🔍|⚡|⚠️|✅|🔒|🏗️|📄|📋|🚚|🔥|📖|🌍)/g;

    let match;
    while ((match = emojiRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(iconMap[match[0]] || match[0]);
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
};

export const TheoryTab = ({ onNext, currentModuleId = 'module-1' }) => {
    const [activeSection, setActiveSection] = useState(null);

    const currentModule = BASH_MODULES.find(m => m.id === currentModuleId) || BASH_MODULES[0];

    return (
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6 md:p-8 font-cairo bg-gradient-to-br from-[#0a0a0a] via-[#0c0c0c] to-[#0a0a0a]">
            <div className="max-w-5xl mx-auto w-full">

                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 relative"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#7112AF] opacity-10 blur-[100px] rounded-full"></div>

                    <div className="relative z-10">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7112AF]/10 border border-[#7112AF]/30 text-[#7112AF] text-sm font-bold mb-4">
                            {currentModule.subtitle}
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">{currentModule.title}</h2>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            {currentModule.description}
                        </p>

                        {/* Stats Bar */}
                        <div className="flex items-center justify-center gap-6 mt-6 text-sm flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <TrendingUp size={16} className="text-blue-400" />
                                </div>
                                <span className="text-slate-300">
                                    <span className="text-blue-400 font-bold">{currentModule.difficulty}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Award size={16} className="text-purple-400" />
                                </div>
                                <span className="text-slate-300">
                                    <span className="text-purple-400 font-bold">{currentModule.xp} XP</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Clock size={16} className="text-emerald-400" />
                                </div>
                                <span className="text-slate-300">
                                    <span className="text-emerald-400 font-bold">{currentModule.estimatedTime}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Story Introduction */}
                {currentModule.story && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-amber-500/20 rounded-xl">
                                    <BookOpen size={24} className="text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                        <Target className="text-amber-400" size={20} />
                                        السيناريو التعليمي
                                    </h3>
                                    <div className="prose prose-invert max-w-none">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-3" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                                                code: ({ node, ...props }) => <code className="px-2 py-0.5 bg-black/50 text-emerald-400 rounded font-mono text-sm" {...props} />
                                            }}
                                        >
                                            {currentModule.story.intro}
                                        </ReactMarkdown>
                                    </div>
                                    {currentModule.story.context && (
                                        <div className="mt-4 pt-4 border-t border-amber-500/20">
                                            <p className="text-amber-200/80 text-sm italic flex items-center gap-2">
                                                <Lightbulb size={16} className="text-amber-400" />
                                                {currentModule.story.context}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Theory Overview */}
                {currentModule.theory?.overview && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <div className="bg-[#151515] border border-white/5 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[#7112AF]/20 rounded-lg">
                                    <Lightbulb size={20} className="text-[#7112AF]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">المفاهيم الأساسية</h3>
                            </div>

                            <div className="prose prose-invert prose-lg max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                                        p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-slate-300" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                                        code: ({ node, inline, ...props }) =>
                                            inline
                                                ? <code className="px-2 py-1 bg-black/50 text-emerald-400 rounded font-mono text-sm" {...props} />
                                                : <code className="block p-4 bg-black/50 text-emerald-400 rounded-lg font-mono text-sm my-4" {...props} />,
                                        table: ({ node, ...props }) => <table className="w-full border-collapse my-6" {...props} />,
                                        th: ({ node, ...props }) => <th className="border border-white/10 px-4 py-2 bg-[#7112AF]/20 text-white font-bold text-right" {...props} />,
                                        td: ({ node, ...props }) => <td className="border border-white/10 px-4 py-2 text-slate-300" {...props} />,
                                        blockquote: ({ node, ...props }) => <blockquote className="border-r-4 border-[#7112AF] pr-4 py-2 bg-[#7112AF]/5 rounded my-4 italic text-slate-400" {...props} />
                                    }}
                                >
                                    {currentModule.theory.overview}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Key Commands - Accordion Style */}
                {currentModule.theory?.keyCommands && (
                    <div className="space-y-4 mb-8">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Terminal className="text-[#7112AF]" size={24} />
                            الأوامر الأساسية
                        </h3>

                        {currentModule.theory.keyCommands.map((cmd, index) => (
                            <motion.div
                                key={cmd.command}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className={`bg-[#151515] border rounded-2xl overflow-hidden transition-all ${cmd.danger ? 'border-red-500/30 shadow-lg shadow-red-500/10' : 'border-white/5'
                                    }`}
                            >
                                {/* Command Header */}
                                <button
                                    onClick={() => setActiveSection(activeSection === cmd.command ? null : cmd.command)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl font-mono font-bold text-lg ${cmd.danger
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            : 'bg-[#7112AF]/20 text-[#7112AF] border border-[#7112AF]/30'
                                            }`}>
                                            {cmd.command}
                                        </div>
                                        <div className="text-right">
                                            <h4 className="font-bold text-white text-lg">{cmd.fullName}</h4>
                                            <p className="text-sm text-slate-400">{cmd.purpose}</p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-500 transition-transform ${activeSection === cmd.command ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Command Details - Expandable */}
                                <AnimatePresence>
                                    {activeSection === cmd.command && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 space-y-6 bg-black/20">

                                                {/* Analogy & Real World */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                                                        <p className="text-blue-400 text-sm font-bold mb-2 flex items-center gap-2">
                                                            <BookOpen size={16} />
                                                            التشبيه
                                                        </p>
                                                        <p className="text-slate-300 text-sm">{replaceEmojisWithIcons(cmd.analogy)}</p>
                                                    </div>
                                                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                                                        <p className="text-green-400 text-sm font-bold mb-2 flex items-center gap-2">
                                                            <Target size={16} />
                                                            في الواقع
                                                        </p>
                                                        <p className="text-slate-300 text-sm">{cmd.realWorld}</p>
                                                    </div>
                                                </div>

                                                {/* Syntax */}
                                                <div>
                                                    <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                                                        <Code size={16} />
                                                        الصيغة:
                                                    </p>
                                                    <code className="block bg-black/50 border border-white/10 rounded-lg p-3 text-emerald-400 font-mono text-sm">
                                                        {cmd.syntax}
                                                    </code>
                                                </div>

                                                {/* Examples */}
                                                {cmd.examples && cmd.examples.length > 0 && (
                                                    <div>
                                                        <p className="text-white font-bold mb-3 flex items-center gap-2">
                                                            <Lightbulb className="text-amber-400" size={18} />
                                                            أمثلة عملية:
                                                        </p>
                                                        <div className="space-y-3">
                                                            {cmd.examples.map((ex, i) => (
                                                                <div key={i} className="bg-black/30 rounded-lg p-3 border border-white/5">
                                                                    <code className="block text-emerald-400 font-mono text-sm mb-2">
                                                                        $ {ex.cmd}
                                                                    </code>
                                                                    {ex.output && (
                                                                        <code className="block text-slate-400 font-mono text-xs mb-2 pl-4 border-r-2 border-slate-600">
                                                                            {ex.output}
                                                                        </code>
                                                                    )}
                                                                    <p className="text-slate-300 text-sm">{ex.explanation}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Pro Tips */}
                                                {cmd.proTips && cmd.proTips.length > 0 && (
                                                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                                                        <p className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                                                            <Zap size={16} className="text-yellow-400" />
                                                            نصائح احترافية
                                                        </p>
                                                        <ul className="space-y-2">
                                                            {cmd.proTips.map((tip, i) => (
                                                                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                                                    <CheckCircle size={14} className="text-purple-400 mt-1 flex-shrink-0" />
                                                                    <span>{tip}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Warnings for dangerous commands */}
                                                {cmd.warnings && cmd.warnings.length > 0 && (
                                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                                        <p className="text-red-400 font-bold mb-3 flex items-center gap-2">
                                                            <AlertTriangle size={16} />
                                                            تحذيرات هامة!
                                                        </p>
                                                        <ul className="space-y-2">
                                                            {cmd.warnings.map((warn, i) => (
                                                                <li key={i} className="text-red-200 text-sm flex items-start gap-2">
                                                                    <Shield size={14} className="text-red-400 mt-1 flex-shrink-0" />
                                                                    <span>{warn}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Additional tables/diagrams */}
                                                {(cmd.optionsTable || cmd.diagram || cmd.shortcuts) && (
                                                    <div className="prose prose-invert prose-sm max-w-none">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-white mt-4 mb-3" {...props} />,
                                                                table: ({ node, ...props }) => <table className="w-full border-collapse my-4" {...props} />,
                                                                th: ({ node, ...props }) => <th className="border border-white/10 px-3 py-2 bg-[#7112AF]/20 text-white font-bold text-right text-sm" {...props} />,
                                                                td: ({ node, ...props }) => <td className="border border-white/10 px-3 py-2 text-slate-300 text-sm" {...props} />,
                                                                code: ({ node, inline, ...props }) =>
                                                                    inline
                                                                        ? <code className="px-1.5 py-0.5 bg-black/50 text-emerald-400 rounded font-mono text-xs" {...props} />
                                                                        : <code className="block p-3 bg-black/50 text-emerald-400 rounded font-mono text-xs my-2 whitespace-pre" {...props} />
                                                            }}
                                                        >
                                                            {cmd.optionsTable || cmd.diagram || cmd.shortcuts}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Learning Path Status */}
                <div className="mb-8 bg-gradient-to-r from-[#7112AF]/10 to-blue-500/10 border border-[#7112AF]/30 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="text-[#7112AF]" />
                        رحلتك التعليمية
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-black/30 rounded-xl p-4">
                            <p className="text-3xl font-bold text-[#7112AF]">{MODULE_SUMMARY.totalModules}</p>
                            <p className="text-slate-400 text-sm mt-1">وحدة تعليمية</p>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4">
                            <p className="text-3xl font-bold text-blue-400">{MODULE_SUMMARY.totalTasks}</p>
                            <p className="text-slate-400 text-sm mt-1">مهمة عملية</p>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4">
                            <p className="text-3xl font-bold text-emerald-400">{MODULE_SUMMARY.totalXP}</p>
                            <p className="text-slate-400 text-sm mt-1">نقطة خبرة</p>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4">
                            <p className="text-3xl font-bold text-amber-400">~4h</p>
                            <p className="text-slate-400 text-sm mt-1">وقت التعلم</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <button
                        onClick={onNext}
                        className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#7112AF] to-[#5a0e8c] hover:from-[#5a0e8c] hover:to-[#7112AF] text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(113,18,175,0.4)] hover:shadow-[0_0_50px_rgba(113,18,175,0.6)] hover:-translate-y-1"
                    >
                        <Terminal size={24} />
                        <span>ابدأ التدريب العملي الآن</span>
                        <ArrowLeft className="transition-transform group-hover:-translate-x-2" size={24} />
                    </button>
                    <p className="text-slate-500 text-sm mt-4 flex items-center justify-center gap-2">
                        <Sparkles size={16} className="text-purple-400" />
                        ستبدأ بالمهام التفاعلية على الترمنال الحقيقي
                    </p>
                </div>
            </div>
        </div>
    );
};
