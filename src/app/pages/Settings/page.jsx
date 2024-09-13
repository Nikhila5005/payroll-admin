'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const SettingsPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [payrollFrequency, setPayrollFrequency] = useState('');
  const [currency, setCurrency] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [country, setCountry] = useState('');
  const [savedSettings, setSavedSettings] = useState(null);

  const handleSave = () => {
    const settings = { companyName, payrollFrequency, currency, companyAddress, companyLogo, country };
    setSavedSettings(settings);
    console.log('Settings saved:', settings);
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setCompanyName(savedSettings.companyName);
    setPayrollFrequency(savedSettings.payrollFrequency);
    setCurrency(savedSettings.currency);
    setCompanyAddress(savedSettings.companyAddress);
    setCompanyLogo(savedSettings.companyLogo);
    setCountry(savedSettings.country);
    setSavedSettings(null);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f0f4f7', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#124E66', textAlign: 'center' }}>
        Company Payroll Settings
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          margin: '0 auto',
          maxWidth: '800px',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
        }}
      >
        <Grid container spacing={4}>
          {!savedSettings ? (
            <>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  sx={{
                    padding: 2,
                    backgroundColor: companyLogo ? 'transparent' : '#124E66',
                    color: companyLogo ? '#124E66' : 'white',
                    '&:hover': {
                      backgroundColor: companyLogo ? 'transparent' : '#0d3b4f',
                      color: companyLogo ? '#124E66' : 'white'
                    },
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '200px',
                    height: '200px',
                    borderRadius: '12px',
                    boxShadow: companyLogo ? 'none' : '0 4px 10px rgba(0, 0, 0, 0.1)',
                    border: companyLogo ? '2px dashed #124E66' : 'none',
                    position: 'relative',
                  }}
                  onClick={() => document.getElementById('uploadLogo')?.click()}
                >
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt="Logo"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '12px',
                      }}
                    />
                  ) : (
                    <UploadFileIcon sx={{ fontSize: '5rem' }} />
                  )}
                </Button>
                <input
                  id="uploadLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  hidden
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  variant="outlined"
                  sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Address"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  variant="outlined"
                  sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" sx={{ backgroundColor: 'white', borderRadius: '8px' }}>
                  <InputLabel>Payroll Frequency</InputLabel>
                  <Select
                    value={payrollFrequency}
                    onChange={(e) => setPayrollFrequency(e.target.value)}
                    label="Payroll Frequency"
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="bi-weekly">Bi-Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  variant="outlined"
                  sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  variant="outlined"
                  sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{
                    backgroundColor: '#124E66',
                    '&:hover': {
                      backgroundColor: '#0d3b4f',
                    },
                    padding: '12px 30px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  Save Settings
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ padding: 3, marginTop: 3, backgroundColor: '#e0f7fa', position: 'relative' }}>
                {savedSettings.companyLogo && (
                  <img
                    src={savedSettings.companyLogo}
                    alt="Saved Logo"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '100px',
                      height: '100px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '2px solid #124E66',
                    }}
                  />
                )}
                <Typography variant="h6" gutterBottom>
                  Saved Settings:
                </Typography>
                <Typography variant="body1">
                  <strong>Company Name:</strong> {savedSettings.companyName}
                </Typography>
                <Typography variant="body1">
                  <strong>Company Address:</strong> {savedSettings.companyAddress}
                </Typography>
                <Typography variant="body1">
                  <strong>Payroll Frequency:</strong> {savedSettings.payrollFrequency}
                </Typography>
                <Typography variant="body1">
                  <strong>Currency:</strong> {savedSettings.currency}
                </Typography>
                <Typography variant="body1">
                  <strong>Country:</strong> {savedSettings.country}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  sx={{
                    backgroundColor: '#124E66',
                    '&:hover': {
                      backgroundColor: '#0d3b4f',
                    },
                    padding: '10px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    marginTop: '20px',
                  }}
                >
                  Edit Settings
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
