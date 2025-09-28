const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// GET แสดงฟอร์มตั้งรหัสผ่านใหม่
router.get('/reset-password', (req, res) => {
  const { token } = req.query;

  const sql = 'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()';
  db.query(sql, [token], (err, results) => {
    if (err || results.length === 0) {
      return res.send('ลิงก์หมดอายุหรือไม่ถูกต้อง');
    }

    res.render('reset-password', { token });
  });
});

// POST เปลี่ยนรหัสผ่านใหม่
router.post('/reset-password', async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  // ✅ ตรวจสอบว่ารหัสผ่านตรงกัน
  if (newPassword !== confirmPassword) {
    return res.send('รหัสผ่านไม่ตรงกัน');
  }

  // ✅ ตรวจสอบความซับซ้อนของรหัสผ่าน
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.send('รหัสผ่านต้องมีอย่างน้อย 8 ตัว และประกอบด้วย ตัวพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ');
  }

  // ✅ ตรวจสอบ token ว่ายังใช้ได้
  const sql = 'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()';
  db.query(sql, [token], async (err, results) => {
    if (err || results.length === 0) {
      return res.send('ลิงก์หมดอายุหรือไม่ถูกต้อง');
    }

    const userId = results[0].user_id;

    try {


      // ✅ อัปเดตในตาราง user
      const updateSql = 'UPDATE user SET password = ? WHERE id = ?';
      db.query(updateSql, [newPassword, userId], (updateErr) => {
        if (updateErr) {
          return res.send('เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน');
        }

        // ✅ ลบ token ที่ใช้ไปแล้ว
        db.query('DELETE FROM password_resets WHERE token = ?', [token]);

        // ✅ แสดงหน้าเสร็จสิ้น
        res.render('reseted-pass'); // ซูก้าทำหน้านี้ไว้แล้วใช่มั้ย 😄
      });
    } catch (hashError) {
      return res.send('เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน');
    }
  });
});

module.exports = router;
