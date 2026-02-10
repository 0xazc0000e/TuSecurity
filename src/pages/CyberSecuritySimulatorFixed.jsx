import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Monitor, Code, Shield, AlertTriangle, RefreshCw } from 'lucide-react';

export default function CyberSecuritySimulatorFixed() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        let threeScript = null;
        let sceneScript = null;
        let terminalScript = null;

        const initializeSimulator = async () => {
            try {
                setIsLoading(true);
                setHasError(false);

                // Check if container exists
                if (!containerRef.current) {
                    throw new Error('Container not found');
                }

                // Load Three.js if not already loaded
                if (!window.THREE) {
                    threeScript = document.createElement('script');
                    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
                    threeScript.async = true;
                    
                    await new Promise((resolve, reject) => {
                        threeScript.onload = resolve;
                        threeScript.onerror = reject;
                        document.head.appendChild(threeScript);
                    });
                }

                // Wait a bit for THREE to be available
                await new Promise(resolve => setTimeout(resolve, 100));

                // Create and initialize scene directly
                if (window.THREE && containerRef.current) {
                    createScene();
                    setIsLoading(false);
                } else {
                    throw new Error('THREE.js not loaded or container not available');
                }

            } catch (error) {
                console.error('Simulator initialization error:', error);
                setHasError(true);
                setErrorMessage(error.message);
                setIsLoading(false);
            }
        };

        const createScene = () => {
            const container = containerRef.current;
            if (!container || !window.THREE) return;

            // Scene setup
            const scene = new window.THREE.Scene();
            scene.background = new window.THREE.Color(0x050214);
            scene.fog = new window.THREE.Fog(0x050214, 1, 10);

            // Camera setup
            const camera = new window.THREE.PerspectiveCamera(
                75,
                container.clientWidth / container.clientHeight,
                0.1,
                1000
            );
            camera.position.set(0, 1.6, 3);
            camera.lookAt(0, 1, 0);

            // Renderer setup
            const renderer = new window.THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = window.THREE.PCFSoftShadowMap;
            container.appendChild(renderer.domElement);

            // Create room
            createRoom(scene);
            createDesk(scene);
            createScreen(scene);
            createLighting(scene);

            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };
            animate();

            // Handle resize
            const handleResize = () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            };
            window.addEventListener('resize', handleResize);

            // Store references for cleanup
            container.scene = scene;
            container.camera = camera;
            container.renderer = renderer;
            container.handleResize = handleResize;
        };

        const createRoom = (scene) => {
            const roomWidth = 8;
            const roomHeight = 3;
            const roomDepth = 8;

            // Floor
            const floorGeometry = new window.THREE.PlaneGeometry(roomWidth, roomDepth);
            const floorMaterial = new window.THREE.MeshLambertMaterial({ 
                color: 0x1a1a2e,
                side: window.THREE.DoubleSide 
            });
            const floor = new window.THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = -Math.PI / 2;
            floor.receiveShadow = true;
            scene.add(floor);

            // Walls
            const wallMaterial = new window.THREE.MeshLambertMaterial({ color: 0x0f0f1e });

            // Back wall
            const backWallGeometry = new window.THREE.PlaneGeometry(roomWidth, roomHeight);
            const backWall = new window.THREE.Mesh(backWallGeometry, wallMaterial);
            backWall.position.z = -roomDepth / 2;
            backWall.receiveShadow = true;
            scene.add(backWall);

            // Left wall
            const leftWallGeometry = new window.THREE.PlaneGeometry(roomDepth, roomHeight);
            const leftWall = new window.THREE.Mesh(leftWallGeometry, wallMaterial);
            leftWall.rotation.y = Math.PI / 2;
            leftWall.position.x = -roomWidth / 2;
            leftWall.receiveShadow = true;
            scene.add(leftWall);

            // Right wall
            const rightWallGeometry = new window.THREE.PlaneGeometry(roomDepth, roomHeight);
            const rightWall = new window.THREE.Mesh(rightWallGeometry, wallMaterial);
            rightWall.rotation.y = -Math.PI / 2;
            rightWall.position.x = roomWidth / 2;
            rightWall.receiveShadow = true;
            scene.add(rightWall);
        };

        const createDesk = (scene) => {
            // Desk surface
            const deskGeometry = new window.THREE.BoxGeometry(2, 0.1, 1);
            const deskMaterial = new window.THREE.MeshLambertMaterial({ color: 0x2d1810 });
            const desk = new window.THREE.Mesh(deskGeometry, deskMaterial);
            desk.position.set(0, 0.8, 0);
            desk.castShadow = true;
            desk.receiveShadow = true;
            scene.add(desk);

            // Keyboard
            const keyboardGeometry = new window.THREE.BoxGeometry(0.5, 0.05, 0.2);
            const keyboardMaterial = new window.THREE.MeshLambertMaterial({ color: 0x333333 });
            const keyboard = new window.THREE.Mesh(keyboardGeometry, keyboardMaterial);
            keyboard.position.set(0, 0.85, 0.3);
            keyboard.castShadow = true;
            scene.add(keyboard);
        };

        const createScreen = (scene) => {
            // Monitor frame
            const screenFrameGeometry = new window.THREE.BoxGeometry(1.2, 0.8, 0.1);
            const screenFrameMaterial = new window.THREE.MeshLambertMaterial({ color: 0x111111 });
            const screenFrame = new window.THREE.Mesh(screenFrameGeometry, screenFrameMaterial);
            screenFrame.position.set(0, 1.2, -0.4);
            screenFrame.castShadow = true;
            scene.add(screenFrame);

            // Screen display
            const screenGeometry = new window.THREE.BoxGeometry(1.1, 0.7, 0.05);
            const screenMaterial = new window.THREE.MeshLambertMaterial({ 
                color: 0x001122,
                emissive: 0x002244,
                emissiveIntensity: 0.5
            });
            const screen = new window.THREE.Mesh(screenGeometry, screenMaterial);
            screen.position.set(0, 1.2, -0.35);
            screen.userData = { interactive: true, type: 'screen' };
            scene.add(screen);

            // Monitor stand
            const standGeometry = new window.THREE.CylinderGeometry(0.05, 0.08, 0.4);
            const standMaterial = new window.THREE.MeshLambertMaterial({ color: 0x222222 });
            const stand = new window.THREE.Mesh(standGeometry, standMaterial);
            stand.position.set(0, 0.9, -0.4);
            stand.castShadow = true;
            scene.add(stand);
        };

        const createLighting = (scene) => {
            // Ambient light
            const ambientLight = new window.THREE.AmbientLight(0x404040, 0.3);
            scene.add(ambientLight);

            // Main light
            const ceilingLight = new window.THREE.PointLight(0xffffff, 0.8, 100);
            ceilingLight.position.set(0, 2.8, 0);
            ceilingLight.castShadow = true;
            scene.add(ceilingLight);

            // Screen glow
            const screenLight = new window.THREE.PointLight(0x00ff88, 0.3, 5);
            screenLight.position.set(0, 1.2, -0.3);
            scene.add(screenLight);
        };

        initializeSimulator();

        return () => {
            // Cleanup
            if (threeScript && threeScript.parentNode) {
                threeScript.parentNode.removeChild(threeScript);
            }
            if (sceneScript && sceneScript.parentNode) {
                sceneScript.parentNode.removeChild(sceneScript);
            }
            if (terminalScript && terminalScript.parentNode) {
                terminalScript.parentNode.removeChild(terminalScript);
            }
            
            // Clean up Three.js scene
            if (containerRef.current && containerRef.current.renderer) {
                const container = containerRef.current;
                if (container.renderer.domElement && container.renderer.domElement.parentNode) {
                    container.renderer.domElement.parentNode.removeChild(container.renderer.domElement);
                }
                container.renderer.dispose();
                window.removeEventListener('resize', container.handleResize);
            }
        };
    }, []);

    const handleRetry = () => {
        setIsLoading(true);
        setHasError(false);
        setErrorMessage('');
        
        // Force re-render
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

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
                ref={containerRef}
                className="relative w-full h-[calc(100vh-200px)] bg-[#050214] overflow-hidden"
                style={{ minHeight: '600px' }}
            >
                {/* Loading indicator */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#050214] z-10">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading 3D Environment...</p>
                            <p className="text-gray-500 text-sm mt-2">Initializing Three.js and creating scene</p>
                        </div>
                    </div>
                )}

                {/* Error fallback */}
                {hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#050214] z-10">
                        <div className="text-center max-w-md">
                            <div className="w-16 h-16 border-4 border-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <AlertTriangle className="text-red-500" size={32} />
                            </div>
                            <h3 className="text-red-400 text-xl font-bold mb-2">Failed to load 3D Environment</h3>
                            <p className="text-gray-400 text-sm mb-2">{errorMessage}</p>
                            <p className="text-gray-500 text-xs mb-4">This might be due to browser compatibility or network issues</p>
                            <button 
                                onClick={handleRetry}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                            >
                                <RefreshCw size={16} />
                                Retry Loading
                            </button>
                        </div>
                    </div>
                )}
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
                                تدرب على أوامر لينكس وأدوات الأمن السيبراني في محطة طرفية واقعية
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
