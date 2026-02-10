import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with dark theme
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#7112AF',
        primaryTextColor: '#fff',
        primaryBorderColor: '#7112AF',
        lineColor: '#8b5cf6',
        secondaryColor: '#10b981',
        tertiaryColor: '#3b82f6',
        background: '#1a1a1a',
        mainBkg: '#1a1a1a',
        secondBkg: '#0d0d0d',
        tertiaryBkg: '#151515',
        darkMode: true,
        fontFamily: 'Cairo, sans-serif'
    },
    flowchart: {
        htmlLabels: true,
        curve: 'basis'
    }
});

export const MermaidDiagram = ({ chart }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current && chart) {
            try {
                // Clear previous content
                ref.current.innerHTML = '';

                // Generate unique ID
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

                // Render the diagram
                mermaid.render(id, chart).then(({ svg }) => {
                    if (ref.current) {
                        ref.current.innerHTML = svg;
                    }
                });
            } catch (error) {
                console.error('Mermaid rendering error:', error);
                if (ref.current) {
                    ref.current.innerHTML = `<pre className="text-red-400 text-xs">${error.message}</pre>`;
                }
            }
        }
    }, [chart]);

    return (
        <div
            ref={ref}
            className="mermaid-container my-6 p-4 bg-[#0a0a0a] rounded-xl border border-white/10 overflow-x-auto"
        />
    );
};
