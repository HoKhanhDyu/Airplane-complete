FROM python:3.11

WORKDIR /backend

# Cài đặt mysql-client
RUN apt-get update && apt-get install -y default-mysql-client

COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt
RUN pip install --upgrade fastapi-mail

COPY ./ ./

ENV PYTHONPATH=/backend

COPY entrypoint.sh /entrypoint.sh

# Đảm bảo script có quyền thực thi
RUN chmod +x /entrypoint.sh

# Xóa ký tự \r trong file entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh

# Thiết lập script entrypoint để chạy khi container khởi động
ENTRYPOINT ["/entrypoint.sh"]