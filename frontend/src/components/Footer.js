// src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'rgb(22, 87, 140)',
        color: 'white',
        textAlign: 'center',
        padding: '10px 15x',
        margin: "",
        width: '100%',
      }}
    >
      <Typography variant="body2">© 2024 AIRPLANE. All rights reserved.</Typography>
    </Box>
  );
};

export default Footer;
