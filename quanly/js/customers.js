// ==========================================
// QUẢN LÝ KHÁCH HÀNG
// ==========================================

let customers = JSON.parse(localStorage.getItem("customers")) || [];
let selectedCustomerId = customers[0] ? customers[0].id : null;
let editingCustomerId = null;

function saveCustomerData() {
  localStorage.setItem("customers", JSON.stringify(customers));
  renderCustomers(document.getElementById("customerSearchInput")?.value || "");
}

// 1. RENDER BẢNG KHÁCH HÀNG
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

// 2. RENDER CHI TIẾT KHÁCH HÀNG BÊN PHẢI
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

// 3. THÊM / SỬA / XÓA KHÁCH HÀNG
function openCustomerModal(id = null) {
  editingCustomerId = id;
  const modal = document.getElementById("customerModal");
  const title = document.getElementById("customerModalTitle");

  if (id) {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    if (title) title.textContent = "Chỉnh sửa thông tin khách hàng";
    document.getElementById("custFormName").value = cust.name;
    document.getElementById("custFormPhone").value = cust.phone;
    document.getElementById("custFormType").value = cust.type;
    document.getElementById("custFormNotes").value = cust.aiSummary || "";
  } else {
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
    customers = customers.map(c => {
      if (c.id === editingCustomerId) {
        return { ...c, name, phone, type, aiSummary: notes };
      }
      return c;
    });
    alert("Đã cập nhật thông tin khách hàng!");
  } else {
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

function copyAiSummary() {
  const text = document.getElementById("detailAiSummary")?.innerText;
  if (text) {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép tóm tắt AI!");
  }
}

// 4. KHỞI TẠO TRANG KHÁCH HÀNG
document.addEventListener("DOMContentLoaded", () => {
  renderCustomers();

  const searchInput = document.getElementById("customerSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderCustomers(e.target.value);
    });
  }
});