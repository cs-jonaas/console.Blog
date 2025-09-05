import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from '@mui/material';
import { signinUser, getCurrentUser } from '../../services/authServices';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utils/auth';

const Signin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isAuthenticated()) {
  //     const user = getStoredUser();
  //     console.log('User already authenticated:', user?.email);
  //     navigate('/home');
  //   }
  // }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Check password match
        if (!formData.password) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
    
        // Check password length
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long");
          setLoading(false);
          return;
        }
    
        try {
    type User = {
      id?: string;
      email?: string;
      username?: string;
      [key: string]: unknown;
    };

    type SigninResult = {
      accessToken?: string;
      access_token?: string;
      token?: string;
      user?: User;
    };

    const result: SigninResult = await signinUser({
      email: formData.email,
      password: formData.password,
    });

    // Be tolerant to backend field names
    const token =
      result.accessToken ??
      result.access_token ??
      result.token;

    if (token) {
      // JWT-in-body mode
      login(token, result.user);
      navigate('/home');
      return;
    }

    // Cookie-only mode: verify session by calling /auth/me
    const me = await getCurrentUser(); // this uses credentials: 'include'
    if (me) {
      login(undefined, me); // sets 'auth' = 'cookie' and stores user
      navigate('/home');
      return;
    }

    setError('Authentication failed: no token and no session.');
  } catch (err) {
    setError(err instanceof Error ? err.message : String(err));
  } finally {
    setLoading(false);
  }
  
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('/background.svg')`, // Set your background image path here
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ padding: 4, backgroundColor: '#f5efef', color: '#962020' }}>
          <Typography variant="h4" gutterBottom align="center">
            Sign In
          </Typography>

          {/* Display error message */}
          {error && (
            <Typography
              color="error"
              align="center"
              sx={{ mb: 2, padding: 1, backgroundColor: '#ffe6e6', borderRadius: 1 }}
            >
              {error}
            </Typography>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              required
              disabled={loading}
            />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, backgroundColor: '#2e69ff' }}
                disabled={loading || !formData.email || formData.password.length < 8}>
                Sign In
              </Button>            
            <Typography align="center" padding={3} > Don't have an account? <Link href="/signup"> 
                Sign Up
              </Link></Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signin;

