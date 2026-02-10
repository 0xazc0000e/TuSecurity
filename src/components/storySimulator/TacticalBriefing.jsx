import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Shield, Server, Terminal, CheckCircle } from 'lucide-react';

export default function TacticalBriefing({ role, onComplete }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});

    // Data based on role
    const questions = role === 'attacker' ? [
        {
            id: 'env',
            question: 'ما هي بيئة الهدف المتوقعة بناءً على الاستطلاع الأولي؟',
            options: [
                { id: 'cloud', label: 'Cloud Infrastructure (AWS/Azure)', icon: <Server /> },
                { id: 'scada', label: 'Industrial Control System (SCADA/OT)', icon: <Target /> },
                { id: 'web', label: 'Traditional Web Server (LAMP)', icon: <Terminal /> }
            ],
            correct: 'scada',
            feedback: 'صحيح. جامعة الطائف تستخدم شبكة ذكية (SmartGrid) وهي بيئة صناعية حساسة (OT).'
        },
        {
            id: 'tool',
            question: 'ما هي الأداة الأنسب للاستكشاف الأولي دون إثارة الشبهات؟',
            options: [
                { id: 'nmap_aggressive', label: 'Nmap -A (Aggressive Scan)', icon: <Terminal /> },
                { id: 'ping', label: 'Ping / Passive Listening', icon: <Activity /> },
                { id: 'metasploit', label: 'Metasploit Autopwn', icon: <Target /> }
            ],
            correct: 'ping',
            feedback: 'أحسنت. في البيئات الصناعية، الفحص العنيف قد يعطل الأنظمة. الهدوء مطلوب.'
        }
    ] : [
        {
            id: 'env',
            question: 'ما هو النظام الأكثر حيوية الذي يجب حمايته في هذا السيناريو؟',
            options: [
                { id: 'web', label: 'خادم الموقع الإلكتروني', icon: <Globe /> },
                { id: 'ctrl', label: 'وحدة التحكم الرئيسية (Controller)', icon: <Server /> },
                { id: 'mail', label: 'خادم البريد الطلابي', icon: <Mail /> }
            ],
            correct: 'ctrl',
            feedback: 'بالضبط. وحدة التحكم هي قلب الشبكة الذكية وحمايتها أولوية قصوى.'
        },
        {
            id: 'strategy',
            question: 'ما هي استراتيجية الدفاع الأنسب للتعامل مع حركة مرور مشبوهة؟',
            options: [
                { id: 'shutdown', label: 'إيقاف النظام فوراً', icon: <Power /> },
                { id: 'monitor', label: 'المراقبة والعزل (Containment)', icon: <Shield /> },
                { id: 'ignore', label: 'تجاهل الأمر حتى التاكد', icon: <EyeOff /> }
            ],
            correct: 'monitor',
            feedback: 'صحيح. إيقاف الأنظمة الصناعية قد يسبب أضراراً فيزيائية. العزل هو الحل الأمثل.'
        }
    ];

    const handleAnswer = (qId, optionId) => {
        setAnswers({ ...answers, [qId]: optionId });
    };

    const currentQ = questions[step];
    const isLast = step === questions.length - 1;
    const isCorrect = answers[currentQ.id] === currentQ.correct;

    return (
        <div className="h-full w-full flex items-center justify-center bg-black/90 p-8 font-cairo z-50 absolute inset-0">
            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={step}
                    className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-8 relative overflow-hidden"
                >
                    {/* Progress */}
                    <div className="flex gap-2 mb-8">
                        {questions.map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-white/10'}`} />
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">التخطيط التكتيكي: {role === 'attacker' ? 'الهجوم' : 'الدفاع'}</h2>
                    <p className="text-slate-400 mb-8">أجب بشكل صحيح لفتح المحاكي وبدء المهمة.</p>

                    <h3 className="text-xl text-white font-bold mb-6">{currentQ.question}</h3>

                    <div className="grid gap-4 mb-8">
                        {currentQ.options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => !answers[currentQ.id] && handleAnswer(currentQ.id, opt.id)}
                                className={`p-4 rounded-xl border flex items-center gap-4 transition-all text-right
                                    ${answers[currentQ.id] === opt.id
                                        ? (opt.id === currentQ.correct
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                            : 'bg-red-500/20 border-red-500 text-red-300')
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'}
                                `}
                            >
                                <span className="text-2xl opacity-80">{opt.icon}</span>
                                <span className="font-bold">{opt.label}</span>
                                {answers[currentQ.id] === opt.id && (
                                    <span className="mr-auto">
                                        {opt.id === currentQ.correct ? <CheckCircle /> : <XCircle />}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {answers[currentQ.id] && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg mb-6 text-blue-300 text-sm"
                        >
                            {answers[currentQ.id] === currentQ.correct ? currentQ.feedback : 'إجابة خاطئة. حاول التفكير في طبيعة الأنظمة الصناعية.'}
                        </motion.div>
                    )}

                    <div className="flex justify-end">
                        {answers[currentQ.id] === currentQ.correct && (
                            <button
                                onClick={() => {
                                    if (isLast) onComplete();
                                    else setStep(step + 1);
                                }}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                            >
                                {isLast ? 'بدء المحاكاة' : 'التالي'}
                            </button>
                        )}
                        {answers[currentQ.id] && answers[currentQ.id] !== currentQ.correct && (
                            <button
                                onClick={() => setAnswers({ ...answers, [currentQ.id]: null })}
                                className="px-6 py-2 text-slate-400 hover:text-white"
                            >
                                المحاولة مجدداً
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Simple Icon Components for specific usage here
const Activity = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const Globe = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const Mail = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const Power = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>;
const EyeOff = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const XCircle = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
