import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Admin.module.css";

const Admin = () => {
    const [accounts, setAccounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [footerInfo, setFooterInfo] = useState({ about_us: "", contact_us: "" });
    const [accountForm, setAccountForm] = useState({ acc_name: '', password: '', account_id: '' });
    const [productForm, setProductForm] = useState({ product_name: '', introduction: '', product_quantity: '', product_price: '', product_id: '' });

    const apiUrlAdmin = import.meta.env.VITE_API_URL_ADMIN;
    const apiUrlProduct = import.meta.env.VITE_API_URL_PRODUCT;
    const apiUrlFooter = import.meta.env.VITE_API_URL_FOOTER;
    const apiUrlAdminCheckLogin = import.meta.env.VITE_API_URL_ADMIN_CHECKLOGIN;
    const apiUrlAdminLogout = import.meta.env.VITE_API_URL_ADMIN_LOGOUT;

    const navigate = useNavigate();

    useEffect(() => {
        checkAdminLogin();
        loadAccounts();
        loadProducts();
        loadFooter();
    }, []);

    const getCSRFToken = () => {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [name, value] = cookie.split("=");
            if (name === "csrftoken") return decodeURIComponent(value);
        }
        return null;
    };

    const csrfToken = getCSRFToken();

    const checkAdminLogin = async () => {
        try {
            const response = await fetch(`${apiUrlAdminCheckLogin}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include', // 這樣會攜帶 cookies，包括 session
            });

            if (!response.ok) {
                navigate('/admin/login/'); // Redirect to login if not logged in
            }
        } catch (error) {
            console.error('Error checking admin login:', error);
            navigate('/admin/login/'); // Redirect to login on error
        }
    };

    const loadAccounts = async () => {
        try {
            const response = await fetch(apiUrlAdmin, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include', // 這樣會攜帶 cookies，包括 session
            });
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    };

    const loadProducts = async () => {
        try {
            const response = await fetch(apiUrlProduct, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include', // 這樣會攜帶 cookies，包括 session
            });
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const loadFooter = async () => {
        try {
            const response = await fetch(apiUrlFooter);
            const data = await response.json();
            setFooterInfo(data[0]);
        } catch (error) {
            console.error('Error loading footer info:', error);
        }
    };

    const handleAccountSubmit = async () => {
        const { acc_name, password, account_id } = accountForm;

        if (acc_name === '' || password === '') {
            alert('帳號和密碼不能為空');
            return;
        }

        const method = account_id ? 'PUT' : 'POST';
        const url = account_id ? `${apiUrlAdmin}${account_id}/` : apiUrlAdmin;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ acc_name, password }),
                credentials: 'include', // Include cookies for session management
            });

            if (response.ok) {
                loadAccounts();
                resetAccountForm();
            } else {
                const body = await response.json();
                alert(body.error || '操作失敗，請稍後再試。');
            }
        } catch (error) {
            console.error('Error submitting account:', error);
        }
    };

    const handleProductSubmit = async () => {
        const { product_name, introduction, product_quantity, product_price, product_id } = productForm;

        const method = product_id ? 'PUT' : 'POST';
        const url = product_id ? `${apiUrlProduct}${product_id}/` : apiUrlProduct;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ product_name, introduction, product_quantity, product_price }),
                credentials: 'include', // Include cookies for session management
            });

            if (response.ok) {
                loadProducts();
                resetProductForm();
            } else {
                const body = await response.json();
                alert(body.error || '操作失敗，請稍後再試。');
            }
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    const resetAccountForm = () => {
        setAccountForm({ acc_name: '', password: '', account_id: '' });
    };

    const resetProductForm = () => {
        setProductForm({ product_name: '', introduction: '', product_quantity: '', product_price: '', product_id: '' });
    };

    const handleAccountEdit = (account) => {
        setAccountForm({ acc_name: account.acc_name, password: '', account_id: account.id });
    };

    const handleProductEdit = (product) => {
        setProductForm({ product_name: product.product_name, introduction: product.introduction, product_quantity: product.product_quantity, product_price: product.product_price, product_id: product.id });
    };

    const handleAccountDelete = async (accountId) => {
        if (window.confirm('確定要刪除這個帳號嗎？')) {
            try {
                const response = await fetch(`${apiUrlAdmin}${accountId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include', // 這樣會攜帶 cookies，包括 session
                });
                if (response.ok) loadAccounts();
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    const handleProductDelete = async (productId) => {
        if (window.confirm('確定要刪除這個商品嗎？')) {
            try {
                const response = await fetch(`${apiUrlProduct}${productId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrfToken,
                    },
                    credentials: 'include', // 這樣會攜帶 cookies，包括 session
                });
                if (response.ok) loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleFooterEdit = async () => {
        const { about_us, contact_us, id } = footerInfo;

        try {
            const response = await fetch(`${apiUrlFooter}${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include', // 這樣會攜帶 cookies，包括 session
                body: JSON.stringify({ about_us, contact_us }),

            });

            if (response.ok) {
                loadFooter();
            } else {
                alert('更新 Footer 資訊失敗，請稍後再試。');
            }
        } catch (error) {
            console.error('Error updating footer info:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${apiUrlAdminLogout}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include', // 這樣會攜帶 cookies，包括 session
            });

            if (response.ok) {
                navigate('/admin/login'); // 登出成功，重定向至登入頁面
            } else {
                const body = await response.json();
                console.error('登出失敗:', body.error || '發生錯誤，請稍後再試。');
            }
        } catch (error) {
            console.error('登出過程中發生錯誤:', error);
        }
    };

    return (
        <main>
            <h2>放這行是因為下面的h2會被header擋住</h2>

            <h2>目前已存在的商品</h2>
            <section className={styles.product_container}>
                <div className={styles.product_list} id="product-list">
                    {products.map(product => (
                        <div key={product.id} className={styles.product_item}>
                            <div><strong>商品名稱：</strong><span>{product.product_name}</span></div>
                            <div><strong>介紹：</strong><span>{product.introduction}</span></div>
                            <div><strong>數量：</strong><span>{product.product_quantity}</span></div>
                            <div><strong>價格：</strong><span>NT$ {product.product_price}</span></div>
                            <div className={styles.button_group}>
                                <button onClick={() => handleProductEdit(product)} className={styles.edit_button}>編輯</button>
                                <button onClick={() => handleProductDelete(product.id)} className={styles.delete_button}>刪除</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.add_product}>
                <h2>編輯/新增商品</h2>
                <div className={styles.add_form}>
                    <label htmlFor="product_name">商品名稱</label>
                    <input type="text" id="product_name" value={productForm.product_name} onChange={(e) => setProductForm({ ...productForm, product_name: e.target.value })} required />

                    <label htmlFor="introduction">介紹</label>
                    <textarea id="introduction" value={productForm.introduction} onChange={(e) => setProductForm({ ...productForm, introduction: e.target.value })} required />

                    <label htmlFor="product_quantity">數量</label>
                    <input type="number" id="product_quantity" value={productForm.product_quantity} onChange={(e) => setProductForm({ ...productForm, product_quantity: e.target.value })} required />

                    <label htmlFor="product_price">價格</label>
                    <input type="number" id="product_price" value={productForm.product_price} onChange={(e) => setProductForm({ ...productForm, product_price: e.target.value })} required />

                    <input type="hidden" id="product_id" value={productForm.product_id} />

                    <div className={styles.edit_button_group}>
                        <button onClick={handleProductSubmit} className={styles.add_button}>確認</button>
                        <button onClick={resetProductForm} className={styles.add_button}>重設</button>
                    </div>
                </div>
            </section>

            <h2>目前已存在的帳號</h2>
            <section className={styles.account_container}>
                <div className={styles.account_list} id="account-list">
                    {accounts.map(account => (
                        <div key={account.id} className={styles.account_item}>
                            <div><strong>帳號名稱：</strong><span className="admin_account-name">{account.acc_name}</span></div>
                            <div><strong>密碼：</strong><span className="admin_account-password">{account.password}</span></div>
                            <div className={styles.button_group}>
                                <button onClick={() => handleAccountEdit(account)} className={styles.edit_button}>編輯</button>
                                <button onClick={() => handleAccountDelete(account.id)} className={styles.delete_button}>刪除</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.add_account}>
                <h2>編輯/新增管理員帳號</h2>
                <div className={styles.add_form}>
                    <label htmlFor="acc_name">帳號名稱</label>
                    <input type="text" id="acc_name" value={accountForm.acc_name} onChange={(e) => setAccountForm({ ...accountForm, acc_name: e.target.value })} required />

                    <label htmlFor="password">密碼</label>
                    <input type="password" id="password" value={accountForm.password} onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })} required />

                    <input type="hidden" id="account_id" value={accountForm.account_id} />

                    <div className={styles.edit_button_group}>
                        <button onClick={handleAccountSubmit} className={styles.add_button}>確認</button>
                        <button onClick={resetAccountForm} className={styles.add_button}>重設</button>
                    </div>
                </div>
            </section>

            <section className={styles.footer_info}>
                <h2>更新 Footer 資訊</h2>
                <div className={styles.add_form}>
                    <label htmlFor="about_us">關於我們</label>
                    <textarea id="about_us" value={footerInfo.about_us} onChange={(e) => setFooterInfo({ ...footerInfo, about_us: e.target.value })} required />

                    <label htmlFor="contact_us">聯絡我們</label>
                    <textarea id="contact_us" value={footerInfo.contact_us} onChange={(e) => setFooterInfo({ ...footerInfo, contact_us: e.target.value })} required />

                    <input type="hidden" id="footer_id" value={footerInfo.id} />

                    <div className={styles.edit_button_group}>
                        <button onClick={handleFooterEdit} className={styles.add_button}>確認</button>
                        <button onClick={loadFooter} className={styles.add_button}>重設</button>
                    </div>
                </div>
            </section>

            <section className={styles.logout_container}>
                <button onClick={handleLogout} className={styles.logout_button}>Logout</button>
            </section>
        </main>
    );
};

export default Admin;
