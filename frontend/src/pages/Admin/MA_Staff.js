import React, { useEffect, useState } from 'react';
import { 
  Table, TableHead, TableRow, TableCell, TableBody, 
  Button, TextField, IconButton, Dialog, DialogActions, 
  DialogContent, DialogTitle, Typography 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';
import {TitleTypography} from '../../components/StyledComponents';
import userServices from '../../services/userServices';
import { tr } from 'date-fns/locale';
import { use } from 'react';

const MA_Staff = () => {
  const [staffs, setStaffs] = useState([]);
  const [filter, setFilter] = useState({ name: '', email: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '' });
  const rowsPerPage = 10; // Số dòng trên mỗi trang

  
    const fetchStaffs = async () => {
      try {
        const response = await userServices.getAllStaff();
        const data = response;
        setStaffs(data);
      } catch (error) {
        console.error('Error fetching staffs:', error);
      }
    };
    useEffect(() => {
      fetchStaffs();
  }, []);

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
      try {
      await userServices.deleteUserByAdmin(staffId);
      console.log(`Delete staff ID: ${staffId}`);
      fetchStaffs();
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleBlockStaff = (staffId) => {
    if (window.confirm('Bạn có chắc chắn muốn ngưng hoạt động nhân viên này không?')) {
      console.log(`Block staff ID: ${staffId}`);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const resetFilter = () => {
    setFilter({ name: '', email: '' });
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewStaff({ name: '', email: '', password: '' });
  };

  const handleNewStaffChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const handleAddStaff = async () => {
    console.log('Adding new staff:', newStaff);
    const data = {
      full_name: newStaff.name,
      email: newStaff.email,
      password: newStaff.password,
      role: 'STAFF',
    };
    try {
    const response = await userServices.createUserByAdmin(data);
    console.log('response', response);
    // Thực hiện gọi API thêm nhân viên
    await fetchStaffs();
    // setStaffs([...staffs, { ...newStaff, StaffID: Date.now() }]); // Thêm vào danh sách tạm thời
    handleCloseDialog();
    } catch (error) {
      console.error('Error adding new staff:', error);
    }
    
  };

  useEffect(() => {
    console.log('staff:', staffs);
  }, [staffs]);
  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      staff.email.toLowerCase().includes(filter.email.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStaffs.length / rowsPerPage);

  const paginatedStaffs = filteredStaffs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div style={{ padding: '16px', margin: '0 auto', maxWidth: '1200px' }}>
            <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '20px 0',
          padding: '20px',
          color: '#ffffff',
          background: 'linear-gradient(to right,rgb(84, 136, 178),rgb(27, 79, 122))', color: 'rgb(219, 223, 227)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          fontSize: '2rem', // Tăng kích thước chữ
          position: 'relative',
          overflow: 'hidden',
          '&:after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
            opacity: 0.7,
            zIndex: 1,
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '10px',
            background: 'linear-gradient(to right,rgb(84, 136, 178),rgb(27, 79, 122))', color: 'rgb(219, 223, 227)',
            filter: 'blur(5px)',
            zIndex: 0,
          },
          zIndex: 2,
        }}
      >
        Staff account management
      </Typography>
      <div style={{ marginBottom: '16px' }}>
        <TextField
          label="Staff Name"
          variant="outlined"
          size="small"
          name="name"
          value={filter.name}
          onChange={handleFilterChange}
          style={{ marginRight: '8px' }}
        />
        <TextField
          label="Staff Email"
          variant="outlined"
          size="small"
          name="email"
          value={filter.email}
          onChange={handleFilterChange}
          style={{ marginRight: '8px' }}
        />
        <Button variant="outlined" onClick={resetFilter} style={{ marginRight: '8px' }}>
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Staff
        </Button>
      </div>

      <Table
        sx={{
          border: '2px solid #000000',
          borderRadius: '10px',
          overflow: 'hidden',
          width: '100%',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          borderCollapse: 'separate',
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: '#1976d2',
              '& th': {
                borderBottom: '3px solid #000000',
              },
            }}
          >
            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Full Name
            </TableCell>
            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Email
            </TableCell>
            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedStaffs.map((staff) => (
            <TableRow
              key={staff.StaffID}
              sx={{
                '& td': { borderBottom: '2px solid rgb(16, 16, 16)' },
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              <TableCell align="center">{staff.name}</TableCell>
              <TableCell align="center">{staff.email}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleDeleteStaff(staff.StaffID)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleBlockStaff(staff.StaffID)}>
                  <BlockIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <Button
          variant="outlined"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{ marginRight: '8px' }}
        >
          Previous Page
        </Button>
        <Typography variant="body1" style={{ lineHeight: '36px' }}>
          Page {currentPage} / {totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{ marginLeft: '8px' }}
        >
          Next Page
        </Button>
      </div>

      {/* Dialog thêm nhân viên */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Thêm nhân viên</DialogTitle>
        <DialogContent>
          <TextField
            label="Staff Name"
            variant="outlined"
            fullWidth
            margin="dense"
            name="name"
            value={newStaff.name}
            onChange={handleNewStaffChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="dense"
            name="email"
            value={newStaff.email}
            onChange={handleNewStaffChange}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="dense"
            type="password"
            name="password"
            value={newStaff.password}
            onChange={handleNewStaffChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddStaff} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MA_Staff;
