// ===================================================================
// Progress Management System
// ===================================================================
// Handles saving/loading user progress in Bash simulator

const STORAGE_KEY = 'bash_simulator_progress';

export const saveProgress = (progress) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        return true;
    } catch (error) {
        console.error('Failed to save progress:', error);
        return false;
    }
};

export const loadProgress = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load progress:', error);
    }

    // Default progress for new users
    return {
        currentLevelId: 'level-1',
        currentStageId: 'stage-1-1',
        currentTaskId: 'task-1-1-1',
        completedTasks: [],
        completedStages: [],
        completedLevels: [],
        unlockedLevels: ['level-1'],
        totalXP: 0,
        achievements: [],
        hintsUsed: {},
        taskAttempts: {},
        startedAt: Date.now(),
        lastPlayedAt: Date.now()
    };
};

export const updateProgress = (updates) => {
    const current = loadProgress();
    const updated = { ...current, ...updates, lastPlayedAt: Date.now() };
    saveProgress(updated);
    return updated;
};

export const completeTask = (taskId, xpEarned, levelId, stageId) => {
    const progress = loadProgress();

    // Don't add duplicate
    if (progress.completedTasks.includes(taskId)) {
        return progress;
    }

    const updated = {
        ...progress,
        completedTasks: [...progress.completedTasks, taskId],
        totalXP: progress.totalXP + xpEarned,
        lastPlayedAt: Date.now()
    };

    saveProgress(updated);
    return updated;
};

export const completeStage = (stageId, levelId) => {
    const progress = loadProgress();

    if (progress.completedStages.includes(stageId)) {
        return progress;
    }

    const updated = {
        ...progress,
        completedStages: [...progress.completedStages, stageId]
    };

    saveProgress(updated);
    return updated;
};

export const completeLevel = (levelId, nextLevelId) => {
    const progress = loadProgress();

    if (progress.completedLevels.includes(levelId)) {
        return progress;
    }

    const updated = {
        ...progress,
        completedLevels: [...progress.completedLevels, levelId],
        unlockedLevels: nextLevelId
            ? [...progress.unlockedLevels, nextLevelId]
            : progress.unlockedLevels
    };

    saveProgress(updated);
    return updated;
};

export const unlockAchievement = (achievementId, achievement) => {
    const progress = loadProgress();

    if (progress.achievements.some(a => a.id === achievementId)) {
        return progress;
    }

    const updated = {
        ...progress,
        achievements: [...progress.achievements, { id: achievementId, ...achievement, unlockedAt: Date.now() }]
    };

    saveProgress(updated);
    return updated;
};

export const recordHintUsed = (taskId, hintIndex) => {
    const progress = loadProgress();

    const updated = {
        ...progress,
        hintsUsed: {
            ...progress.hintsUsed,
            [taskId]: [...(progress.hintsUsed[taskId] || []), hintIndex]
        }
    };

    saveProgress(updated);
    return updated;
};

export const getLevelProgress = (levelId, completedTasks) => {
    // This will be calculated based on tasks in the level
    // Will be implemented when integrated with bashLevels.js
    return 0;
};

export const resetProgress = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return loadProgress(); // Returns default
    } catch (error) {
        console.error('Failed to reset progress:', error);
        return null;
    }
};

export const getProgressStats = () => {
    const progress = loadProgress();

    return {
        totalXP: progress.totalXP,
        tasksCompleted: progress.completedTasks.length,
        stagesCompleted: progress.completedStages.length,
        levelsCompleted: progress.completedLevels.length,
        achievementsUnlocked: progress.achievements.length,
        playTime: Date.now() - progress.startedAt,
        lastPlayed: progress.lastPlayedAt
    };
};
