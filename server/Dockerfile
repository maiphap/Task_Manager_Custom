# Sử dụng Node.js bản 16 hoặc 18 (Railway hỗ trợ tốt)
FROM node:18-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install --production

# Sao chép toàn bộ mã nguồn server
COPY . .

# Railway sẽ tự động cung cấp biến PORT, nhưng mặc định là 3001
ENV PORT=3001

# Mở cổng 3001
EXPOSE 3001

# Lệnh chạy ứng dụng
CMD ["node", "server.js"]
