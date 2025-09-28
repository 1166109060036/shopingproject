var express = require('express');
var router = express.Router();
var db = require('../db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/* GET forgot password page. */
router.get('/forgot-password', function(req, res, next) {
  res.render('forgot-password', { title: 'ลืมรหัสผ่าน' });
});

// POST ส่งลิงก์ไปยังอีเมล
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // ตรวจสอบว่ามีผู้ใช้งานนี้ไหม
  db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ success: false, message: 'ไม่พบบัญชีนี้ในระบบ' }); // <- แก้จากบรรทัด 19
    }

    const user = results[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 ชม.

    // เก็บ token ไว้ในตาราง password_resets
    db.query('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt], (insertErr) => {
        if (insertErr) {
          return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' }); // <- แก้จากบรรทัด 30
        }

        // ส่งอีเมล
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'partouton@gmail.com',
            pass: 'uwvp jxli xkrw jcsy',
          }
        });

        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        const mailOptions = {
          from: 'partouton@gmail.com',
          to: email,
          subject: 'รีเซ็ตรหัสผ่าน',
          html: `<p>คลิก <a href="${resetLink}">ที่นี่</a> เพื่อรีเซ็ตรหัสผ่าน (ลิงก์จะหมดอายุใน 1 ชั่วโมง)</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'ไม่สามารถส่งอีเมลได้' }); // <- แก้จากบรรทัด 53
          }

          // สำเร็จ ส่ง JSON กลับ frontend
          return res.json({ success: true, message: 'ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบอีเมล' });
        });
      });
  });
});

module.exports = router;
