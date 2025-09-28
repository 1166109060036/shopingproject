const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const SECRET_KEY = '1166109060036';

router.get('/info', (req, res) => {
  res.render('info');
});

router.post('/info', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'ไม่พบ Token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }

  const { fullname, address, phone } = req.body;

  // ดึง id ของผู้ใช้จาก email ที่อยู่ใน token
  db.query('SELECT id FROM user WHERE email = ?', [decoded.email], (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'ไม่สามารถค้นหาผู้ใช้ได้' });
    }

    const userId = results[0].id;

    // ตรวจสอบว่าผู้ใช้คนนี้กรอกข้อมูลไปแล้วหรือยัง
    db.query('SELECT * FROM customermember WHERE cus_id = ?', [userId], (err2, existing) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ success: false, error: 'ไม่สามารถตรวจสอบข้อมูลผู้ใช้ได้' });
      }

      if (existing.length > 0) {
        return res.status(400).json({ success: false, error: 'คุณได้บันทึกข้อมูลไว้แล้ว' });
      }

      // เพิ่มข้อมูลเข้า customermember
      const sql = 'INSERT INTO customermember (cus_id, cus_fullname, cus_address, cus_phone) VALUES (?, ?, ?, ?)';
      db.query(sql, [userId, fullname, address, phone], (err3) => {
        if (err3) {
          console.error(err3);
          return res.status(500).json({ success: false, error: 'บันทึกข้อมูลไม่สำเร็จ' });
        }

        return res.json({ success: true });
      });
    });
  });
});

module.exports = router;
