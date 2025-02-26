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
urlpatterns = [
    # 後台登入頁面
    path('admin/login/', admin_login, name='admin_login'),

    # 後台登出功能
    path('admin/logout/', admin_logout, name='admin_logout'),

    path('admin/check_login/', check_admin_login, name='check_admin_login'),

]

router = DefaultRouter()
router.register(r'admin/api', AdminViewSet)  # 註冊路由，這裡的 r 對應 URL 前綴
urlpatterns += router.urls  # 自動生成 CRUD 對應的路由

router = DefaultRouter()
router.register(r'product/api',ProductViewSet)  # 註冊路由，這裡的 r 對應 URL 前綴
urlpatterns += router.urls  # 自動生成 CRUD 對應的路由

router = DefaultRouter()
router.register(r'footer/api', FooterViewSet)  # 註冊路由，這裡的 r 對應 URL 前綴
urlpatterns += router.urls  # 自動生成 CRUD 對應的路由
