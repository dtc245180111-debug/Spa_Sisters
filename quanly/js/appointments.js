// ==========================================
// QUẢN LÝ LỊCH HẸN
// ==========================================

let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let selectedKtv = "Tất cả KTV";
let selectedDate = getTodayString();
let editingId = null;

function saveAppointmentsData() {
  localStorage.setItem("appointments", JSON.stringify(appointments));
  renderAppointments();
}

// 1. RENDER BẢNG LỊCH HẸN
function renderAppointments() {
  const tbody = document.querySelector("table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

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

  const dateTitleEl = document.querySelector(".calendar-head b");
  const countEl = document.querySelector(".calendar-head .muted");
  if (dateTitleEl) dateTitleEl.textContent = formatDateDisplay(selectedDate);
  if (countEl) countEl.textContent = ` · ${filtered.length} lịch hẹn`;

  const datePicker = document.getElementById("datePickerInput");
  if (datePicker) datePicker.value = selectedDate;
}

// 2. CHUYỂN NGÀY
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
  if (datePicker) {
    datePicker.onchange = (e) => {
      if (e.target.value) {
        selectedDate = e.target.value;
        renderAppointments();
      }
    };
  }
}

// 3. ĐỔ KHÁCH HÀNG VÀO DROPDOWN LỊCH HẸN
function populateCustomerSelect() {
  const customerSelect = document.getElementById("formCustomer");
  if (!customerSelect) return;

  const customersData = JSON.parse(localStorage.getItem("customers")) || [];
  customerSelect.innerHTML = "";

  if (customersData.length === 0) {
    customerSelect.innerHTML = `<option value="">-- Chưa có khách hàng --</option>`;
    return;
  }

  customersData.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.phone})`;
    customerSelect.appendChild(opt);
  });
}

// 4. QUẢN LÝ MODAL LỊCH HẸN
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "flex";

  if (modalId === "appointmentModal") {
    populateCustomerSelect();
    const dateInput = document.getElementById("formDate");
    if (dateInput && !dateInput.value) {
      dateInput.value = selectedDate;
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
  if (modalId === 'appointmentModal') resetForm();
}

function resetForm() {
  editingId = null;
  const title = document.querySelector("#appointmentModal .page-title");
  if (title) title.textContent = "Tạo lịch hẹn mới";
  const dateInput = document.getElementById("formDate");
  if (dateInput) dateInput.value = selectedDate;
}

// 5. LƯU LỊCH HẸN (THÊM / SỬA + TỰ ĐỘNG ĐỒNG BỘ SANG KHÁCH HÀNG)
function handleFormSubmit(e) {
  if (e) e.preventDefault();

  const customerSelect = document.getElementById("formCustomer");
  const serviceSelect = document.getElementById("formService");
  const dateInput = document.getElementById("formDate");
  const timeInput = document.getElementById("formTime");
  const ktvSelect = document.getElementById("formKtv");
  const roomSelect = document.getElementById("formRoom");
  const noteInput = document.getElementById("formNote");

  if (!customerSelect || !customerSelect.value) {
    alert("Vui lòng chọn khách hàng!");
    return;
  }

  const customersData = JSON.parse(localStorage.getItem("customers")) || [];
  const selectedCust = customersData.find(c => c.id === customerSelect.value);

  const custName = selectedCust ? selectedCust.name : "Khách vãng lai";
  const custPhone = selectedCust ? selectedCust.phone : "";

  if (editingId) {
    // Chế độ Sửa
    appointments = appointments.map(app => {
      if (app.id === editingId) {
        return {
          ...app,
          customerId: selectedCust ? selectedCust.id : app.customerId,
          customer: custName,
          phone: custPhone,
          service: serviceSelect.value.split(" · ")[0],
          price: serviceSelect.value.split(" · ")[1] || app.price,
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
    // Chế độ Tạo mới
    const newApp = {
      id: Date.now(),
      customerId: selectedCust ? selectedCust.id : "",
      customer: custName,
      phone: custPhone,
      service: serviceSelect.value.split(" · ")[0],
      price: serviceSelect.value.split(" · ")[1] || "650.000 ₫",
      date: dateInput.value,
      time: timeInput.value,
      ktv: ktvSelect.value === "Phân công tự động" ? "Mai" : ktvSelect.value,
      room: roomSelect.value === "Tự động kiểm tra" ? "Phòng 01" : roomSelect.value,
      status: "PENDING",
      note: noteInput.value
    };
    appointments.unshift(newApp);

    // Đồng bộ số lần thăm & lịch sử cho Khách hàng
    if (selectedCust) {
      const updatedCustomers = customersData.map(c => {
        if (c.id === selectedCust.id) {
          return {
            ...c,
            visits: (c.visits || 0) + 1,
            history: [
              {
                date: formatDateDisplay(newApp.date),
                service: newApp.service,
                note: newApp.note || "Tạo lịch hẹn mới",
                ai: "Đã cập nhật"
              },
              ...(c.history || [])
            ]
          };
        }
        return c;
      });
      localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    }

    alert("Đã tạo lịch mới thành công!");
  }

  saveAppointmentsData();
  closeModal("appointmentModal");
}

function editAppointment(id) {
  const app = appointments.find(a => a.id === id);
  if (!app) return;

  editingId = id;
  populateCustomerSelect();

  const custSelect = document.getElementById("formCustomer");
  if (custSelect && app.customerId) custSelect.value = app.customerId;

  document.getElementById("formDate").value = app.date;
  document.getElementById("formTime").value = app.time;
  document.getElementById("formKtv").value = app.ktv;
  document.getElementById("formRoom").value = app.room;
  document.getElementById("formNote").value = app.note || "";

  const title = document.querySelector("#appointmentModal .page-title");
  if (title) title.textContent = "Sửa lịch hẹn";

  openModal("appointmentModal");
}

function deleteAppointment(id) {
  if (confirm("Bạn có chắc chắn muốn xóa lịch hẹn này không?")) {
    appointments = appointments.filter(a => a.id !== id);
    saveAppointmentsData();
  }
}

function viewDetail(id) {
  const app = appointments.find(a => a.id === id);
  if (!app) return;
  alert(`CHI TIẾT LỊCH HẸN:\n-------------------\nKhách hàng: ${app.customer}\nSĐT: ${app.phone}\nDịch vụ: ${app.service}\nNgày: ${app.date}\nThời gian: ${app.time}\nKTV: ${app.ktv}\nPhòng: ${app.room}\nTrạng thái: ${app.status}\nGhi chú: ${app.note || 'Không có'}`);
}

// 6. KHỞI TẠO TRANG LỊCH HẸN
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

  // Gán ID cho các Input trong Modal
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