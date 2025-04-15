#!/bin/bash

echo "Checking environment variables..."

# 要檢查的環境變數清單
REQUIRED_VARS=("DB_HOST" "DB_NAME" "DB_USER" "DB_PASSWORD" "DB_PORT")

# 檢查是否有遺漏的變數
MISSING_VARS=()
for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    MISSING_VARS+=("$VAR")
  fi
done

# 如果有任何變數未設定，就結束並報錯
if [ ${#MISSING_VARS[@]} -ne 0 ]; then
  echo "ERROR: Missing required environment variables:"
  for VAR in "${MISSING_VARS[@]}"; do
    echo "  - $VAR"
  done
  exit 1
fi

echo "Environment variables loaded successfully."

# 等待資料庫啟動
echo "Waiting for database to be ready at ${DB_HOST}:${DB_PORT}..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "  Database is unavailable - waiting..."
  sleep 2
done
echo "Database is ready."

# 啟用 Conda 環境
echo "Activating Conda environment..."
source /opt/conda/etc/profile.d/conda.sh
conda activate webapp || { echo "FAILED: Could not activate Conda environment."; exit 1; }
echo "Conda environment activated successfully."

# 執行 Django DB Migrations
echo "Running database migrations..."
python manage.py migrate --noinput \
  && echo "Migrations completed successfully." \
  || { echo "FAILED: Migration failed."; exit 1; }

# 收集靜態檔案
echo "Collecting static files..."
python manage.py collectstatic --noinput \
  && echo "Static files collected successfully." \
  || { echo "FAILED: Collectstatic failed."; exit 1; }

# 啟動 Gunicorn
echo "Starting Gunicorn on port 8000..."
exec gunicorn --bind 0.0.0.0:8000 django_backend.wsgi:application --workers 3 --timeout 120
