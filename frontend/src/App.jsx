import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/shop/ShopPage";
import ShopDetailPage from "./pages/shop/ShopDetailPage";
import CheckoutPage from "./pages/shop/CheckoutPage";
import TeamPage from "./pages/team/TeamPage";
import TeamDetailPage from "./pages/team/TeamDetailPage";
import NewsPage from "./pages/news/NewsPage";
import NewsDetailPage from "./pages/news/NewsDetailPage";
import EventPage from "./pages/events/EventPage";
import EventDetailPage from "./pages/events/EventDetailPage";
import LoginPage from "./pages/LoginPage";
import SignPage from "./pages/SignPage";

import AdminHome from "./pages/admin/AdminHome";
import AdminOrders from "./pages/admin/orders/AdminOrders";
import AdminProductsPage from "./pages/admin/products/AdminProductsPage";
import AdminEvents from "./pages/admin/events/AdminEvents";
import AdminNewsPage from "./pages/admin/news/AdminNewsPage";
import AdminTeamsPage from "./pages/admin/teams/AdminTeamsPage";

function AdminRoute() {
  const adminToken = localStorage.getItem("adminToken");
  const userRole = localStorage.getItem("userRole");

  if (!adminToken || userRole !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function Layout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <NavBar />}
      {!isAdmin && <CartDrawer />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:id" element={<ShopDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/team/:id" element={<TeamDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign" element={<SignPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/news" element={<AdminNewsPage />} />
              <Route path="/admin/teams" element={<AdminTeamsPage />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
