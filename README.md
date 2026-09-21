# HANKeyboard

Website bán bàn phím cơ và phụ kiện, thiết kế cho quy mô dưới 50 đơn/ngày với chi phí vận hành thấp.

## Thành phần

- `dist/`: website tĩnh để phát hành qua Cloudflare Pages.
- `source-data/products.csv`: dữ liệu sản phẩm gốc đã nhận.
- `apps-script/`: API nhận đơn và trang quản trị chạy trên Google Apps Script.
- `tools/`: công cụ tạo catalog, tạo trang, kiểm tra website và tạo workbook Google Sheets.

Website có danh mục, tìm kiếm và lọc, chi tiết sản phẩm, yêu thích, giỏ hàng, thanh toán, QR VietQR, trang cảm ơn, tra cứu đơn, bài hướng dẫn, chính sách, giới thiệu và liên hệ. Trang quản trị hỗ trợ sản phẩm, tồn kho, đơn hàng, mã giảm giá, cài đặt, ảnh Cloudinary, CSV và in phiếu A6.

## Lệnh dùng trong dự án

```bash
npm run build
npm run check
npm test
```

Không cần cài package npm. Cloudflare Pages chỉ cần Node.js 20 trở lên.

## Kiến trúc chi phí thấp

- Giao diện: HTML/CSS/JavaScript tĩnh trên Cloudflare Pages.
- Dữ liệu và đơn hàng: Google Sheets.
- API và quản trị: Google Apps Script.
- Ảnh sản phẩm: Cloudinary unsigned upload preset `HANKeyboard`.
- Thông báo: email Google và Telegram tùy chọn.
- Thanh toán: VietQR, có webhook xác nhận giao dịch tùy chọn.

Chi tiết triển khai nằm trong `DEPLOY.md`.
