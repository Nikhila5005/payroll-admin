'use client'
import React, { useState } from 'react';
import { Button, Typography, TextField, Grid, Paper, Select, MenuItem, Input, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, FormLabel } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import * as XLSX from 'xlsx'; // Import xlsx for handling Excel files
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BulkPayslip = () => {
  const [employeeIds, setEmployeeIds] = useState('');
  const [template, setTemplate] = useState('');
  const [fileError, setFileError] = useState('');
  const [excelData, setExcelData] = useState([]); // State to store Excel data
  const [showData, setShowData] = useState(false); // State to toggle data visibility
  const [fileName, setFileName] = useState(''); // State to store the file name

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [excelData[0]],
      body: excelData.slice(1),
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 20 },
    });
    doc.save('excelData.pdf');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setExcelData(data); // Set the Excel data
      };
      reader.onerror = () => setFileError('Failed to read the file');
      reader.readAsBinaryString(file);
    }
  };

  const showExcelData = () => {
    setShowData(true);
  };

  const hideExcelData = () => {
    setShowData(false);
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Bulk Payslip Generation
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Select
            label="Template"
            value={template}
            onChange={e => setTemplate(e.target.value)}
            fullWidth
          >
            <MenuItem value="template1">Template 1</MenuItem>
            <MenuItem value="template2">Template 2</MenuItem>
            <MenuItem value="template3">Template 3</MenuItem>
            <MenuItem value="template4">Template 4</MenuItem>
            <MenuItem value="template5">Template 5</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Employee IDs (comma separated)"
            value={employeeIds}
            onChange={e => setEmployeeIds(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel>Upload Excel File</FormLabel>
            <Grid container direction="row" alignItems="center">
              <input
                accept=".xlsx, .xls"
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <IconButton color="primary" component="span">
                  <AttachFileIcon />
                </IconButton>
              </label>
              {fileName && <Typography variant="body2" style={{ marginLeft: '10px' }}>{fileName}</Typography>}
            </Grid>
          </FormControl>
          {fileError && <Typography color="error">{fileError}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={() => setShowData(!showData)}>
                {showData ? 'Hide Data' : 'View Data'}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleDownload}>
                Download
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {showData && excelData.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Uploaded Excel Data:
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {excelData[0].map((header, index) => (
                      <TableCell key={index}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {excelData.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default BulkPayslip;