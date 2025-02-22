FROM ubuntu:latest

# 設定環境變數，避免交互式安裝
ENV DEBIAN_FRONTEND=noninteractive

# 安裝必要工具
RUN apt-get update && apt-get install -y curl bzip2 git && rm -rf /var/lib/apt/lists/*

# 設定 root 密碼為 root
RUN echo "root:root" | chpasswd

# 建立非 root 使用者 appuser
RUN useradd -m -s /bin/bash appuser && echo "appuser:appuser" | chpasswd

# 切換到 appuser
USER appuser
WORKDIR /home/appuser

# 下載並安裝 Miniconda
RUN curl -fsSL https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -o miniconda.sh \
    && bash miniconda.sh -b -p /home/appuser/miniconda \
    && rm miniconda.sh

# 設定 Conda 環境變數
ENV PATH="/home/appuser/miniconda/bin:$PATH"

# 初始化 Conda 讓 base 環境自動啟用
RUN conda init bash

# 確保 Conda 設定已生效
SHELL ["/bin/bash", "-c"]

# 複製 Django 專案到容器中
COPY --chown=appuser:appuser . /home/appuser/Django_ShoppingCart_v3_React

# 確保 `environment.yml` 也被複製
COPY --chown=appuser:appuser ./environment.yml /home/appuser/Django_ShoppingCart_v3_React/environment.yml

WORKDIR /home/appuser/Django_ShoppingCart_v3_React

# 創建 Conda 環境 webapp 並安裝 Python
RUN conda env create --name webapp -f environment.yml && conda clean -afy

# 預設啟動時進入 webapp 環境
RUN echo "conda activate webapp" >> /home/appuser/.bashrc

# 設定容器啟動時自動載入 webapp 環境
CMD ["bash", "-i"]
