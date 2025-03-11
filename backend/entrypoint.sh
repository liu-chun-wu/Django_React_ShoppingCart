#!/bin/bash

echo "Checking if .env exists..."
if [ -f "/home/appuser/django_backend/.env" ]; then
    echo " Loading environment variables from .env"
    export $(grep -v '^#' /home/appuser/django_backend/.env | xargs)
else
    echo "WARNING: .env file not found! Some settings may be missing."
fi

# 確保 Django DB Migrations 正確
echo "Running database migrations..."
conda run -n webapp python manage.py migrate --noinput

# 收集靜態文件
echo "Collecting static files..."
conda run -n webapp python manage.py collectstatic --noinput

# 啟動 Gunicorn 伺服器
echo "Starting Gunicorn..."
exec conda run -n webapp gunicorn --bind 0.0.0.0:8000 django_backend.wsgi:application
