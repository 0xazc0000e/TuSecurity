import React from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { TerminalPanel } from './TerminalPanel';
import { NetworkMapPanel } from './NetworkMapPanel';
import { ToolsPanel } from './ToolsPanel';
import { TargetLogsPanel } from './TargetLogsPanel';
import { DecisionPanel } from './DecisionPanel';
import { GripVertical } from 'lucide-react';
import { MentorPanel } from '../ui/MentorPanel';

/**
 * 4-Panel Workspace Layout
 * Resizable panels using react-resizable-panels
 */
export const WorkspaceLayout = ({
    role,
    currentChapter,
    currentTask,
    // Terminal props
    onCommandExecute,
    terminalLines,
    availableCommands,
    // Network map props
    discoveredIPs,
    compromisedSystems,
    blockedIPs,
    onNodeClick,
    // Tools props
    availableTools,
    lockedTools,
    onToolReveal,
    // Logs props
    logs,
    targetStatus,
    onDefensiveAction,
    onDecisionSelect
}) => {
    // Save layout to localStorage
    const handleLayoutChange = (sizes) => {
        localStorage.setItem('cyberRangeLayout', JSON.stringify(sizes));
    };

    return (
        <div className="h-full w-full bg-black">
            {/* Main horizontal split */}
            <PanelGroup direction="horizontal" onLayout={handleLayoutChange}>

                {/* LEFT: Terminal Panel */}
                <Panel defaultSize={40} minSize={25} maxSize={60}>
                    <TerminalPanel
                        role={role}
                        onCommandExecute={onCommandExecute}
                        terminalLines={terminalLines}
                        availableCommands={availableCommands}
                    />
                </Panel>

                {/* Resize handle */}
                <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-[#7112AF] transition-colors relative group">
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 flex items-center justify-center">
                        <GripVertical size={16} className="text-slate-600 group-hover:text-[#7112AF]" />
                    </div>
                </PanelResizeHandle>

                {/* CENTER: Network Map + Tools (vertical split) */}
                <Panel defaultSize={35} minSize={25}>
                    <PanelGroup direction="vertical">

                        {/* TOP: Network Map */}
                        <Panel defaultSize={60} minSize={30}>
                            <NetworkMapPanel
                                role={role}
                                discoveredIPs={discoveredIPs}
                                compromisedSystems={compromisedSystems}
                                blockedIPs={blockedIPs}
                                onNodeClick={onNodeClick}
                            />
                        </Panel>

                        {/* Resize handle */}
                        <PanelResizeHandle className="h-1 bg-slate-800 hover:bg-[#7112AF] transition-colors relative group">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 flex items-center justify-center">
                                <GripVertical size={16} className="text-slate-600 group-hover:text-[#7112AF] rotate-90" />
                            </div>
                        </PanelResizeHandle>

                        {/* BOTTOM: Tools Panel or Decision Panel */}
                        <Panel defaultSize={40} minSize={20}>
                            {currentTask?.type === 'decision_point' ? (
                                <DecisionPanel
                                    task={currentTask}
                                    onSelect={onDecisionSelect}
                                />
                            ) : (
                                <ToolsPanel
                                    availableTools={availableTools}
                                    lockedTools={lockedTools}
                                    onToolReveal={onToolReveal}
                                />
                            )}
                        </Panel>
                    </PanelGroup>
                </Panel>

                {/* Resize handle */}
                <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-[#7112AF] transition-colors relative group">
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 flex items-center justify-center">
                        <GripVertical size={16} className="text-slate-600 group-hover:text-[#7112AF]" />
                    </div>
                </PanelResizeHandle>

                {/* RIGHT: Target/Logs Panel */}
                <Panel defaultSize={25} minSize={15} maxSize={40}>
                    <div className="h-full flex flex-col overflow-hidden bg-[#0a0a12]">
                        <div className="flex-1 overflow-auto">
                            <TargetLogsPanel
                                role={role}
                                logs={logs}
                                targetStatus={targetStatus}
                                onDefensiveAction={onDefensiveAction}
                            />
                        </div>
                        <div className="shrink-0 p-2 border-t border-white/5">
                            <MentorPanel
                                task={currentTask}
                                chapter={currentChapter}
                                role={role}
                            />
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
};
