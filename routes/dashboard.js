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

// ✅ แก้ไขข้อมูลสินค้า (ชื่อ, รายละเอียด, ราคา, จำนวน, รูป, สถานะ)
router.post('/dashboard/update-product/:id', upload.single('image'), function (req, res) {
  const productId = req.params.id;
  const { name, description, price, quantity, is_active } = req.body;
  const image = req.file ? '/images/' + req.file.filename : null;

  let sql, params;
  if (image) {
    sql = `
      UPDATE products 
      SET product_name = ?, description = ?, price = ?, quantity = ?, image = ?, is_active = ? 
      WHERE product_id = ?
    `;
    params = [name, description, price, quantity, image, is_active, productId];
  } else {
    sql = `
      UPDATE products 
      SET product_name = ?, description = ?, price = ?, quantity = ?, is_active = ? 
      WHERE product_id = ?
    `;
    params = [name, description, price, quantity, is_active, productId];
  }

  db.query(sql, params, (err) => {
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

      // ✅ เมื่อเปลี่ยนเป็น "ชำระเงินสำเร็จ" → ลดจำนวนสินค้าในสต็อก
      if (status === 'ชำระเงินสำเร็จ' && oldStatus !== 'ชำระเงินสำเร็จ') {
        db.query(
          'UPDATE products SET quantity = GREATEST(quantity - ?, 0) WHERE product_id = ?',
          [orderQty, productId],
          (err) => {
            if (err) throw err;
            res.redirect('/dashboard');
          }
        );

      // ✅ เมื่อเปลี่ยนเป็น "ชำระเงินไม่สำเร็จ" → เพิ่มจำนวนสินค้า (คืนสต็อก)
      } else if (status === 'ชำระเงินไม่สำเร็จ' && oldStatus === 'กำลังตรวจสอบสลีป') {
        db.query(
          'UPDATE products SET quantity = quantity + ? WHERE product_id = ?',
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

// ✅ หน้าแสดงยอดขาย (Sales Report)
router.get('/dashboard/sales', (req, res) => {
  // Query สำหรับข้อมูลในกราฟ (ยอดขาย 30 วันล่าสุด)
  const salesByDayQuery = `
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m-%d') as sale_date,
      SUM(price) as daily_total
    FROM orders 
    WHERE status IN ('ชำระเงินสำเร็จ', 'สินค้ากำลังจัดส่ง', 'จัดส่งสำเร็จ') AND created_at >= CURDATE() - INTERVAL 30 DAY
    GROUP BY DATE(created_at)
    ORDER BY sale_date ASC;
  `;

  // Query สำหรับสรุปยอดขาย (วันนี้, เดือนนี้, ปีนี้) 
  const summaryQuery = `
    SELECT
      (SELECT SUM(price) FROM orders WHERE status IN ('ชำระเงินสำเร็จ', 'สินค้ากำลังจัดส่ง', 'จัดส่งสำเร็จ') AND DATE(created_at) = CURDATE()) as today_sales,
      (SELECT SUM(price) FROM orders WHERE status IN ('ชำระเงินสำเร็จ', 'สินค้ากำลังจัดส่ง', 'จัดส่งสำเร็จ') AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())) as month_sales,
      (SELECT SUM(price) FROM orders WHERE status IN ('ชำระเงินสำเร็จ', 'สินค้ากำลังจัดส่ง', 'จัดส่งสำเร็จ') AND YEAR(created_at) = YEAR(CURDATE())) as year_sales;
  `;

  db.query(salesByDayQuery, (err, salesData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลยอดขาย');
    }

    db.query(summaryQuery, (err, summaryData) => {
      if (err) {
        console.error(err);
        return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลสรุป');
      }

      // Query สำหรับสินค้าขายดี 5 อันดับแรก
      const bestSellersQuery = `
        SELECT
          p.product_name,
          SUM(o.quantity) AS total_quantity_sold
        FROM orders AS o
        JOIN products AS p ON o.product_id = p.product_id
        WHERE o.status IN ('ชำระเงินสำเร็จ', 'สินค้ากำลังจัดส่ง', 'จัดส่งสำเร็จ')
        GROUP BY p.product_name
        ORDER BY total_quantity_sold DESC
        LIMIT 5;
      `;

      db.query(bestSellersQuery, (err, bestSellersData) => {
        if (err) {
          console.error(err);
          return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าขายดี');
        }
        res.render('sales-report', {
          title: 'รายงานยอดขาย',
          salesData: salesData,
          summary: summaryData[0],
          bestSellers: bestSellersData // ข้อมูลสินค้าขายดี
        });
      });
    });
  });
});

module.exports = router;
