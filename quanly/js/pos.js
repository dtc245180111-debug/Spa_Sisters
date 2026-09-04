// ==========================================
// MÃ NGUỒN CHỨC NĂNG THANH TOÁN (POS)
// ==========================================

let customersData = JSON.parse(localStorage.getItem("customers")) || [];
let appointmentsData = JSON.parse(localStorage.getItem("appointments")) || [];

let selectedCustomerId = null;
let currentCart = [];
let discountPercent = 0;
let selectedPaymentMethod = "Tiền mặt";

// 1. TẢI DANH SÁCH KHÁCH HÀNG
function initPosCustomers() {
  const select = document.getElementById("posCustomerSelect");
  if (!select) return;

  select.innerHTML = `<option value="">-- Chọn khách hàng --</option>`;
  customersData.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.phone})`;
    select.appendChild(opt);
  });

  if (customersData.length > 0) {
    select.value = customersData[0].id;
    onSelectPosCustomer(customersData[0].id);
  }
}

// 2. KHI CHỌN KHÁCH HÀNG -> NẠP LỊCH HẸN TRONG NGÀY VÀO ĐƠN HÀNG
function onSelectPosCustomer(custId) {
  selectedCustomerId = custId;
  const cust = customersData.find(c => c.id === custId);
  
  const titleEl = document.getElementById("posCustName");
  if (titleEl) titleEl.textContent = cust ? cust.name : "Khách hàng";

  currentCart = [];

  if (custId) {
    const custApps = appointmentsData.filter(a => a.customerId === custId || a.customer === cust?.name);
    
    if (custApps.length > 0) {
      custApps.forEach(app => {
        currentCart.push({
          id: app.id,
          type: "service",
          time: app.time || "14:00",
          itemTitle: app.service,
          qty: 1,
          price: parseCurrency(app.price || "650.000 ₫"),
          staff: app.ktv || "Mai",
          status: app.status || "PENDING"
        });
      });
    } else {
      // Dữ liệu mẫu nếu khách chưa có lịch hẹn đặt trước
      currentCart = [
        { id: 1, type: "service", time: "14:00", itemTitle: "Cấp ẩm Deep Moist", qty: 1, price: 650000, staff: "Mai", status: "PENDING" },
        { id: 2, type: "product", time: "14:00", itemTitle: "Kem dưỡng phục hồi", qty: 1, price: 480000, staff: "Lễ tân", status: "COMPLETED" }
      ];
    }
  }

  renderCartTable();
}

// 3. HIỂN THỊ ĐƠN HÀNG (READ)
function renderCartTable() {
  const tbody = document.getElementById("posOrderBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (currentCart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #888;">Chưa có dịch vụ hoặc sản phẩm nào trong đơn hàng.</td></tr>`;
    calculateTotals();
    return;
  }

  currentCart.forEach((item, index) => {
    const totalItemPrice = item.price * item.qty;
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><b>${item.itemTitle}</b><br><span style="font-size:11px; color:#888;">${item.time}</span></td>
      <td style="text-align:center;">${item.qty}</td>
      <td>${item.staff}</td>
      <td>${formatCurrency(item.price)}</td>
      <td><b>${formatCurrency(totalItemPrice)}</b></td>
      <td style="text-align: right; white-space: nowrap;">
        <button class="btn small" onclick="viewItemDetail(${index})">Xem</button>
        <button class="btn small" onclick="openItemModal('edit', ${index})">Sửa</button>
        <button class="btn small" style="color:red;" onclick="deleteItem(${index})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  calculateTotals();
}

// 4. XEM CHI TIẾT (VIEW)
function viewItemDetail(index) {
  const item = currentCart[index];
  if (!item) return;

  const body = document.getElementById("detailModalBody");
  body.innerHTML = `
    <p><b>Mục:</b> ${item.itemTitle}</p>
    <p><b>Loại:</b> ${item.type === 'service' ? 'Dịch vụ Spa' : 'Sản phẩm bán kèm'}</p>
    <p><b>Số lượng:</b> ${item.qty}</p>
    <p><b>Đơn giá:</b> ${formatCurrency(item.price)}</p>
    <p><b>Thành tiền:</b> ${formatCurrency(item.price * item.qty)}</p>
    <p><b>Nhân viên phụ trách:</b> ${item.staff}</p>
    <p><b>Thời gian thực hiện:</b> ${item.time}</p>
  `;

  openModal("detailModal");
}

// 5. THÊM & SỬA (CREATE & UPDATE)
function openItemModal(mode, index = null) {
  const modalTitle = document.getElementById("itemModalTitle");
  const editIndexInput = document.getElementById("editItemIndex");

  if (mode === 'edit') {
    const item = currentCart[index];
    modalTitle.textContent = "Sửa mục đơn hàng";
    editIndexInput.value = index;

    document.getElementById("formItemTitle").value = item.itemTitle;
    document.getElementById("formItemQty").value = item.qty;
    document.getElementById("formItemPrice").value = item.price;
    document.getElementById("formItemStaff").value = item.staff;
    document.getElementById("formItemTime").value = item.time;
  } else {
    modalTitle.textContent = mode === 'product' ? "Thêm sản phẩm bán kèm" : "Thêm dịch vụ mới";
    editIndexInput.value = "";

    document.getElementById("formItemTitle").value = mode === 'product' ? "Serum Cấp Ẩm HA" : "Massage Body Thụy Điển";
    document.getElementById("formItemQty").value = 1;
    document.getElementById("formItemPrice").value = mode === 'product' ? 350000 : 750000;
    document.getElementById("formItemStaff").value = mode === 'product' ? "Lễ tân" : "Lan";
    document.getElementById("formItemTime").value = "15:00";
  }

  openModal("itemModal");
}

function saveItem() {
  const indexVal = document.getElementById("editItemIndex").value;
  const title = document.getElementById("formItemTitle").value.trim();
  const qty = parseInt(document.getElementById("formItemQty").value) || 1;
  const price = parseInt(document.getElementById("formItemPrice").value) || 0;
  const staff = document.getElementById("formItemStaff").value.trim();
  const time = document.getElementById("formItemTime").value.trim();

  if (!title) {
    alert("Vui lòng nhập tên dịch vụ/sản phẩm!");
    return;
  }

  if (indexVal !== "") {
    // Chỉnh sửa
    const idx = parseInt(indexVal);
    currentCart[idx] = { ...currentCart[idx], itemTitle: title, qty, price, staff, time };
  } else {
    // Thêm mới
    currentCart.push({
      id: Date.now(),
      type: "product",
      time: time,
      itemTitle: title,
      qty: qty,
      price: price,
      staff: staff,
      status: "COMPLETED"
    });
  }

  renderCartTable();
  closeModal("itemModal");
}

// 6. XÓA MỤC (DELETE)
function deleteItem(index) {
  if (confirm("Bạn có chắc chắn muốn xóa mục này khỏi đơn hàng?")) {
    currentCart.splice(index, 1);
    renderCartTable();
  }
}

// 7. TÍNH TỔNG TIỀN & MÃ GIẢM GIÁ
function calculateTotals() {
  const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discount;

  document.getElementById("posSubtotal").textContent = formatCurrency(subtotal);
  
  const discountRow = document.getElementById("discountRow");
  if (discountPercent > 0) {
    discountRow.style.display = "flex";
    document.getElementById("discountPercentText").textContent = discountPercent;
    document.getElementById("posDiscount").textContent = `-${formatCurrency(discount)}`;
  } else {
    discountRow.style.display = "none";
  }

  document.getElementById("posTotal").textContent = formatCurrency(total);
}

function applyVoucher() {
  const code = document.getElementById("voucherInput").value.trim().toUpperCase();
  const msg = document.getElementById("voucherMsg");

  if (code === "SPA10") {
    discountPercent = 10;
    msg.style.color = "green";
    msg.textContent = "Đã áp dụng giảm giá 10%";
  } else if (code === "VIP20") {
    discountPercent = 20;
    msg.style.color = "green";
    msg.textContent = "Đã áp dụng giảm giá VIP 20%";
  } else if (code === "") {
    discountPercent = 0;
    msg.textContent = "";
  } else {
    discountPercent = 0;
    msg.style.color = "red";
    msg.textContent = "Mã voucher không hợp lệ!";
  }

  calculateTotals();
}

function selectPayMethod(btn) {
  document.querySelectorAll(".pay-btn-group button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  selectedPaymentMethod = btn.getAttribute("data-method");
}

// 8. THANH TOÁN & HOÀN TẤT ĐƠN HÀNG
function processCheckout() {
  if (currentCart.length === 0) {
    alert("Đơn hàng chưa có sản phẩm hoặc dịch vụ nào!");
    return;
  }

  const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal - Math.round(subtotal * (discountPercent / 100));

  // Cập nhật tổng tiền đã chi cho Khách hàng trong LocalStorage
  if (selectedCustomerId) {
    customersData = customersData.map(c => {
      if (c.id === selectedCustomerId) {
        const currentSpent = parseCurrency(c.spent || "0 ₫");
        return {
          ...c,
          spent: formatCurrency(currentSpent + total),
          visits: (c.visits || 0) + 1
        };
      }
      return c;
    });
    localStorage.setItem("customers", JSON.stringify(customersData));
  }

  // Cập nhật trạng thái Lịch hẹn
  appointmentsData = appointmentsData.map(a => {
    if (a.customerId === selectedCustomerId) {
      return { ...a, status: "CONFIRMED" };
    }
    return a;
  });
  localStorage.setItem("appointments", JSON.stringify(appointmentsData));

  alert(`Thanh toán thành công!\n-------------------\nTổng tiền: ${formatCurrency(total)}\nPhương thức: ${selectedPaymentMethod}`);

  // Reset giỏ hàng
  currentCart = [];
  discountPercent = 0;
  document.getElementById("voucherInput").value = "";
  document.getElementById("voucherMsg").textContent = "";
  renderCartTable();
}

// HELPER UTILS
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function parseCurrency(str) {
  if (typeof str === "number") return str;
  return parseInt(str.replace(/[^0-9]/g, "")) || 0;
}

function formatCurrency(num) {
  return num.toLocaleString("vi-VN") + " ₫";
}

// Khởi chạy khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  initPosCustomers();
});