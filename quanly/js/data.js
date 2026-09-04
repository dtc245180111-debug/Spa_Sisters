// ==========================================
// 1. KHOI TAO DU LIEU MAU LICH HEN
// ==========================================
const initialAppointments = [
  { id: 1, time: "09:00", customerId: "KH-000128", customer: "Nguyễn Minh Anh", phone: "0901 234 567", service: "Cấp ẩm Deep Moist", price: "650.000 ₫", ktv: "Mai", room: "Phòng 01", status: "CONFIRMED", date: "2026-09-04", note: "Khách da khô" },
  { id: 2, time: "10:30", customerId: "KH-000130", customer: "Trần Ngọc Hà", phone: "0912 345 678", service: "Massage Body Thụy Điển", price: "750.000 ₫", ktv: "Lan", room: "Phòng 02", status: "IN_PROGRESS", date: "2026-09-04", note: "Tập trung vai cổ gáy" },
  { id: 3, time: "13:30", customerId: "KH-000129", customer: "Lê Thu Trang", phone: "0987 654 321", service: "Tẩy tế bào chết toàn thân", price: "500.000 ₫", ktv: "Mai", room: "Phòng 01", status: "PENDING", date: "2026-09-04", note: "" },
  { id: 4, time: "15:00", customerId: "KH-000131", customer: "Vũ Ngọc Linh", phone: "0933 111 222", service: "Triệt lông diode laser", price: "400.000 ₫", ktv: "Hương", room: "Phòng 03", status: "CANCELLED", date: "2026-09-05", note: "Lịch hẹn ngày mai" }
];

if (!localStorage.getItem("appointments")) {
  localStorage.setItem("appointments", JSON.stringify(initialAppointments));
}

// ==========================================
// 2. KHOI TAO DU LIEU MAU KHACH HANG
// ==========================================
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

if (!localStorage.getItem("customers")) {
  localStorage.setItem("customers", JSON.stringify(defaultCustomers));
}

// ==========================================
// 3. HAM TIEN ICH CHUNG (HELPER FUNCTIONS)
// ==========================================
function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split('-');
  return `${parseInt(day)} Tháng ${parseInt(month)}, ${year}`;
}

function getInitials(name) {
  if (!name) return "KH";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
}