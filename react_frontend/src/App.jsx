import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./pages/FrontPage";
import AllProducts from "./pages/AllProducts";
import ShopCart from "./pages/ShopCart";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css"; // 引入全局 CSS

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/index" element={<FrontPage />} />
        <Route path="/all_products" element={<AllProducts />} />
        <Route path="/shopcart" element={<ShopCart />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
