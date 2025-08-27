import { Box, Typography, Stack } from "@mui/material";
// import CustomButton from "./button";
import HeroImage from "../../assets/heroImage";

const Hero = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        height: "100%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 10 },
        py: 6,
      }}
    >
      
      <Stack spacing={3} maxWidth="600px">
        <Typography variant="h2" fontWeight="bold" color="primary">
          console.BLOG
        </Typography>
        <Typography variant="h6" color="text.secondary">
          A place to express creativity through words.
        </Typography>
        {/* <CustomButton>Start reading</CustomButton> */}
      </Stack>

      
      <Box sx={{ display: { xs: "none", md: "block" }, maxWidth: "400px" }}>
        <img
          src={HeroImage}
          alt="illustration"
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
    </Box>
  );
};

export default Hero;

