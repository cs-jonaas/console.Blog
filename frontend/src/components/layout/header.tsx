import { AppBar, Toolbar, Typography, Stack } from "@mui/material";
import CustomButton from "./button";
import { Link } from '@mui/material';
// import Link from '@mui/material/Link';


const Header = () => {
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
          <Typography variant="body2">Our story</Typography>
          <Link href="/signin" underline="none" style={{ textDecoration: "none" }}>
            <Typography variant="body2">Sign in</Typography>
          </Link>
          <Link href= "/signup">
            <CustomButton>Sign Up</CustomButton>
          </Link>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
