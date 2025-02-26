import React, { useState, useEffect } from "react";
import styles from "./ShopCart.module.css";

const ShopCart = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadCart();
    }, []);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            try {
                return JSON.parse(parts.pop().split(";").shift());
            } catch (e) {
                console.error("Invalid JSON format in cookie:", e);
                return [];
            }
        }
        return [];
    };

    const getCSRFToken = () => {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [name, value] = cookie.split("=");
            if (name === "csrftoken") return decodeURIComponent(value);
        }
        return null;
    };

    const updateTotal = (products) => {
        const totalAmount = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
        setTotal(totalAmount);
    };

    const saveCart = (products) => {
        document.cookie = `selectedProducts=${JSON.stringify(products)}; path=/;`;
    };

    const loadCart = () => {
        const products = getCookie("selectedProducts");
        setSelectedProducts(products);
        updateTotal(products);
    };

    const updateQuantity = (index, newQuantity) => {
        const maxQuantity = selectedProducts[index].availableQuantity;
        newQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));

        const updatedProducts = [...selectedProducts];
        updatedProducts[index].quantity = newQuantity;
        setSelectedProducts(updatedProducts);
        saveCart(updatedProducts);
        updateTotal(updatedProducts);
    };

    const removeProduct = (index) => {
        const updatedProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(updatedProducts);
        saveCart(updatedProducts);
        updateTotal(updatedProducts);
    };

    const clearCart = () => {
        document.cookie = "selectedProducts=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setSelectedProducts([]);
        setTotal(0);
    };

    const checkout = async () => {
        if (selectedProducts.length === 0) {
            alert("購物車是空的，無法結帳。");
            return;
        }

        const apiUrl = import.meta.env.VITE_API_URL_PRODUCT;
        const csrfToken = getCSRFToken();

        try {
            await Promise.all(
                selectedProducts.map(async (product) => {
                    const response = await fetch(`${apiUrl}${product.id}/`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRFToken": csrfToken,
                        },
                        body: JSON.stringify({ product_quantity: product.availableQuantity - product.quantity }),
                        credentials: 'include',  // 确保携带认证信息
                    });
                    if (!response.ok) {
                        throw new Error(`商品 ${product.name} 更新失敗`);
                    }
                })
            );
            alert("結帳完成，謝謝惠顧!");
            clearCart();
        } catch (error) {
            alert(`結帳過程中發生錯誤: ${error.message}`);
        }
    };

    return (
        <div className={styles.container}>
            <h1>購物車</h1>
            <div id="product-list">
                {selectedProducts.length > 0 ? (
                    selectedProducts.map((product, index) => (
                        <div key={product.id} className={styles.row}>
                            <div className={styles.info}>商品名稱: {product.name}</div>
                            <div className={styles.info}>商品單價: ${Number(product.price).toFixed(2)}</div>
                            <div className={styles.info}>
                                <p>購買數量:</p>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.availableQuantity}
                                    value={product.quantity}
                                    onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                                />
                            </div>
                            <div className={styles.info}>小計: ${(Number(product.price) * Number(product.quantity)).toFixed(2)}</div>
                            <button className={styles.cart_button} onClick={() => removeProduct(index)}>
                                刪除
                            </button>
                        </div>
                    ))
                ) : (
                    <p>您的購物車是空的。</p>
                )}
            </div>
            <div className={styles.total}>總計：${total.toFixed(2)}</div>
            <div className={styles.cart_button_container}>
                <button className={styles.cart_button} onClick={checkout}>結帳</button>
                <button className={styles.cart_button} onClick={clearCart}>清空購物車</button>
            </div>
        </div>
    );
};

export default ShopCart;
