#!/bin/bash

echo "Checking environment variables..."
echo "DB_HOST=${DB_HOST}"
echo "DB_NAME=${DB_NAME}"
echo "DB_USER=${DB_USER}"
echo "DB_PASSWORD=${DB_PASSWORD}"
echo "DB_PORT=${DB_PORT}"

# 等待資料庫啟動
echo "Waiting for database to be ready..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Database is unavailable - waiting..."
  sleep 2
done

# 啟用 Conda 環境
source /opt/conda/etc/profile.d/conda.sh
conda activate webapp

# 確保 Django DB Migrations 正確
echo "Running database migrations..."
python manage.py migrate --noinput || { echo "Migration failed!"; exit 1; }

# 收集靜態文件
echo "Collecting static files..."
python manage.py collectstatic --noinput || { echo "Collectstatic failed!"; exit 1; }

# 啟動 Gunicorn 伺服器
echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 django_backend.wsgi:application --workers 3 --timeout 120
