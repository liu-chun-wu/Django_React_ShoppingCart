import json
from django.http import JsonResponse
from .models import *
from .serializers import *
from rest_framework import viewsets, status
from rest_framework.response import Response

 
def check_admin_login(request):
    if request.session.get('is_admin_logged_in'):
        return JsonResponse({"logged_in": True})
    else:
        return JsonResponse({"logged_in": False}, status=401)
    
def admin_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            acc_name = data.get("acc_name")
            password = data.get("password")

            # 驗證帳號和密碼
            admin = Admin.objects.get(acc_name=acc_name, password=password)
            request.session['is_admin_logged_in'] = True  # 使用 session 紀錄登入狀態
            return JsonResponse({"message": "Login successful"}, status=200)  # 登入成功
        except Admin.DoesNotExist:
            return JsonResponse({"error": "Incorrect account name or password."}, status=401)  # 錯誤的帳號或密碼
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)  # 無效的 JSON 請求
    else:
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)  # 只允許 POST 請求

def admin_logout(request):
    request.session.flush()  # 清除 session 資訊
    return JsonResponse({"message": "登出成功。"}, status=200)  # 返回成功消息

class AdminViewSet(viewsets.ModelViewSet): 
    queryset = Admin.objects.all()  # 指定查詢集
    serializer_class = AdminSerializer  # 指定序列化器

    def create(self, request, *args, **kwargs):
        acc_name = request.data.get('acc_name')

        # 檢查帳號是否已存在
        if Admin.objects.filter(acc_name=acc_name).exists():
            return Response({"error": "帳號名稱已存在"}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)  # 調用父類的創建方法

class ProductViewSet(viewsets.ModelViewSet): 
    queryset = Product.objects.all()  # 指定查詢集
    serializer_class = ProductSerializer  # 指定序列化器

    def create(self, request, *args, **kwargs):
        product_name = request.data.get('product_name')

        # 檢查商品是否已存在
        if Product.objects.filter(product_name=product_name).exists():
            return Response({"error": "商品名稱已存在"}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)  # 調用父類的創建方法

class FooterViewSet(viewsets.ModelViewSet): 
    queryset = Footer.objects.all()  # 指定查詢集
    serializer_class = FooterSerializer  # 指定序列化器
    

