import React, {useState, useEffect} from 'react';
import { Avatar,Button, Box, Typography, Paper, Divider, TextField } from '@mui/material';
import { AccountCircle, Email, Phone, LocationOn, WorkOutline, Cake, Badge, BusinessCenter, FlightTakeoff, MonetizationOn, CheckCircle, CalendarToday, Male, Female, Transgender } from "@mui/icons-material";
import {Select, MenuItem} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { StyledBox, StyledTypography, StyledPaper } from '../../../components/StyledComponents';
import EmployeeInfoModel from '../../../models/EmployeeInfoModel';
import userServices from '../../../services/userServices';
import { id } from 'date-fns/locale';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";

//Bổ sung ràng buộc nhập dữ liệu số sau nếu còn thời gian



const EmployeeInfo = () => {
  
  const [employee, setEmployee] = useState(EmployeeInfoModel);
  

  const [isEditing, setIsEditing] = useState(false);
  const [tempInfo, setTempInfo] = useState(employee);

  const handleEdit = () => {
    setTempInfo(employee);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateEmployeeData();
    setEmployee(tempInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempInfo(employee);
    setIsEditing(false);



  
  }

  const fetchEmployeeData = async () => {
    try {
      const data = await userServices.getUserInfo();
  
      // Kiểm tra dữ liệu có phải là một mảng và có ít nhất một đối tượng
      const employee = data;
  
      if (!employee || typeof employee !== 'object') {
        throw new Error('Invalid data format received from server');
      }
  
      // Cập nhật state với dữ liệu nhận được từ API
      setEmployee({
        name: employee.name || 'N/A',
        id: employee.id || 'N/A',
        email: employee.email || 'N/A',
        phone: employee.phone || 'N/A',
        startDate: employee.startDate || 'N/A',
        status: employee.status || 'N/A',
        gender: employee.gender || 'N/A',
        birthDate: employee.birthDate || '',
        address: employee.address || 'N/A',
        position: employee.position || 'N/A',
        idNumber: employee.idNumber || 'N/A',
        department: employee.department || 'N/A',
        flightsHandled: employee.flightsHandled || 0,
        revenueGenerated: employee.revenueGenerated || '0',
      });
    } catch (error) {
      console.error('Error fetching employee data:', error);
      alert('Có lỗi xảy ra khi lấy dữ liệu nhân viên. Vui lòng thử lại!');
    }
  };
  
  useEffect(() => {
    fetchEmployeeData();
  }, []);


  const updateEmployeeData = async () => {
    try {

        const data = JSON.stringify({
          id : tempInfo.id,
          name: tempInfo.name,
          email: tempInfo.email,
          phone: tempInfo.phone,
          startDate: tempInfo.startDate,
          status: tempInfo.status,
          gender: tempInfo.gender,
          birthDate: tempInfo.birthDate || "",
          address: tempInfo.address,
          position: tempInfo.position,
          idNumber: tempInfo.idNumber,
          department: tempInfo.department,
          flightsHandled: tempInfo.flightsHandled,
          revenueGenerated: tempInfo.revenueGenerated,
        })
        console.log("Data: ", data);
        const response = await userServices.updateUserInfo(employee.id, data);
        alert('Employee data updated successfully!');
      
    } catch (error) {
      console.error('Error updating employee data:', error);
      alert('Error updating employee data. Please try again later.');
    }
  };
  

  return (
    <Box sx={{ padding: 3}}>
      {/* Paper 1: Thông tin chung */}
      <StyledPaper>
      <Typography variant="h6" gutterBottom sx={{fontWeight:'bold'}}>
        General information
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />

        <Box sx={{ display: 'flex', gap:2 }}>
          
          <Box sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Avatar
              alt={employee.name}
              src="https://via.placeholder.com/150"
              sx={{ width: 200, height: 200, borderRadius: '10px'}}
              variant="square"
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {employee.name}
            </Typography>

            <StyledTypography>
              <strong>EID:</strong> {employee.id}
            </StyledTypography>
          </Box>

          {/* Thông tin cơ bản */}
          <Box >

            <StyledBox>
              <WorkOutline sx={{ marginRight: 1 }} />
              <StyledTypography>{employee.position}</StyledTypography>
            </StyledBox>
            
            <StyledBox>
              <Email sx={{ marginRight: 1 }} />
              {!isEditing ?
                (<StyledTypography>{employee.email}</StyledTypography>):
                (
                <Box sx={{display: 'flex', flexDirection: "column", alignItem: 'center'}}>
                  <StyledTypography>Email: </StyledTypography>   
                  <TextField
                    size="small"
                    value={tempInfo.email}
                    onChange={(e) =>
                    setTempInfo({ ...tempInfo, email: e.target.value })
                    }
                    sx={{width: '300px'}} />
                </Box>
                
                )
              }
              
            </StyledBox>

            <StyledBox>
              <Phone sx={{ marginRight: 1 }} />
              {!isEditing ?
                (<StyledTypography>{employee.phone}</StyledTypography>):
                (
                <Box sx={{display: 'flex', flexDirection: "column", alignItem: 'center'}}>
                  <StyledTypography>Phone: </StyledTypography>   
                  <TextField
                    size="small"
                    value={tempInfo.phone}
                    onChange={(e) =>
                    setTempInfo({ ...tempInfo, phone: e.target.value })
                    } sx={{width: '300px'}}/>
                </Box>
                
                )
              }
            </StyledBox>

            <StyledBox>
              <CalendarToday sx={{ marginRight: 1 }} />
              <StyledTypography>
                {employee.startDate ? new Date(employee.startDate).toLocaleDateString() : "N/A"}
              </StyledTypography>
            </StyledBox>

            <StyledBox>
              <CheckCircle sx={{ marginRight: 1 }} />
              <StyledTypography>{employee.status}</StyledTypography>
            </StyledBox>
          </Box>
        </Box>
      </StyledPaper>

      {/* Paper 2: Thông tin chi tiết */}
      <StyledPaper  >
        <Typography variant="h6" gutterBottom sx={{fontWeight:'bold'}}>
          Information Details
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>

          <StyledBox>
            {
              employee.gender === 'Male' ? (
                <Male sx={{ marginRight: 1 }} />
              ) : employee.gender === 'Female' ? (
                <Female sx={{ marginRight: 1 }} />
              ) : (
                <Transgender sx={{ marginRight: 1 }} />
              )
            }

            {!isEditing ?
                (<StyledTypography>{employee.gender}</StyledTypography>):
                (
                <Box sx={{display: 'flex', flexDirection: "column", alignItem: 'center'}}>
                  <StyledTypography>Gender: </StyledTypography>   
                  <Select
                    size="small"
                    value={tempInfo.gender}
                    onChange={(e) =>
                      setTempInfo({ ...tempInfo, gender: e.target.value })
                    }
                    sx={{ width: '300px' }}
                  >
                    {/* Các lựa chọn trong dropdown */}
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </Box>
                
                )
              }
          </StyledBox>

          <StyledBox>
            <Cake sx={{ marginRight: 1 }} />
            {!isEditing ? (
              <StyledTypography>
                {employee.birthDate ? new Date(employee.birthDate).toLocaleDateString() : "N/A"}
              </StyledTypography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: "column" }}>
                <StyledTypography>Date of Birth: </StyledTypography>   
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ width: 300 }}>
                    <DatePicker
                      views={['day', 'month', 'year']}
                      value={tempInfo.birthDate}
                      onChange={(newValue) => {console.log("Birth Date: ", newValue);setTempInfo({ ...tempInfo, birthDate: newValue })}}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
            )}
          </StyledBox>

          <StyledBox>
            <LocationOn sx={{ marginRight: 1 }} />
            {!isEditing ?
                (<StyledTypography>{employee.address}</StyledTypography>):
                (
                <Box sx={{display: 'flex', flexDirection: "column", alignItem: 'center'}}>
                  <StyledTypography>Address: </StyledTypography>   
                  <TextField
                    size="small"
                    value={tempInfo.address}
                    onChange={(e) =>
                    setTempInfo({ ...tempInfo, address: e.target.value })
                    } sx={{width: '300px'}}/>
                </Box>
                
                )
              }
          </StyledBox>

          <StyledBox>
            <Badge sx={{ marginRight: 1 }} />
            {!isEditing ?
                (<StyledTypography>{employee.idNumber}</StyledTypography>):
                (
                <Box sx={{display: 'flex', flexDirection: "column", alignItem: 'center'}}>
                  <StyledTypography>ID Number: </StyledTypography>   
                  <TextField
                    size="small"
                    value={tempInfo.idNumber}
                    onChange={(e) =>
                    setTempInfo({ ...tempInfo, idNumber: e.target.value })
                    }sx={{width: '300px'}} />
                </Box>
                
                )
              }
          </StyledBox>

          <StyledBox>
            <BusinessCenter sx={{ marginRight: 1 }} />
            <StyledTypography>{employee.department}</StyledTypography>
          </StyledBox>

          <StyledBox>
            <FlightTakeoff sx={{ marginRight: 1 }} />
            <StyledTypography>{employee.flightsHandled}</StyledTypography>
          </StyledBox>

          <StyledBox>
            <MonetizationOn sx={{ marginRight: 1 }} />
            <StyledTypography>{employee.revenueGenerated}</StyledTypography>
          </StyledBox>
        </Box>
      </StyledPaper>

      <Box sx ={{textAlign:'center', display: 'flex', justifyContent: 'flex-end', marginTop: '10px', alignItems: 'center'}}>
        {!isEditing? (
          <Button variant = 'contained' color = 'primary' onClick = {handleEdit}>Edit</Button>):
          (
            <Box sx={{display: 'flex', gap: 2, justifyContent: 'center'}}>
              <Button variant = 'outlined' color = 'secondary' onClick = {handleCancel}>Cancel</Button>
              <Button variant = 'contained' color = 'primary' onClick = {handleSave}>Save</Button>
            </Box>
          )
        }
      </Box>
    </Box>
  );
};

export default EmployeeInfo;
