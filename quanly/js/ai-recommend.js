// ==========================================
// TRÍ TUỆ NHÂN TẠO - AI SERVICE RECOMMENDER
// ==========================================

const defaultCustomers = [
  { id: 1, name: "Nguyễn Minh Anh", phone: "0901 234 567" },
  { id: 2, name: "Trần Ngọc Hà", phone: "0912 345 678" },
  { id: 3, name: "Lê Thu Trang", phone: "0988 777 666" }
];

// Khởi tạo danh sách khách hàng
function initCustomers() {
  const select = document.getElementById("customerSelect");
  if (!select) return;

  const customers = JSON.parse(localStorage.getItem("spa_customers")) || defaultCustomers;
  select.innerHTML = customers.map(c => `<option value="${c.id}">${c.name} · ${c.phone}</option>`).join("");
}

// Thuật toán giả lập AI phân tích và khớp dịch vụ từ LocalStorage
function analyzeAndRecommend() {
  const needText = document.getElementById("customerNeed").value.trim().toLowerCase();
  const customerSelect = document.getElementById("customerSelect");
  const selectedCustName = customerSelect.options[customerSelect.selectedIndex].text.split('·')[0].trim();

  if (!needText) {
    alert("Vui lòng nhập nhu cầu của khách hàng để AI phân tích!");
    return;
  }

  // Bật loading giả lập độ trễ AI
  const loading = document.getElementById("loadingState");
  const container = document.getElementById("recommendContainer");
  const msgSection = document.getElementById("messageSection");
  const btn = document.getElementById("btnAnalyze");

  loading.style.display = "block";
  container.innerHTML = "";
  msgSection.style.display = "none";
  btn.disabled = true;

  setTimeout(() => {
    loading.style.display = "none";
    btn.disabled = false;

    // Lấy danh sách dịch vụ thực tế từ spa_services
    const allServices = JSON.parse(localStorage.getItem("spa_services")) || [];
    
    // Tìm các dịch vụ ACTIVE
    const activeServices = allServices.filter(s => s.status === "ACTIVE" || !s.status);

    let recommended = [];

    // Logic khớp từ khóa thông minh
    activeServices.forEach(svc => {
      const name = svc.name.toLowerCase();
      const desc = (svc.desc || "").toLowerCase();

      if ((needText.includes("khô") || needText.includes("ẩm") || needText.includes("da")) && (name.includes("ẩm") || desc.includes("ẩm"))) {
        recommended.push({ ...svc, reason: "Phù hợp với nhu cầu chăm sóc cấp ẩm hiện tại và tình trạng da khô." });
      } else if ((needText.includes("mỏi") || needText.includes("lưng") || needText.includes("body") || needText.includes("đau")) && (name.includes("massage") || name.includes("body") || desc.includes("thư giãn"))) {
        recommended.push({ ...svc, reason: "Phù hợp với nhu cầu thư giãn và giảm mệt mỏi cơ thể được mô tả." });
      } else if ((needText.includes("phục hồi") || needText.includes("yếu")) && (name.includes("phục hồi") || desc.includes("phục hồi"))) {
        recommended.push({ ...svc, reason: "Hỗ trợ phục hồi cấu trúc da tầng sâu theo mong muốn khách hàng." });
      }
    });

    // Nếu không khớp từ khóa đặc biệt, lấy 2 dịch vụ đầu tiên làm mặc định
    if (recommended.length === 0 && activeServices.length > 0) {
      recommended = activeServices.slice(0, 2).map(s => ({
        ...s,
        reason: "Dịch vụ phổ biến phù hợp với tư vấn tổng quát cho khách hàng."
      }));
    } else {
      recommended = recommended.slice(0, 2); // Tối đa 2 gợi ý
    }

    renderRecommendations(recommended, selectedCustName);
  }, 600);
}

// Render kết quả gợi ý ra màn hình
function renderRecommendations(list, customerName) {
  const container = document.getElementById("recommendContainer");
  const msgSection = document.getElementById("messageSection");
  const msgText = document.getElementById("aiMessageText");

  document.getElementById("recommendTitle").textContent = `${list.length} dịch vụ phù hợp`;

  if (list.length === 0) {
    container.innerHTML = `<p style="color:#888;">Không tìm thấy dịch vụ phù hợp trong danh mục hiện tại.</p>`;
    return;
  }

  container.innerHTML = list.map((item, index) => `
    <div class="recommend">
      <strong>${index + 1}. ${item.name}</strong>
      <span>${item.reason}</span><br>
      <button class="btn small" style="margin-top:8px" onclick="addToPOS('${item.name}', ${item.price || 0})">Chọn vào đơn</button>
    </div>
  `).join("");

  // Tạo nội dung tin nhắn tự động
  const serviceNames = list.map(l => l.name).join(" và ");
  msgText.textContent = `“Chị ${customerName} có thể tham khảo dịch vụ ${serviceNames} dựa trên nhu cầu hiện tại. Em có thể hỗ trợ kiểm tra khung giờ phù hợp cho chị.”`;
  
  msgSection.style.display = "block";
}

// Chức năng đẩy trực tiếp dịch vụ được chọn vào Đơn hàng POS
function addToPOS(serviceName, price) {
  let posCart = JSON.parse(localStorage.getItem("spa_pos_cart")) || [];
  
  posCart.push({
    id: Date.now(),
    name: serviceName,
    price: price,
    type: "SERVICE",
    quantity: 1
  });

  localStorage.setItem("spa_pos_cart", JSON.stringify(posCart));
  alert(`Đã thêm "${serviceName}" vào đơn hàng POS thành công!`);
}

// Sửa nội dung tin nhắn tư vấn
function editMessage() {
  const msgText = document.getElementById("aiMessageText");
  const currentText = msgText.textContent.replace(/^“|”$/g, '');
  const newText = prompt("Chỉnh sửa nội dung tin nhắn tư vấn:", currentText);

  if (newText !== null && newText.trim() !== "") {
    msgText.textContent = `“${newText.trim()}”`;
  }
}

// Duyệt và gửi tin nhắn
function sendConsultMessage() {
  const msg = document.getElementById("aiMessageText").textContent;
  alert(`Đã gửi thành công tin nhắn tư vấn:\n\n${msg}`);
}

// Khởi chạy khi load trang
document.addEventListener("DOMContentLoaded", () => {
  initCustomers();
  analyzeAndRecommend(); // Chạy phân tích lần đầu với dữ liệu mẫu
});