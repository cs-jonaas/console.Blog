import { AppBar, Toolbar, Typography, Stack } from "@mui/material";
import CustomButton from "./button";
import { Link } from '@mui/material';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../../utils/auth";
import { decodeJwtPayload } from "../../services/authServices";


const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const navigate = useNavigate();

    useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
    };

    // Check auth on component mount
    checkAuth();

    // Listen for custom auth state change events
    const handleAuthChange = () => {
      checkAuth();
    };

    // Listen for storage changes (if user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChange', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('authStateChange', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate("/");
  };

  console.log('Header rendered. isLoggedIn:', isLoggedIn);
  console.log('Token exists:', !!localStorage.getItem('token'));

  const token = localStorage.getItem('token');
  if (token) {
    console.log('User exists:', decodeJwtPayload(token));
    localStorage.setItem("jwtPayload", JSON.stringify(decodeJwtPayload(token)));
  }

  return (
    <AppBar 
      position="static" 
      color="inherit" 
      elevation={0} 
      sx={{ borderBottom: "1px solid #ddd" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link href="/" underline="none" style={{ textDecoration: "none" }}>
          <Typography variant="h6" fontWeight="bold">
            console.Blog
          </Typography>
        </Link>

        <Stack direction="row" spacing={3} alignItems="center">
          {isLoggedIn ? (
            <>
              <Link href="/create" underline="none" style={{ textDecoration: "none" }}>
                <Typography variant="body2">Write</Typography>
              </Link>
              {/* <Link href="/profile" underline="none" style={{ textDecoration: "none" }}>
                <Typography variant="body2">Profile</Typography>
              </Link> */}
                <CustomButton onClick={handleLogout}>Logout</CustomButton>
            </>
          ) : (
            <>
          <Typography variant="body2">Our story</Typography>
          <Link href="/signin" underline="none" style={{ textDecoration: "none" }}>
            <Typography variant="body2">Sign in</Typography>
          </Link>
          <Link href= "/signup">
            <CustomButton>Sign Up</CustomButton>
          </Link>
        </>
        )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
