var express = require('express');
var router = express.Router();
var db = require('../db');
const qrcode = require('qrcode');
const promptpay = require('promptpay-qr');
require('dotenv').config(); // ✅ โหลด .env ที่นี่


// ✅ แสดงหน้าตะกร้าสินค้า
router.get('/carts', (req, res) => {
  const userId = req.session.userId;
  console.log('Session userId:', userId);

  if (!userId) {
    return res.redirect('/login');
  }

  const sql = `
    SELECT c.cart_id, c.cart_quantity, c.price, c.product_id,
           p.product_name, p.image
    FROM carts c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], (err, cartItems) => {
    if (err) {
      console.error('❌ Error loading carts:', err);
      return res.status(500).send('เกิดข้อผิดพลาดในการโหลดตะกร้า');
    }

    res.render('carts', {
      title: 'Shopping Cart',
      cartItems,
    });
  });
});

// ✅ ลบสินค้าออกจากตะกร้า
router.post('/carts/delete/:cartId', (req, res) => {
  const userId = req.session.userId;
  const cartId = req.params.cartId;

  if (!userId) {
    return res.status(401).send('กรุณาเข้าสู่ระบบก่อน');
  }

  const checkSql = 'SELECT * FROM carts WHERE cart_id = ? AND user_id = ?';
  db.query(checkSql, [cartId, userId], (err, results) => {
    if (err) {
      console.error('❌ Error checking cart:', err);
      return res.status(500).send('เกิดข้อผิดพลาด');
    }

    if (results.length === 0) {
      return res.status(403).send('ไม่สามารถลบสินค้าได้');
    }

    const deleteSql = 'DELETE FROM carts WHERE cart_id = ?';
    db.query(deleteSql, [cartId], (delErr) => {
      if (delErr) {
        console.error('❌ Error deleting cart item:', delErr);
        return res.status(500).send('เกิดข้อผิดพลาดขณะลบสินค้า');
      }

      console.log(`🗑️ ลบสินค้า cart_id=${cartId} เรียบร้อย`);
      res.redirect('/carts');
    });
  });
});

// ✅ สร้าง QR Code สำหรับ PromptPay (ใช้ในหน้า carts.ejs)
router.get('/payment/pp-qr', async (req, res) => {
  try {
    const amount = parseFloat(req.query.amount || 0);
    const promptpayId = process.env.PROMPTPAY_ID; // 👉 กำหนดค่าเริ่มต้นเผื่อ .env หาย
    const payload = promptpay(promptpayId, { amount });
    const qrDataURL = await qrcode.toDataURL(payload);
    const img = Buffer.from(qrDataURL.split(',')[1], 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length,
    });
    res.end(img);
  } catch (err) {
    console.error('❌ Error generating PromptPay QR:', err);
    res.status(500).send('ไม่สามารถสร้าง QR ได้');
  }
});

module.exports = router;
