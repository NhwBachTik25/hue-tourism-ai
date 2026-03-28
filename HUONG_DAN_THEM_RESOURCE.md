# 📚 Hướng dẫn Thêm Hình ảnh & Tài nguyên

> Tài liệu này hướng dẫn cách thêm hình ảnh, video và các tài nguyên khác vào website Du lịch Phú Vinh.

---

## 📁 Cấu trúc thư mục

Tất cả tài nguyên (hình ảnh, video) được lưu trong thư mục `/public/`:

```
public/
├── images/
│   ├── heritage/         ← Hình di sản văn hóa
│   ├── destinations/     ← Hình điểm đến du lịch
│   ├── crafts/          ← Hình làng nghề
│   ├── food/            ← Hình ẩm thực
│   └── general/         ← Hình chung
└── videos/
    └── intro-phu-vinh.mp4  ← Video giới thiệu
```

---

## 🖼️ 1. Thêm hình ảnh Di sản văn hóa

### Vị trí: `/public/images/heritage/`

| Di sản | Tên file yêu cầu |
|--------|-----------------|
| Tháp Chăm Phú Diên | `thap-cham-1.jpg`, `thap-cham-2.jpg`, `thap-cham-3.jpg` |
| Đình Hà Thanh | `dinh-ha-thanh-1.jpg`, `dinh-ha-thanh-2.jpg`, `dinh-ha-thanh-3.jpg` |
| Chùa An Bằng | `chua-an-bang-1.jpg`, `chua-an-bang-2.jpg`, `chua-an-bang-3.jpg` |
| Lăng mộ An Bằng | `lang-mo-an-bang-1.jpg`, `lang-mo-an-bang-2.jpg`, `lang-mo-an-bang-3.jpg` |

### Cách thêm:
1. Copy hình ảnh vào thư mục `/public/images/heritage/`
2. Đặt tên đúng định dạng như trên
3. Kích thước đề xuất: **1200x800px** hoặc tỷ lệ 3:2

---

## 🏖️ 2. Thêm hình ảnh Điểm đến

### Vị trí: `/public/images/destinations/`

| Điểm đến | Tên file yêu cầu |
|----------|-----------------|
| Biển Vinh Thanh | `bien-vinh-thanh-1.jpg`, `bien-vinh-thanh-2.jpg`, `...` |
| Biển Phú Diên | `bien-phu-dien-1.jpg`, `bien-phu-dien-2.jpg`, `...` |
| Làng An Bằng | `lang-an-bang-1.jpg`, `lang-an-bang-2.jpg`, `...` |
| Đầm Tam Giang | `dam-tam-giang-1.jpg`, `dam-tam-giang-2.jpg`, `...` |
| Lễ hội Cầu Ngư | `le-hoi-cau-ngu-1.jpg` ... `le-hoi-cau-ngu-6.jpg` |

---

## 🏺 3. Thêm hình ảnh Làng nghề

### Vị trí: `/public/images/crafts/`

| Làng nghề | Tên file yêu cầu |
|-----------|-----------------|
| Nước ớt Vinh Xuân | `nuoc-ot-vinh-xuan-1.jpg`, `nuoc-ot-vinh-xuan-2.jpg`, `...` |
| Mắm Phú Diên | `mam-phu-dien-1.jpg`, `mam-phu-dien-2.jpg`, `...` |
| Mắm cá hố An Bằng | `mam-ca-ho-1.jpg`, `mam-ca-ho-2.jpg`, `mam-ca-ho-3.jpg` |
| Bánh ép An Bằng | `banh-ep-1.jpg`, `banh-ep-2.jpg`, `banh-ep-3.jpg` |

---

## 🍲 4. Thêm hình ảnh Ẩm thực

### Vị trí: `/public/images/food/`

| Món ăn | Tên file yêu cầu |
|--------|-----------------|
| Hải sản Vinh Thanh | `hai-san-vinh-thanh-1.jpg`, `hai-san-vinh-thanh-2.jpg`, `...` |
| Mắm Phú Diên | `mam-phu-dien-1.jpg`, `mam-phu-dien-2.jpg`, `...` |
| Nước ớt Vinh Xuân | `nuoc-ot-vinh-xuan-1.jpg`, `nuoc-ot-vinh-xuan-2.jpg`, `...` |
| Quán ăn làng chài | `quan-an-lang-chai-1.jpg`, `quan-an-lang-chai-2.jpg`, `...` |

---

