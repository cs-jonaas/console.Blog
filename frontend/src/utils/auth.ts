import type { JwtPayload } from "jwt-decode";


export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const cookieAuth = localStorage.getItem('auth') === 'cookie';
  return !!token || cookieAuth;
};

// Helper function to get user data from localStorage
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.is && !user._id) {
      user._id = user.id
    }
    return user;
  }

  // Fallback: reconstruct user from individual fields
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  
  if (userId || username || email) {
    return {
      _id: userId,
      username: username,
      email: email,
      // Add other fields as needed
    };
  }
  return null;
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
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));

    if(user.id) {
      localStorage.setItem("userId", user._id as string);
    }
    if (user.username) {
      localStorage.setItem("username", user.username as string);
    }
    if (user.email) {
      localStorage.setItem("email", user.email as string);
    }
  }
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