import React from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';

export default function BashTheoryPanel({ task }) {
    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6 text-center">
                <BookOpen size={48} className="mb-4 opacity-50" />
                <p>اختر مرحلة للبدء</p>
            </div>
        );
    }

    const { title, content, theory, instructions } = task;

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-6 font-cairo text-right" dir="rtl">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">
                {title}
            </h3>

            {/* Instructions (Task Goal) */}
            {instructions && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2 text-purple-400">
                        <AlertCircle size={16} />
                        <span className="font-bold text-sm">المهمة المطلوبة</span>
                    </div>
                    <p className="text-sm text-slate-300">
                        {instructions}
                    </p>
                </div>
            )}

            {/* Theory Content */}
            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                {theory && (
                    <div className="mb-4 bg-blue-900/20 p-4 rounded-lg border border-blue-500/10">
                        <h4 className="text-blue-400 font-bold mb-2 text-sm">مفهوم نظري:</h4>
                        <p className="text-sm leading-relaxed">{theory}</p>
                    </div>
                )}

                {content && (
                    <div
                        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
                        className="leading-relaxed"
                    />
                )}
            </div>
        </div>
    );
}
