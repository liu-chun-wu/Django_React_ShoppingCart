# 第一階段：使用輕量 Node.js 建構 React 應用
FROM node:20-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json，利用 Docker Cache 提高構建效率
COPY package.json package-lock.json ./

# 安裝 npm 依賴
RUN npm install --omit=dev --no-audit --no-fund

# 複製其餘專案檔案（避免 node_modules 被複製）
COPY . .

# 建置 React 應用
RUN npm run build

# 第二階段：使用 Nginx 提供靜態前端檔案
FROM nginx:alpine

# 設定工作目錄
WORKDIR /usr/share/nginx/html

# 清除預設的 Nginx 靜態文件
RUN rm -rf ./*

# 從第一階段複製 React build 檔案
COPY --from=builder /app/build .

# 複製自訂的 Nginx 設定（確保 React 路由工作）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 開放 80 端口（HTTP）
EXPOSE 80

# 啟動 Nginx 伺服器
CMD ["nginx", "-g", "daemon off;"]
