# 使用 Ubuntu 作為基礎映像
FROM ubuntu:latest

# 設定環境變數，避免交互式安裝
ENV DEBIAN_FRONTEND=noninteractive

# 安裝必要工具
RUN apt-get update && apt-get install -y \
    curl bzip2 git \
    mysql-client-core-8.0 \
    ca-certificates \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 安裝 Node.js 及 npm（安裝最新版 Node.js）
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

# 建立非 root 使用者 appuser
RUN useradd -m -s /bin/bash appuser

# 切換到 appuser
USER appuser
WORKDIR /home/appuser/react_frontend

# 複製 package.json 和 package-lock.json，利用 Docker Cache 提高構建效率
COPY --chown=appuser:appuser package.json package-lock.json ./

# 安裝 npm 依賴
RUN npm install --omit=dev --no-audit --no-fund

# 複製其餘專案檔案（避免 node_modules 被複製）
COPY --chown=appuser:appuser . .

# 建置 React 專案
RUN npm run build

# 使用 `serve` 提供靜態前端文件
RUN npm install -g serve

# 容器啟動時執行 React 伺服器
CMD ["serve", "-s", "build", "-l", "8080"]
