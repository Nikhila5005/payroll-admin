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

    const styles = StyleSheet.create({
        page: {
            paddingTop: 50,
            paddingRight: 100,
            paddingBottom: 100,
            paddingLeft: 70,
            fontSize: 12, // Changed font size to 12
            fontFamily: 'Calibri',
            fontWeight: 'bold', // Made font bold
        },
        header: {
            fontSize: 8.5, // Changed font size to 12
            marginTop: 9,
            textAlign: 'center',
            marginBottom: -10,
            marginLeft: 5,
            color: '#000', // Changed color to dark black
            fontFamily: 'Calibri',
            fontWeight: 'bold', // Made font bold
        },
        subHeader: {
            fontSize: 10.5,
            marginTop: 11,
            marginBottom: 10,
            marginLeft: 7,
            textAlign: 'center',
            color: '#000', // Changed color to dark black
            fontWeight: 'bold', // Made font bold
        },
        logo: {
            width: 33, // Increased width
            height: 30, // Maintained the height similar to width
            marginRight: 343, // Moved to left
            marginTop: 11,
        },
        companyName: {
            fontSize: 17.4,
            color: '#0070C0',
            textAlign: 'center',
            marginTop: -22,
            marginLeft: 10,
            marginRight: 0,
            fontFamily: 'Calibri',
            fontWeight: 'bold',
        },
        companyInfo: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
        },
        companyDetails: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },

        summaryColumn: {
            flex: 1,
            marginTop: 10,
            marginRight: -40,
            marginBottom: 25, // Increased margin bottom for more gap
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15,
        },
        summaryLabel: {
            fontSize: 10,
            color: '#000',
            flexBasis: '45%',
            textAlign: 'left',
            paddingLeft: 18,
            fontWeight: 'bold',
            fontFamily: 'Calibri',
        },
        summarySeparator: {
            fontSize: 10,
            color: '#000',
            textAlign: 'left',
            marginLeft: 20,
            fontWeight: 'bold',
            fontFamily: 'Calibri',
        },
        summaryValue: {
            fontSize: 10,
            color: '#000',
            flexBasis: '80%',
            textAlign: 'center',
            marginLeft: -30,
            fontWeight: 'bold',
            fontFamily: 'Calibri',
            flexWrap: 'wrap', // Allow wrapping
        },

        summaryRowWide: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15, // Increased margin bottom for more gap
            width: '100%',
            flexWrap: 'nowrap',
        },
        netPayContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textAlign: 'left',
            marginRight: 40,
            marginTop: -10,
        },
        netPayAmount: {
            fontSize: 10, // Changed font size to 12
            color: '#000', // Changed color to dark black
            marginLeft: 35, // Adjusted to move net amount a bit to the right
            fontWeight: 'bold', // Made font bold
            fontFamily: 'Calibri',
        },
        netPayLabel: {
            fontSize: 10, // Changed font size to 12
            color: '#000', // Changed color to dark black
            marginRight: 35, // Adjust padding to decrease space between label and amount
            marginLeft: 14, // Add padding to the left
            fontWeight: 'bold', // Made font bold
            fontFamily: 'Calibri',
        },
        wordsContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 10,
            marginLeft: 10,
        },
        wordsLabel: {
            fontSize: 10, // Changed font size to 12
            color: '#000', // Changed color to dark black
            marginRight: 7, // Adjust padding to decrease space between label and amount
            marginLeft: 4,
            fontWeight: 'bold', // Made font bold
            fontFamily: 'Calibri',
        },
        wordsAmount: {
            fontSize: 10, // Changed font size to 12
            color: '#000', // Changed color to dark black
            fontWeight: 'bold', // Made font bold
            fontFamily: 'Calibri',
        },

        daysInfo: {
            fontSize: 12, // Changed font size to 12
            color: '#000', // Changed color to dark black
            textAlign: 'left',
            fontWeight: 'bold', // Made font bold
            fontFamily: 'Calibri',
        },
        daysInfoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
        },
        tableContainer: {
            flexDirection: 'row',
            marginBottom: 20,
            marginTop: -55,
        },
        table: {
            width: '100%',
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 0,
            overflow: 'hidden',
            marginBottom: 20,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: '#A6A6A6',
            borderBottomWidth: 1,
            borderBottomColor: '#000',
            paddingHorizontal: 10,
        },
        tableHeaderCell: {
            fontSize: 10,
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'left',
            fontFamily: 'Calibri',
        },
        tableRow: {
            flexDirection: 'row',
            paddingHorizontal: 10,
            alignItems: 'center',

        },
        tableCell: {
            fontSize: 10,
            textAlign: 'left',
            fontWeight: 'bold',
            paddingHorizontal: 2,
            overflow: 'hidden',
            flex: 2,
            fontFamily: 'Calibri',
            marginLeft: 6,
            marginRight: -9,
            marginTop: 2,
        },
        tableCells: {
            fontSize: 10,
            textAlign: 'left',
            fontWeight: 'bold',
            marginLeft: -25,
            flex: 2,
            fontFamily: 'Calibri',
        },
        tableCellAmount: {
            fontSize: 10,
            textAlign: 'right',
            fontWeight: 'bold',
            marginRight: 40,
            flex: 1,
            fontFamily: 'Calibri',
        },
        tableCellAmounts: {
            fontSize: 10,
            textAlign: 'right',
            fontWeight: 'bold',
            marginRight: -9,
            flex: 1,
            fontFamily: 'Calibri',
            bottom: -4,
            marginTop: -10,
        },
        toalCellAmount: {
            fontSize: 9,
            textAlign: 'right',
            fontWeight: 'bold',
            marginRight: -9,
            flex: 1,
            fontFamily: 'Calibri',
            bottom: -4,
            marginTop: -2,
        },
        totalRow: {
            flexDirection: 'row',
        },
        totalCell: {
            fontSize: 10,
            textAlign: 'left',
            fontWeight: 'bold',
            marginTop: 10,
            fontFamily: 'Calibri',
            marginLeft: 8,
            marginBottom: -7,
        },
        note: {
            fontSize: 8.5,
            textAlign: 'left',
            marginTop: 20,
            color: '#000',
            marginLeft: 14,
            fontFamily: 'Calibri',
        },
        verticalLine: {
            borderLeftColor: '#000',
            borderLeftWidth: 1,
            marginTop: -150,
            height: '162%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: -985,
        },




        employeeSummary: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 50,
            marginTop: -25,
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
        },
        column: {
            display: 'flex',
            flexDirection: 'row',
            width: '50%',
            marginLeft: '5%',
        },
        label: {
            width: '40%', // Increase width to prevent truncation
            textAlign: 'left',
            fontSize: 10,
            whiteSpace: 'nowrap', // Keep the text in a single line
            marginBottom: 5,
            marginTop: 3,
        },
        labels: {
            width: '35%', // Increase width to prevent truncation
            textAlign: 'left',
            fontSize: 10,
            whiteSpace: 'nowrap', // Keep the text in a single line
            marginBottom: 5,
            marginTop: 3,
            marginLeft: -10, // Move to left
        },
        colon: {
            fontSize: 10,
            color: '#000',
            textAlign: 'left',
            marginLeft: 18,
            fontWeight: 'bold',
            fontFamily: 'Calibri',
            marginTop: 3,
        },
        value: {
            width: '40%',
            textAlign: 'center',
            fontSize: 10,
            overflowWrap: 'break-word',
            marginTop: 3,
            marginLeft: 10, // Moved a little bit to the right
        },
        nameValue: {
            width: '40%',
            textAlign: 'center',
            fontSize: 10,
            overflowWrap: 'break-word',
            marginTop: 3,
            marginLeft: 10,
        },
        longName: {
            width: '40%',
            textAlign: 'center',
            fontSize: 10,
            whiteSpace: 'nowrap',
            marginTop: -2,
            marginLeft: 10,
        },
    });

    const logoUrl = formData.logo;
    const netAmount = Math.round(totalEarnings - totalDeductions);
    const netAmountInWords = numberToWords(netAmount);

    // Format values for display
    const formatValue = (value) => parseFloat(value).toFixed(2);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.companyInfo}>
                    {logoUrl && <Image src={logoUrl} style={styles.logo} />}
                </View>
                <View style={styles.companyName}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={styles.companyName}>{formData.companyName}</Text>
                    </View>
                </View>
                <View style={styles.companyInfo}>
                    <View style={styles.companyDetails}>
                        <Text style={styles.header}>{formData.companyAddress.substring(0, 95)}</Text>
                        <Text style={styles.header}>{formData.companyAddress.substring(95)}</Text>
                        <Text style={styles.subHeader}>Payslip For the month of {formData.formattedMonthYear}</Text>
                    </View>
                </View>


                <View style={styles.employeeSummary}>
                    {/* First Row */}
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Employee No</Text>
                            <Text style={styles.colon}>:</Text>
                            <Text style={styles.value}>{formData.employeeId}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.labels}>Employee Name</Text>
                            <Text style={styles.colon}>:</Text>
                            <Text style={formData.name.length > 20 ? styles.longName : styles.nameValue}>
                                {formData.name}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Department</Text>
                            <Text style={styles.colon}>:</Text>
                            <Text style={styles.value}>{getDepartmentName(formData.department)}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.labels}>Date Of Joining</Text>
                            <Text style={styles.colon}>:</Text>
                            <Text style={styles.value}>{formData.formattedJoiningDate}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Designation</Text>
                            <Text style={styles.colon}>:</Text>
                            <Text style={styles.value}>{getPositionName(formData.position)}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={{ ...styles.labels, marginTop: -5 }}>No. of Paid Days/Total Days</Text>
                            <Text style={styles.colon}>:</Text>
                            <Text style={styles.value}>{parseInt(formData.totalDays) - parseInt(formData.lop)}/{formData.totalDays}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Account Number</Text>
                            <Text style={styles.colon}>:</Text>
                            <Text style={styles.value}>{formData.bankAccount}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.labels}>LOP Days</Text>
                            <Text style={styles.colon}>:</Text>
                            <Text style={styles.value}>{formData.lop}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>PAN Number</Text>
                            <Text style={styles.colon}>:</Text>
                            <Text style={styles.value}>{formData.panNumber}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.labels}>EPF UAN Number</Text>
                            <Text style={styles.colon}>:</Text>
                            <Text style={styles.value}>{formData.epfUanNumber}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.tableContainer}>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={{ ...styles.tableHeaderCell, marginLeft: 80 }}>Earnings</Text>
                            <Text style={{ ...styles.tableHeaderCell, marginLeft: 90 }}>Deductions</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Basic Salary</Text>
                            <Text style={styles.tableCellAmount}>{Math.round(formatValue(formData.basicSalary))}</Text>
                            <Text style={styles.tableCells}>Provident Fund</Text>
                            <Text style={styles.tableCellAmounts}>{Math.round(formatValue(formData.providentFund))}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Housing Allowance</Text>
                            <Text style={styles.tableCellAmount}>{Math.round(formatValue(formData.hra))}</Text>
                            <Text style={styles.tableCells}>Professional Tax</Text>
                            <Text style={styles.tableCellAmounts}>{Math.round(formatValue(formData.professionalTax))}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Medical Reimbursement</Text>
                            <Text style={styles.tableCellAmount}>{Math.round(formatValue(formData.medicalAllowance))}</Text>
                            <Text style={styles.tableCells}>ESI</Text>
                            <Text style={styles.tableCellAmounts}>{Math.round(formatValue(formData.esi))}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Transport Allowances</Text>
                            <Text style={styles.tableCellAmount}>{Math.round(formatValue(formData.transportAllowance))}</Text>
                            <Text style={styles.tableCells}>TDS</Text>
                            <Text style={styles.tableCellAmounts}>{Math.round(formatValue(formData.tds))}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Special Allowances</Text>
                            <Text style={styles.tableCellAmount}>{Math.round(formatValue(formData.otherAllowances))}</Text>
                            <Text style={styles.tableCells}>Other Deductions</Text>
                            <Text style={styles.tableCellAmounts}>{Math.round(formatValue(formData.otherDeductions))}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.totalCell}>Total Earnings</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 4 }}>
                                <Text style={styles.toalCellAmount}>{Math.round(formatValue(totalEarnings))}</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 15, marginRight: 11 }}>
                                <Text style={styles.totalCell}>Total Deductions</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.toalCellAmount}>{Math.round(formatValue(totalDeductions))}</Text>
                            </View>
                        </View>



                        <View style={styles.verticalLine} />
                    </View>
                </View>

                <View style={styles.netPayContainer}>
                    <Text style={styles.netPayLabel}>Net Amount</Text>
                    <Text style={styles.netPayLabel}>:</Text>
                    <Text style={styles.netPayAmount}>{Math.round(formatValue(netAmount))}</Text>
                </View>
                <View style={styles.wordsContainer}>
                    <Text style={styles.wordsLabel}>Net Amount in words</Text>
                    <Text style={styles.wordsLabel}>:</Text>
                    <Text style={styles.wordsAmount}>({netAmountInWords} Only)</Text>
                </View>

                <Text style={styles.note}>
                    THIS IS A SYSTEM GENERATED PAY SLIP, DOES NOT REQUIRE ANY SIGNATURE AND/OR COMPANY SEAL
                </Text>
            </Page>
        </Document>
    );
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




function numberToWords(netAmount) {
    // Implement the conversion logic here
    return toWords(netAmount).toUpperCase(); // Ensure it returns a string
}