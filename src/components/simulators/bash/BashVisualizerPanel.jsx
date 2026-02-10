import React from 'react';
import { MiniWindows } from './MiniWindows';

export default function BashVisualizerPanel({ vfs, currentPath }) {
    return (
        <div className="h-full bg-black/50 p-4 overflow-hidden">
            {/* We can enhance this later with network graphs etc */}
            <MiniWindows vfs={vfs} currentPath={currentPath} />
        </div>
    );
}
