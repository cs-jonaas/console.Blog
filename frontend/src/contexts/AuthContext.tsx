// import React, { createContext, useContext, useState, useEffect } from 'react';

// interface AuthContextType {
//   isLoggedIn: boolean;
//   user: null | { email: string; id: string };
//   login: (userData: { email: string; id: string }) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState<null | { email: string; id: string }>(null);

//   const login = (userData: { email: string; id: string }) => {
//     setIsLoggedIn(true);
//     setUser(userData);
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     setUser(null);
//     // Logout API endpoint here
//   };

//   // Check on app load if user is already logged in (via existing cookies)
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const response = await fetch('/api/auth/me', { 
//           credentials: 'include' 
//         });
//         if (response.ok) {
//           const userData = await response.json();
//           login(userData);
//         }
//       } catch (error) {
//         console.log('Not authenticated', error);
//       }
//     };
//     checkAuthStatus();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };