FROM continuumio/miniconda3:latest

# 設定環境變數，避免交互式安裝
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# 建立非 root 使用者 appuser
RUN useradd -m -s /bin/bash appuser

# 設定 Conda 環境變數（確保 `conda run` 可以運行）
ENV PATH="/opt/conda/envs/webapp/bin:$PATH"

# 切換到 appuser 之前，確保 `/entrypoint.sh` 有執行權限
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh  # 這裡還是 root 所以有權限修改

# 切換到 appuser，避免以 root 執行應用程式
USER appuser
WORKDIR /home/appuser

# 確保 `environment.yml` 先被複製，讓 Conda 安裝能利用 Docker Cache
COPY --chown=appuser:appuser ./environment.yml /home/appuser/environment.yml

# 創建 Conda 環境 webapp 並安裝 Python 依賴
RUN conda env create --name webapp -f environment.yml && conda clean -afy

# 切換到專案目錄並複製 Django 專案
WORKDIR /home/appuser/django_backend
COPY --chown=appuser:appuser . /home/appuser/django_backend

# Expose 8000 端口
EXPOSE 8000

# 使用 Entrypoint 啟動容器
ENTRYPOINT ["/entrypoint.sh"]
