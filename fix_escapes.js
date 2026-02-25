const fs = require('fs');
const files = [
    'src/components/simulators/BashSimulatorPro.jsx',
    'src/components/simulators/BashSimulatorData.js'
];
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace incorrectly escaped backticks
    content = content.replace(/\\`/g, '`');
    // Replace incorrectly escaped dollar signs
    content = content.replace(/\\\$/g, '$');
    // Replace double-backslashed newlines
    content = content.replace(/\\\\n/g, '\\n');
    fs.writeFileSync(file, content);
    console.log(`Fixed escapes in ${file}`);
}
