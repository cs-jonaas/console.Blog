import { Box, Stack, Typography } from "@mui/material";

const Footer = () => {
  const links = ["Help", "About", "Careers", "Press", "Blog", "Privacy", "Rules", "Terms", "Contatc Us"];

  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid #ddd",
        py: 3,
        px: { xs: 2, md: 10 },
        textAlign: "center",
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
        {links.map((link) => (
          <Typography key={link} variant="body2" color="text.secondary" sx={{ cursor: "pointer" }}>
            {link}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
};

export default Footer;
