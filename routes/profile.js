var express = require('express');
var router = express.Router();
var db = require('../db'); // สมมุติว่ามีไฟล์ db.js เชื่อม MySQL อยู่

/* GET home page. */
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Profile' });
});


router.post('/profile/get-user-info', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

const query = `
    SELECT 
      user.email, 
      user.username, 
      customermember.cus_fullname, 
      customermember.cus_address, 
      customermember.cus_phone
    FROM user
    JOIN customermember ON user.id = customermember.cus_id
    WHERE user.id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
        email: results[0].email,
        username: results[0].username,
        fullname: results[0].cus_fullname,
        address: results[0].cus_address,
        phone: results[0].cus_phone
    });
  });
});

module.exports = router;
