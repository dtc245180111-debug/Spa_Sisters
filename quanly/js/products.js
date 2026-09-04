// ==========================================
// QUẢN LÝ SẢN PHẨM & KHO (PRODUCTS & INVENTORY)
// ==========================================

const defaultProducts = [
  { id: 1, name: "Kem dưỡng phục hồi", price: 480000, cost: 280000, stock: 28 },
  { id: 2, name: "Serum cấp ẩm", price: 620000, cost: 390000, stock: 5 },
  { id: 3, name: "Mặt nạ phục hồi", price: 180000, cost: 90000, stock: 0 },
  { id: 4, name: "Tẩy trang dịu nhẹ", price: 320000, cost: 180000, stock: 14 }
];

let productsData = JSON.parse(localStorage.getItem("spa_products"));

if (!productsData || !Array.isArray(productsData) || productsData.length === 0) {
  productsData = defaultProducts;
  localStorage.setItem("spa_products", JSON.stringify(productsData));
}

// 1. TÍNH TOÁN KPI THỜI GIAN THỰC
function updateKPIs() {
  const totalSku = productsData.length;
  let totalValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  productsData.forEach(p => {
    totalValue += (p.price * p.stock);
    if (p.stock === 0) {
      outOfStockCount++;
    } else if (p.stock <= 5) {
      lowStockCount++;
    }
  });

  document.getElementById("kpiTotalSku").textContent = totalSku;
  document.getElementById("kpiTotalValue").textContent = formatCurrency(totalValue);
  document.getElementById("kpiLowStock").textContent = lowStockCount;
  document.getElementById("kpiOutOfStock").textContent = outOfStockCount;
}

// 2. RENDER BẢNG SẢN PHẨM
function renderProducts(dataToRender = productsData) {
  const tbody = document.getElementById("productsTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (dataToRender.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #888;">Không tìm thấy sản phẩm nào.</td></tr>`;
    updateKPIs();
    return;
  }

  dataToRender.forEach((item) => {
    const tr = document.createElement("tr");

    let statusBadge = "";
    if (item.stock === 0) {
      statusBadge = `<span class="badge-danger">HẾT HÀNG</span>`;
    } else if (item.stock <= 5) {
      statusBadge = `<span class="badge-warning">SẮP HẾT</span>`;
    } else {
      statusBadge = `<span class="badge-success">ỔN ĐỊNH</span>`;
    }

    tr.innerHTML = `
      <td><b>${item.name}</b></td>
      <td><b>${formatCurrency(item.price)}</b></td>
      <td><span class="muted" style="color:#777;">${formatCurrency(item.cost)}</span></td>
      <td style="text-align: center;"><b>${item.stock}</b></td>
      <td>${statusBadge}</td>
      <td style="text-align: right; white-space: nowrap;">
        <button class="btn small" onclick="viewProductDetail(${item.id})">Chi tiết</button>
        <button class="btn small" onclick="openImportModal(${item.id})">Nhập hàng</button>
        <button class="btn small" onclick="openProductModal('edit', ${item.id})">Sửa</button>
        <button class="btn small" style="color:red;" onclick="deleteProduct(${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateKPIs();
}

// 3. XEM CHI TIẾT
function viewProductDetail(id) {
  const item = productsData.find(p => p.id === id);
  if (!item) return;

  const body = document.getElementById("detailProductBody");
  body.innerHTML = `
    <p><b>Tên sản phẩm:</b> ${item.name}</p>
    <p><b>Giá bán:</b> ${formatCurrency(item.price)}</p>
    <p><b>Giá vốn:</b> ${formatCurrency(item.cost)}</p>
    <p><b>Lợi nhuận/SP:</b> ${formatCurrency(item.price - item.cost)}</p>
    <p><b>Số lượng tồn kho:</b> ${item.stock} cái/chai</p>
    <p><b>Tổng giá trị tồn:</b> ${formatCurrency(item.price * item.stock)}</p>
  `;

  openModal("detailProductModal");
}

// 4. MỞ MODAL THÊM / SỬA
function openProductModal(mode, id = null) {
  const title = document.getElementById("productModalTitle");
  const editId = document.getElementById("editProductId");

  if (mode === 'edit') {
    const item = productsData.find(p => p.id === id);
    if (!item) return;

    title.textContent = "Sửa sản phẩm";
    editId.value = item.id;
    document.getElementById("prodName").value = item.name;
    document.getElementById("prodPrice").value = item.price;
    document.getElementById("prodCost").value = item.cost;
    document.getElementById("prodStock").value = item.stock;
  } else {
    title.textContent = "Thêm sản phẩm mới";
    editId.value = "";
    document.getElementById("prodName").value = "";
    document.getElementById("prodPrice").value = "";
    document.getElementById("prodCost").value = "";
    document.getElementById("prodStock").value = "0";
  }

  openModal("productModal");
}

// 5. LƯU SẢN PHẨM
function saveProduct() {
  const editIdVal = document.getElementById("editProductId").value;
  const name = document.getElementById("prodName").value.trim();
  const price = parseInt(document.getElementById("prodPrice").value) || 0;
  const cost = parseInt(document.getElementById("prodCost").value) || 0;
  const stock = parseInt(document.getElementById("prodStock").value) || 0;

  if (!name) {
    alert("Vui lòng nhập tên sản phẩm!");
    return;
  }

  if (editIdVal !== "") {
    const id = parseInt(editIdVal);
    productsData = productsData.map(p => p.id === id ? { ...p, name, price, cost, stock } : p);
  } else {
    const newProd = { id: Date.now(), name, price, cost, stock };
    productsData.push(newProd);
  }

  localStorage.setItem("spa_products", JSON.stringify(productsData));
  filterProducts();
  closeModal("productModal");
}

// 6. NHẬP HÀNG NHANH
function openImportModal(id) {
  const item = productsData.find(p => p.id === id);
  if (!item) return;

  document.getElementById("importProductId").value = item.id;
  document.getElementById("importProductName").textContent = item.name;
  document.getElementById("importQuantity").value = 10;

  openModal("importModal");
}

function confirmImport() {
  const id = parseInt(document.getElementById("importProductId").value);
  const qty = parseInt(document.getElementById("importQuantity").value) || 0;

  if (qty <= 0) {
    alert("Số lượng nhập phải lớn hơn 0!");
    return;
  }

  productsData = productsData.map(p => {
    if (p.id === id) {
      return { ...p, stock: p.stock + qty };
    }
    return p;
  });

  localStorage.setItem("spa_products", JSON.stringify(productsData));
  filterProducts();
  closeModal("importModal");
}

// 7. XÓA SẢN PHẨM
function deleteProduct(id) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    productsData = productsData.filter(p => p.id !== id);
    localStorage.setItem("spa_products", JSON.stringify(productsData));
    filterProducts();
  }
}

// 8. TÌM KIẾM VÀ LỌC KHO
function filterProducts() {
  const searchVal = document.getElementById("searchProductInput").value.toLowerCase().trim();
  const filterVal = document.getElementById("stockFilter").value;

  const filtered = productsData.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchVal);
    let matchStock = true;

    if (filterVal === "STABLE") matchStock = item.stock > 5;
    else if (filterVal === "LOW") matchStock = item.stock > 0 && item.stock <= 5;
    else if (filterVal === "OUT") matchStock = item.stock === 0;

    return matchName && matchStock;
  });

  renderProducts(filtered);
}

// HELPER UTILITIES
function openModal(id) { document.getElementById(id).style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }
function formatCurrency(num) { return num.toLocaleString("vi-VN") + " ₫"; }

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});