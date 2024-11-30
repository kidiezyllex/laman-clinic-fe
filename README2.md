# Đặc tả Use Case: Quản lý hồ sơ

## Tên use case: Quản lý hồ sơ

## Actor: Bệnh nhân

## Mô tả sơ lược: Bệnh nhân có thể tạo, cập nhật hoặc xoá hồ sơ bệnh nhân của mình.

## Tiền điều kiện (Precondition): Đã đăng nhập thành công với vai trò là bệnh nhân.

## Hậu điều kiện (Postcondition): Hồ sơ của bệnh nhân được tạo, cập nhật hoặc xoá theo tuỳ chọn của bệnh nhân.

## Luồng sự kiện chính (Basic flow)

| Bước | Actor (Người dùng)                                                   | System (Hệ thống)                                        |
| ---- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| 1    | Chọn "Hồ sơ bệnh nhân" trên menu ở giao diện Dashboard của bệnh nhân |                                                          |
| 2    |                                                                      | Kiểm tra xem bệnh nhân đã có hồ sơ hay chưa              |
| 3    |                                                                      | Hiển thị giao diện "Tạo hồ sơ"                           |
| 4    | Điền thông tin đầy đủ vào form tạo hồ sơ                             |                                                          |
| 5    | Nhấn chọn "Tạo hồ sơ"                                                |                                                          |
| 6    |                                                                      | Lưu thông tin hồ sơ vào cơ sở dữ liệu                    |
| 7    |                                                                      | Hiển thị thông báo "Đã tạo hồ sơ thành công!"            |
| 8    |                                                                      | Chuyển đến giao diện hiển thị chi tiết "Hồ sơ bệnh nhân" |

## Luồng sự kiện thay thế (Alternate flow)

### A1: Cập nhật hồ sơ

| Bước | Actor (Người dùng)          | System (Hệ thống)                                  |
| ---- | --------------------------- | -------------------------------------------------- |
| 2a   |                             | Phát hiện bệnh nhân đã có hồ sơ                    |
| 3a   |                             | Hiển thị thông tin chi tiết của hồ sơ bệnh nhân    |
| 4a   | Chọn "Cập nhật"             |                                                    |
| 5a   |                             | Hiển thị Form Cập nhật Hồ sơ bệnh nhân             |
| 6a   | Điền thông tin cần cập nhật |                                                    |
| 7a   | Nhấn nút "Cập nhật hồ sơ"   |                                                    |
| 8a   |                             | Lưu thông tin cập nhật vào cơ sở dữ liệu           |
| 9a   |                             | Hiển thị thông báo "Đã cập nhật hồ sơ thành công!" |

### A2: Xoá hồ sơ

| Bước | Actor (Người dùng)                   | System (Hệ thống)                               |
| ---- | ------------------------------------ | ----------------------------------------------- |
| 2b   |                                      | Phát hiện bệnh nhân đã có hồ sơ                 |
| 3b   |                                      | Hiển thị thông tin chi tiết của hồ sơ bệnh nhân |
| 4b   | Chọn "Xoá"                           |                                                 |
| 5b   |                                      | Hiển thị Dialog "Xác nhận xoá"                  |
| 6b   | Nhấn chọn "Xác nhận xoá" trên Dialog |                                                 |
| 7b   |                                      | Xoá hồ sơ khỏi cơ sở dữ liệu                    |
| 8b   |                                      | Hiển thị thông báo "Đã xoá hồ sơ thành công"    |
| 9b   |                                      | Chuyển đến giao diện "Tạo hồ sơ"                |

## Luồng sự kiện ngoại lệ (Exception flow)

### E1: Thông tin không hợp lệ khi tạo hoặc cập nhật hồ sơ

| Bước                                        | Actor (Người dùng)                                                    | System (Hệ thống)                                                 |
| ------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 5e (Basic flow) hoặc 7a (Alternate flow A1) | Nhấn nút "Tạo hồ sơ" hoặc "Cập nhật hồ sơ" với thông tin không hợp lệ |                                                                   |
| 6e                                          |                                                                       | Kiểm tra tính hợp lệ của thông tin                                |
| 7e                                          |                                                                       | Hiển thị thông báo lỗi và yêu cầu nhập lại thông tin không hợp lệ |
| 8e                                          | Sửa thông tin không hợp lệ                                            |                                                                   |
| 9e                                          |                                                                       | Quay lại bước 5 (Basic flow) hoặc bước 7a (Alternate flow A1)     |

### E2: Lỗi kết nối cơ sở dữ liệu

| Bước                                                                    | Actor (Người dùng)           | System (Hệ thống)                                                                   |
| ----------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| 6e (Basic flow) hoặc 8a (Alternate flow A1) hoặc 7b (Alternate flow A2) |                              | Gặp lỗi khi kết nối với cơ sở dữ liệu                                               |
| 7e                                                                      |                              | Hiển thị thông báo lỗi "Không thể kết nối với cơ sở dữ liệu. Vui lòng thử lại sau." |
| 8e                                                                      | Nhấn "OK" trên thông báo lỗi |                                                                                     |
| 9e                                                                      |                              | Quay lại giao diện trước đó                                                         |
