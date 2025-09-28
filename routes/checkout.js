var express = require('express');
var router = express.Router();
var db = require('../db');
const multer = require('multer');
const path = require('path');

// ตั้งค่าอัปโหลดสลิป
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, 'slip_' + unique);
  },
});
const upload = multer({ storage });

router.post('/checkout', upload.single('paymentSlip'), (req, res) => {
  const productIds = Array.isArray(req.body.product_ids) ? req.body.product_ids : [req.body.product_ids];
  const quantities = Array.isArray(req.body.quantities) ? req.body.quantities : [req.body.quantities];
  const prices = Array.isArray(req.body.prices) ? req.body.prices : [req.body.prices];
  const cartIds = Array.isArray(req.body.cart_ids) ? req.body.cart_ids : [req.body.cart_ids];

  const userId = req.session.userId; 
  const slipImage = req.file ? '/images/' + req.file.filename : null;

  if (!productIds.length || !slipImage) {
    return res.status(400).send('ข้อมูลไม่ครบ');
  }

  let index = 0;

  function processNext() {
    if (index >= productIds.length) {
      // ถ้าทำครบทุกสินค้าแล้ว ให้ redirect
      return res.redirect('/products');
    }

    const pid = productIds[index];
    const qty = quantities[index];
    const price = prices[index];
    const cartId = cartIds[index];

    // 1. เพิ่มข้อมูลลง orders
    db.query(
      `INSERT INTO orders (user_id, product_id, quantity, price, slip_image, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, pid, qty, price, slipImage, 'กำลังตรวจสอบสลีป'],
      (err) => {
        if (err) {
          console.error('Insert order error:', err);
          return res.status(500).send('เกิดข้อผิดพลาด');
        }

        // 2. ลดจำนวนสินค้า
        db.query(
          `UPDATE products SET quantity = quantity - ? WHERE product_id = ? AND quantity >= ?`,
          [qty, pid, qty],
          (err) => {
            if (err) {
              console.error('Update quantity error:', err);
              return res.status(500).send('เกิดข้อผิดพลาด');
            }

            // 3. ลบตะกร้าสินค้า
            db.query(
              `DELETE FROM carts WHERE cart_id = ?`,
              [cartId],
              (err) => {
                if (err) {
                  console.error('Delete cart error:', err);
                  return res.status(500).send('เกิดข้อผิดพลาด');
                }
                index++;
                processNext(); // ทำสินค้าต่อไป
              }
            );
          }
        );
      }
    );
  }

  processNext();
});

module.exports = router;
