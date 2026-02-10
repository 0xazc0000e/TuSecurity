import React from 'react';
import { Terminal, Copy, Monitor, AlertCircle, Layout, Maximize2 } from 'lucide-react';

/**
 * CyberWorkspace (CSS Grid Fallback Version)
 * Replaces react-resizable-panels to fix import errors.
 * 
 * Layout Structure:
 * ┌─────────────┬─────────────┐
 * │  Top Left   │  Top Right  │
 * │ (Visualizer)│ (Tasks/Info)│
 * ├─────────────┼─────────────┤
 * │ Bottom Left │ Bottom Right│
 * │ (Terminal)  │ (Tools/Out) │
 * └─────────────┴─────────────┘
 */
export default function CyberWorkspace({
    topLeftContent,
    topRightContent,
    bottomLeftContent,
    bottomRightContent,
    config = {}
}) {
    const {
        topLeftTitle = "Visualizer",
        topRightTitle = "Information",
        bottomLeftTitle = "Terminal",
        bottomRightTitle = "Output",
        topLeftIcon: TopLeftIcon = Layout,
        topRightIcon: TopRightIcon = AlertCircle,
        bottomLeftIcon: BottomLeftIcon = Terminal,
        bottomRightIcon: BottomRightIcon = Monitor,
    } = config;

    return (
        <div className="h-screen w-full bg-[#0c0c0c] text-white font-cairo overflow-hidden pt-16">
            <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                {/* TOP LEFT */}
                <div className="border-r border-b border-white/5 relative overflow-hidden">
                    <PanelContainer icon={TopLeftIcon} title={topLeftTitle}>
                        {topLeftContent}
                    </PanelContainer>
                </div>

                {/* TOP RIGHT */}
                <div className="border-b border-white/5 relative overflow-hidden">
                    <PanelContainer icon={TopRightIcon} title={topRightTitle}>
                        {topRightContent}
                    </PanelContainer>
                </div>

                {/* BOTTOM LEFT */}
                <div className="border-r border-white/5 relative overflow-hidden">
                    <PanelContainer icon={BottomLeftIcon} title={bottomLeftTitle}>
                        {bottomLeftContent}
                    </PanelContainer>
                </div>

                {/* BOTTOM RIGHT */}
                <div className="relative overflow-hidden">
                    <PanelContainer icon={BottomRightIcon} title={bottomRightTitle}>
                        {bottomRightContent}
                    </PanelContainer>
                </div>
            </div>
        </div>
    );
}

const PanelContainer = ({ children, icon: Icon, title }) => (
    <div className="h-full flex flex-col bg-[#0f0f0f] relative group">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#151515] border-b border-white/5 select-none h-10">
            <div className="flex items-center gap-2 text-slate-400">
                <Icon size={14} className="text-purple-500" />
                <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-slate-600 hover:text-white transition-colors">
                    <Maximize2 size={12} />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto relative">
            {children}
        </div>
    </div>
);
