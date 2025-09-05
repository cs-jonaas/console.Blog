import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getStoredUser, isAuthenticated, logout } from '../utils/auth'; 
import { AuthContext, type AuthContextType, type User } from '../hooks/useAuth';


// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Crucial for initial load

  const handleLogin = (userData?: User) => {
    setIsLoggedIn(true);
    if (userData) {
      setUser(userData);
    } else {
      // If no userData is passed, try to get it from storage
      const storedUser = getStoredUser();
      if (storedUser) setUser(storedUser);
    }
  };

  // Function to handle logout (update state)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    logout(); // Call your existing logout function to clear storage
  };

  // Effect to check auth status ONCE when the app loads
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated();
      const storedUser = getStoredUser();

    console.log('=== AUTH DEBUG ===');
    console.log('Auth status:', authStatus);
    console.log('Stored user:', storedUser);

    setIsLoggedIn(authStatus);
      if (authStatus && storedUser) {
        // Ensure the stored user has the correct shape
        const userData: User = {
          _id: storedUser._id || storedUser.id || '',
          username: storedUser.username || '',
          email: storedUser.email || ''
        };
        setUser(userData);
      }
      setIsLoading(false);
    };

    checkAuthStatus();

    // Listen for your custom event if login/logout happens in another tab/window
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener('authStateChange', handleStorageChange);
    return () => window.removeEventListener('authStateChange', handleStorageChange);
  }, []);

  // The value that will be supplied to any component that uses this context
  const contextValue: AuthContextType = {
    isLoggedIn,
    user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;