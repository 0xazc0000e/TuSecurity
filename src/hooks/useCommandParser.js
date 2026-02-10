import { useState, useCallback } from 'react';
import { getTool } from '../data/cyberRange/toolsRegistry';

/**
 * Command Parser Hook
 * Handles command execution, output generation, entity extraction
 */
export const useCommandParser = ({ role, chapter, storyState, onOutputGenerated }) => {
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    /**
     * Execute a command and return simulated output
     */
    const executeCommand = useCallback((commandString) => {
        if (!commandString.trim()) {
            return null;
        }

        // Add to history
        setCommandHistory(prev => [...prev, commandString]);
        setHistoryIndex(-1);

        // Parse command
        const parts = commandString.trim().split(' ');
        const baseCmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        // Get tool from registry
        const tool = getTool(baseCmd);

        if (!tool) {
            return {
                type: 'error',
                output: `bash: ${baseCmd}: command not found\n\n💡 Hint: Type 'help' to see available commands, or check the Tools panel.`,
                entities: {}
            };
        }

        // Check if tool is available for this role
        if (!tool.roles.includes(role)) {
            return {
                type: 'error',
                output: `Error: '${baseCmd}' is not available in ${role} mode.\n\n💡 This tool is restricted to ${tool.roles.join('/')} role(s).`,
                entities: {}
            };
        }

        // Execute tool simulator
        const context = {
            role,
            chapter,
            storyState,
            timestamp: new Date().toISOString()
        };

        try {
            const result = tool.simulator(args, context);

            // Call callback with output and metadata
            if (onOutputGenerated && result) {
                onOutputGenerated({
                    command: commandString,
                    tool: baseCmd,
                    output: result.output,
                    entities: result.entities || {},
                    hints: result.hints || {},
                    triggerEvent: result.triggerEvent || null,
                    success: result.success !== false
                });
            }

            return {
                type: result.success !== false ? 'success' : 'error',
                output: result.output,
                entities: result.entities || {},
                hints: result.hints || {},
                triggerEvent: result.triggerEvent || null
            };
        } catch (error) {
            console.error('Command simulation error:', error);
            return {
                type: 'error',
                output: `Error executing ${baseCmd}: ${error.message}`,
                entities: {}
            };
        }
    }, [role, chapter, storyState, onOutputGenerated]);

    /**
     * Get command from history (for arrow key navigation)
     */
    const getHistoryCommand = useCallback((direction) => {
        if (commandHistory.length === 0) return '';

        let newIndex = historyIndex;

        if (direction === 'up') {
            newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        } else if (direction === 'down') {
            newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
        }

        setHistoryIndex(newIndex);

        if (newIndex === -1) return '';
        return commandHistory[commandHistory.length - 1 - newIndex];
    }, [commandHistory, historyIndex]);

    /**
     * Get autocomplete suggestions
     */
    const getAutocomplete = useCallback((partial) => {
        if (!partial.trim()) return [];

        const availableTools = Object.values(require('../data/cyberRange/toolsRegistry').TOOLS)
            .filter(t => t.roles.includes(role))
            .map(t => t.name);

        return availableTools.filter(cmd => cmd.startsWith(partial.toLowerCase()));
    }, [role]);

    return {
        executeCommand,
        getHistoryCommand,
        getAutocomplete,
        commandHistory
    };
};
