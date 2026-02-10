import { useState, useCallback, useEffect } from 'react';

/**
 * useSimulator Hook
 * إدارة حالة المحاكي بشكل مركزي
 */
export function useSimulator(scenarioData) {
    // الحالة الرئيسية
    const [role, setRole] = useState(null); // 'attacker' | 'defender'
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [phaseState, setPhaseState] = useState('story'); // 'story' | 'questions' | 'workspace' | 'complete'
    const [completedTasks, setCompletedTasks] = useState({});
    const [terminalHistory, setTerminalHistory] = useState([]);
    const [notes, setNotes] = useState('');
    // حالة الشبكة
    const [networkState, setNetworkState] = useState({
        nodes: [],
        discovered: [],
        compromised: [],
        blocked: []
    });

    // استرجاع الملاحظات من localStorage
    useEffect(() => {
        if (scenarioData?.id) {
            const savedNotes = localStorage.getItem(`simulator-notes-${scenarioData.id}`);
            if (savedNotes) setNotes(savedNotes);
        }
    }, [scenarioData?.id]);

    // حفظ الملاحظات تلقائياً
    useEffect(() => {
        if (scenarioData?.id && notes) {
            localStorage.setItem(`simulator-notes-${scenarioData.id}`, notes);
        }
    }, [notes, scenarioData?.id]);

    // البيانات المشتقة
    const currentPhase = scenarioData?.phases?.[currentPhaseIndex] || null;
    const totalPhases = scenarioData?.phases?.length || 0;
    const isLastPhase = currentPhaseIndex === totalPhases - 1;

    // الحصول على البيانات حسب الدور
    const getRoleData = useCallback((data) => {
        if (!data || !role) return null;
        return data[role] || data;
    }, [role]);

    // بدء المحاكاة
    const startSimulation = useCallback((selectedRole) => {
        setRole(selectedRole);
        setCurrentPhaseIndex(0);
        setPhaseState('story');
        setCompletedTasks({});
        setTerminalHistory([{ type: 'sys', text: 'Initializing simulation environment...' }]);
        setNetworkState({
            nodes: [],
            discovered: [],
            compromised: [],
            blocked: []
        });
    }, []);

    // إكمال القصة والانتقال للأسئلة
    const completeStory = useCallback(() => {
        setPhaseState('questions');
    }, []);

    // إكمال الأسئلة والانتقال للعمل
    const completeQuestions = useCallback(() => {
        setPhaseState('workspace');
    }, []);

    // إكمال المهمة
    const completeTask = useCallback((taskId, points) => {
        setCompletedTasks(prev => ({
            ...prev,
            [currentPhaseIndex]: {
                ...(prev[currentPhaseIndex] || {}),
                [taskId]: { completed: true, points }
            }
        }));
    }, [currentPhaseIndex]);

    // التحقق من إكمال المهمة
    const isTaskCompleted = useCallback((taskId) => {
        return completedTasks[currentPhaseIndex]?.[taskId]?.completed || false;
    }, [completedTasks, currentPhaseIndex]);

    // إضافة سطر للتيرمينال
    const addTerminalLine = useCallback((line) => {
        setTerminalHistory(prev => [...prev, line]);
    }, []);

    // تحديث حالة الشبكة
    const updateNetworkNode = useCallback((nodeId, status) => { // status: 'discovered' | 'compromised' | 'blocked'
        setNetworkState(prev => {
            const newState = { ...prev };
            // Remove from other lists first
            newState.discovered = newState.discovered.filter(id => id !== nodeId);
            newState.compromised = newState.compromised.filter(id => id !== nodeId);
            newState.blocked = newState.blocked.filter(id => id !== nodeId);

            // Add to new list
            if (status === 'discovered') newState.discovered.push(nodeId);
            if (status === 'compromised') newState.compromised.push(nodeId);
            if (status === 'blocked') newState.blocked.push(nodeId);

            return newState;
        });
    }, []);

    // الانتقال للمرحلة التالية
    const nextPhase = useCallback(() => {
        if (!isLastPhase) {
            setCurrentPhaseIndex(prev => prev + 1);
            setPhaseState('story');
            setTerminalHistory([{ type: 'sys', text: 'Loading next phase...' }]);
        } else {
            setPhaseState('complete');
        }
    }, [isLastPhase]);

    // حساب التقدم
    const getProgress = useCallback(() => {
        return Math.round(((currentPhaseIndex + 1) / totalPhases) * 100);
    }, [currentPhaseIndex, totalPhases]);

    // إعادة تعيين المحاكي
    const resetSimulator = useCallback(() => {
        setRole(null);
        setCurrentPhaseIndex(0);
        setPhaseState('story');
        setCompletedTasks({});
        setTerminalHistory([]);
        setNetworkState({
            nodes: [],
            discovered: [],
            compromised: [],
            blocked: []
        });
    }, []);

    return {
        // State
        role,
        currentPhase,
        currentPhaseIndex,
        phaseState,
        totalPhases,
        isLastPhase,
        completedTasks,
        terminalHistory,
        notes,
        networkState,

        // Setters
        setNotes,
        setRole,

        // Actions
        startSimulation,
        completeStory,
        completeQuestions,
        completeTask,
        isTaskCompleted,
        addTerminalLine,
        updateNetworkNode,
        nextPhase,
        getProgress,
        resetSimulator,
        getRoleData
    };
}

export default useSimulator;
