const BASE_URL = 'http://localhost:8050';  
let mode = 'CREATE';  
let selectId = '';   

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');  

    
    if (id) {
        mode = 'EDIT';  
        selectId = id;  

        try {
            // ดึงข้อมูลการซ่อมคอมพิวเตอร์จาก API โดยใช้ ID
            const response = await axios.get(`${BASE_URL}/RepairComputer/${id}`);
            const user = response.data;  

            // แปลงวันที่ให้เป็นรูปแบบ yyyy-mm-dd (รองรับใน input[type="date"])
            const formattedDate = user.date ? new Date(user.date).toISOString().split('T')[0] : ''; 

            document.querySelector('input[name=customer]').value = user.customer || '';
            document.querySelector('input[name=phone]').value = user.phone || '';
            document.querySelector('input[name=email]').value = user.email || '';
            document.querySelector('select[name=deviceType]').value = user.deviceType || '';
            document.querySelector('input[name=brand]').value = user.brand || '';
            document.querySelector('input[name=accessories]').value = user.accessories || '';
            document.querySelector('textarea[name=problem]').value = user.problem || '';
            document.querySelector('input[name=date]').value = formattedDate; 
        } catch (error) {
            console.log('Error:', error);
            alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
    }
};

const submitData = async () => {
    let customerDom = document.querySelector('input[name=customer]');
    let phoneDom = document.querySelector('input[name=phone]');
    let emailDom = document.querySelector('input[name=email]');
    let deviceTypeDom = document.querySelector('select[name=deviceType]');
    let brandDom = document.querySelector('input[name=brand]');
    let accessoriesDom = document.querySelector('input[name=accessories]');
    let problemDom = document.querySelector('textarea[name=problem]');
    let dateDom = document.querySelector('input[name=date]');
    let messageDOM = document.getElementById('message');  

    let missingFields = [];  

    if (!customerDom.value) {
        missingFields.push('ชื่อ');
        customerDom.classList.add('highlight');
    } else {
        customerDom.classList.remove('highlight');
    }

    if (!phoneDom.value) {
        missingFields.push('เบอร์โทร');
        phoneDom.classList.add('highlight');
    } else {
        phoneDom.classList.remove('highlight');
    }

    if (!emailDom.value) {
        missingFields.push('อีเมล');
        emailDom.classList.add('highlight');
    } else {
        emailDom.classList.remove('highlight');
    }

    if (!deviceTypeDom.value) {
        missingFields.push('ประเภทอุปกรณ์');
        deviceTypeDom.classList.add('highlight');
    } else {
        deviceTypeDom.classList.remove('highlight');
    }

    if (!brandDom.value) {
        missingFields.push('ยี่ห้อ / รุ่นคอมพิวเตอร์');
        brandDom.classList.add('highlight');
    } else {
        brandDom.classList.remove('highlight');
    }

    if (!accessoriesDom.value) {
        missingFields.push('อุปกรณ์ที่แนบมาด้วย');
        accessoriesDom.classList.add('highlight');
    } else {
        accessoriesDom.classList.remove('highlight');
    }

    if (!problemDom.value) {
        missingFields.push('รายละเอียดปัญหา');
        problemDom.classList.add('highlight');
    } else {
        problemDom.classList.remove('highlight');
    }

    if (!dateDom.value) {
        missingFields.push('วันที่ส่งซ่อม');
        dateDom.classList.add('highlight');
    } else {
        dateDom.classList.remove('highlight');
    }

    if (missingFields.length > 0) {
        messageDOM.innerHTML = `กรุณากรอกข้อมูลให้ครบถ้วน : <br>${missingFields.join('<br>')}`;
        messageDOM.className = 'message danger';
        return;
    }
    

    let userData = {
        customer: customerDom.value,
        phone: phoneDom.value,
        email: emailDom.value,
        deviceType: deviceTypeDom.value,
        brand: brandDom.value,
        accessories: accessoriesDom.value,
        problem: problemDom.value,
        date: dateDom.value, 
    };

    let message = 'บันทึกรายการส่งซ่อมเรียบร้อย ✔';

    try {
       
        console.log('Sending data to API:', userData);

        if (mode === 'CREATE') {
            const response = await axios.post(`${BASE_URL}/RepairComputer`, userData);
            message = 'บันทึกรายการซ่อมใหม่เรียบร้อย';
            console.log('response', response.data);
        } else {
            const response = await axios.put(`${BASE_URL}/RepairComputer/${selectId}`, userData);
            message = 'แก้ไขข้อมูลเรียบร้อย';
            console.log('response', response.data);
        }
        setTimeout(() => {
            window.location.href = 'showitem.html';  
        }, 250);  

        messageDOM.innerText = message;
        messageDOM.className = 'message success';
        document.getElementById('repairForm').reset();  
    } catch (error) {
        console.log('error message', error.message);

        if (error.response) {
            console.log('API error', error.response.data.message);
            messageDOM.innerHTML = `<div>${error.response.data.message}</div>`;
            messageDOM.className = 'message danger';
        }
    }
    
};
