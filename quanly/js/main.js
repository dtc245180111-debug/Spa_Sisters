// 1. DỮ LIỆU MẪU BAN ĐẦU
const initialAppointments = [
  { id: 1, time: "09:00", customer: "Nguyễn Minh Anh", phone: "0901 234 567", service: "Cấp ẩm Deep Moist", price: "650.000 ₫", ktv: "Mai", room: "Phòng 01", status: "CONFIRMED", date: "2026-09-04", note: "Khách da khô" },
  { id: 2, time: "10:30", customer: "Trần Ngọc Hà", phone: "0912 345 678", service: "Massage Body Thụy Điển", price: "750.000 ₫", ktv: "Lan", room: "Phòng 02", status: "IN_PROGRESS", date: "2026-09-04", note: "Tập trung vai cổ gáy" },
  { id: 3, time: "13:30", customer: "Lê Thu Trang", phone: "0987 654 321", service: "Tẩy tế bào chết toàn thân", price: "500.000 ₫", ktv: "Mai", room: "Phòng 01", status: "PENDING", date: "2026-09-04", note: "" },
  { id: 4, time: "15:00", customer: "Vũ Ngọc Linh", phone: "0933 111 222", service: "Triệt lông diode laser", price: "400.000 ₫", ktv: "Hương", room: "Phòng 03", status: "CANCELLED", date: "2026-09-05", note: "Lịch hẹn ngày mai" }
];

// Khởi tạo LocalStorage
if (!localStorage.getItem("appointments")) {
  localStorage.setItem("appointments", JSON.stringify(initialAppointments));
}

let appointments = JSON.parse(localStorage.getItem("appointments"));
let selectedKtv = "Tất cả KTV";
let selectedDate = getTodayString(); // Mặc định là ngày hôm nay (YYYY-MM-DD)
let editingId = null;

