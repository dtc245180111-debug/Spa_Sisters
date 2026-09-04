# SPA_SISTERS — Hệ thống quản lý Spa và chăm sóc sắc đẹp

## 1. Giới thiệu

**SPA_SISTERS** là giao diện hệ thống quản lý Spa và chăm sóc sắc đẹp, hỗ trợ quản lý tập trung các nghiệp vụ vận hành như lịch hẹn, khách hàng, dịch vụ, gói liệu trình, sản phẩm, thanh toán, nhân viên và báo cáo.

Hệ thống có tích hợp **AI Assistant** nhằm hỗ trợ:
- Gợi ý dịch vụ phù hợp cho khách hàng.
- Sinh tin nhắn chăm sóc và nhắc lịch.
- Tóm tắt hồ sơ khách hàng.
- Hỗ trợ nhân viên trong quá trình chăm sóc khách hàng.

Giao diện sử dụng phong cách màu hồng pastel, bố cục dashboard và sidebar, phù hợp cho hệ thống quản lý Spa.

---

## 2. Công nghệ giao diện

- HTML5
- CSS3
- JavaScript
- Responsive Web Design
- Font hệ thống: `Inter`, `Segoe UI`, `Arial`
- Không yêu cầu framework frontend để chạy bản giao diện hiện tại.
- Logo: `../image/Logo_spa.png`

---

## 3. Các nhóm người dùng

Hệ thống định hướng 4 nhóm người dùng:

| User | Chức năng chính |
|---|---|
| **Quản lý (Manager)** | Quản lý nhân viên, phân quyền, dịch vụ, sản phẩm, doanh thu, báo cáo và toàn bộ hệ thống |
| **Lễ tân (Receptionist)** | Quản lý khách hàng, đặt lịch, xác nhận lịch, POS, thanh toán và hỗ trợ AI |
| **Kỹ thuật viên (Technician)** | Xem lịch cá nhân, thực hiện dịch vụ, ghi chú kết quả và cập nhật liệu trình |
| **Khách hàng (Customer)** | Đăng ký/đăng nhập, xem dịch vụ, đặt lịch, theo dõi liệu trình và lịch sử thanh toán |

> Bản `index.html` hiện tại đang mô phỏng giao diện ở vai trò **Receptionist**.

---

## 4. Chức năng hệ thống

### 4.1. Dashboard

Dashboard cung cấp tổng quan hoạt động Spa:

- Doanh thu hôm nay.
- Số lịch hẹn trong ngày.
- Số khách đang sử dụng dịch vụ.
- Số sản phẩm cần chú ý.
- Danh sách lịch hẹn hôm nay.
- Các đề xuất cần xử lý từ AI.

---

### 4.2. Quản lý lịch hẹn

Chức năng hỗ trợ:

- Xem lịch hẹn.
- Xem lịch theo kỹ thuật viên.
- Tạo lịch mới.
- Chọn khách hàng.
- Chọn dịch vụ.
- Chọn ngày và giờ.
- Phân công kỹ thuật viên.
- Chọn phòng.
- Ghi chú nhu cầu của khách.
- Theo dõi trạng thái lịch.

Các trạng thái được sử dụng trong giao diện:

```text
PENDING
CONFIRMED
IN_PROGRESS
CANCELLED
```

Quy trình:

```text
Tạo lịch
   ↓
Kiểm tra trùng lịch
   ↓
PENDING
   ↓
Lễ tân xác nhận
   ↓
CONFIRMED
   ↓
Khách sử dụng dịch vụ
   ↓
IN_PROGRESS
   ↓
Hoàn thành
```

---

### 4.3. Quản lý khách hàng

Cho phép:

- Thêm khách hàng.
- Tìm kiếm theo tên hoặc số điện thoại.
- Phân loại khách hàng.
- Xem thông tin cá nhân.
- Xem số lần sử dụng dịch vụ.
- Xem tổng chi tiêu.
- Xem lịch sử liệu trình.
- Xem ghi chú của kỹ thuật viên.
- Xem AI Profile Summary.

