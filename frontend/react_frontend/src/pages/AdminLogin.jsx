import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
    const [accName, setAccName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const login_apiUrl = import.meta.env.VITE_API_URL_ADMIN_LOGIN;


    const getCSRFToken = () => {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [name, value] = cookie.split("=");
            if (name === "csrftoken") return decodeURIComponent(value);
        }
        return null;
    };

    const csrfToken = getCSRFToken();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // 重置錯誤訊息

        try {
            const response = await fetch(`${login_apiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({ acc_name: accName, password }),
                credentials: 'include', // 這樣會攜帶 cookies，包括 session
            });

            if (response.ok) {
                navigate('/admin'); // 登入成功，重定向至儀表板
            } else {
                const body = await response.json();
                setErrorMessage(body.error || '登入失敗，請檢查您的帳號和密碼。');
            }
        } catch (error) {
            console.error('登入過程中發生錯誤:', error);
            setErrorMessage('發生錯誤，請稍後再試。');
        }
    };

    return (
        <div>
            <main className="login-container">
                <div className="login-box">
                    <h2>Admin Login</h2>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label htmlFor="acc_name">Account Name:</label>
                        <input
                            type="text"
                            id="acc_name"
                            name="acc_name"
                            value={accName}
                            onChange={(e) => setAccName(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className={styles.button} type="submit">Login</button>
                    </form>

                    {errorMessage && <p className={styles.error_message}>{errorMessage}</p>}
                </div>
            </main>
        </div>
    );
};

export default AdminLogin;
