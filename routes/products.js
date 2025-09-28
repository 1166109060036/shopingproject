var express = require('express');
var router = express.Router();
var db = require('../db'); // สมมุติว่ามีไฟล์ db.js เชื่อม MySQL อยู่
var path = require('path');
var multer = require('multer');

/* GET home page. */
router.get('/products', function(req, res, next) {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.render('products', { title: 'Products', products: results });
  });
});


router.post('/product/get-user-email', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const query = 'SELECT email FROM user WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการดึง email:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ email: results[0].email });
  });
});

router.get('/products/:id', (req, res) => {
  const productId = req.params.id;

  const sql = 'SELECT * FROM products WHERE product_id = ?';
  db.query(sql, [productId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('เกิดข้อผิดพลาดในการโหลดสินค้า');
    }

    if (results.length === 0) {
      return res.status(404).send('ไม่พบสินค้า');
    }

    const product = results[0];
    res.render('product-detail', { product });
  });
});

router.post('/add-to-cart/:productId', (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const userId = parseInt(req.body.userId); // ✅ ดึงมาจาก form ที่ส่งมา

  if (!userId) {
    return res.status(401).send('กรุณาเข้าสู่ระบบก่อน');
  }

  const getProductQuery = 'SELECT price FROM products WHERE products.product_id = ?';
  db.query(getProductQuery, [productId], (err, results) => {
    if (err || results.length === 0) return res.status(500).send('ไม่พบสินค้า');

    const price = results[0].price;
    const insertCartQuery = `
      INSERT INTO carts (product_id, user_id, cart_quantity, price)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE cart_quantity = cart_quantity + VALUES(cart_quantity)
    `;
    db.query(insertCartQuery, [productId, userId, quantity, price], (err2) => {
      if (err2) return res.status(500).send('เพิ่มสินค้าไม่สำเร็จ');
      res.redirect('/carts');
    });
  });
});



module.exports = router;
