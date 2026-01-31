import React, { useState, useEffect } from 'react';

export const TypewriterText = ({ text }) => {
    const [displayText, setDisplayText] = useState('');
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => { if (i < text.length) { setDisplayText(prev => prev + text.charAt(i)); i++; } else { clearInterval(timer); } }, 100);
        return () => clearInterval(timer);
    }, [text]);
    return <span>{displayText}</span>;
};
