const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // ชื่อผู้ใช้ของ MySQL
  password: '',        // ใส่รหัสผ่านถ้ามี
  database: 'shopdb',   // ชื่อฐานข้อมูล
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ การเชื่อมต่อฐานข้อมูลล้มเหลว:', err);
    return;
  }
  console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ');
  connection.release();
});

module.exports = pool;
