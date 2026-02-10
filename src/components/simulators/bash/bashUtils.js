
// VFS Structure: Object with absolute paths as keys
// Root is always "/"
// Users home is "/home/user"

export const INITIAL_VFS = {
    '/': { type: 'dir', children: ['home'], permissions: 'dr-xr-xr-x', owner: 'root' },
    '/home': { type: 'dir', children: ['user'], permissions: 'drwxr-xr-x', owner: 'root' },
    '/home/user': { type: 'dir', children: ['documents', 'images', 'notes.txt'], permissions: 'drwxr-x---', owner: 'user' },
    '/home/user/documents': { type: 'dir', children: ['project_alpha', 'budget.xls'], permissions: 'drwxr-xr-x', owner: 'user' },
    '/home/user/documents/project_alpha': { type: 'dir', children: [], permissions: 'drwxr-xr-x', owner: 'user' },
    '/home/user/documents/budget.xls': { type: 'file', content: 'Budget 2024...', size: '25KB', permissions: '-rw-r--r--', owner: 'user' },
    '/home/user/images': { type: 'dir', children: ['logo.png', 'vacation.jpg'], permissions: 'drwxr-xr-x', owner: 'user' },
    '/home/user/images/logo.png': { type: 'file', content: '[PNG DATA]', size: '120KB', permissions: '-rw-r--r--', owner: 'user' },
    '/home/user/images/vacation.jpg': { type: 'file', content: '[JPG DATA]', size: '2.4MB', permissions: '-rw-r--r--', owner: 'user' },
    '/home/user/notes.txt': { type: 'file', content: 'Remember to backup the system.', size: '1KB', permissions: '-rw-r--r--', owner: 'user' },
};

export const resolvePath = (currentPath, targetPath) => {
    if (!targetPath) return currentPath;
    if (targetPath === '~') return '/home/user';
    if (targetPath.startsWith('/')) return targetPath; // simple absolute (no normalization implementation yet for brevity)

    const parts = targetPath.split('/');
    let cleanPath = currentPath === '/' ? '' : currentPath; // handle root edge case

    for (let part of parts) {
        if (part === '.') continue;
        if (part === '..') {
            const segs = cleanPath.split('/');
            segs.pop();
            cleanPath = segs.join('/');
            if (cleanPath === '') cleanPath = '/';
        } else {
            if (cleanPath === '/') cleanPath = '';
            cleanPath += '/' + part;
        }
    }
    return cleanPath || '/';
};

const getDirContent = (vfs, path) => {
    const dir = vfs[path];
    if (!dir || dir.type !== 'dir') return null;
    return dir.children.map(name => {
        const fullPath = path === '/' ? `/${name}` : `${path}/${name}`;
        return { name, ...vfs[fullPath] };
    });
};