// Hàm lấy chuỗi YYYY-MM-DD của ngày hiện tại
function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Format ngày từ YYYY-MM-DD sang "DD Tháng MM, YYYY"
function formatDateDisplay(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${parseInt(day)} Tháng ${parseInt(month)}, ${year}`;
}

// 2. HIỂN THỊ DỮ LIỆU CÓ LỌC THEO NGÀY VÀ KTV
function renderAppointments() {
  const tbody = document.querySelector("table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  // Lọc lịch hẹn theo NGÀY ĐANG CHỌN và KTV
  const filtered = appointments.filter(app => {
    const matchDate = app.date === selectedDate;
    const matchKtv = selectedKtv === "Tất cả KTV" || app.ktv === selectedKtv;
    return matchDate && matchKtv;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: #888;">Không có lịch hẹn nào cho ngày ${formatDateDisplay(selectedDate)}</td></tr>`;
  } else {
    filtered.forEach(app => {
      const tr = document.createElement("tr");
      
      let statusClass = "neutral";
      if (app.status === "CONFIRMED") statusClass = "success";
      if (app.status === "IN_PROGRESS") statusClass = "warning";
      if (app.status === "CANCELLED") statusClass = "danger";

      tr.innerHTML = `
        <td>${app.time}</td>
        <td><b>${app.customer}</b><br><span class="muted">${app.phone || ''}</span></td>
        <td>${app.service}</td>
        <td>${app.ktv}</td>
        <td><span class="status ${statusClass}">${app.status}</span></td>
        <td>
          <button class="btn small" onclick="viewDetail(${app.id})">Chi tiết</button>
          <button class="btn small" onclick="editAppointment(${app.id})">Sửa</button>
          <button class="btn small" style="color:red" onclick="deleteAppointment(${app.id})">Xóa</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Cập nhật giao diện tiêu đề ngày & số lượng lịch hẹn
  const dateTitleEl = document.querySelector(".calendar-head b");
  const countEl = document.querySelector(".calendar-head .muted");
  
  if (dateTitleEl) dateTitleEl.textContent = formatDateDisplay(selectedDate);
  if (countEl) countEl.textContent = ` · ${filtered.length} lịch hẹn`;
  
  // Đồng bộ giá trị với ô chọn ngày DatePicker
  const datePicker = document.getElementById("datePickerInput");
  if (datePicker) datePicker.value = selectedDate;
}

// 3. XỬ LÝ CHUYỂN ĐỔI NGÀY (LÙI, TIẾN, CHỌN TRỰC TIẾP)
function changeDateByDays(days) {
  const current = new Date(selectedDate);
  current.setDate(current.getDate() + days);
  
  const yyyy = current.getFullYear();
  const mm = String(current.getMonth() + 1).padStart(2, '0');
  const dd = String(current.getDate()).padStart(2, '0');
  
  selectedDate = `${yyyy}-${mm}-${dd}`;
  renderAppointments();
}

function setupDateNavigation() {
  const navContainer = document.querySelector(".date-nav");
  if (!navContainer) return;

  // Thêm input datepicker vào giao diện thanh điều hướng ngày
  navContainer.innerHTML = `
    <button class="btn small" id="prevDateBtn">‹</button>
    <button class="btn small" id="todayBtn">Hôm nay</button>
    <button class="btn small" id="nextDateBtn">›</button>
    <input type="date" id="datePickerInput" class="input" style="padding: 2px 6px; font-size: 13px; margin-left: 8px;">
  `;

  document.getElementById("prevDateBtn").onclick = () => changeDateByDays(-1);
  document.getElementById("nextDateBtn").onclick = () => changeDateByDays(1);
  document.getElementById("todayBtn").onclick = () => {
    selectedDate = getTodayString();
    renderAppointments();
  };

  const datePicker = document.getElementById("datePickerInput");
  datePicker.onchange = (e) => {
    if (e.target.value) {
      selectedDate = e.target.value;
      renderAppointments();
    }
  };
}

// 4. CÁC TÍNH NĂNG QUẢN LÝ LỊCH HẸN (THÊM, SỬA, XÓA, XEM)
function saveData() {
  localStorage.setItem("appointments", JSON.stringify(appointments));
  renderAppointments();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "flex";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
  if (modalId === 'appointmentModal') resetForm();
}

function handleFormSubmit(e) {
  if (e) e.preventDefault();

  const customerSelect = document.getElementById("formCustomer");
  const serviceSelect = document.getElementById("formService");
  const dateInput = document.getElementById("formDate");
  const timeInput = document.getElementById("formTime");
  const ktvSelect = document.getElementById("formKtv");
  const roomSelect = document.getElementById("formRoom");
  const noteInput = document.getElementById("formNote");

  if (editingId) {
    appointments = appointments.map(app => {
      if (app.id === editingId) {
        return {
          ...app,
          customer: customerSelect.value,
          service: serviceSelect.value,
          date: dateInput.value,
          time: timeInput.value,
          ktv: ktvSelect.value,
          room: roomSelect.value,
          note: noteInput.value
        };
      }
      return app;
    });
    alert("Đã cập nhật thông tin lịch hẹn!");
  } else {
    const newApp = {
      id: Date.now(),
      customer: customerSelect.value,
      phone: "0900 000 000",
      service: serviceSelect.value.split(" · ")[0],
      price: serviceSelect.value.split(" · ")[1] || "",
      date: dateInput.value,
      time: timeInput.value,
      ktv: ktvSelect.value === "Phân công tự động" ? "Mai" : ktvSelect.value,
      room: roomSelect.value === "Tự động kiểm tra" ? "Phòng 01" : roomSelect.value,
      status: "PENDING",
      note: noteInput.value
    };
    appointments.push(newApp);
    alert("Đã tạo lịch mới thành công!");
  }

  saveData();
  closeModal("appointmentModal");
}

function editAppointment(id) {
  const app = appointments.find(a => a.id === id);
  if (!app) return;

  editingId = id;
  document.getElementById("formCustomer").value = app.customer;
  document.getElementById("formDate").value = app.date;
  document.getElementById("formTime").value = app.time;
  document.getElementById("formKtv").value = app.ktv;
  document.getElementById("formRoom").value = app.room;
  document.getElementById("formNote").value = app.note || "";

  document.querySelector("#appointmentModal .page-title").textContent = "Sửa lịch hẹn";
  openModal("appointmentModal");
}

function resetForm() {
  editingId = null;
  document.querySelector("#appointmentModal .page-title").textContent = "Tạo lịch hẹn mới";
  const dateInput = document.getElementById("formDate");
  if (dateInput) dateInput.value = selectedDate; // Mặc định lấy ngày đang xem trên Calendar
}

function deleteAppointment(id) {
  if (confirm("Bạn có chắc chắn muốn xóa lịch hẹn này không?")) {
    appointments = appointments.filter(a => a.id !== id);
    saveData();
  }
}

function viewDetail(id) {
  const app = appointments.find(a => a.id === id);
  if (!app) return;
  alert(`CHI TIẾT LỊCH HẸN:\n-------------------\nKhách hàng: ${app.customer}\nDịch vụ: ${app.service}\nNgày: ${app.date}\nThời gian: ${app.time}\nKTV: ${app.ktv}\nPhòng: ${app.room}\nTrạng thái: ${app.status}\nGhi chú: ${app.note || 'Không có'}`);
}

// 5. KÍCH HOẠT KHI TẢI TRANG
document.addEventListener("DOMContentLoaded", () => {
  setupDateNavigation();
  renderAppointments();

  // Tab lọc KTV
  const tabs = document.querySelectorAll(".daytabs button");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      selectedKtv = tab.textContent.trim();
      renderAppointments();
    });
  });

  // Gán ID cho các trường trong Modal nếu chưa có
  const modalBox = document.querySelector("#appointmentModal .modal-box");
  if (modalBox) {
    const inputs = modalBox.querySelectorAll(".form-grid .input");
    if (inputs.length >= 7) {
      inputs[0].id = "formCustomer";
      inputs[1].id = "formService";
      inputs[2].id = "formDate";
      inputs[3].id = "formTime";
      inputs[4].id = "formKtv";
      inputs[5].id = "formRoom";
      inputs[6].id = "formNote";
    }

    const submitBtn = modalBox.querySelector(".btn.primary");
    if (submitBtn) {
      submitBtn.onclick = handleFormSubmit;
    }
  }
});

// ==========================================
// QUẢN LÝ KHÁCH HÀNG (CRUD & SEARCH)
// ==========================================

// 1. Dữ liệu khởi tạo mặc định
const defaultCustomers = [
  {
    id: "KH-000128",
    name: "Nguyễn Minh Anh",
    phone: "0901 234 567",
    type: "Khách thân thiết",
    visits: 12,
    spent: "8.450.000 ₫",
    aiSummary: "• Đã sử dụng dịch vụ cấp ẩm và massage cổ vai gáy.\n• Ưu tiên lực massage vừa; chọn khung giờ chiều.\n• KTV xem lại ghi chú trước khi thực hiện dịch vụ.",
    history: [
      { date: "04/09/2026", service: "Cấp ẩm Deep Moist", note: "Khách khen dịu da", ai: "Đã tóm tắt" },
      { date: "20/08/2026", service: "Massage cổ vai gáy", note: "Tập trung vai trái", ai: "Đã tóm tắt" }
    ]
  },
  {
    id: "KH-000129",
    name: "Lê Thu Trang",
    phone: "0987 654 321",
    type: "Khách mới",
    visits: 2,
    spent: "1.150.000 ₫",
    aiSummary: "• Khách mới trải nghiệm liệu trình chăm sóc da mặt cơ bản.\n• Da nhạy cảm nhẹ với hương hoa hồng.",
    history: [
      { date: "28/08/2026", service: "Tẩy tế bào chết toàn thân", note: "Da hơi ửng đỏ nhẹ", ai: "Đã tóm tắt" }
    ]
  },
  {
    id: "KH-000130",
    name: "Trần Ngọc Hà",
    phone: "0912 345 678",
    type: "Khách VIP",
    visits: 25,
    spent: "18.200.000 ₫",
    aiSummary: "• Thường xuyên sử dụng Massage Body Thụy Điển.\n• Yêu cầu không gian yên tĩnh và trà hoa cúc.",
    history: [
      { date: "01/09/2026", service: "Massage Body Thụy Điển", note: "Thư giãn tốt", ai: "Đã tóm tắt" }
    ]
  }
];

// Khởi tạo LocalStorage nếu chưa có
if (!localStorage.getItem("customers")) {
  localStorage.setItem("customers", JSON.stringify(defaultCustomers));
}

let customers = JSON.parse(localStorage.getItem("customers"));
let selectedCustomerId = customers[0] ? customers[0].id : null;
let editingCustomerId = null;

// Hàm hỗ trợ lấy chữ cái đầu tên làm Avatar
function getInitials(name) {
  if (!name) return "KH";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
}

// Lưu dữ liệu vào LocalStorage
function saveCustomerData() {
  localStorage.setItem("customers", JSON.stringify(customers));
  renderCustomers(document.getElementById("customerSearchInput")?.value || "");
}

// 2. CHỨC NĂNG RENDER BẢNG & TÌM KIẾM
function renderCustomers(searchTerm = "") {
  const tbody = document.getElementById("customerTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const term = searchTerm.toLowerCase().trim();
  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(term) || 
    c.phone.includes(term) || 
    c.id.toLowerCase().includes(term)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#888; padding: 20px;">Không tìm thấy khách hàng nào hợp lệ</td></tr>`;
    return;
  }

  filtered.forEach(c => {
    const tr = document.createElement("tr");
    if (c.id === selectedCustomerId) tr.style.backgroundColor = "rgba(0, 0, 0, 0.03)";

    let typeClass = "neutral";
    if (c.type === "Khách VIP") typeClass = "success";
    if (c.type === "Khách thân thiết") typeClass = "warning";

    tr.innerHTML = `
      <td><b>${c.id}</b></td>
      <td><b>${c.name}</b></td>
      <td>${c.phone}</td>
      <td><span class="status ${typeClass}">${c.type}</span></td>
      <td>${c.visits} lần</td>
      <td><b>${c.spent}</b></td>
      <td style="text-align: right;">
        <button class="btn small" onclick="selectCustomer('${c.id}')">Xem</button>
        <button class="btn small" onclick="openCustomerModal('${c.id}')">Sửa</button>
        <button class="btn small" style="color:red;" onclick="deleteCustomer('${c.id}')">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderCustomerDetail();
}

// 3. CHỨC NĂNG HIỂN THỊ HỒ SƠ CHI TIẾT
function renderCustomerDetail() {
  const cust = customers.find(c => c.id === selectedCustomerId) || customers[0];
  if (!cust) return;

  selectedCustomerId = cust.id;

  const avatarEl = document.getElementById("detailAvatar");
  const nameEl = document.getElementById("detailName");
  const typeEl = document.getElementById("detailType");
  const visitsEl = document.getElementById("detailVisits");
  const spentEl = document.getElementById("detailSpent");
  const aiSummaryEl = document.getElementById("detailAiSummary");
  const historyBody = document.getElementById("detailHistoryBody");

  if (avatarEl) avatarEl.textContent = getInitials(cust.name);
  if (nameEl) nameEl.textContent = cust.name;
  if (typeEl) typeEl.textContent = `${cust.id} · ${cust.phone} · ${cust.type}`;
  if (visitsEl) visitsEl.textContent = cust.visits;
  if (spentEl) spentEl.textContent = cust.spent;
  if (aiSummaryEl) aiSummaryEl.innerText = cust.aiSummary || "Chưa có dữ liệu ghi chú AI.";

  if (historyBody) {
    historyBody.innerHTML = "";
    if (cust.history && cust.history.length > 0) {
      cust.history.forEach(h => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${h.date}</td>
          <td><b>${h.service}</b></td>
          <td>${h.note}</td>
          <td><span class="status success">${h.ai}</span></td>
        `;
        historyBody.appendChild(row);
      });
    } else {
      historyBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#888; padding:15px;">Chưa có lịch sử liệu trình</td></tr>`;
    }
  }
}

