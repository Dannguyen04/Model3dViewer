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
npm run build-qrcode  # tạo ảnh QR code cho trang chủ và từng nhân vật
npm run optimize-models  # nén lại .glb trong public/ (xem "Tối ưu model 3D")
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
  *.glb                 # Mô hình 3D (đã nén — xem "Tối ưu model 3D")
  env/*.hdr             # Map ánh sáng cho Environment (tự host, không dùng CDN)
  character_image/*.webp # Ảnh 2D nhân vật
  qrcodes/*.png          # QR code (tạo bằng build-qrcode)
_model_backup_orig/     # Bản .glb GỐC trước khi nén (gitignore, đừng xoá)
```

## Tạo QR code (`build-qrcode`)

Script [`scripts/create-qrcode.js`](scripts/create-qrcode.js) sinh ảnh QR trỏ tới
bản deploy production, dùng để in hoặc dán lên thẻ vật lý.

### Chạy script

```bash
npm run build-qrcode
```

Ảnh PNG được ghi vào `public/qrcodes/` (500×500 px, margin 2).

### File sinh ra

| File                | URL mã hóa                                                     |
| ------------------- | -------------------------------------------------------------- |
| `home.png`          | Trang chủ — `https://modelgameviewer.vercel.app/`              |
| `c0.png` … `cN.png` | Hồ sơ nhân vật — `https://modelgameviewer.vercel.app/#/c/c{i}` |

Số lượng `c*.png` lấy từ `characterCount` trong [`src/data.json`](src/data.json)
(hiện tại: 20 file, `c0`–`c19`).

### Khi nào cần chạy lại

- Thêm hoặc bớt nhân vật → cập nhật `characterCount` trong `data.json`, rồi chạy lại.
- Đổi domain deploy → sửa hằng `BASE_URL` trong `scripts/create-qrcode.js`,
  rồi chạy lại để QR trỏ đúng URL mới.

> Script **không** chạy tự động khi `npm run build`. Chạy thủ công khi cần cập
> nhật QR.

## Thêm nội dung

Sửa trong [`src/data.js`](src/data.js):

- **Thêm nhân vật**: thêm ảnh vào `public/character_image/` (đủ tên trong
  `IMAGE_FILES`).
- **Thêm thông tin thật**: thêm entry vào `PROFILES` (key = tên file ảnh).
- **Thêm mô hình 3D**: đặt file `.glb` vào `public/`, thêm entry vào `MODELS`, rồi
  **chạy `npm run optimize-models`**. Nhân vật chưa có model sẽ tự ẩn nút "3D View".

## Tối ưu model 3D (`optimize-models`)

Model gốc là bản scan: ~2 triệu tam giác, texture PNG 4096, không có animation —
**775MB cho 20 file**. Ở cỡ hiển thị thật (canvas ~600–900px) mắt thường không
phân biệt được 2M với 300k tam giác, vì chi tiết nằm ở texture chứ không ở lưới.

[`scripts/optimize-models.js`](scripts/optimize-models.js) chạy pipeline
`weld → simplify (300k tris) → texture WebP 2048 → quantize → nén meshopt`:

| Chỉ số              | Trước      | Sau              |
| ------------------- | ---------- | ---------------- |
| Tổng `public/*.glb` | 775 MB     | **38 MB** (−94%) |
| Mỗi model           | 1.7–85 MB  | 1.7–2.1 MB       |
| Tam giác            | ~2.000.000 | 300.000          |

```bash
npm run optimize-models          # ghi đè public/*.glb
node scripts/optimize-models.js --dry   # chỉ in bảng, không ghi file
```

> Lần chạy đầu copy bản gốc sang `_model_backup_orig/` (đã gitignore). Các lần sau
> **luôn đọc lại từ bản gốc đó**, nên chạy lại bao nhiêu lần cũng không bị nén
> chồng (nén chồng = giảm lưới hai lần, hỏng chất lượng). **Đừng xoá thư mục này** —
> mất nó là mất luôn đường lùi. Chỉnh `TARGET_TRIS` trong script nếu muốn lưới
> dày/mỏng hơn.

## Hiệu năng

- **Chỉ tải model khi cần**: model `.glb` chỉ tải khi rê chuột vào thẻ hoặc mở hồ
  sơ nhân vật. Trang showcase tải **0 byte** model.
- **Cache LRU 3 model**: model cũ bị đẩy ra khỏi cache thì `dispose()` luôn
  geometry + texture. Không có bước này, xem lần lượt 20 nhân vật sẽ ngốn hết
  VRAM và trình duyệt trên điện thoại kill tab.
- **Chặn trần `dpr` ở 2**: điện thoại có `devicePixelRatio` 3–4 sẽ render gấp
  9–16 lần số pixel cần thiết mà nhìn gần như không khác.
- **Map ánh sáng tự host** (`public/env/`): `<Environment preset="city">` của drei
  tải HDR từ `raw.githack.com` — CDN bên thứ ba, không có SLA, mà lại nằm ngoài
  `<Suspense>` nên nó chậm là cả canvas treo.
- Clone mô hình bằng `<Clone>` của drei để giữ đúng skeleton của model có xương.
