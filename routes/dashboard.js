var express = require('express');
var router = express.Router();
var db = require('../db'); // สมมุติว่ามีไฟล์ db.js เชื่อม MySQL อยู่
var path = require('path');
var multer = require('multer');

// แสดงหน้า dashboard
router.get('/dashboard', function (req, res) {
  db.query('SELECT * FROM products', (err, products) => {
    if (err) throw err;

    db.query('SELECT * FROM orders', (err, orders) => {
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
    cb(null, 'public/images/'); // เก็บไฟล์ไว้ใน public/images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อใหม่ให้ไม่ซ้ำ
  }
});
const upload = multer({ storage: storage });

// ✅ เพิ่มสินค้า
router.post('/dashboard/add', upload.single('image'), function (req, res) {
  const { name, description, price, quantity } = req.body;
  const image = req.file ? '/images/' + req.file.filename : null;

  db.query(
    'INSERT INTO products (product_name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, quantity, image],
    (err, result) => {
      if (err) throw err;
      res.redirect('/dashboard');
    }
  );
});

// ✅ ลบสินค้า
router.post('/dashboard/delete/:id', function (req, res) {
  const productId = req.params.id;
  db.query('DELETE FROM products WHERE product_id = ?', [productId], (err, result) => {
    if (err) throw err;
    res.redirect('/dashboard');
  });
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

// ✅ อัปเดตสถานะคำสั่งซื้อ
// ✅ อัปเดตสถานะคำสั่งซื้อ + ลดสต็อกสินค้า
router.post('/dashboard/update-order-status/:id', function (req, res) {
  const orderId = req.params.id;
  const { status } = req.body;

  // 1) ดึงสถานะเก่ามาเช็กก่อน
  db.query('SELECT status, product_id, quantity FROM orders WHERE order_id = ?', [orderId], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.redirect('/dashboard'); // ไม่มี order นี้
    }

    const oldStatus = results[0].status;
    const productId = results[0].product_id;
    const orderQty = results[0].quantity;

    // 2) อัปเดตสถานะใหม่
    db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId], (err) => {
      if (err) throw err;

      // 3) ถ้าเปลี่ยนจากสถานะอื่น → "ชำระเงินสำเร็จ" (ป้องกันหักซ้ำ)
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
  res.render('logout'); // logout.ejs หรือ logout.html
});





module.exports = router;
