import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PersonalInfo from './pages/Admin/Staff/PersonalInfo';
import ManagePassengerInfo from './pages/Admin/Staff/ManagePassengerInfo';
import ManageBills from './pages/Admin/Staff/ManageBills';
import MA_Staff from './pages/Admin/MA_Staff';
import MA_Customer from './pages/Admin/MA_Customer';
import QLSB from './pages/Admin/QLSB';
import QLHB from './pages/Admin/QLHB';
import QLCB from './pages/Admin/QLCB';
import ManagePlane from './pages/Admin/ManagePlane';
import ManageBillet from './pages/Admin/ManageBillet.js';
import ManageRevenue from './pages/Admin/ManageRevenue.js';
import Print from './components/Admin/revenue/Print.js';

// --------------------------------------------
import CustomerHomepage from './pages/Client/homepage';
import LoginPage from './pages/Client/login';
import SignupPage from './pages/Client/signup';
import ForgotPasswordPage from './pages/Client/forgotPassword';
import SearchTicket from './pages/Client/searchTicket';
import SelectFlight from './pages/Client/selectFlight';
import SelectTicketType from './pages/Client/ticketType';
import BookSeat from './pages/Client/bookSeat';
import CustomerInformation from './pages/Client/customerInformation';
import ShowTicket from './pages/Client/showTicket';
import CustomerAccount from './pages/Client/customerAccount';
import HomePageWithoutLogin from './pages/Homepage';


const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/" element={<HomePageWithoutLogin />} />
      <Route path="/customer/homepage" element={<CustomerHomepage />} />
      <Route path="/login" element={<LoginPage />} />     
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />     
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/search-ticket" element={<SearchTicket />} />
      <Route path="/select-flight" element={<SelectFlight />} />
      <Route path="/select-type" element={<SelectTicketType />} />
      <Route path="/book-seat" element={<BookSeat />} />
      <Route path="/customer-account" element={<CustomerAccount />} />
      <Route path="/show-ticket" element={<ShowTicket />} />
      <Route path="/customer-information" element={<CustomerInformation />} />



      {/* Other Routes */}
      <Route path="/personal-info" element={<PersonalInfo />} />
      <Route path="/manage-passengers" element={<ManagePassengerInfo />} />
      <Route path="/manage-invoices" element={<ManageBills />} />
      <Route path="/manage-staff" element={<MA_Staff />} />
      <Route path="/manage-customers" element={<MA_Customer />} />

      <Route path="/manage-airports" element={<QLSB />} />
      <Route path="/manage-airlines" element={<QLHB />} />
      <Route path="/manage-flight" element={<QLCB />} />

      <Route path="/manage-plane" element={<ManagePlane />} />      
      <Route path="/manage-tickets" element={<ManageBillet />} />
      <Route path="/manage-revenue" element={<ManageRevenue />} />
      <Route path="/amin/revenue/print" element={<Print />} />

    </Routes>
  );
};

export default AppRoutes;
