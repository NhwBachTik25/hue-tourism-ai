# 👓 HƯỚNG DẪN TÍCH HỢP AR/3D

## Tổng quan
Trang "Khám phá 3D" (`/explore-3d`) hiện đã được chuyển đổi thành **Bộ Sưu Tập AR**, cho phép người dùng xem và tương tác với các mô hình 3D của Tháp Chăm và Đình Hà Thanh ngay trên trình duyệt, cũng như xem trong không gian thực (AR) trên thiết bị di động.

---

## 📁 Vị trí lưu file 3D
Tất cả các file mô hình 3D cần được đặt trong thư mục:
`public/models/`

Nếu thư mục chưa có, hãy tạo mới nó.

---

## 🛠️ Quy trình chuẩn bị mô hình

### 1. Định dạng file
-   **Chuẩn:** `.glb` (GL Transmission Format Binary). Đây là định dạng chuẩn cho web AR, bao gồm cả geometry, texture, và animation trong 1 file duy nhất.
-   **Kích thước:** Tối ưu nhất là dưới **10MB** để load nhanh. Tối đa không nên quá 20MB.

### 2. Export từ phần mềm thiết kế
Hầu hết các phần mềm 3D đều hỗ trợ export ra `.glb` hoặc `.gltf`:
-   **Blender:** File -> Export -> glTF 2.0 (.glb)
-   **SketchUp:** Cần cài plugin hoặc export qua định dạng trung gian (.dae, .obj) rồi convert.
-   **RealityCapture / Metashape (Photogrammetry):** Export model đã tối ưu lưới (decimate) và texture (atlas).

### 3. Tối ưu hóa (Quan trọng ⚠️)
Mô hình scan 3D (Photogrammetry) thường rất nặng (hàng trăm MB). Cần tối ưu:
-   **Giảm lưới (Decimate):** Giữ số lượng polygon dưới 100k nếu có thể.
-   **Nén Texture:** Dùng texture 2K hoặc 4K jpg/webp.
-   **Draco Compression:** Dùng tool `gltf-pipeline` hoặc nén ngay trong Blender để giảm dung lượng file.

---

## 🚀 Cách thêm mô hình vào Web

### Bước 1: Copy file
Copy file `.glb` vào `public/models/`. Ví dụ:
-   `public/models/thap-cham.glb`
-   `public/models/dinh-ha-thanh.glb`

### Bước 2: Cập nhật Code
Mở file `src/app/(main)/explore-3d/page.tsx` và tìm mảng `arModels`. Cập nhật đường dẫn:

```tsx
const arModels = [
    {
        id: 'thap-cham',
        name: { vi: 'Tháp Chăm Phú Diên', ... },
        // ...
        modelSrc: '/models/thap-cham.glb', // <--- Cập nhật dòng này
        poster: '/images/heritage/thap-cham-1.jpg', // Ảnh hiển thị khi đang load
        // ...
    },
    // ...
];
```

---

## 📱 Kiểm tra AR
1.  Mở web trên điện thoại (Android hoặc iOS).
2.  Chọn mô hình.
3.  Nhấn nút **"Xem trong không gian (AR)"**.
4.  Di chuyển điện thoại để nhận diện mặt phẳng.
5.  Mô hình sẽ xuất hiện trong không gian thực.

## 🆘 Troubleshooting
-   **Mô hình không hiện, chỉ loading:** Kiểm tra lại đường dẫn file. Đảm bảo file nằm đúng trong `public/models/`.
-   **File quá nặng:** Dùng [gltf.report](https://gltf.report/) để kiểm tra và tối ưu file online.
-   **AR không hoạt động:** Đảm bảo điện thoại hỗ trợ ARCore (Android) hoặc ARKit (iOS).
