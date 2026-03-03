import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Aurora from "./animations/Aurora";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";

// ── Pages publiques ───────────────────────────────────────
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

// ── Pages admin ───────────────────────────────────────────
import AdminHome from "./pages/admin/AdminHome";
import AdminOrders from "./pages/admin/orders/AdminOrders";
import AdminEvents from "./pages/admin/events/AdminEvents";

function Layout({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && (
        <Aurora
          colorStops={["#E50914", "#730b0b", "#1a1a1a"]}
          amplitude={0.5}
          blend={0.7}
        />
      )}
      {!hideLayout && <NavBar />}
      {!hideLayout && <CartDrawer />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            {/* ── Public ── */}
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

            {/* ── Admin ── */}
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/events" element={<AdminEvents />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
