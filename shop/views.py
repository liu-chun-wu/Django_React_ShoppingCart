import json
from django.http import JsonResponse
from django.shortcuts import redirect, render, get_object_or_404
from .models import *
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import *

# 顯示首頁
def front_page(request):
    return render(request, 'front_page.html')

# 顯示所有商品的頁面
def all_products(request):
    return render(request, 'all_products.html')

# 顯示購物車頁面
def shopcart(request):
    return render(request, 'shopcart.html')

# 顯示管理員頁面
def admin_page(request):
    # 檢查是否已經登入
    if request.session.get('is_admin_logged_in'):
        return render(request, "admin.html")  # 已登入，顯示管理員頁面
    else:
        return redirect("/admin/login/")  # 未登入，重定向至登入頁面

# 管理員登入功能
def admin_login(request):
    if request.method == "POST":
        acc_name = request.POST.get("acc_name")
        password = request.POST.get("password")

        try:
            # 驗證帳號和密碼
            admin = Admin.objects.get(acc_name=acc_name, password=password)
            request.session['is_admin_logged_in'] = True  # 使用 session 紀錄登入狀態
            return redirect("/admin/")  # 登入成功，重定向至 /admin
        except Admin.DoesNotExist:
            footer_info = Footer.objects.first()
            context = {
                'footer_info': footer_info,
                "error_message": "Incorrect account name or password."
            }
            return render(request, "admin_login.html", context)  # 顯示錯誤訊息
    else:
        footer_info = Footer.objects.first()
        context = {
            'footer_info': footer_info,
        }
        return render(request, "admin_login.html", context)  # 顯示登入頁面

# 管理員登出功能
def admin_logout(request):
    request.session.flush()  # 清除 session 資訊
    return redirect('/admin/')  # 登出後重定向至登入頁面

class AdminViewSet(viewsets.ModelViewSet): 
    queryset = Admin.objects.all()  # 指定查詢集
    serializer_class = AdminSerializer  # 指定序列化器

    def create(self, request, *args, **kwargs):
        acc_name = request.data.get('acc_name')

        # 檢查帳號是否已存在
        if Admin.objects.filter(acc_name=acc_name).exists():
            return Response({"error": "帳號名稱已存在"}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)  # 調用父類的創建方法
    
class CustomerViewSet(viewsets.ModelViewSet): 
    queryset = Customer.objects.all()  # 指定查詢集
    serializer_class = CustomerSerializer  # 指定序列化器

class SellerViewSet(viewsets.ModelViewSet): 
    queryset = Seller.objects.all()  # 指定查詢集
    serializer_class = SellerSerializer  # 指定序列化器

class ProductViewSet(viewsets.ModelViewSet): 
    queryset = Product.objects.all()  # 指定查詢集
    serializer_class = ProductSerializer  # 指定序列化器

    def create(self, request, *args, **kwargs):
        product_name = request.data.get('product_name')

        # 檢查商品是否已存在
        if Product.objects.filter(product_name=product_name).exists():
            return Response({"error": "商品名稱已存在"}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)  # 調用父類的創建方法

class TradingRecordViewSet(viewsets.ModelViewSet): 
    queryset = TradingRecord.objects.all()  # 指定查詢集
    serializer_class = TradingRecordSerializer  # 指定序列化器

class FooterViewSet(viewsets.ModelViewSet): 
    queryset = Footer.objects.all()  # 指定查詢集
    serializer_class = FooterSerializer  # 指定序列化器
    

