var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var infoRouter = require('./routes/info');
var reinfoRouter = require('./routes/reinfo');
var forgotPasswordRouter = require('./routes/forgot-password');
var resetPasswordRouter = require('./routes/reset-password'); 
var dashboardRouter = require('./routes/dashboard');
var productsRouter = require('./routes/products');
var profileRouter = require('./routes/profile'); // Profile router
var cartsRouter = require('./routes/carts'); // Cart router
var checkoutRouter = require('./routes/checkout'); // Checkout router
var myordersRouter = require('./routes/myorders');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: '1166109060036',       // รหัสลับ ใช้สำหรับเซ็น session cookie
  resave: false,               // ไม่บันทึก session ถ้าไม่มีการเปลี่ยนแปลง
  saveUninitialized: false,    // ไม่บันทึก session ที่ไม่ได้ตั้งค่าอะไร
  cookie: { maxAge: 24 * 60 * 60 * 1000 }  // อายุ session 1 วัน (มิลลิวินาที)
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/", registerRouter); // Register router
app.use("/", loginRouter); // Login router
app.use("/", infoRouter); // Info router
app.use("/", reinfoRouter); // Use reinfo router
app.use("/", forgotPasswordRouter);
app.use("/", resetPasswordRouter); // Reset password router
app.use("/",dashboardRouter)
app.use("/", productsRouter); // Product router
app.use("/", profileRouter); // Profile router
app.use("/", cartsRouter); // Cart router
app.use("/", checkoutRouter); // Checkout router
app.use("/", myordersRouter); // Checkout router

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
