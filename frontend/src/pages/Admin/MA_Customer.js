import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { Typography } from '@mui/material';
import {TitleTypography} from '../../components/StyledComponents';

const MA_Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState({ name: '', email: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Số dòng trên mỗi trang

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers'); // API endpoint
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) {
      console.log(`Delete customer ID: ${customerId}`);
    }
  };

  const handleBlockCustomer = (customerId) => {
    if (window.confirm('Bạn có chắc chắn muốn ngưng hoạt động khách hàng này không?')) {
      console.log(`Block customer ID: ${customerId}`);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const resetFilter = () => {
    setFilter({ name: '', email: '' });
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.FullName.toLowerCase().includes(filter.name.toLowerCase()) &&
      customer.Email.toLowerCase().includes(filter.email.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

  const paginatedCustomers = filteredCustomers.slice(
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
      <TitleTypography
      >
        customer account management
      </TitleTypography>

      <div style={{ marginBottom: '16px' }}>
        <TextField
          label="Customer Name"
          variant="outlined"
          size="small"
          name="name"
          value={filter.name}
          onChange={handleFilterChange}
          style={{ marginRight: '8px' }}
        />
        <TextField
          label="Customer Email"
          variant="outlined"
          size="small"
          name="email"
          value={filter.email}
          onChange={handleFilterChange}
          style={{ marginRight: '8px' }}
        />
        <Button variant="outlined" onClick={resetFilter}>Reset</Button>
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
          {paginatedCustomers.map((customer) => (
            <TableRow
              key={customer.CustomerID}
              sx={{
                '& td': { borderBottom: '2px solid rgb(16, 16, 16)' },
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              <TableCell align="center">{customer.FullName}</TableCell>
              <TableCell align="center">{customer.Email}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleDeleteCustomer(customer.CustomerID)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleBlockCustomer(customer.CustomerID)}>
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
    </div>
  );
};

export default MA_Customer;
