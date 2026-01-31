
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
                result.output = pathArg || target.split('/').pop();
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
            // Basic mkdir (no -p yet)
            const newDirName = rest[0];
            if (!newDirName) {
                result.error = 'mkdir: missing operand';
            } else {
                const parent = currentPath; // simplifying to current dir creation only for now
                const absNew = parent === '/' ? `/${newDirName}` : `${parent}/${newDirName}`;
                if (exists(absNew)) {
                    result.error = `mkdir: cannot create directory '${newDirName}': File exists`;
                } else {
                    // Add to parent children
                    const parentObj = { ...result.newVfs[parent] };
                    parentObj.children = [...parentObj.children, newDirName];
                    result.newVfs[parent] = parentObj;
                    // Create dir
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
            // Simple logic handling current directory only for simplicity
            if (!targetRm) {
                result.error = 'rm: missing operand';
            } else {
                const absRm = currentPath === '/' ? `/${targetRm}` : `${currentPath}/${targetRm}`;
                if (!exists(absRm)) {
                    result.error = `rm: cannot remove '${targetRm}': No such file or directory`;
                } else if (vfs[absRm].type === 'dir' && !rest.includes('-r')) {
                    result.error = `rm: cannot remove '${targetRm}': Is a directory`;
                } else {
                    // remove from parent
                    const parentObj = { ...result.newVfs[currentPath] };
                    parentObj.children = parentObj.children.filter(c => c !== targetRm);
                    result.newVfs[currentPath] = parentObj;
                    // delete key (and children if recursive - simplifying here)
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

        // Adding more mock commands for the curriculum
        case 'grep':
            result.output = "Found 3 matches."; // Mock
            break;
        case 'ps':
            result.output = "PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 5678 pts/0    00:00:00 ps";
            break;
        case 'who':
            result.output = "user     pts/0        2024-01-01 10:00 (:0)";
            break;
        case 'id':
            result.output = "uid=1000(user) gid=1000(user) groups=1000(user),4(adm)";
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
