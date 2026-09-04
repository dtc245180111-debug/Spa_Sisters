// ==========================================
// QUẢN LÝ DỊCH VỤ & GÓI LIỆU TRÌNH (SERVICES)
// ==========================================

// 1. DỮ LIỆU KHỞI TẠO BAN ĐẦU
const defaultServices = [
  { id: 1, name: "Cấp ẩm Deep Moist", desc: "Chăm sóc cấp ẩm chuyên sâu cho da khô", price: 650000, duration: 60, sessions: 1, status: "ACTIVE" },
  { id: 2, name: "Massage Body Thụy Điển", desc: "Thư giãn toàn thân nhẹ nhàng", price: 750000, duration: 75, sessions: 1, status: "ACTIVE" },
  { id: 3, name: "Gói Phục hồi 5 buổi", desc: "Liệu trình phục hồi da tầng sâu", price: 2900000, duration: 60, sessions: 5, status: "ACTIVE" },
  { id: 4, name: "Triệt lông Diode Laser", desc: "Triệt lông công nghệ mới không đau", price: 450000, duration: 30, sessions: 1, status: "INACTIVE" }
];

let servicesData = JSON.parse(localStorage.getItem("spa_services"));

if (!servicesData || !Array.isArray(servicesData) || servicesData.length === 0) {
  servicesData = defaultServices;
  localStorage.setItem("spa_services", JSON.stringify(servicesData));
}

// 2. HIỂN THỊ DANH SÁCH DỊCH VỤ
function renderServices(dataToRender = servicesData) {
  const tbody = document.getElementById("servicesTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (dataToRender.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #888;">Không tìm thấy dịch vụ nào.</td></tr>`;
    return;
  }

  dataToRender.forEach((item) => {
    const tr = document.createElement("tr");

    const statusBadge = item.status === "ACTIVE" 
      ? `<span class="status-active">ĐANG CUNG CẤP</span>` 
      : `<span class="status-inactive">TẠM NGỪNG</span>`;

    const durationText = item.sessions > 1 ? `${item.duration} phút/buổi` : `${item.duration} phút`;

    tr.innerHTML = `
      <td>
        <b>${item.name}</b><br>
        <span class="muted" style="font-size:11px; color:#777;">${item.desc || ''}</span>
      </td>
      <td><b>${formatCurrency(item.price)}</b></td>
      <td>${durationText}</td>
      <td style="text-align: center;">${item.sessions}</td>
      <td>${statusBadge}</td>
      <td style="text-align: right; white-space: nowrap;">
        <button class="btn small" onclick="viewServiceDetail(${item.id})">Chi tiết</button>
        <button class="btn small" onclick="openServiceModal('edit', ${item.id})">Sửa</button>
        <button class="btn small" style="color:red;" onclick="deleteService(${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 3. XEM CHI TIẾT DỊCH VỤ
function viewServiceDetail(id) {
  const item = servicesData.find(s => s.id === id);
  if (!item) return;

  const body = document.getElementById("detailServiceBody");
  body.innerHTML = `
    <p><b>Tên dịch vụ:</b> ${item.name}</p>
    <p><b>Giá tiền:</b> ${formatCurrency(item.price)}</p>
    <p><b>Thời lượng:</b> ${item.duration} phút</p>
    <p><b>Số buổi:</b> ${item.sessions} buổi</p>
    <p><b>Trạng thái:</b> ${item.status === 'ACTIVE' ? 'Đang cung cấp' : 'Tạm ngừng'}</p>
    <p><b>Mô tả:</b> ${item.desc || 'Chưa có mô tả'}</p>
  `;

  openModal("detailServiceModal");
}

// 4. MỞ MODAL THÊM / SỬA DỊCH VỤ
function openServiceModal(mode, id = null) {
  const title = document.getElementById("serviceModalTitle");
  const editId = document.getElementById("editServiceId");

  if (mode === 'edit') {
    const item = servicesData.find(s => s.id === id);
    if (!item) return;

    title.textContent = "Sửa dịch vụ";
    editId.value = item.id;
    document.getElementById("svcName").value = item.name;
    document.getElementById("svcPrice").value = item.price;
    document.getElementById("svcDuration").value = item.duration;
    document.getElementById("svcSessions").value = item.sessions;
    document.getElementById("svcStatus").value = item.status;
    document.getElementById("svcDesc").value = item.desc || "";
  } else {
    title.textContent = "Thêm dịch vụ mới";
    editId.value = "";
    document.getElementById("svcName").value = "";
    document.getElementById("svcPrice").value = "";
    document.getElementById("svcDuration").value = "60";
    document.getElementById("svcSessions").value = "1";
    document.getElementById("svcStatus").value = "ACTIVE";
    document.getElementById("svcDesc").value = "";
  }

  openModal("serviceModal");
}

// 5. LƯU DỊCH VỤ (CREATE / UPDATE)
function saveService() {
  const editIdVal = document.getElementById("editServiceId").value;
  const name = document.getElementById("svcName").value.trim();
  const price = parseInt(document.getElementById("svcPrice").value) || 0;
  const duration = parseInt(document.getElementById("svcDuration").value) || 0;
  const sessions = parseInt(document.getElementById("svcSessions").value) || 1;
  const status = document.getElementById("svcStatus").value;
  const desc = document.getElementById("svcDesc").value.trim();

  if (!name) {
    alert("Vui lòng nhập tên dịch vụ!");
    return;
  }

  if (editIdVal !== "") {
    // Sửa dịch vụ đã có
    const id = parseInt(editIdVal);
    servicesData = servicesData.map(s => s.id === id ? { ...s, name, price, duration, sessions, status, desc } : s);
  } else {
    // Thêm dịch vụ mới
    const newService = {
      id: Date.now(),
      name,
      price,
      duration,
      sessions,
      status,
      desc
    };
    servicesData.push(newService);
  }

  localStorage.setItem("spa_services", JSON.stringify(servicesData));
  filterServices();
  closeModal("serviceModal");
}

// 6. XÓA DỊCH VỤ
function deleteService(id) {
  if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) {
    servicesData = servicesData.filter(s => s.id !== id);
    localStorage.setItem("spa_services", JSON.stringify(servicesData));
    filterServices();
  }
}

// 7. LỌC VÀ TÌM KIẾM DỊCH VỤ
function filterServices() {
  const searchVal = document.getElementById("searchServiceInput").value.toLowerCase().trim();
  const statusVal = document.getElementById("statusFilter").value;

  const filtered = servicesData.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchVal) || (item.desc && item.desc.toLowerCase().includes(searchVal));
    const matchStatus = (statusVal === "ALL") || (item.status === statusVal);
    return matchName && matchStatus;
  });

  renderServices(filtered);
}

// HELPER UTILITY FUNCTIONS
function openModal(modalId) {
  document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function formatCurrency(num) {
  return num.toLocaleString("vi-VN") + " ₫";
}

// Tải bảng dịch vụ khi bắt đầu trang
document.addEventListener("DOMContentLoaded", () => {
  renderServices();
});