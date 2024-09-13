'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography,
    Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField, Checkbox, FormControlLabel, Grid, Box, Snackbar, Alert, Tabs, Tab
} from '@mui/material';
import { Edit, Clear as ClearIcon } from '@mui/icons-material';

const AllowancePage = () => {
    const isAdmin = true;
    const apiBaseUrl = 'http://localhost:8080/api';

    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [view, setView] = useState('allowances'); // 'allowances' or 'deductions'

    const [allowances, setAllowances] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentAllowance, setCurrentAllowance] = useState(null);
    const [currentDeduction, setCurrentDeduction] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [employeeNotFound, setEmployeeNotFound] = useState(false);

    const [employeeForm, setEmployeeForm] = useState({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        hireDate: '',
        status: '',
        jobId: '',
        departmentId: '',
        countryId: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeForm({ ...employeeForm, [name]: value });
    };

    const handleEmployeeChange = (event) => {
        const value = event.target.value;
        setSelectedEmployeeId(value);
    };

    const handleViewChange = (event, newValue) => {
        setView(newValue);
    };

    const handleAddAllowance = () => {
        const newAllowance = { id: Date.now(), allowanceId: Date.now(), name: 'New Allowance', description: '', isTaxable: false, isMandatory: false, amount: 0 };
        
        // Send a POST request to backend
        axios.post(`${apiBaseUrl}/allowances`, newAllowance)
            .then(response => {
                setAllowances([...allowances, response.data]);
            })
            .catch(error => console.error('Error adding allowance:', error));
    };

    const handleAddDeduction = () => {
        const newDeduction = { id: Date.now(), deductionId: Date.now(), name: 'New Deduction', description: '', isStatutory: false, isMandatory: false, amount: 0 };
        
        // Send a POST request to backend
        axios.post(`${apiBaseUrl}/deductions`, newDeduction)
            .then(response => {
                setDeductions([...deductions, response.data]);
            })
            .catch(error => console.error('Error adding deduction:', error));
    };

    const handleEditAllowance = (allowance) => {
        setCurrentAllowance(allowance);
        setEditDialogOpen(true);
    };

    const handleEditDeduction = (deduction) => {
        setCurrentDeduction(deduction);
        setEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (view === 'allowances') {
            setAllowances(allowances.map(allowance =>
                allowance.id === currentAllowance.id ? currentAllowance : allowance
            ));
        } else {
            setDeductions(deductions.map(deduction =>
                deduction.id === currentDeduction.id ? currentDeduction : deduction
            ));
        }
        setEditDialogOpen(false);
    };

    const handleDeleteAllowance = (id) => {
        axios.delete(`${apiBaseUrl}/allowances/${id}`)
            .then(() => {
                setAllowances(allowances.filter(allowance => allowance.id !== id));
            })
            .catch(error => console.error('Error deleting allowance:', error));
    };

    const handleDeleteDeduction = (id) => {
        axios.delete(`${apiBaseUrl}/deductions/${id}`)
            .then(() => {
                setDeductions(deductions.filter(deduction => deduction.id !== id));
            })
            .catch(error => console.error('Error deleting deduction:', error));
    };

    const getCurrencySymbol = (countryId) => {
        switch (countryId) {
            case 'US':
                return '$';
            case 'UK':
                return '£';
            case 'India':
                return '₹';
            default:
                return '$';
        }
    };

    const handleSubmit = () => {
        if (selectedEmployee) {
            // Send employee update request to backend
            axios.put(`${apiBaseUrl}/employees/${selectedEmployee.employeeId}`, employeeForm)
                .then(response => {
                    setSnackbarOpen(true);
                })
                .catch(error => {
                    console.error('Error updating employee:', error);
                });

            // Send allowances update request to backend
            axios.put(`${apiBaseUrl}/employees/${selectedEmployee.employeeId}/allowances`, allowances)
                .then(response => {
                    setAllowances(response.data);
                    setSnackbarOpen(true);
                })
                .catch(error => {
                    console.error('Error updating allowances:', error);
                });

            // Send deductions update request to backend
            axios.put(`${apiBaseUrl}/employees/${selectedEmployee.employeeId}/deductions`, deductions)
                .then(response => {
                    setDeductions(response.data);
                    setSnackbarOpen(true);
                })
                .catch(error => {
                    console.error('Error updating deductions:', error);
                });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const fetchAllowances = () => {
        axios.get(`${apiBaseUrl}/allowances`)
            .then(response => {
                setAllowances(response.data);
            })
            .catch(error => console.error('Error fetching allowances:', error));
    };

    const fetchDeductions = () => {
        axios.get(`${apiBaseUrl}/deductions`)
            .then(response => {
                setDeductions(response.data);
            })
            .catch(error => console.error('Error fetching deductions:', error));
    };

    const handleGetEmployee = () => {
        if (selectedEmployeeId) {
            axios.get(`${apiBaseUrl}/employees/${selectedEmployeeId}`)
                .then(response => {
                    const employee = response.data;
                    setSelectedEmployee(employee);
                    setEmployeeForm({
                        employeeId: employee.employeeId,
                        firstName: employee.firstName,
                        lastName: employee.lastName,
                        email: employee.email,
                        phone: employee.phone,
                        hireDate: employee.hireDate,
                        status: employee.status,
                        jobId: employee.jobId,
                        departmentId: employee.departmentId,
                        countryId: employee.countryId
                    });
                    fetchAllowances();
                    fetchDeductions();
                    setEmployeeNotFound(false);
                })
                .catch(error => {
                    console.error('Error fetching employee:', error);
                    setSelectedEmployee(null);
                    setAllowances([]);
                    setDeductions([]);
                    setEmployeeNotFound(true);
                });
        }
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Box mb={4} sx={{ backgroundColor: '#ffffff', padding: 3, borderRadius: 2, boxShadow: 3 }}>

                <Typography variant="h4" gutterBottom align="center" sx={{ color: '#2C3E50' }}>
                    Allowance and Deductions
                </Typography>

                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Employee ID"
                            value={selectedEmployeeId}
                            onChange={handleEmployeeChange}
                            disabled={!isAdmin}
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: 1,
                                '&:hover': {
                                    backgroundColor: '#ECF0F1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#BDC3C7',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#3498DB',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleGetEmployee} sx={{ backgroundColor: '#2980B9', color: '#ffffff', '&:hover': { backgroundColor: '#3498DB' } }}>
                            Get Employee
                        </Button>
                    </Grid>
                </Grid>

                {selectedEmployee ? (
                    <>
                        <Box sx={{ backgroundColor: '#f9f9f9', padding: 3, borderRadius: 2, boxShadow: 2, mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Employee Details
                            </Typography>
                            <Typography variant="body1">
                                <strong>Name:</strong> {employeeForm.firstName} {employeeForm.lastName}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Department:</strong> {employeeForm.departmentId}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Employee Type:</strong> {employeeForm.status}
                            </Typography>
                        </Box>

                        <Tabs
                            value={view}
                            onChange={handleViewChange}
                            aria-label="allowance-deduction-tabs"
                            centered
                        >
                            <Tab label="Allowances" value="allowances" />
                            <Tab label="Deductions" value="deductions" />
                        </Tabs>

                        <List>
                            {(view === 'allowances' ? allowances : deductions).map(item => (
                                <ListItem
                                    key={item.id}
                                    sx={{
                                        backgroundColor: '#ffffff',
                                        mb: 1,
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        '&:hover': {
                                            backgroundColor: '#ECF0F1',
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={item.name}
                                        secondary={
                                            <>
                                                {`Description: ${item.description}`}
                                                <br />
                                                {`Amount: ${item.amount}`}
                                            </>
                                        }
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                color: '#2C3E50',
                                            },
                                            '& .MuiListItemText-secondary': {
                                                color: '#7F8C8D',
                                            },
                                        }}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="edit" onClick={() => (view === 'allowances' ? handleEditAllowance(item) : handleEditDeduction(item))}>
                                            <Edit sx={{ color: '#3498DB' }} />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => (view === 'allowances' ? handleDeleteAllowance(item.id) : handleDeleteDeduction(item.id))}>
                                            <ClearIcon sx={{ color: '#C0392B' }} />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>

                        <Grid container spacing={2} justifyContent="center" mt={4}>
                            
                            <Grid item>
                                <Button variant="outlined" sx={{ color: '#ffffff', backgroundColor: '#27AE60', '&:hover': { backgroundColor: '#1E8449', color: '#ffffff' } }} onClick={view === 'allowances' ? handleAddAllowance : handleAddDeduction}>
                                    Add {view === 'allowances' ? 'Allowance' : 'Deduction'}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" sx={{ backgroundColor: '#2980B9', color: '#ffffff', '&:hover': { backgroundColor: '#3498DB' } }} onClick={handleSubmit}>
                                    Save Changes
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    employeeNotFound && (
                        <Typography variant="body1" sx={{ color: '#C0392B', textAlign: 'center', mt: 3 }}>
                            Employee is not available.
                        </Typography>
                    )
                )}
            </Box>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit {view === 'allowances' ? 'Allowance' : 'Deduction'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Modify the details of the selected {view === 'allowances' ? 'allowance' : 'deduction'}.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        value={view === 'allowances' ? currentAllowance?.name : currentDeduction?.name}
                        onChange={(e) => view === 'allowances' ? setCurrentAllowance({ ...currentAllowance, name: e.target.value }) : setCurrentDeduction({ ...currentDeduction, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        variant="outlined"
                        value={view === 'allowances' ? currentAllowance?.description : currentDeduction?.description}
                        onChange={(e) => view === 'allowances' ? setCurrentAllowance({ ...currentAllowance, description: e.target.value }) : setCurrentDeduction({ ...currentDeduction, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Amount"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={view === 'allowances' ? currentAllowance?.amount : currentDeduction?.amount}
                        onChange={(e) => view === 'allowances' ? setCurrentAllowance({ ...currentAllowance, amount: e.target.value }) : setCurrentDeduction({ ...currentDeduction, amount: e.target.value })}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={view === 'allowances' ? currentAllowance?.isTaxable : currentDeduction?.isStatutory}
                                onChange={(e) => view === 'allowances' ? setCurrentAllowance({ ...currentAllowance, isTaxable: e.target.checked }) : setCurrentDeduction({ ...currentDeduction, isStatutory: e.target.checked })}
                            />
                        }
                        label={view === 'allowances' ? "Taxable" : "Statutory"}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={view === 'allowances' ? currentAllowance?.isMandatory : currentDeduction?.isMandatory}
                                onChange={(e) => view === 'allowances' ? setCurrentAllowance({ ...currentAllowance, isMandatory: e.target.checked }) : setCurrentDeduction({ ...currentDeduction, isMandatory: e.target.checked })}
                            />
                        }
                        label="Mandatory"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    Changes saved successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AllowancePage;