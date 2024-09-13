"use client";
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, Snackbar, Grid, Card, CardContent, CardActions, MenuItem, InputAdornment } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios'; // Import axios for making API requests

const initialEmployeeState = {
  employeeId: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  hireDate: '',
  employeeType: '',
  jobId: null,
  departmentId: null,
  countryId: null,
};

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const countries = [
  'United States', 'Canada', 'India', 'United Kingdom'
];

const employeeTypes = [
  'PART_TIME', 'INTERN', 'FULL_TIME', 'FREELANCE', 'CONTRACT',
];

const departments = [
  'HR', 'Engineering', 'Sales', 'Marketing', 'Finance',
];

const departmentIdMap = {
  IT: 1,
  HR: 2,
  Finance: 3,
  Marketing: 4,
  Operations: 5,
};

const jobIdMap = {
  Developer: 1,
  Manager: 2,
  Designer: 3,
  Analyst: 4,
  Engineer: 5,
};

const countryIdMap = {
  'United States': 1,
  'Canada': 2,
  'India': 3,
  'United Kingdom': 4,
};

const EmployeeList = () => {
  const [employee, setEmployee] = useState(initialEmployeeState);
  const [employees, setEmployees] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState('+91');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEmployeeList, setShowEmployeeList] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAdd = async () => {
    try {
      const departmentId = departmentIdMap[employee.department];
      const jobId = jobIdMap[employee.job];
      const countryId = countryIdMap[employee.country];

      if (employee.firstName && employee.lastName && employee.email && employee.phone && employee.department && employee.job && employee.employeeType && employee.hireDate && employee.country) {
        const newEmployee = {
          ...employee,
          departmentId,
          jobId,
          countryId,
        };

        const response = await axios.post('http://localhost:8080/api/employees', newEmployee); // Replace with your actual API endpoint
        setEmployees(prev => [...prev, response.data]);
        clearForm();
        setSuccessMessage('Employee added successfully');
        setSnackbarOpen(true);
        setShowEmployeeList(false); // Hide employee list
      } else {
        setError('Please fill all fields');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setError('Failed to add employee');
      setSnackbarOpen(true);
    }
  };

  const handleUpdate = async () => {
    try {
      if (employee.firstName && employee.lastName && employee.email && employee.phone && employee.department && employee.job && employee.employeeType && employee.hireDate && employee.country) {
        const updatedEmployee = {
          ...employee,
          departmentId: departmentIdMap[employee.department],
          jobId: jobIdMap[employee.job],
          countryId: countryIdMap[employee.country],
        };

        const response = await axios.put(`http://localhost:8080/api/employees/${employee.employeeId}`, updatedEmployee); // Ensure the correct API endpoint
        setEmployees(prev => prev.map(emp => (emp.employeeId === employee.employeeId ? response.data : emp)));
        clearForm();
        setEditMode(false);
        setSuccessMessage('Employee updated successfully');
        setSnackbarOpen(true);
      } else {
        setError('Please fill all fields');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setError('Failed to update employee');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      if (employeeId) {
        await axios.delete(`http://localhost:8080/api/employees/${employeeId}`); 
        setEmployees(prev => prev.filter(emp => emp.employeeId !== employeeId));
        clearForm();
        setEditMode(false);
        setSuccessMessage('Employee deleted successfully');
        setSnackbarOpen(true);
      } else {
        setError('Please select an employee to delete');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setError('Failed to delete employee');
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (employee) => {
    setEmployee({
      ...employee,
      department: Object.keys(departmentIdMap).find(key => departmentIdMap[key] === employee.departmentId),
      job: Object.keys(jobIdMap).find(key => jobIdMap[key] === employee.jobId),
      country: Object.keys(countryIdMap).find(key => countryIdMap[key] === employee.countryId),
    });
    setEditMode(true);
  };

  const clearForm = () => {
    setEmployee(initialEmployeeState);
    setEditMode(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && !/^\d*$/.test(value)) {
      return;
    }
    setEmployee(prev => ({ ...prev, [name]: value }));

    if (name === 'country') {
      const prefixMap = {
        'India': '+91', 'United States': '+1', 'United Kingdom': '+44',
        'Canada': '+1', 'Australia': '+61', 'Germany': '+49',
        'France': '+33', 'Japan': '+81', 'China': '+86', 'Brazil': '+55',
      };
      setPhonePrefix(prefixMap[value]);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleGetAllEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/employees'); // Replace with your actual API endpoint
      const sortedEmployees = response.data.sort((a, b) => a.firstName.localeCompare(b.firstName)); // Sort employees by first name
      setEmployees(sortedEmployees); // Set sorted employees
      setShowEmployeeList(true); // Show employee list
    } catch (error) {
      setError('Failed to fetch employees');
      setSnackbarOpen(true);
    }
  };

  if (isLoading) return null;

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom color="primary">Employee Management</Typography>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          {['firstName', 'lastName', 'email', 'hireDate'].map((field, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TextField
                fullWidth
                variant="outlined"
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                name={field}
                value={employee[field]}
                onChange={handleChange}
                type={field === 'email' ? 'email' : field.includes('Date') ? 'date' : 'text'}
                sx={{ width: '100%', mb: 2 }}
                InputLabelProps={field.includes('Date') ? { shrink: true } : {}}
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Employee Type"
              name="employeeType"
              select
              value={employee.employeeType}
              onChange={handleChange}
              sx={{ width: '100%', mb: 2 }}
            >
              {employeeTypes.map((type, index) => (
                <MenuItem key={index} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Department"
              name="department"
              select
              value={employee.department}
              onChange={handleChange}
              sx={{ width: '100%', mb: 2 }}
            >
              {Object.keys(departmentIdMap).map((department, index) => (
                <MenuItem key={index} value={department}>{department}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Job"
              name="job"
              select
              value={employee.job}
              onChange={handleChange}
              sx={{ width: '100%', mb: 2 }}
            >
              {Object.keys(jobIdMap).map((job, index) => (
                <MenuItem key={index} value={job}>{job}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Country"
              name="country"
              select
              value={employee.country}
              onChange={handleChange}
              sx={{ width: '100%', mb: 2 }}
            >
              {countries.map((country, index) => (
                <MenuItem key={index} value={country}>{country}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Phone Number"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              type="tel"
              inputProps={{ pattern: '[0-9]*', maxLength: 15, minLength: 10 }}
              sx={{ width: '100%', mb: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">{phonePrefix}</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {!editMode && (
          <Button variant="contained" color="primary" onClick={handleAdd}>Add Employee</Button>
        )}
        {editMode && (
          <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
        )}
        {!editMode && (
          <Button variant="contained" color="secondary" onClick={handleGetAllEmployees}>Get All Employees</Button>
        )}
      </Box>
      {showEmployeeList && !editMode && employees.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {employees.map((emp) => (
            <Card key={emp.employeeId} sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{emp.firstName} {emp.lastName}</Typography>
                <Typography variant="body2">ID: {emp.employeeId}</Typography>
                <Typography variant="body2">Email: {emp.email}</Typography>
                <Typography variant="body2">Phone: {emp.phone}</Typography>
                <Typography variant="body2">Department: {Object.keys(departmentIdMap).find(key => departmentIdMap[key] === emp.departmentId)}</Typography>
                <Typography variant="body2">Job: {Object.keys(jobIdMap).find(key => jobIdMap[key] === emp.jobId)}</Typography>
                <Typography variant="body2">Employee Type: {emp.employeeType}</Typography>
                <Typography variant="body2">Country: {Object.keys(countryIdMap).find(key => countryIdMap[key] === emp.countryId)}</Typography>
                <Typography variant="body2">Status: {emp.status}</Typography>
                <Typography variant="body2">Hire Date: {emp.hireDate}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleEdit(emp)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(emp.employeeId)}>Delete</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeeList;