'use client'
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SectionTitleTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const Payslip = () => {
  // Employee basic details state
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [dateofjoining, setdateofjoining] = useState('');
  const [pancard, setPancard] = useState('');
  const [numofdayspaiddays, setnumofdayspaiddays] = useState('');
  const [lopdays, setlopdays] = useState('');
  const [epfuannumber, setepfuannumber] = useState('');

  // Earnings and deductions state
  const [basicSalary, setBasicSalary] = useState('');
  const [hra, setHra] = useState('');
  const [conveyanceAllowance, setConveyanceAllowance] = useState('');
  const [specialAllowance, setSpecialAllowance] = useState('');
  const [medicalReimbursement, setMedicalReimbursement] = useState('');
  const [pf, setPf] = useState('');
  const [professionalTax, setProfessionalTax] = useState('');
  const [incomeTax, setIncomeTax] = useState('');

  // Base64 encoded PNG image (simple example logo)
  const defaultLogo = "https://i.ibb.co/sKvjM0K/logo-png-1.png";
  function handleGeneratePDF() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
  
    // Center the logo
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(defaultLogo, 'png', logoX, 10, logoWidth, logoHeight);
  
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('MANTHA TECH SOLUTIONS PVT LTD', pageWidth / 2, 50, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.text('Phonix tech Tower, 1st floor, Plot No: 14/46 , Survey No.1(part)', pageWidth / 2, 57, { align: 'center' });
    doc.text('IDA Uppal, Opp Genpact Office, Ranga Reddy Dist, Hyderbad 500032', pageWidth / 2, 64, { align: 'center' });
  
    doc.setFont(undefined, 'bold');
    doc.text('Payslip Month of July - 2024', pageWidth / 2, 75, { align: 'center' });
  
    // Employee details table
    const employeeDetails = [
      ['Employee Name', employeeName, 'Pan Card Num', pancard],
      ['Employee ID', employeeId, 'Bank Account No', bankAccount],
      ['Designation', designation, 'No. of paid / Total days', numofdayspaiddays],
      ['Department', department, 'Lop Days', lopdays],
      ['Date of joining', dateofjoining, 'EPF UAN Number', epfuannumber]
    ];
  
    doc.autoTable({
      startY: 85,
      head: [['Detail', 'Value', 'Detail', 'Value']],
      body: employeeDetails,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 40 }, 2: { cellWidth: 40 }, 3: { cellWidth: 40 } },
      margin: { left: (pageWidth - 160) / 2 }
    });
  
    // Earnings and Deductions table
    const earningsDeductions = [
      ['Earnings', 'Amount', 'Deductions', 'Amount'],
      ['Basic Salary', basicSalary, 'PF', pf],
      ['House Rent Allowance', hra, 'Professional Tax', professionalTax],
      ['Conveyance Allowance', conveyanceAllowance, 'Income Tax', incomeTax],
      ['Special Allowance', specialAllowance, '', ''],
      ['Medical Reimbursement', medicalReimbursement, '', ''],
      [{ content: 'Total Earnings', styles: { fontStyle: 'bold' } }, 
       { content: calculateTotalEarnings(), styles: { fontStyle: 'bold' } }, 
       { content: 'Total Deductions', styles: { fontStyle: 'bold' } }, 
       { content: calculateTotalDeductions(), styles: { fontStyle: 'bold' } }],
    ];
  
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
      body: earningsDeductions,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 40 }, 2: { cellWidth: 40 }, 3: { cellWidth: 40 } },
      margin: { left: (pageWidth - 160) / 2 },
      didParseCell: function (data) {
        if (data.row.index === 6) {
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });
  
    // Net Pay
    const netPay = calculateTotalEarnings() - calculateTotalDeductions();
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`Net Pay: ${netPay}`, pageWidth / 2, doc.lastAutoTable.finalY + 10, { align: 'center' });
  
    // Net Pay in words
    doc.setFont(undefined, 'normal');
    
  
    // Add note about computer generation
    doc.setFontSize(8);
    doc.text("This is a computer-generated payslip. No signature is required.", pageWidth / 2, pageHeight - 10, { align: 'center' });
  
    doc.save('payslip.pdf');
  }

  function calculateTotalEarnings() {
    return Number(basicSalary) + Number(hra) + Number(conveyanceAllowance) + Number(specialAllowance) + Number(medicalReimbursement);
  }

  function calculateTotalDeductions() {
    return Number(pf) + Number(professionalTax) + Number(incomeTax);
  }

  return (
    <Box p={3}>
      <StyledPaper elevation={3}>
        <TitleTypography variant="h5" gutterBottom>
          Payslip Generator For Mantha Tech Solutions
        </TitleTypography>
        
        {/* Employee Basic Details Form */}
        <SectionTitleTypography variant="h6" gutterBottom>
          Employee Basic Details
        </SectionTitleTypography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Employee Name"
              fullWidth
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Employee ID"
              fullWidth
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Designation"
              fullWidth
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Department"
              fullWidth
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Bank Account"
              fullWidth
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Joining"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateofjoining}
              onChange={(e) => setdateofjoining(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="PAN Card"
              fullWidth
              value={pancard}
              onChange={(e) => setPancard(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="No. of Paid Days"
              fullWidth
              type="number"
              value={numofdayspaiddays}
              onChange={(e) => setnumofdayspaiddays(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="LOP Days"
              fullWidth
              type="number"
              value={lopdays}
              onChange={(e) => setlopdays(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="EPF UAN Number"
              fullWidth
              value={epfuannumber}
              onChange={(e) => setepfuannumber(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Earnings and Deductions Form */}
        <SectionTitleTypography variant="h6" gutterBottom>
          Earnings and Deductions
        </SectionTitleTypography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Basic Salary"
              fullWidth
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="HRA"
              fullWidth
              type="number"
              value={hra}
              onChange={(e) => setHra(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Conveyance Allowance"
              fullWidth
              type="number"
              value={conveyanceAllowance}
              onChange={(e) => setConveyanceAllowance(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Special Allowance"
              fullWidth
              type="number"
              value={specialAllowance}
              onChange={(e) => setSpecialAllowance(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Medical Reimbursement"
              fullWidth
              type="number"
              value={medicalReimbursement}
              onChange={(e) => setMedicalReimbursement(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="PF"
              fullWidth
              type="number"
              value={pf}
              onChange={(e) => setPf(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Professional Tax"
              fullWidth
              type="number"
              value={professionalTax}
              onChange={(e) => setProfessionalTax(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Income Tax"
              fullWidth
              type="number"
              value={incomeTax}
              onChange={(e) => setIncomeTax(e.target.value)}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <StyledButton variant="contained" color="primary" onClick={handleGeneratePDF}>
            Download Payslip as PDF
          </StyledButton>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default Payslip;