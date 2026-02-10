import { useState, useCallback } from 'react';
import { BASH_LEVELS } from '../data/bashLevels';
import { INITIAL_VFS } from '../components/simulators/bash/bashUtils';
import {
    loadProgress,
    completeTask
} from '../utils/progressManager';

export const useBashGame = () => {
    // Persistent State
    const [progress, setProgress] = useState(loadProgress());

    // Simulator/Terminal State
    const [vfs, setVfs] = useState(INITIAL_VFS);
    const [currentPath, setCurrentPath] = useState('/home/user');
    const [commandHistory, setCommandHistory] = useState([]);
    const [lastCommand, setLastCommand] = useState('');

    // Game Flow State
    const [currentLevelId, setCurrentLevelId] = useState('level-1');
    const [currentStageId, setCurrentStageId] = useState(null);
    const [currentTaskId, setCurrentTaskId] = useState(null);

    // Derived State
    const currentLevel = BASH_LEVELS.find(l => l.id === currentLevelId);
    const currentStage = currentLevel?.stages.find(s => s.id === currentStageId);
    const currentTask = currentStage?.tasks.find(t => t.id === currentTaskId);

    // Actions
    const startStage = useCallback((stageId) => {
        setCurrentStageId(stageId);
        // Find stage data
        const stage = currentLevel?.stages.find(s => s.id === stageId);
        if (stage && stage.tasks.length > 0) {
            setCurrentTaskId(stage.tasks[0].id);
            // Reset environment for new stage
            setVfs(INITIAL_VFS);
            setCurrentPath('/home/user');
        }
    }, [currentLevel]);

    const moveToNextTask = useCallback(() => {
        if (!currentStage) return;
        const currentTaskIndex = currentStage.tasks.findIndex(t => t.id === currentTaskId);

        if (currentTaskIndex !== -1 && currentTaskIndex < currentStage.tasks.length - 1) {
            const nextTask = currentStage.tasks[currentTaskIndex + 1];
            setCurrentTaskId(nextTask.id);
        } else {
            // Stage Complete
            setCurrentStageId(null);
            setCurrentTaskId(null);
        }
    }, [currentStage, currentTaskId]);

    const handleCommand = useCallback((cmd, output) => {
        setLastCommand(cmd);

        // Validation Logic
        if (currentTask && currentTask.validation && currentTask.validation.type === 'command') {
            const isComplete = currentTask.validation.check(cmd, output, { currentPath });
            if (isComplete) {
                const xp = currentTask.xp || 10;
                const updatedProgress = completeTask(currentTaskId, xp, currentLevelId, currentStageId);
                setProgress(updatedProgress);

                // Add a small delay/feedback before moving next? 
                // For now, immediate transition for responsiveness
                // But in UI we might want to show a "Success" toast
                moveToNextTask();
                return { success: true, message: "Task Completed!" };
            }
        }
        return { success: false };
    }, [currentTask, currentPath, currentTaskId, currentLevelId, currentStageId, moveToNextTask]);

    return {
        // State
        progress,
        vfs, setVfs,
        currentPath, setCurrentPath,
        commandHistory, setCommandHistory,
        currentLevel,
        currentStage,
        currentTask,

        // Actions
        startStage,
        handleCommand,
        resetVfs: () => setVfs(INITIAL_VFS)
    };
};
