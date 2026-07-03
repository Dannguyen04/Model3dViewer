import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// WebXR (kể cả trên điện thoại thật) BẮT BUỘC chạy trên HTTPS.
// plugin-basic-ssl tạo chứng chỉ tự ký để test trên LAN.
// host: true -> mở trên IP của máy để điện thoại cùng wifi truy cập được.
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: { host: true },
})
