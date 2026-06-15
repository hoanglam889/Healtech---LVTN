# 🏥 HƯỚNG DẪN CHẠY PROJECT ĐẶT LỊCH PHÒNG KHÁM

Dưới đây là hướng dẫn chi tiết để khởi động toàn bộ hệ thống và thông tin các tài khoản đã được tạo sẵn để test luồng nghiệp vụ. 

---

## 🚀 BƯỚC 1: KHỞI ĐỘNG HỆ THỐNG

Anh mở 2 cửa sổ Terminal (CMD/PowerShell) riêng biệt để chạy song song cả Backend và Frontend nhé.

**1. Khởi động Backend:**
Tại thư mục gốc của project, mở Terminal 1 và gõ:
cd backend
npm run start:dev

**2. Khởi động Frontend:**
Mở Terminal 2 và gõ:
cd frontend
npm run dev

*(Đợi vài giây cho đến khi cả 2 terminal đều báo chạy thành công thì chuyển sang Bước 2).*

---

## 🔑 BƯỚC 2: LINK TRUY CẬP VÀ TÀI KHOẢN TEST

Hệ thống được chia làm 2 cổng chính (Portal). Anh click vào link và sử dụng các tài khoản Hardcode dưới đây để test:

### 👨‍👩‍👧 1. Cổng Khách hàng (Bệnh nhân)
Dùng để test chức năng xem lịch bác sĩ và Đặt lịch khám bệnh.
* Link truy cập: http://localhost:5173/
* Tài khoản (SĐT): 0797551612
* Mật khẩu: 1

### 🩺 2. Cổng Nội bộ (Lễ tân & Bác sĩ)
Hệ thống sẽ tự động nhận diện Role để hiển thị đúng giao diện dựa trên tài khoản đăng nhập.
* Link truy cập: http://http://localhost:5173/staff

**Tài khoản Lễ tân:**
Dùng để test tính năng Check-in bệnh nhân (chuyển trạng thái từ Booking sang Waiting) và tính điểm ưu tiên Hàng đợi.
* Tài khoản: 008
* Mật khẩu: 1

**Tài khoản Bác sĩ (Khoa Tim Mạch - BS. Cao Mỹ Ái):**
Dùng để test giao diện theo dõi Hàng đợi tự động và chức năng Tạo bệnh án.
* Tài khoản: 004
* Mật khẩu: 1

---

## 💡 GỢI Ý LUỒNG TEST CHUẨN (HAPPY CASE)
Để thấy hệ thống chạy mượt nhất, anh hãy test theo đúng trình tự này:
1. Đăng nhập nick **Khách hàng** -> Đặt 1 lịch hẹn ở **Khoa Tim Mạch** (Vì Nick Bác sĩ test đang ở khoa này).
2. Đăng nhập nick **Lễ tân** -> Bấm Check-in cho lịch hẹn vừa tạo.
3. Đăng nhập nick **Bác sĩ (004)** -> Xem bệnh nhân vừa check-in đã lọt vào Hàng đợi chưa -> Bấm "Khám" -> Gõ nội dung bệnh án và hoàn tất.
