'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, List, ListItem, ListItemText, 
  Paper, Grid, Container, IconButton, Divider, Checkbox, FormControlLabel, Select, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust the base URL as needed

const TemplateDisplay = ({ template }) => {
  if (!template) return null;
  return (
    <Paper elevation={3} sx={{ padding: 4, marginTop: 4, backgroundColor: 'background.paper' }}>
      <Typography variant="h4" gutterBottom color="primary" align="center">
        Salary Slip
      </Typography>
      {template.logo && (
        <Box mb={3} display="flex" justifyContent="center">
          <Box
            component="img"
            src={template.logo}
            alt="Company Logo"
            sx={{ maxWidth: 200, maxHeight: 100 }}
          />
        </Box>
      )}
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            Earnings
          </Typography>
          <List>
            {template.allowances.map((allowance, index) => (
              <ListItem key={index} disableGutters>
                <ListItemText 
                  primary={allowance.name}
                  secondary={`₹${parseFloat(allowance.amount).toFixed(2)}`}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                  secondaryTypographyProps={{ color: 'primary' }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            Deductions
          </Typography>
          <List>
            {template.deductions.map((deduction, index) => (
              <ListItem key={index} disableGutters>
                <ListItemText 
                  primary={deduction.name}
                  secondary={`₹${parseFloat(deduction.amount).toFixed(2)}`}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                  secondaryTypographyProps={{ color: 'error' }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            Total Earnings: ₹{template.totalEarnings.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
            Total Deductions: ₹{template.totalDeductions.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      <Box textAlign="center">
        <Typography variant="h5" color="primary" gutterBottom>
          Net Pay
        </Typography>
        <Typography variant="h4" color="secondary" fontWeight="bold">
          ₹{template.netPay.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

// Updated Allowance Options
const ALLOWANCE_OPTIONS = [
  'Basic Salary',
  'House Rent Allowance',
  'Medical Allowance',
  'Transport Allowance',
  'Other Allowances',
];

// Updated Deduction Options
const DEDUCTION_OPTIONS = [
  'Provident Fund',
  'Professional Tax',
  'ESI',
  'TDS',
  'Other Deductions',
];

const TemplateForm = ({ onCreateTemplate }) => {
  const [logo, setLogo] = useState(null);
  const [allowances, setAllowances] = useState([]);
  const [deductions, setDeductions] = useState([]);

  useEffect(() => {
    fetchAllowances();
    fetchDeductions();
  }, []);

  const fetchAllowances = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/allowances`);
      setAllowances(response.data);
    } catch (error) {
      console.error('Error fetching allowances:', error);
    }
  };

  const fetchDeductions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/deductions`);
      setDeductions(response.data);
    } catch (error) {
      console.error('Error fetching deductions:', error);
    }
  };

  const handleAddField = async (type) => {
    const newField = { 
      name: '', 
      description: '', 
      isTaxable: false, 
      isMandatory: false, 
      ...(type === 'allowance' ? {} : { isStatutory: false, isPercentageBased: false }) 
    };
    if (type === 'allowance') {
      try {
        const response = await axios.post(`${API_BASE_URL}/allowances`, newField);
        setAllowances([...allowances, response.data]);
      } catch (error) {
        console.error('Error creating allowance:', error);
      }
    } else {
      try {
        const response = await axios.post(`${API_BASE_URL}/deductions`, newField);
        setDeductions([...deductions, response.data]);
      } catch (error) {
        console.error('Error creating deduction:', error);
      }
    }
  };

  const handleRemoveField = async (type, index) => {
    if (type === 'allowance') {
      try {
        await axios.delete(`${API_BASE_URL}/allowances/${allowances[index].id}`);
        setAllowances(allowances.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error deleting allowance:', error);
      }
    } else if (type === 'deduction') {
      try {
        await axios.delete(`${API_BASE_URL}/deductions/${deductions[index].id}`);
        setDeductions(deductions.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error deleting deduction:', error);
      }
    }
  };

  const handleChange = async (type, index, value, field) => {
    if (type === 'allowance') {
      const updatedAllowances = [...allowances];
      updatedAllowances[index][field] = value;
      setAllowances(updatedAllowances);
      try {
        console.log(`Updating allowance: ${JSON.stringify(updatedAllowances[index])}`);
        await axios.put(`${API_BASE_URL}/allowances/${updatedAllowances[index].id}`, updatedAllowances[index]);
      } catch (error) {
        console.error('Error updating allowance:', error);
      }
    } else {
      const updatedDeductions = [...deductions];
      updatedDeductions[index][field] = value;
      setDeductions(updatedDeductions);
      try {
        console.log(`Updating deduction: ${JSON.stringify(updatedDeductions[index])}`);
        await axios.put(`${API_BASE_URL}/deductions/${updatedDeductions[index].id}`, updatedDeductions[index]);
      } catch (error) {
        console.error('Error updating deduction:', error);
      }
    }
  };

  const totalEarnings = allowances.reduce((sum, allowance) => sum + parseFloat(allowance.amount || 0), 0);
  const totalDeductions = deductions.reduce((sum, deduction) => sum + parseFloat(deduction.amount || 0), 0);
  const netPay = totalEarnings - totalDeductions;

  const handleSubmit = () => {
    onCreateTemplate({
      logo,
      allowances,
      deductions,
      totalEarnings,
      totalDeductions,
      netPay,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result); // base64 logo
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvailableOptions = (type) => {
    const selectedNames = type === 'allowance' ? allowances.map(a => a.name) : deductions.map(d => d.name);
    const options = type === 'allowance' ? ALLOWANCE_OPTIONS : DEDUCTION_OPTIONS;
    return options.filter(option => !selectedNames.includes(option) || selectedNames.includes(option));
  };

  const handleSelectChange = (type, index, event) => {
    handleChange(type, index, event.target.value, 'name');
  };

  return (
    <Paper sx={{ padding: 4, marginBottom: 4 }}>
      <Typography variant="h4" gutterBottom>Create Full Time Employee Template</Typography>
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>Upload Company Logo:</Typography>
        <TextField type="file" onChange={handleLogoChange} />
      </Box>
      <Box mb={3}>
        <Typography variant="h6">Allowances</Typography>
        {allowances.map((allowance, index) => (
          <Grid container spacing={2} key={index} alignItems="center" mb={2}>
            <Grid item xs={2}>
              <Select
                fullWidth
                value={allowance.name || ''}
                onChange={(e) => handleSelectChange('allowance', index, e)}
              >
                {ALLOWANCE_OPTIONS.map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Description"
                value={allowance.description || ''}
                onChange={(e) => handleChange('allowance', index, e.target.value, 'description')}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowance.isTaxable}
                    onChange={(e) => handleChange('allowance', index, e.target.checked, 'taxable')}
                  />
                }
                label="Taxable"
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowance.isMandatory}
                    onChange={(e) => handleChange('allowance', index, e.target.checked, 'mandatory')}
                  />
                }
                label="Mandatory"
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => handleRemoveField('allowance', index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleAddField('allowance')}>
          Add Allowance
        </Button>
      </Box>
      <Box mb={3}>
        <Typography variant="h6">Deductions</Typography>
        {deductions.map((deduction, index) => (
          <Grid container spacing={2} key={index} alignItems="center" mb={2}>
            <Grid item xs={2}>
              <Select
                fullWidth
                value={deduction.name || ''}
                onChange={(e) => handleSelectChange('deduction', index, e)}
              >
                {DEDUCTION_OPTIONS.map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Description"
                value={deduction.description || ''}
                onChange={(e) => handleChange('deduction', index, e.target.value, 'description')}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={deduction.isStatutory}
                    onChange={(e) => handleChange('deduction', index, e.target.checked, 'statutory')}
                  />
                }
                label="Statutory"
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={deduction.isPercentageBased}
                    onChange={(e) => handleChange('deduction', index, e.target.checked, 'isPercentageBased')}
                  />
                }
                label="Percentage Based"
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={deduction.isMandatory}
                    onChange={(e) => handleChange('deduction', index, e.target.checked, 'mandatory')}
                  />
                }
                label="Mandatory"
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => handleRemoveField('deduction', index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleAddField('deduction')}>
          Add Deduction
        </Button>
      </Box>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Generate Template
      </Button>
    </Paper>
  );
};

const FullTimeEmployeeTemplate = () => {
  const [template, setTemplate] = useState(null);

  const handleCreateTemplate = (newTemplate) => {
    setTemplate(newTemplate);
  };

  return (
    <Container>
      <TemplateForm onCreateTemplate={handleCreateTemplate} />
      {template && <TemplateDisplay template={template} />}
    </Container>
  );
};

export default FullTimeEmployeeTemplate;