# Hướng dẫn thêm hình ảnh và video vào dự án

## 📁 Cấu trúc thư mục

```
hue-tourism-ai/
├── public/
│   ├── images/           ← Thư mục chứa hình ảnh
│   │   ├── destinations/ ← Ảnh địa điểm
│   │   ├── crafts/       ← Ảnh làng nghề
│   │   ├── food/         ← Ảnh ẩm thực
│   │   └── stories/      ← Ảnh thuyết minh
│   └── videos/           ← Thư mục chứa video
└── src/
    └── app/              ← Code các trang
```

---

## 🖼️ THÊM HÌNH ẢNH

### Bước 1: Chuẩn bị ảnh

**Yêu cầu kỹ thuật:**
- **Định dạng:** `.jpg`, `.jpeg`, `.png`, `.webp`
- **Kích thước đề xuất:** 
  - Ảnh card: 800x600 pixels
  - Ảnh story: 1080x1920 pixels (9:16)
  - Ảnh chi tiết: 1200x800 pixels
- **Dung lượng:** Dưới 500KB mỗi ảnh (nén nếu cần)

**Công cụ nén ảnh miễn phí:**
- https://tinypng.com
- https://squoosh.app

### Bước 2: Đặt tên file

**Quy tắc đặt tên:**
```
[loai-dia-diem]-[so-thu-tu].jpg

Ví dụ:
- bien-vinh-thanh-1.jpg
- bien-vinh-thanh-2.jpg
- lang-an-bang-overview.jpg
- nuoc-ot-vinh-xuan-1.jpg
```

**Lưu ý:**
- Không dấu tiếng Việt
- Dùng dấu gạch ngang `-` thay khoảng trắng
- Viết thường toàn bộ

### Bước 3: Copy ảnh vào thư mục

1. Mở thư mục `public/images/`
2. Tạo thư mục con nếu chưa có (destinations, crafts, food, stories)
3. Copy ảnh vào thư mục tương ứng

```
public/
└── images/
    └── destinations/
        ├── bien-vinh-thanh-1.jpg    ← Copy vào đây
        ├── bien-vinh-thanh-2.jpg
        └── lang-an-bang-1.jpg
```

### Bước 4: Cập nhật code

Mở file code và thay đổi đường dẫn ảnh:

**File:** `src/app/(main)/destinations/page.tsx`

```tsx
// TÌM đoạn này:
images: [
    '/images/placeholder-beach.jpg',
],

// THAY BẰNG:
images: [
    '/images/destinations/bien-vinh-thanh-1.jpg',
    '/images/destinations/bien-vinh-thanh-2.jpg',
],
```

### Bước 5: Kiểm tra

```bash
npm run dev
```
Mở http://localhost:3000 và kiểm tra ảnh hiển thị.

---

## 🎬 THÊM VIDEO

### Bước 1: Chuẩn bị video

**Yêu cầu kỹ thuật:**
- **Định dạng:** `.mp4` (khuyến nghị), `.webm`
- **Codec:** H.264 cho .mp4
- **Kích thước:** Dưới 10MB (nén nếu cần)
- **Độ phân giải:** 720p hoặc 1080p

**Công cụ nén video:**
- https://www.freeconvert.com/video-compressor
- HandBrake (phần mềm miễn phí)

### Bước 2: Copy video vào thư mục

```
public/
└── videos/
    ├── bien-vinh-thanh.mp4    ← Copy vào đây
    └── lang-nghe-nuoc-ot.mp4
```

### Bước 3: Thêm video vào trang

**Cách 1: Video HTML5 (file local)**

```tsx
<video 
    controls 
    className="w-full rounded-xl"
    poster="/images/video-thumbnail.jpg"
>
    <source src="/videos/bien-vinh-thanh.mp4" type="video/mp4" />
    Trình duyệt không hỗ trợ video.
</video>
```

**Cách 2: Video YouTube (nhúng)**

```tsx
<iframe
    className="w-full aspect-video rounded-xl"
    src="https://www.youtube.com/embed/VIDEO_ID"
    title="Tên video"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
/>
```

Thay `VIDEO_ID` bằng ID của video YouTube (phần sau `v=` trong URL).

---

const destinations = [
    {
        id: 'bien-vinh-thanh',
        title: 'Biển Vinh Thanh',
        images: [
            '/images/destinations/bien-vinh-thanh-1.jpg',  // ← Thay ở đây
            '/images/destinations/bien-vinh-thanh-2.jpg',
        ],
        // ...
    },
];

## ✅ CHECKLIST TRƯỚC KHI HOÀN TẤT

- [ ] Ảnh đã được nén (dưới 500KB)
- [ ] Tên file không có dấu tiếng Việt
- [ ] Ảnh đã copy vào `public/images/`
- [ ] Đã cập nhật đường dẫn trong code
- [ ] Đã chạy `npm run dev` và kiểm tra hiển thị
- [ ] Đã chạy `npm run build` để kiểm tra lỗi

---

## 🔧 XỬ LÝ LỖI THƯỜNG GẶP

### Ảnh không hiển thị

**Nguyên nhân 1:** Sai đường dẫn
```tsx
// SAI
images: ['images/anh.jpg']

// ĐÚNG  
images: ['/images/anh.jpg']  // Phải có / ở đầu
```

**Nguyên nhân 2:** Tên file có dấu hoặc khoảng trắng
```
// SAI
biển vinh thanh.jpg
biển-vinh-thành.jpg

// ĐÚNG
bien-vinh-thanh.jpg
```

**Nguyên nhân 3:** File không nằm trong `public/`
```
// SAI - không hoạt động
src/images/anh.jpg

// ĐÚNG
public/images/anh.jpg  → truy cập bằng /images/anh.jpg
```

### Video không phát

**Nguyên nhân:** Codec không hỗ trợ
- Chuyển đổi sang H.264 MP4 bằng HandBrake

---

## 📚 NGUỒN ẢNH ĐỀ XUẤT

Xem chi tiết tại: [image-guide-phu-vinh.md](./docs/image-guide-phu-vinh.md)

### Nguồn chính thức:
1. Google Maps → Xem ảnh người dùng
2. Fanpage UBND xã/huyện
3. Báo Thừa Thiên Huế

### Tự chụp:
- Sử dụng điện thoại chụp tại địa điểm thực tế
- Đảm bảo chất lượng ảnh tốt, ánh sáng đủ