function selectCustomer(id) {
  selectedCustomerId = id;
  renderCustomers(document.getElementById("customerSearchInput")?.value || "");
}

// 4. MỞ & ĐÓNG MODAL THÊM / SỬA KHÁCH HÀNG
function openCustomerModal(id = null) {
  editingCustomerId = id;
  const modal = document.getElementById("customerModal");
  const title = document.getElementById("customerModalTitle");

  if (id) {
    // Sửa thông tin khách hàng
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    if (title) title.textContent = "Chỉnh sửa thông tin khách hàng";
    document.getElementById("custFormName").value = cust.name;
    document.getElementById("custFormPhone").value = cust.phone;
    document.getElementById("custFormType").value = cust.type;
    document.getElementById("custFormNotes").value = cust.aiSummary || "";
  } else {
    // Thêm mới
    if (title) title.textContent = "Thêm khách hàng mới";
    document.getElementById("custFormName").value = "";
    document.getElementById("custFormPhone").value = "";
    document.getElementById("custFormType").value = "Khách mới";
    document.getElementById("custFormNotes").value = "";
  }

  if (modal) modal.style.display = "flex";
}

function closeCustomerModal() {
  const modal = document.getElementById("customerModal");
  if (modal) modal.style.display = "none";
  editingCustomerId = null;
}

