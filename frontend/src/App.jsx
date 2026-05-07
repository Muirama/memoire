import { useEffect, useRef, useState } from "react";
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
import api from "./api/api";
import { clearAuthSession } from "./utils/auth";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/shop/ShopPage";
import ShopDetailPage from "./pages/shop/ShopDetailPage";
import CheckoutPage from "./pages/shop/CheckoutPage";
import TeamPage from "./pages/team/TeamPage";
import NewsPage from "./pages/news/NewsPage";
import NewsDetailPage from "./pages/news/NewsDetailPage";
import EventPage from "./pages/events/EventPage";
import EventDetailPage from "./pages/events/EventDetailPage";
import LoginPage from "./pages/LoginPage";
import SignPage from "./pages/SignPage";
import UserAccountPage from "./pages/account/UserAccountPage";
import ScrollToTop from "./components/ScrollToTop";
import GameDetailPage from "./pages/team/GameDetailPage";

import AdminHome from "./pages/admin/AdminHome";
import AdminOrders from "./pages/admin/orders/AdminOrders";
import AdminProductsPage from "./pages/admin/products/AdminProductsPage";
import AdminEvents from "./pages/admin/events/AdminEvents";
import AdminNewsPage from "./pages/admin/news/AdminNewsPage";
import AdminUsersPage from "./pages/admin/users/AdminUsersPage";

const isAdminPath = (pathname) => pathname.startsWith("/admin");

function AdminRoute() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAdmin = async () => {
      if (!token || userRole !== "admin") {
        if (isMounted) {
          setIsAuthorized(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        const authenticatedUser = data.user;
        const isAdmin = authenticatedUser?.role === "admin";

        if (isMounted) {
          setIsAuthorized(isAdmin);

          if (isAdmin) {
            localStorage.setItem("userRole", authenticatedUser.role);
            localStorage.setItem("adminName", authenticatedUser.name || "");
          } else {
            clearAuthSession();
          }

          setIsChecking(false);
        }
      } catch {
        if (isMounted) {
          clearAuthSession();
          setIsAuthorized(false);
          setIsChecking(false);
        }
      }
    };

    verifyAdmin();

    return () => {
      isMounted = false;
    };
  }, [token, userRole]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-white/20 border-t-[#E50914] rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">
            Verification de la session admin...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function UserRoute() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      if (!token || userRole !== "user") {
        if (isMounted) {
          setIsAuthorized(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        const authenticatedUser = data.user;
        const isUser = authenticatedUser?.role === "user";

        if (isMounted) {
          setIsAuthorized(isUser);

          if (isUser) {
            localStorage.setItem("userRole", "user");
            localStorage.setItem("userName", authenticatedUser.name || "");
            localStorage.setItem("userPseudo", authenticatedUser.pseudo || "");
          } else {
            clearAuthSession();
          }

          setIsChecking(false);
        }
      } catch {
        if (isMounted) {
          setIsAuthorized(false);
          setIsChecking(false);
        }
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, [token, userRole]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-white/20 border-t-[#E50914] rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">
            Verification de la session utilisateur...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function Layout({ children }) {
  const location = useLocation();
  const isAdmin = isAdminPath(location.pathname);
  const previousPathRef = useRef(location.pathname);

  const getPageTitle = (pathname) => {
    if (pathname === "/") return "Gascom";

    if (pathname.startsWith("/shop")) return "Gascom eShop";
    if (pathname.startsWith("/team")) return "Gascom eSport";
    if (pathname.startsWith("/news")) return "Gascom News";
    if (pathname.startsWith("/events")) return "Gascom Events";
    if (pathname.startsWith("/login")) return "Gascom Login";
    if (pathname.startsWith("/sign")) return "Gascom Sign Up";
    if (pathname.startsWith("/account")) return "Gascom eCompte";

    if (pathname.startsWith("/admin")) return "Gascom Admin";

    return "Gascom";
  };

  useEffect(() => {
    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    const leftAdminArea =
      isAdminPath(previousPath) &&
      !isAdminPath(location.pathname) &&
      localStorage.getItem("userRole") === "admin";

    if (leftAdminArea) {
      clearAuthSession();
    }

    previousPathRef.current = location.pathname;
  }, [location.pathname]);

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
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:id" element={<ShopDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/team/game/:slug" element={<GameDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign" element={<SignPage />} />

            <Route element={<UserRoute />}>
              <Route path="/account" element={<UserAccountPage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/news" element={<AdminNewsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
