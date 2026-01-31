import React, { useRef, useEffect } from 'react';

export const MatrixBackground = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        const columns = Math.floor(width / 20);
        const drops = Array(columns).fill(1);
        const chars = "TUCC0123456789ABCDEF";
        const draw = () => {
            ctx.fillStyle = 'rgba(5, 2, 20, 0.05)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#7112AF';
            ctx.font = '14px monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.globalAlpha = Math.random() * 0.5 + 0.1;
                ctx.fillText(text, i * 20, drops[i] * 20);
                if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            ctx.globalAlpha = 1;
        };
        const interval = setInterval(draw, 50);
        const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
        window.addEventListener('resize', handleResize);
        return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
    }, []);
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-10" />;
};
