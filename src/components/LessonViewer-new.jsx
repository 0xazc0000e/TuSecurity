import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Terminal, Layout, CheckCircle, Clock, FileText, AlertTriangle, Info, Play, ExternalLink } from 'lucide-react';

const LessonViewer = ({ lesson }) => {
    if (!lesson) return null;

    // Custom renderer for code blocks
    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <div dir="ltr" className="my-4 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
                    <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400 border-b border-gray-700 flex justify-between items-center">
                        <span>{match[1]}</span>
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                        </div>
                    </div>
                    <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        showLineNumbers={true}
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className={`${className} bg-gray-800 text-pink-400 px-1 py-0.5 rounded font-mono text-sm border border-gray-700 mx-1`} dir="ltr" {...props}>
                    {children}
                </code>
            );
        }
    };

    // Component Placeholder Replacer
    const renderContent = (content) => {
        if (!content) return <p className="text-gray-500 italic">لا يوجد محتوى لهذا الدرس.</p>;

        const parts = content.split(/(\[COMPONENT:[A-Z_]+\])/g);

        return parts.map((part, index) => {
            if (part === '[COMPONENT:TERMINAL]') {
                return (
                    <div key={index} className="my-8 bg-black rounded-lg border border-green-500/30 overflow-hidden font-mono text-sm shadow-xl" dir="ltr">
                        <div className="bg-gray-900 px-4 py-2 border-b border-green-500/20 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Terminal className="w-4 h-4 text-green-500" />
                                <span className="text-green-500/80 font-bold">TERMINAL_REF_#294</span>
                            </div>
                        </div>
                        <div className="p-6 text-green-400 min-h-[150px] bg-[#050a05]">
                            <div className="opacity-70 mb-2">Connecting to secure server...</div>
                            <div className="flex">
                                <span className="text-green-500 mr-2">root@kali:~$</span>
                                <span className="animate-pulse block w-2 h-5 bg-green-500"></span>
                            </div>
                        </div>
                    </div>
                );
            }
            if (part === '[COMPONENT:QUIZ]') {
                return (
                    <div key={index} className="my-8 bg-indigo-900/10 rounded-xl border border-indigo-500/30 overflow-hidden">
                        <div className="bg-indigo-900/30 p-4 border-b border-indigo-500/20 flex items-center">
                            <Layout className="w-5 h-5 text-indigo-400 ml-3" />
                            <h4 className="text-lg text-indigo-100 font-bold">اختبار سريع</h4>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-indigo-200/80 mb-6">تحقق من فهمك للمفاهيم السابقة قبل المتابعة.</p>
                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-lg font-bold transition-all hover:translate-y-[-2px] shadow-lg">
                                ابدأ الاختبار
                            </button>
                        </div>
                    </div>
                );
            }
            if (part === '[COMPONENT:WARNING_BOX]') {
                return (
                    <div key={index} className="my-6 bg-red-900/10 rounded-xl p-4 border-r-4 border-red-500 flex items-start">
                        <AlertTriangle className="w-6 h-6 text-red-500 ml-4 shrink-0 mt-1" />
                        <div>
                            <h4 className="text-red-400 font-bold mb-1">تحذير هام</h4>
                            <p className="text-red-200/80 text-sm leading-relaxed">يرجى الانتباه: التقنيات المذكورة هنا يجب استخدامها فقط في البيئات المصرح بها.</p>
                        </div>
                    </div>
                );
            }

            // Standard Markdown with Tailwind Typography
            return (
                <div key={index} className="markdown-content prose prose-invert prose-lg max-w-none" dir="rtl">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={components}
                        className="
                            prose-headings:text-green-400 prose-headings:font-bold prose-headings:mb-6
                            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                            prose-p:text-gray-300 prose-p:leading-8 prose-p:my-6
                            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                            prose-strong:text-white prose-strong:font-bold
                            prose-em:text-cyan-300
                            prose-ul:list-disc prose-ul:pr-6 prose-ul:text-gray-300 prose-ul:space-y-2
                            prose-ol:list-decimal prose-ol:pr-6 prose-ol:text-gray-300 prose-ol:space-y-2
                            prose-blockquote:border-r-4 prose-blockquote:border-green-500/50 prose-blockquote:bg-gray-800/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-l prose-blockquote:text-gray-300 prose-blockquote:not-italic prose-blockquote:my-6
                            prose-img:rounded-xl prose-img:border prose-img:border-gray-700 prose-img:shadow-2xl prose-img:my-8 prose-img:w-full
                            prose-hr:border-gray-700 prose-hr:my-12
                            prose-code:text-pink-400 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:border prose-code:border-gray-700
                            prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
                            table:w-full table:border-collapse table:border table:border-gray-700
                            prose-th:bg-gray-800 prose-th:border prose-th:border-gray-700 prose-th:p-3 prose-th:text-left
                            prose-td:border prose-td:border-gray-700 prose-td:p-3
                        "
                    >
                        {part}
                    </ReactMarkdown>
                </div>
            );
        });
    };

    return (
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm min-h-[600px] flex flex-col" dir="rtl">
            {/* Header */}
            <div className="p-8 border-b border-gray-800 bg-gradient-to-l from-gray-900 to-gray-800/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 p-4 opacity-5">
                    <FileText className="w-40 h-40 text-green-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center text-green-500 text-xs font-bold tracking-wider mb-4 border border-green-500/20 w-fit px-3 py-1 rounded-full bg-green-500/10">
                        <Info className="w-3 h-3 ml-2" />
                        <span>وحدة تعليمية</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                        {lesson.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        {lesson.xp_reward > 0 && (
                            <div className="flex items-center text-yellow-400 bg-yellow-400/10 px-4 py-2 rounded-lg border border-yellow-400/10">
                                <CheckCircle className="w-4 h-4 ml-2" />
                                <span className="font-bold">مكافأة: {lesson.xp_reward} XP</span>
                            </div>
                        )}
                        <div className="flex items-center text-cyan-400 bg-cyan-400/10 px-4 py-2 rounded-lg border border-cyan-400/10">
                            <Clock className="w-4 h-4 ml-2" />
                            <span>{lesson.duration || 15} دقيقة قراءة</span>
                        </div>
                        {lesson.is_interactive && (
                            <div className="flex items-center text-purple-400 bg-purple-400/10 px-4 py-2 rounded-lg border border-purple-400/10">
                                <Play className="w-4 h-4 ml-2" />
                                <span className="font-bold">تفاعلي</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Player - Responsive 16:9 Aspect Ratio */}
            {lesson.video_url && (
                <div className="bg-black border-y border-gray-800 w-full">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                        <iframe
                            src={lesson.video_url.includes('youtube') 
                                ? lesson.video_url.replace('watch?v=', 'embed/') 
                                : lesson.video_url}
                            className="absolute top-0 left-0 w-full h-full"
                            title={lesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            frameBorder="0"
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className="p-8 md:p-12 flex-1 relative bg-gray-950/30">
                <div className="relative z-10 text-gray-300 max-w-4xl mx-auto">
                    {renderContent(lesson.content)}
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800 bg-gray-900 flex justify-between items-center mt-auto">
                <span className="text-gray-600 text-xs font-mono hidden md:inline-block dir-ltr">ID: {lesson.id}</span>
                <div className="flex gap-4">
                    {lesson.external_link && (
                        <a 
                            href={lesson.external_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg flex items-center justify-center"
                        >
                            <ExternalLink className="w-4 h-4 ml-2" />
                            مصادر إضافية
                        </a>
                    )}
                    <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 ml-2" />
                        إكمال الدرس
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonViewer;
