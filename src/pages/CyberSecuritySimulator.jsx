import React, { useEffect, useRef } from 'react';
import { Terminal, Monitor, Code, Shield } from 'lucide-react';

export default function CyberSecuritySimulator() {
    const simulatorRef = useRef(null);

    useEffect(() => {
        // Load Three.js and simulator scripts
        const loadScripts = async () => {
            // Check if THREE is already loaded
            if (window.THREE) {
                initializeSimulator();
                return;
            }

            // Load Three.js
            const threeScript = document.createElement('script');
            threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            threeScript.async = true;
            
            threeScript.onload = () => {
                initializeSimulator();
            };
            
            threeScript.onerror = () => {
                console.error('Failed to load Three.js');
                showError();
            };
            
            document.head.appendChild(threeScript);
        };

        const initializeSimulator = () => {
            // Hide loading indicator
            hideLoading();
            
            // Only load scripts if they haven't been loaded yet
            if (!window.CyberSecurityScene) {
                // Load scene script
                const sceneScript = document.createElement('script');
                sceneScript.src = '/assets/simulator/scene.js';
                sceneScript.async = true;
                
                sceneScript.onload = () => {
                    console.log('Scene script loaded');
                    // Load terminal script after scene is loaded
                    if (!window.TerminalEmulator) {
                        const terminalScript = document.createElement('script');
                        terminalScript.src = '/assets/simulator/terminal.js';
                        terminalScript.async = true;
                        
                        terminalScript.onload = () => {
                            console.log('Terminal script loaded');
                        };
                        
                        terminalScript.onerror = () => {
                            console.error('Failed to load terminal script');
                        };
                        
                        document.body.appendChild(terminalScript);
                    }
                };
                
                sceneScript.onerror = () => {
                    console.error('Failed to load scene script');
                    showError();
                };
                
                document.body.appendChild(sceneScript);
            }
        };

        const showError = () => {
            const loadingElement = document.getElementById('simulator-loading');
            const errorElement = document.getElementById('simulator-error');
            if (loadingElement) loadingElement.style.display = 'none';
            if (errorElement) errorElement.style.display = 'flex';
        };

        const hideLoading = () => {
            const loadingElement = document.getElementById('simulator-loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        };

        loadScripts();

        // Set a timeout to show error if nothing loads
        const errorTimeout = setTimeout(() => {
            const loadingElement = document.getElementById('simulator-loading');
            if (loadingElement && loadingElement.style.display !== 'none') {
                console.error('Timeout: Scene failed to initialize within 10 seconds');
                showError();
            }
        }, 10000);

        // Cleanup
        return () => {
            clearTimeout(errorTimeout);
            // Remove scripts if component unmounts
            const scripts = document.querySelectorAll('script[src*="three"], script[src*="simulator"]');
            scripts.forEach(script => script.remove());
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#050214] text-white font-cairo" dir="rtl">
            {/* Header */}
            <div className="border-b border-white/10 bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Terminal className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">3D Cybersecurity Simulator</h1>
                                <p className="text-gray-400 text-sm">بيئة تدريبية تفاعلية للأمن السيبراني</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Monitor size={16} />
                                <span>3D Environment</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Code size={16} />
                                <span>Terminal Access</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400">
                                <Shield size={16} />
                                <span>Sandboxed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-purple-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-sm text-gray-300">
                                <span className="text-green-400 font-bold">Interactive 3D Environment:</span> 
                                Navigate the hacker desk and click on the computer screen to access the terminal
                            </p>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                            ESC to close terminal | Click screen to interact
                        </div>
                    </div>
                </div>
            </div>

            {/* 3D Simulator Container */}
            <div 
                id="simulator-tab" 
                ref={simulatorRef}
                className="relative w-full h-[calc(100vh-200px)] bg-[#050214] overflow-hidden"
                style={{ minHeight: '600px' }}
            >
                {/* Loading indicator */}
                <div id="simulator-loading" className="absolute inset-0 flex items-center justify-center bg-[#050214] z-10">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading 3D Environment...</p>
                        <p className="text-gray-500 text-sm mt-2">If this persists, check browser console</p>
                    </div>
                </div>

                {/* Error fallback */}
                <div id="simulator-error" className="absolute inset-0 flex items-center justify-center bg-[#050214] z-10 hidden">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 border-4 border-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-red-500 text-2xl">!</span>
                        </div>
                        <p className="text-red-400 mb-2">Failed to load 3D Environment</p>
                        <p className="text-gray-400 text-sm mb-4">Please check your browser console for details</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>

                {/* Three.js canvas will be inserted here by scene.js */}
            </div>

            {/* Features Info */}
            <div className="bg-[#0a0a0f] border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Monitor className="text-blue-400" size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white">3D Visualization</h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                                استكشف بيئة عمل قراصنة الكمبيوتر في عالم ثلاثي الأبعاد تفاعلي
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Terminal className="text-green-400" size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white">Terminal Emulator</h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                                تدرب على أوامر لينux وأدوات الأمن السيبراني في محطة طرفية واقعية
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Shield className="text-purple-400" size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white">Safe Environment</h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                                بيئة معزولة بالكامل للتعلم الآمن بدون أي مخاطر حقيقية
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
