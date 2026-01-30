# BÁO CÁO BÀI TẬP LỚN - NGHIÊN CỨU TỐT NGHIỆP 2 (GR2)

**Đề tài:** Xây dựng hệ thống ERP và Quản lý Kho tuân thủ các quy định Kế toán và Hóa đơn điện tử tại Việt Nam.

**(ERP and Inventory Management System strictly adhering to VAS and Decree 123/2020/ND-CP)**

---

## MỤC LỤC

1. [Mở đầu](#mở-đầu)
2. [Cơ sở lý thuyết và Pháp lý](#cơ-sở-lý-thuyết-và-pháp-lý)
3. [Phân tích và Thiết kế hệ thống](#phân-tích-và-thiết-kế-hệ-thống)
4. [Triển khai](#triển-khai)
5. [Kết quả và Đánh giá](#kết-quả-và-đánh-giá)
6. [Kết luận](#kết-luận)

---

## 1. MỞ ĐẦU

### 1.1. Đặt vấn đề
Trong bối cảnh chuyển đổi số mạnh mẽ tại Việt Nam, các doanh nghiệp vừa và nhỏ (SME) đang đối mặt với thách thức lớn trong việc quản lý tài nguyên (ERP) và tuân thủ các quy định pháp luật ngày càng chặt chẽ, đặc biệt là Nghị định 123/2020/ND-CP về hóa đơn điện tử và Thông tư 200/2014/TT-BTC về chế độ kế toán.

Đa số các giải pháp ERP nước ngoài (SAP, Oracle) có chi phí cao và chưa tối ưu cho quy định Việt Nam. Các giải pháp trong nước thường thiếu tính linh hoạt hoặc công nghệ cũ. Đề tài này tập trung xây dựng một hệ thống ERP hiện đại, sử dụng công nghệ mới nhất (Next.js, NestJS), nhưng được thiết kế cốt lõi (Domain-Driven Design) để tuân thủ chặt chẽ pháp luật Việt Nam.

### 1.2. Mục tiêu đề tài
- Xây dựng hệ thống quản lý kho (Inventory) và kế toán cơ bản.
- Đảm bảo tuân thủ Chế độ kế toán doanh nghiệp (Thông tư 200).
- Tích hợp phát hành hóa đơn điện tử theo chuẩn Nghị định 123.
- Trực quan hóa dữ liệu kho bằng công nghệ 3D.

---

## 2. CƠ SỞ LÝ THUYẾT VÀ PHÁP LÝ

### 2.1. Quy định pháp luật Việt Nam
#### 2.1.1. Chế độ kế toán (Thông tư 200/2014/TT-BTC)
- Hệ thống tài khoản kế toán (Chart of Accounts).
- Nguyên tắc ghi nhận doanh thu, chi phí.
- Phương pháp tính giá hàng tồn kho: FIFO (Nhập trước xuất trước) hoặc Bình quân gia quyền.

#### 2.1.2. Hóa đơn điện tử (Nghị định 123/2020/ND-CP)
- Định dạng dữ liệu XML theo Quyết định 1450/QĐ-TCT.
- Quy trình cấp mã cơ quan thuế.
- Yêu cầu về chữ ký số và bảo mật dữ liệu.

### 2.2. Công nghệ sử dụng
- **Frontend**: Next.js, React, TailwindCSS, Three.js (3D Visualization).
- **Backend**: NestJS (Node.js framework), Prisma ORM.
- **Database**: PostgreSQL.
- **Microservices/Monorepo**: Turborepo, Docker.

---

## 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 3.1. Kiến trúc hệ thống
Sử dụng kiến trúc Clean Architecture kết hợp Modular Monolith.
- **Domain Layer**: Chứa business rules (Logic kế toán, Logic kho).
- **Application Layer**: Use cases (Tạo đơn hàng, Xuất kho).
- **Infrastructure Layer**: Database, External APIs (T-VAN, VNPT, Viettel).

### 3.2. Mô hình dữ liệu (Database Schema)
*(Trình bày sơ đồ ERD tại đây)*
- Bảng `Product`, `Warehouse`, `Stock`.
- Bảng `Account` (Tài khoản kế toán), `JournalEntry` (Bút toán).
- Bảng `Invoice`, `InvoiceLine` (Lưu trữ XML hóa đơn).

---

## 4. TRIỂN KHAI

### 4.1. Module Quản lý Kho
- Chức năng nhập/xuất kho theo lô (Batch management).
- Tính giá vốn hàng bán tự động.

### 4.2. Module Kế toán
- Tự động hạch toán (Auto-posting) từ các nghiệp vụ kho.
- Ví dụ: Khi xuất kho bán hàng -> Nợ 632 / Có 156.

### 4.3. Tích hợp Hóa đơn điện tử
- Xây dựng Adapter Pattern để kết nối đa nhà cung cấp (VNPT, Viettel).
- Quy trình ký số và gửi lên cơ quan thuế.

---

## 5. KẾT QUẢ VÀ ĐÁNH GIÁ

### 5.1. Kết quả đạt được
- Hệ thống hoạt động ổn định trên môi trường Docker.
- Xuất được các báo cáo tài chính cơ bản (B01-DN, B02-DN).
- Demo quy trình xuất hóa đơn điện tử thành công.

### 5.2. Đánh giá tuân thủ
- So sánh kết quả tính toán của hệ thống với Excel thủ công.
- Kiểm tra tính hợp lệ của file XML hóa đơn bằng công cụ của Tổng cục Thuế.

---

## 6. KẾT LUẬN

### 6.1. Ưu điểm
- Công nghệ hiện đại, hiệu năng cao.
- Tuân thủ chặt chẽ quy định Việt Nam.

### 6.2. Hạn chế và Hướng phát triển
- Cần bổ sung module Nhân sự - Tiền lương.
- Phát triển Mobile App cho thủ kho.

---

## TÀI LIỆU THAM KHẢO

[1] Bộ Tài chính (2014), *Thông tư 200/2014/TT-BTC hướng dẫn Chế độ kế toán Doanh nghiệp*.
[2] Chính phủ (2020), *Nghị định 123/2020/ND-CP quy định về hóa đơn, chứng từ*.
[3] Tổng cục Thuế (2021), *Quyết định 1450/QĐ-TCT về thành phần dữ liệu hóa đơn điện tử*.
