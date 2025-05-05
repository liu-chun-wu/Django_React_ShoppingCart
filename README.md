# 🛒 React Django ShoppingCart (Django + React + MySQL Server)

一個使用 Django + React 建構的簡易購物網站，透過 Docker Compose 快速部署前後端，並連接本機的 MySQL Server 作為資料庫。

---

## 📦 功能介紹

網站提供基礎購物流程與後台管理功能，包含：

- 🔗 **導覽列選單**
  - 首頁
  - 所有商品
  - 購物車
  - 管理員登入

- 🛍️ **所有商品**
  - 顯示所有商品的資訊：圖片、名稱、價格、庫存數量、介紹

- 🛒 **購物車功能**
  - 顯示已選購的商品清單
  - 可進行結帳（會同步減少商品庫存）
  - 可清空購物車內容

- 🔐 **後台管理登入**
  - 管理員登入後可：
    - 編輯商品資訊
    - 管理帳號
    - 編輯頁面 Footer 資訊

---

## 🛠️ 使用技術

| 類別   | 技術           |
|--------|----------------|
| 後端   | Django         |
| 前端   | React          |
| 語言   | Python, JavaScript, HTML, CSS |
| 資料庫 | MySQL Server（本機運行） |
| 部署   | Docker + Docker Compose |
