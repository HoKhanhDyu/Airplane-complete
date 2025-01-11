import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Paper,
  Tooltip,
  IconButton,
  Box,
  Typography,
  Divider,
  Button, 
  TextField, 
  Table, 
  TableContainer,
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {TitleTypography} from '../../../components/StyledComponents';

// import { AccountCircle, Email, Phone, Cake, Badge, CalendarToday, Male, Female, Transgender } from "@mui/icons-material";
// import { StyledBox, StyledTypography, StyledPaper } from '../components/StyledComponents';
import InvoiceDetailsModels from '../../../models/InvoiceDetailsModel';
import { Style } from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import invoiceService from '../../../services/invoiceService';

import formatCurrencyVN from '../../../utils/formatCurrency';


const ManageInvoiceInfo = () => {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({


    FlightNumber: null,
    InvoiceID: null,
    InvoiceDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [invoiceDetails, setInvoiceDetails] = useState(InvoiceDetailsModels);
  const [modalOpen, setModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const invoicesPerPage = 10;

  // Fetch passengers from backend
  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getInvices();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hóa đơn:', error);
      setLoading(false);
    }
  };

  // Filter passengers based on filters
  const filterInvoices = async () => {
    try {
      const filterInv = JSON.stringify(filters);
      const data = await invoiceService.filterInvoices(filterInv);
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi lọc danh sách hóa đơn:', error);
    }
  };

  // Fetch passenger details
  const fetchInvoiceDetails = async (id) => {
    setModalOpen(true);
    try {
      const data = await invoiceService.getInvoiceById(id);
      console.log("Data: ", data);
      if (data) {
        // console.log(response.data);
        setInvoiceDetails(data);
        
      } else {
        console.error('Không tìm thấy thông tin hóa đơn.');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết hóa đơn:', error);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setInvoiceDetails(InvoiceDetailsModels); // Reset passenger details
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      FlightNumber: '',
      InvoiceID: '',
      InvoiceDate: null,
    });
  };

  // Pagination handling
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate current passengers for pagination
  const startIdx = (currentPage - 1) * invoicesPerPage;
  const endIdx = startIdx + invoicesPerPage;
  const currentInvoices = invoices.slice(startIdx, endIdx);

  // Update total pages
  useEffect(() => {
    setTotalPages(Math.ceil(invoices.length / invoicesPerPage));
  }, [invoices]);

  // Fetch passengers initially
  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
            <TitleTypography
      >
        invoice management
      </TitleTypography>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>


        <TextField
          label="Invoice ID"
          name="InvoiceID"
          value={filters.InvoiceID}
          onChange={handleFilterChange}
          variant="outlined"
        />

        <TextField
          label="Flight Number"
          name="FlightNumber"
          value={filters.FlightNumber}
          onChange={handleFilterChange}
          variant="outlined"
        />

<LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 300 }}>
        <Tooltip title="Invoice creation date" arrow sx={{marginLeft: '10px'}}>
          <IconButton>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        <DatePicker
          views={['day', 'month', 'year']}
          value={filters.InvoiceDate}
          onChange={(newValue) => {
            console.log("Date: ", newValue); 
            setFilters({ ...filters, InvoiceDate: newValue })
          }}
          renderInput={(params) => <TextField {...params} />}
        />

      </Box>
    </LocalizationProvider>

        <Button variant="contained" color="primary" onClick={filterInvoices}>
          Filter
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table
  sx={{
    border: '2px solid #000000', // Viền đen đậm cho toàn bộ bảng
    borderRadius: '10px', // Bo tròn cạnh bảng
    overflow: 'hidden',
    width: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Hiệu ứng bóng
    borderCollapse: 'separate',
  }}
