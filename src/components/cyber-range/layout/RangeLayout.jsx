import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MissionSidebar from './MissionSidebar';
import HelperSidebar from './HelperSidebar';
import RoleSwitcher from './RoleSwitcher';

export default function RangeLayout({
    children,
    role,
    onSwitchRole,
    steps,
    currentStepIndex,
    activeTask,
    systemLogs = []
}) {
    const navigate = useNavigate();

    // Theme classes based on role
    const isAttacker = role === 'attacker';
    const mainGlow = isAttacker
        ? 'shadow-[0_0_100px_rgba(220,38,38,0.1)_inset]'
        : 'shadow-[0_0_100px_rgba(37,99,235,0.1)_inset]';

    return (
        <div className={`flex h-screen w-screen overflow-hidden bg-[#050214] text-white ${mainGlow}`}>

            {/* 1. Left Sidebar: Mission Control */}
            <MissionSidebar
                role={role}
                steps={steps}
                currentStepIndex={currentStepIndex}
            />

            {/* 2. Center: Workspace */}
            <div className="flex-grow flex flex-col relative min-w-0">

                {/* Top Navigation / Stats Bar */}
                <header className="h-16 border-b border-white/5 bg-[#08080c]/90 backdrop-blur flex items-center justify-between px-6 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/attacks')}
                            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold">The Threat Library</h1>
                    </div>

                    <RoleSwitcher currentRole={role} onSwitch={onSwitchRole} />

                    <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 rounded-full bg-purple-900/20 border border-purple-500/20 text-purple-400 text-sm font-mono font-bold">
                            XP: 1,450
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500"></div>
                    </div>
                </header>

                {/* Main Dynamic Area */}
                <main className="flex-grow relative overflow-hidden flex flex-col p-4">
                    {children}
                </main>

            </div>

            {/* 3. Right Sidebar: Helper Suite */}
            <HelperSidebar
                logs={systemLogs}
                activeTask={activeTask}
            />

        </div>
    );
}
