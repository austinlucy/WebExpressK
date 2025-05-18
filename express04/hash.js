const bcrypt = require('bcrypt');
const mysql = require('mysql');

const username = process.argv[2];
const password = process.argv[3];
const role = process.argv[4];

if (!username || !password || !role) {
  console.log('Format: node hash.js <username> <password> <role>');
  process.exit();
}

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'galeri_tk'
});

bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) throw err;

  const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  db.query(sql, [username, hashedPassword, role], (err, result) => {
    if (err) throw err;
    console.log(`User '${username}' berhasil dibuat sebagai '${role}'`);
    db.end();
  });
});