>
  <TableHead>
    <TableRow
      sx={{
        backgroundColor: '#1976d2',
        '& th': {
          borderBottom: '3px solid #000000', // Đường kẻ đậm dưới tiêu đề
        },
      }}
    >
      <TableCell
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        Invoice ID
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        Flight Number
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        Number of tickets
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        Total amount (VNĐ)
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        Invoice creation date
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        See Details
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {currentInvoices.map((invoice) => (
      <TableRow
        key={invoice.InvoiceID}
        sx={{
          '& td': {
            borderBottom: '2px solid rgb(16, 16, 16)',
          },
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        <TableCell align="center">{invoice.InvoiceID}</TableCell>
        <TableCell align="center">{invoice.FlightNumber}</TableCell>
        <TableCell align="center">{invoice.TicketCount}</TableCell>
        <TableCell align="center">{formatCurrencyVN(invoice.TotalAmount || 0)} VNĐ</TableCell>
        <TableCell align="center">{invoice.InvoiceDate ? new Date(invoice.InvoiceDate).toLocaleDateString() : 'N/A'}</TableCell>
        <TableCell align="center">
          <Button
            variant="outlined"
            onClick={() => fetchInvoiceDetails(invoice.InvoiceID)}
          >
            View invoice details
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

      )}

{invoiceDetails && (
  <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
  <DialogTitle
    variant="h4"
    sx={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', color: 'primary.main' }}
  >
    Invoice Details
  </DialogTitle>
  <Divider sx={{ borderBottom: '2px solid', mb: 2 }} />

  <DialogContent>
    <Paper elevation={3} sx={{ padding: 4, mb: 2 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 1 }}>
          Airplane
        </Typography>
        <Typography variant="body1" align="center">
          Tax Code: <strong>123456789</strong>
        </Typography>
        <Typography variant="body1" align="center">
          Phone Number: <strong>(123) 456-7890</strong>
        </Typography>
        <Typography variant="body1" align="center">
          Hotline: <strong>1800-123-456</strong>
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Flight Number: <span style={{ color: 'primary.main' }}>{invoiceDetails.FlightNumber}</span>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Airline: {invoiceDetails.Airline}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Airplane Type: {invoiceDetails.Model}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Departures: <strong>{invoiceDetails.Departure}</strong> &rarr; Destination: <strong>{invoiceDetails.Arrival}</strong>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Estimated takeoff time: <strong>{new Date(invoiceDetails.DepartureTime).toLocaleString()}</strong> (UTC+7.00)
        </Typography>
        <Typography variant="body1" gutterBottom>
          Estimated landing time: <strong>{new Date(invoiceDetails.ArrivalTime).toLocaleString()}</strong> (UTC+7.00)
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Ticket ID</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Quantity</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Seat Class</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Price (VNĐ)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceDetails.InvoiceDetails?.length > 0 ? (
              invoiceDetails.InvoiceDetails.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{invoice.TicketID}</TableCell>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="center">{invoice.SeatClass}</TableCell>
                  <TableCell align="center">{formatCurrencyVN(invoice.TicketPrice || 0)} VNĐ</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: 'gray.500' }}>
                  No flights booked
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 3 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Total quantity: {invoiceDetails.TotalCount}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
          Total amount: {formatCurrencyVN(invoiceDetails.TicketAmount || 0)} VNĐ
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="body1" gutterBottom>
          {/* Invoice ID: <strong>{invoiceDetails.InvoiceID}</strong> */}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Invoice Creation Date: <strong>{new Date(invoiceDetails.DepartureTime).toLocaleString()}</strong> (UTC+7.00)
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mt={2}>
        <Typography variant="body2" color="text.secondary">
          Thank you for using our service!        
        </Typography>
      </Box>
    </Paper>
  </DialogContent>

  <Divider sx={{ borderBottom: '2px solid', mb: 2 }} />

  <DialogActions>
    <Button onClick={handleCloseModal} variant="contained" color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>



      )}

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          disabled={currentPage <= 1} 
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous Page
        </Button>
        <div>
          Page {currentPage} / {totalPages}
        </div>
        <Button 
          variant="outlined" 
          disabled={currentPage >= totalPages} 
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};

export default ManageInvoiceInfo;
