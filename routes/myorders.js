var express = require('express');
var router = express.Router();
var PDFDocument = require('pdfkit');
var path = require('path'); // <== เพิ่มบรรทัดนี้
var db = require('../db'); // เชื่อม MySQL

router.get('/myorders', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect('/login'); // ถ้าไม่ login
  }

  db.query(
    'SELECT o.*, p.product_name, p.image FROM orders o LEFT JOIN products p ON o.product_id = p.product_id WHERE o.user_id = ? ORDER BY o.created_at DESC',
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('เกิดข้อผิดพลาด');
      }

      res.render('myorders', { orders: results });
    }
  );
});

router.get('/invoice/:orderId', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/login');

    db.query(
        `SELECT o.*, p.product_name 
         FROM orders o
         LEFT JOIN products p ON o.product_id = p.product_id
         WHERE o.order_id = ?`,
        [req.params.orderId],
        (err, orders) => {
            if (err) return res.status(500).send('เกิดข้อผิดพลาดในระบบ');
            if (orders.length === 0) return res.status(404).send('ไม่พบคำสั่งซื้อ');

            const order = orders[0];

            db.query(
                `SELECT c.cus_fullname, c.cus_address, c.cus_phone
                FROM customermember c
                INNER JOIN user u ON c.cus_id = u.id
                WHERE u.id = ?`,
                [userId],
                (err, customers) => {
                    if (err) return res.status(500).send('เกิดข้อผิดพลาดในระบบ');
                    if (customers.length === 0) return res.status(404).send('ไม่พบข้อมูลลูกค้า');

                    const customer = customers[0];
                    const fontRegular = path.join(__dirname, '../public/THSarabunNew.ttf');
                    const fontBold = path.join(__dirname, '../public/THSarabunNewBold.ttf');

                    const doc = new PDFDocument({ size: 'A4', margin: 50 });
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename=invoice_${order.order_id}.pdf`);
                    doc.pipe(res);

                    // ===== หัวบิล =====
                    doc.font(fontBold).fontSize(26).text('CyloCity', { align: 'center' });
                    doc.moveDown(0.5);
                    doc.font(fontBold).fontSize(20).text('ใบเสร็จรับเงิน', { align: 'center' });
                    doc.moveDown(1);

                    // หมายเลขคำสั่งซื้อ
                    doc.font(fontRegular).fontSize(14).text(`หมายเลขคำสั่งซื้อ: ${order.order_id}`, { align: 'right' });
                    doc.moveDown(0.5);

                    // ===== ข้อมูลลูกค้า =====
                    doc.font(fontBold).fontSize(16).text('ข้อมูลลูกค้า');
                    doc.font(fontRegular)
                       .text(`ชื่อลูกค้า: ${customer.cus_fullname}`)
                       .text(`ที่อยู่: ${customer.cus_address}`)
                       .text(`เบอร์โทร: ${customer.cus_phone}`);
                    doc.moveDown(1);

                    // ===== ตารางสินค้า =====
                    const startX = 50;
                    let y = doc.y;

                    // หัวตาราง
                    doc.font(fontBold)
                       .text('ชื่อสินค้า', startX, y)
                       .text('จำนวน', 300, y)
                       .text('ราคา', 400, y);
                    y += 20;

                    // เส้นคั่นหัวตาราง
                    doc.moveTo(50, y).lineTo(550, y).stroke();
                    y += 10;

                    // แถวสินค้า
                    doc.font(fontRegular)
                       .text(order.product_name, startX, y)
                       .text(order.quantity.toString(), 300, y)
                       .text(`${order.price} บาท`, 400, y);

                    y += 20;

                    // ===== คำนวณยอดรวม =====
                    const total = order.price * order.quantity;

                    // เส้นคั่นก่อนยอดรวม
                    doc.moveTo(50, y).lineTo(550, y).stroke();
                    y += 10;

                    // ยอดรวมที่มุมขวาล่าง
                    doc.font(fontBold)
                       .text(`ยอดรวม: ${total} บาท`, { align: 'right' });

                    doc.end();
                }
            );
        }
    );
});

module.exports = router;
