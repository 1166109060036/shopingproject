var express = require('express');
var router = express.Router();
var db = require('../db');
var path = require('path');
var multer = require('multer');

// แสดงหน้า dashboard
router.get('/dashboard', function (req, res) {
  db.query('SELECT * FROM products', (err, products) => {
    if (err) throw err;

    // ✅ เพิ่ม WHERE เพื่อตัด order ที่จัดส่งสำเร็จออกไป
    db.query('SELECT * FROM orders WHERE status != "จัดส่งสำเร็จ"', (err, orders) => {
      if (err) throw err;

      res.render('dashboard', { 
        title: 'Dashboard', 
        products: products,
        orders: orders 
      });
    });
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ✅ เพิ่มสินค้า
router.post('/dashboard/add', upload.single('image'), function (req, res) {
  const { name, description, price, quantity } = req.body;
  const image = req.file ? '/images/' + req.file.filename : null;

  db.query(
    'INSERT INTO products (product_name, description, price, quantity, image, is_active) VALUES (?, ?, ?, ?, ?, 1)',
    [name, description, price, quantity, image],
    (err, result) => {
      if (err) throw err;
      res.redirect('/dashboard');
    }
  );
});

// ✅ ลบสินค้า (จริง ๆ แนะนำให้ใช้ inactive มากกว่า delete)
router.post('/dashboard/delete/:id', function (req, res) {
  const productId = req.params.id;
  db.query('DELETE FROM products WHERE product_id = ?', [productId], (err, result) => {
    if (err) throw err;
    res.redirect('/dashboard');
  });
});

// ✅ แก้ไขชื่อสินค้า / รายละเอียด / รูป
router.post('/dashboard/update-product/:id', upload.single('image'), function (req, res) {
  const productId = req.params.id;
  const { name, description } = req.body;
  const image = req.file ? '/images/' + req.file.filename : null;

  if (image) {
    // ถ้าอัปโหลดรูปใหม่
    db.query(
      'UPDATE products SET product_name = ?, description = ?, image = ? WHERE product_id = ?',
      [name, description, image, productId],
      (err) => {
        if (err) throw err;
        res.redirect('/dashboard');
      }
    );
  } else {
    // ถ้าไม่อัปโหลดรูปใหม่ → อัปเดตเฉพาะชื่อ/รายละเอียด
    db.query(
      'UPDATE products SET product_name = ?, description = ? WHERE product_id = ?',
      [name, description, productId],
      (err) => {
        if (err) throw err;
        res.redirect('/dashboard');
      }
    );
  }
});


// ✅ แก้ไขราคาสินค้า
router.post('/dashboard/update-price/:id', function (req, res) {
  const productId = req.params.id;
  const { price } = req.body;
  db.query('UPDATE products SET price = ? WHERE product_id = ?', [price, productId], (err) => {
    if (err) throw err;
    res.redirect('/dashboard');
  });
});

// ✅ แก้ไขจำนวนสินค้า
router.post('/dashboard/update-quantity/:id', function (req, res) {
  const productId = req.params.id;
  const { quantity } = req.body;
  db.query('UPDATE products SET quantity = ? WHERE product_id = ?', [quantity, productId], (err) => {
    if (err) throw err;
    res.redirect('/dashboard');
  });
});

// ✅ อัปเดตสถานะสินค้า (Active/Inactive)
router.post('/dashboard/update-status/:id', function (req, res) {
  const productId = req.params.id;
  const { is_active } = req.body;

  db.query('UPDATE products SET is_active = ? WHERE product_id = ?', [is_active, productId], (err) => {
    if (err) throw err;
    res.redirect('/dashboard');
  });
});

// ✅ อัปเดตสถานะคำสั่งซื้อ + ลดสต็อกสินค้า
router.post('/dashboard/update-order-status/:id', function (req, res) {
  const orderId = req.params.id;
  const { status } = req.body;

  db.query('SELECT status, product_id, quantity FROM orders WHERE order_id = ?', [orderId], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.redirect('/dashboard');
    }

    const oldStatus = results[0].status;
    const productId = results[0].product_id;
    const orderQty = results[0].quantity;

    db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId], (err) => {
      if (err) throw err;

      if (status === 'ชำระเงินสำเร็จ' && oldStatus !== 'ชำระเงินสำเร็จ') {
        db.query(
          'UPDATE products SET quantity = GREATEST(quantity - ?, 0) WHERE product_id = ?',
          [orderQty, productId],
          (err) => {
            if (err) throw err;
            res.redirect('/dashboard');
          }
        );
      } else {
        res.redirect('/dashboard');
      }
    });
  });
});

// ✅ ลบคำสั่งซื้อ
router.post('/dashboard/delete-order/:id', function (req, res) {
  const orderId = req.params.id;
  db.query('DELETE FROM orders WHERE order_id = ?', [orderId], (err) => {
    if (err) throw err;
    res.redirect('/dashboard');
  });
});

router.get('/logout', (req, res) => {
  res.render('logout');
});

module.exports = router;
