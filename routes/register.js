var express = require('express');
var router = express.Router();
var db = require('../db'); 
const jwt = require('jsonwebtoken');

const SECRET_KEY = '1166109060036'; 

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { email, username, password, role = 'user' } = req.body;

  // 🔍 ตรวจสอบว่า email ซ้ำหรือไม่
  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, emailResults) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, error: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' });
    }

    if (emailResults.length > 0) {
      return res.json({ success: false, error: 'อีเมลนี้ถูกใช้ไปแล้ว' });
    }

    // 🔍 ตรวจสอบว่า username ซ้ำหรือไม่
    db.query('SELECT * FROM user WHERE username = ?', [username], async (err2, usernameResults) => {
      if (err2) {
        console.error(err2);
        return res.json({ success: false, error: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' });
      }

      if (usernameResults.length > 0) {
        return res.json({ success: false, error: 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว' });
      }

      try {
        // ✅ สมัครสมาชิก
        const sql = 'INSERT INTO user (email, username, password, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [email, username, password, role], (err3, result) => {
          if (err3) {
            console.error(err3);
            return res.json({ success: false, error: 'สมัครไม่สำเร็จ' });
          }
          
          const userId = result.insertId;
          const token = jwt.sign({ id: userId, email, username, role }, SECRET_KEY, { expiresIn: '1d' });

          // ✅ ส่งกลับ token, userId, และ role
          res.json({ success: true, token, userId, role });
        });

      } catch (error) {
        console.error(error);
        return res.json({ success: false, error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
      }
    });
  });
});

module.exports = router;
