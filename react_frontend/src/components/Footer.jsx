import { useState, useEffect } from "react";
import styles from "./Footer.module.css";

function Footer() {
    const [aboutUs, setAboutUs] = useState("");
    const [contactUs, setContactUs] = useState("");
    const [footerId, setFooterId] = useState("");

    // API 請求來載入 Footer 資料
    useEffect(() => {
        const _apiUrl_footer = import.meta.env.VITE_API_URL_FOOTER;

        // 使用 fetch API 請求資料
        fetch(_apiUrl_footer)
            .then(response => response.json())
            .then(data => {
                setAboutUs(data[0].about_us);
                setContactUs(data[0].contact_us);
                setFooterId(data[0].id);
            })
            .catch(error => console.error('Error loading footer info:', error));
    }, []); // 空的依賴陣列表示這個 effect 只在元件掛載時執行一次

    return (
        <footer className={styles.footer}>
            <div className={styles.div}>
                <p className={styles.p} id="about_us_below">
                    About us : {aboutUs}
                </p>
                <p className={styles.p} id="contact_us_below">
                    Contact us : {contactUs}
                </p>
                <span id="id_below" data-id={footerId} style={{ display: "none" }}></span>
            </div>
        </footer>
    );
}

export default Footer;
