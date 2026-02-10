import React from 'react';
import { motion } from 'framer-motion';

/**
 * Character Avatar Component
 * يعرض الشخصية مع حوارها في المحاكي القصصي
 */
export const CharacterAvatar = ({ character, dialogue, position = 'left', isTyping = false }) => {
    if (!character) return null;

    const isRight = position === 'right';

    return (
        <motion.div
            initial={{ opacity: 0, x: isRight ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRight ? 50 : -50 }}
            className={`flex items-start gap-4 ${isRight ? 'flex-row-reverse' : 'flex-row'} mb-4`}
        >
            {/* Avatar */}
            <div
                className="relative flex-shrink-0"
                style={{
                    filter: `drop-shadow(0 0 10px ${character.avatar.color}40)`
                }}
            >
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 relative overflow-hidden"
                    style={{
                        borderColor: character.avatar.color,
                        background: `linear-gradient(135deg, ${character.avatar.color}20, ${character.avatar.color}05)`
                    }}
                >
                    {character.avatar.emoji}
                </div>
                {/* Badge */}
                <div
                    className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                        backgroundColor: character.avatar.color,
                        color: 'white'
                    }}
                >
                    {character.avatar.badge}
                </div>
            </div>

            {/* Dialogue Bubble */}
            <div className={`flex-1 ${isRight ? 'text-right' : 'text-left'}`}>
                {/* Name */}
                <div className="flex items-center gap-2 mb-1" style={{ flexDirection: isRight ? 'row-reverse' : 'row' }}>
                    <span className="font-bold text-white">{character.name.ar}</span>
                    <span className="text-xs text-slate-500">{character.role.ar}</span>
                </div>

                {/* Dialogue */}
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className={`
                        inline-block max-w-lg p-4 rounded-2xl text-slate-200 leading-relaxed
                        ${isRight ? 'rounded-tr-none' : 'rounded-tl-none'}
                    `}
                    style={{
                        backgroundColor: `${character.avatar.color}15`,
                        borderLeft: isRight ? 'none' : `3px solid ${character.avatar.color}`,
                        borderRight: isRight ? `3px solid ${character.avatar.color}` : 'none'
                    }}
                >
                    {isTyping ? (
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    ) : (
                        <p>{dialogue}</p>
                    )}
                </motion.div>

                {/* Signature (if applicable) */}
                {character.signature && dialogue === character.signature && (
                    <div className="mt-2 text-xs italic" style={{ color: character.avatar.color }}>
                        — العبارة المميزة
                    </div>
                )}
            </div>
        </motion.div>
    );
};

/**
 * Dialogue Sequence Component
 * يعرض سلسلة من الحوارات بتأثير كتابة تدريجي
 */
export const DialogueSequence = ({ dialogues, onComplete }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isTyping, setIsTyping] = React.useState(true);

    React.useEffect(() => {
        if (currentIndex < dialogues.length) {
            setIsTyping(true);
            const timer = setTimeout(() => {
                setIsTyping(false);
            }, 1000); // Typing animation duration

            return () => clearTimeout(timer);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, dialogues.length, onComplete]);

    const handleNext = () => {
        if (!isTyping && currentIndex < dialogues.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const currentDialogue = dialogues[currentIndex];

    if (!currentDialogue) return null;

    return (
        <div className="space-y-4" onClick={handleNext}>
            <CharacterAvatar
                character={currentDialogue.character}
                dialogue={currentDialogue.text}
                position={currentDialogue.position || 'left'}
                isTyping={isTyping}
            />

            {!isTyping && currentIndex < dialogues.length - 1 && (
                <div className="text-center">
                    <button className="text-xs text-slate-500 hover:text-slate-300 animate-pulse">
                        انقر للمتابعة...
                    </button>
                </div>
            )}
        </div>
    );
};
