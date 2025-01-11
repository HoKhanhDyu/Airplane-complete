import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import axios from 'axios';
import { 
  MenuItem,
  Box,
  Typography,
  Divider,
  Button, 
  TextField, 
  Table, 
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
import {TitleTypography} from '../../../components/StyledComponents';

import { AccountCircle, Email, Phone, Cake, Badge, CalendarToday, Male, Female, Transgender } from "@mui/icons-material";
import { StyledBox, StyledTypography, StyledPaper } from '../../../components/StyledComponents';
import PassengerInfoDetailsModel from '../../../models/PassengerInfoDetailsModel';
import { Style } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
const ManagePassengerInfo = () => {
  const [passengers, setPassengers] = useState([]);
  const [filters, setFilters] = useState({
    FullName: '',
    PassengerID: '',
    FlightNumber: '',
    CCCD: ''
  });
  const [loading, setLoading] = useState(true);
  const [passengerDetails, setPassengerDetails] = useState(PassengerInfoDetailsModel);
  const [modalOpen, setModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const passengersPerPage = 10;

  // Fetch passengers from backend
  const fetchPassengers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/passengers');
      setPassengers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hành khách:', error);
      setLoading(false);
    }
  };

  // Filter passengers based on filters
  const filterPassengers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/passengers/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      // if (!response.ok) throw new Error(HTTP error! status: ${response.status});

      const data = await response.json();
      setPassengers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi lọc danh sách hành khách:', error);
    }
  };

  // Fetch passenger details
  const fetchPassengerDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/passengers/${id}`);
      if (response.data) {
        // console.log(response.data);
        setPassengerDetails({
          ...response.data.PassengerResult,
          Flights: response.data.FlightsResult
        });
        setModalOpen(true);
      } else {
        console.error('Không tìm thấy thông tin hành khách.');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết hành khách:', error);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setPassengerDetails(PassengerInfoDetailsModel); // Reset passenger details
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      FullName: '',
      PassengerID: '',
      FlightNumber: '',
      CCCD: ''
    });
  };

  // Pagination handling
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate current passengers for pagination
  const startIdx = (currentPage - 1) * passengersPerPage;
  const endIdx = startIdx + passengersPerPage;
  const currentPassengers = passengers.slice(startIdx, endIdx);

  // Update total pages
  useEffect(() => {
    setTotalPages(Math.ceil(passengers.length / passengersPerPage));
  }, [passengers]);

  // Fetch passengers initially
  useEffect(() => {
    fetchPassengers();
  }, []);

  const editPassenger = () => {
    alert("Edit passenger");
  }

  const deletePassenger = () => {
    alert("Delete passenger");
  }

  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target || {};
    const updatedValue = e instanceof Date ? e : value;
    const updatedName = e instanceof Date ? 'BirthDate' : name;

    setPassengerDetails((prevDetails) => ({
      ...prevDetails,
      [updatedName]: updatedValue,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/passengers/${passengerDetails.PassengerID}`,
        passengerDetails
      );
      if (response.status === 200) {
        alert('Update successfully!');
        setIsEditing(false);
        fetchPassengers(); // Làm mới danh sách hành khách
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin hành khách:', error);
    }
  };


  return (
    <div style={{ padding: '30px' }}>
            <TitleTypography
      >
        passenger information management
      </TitleTypography>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <TextField
          label="Passenger Name"
          name="FullName"
          value={filters.FullName}
          onChange={handleFilterChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Passenger ID"
          name="PassengerID"
          value={filters.PassengerID}
          onChange={handleFilterChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Flight Number"
          name="FlightNumber"
          value={filters.FlightNumber}
          onChange={handleFilterChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="CCCD"
          name="CCCD"
          value={filters.CCCD}
          onChange={handleFilterChange}
          variant="outlined"
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={filterPassengers}>
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
    border: '2px solid #000000',
    borderCollapse: 'separate',
    borderSpacing: '0',
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
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
      <TableCell
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        Passenger ID
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        Full Name
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
        CCCD
      </TableCell>
      <TableCell
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        View Details
      </TableCell>
      {/* <TableCell
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        Chỉnh sửa
      </TableCell> */}
    </TableRow>
  </TableHead>
  <TableBody>
    {currentPassengers.map((passenger) => (
      <TableRow
        key={passenger.PassengerID}
        sx={{
          '& td': {
            borderBottom: '2px solid rgb(12, 12, 12)',
          },
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        <TableCell align="center">{passenger.PassengerID}</TableCell>
        <TableCell align="center">{passenger.FullName}</TableCell>
        <TableCell align="center">{passenger.FlightNumber}</TableCell>
        <TableCell align="center">{passenger.CCCD}</TableCell>
        <TableCell align="center">
          <Button
            variant="outlined"
            onClick={() => fetchPassengerDetails(passenger.PassengerID)}
          >
            View Details
          </Button>
        </TableCell>
        {/* <TableCell align="center">
          <Button
            onClick={() => editPassenger(passenger.PassengerID)}
            sx={{
              border: 'none',
              color: '#1976d2',
            }}
          >
            ✎
          </Button>
          <Button
            onClick={() => deletePassenger(passenger.PassengerID)}
            sx={{
              border: 'none',
              color: '#d32f2f',
            }}
          >
            🗑️
          </Button>
        </TableCell> */}
      </TableRow>
    ))}
  </TableBody>
</Table>



      )}

{passengerDetails && (
          <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
          <DialogTitle variant="h4" sx={{ textAlign: 'center' }}>
            {isEditing ? 'Edit passenger information' : 'Passenger details'}
          </DialogTitle>
          <DialogContent>
            <StyledPaper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                Personal Infomation
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {isEditing ? (
                  <>
                    <TextField
                      label="Passenger Name"
                      name="FullName"
                      value={passengerDetails.FullName || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="CCCD"
                      name="CCCD"
                      value={passengerDetails.CCCD || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      name="Email"
                      value={passengerDetails.Email || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Phone Number"
                      name="Phone"
                      value={passengerDetails.Phone || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      select
                      label="Gender"
                      name="Gender"
                      value={passengerDetails.Gender || ''}
                      onChange={handleChange}
                      fullWidth
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </TextField>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date of Birth"
                        value={passengerDetails.BirthDate || null}
                        onChange={(date) => handleChange(date)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </>
                ) : (
                  <>
                    <StyledTypography>
                      <AccountCircle sx={{ marginRight: 1 }} /> {passengerDetails.FullName || 'N/A'}
                    </StyledTypography>
                    <StyledTypography>
                      <Badge sx={{ marginRight: 1 }} /> {passengerDetails.CCCD || 'N/A'}
                    </StyledTypography>
                    <StyledTypography>
                      <Email sx={{ marginRight: 1 }} /> {passengerDetails.Email || 'N/A'}
                    </StyledTypography>
                    <StyledTypography>
                      <Phone sx={{ marginRight: 1 }} /> {passengerDetails.Phone || 'N/A'}
                    </StyledTypography>
                    <StyledTypography>
                      {passengerDetails.Gender === 'Male' ? (
                        <Male sx={{ marginRight: 1 }} />
                      ) : passengerDetails.Gender === 'Female' ? (
                        <Female sx={{ marginRight: 1 }} />
                      ) : (
                        <Transgender sx={{ marginRight: 1 }} />
                      )}{' '}
                      {passengerDetails.Gender || 'N/A'}
                    </StyledTypography>
                    <StyledTypography>
                      <Cake sx={{ marginRight: 1 }} /> {passengerDetails.BirthDate ? new Date(passengerDetails.BirthDate).toLocaleDateString() : 'N/A'}
                    </StyledTypography>
                  </>
                )}
              </Box>
            </StyledPaper>
    
            <StyledPaper sx={{ padding: 2, marginTop: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Flights Taken
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 'bold',
                    }}>Passenger ID</TableCell>
                    <TableCell align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}>Flight Number</TableCell>
                    <TableCell align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}>Departure Airport</TableCell>
                    <TableCell align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}>Arrival Airport</TableCell>
                    <TableCell align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}>Booking Date</TableCell>
                    <TableCell align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}>Seat Class</TableCell>
                    <TableCell align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
        }}>Price(VNĐ)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {passengerDetails.Flights?.length > 0 ? (
                    passengerDetails.Flights.map((flight, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{flight.PassengerID}</TableCell>
                        <TableCell align="center">{flight.FlightNumber}</TableCell>
                        <TableCell align="center">{flight.DepartureAirport}</TableCell>
                        <TableCell align="center">{flight.ArrivalAirport}</TableCell>
                        <TableCell align="center">{flight.BookingDate ? new Date(flight.BookingDate).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell align="center">{flight.SeatClass}</TableCell>
                        <TableCell align="center">{flight.Price.toLocaleString('vi-VN')} VNĐ</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No flights booked
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <Divider sx={{ marginY: 2 }} />
    
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Total number of flights: {passengerDetails.Flights ? passengerDetails.Flights.length : 0}
                </Typography>
              </Box>
            </StyledPaper>
          </DialogContent>
          <DialogActions>
            {isEditing ? (
              <>
                <Button onClick={handleSave} color="primary" variant="contained">
                  Save
                </Button>
                <Button onClick={handleCancel} color="secondary" variant="outlined">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleEditToggle} color="primary" variant="contained">
                Edit
              </Button>
            )}
            <Button onClick={handleCloseModal} color="secondary">
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

export default ManagePassengerInfo;
