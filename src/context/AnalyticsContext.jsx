import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};

export const AnalyticsProvider = ({ children }) => {
    // === State ===
    // 1. Skills Mastery (0-100)
    const [skills, setSkills] = useState(() => {
        const saved = localStorage.getItem('tucc_skills');
        return saved ? JSON.parse(saved) : {
            filesystem: 10,   // Navigating, listing
            manipulation: 0,  // Creating, moving, deleting
            terminal: 5,      // General usage (clear, history)
            admin: 0          // Permissions, grep, etc
        };
    });

    // 2. Event Log (The Raw Data)
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('tucc_history');
        return saved ? JSON.parse(saved) : [];
    });

    // 3. Bash Specific Stats
    const [bashStats, setBashStats] = useState(() => {
        const saved = localStorage.getItem('tucc_bash_stats');
        return saved ? JSON.parse(saved) : {
            commandsRun: 0,
            errors: 0,
            hintsUsed: 0,
            lastActive: null
        };
    });

    // === Perspectives ===
    useEffect(() => {
        localStorage.setItem('tucc_skills', JSON.stringify(skills));
        localStorage.setItem('tucc_history', JSON.stringify(history));
        localStorage.setItem('tucc_bash_stats', JSON.stringify(bashStats));
    }, [skills, history, bashStats]);

    // === Actions ===

    // Core Logger
    const logEvent = (type, payload) => {
        const event = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type, // e.g., 'BASH_CMD', 'TASK_COMPLETE', 'ERROR'
            payload
        };

        setHistory(prev => [event, ...prev].slice(0, 100)); // Keep last 100 events

        // Update Stats based on event type
        if (type === 'BASH_CMD') {
            setBashStats(prev => ({ ...prev, commandsRun: prev.commandsRun + 1, lastActive: new Date() }));
        }
        if (type === 'BASH_ERROR') {
            setBashStats(prev => ({ ...prev, errors: prev.errors + 1 }));
        }
    };

    // Skill Update Logic
    const updateSkill = (skillId, points) => {
        setSkills(prev => {
            const current = prev[skillId] || 0;
            const newVal = Math.min(100, Math.max(0, current + points));
            return { ...prev, [skillId]: newVal };
        });
    };

    // Helper: Generate Learning Story
    const getLearningStory = () => {
        if (history.length === 0) return "لم يبدأ الطالب رحلته بعد.";

        // Simple logic to generate a narrative
        const cmds = history.filter(e => e.type === 'BASH_CMD').map(e => e.payload.command);
        const tasks = history.filter(e => e.type === 'TASK_COMPLETE');

        if (tasks.length > 0) {
            return `أنجز الطالب ${tasks.length} مهمات تدريبية، وركز مؤخراً على أوامر مثل ${cmds.slice(0, 3).join(', ')}.`;
        }

        return "بدأ الطالب باستكشاف البيئة ولكنه لا يزال في مرحلة التجربة.";
    };

    const value = {
        skills,
        history,
        bashStats,
        logEvent,
        updateSkill,
        getLearningStory
    };

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
};
