#!/bin/sh


echo "Waiting for MySQL to be ready..."

# Kiểm tra trạng thái của MySQL, thử lại nếu thất bại
until mysqladmin ping -h "mysql" --silent; do
  echo "MySQL is unavailable - waiting..."
  sleep 5
done

echo "MySQL is ready!"

echo "Running backend"

# Đường dẫn đến file đánh dấu
MIGRATION_FLAG="/backend/migrations/.migration_flag"
# Kiểm tra xem file đánh dấu đã tồn tại hay chưa
if [ ! -f "$MIGRATION_FLAG" ]; then
  # Nếu không tồn tại, chạy các lệnh ban đầu
  echo "Running initial migrations and database setup..."

  # Chạy các lệnh Alembic để tạo và áp dụng migration
  alembic revision --autogenerate -m 'initial migration'
  alembic upgrade head

  # Tạo file đánh dấu để ghi nhớ lần chạy đầu tiên
  touch "$MIGRATION_FLAG"

  echo "Create table done!"

fi

echo "Starting FastAPI server"

# Chạy FastAPI
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --ssl-keyfile=127.0.0.1-key.pem --ssl-certfile=127.0.0.1.pem