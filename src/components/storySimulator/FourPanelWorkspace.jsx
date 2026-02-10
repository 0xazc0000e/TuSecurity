import React from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Terminal, Network, Wrench, Monitor } from 'lucide-react';

/**
 * Four-Panel Workspace Layout
 * الواجهة الرباعية القابلة لتغيير الحجم
 */
export const FourPanelWorkspace = ({
    terminalContent,
    networkMapContent,
    toolkitContent,
    targetViewContent
}) => {
    return (
        <div className="h-full w-full bg-[#0c0c0c] font-cairo">
            <PanelGroup direction="horizontal">
                {/* Left Side */}
                <Panel defaultSize={50} minSize={30}>
                    <PanelGroup direction="vertical">
                        {/* Panel 1: Terminal */}
                        <Panel defaultSize={50} minSize={20}>
                            <div className="h-full flex flex-col border border-white/10 bg-black/40">
                                <PanelHeader icon={Terminal} title="الطرفية (Terminal)" />
                                <div className="flex-1 overflow-auto">
                                    {terminalContent}
                                </div>
                            </div>
                        </Panel>

                        <PanelResizeHandle className="h-1 bg-white/5 hover:bg-[#7112AF]/50 transition-colors" />

                        {/* Panel 3: Toolkit */}
                        <Panel defaultSize={50} minSize={20}>
                            <div className="h-full flex flex-col border border-white/10 bg-black/40">
                                <PanelHeader icon={Wrench} title="صندوق الأدوات (Toolkit)" />
                                <div className="flex-1 overflow-auto">
                                    {toolkitContent}
                                </div>
                            </div>
                        </Panel>
                    </PanelGroup>
                </Panel>

                <PanelResizeHandle className="w-1 bg-white/5 hover:bg-[#7112AF]/50 transition-colors" />

                {/* Right Side */}
                <Panel defaultSize={50} minSize={30}>
                    <PanelGroup direction="vertical">
                        {/* Panel 2: Network Map */}
                        <Panel defaultSize={50} minSize={20}>
                            <div className="h-full flex flex-col border border-white/10 bg-black/40">
                                <PanelHeader icon={Network} title="خريطة الشبكة (Network Map)" />
                                <div className="flex-1 overflow-auto">
                                    {networkMapContent}
                                </div>
                            </div>
                        </Panel>

                        <PanelResizeHandle className="h-1 bg-white/5 hover:bg-[#7112AF]/50 transition-colors" />

                        {/* Panel 4: Target View + Alerts */}
                        <Panel defaultSize={50} minSize={20}>
                            <div className="h-full flex flex-col border border-white/10 bg-black/40">
                                <PanelHeader icon={Monitor} title="شاشة الهدف والتنبيهات" />
                                <div className="flex-1 overflow-auto">
                                    {targetViewContent}
                                </div>
                            </div>
                        </Panel>
                    </PanelGroup>
                </Panel>
            </PanelGroup>
        </div>
    );
};

/**
 * Panel Header Component
 */
const PanelHeader = ({ icon: Icon, title }) => {
    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#151515] border-b border-white/10">
            <Icon size={16} className="text-[#7112AF]" />
            <span className="text-sm font-bold text-white">{title}</span>
        </div>
    );
};
