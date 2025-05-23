FROM node:20-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json，利用 Docker Cache 提高構建效率
COPY package.json package-lock.json ./

# 安裝 npm 依賴（確保 devDependencies 也安裝，因為 Vite 是 dev 依賴）
RUN npm install --no-audit --no-fund

# 定義 ARG 變數（用來接收 `docker build --build-arg` 傳遞的變數）
ARG VITE_API_URL_BACKEND
ARG VITE_API_URL_PRODUCT
ARG VITE_API_URL_ADMIN
ARG VITE_API_URL_FOOTER
ARG VITE_API_URL_ADMIN_CHECKLOGIN
ARG VITE_API_URL_ADMIN_LOGIN
ARG VITE_API_URL_ADMIN_LOGOUT

# 讓 Vite 讀取 ARG 變數（建立 `.env.production`）
RUN echo "VITE_API_URL_BACKEND=${VITE_API_URL_BACKEND}" > .env.production && \
    echo "VITE_API_URL_PRODUCT=${VITE_API_URL_PRODUCT}" >> .env.production && \
    echo "VITE_API_URL_ADMIN=${VITE_API_URL_ADMIN}" >> .env.production && \
    echo "VITE_API_URL_FOOTER=${VITE_API_URL_FOOTER}" >> .env.production && \
    echo "VITE_API_URL_ADMIN_CHECKLOGIN=${VITE_API_URL_ADMIN_CHECKLOGIN}" >> .env.production && \
    echo "VITE_API_URL_ADMIN_LOGIN=${VITE_API_URL_ADMIN_LOGIN}" >> .env.production && \
    echo "VITE_API_URL_ADMIN_LOGOUT=${VITE_API_URL_ADMIN_LOGOUT}" >> .env.production

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
COPY --from=builder /app/dist .  
# 確保 `dist/` 被複製

# 複製自訂的 Nginx 設定（確保 React 路由工作）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 開放 80 端口（HTTP）
EXPOSE 8080

# 啟動 Nginx 伺服器
CMD ["nginx", "-g", "daemon off;"]
