import { Button } from "@mui/material";
import type { ReactNode } from "react";

interface CustomButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "inherit";
}

const CustomButton = ({ children, onClick, variant = "contained", color = "primary" }: CustomButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      color={color}
      sx={{ borderRadius: "20px", textTransform: "none", px: 3 }}
    >
      {children}
    </Button>
  );
};

// const ProfileButton = ({ children, onClick, variant = "contained", color = "primary" }: CustomButtonProps) => {

// }

export default CustomButton;
