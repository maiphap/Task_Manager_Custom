# Bước 1: Build ứng dụng React
FROM node:18-slim as build-stage

WORKDIR /app

# Sao chép tệp dependencies
COPY package*.json ./

# Cần dùng --legacy-peer-deps do xung đột giữa React 17 và các thư viện cũ
# Thiết lập biến môi trường NODE_OPTIONS để tương thích với OpenSSL cũ (nếu cần)
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm install --legacy-peer-deps

# Sao chép mã nguồn và build
COPY . .
RUN npm run build

# Bước 2: Phục vụ tệp tĩnh bằng Nginx
FROM nginx:stable-alpine

# Sao chép bản build vào thư mục của Nginx
COPY --from=build-stage /app/build /usr/share/nginx/html

# Cấu hình Nginx để hỗ trợ React Router (SPA)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
