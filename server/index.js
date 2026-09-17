const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 8050;

// ใช้ express.json() แทน body-parser
app.use(express.json());
app.use(cors()); // เปิดใช้งาน CORS เพื่อให้สามารถทำงานกับ Postman หรือจากต่างโดเมน

// สร้างการเชื่อมต่อ MySQL แบบ Single Connection
let conn = null;
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root456',
        database: 'repair_computer',
        port: 3306
    });
};

app.get('/RepairComputer', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT * FROM RepairComputer');
        res.status(200).json(results); // ส่งข้อมูลทั้งหมดในรูปแบบ JSON
    } catch (error) {
        console.error("Error fetching all repair records:", error);
        res.status(500).json({ message: 'Error fetching all repair records', error: error.message });
    }
});


app.get('/RepairComputer/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await conn.query('SELECT * FROM RepairComputer WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Repair record not found' });
        }
        res.status(200).json(rows[0]);  // ส่งข้อมูลที่พบในรูปแบบ JSON
    } catch (error) {
        console.error("Error fetching data by ID:", error);
        res.status(500).json({ message: 'Error fetching data by ID', error: error.message });
    }
});


app.post('/RepairComputer', async (req, res) => {
    const userData = req.body;
    try {
        // ตรวจสอบข้อมูลก่อนบันทึก
        if (!userData.customer || !userData.phone || !userData.email || !userData.deviceType || !userData.date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [result] = await conn.query('INSERT INTO RepairComputer SET ?', userData);
        res.status(201).json({ message: 'Record created successfully', id: result.insertId });
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).json({ message: 'Error creating record', error: error.message });
    }
});

// API สำหรับการอัปเดตข้อมูลการซ่อมคอมพิวเตอร์
app.put('/RepairComputer/:id', async (req, res) => {
    const { id } = req.params;
    const userData = req.body;

    try {

        if (!userData.customer || !userData.phone || !userData.email || !userData.deviceType || !userData.date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [result] = await conn.query('UPDATE RepairComputer SET ? WHERE id = ?', [userData, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Repair record not found for update' });
        }

        res.status(200).json({ message: 'Record updated successfully' });
    } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ message: 'Error updating record', error: error.message });
    }
});

app.delete('/RepairComputer/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await conn.query('DELETE FROM RepairComputer WHERE id = ?', [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Repair record not found to delete' });
        }
        res.status(200).json({
            message: "Delete record successfully",
            data: results
        });
    } catch (error) {
        console.error("Error deleting record:", error.message);
        res.status(500).json({
            message: "Something went wrong while deleting",
            error: error.message
        });
    }
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, async () => {
    try {
        await initMySQL();  // ตรวจสอบการเชื่อมต่อกับฐานข้อมูล
        console.log(`Server running at http://localhost:${port}`);
    } catch (error) {
        console.error('Error initializing MySQL connection:', error.message);
    }
});
