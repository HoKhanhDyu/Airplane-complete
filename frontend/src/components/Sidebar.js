import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import BadgeIcon from '@mui/icons-material/Badge';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const CustomListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: '#2d5167',
  color: 'white',
  '&:hover': {
    backgroundColor: 'white',
    color: '#004d40',
  },
  display: 'flex',
  alignItems: 'center',
  width: '270px',
  borderRadius: '8px',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const Sidebar = ({ open, toggleSidebar }) => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const userType = parseInt(localStorage.getItem('userType')) || 0; // Get from localStorage, default to 0

  const toggleAccountDropdown = () => {
    setAccountDropdownOpen(!accountDropdownOpen);
  };

  const handleLogout = () => {
    alert("Logout");
    console.log('Logged out');
  };

  return (
    <Drawer
      sx={{
        width: '240x',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 300,
          maxHeight: '100vh',
          background: '#2d5167',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarColor: 'rgba(255, 255, 255, 0.8) rgba(0, 0, 0, 0)',
          scrollbarWidth: 'thin',
          position: 'relative',
          zIndex: 10,  
        },
      }}
      variant="temporary"
      anchor="left"
      open={open}
      onClose={toggleSidebar}
    >
      <Divider />
      <List>
        {userType === 0 && (
          <>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
              <Typography variant="h5">Admin Management</Typography>
            </Box>
            <Typography>System Management</Typography>
            <CustomListItem button component={Link} to='/manage-plane'>
              <ListItemIcon><AirplanemodeActiveIcon /></ListItemIcon>
              <ListItemText primary="Planes Management" />
            </CustomListItem>
            <CustomListItem button component={Link} to='/manage-flight'>
              <ListItemIcon><FlightLandIcon /></ListItemIcon>
              <ListItemText primary="Flights Management" />
            </CustomListItem>
            <CustomListItem button component={Link} to='/manage-airlines'>
              <ListItemIcon><CorporateFareIcon /></ListItemIcon>
              <ListItemText primary="Airlines Management" />
            </CustomListItem>
            <CustomListItem button component={Link} to='/manage-airports'>
              <ListItemIcon><LocationOnIcon /></ListItemIcon>
              <ListItemText primary="Airports Management" />
            </CustomListItem>
            <CustomListItem button component={Link} to='/manage-tickets'>
              <ListItemIcon><ConfirmationNumberIcon /></ListItemIcon>
              <ListItemText primary="Tickets Management" />
            </CustomListItem>
            <CustomListItem button component={Link} to='/manage-invoices'>
              <ListItemIcon><ReceiptIcon /></ListItemIcon>
              <ListItemText primary="Invoices Management" />
            </CustomListItem>
            <CustomListItem button component={Link} to='/manage-passengers'>
              <ListItemIcon><BadgeIcon /></ListItemIcon>
              <ListItemText primary="Passengers Management" />
            </CustomListItem>
            <CustomListItem button component={Link} to='/manage-revenue'>
              <ListItemIcon><MonetizationOnIcon /></ListItemIcon>
              <ListItemText primary="Revenue Management" />
            </CustomListItem>
            <CustomListItem button onClick={toggleAccountDropdown}>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Users Account Management" />
              {accountDropdownOpen ? <ExpandLess /> : <ExpandMore />}
            </CustomListItem>
            <Collapse in={accountDropdownOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <CustomListItem button component={Link} to='/manage-staff' sx={{ pl: 8 }}>
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText primary="Staffs" />
                </CustomListItem>
                <CustomListItem button component={Link} to='/manage-customers' sx={{ pl: 8 }}>
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText primary="Customers" />
                </CustomListItem>
              </List>
            </Collapse>
          </>
        )}
        {userType === 1 && (
          <>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
              <Typography variant="h5">Staff Management</Typography>
            </Box>
            <Typography>System Management</Typography>
            <CustomListItem button component={Link} to='/manage-tickets'>
              <ListItemIcon><ConfirmationNumberIcon /></ListItemIcon>
              <ListItemText primary=" Tickets Management" />
            </CustomListItem>
            <CustomListItem button component={Link} to='/manage-invoices'>
              <ListItemIcon><ReceiptIcon /></ListItemIcon>
              <ListItemText primary="Invoices Management" />
            </CustomListItem>
            <CustomListItem button component={Link} to='/manage-passengers'>
              <ListItemIcon><BadgeIcon /></ListItemIcon>
              <ListItemText primary="Passengers Management" />
            </CustomListItem>
            <CustomListItem>
              <ListItemIcon><MonetizationOnIcon /></ListItemIcon>
              <ListItemText primary="Revenue Management" />
            </CustomListItem>
          </>
        )}
        {userType === 2 && <Typography>No access to the sidebar.</Typography>}
      </List>
      <Divider />
      {(userType === 0 || userType === 1) && (
        <List>
          <Typography>Account Management</Typography>
          <CustomListItem button component={Link} to='/personal-info'>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="Personal Info" />
          </CustomListItem>
          <CustomListItem onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </CustomListItem>
        </List>
      )}
    </Drawer>
  );
};

export default Sidebar;
