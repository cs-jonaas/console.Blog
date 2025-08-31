import { jwtDecode } from 'jwt-decode';

const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`

interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface JWTPayload {
  userId: string;
  sessionId: string;
  iat: number;
  exp: number;
}

interface AuthResponse {
  Message: string;
  user: {
    id: string;
    email: string;
  };
  accessToken?: string;
}

const storeAuthData = (accessToken: string, user: { id: string; email: string }) => {
  const payload: JWTPayload = jwtDecode(accessToken);
  localStorage.setItem("jwtPayload", JSON.stringify(payload));
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", accessToken);
};

export const decodeJwtPayload = (token: string): JWTPayload | null => {
  try {
    // The payload is the second part of the JWT
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Base64 decode and parse JSON
    const decodedPayload: JWTPayload = JSON.parse(atob(base64));
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export const signupUser = async (
  userData: SignupData
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    
    const data: AuthResponse = await response.json();
    
    if (!response.ok) {
      // Try to get the error message from the backend's JSON response
      throw new Error(data.Message || `Registration failed with status: ${response.status}`);
    }

    if (data.accessToken && data.user) {
      storeAuthData(data.accessToken, data.user);
      window.dispatchEvent(new CustomEvent('authStateChange'));
    }
    // parse and return the JSON response if successful
    return data;
    } catch (err) {
      console.log(err);
      throw new Error(err as string);
  }
};


export const signinUser = async (
  userData: SigninData,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.Message || `Login failed with status: ${response.status}`);
    }

  if (data.accessToken && data.user) {
    storeAuthData(data.accessToken, data.user);
    window.dispatchEvent(new CustomEvent('authStateChange'));
  }
    
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err as string);
  }
};

export const getCurrentUser = async () => {
  const response = await fetch(`${BASE_URL}/me`, {
    credentials: 'include', 
  });

  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Failed to fetch user data");

  const userData = await response.json();
  localStorage.setItem("user", JSON.stringify(userData));
  return userData;
};