const fs = require('fs');

const files = [
    'src/components/simulators/BashSimulatorPro.jsx',
    'src/components/simulators/BashSimulatorData.js'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove backslash before backtick
    content = content.replace(/\\`/g, '`');

    // Remove backslash before dollar sign
    content = content.replace(/\\\$/g, '$');

    // Actually the previous script might have failed because the regex `\\`` means `\`` instead of literal backslash and backtick.
    // In JS string, '\\`' is '\`'. To match a backslash and a backtick, it's /\\\\`/g
    content = content.replace(/\\\\`/g, '`');
    content = content.replace(/\\\\\$/g, '$');

    // Let's just do a simple string replace all for the specific exact sequences:
    content = content.split('\\`').join('`');
    content = content.split('\\$').join('$');
    content = content.split('\\\\n').join('\\n');

    fs.writeFileSync(file, content);
    console.log(`Fixed escapes in ${file}`);
}
