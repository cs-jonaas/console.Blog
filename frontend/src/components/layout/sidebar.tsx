// src/components/layout/sidebar.tsx
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Home, Bookmark } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) return null;

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/home" },
    { text: "Saved Posts", icon: <Bookmark />, path: "/saved" },
  ];

  return (
    <Box
      sx={{
        width: 250,
        minWidth: 250,
        bgcolor: "background.paper",
        borderRight: "1px solid #ddd",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Menu
        </Typography>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;