import { useState, useEffect } from "react";
import styles from "./AllProducts.module.css";

function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl_product = import.meta.env.VITE_API_URL_PRODUCT;

    // 載入產品資料
    useEffect(() => {
        fetch(apiUrl_product)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => console.error('Error loading products:', error));
    }, []);

    // 加入購物車函數
    function addToCart(id, name, introduction, availableQuantity, price, selectedQuantity) {
        selectedQuantity = parseInt(selectedQuantity);

        // 取得當前購物車中的商品列表
        const existingProducts = getCookie("selectedProducts") || [];
        const existingProductIndex = existingProducts.findIndex(product => product.name === name);

        // 計算商品在購物車中的總數量（當前選擇數量 + 已存在的數量）
        let totalQuantityInCart = selectedQuantity;
        if (existingProductIndex !== -1) {
            totalQuantityInCart += parseInt(existingProducts[existingProductIndex].quantity);
        }

        // 檢查選擇的數量是否超過庫存
        if (totalQuantityInCart > availableQuantity) {
            alert(`您選擇的數量 (${selectedQuantity}) 加上已在購物車中的數量 (${existingProducts[existingProductIndex] ? existingProducts[existingProductIndex].quantity : 0}) 超過庫存數量 (${availableQuantity})！`);
            return;
        }

        // 如果商品已存在於購物車中，則更新數量；否則新增商品至購物車
        if (existingProductIndex !== -1) {
            existingProducts[existingProductIndex].quantity = totalQuantityInCart;
        } else {
            const productInfo = {
                id: id,
                name: name,
                introduction: introduction,
                quantity: selectedQuantity,
                price: price,
                availableQuantity: availableQuantity
            };
            existingProducts.push(productInfo);
        }

        // 將購物車商品資訊儲存至 cookie
        document.cookie = `selectedProducts=${JSON.stringify(existingProducts)}; path=/;`;
        alert(`商品 "${name}" 已經被選中，總數量為 ${totalQuantityInCart} ，已儲存到購物車中！`);
    }

    // 從 cookie 中取得指定名稱的值
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop().split(';').shift();
            try {
                return JSON.parse(cookieValue);
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    if (loading) {
        return <div>載入中...</div>;
    }

    return (
        <main>
            <div id="product-list" className={styles.product_list}>
                {products.map(product => {
                    if (product.product_quantity > 0) {
                        return (
                            <div key={product.id} className={styles.product_item}>
                                <h2>{product.product_name}</h2>
                                <p><strong>介紹:</strong> {product.introduction}</p>
                                <p><strong>數量:</strong> {product.product_quantity}</p>
                                <p><strong>價格:</strong> ${product.product_price}</p>

                                {/* 用戶選擇購買的數量 */}
                                <label htmlFor={`quantity_${product.id}`}>選擇數量:</label>
                                <input
                                    type="number"
                                    id={`quantity_${product.id}`}
                                    min="1"
                                    max={product.product_quantity}
                                    defaultValue="1"
                                />

                                {/* 加入購物車按鈕 */}
                                <button
                                    className={styles.button}
                                    onClick={() =>
                                        addToCart(
                                            product.id,
                                            product.product_name,
                                            product.introduction,
                                            product.product_quantity,
                                            product.product_price,
                                            document.getElementById(`quantity_${product.id}`).value
                                        )
                                    }
                                >
                                    加入購物車
                                </button>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </main>
    );
}

export default AllProducts;