Thông tin khách hàng gồm:

- Họ tên.
- Số điện thoại.
- Email.
- Ngày sinh.
- Giới tính.
- Loại da/cơ địa.
- Ghi chú tư vấn ban đầu.

---

## 5. Hồ sơ khách hàng và AI Profile Summary

Màn hình hồ sơ khách hàng cung cấp thông tin tổng hợp:

- Mã khách hàng.
- Số điện thoại.
- Trạng thái khách hàng.
- Số lần sử dụng dịch vụ.
- Tổng chi tiêu.
- Lịch sử liệu trình.
- Ghi chú của kỹ thuật viên.

### AI Profile Summary

AI có thể tóm tắt:

```text
- Các dịch vụ khách thường sử dụng.
- Thói quen hoặc lựa chọn đã được ghi nhận.
- Ghi chú quan trọng của kỹ thuật viên.
- Thông tin cần lưu ý trước lần chăm sóc tiếp theo.
```

AI chỉ hỗ trợ tổng hợp dữ liệu đã có trong hệ thống.

---

## 6. Thanh toán / POS

POS hỗ trợ:

- Tổng hợp dịch vụ.
- Thêm sản phẩm bán kèm.
- Nhập voucher/giảm giá.
- Tính tổng tiền.
- Chọn phương thức thanh toán:
  - Tiền mặt.
  - Chuyển khoản.
  - Thẻ.
- Xuất hóa đơn.

Ví dụ:

```text
Dịch vụ: Cấp ẩm Deep Moist       650.000 ₫
Sản phẩm: Kem dưỡng phục hồi     480.000 ₫
------------------------------------------
Tổng thanh toán                1.130.000 ₫
```

---

## 7. Quản lý dịch vụ và gói liệu trình

Quản lý:

- Tên dịch vụ.
- Mô tả.
- Giá.
- Thời lượng.
- Số buổi.
- Trạng thái cung cấp.

Ví dụ:

| Dịch vụ | Giá | Thời lượng | Số buổi |
|---|---:|---:|---:|
| Cấp ẩm Deep Moist | 650.000 ₫ | 60 phút | 1 |
| Massage Body Thụy Điển | 750.000 ₫ | 75 phút | 1 |
| Gói Phục hồi 5 buổi | 2.900.000 ₫ | 60 phút/buổi | 5 |

---

## 8. Quản lý sản phẩm và kho

Theo dõi:

- Tổng số SKU.
- Giá trị tồn kho.
- Sản phẩm sắp hết.
- Sản phẩm hết hàng.
- Giá bán.
- Giá vốn.
- Số lượng tồn.

Trạng thái:

```text
ỔN ĐỊNH
SẮP HẾT
HẾT HÀNG
```

---

## 9. AI — Gợi ý dịch vụ

### Đầu vào

AI sử dụng:

```text
Nhu cầu hiện tại của khách
+
Lịch sử sử dụng dịch vụ
+
Danh sách dịch vụ hiện có
```

### Đầu ra

AI đưa ra tối đa **2 dịch vụ phù hợp**.

Ví dụ:

```text
1. Cấp ẩm Deep Moist
   Phù hợp với nhu cầu chăm sóc cấp ẩm hiện tại.

2. Massage Body Thụy Điển
   Phù hợp với nhu cầu thư giãn và cảm giác mỏi lưng.
```

### Quy tắc AI

AI phải:

- Chỉ gợi ý dịch vụ có trong cơ sở dữ liệu.
- Không tự tạo dịch vụ.
- Không chẩn đoán y khoa.
- Không đưa lời khuyên y khoa.
- Không cam kết hiệu quả điều trị.

---

## 10. AI — Chăm sóc và nhắc lịch

Chức năng cho phép nhân viên tạo tin nhắn cá nhân hóa.

### Đầu vào

- Khách hàng.
- Loại tin nhắn.
- Lịch hẹn.
- Dịch vụ.
- Ngữ cảnh chăm sóc.

### Loại tin

```text
Nhắc lịch
Chăm sóc sau dịch vụ
```

### Quy trình đề xuất

