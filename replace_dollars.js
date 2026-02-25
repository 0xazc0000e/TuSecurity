const fs = require('fs');

const file = 'src/components/simulators/BashSimulatorData.js';
let content = fs.readFileSync(file, 'utf8');

// The file contains literal sequences of backslash followed by dollar sign, like \${
// We want to replace \${ with ${ and \$ with $
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(file, content);
console.log('Fixed dollar signs in', file);
