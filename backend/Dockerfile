# 使用 Miniconda 官方映像，避免手動安裝
FROM continuumio/miniconda3:latest

# 設定環境變數，避免交互式安裝
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# 建立非 root 使用者 appuser
RUN useradd -m -s /bin/bash appuser

# 切換到 appuser
USER appuser
WORKDIR /home/appuser

# 確保 `environment.yml` 先被複製，讓 Conda 安裝能利用 Docker Cache
COPY --chown=appuser:appuser ./environment.yml /home/appuser/environment.yml

# 創建 Conda 環境 webapp 並安裝 Python
RUN conda env create --name webapp -f environment.yml && conda clean -afy

# 設定 Conda 環境變數（確保 `conda run` 可以運行）
ENV PATH="/home/appuser/miniconda/bin:$PATH"

# 切換到專案目錄並複製 Django 專案
WORKDIR /home/appuser/django_backend
COPY --chown=appuser:appuser . /home/appuser/django_backend

# 確保 migrations 正確
RUN conda run -n webapp python manage.py migrate

# 收集靜態文件（正式環境通常會有 Nginx 提供靜態文件）
RUN conda run -n webapp python manage.py collectstatic --noinput

# Expose 8000 端口
EXPOSE 8000

# 使用 Gunicorn 運行 Django 伺服器（適合正式環境）
CMD ["conda", "run", "-n", "webapp", "gunicorn", "--bind", "0.0.0.0:8000", "django_backend.wsgi:application"]
