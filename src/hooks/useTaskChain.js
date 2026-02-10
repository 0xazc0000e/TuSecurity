import { useState, useCallback, useEffect } from 'react';

/**
 * Task Chain Hook
 * Manages task dependencies, progression, and output flow between tasks
 */
export const useTaskChain = ({ chapter, role, scenarioData }) => {
    const [completedTasks, setCompletedTasks] = useState([]);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [taskOutputs, setTaskOutputs] = useState({});
    const [collectedEntities, setCollectedEntities] = useState({
        ips: [],
        ports: [],
        services: [],
        files: [],
        threats: []
    });

    // Initialize with first task
    useEffect(() => {
        if (scenarioData?.tasks && !currentTaskId) {
            const firstTask = scenarioData.tasks.find(t => t.order === 1);
            if (firstTask) {
                setCurrentTaskId(firstTask.id);
            }
        }
    }, [scenarioData, currentTaskId]);

    /**
     * Get current task object
     */
    const getCurrentTask = useCallback(() => {
        if (!scenarioData?.tasks || !currentTaskId) return null;
        return scenarioData.tasks.find(t => t.id === currentTaskId);
    }, [scenarioData, currentTaskId]);

    /**
     * Check if a task is completed
     */
    const isTaskComplete = useCallback((taskId) => {
        return completedTasks.includes(taskId);
    }, [completedTasks]);

    /**
     * Check if a task is unlocked (prerequisites met)
     */
    const isTaskUnlocked = useCallback((taskId) => {
        const task = scenarioData?.tasks?.find(t => t.id === taskId);
        if (!task) return false;

        // First task is always unlocked
        if (task.order === 1) return true;

        // Check if prerequisite is completed
        if (task.prerequisite) {
            return completedTasks.includes(task.prerequisite);
        }

        return true;
    }, [scenarioData, completedTasks]);

    /**
     * Mark entity as collected (from command output)
     */
    const collectEntity = useCallback((type, value) => {
        setCollectedEntities(prev => ({
            ...prev,
            [type]: [...new Set([...prev[type], value])]
        }));
    }, []);

    /**
     * Check if current task success criteria are met
     */
    const checkTaskCompletion = useCallback((commandsUsed, entitiesFound) => {
        const currentTask = getCurrentTask();
        if (!currentTask || !currentTask.successCriteria) return false;

        const { successCriteria } = currentTask;

        // Check commands used
        if (successCriteria.commandsUsed) {
            const hasAllCommands = successCriteria.commandsUsed.every(cmd =>
                commandsUsed.some(used => used.includes(cmd))
            );
            if (!hasAllCommands) return false;
        }

        // Check minimum command count
        if (successCriteria.minimumCommandCount) {
            if (commandsUsed.length < successCriteria.minimumCommandCount) {
                return false;
            }
        }

        // Check entities found
        if (successCriteria.entitiesFound) {
            // Check IPs
            if (successCriteria.entitiesFound.ips) {
                const hasAllIPs = successCriteria.entitiesFound.ips.every(ip =>
                    collectedEntities.ips.includes(ip)
                );
                if (!hasAllIPs) return false;
            }

            // Check ports
            if (successCriteria.entitiesFound.ports) {
                const hasAllPorts = successCriteria.entitiesFound.ports.every(port =>
                    collectedEntities.ports.includes(port)
                );
                if (!hasAllPorts) return false;
            }

            // Check services
            if (successCriteria.entitiesFound.services) {
                const hasAllServices = successCriteria.entitiesFound.services.every(service =>
                    collectedEntities.services.includes(service)
                );
                if (!hasAllServices) return false;
            }

            // Check reputation
            if (successCriteria.entitiesFound.reputation) {
                // Special check for reputation data
                return true; // Simplified for now
            }

            // Check status
            if (successCriteria.entitiesFound.status) {
                return true; // Simplified
            }
        }

        return true;
    }, [getCurrentTask, collectedEntities]);

    /**
     * Complete current task and unlock next
     */
    const completeTask = useCallback((taskId, outputs) => {
        if (!taskId) return;

        // Mark as completed
        setCompletedTasks(prev => [...new Set([...prev, taskId])]);

        // Store task outputs for next task
        if (outputs) {
            setTaskOutputs(prev => ({
                ...prev,
                [taskId]: outputs
            }));
        }

        // Find and unlock next task
        const currentTask = scenarioData?.tasks?.find(t => t.id === taskId);
        if (currentTask) {
            const nextTask = scenarioData.tasks.find(t => t.order === currentTask.order + 1);
            if (nextTask) {
                setCurrentTaskId(nextTask.id);
            }
        }
    }, [scenarioData]);

    /**
     * Get output from a previous task (for task chaining)
     */
    const getPreviousTaskOutput = useCallback((taskId, field) => {
        return taskOutputs[taskId]?.[field];
    }, [taskOutputs]);

    /**
     * Get progress percentage
     */
    const getProgress = useCallback(() => {
        if (!scenarioData?.tasks) return 0;
        return Math.round((completedTasks.length / scenarioData.tasks.length) * 100);
    }, [scenarioData, completedTasks]);

    return {
        currentTask: getCurrentTask(),
        currentTaskId,
        completedTasks,
        isTaskComplete,
        isTaskUnlocked,
        collectEntity,
        collectedEntities,
        checkTaskCompletion,
        completeTask,
        getPreviousTaskOutput,
        getProgress
    };
};
