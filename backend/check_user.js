const { db } = require('./models/database');
db.get("SELECT id, email, role, is_verified FROM users WHERE email='az.jo.fm@gmail.com'", (err, row) => {
  if (err) console.error(err);
  else console.log('User:', row);
  process.exit(0);
});
