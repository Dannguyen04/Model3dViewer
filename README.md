# Bộ Sưu Tập Nhân Vật — Character Showcase

Ứng dụng web trưng bày bộ sưu tập nhân vật: lưới thẻ bài → hồ sơ chi tiết →
xem mô hình **3D** và đặt vào không gian thật bằng **AR (WebXR)**.

Xây trên **React 19 + Vite + [react-three-fiber](https://r3f.docs.pmnd.rs/)**.

## Tính năng

- **Showcase**: lưới thẻ bài với hiệu ứng nghiêng 3D (parallax) theo con trỏ.
- **Lọc & tìm kiếm**: lọc theo deck + ô tìm theo tên/tagline (phím `/` để focus).
- **Hồ sơ nhân vật**: chỉ số, tiểu sử, ghi chú, màu accent theo từng deck.
- **Xem 3D/AR**: xoay/zoom mô hình, tự phát animation nếu model có, đặt lên mặt
  phẳng thật qua hit-test WebXR, và **chụp ảnh** mô hình xuất PNG.
- **Điều hướng bằng URL** (hash): deep-link được, nút Back trình duyệt hoạt động,
  `Esc` để quay lại một bậc.

## Chạy dự án

```bash
npm install
npm run dev       # chạy dev server (HTTPS tự ký để test WebXR trên điện thoại)
npm run build     # build production vào dist/
npm run preview   # xem thử bản build
npm run lint      # kiểm tra ESLint
npm run format    # định dạng bằng Prettier
```

> WebXR (kể cả trên điện thoại thật) **bắt buộc HTTPS**. Dev server dùng
> `@vitejs/plugin-basic-ssl` + `host: true` để điện thoại cùng Wi-Fi truy cập
> qua IP LAN của máy.

## Cấu trúc

```
src/
  data.js           # Dữ liệu nhân vật (DECKS, IMAGE_FILES, MODELS, PROFILES…)
  App.jsx           # UI + 3 trang: Showcase / Hồ sơ / Xem 3D
  ErrorBoundary.jsx # Bắt lỗi tải model 3D, hiện fallback thay vì sập app
  useHashRoute.js   # Điều hướng bằng hash URL
  App.css           # Toàn bộ style
  palette.css       # Bảng màu thương hiệu (6 deck)
public/
  *.glb                 # Mô hình 3D
  character_image/*.webp # Ảnh 2D nhân vật
```

## Thêm nội dung

Sửa trong [`src/data.js`](src/data.js):

- **Thêm nhân vật**: thêm ảnh vào `public/character_image/` (đủ tên trong
  `IMAGE_FILES`).
- **Thêm thông tin thật**: thêm entry vào `PROFILES` (key = tên file ảnh).
- **Thêm mô hình 3D**: đặt file `.glb` vào `public/` và thêm entry vào `MODELS`.
  Nhân vật chưa có model sẽ tự ẩn nút "3D View".

## Hiệu năng

- Mô hình `.glb` được **preload lười**: chỉ tải khi rê chuột vào thẻ / vào hồ sơ,
  phần còn lại tải khi trình duyệt rảnh (`requestIdleCallback`) — không tải toàn
  bộ ~35MB ngay khi mở trang.
- Clone mô hình bằng `<Clone>` của drei để giữ đúng skeleton của model có xương.
