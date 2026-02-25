const fs = require('fs');
const path = require('path');

function replaceFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace require('sqlite3') with requires('better-sqlite3')
    content = content.replace(/const sqlite3 = require\('sqlite3'\).verbose\(\);/g, 'const Database = require(\'better-sqlite3\');');
    
    // In models/database.js
    if (filePath.endsWith('database.js')) {
        content = content.replace(/const db = new sqlite3\.Database\(DB_PATH[^]*?\}\);/m, 
            "const db = new Database(DB_PATH, { verbose: console.log });\nconsole.log('Connected to SQLite database at:', DB_PATH);");
        
        // Remove db.serialize()
        content = content.replace(/db\.serialize\(\(\) => \{/g, '');
        content = content.replace(/\}\);\n\s*\}\);\n\s*\}\/ \/\/ End serialize/g, '');
        
        // Replace db.run with db.prepare(sql).run()
        content = content.replace(/db\.run\(`([^`]+)`\)/g, "db.prepare(`$1`).run()");
        content = content.replace(/db\.run\(`([^`]+)`,\s*\[([^\]]+)\]\)/g, "db.prepare(`$1`).run($2)");
        content = content.replace(/db\.run\(([^,]+),\s*\[([^\]]+)\]\)/g, "db.prepare($1).run($2)");
        content = content.replace(/db\.run\(([^,]+)\)/g, "db.prepare($1).run()");
    }
    
    fs.writeFileSync(filePath, content);
}

// Due to complex callbacks in controllers, a simple regex is risky.
// Better to write a python script or robust AST replacer.
console.log("Migration script initialized (not executed safely yet).");
