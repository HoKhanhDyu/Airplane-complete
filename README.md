# AirPlane

## Yêu cầu
- [Docker](https://www.docker.com/) được cài đạt trên máy tính. (Vui lòng cài docker)

## Hướng dẫn chạy backend

1. **Clone dự án(bỏ qua nếu đã cài):** 

   Tải dự án về bằng lệnh:
   ```bash
   git clone <link-repo>
   cd <folder-dự-án>
   ```

2. **Chuyển đến thư mục `backend`:**

   ```bash
   cd backend
   ```

3. **Chạy Docker Compose:**

   Sử dụng lệnh sau để chạy các dịch vụ trong dự án:
   ```bash
   docker-compose up
   ```

   Hoặc chạy ở chế độ nền (detached mode):
   ```bash
   docker-compose up -d
   ```

4. **Kết thúc:**

   Khi muốn dừng các dịch vụ, dùng lệnh:
   ```bash
   docker-compose down
   ```

## Lỗi thường gặp
- Đảm bảo Docker đang chạy trước khi thực hiện lệnh.
- Kiểm tra lại file `docker-compose.yml` trong thư mục `backend` nếu gặp lỗi cấu hình.

---

Cảm ơn bạn đã sử dụng dự án! 🎉
