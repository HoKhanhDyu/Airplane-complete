// src/App.js
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import isLogin from "./utils/checkLoginStatus";
import { createContext } from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import PersonalInfo from './pages/PersonalInfo';
// import ManagePassengerInfo from './pages/ManagePassengerInfo';
// import ManageBills from './pages/ManageBills';
// import MA_Customer from './pages/MA_Customer';
// import MA_Staff from './pages/MA_Staff';
import AppRoutes from "./routes";

import { BrowserRouter } from "react-router-dom";
import WaitingOverlay from "./components/WaitingOverlay/WaitingOverlay";
export const AppContext = createContext();

const App = () => {
  const [userType, setUserType] = useState(0); // State lưu userType
  const [isUserLogin, setIsUserLogin] = useState(false); // State lưu trạng thái đăng nhập
  const [onLoading, setOnLoading] = useState(false); // State quản lý hiển thị loading
  useEffect(() => {
    // Lưu giá trị userType vào localStorage
    localStorage.setItem("userType", userType);

    setIsUserLogin(isLogin()); // Kiểm tra trạng thái đăng nhập
  }, []); // Chỉ chạy 1 lần khi component mount

  useEffect(() => {
    console.log("isUserLogin", isUserLogin);
  }, [isUserLogin]);
  return (
    <BrowserRouter>
      <AppContext.Provider
        value={{ isUserLogin, setIsUserLogin, setOnLoading }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header />
          <div style={{ flexGrow: 1 }}>
            {onLoading && <WaitingOverlay />}
            <AppRoutes />
          </div>
          <div className="mt-4">
            {/* <Footer /> */}
          </div>
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
};

export default App;
