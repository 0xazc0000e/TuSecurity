import React from 'react';
import { motion } from 'framer-motion';
import { GitMerge, ArrowDown } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const SkillRelationshipMap = () => {
    const { skillGraph } = useAnalytics();

    const getStatus = (skillId) => {
        // Map component IDs to context keys if necessary, or ensure they match
        // Component uses: foundations, network, os, scanning, encryption, hardening
        // Context uses: bash_basics, network_basics, packet_analysis, etc.

        // Mapping for now (simplification)
        const map = {
            'foundations': skillGraph.bash_basics,
            'network': skillGraph.network_basics,
            'os': 'mastered', // Core OS is usually always open if basics are done
            'scanning': skillGraph.packet_analysis, // Approximation
            'encryption': skillGraph.crypto_basics,
            'hardening': skillGraph.system_hardening
        };

        return map[skillId] || 'locked';
    };

    const nodes = [
        { id: 'foundations', label: 'الأساسيات', x: 50, y: 10, status: getStatus('foundations') },
        { id: 'network', label: 'الشبكات', x: 30, y: 40, status: getStatus('network') },
        { id: 'os', label: 'أنظمة التشغيل', x: 70, y: 40, status: getStatus('os') },
        { id: 'scanning', label: 'الفحص', x: 20, y: 70, status: 'locked' },
        { id: 'encryption', label: 'التشفير', x: 50, y: 70, status: 'locked' },
        { id: 'hardening', label: 'التحصين', x: 80, y: 70, status: 'locked' }
    ];

    const connections = [
        { from: 'foundations', to: 'network' },
        { from: 'foundations', to: 'os' },
        { from: 'network', to: 'scanning' },
        { from: 'network', to: 'encryption' },
        { from: 'os', to: 'hardening' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'mastered': return 'bg-[#7112AF] border-[#7112AF] text-white shadow-[0_0_15px_rgba(113,18,175,0.5)]';
            case 'in-progress': return 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]';
            case 'unlocked': return 'bg-[#0a051e] border-slate-500 text-slate-400 border-dashed';
            default: return 'bg-[#050214] border-slate-800 text-slate-700 opacity-50';
        }
    };

    return (
        <div className="bg-[#0f0f16]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-full min-h-[400px] relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                خريطة المهارات <GitMerge size={20} className="text-[#7112AF]" />
            </h3>

            <div className="relative w-full h-[300px] border border-white/5 rounded-xl bg-[#050214]/50 p-4">
                {/* Connections (SVG Lines) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {connections.map((conn, index) => {
                        const from = nodes.find(s => s.id === conn.from);
                        const to = nodes.find(s => s.id === conn.to);
                        return (
                            <motion.line
                                key={index}
                                x1={`${from.x}%`} y1={`${from.y}%`}
                                x2={`${to.x}%`} y2={`${to.y}%`}
                                stroke="#334155"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {nodes.map((skill, index) => (
                    <motion.div
                        key={skill.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: index * 0.1 }}
                        className={`absolute px-3 py-2 rounded-lg border text-xs font-bold leading-none transform -translate-x-1/2 -translate-y-1/2 cursor-default ${getStatusColor(skill.status)}`}
                        style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
                    >
                        {skill.label}
                    </motion.div>
                ))}
            </div>
            <p className="mt-4 text-xs text-center text-slate-500">
                المهارات ليست معزولة. لاحظ كيف يبني فهم الشبكات أساساً لتعلم التشفير والفحص.
            </p>
        </div>
    );
};
