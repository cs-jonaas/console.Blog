import type { ReactNode } from "react";
import { Box } from "@mui/material";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import { useAuth } from "../../hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isLoggedIn } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Box sx={{ flex: 1, display: "flex" }}>
        {isLoggedIn && <Sidebar />}
        <Box 
          component="main" 
          sx={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column",
            ml: isLoggedIn ? 0 : 0 // Adjust margin when sidebar is present
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};
// const Layout = ({ children }: LayoutProps) => {
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//       }}>
//       <Header />
//         <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//           {children}
//         </Box>
//       <Footer />
//     </Box>
//   );
// };

export default Layout;
