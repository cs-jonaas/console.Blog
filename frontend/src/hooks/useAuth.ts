import { createContext, useContext } from 'react';

// Define a User type for better type safety
export interface User {
  _id: string;
  username: string;
  email: string;
}

// Define the shape of the data the context will hold
export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData?: User) => void; // Function to update state on login
  logout: () => void; // Function to update state on logout
}

// Create the context with a default value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};