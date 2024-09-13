"use client";
import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Link, Paper, InputAdornment, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import WifiPasswordTwoToneIcon from '@mui/icons-material/WifiPasswordTwoTone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PasswordIcon from '@mui/icons-material/Password';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

const theme = createTheme({
  palette: {
    primary: {
      main: '#3480eb', // Set primary color to blue
    },
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    router.push('/Navbar');
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '90vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          maxWidth: '600px', // Set maximum width for the content
          margin: '0 auto', // Center the content horizontally
          background: 'linear-gradient(135deg, #3480eb 0%, #3480eb 50%, #f5f5f5 50%)', // Apply special linear gradient to background image with color in place of white
        }}
      >
        <Container component="main" maxWidth="xs">
          <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, backgroundColor: '#f5f5f5', width: '100%', maxWidth: 'xs' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <LockOutlinedIcon color="primary" sx={{ fontSize: 50 }} />
              <Typography component="h1" variant="h5">
                Admin Panel
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Admin Name"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SupervisorAccountIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0px', // Removed border radius
                      backgroundColor: '#f5f5f5', // Added background color
                      border: '1px solid #ddd', // Added border
                      padding: '10px', // Added padding
                      '& fieldset': {
                        border: '1px solid #ddd', // Added border to fieldset
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Enter Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasswordIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <WifiPasswordTwoToneIcon /> : <WifiPasswordTwoToneIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0px', // Removed border radius
                      backgroundColor: '#f5f5f5', // Added background color
                      border: '1px solid #ddd', // Added border
                      padding: '10px', // Added padding
                      '& fieldset': {
                        border: '1px solid #ddd', // Added border to fieldset
                      },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      padding: '10px 0',
                      borderRadius: '25px',
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', // Apply linear gradient to background image
                      flex: 1,
                      mr: 1,
                    }}
                  >
                    Login
                  </Button>
                </Box>
                <Link href="#" variant="body2" sx={{ textAlign: 'center', display: 'block', mt: 2 }}>
                  Forgot Password?
                </Link>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;