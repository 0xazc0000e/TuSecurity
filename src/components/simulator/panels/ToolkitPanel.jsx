import React from 'react';
import { Radar, Zap, Key, Terminal, Upload, Code, Shield, Activity, FileText, Ban, Users, Cpu, XCircle, Folder, Archive } from 'lucide-react';

const TOOL_ICONS = {
    nmap: Radar,
    masscan: Zap,
    hydra: Key,
    medusa: Key,
    ssh: Terminal,
    scp: Upload,
    python: Code,
    tcpdump: Activity,
    fail2ban: Shield,
    lastlog: FileText,
    iptables: Shield,
    netstat: Activity,
    who: Users,
    ps: Cpu,
    top: Cpu,
    kill: XCircle,
    ls: Folder,
    tar: Archive
};

export default function ToolkitPanel({ tools = [], activeTool, onToolSelect, role }) {
    const isAttacker = role === 'attacker';
    const accentColor = isAttacker ? 'red' : 'blue';

    if (!tools.length) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500 font-cairo">
                <p>لا توجد أدوات متاحة</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col font-cairo" dir="rtl">
            {/* Header */}
            <div className="p-3 border-b border-white/10 bg-black/30">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal size={16} className={`text-${accentColor}-400`} />
                    صندوق الأدوات
                </h3>
                <p className="text-xs text-gray-500 mt-1">اختر الأداة المناسبة للمهمة</p>
            </div>

            {/* Tools Grid */}
            <div className="flex-1 p-3 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                    {tools.map(tool => {
                        const Icon = TOOL_ICONS[tool.id] || Terminal;
                        const isActive = activeTool === tool.id;

                        return (
                            <button
                                key={tool.id}
                                onClick={() => onToolSelect(tool.id)}
                                className={`p-3 rounded-lg border transition-all text-right group
                                    ${isActive
                                        ? `bg-${accentColor}-500/20 border-${accentColor}-500 shadow-[0_0_15px_rgba(${isAttacker ? '239,68,68' : '59,130,246'},0.2)]`
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    <div className={`p-2 rounded-lg ${isActive ? `bg-${accentColor}-500/30 text-${accentColor}-400` : 'bg-white/10 text-gray-400 group-hover:text-white'}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-bold truncate ${isActive ? `text-${accentColor}-400` : 'text-white'}`}>
                                            {tool.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            {tool.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Tool Info */}
            {activeTool && (
                <div className={`p-3 border-t border-${accentColor}-500/30 bg-${accentColor}-500/5`}>
                    <p className="text-xs text-gray-400">
                        <span className={`text-${accentColor}-400 font-bold`}>الأداة النشطة:</span> {tools.find(t => t.id === activeTool)?.name}
                    </p>
                </div>
            )}
        </div>
    );
}
