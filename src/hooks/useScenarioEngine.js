import { useState, useCallback, useEffect } from 'react';
import { CHAPTER_1_SCENARIOS } from '../data/cyberRange/chapter1Scenarios';

// Initial World State
const INITIAL_WORLD_STATE = {
    networkVisible: false,
    discoveredHosts: [],
    scannedPorts: {},
    compromisedHosts: [],
    defensiveAlertLevel: 0, // 0-100
    detected: false
};

export const useScenarioEngine = (role = 'attacker') => { // 'attacker' or 'defender'
    const [currentScenario, setCurrentScenario] = useState(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [worldState, setWorldState] = useState(INITIAL_WORLD_STATE);
    const [feedback, setFeedback] = useState(null);
    const [terminalOutput, setTerminalOutput] = useState([]);

    // Load Scenario on Mount or Role Change
    useEffect(() => {
        const scenario = CHAPTER_1_SCENARIOS[role];
        if (scenario) {
            setCurrentScenario(scenario);
            setCurrentStepIndex(0);
            setCompletedSteps([]);
            setWorldState(INITIAL_WORLD_STATE);
            setFeedback({ type: 'info', message: 'Scenario loaded. Check your briefing.' });
        }
    }, [role]);

    const currentStep = currentScenario?.tasks[currentStepIndex];

    // Core Validation Logic
    const validateAction = useCallback((actionType, payload) => {
        if (!currentStep) return;

        console.log('Validating:', actionType, payload, currentStep);

        let success = false;
        let message = '';
        let nextState = { ...worldState };

        // 1. Command Validation
        if (actionType === 'COMMAND') {
            const cmd = payload.command.trim().toLowerCase();
            const requiredCommands = currentStep.successCriteria?.commandsUsed || [];

            // Check if command is relevant to current step
            const isRelevant = requiredCommands.some(req => cmd.startsWith(req));

            if (isRelevant) {
                // Simulate Command Effect on World State
                if (cmd.startsWith('ping') && currentStep.outputs?.aliveHosts) {
                    nextState.networkVisible = true;
                    // Add found hosts to discovered list if not already
                    const newHosts = currentStep.outputs.aliveHosts.filter(h => !nextState.discoveredHosts.includes(h));
                    nextState.discoveredHosts = [...nextState.discoveredHosts, ...newHosts];
                    message = 'Host discovered!';
                    success = true;
                }

                if (cmd.startsWith('nmap') && currentStep.outputs?.openPorts) {
                    // Update scanned ports for discovered hosts
                    // We assume scanning the target IP
                    const targetIP = currentStep.inputFromPrevious?.field === 'aliveHosts' ? '192.168.1.55' : null; // simplified
                    if (targetIP) {
                        nextState.scannedPorts = {
                            ...nextState.scannedPorts,
                            [targetIP]: currentStep.outputs.openPorts
                        };
                        message = 'Ports scan complete. Services identified.';
                        success = true;
                    }
                }

                if (cmd.startsWith('whois')) {
                    message = 'Intelligence gathered.';
                    success = true;
                }

                if (cmd.startsWith('grep') || cmd.startsWith('tail')) {
                    message = 'Log analysis complete.';
                    success = true;
                }
            }
        }

        // 2. Answer/Flag Validation (CTF Style)
        if (actionType === 'ANSWER') {
            // Not yet fully implemented in data, but structure would be:
            // currentStep.validation.correctAnswer === payload.answer
            // For now, we assume if they found the info, they pass for "interactive" tasks that don't required explicit text input in this iteration
            // But if specific input is needed:
            // NOTE: Current tasks are mostly command-based validation in data.
        }

        // 3. Decision Validation
        if (actionType === 'DECISION') {
            const choice = currentStep.choices?.find(c => c.id === payload.choiceId);
            if (choice) {
                success = true;
                message = choice.consequence[role === 'attacker' ? 'ar' : 'ar']; // Localize later
                // Apply modifiers
                // nextState.defensiveAlertLevel += ...
            }
        }

        // Check Completion
        if (success) {
            setWorldState(nextState);
            completeStep();
            setFeedback({ type: 'success', message: message || 'Objective Complete!' });
        } else {
            // Maybe provide hint if command was wrong but close?
        }

    }, [currentStep, worldState, role]);

    const completeStep = () => {
        if (!currentStep) return;

        if (!completedSteps.includes(currentStep.id)) {
            setCompletedSteps(prev => [...prev, currentStep.id]);

            // Move to next step after delay
            setTimeout(() => {
                if (currentStepIndex < currentScenario.tasks.length - 1) {
                    setCurrentStepIndex(prev => prev + 1);
                } else {
                    setFeedback({ type: 'completion', message: 'Chapter Complete!' });
                }
            }, 1500);
        }
    };

    return {
        scenario: currentScenario,
        currentStep,
        currentStepIndex,
        completedSteps,
        worldState,
        feedback,
        validateAction,
        isCompleted: completedSteps.length === currentScenario?.tasks.length
    };
};
