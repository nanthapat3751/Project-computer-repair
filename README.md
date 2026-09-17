#  Computer Repair Notification System

ระบบแจ้งซ่อมคอมพิวเตอร์ บนเว็บ สำหรับร้านซ่อมคอมพิวเตอร์ ใช้บันทึก ดู แก้ไข และลบรายการส่งซ่อมของลูกค้า พร้อมหน้าแสดงราคาซ่อมของอุปกรณ์แต่ละประเภท

Frontend เขียนด้วย HTML / CSS / JavaScript ส่วน Backend เป็น REST API ที่ใช้ Node.js (Express) กับ MySQL และรันฐานข้อมูลผ่าน Docker

---

##  ฟีเจอร์

- **แจ้งซ่อม**: กรอกข้อมูลลูกค้าและอุปกรณ์ (ชื่อ, เบอร์โทร, อีเมล, ประเภทอุปกรณ์, ยี่ห้อ/รุ่น, อุปกรณ์ที่แนบมา, ปัญหา, วันที่ส่งซ่อม) ระบบจะไฮไลต์ช่องที่ยังไม่ได้กรอก
- **ดูรายการซ่อม**: แสดงรายการซ่อมทั้งหมดเป็นตาราง พร้อมสถานะ
- **แก้ไข / ลบ**: แก้ไขหรือลบรายการซ่อมได้จากหน้าตาราง
- **ราคาซ่อม**: แสดงราคาซ่อมของ PC, Laptop, Keyboard, Mouse, CPU พร้อม QR Code สำหรับชำระเงิน
- **ข้อมูลติดต่อ**: ที่อยู่ เบอร์โทร และช่องทางโซเชียลของร้าน

##  เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
| --- | --- |
| Frontend | HTML, CSS, JavaScript, [Axios](https://axios-http.com/), [Font Awesome](https://fontawesome.com/) |
| Backend | Node.js, Express, mysql2, cors |
| Database | MySQL 8.0, phpMyAdmin |
| Tools | Docker, Docker Compose |

##  โครงสร้างโปรเจกต์

```
PROJECT/
├── images/                 # รูปภาพสไลด์หน้าแรก และ QR Code ชำระเงิน
├── server/                 # Backend (REST API)
│   ├── docker-compose.yml  # MySQL + phpMyAdmin
│   ├── index.js            # Express server (port 8050)
│   └── package.json
└── System/                 # Frontend
    ├── index1.html         # หน้าหลัก + ฟอร์มแจ้งซ่อม/แก้ไข
    ├── index.js
    ├── user.html           # ตารางรายการซ่อม
    ├── user.js
    ├── showitem.html       # หน้าราคาซ่อมแต่ละประเภท
    ├── connect.html        # หน้าทดสอบการเชื่อมต่อ API
    └── *.css, รูปภาพอุปกรณ์
```

##  การติดตั้งและใช้งาน

### สิ่งที่ต้องมี

- [Node.js](https://nodejs.org/) (แนะนำ v18 ขึ้นไป)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. เปิดฐานข้อมูล MySQL ด้วย Docker

```bash
cd server
docker compose up -d
```

| Service | URL / Port | ข้อมูลเข้าสู่ระบบ |
| --- | --- | --- |
| MySQL | `localhost:3306` | user `root` / password `root456` |
| phpMyAdmin | http://localhost:8090 | user `root` / password `root456` |

### 3. สร้างตาราง `RepairComputer`

เข้า phpMyAdmin ที่ http://localhost:8090 เลือกฐานข้อมูล `repair_computer` แล้วรัน SQL นี้

```sql
CREATE TABLE RepairComputer (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  customer    VARCHAR(255) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  email       VARCHAR(255) NOT NULL,
  deviceType  VARCHAR(50)  NOT NULL,
  brand       VARCHAR(255),
  accessories VARCHAR(255),
  problem     TEXT,
  date        DATE         NOT NULL,
  status      VARCHAR(50)  DEFAULT 'รอดำเนินการ'
);
```

### 4. รัน Backend

```bash
cd server
npm install
node index.js
```

ถ้ารันสำเร็จจะเห็นข้อความ `Server running at http://localhost:8050`

### 5. เปิด Frontend

เปิดไฟล์ `System/index1.html` ในเบราว์เซอร์ หรือใช้ส่วนขยาย **Live Server** ใน VS Code

## 📡 API Endpoints

Base URL: `http://localhost:8050`

| Method | Endpoint | คำอธิบาย |
| --- | --- | --- |
| `GET` | `/RepairComputer` | ดึงรายการซ่อมทั้งหมด |
| `GET` | `/RepairComputer/:id` | ดึงรายการซ่อมตาม ID |
| `POST` | `/RepairComputer` | เพิ่มรายการซ่อมใหม่ |
| `PUT` | `/RepairComputer/:id` | แก้ไขรายการซ่อม |
| `DELETE` | `/RepairComputer/:id` | ลบรายการซ่อม |

ตัวอย่าง Request Body สำหรับ `POST` / `PUT` (ช่องที่ต้องมี: `customer`, `phone`, `email`, `deviceType`, `date`)

```json
{
  "customer": "สมชาย ใจดี",
  "phone": "0812345678",
  "email": "somchai@example.com",
  "deviceType": "Laptop",
  "brand": "Acer Aspire 5",
  "accessories": "ที่ชาร์จ",
  "problem": "เปิดไม่ติด",
  "date": "2025-03-26"
}
```

##  ราคาซ่อม

| อุปกรณ์ | ราคา (บาท) |
| --- | --- |
| PC | 4,000 |
| Laptop | 2,899 |
| Keyboard | 699 |
| Mouse | 385 |
| CPU | 2,979 |

##  หมายเหตุ

- รหัสผ่านฐานข้อมูลเขียนไว้ตรง ๆ ใน `server/index.js` และ `docker-compose.yml` ใช้ได้กับการพัฒนาบนเครื่องตัวเองเท่านั้น ถ้าจะนำไปใช้งานจริงควรย้ายไปเก็บในไฟล์ `.env`
- ใน `index1.html` และ `showitem.html` รูปภาพอ้างอิงแบบ absolute path (`D:\PROJECT\images\...`) จึงแสดงบนเครื่องอื่นไม่ได้ ควรเปลี่ยนเป็น relative path เช่น `../images/13.jpg`

##  ผู้พัฒนา

- **Nanthapat Tang**: [Facebook](https://www.facebook.com/profile.php?id=100019804202203) · [Instagram](https://www.instagram.com/ntpxtt.s/)
- **Nattapat Suwannayuha**: [Facebook](https://www.facebook.com/profile.php?id=100020236086072) · [Instagram](https://www.instagram.com/xrtistzz._/)
