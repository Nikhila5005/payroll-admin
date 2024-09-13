'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Grid, Box, Paper, Input, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { pdf, Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { toWords } from 'number-to-words';
import UploadFileIcon from '@mui/icons-material/UploadFile';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';

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

// Register the Calibri font
Font.register({
    family: 'Calibri',
    src: '/fonts/Calibri-Bold.ttf',
});

const API_BASE_URL='http://localhost:8080';

const formatJoiningDate = (dateString) => {
    const date = dayjs(dateString);
    if (!date.isValid()) return ''; // Check if the date is valid
    const day = date.date().toString().padStart(2, '0');
    const month = date.format('MMM');
    const year = date.format('YY');
    return `${day}-${month}-${year}`;
};

const getDepartmentName = (id) => {
  return Object.keys(departmentIdMap).find(key => departmentIdMap[key] === parseInt(id)) || '';
};

const getPositionName = (id) => {
  return Object.keys(jobIdMap).find(key => jobIdMap[key] === parseInt(id)) || '';
};

const PayslipForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        companyAddress: '',
        logo: '',
        payslipForMonth: '',
        name: '',
        month: '', // Initially empty
        year: '',  // Initially empty
        employeeId: '',
        dateOfJoining: '',
        formattedJoiningDate: '',
        department: '',
        position: '',
        daysPaid: '',
        totalDays: '',
        lop: '',
        panNumber: '',
        epfUanNumber: '',
        bankAccount: '',
        companyLogo: '',
        basicSalary: '',
        hra: '',
        medicalAllowance: '',
        transportAllowance: '',
        otherAllowances: '',
        totalEarnings: '',
        taxDeductions: '',
        providentFund: '',
        professionalTax: '',
        esi: '',
        tds: '',
        otherDeductions: '',
        totalDeductions: '',
        formattedMonthYear: '',
    });

    const [errors, setErrors] = useState({});
    const [selectedDate, setSelectedDate] = useState(null); // Initially null

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setFormData({
                companyName: localStorage.getItem('companyName') || '',
                companyAddress: localStorage.getItem('companyAddress') || '',
                logo: localStorage.getItem('logo') || '',
                payslipForMonth: '',
                name: '',
                month: '', // Initially empty
                year: '',  // Initially empty
                employeeId: '',
                dateOfJoining: '',
                formattedJoiningDate: '',
                department: '',
                position: '',
                daysPaid: '',
                totalDays: '',
                lop: '',
                panNumber: '',
                epfUanNumber: '',
                bankAccount: '',
                companyLogo: '',
                basicSalary: '',
                hra: '',
                medicalAllowance: '',
                transportAllowance: '',
                otherAllowances: '',
                totalEarnings: '',
                taxDeductions: '',
                providentFund: '',
                professionalTax: '',
                esi: '',
                tds: '',
                otherDeductions: '',
                totalDeductions: '',
                formattedMonthYear: '',
            });
        }
    }, []);

    useEffect(() => {
        if (selectedDate) {
            const daysInMonth = selectedDate.daysInMonth();
            setFormData((prevData) => ({
                ...prevData,
                totalDays: daysInMonth.toString(),
            }));
        }
    }, [selectedDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = '';

        // Validation logic
        if (name === 'daysPaid' || name === 'totalDays' || name === 'lop') {
            if (!/^\d+$/.test(value)) {
                error = 'Please enter a valid number';
            } else if (selectedDate && (parseInt(value) < 0 || parseInt(value) > selectedDate.daysInMonth())) {
                error =`Please enter a valid day (0-${selectedDate.daysInMonth()})`;
            }
        } else if (name === 'dateOfJoining') {
            if (!dayjs(value, 'YYYY-MM-DD', true).isValid()) {
                error = 'Please enter a valid date (YYYY-MM-DD)';
            }
        } else if (name === 'bankAccount') {
            if (!/^\d{9,18}$/.test(value)) {
                error = 'Please enter a valid bank account number (9-18 digits)';
            }
        } else if (name === 'panNumber') {
            if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) {
                error = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
            }
        } else if (['basicSalary', 'hra', 'medicalAllowance', 'transportAllowance', 'otherAllowances', 'providentFund', 'professionalTax', 'esi', 'tds', 'otherDeductions'].includes(name)) {
            if (!/^\d*\.?\d*$/.test(value)) {
                error = 'Please enter a valid number';
            }
        }

        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: name === 'panNumber' ? value.toUpperCase() : value,
            };

            if (name === 'lop' || name === 'totalDays') {
                const lop = parseInt(updatedData.lop || '0');
                if (name === 'lop' && parseInt(value) < 0) {
                    updatedData.lop = '0';
                } else {
                    updatedData.lop = value;
                }
                const totalDays = parseInt(updatedData.totalDays || '0');
                updatedData.daysPaid = (totalDays - lop).toString();
                const lpa = parseInt(updatedData.lpa || '0');
                const dailyRate30 = (lpa * 100000) / 12 / 30;
                const dailyRate31 = (lpa * 100000) / 12 / 31;

                if (updatedData.totalDays === '30') {
                    updatedData.basicSalary = (parseFloat(updatedData.daysPaid) * 416.66).toFixed(2);
                    updatedData.hra = (parseFloat(updatedData.basicSalary) * 0.4).toFixed(2);
                    updatedData.medicalAllowance = (parseFloat(updatedData.basicSalary) * 0.1).toFixed(2);
                    updatedData.transportAllowance = (parseFloat(updatedData.basicSalary) * 0.1).toFixed(2);
                    updatedData.otherAllowances = (parseFloat(updatedData.basicSalary) * 0.4).toFixed(2);
                    updatedData.providentFund = (parseFloat(updatedData.basicSalary) * 0.128).toFixed(2);
                    updatedData.professionalTax = 200;
                    updatedData.esi = 0;
                    updatedData.tds = 0;
                    updatedData.otherDeductions = 0;

                    // Add the updated fields to totalEarnings
                    updatedData.totalEarnings = (
                        parseFloat(updatedData.basicSalary) +
                        parseFloat(updatedData.hra) +
                        parseFloat(updatedData.medicalAllowance) +
                        parseFloat(updatedData.transportAllowance) +
                        parseFloat(updatedData.otherAllowances)
                    ).toFixed(2);
                } else if (updatedData.totalDays === '31') {
                    updatedData.basicSalary = (parseFloat(updatedData.daysPaid) * 403.225).toFixed(2);
                    updatedData.hra = (parseFloat(updatedData.basicSalary) * 0.4).toFixed(2);
                    updatedData.medicalAllowance = (parseFloat(updatedData.basicSalary) * 0.1).toFixed(2);
                    updatedData.transportAllowance = (parseFloat(updatedData.basicSalary) * 0.1).toFixed(2);
                    updatedData.otherAllowances = (parseFloat(updatedData.basicSalary) * 0.4).toFixed(2);
                    updatedData.providentFund = (parseFloat(updatedData.basicSalary) * 0.128).toFixed(2);
                    updatedData.professionalTax = 200;
                    updatedData.esi = 0;
                    updatedData.tds = 0;
                    updatedData.otherDeductions = 0;

                    // Add the updated fields to totalEarnings
                    updatedData.totalEarnings = (
                        parseFloat(updatedData.basicSalary) +
                        parseFloat(updatedData.hra) +
                        parseFloat(updatedData.medicalAllowance) +
                        parseFloat(updatedData.transportAllowance) +
                        parseFloat(updatedData.otherAllowances)
                    ).toFixed(2);
                }

                // Calculate totalDeductions
                updatedData.totalDeductions = (
                    parseFloat(updatedData.providentFund) +
                    parseFloat(updatedData.professionalTax) +
                    parseFloat(updatedData.esi) +
                    parseFloat(updatedData.tds) +
                    parseFloat(updatedData.otherDeductions)
                ).toFixed(2);
            }
            return updatedData;
        });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    const logo = e.target.result;
                    setFormData((prevData) => ({ ...prevData, logo }));
                    localStorage.setItem('logo', logo); // Save logo to local storage
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.companyName) newErrors.companyName = 'Company Name is required';
        if (!formData.companyAddress) newErrors.companyAddress = 'Company Address is required';
        if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
        if (!formData.name) newErrors.name = 'Employee Name is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.position) newErrors.position = 'Designation is required';
        if (!formData.dateOfJoining) newErrors.dateOfJoining = 'Date of Joining is required';
        if (!formData.bankAccount) newErrors.bankAccount = 'Account Number is required';
        if (!formData.panNumber) newErrors.panNumber = 'PAN Number is required';
        if (!formData.daysPaid) newErrors.daysPaid = 'No. of Paid days is required';
        if (!formData.totalDays) newErrors.totalDays = 'Total Days is required';
        if (!formData.lop) newErrors.lop = 'LOP is required';
        // Add more validations as needed

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formattedJoiningDate = formatJoiningDate(formData.dateOfJoining) || '';
        const formattedMonthYear = selectedDate ? selectedDate.format('MMMM YYYY') : dayjs().format('MMMM YYYY');

        // Save company name and address to local storage
        localStorage.setItem('companyName', formData.companyName);
        localStorage.setItem('companyAddress', formData.companyAddress);

        onSubmit({ ...formData, formattedJoiningDate, formattedMonthYear });
    };

    const handleDateChange = (date) => {
        if (date) {
            const month = date.month() + 1; // Dayjs method to get month
            const year = date.year(); // Dayjs method to get year
            setFormData({ ...formData, month: month.toString().padStart(2, '0'), year: year.toString() });
        } else {
            setFormData({ ...formData, month: '', year: '' });
        }
        setSelectedDate(date);
    };

    const handleEmployeeIdChange = async (e) => {
        const employeeId = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            employeeId,
        }));

        if (employeeId) {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/employees/${employeeId}`);
                const employeeDetails = response.data;
                setFormData((prevData) => ({
                    ...prevData,
                    employeeId,
                    name: `${employeeDetails.firstName} ${employeeDetails.lastName}`,
                    dateOfJoining: employeeDetails.hireDate,
                    department: employeeDetails.departmentId,
                    position: employeeDetails.jobId,
                }));

                // Fetch sensitive information
                const sensitiveInfoResponse = await axios.get(`${API_BASE_URL}/api/employees/${employeeId}/sensitive-info`);
                const sensitiveInfo = sensitiveInfoResponse.data;
                setFormData((prevData) => ({
                    ...prevData,
                    bankAccount: sensitiveInfo.bankAccount,
                    panNumber: sensitiveInfo.panNumber,
                }));
            } catch (error) {
                console.error('Error fetching employee details:', error);
                // Handle error appropriately
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, p: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#124E66' }}>
                Generate Payslip
            </Typography>
            <Grid container spacing={3}>
                <Grid container item xs={12} spacing={5}>
                    <Grid item xs={12} sm={4}>
                        <Button variant="contained" sx={{
                            padding: '20px 20px 15px',
                            backgroundColor: formData.logo ? 'white' : '#124E66',
                            color: formData.logo ? '#124E66' : 'white',
                            '&:hover': {
                                backgroundColor: formData.logo ? 'white' : 'white',
                                color: formData.logo ? '#124E66' : '#124E66'
                            },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '50%',
                            height: '100%'
                        }} onClick={() => document.getElementById('uploadLogo')?.click()}>
                            {formData.logo ? (
                                <img src={formData.logo} alt="Logo" style={{ width: '100%', height: '100%' }} />
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
                    <Grid item xs={12} sm={4} sx={{ textAlign: 'left', marginLeft: -17, marginTop: 4 }}>
                        {formData.logo ? (
                            <Button variant="outlined" color="secondary" onClick={() => setFormData({ ...formData, logo: '' })}>
                                Remove Logo
                            </Button>
                        ) : (
                            <Typography variant="body1">
                                Upload Logo (240x240 pixels, max 1MB)
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: 'center', marginTop: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year', 'month']}
                                openTo="month"
                                label="Select Month and Year"
                                value={selectedDate}
                                onChange={handleDateChange}
                                textField={(params) => <TextField {...params} />}
                                inputFormat="MM/YYYY"
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="companyName"
                            label="Company Name"
                            fullWidth
                            value={formData.companyName}
                            onChange={handleChange}
                            error={!!errors.companyName}
                            helperText={errors.companyName}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="companyAddress"
                            label="Company Address"
                            fullWidth
                            value={formData.companyAddress}
                            onChange={handleChange}
                            error={!!errors.companyAddress}
                            helperText={errors.companyAddress}
                            required
                        />
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="employeeId"
                            label="Employee ID"
                            fullWidth
                            value={formData.employeeId}
                            onChange={handleEmployeeIdChange}
                            error={!!errors.employeeId}
                            helperText={errors.employeeId}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="name"
                            label="Employee Name"
                            fullWidth
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                        />
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="department"
                            label="Department"
                            fullWidth
                            value={getDepartmentName(formData.department)}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="position"
                            label="Designation"
                            fullWidth
                            value={getPositionName(formData.position)}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="dateOfJoining"
                            label="Date of Joining"
                            type="date"
                            fullWidth
                            value={formData.dateOfJoining}
                            onChange={handleChange}
                            error={!!errors.dateOfJoining}
                            helperText={errors.dateOfJoining}
                            InputLabelProps={{ shrink: true }} // Show the date format after selecting the field
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="bankAccount"
                            label="Account Number"
                            fullWidth
                            value={formData.bankAccount}
                            onChange={handleChange}
                            error={!!errors.bankAccount}
                            helperText={errors.bankAccount}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="panNumber"
                            label="PAN Number"
                            fullWidth
                            value={formData.panNumber}
                            onChange={handleChange}
                            error={!!errors.panNumber}
                            helperText={errors.panNumber}
                            required
                        />
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="totalDays"
                            label="Total Days"
                            type="number"
                            fullWidth
                            value={formData.totalDays}
                            onChange={handleChange}
                            error={!!errors.totalDays}
                            helperText={errors.totalDays}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="lop"
                            label="LOP"
                            type="number"
                            fullWidth
                            value={formData.lop}
                            onChange={handleChange}
                            error={!!errors.lop}
                            helperText={errors.lop}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="daysPaid"
                            label="No. of Paid Days"
                            type="number"
                            fullWidth
                            value={formData.daysPaid}
                            onChange={handleChange}
                            error={!!errors.daysPaid}
                            helperText={errors.daysPaid}
                            required
                        />
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="basicSalary"
                            label="Basic Salary"
                            fullWidth
                            value={formData.basicSalary === '' ? '' : Math.round(formData.basicSalary)}
                            onChange={handleChange}
                            error={!!errors.basicSalary}
                            helperText={errors.basicSalary}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="hra"
                            label="House Rent Allowance"
                            fullWidth
                            value={formData.hra === '' ? '' : Math.round(formData.hra)}
                            onChange={handleChange}
                            error={!!errors.hra}
                            helperText={errors.hra}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="medicalAllowance"
                            label="Medical Allowance"
                            fullWidth
                            value={formData.medicalAllowance === '' ? '' : Math.round(formData.medicalAllowance)}
                            onChange={handleChange}
                            error={!!errors.medicalAllowance}
                            helperText={errors.medicalAllowance}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="transportAllowance"
                            label="Transport Allowance"
                            fullWidth
                            value={formData.transportAllowance === '' ? '' : Math.round(formData.transportAllowance)}
                            onChange={handleChange}
                            error={!!errors.transportAllowance}
                            helperText={errors.transportAllowance}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="otherAllowances"
                            label="Other Allowances"
                            fullWidth
                            value={formData.otherAllowances === '' ? '' : Math.round(formData.otherAllowances)}
                            onChange={handleChange}
                            error={!!errors.otherAllowances}
                            helperText={errors.otherAllowances}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="providentFund"
                            label="Provident Fund"
                            fullWidth
                            value={formData.providentFund === '' ? '' : Math.round(formData.providentFund)}
                            onChange={handleChange}
                            error={!!errors.providentFund}
                            helperText={errors.providentFund}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="professionalTax"
                            label="Professional Tax"
                            fullWidth
                            value={formData.professionalTax === '' ? '' : Math.round(formData.professionalTax)}
                            onChange={handleChange}
                            error={!!errors.professionalTax}
                            helperText={errors.professionalTax}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="esi"
                            label="ESI"
                            fullWidth
                            value={formData.esi === '' ? '' : Math.round(formData.esi)}
                            onChange={handleChange}
                            error={!!errors.esi}
                            helperText={errors.esi}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="tds"
                            label="TDS"
                            fullWidth
                            value={formData.tds === '' ? '' : Math.round(formData.tds)}
                            onChange={handleChange}
                            error={!!errors.tds}
                            helperText={errors.tds}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="otherDeductions"
                            label="Other Deductions"
                            fullWidth
                            value={formData.otherDeductions === '' ? '' : Math.round(formData.otherDeductions)}
                            onChange={handleChange}
                            error={!!errors.otherDeductions}
                            helperText={errors.otherDeductions}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="totalEarnings"
                            label="Total Earnings"
                            fullWidth
                            value={formData.totalEarnings === '' ? '' : Math.round(formData.totalEarnings)}
                            onChange={handleChange}
                            error={!!errors.totalEarnings}
                            helperText={errors.totalEarnings}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="totalDeductions"
                            label="Total Deductions"
                            fullWidth
                            value={formData.totalDeductions === '' ? '' : Math.round(formData.totalDeductions)}
                            onChange={handleChange}
                            error={!!errors.totalDeductions}
                            helperText={errors.totalDeductions}
                        />
                    </Grid>

                </Grid>

                <Grid container item xs={12} justifyContent="center" spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: '#124E66',
                                color: 'white',
                                '&:hover': { backgroundColor: '#0D3B4D' },
                                whiteSpace: 'nowrap', // Added to keep the text in a single line
                            }}
                        >
                            View Payslip
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};




// PDFDocument component
const PDFDocument = ({ formData, totalEarnings, totalDeductions }) => {
    const styles = {
        page: {
            padding: 30,
            fontSize: 12,
            fontFamily: 'Helvetica',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#124E66',
            textAlign: 'center',
            marginBottom: 10,
        },
        subtitle: {
            fontSize: 14,
            marginBottom: 5,
            textAlign: 'center', // Center align subtitle
        },
        section: {
            marginBottom: 20,
        },
        table: {
            display: 'flex',
            width: 'auto',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#bfbfbf',
            borderRightWidth: 0,
            borderBottomWidth: 0,
        },
        tableRow: {
            flexDirection: 'row',
        },
        tableCol: {
            width: '50%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#bfbfbf',
            borderLeftWidth: 0,
            borderTopWidth: 0,
            padding: 5,
            textAlign: 'left', // Align table data to left
        },
        tableColHeader: {
            width: '50%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#bfbfbf',
            borderLeftWidth: 0,
            borderTopWidth: 0,
            padding: 5,
            textAlign: 'left', // Align table headings to left
        },
        tableCell: {
            margin: 'auto',
            marginTop: 5,
            fontSize: 10,
        },
        note: {
            fontSize: 10,
            textAlign: 'center',
            marginTop: 20,
            color: 'gray',
        },
        logo: {
            width: 100,
            height: 100,
        },
        address: {
            textAlign: 'right',
            fontSize: 10,
            fontWeight: 'bold', // Bold font for address
        },
        earningsDeductionsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        earningsDeductionsSection: {
            width: '48%',
        },
    };
  
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {formData.logo && <Image style={styles.logo} src={formData.logo} />}
                    <View style={[styles.address, { alignItems: 'flex-end' }]}>
                        <Text style={{ fontSize: 18, color: '#3480eb', fontWeight: 'bold' }}>{formData.companyName}</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={[styles.gridItem, { fontSize: 6, color: 'black' }]}>{formData.companyAddressLine1}</Text>
                            <Text style={[styles.gridItem, { fontSize: 6, color: 'black' }]}>{formData.companyAddressLine2}</Text>
                            <Text style={[styles.gridItem, { fontSize: 6, color: 'black' }]}>{formData.companyAddress}</Text> {/* Added company address */}
                        </View>
                    </View>
                </View>
                <Text style={styles.title}>Payslip - {formData.month}</Text>
  
                <View style={styles.section}>
                    <Text style={[styles.subtitle, { backgroundColor: '#3480eb', color: 'white', padding: 3 }]}>Employee Details</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableColHeader}>Employee Name</Text>
                            <Text style={styles.tableCol}>{formData.name}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableColHeader}>Employee ID</Text>
                            <Text style={styles.tableCol}>{formData.employeeId}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableColHeader}>Date of Joining</Text>
                            <Text style={[styles.tableCol, { minWidth: 100 }]}>{formData.dateOfJoining || 'N/A'}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableColHeader}>Department</Text>
                            <Text style={styles.tableCol}>{formData.department}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableColHeader}>Designation</Text>
                            <Text style={styles.tableCol}>{formData.position}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableColHeader}>Pay Period</Text>
                            <Text style={styles.tableCol}>{formData.month} {formData.year}</Text>
                        </View>
                    </View>
                </View>
  
                <View style={styles.earningsDeductionsContainer}>
                    <View style={styles.earningsDeductionsSection}>
                        <Text style={[styles.subtitle, { backgroundColor: '#3480eb', color: 'white', padding: 3 }]}>Earnings</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>Basic Salary</Text>
                                <Text style={styles.tableCol}>{formData.basicSalary}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>HRA</Text>
                                <Text style={styles.tableCol}>{formData.hra}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>Medical Allowance</Text>
                                <Text style={styles.tableCol}>{formData.medicalAllowance}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>Transport Allowance</Text>
                                <Text style={styles.tableCol}>{formData.transportAllowance}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>Other Allowances</Text>
                                <Text style={styles.tableCol}>{formData.otherAllowances}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>Total Earnings</Text>
                                <Text style={styles.tableCol}>{totalEarnings}</Text>
                            </View>
                        </View>
                    </View>
  
                    <View style={styles.earningsDeductionsSection}>
                        <Text style={[styles.subtitle, { backgroundColor: '#3480eb', color: 'white', padding: 3 }]}>Deductions</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>Provident Fund</Text>
                                <Text style={styles.tableCol}>{formData.providentFund}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>Professional Tax</Text>
                                <Text style={styles.tableCol}>{formData.professionalTax}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>ESI</Text>
                                <Text style={styles.tableCol}>{formData.esi}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>TDS</Text>
                                <Text style={styles.tableCol}>{formData.tds}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>Other Deductions</Text>
                                <Text style={styles.tableCol}>{formData.otherDeductions}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableColHeader}>Total Deductions</Text>
                                <Text style={styles.tableCol}>{totalDeductions}</Text>
                            </View>
                        </View>
                    </View>
                </View>
  
                <View style={[styles.section, { alignItems: 'center', marginTop: 20 }]}>
                    <Text style={styles.subtitle}>Net Pay: {totalEarnings - totalDeductions}</Text>
                    <Text style={styles.subtitle}>Net Pay : {numberToWords(totalEarnings - totalDeductions)}</Text>
                </View>
  
                <View style={{ position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', paddingBottom: 10 }}>
                    <Text style={styles.note}>
                        This is a computer-generated document. No signature is required.
                    </Text>
                </View>
            </Page>
        </Document>
    );
  };
  
  // Helper function to convert number to words
  const numberToWords = (num) => {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
      const convertLessThanOneThousand = (n) => {
          if (n >= 100) {
              return ones[Math.floor(n / 100)] + ' Hundred ' + convertLessThanOneThousand(n % 100);
          }
          if (n >= 20) {
              return tens[Math.floor(n / 10)] + ' ' + ones[n % 10];
          }
          if (n >= 10) {
              return teens[n - 10];
          }
          return ones[n];
      };
  
      if (num === 0) return 'Zero';
  
      let rupees = Math.floor(num);
      const paise = Math.round((num - rupees) * 100);
  
      let result = '';
  
      if (rupees > 0) {
          if (rupees >= 10000000) {
              result += convertLessThanOneThousand(Math.floor(rupees / 10000000)) + ' Crore ';
              rupees %= 10000000;
          }
          if (rupees >= 100000) {
              result += convertLessThanOneThousand(Math.floor(rupees / 100000)) + ' Lakh ';
              rupees %= 100000;
          }
          if (rupees >= 1000) {
              result += convertLessThanOneThousand(Math.floor(rupees / 1000)) + ' Thousand ';
              rupees %= 1000;
          }
          result += convertLessThanOneThousand(rupees);
          result += ' Rupees';
      }
  
      if (paise > 0) {
          result += ' and ' + convertLessThanOneThousand(paise) + ' Paise';
      }
  
      return result.trim();
  };



// Parent component
const ParentComponent = () => {
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleFormSubmit = async (formData) => {
        const doc = <PDFDocument formData={formData} totalEarnings={parseFloat(formData.totalEarnings)} totalDeductions={parseFloat(formData.totalDeductions)} />;
        const asPdf = pdf();
        asPdf.updateContainer(doc);
        const blob = await asPdf.toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        window.open(url, '_blank');
    };

    return (
        <Container component="main" maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <PayslipForm onSubmit={handleFormSubmit} />
            </Paper>
        </Container>
    );
};


export default ParentComponent;


