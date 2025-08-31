import type { JwtPayload } from "jwt-decode";


export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Helper function to get user data from localStorage
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Helper function to get JWT payload from localStorage
export const getJwtPayload = (): JwtPayload | null => {
  const payloadStr = localStorage.getItem('jwtPayload');
  return payloadStr ? JSON.parse(payloadStr) : null;
};


export const login = (token?: string, user?: Record<string, unknown>) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    // Cookie-mode marker so the UI can flip; security still relies on HttpOnly cookie.
    localStorage.setItem('auth', 'cookie');
  }
  if (user) localStorage.setItem('user', JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('authStateChange'));
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('jwtPayload');
  localStorage.removeItem('auth');
  // Dispatch event to notify other components (like header)
  window.dispatchEvent(new CustomEvent('authStateChange'));
  window.dispatchEvent(new Event('storage')); // Notify other tabs
  window.dispatchEvent(new CustomEvent('authChange', { detail: { isLoggedIn: false } }));
};