## 🎬 5. Thêm Video giới thiệu

### Vị trí: `/public/videos/`

**File chính:** `intro-phu-vinh.mp4`

### Yêu cầu kỹ thuật:
- **Định dạng:** MP4 (codec H.264)
- **Độ phân giải:** 1920x1080 (Full HD)
- **Thời lượng:** 2-5 phút
- **Dung lượng:** < 50MB (tối ưu cho web)

### Thay thế video placeholder:
Video được hiển thị trên trang chủ. Khi có video thật, cần sửa code trong `src/app/page.tsx`:

```tsx
// Thay đoạn placeholder bằng:
<video 
  src="/videos/intro-phu-vinh.mp4" 
  controls 
  className="w-full h-full object-cover"
/>
```

---

## 📐 Yêu cầu kỹ thuật chung

### Hình ảnh:
| Thuộc tính | Giá trị đề xuất |
|------------|-----------------|
| Định dạng | JPG hoặc WebP |
| Kích thước | 1200x800px (tỷ lệ 3:2) |
| Dung lượng | < 500KB/ảnh |
| Chất lượng | 80-85% (nén tối ưu) |

### Công cụ nén ảnh online:
- [TinyPNG](https://tinypng.com/) - Nén PNG/JPG
- [Squoosh](https://squoosh.app/) - Nén và chuyển đổi WebP
- [Compressor.io](https://compressor.io/) - Nén nhiều ảnh

---

## 🔄 Quy trình thêm hình mới

### Bước 1: Chuẩn bị hình ảnh
- Chọn hình có chất lượng cao, ánh sáng tốt
- Resize về kích thước 1200x800px
- Nén với công cụ online

### Bước 2: Đặt tên file đúng
- Sử dụng chữ thường, không dấu
- Dùng dấu gạch ngang `-` thay khoảng trắng
- Thêm số thứ tự: `ten-hinh-1.jpg`, `ten-hinh-2.jpg`

### Bước 3: Copy vào thư mục đúng
```bash
# Ví dụ: Thêm ảnh Tháp Chăm
Copy ảnh vào: public/images/heritage/thap-cham-1.jpg
```

### Bước 4: Kiểm tra
- Mở website http://localhost:3000
- Điều hướng đến trang tương ứng
- Xác nhận hình hiển thị đúng

---

## ⚠️ Lưu ý quan trọng

> [!IMPORTANT]
> - **Không** đổi tên file sau khi đã thêm (sẽ làm hỏng link)
> - **Không** sử dụng dấu tiếng Việt trong tên file
> - **Luôn** giữ backup hình gốc chất lượng cao

> [!TIP]
> Nếu cần thêm hình mới không có trong danh sách, cần sửa file `src/data/bilingual-data.ts` để thêm đường dẫn.

---

## 📋 Checklist hình ảnh cần thiết

### Di sản văn hóa (12 ảnh)
- [ ] Tháp Chăm Phú Diên (3 ảnh)
- [ ] Đình Hà Thanh (3 ảnh)
- [ ] Chùa An Bằng (3 ảnh)
- [ ] Lăng mộ An Bằng (3 ảnh)

### Điểm đến (21 ảnh)
- [ ] Biển Vinh Thanh (5 ảnh)
- [ ] Biển Phú Diên (5 ảnh)
- [ ] Làng An Bằng (5 ảnh)
- [ ] Đầm Tam Giang (3 ảnh)
- [ ] Lễ hội Cầu Ngư (3 ảnh)

### Làng nghề (16 ảnh)
- [ ] Nước ớt Vinh Xuân (5 ảnh)
- [ ] Mắm Phú Diên (5 ảnh)
- [ ] Mắm cá hố An Bằng (3 ảnh)
- [ ] Bánh ép An Bằng (3 ảnh)

### Ẩm thực (20 ảnh)
- [ ] Hải sản Vinh Thanh (5 ảnh)
- [ ] Mắm Phú Diên (5 ảnh)
- [ ] Nước ớt Vinh Xuân (5 ảnh)
- [ ] Quán ăn làng chài (5 ảnh)

### Video
- [ ] Video giới thiệu Phú Vinh (1 video)

---

## 🆘 Hỗ trợ

Nếu gặp vấn đề khi thêm hình ảnh:
1. Kiểm tra tên file có đúng không
2. Kiểm tra đường dẫn thư mục
3. Clear cache trình duyệt (Ctrl+Shift+R)
4. Khởi động lại dev server (`npm run dev`)
