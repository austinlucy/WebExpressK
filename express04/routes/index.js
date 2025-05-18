const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Beranda',
    user: req.session.user
  });
});

router.get('/galeri/:kategori', (req, res) => {
  const kategori = req.params.kategori;
  const sql = `SELECT objek.* FROM objek JOIN kategori
               ON objek.kategori_id = kategori.id
               WHERE kategori.nama = ?`;

  db.query(sql, [kategori], (err, results) => {
    if (err) throw err;
    res.render('galeri', { data: results, kategori });
  });
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND role = "admin"';

  db.query(sql, [username], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.render('login', { error: 'Username tidak ditemukan' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.render('login', { error: 'Password salah' });
      }
    });
  });
});

router.get('/user-login', (req, res) => {
  res.render('user-login', { error: null });
});

router.post('/user-login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND role = "user"';

  db.query(sql, [username], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.render('user-login', { error: 'Username tidak ditemukan' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.render('user-login', { error: 'Password salah' });
      }
    });
  });
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const sqlCheck = 'SELECT * FROM users WHERE username = ?';

  db.query(sqlCheck, [username], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.render('register', { error: 'Username sudah digunakan' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      const sqlInsert = 'INSERT INTO users (username, password, role) VALUES (?, ?, "user")';
      db.query(sqlInsert, [username, hash], (err) => {
        if (err) throw err;
        res.redirect('/user-login');
      });
    });
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
