import React from 'react';
import { Filter, Globe, Cpu, Shield, Crosshair, Lock, Users } from 'lucide-react';

const DOMAINS = [
    { id: 'all', label: 'جميع المجالات', icon: Filter },
    { id: 'networking', label: 'الشبكات', icon: Globe },
    { id: 'os', label: 'أنظمة التشغيل', icon: Cpu },
    { id: 'defense', label: 'الدفاع السيبراني', icon: Shield },
    { id: 'pentesting', label: 'اختبار الاختراق', icon: Crosshair },
    { id: 'crypto', label: 'التشفير', icon: Lock },
    { id: 'social', label: 'الهندسة الاجتماعية', icon: Users },
];

const LEVELS = [
    { id: 'all', label: 'جميع المستويات' },
    { id: 'beginner', label: 'مبتدئ' },
    { id: 'intermediate', label: 'متوسط' },
    { id: 'advanced', label: 'متقدم' },
];

export default function LibraryFilters({ activeFilters, onFilterChange }) {
    return (
        <div className="w-full glass-panel border-b border-white/5 bg-[#08080c]/80 backdrop-blur-md sticky top-0 z-30 p-4" dir="rtl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

                {/* Domain Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
                    {DOMAINS.map(domain => {
                        const Icon = domain.icon;
                        const isActive = activeFilters.domain === domain.id;

                        return (
                            <button
                                key={domain.id}
                                onClick={() => onFilterChange('domain', domain.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap transition-all font-cairo
                                    ${isActive
                                        ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon size={16} />
                                {domain.label}
                            </button>
                        );
                    })}
                </div>

                {/* Level Filter */}
                <div className="flex gap-2 shrink-0">
                    {LEVELS.map(lvl => (
                        <button
                            key={lvl.id}
                            onClick={() => onFilterChange('level', lvl.id)}
                            className={`px-3 py-1.5 rounded text-xs font-bold tracking-wider transition-all border font-cairo
                                ${activeFilters.level === lvl.id
                                    ? 'bg-blue-900/40 border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {lvl.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
