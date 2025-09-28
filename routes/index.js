var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  
});

router.get('/check-session', (req, res) => {
  if (req.session.userId) {
    res.send(`Session OK: userId = ${req.session.userId}`);
  } else {
    res.send('ยังไม่มี session หรือยังไม่ได้ login');
  }
});

module.exports = router;