```text
Nhập thông tin
      ↓
AI sinh tin nhắn
      ↓
Nhân viên xem trước
      ↓
Chỉnh sửa nếu cần
      ↓
Duyệt
      ↓
Gửi khách hàng
```

Không nên để AI tự động gửi tin nhắn mà không có bước kiểm tra phù hợp.

---

## 11. Quản lý nhân viên và phân quyền

Hệ thống sử dụng mô hình **RBAC — Role Based Access Control**.

Các vai trò hiện được mô phỏng:

```text
MANAGER
RECEPTIONIST
TECHNICIAN
```

Ví dụ quyền:

| Chức năng | Manager | Receptionist | Technician |
|---|:---:|:---:|:---:|
| Quản lý nhân viên | ✓ | ✗ | ✗ |
| Quản lý khách hàng | ✓ | ✓ | Xem |
| Quản lý lịch | ✓ | ✓ | Xem lịch cá nhân |
| POS | ✓ | ✓ | ✗ |
| Dịch vụ | ✓ | Xem | Xem |
| Báo cáo | ✓ | Hạn chế | ✗ |
| AI | ✓ | ✓ | Hỗ trợ Summary |

---

## 12. Báo cáo kinh doanh

Dashboard báo cáo gồm:

- Doanh thu.
- Lượt đặt lịch.
- Giá trị đơn hàng trung bình.
- Tỷ lệ hủy.
- Doanh thu theo tuần.
- Top dịch vụ.
- Doanh thu theo dịch vụ.

Ví dụ dữ liệu giao diện:

```text
Doanh thu:       426,8M ₫
Lượt đặt lịch:   684
Giá trị đơn TB:  624K ₫
Tỷ lệ hủy:       4,8%
```

---

## 13. Cài đặt hệ thống

Cấu hình gồm:

- Tên Spa.
- Giờ vận hành.
- Timezone.
- AI Guardrails.
- Bảo mật.
- Sao lưu dữ liệu.

Timezone hiện được thiết kế:

```text
Asia/Ho_Chi_Minh
```

### AI Safety

Các guardrail được giao diện mô phỏng:

```text
- Không chẩn đoán y khoa.
- Không kê đơn thuốc.
- Không cam kết hiệu quả điều trị.
- Chỉ gợi ý dịch vụ/sản phẩm có trong CSDL.
- Timeout AI tối đa 5 giây.
- Fallback về template khi AI lỗi.
```

---

## 14. Cấu trúc giao diện

```text
SPA_SISTERS
│
├── Dashboard
│
├── Lịch hẹn
│
├── Khách hàng
│   └── Hồ sơ khách hàng
│
├── Thanh toán / POS
│
├── Dịch vụ & gói
│
├── Sản phẩm & kho
│
├── AI Assistant
│   ├── Gợi ý dịch vụ
│   └── Tin nhắn CSKH
│
├── Nhân viên & quyền
│
├── Báo cáo
│
└── Cài đặt
```

---

## 15. Luồng nghiệp vụ chính

### Luồng đặt lịch

```text
Khách hàng
    ↓
Chọn dịch vụ
    ↓
Chọn ngày / giờ
    ↓
Kiểm tra lịch trống
    ↓
Phân công KTV
    ↓
Tạo lịch PENDING
    ↓
Lễ tân xác nhận
    ↓
CONFIRMED
```

### Luồng sử dụng liệu trình

```text
Khách hàng
    ↓
Đăng ký gói liệu trình
    ↓
Đặt lịch từng buổi
    ↓
Kỹ thuật viên thực hiện
    ↓
Ghi chú kết quả
    ↓
Cập nhật số buổi
    ↓
Hoàn thành liệu trình
```

### Luồng chăm sóc bằng AI

```text
Khách hoàn thành dịch vụ
          ↓
Lưu lịch sử
          ↓
AI phân tích dữ liệu
          ↓
Sinh tin nhắn chăm sóc
          ↓
Nhân viên kiểm tra
          ↓
Duyệt
          ↓
Gửi khách hàng
```

---

