export function getAuthToken() {
  return localStorage.getItem("token");
}

export function getUserRole() {
  return localStorage.getItem("userRole");
}

export function isLoggedIn() {
  return Boolean(getAuthToken());
}

export function isUserLoggedIn() {
  return isLoggedIn() && getUserRole() === "user";
}

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("adminName");
  localStorage.removeItem("userName");
  localStorage.removeItem("userPseudo");
}

export function storeAuthSession(payload) {
  const { token, role, admin, user } = payload;

  localStorage.setItem("token", token);
  localStorage.setItem("userRole", role);

  if (role === "admin" && admin) {
    localStorage.setItem("adminName", admin.name || "");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPseudo");
    return;
  }

  if (role === "user" && user) {
    localStorage.setItem("userName", user.name || "");
    localStorage.setItem("userPseudo", user.pseudo || "");
    localStorage.removeItem("adminName");
  }
}

export function buildLoginRedirect(path) {
  return `/login?redirect=${encodeURIComponent(path)}`;
}

export function getRedirectAfterAuth(search, fallback = "/") {
  const params = new URLSearchParams(search);
  return params.get("redirect") || fallback;
}
