# 📖 HƯỚNG DẪN QUẢN TRỊ - DI SẢN PHÚ VINH

## 🔐 HỆ THỐNG ĐĂNG NHẬP

### Đăng nhập người dùng (User Authentication)

Tất cả người dùng cần đăng nhập để sử dụng website. Có 2 cách:

1. **Đăng ký tài khoản mới** tại `/signup`
2. **Đăng nhập** tại `/login`

> 💡 Mới truy cập sẽ tự động chuyển đến trang đăng nhập.

---

## 👑 HỆ THỐNG PHÂN QUYỀN

### 3 Loại vai trò (Roles)

| Vai trò | Icon | Quyền hạn |
|---------|------|-----------|
| **Super Admin** | 👑 | Toàn quyền: quản lý users, promote/demote, tất cả tính năng admin |
| **Admin** | 🛡️ | Quản lý nội dung: upload câu hỏi, media, xem thống kê |
| **User** | 👤 | Người dùng thường: chỉ xem nội dung, sử dụng chatbot AI |

### Tài khoản Super Admin (Mặc định)

| Thông tin | Giá trị |
|-----------|---------|
| **Email** | `admin@phu-vinh.vn` |
| **Mật khẩu** | `admin123456` |

> ⚠️ **BẢO MẬT**: Tài khoản này được tạo tự động mỗi khi khởi động. Đổi mật khẩu trong code khi triển khai production!

---

## 🏠 DASHBOARD ADMIN

**URL**: `/admin/dashboard`

> Chỉ **Super Admin** và **Admin** mới có thể truy cập.

### 5 Tab chính

1. **Tổng quan** - Thống kê website
2. **Thống kê** - Analytics chi tiết
3. **Câu hỏi** - Quản lý câu hỏi trắc nghiệm
4. **Media** - Quản lý hình ảnh và video
5. **Người dùng** - Quản lý users và roles (chỉ Super Admin)

---

## 👥 QUẢN LÝ NGƯỜI DÙNG

### Dành cho Super Admin

1. Vào tab **"Người dùng"**
2. Xem danh sách tất cả users
3. **Thăng Admin**: Nhấn nút "Thăng Admin" cho users
4. **Hạ xuống User**: Nhấn nút "Hạ xuống User" cho admins

### Lưu ý
- Không thể thay đổi vai trò Super Admin
- Không thể tạo thêm Super Admin
- Admin không thể thay đổi role của người khác

---

## 📝 HƯỚNG DẪN UPLOAD CÂU HỎI (CSV)

### Bước 1: Chuẩn bị file CSV

Tạo file Excel với 2 cột, lưu dưới định dạng `.csv`:

| question | answer |
|----------|--------|
| Tháp Chăm Phú Diên có niên đại từ thế kỷ nào? | Thế kỷ VIII |
| Xã Phú Vinh được thành lập năm nào? | 2025 |

### Bước 2: Upload file

1. Vào tab **"Câu hỏi"** (cần quyền Admin trở lên)
2. Nhấn nút **"Chọn file CSV"**
3. Hệ thống sẽ tự động:
   - Đọc câu hỏi và đáp án đúng
   - **AI tự động tạo 3 đáp án sai**
   - Thêm giải thích

---

## 🖼️ QUẢN LÝ HÌNH ẢNH/VIDEO

### Thêm media (cần quyền Admin)

1. Vào tab **"Media"**
2. Nhấn **"Thêm media"**
3. Chọn file (JPG, PNG, GIF, MP4, WebM)

### Xóa media

1. Di chuột vào hình
2. Nhấn nút **thùng rác đỏ**

---

## � TÀI KHOẢN NGƯỜI DÙNG

### Trang Profile `/profile`

Mỗi user có thể:
- Xem thông tin tài khoản
- **Đổi tên** (click icon Edit)
- Đăng xuất

### Truy cập tài khoản

- Click **avatar** trên Header → **"Tài khoản"**

---

## ❓ CÂU HỎI THƯỜNG GẶP

### Q: Quên mật khẩu Super Admin?
A: Mật khẩu mặc định: `admin123456`. Hoặc xem `src/lib/user-auth.ts`

### Q: User không thể vào Admin?
A: Cần được Super Admin thăng lên role Admin trong Dashboard.

### Q: Dữ liệu lưu ở đâu?
A: Tất cả trong `localStorage`. Cần database cho production.

---

## 📞 HỖ TRỢ

1. Chụp ảnh màn hình lỗi
2. Mô tả các bước đã thực hiện
3. Liên hệ đội ngũ kỹ thuật

---

**Phiên bản**: 2.2  
**Cập nhật**: Tháng 2/2026  
**Tính năng mới**:
- Tab Edit: chỉnh sửa trực tiếp trên trang (click nút "Chỉnh sửa" trên header)
- AI gợi ý nội dung: 4 kiểu viết lại (dễ hiểu, di sản, song ngữ, rút gọn)
- Rich Text Toolbar: Bold/Italic/Undo/Redo
- Video support: YouTube, Google Drive
- Content Manager: quản lý tất cả các trang từ dashboard
- **NÚT VỀ TRANG CHỦ**: Trên Admin Dashboard, click nút "Về trang chủ" hoặc nhấn phím **ESC** để quay lại trang chủ
- **THÔNG BÁO TOAST**: Khi lưu thay đổi trong chế độ Edit Mode, hệ thống sẽ hiển thị thông báo xác nhận