// 5. CHỨC NĂNG LƯU (THÊM / SỬA)
function handleCustomerSubmit() {
  const name = document.getElementById("custFormName").value.trim();
  const phone = document.getElementById("custFormPhone").value.trim();
  const type = document.getElementById("custFormType").value;
  const notes = document.getElementById("custFormNotes").value.trim();

  if (!name || !phone) {
    alert("Vui lòng nhập đầy đủ Họ tên và Số điện thoại!");
    return;
  }

  if (editingCustomerId) {
    // Cập nhật thông tin cũ
    customers = customers.map(c => {
      if (c.id === editingCustomerId) {
        return {
          ...c,
          name: name,
          phone: phone,
          type: type,
          aiSummary: notes
        };
      }
      return c;
    });
    alert("Đã cập nhật thông tin khách hàng!");
  } else {
    // Tạo khách hàng mới
    const newId = "KH-" + Math.floor(100000 + Math.random() * 900000);
    const newCust = {
      id: newId,
      name: name,
      phone: phone,
      type: type,
      visits: 0,
      spent: "0 ₫",
      aiSummary: notes ? `• ${notes}` : "• Khách hàng mới khởi tạo.",
      history: []
    };
    customers.unshift(newCust);
    selectedCustomerId = newId;
    alert("Đã thêm khách hàng mới thành công!");
  }

  saveCustomerData();
  closeCustomerModal();
}

