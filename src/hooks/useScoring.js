import { useState, useCallback, useEffect } from 'react';

/**
 * useScoring Hook
 * نظام النقاط والتقييم
 */
export function useScoring(scenarioId, initialXP = 0) {
    const [score, setScore] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [bonusTasksCompleted, setBonusTasksCompleted] = useState(0);
    const [timeBonus, setTimeBonus] = useState(0);

    // استرجاع النقاط المحفوظة
    useEffect(() => {
        if (scenarioId) {
            const savedScore = localStorage.getItem(`simulator-score-${scenarioId}`);
            if (savedScore) {
                const parsed = JSON.parse(savedScore);
                setScore(parsed.score || 0);
                setHintsUsed(parsed.hintsUsed || 0);
            }
        }
    }, [scenarioId]);

    // إضافة نقاط
    const addPoints = useCallback((points, reason) => {
        setScore(prev => {
            const newScore = prev + points;
            console.log(`+${points} points: ${reason}`);
            return newScore;
        });
    }, []);

    // خصم نقاط (للتلميحات أو الأخطاء)
    const deductPoints = useCallback((points, reason) => {
        setScore(prev => {
            const newScore = Math.max(0, prev - points);
            console.log(`-${points} points: ${reason}`);
            return newScore;
        });
    }, []);

    // استخدام تلميح
    const useHint = useCallback((cost = 25) => {
        setHintsUsed(prev => prev + 1);
        deductPoints(cost, 'Hint used');
        return true;
    }, [deductPoints]);

    // تسجيل إجابة خاطئة
    const recordWrongAnswer = useCallback((penalty = 10) => {
        setWrongAnswers(prev => prev + 1);
        deductPoints(penalty, 'Wrong answer');
    }, [deductPoints]);

    // إكمال مهمة أساسية
    const completeRequiredTask = useCallback((points = 100) => {
        addPoints(points, 'Required task completed');
    }, [addPoints]);

    // إكمال مهمة إضافية (لغز)
    const completeBonusTask = useCallback((points = 200) => {
        setBonusTasksCompleted(prev => prev + 1);
        addPoints(points, 'Bonus task completed');
    }, [addPoints]);

    // إجابة صحيحة من أول مرة
    const correctFirstTry = useCallback((points = 50) => {
        addPoints(points, 'Correct on first try');
    }, [addPoints]);

    // مكافأة الوقت
    const applyTimeBonus = useCallback((estimatedMinutes, actualMinutes) => {
        if (actualMinutes < estimatedMinutes) {
            const bonus = Math.round((estimatedMinutes - actualMinutes) * 10);
            setTimeBonus(bonus);
            addPoints(bonus, 'Time bonus');
        }
    }, [addPoints]);

    // حفظ النقاط
    const saveScore = useCallback(() => {
        if (scenarioId) {
            localStorage.setItem(`simulator-score-${scenarioId}`, JSON.stringify({
                score,
                hintsUsed,
                wrongAnswers,
                bonusTasksCompleted,
                timeBonus,
                completedAt: new Date().toISOString()
            }));
        }
    }, [scenarioId, score, hintsUsed, wrongAnswers, bonusTasksCompleted, timeBonus]);

    // إرسال للملف الشخصي (mock)
    const submitToProfile = useCallback(() => {
        const finalData = {
            scenarioId,
            score,
            hintsUsed,
            wrongAnswers,
            bonusTasksCompleted,
            timeBonus,
            totalXP: score,
            completedAt: new Date().toISOString()
        };

        // حفظ في localStorage (يمكن استبداله بـ API لاحقاً)
        const profileData = JSON.parse(localStorage.getItem('profile-xp') || '{}');
        profileData[scenarioId] = finalData;
        profileData.totalXP = (profileData.totalXP || 0) + score;
        localStorage.setItem('profile-xp', JSON.stringify(profileData));

        console.log('Score submitted to profile:', finalData);
        return finalData;
    }, [scenarioId, score, hintsUsed, wrongAnswers, bonusTasksCompleted, timeBonus]);

    // حساب الملخص
    const getSummary = useCallback(() => {
        return {
            totalScore: score,
            hintsUsed,
            wrongAnswers,
            bonusTasksCompleted,
            timeBonus,
            grade: score >= 800 ? 'A' : score >= 600 ? 'B' : score >= 400 ? 'C' : 'D'
        };
    }, [score, hintsUsed, wrongAnswers, bonusTasksCompleted, timeBonus]);

    // إعادة تعيين
    const resetScoring = useCallback(() => {
        setScore(0);
        setHintsUsed(0);
        setWrongAnswers(0);
        setBonusTasksCompleted(0);
        setTimeBonus(0);
    }, []);

    return {
        // State
        score,
        hintsUsed,
        wrongAnswers,
        bonusTasksCompleted,
        timeBonus,

        // Actions
        addPoints,
        deductPoints,
        useHint,
        recordWrongAnswer,
        completeRequiredTask,
        completeBonusTask,
        correctFirstTry,
        applyTimeBonus,
        saveScore,
        submitToProfile,
        getSummary,
        resetScoring
    };
}

export default useScoring;
