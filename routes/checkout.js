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

// ✅ เส้นทาง Checkout
router.post('/checkout', upload.single('paymentSlip'), (req, res) => {
  const userId = req.session.userId; 
  const productIds = Array.isArray(req.body.product_ids) ? req.body.product_ids : [req.body.product_ids];
  const quantities = Array.isArray(req.body.quantities) ? req.body.quantities : [req.body.quantities];
  const prices = Array.isArray(req.body.prices) ? req.body.prices : [req.body.prices];
  const cartIds = Array.isArray(req.body.cart_ids) ? req.body.cart_ids : [req.body.cart_ids];
  const slipImage = req.file ? '/images/' + req.file.filename : null;

  if (!userId) {
    return res.status(401).send('❗ กรุณาเข้าสู่ระบบก่อนชำระเงิน');
  }

  if (!productIds.length) {
    return res.status(400).send('❗ กรุณาเลือกสินค้าอย่างน้อย 1 รายการ');
  }

  if (!slipImage) {
    return res.status(400).send('❗ กรุณาแนบสลิปการชำระเงิน');
  }

  let index = 0;

  // ฟังก์ชันทำรายการแต่ละสินค้า
  function processNext() {
    if (index >= productIds.length) {
      console.log('✅ สั่งซื้อสำเร็จทั้งหมด');
      return res.send(`
        <script>
          alert('✅ ชำระเงินสำเร็จ ขอบคุณที่ใช้บริการ!');
          window.location.href = '/myorders';
        </script>
      `);
    }

    const pid = productIds[index];
    const qty = quantities[index];
    const price = prices[index];
    const cartId = cartIds[index];

    // 1️⃣ บันทึกคำสั่งซื้อ
    db.query(
      `INSERT INTO orders (user_id, product_id, quantity, price, slip_image, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, pid, qty, price, slipImage, 'กำลังตรวจสอบสลีป'],
      (err) => {
        if (err) {
          console.error('❌ Insert order error:', err);
          return res.status(500).send('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
        }

        // 2️⃣ ลดจำนวนสินค้า
        db.query(
          `UPDATE products 
           SET quantity = quantity - ? 
           WHERE product_id = ? AND quantity >= ?`,
          [qty, pid, qty],
          (err) => {
            if (err) {
              console.error('❌ Update product error:', err);
              return res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า');
            }

            // 3️⃣ ลบออกจากตะกร้า
            db.query(`DELETE FROM carts WHERE cart_id = ?`, [cartId], (err) => {
              if (err) {
                console.error('❌ Delete cart error:', err);
                return res.status(500).send('เกิดข้อผิดพลาดในการลบสินค้าออกจากตะกร้า');
              }

              console.log(`🛒 ลบสินค้า cart_id=${cartId} เรียบร้อย`);
              index++;
              processNext();
            });
          }
        );
      }
    );
  }

  processNext();
});

module.exports = router;