// 6. CHỨC NĂNG XÓA KHÁCH HÀNG
function deleteCustomer(id) {
  if (confirm("Bạn có chắc chắn muốn xóa hồ sơ khách hàng này không?")) {
    customers = customers.filter(c => c.id !== id);
    if (selectedCustomerId === id) {
      selectedCustomerId = customers[0] ? customers[0].id : null;
    }
    saveCustomerData();
    alert("Đã xóa khách hàng!");
  }
}

// Sao chép Tóm tắt AI
function copyAiSummary() {
  const text = document.getElementById("detailAiSummary")?.innerText;
  if (text) {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép tóm tắt AI!");
  }
}

// 7. LẮNG NGHE SỰ KIỆN KHI TRANG TẢI XONG
document.addEventListener("DOMContentLoaded", () => {
  renderCustomers();

  // Bắt sự kiện gõ ô tìm kiếm realtime
  const searchInput = document.getElementById("customerSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderCustomers(e.target.value);
    });
  }
});

// Đổ danh sách Khách hàng vào dropdown trong Modal Lịch hẹn
function populateCustomerSelect() {
  const customerSelect = document.getElementById("formCustomer");
  if (!customerSelect) return;

  // Lấy dữ liệu khách hàng từ localStorage
  const customersData = JSON.parse(localStorage.getItem("customers")) || [];
  customerSelect.innerHTML = "";

  if (customersData.length === 0) {
    customerSelect.innerHTML = `<option value="">-- Chưa có khách hàng --</option>`;
    return;
  }

  // Đổ từng khách hàng vào dropdown
  customersData.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id; // Giá trị là Mã KH
    opt.textContent = `${c.name} (${c.phone})`; // Hiển thị: Tên (SĐT)
    customerSelect.appendChild(opt);
  });
}