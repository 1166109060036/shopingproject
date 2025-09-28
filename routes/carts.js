var express = require('express');
var router = express.Router();
var db = require('../db'); // อย่าลืมเชื่อม db ด้วยนะ

router.get('/carts', function(req, res, next) {
  const userId = req.session.userId;
  console.log('Session userId:', userId);

  if (!userId) {
    return res.status(401).send('กรุณาเข้าสู่ระบบก่อนดูตะกร้า');
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
      console.error(err);
      return res.status(500).send('เกิดข้อผิดพลาดในการโหลดตะกร้า');
    }

    res.render('carts', { title: 'Shopping Cart', cartItems });
  });
});

router.post('/carts/delete/:cartId', (req, res) => {
  const userId = req.session.userId;
  const cartId = req.params.cartId;

  if (!userId) {
    return res.status(401).send('กรุณาเข้าสู่ระบบก่อน');
  }

  // ตรวจสอบว่า cartId นี้เป็นของ user นี้หรือไม่ (เพื่อความปลอดภัย)
  const checkSql = 'SELECT * FROM carts WHERE cart_id = ? AND user_id = ?';
  db.query(checkSql, [cartId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('เกิดข้อผิดพลาด');
    }

    if (results.length === 0) {
      return res.status(403).send('ไม่สามารถลบสินค้าได้');
    }

    // ลบสินค้าออกจากตะกร้า
    const deleteSql = 'DELETE FROM carts WHERE cart_id = ?';
    db.query(deleteSql, [cartId], (delErr) => {
      if (delErr) {
        console.error(delErr);
        return res.status(500).send('เกิดข้อผิดพลาดขณะลบสินค้า');
      }
      res.redirect('/carts');  // กลับไปหน้าแสดงตะกร้า
    });
  });
});

module.exports = router;
