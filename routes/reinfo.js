const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const SECRET_KEY = '1166109060036';

router.get('/reinfo', (req, res) => {
  res.render('reinfo');
});

router.post('/reinfo', (req, res) => {
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

  db.query('SELECT id FROM user WHERE email = ?', [decoded.email], (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'ไม่สามารถค้นหาผู้ใช้ได้' });
    }

    const userId = results[0].id;

    db.query('SELECT * FROM customermember WHERE cus_id = ?', [userId], (err2, existing) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ success: false, error: 'ไม่สามารถตรวจสอบข้อมูลผู้ใช้ได้' });
      }

      if (existing.length > 0) {
        // ถ้ามีข้อมูลอยู่แล้ว ให้ทำการ UPDATE
        const updateSql = 'UPDATE customermember SET cus_fullname = ?, cus_address = ?, cus_phone = ? WHERE cus_id = ?';
        db.query(updateSql, [fullname, address, phone, userId], (err3) => {
          if (err3) {
            console.error(err3);
            return res.status(500).json({ success: false, error: 'อัปเดตข้อมูลไม่สำเร็จ' });
          }

          return res.json({ success: true, message: 'อัปเดตข้อมูลเรียบร้อยแล้ว' });
        });
      } else {
        // ถ้ายังไม่มีข้อมูล ให้ INSERT
        const insertSql = 'INSERT INTO customermember (cus_id, cus_fullname, cus_address, cus_phone) VALUES (?, ?, ?, ?)';
        db.query(insertSql, [userId, fullname, address, phone], (err3) => {
          if (err3) {
            console.error(err3);
            return res.status(500).json({ success: false, error: 'บันทึกข้อมูลไม่สำเร็จ' });
          }

          return res.json({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
        });
      }
    });
  });
});

module.exports = router;
