from django.db import migrations

def add_product_data(apps, schema_editor):
    # 獲取 Product 模型
    Product = apps.get_model('shop', 'Product')  # 確保 'shop' 是應用名稱

    # 插入多個產品資料
    Product.objects.create(
        introduction='這是產品1的介紹',
        product_name='產品1',
        product_quantity=1,
        product_price=1.00
    )
    
    Product.objects.create(
        introduction='這是產品2的介紹',
        product_name='產品2',
        product_quantity=2,
        product_price=2.00
    )

    Product.objects.create(
        introduction='這是產品3的介紹',
        product_name='產品3',
        product_quantity=3,
        product_price=3.00
    )

    Product.objects.create(
        introduction='這是產品4的介紹',
        product_name='產品4',
        product_quantity=4,
        product_price=4.00
    )

class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_add_admin_data'),  # 確保您使用正確的依賴名稱
    ]

    operations = [
        migrations.RunPython(add_product_data),  # 執行添加產品資料的函數
    ]
