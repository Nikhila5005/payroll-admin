// 'use client';
// import React, { useState } from 'react';
// import {
//   List, ListItem, ListItemText, Typography, Paper, Card, CardContent, Grid, Box, Avatar, Button, TextField, IconButton,
//   Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Checkbox, FormControlLabel, Snackbar, Alert
// } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { deepPurple, lightBlue } from '@mui/material/colors';
// import { Add, Remove, Edit, Clear as ClearIcon } from '@mui/icons-material';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: deepPurple[500],
//     },
//     secondary: {
//       main: lightBlue[500],
//     },
//   },
//   typography: {
//     h5: {
//       fontWeight: 'bold',
//     },
//     h6: {
//       fontWeight: 'bold',
//     },
//   },
// });

// const EmployeeList = () => {
//   const [employees, setEmployees] = useState([
//     {
//       employeeId: 1,
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'john.doe@example.com',
//       phone: '123-456-7890',
//       hireDate: '2020-01-15',
//       status: 'active',
//       job: 'Software Engineer',
//       employeeType: 'FULL_TIME',
//       country: 'USA',
//       department: 'Engineering',
//       currentSalary: '100000',
//       benefits: ['Health Insurance', '401k'],
//       allowances: [],
//       deductions: [],
//       createdAt: '2020-01-01T00:00:00',
//       updatedAt: '2020-01-01T00:00:00',
//     },
//     {
//       employeeId: 2,
//       firstName: 'Jane',
//       lastName: 'Smith',
//       email: 'jane.smith@example.com',
//       phone: '987-654-3210',
//       hireDate: '2019-03-22',
//       status: 'active',
//       job: 'Product Manager',
//       employeeType: 'FULL_TIME',
//       country: 'Canada',
//       department: 'Product',
//       currentSalary: '120000',
//       benefits: ['Health Insurance', 'Stock Options'],
//       allowances: [],
//       deductions: [],
//       createdAt: '2019-03-01T00:00:00',
//       updatedAt: '2019-03-01T00:00:00',
//     },
//     {
//       employeeId: 3,
//       firstName: 'Alice',
//       lastName: 'Johnson',
//       email: 'alice.johnson@example.com',
//       phone: '555-123-4567',
//       hireDate: '2018-07-11',
//       status: 'active',
//       job: 'Designer',
//       employeeType: 'PART_TIME',
//       country: 'UK',
//       department: 'Design',
//       currentSalary: '80000',
//       benefits: ['Health Insurance'],
//       allowances: [],
//       deductions: [],
//       createdAt: '2018-07-01T00:00:00',
//       updatedAt: '2018-07-01T00:00:00',
//     },
//     {
//       employeeId: 4,
//       firstName: 'Bob',
//       lastName: 'Brown',
//       email: 'bob.brown@example.com',
//       phone: '555-987-6543',
//       hireDate: '2021-05-19',
//       status: 'active',
//       job: 'QA Engineer',
//       employeeType: 'FULL_TIME',
//       country: 'Australia',
//       department: 'Quality Assurance',
//       currentSalary: '90000',
//       benefits: ['Health Insurance', '401k'],
//       allowances: [],
//       deductions: [],
//       createdAt: '2021-05-01T00:00:00',
//       updatedAt: '2021-05-01T00:00:00',
//     },
//     {
//       employeeId: 5,
//       firstName: 'Charlie',
//       lastName: 'Davis',
//       email: 'charlie.davis@example.com',
//       phone: '555-456-7890',
//       hireDate: '2017-09-23',
//       status: 'active',
//       job: 'DevOps Engineer',
//       employeeType: 'FULL_TIME',
//       country: 'Germany',
//       department: 'DevOps',
//       currentSalary: '95000',
//       benefits: ['Health Insurance', '401k'],
//       allowances: [],
//       deductions: [],
//       createdAt: '2017-09-01T00:00:00',
//       updatedAt: '2017-09-01T00:00:00',
//     },
//     {
//       employeeId: 6,
//       firstName: 'Diana',
//       lastName: 'Miller',
//       email: 'diana.miller@example.com',
//       phone: '555-654-3210',
//       hireDate: '2016-11-30',
//       status: 'active',
//       job: 'HR Manager',
//       employeeType: 'FULL_TIME',
//       country: 'France',
//       department: 'Human Resources',
//       currentSalary: '85000',
//       benefits: ['Health Insurance', '401k'],
//       allowances: [],
//       deductions: [],
//       createdAt: '2016-11-01T00:00:00',
//       updatedAt: '2016-11-01T00:00:00',
//     },
//     {
//       employeeId: 7,
//       firstName: 'Eve',
//       lastName: 'Wilson',
//       email: 'eve.wilson@example.com',
//       phone: '555-321-6540',
//       hireDate: '2015-04-15',
//       status: 'active',
//       job: 'Marketing Manager',
//       employeeType: 'FULL_TIME',
//       country: 'Italy',
//       department: 'Marketing',
//       currentSalary: '90000',
//       benefits: ['Health Insurance', '401k'],
//       allowances: [],
//       deductions: [],
//       createdAt: '2015-04-01T00:00:00',
//       updatedAt: '2015-04-01T00:00:00',
//     },
//     {
//       employeeId: 8,
//       firstName: 'Frank',
//       lastName: 'Moore',
//       email: 'frank.moore@example.com',
//       phone: '555-789-0123',
//       hireDate: '2022-02-10',
//       status: 'active',
//       job: 'Sales Manager',
//       employeeType: 'FULL_TIME',
//       country: 'Spain',
//       department: 'Sales',
//       currentSalary: '95000',
//       benefits: ['Health Insurance', '401k'],
//       allowances: [],
//       deductions: [],
//       createdAt: '2022-02-01T00:00:00',
//       updatedAt: '2022-02-01T00:00:00',
//     },
//     {
//       employeeId: 9,
//       firstName: 'Grace',
//       lastName: 'Taylor',
//       email: 'grace.taylor@example.com',
//       phone: '555-012-3456',
//       hireDate: '2020-08-25',
//       status: 'active',
//       job: 'Data Scientist',
//       employeeType: 'FULL_TIME',
//       country: 'Netherlands',
//       department: 'Data Science',
//       currentSalary: '110000',
//       benefits: ['Health Insurance', '401k'],
//       allowances: [],
//       deductions: [],
//       createdAt: '2020-08-01T00:00:00',
//       updatedAt: '2020-08-01T00:00:00',
//     },
//     {
//       employeeId: 10,
//       firstName: 'Hank',
//       lastName: 'Anderson',
//       email: 'hank.anderson@example.com',
//       phone: '555-234-5678',
//       hireDate: '2019-12-05',
//       status: 'active',
//       job: 'Backend Developer',
//       employeeType: 'FULL_TIME',
//       country: 'Sweden',
//       department: 'Engineering',
//       currentSalary: '105000',
//       benefits: ['Health Insurance', '401k'],
//       allowances: [],
//       deductions: [],
//       createdAt: '2019-12-01T00:00:00',
//       updatedAt: '2019-12-01T00:00:00',
//     },
//   ]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editFormData, setEditFormData] = useState({});
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [currentAllowance, setCurrentAllowance] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   const handleEmployeeClick = (employee) => {
//     setSelectedEmployee(employee);
//     setIsEditing(false);
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//     setEditFormData(selectedEmployee);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData({
//       ...editFormData,
//       [name]: value,
//     });
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     setEmployees((prevEmployees) =>
//       prevEmployees.map((emp) =>
//         emp.employeeId === editFormData.employeeId ? editFormData : emp
//       )
//     );
//     setSelectedEmployee(editFormData);
//     setIsEditing(false);
//   };

//   const handleAddAllowance = () => {
//     const newAllowance = { id: Date.now(), name: 'New Allowance', amount: 0, description: '', Taxable: false, Mandatory: false };
//     setEditFormData({
//       ...editFormData,
//       allowances: [...editFormData.allowances, newAllowance],
//     });
//   };

//   const handleEditAllowance = (allowance) => {
//     setCurrentAllowance(allowance);
//     setEditDialogOpen(true);
//   };

//   const handleSaveEdit = () => {
//     setEditFormData({
//       ...editFormData,
//       allowances: editFormData.allowances.map(allowance =>
//         allowance.id === currentAllowance.id ? currentAllowance : allowance
//       ),
//     });
//     setEditDialogOpen(false);
//   };

//   const handleDeleteAllowance = (id) => {
//     setEditFormData({
//       ...editFormData,
//       allowances: editFormData.allowances.filter(allowance => allowance.id !== id),
//     });
//   };

//   const handleAddDeduction = () => {
//     const newDeduction = { id: Date.now(), name: 'New Deduction', amount: 0, description: '', Taxable: false, Mandatory: false };
//     setEditFormData({
//       ...editFormData,
//       deductions: [...editFormData.deductions, newDeduction],
//     });
//   };

//   const handleEditDeduction = (deduction) => {
//     setCurrentAllowance(deduction);
//     setEditDialogOpen(true);
//   };

//   const handleSaveEditDeduction = () => {
//     setEditFormData({
//       ...editFormData,
//       deductions: editFormData.deductions.map(deduction =>
//         deduction.id === currentAllowance.id ? currentAllowance : deduction
//       ),
//     });
//     setEditDialogOpen(false);
//   };

//   const handleDeleteDeduction = (id) => {
//     setEditFormData({
//       ...editFormData,
//       deductions: editFormData.deductions.filter(deduction => deduction.id !== id),
//     });
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Paper style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
//         <Typography variant="h5" gutterBottom color="primary">
//           Employee List
//         </Typography>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//             <List>
//               {employees.map((employee) => (
//                 <ListItem
//                   button
//                   key={employee.employeeId}
//                   onClick={() => handleEmployeeClick(employee)}
//                   style={{
//                     backgroundColor: selectedEmployee?.employeeId === employee.employeeId ? lightBlue[100] : 'white',
//                     borderRadius: '8px',
//                     marginBottom: '10px',
//                     boxShadow: selectedEmployee?.employeeId === employee.employeeId ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
//                   }}
//                 >
//                   <Avatar style={{ marginRight: '10px', backgroundColor: deepPurple[500] }}>
//                     {employee.firstName[0]}{employee.lastName[0]}
//                   </Avatar>
//                   <ListItemText
//                     primary={`${employee.firstName} ${employee.lastName}`}
//                     secondary={employee.email}
//                     primaryTypographyProps={{
//                       style: {
//                         fontWeight: selectedEmployee?.employeeId === employee.employeeId ? 'bold' : 'normal',
//                         color: selectedEmployee?.employeeId === employee.employeeId ? deepPurple[500] : 'inherit',
//                       },
//                     }}
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             {selectedEmployee && (
//               <Card style={{ backgroundColor: lightBlue[50] }}>
//                 <CardContent>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                       <Typography variant="h6" color="secondary">Employee Profile</Typography>
//                     </Grid>
//                     {isEditing ? (
//                       <form onSubmit={handleFormSubmit}>
//                         <Grid container spacing={2}>
//                           <Grid item xs={12}>
//                             <Button variant="contained" color="primary" type="submit">
//                               Save
//                             </Button>
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="First Name"
//                               name="firstName"
//                               value={editFormData.firstName}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="Last Name"
//                               name="lastName"
//                               value={editFormData.lastName}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="Email"
//                               name="email"
//                               value={editFormData.email}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="Phone"
//                               name="phone"
//                               value={editFormData.phone}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="Hire Date"
//                               name="hireDate"
//                               value={editFormData.hireDate}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="Status"
//                               name="status"
//                               value={editFormData.status}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="Job"
//                               name="job"
//                               value={editFormData.job}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="Employee Type"
//                               name="employeeType"
//                               value={editFormData.employeeType}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="Country"
//                               name="country"
//                               value={editFormData.country}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="Department"
//                               name="department"
//                               value={editFormData.department}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={6}>
//                             <TextField
//                               label="Current Salary"
//                               name="currentSalary"
//                               value={editFormData.currentSalary}
//                               onChange={handleInputChange}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={12}>
//                             <TextField
//                               label="Benefits"
//                               name="benefits"
//                               value={editFormData.benefits.join(', ')}
//                               onChange={(e) => handleInputChange({ target: { name: 'benefits', value: e.target.value.split(', ') } })}
//                               fullWidth
//                             />
//                           </Grid>
//                           <Grid item xs={12}>
//                             <Typography variant="h6">Allowances</Typography>
//                             {editFormData.allowances.map((allowance, index) => (
//                               <Grid container spacing={1} key={index}>
//                                 <Grid item xs={10}>
//                                   <TextField
//                                     label={`Allowance ${index + 1}`}
//                                     value={allowance.name}
//                                     onChange={(e) => handleEditAllowance({ ...allowance, name: e.target.value })}
//                                     fullWidth
//                                   />
//                                 </Grid>
//                                 <Grid item xs={2}>
//                                   <IconButton onClick={() => handleDeleteAllowance(allowance.id)}>
//                                     <ClearIcon />
//                                   </IconButton>
//                                 </Grid>
//                               </Grid>
//                             ))}
//                             <Button variant="outlined" color="primary" onClick={handleAddAllowance} startIcon={<Add />}>
//                               Add Allowance
//                             </Button>
//                           </Grid>
//                           <Grid item xs={12}>
//                             <Typography variant="h6">Deductions</Typography>
//                             {editFormData.deductions.map((deduction, index) => (
//                               <Grid container spacing={1} key={index}>
//                                 <Grid item xs={10}>
//                                   <TextField
//                                     label={`Deduction ${index + 1}`}
//                                     value={deduction.name}
//                                     onChange={(e) => handleEditDeduction({ ...deduction, name: e.target.value })}
//                                     fullWidth
//                                   />
//                                 </Grid>
//                                 <Grid item xs={2}>
//                                   <IconButton onClick={() => handleDeleteDeduction(deduction.id)}>
//                                     <ClearIcon />
//                                   </IconButton>
//                                 </Grid>
//                               </Grid>
//                             ))}
//                             <Button variant="outlined" color="primary" onClick={handleAddDeduction} startIcon={<Add />}>
//                               Add Deduction
//                             </Button>
//                           </Grid>
//                         </Grid>
//                       </form>
//                     ) : (
//                       <>
//                         <Grid item xs={12}>
//                           <Button variant="contained" color="primary" onClick={handleEditClick}>
//                             Edit
//                           </Button>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Email:</strong> {selectedEmployee.email}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Phone:</strong> {selectedEmployee.phone}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Hire Date:</strong> {selectedEmployee.hireDate}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Status:</strong> {selectedEmployee.status}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Job:</strong> {selectedEmployee.job}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Employee Type:</strong> {selectedEmployee.employeeType}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Country:</strong> {selectedEmployee.country}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Department:</strong> {selectedEmployee.department}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Current Salary:</strong> {selectedEmployee.currentSalary}</Typography>
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Typography><strong>Benefits:</strong> {selectedEmployee.benefits.join(', ')}</Typography>
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Typography variant="h6">Allowances</Typography>
//                           {selectedEmployee.allowances.map((allowance, index) => (
//                             <Typography key={index}>{allowance.name}</Typography>
//                           ))}
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Typography variant="h6">Deductions</Typography>
//                           {selectedEmployee.deductions.map((deduction, index) => (
//                             <Typography key={index}>{deduction.name}</Typography>
//                           ))}
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Created At:</strong> {selectedEmployee.createdAt}</Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography><strong>Updated At:</strong> {selectedEmployee.updatedAt}</Typography>
//                         </Grid>
//                       </>
//                     )}
//                   </Grid>
//                 </CardContent>
//               </Card>
//             )}
//           </Grid>
//         </Grid>
//       </Paper>

//       <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
//         <DialogTitle>Edit Allowance/Deduction</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Edit the details of the allowance or deduction.
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Name"
//             type="text"
//             fullWidth
//             value={currentAllowance?.name || ''}
//             onChange={(e) => setCurrentAllowance({ ...currentAllowance, name: e.target.value })}
//           />
//           <TextField
//             margin="dense"
//             label="Amount"
//             type="number"
//             fullWidth
//             value={currentAllowance?.amount || ''}
//             onChange={(e) => setCurrentAllowance({ ...currentAllowance, amount: parseFloat(e.target.value) })}
//           />
//           <TextField
//             margin="dense"
//             label="Description"
//             type="text"
//             fullWidth
//             value={currentAllowance?.description || ''}
//             onChange={(e) => setCurrentAllowance({ ...currentAllowance, description: e.target.value })}
//           />
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={currentAllowance?.Taxable || false}
//                 onChange={(e) => setCurrentAllowance({ ...currentAllowance, Taxable: e.target.checked })}
//               />
//             }
//             label="Taxable"
//           />
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={currentAllowance?.Mandatory || false}
//                 onChange={(e) => setCurrentAllowance({ ...currentAllowance, Mandatory: e.target.checked })}
//               />
//             }
//             label="Mandatory"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#34495E' }}>
//             Cancel
//           </Button>
//           <Button onClick={handleSaveEdit} sx={{ color: '#34495E' }}>
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//           Submitted successfully!
//         </Alert>
//       </Snackbar>
//     </ThemeProvider>
//   );
// };

// export default EmployeeList;

 