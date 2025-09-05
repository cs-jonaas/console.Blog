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
import { signupUser } from '../../services/authServices';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utils/auth';


const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check password match
    if (formData.password !== formData.confirmPassword) {
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
    // Call the signup function
    const result = await signupUser({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    console.log('Signup result:', result);

      if (result.accessToken || result.user) {
        login(result.accessToken, {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
        });
        navigate("/home");
      } else {
        setError("Registration Failed");
      }
    } catch (error) {
      // Handle errors
      
      setError(error instanceof Error ? error.message : String(error));
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  }


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
            Sign Up
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
            label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              required
            />
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
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, backgroundColor: '#2e69ff' }}
              disabled={!formData.email || formData.password.length < 8 || loading}>
              Sign Up
            </Button>
            <Typography align="center" padding={3} > Already have an account? <Link href="/signin"> 
                Sign in
              </Link></Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
