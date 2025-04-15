"""week8 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path  # 引入 path 函數來定義路由
from shop.views import *  # 匯入我們自定義的視圖模組，以便在路由中調用
from rest_framework.routers import DefaultRouter
import os
from dotenv import load_dotenv
# 載入 .env
load_dotenv()

# ✅ 環境變數檢查：必要變數若不存在則 raise error
required_env_vars = [
    'BACKEND_API_URL_ADMIN_LOGIN',
    'BACKEND_API_URL_ADMIN_LOGOUT',
    'BACKEND_API_URL_ADMIN_CHECKLOGIN'
]

missing_vars = [var for var in required_env_vars if os.getenv(var) is None]

if missing_vars:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

urlpatterns = [
    # 後台登入頁面
    path(os.getenv('BACKEND_API_URL_ADMIN_LOGIN'), admin_login, name='admin_login'),

    # 後台登出功能
    path(os.getenv('BACKEND_API_URL_ADMIN_LOGOUT'), admin_logout, name='admin_logout'),
    path(os.getenv('BACKEND_API_URL_ADMIN_CHECKLOGIN'), check_admin_login, name='check_admin_login'),
]

router = DefaultRouter()
router.register(r'admin', AdminViewSet)  # 註冊路由，這裡的 r 對應 URL 前綴
urlpatterns += router.urls  # 自動生成 CRUD 對應的路由

router = DefaultRouter()
router.register(r'product', ProductViewSet)  # 註冊路由，這裡的 r 對應 URL 前綴
urlpatterns += router.urls  # 自動生成 CRUD 對應的路由

router = DefaultRouter()
router.register(r'footer', FooterViewSet)  # 註冊路由，這裡的 r 對應 URL 前綴
urlpatterns += router.urls  # 自動生成 CRUD 對應的路由
