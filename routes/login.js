var express = require('express');
var router = express.Router();
var db = require('../db');
const jwt = require('jsonwebtoken');

const SECRET_KEY = '1166109060036'; 

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM user WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, error: 'เกิดข้อผิดพลาด' });
    }

    if (results.length > 0) {
      req.session.userId = results[0].id;
      console.log('Session หลัง login:', req.session); // ✅ เพิ่มบรรทัดนี้
      const user = results[0];
      const userId = user.id;

      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // บันทึก log ลงตาราง logadmin
      const logSql = 'INSERT INTO logadmin (user_id, ip_address, username, role) VALUES (?, ?, ?, ?)';
      db.query(logSql, [userId, ipAddress, user.username, user.role], (logErr) => {
        if (logErr) {
          console.error('เกิดข้อผิดพลาดขณะบันทึก log:', logErr);
        }
      });

      // สร้าง token
      const token = jwt.sign(
        { email: user.email, username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: '1d' }
      );

      res.json({ success: true, token, userId, role: user.role });
    } else {
      res.json({ success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
  });
});


module.exports = router;
