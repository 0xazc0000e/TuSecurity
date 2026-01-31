import React, { useRef, useState } from 'react';

export const SpotlightCard = ({ children, className = "", onClick, isInteractive }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onClick={onClick}
            className={`relative glass-card glass-hover group ${className} ${isInteractive ? 'cursor-pointer' : ''}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(113, 18, 175, 0.4), transparent 40%)`,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
};
