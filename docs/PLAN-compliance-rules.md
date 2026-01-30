# Kế hoạch - Tuân thủ Quy định & Pháp luật (Việt Nam)

## Mục tiêu
Đảm bảo hệ thống ERP tuân thủ nghiêm ngặt **Chế độ Kế toán Việt Nam (VAS)** và **Nghị định 123/2020/ND-CP** về hóa đơn điện tử. Tài liệu này theo dõi các yêu cầu pháp lý cụ thể và phương pháp kiểm tra.

## 1. Chế độ Kế toán (VAS)

### Thông tư 200/2014/TT-BTC (Doanh nghiệp lớn)
Hệ thống sẽ mặc định sử dụng Hệ thống Tài khoản (HTTK) theo Thông tư 200.

- [ ] **Hệ thống Tài khoản (Chart of Accounts)**
    - **Yêu cầu**: Triển khai danh mục tài khoản chuẩn (VD: 111 - Tiền mặt, 112 - Tiền gửi ngân hàng, 131 - Phải thu, 331 - Phải trả).
    - **Kiểm tra**: Dữ liệu khởi tạo (seed) trong Database khớp với phụ lục Thông tư 200.
- [ ] **Báo cáo Tài chính**
    - **Yêu cầu**: Tự động tạo Bảng cân đối kế toán (B01-DN), Báo cáo kết quả kinh doanh (B02-DN), Lưu chuyển tiền tệ (B03-DN).
    - **Kiểm tra**: So sánh báo cáo PDF/Excel xuất ra với mẫu chuẩn của Bộ Tài chính.
- [ ] **Bút toán (Journal Entries)**
    - **Yêu cầu**: Hạch toán kép (Nợ/Có) cho tất cả các giao dịch.
    - **Kiểm tra**: Tổng Nợ == Tổng Có trong mọi giao dịch.
- [ ] **Sổ sách Kế toán**
    - **Yêu cầu**: Sổ Cái và Sổ Chi tiết.
    - **Kiểm tra**: Số dư trên sổ cái khớp với Bảng cân đối phát sinh.

### Thông tư 133/2016/TT-BTC (Lựa chọn cho DNVVN) - *Phạm vi tương lai*
- [ ] **Yêu cầu**: Cho phép chuyển đổi sang mã tài khoản theo TT133 nếu cần (VD: tài khoản kho đơn giản hơn).

## 2. Hóa đơn điện tử (Nghị định 123/2020/ND-CP & Thông tư 78/2021/TT-BTC)

### Yêu cầu Kỹ thuật
- [ ] **Định dạng XML (Quyết định 1450/QĐ-TCT)**
    - **Yêu cầu**: Dữ liệu hóa đơn phải được tạo theo cấu trúc XML quy định bởi Tổng cục Thuế.
    - **Kiểm tra**: Validate file XML đầu ra với file schema XSD chính thức (KML/KHML).
- [ ] **Chữ ký số**
    - **Yêu cầu**: Hỗ trợ ký XML bằng USB Token hoặc HSM (RSA-SHA256).
    - **Kiểm tra**: File XML đã ký vượt qua kiểm tra xác thực (sử dụng khóa công khai).
- [ ] **Mã Cơ quan thuế (Mã CQT)**
    - **Yêu cầu**: Xử lý luồng "Cấp mã" (Gửi lên CQT -> Nhận mã -> Phát hành).
    - **Kiểm tra**: Giả lập phản hồi API từ nhà cung cấp T-VAN với mã CQT giả lập.

### Luồng Tích hợp (T-VAN)
- [ ] **Provider Abstraction**
    - **Yêu cầu**: Xây dựng interface chuẩn `IEInvoiceProvider` để kết nối Viettel, VNPT, hoặc M-Invoice.
    - **Kiểm tra**: Chuyển đổi nhà cung cấp qua config mà không thay đổi logic nghiệp vụ.

## 3. Quy định Quản lý Kho

### Định giá Hàng tồn kho (VAS 02)
- [ ] **Phương pháp tính giá**
    - **Yêu cầu**: Hỗ trợ **FIFO** (Nhập trước Xuất trước) hoặc **Bình quân gia quyền**. Lưu ý: LIFO KHÔNG được phép theo VAS.
    - **Kiểm tra**: Tính Giá vốn hàng bán (COGS) thủ công và so sánh với kết quả hệ thống.
- [ ] **Thẻ kho**
    - **Yêu cầu**: Lịch sử chi tiết nhập/xuất cho từng mã hàng.
    - **Kiểm tra**: Xuất báo cáo "Thẻ kho" và đối chiếu với chứng từ gốc (Phiếu nhập/xuất).
- [ ] **Chứng từ**
    - **Yêu cầu**: Mẫu biểu chuẩn: Phiếu nhập kho (01-VT), Phiếu xuất kho (02-VT).
    - **Kiểm tra**: Mẫu in khớp với bố cục trực quan của Thông tư 200/133.

## 4. Danh sách Kiểm tra (Thủ công)

| Yêu cầu | Tham chiếu Code | Phương pháp Test | Trạng thái |
|-------------|----------|-------------|--------|
| HTTK Thông tư 200 | `seeds/coa_200.ts` | Query DB count | [ ] |
| Logic Hạch toán Kép | `modules/accounting` | Unit Test | [ ] |
| XML Schema 1450 | `modules/invoice/xml` | XSD Validator | [ ] |
| Báo cáo B01-DN | `modules/reports` | Kiểm tra hiển thị | [ ] |
| Không hỗ trợ LIFO | `modules/inventory` | Code Review | [ ] |
