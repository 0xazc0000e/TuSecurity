import React from 'react';
import { Shield, Sword, RefreshCw } from 'lucide-react';

export default function RoleSwitcher({ currentRole, onSwitch }) {
    const isAttacker = currentRole === 'attacker';

    return (
        <div className="flex items-center gap-3 bg-black/40 p-1 rounded-lg border border-white/10">
            <button
                onClick={() => onSwitch('attacker')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold ${isAttacker
                        ? 'bg-red-900/30 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
            >
                <Sword size={14} />
                <span className="hidden sm:inline">Attacker Mode</span>
            </button>

            <div className="h-4 w-[1px] bg-white/10"></div>

            <button
                onClick={() => onSwitch('defender')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold ${!isAttacker
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
            >
                <Shield size={14} />
                <span className="hidden sm:inline">Defender Mode</span>
            </button>
        </div>
    );
}