export const executeBashCommand = (cmdStr, currentPath, vfs, user = 'user') => {
    const result = {
        output: '',
        newVfs: { ...vfs },
        newPath: currentPath,
        error: null
    };

    const args = cmdStr.trim().split(/\s+/);
    const cmd = args[0];
    const rest = args.slice(1);

    // Helpers
    const getAbsPath = (p) => resolvePath(currentPath, p);
    const exists = (p) => !!vfs[p];

    switch (cmd) {
        case 'pwd':
            result.output = currentPath;
            break;

        case 'whoami':
            result.output = user;
            break;

        case 'ls':
            let target = currentPath;
            const showHidden = rest.includes('-a');
            const showDetail = rest.includes('-l');
            const pathArg = rest.find(a => !a.startsWith('-'));
            if (pathArg) target = getAbsPath(pathArg);

            if (!exists(target)) {
                result.error = `ls: cannot access '${pathArg}': No such file or directory`;
            } else if (vfs[target].type === 'file') {
                const f = vfs[target];
                result.output = showDetail
                    ? `${f.permissions} 1 ${f.owner} ${f.owner} ${f.size} Jan 1 12:00 ${pathArg}`
                    : pathArg;
            } else {
                const contents = getDirContent(vfs, target);
                if (showDetail) {
                    result.output = contents.map(f => `${f.permissions} 1 ${f.owner} ${f.owner} ${f.size || '4096'} Jan 1 12:00 ${f.name}`).join('\n');
                } else {
                    result.output = contents.map(f => f.name).join('  ');
                }
            }
            break;

        case 'cd':
            const dest = rest[0] || '~';
            const destPath = getAbsPath(dest);
            if (!exists(destPath)) {
                result.error = `cd: ${dest}: No such file or directory`;
            } else if (vfs[destPath].type !== 'dir') {
                result.error = `cd: ${dest}: Not a directory`;
            } else {
                result.newPath = destPath;
            }
            break;

        case 'mkdir':
            const newDirName = rest[0];
            if (!newDirName) {
                result.error = 'mkdir: missing operand';
            } else {
                const parent = currentPath;
                const absNew = parent === '/' ? `/${newDirName}` : `${parent}/${newDirName}`;
                if (exists(absNew)) {
                    result.error = `mkdir: cannot create directory '${newDirName}': File exists`;
                } else {
                    const parentObj = { ...result.newVfs[parent] };
                    parentObj.children = [...parentObj.children, newDirName];
                    result.newVfs[parent] = parentObj;
                    result.newVfs[absNew] = { type: 'dir', children: [], permissions: 'drwxr-xr-x', owner: user };
                }
            }
            break;

        case 'touch':
            const newFile = rest[0];
            if (!newFile) {
                result.error = 'touch: missing file operand';
            } else {
                const absNewFile = currentPath === '/' ? `/${newFile}` : `${currentPath}/${newFile}`;
                if (!exists(absNewFile)) {
                    const parentObj = { ...result.newVfs[currentPath] };
                    parentObj.children = [...parentObj.children, newFile];
                    result.newVfs[currentPath] = parentObj;
                    result.newVfs[absNewFile] = { type: 'file', content: '', size: '0B', permissions: '-rw-r--r--', owner: user };
                }
            }
            break;

        case 'rm':
            const targetRm = rest[0];
            if (!targetRm) {
                result.error = 'rm: missing operand';
            } else {
                const absRm = currentPath === '/' ? `/${targetRm}` : `${currentPath}/${targetRm}`;
                if (!exists(absRm)) {
                    result.error = `rm: cannot remove '${targetRm}': No such file or directory`;
                } else if (vfs[absRm].type === 'dir' && !rest.includes('-r')) {
                    result.error = `rm: cannot remove '${targetRm}': Is a directory`;
                } else {
                    const parentObj = { ...result.newVfs[currentPath] };
                    parentObj.children = parentObj.children.filter(c => c !== targetRm);
                    result.newVfs[currentPath] = parentObj;
                    delete result.newVfs[absRm];
                }
            }
            break;

        case 'cat':
            const targetCat = rest[0];
            if (!targetCat) {
                result.error = 'cat: missing operand';
            } else {
                const absCat = getAbsPath(targetCat);
                if (!exists(absCat)) {
                    result.error = `cat: ${targetCat}: No such file or directory`;
                } else if (vfs[absCat].type === 'dir') {
                    result.error = `cat: ${targetCat}: Is a directory`;
                } else {
                    result.output = vfs[absCat].content;
                }
            }
            break;

        case 'head':
            const targetHead = rest[0];
            if (!targetHead) {
                result.error = 'head: missing operand';
            } else {
                const absHead = getAbsPath(targetHead);
                if (!exists(absHead)) {
                    result.error = `head: ${targetHead}: No such file or directory`;
                } else {
                    const content = vfs[absHead].content || '';
                    result.output = content.split('\n').slice(0, 10).join('\n');
                }
            }
            break;

        case 'tail':
            const targetTail = rest[0];
            if (!targetTail) {
                result.error = 'tail: missing operand';
            } else {
                const absTail = getAbsPath(targetTail);
                if (!exists(absTail)) {
                    result.error = `tail: ${targetTail}: No such file or directory`;
                } else {
                    const content = vfs[absTail].content || '';
                    const lines = content.split('\n');
                    result.output = lines.slice(Math.max(lines.length - 10, 0)).join('\n');
                }
            }
            break;

        case 'grep':
            const searchTerm = rest[0];
            const targetGrep = rest[1];
            if (!searchTerm) {
                result.error = 'grep: missing search term';
            } else if (!targetGrep) {
                result.error = 'grep: missing file operand';
            } else {
                const absGrep = getAbsPath(targetGrep);
                if (!exists(absGrep)) {
                    result.error = `grep: ${targetGrep}: No such file or directory`;
                } else {
                    const content = vfs[absGrep].content || '';
                    const matches = content.split('\n').filter(line => line.includes(searchTerm));
                    result.output = matches.join('\n');
                }
            }
            break;

        case 'chmod':
            const perms = rest[0];
            const targetChmod = rest[1];
            if (!perms || !targetChmod) {
                result.error = 'chmod: missing operand';
            } else {
                const absChmod = getAbsPath(targetChmod);
                if (!exists(absChmod)) {
                    result.error = `chmod: cannot access '${targetChmod}': No such file or directory`;
                } else {
                    // Very basic chmod mock - just updates string for visual feedback
                    const newPermissions = perms === '+x' ? '-rwxr-xr-x' : (perms === '777' ? '-rwxrwxrwx' : '-rw-r--r--');
                    result.newVfs[absChmod] = { ...vfs[absChmod], permissions: newPermissions };
                }
            }
            break;

        case 'ps':
            // Mock Process List
            result.output = `PID TTY          TIME CMD
 1001 pts/0    00:00:00 bash
 1234 pts/0    00:00:15 scrypto_miner
 2045 pts/0    00:00:00 ps`;
            break;

        case 'kill':
            const pid = rest[0];
            if (!pid) {
                result.error = 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]';
            } else if (pid === '1234') {
                result.output = `[1]+  Terminated              scrypto_miner`;
            } else {
                result.error = `kill: (${pid}) - No such process`;
            }
            break;

        case 'top':
            // Just show a static snapshot since we can't be interactive easily in this loop
            result.output = `top - 10:00:01 up 1 day,  2:30,  1 user,  load average: 0.10, 0.15, 0.12
Tasks:  12 total,   1 running,  11 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.5 us,  1.0 sy,  0.0 ni, 96.5 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
 1234 user      20   0   12.5m   2.5m   1.2m S  15.0  0.5   0:15.34 scrypto_miner
 1001 user      20   0    8.2m   3.1m   2.0m S   0.0  0.6   0:00.05 bash`;
            break;

        case 'ping':
            const host = rest[0];
            if (!host) {
                result.error = 'ping: missing host operand';
            } else {
                result.output = `PING ${host} (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.038 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.051 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.045 ms

--- ${host} ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 0.038/0.044/0.051/0.005 ms`;
            }
            break;

        case 'clear':
            result.output = 'CLEAR_SIGNAL';
            break;

        case 'echo':
            result.output = rest.join(' ').replace(/['"]/g, '');
            break;

        default:
            result.error = `bash: ${cmd}: command not found`;
    }

    return result;
};

