// Terminal Emulator for Cybersecurity Simulator
if (typeof window.TerminalEmulator === 'undefined') {
    class TerminalEmulator {
    constructor() {
        this.isVisible = false;
        this.history = [];
        this.currentDirectory = '/home/cybersec';
        this.user = 'cybersec';
        this.hostname = 'simulator';
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }

    init() {
        this.createOverlay();
        this.setupEventListeners();
        this.printWelcomeMessage();
    }

    createOverlay() {
        // Create terminal overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'terminal-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: none;
            font-family: 'Courier New', monospace;
            color: #00ff88;
        `;

        // Terminal container
        this.terminal = document.createElement('div');
        this.terminal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 800px;
            height: 80%;
            max-height: 600px;
            background: #000011;
            border: 2px solid #00ff88;
            border-radius: 8px;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // Terminal header
        this.header = document.createElement('div');
        this.header.style.cssText = `
            background: #001122;
            padding: 10px 15px;
            border-bottom: 1px solid #00ff88;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        this.header.innerHTML = `
            <span style="font-weight: bold;">CYBERSECURITY TERMINAL v1.0</span>
            <button id="close-terminal" style="
                background: none;
                border: 1px solid #00ff88;
                color: #00ff88;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 4px;
                font-family: inherit;
            ">✕ CLOSE</button>
        `;

        // Terminal body
        this.body = document.createElement('div');
        this.body.style.cssText = `
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            font-size: 14px;
            line-height: 1.4;
        `;

        // Input area
        this.inputArea = document.createElement('div');
        this.inputArea.style.cssText = `
            display: flex;
            align-items: center;
            padding: 10px 15px;
            border-top: 1px solid #00ff88;
            background: #001122;
        `;

        this.prompt = document.createElement('span');
        this.prompt.style.cssText = `
            margin-right: 8px;
            color: #00ff88;
        `;

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.style.cssText = `
            background: transparent;
            border: none;
            color: #00ff88;
            font-family: inherit;
            font-size: 14px;
            outline: none;
            flex: 1;
        `;

        this.inputArea.appendChild(this.prompt);
        this.inputArea.appendChild(this.input);

        this.terminal.appendChild(this.header);
        this.terminal.appendChild(this.body);
        this.terminal.appendChild(this.inputArea);
        this.overlay.appendChild(this.terminal);

        document.body.appendChild(this.overlay);
    }

    setupEventListeners() {
        // Close button
        const closeBtn = document.getElementById('close-terminal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Input handling
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(this.input.value);
                this.input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.autocomplete();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        // Focus input when terminal is shown
        this.overlay.addEventListener('click', () => {
            this.input.focus();
        });
    }

    printWelcomeMessage() {
        const welcome = [
            '',
            '╔══════════════════════════════════════════════════════════════╗',
            '║                    CYBERSECURITY SIMULATOR                   ║',
            '║                        Version 1.0                           ║',
            '╚══════════════════════════════════════════════════════════════╝',
            '',
            'Welcome to the Cybersecurity Training Environment',
            'Type "help" for available commands or "ls" to see directory contents.',
            '',
        ];
        
        welcome.forEach(line => this.print(line));
        this.updatePrompt();
    }

    updatePrompt() {
        this.prompt.textContent = `${this.user}@${this.hostname}:${this.currentDirectory}$ `;
    }

    print(text, type = 'output') {
        const line = document.createElement('div');
        
        if (type === 'error') {
            line.style.color = '#ff4444';
        } else if (type === 'success') {
            line.style.color = '#44ff44';
        } else if (type === 'warning') {
            line.style.color = '#ffff44';
        } else if (type === 'info') {
            line.style.color = '#4488ff';
        } else {
            line.style.color = '#00ff88';
        }
        
        line.textContent = text;
        this.body.appendChild(line);
        this.body.scrollTop = this.body.scrollHeight;
        
        // Add to history
        this.history.push({ text, type });
    }

    executeCommand(command) {
        if (!command.trim()) return;

        // Print the command
        this.print(`${this.prompt.textContent}${command}`, 'command');
        
        // Add to command history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;

        // Parse and execute
        const parts = command.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'ls':
                this.listFiles(args);
                break;
            case 'cd':
                this.changeDirectory(args);
                break;
            case 'pwd':
                this.print(this.currentDirectory);
                break;
            case 'whoami':
                this.print(this.user);
                break;
            case 'clear':
                this.clear();
                break;
            case 'ping':
                this.ping(args);
                break;
            case 'scan':
                this.scan(args);
                break;
            case 'hack':
                this.hack(args);
                break;
            case 'status':
                this.showStatus();
                break;
            case 'tools':
                this.showTools();
                break;
            case 'exit':
                this.hide();
                break;
            default:
                this.print(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        }

        this.updatePrompt();
    }

    showHelp() {
        const commands = [
            'Available commands:',
            '',
            '  help        - Show this help message',
            '  ls          - List directory contents',
            '  cd <dir>    - Change directory',
            '  pwd         - Print working directory',
            '  whoami      - Display current user',
            '  clear       - Clear terminal screen',
            '  ping <host> - Ping a host or IP address',
            '  scan <ip>   - Port scan an IP address',
            '  hack <target> - Simulate hacking attempt (TRAINING ONLY)',
            '  status      - Show system status',
            '  tools       - List available tools',
            '  exit        - Close terminal',
            '',
            'Note: This is a training environment. All actions are simulated.',
        ];
        
        commands.forEach(cmd => this.print(cmd, 'info'));
    }

    listFiles(args) {
        const files = [
            'drwxr-xr-x  2 cybersec cybersec 4096 Dec 10 10:30 .',
            'drwxr-xr-x  3 root     root     4096 Dec 10 09:00 ..',
            '-rw-------  1 cybersec cybersec  220 Dec 10 10:30 .bash_logout',
            '-rw-------  1 cybersec cybersec 3771 Dec 10 10:30 .bashrc',
            '-rw-------  1 cybersec cybersec  807 Dec 10 10:30 .profile',
            '-rwxr-xr-x  1 cybersec cybersec  512 Dec 10 10:15 nmap_scan.sh',
            '-rwxr-xr-x  1 cybersec cybersec 1024 Dec 10 10:20 payload_generator.py',
            '-rwxr-xr-x  1 cybersec cybersec  256 Dec 10 10:25 network_monitor.sh',
            'drwxr-xr-x  2 cybersec cybersec 4096 Dec 10 11:00 tools/',
            'drwxr-xr-x  2 cybersec cybersec 4096 Dec 10 11:15 logs/',
            'drwxr-xr-x  2 cybersec cybersec 4096 Dec 10 11:30 targets/',
            '-rw-r--r--  1 cybersec cybersec 2048 Dec 10 12:00 mission_brief.txt',
        ];
        
        files.forEach(file => this.print(file));
    }

    changeDirectory(args) {
        if (args.length === 0) {
            this.currentDirectory = '/home/cybersec';
        } else if (args[0] === '..') {
            const parts = this.currentDirectory.split('/');
            parts.pop();
            this.currentDirectory = parts.join('/') || '/';
        } else if (args[0] === 'tools' || args[0] === 'logs' || args[0] === 'targets') {
            this.currentDirectory = `/home/cybersec/${args[0]}`;
        } else {
            this.print(`cd: ${args[0]}: No such file or directory`, 'error');
            return;
        }
    }

    ping(args) {
        if (args.length === 0) {
            this.print('Usage: ping <hostname or IP>', 'error');
            return;
        }

        const target = args[0];
        this.print(`PING ${target} (${this.generateIP()}) 56(84) bytes of data.`);
        
        let count = 0;
        const interval = setInterval(() => {
            if (count >= 4) {
                clearInterval(interval);
                this.print(`--- ${target} ping statistics ---`);
                this.print(`4 packets transmitted, 4 received, 0% packet loss`);
                return;
            }
            
            const time = Math.floor(Math.random() * 50) + 10;
            this.print(`64 bytes from ${target}: icmp_seq=${count + 1} ttl=64 time=${time}ms`);
            count++;
        }, 500);
    }

    scan(args) {
        if (args.length === 0) {
            this.print('Usage: scan <IP address>', 'error');
            return;
        }

        const target = args[0];
        this.print(`Starting port scan on ${target}...`, 'info');
        this.print('Scanning common ports, please wait...');
        
        setTimeout(() => {
            const ports = [
                '22/tcp   open  ssh',
                '80/tcp   open  http',
                '443/tcp  open  https',
                '3306/tcp closed mysql',
                '3389/tcp filtered rdp',
                '8080/tcp open  http-proxy'
            ];
            
            this.print(`Scan results for ${target}:`, 'success');
            ports.forEach(port => this.print(`  ${port}`));
            this.print('Scan completed.', 'success');
        }, 2000);
    }

    hack(args) {
        if (args.length === 0) {
            this.print('Usage: hack <target>', 'error');
            return;
        }

        const target = args[0];
        this.print(`⚠️  WARNING: This is a TRAINING SIMULATION ONLY ⚠️`, 'warning');
        this.print(`Simulating ethical security assessment on ${target}...`, 'info');
        this.print('Initializing penetration testing framework...');
        
        setTimeout(() => {
            this.print('[-] Enumerating services...', 'info');
            setTimeout(() => {
                this.print('[+] Found 3 potential vulnerabilities', 'success');
                setTimeout(() => {
                    this.print('[*] Attempting ethical exploit (SIMULATION)...', 'warning');
                    setTimeout(() => {
                        this.print('[+] SIMULATION: Vulnerability patched', 'success');
                        this.print('[+] Security assessment complete', 'success');
                        this.print('Remember: Always obtain proper authorization before testing.', 'warning');
                    }, 1500);
                }, 1000);
            }, 1000);
        }, 500);
    }

    showStatus() {
        const status = [
            'System Status:',
            '  CPU Usage:    23%',
            '  Memory:       4.2GB / 8GB (52%)',
            '  Network:      Connected',
            '  Firewall:     Active',
            '  Antivirus:    Updated',
            '  Last Scan:    2 hours ago',
            '  Threat Level: LOW'
        ];
        
        status.forEach(line => this.print(line, 'info'));
    }

    showTools() {
        const tools = [
            'Available Security Tools:',
            '',
            '  nmap        - Network scanning and discovery',
            '  wireshark   - Packet analysis',
            '  metasploit  - Penetration testing framework',
            '  burpsuite   - Web application security',
            '  john        - Password cracking',
            '  hashcat     - Hash cracking',
            '  sqlmap      - SQL injection testing',
            '  nikto       - Web vulnerability scanner',
            '',
            'All tools are for educational purposes only.'
        ];
        
        tools.forEach(tool => this.print(tool, 'info'));
    }

    clear() {
        this.body.innerHTML = '';
        this.printWelcomeMessage();
    }

    navigateHistory(direction) {
        if (direction === -1 && this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 1 && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 1 && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
        }
    }

    autocomplete() {
        const value = this.input.value;
        const commands = ['help', 'ls', 'cd', 'pwd', 'whoami', 'clear', 'ping', 'scan', 'hack', 'status', 'tools', 'exit'];
        const matches = commands.filter(cmd => cmd.startsWith(value));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.print(`Possible completions: ${matches.join(', ')}`, 'info');
        }
    }

    generateIP() {
        return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    show() {
        this.isVisible = true;
        this.overlay.style.display = 'block';
        this.input.focus();
    }

    hide() {
        this.isVisible = false;
        this.overlay.style.display = 'none';
        this.input.value = '';
    }
}

// Initialize terminal when DOM is ready
function initializeTerminal() {
    if (!window.terminalOverlay) {
        window.terminalOverlay = new TerminalEmulator();
    }
}

// Multiple initialization attempts
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTerminal);
} else {
    initializeTerminal();
}

// Also try after a delay in case DOM is not ready
setTimeout(initializeTerminal, 1500);
    
    // Make class available globally
    window.TerminalEmulator = TerminalEmulator;
}
