const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = `
    SELECT products.id, products.name, products.price, categories.name AS category
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('home', { products: results });
  });
});

module.exports = router;