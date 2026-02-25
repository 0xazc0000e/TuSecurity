const { db } = require('./models/database');
const email = 'az.jo.fm@gmail.com';

console.log('Attempting to update user:', email);

db.run("UPDATE users SET role = 'admin', is_verified = 1, email_verified = 1 WHERE email = ?", [email], function(err) {
  if (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
  
  if (this.changes === 0) {
    console.log('User not found. Try registering first.');
  } else {
    console.log('Update successful! Rows affected:', this.changes);
  }
  
  db.get("SELECT id, email, role, is_verified FROM users WHERE email = ?", [email], (err, row) => {
    if (err) console.error('Select failed:', err);
    else console.log('Current user state:', row);
    
    db.close();
    process.exit(0);
  });
});
