const BASE_URL = 'http://localhost:8050';

window.onload = async () => {
    await loadData();
};

// ฟังก์ชันโหลดข้อมูลจาก API และแสดงในตาราง
const loadData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/RepairComputer`);
        console.log(response.data);  // ตรวจสอบข้อมูลที่ได้รับจาก API

        const userDOM = document.getElementById('user');
        let htmlData = createTableHeader();

        // สร้างแถวข้อมูลผู้ใช้แต่ละคน
        for (let user of response.data) {
            htmlData += createTableRow(user);
        }

        htmlData += `</tbody></table>`;
        userDOM.innerHTML = htmlData;

        // เพิ่ม event listener สำหรับการลบข้อมูล
        addDeleteEventListeners();
    } catch (error) {
        console.error("Error loading data:", error);
        alert('ไม่สามารถโหลดข้อมูลได้');
    }
};

// สร้างส่วนหัวของตาราง
const createTableHeader = () => {
    return `
        <table border="1" cellspacing="1" cellpadding="10">
            <thead>
                <tr>
                    <th>ชื่อลูกค้า</th>
                    <th>เบอร์โทร</th>
                    <th>อีเมล</th>
                    <th>ประเภทอุปกรณ์</th>
                    <th>รุ่นคอมพิวเตอร์</th>
                    <th>อุปกรณ์ที่แนบมาด้วย</th>
                    <th>รายละเอียดของปัญหา</th>
                    <th>วันที่ส่งซ่อม</th>
                    <th>สถานะ</th>
                    <th>การจัดการ</th>
                </tr>
            </thead>
            <tbody>
    `;
};

// สร้างแถวข้อมูลผู้ใช้
const createTableRow = (user) => {
    const formattedDate = new Date(user.date).toLocaleDateString('th-TH');  // แปลงเป็น Date และจัดรูปแบบ

    return `
        <tr>
            <td>${user.customer}</td>
            <td>${user.phone}</td>
            <td>${user.email}</td>
            <td>${user.deviceType}</td>
            <td>${user.brand}</td>
            <td>${user.accessories}</td>
            <td>${user.problem}</td>
            <td>${formattedDate}</td> 
            <td>${user.status}</td>
            <td>
                <a href="index1.html?id=${user.id}"><button class='Edit'>Edit</button></a>
                <button class="delete" data-id="${user.id}">Delete</button>
            </td>
        </tr>
    `;
};

// เพิ่ม event listener สำหรับปุ่มลบ
const addDeleteEventListeners = () => {
    const deleteButtons = document.getElementsByClassName('delete');
    for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', async (event) => {
            const userId = event.target.dataset.id;  // ดึง id ของ user ที่ต้องการลบ
            try {
                await axios.delete(`${BASE_URL}/RepairComputer/${userId}`);
                loadData(); // โหลดข้อมูลใหม่หลังจากลบ
            } catch (error) {
                console.error("Error deleting record:", error);
            }
        });
    }
};

