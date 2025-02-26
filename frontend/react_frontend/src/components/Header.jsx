import { Link } from "react-router-dom"; // 引入 Link 來處理 React Router 導航
import styles from "./Header.module.css";

function Header() {
    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.ul}>
                    <li>
                        <Link to="/index" className={styles.a}>首頁</Link>
                    </li>
                    <li>
                        <Link to="/all_products" className={styles.a}>所有商品</Link>
                    </li>
                    <li>
                        <Link to="/shopcart" className={styles.a}>購物車</Link>
                    </li>
                    <li>
                        <Link to="/admin" className={styles.a}>管理員登入</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
