import React from 'react';

export const SystemLogs = () => {
    const LOGS = [
        { id: 1, type: 'error', msg: 'Failed login attempt from IP 192.168.1.5', time: '10:23:45', module: 'Auth' },
        { id: 2, type: 'info', msg: 'User [Ahmed] completed module [Bash 101]', time: '10:20:12', module: 'LMS' },
        { id: 3, type: 'warning', msg: 'High memory usage on Docker Container #4', time: '10:15:00', module: 'Simulators' },
        { id: 4, type: 'success', msg: 'Backup completed successfully', time: '09:00:00', module: 'System' },
    ];

    return (
        <div className="bg-[#0a0a12] rounded-xl border border-white/10 overflow-hidden font-mono text-xs">
            {LOGS.map(log => (
                <div key={log.id} className="flex gap-4 p-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                    <span className="text-slate-500">{log.time}</span>
                    <span className={`font-bold w-16 uppercase ${log.type === 'error' ? 'text-red-500' :
                            log.type === 'warning' ? 'text-yellow-500' :
                                log.type === 'success' ? 'text-green-500' : 'text-blue-500'
                        }`}>{log.type}</span>
                    <span className="text-purple-400 w-20">[{log.module}]</span>
                    <span className="text-slate-300">{log.msg}</span>
                </div>
            ))}
        </div>
    );
};
