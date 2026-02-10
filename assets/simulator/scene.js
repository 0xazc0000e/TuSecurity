// 3D Cybersecurity Simulator Scene
if (typeof window.CyberSecurityScene === 'undefined') {
    class CyberSecurityScene {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.screen = null;
        this.raycaster = null;
        this.mouse = null;
        this.terminal = null;
        
        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050214);
        this.scene.fog = new THREE.Fog(0x050214, 1, 10);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 3);
        this.camera.lookAt(0, 1, 0);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Raycaster for interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Create scene
        this.createRoom();
        this.createDesk();
        this.createScreen();
        this.createLighting();

        // Event listeners
        this.setupEventListeners();

        // Start animation
        this.animate();
    }

    createRoom() {
        // Room dimensions
        const roomWidth = 8;
        const roomHeight = 3;
        const roomDepth = 8;

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
        const floorMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a1a2e,
            side: THREE.DoubleSide 
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Walls
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x0f0f1e });

        // Back wall
        const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);
        const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
        backWall.position.z = -roomDepth / 2;
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Left wall
        const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight);
        const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.x = -roomWidth / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Right wall
        const rightWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight);
        const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.x = roomWidth / 2;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
    }

    createDesk() {
        // Desk surface
        const deskGeometry = new THREE.BoxGeometry(2, 0.1, 1);
        const deskMaterial = new THREE.MeshLambertMaterial({ color: 0x2d1810 });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.set(0, 0.8, 0);
        desk.castShadow = true;
        desk.receiveShadow = true;
        this.scene.add(desk);

        // Desk legs
        const legGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x1a0e08 });

        const positions = [
            [-0.9, 0.4, -0.4],
            [0.9, 0.4, -0.4],
            [-0.9, 0.4, 0.4],
            [0.9, 0.4, 0.4]
        ];

        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            this.scene.add(leg);
        });

        // Keyboard
        const keyboardGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.2);
        const keyboardMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
        keyboard.position.set(0, 0.85, 0.3);
        keyboard.castShadow = true;
        this.scene.add(keyboard);
    }

    createScreen() {
        // Monitor frame
        const screenFrameGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.1);
        const screenFrameMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
        const screenFrame = new THREE.Mesh(screenFrameGeometry, screenFrameMaterial);
        screenFrame.position.set(0, 1.2, -0.4);
        screenFrame.castShadow = true;
        this.scene.add(screenFrame);

        // Screen display (interactive)
        const screenGeometry = new THREE.BoxGeometry(1.1, 0.7, 0.05);
        const screenMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x001122,
            emissive: 0x002244,
            emissiveIntensity: 0.5
        });
        this.screen = new THREE.Mesh(screenGeometry, screenMaterial);
        this.screen.position.set(0, 1.2, -0.35);
        this.screen.userData = { interactive: true, type: 'screen' };
        this.scene.add(this.screen);

        // Monitor stand
        const standGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.4);
        const standMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const stand = new THREE.Mesh(standGeometry, standMaterial);
        stand.position.set(0, 0.9, -0.4);
        stand.castShadow = true;
        this.scene.add(stand);

        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05);
        const base = new THREE.Mesh(baseGeometry, standMaterial);
        base.position.set(0, 0.825, -0.4);
        base.castShadow = true;
        this.scene.add(base);
    }

    createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Main light source (ceiling light)
        const ceilingLight = new THREE.PointLight(0xffffff, 0.8, 100);
        ceilingLight.position.set(0, 2.8, 0);
        ceilingLight.castShadow = true;
        ceilingLight.shadow.mapSize.width = 1024;
        ceilingLight.shadow.mapSize.height = 1024;
        this.scene.add(ceilingLight);

        // Screen glow
        const screenLight = new THREE.PointLight(0x00ff88, 0.3, 5);
        screenLight.position.set(0, 1.2, -0.3);
        this.scene.add(screenLight);

        // Add some terminal glow effect on screen
        this.createTerminalEffect();
    }

    createTerminalEffect() {
        // Create a simple terminal text effect using canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');

        // Terminal background
        context.fillStyle = '#000011';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Terminal text
        context.fillStyle = '#00ff88';
        context.font = '14px monospace';
        context.fillText('> CYBERSECURITY SIMULATOR', 20, 30);
        context.fillText('> System Status: ONLINE', 20, 50);
        context.fillText('> Click to access terminal...', 20, 80);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        const screenTextureMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            emissive: 0x00ff88,
            emissiveIntensity: 0.2
        });

        // Apply to screen
        if (this.screen) {
            this.screen.material = screenTextureMaterial;
        }
    }

    setupEventListeners() {
        // Mouse move for hover effects
        this.container.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.checkHover();
        });

        // Click for interaction
        this.container.addEventListener('click', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.handleClick();
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }

    checkHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        // Reset all objects to normal state
        this.scene.traverse((child) => {
            if (child.userData.interactive) {
                child.scale.set(1, 1, 1);
            }
        });

        // Highlight hovered object
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.interactive) {
                object.scale.set(1.05, 1.05, 1.05);
                this.container.style.cursor = 'pointer';
            } else {
                this.container.style.cursor = 'default';
            }
        } else {
            this.container.style.cursor = 'default';
        }
    }

    handleClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.type === 'screen') {
                this.showTerminal();
            }
        }
    }

    showTerminal() {
        if (window.terminalOverlay) {
            window.terminalOverlay.show();
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Subtle screen glow animation
        if (this.screen) {
            this.screen.material.emissiveIntensity = 0.2 + Math.sin(Date.now() * 0.001) * 0.1;
        }

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// Initialize scene when DOM is ready
function initializeScene() {
    const simulatorContainer = document.getElementById('simulator-tab');
    if (simulatorContainer && window.THREE) {
        try {
            console.log('Initializing 3D scene...');
            window.cyberSecurityScene = new CyberSecurityScene(simulatorContainer);
            console.log('3D scene initialized successfully');
        } catch (error) {
            console.error('Error initializing 3D scene:', error);
            // Show error message
            const loadingElement = document.getElementById('simulator-loading');
            const errorElement = document.getElementById('simulator-error');
            if (loadingElement) loadingElement.style.display = 'none';
            if (errorElement) errorElement.style.display = 'flex';
        }
    } else {
        console.log('Waiting for container or THREE...', { 
            container: !!simulatorContainer, 
            three: !!window.THREE 
        });
    }
}

// Multiple initialization attempts
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScene);
} else {
    initializeScene();
}

// Also try after delays in case DOM is not ready
setTimeout(initializeScene, 1000);
setTimeout(initializeScene, 2000);
setTimeout(initializeScene, 3000);
    
    // Make class available globally
    window.CyberSecurityScene = CyberSecurityScene;
}
