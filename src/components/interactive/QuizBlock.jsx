import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizBlock = ({ quizData, onPass }) => {
    // Parse quiz data if string
    const questions = typeof quizData === 'string' ? JSON.parse(quizData || '[]') : (quizData || []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);

    // Effect to notify parent on pass
    useEffect(() => {
        if (showScore && score === questions.length && onPass) {
            onPass(true);
        }
    }, [showScore, score, questions.length, onPass]);

    if (!questions || questions.length === 0) return null;

    const handleAnswerClick = (index) => {
        if (isAnswerChecked) return; // Prevent changing answer after check
        setSelectedAnswer(index);
        setIsAnswerChecked(true);

        // Check answer
        if (index === questions[currentIndex].correctIndex) {
            setScore(prev => prev + 1);
        }

        // Auto move to next after delay
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIsAnswerChecked(false);
            } else {
                setShowScore(true);
            }
        }, 1500);
    };

    const resetQuiz = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
    };

    if (showScore) {
        return (
            <div className="my-10 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-500/30 overflow-hidden backdrop-blur text-center p-8">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-yellow-500/20 rounded-full border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
                <p className="text-indigo-200 mb-6 font-mono text-lg">
                    You scored <span className="text-green-400 font-bold">{score}</span> out of <span className="text-white">{questions.length}</span>
                </p>
                <div className="w-full bg-gray-800/50 rounded-full h-3 mb-8 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                        style={{ width: `${(score / questions.length) * 100}% ` }}
                    ></div>
                </div>
                <button
                    onClick={resetQuiz}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors border border-white/5"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retry Quiz
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="my-10 bg-[#0f111a] rounded-xl border border-indigo-500/20 overflow-hidden backdrop-blur shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 px-6 py-4 border-b border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <HelpCircle className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-indigo-100 font-bold tracking-wide">KNOWLEDGE_CHECK</span>
                </div>
                <div className="text-xs font-mono text-indigo-300 bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/10">
                    Question {currentIndex + 1} / {questions.length}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-white mb-8 leading-relaxed">
                    {currentQuestion.text}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        let optionClass = "w-full text-right p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group relative overflow-hidden ";

                        if (isAnswerChecked) {
                            if (idx === currentQuestion.correctIndex) {
                                optionClass += "bg-green-500/20 border-green-500/50 text-green-100";
                            } else if (idx === selectedAnswer) {
                                optionClass += "bg-red-500/20 border-red-500/50 text-red-100";
                            } else {
                                optionClass += "bg-gray-800/30 border-gray-700/30 text-gray-500 opacity-50";
                            }
                        } else {
                            optionClass += "bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-white hover:scale-[1.01]";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswerClick(idx)}
                                disabled={isAnswerChecked}
                                className={optionClass}
                            >
                                <span className="relative z-10">{option}</span>
                                {isAnswerChecked && idx === currentQuestion.correctIndex && (
                                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                                )}
                                {isAnswerChecked && idx === selectedAnswer && idx !== currentQuestion.correctIndex && (
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-gray-800/50">
                <motion.div
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / questions.length) * 100}% ` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
};

export default QuizBlock;
