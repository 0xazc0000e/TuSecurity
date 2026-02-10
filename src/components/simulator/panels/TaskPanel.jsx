import React, { useState } from 'react';
import { CheckCircle, Circle, Lock, Lightbulb, Eye, EyeOff, Flag, Send } from 'lucide-react';

export default function TaskPanel({
    tasks = [],
    questions = [],
    completedTasks = {},
    onTaskComplete,
    onQuestionAnswer,
    onUseHint,
    role
}) {
    const [flagInputs, setFlagInputs] = useState({});
    const [revealedHints, setRevealedHints] = useState({});
    const [answeredQuestions, setAnsweredQuestions] = useState({});

    const isAttacker = role === 'attacker';
    const accentColor = isAttacker ? 'red' : 'blue';

    const handleFlagSubmit = (taskId, validation) => {
        const input = flagInputs[taskId]?.toLowerCase().trim();
        if (input && validation) {
            // Simple validation - check if input contains required text
            const isCorrect = input.includes(validation.command) ||
                input.includes(validation.outputContains?.toLowerCase() || '');
            if (isCorrect) {
                onTaskComplete(taskId);
            }
        }
    };

    const handleHintReveal = (taskId, cost) => {
        if (!revealedHints[taskId]) {
            setRevealedHints(prev => ({ ...prev, [taskId]: true }));
            onUseHint(cost);
        }
    };

    const handleQuestionAnswer = (questionId, option, isCorrect) => {
        setAnsweredQuestions(prev => ({ ...prev, [questionId]: { selected: option.id, correct: isCorrect } }));
        onQuestionAnswer(questionId, isCorrect);
    };

    return (
        <div className="h-full flex flex-col font-cairo overflow-hidden" dir="rtl">
            {/* Header */}
            <div className="p-3 border-b border-white/10 bg-black/30 flex-shrink-0">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Flag size={16} className={`text-${accentColor}-400`} />
                    المهام والأسئلة
                </h3>
                <p className="text-xs text-gray-500 mt-1">أكمل المهام للتقدم في المرحلة</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Questions Section */}
                {questions.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">الأسئلة</h4>
                        {questions.map(q => {
                            const answered = answeredQuestions[q.id];
                            return (
                                <div key={q.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                    <p className="text-sm text-white mb-3">{q.question}</p>
                                    <div className="space-y-2">
                                        {q.options.map(opt => (
                                            <button
                                                key={opt.id}
                                                disabled={answered}
                                                onClick={() => handleQuestionAnswer(q.id, opt, opt.correct)}
                                                className={`w-full p-2 rounded-lg border text-right text-sm transition-all flex items-center justify-between
                                                    ${answered
                                                        ? answered.selected === opt.id
                                                            ? opt.correct
                                                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                                                : 'bg-red-500/20 border-red-500 text-red-400'
                                                            : opt.correct && answered.selected !== opt.id
                                                                ? 'bg-green-500/10 border-green-500/50 text-green-400/70'
                                                                : 'bg-white/5 border-white/5 text-gray-500'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                                    }`}
                                            >
                                                <span>{opt.text}</span>
                                                {answered && answered.selected === opt.id && (
                                                    opt.correct ? <CheckCircle size={16} /> : <Circle size={16} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {answered && q.explanation && (
                                        <div className="mt-3 p-2 bg-purple-500/10 rounded-lg border border-purple-500/30">
                                            <p className="text-xs text-purple-300">{q.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Tasks Section */}
                {tasks.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">المهام</h4>
                        {tasks.map(task => {
                            const isCompleted = completedTasks[task.id];
                            const isHidden = task.hidden && !task.type === 'bonus';
                            const hintRevealed = revealedHints[task.id];

                            if (isHidden) return null;

                            return (
                                <div
                                    key={task.id}
                                    className={`rounded-lg p-3 border transition-all
                                        ${isCompleted
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : task.type === 'bonus'
                                                ? 'bg-yellow-500/5 border-yellow-500/20'
                                                : 'bg-white/5 border-white/10'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-1 rounded ${isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                                            {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className={`text-sm font-medium ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                                                    {task.description}
                                                </p>
                                                {task.type === 'bonus' && (
                                                    <span className="px-1.5 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 rounded font-bold">
                                                        لغز
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">+{task.points} نقطة</p>

                                            {/* Hint */}
                                            {task.hints && task.hints.length > 0 && !isCompleted && (
                                                <div className="mt-2">
                                                    {hintRevealed ? (
                                                        <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                                                            <p className="text-xs text-yellow-300">{task.hints[0].text}</p>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleHintReveal(task.id, task.hints[0].cost)}
                                                            className="flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-400"
                                                        >
                                                            <Lightbulb size={12} />
                                                            تلميح (-{task.hints[0].cost} نقطة)
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Flag Input */}
                                            {!isCompleted && (
                                                <div className="mt-2 flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="أدخل الأمر أو النتيجة..."
                                                        value={flagInputs[task.id] || ''}
                                                        onChange={(e) => setFlagInputs(prev => ({ ...prev, [task.id]: e.target.value }))}
                                                        className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                                                        dir="ltr"
                                                    />
                                                    <button
                                                        onClick={() => handleFlagSubmit(task.id, task.validation)}
                                                        className={`px-2 py-1 rounded bg-${accentColor}-500/20 text-${accentColor}-400 hover:bg-${accentColor}-500/30 transition-colors`}
                                                    >
                                                        <Send size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
