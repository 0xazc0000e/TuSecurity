import React from 'react';
import { Folder, FileText, Monitor, HardDrive, Lock, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MiniWindows = ({ vfs, currentPath }) => {
    // Helper to get files in current directory
    const getFiles = () => {
        const dir = vfs[currentPath];
        if (!dir || !dir.children) return [];

        return dir.children.map(name => {
            const fullPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
            const fileObj = vfs[fullPath];
            return { name, ...fileObj };
        });
    };

    const files = getFiles();

    const getIcon = (type, name) => {
        if (type === 'dir') return <Folder size={32} fill="currentColor" className="opacity-80" />;
        if (name.endsWith('.png') || name.endsWith('.jpg')) return <ImageIcon size={32} />;
        return <FileText size={32} />;
    };

    return (
        <div className="absolute inset-0 p-4 overflow-auto flex flex-col font-cairo">

            {/* Address Bar-ish Header */}
            <div className="flex items-center justify-between mb-6 bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 text-xs px-2">
                    <Monitor size={14} />
                    <span className="font-mono">{currentPath}</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 text-xs font-bold text-slate-500 border-b border-white/5 uppercase tracking-wider">
                    <div>Type</div>
                    <div>Name</div>
                    <div>Size</div>
                    <div>Perms</div>
                </div>

                <AnimatePresence mode="popLayout">
                    {files.length > 0 ? (
                        files.map((file) => (
                            <motion.div
                                key={file.name}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-white/5"
                            >
                                <div className={`
                                    w-10 h-10 flex items-center justify-center rounded-lg
                                    ${file.type === 'dir' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700/30 text-slate-400'}
                                `}>
                                    {file.type === 'dir' ? <Folder size={20} /> : <FileText size={20} />}
                                </div>

                                <div className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                                    {file.name}
                                </div>

                                <div className="text-xs text-slate-500 font-mono">
                                    {file.size || (file.type === 'dir' ? '4KB' : '0B')}
                                </div>

                                <div className="flex items-center gap-1 text-[10px] font-mono bg-black/20 px-2 py-1 rounded text-slate-400">
                                    {file.permissions || '---------'}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-12 text-slate-600 gap-2"
                        >
                            <Folder size={48} className="opacity-20" />
                            <span>المجلد فارغ</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
