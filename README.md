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
* Link truy cập: http://
