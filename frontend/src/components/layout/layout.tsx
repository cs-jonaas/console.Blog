import type { ReactNode } from "react";
import { Box } from "@mui/material";
import Header from "./header";
import Footer from "./footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
      <Header />
        <Box>
          {children}
        </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