## 16. Thiết kế dữ liệu đề xuất

Các bảng chính của hệ thống:

```text
USERS
EMPLOYEES
CUSTOMERS
SERVICES
SERVICE_PACKAGES
PACKAGE_DETAILS
APPOINTMENTS
APPOINTMENT_SERVICES
CUSTOMER_TREATMENTS
TREATMENT_SESSIONS
PRODUCTS
INVOICES
INVOICE_DETAILS
CUSTOMER_CARE
AI_RECOMMENDATIONS
AI_MESSAGES
AI_SUMMARIES
```

Quan hệ nghiệp vụ chính:

```text
CUSTOMER
   │
   ├── APPOINTMENT
   │       │
   │       └── APPOINTMENT_SERVICE
   │                  │
   │                  └── SERVICE
   │
   ├── CUSTOMER_TREATMENT
   │       │
   │       └── TREATMENT_SESSION
   │
   ├── CUSTOMER_CARE
   │
   └── AI_RECOMMENDATION / AI_MESSAGE / AI_SUMMARY
```

---

## 17. Chạy giao diện hiện tại

Nếu chỉ sử dụng file HTML hiện tại, không cần backend để xem giao diện demo.

Có thể:

1. Mở thư mục project bằng VS Code.
2. Đảm bảo `index.html` và thư mục `image` đúng vị trí.
3. Mở `index.html` bằng trình duyệt hoặc sử dụng Live Server.
4. Đăng nhập demo bằng giao diện hiện tại.
5. Khám phá các trang trên sidebar.

Logo được tham chiếu:

```text
../image/Logo_spa.png
```

Vì vậy cần đảm bảo file logo tồn tại đúng đường dẫn.

---

## 18. Định hướng phát triển Backend

Giao diện hiện tại là prototype/frontend demo. Khi phát triển thành hệ thống thực tế, có thể sử dụng:

```text
Frontend
React / Vue / HTML

        ↓ REST API

Backend
FastAPI / Flask / Django

        ↓

Database
MySQL / PostgreSQL

        ↓

AI Engine
OpenAI / Gemini / Claude / Ollama
```

Backend cần bổ sung:

- Authentication.
- JWT/OAuth2.
- RBAC.
- CRUD API.
- Database migration.
- Validation.
- Transaction handling.
- AI service.
- Prompt template.
- Logging.
- Error handling.
- Unit test và integration test.

---

## 19. Kiểm thử

Các chức năng cần kiểm thử tối thiểu:

### Lịch hẹn

- Tạo lịch.
- Đổi lịch.
- Hủy lịch.
- Không cho phép KTV có hai lịch trùng thời gian.
- Kiểm tra trạng thái lịch.

### Thanh toán

- Tính tổng tiền.
- Áp dụng giảm giá.
- Thanh toán.
- Xuất hóa đơn.
- Không cho phép thanh toán sai dữ liệu.

### Liệu trình

- Tạo liệu trình.
- Tăng số buổi đã sử dụng.
- Giảm số buổi còn lại.
- Không được sử dụng quá số buổi.

### AI

- Chỉ gợi ý dịch vụ tồn tại.
- Không vượt quá 2 gợi ý.
- Không sinh tư vấn y khoa.
- Sinh tin nhắn đúng ngữ cảnh.
- Tóm tắt đúng dữ liệu khách hàng.
- Có fallback khi AI lỗi.

---

## 20. Bảo mật

Không lưu API key trực tiếp trong mã nguồn.

Sử dụng file:

```text
.env
```

và commit:

```text
.env.example
```

Không commit:

```text
.env
*.key
*.pem
database credentials
AI API keys
```

JWT secret và thông tin kết nối database phải được lưu bằng biến môi trường.

---

## 21. Ghi chú

File giao diện hiện tại chủ yếu phục vụ **prototype/demo nghiệp vụ**. Các thao tác như tạo lịch, thanh toán và AI trong bản HTML đang mô phỏng bằng JavaScript phía trình duyệt; để trở thành hệ thống thực tế cần kết nối API backend và cơ sở dữ liệu.

