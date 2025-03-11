"""
Django settings for week8 project.

Generated by 'django-admin startproject' using Django 3.2.15.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

import environ
import os

# 初始化 django-environ
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))  # 明確指定 .env 的位置

# 設定 DEBUG，預設為 False
DEBUG = env.bool("DEBUG", default=False)

# 從 .env 讀取 SECRET_KEY
SECRET_KEY = env("SECRET_KEY")

# 設定 ALLOWED_HOSTS
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["127.0.0.1"])

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True

# ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "shop",
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS",
                                default=["http://127.0.0.1:8080"])
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS",
                                default=["http://127.0.0.1:8080"])
CORS_ALLOW_CREDENTIALS = True
# CORS_ALLOW_ALL_ORIGINS = False  # 允許所有前端訪問

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

ROOT_URLCONF = "django_backend.urls"
WSGI_APPLICATION = "django_backend.wsgi.application"

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": BASE_DIR / "db.sqlite3",
#     }
# }
DATABASES = {
    'default': {
        'ENGINE': 'mysql.connector.django',
        'NAME': env("DB_NAME", default="mydjango"),
        'USER': env("DB_USER", default="django_user"),
        'PASSWORD': env("DB_PASSWORD", default="root"),
        'HOST': env("DB_HOST", default="localhost"),
        'PORT': env("DB_PORT", default="3306"),
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
        },
    }
}
# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME":
        "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Taipei"  # 根據你的正式環境時區
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

# 靜態檔案的 URL
STATIC_URL = "/static/"

# 開發環境下，Django 會從這些資料夾提供靜態檔案
STATICFILES_DIRS = [BASE_DIR / "shop" / "static"]

# 正式環境使用 collectstatic 將所有靜態檔案收集到這裡，交由 Nginx 提供
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
